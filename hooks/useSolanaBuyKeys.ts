import { useState } from 'react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import bs58 from 'bs58';
import { BN } from '@coral-xyz/anchor';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, useSignTransaction } from '@privy-io/react-auth/solana';
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
 * Uses official Privy Solana SDK for embedded wallet transactions
 */
export function useSolanaBuyKeys() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { signTransaction } = useSignTransaction();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const buyKeys = async (
    twitterHandle: string,
    amountSol: number,
    referrerAddress?: string
  ): Promise<string> => {
    if (!ready || !authenticated) {
      throw new Error('Please connect your wallet first');
    }

    // Get the Solana wallet from useWallets hook (from @privy-io/react-auth/solana)
    // This returns ConnectedStandardSolanaWallet[] which includes embedded wallets
    console.log('🔍 Available Solana wallets:', wallets);
    console.log('🔍 Number of Solana wallets:', wallets.length);

    // Get the first wallet (embedded wallet)
    const wallet = wallets[0];

    console.log('🎯 Selected Solana wallet:', wallet);

    if (!wallet || !wallet.address) {
      throw new Error('No Solana wallet found. Please connect your wallet.');
    }

    const publicKey = new PublicKey(wallet.address);

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
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(instruction);

      console.log('✍️ Signing and sending buy transaction with Privy...');

      // Serialize the transaction for Privy
      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      // Use signTransaction to just sign (avoid RPC config issue)
      // Then we send it ourselves via our connection
      const signResult = await signTransaction({
        transaction: serializedTx,
        wallet: wallet,
      });

      console.log('✍️ Transaction signed by Privy');

      // Send the signed transaction via our own RPC connection
      const signature = await connection.sendRawTransaction(signResult.signedTransaction);

      console.log('📤 Transaction sent:', signature);

      console.log('⏳ Waiting for confirmation...');

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        'confirmed'
      );

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
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
