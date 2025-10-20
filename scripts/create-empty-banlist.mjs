/**
 * Create a minimal empty ban_list account as a workaround
 * This creates a PDA-owned account with minimal data
 */

import { Connection, PublicKey, Transaction, SystemProgram, Keypair, TransactionInstruction } from '@solana/web3.js';
import fs from 'fs';

const PROGRAM_ID = new PublicKey('Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF');
const RPC_URL = 'https://api.devnet.solana.com';
const ADMIN_KEYPAIR_PATH = 'C:\\Users\\mirko\\.config\\solana\\devnet.json';

async function createEmptyBanList() {
  console.log('🚀 Creating empty BanList account as workaround\n');

  const keypairData = JSON.parse(fs.readFileSync(ADMIN_KEYPAIR_PATH, 'utf-8'));
  const adminKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

  const connection = new Connection(RPC_URL, 'confirmed');

  const [banListPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('ban_list')],
    PROGRAM_ID
  );

  console.log('📍 BanList PDA:', banListPDA.toString());
  console.log('🔑 Bump:', bump);

  // Check if exists
  const existing = await connection.getAccountInfo(banListPDA);
  if (existing) {
    console.log('✅ BanList already exists!');
    return;
  }

  // Create a minimal account (8 bytes discriminator + 32 bytes authority + 1 byte bump + 4 bytes vec length = 45 bytes minimum)
  const minSize = 8 + 32 + 1 + 4 + 16; // Add some padding
  const lamports = await connection.getMinimumBalanceForRentExemption(minSize);

  console.log('📦 Creating account with', minSize, 'bytes');
  console.log('💰 Rent:', lamports / 1e9, 'SOL');

  // We can't create PDA directly with SystemProgram.createAccount
  // Instead, we need to call the program's initialize_ban_list instruction
  // But since that fails, let's try sending with skipPreflight

  const createHash = await import('crypto');
  const discriminator = createHash.createHash('sha256').update('global:initialize_ban_list').digest().subarray(0, 8);

  const ix = new TransactionInstruction({
    keys: [
      { pubkey: banListPDA, isSigner: false, isWritable: true },
      { pubkey: adminKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: Buffer.from(discriminator),
  });

  const tx = new Transaction().add(ix);

  console.log('📤 Sending with skipPreflight=true...');
  try {
    const sig = await connection.sendTransaction(tx, [adminKeypair], {
      skipPreflight: true,
      maxRetries: 0,
    });

    console.log('✅ Transaction sent:', sig);
    console.log('⏳ Confirming (may fail on-chain)...');

    await connection.confirmTransaction(sig, 'confirmed');
    console.log('✅ Success!');
  } catch (err) {
    console.error('❌ Failed:', err.message);
    console.log('\n💡 The deployed program requires a ban_list that cannot be created on devnet.');
    console.log('   You need to either:');
    console.log('   1. Rebuild the program with ban_list as UncheckedAccount');
    console.log('   2. Or deploy to a different cluster with higher limits');
  }
}

createEmptyBanList().catch(console.error);
