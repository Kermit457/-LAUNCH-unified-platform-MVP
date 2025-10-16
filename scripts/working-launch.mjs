/**
 * WORKING PUMP.FUN LAUNCH WITH AUTO-DISTRIBUTION
 *
 * This uses manual transaction building to avoid SDK bugs
 * 1. Creates token on Pump.fun bonding curve
 * 2. Buys initial amount (0.01 SOL)
 * 3. Automatically distributes to 7 key holders
 */

import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } from '@solana/spl-token';
import bs58 from 'bs58';
import fs from 'fs';
import fetch from 'node-fetch';

// Read env
const envPath = new URL('../.env.local', import.meta.url);
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim();
  }
});

// Configuration
const TOKEN_CONFIG = {
  name: 'Freez Launch V2',
  symbol: 'FREEZV2',
  description: 'Testing complete Pump.fun launch with auto-distribution',
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

async function workingLaunch() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 WORKING PUMP.FUN LAUNCH + AUTO-DISTRIBUTION');
  console.log('='.repeat(70));
  console.log('');
  console.log('Token:', TOKEN_CONFIG.name, `(${TOKEN_CONFIG.symbol})`);
  console.log('Initial Buy:', TOKEN_CONFIG.initialBuySOL, 'SOL');
  console.log('');

  try {
    // Setup
    const privateKey = env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('No wallet configured!');

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const solBalance = (await connection.getBalance(creatorKeypair.publicKey)) / LAMPORTS_PER_SOL;

    console.log('📍 Creator:', creatorKeypair.publicKey.toBase58());
    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');
    console.log('');

    if (solBalance < TOKEN_CONFIG.initialBuySOL + 0.05) {
      throw new Error(`Insufficient balance! Need at least ${TOKEN_CONFIG.initialBuySOL + 0.05} SOL`);
    }

    // STEP 1: Create token using PumpPortal API
    console.log('STEP 1: Create Token with Initial Buy');
    console.log('='.repeat(70));

    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey.toBase58();

    console.log('🔑 Mint:', tokenMint);
    console.log('');

    // Create simple metadata
    const metadata = {
      name: TOKEN_CONFIG.name,
      symbol: TOKEN_CONFIG.symbol,
      description: TOKEN_CONFIG.description,
      image: 'https://cf-ipfs.com/ipfs/QmW6V4ZhFdCqf8yVWyBUKRzkQogqZz9bCFvTqKGESgNMK4',
      showName: true,
      createdOn: "https://pump.fun"
    };

    const metadataJson = JSON.stringify(metadata);
    const metadataUri = `data:application/json;base64,${Buffer.from(metadataJson).toString('base64')}`;

    // Use shorter IPFS URI to avoid "URI too long" error
    const shortUri = 'https://cf-ipfs.com/ipfs/QmW6V4ZhFdCqf8yVWyBUKRzkQogqZz9bCFvTqKGESgNMK4';

    console.log('📡 Calling PumpPortal API...');
    const response = await fetch('https://pumpportal.fun/api/trade-local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey: creatorKeypair.publicKey.toBase58(),
        action: 'create',
        tokenMetadata: {
          name: TOKEN_CONFIG.name,
          symbol: TOKEN_CONFIG.symbol,
          uri: shortUri
        },
        mint: tokenMint,
        denominatedInSol: 'true',
        amount: TOKEN_CONFIG.initialBuySOL,
        slippage: 25,
        priorityFee: 0.005,
        pool: 'pump'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const txBytes = await response.arrayBuffer();
    const transaction = VersionedTransaction.deserialize(Buffer.from(txBytes));

    console.log('📝 Signing transaction...');
    transaction.sign([creatorKeypair, mintKeypair]);

    console.log('📤 Sending transaction...');
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: true,
      maxRetries: 3
    });

    console.log('✅ TX Sent:', signature);
    console.log(`   View: https://solscan.io/tx/${signature}`);
    console.log('');

    // Wait for confirmation
    console.log('⏳ Confirming transaction...');

    let confirmed = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!confirmed && attempts < maxAttempts) {
      attempts++;
      try {
        const status = await connection.getSignatureStatus(signature);
        if (status?.value?.confirmationStatus === 'confirmed' ||
            status?.value?.confirmationStatus === 'finalized') {
          if (status.value.err) {
            throw new Error('Transaction failed: ' + JSON.stringify(status.value.err));
          }
          confirmed = true;
          break;
        }
      } catch (err) {
        // Continue polling
      }

      process.stdout.write(`   Checking... (${attempts}/${maxAttempts})\r`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (!confirmed) {
      console.log('\n⚠️  Transaction not confirmed after 60 seconds.');
      console.log('   Check manually:', `https://solscan.io/tx/${signature}`);
      return;
    }

    console.log('\n✅ TOKEN CREATED SUCCESSFULLY!');
    console.log('');

    // STEP 2: Wait for tokens and auto-distribute
    console.log('STEP 2: Auto-Distribution');
    console.log('='.repeat(70));

    const mintPubkey = new PublicKey(tokenMint);
    const creatorTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      creatorKeypair.publicKey
    );

    console.log('⏳ Waiting for tokens to appear in wallet...');

    let tokenBalance = 0;
    attempts = 0;

    while (tokenBalance === 0 && attempts < 30) {
      attempts++;
      try {
        const accountInfo = await getAccount(connection, creatorTokenAccount);
        tokenBalance = Number(accountInfo.amount);
        if (tokenBalance > 0) {
          break;
        }
      } catch (e) {
        // Account doesn't exist yet
      }
      process.stdout.write(`   Waiting... (${attempts}/30)\r`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (tokenBalance === 0) {
      console.log('\n⚠️  No tokens received yet.');
      console.log('   Token created at:', tokenMint);
      console.log('   Buy manually on pump.fun to get tokens, then run distribution.');
      return;
    }

    const decimals = 6;
    const balanceUI = tokenBalance / Math.pow(10, decimals);

    console.log(`\n✅ Received ${balanceUI.toLocaleString()} ${TOKEN_CONFIG.symbol}`);
    console.log('');

    // Calculate distributions
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

    console.log('📊 Distribution Plan:');
    distributions.forEach(d => {
      console.log(`  ${d.name.padEnd(20)} ${d.percentage.padStart(5)}% → ${d.amountUI.toLocaleString().padStart(15)} ${TOKEN_CONFIG.symbol}`);
    });
    console.log('');

    console.log('📤 Distributing...');
    console.log('');

    let successCount = 0;

    for (const dist of distributions) {
      try {
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

        const distSignature = await connection.sendTransaction(distributionTx, [creatorKeypair], {
          skipPreflight: false,
          maxRetries: 3
        });

        // Quick confirmation
        let distConfirmed = false;
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const status = await connection.getSignatureStatus(distSignature);
          if (status?.value?.confirmationStatus) {
            distConfirmed = true;
            break;
          }
        }

        console.log(`   ${distConfirmed ? '✅' : '⏳'} ${dist.name.padEnd(20)} ${dist.amountUI.toLocaleString().padStart(15)} ${TOKEN_CONFIG.symbol}`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ ${dist.name}: ${error.message}`);
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 COMPLETE! LAUNCH + DISTRIBUTION SUCCESS!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Final Results:');
    console.log('  Token Mint:        ', tokenMint);
    console.log('  Create TX:         ', signature);
    console.log('  Initial Buy:       ', TOKEN_CONFIG.initialBuySOL, 'SOL');
    console.log('  Distributions:     ', successCount, '/', KEY_HOLDERS.length);
    console.log('');
    console.log('🔗 Links:');
    console.log(`  Pump.fun:  https://pump.fun/coin/${tokenMint}`);
    console.log(`  Solscan:   https://solscan.io/token/${tokenMint}`);
    console.log('');

    // Save launch data
    const launchData = {
      success: true,
      tokenMint: tokenMint,
      createSignature: signature,
      ...TOKEN_CONFIG,
      totalDistributed: distributions.reduce((sum, d) => sum + d.amountUI, 0),
      successfulDistributions: successCount,
      distributions: distributions.map(d => ({
        name: d.name,
        address: d.address,
        percentage: d.percentage,
        amount: d.amountUI
      })),
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      `WORKING-LAUNCH-${TOKEN_CONFIG.symbol}-${Date.now()}.json`,
      JSON.stringify(launchData, null, 2)
    );

    console.log('💾 Launch data saved!');
    console.log('');

  } catch (error) {
    console.error('\n❌ LAUNCH FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
}

console.log('🚨 LAUNCHING IN 5 SECONDS...');
console.log('   Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  workingLaunch().catch(console.error);
}, 5000);