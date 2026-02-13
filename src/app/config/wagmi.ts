// src/app/config/wagmi.ts
import { http, createConfig } from 'wagmi';
import {
  mainnet,
  sepolia,
  polygon,
  bsc,
  arbitrum,
  optimism,
  avalanche,
} from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { getInjectedProviders } from './injectedProviders';

// WalletConnect v2 project ID (from your previous working config)
const WALLETCONNECT_PROJECT_ID = 'ae5186bbbb73fa7d14da24db2987de92';

export const chains = [
  mainnet,
  sepolia,
  polygon,
  bsc,
  arbitrum,
  optimism,
  avalanche,
];

export const wagmiConfig = createConfig({
  autoConnect: false,
  chains,
  connectors: [
    // MetaMask only (no other injected wallets – others use WalletConnect QR)
    injected({
      id: 'metaMask',
      name: 'MetaMask',
      shimDisconnect: true,
      target() {
        if (typeof window === 'undefined') return;
        const { metaMask } = getInjectedProviders();
        return metaMask;
      },
    }),

    // Gate Wallet only
    injected({
      id: 'gateWallet',
      name: 'Gate Wallet',
      shimDisconnect: true,
      target() {
        if (typeof window === 'undefined') return;
        const { gate } = getInjectedProviders();
        return gate;
      },
    }),

    // WalletConnect – separate option
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
    }),
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