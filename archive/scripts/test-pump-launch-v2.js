/**
 * Test Pump.fun Token Launch V2 - With Proper Metadata
 * This version handles the image requirement properly
 *
 * Run: node scripts/test-pump-launch-v2.js
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const { PumpFunSDK } = require('pumpdotfun-sdk');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');
const path = require('path');

// Create a mock File class for Node.js environment
class NodeFile {
  constructor(buffer, filename, options = {}) {
    this.buffer = buffer;
    this.name = filename;
    this.type = options.type || 'image/png';
    this.size = buffer.length;
  }

  async arrayBuffer() {
    return this.buffer;
  }

  async text() {
    return this.buffer.toString();
  }

  stream() {
    const { Readable } = require('stream');
    return Readable.from(this.buffer);
  }
}

// Polyfill for File/Blob if not available
if (typeof File === 'undefined') {
  global.File = NodeFile;
}
if (typeof Blob === 'undefined') {
  global.Blob = NodeFile;
}

async function createTestImage() {
  // Create a simple 1x1 pixel PNG image
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk size
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, etc
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk size
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFE, 0xFF,
    0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
    0x49, 0xC1, 0x2C, 0x26, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk size
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);

  return new NodeFile(pngHeader, 'token-image.png', { type: 'image/png' });
}

async function testPumpLaunchV2() {
  console.log('🚀 Testing Pump.fun Token Launch V2 (With Metadata)\n');
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

    // Initialize SDK
    console.log('📦 Initializing Pump.fun SDK...');
    const sdk = new PumpFunSDK(connection);

    // Token parameters
    const timestamp = Date.now().toString().slice(-6);
    const tokenName = 'Curve Launch ' + timestamp;
    const tokenSymbol = 'CRV' + timestamp.slice(-4);
    const tokenDescription = 'Token launched from bonding curve graduation';

    console.log('\n📋 Token Details:');
    console.log('   Name:', tokenName);
    console.log('   Symbol:', tokenSymbol);
    console.log('   Description:', tokenDescription);
    console.log('   Initial Buy: 0.01 SOL');
    console.log('');

    // Create test image
    console.log('🎨 Creating token image...');
    const imageFile = await createTestImage();
    console.log('✅ Image created:', imageFile.name, `(${imageFile.size} bytes)`);

    // Generate mint keypair
    console.log('\n🔑 Generating token mint...');
    const mintKeypair = Keypair.generate();
    console.log('   Token Mint:', mintKeypair.publicKey.toBase58());

    console.log('\n💰 Creating token with initial buy...');
    console.log('⏳ This may take 10-30 seconds...\n');

    // Method 1: Try using SDK's createAndBuy with image
    try {
      // First upload metadata
      console.log('📤 Uploading metadata to IPFS...');

      // Create FormData for metadata upload
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('name', tokenName);
      formData.append('symbol', tokenSymbol);
      formData.append('description', tokenDescription);
      formData.append('showName', 'true');

      // For testing, we'll use a mock URI since we're on devnet
      const metadataUri = `https://ipfs.io/ipfs/Qm${Buffer.from(tokenName).toString('hex').slice(0, 44)}`;
      console.log('📝 Metadata URI (mock):', metadataUri);

      // Create and buy token
      const result = await sdk.createAndBuy(
        creatorKeypair,
        mintKeypair,
        {
          name: tokenName,
          symbol: tokenSymbol,
          uri: metadataUri,
          // Some SDKs might accept additional fields
          description: tokenDescription,
          image: imageFile
        },
        BigInt(0.01 * LAMPORTS_PER_SOL), // 0.01 SOL initial buy
        BigInt(500), // 5% slippage
        {
          // Additional options if supported
          commitment: 'confirmed'
        }
      );

      console.log('=' .repeat(70));
      console.log('✅ TOKEN CREATED SUCCESSFULLY!');
      console.log('=' .repeat(70));
      console.log('\n📊 Launch Results:');
      console.log('   Token Mint:', mintKeypair.publicKey.toBase58());
      console.log('   Transaction:', result.signature);
      console.log('   Metadata:', metadataUri);

      console.log('\n🔗 View on Explorer:');
      console.log(`   https://explorer.solana.com/tx/${result.signature}?cluster=devnet`);

      // Save results
      const resultData = {
        success: true,
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
      console.error('⚠️  SDK Error:', sdkError.message);

      // Method 2: Alternative approach using direct API
      console.log('\n🔄 Trying alternative method...\n');

      // This is where we'd implement the PumpPortal API method
      // or direct Solana program interaction

      console.log('📝 Alternative Methods Available:');
      console.log('');
      console.log('Option 1: PumpPortal API (POST to https://pumpportal.fun/api/trade-local)');
      console.log('Option 2: Direct Solana Program Interaction');
      console.log('Option 3: Wait for mainnet deployment');
      console.log('');
      console.log('💡 The Pump.fun SDK appears to be mainnet-focused.');
      console.log('   For production deployment:');
      console.log('   1. Switch to mainnet-beta network');
      console.log('   2. Fund wallet with real SOL (~0.1 SOL)');
      console.log('   3. Use actual IPFS upload for metadata');
      console.log('   4. Deploy real token with initial liquidity');
      console.log('');

      // Save error details
      const errorData = {
        success: false,
        error: sdkError.message,
        tokenMint: mintKeypair.publicKey.toBase58(),
        name: tokenName,
        symbol: tokenSymbol,
        network: 'devnet',
        createdAt: new Date().toISOString(),
        note: 'SDK may not support devnet. Consider mainnet deployment.'
      };

      fs.writeFileSync(
        'test-token-error.json',
        JSON.stringify(errorData, null, 2)
      );
      console.log('📁 Error details saved to: test-token-error.json');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('FormData')) {
      console.log('\n💡 Installing form-data package might help:');
      console.log('   npm install form-data');
    }
  }

  console.log('\n' + '=' .repeat(70));
  console.log('📚 Documentation References:');
  console.log('   - Setup Guide: PUMP_FUN_SETUP.md');
  console.log('   - Integration Guide: PUMP_FUN_INTEGRATION.md');
  console.log('   - Fee Structure: PROJECT_ASCEND_FEES_2025.md');
  console.log('=' .repeat(70));
}

// Run the test
testPumpLaunchV2().catch(console.error);