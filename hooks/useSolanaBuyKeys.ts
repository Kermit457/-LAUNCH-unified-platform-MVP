import { useState } from 'react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import bs58 from 'bs58';
import { BN } from '@coral-xyz/anchor';
import { useSolanaWalletsContext } from '@/components/SolanaWalletManager';
import {
  getCurvePDA,
  getReserveVaultPDA,
  getKeyHolderPDA,
  getConfigPDA,
  getBanListPDA,
} from '@/lib/solana/program';
import { connection, getExplorerUrl } from '@/lib/solana/config';

/**
 * Hook to buy keys on Solana blockchain
 * Handles the complete flow: build tx -> sign with Privy -> send to blockchain -> return signature
 */
export function useSolanaBuyKeys() {
  const { ready, wallets, createWallet } = useSolanaWalletsContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const buyKeys = async (
    twitterHandle: string,
    amountSol: number,
    referrerAddress?: string
  ): Promise<string> => {
    if (!ready) {
      throw new Error('Privy not ready');
    }

    // Ensure wallet exists
    const wallet = wallets[0] ?? (await createWallet());
    if (!wallet) {
      throw new Error('No Solana wallet available');
    }

    // Get address from wallet
    const address = (wallet as any).address;
    if (!address) {
      throw new Error('Cannot get address from wallet');
    }

    const publicKey = new PublicKey(address);

    setLoading(true);
    setError(null);
    setTxSignature(null);

    try {
      // Derive PDAs
      const curvePda = getCurvePDA(twitterHandle);
      const reserveVault = getReserveVaultPDA(curvePda);
      const keyHolderPda = getKeyHolderPDA(curvePda, publicKey);
      const configPda = getConfigPDA();
      const banListPda = getBanListPDA();

      // For testing: Skip curve existence check and use simple SOL transfer
      // In production, you would:
      // 1. Check if curve exists on-chain
      // 2. Use actual Anchor program instruction
      console.log('📍 Derived addresses:', {
        curve: curvePda.toString(),
        reserveVault: reserveVault.toString(),
        keyHolder: keyHolderPda.toString(),
      });

      // For now, create a simple SOL transfer as a test transaction
      // This sends SOL to your own wallet (for testing only!)
      const lamports = Math.floor(amountSol * 1_000_000_000); // Convert SOL to lamports

      // For testing, send to a test address or back to yourself
      // In production, this would be the reserve vault
      const testRecipient = new PublicKey('11111111111111111111111111111112'); // System program (will fail but that's ok for demo)

      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: reserveVault, // Using reserve vault PDA
        lamports,
      });

      // Build transaction
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(instruction);

      console.log('✍️ Signing and sending buy transaction with Privy...');

      // Use Privy's signAndSendTransaction - handles signing and broadcasting
      const result = await (wallet as any).signAndSendTransaction({
        chain: 'solana:devnet', // Use devnet for testing
        transaction: new Uint8Array(
          transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          })
        ),
      });

      console.log('📤 Transaction result:', result);
      console.log('📤 Transaction result type:', typeof result);
      console.log('📤 Has signature property:', 'signature' in result);

      // Extract and convert signature to base58 string
      let signature: string;

      if (typeof result === 'string') {
        // Already a string
        signature = result;
      } else if (result.signature) {
        // Has signature property
        if (typeof result.signature === 'string') {
          signature = result.signature;
        } else if (result.signature instanceof Uint8Array) {
          signature = bs58.encode(result.signature);
        } else {
          // Object with numeric keys (serialized Uint8Array)
          const bytes = new Uint8Array(Object.values(result.signature));
          signature = bs58.encode(bytes);
        }
      } else if (result instanceof Uint8Array) {
        // Result is directly a Uint8Array
        signature = bs58.encode(result);
      } else {
        // Object with numeric keys (serialized Uint8Array)
        const bytes = new Uint8Array(Object.values(result));
        signature = bs58.encode(bytes);
      }

      if (!signature) {
        throw new Error('No signature returned from transaction');
      }

      console.log('✅ Keys purchased, signature:', signature);
      setTxSignature(signature);
      return signature;
    } catch (err: any) {
      console.error('Buy keys error:', err);
      const errorMessage = err.message || 'Failed to buy keys';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    buyKeys,
    loading,
    error,
    txSignature,
    explorerUrl: txSignature ? getExplorerUrl(txSignature, 'tx') : null,
  };
}
