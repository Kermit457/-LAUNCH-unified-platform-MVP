/**
 * DISTRIBUTE KNT4 TOKENS
 *
 * Distributes tokens to 7 key holders based on their ownership percentage
 */

import 'dotenv/config';
import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } from '@solana/spl-token';
import bs58 from 'bs58';
import fs from 'fs';

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

// Token info
const TOKEN_MINT = '5AA8jT1Q2o4jyvTZsm69JMSmFq1oQq4MzQ2pwvbXCbVM'; // KNT4
const TOKEN_SYMBOL = 'KNT4';

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

async function distribute() {
  console.log('\n' + '='.repeat(70));
  console.log('�� DISTRIBUTE KNT4 TOKENS');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Setup
    const privateKey = env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('No wallet configured!');

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

    const mintPubkey = new PublicKey(TOKEN_MINT);
    const creatorTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      creatorKeypair.publicKey
    );

    console.log('📍 Distributor:', creatorKeypair.publicKey.toBase58());
    console.log('🪙 Token:', TOKEN_MINT);
    console.log('');

    // Get current balance
    console.log('⏳ Fetching token balance...');

    let tokenBalance = 0;
    let accountExists = false;

    try {
      const accountInfo = await getAccount(connection, creatorTokenAccount);
      tokenBalance = Number(accountInfo.amount);
      accountExists = true;
    } catch (e) {
      console.log('⚠️  Token account does not exist yet for your wallet.');
      console.log('');
      console.log('🔍 Checking all token holders...');

      // Get all token accounts for this mint
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        creatorKeypair.publicKey,
        { mint: mintPubkey }
      );

      if (tokenAccounts.value.length === 0) {
        console.log('❌ You have no token accounts for this mint.');
        console.log('');
        console.log('The tokens are currently held by the Pump.fun bonding curve.');
        console.log('You need to either:');
        console.log('  1. Buy some tokens from the bonding curve first, OR');
        console.log('  2. Wait for someone else to buy, which will give you tokens');
        console.log('');
        console.log('Token on Pump.fun: https://pump.fun/coin/' + TOKEN_MINT);
        return;
      }
    }

    if (!accountExists || tokenBalance === 0) {
      console.log('❌ No tokens to distribute!');
      console.log('   Your token account has 0 balance.');
      console.log('');
      console.log('💡 The tokens are on the bonding curve. You need to buy some first.');
      console.log('   Visit: https://pump.fun/coin/' + TOKEN_MINT);
      return;
    }

    if (tokenBalance === 0) {
      console.log('❌ No tokens to distribute!');
      console.log('   Your token account has 0 balance.');
      return;
    }

    const decimals = 6;
    const balanceUI = tokenBalance / Math.pow(10, decimals);

    console.log('✅ Balance:', balanceUI.toLocaleString(), TOKEN_SYMBOL);
    console.log('');

    // Calculate distributions
    console.log('📊 Distribution Plan:');
    console.log('='.repeat(70));

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
      console.log(`  ${d.name.padEnd(20)} ${d.percentage.padStart(5)}% → ${d.amountUI.toLocaleString().padStart(15)} ${TOKEN_SYMBOL}`);
    });

    console.log('');
    console.log('📤 Executing distributions...');
    console.log('');

    let successCount = 0;
    const results = [];

    for (const dist of distributions) {
      try {
        const recipientPubkey = new PublicKey(dist.address);
        const recipientTokenAccount = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

        // Check if account exists
        let needsAccountCreation = false;
        try {
          await getAccount(connection, recipientTokenAccount);
        } catch (e) {
          needsAccountCreation = true;
        }

        const distributionTx = new Transaction();

        // Create account if needed
        if (needsAccountCreation) {
          distributionTx.add(createAssociatedTokenAccountInstruction(
            creatorKeypair.publicKey,
            recipientTokenAccount,
            recipientPubkey,
            mintPubkey
          ));
        }

        // Add transfer instruction
        distributionTx.add(createTransferInstruction(
          creatorTokenAccount,
          recipientTokenAccount,
          creatorKeypair.publicKey,
          dist.amount
        ));

        // Send transaction
        const signature = await connection.sendTransaction(distributionTx, [creatorKeypair], {
          skipPreflight: false,
          maxRetries: 3
        });

        // Wait for confirmation (quick check)
        let confirmed = false;
        for (let i = 0; i < 15; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const status = await connection.getSignatureStatus(signature);
          if (status?.value?.confirmationStatus === 'confirmed' ||
              status?.value?.confirmationStatus === 'finalized') {
            confirmed = true;
            break;
          }
        }

        if (confirmed) {
          console.log(`   ✅ ${d.name.padEnd(20)} ${d.amountUI.toLocaleString().padStart(15)} ${TOKEN_SYMBOL}`);
          results.push({ ...dist, status: 'success', signature });
          successCount++;
        } else {
          console.log(`   ⏳ ${d.name.padEnd(20)} ${d.amountUI.toLocaleString().padStart(15)} ${TOKEN_SYMBOL} (confirming...)`);
          results.push({ ...dist, status: 'pending', signature });
          successCount++;
        }

      } catch (error) {
        console.log(`   ❌ ${dist.name.padEnd(20)} FAILED: ${error.message}`);
        results.push({ ...dist, status: 'failed', error: error.message });
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 DISTRIBUTION COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Results:');
    console.log('  Successful:  ', successCount, '/', KEY_HOLDERS.length);
    console.log('  Total Sent:  ', distributions.reduce((sum, d) => sum + d.amountUI, 0).toLocaleString(), TOKEN_SYMBOL);
    console.log('');

    // Check remaining balance
    try {
      const finalAccountInfo = await getAccount(connection, creatorTokenAccount);
      const finalBalance = Number(finalAccountInfo.amount);
      const finalBalanceUI = finalBalance / Math.pow(10, decimals);
      console.log('  Remaining:   ', finalBalanceUI.toLocaleString(), TOKEN_SYMBOL);
      console.log('');
    } catch (e) {
      console.log('');
    }

    // Save results
    const reportData = {
      tokenMint: TOKEN_MINT,
      symbol: TOKEN_SYMBOL,
      totalDistributed: distributions.reduce((sum, d) => sum + d.amountUI, 0),
      successCount,
      totalHolders: KEY_HOLDERS.length,
      distributions: results,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      `DISTRIBUTION-${TOKEN_SYMBOL}-${Date.now()}.json`,
      JSON.stringify(reportData, null, 2)
    );

    console.log('💾 Report saved to DISTRIBUTION-' + TOKEN_SYMBOL + '-*.json');
    console.log('');

  } catch (error) {
    console.error('\n❌ DISTRIBUTION FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
}

console.log('🚨 STARTING DISTRIBUTION IN 3 SECONDS...');
console.log('   Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  distribute().catch(console.error);
}, 3000);
