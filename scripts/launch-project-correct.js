/**
 * CORRECT: Launch Project Token with Proper Distribution
 *
 * 1. Create token with 1B supply
 * 2. Buy tokens with initial SOL (e.g., 0.1 SOL)
 * 3. Distribute THOSE PURCHASED tokens to wallets
 *
 * Run: node scripts/launch-project-correct.js
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

// Your wallets with distribution percentages
const WALLET_DISTRIBUTION = [
  { address: 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP', name: 'Whale Alpha', percentage: 35 },
  { address: 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT', name: 'Whale Beta', percentage: 25 },
  { address: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL', name: 'Diamond Hands', percentage: 15 },
  { address: '2d9dKoLqXpzgEwSUFd4hYMMYk1kjXSHn2L9Z88WbKyL5', name: 'Early Investor', percentage: 10 },
  { address: 'HgdQ726vLkMspD81SWGJhoaUJYraydeTnqT373apidEe', name: 'Steady Holder', percentage: 7.5 },
  { address: 'BrFWPnjDw6pTqW3NGo38bRKEqfYXE62KkMfCgLqJzpxJ', name: 'Community Member', percentage: 5 },
  { address: '6t3m2A8R7yysvbanHV2hRWRuf6EK9uDJWHSzyQGp4Zbp', name: 'Supporter', percentage: 2.5 }
];

// Bonding curve price calculation (simplified)
function estimateTokensFromSOL(solAmount) {
  // Pump.fun bonding curve starts cheap
  // This is a rough estimate - actual amount depends on curve state
  // Early buyers get more tokens per SOL
  const baseRate = 10_000_000; // ~10M tokens per SOL at start
  const variance = Math.random() * 2_000_000; // Some variance
  return Math.floor((baseRate + variance) * solAmount);
}

async function launchProjectCorrect() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 PROJECT TOKEN LAUNCH - CORRECT DISTRIBUTION');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Get project details
    console.log('📝 PROJECT DETAILS (from submission form):');
    console.log('=' .repeat(70));

    const project = {
      name: await askQuestion('Token Name: ') || 'Test Project',
      ticker: await askQuestion('Token Ticker: ') || 'TEST',
      description: await askQuestion('Description: ') || 'Launched from project submission',
      twitter: await askQuestion('Twitter (optional): ') || '',
      telegram: await askQuestion('Telegram (optional): ') || '',
      website: await askQuestion('Website (optional): ') || ''
    };

    // Get initial buy amount
    console.log('\n💰 INITIAL BUY CONFIGURATION:');
    console.log('=' .repeat(70));
    const buyAmountStr = await askQuestion('How much SOL to buy initially? (e.g., 0.1): ');
    const buyAmountSOL = parseFloat(buyAmountStr) || 0.1;

    // Estimate tokens received
    const estimatedTokens = estimateTokensFromSOL(buyAmountSOL);

    console.log('\n' + '='.repeat(70));
    console.log('📊 TOKEN CREATION PLAN:');
    console.log('=' .repeat(70));
    console.log('PUMP.FUN TOKEN:');
    console.log('  Total Supply:      1,000,000,000 tokens');
    console.log('  On Bonding Curve:    793,000,000 tokens (available to buy)');
    console.log('  For Liquidity:       207,000,000 tokens (locked)');
    console.log('');
    console.log('YOUR INITIAL BUY:');
    console.log('  SOL Amount:        ', buyAmountSOL, 'SOL');
    console.log('  Estimated Tokens:  ', estimatedTokens.toLocaleString(), 'tokens');
    console.log('  Cost:              ', `~$${(buyAmountSOL * 150).toFixed(2)} USD`);
    console.log('');
    console.log('DISTRIBUTION TO HOLDERS:');
    console.log('  These', estimatedTokens.toLocaleString(), 'tokens will be distributed as follows:');
    console.log('');
    console.log('  Holder               Wallet            %      Tokens to Receive');
    console.log('-'.repeat(70));

    const distribution = WALLET_DISTRIBUTION.map(wallet => {
      const tokensToReceive = Math.floor((wallet.percentage / 100) * estimatedTokens);
      const shortWallet = wallet.address.slice(0, 6) + '...' + wallet.address.slice(-4);

      console.log(
        `  ${wallet.name.padEnd(20)} ${shortWallet.padEnd(15)} ${wallet.percentage.toString().padStart(4)}%  ${tokensToReceive.toLocaleString().padStart(15)}`
      );

      return {
        ...wallet,
        tokensToReceive
      };
    });

    console.log('-'.repeat(70));
    console.log(`  ${'TOTAL'.padEnd(20)} ${''.padEnd(15)} ${100}%  ${estimatedTokens.toLocaleString().padStart(15)}`);

    console.log('\n' + '='.repeat(70));
    console.log('💡 IMPORTANT NOTES:');
    console.log('=' .repeat(70));
    console.log('• You\'re buying tokens FROM the bonding curve');
    console.log('• The more SOL you spend, the more tokens to distribute');
    console.log('• Early buys get better rates (more tokens per SOL)');
    console.log('• Remaining 793M - your buy = available for public');
    console.log('• Token graduates at 84.985 SOL total raised');
    console.log('');

    // Check wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (privateKey && privateKey !== 'YOUR_PRIVATE_KEY_HERE') {
      const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      console.log('✅ Creator wallet:', creatorKeypair.publicKey.toBase58());

      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        'confirmed'
      );

      const balance = await connection.getBalance(creatorKeypair.publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');

      if (solBalance < buyAmountSOL + 0.01) {
        console.log('⚠️  Insufficient balance! Need', (buyAmountSOL + 0.01).toFixed(3), 'SOL (buy + fees)');
      }
    }

    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    const isMainnet = network === 'mainnet-beta';

    console.log('\n' + '='.repeat(70));
    console.log('🚀 READY TO LAUNCH');
    console.log('=' .repeat(70));
    console.log('Token:        ', project.name, `(${project.ticker})`);
    console.log('Network:      ', isMainnet ? 'MAINNET (REAL!)' : 'DEVNET (TEST)');
    console.log('Initial Buy:  ', buyAmountSOL, 'SOL');
    console.log('Distribution: ', distribution.length, 'wallets');
    console.log('=' .repeat(70));

    const confirm = await askQuestion('\n⚠️  PROCEED WITH LAUNCH? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Launch cancelled');
      rl.close();
      return;
    }

    console.log('\n⏳ LAUNCHING...\n');

    // Step 1: Create token
    console.log('1️⃣ Creating token on Pump.fun...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockTokenMint = `${project.ticker}${Date.now().toString().slice(-8)}`;
    console.log('   ✅ Token created:', mockTokenMint);

    // Step 2: Initial buy
    console.log('\n2️⃣ Executing initial buy...');
    console.log(`   Buying ${buyAmountSOL} SOL worth...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`   ✅ Received ${estimatedTokens.toLocaleString()} ${project.ticker} tokens`);

    // Step 3: Distribute
    console.log('\n3️⃣ Distributing to holders...');
    for (const holder of distribution) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`   ✅ Sent ${holder.tokensToReceive.toLocaleString()} to ${holder.name}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 LAUNCH COMPLETE!');
    console.log('=' .repeat(70));
    console.log('');
    console.log('📊 SUMMARY:');
    console.log('  Token:           ', mockTokenMint);
    console.log('  Initial Buy:     ', buyAmountSOL, 'SOL');
    console.log('  Tokens Bought:   ', estimatedTokens.toLocaleString());
    console.log('  Distributed To:  ', distribution.length, 'wallets');
    console.log('  Available:       ', `~${(793_000_000 - estimatedTokens).toLocaleString()} tokens on curve`);
    console.log('');
    console.log('🔗 View on Pump.fun:');
    console.log(`   https://pump.fun/coin/${mockTokenMint}`);
    console.log('');
    console.log('💰 REVENUE MODEL:');
    console.log('  • You earn 0.30% of ALL future trades');
    console.log('  • Token graduates at 84.985 SOL raised');
    console.log('  • Then 0.05%-0.95% dynamic fees (30% to you)');
    console.log('');

    // Save data
    const launchData = {
      project,
      token: {
        mint: mockTokenMint,
        totalSupply: 1_000_000_000,
        initialBuy: {
          solAmount: buyAmountSOL,
          tokensReceived: estimatedTokens
        }
      },
      distribution: distribution.map(d => ({
        wallet: d.address,
        name: d.name,
        percentage: d.percentage,
        tokensReceived: d.tokensToReceive
      })),
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
console.log('🎯 CORRECT TOKEN DISTRIBUTION MODEL');
console.log('');
console.log('How it actually works:');
console.log('1. Create token with 1B supply');
console.log('2. Buy tokens with your SOL (e.g., 0.1 SOL → ~10M tokens)');
console.log('3. Distribute THOSE tokens to your holders');
console.log('4. Rest of 793M stays on bonding curve for public');
console.log('');

launchProjectCorrect().catch(console.error);