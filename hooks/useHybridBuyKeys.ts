import { useState } from 'react';
import { useSolanaBuyKeys } from './useSolanaBuyKeys';

/**
 * Hybrid hook that combines Solana blockchain transactions with database updates
 *
 * Flow:
 * 1. Execute Solana transaction (payment)
 * 2. Call API with transaction signature for verification
 * 3. Update database state
 */
export function useHybridBuyKeys(curveId: string, userId: string) {
  const solanaBuy = useSolanaBuyKeys();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyKeys = async (
    twitterHandle: string,
    keys: number,
    solCost: number,
    referrerId?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Execute Solana transaction
      console.log('Step 1: Executing Solana transaction...');
      const txSignature = await solanaBuy.buyKeys(
        twitterHandle,
        solCost,
        referrerId
      );

      console.log('✅ Solana transaction successful:', txSignature);

      // Step 2: Update database with transaction proof
      console.log('Step 2: Updating database...');
      const response = await fetch(`/api/curve/${curveId}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keys,
          userId,
          referrerId,
          // Include transaction signature for verification
          txSignature,
          solCost,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Database update failed');
      }

      const data = await response.json();
      console.log('✅ Database updated successfully');

      return {
        success: true,
        txSignature,
        curve: data.curve,
        holder: data.holder,
        explorerUrl: solanaBuy.explorerUrl,
      };
    } catch (err: any) {
      console.error('Hybrid buy error:', err);
      const errorMessage = err.message || 'Failed to buy keys';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    buyKeys,
    loading: loading || solanaBuy.loading,
    error: error || solanaBuy.error,
    txSignature: solanaBuy.txSignature,
    explorerUrl: solanaBuy.explorerUrl,
  };
}
