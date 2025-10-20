import { useState } from 'react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSolanaWallet } from './useSolanaWallet';
import { connection, getExplorerUrl } from '@/lib/solana/config';

/**
 * Simple test hook to verify Privy Solana wallet signing works
 * Sends a small amount of SOL to a test address
 */
export function useTestSolanaTransaction() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
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

      // Send to a devnet test wallet (Solana's devnet faucet)
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

      // Get the Solana wallet from Privy
      // Debug: log all wallets to see the structure
      console.log('All wallets:', wallets.map(w => ({
        address: w.address,
        chainType: w.chainType,
        walletClientType: w.walletClientType
      })));
      console.log('Looking for address:', address);

      // Try multiple filters to find the Solana wallet
      let solanaWallet = wallets.find((w) => w.address === address);

      if (!solanaWallet) {
        // Try by chain type only
        solanaWallet = wallets.find((w) => w.chainType === 'solana');
      }

      if (!solanaWallet) {
        throw new Error(
          'Solana wallet not found in Privy. ' +
          `Found ${wallets.length} wallets but none match address ${address}. ` +
          'Make sure you have a Solana embedded wallet.'
        );
      }

      console.log('Using wallet:', {
        address: solanaWallet.address,
        chainType: solanaWallet.chainType
      });

      // Sign and send with Privy
      console.log('✍️ Signing and sending transaction...');
      const result = await solanaWallet.signAndSendTransaction({
        chain: 'solana:devnet',
        transaction: new Uint8Array(
          transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          })
        ),
      });

      // Extract signature
      const signature = typeof result === 'string' ? result : result.signature;

      if (!signature) {
        throw new Error('No signature returned from transaction');
      }

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
