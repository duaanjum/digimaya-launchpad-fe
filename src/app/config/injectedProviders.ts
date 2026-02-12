// src/app/config/injectedProviders.ts

export interface Eip1193Provider {
    isMetaMask?: boolean;
    isBraveWallet?: boolean;
    isGateWallet?: boolean;
    providers?: Eip1193Provider[];
    [key: string]: unknown;
  }
  
  export interface InjectedProviders {
    metaMask?: Eip1193Provider;
    brave?: Eip1193Provider;
    gate?: Eip1193Provider;
    defaultProvider?: Eip1193Provider;
  }
  
  /**
   * Safely detect injected EVM providers.
   * - Handles window.ethereum.providers (multiple wallets)
   * - Handles single window.ethereum
   * - SSR‑safe (no window on server)
   */
  export function getInjectedProviders(): InjectedProviders {
    if (typeof window === 'undefined') return {};
  
    const eth = (window as any).ethereum as Eip1193Provider | undefined;
    if (!eth) return {};
  
    const candidates: Eip1193Provider[] = Array.isArray(eth.providers)
      ? eth.providers
      : [eth];
  
    const result: InjectedProviders = { defaultProvider: eth };
  
    for (const provider of candidates) {
      if (!provider) continue;
  
      if (provider.isGateWallet) {
        result.gate = provider;
      } else if (provider.isBraveWallet) {
        result.brave = provider;
      } else if (provider.isMetaMask) {
        if (!result.brave) {
          result.metaMask = provider;
        }
      }
    }
  
    return result;
  }