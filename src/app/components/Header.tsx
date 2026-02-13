import { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useAuth } from '@/app/hooks/useAuth';
import { getGoogleAuthUrl } from '@/app/lib/api';
import { getInjectedProviders } from '@/app/config/injectedProviders';
import digimaayaLogo from 'figma:asset/875cae2f20c002d2f45cd08d3c927dde653b100b.png';
import walletConnectLogo from '@/assets/walletconnect-seeklogo.svg';
import metamaskLogo from '@/assets/metamask-icon.svg';
import gateLogo from '@/assets/gate.io-logo.svg';
import { Menu, X, User, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

interface HeaderProps {
  onLogoClick?: () => void;
  onViewProfile?: () => void;
  /** Optional handler for nav links (e.g. switch view before scrolling) */
  onNavClick?: (href: string) => void;
}

// Connector IDs to hide (duplicates / internal connectors)
const HIDDEN_CONNECTOR_IDS = new Set(['injected']);

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.27 13.25 17.62 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.14 24.5c0-1.57-.14-3.08-.39-4.5H24v9h12.5c-.54 2.79-2.11 5.16-4.48 6.77l7.24 5.62C43.77 37.33 46.14 31.39 46.14 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.54 28.41A14.47 14.47 0 0 1 9.5 24c0-1.54.26-3.03.73-4.41l-7.98-6.19C.75 16.34 0 20.06 0 24c0 3.86.73 7.54 2.21 10.78l8.33-6.37z"
      />
      <path
        fill="#4285F4"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.24-5.62C30.8 38.48 27.69 39.5 24 39.5c-6.38 0-11.73-3.75-14.33-9.19l-8.33 6.37C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function Header({ onLogoClick, onViewProfile, onNavClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  // Registration form state
  const [regEmail, setRegEmail] = useState('');
  const [regUserName, setRegUserName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError, reset: resetConnect } = useConnect();
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    error: authError,
    needsRegistration,
    login,
    register,
    cancelRegistration,
    logout,
    clearError,
  } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open login dialog when we have a Google OAuth error to show (after error=google_auth_failed redirect)
  useEffect(() => {
    if (sessionStorage.getItem('open_login_dialog_for_error') && authError) {
      setIsLoginDialogOpen(true);
      sessionStorage.removeItem('open_login_dialog_for_error');
    }
  }, [authError]);

  // Auto-trigger SIWE login after wallet connects
  useEffect(() => {
    if (isConnected && !isAuthenticated && !isAuthLoading && !needsRegistration) {
      setConnectingId(null);
      login();
    }
  }, [isConnected, isAuthenticated, isAuthLoading, needsRegistration, login]);

  // Close login dialog on successful authentication and navigate to profile
  useEffect(() => {
    if (isAuthenticated && isLoginDialogOpen) {
      setIsLoginDialogOpen(false);
      setConnectingId(null);
      clearError();
      onViewProfile?.();
    }
  }, [isAuthenticated, isLoginDialogOpen, clearError, onViewProfile]);

  // Reset connecting state on wagmi connect error
  useEffect(() => {
    if (connectError) {
      setConnectingId(null);
    }
  }, [connectError]);

  const navLinks = [
    { label: 'Live Sales', href: '#live-sales' },
    { label: 'Upcoming', href: '#upcoming-sales' },
    { label: 'Past Projects', href: '#past-projects' },
    { label: 'About', href: '#about' },
  ];

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    // If parent provided a handler (e.g. to switch view to home), delegate to it
    if (onNavClick) {
      onNavClick(href);
      return;
    }
    // Fallback: local smooth scroll within current view
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter out duplicate/internal connectors — show EIP-6963 detected wallets
  const visibleConnectors = connectors.filter(
    (c) => !HIDDEN_CONNECTOR_IDS.has(c.id) || connectors.length === 1,
  );

  const handleWalletConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      setConnectingId(connectorId);
      clearError();
      resetConnect();
      connect({ connector });
    }
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout();
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setConnectingId(null);
      clearError();
      resetConnect();
      if (needsRegistration) {
        cancelRegistration();
      }
    }
    setIsLoginDialogOpen(open);
  };

  const handleRegister = async () => {
    await register(regEmail || undefined, regUserName || undefined);
  };

  const handleSkipRegister = async () => {
    await register();
  };

  /** Retry auth from nonce when pending registration was lost. */
  const handleRequestNewNonce = () => {
    clearError();
    cancelRegistration();
    login();
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  const displayError = authError || (connectError
    ? connectError.message.includes('rejected') || connectError.message.includes('denied')
      ? 'Connection rejected. Please try again.'
      : connectError.message
    : null);

  // Determine dialog content based on state
  const isSigningIn = isConnected && isAuthLoading && !needsRegistration;

  return (
    <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-6 hover:opacity-80 transition-opacity"
          >
            <img src={digimaayaLogo} alt="DigiMaaya" className="h-12 w-auto" />
            <div className="hidden sm:block h-8 w-px bg-border" />
            <div className="hidden sm:block text-left">
              <h2
                className="text-xl font-maven-pro"
                style={{
                  background: 'linear-gradient(135deg, #E3107A 0%, #FF7F2C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SpringBoard
              </h2>
              <p className="text-xs text-muted-foreground">Fundraising Infrastructure</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{truncatedAddress}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        if (onViewProfile) onViewProfile();
                      }}
                      className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 hover:text-white rounded-t-lg"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 hover:text-white rounded-b-lg"
                    >
                      <LogOut className="w-3 h-3" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginDialogOpen(true)}
                className="text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
              >
                Login
              </button>
            )}

            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm hover:text-primary transition-colors py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* Login / Auth Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
          {/* ------- Registration Form ------- */}
          {needsRegistration ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-white">Create Account</DialogTitle>
                <DialogDescription className="text-sm text-gray-400">
                  No account found for this wallet. Complete registration to continue.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {displayError && (
                  <div className="space-y-2">
                    <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-300">
                      {displayError}
                    </div>
                    {displayError.includes('request a new nonce') && (
                      <button
                        type="button"
                        onClick={handleRequestNewNonce}
                        disabled={isAuthLoading}
                        className="w-full py-2.5 rounded-lg border border-primary bg-transparent text-primary text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
                      >
                        Request new nonce
                      </button>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Username <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={regUserName}
                    onChange={(e) => setRegUserName(e.target.value)}
                    placeholder="cryptouser"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleRegister}
                    disabled={isAuthLoading}
                    className="flex-1 py-3 rounded-lg text-white font-maven-pro hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(90deg, #E3107A 0%, #FF7F2C 100%)' }}
                  >
                    {isAuthLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Registering...
                      </span>
                    ) : (
                      'Register'
                    )}
                  </button>
                  <button
                    onClick={handleSkipRegister}
                    disabled={isAuthLoading}
                    className="px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Skip
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  You can add email and username later from your profile.
                </p>
              </div>
            </>
          ) : isSigningIn ? (
            /* ------- Signing In State ------- */
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-white">Signing In</DialogTitle>
                <DialogDescription className="text-sm text-gray-400">
                  Please sign the message in your wallet to authenticate
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#E3107A' }} />
                <p className="text-gray-300 text-sm text-center">
                  Verifying your wallet ownership...
                </p>
                {displayError && (
                  <div className="w-full p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-300">
                    {displayError}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ------- Wallet Selection ------- */
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-white">Login</DialogTitle>
                <DialogDescription className="text-sm text-gray-400">
                Choose your preferred login method
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {displayError && (
                  <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-300">
                    {displayError}
                  </div>
                )}

<div>
  <h3 className="text-sm font-maven-pro text-gray-300 mb-3">
    Connect with Wallet
  </h3>

  <div className="space-y-2">
    {(() => {
      // Always show: WalletConnect, MetaMask, Gate Wallet. If extension missing, show "Don't have an account?" link.
      const walletConnectConnector = connectors.find(
        (c) => c.id === 'walletConnect' || c.name === 'WalletConnect',
      );
      const metaMaskConnector = connectors.find((c) => c.name === 'MetaMask');
      const gateConnector = connectors.find((c) => c.name === 'Gate Wallet');
      const providers = getInjectedProviders();
      const hasMetaMask = !!providers.metaMask;
      const hasGate = !!providers.gate;

      const METAMASK_URL = 'https://metamask.io';
      const GATE_WALLET_URL = 'https://www.gate.io/web3';

      const handleClick = (connectorId: string) => {
        const connector = connectors.find((c) => c.id === connectorId);
        if (!connector) return;
        handleWalletConnect(connector.id);
      };

      return (
        <>
          {/* WalletConnect – always shown (QR + full wallet list) */}
          {walletConnectConnector && (
            <button
              key={walletConnectConnector.id}
              onClick={() => handleClick(walletConnectConnector.id)}
              disabled={connectingId !== null || isAuthLoading}
              className="w-full flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src={walletConnectLogo}
                alt="WalletConnect logo"
                className="w-5 h-5"
              />
              <span className="text-white flex-1">WalletConnect</span>
              {connectingId === walletConnectConnector.id && (
                <span className="text-xs text-gray-400">Connecting...</span>
              )}
            </button>
          )}

          {/* MetaMask – always shown; connect if installed, else link to get wallet */}
          <div key="metaMask" className="space-y-1">
            {hasMetaMask && metaMaskConnector ? (
              <button
                onClick={() => handleClick(metaMaskConnector.id)}
                disabled={connectingId !== null || isAuthLoading}
                className="w-full flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src={metamaskLogo}
                  alt="MetaMask logo"
                  className="w-5 h-5"
                />
                <span className="text-white flex-1">MetaMask</span>
                {connectingId === metaMaskConnector.id && (
                  <span className="text-xs text-gray-400">Connecting...</span>
                )}
              </button>
            ) : (
              <a
                href={METAMASK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex flex-col gap-1 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={metamaskLogo}
                    alt="MetaMask logo"
                    className="w-5 h-5"
                  />
                  <span className="text-white flex-1">MetaMask</span>
                </div>
                <span className="text-xs text-primary pl-8">Don&apos;t have an account? Get MetaMask</span>
              </a>
            )}
          </div>

          {/* Gate Wallet – always shown; connect if installed, else link to get wallet */}
          <div key="gateWallet" className="space-y-1">
            {hasGate && gateConnector ? (
              <button
                onClick={() => handleClick(gateConnector.id)}
                disabled={connectingId !== null || isAuthLoading}
                className="w-full flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src={gateLogo}
                  alt="Gate Wallet logo"
                  className="w-5 h-5"
                />
                <span className="text-white flex-1">Gate Wallet</span>
                {connectingId === gateConnector.id && (
                  <span className="text-xs text-gray-400">Connecting...</span>
                )}
              </button>
            ) : (
              <a
                href={GATE_WALLET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex flex-col gap-1 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={gateLogo}
                    alt="Gate Wallet logo"
                    className="w-5 h-5"
                  />
                  <span className="text-white flex-1">Gate Wallet</span>
                </div>
                <span className="text-xs text-primary pl-8">Don&apos;t have an account? Get Gate Wallet</span>
              </a>
            )}
          </div>
        </>
      );
    })()}
  </div>
</div>

                {/* Divider between wallet options and Google login */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-gray-900 px-2 text-gray-500">or</span>
                  </div>
                </div>

                {/* Login with Google (matches Figma: second section) */}
                <div className="space-y-3">
                  <h3 className="text-sm font-maven-pro text-gray-300">Login with</h3>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = getGoogleAuthUrl();
                    }}
                    disabled={connectingId !== null || isAuthLoading}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <GoogleIcon className="w-5 h-5"   />
                    <span className=" text-gray-900 font-maven-pro">Google</span>
                  </button>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 text-center">
                    By connecting, you agree to the Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}
