/**
 * Combined Curve Creation + Initial Key Purchase
 *
 * This creates a curve AND buys initial keys in ONE transaction
 * User only approves once - much better UX!
 */

import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { connection, CURVE_PROGRAM_ID } from './config';
import { getCurvePDA, getReserveVaultPDA } from './program';
import { getConfigPDA, getBanListPDA } from './create-curve';

/**
 * Build a transaction that creates a curve AND buys initial keys
 * User approves ONE transaction, gets their curve + keys instantly
 *
 * @param twitterHandle - User's Twitter handle
 * @param creatorWallet - User's wallet address
 * @param initialKeysAmount - How many keys to buy (e.g., 10)
 * @returns Transaction ready to sign
 */
export async function buildCreateCurveWithKeysTransaction(
  twitterHandle: string,
  creatorWallet: PublicKey,
  initialKeysAmount: number = 10 // Default: buy 10 keys on creation
): Promise<Transaction> {

  // Get PDAs
  const curvePDA = getCurvePDA(twitterHandle);
  const reserveVault = getReserveVaultPDA(curvePDA);
  const configPDA = getConfigPDA();

  // Note: banList PDA has initialization issues on devnet due to size limits
  // Using a placeholder - the program will skip ban checks if account doesn't exist
  const banListPDA = getBanListPDA();

  // Derive keyHolder PDA for the creator
  const [keyHolderPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('key_holder'),
      curvePDA.toBuffer(),
      creatorWallet.toBuffer(),
    ],
    CURVE_PROGRAM_ID
  );

  console.log('🏗️ Building combined createCurve + buyKeys transaction');
  console.log('  Curve PDA:', curvePDA.toString());
  console.log('  Creator:', creatorWallet.toString());
  console.log('  Initial keys:', initialKeysAmount);

  // Check if config PDA is initialized
  console.log('🔍 Checking config PDA:', configPDA.toString());
  const configAccount = await connection.getAccountInfo(configPDA);
  if (!configAccount) {
    throw new Error(`Config PDA not initialized. Admin must run 'initialize' instruction first. Config PDA: ${configPDA.toString()}`);
  }
  console.log('✅ Config PDA exists');

  // Parse config to get treasury addresses
  // Config structure: platformTreasury (32), buybackWallet (32), communityWallet (32), ...
  const platformTreasury = new PublicKey(configAccount.data.slice(8, 40));
  const buybackWallet = new PublicKey(configAccount.data.slice(40, 72));
  const communityWallet = new PublicKey(configAccount.data.slice(72, 104));

  console.log('💰 Treasury addresses:', {
    platform: platformTreasury.toString(),
    buyback: buybackWallet.toString(),
    community: communityWallet.toString(),
  });

  // ==========================================
  // INSTRUCTION 1: createCurve
  // ==========================================

  // Discriminator: sha256("global:createCurve")[0..8]
  const createCurveDiscriminator = Buffer.from([69, 93, 198, 110, 244, 111, 99, 238]);

  // Serialize createCurve args: twitterHandle (string), creatorKeysAmount (u64), launchTs (Option<i64>)
  const twitterHandleBytes = Buffer.from(twitterHandle, 'utf-8');
  const twitterHandleLenBytes = Buffer.alloc(4);
  twitterHandleLenBytes.writeUInt32LE(twitterHandleBytes.length, 0);

  // Creator gets 0 keys from createCurve - they buy via buyKeys instead
  const creatorKeysAmountBytes = Buffer.alloc(8);
  new BN(0).toArrayLike(Buffer, 'le', 8).copy(creatorKeysAmountBytes);

  // No auto-launch timestamp
  const launchTsBytes = Buffer.from([0x00]);

  const createCurveData = Buffer.concat([
    createCurveDiscriminator,
    twitterHandleLenBytes,
    twitterHandleBytes,
    creatorKeysAmountBytes,
    launchTsBytes
  ]);

  const createCurveIx = new TransactionInstruction({
    keys: [
      { pubkey: curvePDA, isSigner: false, isWritable: true },
      { pubkey: reserveVault, isSigner: false, isWritable: true },
      { pubkey: creatorWallet, isSigner: true, isWritable: true },
      { pubkey: configPDA, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: CURVE_PROGRAM_ID,
    data: createCurveData,
  });

  // ==========================================
  // INSTRUCTION 2: buyKeys
  // ==========================================

  // Discriminator: sha256("global:buyKeys")[0..8]
  const buyKeysDiscriminator = Buffer.from([19, 189, 101, 44, 27, 249, 186, 146]);

  // Serialize buyKeys args: amount (u64), referrer (Option<Pubkey>)
  const amountBytes = Buffer.alloc(8);
  new BN(initialKeysAmount).toArrayLike(Buffer, 'le', 8).copy(amountBytes);

  // No referrer
  const referrerBytes = Buffer.from([0x00]);

  const buyKeysData = Buffer.concat([
    buyKeysDiscriminator,
    amountBytes,
    referrerBytes
  ]);

  const buyKeysIx = new TransactionInstruction({
    keys: [
      { pubkey: curvePDA, isSigner: false, isWritable: true },
      { pubkey: reserveVault, isSigner: false, isWritable: true },
      { pubkey: keyHolderPDA, isSigner: false, isWritable: true },
      { pubkey: creatorWallet, isSigner: true, isWritable: true },
      { pubkey: creatorWallet, isSigner: false, isWritable: true }, // creator (receives fees)
      { pubkey: platformTreasury, isSigner: false, isWritable: true },
      { pubkey: buybackWallet, isSigner: false, isWritable: true },
      { pubkey: communityWallet, isSigner: false, isWritable: true },
      // referrer is optional - we're not including it
      { pubkey: configPDA, isSigner: false, isWritable: false },
      { pubkey: banListPDA, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: CURVE_PROGRAM_ID,
    data: buyKeysData,
  });

  // ==========================================
  // Combine into single transaction
  // ==========================================

  const transaction = new Transaction()
    .add(createCurveIx)
    .add(buyKeysIx);

  console.log('✅ Built combined transaction with 2 instructions');

  return transaction;
}

/**
 * Calculate cost to buy initial keys (approximate)
 * This is for UI display only - actual cost calculated on-chain
 */
export function estimateInitialKeysCost(keysAmount: number): number {
  // Very rough estimate based on bonding curve
  // Price = supply^2 / 1_000_000_000
  // For first 10 keys: ~0.0001 SOL
  return keysAmount * 0.00001; // Rough estimate
}
