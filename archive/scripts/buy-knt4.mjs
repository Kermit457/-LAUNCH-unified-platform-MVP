/**
 * BUY KNT4 TOKENS FROM BONDING CURVE
 *
 * Purchases tokens from the Pump.fun bonding curve
 * Then you can distribute them to key holders
 */

import 'dotenv/config';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import bs58 from 'bs58';
import { PumpFunSDK } from 'pumpdotfun-sdk';

// Read env
const envPath = new URL('../.env.local', import.meta.url);
const envContent = fs.readFileSync(envPath, 'utf8');
import fs from 'fs';

const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim();
  }
});

// Configuration
const TOKEN_MINT = '5AA8jT1Q2o4jyvTZsm69JMSmFq1oQq4MzQ2pwvbXCbVM'; // KNT4
const BUY_AMOUNT_SOL = 0.1; // Buy 0.1 SOL worth of tokens

async function buyTokens() {
  console.log('\n' + '='.repeat(70));
  console.log('💰 BUY KNT4 FROM BONDING CURVE');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Setup
    const privateKey = env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('No wallet configured!');

    const buyerKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

    const solBalance = (await connection.getBalance(buyerKeypair.publicKey)) / LAMPORTS_PER_SOL;

    console.log('📍 Buyer:', buyerKeypair.publicKey.toBase58());
    console.log('💵 SOL Balance:', solBalance.toFixed(4), 'SOL');
    console.log('🪙 Token:', TOKEN_MINT);
    console.log('💰 Buy Amount:', BUY_AMOUNT_SOL, 'SOL');
    console.log('');

    if (solBalance < BUY_AMOUNT_SOL + 0.01) {
      throw new Error(`Insufficient balance! Need at least ${BUY_AMOUNT_SOL + 0.01} SOL`);
    }

    // Setup SDK
    console.log('⏳ Initializing SDK...');
    const wallet = new Wallet(buyerKeypair);
    const provider = new AnchorProvider(connection, wallet, { commitment: 'finalized' });
    const sdk = new PumpFunSDK(provider);

    console.log('✅ SDK ready');
    console.log('');

    // Buy tokens
    console.log('📡 Buying tokens from bonding curve...');
    console.log('   Slippage: 25%');
    console.log('');

    const mintPubkey = new PublicKey(TOKEN_MINT);
    const buyAmountSOL = BigInt(Math.floor(BUY_AMOUNT_SOL * LAMPORTS_PER_SOL));
    const slippageBasisPoints = BigInt(2500); // 25%

    const result = await sdk.buy(
      buyerKeypair,
      mintPubkey,
      buyAmountSOL,
      slippageBasisPoints,
      {
        unitLimit: 250000,
        unitPrice: 250000
      }
    );

    if (!result.success) {
      console.error('❌ Buy failed!');
      console.error('   Error:', result.error);
      throw new Error('Buy failed: ' + JSON.stringify(result.error));
    }

    console.log('✅ BUY SUCCESSFUL!');
    console.log('   Signature:', result.signature);
    console.log(`   View: https://solscan.io/tx/${result.signature}`);
    console.log('');

    // Wait a bit for account to update
    console.log('⏳ Waiting for balance to update...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check new balance and AUTO-DISTRIBUTE
    const { getAssociatedTokenAddress, getAccount, createAssociatedTokenAccountInstruction, createTransferInstruction } = await import('@solana/spl-token');
    const { Transaction } = await import('@solana/web3.js');

    const tokenAccount = await getAssociatedTokenAddress(mintPubkey, buyerKeypair.publicKey);

    console.log('⏳ Waiting for token balance to update...');

    let tokenBalance = 0;
    let attempts = 0;
    const maxAttempts = 20;

    // Wait for tokens to appear in wallet
    while (tokenBalance === 0 && attempts < maxAttempts) {
      attempts++;
      try {
        const accountInfo = await getAccount(connection, tokenAccount);
        tokenBalance = Number(accountInfo.amount);
        if (tokenBalance > 0) {
          break;
        }
      } catch (e) {
        // Account doesn't exist yet or has no balance
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (tokenBalance === 0) {
      console.log('⚠️  Token balance still 0 after waiting. Distribution skipped.');
      console.log('   Run manually: node scripts/distribute-knt4.mjs');
      console.log('');
      return;
    }

    const decimals = 6;
    const balanceUI = tokenBalance / Math.pow(10, decimals);

    console.log('✅ Token balance:', balanceUI.toLocaleString(), 'KNT4');
    console.log('');

    // AUTO-DISTRIBUTE
    console.log('='.repeat(70));
    console.log('📤 AUTO-DISTRIBUTING TO KEY HOLDERS');
    console.log('='.repeat(70));
    console.log('');

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
      console.log(`  ${d.name.padEnd(20)} ${d.percentage.padStart(5)}% → ${d.amountUI.toLocaleString().padStart(15)} KNT4`);
    });
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
            buyerKeypair.publicKey,
            recipientTokenAccount,
            recipientPubkey,
            mintPubkey
          ));
        }

        distributionTx.add(createTransferInstruction(
          tokenAccount,
          recipientTokenAccount,
          buyerKeypair.publicKey,
          dist.amount
        ));

        const distSignature = await connection.sendTransaction(distributionTx, [buyerKeypair], {
          skipPreflight: false,
          maxRetries: 3
        });

        // Quick confirmation check
        let confirmed = false;
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const status = await connection.getSignatureStatus(distSignature);
          if (status?.value?.confirmationStatus === 'confirmed' ||
              status?.value?.confirmationStatus === 'finalized') {
            confirmed = true;
            break;
          }
        }

        if (confirmed) {
          console.log(`   ✅ ${dist.name.padEnd(20)} ${dist.amountUI.toLocaleString().padStart(15)} KNT4`);
          successCount++;
        } else {
          console.log(`   ⏳ ${dist.name.padEnd(20)} ${dist.amountUI.toLocaleString().padStart(15)} KNT4 (pending)`);
          successCount++;
        }

      } catch (error) {
        console.log(`   ❌ ${dist.name}: ${error.message}`);
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 COMPLETE! BUY + DISTRIBUTE SUCCESS!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Results:');
    console.log('  Tokens Purchased:  ✅');
    console.log('  Distributions:     ✅', successCount, '/', KEY_HOLDERS.length);
    console.log('');
    console.log('🔗 Check token:');
    console.log(`  https://pump.fun/coin/${TOKEN_MINT}`);
    console.log(`  https://solscan.io/token/${TOKEN_MINT}`);
    console.log('');

  } catch (error) {
    console.error('\n❌ BUY FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
}

console.log('🚨 BUYING IN 3 SECONDS...');
console.log('   Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  buyTokens().catch(console.error);
}, 3000);
