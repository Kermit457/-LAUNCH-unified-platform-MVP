import { useState } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, useCreateWallet } from '@privy-io/react-auth/solana';
import { buildCreateCurveTransaction, curveExistsOnChain } from '@/lib/solana/create-curve';
import { connection } from '@/lib/solana/config';

/**
 * Hook to create a bonding curve on-chain for a user
 * Called during auto-CCM creation when user signs up
 */
export function useCreateCurve() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();
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
  const createCurve = async (params: {
    name?: string;
    symbol?: string;
    description?: string;
    logoFile?: File;
    scope?: string;
    platforms?: string[];
    twitterHandle?: string;
    creatorKeysAmount?: number;
  }): Promise<string> => {
    const { twitterHandle = 'default', creatorKeysAmount = 0 } = params;

    console.log('🎯 CreateCurve called with params:', params);
    console.log('🎯 Twitter handle being used:', twitterHandle);

    if (!ready) {
      throw new Error('Privy not ready. Please wait a moment and try again.');
    }

    // Ensure user has a Solana wallet
    console.log('🔍 All wallets:', wallets);
    console.log('🔍 Number of wallets:', wallets.length);

    let wallet = wallets.find(w => w.walletClientType === 'privy');

    if (!wallet) {
      // No Privy wallet found, use first available wallet or create one
      if (wallets.length > 0) {
        console.log('✅ Using first available wallet');
        wallet = wallets[0];
      } else {
        // No wallets at all, need to create one
        console.log('⚠️ No wallets found, creating new wallet...');
        try {
          wallet = await createWallet();
          console.log('✅ Created new wallet:', wallet);
        } catch (createError: any) {
          // If creation fails because wallet exists, try to get wallets again
          if (createError.message?.includes('already has')) {
            console.log('⚠️ Wallet exists but not in list, retrying...');
            // Wait a moment for wallet to appear
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Get fresh wallet list
            if (wallets.length > 0) {
              wallet = wallets[0];
            } else {
              throw new Error('Wallet exists but could not be retrieved. Please refresh the page.');
            }
          } else {
            throw createError;
          }
        }
      }
    }

    if (!wallet) {
      throw new Error('No Solana wallet available');
    }

    console.log('✅ Selected wallet:', wallet);

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
      });

      // Check if curve already exists
      const exists = await curveExistsOnChain(twitterHandle);
      if (exists) {
        console.log('✅ Curve already exists for:', twitterHandle);
        return 'already_exists';
      }

      // Build the createCurve transaction
      // Note: BanList PDA has issues on devnet, so we're just creating the curve
      // Users will buy keys in a separate transaction
      const transaction = await buildCreateCurveTransaction(
        twitterHandle,
        creatorPubkey,
        0 // No initial keys - buy separately
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = creatorPubkey;

      console.log('✍️ Signing and sending createCurve transaction...');

      // NOTE: Skipping simulation because deployed program has ban_list requirement
      // that cannot be satisfied on devnet. We'll try sending directly.
      console.log('⚠️  Skipping simulation - trying direct send (ban_list issue)');
      console.log('  Transaction has', transaction.instructions.length, 'instructions');
      console.log('  Fee payer:', transaction.feePayer?.toString());

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
    isCreating: loading,
    error,
    txSignature,
  };
}
