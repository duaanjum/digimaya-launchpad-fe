import { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useAuth } from '@/app/hooks/useAuth';
import digimaayaLogo from 'figma:asset/875cae2f20c002d2f45cd08d3c927dde653b100b.png';
import { Menu, X, Wallet, User, LogOut, ChevronDown, Loader2 } from 'lucide-react';
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
}

// Connector IDs to hide (duplicates / internal connectors)
const HIDDEN_CONNECTOR_IDS = new Set(['injected']);

export function Header({ onLogoClick, onViewProfile }: HeaderProps) {
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

  // Auto-trigger SIWE login after wallet connects
  useEffect(() => {
    if (isConnected && !isAuthenticated && !isAuthLoading && !needsRegistration) {
      setConnectingId(null);
      login();
    }
  }, [isConnected, isAuthenticated, isAuthLoading, needsRegistration, login]);

  // Close login dialog on successful authentication
  useEffect(() => {
    if (isAuthenticated && isLoginDialogOpen) {
      setIsLoginDialogOpen(false);
      setConnectingId(null);
      clearError();
    }
  }, [isAuthenticated, isLoginDialogOpen, clearError]);

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
                  <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-300">
                    {displayError}
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
                <DialogTitle className="text-2xl text-white">Connect Wallet</DialogTitle>
                <DialogDescription className="text-sm text-gray-400">
                  Choose a wallet to sign in to SpringBoard
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
                    {visibleConnectors.map((connector) => {
                      const isConnecting = connectingId === connector.id;
                      return (
                        <button
                          key={connector.uid}
                          onClick={() => handleWalletConnect(connector.id)}
                          disabled={connectingId !== null || isAuthLoading}
                          className="w-full flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isConnecting ? (
                            <Loader2
                              className="w-5 h-5 animate-spin"
                              style={{ color: '#E3107A' }}
                            />
                          ) : connector.icon ? (
                            <img src={connector.icon} alt="" className="w-5 h-5 rounded" />
                          ) : (
                            <Wallet className="w-5 h-5" style={{ color: '#E3107A' }} />
                          )}
                          <span className="text-white flex-1">{connector.name}</span>
                          {isConnecting && (
                            <span className="text-xs text-gray-400">Connecting...</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
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
