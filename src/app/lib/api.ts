// ============================================================================
// Types
// ============================================================================

export interface ApiResponse<T> {
  responseCode: number;
  responseMessage: string;
  data: T;
}

// Wallet-auth: POST /api/v1/wallet-auth/nonce with body { walletAddress }; no GET /user/wallet-nonce.
// Some endpoints (wallet-nonce, wallet-signin) use "code"/"message" instead
export interface ApiResponseAlt<T> {
  code: number;
  message: string;
  data: T;
}

// --- Auth types (aligned with NestJS backend) ---

export interface NonceData {
  message: string;
  nonce: string;
  expiresAt: string;
  walletAddress?: string;
}

/** Backend auth response: { accessToken, refreshToken, user } */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email?: string;
    role?: string;
    kyc_status?: string;
    walletAddress: string;
  };
}

/** App user shape (mapped from backend auth response) */
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
  refreshToken?: string;
  authMethod: string;
  isNewUser?: boolean;
}

export interface SignInRequest {
  walletAddress: string;
  signature: string;
  /** The exact message the user signed (required for backend to verify). */
  message: string;
  /** Optional nonce; some backends use this to look up the stored message. */
  nonce?: string;
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

/** GET /api/v1/users/profile response. Auth = Bearer. No password. Use displayName = name ?? userName ?? user_name; about = bio ?? details. */
export interface UserProfileResponse {
  _id?: string;
  id?: string;
  email?: string;
  role?: string;
  kyc_status?: string;
  userName?: string;
  user_name?: string;
  name?: string;
  walletAddress?: string;
  wallet_address?: string;
  profileImage?: string;
  profile_image?: string;
  avatarUrl?: string;
  avatar_url?: string;
  bio?: string;
  details?: string;
  wallets?: unknown[];
  kyc_profiles?: unknown[];
  kycStatus?: string;
  isEmailVerified?: boolean;
  is_email_verified?: boolean;
  isKycVerified?: boolean;
  is_kyc_verified?: boolean;
  dateOfBirth?: string;
  date_of_birth?: string;
  country?: string;
  documentType?: string;
  document_type?: string;
  tokenBalance?: number;
  token_balance?: number;
  createdAt?: string;
  created_at?: string;
}

/** PATCH /api/v1/users/profile. Auth = Bearer. Name fields max 100 chars, bio/details max 500. */
export interface UpdateProfileRequest {
  name?: string;
  userName?: string;
  user_name?: string;
  displayName?: string;
  display_name?: string;
  bio?: string;
  details?: string;
  profileImage?: string;
  profile_image?: string;
}

// --- Portfolio ---

/** GET /api/v1/portfolio response item. One per contribution/allocation. */
export interface PortfolioItem {
  contributionId: string;
  saleId: string;
  roundId: string;
  projectId: string | null;
  projectName: string;
  projectLogoUrl: string;
  tokenSymbol: string;
  roundNumber: number;
  roundType: string;
  contributedAmount: number;
  contributionStatus: string;
  allocationAmount: number;
  tokenAmount: number;
  tokenPrice: number;
  createdAt: string;
}

// --- Wallets ---

/** GET /api/v1/wallets wallet record */
export interface WalletRecord {
  id: string;
  user_id: string;
  address: string;
  chain: string;
  is_primary: boolean;
  kyc_bound: boolean;
  created_at: string;
  updated_at: string;
}

/** POST /api/v1/wallets request body */
export interface NewWalletRequest {
  address: string;
  chain: string;
  is_primary?: boolean;
}

// --- Vesting (Auth = Bearer) ---

/** GET /api/v1/vesting/claimable/sale/:saleId response */
export interface VestingClaimableResponse {
  total_allocation: number;
  total_claimed: number;
  claimable_now: number;
  next_unlock_date: string | null;
  vesting_complete: boolean;
}

/** GET /api/v1/vesting/claims/sale/:saleId response (history) */
export interface VestingClaimItem {
  id?: string;
  amount?: number;
  claimed_at?: string;
  [key: string]: unknown;
}

// --- Projects (dashboard: Live / Upcoming / Past) ---

export type ProjectStatus = 'LIVE' | 'UPCOMING' | 'CLOSED';

export interface ProjectRound {
  start_time: string;
  end_time?: string;
}

export interface ProjectSale {
  token_price: number;
  total_raise_target?: number;
  rounds?: ProjectRound[];
}

/** GET /api/v1/projects?status=LIVE|UPCOMING|CLOSED and GET /api/v1/projects/:id response item */
export interface ApiProject {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  token_symbol?: string;
  sales?: ProjectSale[];
  category?: string;
}

// --- KYC Rewards, Liquidity Rewards, Voting (hidden for now) ---
// Types and endpoints commented out until these sections are re-enabled.
// See git history for KYCRewardStatus, KYCClaimResult, LiquidityRewardStatus,
// LiquidityClaimResult, VotingOption, VotingOptionsData, VoteStatusData, CastVoteResult
// and rewardsApi, votingApi.

// ============================================================================
// API Client errors
// ============================================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class RegistrationRequiredError extends ApiError {
  public walletAddress: string;
  constructor(walletAddress: string) {
    super(404, 'No account found. Registration required.');
    this.walletAddress = walletAddress;
  }
}

