import { useState, useEffect } from 'react';
import { useSolanaWallet } from './useSolanaWallet';
import { connection } from '@/lib/solana/config';

/**
 * Hook to fetch and monitor SOL balance from Privy wallet
 * Updates balance automatically when wallet changes
 */
export function useSolanaBalance() {
  const { publicKey, connected } = useSolanaWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey || !connected) {
      setBalance(0);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchBalance() {
      try {
        setLoading(true);
        setError(null);

        // Fetch balance from Solana
        if (!publicKey) return;
        const lamports = await connection.getBalance(publicKey);
        const sol = lamports / 1_000_000_000; // Convert lamports to SOL

        if (isMounted) {
          setBalance(sol);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to fetch SOL balance:', err);
        if (isMounted) {
          setError(err.message || 'Failed to fetch balance');
          setBalance(0);
          setLoading(false);
        }
      }
    }

    // Initial fetch
    fetchBalance();

    // Set up polling every 10 seconds to keep balance fresh
    const intervalId = setInterval(fetchBalance, 10000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [publicKey, connected]);

  return {
    balance,
    loading,
    error,
    refresh: async () => {
      if (!publicKey) return;
      try {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1_000_000_000);
      } catch (err: any) {
        console.error('Failed to refresh balance:', err);
      }
    },
  };
}
