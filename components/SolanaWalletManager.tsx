'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useWallets, useCreateWallet } from '@privy-io/react-auth/solana';

interface SolanaWalletContextType {
  wallets: any[];
  ready: boolean;
  createWallet: (options?: any) => Promise<any>;
}

const SolanaWalletContext = createContext<SolanaWalletContextType | undefined>(undefined);

/**
 * Provider component that wraps Privy's Solana hooks
 * MUST be used inside PrivyProvider
 */
export function SolanaWalletManager({ children }: { children: ReactNode }) {
  const { wallets, ready } = useWallets();
  const { createWallet } = useCreateWallet();

  return (
    <SolanaWalletContext.Provider value={{ wallets, ready, createWallet }}>
      {children}
    </SolanaWalletContext.Provider>
  );
}

/**
 * Hook to access Solana wallets from context
 */
export function useSolanaWalletsContext() {
  const context = useContext(SolanaWalletContext);
  if (context === undefined) {
    return { wallets: [], ready: false, createWallet: async () => ({ wallet: null }) };
  }
  return context;
}
