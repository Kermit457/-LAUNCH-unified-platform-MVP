import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { CURVE_PROGRAM_ID } from './config';

/**
 * Build a buyKeys instruction manually using the IDL structure
 * This allows us to create transactions without needing a full Anchor provider
 */
export function createBuyKeysInstruction(
  amount: BN,
  referrer: PublicKey | null,
  accounts: {
    curve: PublicKey;
    reserveVault: PublicKey;
    keyHolder: PublicKey;
    buyer: PublicKey;
    creator: PublicKey;
    platformTreasury: PublicKey;
    buybackWallet: PublicKey;
    communityWallet: PublicKey;
    config: PublicKey;
    banList: PublicKey;
  }
): TransactionInstruction {
  // Instruction discriminator for "buyKeys" (first 8 bytes of SHA256 hash of "global:buy_keys")
  // This is how Anchor identifies instructions
  // You'll need to calculate this from your program's IDL
  // For now, using placeholder bytes - REPLACE WITH ACTUAL DISCRIMINATOR
  const discriminator = Buffer.from([0x66, 0x06, 0x3d, 0x12, 0x01, 0xda, 0xeb, 0xea]);

  // Serialize the amount (u64, 8 bytes little-endian)
  const amountBuffer = Buffer.alloc(8);
  amountBuffer.writeBigUInt64LE(BigInt(amount.toString()), 0);

  // Serialize the referrer (Option<Pubkey>)
  let referrerBuffer: Buffer;
  if (referrer) {
    // 1 byte for Some(1) + 32 bytes for pubkey
    referrerBuffer = Buffer.concat([Buffer.from([1]), referrer.toBuffer()]);
  } else {
    // 1 byte for None(0)
    referrerBuffer = Buffer.from([0]);
  }

  // Combine into instruction data
  const data = Buffer.concat([discriminator, amountBuffer, referrerBuffer]);

  // Build account metas
  const keys = [
    { pubkey: accounts.curve, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveVault, isSigner: false, isWritable: true },
    { pubkey: accounts.keyHolder, isSigner: false, isWritable: true },
    { pubkey: accounts.buyer, isSigner: true, isWritable: true },
    { pubkey: accounts.creator, isSigner: false, isWritable: true },
    { pubkey: accounts.platformTreasury, isSigner: false, isWritable: true },
    { pubkey: accounts.buybackWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.communityWallet, isSigner: false, isWritable: true },
  ];

  // Add referrer account if provided
  if (referrer) {
    keys.push({ pubkey: referrer, isSigner: false, isWritable: true });
  }

  // Add remaining accounts
  keys.push(
    { pubkey: accounts.config, isSigner: false, isWritable: false },
    { pubkey: accounts.banList, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
  );

  return new TransactionInstruction({
    keys,
    programId: CURVE_PROGRAM_ID,
    data,
  });
}

/**
 * Build a sellKeys instruction manually
 */
export function createSellKeysInstruction(
  amount: BN,
  referrer: PublicKey | null,
  accounts: {
    curve: PublicKey;
    reserveVault: PublicKey;
    keyHolder: PublicKey;
    seller: PublicKey;
    creator: PublicKey;
    platformTreasury: PublicKey;
    buybackWallet: PublicKey;
    communityWallet: PublicKey;
  }
): TransactionInstruction {
  // Instruction discriminator for "sellKeys"
  // REPLACE WITH ACTUAL DISCRIMINATOR from your program
  const discriminator = Buffer.from([0x51, 0x23, 0x04, 0xc9, 0x22, 0x71, 0xa8, 0xb9]);

  // Serialize amount
  const amountBuffer = Buffer.alloc(8);
  amountBuffer.writeBigUInt64LE(BigInt(amount.toString()), 0);

  // Serialize referrer
  let referrerBuffer: Buffer;
  if (referrer) {
    referrerBuffer = Buffer.concat([Buffer.from([1]), referrer.toBuffer()]);
  } else {
    referrerBuffer = Buffer.from([0]);
  }

  const data = Buffer.concat([discriminator, amountBuffer, referrerBuffer]);

  const keys = [
    { pubkey: accounts.curve, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveVault, isSigner: false, isWritable: true },
    { pubkey: accounts.keyHolder, isSigner: false, isWritable: true },
    { pubkey: accounts.seller, isSigner: true, isWritable: true },
    { pubkey: accounts.creator, isSigner: false, isWritable: true },
    { pubkey: accounts.platformTreasury, isSigner: false, isWritable: true },
    { pubkey: accounts.buybackWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.communityWallet, isSigner: false, isWritable: true },
  ];

  if (referrer) {
    keys.push({ pubkey: referrer, isSigner: false, isWritable: true });
  }

  keys.push({ pubkey: SystemProgram.programId, isSigner: false, isWritable: false });

  return new TransactionInstruction({
    keys,
    programId: CURVE_PROGRAM_ID,
    data,
  });
}

/**
 * Helper to calculate instruction discriminator from method name
 * Anchor uses: first 8 bytes of SHA256("global:<method_name>")
 */
export async function calculateDiscriminator(methodName: string): Promise<Buffer> {
  const preimage = `global:${methodName}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(preimage);

  // Use Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);

  // Return first 8 bytes
  return Buffer.from(hashArray.slice(0, 8));
}
