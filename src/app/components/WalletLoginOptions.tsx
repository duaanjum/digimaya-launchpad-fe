import { getInjectedProviders } from '@/app/config/injectedProviders';
import walletConnectLogo from '@/assets/walletconnect-seeklogo.svg';
import metamaskLogo from '@/assets/metamask-icon.svg';
import gateLogo from '@/assets/gate.io-logo.svg';

const METAMASK_URL = 'https://metamask.io';
const GATE_WALLET_URL = 'https://www.gate.io/web3';

export interface WalletLoginOptionsProps {
  connectors: { id: string; name?: string }[];
  connectingId: string | null;
  isAuthLoading: boolean;
  onConnect: (connectorId: string) => void;
}

export function WalletLoginOptions({
  connectors,
  connectingId,
  isAuthLoading,
  onConnect,
}: WalletLoginOptionsProps) {
  const walletConnectConnector = connectors.find(
    (c) => c.id === 'walletConnect' || c.name === 'WalletConnect',
  );
  const metaMaskConnector = connectors.find((c) => c.name === 'MetaMask');
  const gateConnector = connectors.find((c) => c.name === 'Gate Wallet');

  let hasMetaMask = false;
  let hasGate = false;
  try {
    const providers = getInjectedProviders();
    hasMetaMask = !!providers?.metaMask;
    hasGate = !!providers?.gate;
  } catch {
    // SSR or missing window
  }

  const handleClick = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) onConnect(connector.id);
  };

  return (
    <div data-wallet-options="walletconnect-metamask-gate">
      <h3 className="text-sm font-maven-pro text-gray-300 mb-3">
        Connect with Wallet
      </h3>
      <div className="space-y-2">
        {/* WalletConnect – always shown */}
        {walletConnectConnector && (
          <button
            type="button"
            onClick={() => handleClick(walletConnectConnector.id)}
            disabled={connectingId !== null || isAuthLoading}
            className="w-full flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={walletConnectLogo} alt="WalletConnect" className="w-5 h-5" />
            <span className="text-white flex-1">WalletConnect</span>
            {connectingId === walletConnectConnector.id && (
              <span className="text-xs text-gray-400">Connecting...</span>
            )}
          </button>
        )}

        {/* MetaMask – always shown */}
        <div className="space-y-1">
          {hasMetaMask && metaMaskConnector ? (
            <button
              type="button"
              onClick={() => handleClick(metaMaskConnector.id)}
              disabled={connectingId !== null || isAuthLoading}
              className="w-full flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={metamaskLogo} alt="MetaMask" className="w-5 h-5" />
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
                <img src={metamaskLogo} alt="MetaMask" className="w-5 h-5" />
                <span className="text-white flex-1">MetaMask</span>
              </div>
              <span className="text-xs text-primary pl-8">
                Don&apos;t have an account? Get MetaMask
              </span>
            </a>
          )}
        </div>

        {/* Gate Wallet – always shown */}
        <div className="space-y-1">
          {hasGate && gateConnector ? (
            <button
              type="button"
              onClick={() => handleClick(gateConnector.id)}
              disabled={connectingId !== null || isAuthLoading}
              className="w-full flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-primary transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={gateLogo} alt="Gate Wallet" className="w-5 h-5" />
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
                <img src={gateLogo} alt="Gate Wallet" className="w-5 h-5" />
                <span className="text-white flex-1">Gate Wallet</span>
              </div>
              <span className="text-xs text-primary pl-8">
                Don&apos;t have an account? Get Gate Wallet
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
