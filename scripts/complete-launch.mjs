/**
 * COMPLETE PUMP.FUN LAUNCH WITH AUTO-DISTRIBUTION
 *
 * 1. Creates token on Pump.fun bonding curve
 * 2. Buys initial amount (0.01 SOL)
 * 3. Automatically distributes to 7 key holders
 *
 * ONE SCRIPT - COMPLETE AUTOMATION
 */

import 'dotenv/config';
import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } from '@solana/spl-token';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import bs58 from 'bs58';
import fs from 'fs';
// Use the OFFICIAL @pump-fun/pump-sdk instead!
import { PumpSDK } from '@pump-fun/pump-sdk';
import { buy } from '@pump-fun/pump-swap-sdk';

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
  name: 'Freez Launch Test',
  symbol: 'FREEZ',
  description: 'Testing complete Pump.fun launch with auto-distribution',
  initialBuySOL: 0.01 // Small amount for testing
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

async function completeLaunch() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 COMPLETE PUMP.FUN LAUNCH + AUTO-DISTRIBUTION');
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

    // STEP 1: Initialize SDK
    console.log('STEP 1: Initialize SDK');
    console.log('='.repeat(70));

    const wallet = new Wallet(creatorKeypair);
    const provider = new AnchorProvider(connection, wallet, { commitment: 'finalized' });
    const sdk = new PumpFunSDK(provider);

    console.log('✅ SDK ready');
    console.log('');

    // STEP 2: Create token with initial buy
    console.log('STEP 2: Create Token + Buy');
    console.log('='.repeat(70));

    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey;

    console.log('🔑 Mint:', tokenMint.toBase58());
    console.log('');

    // Create token using manual instructions (avoid Blob complexity)
    console.log('📡 Building create + buy transaction...');
    console.log('');

    // Use a short metadata URI (you'd upload to IPFS in production)
    const metadataUri = 'https://cf-ipfs.com/ipfs/QmW6V4ZhFdCqf8yVWyBUKRzkQogqZz9bCFvTqKGESgNMK4';

    // Get create instructions
    const createTx = await sdk.getCreateInstructions(
      creatorKeypair.publicKey,
      TOKEN_CONFIG.name,
      TOKEN_CONFIG.symbol,
      metadataUri,
      mintKeypair
    );

    const buyAmountSOL = BigInt(Math.floor(TOKEN_CONFIG.initialBuySOL * LAMPORTS_PER_SOL));
    const slippageBasisPoints = BigInt(2500); // 25% slippage

    // Get global account for initial buy price calculation
    const globalAccount = await sdk.getGlobalAccount('confirmed');
    const buyAmount = globalAccount.getInitialBuyPrice(buyAmountSOL);
    const buyAmountWithSlippage = buyAmountSOL + (buyAmountSOL * slippageBasisPoints / BigInt(10000));

    // STEP 2A: Send CREATE transaction first
    const { ComputeBudgetProgram } = await import('@solana/web3.js');
    const createOnlyTx = new Transaction();

    createOnlyTx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }));
    createOnlyTx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 400000 }));
    createOnlyTx.add(createTx);

    console.log('📤 Sending CREATE transaction...');

    const { blockhash: createBlockhash } = await connection.getLatestBlockhash('finalized');
    createOnlyTx.recentBlockhash = createBlockhash;
    createOnlyTx.feePayer = creatorKeypair.publicKey;
    createOnlyTx.sign(creatorKeypair, mintKeypair);

    const createSignature = await connection.sendRawTransaction(createOnlyTx.serialize(), {
      skipPreflight: false,
      maxRetries: 3
    });

    console.log('✅ Create TX Sent:', createSignature);
    console.log(`   View: https://solscan.io/tx/${createSignature}`);
    console.log('');

    console.log('⏳ Confirming create...');
    const createConfirmation = await connection.confirmTransaction(createSignature, 'confirmed');

    if (createConfirmation.value.err) {
      throw new Error('Create failed: ' + JSON.stringify(createConfirmation.value.err));
    }

    console.log('✅ TOKEN CREATED!');
    console.log('');

    // STEP 2B: Use the SDK properly - getBuyInstructionsBySolAmount instead of getBuyInstructions
    console.log('📡 Buying tokens from bonding curve...');
    console.log('   Amount:', TOKEN_CONFIG.initialBuySOL, 'SOL');
    console.log('   Slippage: 25%');
    console.log('');

    // Wait a moment for the bonding curve to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use getBuyInstructionsBySolAmount which properly handles all accounts
    const buyTx = await sdk.getBuyInstructionsBySolAmount(
      creatorKeypair.publicKey,
      tokenMint,
      buyAmountSOL,
      slippageBasisPoints,
      'confirmed'
    );

    const buyOnlyTx = new Transaction();
    buyOnlyTx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 250000 }));
    buyOnlyTx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 250000 }));
    buyOnlyTx.add(...buyTx.instructions);

    console.log('📤 Sending BUY transaction...');

    const { blockhash: buyBlockhash } = await connection.getLatestBlockhash('finalized');
    buyOnlyTx.recentBlockhash = buyBlockhash;
    buyOnlyTx.feePayer = creatorKeypair.publicKey;
    buyOnlyTx.sign(creatorKeypair);

    const buySignature = await connection.sendRawTransaction(buyOnlyTx.serialize(), {
      skipPreflight: false,
      maxRetries: 3
    });

    console.log('✅ Buy TX Sent:', buySignature);
    console.log(`   View: https://solscan.io/tx/${buySignature}`);
    console.log('');

    console.log('⏳ Confirming buy...');
    const buyConfirmation = await connection.confirmTransaction(buySignature, 'confirmed');

    if (buyConfirmation.value.err) {
      console.error('❌ Buy failed:', buyConfirmation.value.err);
      throw new Error('Buy failed: ' + JSON.stringify(buyConfirmation.value.err));
    }

    console.log('✅ BUY SUCCESS!');
    console.log('');

    const result = { success: true, signature: createSignature, buySignature };

    if (!result.success) {
      console.error('❌ Token creation failed!');
      console.error('   Error:', result.error);
      throw new Error('Creation failed: ' + JSON.stringify(result.error));
    }

    console.log('');
    console.log('✅ TOKEN CREATED + INITIAL BUY SUCCESS!');
    console.log('   Signature:', result.signature);
    console.log(`   View: https://solscan.io/tx/${result.signature}`);
    console.log('');

    // STEP 3: Wait for tokens and auto-distribute
    console.log('STEP 3: Auto-Distribution');
    console.log('='.repeat(70));

    const creatorTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      creatorKeypair.publicKey
    );

    console.log('⏳ Waiting for tokens to appear in wallet...');

    let tokenBalance = 0;
    let attempts = 0;
    const maxAttempts = 30;

    while (tokenBalance === 0 && attempts < maxAttempts) {
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
      process.stdout.write(`   Attempt ${attempts}/${maxAttempts}...\r`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (tokenBalance === 0) {
      console.log('\n⚠️  Tokens not received yet. Distribution skipped.');
      console.log('   You can distribute manually later.');
      console.log('');
      console.log('Token created successfully at:', tokenMint.toBase58());
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
        const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, recipientPubkey);

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
            tokenMint
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
        let confirmed = false;
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const status = await connection.getSignatureStatus(distSignature);
          if (status?.value?.confirmationStatus) {
            confirmed = true;
            break;
          }
        }

        console.log(`   ${confirmed ? '✅' : '⏳'} ${dist.name.padEnd(20)} ${dist.amountUI.toLocaleString().padStart(15)} ${TOKEN_CONFIG.symbol}`);
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
    console.log('  Token Mint:        ', tokenMint.toBase58());
    console.log('  Create TX:         ', result.signature);
    console.log('  Initial Buy:       ✅', TOKEN_CONFIG.initialBuySOL, 'SOL');
    console.log('  Distributions:     ✅', successCount, '/', KEY_HOLDERS.length);
    console.log('');
    console.log('🔗 Links:');
    console.log(`  Pump.fun:  https://pump.fun/coin/${tokenMint.toBase58()}`);
    console.log(`  Solscan:   https://solscan.io/token/${tokenMint.toBase58()}`);
    console.log('');

    // Save launch data
    const launchData = {
      success: true,
      tokenMint: tokenMint.toBase58(),
      createSignature: result.signature,
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
      `COMPLETE-LAUNCH-${TOKEN_CONFIG.symbol}-${Date.now()}.json`,
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

console.log('🚨 COMPLETE LAUNCH IN 5 SECONDS...');
console.log('   Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  completeLaunch().catch(console.error);
}, 5000);
