/**
 * REAL MAINNET LAUNCH - Using Official Pump.fun SDK
 *
 * ⚠️  WARNING: This will create a REAL token and spend REAL SOL!
 *
 * Run: node scripts/launch-mainnet-sdk.js
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

// Your real wallets
const KEY_HOLDERS = [
  { address: 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP', name: 'Whale Alpha', keys: 350 },
  { address: 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT', name: 'Whale Beta', keys: 250 },
  { address: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL', name: 'Diamond Hands', keys: 150 },
  { address: '2d9dKoLqXpzgEwSUFd4hYMMYk1kjXSHn2L9Z88WbKyL5', name: 'Early Investor', keys: 100 },
  { address: 'HgdQ726vLkMspD81SWGJhoaUJYraydeTnqT373apidEe', name: 'Steady Holder', keys: 75 },
  { address: 'BrFWPnjDw6pTqW3NGo38bRKEqfYXE62KkMfCgLqJzpxJ', name: 'Community Member', keys: 50 },
  { address: '6t3m2A8R7yysvbanHV2hRWRuf6EK9uDJWHSzyQGp4Zbp', name: 'Supporter', keys: 25 }
];

const TOTAL_KEYS = KEY_HOLDERS.reduce((sum, h) => sum + h.keys, 0);

async function launchWithSDK() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 MAINNET LAUNCH - Pump.fun SDK');
  console.log('='.repeat(70));
  console.log('\n⚠️  REAL MONEY - REAL TOKEN - CANNOT BE UNDONE\n');

  try {
    // Load wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey || privateKey === 'YOUR_PRIVATE_KEY_HERE') {
      throw new Error('❌ No wallet! Set PUMP_FUN_CREATOR_PRIVATE_KEY');
    }

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const creatorAddress = creatorKeypair.publicKey.toBase58();

    // Connect to mainnet
    const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(RPC_URL, 'confirmed');

    console.log('✅ Wallet:', creatorAddress);

    const balance = await connection.getBalance(creatorKeypair.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL\n');

    if (solBalance < 0.01) {
      throw new Error('❌ Need at least 0.01 SOL');
    }

    // Get details
    const tokenName = await askQuestion('Token Name: ');
    const tokenSymbol = await askQuestion('Token Symbol: ');
    const description = await askQuestion('Description: ');
    const buyAmountStr = await askQuestion('SOL to spend (e.g., 0.01): ');
    const buyAmount = parseFloat(buyAmountStr);

    if (!tokenName || !tokenSymbol || isNaN(buyAmount) || buyAmount < 0.001) {
      throw new Error('❌ Invalid input');
    }

    // Confirmation
    console.log('\n' + '='.repeat(70));
    console.log('⚠️  FINAL CHECK');
    console.log('=' .repeat(70));
    console.log('Token:    ', tokenName, `(${tokenSymbol})`);
    console.log('Network:   MAINNET');
    console.log('Cost:     ', buyAmount, 'SOL (~$' + (buyAmount * 150).toFixed(2) + ')');
    console.log('=' .repeat(70));

    const confirm = await askQuestion('\nProceed? (type YES): ');
    if (confirm !== 'YES') {
      console.log('❌ Cancelled');
      rl.close();
      return;
    }

    console.log('\n⏳ Launching...\n');

    // Try using pumpdotfun-sdk
    try {
      const { PumpFunSDK } = require('pumpdotfun-sdk');

      console.log('1️⃣ Initializing Pump.fun SDK...');
      const sdk = new PumpFunSDK(connection);

      console.log('2️⃣ Generating mint keypair...');
      const mintKeypair = Keypair.generate();
      const tokenMint = mintKeypair.publicKey.toBase58();
      console.log('   Mint:', tokenMint);

      // Create metadata URI
      const metadataUri = `https://pump.fun/${tokenSymbol.toLowerCase()}-${Date.now()}`;

      console.log('\n3️⃣ Creating token...');
      console.log('   ⏳ This may take 30-60 seconds...\n');

      const result = await sdk.createAndBuy(
        creatorKeypair,
        mintKeypair,
        {
          name: tokenName,
          symbol: tokenSymbol,
          uri: metadataUri,
          description
        },
        BigInt(Math.floor(buyAmount * LAMPORTS_PER_SOL)),
        BigInt(1000) // 10% slippage
      );

      console.log('=' .repeat(70));
      console.log('🎉 SUCCESS!');
      console.log('=' .repeat(70));
      console.log('\n📊 RESULTS:');
      console.log('Token Mint: ', tokenMint);
      console.log('Transaction:', result.signature);
      console.log('\n🔗 VIEW:');
      console.log(`https://pump.fun/coin/${tokenMint}`);
      console.log(`https://solscan.io/token/${tokenMint}`);

      // Save
      const data = {
        success: true,
        tokenMint,
        signature: result.signature,
        tokenName,
        tokenSymbol,
        buyAmount,
        keyHolders: KEY_HOLDERS,
        timestamp: new Date().toISOString()
      };

      fs.writeFileSync(`LAUNCH-${tokenSymbol}-${Date.now()}.json`, JSON.stringify(data, null, 2));

      console.log('\n✅ Token is LIVE!');
      console.log('💰 You earn 0.30% of all trades');
      console.log('📈 Share and watch it grow!\n');

    } catch (sdkError) {
      console.error('\n❌ SDK Error:', sdkError.message);
      console.log('\n📝 The SDK might have compatibility issues.');
      console.log('\n🌐 RECOMMENDED: Use Pump.fun Website');
      console.log('=' .repeat(70));
      console.log('\n1. Go to: https://pump.fun');
      console.log('2. Connect wallet:', creatorAddress);
      console.log('3. Click "launch a coin"');
      console.log('4. Fill in:');
      console.log(`   Name: ${tokenName}`);
      console.log(`   Symbol: ${tokenSymbol}`);
      console.log(`   Description: ${description}`);
      console.log(`   Buy: ${buyAmount} SOL`);
      console.log('\n5. Launch and share the link!');
      console.log('\n💡 This guarantees success and is what most creators use.');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

console.log('\n🎯 Official SDK Launcher');
console.log('Attempts to use the Pump.fun SDK for mainnet launch\n');

launchWithSDK().catch(console.error);