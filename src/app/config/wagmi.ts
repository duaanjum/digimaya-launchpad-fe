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

/**
 * Use the SAME WalletConnect projectId you already had.
 */
const WALLETCONNECT_PROJECT_ID = '<YOUR_EXISTING_WALLETCONNECT_PROJECT_ID>'; // <- replace

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
  chains,
  connectors: [
    // Generic fallback injected connector (hidden in UI)
    injected({
      shimDisconnect: true,
    }),

    // MetaMask only
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

    // Brave Wallet only
    injected({
      id: 'braveWallet',
      name: 'Brave Wallet',
      shimDisconnect: true,
      target() {
        if (typeof window === 'undefined') return;
        const { brave } = getInjectedProviders();
        return brave;
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