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
  RegistrationRequiredError,
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

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const isAuthenticated = !!user && !!storage.getToken();

  // Track the address the user authenticated with
  const authedAddressRef = useRef<string | undefined>(undefined);

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
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (
      isAuthenticated &&
      authedAddressRef.current &&
      address &&
      authedAddressRef.current.toLowerCase() !== address.toLowerCase()
    ) {
      storage.clear();
      setUser(null);
      authedAddressRef.current = undefined;
      setError('Wallet changed. Please sign in again.');
    }
  }, [address, isAuthenticated]);

  // -----------------------------------------------------------------------
  // Clear auth state if wallet disconnects
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!isConnected && isAuthenticated) {
      storage.clear();
      setUser(null);
      authedAddressRef.current = undefined;
    }
  }, [isConnected, isAuthenticated]);

  // -----------------------------------------------------------------------
  // Login: nonce → sign → signin
  // -----------------------------------------------------------------------
  const login = useCallback(async () => {
    if (!address) {
      setError('Please connect your wallet first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setNeedsRegistration(false);
    setPendingSignature(null);

    try {
      // Step 1: Get nonce
      const nonceData = await authApi.getNonce(address);

      // Step 2: Sign the message
      const signature = await signMessageAsync({ message: nonceData.message });

      // Step 3: Attempt signin
      try {
        const userData = await authApi.signIn({
          walletAddress: address,
          signature,
          message: nonceData.message,
        });

        // Success: store JWT and user data
        storage.setToken(userData.token);
        storage.setUser(userData);
        setUser(userData);
        authedAddressRef.current = address;
      } catch (err) {
        if (err instanceof RegistrationRequiredError) {
          // User needs to register — store the signature for the registration step
          setPendingSignature({
            signature,
            message: nonceData.message,
            walletAddress: address,
          });
          setNeedsRegistration(true);
        } else {
          throw err;
        }
      }
    } catch (err) {
      if (err instanceof RegistrationRequiredError) {
        // Already handled above
      } else {
        const message =
          err instanceof Error
            ? err.message.includes('rejected') || err.message.includes('denied')
              ? 'Signature rejected. Please try again.'
              : err.message
            : 'Authentication failed. Please try again.';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [address, signMessageAsync]);

  // -----------------------------------------------------------------------
  // Register: complete registration with optional email/userName
  // -----------------------------------------------------------------------
  const register = useCallback(
    async (email?: string, userName?: string) => {
      if (!pendingSignature) {
        setError('No pending registration. Please start again.');
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
    disconnect();
  }, [disconnect]);

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
      login,
      register,
      cancelRegistration,
      logout,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
