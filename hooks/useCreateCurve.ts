import { useState } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { useSolanaWalletsContext } from '@/components/SolanaWalletManager';
import { buildCreateCurveTransaction, curveExistsOnChain } from '@/lib/solana/create-curve';
import { connection } from '@/lib/solana/config';

/**
 * Hook to create a bonding curve on-chain for a user
 * Called during auto-CCM creation when user signs up
 */
export function useCreateCurve() {
  const { ready, wallets, createWallet } = useSolanaWalletsContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  /**
   * Create a curve on-chain for a user
   *
   * @param twitterHandle - User's Twitter handle (e.g., "elonmusk")
   * @param creatorKeysAmount - Number of keys creator gets initially (default: 0, they must buy their own)
   * @returns Transaction signature if successful
   */
  const createCurve = async (
    twitterHandle: string,
    creatorKeysAmount: number = 0
  ): Promise<string> => {
    if (!ready) {
      throw new Error('Privy not ready');
    }

    // Ensure user has a Solana wallet
    const wallet = wallets[0] ?? (await createWallet());
    if (!wallet) {
      throw new Error('No Solana wallet available');
    }

    setLoading(true);
    setError(null);
    setTxSignature(null);

    try {
      // Get wallet address
      const walletAddress = (wallet as any).address;
      if (!walletAddress) {
        throw new Error('Cannot get address from wallet');
      }

      const creatorPubkey = new PublicKey(walletAddress);

      console.log('🎨 Creating curve on-chain:', {
        twitterHandle,
        creator: creatorPubkey.toString(),
        initialKeys: creatorKeysAmount
      });

      // Check if curve already exists
      const exists = await curveExistsOnChain(twitterHandle);
      if (exists) {
        console.log('✅ Curve already exists for:', twitterHandle);
        return 'already_exists';
      }

      // Build the createCurve transaction
      const transaction = await buildCreateCurveTransaction(
        twitterHandle,
        creatorPubkey,
        creatorKeysAmount
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = creatorPubkey;

      console.log('✍️ Signing and sending createCurve transaction...');

      // Sign and send with Privy
      const result = await (wallet as any).signAndSendTransaction({
        chain: 'solana:devnet',
        transaction: new Uint8Array(
          transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          })
        ),
      });

      console.log('📤 Transaction result:', result);

      // Extract signature
      let sig: string;
      if (typeof result === 'string') {
        sig = result;
      } else if (result.signature) {
        if (typeof result.signature === 'string') {
          sig = result.signature;
        } else if (result.signature instanceof Uint8Array) {
          sig = bs58.encode(result.signature);
        } else {
          sig = String(result.signature);
        }
      } else if (result instanceof Uint8Array) {
        sig = bs58.encode(result);
      } else {
        sig = String(result);
      }

      console.log('🎉 Curve created! Signature:', sig);
      console.log('🔗 Explorer:', `https://explorer.solana.com/tx/${sig}?cluster=devnet`);

      setTxSignature(sig);

      // Wait for confirmation
      console.log('⏳ Waiting for confirmation...');
      await connection.confirmTransaction(sig, 'confirmed');
      console.log('✅ Transaction confirmed!');

      return sig;

    } catch (err: any) {
      console.error('❌ Failed to create curve:', err);
      const errorMessage = err.message || 'Failed to create curve';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCurve,
    loading,
    error,
    txSignature,
  };
}