/** Backend may return accessToken or token, user.id or user._id. Normalize to AuthResponse shape. */
function normalizeAuthResponse(raw: unknown): AuthResponse {
  const r = raw as Record<string, unknown>;
  const token = (r.accessToken ?? r.token) as string;
  const refreshToken = (r.refreshToken ?? r.refresh_token) as string | undefined;
  const userRaw = (r.user ?? r.data) as Record<string, unknown> | undefined;
  if (!token || !userRaw) {
    throw new ApiError(500, 'Invalid auth response: missing token or user');
  }
  const u = userRaw as Record<string, unknown>;
  return {
    accessToken: token,
    refreshToken: refreshToken ?? '',
    user: {
      id: String(u.id ?? u._id ?? ''),
      email: u.email as string | undefined,
      role: u.role as string | undefined,
      kyc_status: (u.kyc_status ?? u.kycStatus) as string | undefined,
      walletAddress: String(u.walletAddress ?? u.wallet_address ?? ''),
    },
  };
}

/** Map backend auth response to app UserData. Handles various backend shapes. */
export function mapAuthResponseToUserData(res: AuthResponse | unknown): UserData {
  const normalized = res && typeof res === 'object' && 'user' in res
    ? (res as AuthResponse)
    : normalizeAuthResponse(res);
  const u = normalized.user;
  return {
    _id: u.id,
    Email: u.email,
    UserName: u.email,
    Name: u.email,
    WalletAddress: u.walletAddress,
    IsKycVerified: u.kyc_status === 'COMPLETED' || u.kyc_status === 'verified',
    token: normalized.accessToken,
    refreshToken: normalized.refreshToken,
    authMethod: 'wallet',
  };
}

