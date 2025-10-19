/**
 * On-chain Curve Creation for Auto-CCM System
 *
 * Creates a bonding curve on Solana for new users
 * Uses V6 Anchor program: Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
 */

import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import {
  PublicKey,
  SystemProgram,
  Transaction,
  Connection
} from '@solana/web3.js';
import { connection, CURVE_PROGRAM_ID } from './config';
import { getCurvePDA, getReserveVaultPDA } from './program';
import IDL from '../idl/launchos_curve.json';

/**
 * Config PDA address (needs to be initialized first by admin)
 * This should match your deployed config account
 */
export const CONFIG_SEED = 'config';
export const BAN_LIST_SEED = 'ban_list';

export function getConfigPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from(CONFIG_SEED)],
    CURVE_PROGRAM_ID
  );
  return pda;
}

export function getBanListPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from(BAN_LIST_SEED)],
    CURVE_PROGRAM_ID
  );
  return pda;
}

/**
 * Create a bonding curve on-chain for a user
 * This is called when a new user signs up via Twitter/Privy
 *
 * @param twitterHandle - User's Twitter username (e.g., "elonmusk")
 * @param creatorWallet - User's Solana wallet address
 * @param creatorKeysAmount - Number of keys creator gets (default: 0 for CCM, they buy their own)
 * @returns Transaction to be signed by the user
 */
export async function buildCreateCurveTransaction(
  twitterHandle: string,
  creatorWallet: PublicKey,
  creatorKeysAmount: number = 0 // 0 means creator must buy their own keys
): Promise<Transaction> {

  // Get PDAs
  const curvePDA = getCurvePDA(twitterHandle);
  const reserveVault = getReserveVaultPDA(curvePDA);
  const configPDA = getConfigPDA();

  // Create provider (read-only for building transaction)
  const provider = new AnchorProvider(
    connection,
    {} as any, // No wallet needed for building
    { commitment: 'confirmed' }
  );

  const program = new Program(IDL as any, CURVE_PROGRAM_ID, provider);

  // Build createCurve instruction
  const createCurveIx = await program.methods
    .createCurve(
      twitterHandle,
      new BN(creatorKeysAmount),
      null // No auto-launch timestamp
    )
    .accounts({
      curve: curvePDA,
      reserveVault: reserveVault,
      creator: creatorWallet,
      config: configPDA,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  // Create transaction
  const transaction = new Transaction().add(createCurveIx);

  return transaction;
}

/**
 * Check if a curve already exists on-chain for a Twitter handle
 */
export async function curveExistsOnChain(twitterHandle: string): Promise<boolean> {
  try {
    const curvePDA = getCurvePDA(twitterHandle);
    const provider = new AnchorProvider(
      connection,
      {} as any,
      { commitment: 'confirmed' }
    );
    const program = new Program(IDL as any, CURVE_PROGRAM_ID, provider);

    const curveAccount = await program.account.bondingCurve.fetch(curvePDA);
    return !!curveAccount;
  } catch (error: any) {
    // Account doesn't exist
    if (error.message?.includes('Account does not exist')) {
      return false;
    }
    console.error('Error checking curve existence:', error);
    return false;
  }
}

/**
 * Get the status of a curve (Pending, Active, Frozen, Launched)
 */
export async function getCurveStatus(twitterHandle: string): Promise<'pending' | 'active' | 'frozen' | 'launched' | null> {
  try {
    const curvePDA = getCurvePDA(twitterHandle);
    const provider = new AnchorProvider(
      connection,
      {} as any,
      { commitment: 'confirmed' }
    );
    const program = new Program(IDL as any, CURVE_PROGRAM_ID, provider);

    const curveAccount = await program.account.bondingCurve.fetch(curvePDA) as any;

    if (!curveAccount) return null;

    // Parse the status enum
    if ('pending' in curveAccount.status) return 'pending';
    if ('active' in curveAccount.status) return 'active';
    if ('frozen' in curveAccount.status) return 'frozen';
    if ('launched' in curveAccount.status) return 'launched';

    return null;
  } catch (error: any) {
    if (error.message?.includes('Account does not exist')) {
      return null;
    }
    console.error('Error fetching curve status:', error);
    return null;
  }
}

/**
 * Get user's key holdings for a specific curve
 * Returns 0 if user has never bought keys
 */
export async function getUserKeyHoldings(
  twitterHandle: string,
  userWallet: PublicKey
): Promise<number> {
  try {
    const curvePDA = getCurvePDA(twitterHandle);

    // Derive keyHolder PDA
    const [keyHolderPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('key_holder'),
        curvePDA.toBuffer(),
        userWallet.toBuffer(),
      ],
      CURVE_PROGRAM_ID
    );

    const provider = new AnchorProvider(
      connection,
      {} as any,
      { commitment: 'confirmed' }
    );
    const program = new Program(IDL as any, CURVE_PROGRAM_ID, provider);

    const keyHolderAccount = await program.account.keyHolder.fetch(keyHolderPDA) as any;

    if (!keyHolderAccount) return 0;

    return keyHolderAccount.amount.toNumber();
  } catch (error: any) {
    // Account doesn't exist means 0 keys
    if (error.message?.includes('Account does not exist')) {
      return 0;
    }
    console.error('Error fetching key holdings:', error);
    return 0;
  }
}

/**
 * Example usage:
 *
 * // When user signs up with Twitter
 * const transaction = await buildCreateCurveTransaction(
 *   'elonmusk',
 *   userWallet,
 *   0 // Creator gets 0 keys initially - must buy their own
 * );
 *
 * // User signs and sends transaction
 * const signature = await wallet.signAndSendTransaction(transaction);
 *
 * // Wait for confirmation
 * await connection.confirmTransaction(signature);
 *
 * // Now curve exists on-chain in "Pending" status
 * // User must buy 10+ keys to activate it
 */
