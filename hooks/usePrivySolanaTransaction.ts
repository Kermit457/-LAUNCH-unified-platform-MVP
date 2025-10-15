import { useState } from 'react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallet } from './useSolanaWallet';
import { connection, getExplorerUrl } from '@/lib/solana/config';

/**
 * Solana transaction hook using Privy's embedded wallet via user.linkedAccounts
 * This approach works with custom context providers
 */
export function usePrivySolanaTransaction() {
  const { ready, authenticated, user } = usePrivy();
  const { publicKey, address, wallet } = useSolanaWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const sendTestTransaction = async (amountSol: number = 0.001): Promise<string> => {
    if (!ready || !authenticated) {
      throw new Error('Please log in first');
    }

    if (!publicKey || !address || !wallet) {
      throw new Error('Solana wallet not connected');
    }

    setLoading(true);
    setError(null);
    setTxSignature(null);

    try {
      console.log('🚀 Starting test transaction...');
      console.log('From:', publicKey.toString());
      console.log('Wallet account:', wallet);

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

      console.log('📝 Transaction built');

      // Serialize the transaction
      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      console.log('✍️ Requesting signature from Privy embedded wallet...');

      // Try to sign using the wallet account's sign method if available
      // Different Privy versions may have different APIs
      if (typeof (wallet.account as any).signTransaction === 'function') {
        console.log('Using wallet.account.signTransaction method');
        const signed = await (wallet.account as any).signTransaction(serializedTx);
        const sig = await connection.sendRawTransaction(signed);

        console.log('✅ Transaction sent:', sig);

        const confirmation = await connection.confirmTransaction({
          signature: sig,
          blockhash,
          lastValidBlockHeight,
        }, 'confirmed');

        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        }

        setTxSignature(sig);
        return sig;
      }

      // Fallback: Try using Privy's RPC method
      console.log('Trying Privy RPC method...');

      // This requires making an RPC call to Privy's API
      // For now, throw an informative error
      throw new Error(
        'Direct transaction signing not available. ' +
        'The wallet account does not have a signTransaction method. ' +
        'You may need to use a different Privy API method or upgrade to the latest Privy SDK.'
      );

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
