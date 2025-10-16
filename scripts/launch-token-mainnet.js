/**
 * Launch Token on Pump.fun - MAINNET PRODUCTION
 *
 * ⚠️ WARNING: This will create a REAL token on Solana mainnet!
 * It will cost real SOL (~0.01-0.05 SOL per launch)
 *
 * Run: node scripts/launch-token-mainnet.js
 *
 * Optional: Pass token details as arguments
 * node scripts/launch-token-mainnet.js "Token Name" "SYMBOL" 0.01
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const { PumpFunSDK } = require('pumpdotfun-sdk');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');
const readline = require('readline');

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

async function launchTokenMainnet() {
  console.log('\n');
  console.log('=' .repeat(70));
  console.log('🚀 PUMP.FUN TOKEN LAUNCHER - MAINNET PRODUCTION');
  console.log('=' .repeat(70));
  console.log('\n⚠️  WARNING: This will create a REAL token on Solana mainnet!');
  console.log('💸 Cost: ~0.01-0.05 SOL');
  console.log('📍 Network: MAINNET-BETA (LIVE)\n');

  try {
    // Load wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PUMP_FUN_CREATOR_PRIVATE_KEY not found in .env.local');
    }

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    console.log('✅ Creator wallet:', creatorKeypair.publicKey.toBase58());

    // Connect to mainnet
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    console.log('🌐 RPC URL:', rpcUrl);

    const connection = new Connection(rpcUrl, 'confirmed');

    // Check balance
    console.log('\n💰 Checking balance...');
    const balance = await connection.getBalance(creatorKeypair.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');

    if (balance < 0.01 * LAMPORTS_PER_SOL) {
      throw new Error('Insufficient balance. Need at least 0.01 SOL');
    }

    // Get token parameters (from command line or prompt)
    let tokenName = process.argv[2];
    let tokenSymbol = process.argv[3];
    let initialBuySOL = parseFloat(process.argv[4]) || 0.001; // Default 0.001 SOL

    if (!tokenName) {
      console.log('\n📝 Enter Token Details:\n');
      tokenName = await askQuestion('Token Name (e.g., "Moon Rocket"): ');
      tokenSymbol = await askQuestion('Token Symbol (e.g., "MOON"): ');
      const buyAmount = await askQuestion('Initial Buy Amount in SOL (default 0.001): ');
      if (buyAmount) initialBuySOL = parseFloat(buyAmount);
    }

    // Token details
    const tokenDetails = {
      name: tokenName || `Launch ${Date.now().toString().slice(-6)}`,
      symbol: tokenSymbol || `LCH${Date.now().toString().slice(-4)}`,
      description: 'Token launched from bonding curve graduation on pump.fun',
      twitter: '',
      telegram: '',
      website: ''
    };

    console.log('\n' + '=' .repeat(70));
    console.log('📋 TOKEN DETAILS:');
    console.log('=' .repeat(70));
    console.log('Name:        ', tokenDetails.name);
    console.log('Symbol:      ', tokenDetails.symbol);
    console.log('Description: ', tokenDetails.description);
    console.log('Initial Buy: ', initialBuySOL, 'SOL (~$' + (initialBuySOL * 150).toFixed(2) + ' USD)');
    console.log('=' .repeat(70));

    // Confirm with user
    const confirm = await askQuestion('\n⚠️  Proceed with token creation? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Launch cancelled by user');
      rl.close();
      return;
    }

    // Initialize SDK
    console.log('\n📦 Initializing Pump.fun SDK...');
    const sdk = new PumpFunSDK(connection);

    // Generate mint keypair
    console.log('🔑 Generating token mint...');
    const mintKeypair = Keypair.generate();
    console.log('   Mint Address:', mintKeypair.publicKey.toBase58());

    // Create metadata URI (simplified for initial test)
    // In production, you'd upload actual image/metadata to IPFS
    const metadataUri = `https://pump.fun/api/metadata/${mintKeypair.publicKey.toBase58()}`;

    console.log('\n🚀 LAUNCHING TOKEN ON PUMP.FUN...');
    console.log('⏳ This will take 10-30 seconds...\n');

    try {
      // Create and buy token
      const result = await sdk.createAndBuy(
        creatorKeypair,
        mintKeypair,
        {
          name: tokenDetails.name,
          symbol: tokenDetails.symbol,
          uri: metadataUri
        },
        BigInt(Math.floor(initialBuySOL * LAMPORTS_PER_SOL)), // Initial buy in lamports
        BigInt(1000), // 10% slippage (1000 basis points)
        {
          commitment: 'confirmed'
        }
      );

      console.log('\n' + '=' .repeat(70));
      console.log('🎉 TOKEN CREATED SUCCESSFULLY!');
      console.log('=' .repeat(70));
      console.log('\n📊 LAUNCH RESULTS:\n');
      console.log('Token Mint:  ', mintKeypair.publicKey.toBase58());
      console.log('Transaction: ', result.signature);
      console.log('Name:        ', tokenDetails.name);
      console.log('Symbol:      ', tokenDetails.symbol);
      console.log('');
      console.log('🔗 VIEW YOUR TOKEN:');
      console.log(`Pump.fun:    https://pump.fun/coin/${mintKeypair.publicKey.toBase58()}`);
      console.log(`Explorer:    https://explorer.solana.com/tx/${result.signature}`);
      console.log('');
      console.log('💰 TRADING INFO:');
      console.log('• Live on bonding curve (1.25% fee, 0.30% to you)');
      console.log('• Graduates at ~$69k market cap');
      console.log('• Then moves to PumpSwap (0.05%-0.95% dynamic fees)');
      console.log('');
      console.log('📈 NEXT STEPS:');
      console.log('1. Share your token: https://pump.fun/coin/' + mintKeypair.publicKey.toBase58());
      console.log('2. Add liquidity by buying more');
      console.log('3. Promote to reach graduation');
      console.log('4. Earn 0.30% on all trades!');
      console.log('=' .repeat(70));

      // Save launch data
      const launchData = {
        success: true,
        tokenMint: mintKeypair.publicKey.toBase58(),
        signature: result.signature,
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        metadataUri: metadataUri,
        initialBuySOL: initialBuySOL,
        network: 'mainnet-beta',
        pumpFunUrl: `https://pump.fun/coin/${mintKeypair.publicKey.toBase58()}`,
        explorerUrl: `https://explorer.solana.com/tx/${result.signature}`,
        createdAt: new Date().toISOString()
      };

      const filename = `launch-${tokenDetails.symbol}-${Date.now()}.json`;
      fs.writeFileSync(filename, JSON.stringify(launchData, null, 2));
      console.log('\n📁 Launch data saved to:', filename);

    } catch (sdkError) {
      console.error('\n❌ Launch Error:', sdkError.message);

      // Error handling
      if (sdkError.message.includes('insufficient')) {
        console.log('\n💡 Solution: Add more SOL to your wallet');
      } else if (sdkError.message.includes('slippage')) {
        console.log('\n💡 Solution: Increase slippage tolerance');
      } else if (sdkError.message.includes('blockhash')) {
        console.log('\n💡 Solution: RPC issue, try again in a moment');
      }

      // Save error data
      const errorData = {
        success: false,
        error: sdkError.message,
        attemptedMint: mintKeypair.publicKey.toBase58(),
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        network: 'mainnet-beta',
        timestamp: new Date().toISOString()
      };

      fs.writeFileSync(
        `launch-error-${Date.now()}.json`,
        JSON.stringify(errorData, null, 2)
      );
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Safety check
console.log('\n⚠️  MAINNET TOKEN LAUNCHER');
console.log('This will create a REAL token on Solana mainnet.');
console.log('Make sure you have enough SOL and understand the risks.\n');

// Run the launcher
launchTokenMainnet().catch(console.error);