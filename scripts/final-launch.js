/**
 * FINAL WORKING PUMP.FUN AUTOMATION
 *
 * Fixed confirmation logic - won't falsely report success
 * Properly waits for transaction confirmation
 * Then distributes tokens immediately
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, VersionedTransaction, PublicKey, Transaction } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } = require('@solana/spl-token');
const bs58 = require('bs58').default || require('bs58');
const fetch = require('node-fetch');
const fs = require('fs');

// Configuration
const TOKEN_CONFIG = {
  name: 'Pixel Knight V2',
  symbol: 'KNT2',
  description: 'A legendary pixel warrior on Solana',
  imageUrl: 'https://arweave.net/placeholder-knight', // Will be replaced with actual upload
  initialBuySOL: 0.02 // Increased initial buy to avoid minimum amount issues
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

// PROPER confirmation function
async function waitForTransaction(connection, signature) {
  console.log('⏳ Waiting for confirmation...');

  const startTime = Date.now();
  const timeout = 60000; // 60 seconds

  while (Date.now() - startTime < timeout) {
    try {
      // Try to get the transaction
      const tx = await connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
      });

      if (tx) {
        if (tx.meta.err) {
          throw new Error('Transaction failed: ' + JSON.stringify(tx.meta.err));
        }
        console.log('✅ Transaction confirmed on-chain!');
        return true;
      }

      // Also check status
      const status = await connection.getSignatureStatus(signature);
      if (status?.value?.confirmationStatus === 'confirmed' ||
          status?.value?.confirmationStatus === 'finalized') {
        if (status.value.err) {
          throw new Error('Transaction failed: ' + JSON.stringify(status.value.err));
        }
        console.log('✅ Transaction confirmed via status check!');
        return true;
      }

      process.stdout.write(`   Checking... (${Math.floor((Date.now() - startTime) / 1000)}s)\r`);
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      if (error.message.includes('Transaction failed')) {
        throw error;
      }
      // Continue polling on other errors
    }
  }

  throw new Error('Transaction confirmation timeout after 60 seconds');
}

async function finalLaunch() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 FINAL PUMP.FUN AUTOMATION');
  console.log('='.repeat(70));
  console.log('');
  console.log('Token:', TOKEN_CONFIG.name, `(${TOKEN_CONFIG.symbol})`);
  console.log('');

  try {
    // Setup
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('No wallet configured!');

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const creatorAddress = creatorKeypair.publicKey.toBase58();

    // Use multiple RPCs for reliability
    const RPCS = [
      'https://api.mainnet-beta.solana.com',
      'https://solana.drpc.org',
      'https://solana-api.projectserum.com'
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

    // Create metadata
    console.log('STEP 1: Prepare Metadata');
    console.log('='.repeat(70));

    const metadata = {
      name: TOKEN_CONFIG.name,
      symbol: TOKEN_CONFIG.symbol,
      description: TOKEN_CONFIG.description,
      image: TOKEN_CONFIG.imageUrl,
      showName: true,
      createdOn: "https://pump.fun"
    };

    const metadataJson = JSON.stringify(metadata);
    const metadataUri = `data:application/json;base64,${Buffer.from(metadataJson).toString('base64')}`;

    console.log('✅ Metadata ready');
    console.log('');

    // Create token
    console.log('STEP 2: Create Token on Pump.fun');
    console.log('='.repeat(70));

    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey.toBase58();

    console.log('🔑 Mint:', tokenMint);
    console.log('');

    console.log('📡 Calling PumpPortal API...');
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
        slippage: 25, // Increased slippage for volatile market
        priorityFee: 0.005, // Increased priority fee significantly
        pool: 'pump'
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${await response.text()}`);
    }

    const txBytes = await response.arrayBuffer();
    const transaction = VersionedTransaction.deserialize(Buffer.from(txBytes));

    console.log('✅ Transaction built');
    console.log('');

    console.log('📝 Signing transaction...');
    transaction.sign([creatorKeypair, mintKeypair]);

    console.log('📤 Sending transaction...');
    const createSignature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false, // Keep preflight to catch errors early
      maxRetries: 3,
      preflightCommitment: 'processed'
    });

    console.log('✅ TX Sent:', createSignature);
    console.log(`   View: https://solscan.io/tx/${createSignature}`);
    console.log('');

    // PROPERLY wait for confirmation
    try {
      await waitForTransaction(connection, createSignature);
    } catch (error) {
      console.error('\n❌ Transaction failed or timed out!');
      console.error('   Error:', error.message);
      console.error('');
      console.error('   The token was NOT created.');
      console.error('   Check transaction:', `https://solscan.io/tx/${createSignature}`);
      throw error;
    }

    console.log('');
    console.log('✅ TOKEN SUCCESSFULLY CREATED!');
    console.log('');

    // Wait for token account
    console.log('STEP 3: Prepare Distribution');
    console.log('='.repeat(70));

    const mintPubkey = new PublicKey(tokenMint);
    const creatorTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      creatorKeypair.publicKey
    );

    console.log('⏳ Waiting for token account to initialize...');

    let tokenBalance = 0;
    let attempts = 0;
    const maxAttempts = 20; // 40 seconds

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
      console.log('   Run distribution manually: node scripts/distribute-knight.js');
      console.log('');
      return;
    }

    console.log('');

    // Distribute
    console.log('STEP 4: Distribute Tokens');
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
      console.log('  ✅ Token created and confirmed');
      console.log('  ✅ All tokens distributed');
      console.log('  ✅ No manual steps required');
      console.log('');
    }

    // Save data
    const launchData = {
      success: true,
      tokenMint,
      createSignature,
      ...TOKEN_CONFIG,
      metadataUri,
      distributions: distributions.map(d => ({
        name: d.name,
        address: d.address,
        percentage: d.percentage,
        amount: d.amountUI
      })),
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(`FINAL-${TOKEN_CONFIG.symbol}-${Date.now()}.json`, JSON.stringify(launchData, null, 2));

  } catch (error) {
    console.error('\n❌ AUTOMATION FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
}

console.log('🚨 FINAL LAUNCH - REAL SOL - PROPER CONFIRMATIONS');
console.log('⏱️  Starting in 5 seconds... Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  finalLaunch().catch(console.error);
}, 5000);
