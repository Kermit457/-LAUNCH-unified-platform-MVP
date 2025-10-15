import { useState } from 'react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallet } from './useSolanaWallet';
import { connection, getExplorerUrl } from '@/lib/solana/config';

/**
 * Simple Solana transaction hook using Privy's sendTransaction method
 * This avoids the useWallets context issue
 */
export function useSimpleSolanaTransaction() {
  const { ready, authenticated, sendTransaction } = usePrivy();
  const { publicKey, address } = useSolanaWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const sendTestTransaction = async (amountSol: number = 0.001): Promise<string> => {
    if (!ready || !authenticated) {
      throw new Error('Please log in first');
    }

    if (!publicKey || !address) {
      throw new Error('Solana wallet not connected');
    }

    if (!sendTransaction) {
      throw new Error('Privy sendTransaction method not available');
    }

    setLoading(true);
    setError(null);
    setTxSignature(null);

    try {
      console.log('🚀 Starting test transaction...');
      console.log('From:', publicKey.toString());

      // Check balance first
      const balance = await connection.getBalance(publicKey);
      console.log('Balance:', balance / LAMPORTS_PER_SOL, 'SOL');

      if (balance < amountSol * LAMPORTS_PER_SOL) {
        throw new Error(`Insufficient balance. You have ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
      }

      // Send to a devnet test wallet
      const testRecipient = new PublicKey('Faucet4u1RhhrF96MRc8LNNh7pp9RP1oCrzf7aXeFmYi');
      const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

      console.log('To:', testRecipient.toString());
      console.log('Amount:', amountSol, 'SOL');

      // Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: testRecipient,
        lamports,
      });

      // Build transaction
      const transaction = new Transaction().add(instruction);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      console.log('📝 Transaction built, signing with Privy...');

      // Use Privy's sendTransaction method
      // This should work without needing useWallets
      const uiConfig = {
        header: 'Send Test Transaction',
        description: `Send ${amountSol} SOL to test wallet`,
        buttonText: 'Confirm',
      };

      console.log('✍️ Requesting signature from Privy...');

      // Privy's sendTransaction expects a UnsignedTransaction object
      const result = await sendTransaction(transaction, uiConfig);

      if (!result || !result.transactionHash) {
        throw new Error('No transaction hash returned from Privy');
      }

      const signature = result.transactionHash;
      console.log('✅ Transaction sent:', signature);

      // Wait for confirmation
      console.log('⏳ Waiting for confirmation...');
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

      console.log('🎉 Transaction confirmed!');
      setTxSignature(signature);
      return signature;
    } catch (err: any) {
      console.error('❌ Transaction error:', err);
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendTestTransaction,
    loading,
    error,
    txSignature,
    explorerUrl: txSignature ? getExplorerUrl(txSignature, 'tx') : null,
  };
}
