import { useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { PublicKey } from '@solana/web3.js';

/**
 * Hook to get Solana wallet from Privy
 * Uses the reliable user.linkedAccounts approach to avoid connector context issues
 */
export function useSolanaWallet() {
  const { ready, authenticated, user } = usePrivy();

  const solanaWallet = useMemo(() => {
    if (!ready || !authenticated || !user?.linkedAccounts) {
      return null;
    }

    // Find Solana wallet in linked accounts
    const solanaAccount = user.linkedAccounts.find(
      (account: any) => account.type === 'wallet' && account.chainType === 'solana'
    );

    if (!solanaAccount || !solanaAccount.address) {
      return null;
    }

    const address = solanaAccount.address;

    try {
      return {
        publicKey: new PublicKey(address),
        address: address,
        account: solanaAccount, // Return the full account object
      };
    } catch (error) {
      console.error('Invalid Solana address:', address, error);
      return null;
    }
  }, [user, ready, authenticated]);

  return {
    wallet: solanaWallet,
    publicKey: solanaWallet?.publicKey || null,
    address: solanaWallet?.address || null,
    connected: !!solanaWallet && authenticated,
    ready,
  };
}
