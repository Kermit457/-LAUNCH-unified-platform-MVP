import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSolanaWallet } from './useSolanaWallet';

/**
 * Hook to ensure the Solana embedded wallet is connected and available
 * Privy embedded wallets need to be explicitly connected to appear in the wallets array
 */
export function useConnectSolanaWallet() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const { address } = useSolanaWallet();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !authenticated || !address) {
      setConnected(false);
      return;
    }

    // Check if the Solana wallet is already in the wallets array
    const solanaWallet = wallets.find((w) => w.address === address && w.chainType === 'solana');

    if (solanaWallet) {
      console.log('✅ Solana wallet is connected:', solanaWallet.address);
      setConnected(true);
      setConnecting(false);
    } else {
      console.log('⚠️ Solana wallet exists but is not connected');
      console.log('Address from linkedAccounts:', address);
      console.log('Available wallets:', wallets.map(w => ({ address: w.address, chain: w.chainType })));
      setConnected(false);

      // The wallet exists in linkedAccounts but not in wallets
      // This means it's an embedded wallet that hasn't been "connected" yet
      // For embedded wallets, we may need to use a different approach
    }
  }, [ready, authenticated, address, wallets]);

  const connectWallet = async () => {
    if (!address) {
      setError('No Solana address found');
      return false;
    }

    setConnecting(true);
    setError(null);

    try {
      // Embedded wallets created on login should already be available
      // If they're not in the wallets array, it might be a Privy version issue
      // or we need to use a different method to access them

      // For now, throw an informative error
      throw new Error(
        'Embedded Solana wallet exists but is not connected. ' +
        'This may require using Privy\'s server-side API for signing, ' +
        'or the wallet needs to be explicitly set as active.'
      );
    } catch (err: any) {
      console.error('Connect wallet error:', err);
      setError(err.message);
      return false;
    } finally {
      setConnecting(false);
    }
  };

  return {
    connected,
    connecting,
    error,
    connectWallet,
    walletAddress: address,
    availableWallets: wallets.filter(w => w.chainType === 'solana'),
  };
}