// ============================================================================
// JWT payload decode (read-only, for OAuth callback)
// ============================================================================

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
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

  /** Build minimal UserData from JWT payload (for OAuth callback when backend only sends token). */
  userFromAccessToken: (accessToken: string): UserData => {
    const payload = decodeJwtPayload(accessToken);
    return {
      _id: String(payload?.sub ?? payload?.id ?? ''),
      Email: payload?.email,
      UserName: payload?.email,
      Name: payload?.name,
      WalletAddress: '',
      token: accessToken,
      authMethod: 'google',
    };
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ============================================================================
// Core fetch wrapper
// ============================================================================

// Base URL: one constant; normalize so no trailing slash. All auth requests use Authorization: Bearer <token>.
const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_BASE_URL = rawBase.replace(/\/+$/, '');
export const API_V1 = `${API_BASE_URL}/api/v1`;

let onAuthErrorCallback: (() => void) | null = null;

export function setOnAuthError(cb: () => void) {
  onAuthErrorCallback = cb;
}

async function request<T>(
  path: string,
  options?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options ?? {};
  const token = storage.getToken();
  const url = path.startsWith('http') ? path : `${API_V1}/${path.replace(/^\/+/, '')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    storage.clear();
    onAuthErrorCallback?.();
    throw new ApiError(401, 'Session expired. Please sign in again.');
  }

  // 400 and other errors: message from body is used below so validation messages are shown

  const contentType = response.headers.get('Content-Type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!isJson) {
    const text = await response.text();
    throw new ApiError(
      response.status,
      `Invalid response (${response.status} ${response.statusText})`,
      text.slice(0, 200),
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(response.status, 'Invalid JSON response');
  }

  if (!response.ok) {
    const raw =
      (data as { responseMessage?: string })?.responseMessage ??
      (data as { message?: unknown })?.message ??
      'Request failed';
    const msg = Array.isArray(raw) ? raw.join(' ') : String(raw);
    throw new ApiError(response.status, msg, data); // 400: validation message from backend
  }

  // Backend may wrap in { data } or return body directly
  return ((data as { data?: unknown }).data !== undefined
    ? (data as { data: T }).data
    : data) as T;
}

// ============================================================================
// Auth endpoints (NestJS: POST /api/v1/wallet-auth/...)
// ============================================================================

/** Call verify API with walletAddress + signature; returns normalized UserData for profile. */
async function verifyWalletWithApi(walletAddress: string, signature: string): Promise<UserData> {
  const res = await request<unknown>('wallet-auth/verify', {
    method: 'POST',
    body: JSON.stringify({ walletAddress, signature }),
    skipAuth: true,
  });
  return mapAuthResponseToUserData(res);
}

export const authApi = {
  /** Step 2: POST /api/v1/wallet-auth/nonce with body { walletAddress }. Use returned `message` exactly for signing. */
  getNonce: (walletAddress: string): Promise<NonceData> =>
    request<NonceData>('wallet-auth/nonce', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
      skipAuth: true,
    }),

  /** Step 5: Verify – body ONLY { walletAddress, signature }. Returns user + token for profile. */
  verifyWallet: verifyWalletWithApi,

  /** Sign in (verify). Throws RegistrationRequiredError if 404 or "No account found". */
  signIn: async (data: SignInRequest): Promise<UserData> => {
    try {
      return await verifyWalletWithApi(data.walletAddress, data.signature);
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = (err.body as { message?: unknown })?.message ?? err.message;
        const msgStr = Array.isArray(msg) ? msg.join(' ') : String(msg);
        if (err.status === 404 || msgStr.includes('No account found')) {
          throw new RegistrationRequiredError(data.walletAddress);
        }
      }
      throw err;
    }
  },

  /** Step 4: Register – body ONLY { walletAddress, signature } (optional email). 201 = success; 409 = call verify. */
  register: async (data: RegisterRequest): Promise<UserData> => {
    const res = await request<unknown>('wallet-auth/register', {
      method: 'POST',
      body: JSON.stringify({
        walletAddress: data.walletAddress,
        signature: data.signature,
        ...(data.email && { email: data.email }),
      }),
      skipAuth: true,
    });
    return mapAuthResponseToUserData(res);
  },

  /** Link a wallet to the current account (requires JWT) */
  linkWallet: (data: LinkWalletRequest): Promise<{ walletAddress: string; linkedAt: string }> =>
    request('wallet-auth/link', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Unlink wallet from the current account (requires JWT). Pass walletId for the path. */
  unlinkWallet: (walletId: string): Promise<{ unlinkedAddress: string }> =>
    request(`wallet-auth/unlink/${encodeURIComponent(walletId)}`, { method: 'DELETE' }),
};

// ============================================================================
// Users profile (GET /api/v1/users/profile) – requires JWT
// ============================================================================

export const usersApi = {
  /** Get current user profile. Requires JWT. */
  getProfile: (): Promise<UserProfileResponse> =>
    request<UserProfileResponse>('users/profile'),

  /** Update current user profile (name, bio, etc.). Requires JWT. */
  updateProfile: (data: UpdateProfileRequest): Promise<UserProfileResponse> =>
    request<UserProfileResponse>('users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// Portfolio (GET /api/v1/portfolio) – requires JWT
// ============================================================================

export const portfolioApi = {
  /** GET /api/v1/portfolio. Auth = Bearer. Returns array of portfolio items. */
  getPortfolio: (): Promise<PortfolioItem[]> =>
    request<PortfolioItem[]>('portfolio'),
};

// ============================================================================
// Vesting (GET /api/v1/vesting/...) – requires JWT
// ============================================================================

export const vestingApi = {
  /** GET /api/v1/vesting/claimable/sale/:saleId. Auth = Bearer. */
  getClaimableBySale: (saleId: string): Promise<VestingClaimableResponse> =>
    request<VestingClaimableResponse>(`vesting/claimable/sale/${encodeURIComponent(saleId)}`),

  /** GET /api/v1/vesting/claims/sale/:saleId. Auth = Bearer. Claim history. */
  getClaimsBySale: (saleId: string): Promise<VestingClaimItem[]> =>
    request<VestingClaimItem[]>(`vesting/claims/sale/${encodeURIComponent(saleId)}`),
};

// ============================================================================
// Projects (GET /api/v1/projects...) – list public; single project by id
// ============================================================================

export const projectsApi = {
  /** GET /api/v1/projects?status=LIVE|UPCOMING|CLOSED. Public. */
  getProjects: (status: ProjectStatus): Promise<ApiProject[]> =>
    request<ApiProject[]>(`projects?status=${status}`),

  /** GET /api/v1/projects/:id. Single project details (e.g. View Project Details). */
  getProject: (id: string): Promise<ApiProject> =>
    request<ApiProject>(`projects/${encodeURIComponent(id)}`),
};

// ============================================================================
// Wallets (GET/POST /api/v1/wallets) – requires JWT
// ============================================================================

export const walletsApi = {
  /** Get all wallets for the current user. */
  getWallets: (): Promise<WalletRecord[]> =>
    request<WalletRecord[]>('wallets'),

  /** Add a new wallet for the current user. */
  addWallet: (data: NewWalletRequest): Promise<WalletRecord> =>
    request<WalletRecord>('wallets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// Google auth (GET redirect + POST token for SPA)
// ============================================================================

/** Request body for POST /api/v1/auth/google/token (token-based Google auth for SPA/mobile). */
export interface GoogleTokenRequest {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

/** URL for redirect flow: GET /api/v1/auth/google → redirects to Google OAuth consent screen. */
export function getGoogleAuthUrl(): string {
  return `${API_V1}/auth/google`;
}

const GOOGLE_OAUTH_ERROR_KEY = 'google_oauth_error_message';

/**
 * Handle OAuth callback on load: read tokens or error from query string.
 * - Success: read access_token (and refresh_token), store them, clean URL with replace(origin), return true.
 * - Error: if error=google_auth_failed, read message, store in sessionStorage, clean URL, return true.
 * - Otherwise: return false (no callback params).
 */
export function handleGoogleOAuthCallback(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);

  const errorCode = params.get('error');
  if (errorCode === 'google_auth_failed') {
    const message = params.get('message') ?? params.get('error_description') ?? 'Google sign-in failed.';
    sessionStorage.setItem(GOOGLE_OAUTH_ERROR_KEY, message);
    window.location.replace(window.location.origin);
    return true;
  }

  const accessToken = params.get('access_token') ?? params.get('accessToken');
  if (!accessToken) return false;

  storage.setToken(accessToken);
  const refreshToken = params.get('refresh_token') ?? params.get('refresh_token');
  const userData = storage.userFromAccessToken(accessToken);
  if (refreshToken) userData.refreshToken = refreshToken;
  storage.setUser(userData);

  sessionStorage.setItem('google_oauth_landing', '1');
  window.location.replace(window.location.origin);
  return true;
}

/** Key used to pass Google OAuth error message after redirect. Use in AuthContext to read and show the error. */
export const GOOGLE_OAUTH_ERROR_STORAGE_KEY = GOOGLE_OAUTH_ERROR_KEY;

/**
 * SPA/mobile: authenticate with Google (token-based).
 * POST /api/v1/auth/google/token with body { email, firstName, lastName, picture, accessToken }.
 */
export async function exchangeGoogleToken(payload: GoogleTokenRequest): Promise<UserData> {
  const res = await request<unknown>('auth/google/token', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
  return mapAuthResponseToUserData(res);
}

// KYC Rewards, Liquidity Rewards, Voting endpoints – hidden for now (see comment at types section).
