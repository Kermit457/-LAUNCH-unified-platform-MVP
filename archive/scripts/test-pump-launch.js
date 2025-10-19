/**
 * Test Pump.fun Token Launch
 * This script tests the complete token launch flow on devnet
 *
 * Run: node scripts/test-pump-launch.js
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const { PumpFunSDK } = require('pumpdotfun-sdk');
const bs58 = require('bs58').default || require('bs58');

async function testPumpLaunch() {
  console.log('🚀 Testing Pump.fun Token Launch on Devnet\n');
  console.log('=' .repeat(70));

  try {
    // Load wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PUMP_FUN_CREATOR_PRIVATE_KEY not found in .env.local');
    }

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    console.log('✅ Creator wallet:', creatorKeypair.publicKey.toBase58());

    // Connect to Solana
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    // Check balance
    const balance = await connection.getBalance(creatorKeypair.publicKey);
    console.log('💵 Balance:', balance / LAMPORTS_PER_SOL, 'SOL\n');

    if (balance < 0.01 * LAMPORTS_PER_SOL) {
      throw new Error('Insufficient balance. Need at least 0.01 SOL');
    }

    // Initialize Pump.fun SDK
    console.log('📦 Initializing Pump.fun SDK...');
    const sdk = new PumpFunSDK(connection);

    // Token parameters
    const tokenName = 'Test Token ' + Date.now().toString().slice(-6);
    const tokenSymbol = 'TEST' + Date.now().toString().slice(-4);
    const tokenDescription = 'This is a test token launched from a bonding curve';

    console.log('\n📋 Token Details:');
    console.log('   Name:', tokenName);
    console.log('   Symbol:', tokenSymbol);
    console.log('   Description:', tokenDescription);
    console.log('   Initial Buy: 0.01 SOL');
    console.log('');

    // Step 1: Create metadata (simplified for testing)
    console.log('📤 Creating token metadata...');
    const metadataUri = 'https://ipfs.io/ipfs/QmTest' + Date.now(); // Mock URI for testing
    console.log('✅ Metadata URI:', metadataUri);

    // Step 2: Generate mint keypair
    console.log('\n🔑 Generating token mint...');
    const mintKeypair = Keypair.generate();
    console.log('   Token Mint:', mintKeypair.publicKey.toBase58());

    // Step 3: Create and buy token
    console.log('\n💰 Creating token with initial buy...');
    console.log('⏳ This may take 10-30 seconds...\n');

    try {
      const result = await sdk.createAndBuy(
        creatorKeypair,
        mintKeypair,
        {
          name: tokenName,
          symbol: tokenSymbol,
          uri: metadataUri
        },
        BigInt(0.01 * LAMPORTS_PER_SOL), // 0.01 SOL initial buy
        BigInt(500) // 5% slippage
      );

      console.log('=' .repeat(70));
      console.log('✅ TOKEN CREATED SUCCESSFULLY!');
      console.log('=' .repeat(70));
      console.log('\n📊 Token Details:');
      console.log('   Token Mint:', mintKeypair.publicKey.toBase58());
      console.log('   Transaction:', result.signature);
      console.log('   Name:', tokenName);
      console.log('   Symbol:', tokenSymbol);
      console.log('');
      console.log('🔗 View on Explorer:');
      console.log(`   https://explorer.solana.com/tx/${result.signature}?cluster=devnet`);
      console.log('');
      console.log('📈 Trading Information:');
      console.log('   Status: Live on bonding curve');
      console.log('   Bonding curve fee: 1.25% (0.30% to creator)');
      console.log('   Graduation: ~$69k market cap');
      console.log('   Post-graduation: Dynamic fees 0.05%-0.95%');
      console.log('');
      console.log('💡 Next Steps:');
      console.log('   1. View your token on Solana Explorer (link above)');
      console.log('   2. Trade on the bonding curve');
      console.log('   3. Watch it graduate to PumpSwap at ~$69k');
      console.log('   4. Earn creator fees on every trade!');

      // Save result to file for reference
      const fs = require('fs');
      const resultData = {
        tokenMint: mintKeypair.publicKey.toBase58(),
        signature: result.signature,
        name: tokenName,
        symbol: tokenSymbol,
        metadataUri: metadataUri,
        network: 'devnet',
        createdAt: new Date().toISOString()
      };

      fs.writeFileSync(
        'test-token-result.json',
        JSON.stringify(resultData, null, 2)
      );
      console.log('\n📁 Results saved to: test-token-result.json');

    } catch (sdkError) {
      console.error('❌ SDK Error:', sdkError.message);

      // Common error handling
      if (sdkError.message.includes('insufficient')) {
        console.log('\n💡 Solution: Request more SOL from faucet');
        console.log('   Run: node scripts/airdrop-sol.js 2');
      } else if (sdkError.message.includes('blockhash')) {
        console.log('\n💡 Solution: Network congestion, try again in a moment');
      } else if (sdkError.message.includes('simulate')) {
        console.log('\n💡 This might be a devnet issue. The SDK may not fully support devnet.');
        console.log('   Consider testing on mainnet with small amounts.');
      }

      // Fallback: Show how it would work
      console.log('\n📝 NOTE: Pump.fun SDK might have limited devnet support.');
      console.log('   In production (mainnet), this would:');
      console.log('   1. Upload metadata to IPFS');
      console.log('   2. Create SPL token with 1B supply');
      console.log('   3. Add 800M to bonding curve');
      console.log('   4. Execute initial buy order');
      console.log('   5. Enable trading immediately');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
  }
}

// Run the test
testPumpLaunch().catch(console.error);