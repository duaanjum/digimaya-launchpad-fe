import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import {
  authApi,
  storage,
  setOnAuthError,
  ApiError,
  RegistrationRequiredError,
  GOOGLE_OAUTH_ERROR_STORAGE_KEY,
  type UserData,
} from '@/app/lib/api';

// ============================================================================
// Types
// ============================================================================

export interface AuthContextValue {
  /** Whether the user is fully authenticated (wallet + JWT) */
  isAuthenticated: boolean;
  /** Loading state for login/register operations */
  isLoading: boolean;
  /** Auth error message */
  error: string | null;
  /** Authenticated user data */
  user: UserData | null;
  /** True when signin returned 404 and user needs to register */
  needsRegistration: boolean;
  /** Temporarily stored signature+message for registration flow */
  pendingSignature: { signature: string; message: string; walletAddress: string } | null;
  /** Message from backend (WALLET_AUTH_MESSAGE) shown while user is signing – set during login flow */
  signMessage: string | null;

  /** Start the SIWE login flow (nonce → sign → signin) */
  login: () => Promise<void>;
  /** Complete registration after signin returned 404 */
  register: (email?: string, userName?: string) => Promise<void>;
  /** Cancel registration and clear pending state */
  cancelRegistration: () => void;
  /** Log out: clear JWT + disconnect wallet */
  logout: () => void;
  /** Clear error state */
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => storage.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [pendingSignature, setPendingSignature] = useState<{
    signature: string;
    message: string;
    walletAddress: string;
  } | null>(null);
  const [signMessage, setSignMessage] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const handleDisconnect = useCallback(() => {
    disconnect();
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('wagmi.store');
      } catch {
        // Ignore storage errors (private mode, disabled storage, etc.)
      }
    }
  }, [disconnect]);

  const isAuthenticated = !!user && !!storage.getToken();

  // Track the address the user authenticated with
  const authedAddressRef = useRef<string | undefined>(undefined);

  // -----------------------------------------------------------------------
  // Show Google OAuth error if we landed after error=google_auth_failed redirect
  // -----------------------------------------------------------------------
  useEffect(() => {
    const message = sessionStorage.getItem(GOOGLE_OAUTH_ERROR_STORAGE_KEY);
    if (message) {
      setError(message);
      sessionStorage.removeItem(GOOGLE_OAUTH_ERROR_STORAGE_KEY);
      sessionStorage.setItem('open_login_dialog_for_error', '1');
    }
  }, []);

  // -----------------------------------------------------------------------
  // Register global 401 handler
  // -----------------------------------------------------------------------
  useEffect(() => {
    setOnAuthError(() => {
      setUser(null);
      storage.clear();
      authedAddressRef.current = undefined;
    });
  }, []);

  // -----------------------------------------------------------------------
  // Auto-logout when wallet address changes after authentication
  // (wallet-based auth only – keep Google/OAuth sessions independent)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (
      isAuthenticated &&
      user?.authMethod === 'wallet' &&
      authedAddressRef.current &&
      address &&
      authedAddressRef.current.toLowerCase() !== address.toLowerCase()
    ) {
      storage.clear();
      setUser(null);
      authedAddressRef.current = undefined;
      setError('Wallet changed. Please sign in again.');
    }
  }, [address, isAuthenticated, user?.authMethod]);

  // -----------------------------------------------------------------------
  // Clear auth state if wallet disconnects
  // (wallet-based auth only – do not clear Google/OAuth logins)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (user?.authMethod === 'wallet' && !isConnected && isAuthenticated) {
      storage.clear();
      setUser(null);
      authedAddressRef.current = undefined;
    }
  }, [isConnected, isAuthenticated, user?.authMethod]);

  // -----------------------------------------------------------------------
  // Login: full flow — register first, then verify if 409 (Step 1–5)
  // -----------------------------------------------------------------------
  const login = useCallback(async () => {
    // Step 1: Wallet address + signer (wagmi gives address; signMessageAsync = signer.signMessage)
    if (!address) {
      setError('Please connect your wallet first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setNeedsRegistration(false);

    try {
      setSignMessage(null);
      // Step 2: Get nonce + message from backend (POST /api/v1/wallet-auth/nonce)
      const nonceData = await authApi.getNonce(address);
      const message = nonceData.message; // exact string from API (backend uses WALLET_AUTH_MESSAGE)
      setSignMessage(message);

      // Step 3: Get signature from wallet (user signs in wallet popup)
      // signMessageAsync(message) is the only way to "get" the signature – wallet returns hex string
      const signature = await signMessageAsync({ message });

      // Step 4: Register first – body ONLY walletAddress + signature (no message, no nonce)
      const userData = await authApi.register({
        walletAddress: address,
        signature,
      }).catch(async (err) => {
        if (err instanceof ApiError && err.status === 409) {
          // Step 5: 409 = already registered → verify with same walletAddress + signature
          return authApi.verifyWallet(address, signature);
        }
        if (err instanceof ApiError && err.status === 400) {
          const body = err.body as { message?: unknown } | undefined;
          const bodyMsg = body?.message;
          const msg = bodyMsg != null
            ? (Array.isArray(bodyMsg) ? bodyMsg.join(' ') : String(bodyMsg))
            : err.message;
          if (import.meta.env.DEV && body) {
            console.error('[auth] Register 400 response:', body);
          }
          setError(msg || 'No pending registration or expired. Please request a new nonce.');
          return null;
        }
        throw err;
      });

      if (userData) {
        storage.setToken(userData.token);
        storage.setUser(userData);
        setUser(userData);
        authedAddressRef.current = address;
      }
      setSignMessage(null);
    } catch (err) {
      setIsLoading(false);
      setSignMessage(null);
      let message = 'Authentication failed. Please try again.';
      if (err instanceof ApiError) {
        const bodyMsg = (err.body as { message?: unknown })?.message;
        message = bodyMsg != null
          ? (Array.isArray(bodyMsg) ? bodyMsg.join(' ') : String(bodyMsg))
          : err.message;
      } else if (err instanceof Error) {
        message =
          err.message.includes('rejected') || err.message.includes('denied')
            ? 'Signature rejected. Please try again.'
            : err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
      setSignMessage(null);
    }
  }, [address, signMessageAsync]);

  // -----------------------------------------------------------------------
  // Register: complete registration with optional email/userName
  // -----------------------------------------------------------------------
  const register = useCallback(
    async (email?: string, userName?: string) => {
      if (!pendingSignature) {
        setError('No pending registration request. Please request a new nonce.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const userData = await authApi.register({
          walletAddress: pendingSignature.walletAddress,
          signature: pendingSignature.signature,
          email: email || undefined,
          userName: userName || undefined,
        });

        // Success
        storage.setToken(userData.token);
        storage.setUser(userData);
        setUser(userData);
        authedAddressRef.current = pendingSignature.walletAddress;
        setNeedsRegistration(false);
        setPendingSignature(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [pendingSignature],
  );

  // -----------------------------------------------------------------------
  // Cancel registration
  // -----------------------------------------------------------------------
  const cancelRegistration = useCallback(() => {
    setNeedsRegistration(false);
    setPendingSignature(null);
    setError(null);
  }, []);

  // -----------------------------------------------------------------------
  // Logout
  // -----------------------------------------------------------------------
  const logout = useCallback(() => {
    storage.clear();
    setUser(null);
    setError(null);
    setNeedsRegistration(false);
    setPendingSignature(null);
    authedAddressRef.current = undefined;
    handleDisconnect();
  }, [handleDisconnect]);

  // -----------------------------------------------------------------------
  // Clear error
  // -----------------------------------------------------------------------
  const clearError = useCallback(() => setError(null), []);

  // -----------------------------------------------------------------------
  // Context value
  // -----------------------------------------------------------------------
  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      error,
      user,
      needsRegistration,
      pendingSignature,
      signMessage,
      login,
      register,
      cancelRegistration,
      logout,
      clearError,
    }),
    [
      isAuthenticated,
      isLoading,
      error,
      user,
      needsRegistration,
      pendingSignature,
      signMessage,
      login,
      register,
      cancelRegistration,
      logout,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
