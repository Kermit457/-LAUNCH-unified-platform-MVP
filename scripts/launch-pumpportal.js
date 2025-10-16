/**
 * Launch Token using PumpPortal API - MAINNET
 * Alternative approach that bypasses SDK issues
 *
 * Run: node scripts/launch-pumpportal.js
 */

require('dotenv').config({ path: '.env.local' });
const { Keypair, Connection, Transaction, VersionedTransaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const fetch = require('node-fetch');
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

async function launchViaPumpPortal() {
  console.log('\n');
  console.log('=' .repeat(70));
  console.log('🚀 PUMPPORTAL TOKEN LAUNCHER - MAINNET');
  console.log('=' .repeat(70));
  console.log('\n⚠️  WARNING: This will create a REAL token on Solana mainnet!');
  console.log('📍 Using PumpPortal API for more reliable deployment\n');

  try {
    // Load wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PUMP_FUN_CREATOR_PRIVATE_KEY not found in .env.local');
    }

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    console.log('✅ Creator wallet:', creatorKeypair.publicKey.toBase58());

    // Connect to mainnet
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

    // Check balance
    const balance = await connection.getBalance(creatorKeypair.publicKey);
    console.log('💵 Balance:', (balance / LAMPORTS_PER_SOL).toFixed(4), 'SOL\n');

    if (balance < 0.01 * LAMPORTS_PER_SOL) {
      throw new Error('Insufficient balance. Need at least 0.01 SOL');
    }

    // Get token details
    console.log('📝 Enter Token Details:\n');
    const tokenName = await askQuestion('Token Name: ');
    const tokenSymbol = await askQuestion('Token Symbol (3-10 chars): ');
    const tokenDescription = await askQuestion('Description: ');
    const initialBuyStr = await askQuestion('Initial Buy in SOL (min 0.0001): ');
    const initialBuySOL = parseFloat(initialBuyStr) || 0.0001;

    // Generate mint keypair
    const mintKeypair = Keypair.generate();

    console.log('\n' + '=' .repeat(70));
    console.log('📋 TOKEN DETAILS:');
    console.log('=' .repeat(70));
    console.log('Name:        ', tokenName);
    console.log('Symbol:      ', tokenSymbol);
    console.log('Description: ', tokenDescription);
    console.log('Mint:        ', mintKeypair.publicKey.toBase58());
    console.log('Initial Buy: ', initialBuySOL, 'SOL');
    console.log('=' .repeat(70));

    const confirm = await askQuestion('\n⚠️  Create this token? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Cancelled');
      rl.close();
      return;
    }

    console.log('\n🚀 Creating token via PumpPortal...\n');

    // Step 1: Upload metadata to IPFS
    console.log('📤 Uploading metadata...');
    const metadataResponse = await fetch('https://pump.fun/api/ipfs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: tokenName,
        symbol: tokenSymbol,
        description: tokenDescription,
        showName: true
      })
    });

    let metadataUri = `https://ipfs.io/ipfs/Qm${Buffer.from(tokenName).toString('hex').slice(0, 44)}`;

    if (metadataResponse.ok) {
      const metadata = await metadataResponse.json();
      metadataUri = metadata.metadataUri || metadata.uri || metadataUri;
      console.log('✅ Metadata:', metadataUri);
    } else {
      console.log('⚠️  Using fallback metadata URI');
    }

    // Step 2: Call PumpPortal API
    console.log('\n📡 Calling PumpPortal API...');
    const response = await fetch('https://pumpportal.fun/api/trade-local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey: creatorKeypair.publicKey.toBase58(),
        action: 'create',
        tokenMetadata: {
          name: tokenName,
          symbol: tokenSymbol,
          uri: metadataUri
        },
        mint: mintKeypair.publicKey.toBase58(),
        denominatedInSol: 'true',
        amount: initialBuySOL,
        slippage: 10,
        priorityFee: 0.0005,
        pool: 'pump'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    if (data.transaction) {
      console.log('✅ Transaction created!\n');

      // Step 3: Sign and send transaction
      console.log('✏️  Signing transaction...');

      // Decode the transaction
      const transactionBuffer = Buffer.from(data.transaction, 'base64');
      let transaction;

      try {
        // Try as VersionedTransaction first
        transaction = VersionedTransaction.deserialize(transactionBuffer);
        transaction.sign([creatorKeypair, mintKeypair]);
      } catch {
        // Fall back to legacy Transaction
        transaction = Transaction.from(transactionBuffer);
        transaction.sign(creatorKeypair, mintKeypair);
      }

      console.log('📤 Sending transaction...');
      const signature = await connection.sendRawTransaction(
        transaction.serialize(),
        { skipPreflight: false, preflightCommitment: 'confirmed' }
      );

      console.log('⏳ Confirming transaction...');
      await connection.confirmTransaction(signature, 'confirmed');

      // Success!
      console.log('\n' + '=' .repeat(70));
      console.log('🎉 TOKEN CREATED SUCCESSFULLY!');
      console.log('=' .repeat(70));
      console.log('\n📊 DETAILS:\n');
      console.log('Token Mint:  ', mintKeypair.publicKey.toBase58());
      console.log('Transaction: ', signature);
      console.log('');
      console.log('🔗 VIEW YOUR TOKEN:');
      console.log(`Pump.fun:    https://pump.fun/coin/${mintKeypair.publicKey.toBase58()}`);
      console.log(`Solscan:     https://solscan.io/token/${mintKeypair.publicKey.toBase58()}`);
      console.log('=' .repeat(70));

      // Save results
      const results = {
        success: true,
        tokenMint: mintKeypair.publicKey.toBase58(),
        signature,
        name: tokenName,
        symbol: tokenSymbol,
        metadataUri,
        pumpfunUrl: `https://pump.fun/coin/${mintKeypair.publicKey.toBase58()}`,
        timestamp: new Date().toISOString()
      };

      fs.writeFileSync(
        `launch-success-${tokenSymbol}-${Date.now()}.json`,
        JSON.stringify(results, null, 2)
      );

    } else {
      console.log('⚠️  No transaction returned. Response:', data);

      // Alternative: Direct link to pump.fun
      console.log('\n💡 Alternative: Create directly on pump.fun:');
      console.log('1. Go to: https://pump.fun');
      console.log('2. Click "launch a coin"');
      console.log('3. Use these details:');
      console.log('   Name:', tokenName);
      console.log('   Symbol:', tokenSymbol);
      console.log('   Description:', tokenDescription);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    // Provide fallback options
    console.log('\n' + '=' .repeat(70));
    console.log('💡 ALTERNATIVE OPTIONS:');
    console.log('=' .repeat(70));
    console.log('\n1. Create directly on pump.fun website:');
    console.log('   https://pump.fun');
    console.log('   Click "launch a coin" and follow the steps');
    console.log('\n2. Use PumpPortal website:');
    console.log('   https://pumpportal.fun');
    console.log('\n3. Try a different RPC endpoint:');
    console.log('   - Helius: https://mainnet.helius-rpc.com');
    console.log('   - QuickNode: Sign up at https://quicknode.com');
    console.log('=' .repeat(70));

  } finally {
    rl.close();
  }
}

// Check for node-fetch
try {
  require('node-fetch');
} catch {
  console.log('📦 Installing required package...');
  console.log('Run: npm install node-fetch@2 --legacy-peer-deps');
  console.log('Then try again.');
  process.exit(1);
}

// Run
console.log('⚠️  PUMPPORTAL TOKEN LAUNCHER');
console.log('Alternative method for creating tokens on pump.fun\n');

launchViaPumpPortal().catch(console.error);