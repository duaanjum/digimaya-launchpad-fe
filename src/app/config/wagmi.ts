import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, bsc, arbitrum, optimism, avalanche } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const WALLETCONNECT_PROJECT_ID = 'ae5186bbbb73fa7d14da24db2987de92';

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
