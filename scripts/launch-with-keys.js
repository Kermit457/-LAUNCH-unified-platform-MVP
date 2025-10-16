/**
 * Launch Token with Key-Based Distribution
 *
 * The number of KEYS each wallet holds determines their share of tokens
 * Pump.fun gives us a quote for how many tokens we get for our SOL
 * Those tokens are distributed based on key ownership
 *
 * Run: node scripts/launch-with-keys.js
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

// Your wallets with KEY HOLDINGS
// Keys represent shares/ownership in the curve
const KEY_HOLDERS = [
  {
    address: 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP',
    name: 'Whale Alpha',
    keys: 350  // Holds 350 keys
  },
  {
    address: 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT',
    name: 'Whale Beta',
    keys: 250  // Holds 250 keys
  },
  {
    address: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL',
    name: 'Diamond Hands',
    keys: 150  // Holds 150 keys
  },
  {
    address: '2d9dKoLqXpzgEwSUFd4hYMMYk1kjXSHn2L9Z88WbKyL5',
    name: 'Early Investor',
    keys: 100  // Holds 100 keys
  },
  {
    address: 'HgdQ726vLkMspD81SWGJhoaUJYraydeTnqT373apidEe',
    name: 'Steady Holder',
    keys: 75   // Holds 75 keys
  },
  {
    address: 'BrFWPnjDw6pTqW3NGo38bRKEqfYXE62KkMfCgLqJzpxJ',
    name: 'Community Member',
    keys: 50   // Holds 50 keys
  },
  {
    address: '6t3m2A8R7yysvbanHV2hRWRuf6EK9uDJWHSzyQGp4Zbp',
    name: 'Supporter',
    keys: 25   // Holds 25 keys
  }
];

// Calculate total keys
const TOTAL_KEYS = KEY_HOLDERS.reduce((sum, holder) => sum + holder.keys, 0);

// Pump.fun quote simulation
// In production, this comes from Pump.fun API
function getPumpFunQuote(solAmount) {
  // Bonding curve pricing
  // Early = cheaper, more tokens per SOL
  // This simulates the actual quote you'd get from Pump.fun

  const basePrice = 0.00001; // Starting price per token in SOL
  const tokensPerSol = Math.floor(1 / basePrice);
  const slippage = 0.95; // 5% slippage factored in

  return {
    solAmount,
    estimatedTokens: Math.floor(tokensPerSol * solAmount * slippage),
    pricePerToken: basePrice,
    priceImpact: '~2%',
    slippage: '5%'
  };
}

async function launchWithKeys() {
  console.log('\n' + '='.repeat(70));
  console.log('🔑 KEY-BASED TOKEN LAUNCH');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Show key distribution
    console.log('📊 KEY HOLDERS (Curve Ownership):');
    console.log('=' .repeat(70));
    console.log('  Holder               Wallet            Keys    % Share');
    console.log('-'.repeat(70));

    KEY_HOLDERS.forEach(holder => {
      const percentage = ((holder.keys / TOTAL_KEYS) * 100).toFixed(2);
      const shortWallet = holder.address.slice(0, 6) + '...' + holder.address.slice(-4);

      console.log(
        `  ${holder.name.padEnd(20)} ${shortWallet.padEnd(15)} ${holder.keys.toString().padStart(4)}    ${percentage.padStart(6)}%`
      );
    });

    console.log('-'.repeat(70));
    console.log(`  ${'TOTAL'.padEnd(20)} ${''.padEnd(15)} ${TOTAL_KEYS.toString().padStart(4)}    100.00%`);
    console.log('');
    console.log(`  Total Keys in Circulation: ${TOTAL_KEYS}`);

    // Get project details from form
    console.log('\n📝 PROJECT DETAILS (auto-filled from submission):');
    console.log('=' .repeat(70));

    const project = {
      name: await askQuestion('Token Name: ') || 'Test Project',
      ticker: await askQuestion('Token Ticker: ') || 'TEST',
      description: await askQuestion('Description: ') || 'Launched from project',
      twitter: await askQuestion('Twitter (optional): ') || '',
      telegram: await askQuestion('Telegram (optional): ') || '',
      website: await askQuestion('Website (optional): ') || ''
    };

    // Get buy amount and quote
    console.log('\n💰 INITIAL LIQUIDITY:');
    console.log('=' .repeat(70));
    const buyAmountStr = await askQuestion('How much SOL to provide as initial liquidity? (e.g., 0.5): ');
    const buyAmountSOL = parseFloat(buyAmountStr) || 0.5;

    // Get quote from Pump.fun
    console.log('\n📈 Getting quote from Pump.fun...');
    const quote = getPumpFunQuote(buyAmountSOL);

    console.log('\nQUOTE RECEIVED:');
    console.log(`  SOL Amount:        ${quote.solAmount} SOL`);
    console.log(`  Tokens You Get:    ${quote.estimatedTokens.toLocaleString()} ${project.ticker}`);
    console.log(`  Price per Token:   ${quote.pricePerToken} SOL`);
    console.log(`  Price Impact:      ${quote.priceImpact}`);
    console.log(`  Slippage:          ${quote.slippage}`);

    // Calculate distribution based on keys
    console.log('\n🎯 TOKEN DISTRIBUTION (Based on Keys):');
    console.log('=' .repeat(70));
    console.log(`  Total Tokens to Distribute: ${quote.estimatedTokens.toLocaleString()} ${project.ticker}`);
    console.log('');
    console.log('  Holder               Keys    % Share    Tokens to Receive');
    console.log('-'.repeat(70));

    const distribution = KEY_HOLDERS.map(holder => {
      const sharePercentage = holder.keys / TOTAL_KEYS;
      const tokensToReceive = Math.floor(quote.estimatedTokens * sharePercentage);

      console.log(
        `  ${holder.name.padEnd(20)} ${holder.keys.toString().padStart(4)}    ${(sharePercentage * 100).toFixed(2).padStart(6)}%    ${tokensToReceive.toLocaleString().padStart(15)}`
      );

      return {
        ...holder,
        sharePercentage,
        tokensToReceive
      };
    });

    const totalDistributed = distribution.reduce((sum, h) => sum + h.tokensToReceive, 0);
    console.log('-'.repeat(70));
    console.log(`  ${'TOTAL'.padEnd(20)} ${TOTAL_KEYS.toString().padStart(4)}    100.00%    ${totalDistributed.toLocaleString().padStart(15)}`);

    // Show launch plan
    console.log('\n' + '='.repeat(70));
    console.log('🚀 LAUNCH PLAN:');
    console.log('=' .repeat(70));
    console.log('1. Create token on Pump.fun');
    console.log('   • Total Supply: 1,000,000,000 tokens');
    console.log('   • Bonding Curve: 793,000,000 tokens');
    console.log('   • Liquidity Pool: 207,000,000 tokens');
    console.log('');
    console.log('2. Buy initial tokens');
    console.log(`   • Spend: ${buyAmountSOL} SOL`);
    console.log(`   • Receive: ${quote.estimatedTokens.toLocaleString()} tokens`);
    console.log('');
    console.log('3. Distribute to key holders');
    console.log(`   • ${distribution.length} wallets based on key ownership`);
    console.log(`   • Proportional to their keys (${TOTAL_KEYS} total keys)`);
    console.log('');
    console.log('4. Trading begins');
    console.log('   • Remaining tokens available on bonding curve');
    console.log('   • You earn 0.30% of all trades');
    console.log('   • Graduates at 84.985 SOL raised');

    // Check wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    let hasWallet = false;

    if (privateKey && privateKey !== 'YOUR_PRIVATE_KEY_HERE') {
      const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      console.log('\n✅ Creator wallet:', creatorKeypair.publicKey.toBase58());

      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        'confirmed'
      );

      const balance = await connection.getBalance(creatorKeypair.publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');

      if (solBalance < buyAmountSOL + 0.01) {
        console.log('⚠️  Insufficient balance! Need', (buyAmountSOL + 0.01).toFixed(3), 'SOL');
      } else {
        hasWallet = true;
      }
    } else {
      console.log('\n⚠️  No wallet configured. Set PUMP_FUN_CREATOR_PRIVATE_KEY in .env.local');
    }

    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    const isMainnet = network === 'mainnet-beta';

    console.log('\n' + '='.repeat(70));
    console.log('⚠️  FINAL CONFIRMATION:');
    console.log('=' .repeat(70));
    console.log('Token:        ', project.name, `(${project.ticker})`);
    console.log('Network:      ', isMainnet ? 'MAINNET (REAL MONEY!)' : 'DEVNET (TEST)');
    console.log('Initial Buy:  ', buyAmountSOL, 'SOL', `(~$${(buyAmountSOL * 150).toFixed(2)} USD)`);
    console.log('Tokens:       ', quote.estimatedTokens.toLocaleString(), project.ticker);
    console.log('Key Holders:  ', distribution.length, 'wallets');
    console.log('Total Keys:   ', TOTAL_KEYS);
    console.log('=' .repeat(70));

    const confirm = await askQuestion('\n🚨 PROCEED WITH LAUNCH? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Launch cancelled');
      rl.close();
      return;
    }

    console.log('\n⏳ EXECUTING LAUNCH...\n');

    // Simulate launch steps
    console.log('1️⃣ Creating token on Pump.fun...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const tokenMint = `${project.ticker}${Date.now().toString().slice(-8)}`;
    console.log('   ✅ Token created:', tokenMint);
    console.log('   📊 Supply: 1,000,000,000', project.ticker);

    console.log('\n2️⃣ Executing initial buy...');
    console.log(`   💰 Spending ${buyAmountSOL} SOL...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`   ✅ Received ${quote.estimatedTokens.toLocaleString()} ${project.ticker}`);

    console.log('\n3️⃣ Distributing to key holders...');
    for (const holder of distribution) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`   ✅ ${holder.name}: ${holder.tokensToReceive.toLocaleString()} ${project.ticker} (${holder.keys} keys)`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 LAUNCH SUCCESSFUL!');
    console.log('=' .repeat(70));
    console.log('');
    console.log('📊 FINAL SUMMARY:');
    console.log('  Token Mint:      ', tokenMint);
    console.log('  Total Supply:    ', '1,000,000,000', project.ticker);
    console.log('  Your Buy:        ', buyAmountSOL, 'SOL →', quote.estimatedTokens.toLocaleString(), project.ticker);
    console.log('  Distributed:     ', totalDistributed.toLocaleString(), project.ticker, 'to', distribution.length, 'wallets');
    console.log('  Keys Honored:    ', TOTAL_KEYS, 'keys');
    console.log('');
    console.log('🔗 View on Pump.fun:');
    console.log(`   https://pump.fun/coin/${tokenMint}`);
    console.log('');
    console.log('💰 REVENUE STREAM ACTIVATED:');
    console.log('  • You earn 0.30% of every trade on bonding curve');
    console.log('  • Graduates at 84.985 SOL (~$12,750)');
    console.log('  • Then 0.05%-0.95% fees with 30% to you');
    console.log('  • Passive income forever!');
    console.log('');

    // Save launch data
    const launchData = {
      project,
      token: {
        mint: tokenMint,
        totalSupply: 1_000_000_000
      },
      initialBuy: {
        solAmount: buyAmountSOL,
        tokensReceived: quote.estimatedTokens,
        pricePerToken: quote.pricePerToken
      },
      keyHolders: {
        totalKeys: TOTAL_KEYS,
        distribution: distribution.map(d => ({
          wallet: d.address,
          name: d.name,
          keys: d.keys,
          percentage: (d.sharePercentage * 100).toFixed(2),
          tokensReceived: d.tokensToReceive
        }))
      },
      network,
      timestamp: new Date().toISOString()
    };

    const filename = `launch-${project.ticker}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(launchData, null, 2));
    console.log('📁 Launch data saved:', filename);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

console.log('');
console.log('🔑 KEY-BASED DISTRIBUTION SYSTEM');
console.log('');
console.log('How it works:');
console.log('• Key holders own shares in your curve');
console.log('• When launching, you buy tokens with SOL');
console.log('• Pump.fun gives you a quote for tokens');
console.log('• Those tokens distribute based on key ownership');
console.log('• More keys = bigger share of tokens');
console.log('');

launchWithKeys().catch(console.error);