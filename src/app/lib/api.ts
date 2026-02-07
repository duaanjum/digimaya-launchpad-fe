// ============================================================================
// Types
// ============================================================================

export interface ApiResponse<T> {
  responseCode: number;
  responseMessage: string;
  data: T;
}

// Some endpoints (wallet-nonce, wallet-signin) use "code"/"message" instead
export interface ApiResponseAlt<T> {
  code: number;
  message: string;
  data: T;
}

// --- Auth types ---

export interface NonceData {
  message: string;
  nonce: string;
  expiresAt: string;
}

export interface UserData {
  _id: string;
  Email?: string;
  UserName?: string;
  Name?: string;
  WalletAddress: string;
  IsEmailVerified?: boolean;
  IsKycVerified?: boolean;
  TokenBalance?: number;
  token: string;
  authMethod: string;
  isNewUser?: boolean;
}

export interface SignInRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface RegisterRequest {
  walletAddress: string;
  signature: string;
  email?: string;
  userName?: string;
}

export interface LinkWalletRequest {
  walletAddress: string;
  signature: string;
}

// --- KYC Rewards ---

export interface KYCRewardStatus {
  kycStatus: 'COMPLETED' | 'PENDING';
  rewardStatus: 'LOCKED' | 'UNLOCKED' | 'CLAIMED' | 'EXPIRED';
  rewardAmount: number;
  expiresAt: string | null;
  claimedAt: string | null;
  txHash: string | null;
  canClaim: boolean;
}

export interface KYCClaimResult {
  rewardAmount: number;
  txHash: string;
  walletAddress: string;
}

// --- Liquidity Rewards ---

export interface LiquidityRewardStatus {
  status: 'UNCLAIMED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  eligiblePurchaseTotal: number;
  rewardAmountUSD: number;
  rewardAmountEMYA: number;
  txHash: string | null;
  walletAddress: string | null;
  canClaim: boolean;
}

export interface LiquidityClaimResult {
  _id: string;
  userId: string;
  eligiblePurchaseTotal: number;
  rewardAmountUSD: number;
  rewardAmountEMYA: number;
  emyaPriceAtClaim: number;
  walletAddress: string;
  status: string;
}

// --- Voting ---

export interface VotingOption {
  id: string;
  exchangeName: string;
  logoUrl: string;
  voteCount: number;
  percentage: string;
  isConfirmed: boolean;
  isSelected: boolean;
}

export interface VotingOptionsData {
  options: VotingOption[];
  totalVotes: number;
  userVotesCount: number;
  requiredVotes: number;
  hasCompletedVoting: boolean;
  canVote: boolean;
}

export interface VoteStatusData {
  votesUsed: number;
  votesRemaining: number;
  requiredVotes: number;
  hasCompletedVoting: boolean;
  canVote: boolean;
  votedOptions: {
    optionId: string;
    exchangeName: string;
    logoUrl?: string;
    votedAt: string;
  }[];
}

export interface CastVoteResult {
  votedExchanges: {
    id: string;
    exchangeName: string;
    newVoteCount: number;
    percentage: string;
  }[];
  totalVotes: number;
  message: string;
}

// ============================================================================
// API Client errors
// ============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class RegistrationRequiredError extends ApiError {
  public walletAddress: string;
  constructor(walletAddress: string) {
    super('No account found. Registration required.', 404);
    this.name = 'RegistrationRequiredError';
    this.walletAddress = walletAddress;
  }
}

// ============================================================================
// Token storage
// ============================================================================

const TOKEN_KEY = 'digimaaya_auth_token';
const USER_KEY = 'digimaaya_user';

export const storage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: (): UserData | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user: UserData) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ============================================================================
// Core fetch wrapper
// ============================================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://develop.api.emaaya.digimaaya.com/api';

let onAuthErrorCallback: (() => void) | null = null;

export function setOnAuthError(cb: () => void) {
  onAuthErrorCallback = cb;
}

async function request<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options ?? {};
  const token = storage.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 globally
  if (response.status === 401) {
    storage.clear();
    onAuthErrorCallback?.();
    throw new ApiError('Session expired. Please sign in again.', 401);
  }

  const json = await response.json();

  if (!response.ok) {
    // Determine message from either response format
    const msg = json.responseMessage || json.message || 'Request failed';
    throw new ApiError(msg, response.status, json.data);
  }

  // Return the data field if it exists, otherwise the whole response
  return (json.data !== undefined ? json.data : json) as T;
}

// ============================================================================
// Auth endpoints
// ============================================================================

export const authApi = {
  /** Get a nonce message for wallet signing */
  getNonce: (walletAddress: string): Promise<NonceData> =>
    request<NonceData>(`/user/wallet-nonce?walletAddress=${encodeURIComponent(walletAddress)}`, {
      method: 'GET',
      skipAuth: true,
    }),

  /** Sign in with wallet signature. Throws RegistrationRequiredError if no account. */
  signIn: async (data: SignInRequest): Promise<UserData> => {
    try {
      return await request<UserData>('/user/wallet-signin', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        throw new RegistrationRequiredError(data.walletAddress);
      }
      throw err;
    }
  },

  /** Register a new account with wallet */
  register: (data: RegisterRequest): Promise<UserData> =>
    request<UserData>('/auth/wallet/register', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  /** Link a wallet to the current account (requires JWT) */
  linkWallet: (data: LinkWalletRequest): Promise<{ walletAddress: string; linkedAt: string }> =>
    request('/auth/wallet/link', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Unlink wallet from the current account (requires JWT) */
  unlinkWallet: (): Promise<{ unlinkedAddress: string }> =>
    request('/auth/wallet/unlink', { method: 'POST' }),
};

// ============================================================================
// KYC Rewards endpoints
// ============================================================================

export const rewardsApi = {
  /** Get KYC reward status */
  getKYCReward: (): Promise<KYCRewardStatus> =>
    request<KYCRewardStatus>('/rewards/kyc'),

  /** Claim the 66 EMYA KYC reward */
  claimKYCReward: (): Promise<KYCClaimResult> =>
    request<KYCClaimResult>('/rewards/kyc/claim', { method: 'POST' }),

  /** Get liquidity reward status */
  getLiquidityReward: (): Promise<LiquidityRewardStatus> =>
    request<LiquidityRewardStatus>('/rewards/liquidity'),

  /** Submit liquidity reward claim */
  claimLiquidityReward: (walletAddress: string): Promise<LiquidityClaimResult> =>
    request<LiquidityClaimResult>('/rewards/liquidity/claim', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    }),
};

// ============================================================================
// Voting endpoints
// ============================================================================

export const votingApi = {
  /** Get all active voting options with percentages */
  getOptions: (): Promise<VotingOptionsData> =>
    request<VotingOptionsData>('/voting/options'),

  /** Get current user's vote status */
  getStatus: (): Promise<VoteStatusData> =>
    request<VoteStatusData>('/voting/status'),

  /** Cast votes for exactly 2 exchanges */
  castVote: (optionIds: [string, string]): Promise<CastVoteResult> =>
    request<CastVoteResult>('/voting/cast', {
      method: 'POST',
      body: JSON.stringify({ optionIds }),
    }),
};
