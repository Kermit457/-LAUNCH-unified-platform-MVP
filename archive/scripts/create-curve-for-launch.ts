/**
 * Script to create V6 curves for existing launches
 * Run this to initialize curves on devnet before users can buy keys
 */

import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram } from '@solana/web3.js';
import { getCurvePDA, getReserveVaultPDA, getConfigPDA, getBanListPDA } from '../lib/solana/program';

const CURVE_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_CURVE_PROGRAM_ID!);

async function createCurve(twitterHandle: string, creatorKeypair: Keypair) {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com', 'confirmed');

  console.log(`\n📝 Creating curve for: ${twitterHandle}`);

  // Derive PDAs
  const curvePda = getCurvePDA(twitterHandle);
  const reserveVault = getReserveVaultPDA(curvePda);
  const configPda = getConfigPDA();
  const banListPda = getBanListPDA();

  console.log('📍 PDAs:', {
    curve: curvePda.toString(),
    reserve: reserveVault.toString(),
    config: configPda.toString(),
  });

  // Create curve discriminator: sha256("global:create_curve").slice(0, 8)
  const CREATE_CURVE_DISCRIMINATOR = Buffer.from([0x8c, 0x3c, 0x4d, 0x87, 0x5a, 0x91, 0x0b, 0xf8]);

  // Encode twitter handle (string)
  const twitterHandleBytes = Buffer.from(twitterHandle, 'utf-8');
  const twitterHandleLenBuffer = Buffer.alloc(4);
  twitterHandleLenBuffer.writeUInt32LE(twitterHandleBytes.length, 0);

  // Encode curve_type (0 = Standard, 1 = Profile)
  const curveTypeBuffer = Buffer.from([0]); // Standard

  // Encode launch_ts (Option<i64>) - None for now
  const launchTsBuffer = Buffer.from([0]); // None

  const instructionData = Buffer.concat([
    CREATE_CURVE_DISCRIMINATOR,
    twitterHandleLenBuffer,
    twitterHandleBytes,
    curveTypeBuffer,
    launchTsBuffer,
  ]);

  // Build accounts array (matches Rust struct CreateCurve)
  const keys = [
    { pubkey: curvePda, isSigner: false, isWritable: true },
    { pubkey: reserveVault, isSigner: false, isWritable: true },
    { pubkey: creatorKeypair.publicKey, isSigner: true, isWritable: true },
    { pubkey: configPda, isSigner: false, isWritable: false },
    { pubkey: banListPda, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  const instruction = new TransactionInstruction({
    keys,
    programId: CURVE_PROGRAM_ID,
    data: instructionData,
  });

  const transaction = new Transaction().add(instruction);

  const signature = await connection.sendTransaction(transaction, [creatorKeypair]);
  await connection.confirmTransaction(signature, 'confirmed');

  console.log(`✅ Curve created! Signature: ${signature}`);
  console.log(`   View on explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

  return signature;
}

// Example usage
async function main() {
  // You'll need to provide the creator's keypair
  // For testing, you can use your wallet's private key
  const creatorPrivateKey = process.env.CREATOR_PRIVATE_KEY;

  if (!creatorPrivateKey) {
    console.error('❌ Please set CREATOR_PRIVATE_KEY environment variable');
    process.exit(1);
  }

  const creatorKeypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(creatorPrivateKey))
  );

  // Create curves for launches with Twitter handles
  const launchesWithTwitter = [
    'icm_run',       // Example: replace with actual twitter handle
    'gameFiArena',   // Example
    // Add more twitter handles here
  ];

  for (const handle of launchesWithTwitter) {
    try {
      await createCurve(handle, creatorKeypair);
    } catch (error) {
      console.error(`Failed to create curve for ${handle}:`, error);
    }
  }
}

main().catch(console.error);
