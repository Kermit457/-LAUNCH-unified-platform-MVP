import { useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';
import { useSolanaWalletsContext } from '@/components/SolanaWalletManager';
import { getExplorerUrl } from '@/lib/solana/config';

/**
 * Solana transaction hook using Privy's Solana wallet hooks correctly
 * Wallet is auto-created on login via PrivyProvider config
 */
export function useSolanaTransaction() {
  const { ready, wallets, createWallet } = useSolanaWalletsContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const sendTestTransaction = async (amountSol: number = 0.001): Promise<string> => {
    if (!ready) {
      throw new Error('Privy not ready');
    }

    // Ensure an embedded Solana wallet exists for this user
    const wallet = wallets[0] ?? (await createWallet());
    if (!wallet) {
      throw new Error('No Solana wallet available');
    }

    setLoading(true);
    setError(null);
    setTxSignature(null);

    try {
      // Get address from wallet
      const fromPkStr = (wallet as any).address;
      if (!fromPkStr) {
        throw new Error('Cannot get address from wallet');
      }

      const fromPk = new PublicKey(fromPkStr);
      console.log('🚀 Starting transaction from:', fromPkStr);

      // Use devnet connection
      const conn = new Connection('https://api.devnet.solana.com', 'confirmed');

      // Check balance
      const balance = await conn.getBalance(fromPk);
      console.log('Balance:', balance / LAMPORTS_PER_SOL, 'SOL');

      const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);

      if (balance < lamports) {
        throw new Error(`Insufficient balance. You have ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
      }

      // Build transaction
      const recipient = new PublicKey('Faucet4u1RhhrF96MRc8LNNh7pp9RP1oCrzf7aXeFmYi');
      console.log('📦 Building transaction to:', recipient.toString());
      console.log('Amount:', amountSol, 'SOL');

      const { blockhash } = await conn.getLatestBlockhash('confirmed');

      const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: fromPk,
      }).add(
        SystemProgram.transfer({
          fromPubkey: fromPk,
          toPubkey: recipient,
          lamports,
        })
      );

      console.log('✍️ Signing and sending with Privy (devnet)...');

      // Use Privy's signAndSendTransaction - this handles RPC internally
      const result = await (wallet as any).signAndSendTransaction({
        chain: 'solana:devnet',
        transaction: new Uint8Array(
          tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          })
        ),
      });

      console.log('📤 Transaction result:', result);
      console.log('📤 Transaction result type:', typeof result);

      // Extract and convert signature to base58 string
      let sig: string;

      if (typeof result === 'string') {
        // Already a string
        sig = result;
      } else if (result.signature) {
        // Has signature property
        if (typeof result.signature === 'string') {
          sig = result.signature;
        } else if (result.signature instanceof Uint8Array) {
          sig = bs58.encode(result.signature);
        } else {
          // Object with numeric keys (serialized Uint8Array)
          const bytes = new Uint8Array(Object.values(result.signature));
          sig = bs58.encode(bytes);
        }
      } else if (result instanceof Uint8Array) {
        // Result is directly a Uint8Array
        sig = bs58.encode(result);
      } else {
        // Object with numeric keys (serialized Uint8Array)
        const bytes = new Uint8Array(Object.values(result));
        sig = bs58.encode(bytes);
      }

      console.log('✅ Transaction sent:', sig);

      setTxSignature(sig);
      return sig;
    } catch (err: any) {
      console.error('❌ Transaction error:', err);
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getWalletAddress = async () => {
    if (wallets.length === 0) return null;
    try {
      return await wallets[0].exportPublicKey();
    } catch {
      return null;
    }
  };

  return {
    sendTestTransaction,
    loading,
    error,
    txSignature,
    explorerUrl: txSignature ? getExplorerUrl(txSignature, 'tx') : null,
    ready,
    hasWallet: wallets.length > 0,
    getWalletAddress,
  };
}
