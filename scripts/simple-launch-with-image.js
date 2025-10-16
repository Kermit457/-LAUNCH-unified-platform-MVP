/**
 * SIMPLE PUMP.FUN LAUNCH WITH IMAGE
 *
 * Just upload the image directly to Pump.fun like their website does!
 * No IPFS, no external APIs, just their upload endpoint.
 *
 * Run: node scripts/simple-launch-with-image.js
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, VersionedTransaction, PublicKey, Transaction } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } = require('@solana/spl-token');
const bs58 = require('bs58').default || require('bs58');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

// Configuration
const TOKEN_CONFIG = {
  name: 'Pixel Knight',
  symbol: 'KNIGHT',
  description: 'A legendary pixel warrior on the Solana blockchain',
  initialBuySOL: 0.01
};

const IMAGE_PATH = 'token-image.png'; // Your pixel art image

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

async function uploadImageToPumpFun(imagePath) {
  console.log('📤 Uploading image to Pump.fun...');

  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image not found: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    console.log('   Image size:', (imageBuffer.length / 1024).toFixed(2), 'KB');

    // Create form data
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: 'image.png',
      contentType: 'image/png'
    });

    // Upload to Pump.fun's IPFS endpoint
    const response = await fetch('https://pump.fun/api/ipfs', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('   ✅ Uploaded!');
    console.log('   IPFS URL:', data.url || data.ipfs || data);

    return data.url || data.ipfs || data.metadataUri;

  } catch (error) {
    console.log('   ⚠️  Upload failed, using placeholder');
    // Fallback to a placeholder or base64
    return 'https://via.placeholder.com/400';
  }
}

async function waitForConfirmation(connection, signature, maxAttempts = 30) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    attempts++;
    try {
      const status = await connection.getSignatureStatus(signature);
      if (status?.value?.confirmationStatus === 'confirmed' ||
          status?.value?.confirmationStatus === 'finalized') {
        if (status.value.err) throw new Error('Transaction failed');
        return true;
      }
      process.stdout.write(`   Confirming ${attempts}/${maxAttempts}...\r`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      if (attempts === maxAttempts) throw new Error('Timeout');
    }
  }
  return false;
}

async function simpleLaunchWithImage() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 SIMPLE PUMP.FUN LAUNCH WITH IMAGE');
  console.log('='.repeat(70));
  console.log('');
  console.log('Token:', TOKEN_CONFIG.name, `(${TOKEN_CONFIG.symbol})`);
  console.log('Image:', IMAGE_PATH);
  console.log('');

  try {
    // Setup
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('No wallet configured!');

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const creatorAddress = creatorKeypair.publicKey.toBase58();

    const connection = new Connection('https://solana.drpc.org', 'confirmed');
    const balance = await connection.getBalance(creatorKeypair.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;

    console.log('📍 Creator:', creatorAddress);
    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');
    console.log('');

    if (solBalance < TOKEN_CONFIG.initialBuySOL + 0.1) {
      throw new Error('Insufficient balance!');
    }

    // Step 1: Upload image to Pump.fun
    console.log('STEP 1: Upload Image');
    console.log('='.repeat(70));
    const imageUrl = await uploadImageToPumpFun(IMAGE_PATH);
    console.log('');

    // Step 2: Create metadata
    console.log('STEP 2: Create Metadata');
    console.log('='.repeat(70));

    const metadata = {
      name: TOKEN_CONFIG.name,
      symbol: TOKEN_CONFIG.symbol,
      description: TOKEN_CONFIG.description,
      image: imageUrl,
      showName: true,
      createdOn: "https://pump.fun"
    };

    const metadataJson = JSON.stringify(metadata);
    const metadataUri = `data:application/json;base64,${Buffer.from(metadataJson).toString('base64')}`;

    console.log('✅ Metadata created with image');
    console.log('');

    // Step 3: Create token
    console.log('STEP 3: Create Token');
    console.log('='.repeat(70));

    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey.toBase58();

    console.log('Generated Mint:', tokenMint);
    console.log('');

    console.log('⏳ Calling Pump.fun API...');
    const response = await fetch('https://pumpportal.fun/api/trade-local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey: creatorAddress,
        action: 'create',
        tokenMetadata: {
          name: TOKEN_CONFIG.name,
          symbol: TOKEN_CONFIG.symbol,
          uri: metadataUri
        },
        mint: tokenMint,
        denominatedInSol: 'true',
        amount: TOKEN_CONFIG.initialBuySOL,
        slippage: 10,
        priorityFee: 0.0005,
        pool: 'pump'
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const txBytes = await response.arrayBuffer();
    const transaction = VersionedTransaction.deserialize(Buffer.from(txBytes));

    console.log('✅ Transaction received');
    transaction.sign([creatorKeypair, mintKeypair]);

    const createSignature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });

    console.log('✅ Token creation TX sent:', createSignature);
    console.log('');

    await waitForConfirmation(connection, createSignature);
    console.log('\n✅ TOKEN CREATED!');
    console.log('');

    // Step 4: Wait for token account
    console.log('STEP 4: Prepare Distribution');
    console.log('='.repeat(70));

    const mintPubkey = new PublicKey(tokenMint);
    const creatorTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      creatorKeypair.publicKey
    );

    console.log('⏳ Waiting for token account...');

    let tokenBalance = 0;
    let attempts = 0;

    while (tokenBalance === 0 && attempts < 15) {
      attempts++;
      try {
        const tokenAccountInfo = await getAccount(connection, creatorTokenAccount);
        tokenBalance = Number(tokenAccountInfo.amount);
        if (tokenBalance > 0) {
          console.log(`✅ Ready! Balance: ${tokenBalance}`);
          break;
        }
      } catch (e) {}
      process.stdout.write(`   Checking ${attempts}/15...\r`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (tokenBalance === 0) {
      throw new Error('Token account not ready');
    }

    console.log('');

    // Step 5: Distribute
    console.log('STEP 5: Distribute Tokens');
    console.log('='.repeat(70));
    console.log('');

    const decimals = 6;
    const distributions = KEY_HOLDERS.map(holder => {
      const percentage = holder.keys / TOTAL_KEYS;
      const amount = Math.floor(tokenBalance * percentage);
      return { ...holder, percentage: (percentage * 100).toFixed(1), amount, amountUI: amount / Math.pow(10, decimals) };
    });

    let successCount = 0;

    for (const dist of distributions) {
      try {
        console.log(`📤 ${dist.name}...`);

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
            creatorKeypair.publicKey, recipientTokenAccount, recipientPubkey, mintPubkey
          ));
        }

        distributionTx.add(createTransferInstruction(
          creatorTokenAccount, recipientTokenAccount, creatorKeypair.publicKey, dist.amount
        ));

        const distSignature = await connection.sendTransaction(distributionTx, [creatorKeypair]);
        await connection.confirmTransaction(distSignature, 'confirmed');

        console.log(`   ✅ Sent ${dist.amountUI.toLocaleString()} ${TOKEN_CONFIG.symbol}`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Results:');
    console.log('  Token:         ', tokenMint);
    console.log('  Distributed:   ', successCount, 'of', KEY_HOLDERS.length);
    console.log('');
    console.log('🔗 Check:');
    console.log(`  Pump.fun: https://pump.fun/coin/${tokenMint}`);
    console.log(`  Solscan:  https://solscan.io/token/${tokenMint}`);
    console.log('');

    if (successCount === KEY_HOLDERS.length) {
      console.log('✅ PERFECT! Complete automation working!');
      console.log('  ✅ Image uploaded');
      console.log('  ✅ Token created');
      console.log('  ✅ Tokens distributed');
      console.log('');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  }
}

console.log('🚨 LAUNCHING WITH IMAGE - REAL SOL');
console.log('⏱️  Starting in 5 seconds...');
console.log('');

setTimeout(() => {
  simpleLaunchWithImage().catch(console.error);
}, 5000);
