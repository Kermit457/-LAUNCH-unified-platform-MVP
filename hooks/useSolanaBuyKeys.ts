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
 * Hook to buy keys on Solana blockchain using V6 Anchor program
 * REAL IMPLEMENTATION - Calls actual curve smart contract
 *
 * V6 Contract: Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
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
    keysAmount: number,
    referrerAddress?: string
  ): Promise<string> => {
    if (!ready || !authenticated) {
      throw new Error('Please connect your wallet first');
    }

    // Get the Solana wallet
    console.log('🔍 Available Solana wallets:', wallets);
    console.log('🔍 Number of Solana wallets:', wallets.length);

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
      console.log('🚀 Building BUY instruction for V6 curve...');
      console.log('   Twitter:', twitterHandle);
      console.log('   Keys to buy:', keysAmount);
      console.log('   V6 Program ID:', CURVE_PROGRAM_ID.toString());

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
        config: configPda.toString(),
        banList: banListPda.toString(),
      });

      // Anchor discriminator for buy_keys instruction
      // This is the first 8 bytes of sha256("global:buy_keys")
      const BUY_KEYS_DISCRIMINATOR = Buffer.from([
        0x66, 0x06, 0x3d, 0x12, 0x01, 0xda, 0xeb, 0xea
      ]);

      // Encode the instruction data
      // buy_keys(amount: u64, referrer: Option<Pubkey>)
      const amountBuffer = Buffer.alloc(8);
      amountBuffer.writeBigUInt64LE(BigInt(keysAmount));

      // Optional referrer (1 byte for Some/None + 32 bytes for pubkey if Some)
      let referrerBuffer: Buffer;
      if (referrerAddress) {
        referrerBuffer = Buffer.concat([
          Buffer.from([1]), // Some(Pubkey)
          new PublicKey(referrerAddress).toBuffer()
        ]);
      } else {
        referrerBuffer = Buffer.from([0]); // None
      }

      const instructionData = Buffer.concat([
        BUY_KEYS_DISCRIMINATOR,
        amountBuffer,
        referrerBuffer
      ]);

      console.log('📦 Instruction data length:', instructionData.length);

      // First, fetch the curve account to get fee wallet addresses
      const curveAccount = await connection.getAccountInfo(curvePda);
      if (!curveAccount) {
        throw new Error(`Curve does not exist for twitter handle: ${twitterHandle}. Please create it first with create_curve.`);
      }

      // Deserialize curve data to get creator and fee wallets
      // BondingCurve starts at offset 8 (discriminator)
      const curveData = curveAccount.data;
      const creator = new PublicKey(curveData.slice(8, 40)); // creator pubkey (32 bytes after discriminator)
      // Note: We'll need to properly deserialize the full curve account
      // For now, we'll use placeholder addresses that match the config

      // Get config to read platform wallets
      const configAccount = await connection.getAccountInfo(configPda);
      if (!configAccount) {
        throw new Error('Config account not found. Program not initialized?');
      }

      // Parse config for platform wallets (simplified - proper deserialization needed)
      const platformTreasury = new PublicKey(configAccount.data.slice(40, 72));
      const buybackWallet = new PublicKey(configAccount.data.slice(72, 104));
      const communityWallet = new PublicKey(configAccount.data.slice(104, 136));

      // Build the accounts array (order matches Rust struct BuyKeys EXACTLY!)
      const keys = [
        { pubkey: curvePda, isSigner: false, isWritable: true },                 // 1. curve
        { pubkey: reserveVault, isSigner: false, isWritable: true },            // 2. reserve_vault
        { pubkey: keyHolderPda, isSigner: false, isWritable: true },            // 3. key_holder
        { pubkey: publicKey, isSigner: true, isWritable: true },                // 4. buyer (signer)
        { pubkey: creator, isSigner: false, isWritable: true },                 // 5. creator
        { pubkey: platformTreasury, isSigner: false, isWritable: true },        // 6. platform_treasury
        { pubkey: buybackWallet, isSigner: false, isWritable: true },           // 7. buyback_wallet
        { pubkey: communityWallet, isSigner: false, isWritable: true },         // 8. community_wallet
        // 9. referrer is handled in instruction data (Option<Pubkey>), not as separate account
        { pubkey: configPda, isSigner: false, isWritable: false },              // 10. config
        { pubkey: banListPda, isSigner: false, isWritable: false },             // 11. ban_list
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 12. system_program
      ];

      console.log('🏦 Fee distribution accounts:', {
        creator: creator.toString(),
        platformTreasury: platformTreasury.toString(),
        buyback: buybackWallet.toString(),
        community: communityWallet.toString(),
      });

      // Create the instruction
      const instruction = new TransactionInstruction({
        keys,
        programId: CURVE_PROGRAM_ID,
        data: instructionData,
      });

      console.log('📝 Built buy_keys instruction for V6 contract');

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');

      // Build transaction
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

      // Get the network from environment
      const solanaNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
      const chainId = `solana:${solanaNetwork}` as 'solana:devnet' | 'solana:mainnet' | 'solana:testnet';

      // Sign with Privy
      let signResult;
      try {
        signResult = await signTransaction({
          transaction: serializedTx,
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

      // Send the signed transaction via our own RPC connection
      const signature = await connection.sendRawTransaction(signResult.signedTransaction, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });

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

      console.log('✅ Keys purchased via V6 smart contract!');
      console.log('   Signature:', signature);
      console.log('   Explorer:', getExplorerUrl(signature, 'tx'));

      setTxSignature(signature);
      return signature;
    } catch (err: any) {
      console.error('❌ Buy keys error:', err);
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
