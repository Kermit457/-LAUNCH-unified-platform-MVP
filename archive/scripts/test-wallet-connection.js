/**
 * Test Solana wallet connection
 * Run: node scripts/test-wallet-connection.js
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');

async function testWallet() {
  console.log('🔍 Testing Solana wallet configuration...\n');

  // Check if private key is set
  const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;

  if (!privateKey) {
    console.error('❌ PUMP_FUN_CREATOR_PRIVATE_KEY not found in .env.local');
    console.log('\n📝 Please add your private key to .env.local:');
    console.log('   PUMP_FUN_CREATOR_PRIVATE_KEY=<your_base58_private_key>');
    return;
  }

  try {
    // Decode private key
    const privateKeyArray = bs58.decode(privateKey);
    const keypair = Keypair.fromSecretKey(privateKeyArray);

    console.log('✅ Wallet loaded successfully!');
    console.log('📍 Public Key:', keypair.publicKey.toBase58());

    // Connect to Solana
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

    console.log('\n🌐 Network:', network);
    console.log('🔗 RPC URL:', rpcUrl);

    const connection = new Connection(rpcUrl, 'confirmed');

    // Check balance
    console.log('\n💰 Checking balance...');
    const balance = await connection.getBalance(keypair.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;

    console.log('💵 Balance:', solBalance, 'SOL');

    if (solBalance === 0) {
      console.log('\n⚠️  Your wallet has no SOL!');
      if (network === 'devnet') {
        console.log('\n💡 Get free devnet SOL:');
        console.log('   1. Visit https://faucet.solana.com/');
        console.log('   2. Enter your public key:', keypair.publicKey.toBase58());
        console.log('   3. Request 2 SOL');
      } else {
        console.log('\n💡 Send SOL to your wallet address:', keypair.publicKey.toBase58());
      }
    } else {
      console.log('\n✅ Wallet is funded and ready!');
      console.log('🚀 You can now launch tokens on Pump.fun!');
    }

  } catch (error) {
    console.error('❌ Error loading wallet:', error.message);
    console.log('\n💡 Make sure your private key is in base58 format');
  }
}

testWallet().catch(console.error);