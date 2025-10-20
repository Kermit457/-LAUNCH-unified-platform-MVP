/**
 * Create minimal empty ban_list account using System Program directly
 * This bypasses the program's initialize instruction
 */

import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import fs from 'fs';
import { createHash } from 'crypto';

const PROGRAM_ID = new PublicKey('Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF');
const RPC_URL = 'https://api.devnet.solana.com';
const ADMIN_KEYPAIR_PATH = 'C:\\Users\\mirko\\.config\\solana\\devnet.json';

async function createMinimalBanList() {
  console.log('🚀 Creating minimal BanList account\n');

  const keypairData = JSON.parse(fs.readFileSync(ADMIN_KEYPAIR_PATH, 'utf-8'));
  const adminKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
  const connection = new Connection(RPC_URL, 'confirmed');

  // Get BanList PDA
  const [banListPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('ban_list')],
    PROGRAM_ID
  );

  console.log('📍 BanList PDA:', banListPDA.toString());
  console.log('🔑 Bump:', bump);
  console.log('👤 Admin:', adminKeypair.publicKey.toString());
  console.log('');

  // Check if exists
  const existing = await connection.getAccountInfo(banListPDA);
  if (existing) {
    console.log('✅ BanList already exists!');
    console.log('   Owner:', existing.owner.toString());
    console.log('   Size:', existing.data.length, 'bytes');
    console.log('   Data:', existing.data.toString('hex').substring(0, 100) + '...');
    return;
  }

  // Calculate minimum size for empty BanList
  // discriminator (8) + authority (32) + vec_length (4) + bump (1) = 45 bytes
  const minSize = 45;
  const lamports = await connection.getMinimumBalanceForRentExemption(minSize);

  console.log('📦 Creating account:');
  console.log('   Size:', minSize, 'bytes');
  console.log('   Rent:', lamports / 1e9, 'SOL');
  console.log('');

  // Prepare account data
  const discriminator = createHash('sha256').update('account:BanList').digest().subarray(0, 8);
  const authority = adminKeypair.publicKey.toBuffer();
  const vecLength = Buffer.alloc(4);
  vecLength.writeUInt32LE(0, 0); // Empty vec
  const bumpByte = Buffer.from([bump]);

  const accountData = Buffer.concat([
    discriminator,
    authority,
    vecLength,
    bumpByte
  ]);

  console.log('📝 Account data prepared (' + accountData.length + ' bytes)');
  console.log('   Discriminator:', Array.from(discriminator));
  console.log('   Authority:', adminKeypair.publicKey.toString());
  console.log('   Vec length: 0');
  console.log('   Bump:', bump);
  console.log('');

  // We cannot use SystemProgram.createAccount directly for PDAs
  // PDAs can only be created by their owning program
  // So we need to call the program's initialize instruction

  // But wait - we can try a different approach:
  // What if we transfer lamports to the PDA first to make it "exist"?
  console.log('⚠️  NOTE: PDAs can only be created by the owning program');
  console.log('   We need to call the program\'s initialize_ban_list instruction');
  console.log('   OR modify the program to make ban_list optional');
  console.log('');
  console.log('🔧 The real fix is to rebuild the program with UncheckedAccount');
}

createMinimalBanList().catch(console.error);
