import { useState } from 'react';
import { PublicKey, Transaction, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, useSignTransaction } from '@privy-io/react-auth/solana';
import {
  getCurvePDA,
  getReserveVaultPDA,
  getKeyHolderPDA,
  getConfigPDA,
  getBanListPDA,
} from '@/lib/solana/program';
import { connection, getExplorerUrl, CURVE_PROGRAM_ID } from '@/lib/solana/config';

/**
 * Hook to sell keys on Solana blockchain using V6 Anchor program
 * REAL IMPLEMENTATION - Calls actual curve smart contract
 */
export function useSolanaSellKeys() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { signTransaction } = useSignTransaction();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const sellKeys = async (
    twitterHandle: string,
    keysAmount: number,
    referrerAddress?: string
  ): Promise<string> => {
    if (!ready || !authenticated) {
      throw new Error('Please connect your wallet first');
    }

    // Get the Solana wallet
    console.log('🔍 Available Solana wallets:', wallets);
    const wallet = wallets[0];

    if (!wallet || !wallet.address) {
      throw new Error('No Solana wallet found. Please connect your wallet.');
    }

    const publicKey = new PublicKey(wallet.address);

    setLoading(true);
    setError(null);
    setTxSignature(null);

    try {
      console.log('🚀 Building SELL instruction for V6 curve...');
      console.log('   Twitter:', twitterHandle);
      console.log('   Keys to sell:', keysAmount);

      // Derive PDAs
      const curvePda = getCurvePDA(twitterHandle);
      const reserveVault = getReserveVaultPDA(curvePda);
      const keyHolderPda = getKeyHolderPDA(curvePda, publicKey);
      const configPda = getConfigPDA();
      const banListPda = getBanListPDA();

      console.log('📍 Derived addresses:', {
        curve: curvePda.toString(),
        reserveVault: reserveVault.toString(),
        keyHolder: keyHolderPda.toString(),
      });

      // We don't need the full program for building the instruction
      // We'll build it manually using the IDL
      console.log('📝 Building sell_keys instruction manually...');

      // Anchor discriminator for sell_keys (first 8 bytes of sha256("global:sell_keys"))
      // You can get this from the IDL or by running: anchor idl parse
      const SELL_KEYS_DISCRIMINATOR = Buffer.from([
        0x8e, 0x3f, 0x5a, 0x7c, 0x59, 0x4a, 0x4f, 0x6e
      ]);

      // Encode the instruction data
      // sell_keys(amount: u64, referrer: Option<Pubkey>)
      const amountBuffer = Buffer.alloc(8);
      amountBuffer.writeBigUInt64LE(BigInt(keysAmount));

      // Optional referrer (1 byte for Some/None + 32 bytes for pubkey if Some)
      let referrerBuffer: Buffer;
      if (referrerAddress) {
        referrerBuffer = Buffer.concat([
          Buffer.from([1]), // Some
          new PublicKey(referrerAddress).toBuffer()
        ]);
      } else {
        referrerBuffer = Buffer.from([0]); // None
      }

      const instructionData = Buffer.concat([
        SELL_KEYS_DISCRIMINATOR,
        amountBuffer,
        referrerBuffer
      ]);

      // Build the accounts array
      const keys = [
        { pubkey: curvePda, isSigner: false, isWritable: true },
        { pubkey: keyHolderPda, isSigner: false, isWritable: true },
        { pubkey: publicKey, isSigner: true, isWritable: true },
        { pubkey: reserveVault, isSigner: false, isWritable: true },
        { pubkey: configPda, isSigner: false, isWritable: false },
        { pubkey: banListPda, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ];

      // Create the instruction
      const instruction = new TransactionInstruction({
        keys,
        programId: CURVE_PROGRAM_ID,
        data: instructionData,
      });

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

      // Build transaction
      const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(instruction);

      console.log('✍️ Signing sell transaction with Privy...');

      // Sign the transaction
      const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false });
      const solanaNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
      const chainId = `solana:${solanaNetwork}` as 'solana:devnet' | 'solana:mainnet' | 'solana:testnet';

      let signResult;
      try {
        signResult = await signTransaction({
          transaction: serialized,
          wallet: wallet,
          chain: chainId,
        });
      } catch (signError: any) {
        console.error('Privy signing error:', signError);
        if (signError.message?.includes('abort') || signError.name === 'AbortError') {
          throw new Error('Transaction signing was cancelled. Please try again.');
        }
        throw signError;
      }

      console.log('✍️ Transaction signed by Privy');

      // Send the signed transaction
      const signature = await connection.sendRawTransaction(signResult.signedTransaction, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });

      console.log('📤 Sell transaction sent:', signature);
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

      console.log('✅ Keys sold via smart contract!');
      console.log('   Signature:', signature);
      console.log('   Explorer:', getExplorerUrl(signature, 'tx'));

      setTxSignature(signature);
      return signature;
    } catch (err: any) {
      console.error('❌ Sell keys error:', err);
      const errorMessage = err.message || 'Failed to sell keys';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sellKeys,
    loading,
    error,
    txSignature,
    explorerUrl: txSignature ? getExplorerUrl(txSignature, 'tx') : null,
  };
}
