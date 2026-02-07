import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, bsc, arbitrum, optimism, avalanche } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Replace with your own WalletConnect project ID from https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = 'YOUR_WALLETCONNECT_PROJECT_ID';

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, bsc, arbitrum, optimism, avalanche],
  connectors: [
    injected(),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [avalanche.id]: http(),
  },
});
