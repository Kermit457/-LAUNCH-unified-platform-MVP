/**
 * COMPLETE PUMP.FUN AUTOMATION
 *
 * This script does EVERYTHING in one shot:
 * 1. Creates token on Pump.fun with proper metadata
 * 2. IMMEDIATELY distributes tokens to all key holders
 * 3. No delays, no manual steps
 *
 * Run: node scripts/complete-automation.js
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, VersionedTransaction, PublicKey, Transaction } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } = require('@solana/spl-token');
const bs58 = require('bs58').default || require('bs58');
const fetch = require('node-fetch');
const fs = require('fs');

// ============================================================================
// CONFIGURATION
// ============================================================================

const TOKEN_CONFIG = {
  name: 'Final Test',
  symbol: 'FINAL',
  description: 'Complete automation test with instant distribution',
  imageUrl: 'https://arweave.net/placeholder', // Use actual image URL in production
  initialBuySOL: 0.01
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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createMetadataUri(config) {
  const metadata = {
    name: config.name,
    symbol: config.symbol,
    description: config.description,
    image: config.imageUrl,
    showName: true,
    createdOn: "https://pump.fun"
  };

  // Use data URI for metadata (works for Solana)
  const metadataJson = JSON.stringify(metadata);
  const base64 = Buffer.from(metadataJson).toString('base64');
  return `data:application/json;base64,${base64}`;
}

async function waitForConfirmation(connection, signature, maxAttempts = 30) {
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const status = await connection.getSignatureStatus(signature);
      if (status?.value?.confirmationStatus === 'confirmed' ||
          status?.value?.confirmationStatus === 'finalized') {
        if (status.value.err) throw new Error('Transaction failed: ' + JSON.stringify(status.value.err));
        return true;
      }
      process.stdout.write(`   Confirming ${attempts}/${maxAttempts}...\r`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      if (attempts === maxAttempts) throw new Error('Confirmation timeout');
    }
  }

  return false;
}

// ============================================================================
// MAIN AUTOMATION
// ============================================================================

async function completeAutomation() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 COMPLETE PUMP.FUN AUTOMATION');
  console.log('='.repeat(70));
  console.log('');
  console.log('This will:');
  console.log('  1. Create token on Pump.fun');
  console.log('  2. INSTANTLY distribute to 7 key holders');
  console.log('  3. Everything automatic, no manual steps');
  console.log('');
  console.log('Token:', TOKEN_CONFIG.name, `(${TOKEN_CONFIG.symbol})`);
  console.log('Buy Amount:', TOKEN_CONFIG.initialBuySOL, 'SOL');
  console.log('');

  try {
    // ========================================================================
    // STEP 1: SETUP
    // ========================================================================

    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('No wallet configured!');

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const creatorAddress = creatorKeypair.publicKey.toBase58();

    const RPC_URL = 'https://solana.drpc.org';
    const connection = new Connection(RPC_URL, 'confirmed');

    const balance = await connection.getBalance(creatorKeypair.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;

    console.log('📍 Creator:', creatorAddress);
    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');
    console.log('');

    if (solBalance < TOKEN_CONFIG.initialBuySOL + 0.1) {
      throw new Error(`Insufficient balance! Need at least ${TOKEN_CONFIG.initialBuySOL + 0.1} SOL`);
    }

    // ========================================================================
    // STEP 2: CREATE TOKEN
    // ========================================================================

    console.log('STEP 1: Creating Token on Pump.fun');
    console.log('='.repeat(70));

    const metadataUri = createMetadataUri(TOKEN_CONFIG);
    console.log('✅ Metadata URI created');

    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey.toBase58();

    console.log('✅ Mint generated:', tokenMint);
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
    console.log('');

    console.log('📝 Signing and sending...');
    transaction.sign([creatorKeypair, mintKeypair]);

    const createSignature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });

    console.log('✅ Token creation TX sent:', createSignature);
    console.log('⏳ Confirming...');

    await waitForConfirmation(connection, createSignature);

    console.log('\n✅ TOKEN CREATED SUCCESSFULLY!');
    console.log('');

    // ========================================================================
    // STEP 3: WAIT FOR TOKEN ACCOUNT TO BE READY
    // ========================================================================

    console.log('STEP 2: Preparing Distribution');
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
          console.log(`✅ Token account ready! Balance: ${tokenBalance}`);
          break;
        }
      } catch (e) {
        // Account doesn't exist yet
      }

      process.stdout.write(`   Checking ${attempts}/15...\r`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (tokenBalance === 0) {
      throw new Error('Token account not ready after 30 seconds');
    }

    console.log('');

    // ========================================================================
    // STEP 4: CALCULATE DISTRIBUTION
    // ========================================================================

    const decimals = 6; // Pump.fun uses 6 decimals
    const balanceUI = tokenBalance / Math.pow(10, decimals);

    console.log('💰 Distribution Calculation:');
    console.log('  Total tokens in wallet:', balanceUI.toLocaleString());
    console.log('');

    const distributions = KEY_HOLDERS.map(holder => {
      const percentage = holder.keys / TOTAL_KEYS;
      const amount = Math.floor(tokenBalance * percentage);
      const amountUI = amount / Math.pow(10, decimals);

      return {
        ...holder,
        percentage: (percentage * 100).toFixed(1),
        amount,
        amountUI
      };
    });

    distributions.forEach(d => {
      console.log(`  ${d.name.padEnd(20)} ${d.percentage.padStart(5)}% → ${d.amountUI.toLocaleString().padStart(15)} ${TOKEN_CONFIG.symbol}`);
    });

    console.log('');

    // ========================================================================
    // STEP 5: EXECUTE DISTRIBUTIONS
    // ========================================================================

    console.log('STEP 3: Distributing Tokens');
    console.log('='.repeat(70));
    console.log('');

    let successCount = 0;
    let failCount = 0;

    for (const dist of distributions) {
      try {
        console.log(`📤 ${dist.name}...`);

        const recipientPubkey = new PublicKey(dist.address);
        const recipientTokenAccount = await getAssociatedTokenAddress(
          mintPubkey,
          recipientPubkey
        );

        // Check if recipient token account exists
        let needsAccountCreation = false;
        try {
          await getAccount(connection, recipientTokenAccount);
        } catch (e) {
          needsAccountCreation = true;
        }

        // Build transaction
        const distributionTx = new Transaction();

        // Add create account instruction if needed
        if (needsAccountCreation) {
          distributionTx.add(
            createAssociatedTokenAccountInstruction(
              creatorKeypair.publicKey,
              recipientTokenAccount,
              recipientPubkey,
              mintPubkey
            )
          );
        }

        // Add transfer instruction
        distributionTx.add(
          createTransferInstruction(
            creatorTokenAccount,
            recipientTokenAccount,
            creatorKeypair.publicKey,
            dist.amount
          )
        );

        // Send transaction
        const distSignature = await connection.sendTransaction(distributionTx, [creatorKeypair]);

        // Wait for confirmation
        await connection.confirmTransaction(distSignature, 'confirmed');

        console.log(`   ✅ Sent ${dist.amountUI.toLocaleString()} ${TOKEN_CONFIG.symbol}`);

        successCount++;

      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        failCount++;
      }
    }

    console.log('');

    // ========================================================================
    // STEP 6: SUMMARY
    // ========================================================================

    console.log('='.repeat(70));
    console.log('🎉 AUTOMATION COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 RESULTS:');
    console.log('  Token Created:        ✅', tokenMint);
    console.log('  Distributions:        ✅', successCount, 'of', KEY_HOLDERS.length);
    console.log('  Failed:               ', failCount);
    console.log('');
    console.log('🔗 CHECK YOUR TOKEN:');
    console.log(`  Pump.fun:  https://pump.fun/coin/${tokenMint}`);
    console.log(`  Solscan:   https://solscan.io/token/${tokenMint}`);
    console.log('');

    if (successCount === KEY_HOLDERS.length) {
      console.log('✅ PERFECT! All tokens distributed successfully!');
      console.log('');
      console.log('Your complete automation is working:');
      console.log('  ✅ Token creation');
      console.log('  ✅ Instant distribution');
      console.log('  ✅ No manual steps required');
      console.log('');
    }

    // Save data
    const launchData = {
      success: true,
      tokenMint,
      createSignature,
      tokenName: TOKEN_CONFIG.name,
      tokenSymbol: TOKEN_CONFIG.symbol,
      description: TOKEN_CONFIG.description,
      metadataUri,
      buyAmount: TOKEN_CONFIG.initialBuySOL,
      distributions: distributions.map(d => ({
        name: d.name,
        address: d.address,
        keys: d.keys,
        percentage: d.percentage,
        amount: d.amountUI
      })),
      successfulDistributions: successCount,
      failedDistributions: failCount,
      timestamp: new Date().toISOString(),
      pumpFunUrl: `https://pump.fun/coin/${tokenMint}`
    };

    const filename = `COMPLETE-${TOKEN_CONFIG.symbol}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(launchData, null, 2));

    console.log('📁 Launch data saved:', filename);
    console.log('');

  } catch (error) {
    console.error('\n❌ AUTOMATION FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// ============================================================================
// RUN
// ============================================================================

console.log('🚨 COMPLETE AUTOMATION - REAL SOL - REAL TOKENS');
console.log('⏱️  Starting in 5 seconds... Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  completeAutomation().catch(console.error);
}, 5000);
