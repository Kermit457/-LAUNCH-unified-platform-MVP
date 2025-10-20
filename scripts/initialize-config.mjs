/**
 * Initialize Config PDA for V6 Curve Program
 *
 * This is an ADMIN-ONLY operation that must be run ONCE before anyone can create curves.
 * It sets up the global config with treasury wallet addresses.
 */

import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram } from '@solana/web3.js';
import fs from 'fs';
import { createHash } from 'crypto';

// ==========================================
// CONFIGURATION
// ==========================================

const PROGRAM_ID = new PublicKey('Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF');
const RPC_URL = 'https://api.devnet.solana.com';

// Treasury wallet addresses (CHANGE THESE TO YOUR WALLETS)
const PLATFORM_TREASURY = new PublicKey('6uX6LZJirmqGo7gKPR75g4nh9UfqvZu3t3hEX9TWYKcC'); // Your wallet
const BUYBACK_WALLET = new PublicKey('6uX6LZJirmqGo7gKPR75g4nh9UfqvZu3t3hEX9TWYKcC');    // Your wallet
const COMMUNITY_WALLET = new PublicKey('6uX6LZJirmqGo7gKPR75g4nh9UfqvZu3t3hEX9TWYKcC'); // Your wallet

// Admin keypair path (devnet.json from solana-program)
const ADMIN_KEYPAIR_PATH = 'C:\\Users\\mirko\\.config\\solana\\devnet.json';

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getConfigPDA() {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    PROGRAM_ID
  );
  return pda;
}

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

function getDiscriminator(name) {
  return sha256(`global:${name}`).subarray(0, 8);
}

// ==========================================
// MAIN INITIALIZATION
// ==========================================

async function initialize() {
  console.log('🚀 Initializing V6 Curve Program Config\n');

  // Load admin keypair
  console.log('📂 Loading admin keypair from:', ADMIN_KEYPAIR_PATH);
  const keypairData = JSON.parse(fs.readFileSync(ADMIN_KEYPAIR_PATH, 'utf-8'));
  const adminKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
  console.log('✅ Admin wallet:', adminKeypair.publicKey.toString());
  console.log('');

  // Connect to Solana
  const connection = new Connection(RPC_URL, 'confirmed');

  // Check balance
  const balance = await connection.getBalance(adminKeypair.publicKey);
  console.log('💰 Admin balance:', balance / 1e9, 'SOL');

  if (balance < 0.1 * 1e9) {
    console.log('⚠️  Low balance! Run: solana airdrop 1 --url devnet');
    console.log('');
  }

  // Get PDAs
  const configPDA = getConfigPDA();
  const banListPDA = getBanListPDA();

  console.log('📍 PDAs:');
  console.log('  Config PDA:', configPDA.toString());
  console.log('  BanList PDA:', banListPDA.toString());
  console.log('');

  // Check if already initialized
  const configAccount = await connection.getAccountInfo(configPDA);
  if (configAccount) {
    console.log('⚠️  Config PDA already initialized!');
    console.log('   Existing config detected. Skipping initialization.');
    console.log('');
    console.log('✅ Config is ready to use!');
    return;
  }

  // Build initialize instruction
  console.log('🏗️  Building initialize instruction...');

  const discriminator = getDiscriminator('initialize');
  console.log('  Discriminator:', Array.from(discriminator));

  // Serialize args: platformTreasury (32), buybackWallet (32), communityWallet (32)
  const data = Buffer.concat([
    Buffer.from(discriminator),
    PLATFORM_TREASURY.toBuffer(),
    BUYBACK_WALLET.toBuffer(),
    COMMUNITY_WALLET.toBuffer(),
  ]);

  // Initialize instruction only has 3 accounts: config, authority, systemProgram
  const initializeIx = new TransactionInstruction({
    keys: [
      { pubkey: configPDA, isSigner: false, isWritable: true },
      { pubkey: adminKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data,
  });

  console.log('✅ Instruction built');
  console.log('');

  // Build and send transaction
  console.log('📦 Building transaction...');
  const transaction = new Transaction().add(initializeIx);

  // Send transaction (connection.sendTransaction handles signing)
  console.log('📤 Sending transaction...');
  const signature = await connection.sendTransaction(transaction, [adminKeypair], {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
  });
  console.log('✅ Transaction sent:', signature);
  console.log('🔗 Explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log('');

  // Wait for confirmation
  console.log('⏳ Waiting for confirmation...');
  const confirmation = await connection.confirmTransaction(signature, 'confirmed');

  if (confirmation.value.err) {
    console.error('❌ Transaction failed:', confirmation.value.err);
    process.exit(1);
  }

  console.log('✅ Transaction confirmed!');
  console.log('');

  // Verify config was created
  const verifyConfig = await connection.getAccountInfo(configPDA);
  if (verifyConfig) {
    console.log('✅ Config PDA successfully created!');
    console.log('   Size:', verifyConfig.data.length, 'bytes');
    console.log('   Owner:', verifyConfig.owner.toString());
  } else {
    console.log('❌ Config PDA not found after initialization');
  }

  console.log('');
  console.log('🎉 Initialization complete!');
  console.log('');
  console.log('📋 Summary:');
  console.log('  Platform Treasury:', PLATFORM_TREASURY.toString());
  console.log('  Buyback Wallet:', BUYBACK_WALLET.toString());
  console.log('  Community Wallet:', COMMUNITY_WALLET.toString());
  console.log('');
  console.log('✅ Users can now create curves!');
}

// ==========================================
// RUN
// ==========================================

initialize().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
