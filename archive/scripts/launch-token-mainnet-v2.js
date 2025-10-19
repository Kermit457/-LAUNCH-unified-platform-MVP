/**
 * Launch Token on Pump.fun - MAINNET PRODUCTION V2
 * This version properly handles the image requirement
 *
 * ⚠️ WARNING: This will create a REAL token on Solana mainnet!
 *
 * Run: node scripts/launch-token-mainnet-v2.js
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { PumpFunSDK } = require('pumpdotfun-sdk');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Polyfill File/Blob for Node.js
if (typeof global !== 'undefined') {
  if (!global.File) {
    global.File = class File {
      constructor(bits, name, options = {}) {
        this.bits = bits;
        this.name = name;
        this.type = options.type || 'application/octet-stream';
        this.lastModified = options.lastModified || Date.now();
      }

      async arrayBuffer() {
        return this.bits[0];
      }

      slice() {
        return new Blob(this.bits);
      }
    };
  }

  if (!global.Blob) {
    global.Blob = class Blob {
      constructor(bits = [], options = {}) {
        this.bits = bits;
        this.type = options.type || '';
      }

      async arrayBuffer() {
        return this.bits[0];
      }

      slice() {
        return this;
      }
    };
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

// Create a simple 1x1 PNG image
function createDefaultImage() {
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41,
    0x54, 0x08, 0x99, 0x63, 0xF8, 0x0F, 0x00, 0x00,
    0x01, 0x01, 0x01, 0x00, 0x1B, 0xB6, 0xEE, 0x56,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
    0xAE, 0x42, 0x60, 0x82
  ]);

  return new global.File([pngData], 'token.png', { type: 'image/png' });
}

async function launchTokenMainnetV2() {
  console.log('\n');
  console.log('=' .repeat(70));
  console.log('🚀 PUMP.FUN TOKEN LAUNCHER V2 - MAINNET PRODUCTION');
  console.log('=' .repeat(70));
  console.log('\n⚠️  WARNING: This will create a REAL token on Solana mainnet!');
  console.log('💸 Cost: ~0.01-0.05 SOL plus initial buy');
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
    const connection = new Connection(rpcUrl, 'confirmed');

    // Check balance
    const balance = await connection.getBalance(creatorKeypair.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');

    if (balance < 0.02 * LAMPORTS_PER_SOL) {
      throw new Error('Insufficient balance. Need at least 0.02 SOL');
    }

    // Get token parameters
    console.log('\n📝 Enter Token Details:\n');

    const tokenName = await askQuestion('Token Name: ') || `Test ${Date.now().toString().slice(-6)}`;
    const tokenSymbol = await askQuestion('Token Symbol: ') || `TST${Date.now().toString().slice(-4)}`;
    const tokenDescription = await askQuestion('Description (optional): ') || 'Token launched via pump.fun';
    const twitter = await askQuestion('Twitter (optional, e.g. @token): ') || '';
    const telegram = await askQuestion('Telegram (optional, e.g. t.me/token): ') || '';
    const website = await askQuestion('Website (optional): ') || '';
    const buyAmountStr = await askQuestion('Initial Buy in SOL (min 0.001): ') || '0.001';
    const initialBuySOL = parseFloat(buyAmountStr);

    if (initialBuySOL < 0.001) {
      throw new Error('Initial buy must be at least 0.001 SOL');
    }

    console.log('\n' + '=' .repeat(70));
    console.log('📋 FINAL TOKEN DETAILS:');
    console.log('=' .repeat(70));
    console.log('Name:        ', tokenName);
    console.log('Symbol:      ', tokenSymbol);
    console.log('Description: ', tokenDescription || '(none)');
    console.log('Twitter:     ', twitter || '(none)');
    console.log('Telegram:    ', telegram || '(none)');
    console.log('Website:     ', website || '(none)');
    console.log('Initial Buy: ', initialBuySOL, 'SOL (~$' + (initialBuySOL * 150).toFixed(2) + ' USD)');
    console.log('=' .repeat(70));

    const confirm = await askQuestion('\n⚠️  Proceed with token creation? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Launch cancelled');
      rl.close();
      return;
    }

    // Initialize SDK
    console.log('\n📦 Initializing Pump.fun SDK...');
    const sdk = new PumpFunSDK(connection);

    // Create image file
    console.log('🎨 Creating token image...');
    const imageFile = createDefaultImage();

    // Generate mint keypair
    console.log('🔑 Generating token mint...');
    const mintKeypair = Keypair.generate();
    console.log('   Mint:', mintKeypair.publicKey.toBase58());

    console.log('\n🚀 LAUNCHING TOKEN...');
    console.log('⏳ This may take 30-60 seconds...\n');

    try {
      // Method 1: Try with bundled metadata
      const result = await sdk.createAndBuy(
        creatorKeypair,
        mintKeypair,
        {
          name: tokenName,
          symbol: tokenSymbol,
          description: tokenDescription,
          file: imageFile,
          twitter: twitter,
          telegram: telegram,
          website: website
        },
        BigInt(Math.floor(initialBuySOL * LAMPORTS_PER_SOL)),
        BigInt(1000), // 10% slippage
        {
          commitment: 'confirmed'
        }
      );

      console.log('\n' + '=' .repeat(70));
      console.log('🎉 TOKEN CREATED SUCCESSFULLY!');
      console.log('=' .repeat(70));

      displaySuccess(mintKeypair.publicKey.toBase58(), result.signature, tokenName, tokenSymbol);

      saveResults({
        success: true,
        tokenMint: mintKeypair.publicKey.toBase58(),
        signature: result.signature,
        name: tokenName,
        symbol: tokenSymbol,
        initialBuySOL
      });

    } catch (error) {
      console.log('⚠️  Method 1 failed:', error.message);
      console.log('\n🔄 Trying alternative method...\n');

      // Method 2: Try uploading metadata separately first
      try {
        console.log('📤 Uploading metadata to IPFS...');

        // Create FormData for upload
        const FormData = require('form-data');
        const formData = new FormData();

        // Add the image
        formData.append('file', Buffer.from(await imageFile.arrayBuffer()), {
          filename: 'token.png',
          contentType: 'image/png'
        });

        formData.append('name', tokenName);
        formData.append('symbol', tokenSymbol);
        formData.append('description', tokenDescription);
        if (twitter) formData.append('twitter', twitter);
        if (telegram) formData.append('telegram', telegram);
        if (website) formData.append('website', website);

        const fetch = require('node-fetch');
        const ipfsResponse = await fetch('https://pump.fun/api/ipfs', {
          method: 'POST',
          body: formData,
          headers: formData.getHeaders()
        });

        if (!ipfsResponse.ok) {
          throw new Error('IPFS upload failed');
        }

        const ipfsData = await ipfsResponse.json();
        const metadataUri = ipfsData.metadataUri || ipfsData.uri;
        console.log('✅ Metadata uploaded:', metadataUri);

        // Now create with the URI
        const result = await sdk.createAndBuy(
          creatorKeypair,
          mintKeypair,
          {
            name: tokenName,
            symbol: tokenSymbol,
            uri: metadataUri
          },
          BigInt(Math.floor(initialBuySOL * LAMPORTS_PER_SOL)),
          BigInt(1000)
        );

        console.log('\n' + '=' .repeat(70));
        console.log('🎉 TOKEN CREATED SUCCESSFULLY!');
        console.log('=' .repeat(70));

        displaySuccess(mintKeypair.publicKey.toBase58(), result.signature, tokenName, tokenSymbol);

        saveResults({
          success: true,
          tokenMint: mintKeypair.publicKey.toBase58(),
          signature: result.signature,
          name: tokenName,
          symbol: tokenSymbol,
          metadataUri,
          initialBuySOL
        });

      } catch (error2) {
        console.error('\n❌ Launch failed:', error2.message);

        // Final fallback instructions
        console.log('\n💡 Troubleshooting:');
        console.log('1. Make sure you have form-data and node-fetch installed:');
        console.log('   npm install form-data node-fetch@2 --legacy-peer-deps');
        console.log('\n2. Try using the pump.fun website directly:');
        console.log('   https://pump.fun');
        console.log('\n3. Or use an alternative service like:');
        console.log('   https://pumpportal.fun');

        saveResults({
          success: false,
          error: error2.message,
          attemptedMint: mintKeypair.publicKey.toBase58(),
          name: tokenName,
          symbol: tokenSymbol
        });
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

function displaySuccess(mint, signature, name, symbol) {
  console.log('\n📊 TOKEN DETAILS:\n');
  console.log('Token Mint:  ', mint);
  console.log('Transaction: ', signature);
  console.log('Name:        ', name);
  console.log('Symbol:      ', symbol);
  console.log('');
  console.log('🔗 VIEW YOUR TOKEN:');
  console.log(`Pump.fun:    https://pump.fun/coin/${mint}`);
  console.log(`Solscan:     https://solscan.io/token/${mint}`);
  console.log(`Explorer:    https://explorer.solana.com/address/${mint}`);
  console.log('');
  console.log('💰 EARNINGS STRUCTURE:');
  console.log('• Bonding Curve: You earn 0.30% of all trades');
  console.log('• Graduation: Happens at ~$69k market cap');
  console.log('• Post-Grad: Dynamic fees 0.05%-0.95% (30% to you)');
  console.log('');
  console.log('📈 NEXT STEPS:');
  console.log('1. Share your token link');
  console.log('2. Build community');
  console.log('3. Add more liquidity');
  console.log('4. Watch your earnings grow!');
  console.log('=' .repeat(70));
}

function saveResults(data) {
  const filename = `launch-${data.symbol || 'error'}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log('\n📁 Results saved to:', filename);
}

// Run
console.log('\n⚠️  MAINNET TOKEN LAUNCHER V2');
console.log('This will create a REAL token on Solana mainnet.\n');

launchTokenMainnetV2().catch(console.error);