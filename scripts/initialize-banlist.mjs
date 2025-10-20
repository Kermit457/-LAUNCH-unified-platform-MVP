/**
 * Initialize Ban List PDA for V6 Curve Program
 */

import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram } from '@solana/web3.js';
import fs from 'fs';
import { createHash } from 'crypto';

const PROGRAM_ID = new PublicKey('Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF');
const RPC_URL = 'https://api.devnet.solana.com';
const ADMIN_KEYPAIR_PATH = 'C:\\Users\\mirko\\.config\\solana\\devnet.json';

function getBanListPDA() {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('ban_list')],
    PROGRAM_ID
  );
  return pda;
}

function sha256(data) {
  return createHash('sha256').update(data).digest();
}

async function initializeBanList() {
  console.log('🚀 Initializing Ban List\n');

  const keypairData = JSON.parse(fs.readFileSync(ADMIN_KEYPAIR_PATH, 'utf-8'));
  const adminKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
  console.log('✅ Admin wallet:', adminKeypair.publicKey.toString());

  const connection = new Connection(RPC_URL, 'confirmed');
  const banListPDA = getBanListPDA();

  console.log('📍 BanList PDA:', banListPDA.toString());

  // Check if already initialized
  const account = await connection.getAccountInfo(banListPDA);
  if (account) {
    console.log('⚠️  BanList already initialized!');
    return;
  }

  // Build instruction (use snake_case for Anchor methods)
  const discriminator = sha256('global:initialize_ban_list').subarray(0, 8);
  console.log('  Discriminator:', Array.from(discriminator));
  const data = Buffer.from(discriminator);

  const initializeIx = new TransactionInstruction({
    keys: [
      { pubkey: banListPDA, isSigner: false, isWritable: true },
      { pubkey: adminKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data,
  });

  const transaction = new Transaction().add(initializeIx);

  console.log('⚠️  Skipping preflight due to account size limits...');
  const signature = await connection.sendTransaction(transaction, [adminKeypair], {
    skipPreflight: true, // Skip simulation - let it try on-chain
  });

  console.log('✅ Transaction sent:', signature);
  console.log('⏳ Confirming...');

  await connection.confirmTransaction(signature, 'confirmed');
  console.log('✅ BanList initialized!');
}

initializeBanList().catch(console.error);
