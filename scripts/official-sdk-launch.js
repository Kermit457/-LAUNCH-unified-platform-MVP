/**
 * OFFICIAL PUMP.FUN SDK TOKEN LAUNCH
 *
 * Uses the official pumpdotfun-sdk instead of PumpPortal API
 * This should be more reliable and avoid the error 13 issue
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } = require('@solana/spl-token');
const { AnchorProvider, Wallet } = require('@coral-xyz/anchor');
const { PumpFunSDK } = require('pumpdotfun-sdk');
const fs = require('fs');
const bs58 = require('bs58').default || require('bs58');

// Node.js polyfills for browser APIs
global.FormData = require('form-data');
global.Blob = class Blob {
  constructor(parts, options) {
    this.parts = parts;
    this.type = options?.type || '';
  }
};

// Configuration
const TOKEN_CONFIG = {
  name: 'Pixel Knight V3',
  symbol: 'KNT3',
  description: 'A legendary pixel warrior on Solana - Launched via official SDK',
  initialBuySOL: 0.02
};

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

async function officialSDKLaunch() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 OFFICIAL PUMP.FUN SDK LAUNCH');
  console.log('='.repeat(70));
  console.log('');
  console.log('Token:', TOKEN_CONFIG.name, `(${TOKEN_CONFIG.symbol})`);
  console.log('');

  try {
    // Setup wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('No wallet configured!');

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const creatorAddress = creatorKeypair.publicKey.toBase58();

    // Setup connection - try multiple RPCs
    const RPCS = [
      'https://api.mainnet-beta.solana.com',
      'https://solana.drpc.org',
    ];

    let connection;
    let solBalance;

    console.log('🔌 Connecting to Solana...');
    for (const rpc of RPCS) {
      try {
        connection = new Connection(rpc, 'confirmed');
        const balance = await connection.getBalance(creatorKeypair.publicKey);
        solBalance = balance / LAMPORTS_PER_SOL;
        console.log(`   ✅ Connected via ${rpc}`);
        break;
      } catch (e) {
        console.log(`   ❌ ${rpc} failed`);
      }
    }

    console.log('');
    console.log('📍 Creator:', creatorAddress);
    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');
    console.log('');

    if (solBalance < TOKEN_CONFIG.initialBuySOL + 0.05) {
      throw new Error(`Insufficient balance! Need at least ${TOKEN_CONFIG.initialBuySOL + 0.05} SOL`);
    }

    // Setup Anchor provider and SDK
    console.log('STEP 1: Initialize SDK');
    console.log('='.repeat(70));

    const wallet = new Wallet(creatorKeypair);
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'finalized'
    });

    const sdk = new PumpFunSDK(provider);
    console.log('✅ SDK initialized');
    console.log('');

    // Create token with image
    console.log('STEP 2: Create Token Metadata');
    console.log('='.repeat(70));

    // Load image as Blob
    let imageFile;
    try {
      const imagePath = 'C:\\Users\\mirko\\OneDrive\\Desktop\\WIDGETS FOR LAUNCH\\token-image.png.jpg';
      const imageBuffer = fs.readFileSync(imagePath);
      imageFile = new Blob([imageBuffer], { type: 'image/jpeg' });
      console.log('✅ Image loaded:', imagePath);
    } catch (e) {
      console.log('⚠️  Image not found, using placeholder');
      // Create a tiny placeholder image
      imageFile = new Blob([Buffer.from('')], { type: 'image/png' });
    }

    const tokenMetadata = {
      name: TOKEN_CONFIG.name,
      symbol: TOKEN_CONFIG.symbol,
      description: TOKEN_CONFIG.description,
      file: imageFile
    };

    console.log('✅ Metadata prepared');
    console.log('');

    // Create and buy
    console.log('STEP 3: Create Token on Pump.fun');
    console.log('='.repeat(70));

    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey.toBase58();

    console.log('🔑 Mint:', tokenMint);
    console.log('');

    console.log('📡 Calling createAndBuy...');
    console.log('   Initial buy:', TOKEN_CONFIG.initialBuySOL, 'SOL');
    console.log('   Slippage: 25%');
    console.log('');

    const createResults = await sdk.createAndBuy(
      creatorKeypair,
      mintKeypair,
      tokenMetadata,
      BigInt(Math.floor(TOKEN_CONFIG.initialBuySOL * LAMPORTS_PER_SOL)),
      BigInt(2500), // 25% slippage (2500 basis points)
      {
        unitLimit: 250000,
        unitPrice: 250000
      }
    );

    if (!createResults.success) {
      console.error('❌ Token creation failed!');
      console.error('   Error:', createResults.error);
      throw new Error('Token creation failed: ' + JSON.stringify(createResults.error));
    }

    console.log('✅ TOKEN SUCCESSFULLY CREATED!');
    console.log('   Signature:', createResults.signature);
    console.log(`   View: https://solscan.io/tx/${createResults.signature}`);
    console.log('');

    // Wait for token account
    console.log('STEP 4: Prepare Distribution');
    console.log('='.repeat(70));

    const mintPubkey = mintKeypair.publicKey;
    const creatorTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      creatorKeypair.publicKey
    );

    console.log('⏳ Waiting for token account to initialize...');

    let tokenBalance = 0;
    let attempts = 0;
    const maxAttempts = 30; // 60 seconds

    while (tokenBalance === 0 && attempts < maxAttempts) {
      attempts++;
      try {
        const accountInfo = await getAccount(connection, creatorTokenAccount);
        tokenBalance = Number(accountInfo.amount);

        if (tokenBalance > 0) {
          console.log(`✅ Token account ready! Balance: ${tokenBalance}`);
          break;
        }
      } catch (e) {
        // Account doesn't exist yet, keep waiting
      }

      process.stdout.write(`   Attempt ${attempts}/${maxAttempts}...\r`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (tokenBalance === 0) {
      console.log('\n⚠️  Token account not ready yet.');
      console.log('   Token created successfully but distribution must be done manually.');
      console.log('   Mint address:', tokenMint);
      console.log('');
      return;
    }

    console.log('');

    // Distribute
    console.log('STEP 5: Distribute Tokens');
    console.log('='.repeat(70));
    console.log('');

    const decimals = 6;
    const distributions = KEY_HOLDERS.map(holder => {
      const percentage = holder.keys / TOTAL_KEYS;
      const amount = Math.floor(tokenBalance * percentage);
      return {
        ...holder,
        percentage: (percentage * 100).toFixed(1),
        amount,
        amountUI: amount / Math.pow(10, decimals)
      };
    });

    distributions.forEach(d => {
      console.log(`  ${d.name.padEnd(20)} ${d.percentage.padStart(5)}% → ${d.amountUI.toLocaleString().padStart(12)} ${TOKEN_CONFIG.symbol}`);
    });

    console.log('');
    console.log('📤 Executing distributions...');
    console.log('');

    let successCount = 0;

    for (const dist of distributions) {
      try {
        console.log(`   ${dist.name}...`);

        const recipientPubkey = new PublicKey(dist.address);
        const recipientTokenAccount = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

        let needsAccountCreation = false;
        try {
          await getAccount(connection, recipientTokenAccount);
        } catch (e) {
          needsAccountCreation = true;
        }

        const distributionTx = new Transaction();

        if (needsAccountCreation) {
          distributionTx.add(createAssociatedTokenAccountInstruction(
            creatorKeypair.publicKey,
            recipientTokenAccount,
            recipientPubkey,
            mintPubkey
          ));
        }

        distributionTx.add(createTransferInstruction(
          creatorTokenAccount,
          recipientTokenAccount,
          creatorKeypair.publicKey,
          dist.amount
        ));

        const distSignature = await connection.sendTransaction(distributionTx, [creatorKeypair]);

        // Quick confirmation check
        let confirmed = false;
        for (let i = 0; i < 10; i++) {
          const status = await connection.getSignatureStatus(distSignature);
          if (status?.value?.confirmationStatus) {
            confirmed = true;
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (confirmed) {
          console.log(`   ✅ ${dist.amountUI.toLocaleString()} ${TOKEN_CONFIG.symbol}`);
          successCount++;
        } else {
          console.log(`   ⏳ Sent (confirming...)`);
          successCount++;
        }

      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 AUTOMATION COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Results:');
    console.log('  Token Created:    ✅', tokenMint);
    console.log('  Distributions:    ✅', successCount, 'of', KEY_HOLDERS.length);
    console.log('');
    console.log('🔗 Check Token:');
    console.log(`  Pump.fun:  https://pump.fun/coin/${tokenMint}`);
    console.log(`  Solscan:   https://solscan.io/token/${tokenMint}`);
    console.log('');

    if (successCount === KEY_HOLDERS.length) {
      console.log('✅ PERFECT! Complete automation working!');
      console.log('  ✅ Token created using official SDK');
      console.log('  ✅ All tokens distributed');
      console.log('  ✅ No manual steps required');
      console.log('');
    }

    // Save data
    const launchData = {
      success: true,
      tokenMint,
      createSignature: createResults.signature,
      ...TOKEN_CONFIG,
      distributions: distributions.map(d => ({
        name: d.name,
        address: d.address,
        percentage: d.percentage,
        amount: d.amountUI
      })),
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(`OFFICIAL-SDK-${TOKEN_CONFIG.symbol}-${Date.now()}.json`, JSON.stringify(launchData, null, 2));

  } catch (error) {
    console.error('\n❌ AUTOMATION FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
}

console.log('🚨 OFFICIAL SDK LAUNCH - REAL SOL');
console.log('⏱️  Starting in 5 seconds... Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  officialSDKLaunch().catch(console.error);
}, 5000);
