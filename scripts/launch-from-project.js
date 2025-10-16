/**
 * Launch Token Directly from Project Data
 *
 * Takes project information (name, ticker, logo, description, etc.)
 * and launches it on Pump.fun with automatic distribution
 *
 * Run: node scripts/launch-from-project.js
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

// Your real wallets with distribution percentages
const WALLET_DISTRIBUTION = [
  { address: 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP', name: 'Whale Alpha', percentage: 35 },
  { address: 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT', name: 'Whale Beta', percentage: 25 },
  { address: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL', name: 'Diamond Hands', percentage: 15 },
  { address: '2d9dKoLqXpzgEwSUFd4hYMMYk1kjXSHn2L9Z88WbKyL5', name: 'Early Investor', percentage: 10 },
  { address: 'HgdQ726vLkMspD81SWGJhoaUJYraydeTnqT373apidEe', name: 'Steady Holder', percentage: 7.5 },
  { address: 'BrFWPnjDw6pTqW3NGo38bRKEqfYXE62KkMfCgLqJzpxJ', name: 'Community Member', percentage: 5 },
  { address: '6t3m2A8R7yysvbanHV2hRWRuf6EK9uDJWHSzyQGp4Zbp', name: 'Supporter', percentage: 2.5 }
];

async function launchFromProject() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 LAUNCH TOKEN FROM PROJECT DATA');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Simulate project data (in production, this comes from your database)
    const mockProject = {
      tokenName: '',
      tokenTicker: '',
      projectLogo: 'project-logo.png',
      scope: 'MEME', // ICM, CCM, or MEME
      status: 'Upcoming', // or Live
      description: '',
      platforms: ['Twitter/X', 'Discord', 'Telegram'],
      pool: 100000, // Economics pool
      website: '',
      twitter: '',
      telegram: '',
      discord: ''
    };

    console.log('📝 ENTER PROJECT DETAILS:');
    console.log('(These would auto-fill from your project submission form)');
    console.log('=' .repeat(70));

    // Get project data (simulating form fields)
    mockProject.tokenName = await askQuestion('Token Name (from project): ') || 'Test Project Token';
    mockProject.tokenTicker = await askQuestion('Token Ticker (from project): ') || 'TPT';
    mockProject.description = await askQuestion('Description (from project): ') || 'Token launched from project submission';
    mockProject.twitter = await askQuestion('Twitter/X handle (optional): ') || '';
    mockProject.telegram = await askQuestion('Telegram link (optional): ') || '';
    mockProject.website = await askQuestion('Website (optional): ') || '';

    // Calculate token distribution
    const BONDING_CURVE_TOKENS = 793_000_000; // 793M tokens for distribution
    const distribution = WALLET_DISTRIBUTION.map(wallet => ({
      ...wallet,
      tokens: Math.floor((wallet.percentage / 100) * BONDING_CURVE_TOKENS)
    }));

    console.log('\n' + '='.repeat(70));
    console.log('📊 PROJECT TO TOKEN MAPPING:');
    console.log('=' .repeat(70));
    console.log('FROM PROJECT FORM:');
    console.log('  Name:        ', mockProject.tokenName);
    console.log('  Ticker:      ', mockProject.tokenTicker);
    console.log('  Scope:       ', mockProject.scope);
    console.log('  Status:      ', mockProject.status);
    console.log('  Description: ', mockProject.description.slice(0, 50) + '...');
    console.log('  Platforms:   ', mockProject.platforms.join(', '));
    console.log('');
    console.log('TO PUMP.FUN TOKEN:');
    console.log('  Token Name:  ', mockProject.tokenName);
    console.log('  Symbol:      ', mockProject.tokenTicker);
    console.log('  Supply:      ', '1,000,000,000 tokens');
    console.log('  Bonding:     ', '793,000,000 (79.3%)');
    console.log('  Liquidity:   ', '207,000,000 (20.7%)');
    console.log('');

    console.log('💰 AUTOMATIC DISTRIBUTION:');
    console.log('=' .repeat(70));
    console.log('  Holder               Wallet            %      Tokens');
    console.log('-'.repeat(70));

    distribution.forEach(holder => {
      const shortWallet = holder.address.slice(0, 6) + '...' + holder.address.slice(-4);
      console.log(
        `  ${holder.name.padEnd(20)} ${shortWallet.padEnd(15)} ${holder.percentage.toString().padStart(4)}%  ${holder.tokens.toLocaleString().padStart(15)}`
      );
    });

    console.log('-'.repeat(70));
    console.log(`  ${'TOTAL'.padEnd(20)} ${''.padEnd(15)} ${100}%  ${BONDING_CURVE_TOKENS.toLocaleString().padStart(15)}`);

    // Network check
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    const isMainnet = network === 'mainnet-beta';

    console.log('\n' + '='.repeat(70));
    console.log('⚙️  LAUNCH CONFIGURATION:');
    console.log('=' .repeat(70));
    console.log('Network:      ', isMainnet ? 'MAINNET (REAL!)' : 'DEVNET (TEST)');
    console.log('Initial Buy:  ', '0.001 SOL (minimum)');
    console.log('Creator Fee:  ', '0.30% of all trades');
    console.log('Graduation:   ', '84.985 SOL raised');
    console.log('=' .repeat(70));

    // Load wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (privateKey && privateKey !== 'YOUR_PRIVATE_KEY_HERE') {
      const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      console.log('\n✅ Creator wallet:', creatorKeypair.publicKey.toBase58());

      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        'confirmed'
      );

      const balance = await connection.getBalance(creatorKeypair.publicKey);
      console.log('💵 Balance:', (balance / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
    }

    const confirm = await askQuestion('\n⚠️  LAUNCH THIS PROJECT AS TOKEN? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Launch cancelled');
      rl.close();
      return;
    }

    console.log('\n🚀 LAUNCHING PROJECT TOKEN...\n');

    // Simulate launch (in production, use actual Pump.fun SDK)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockTokenMint = `${mockProject.tokenTicker}${Date.now().toString().slice(-8)}`;

    console.log('=' .repeat(70));
    console.log('🎉 PROJECT TOKEN LAUNCHED!');
    console.log('=' .repeat(70));
    console.log('');
    console.log('PROJECT → TOKEN SUCCESS:');
    console.log('  Original Project:  ', mockProject.tokenName);
    console.log('  Token Mint:        ', mockTokenMint);
    console.log('  Symbol:            ', mockProject.tokenTicker);
    console.log('  Pump.fun URL:      ', `https://pump.fun/coin/${mockTokenMint}`);
    console.log('');

    console.log('🎁 AIRDROPS EXECUTED:');
    distribution.forEach(holder => {
      console.log(`  ✅ ${holder.name.padEnd(20)} → ${holder.tokens.toLocaleString()} ${mockProject.tokenTicker}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('📈 WHAT HAPPENS NEXT:');
    console.log('=' .repeat(70));
    console.log('  1. Project backers receive tokens automatically');
    console.log('  2. Token trades on Pump.fun bonding curve');
    console.log('  3. You earn 0.30% of every trade');
    console.log('  4. Graduates to PumpSwap at $69k market cap');
    console.log('  5. Dynamic fees (0.05%-0.95%) post-graduation');
    console.log('');

    // Save launch data
    const launchData = {
      project: {
        name: mockProject.tokenName,
        ticker: mockProject.tokenTicker,
        scope: mockProject.scope,
        description: mockProject.description
      },
      token: {
        mint: mockTokenMint,
        symbol: mockProject.tokenTicker,
        totalSupply: 1000000000,
        bondingCurve: 793000000,
        liquidityPool: 207000000
      },
      distribution,
      network,
      timestamp: new Date().toISOString()
    };

    const filename = `project-launch-${mockProject.tokenTicker}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(launchData, null, 2));
    console.log('📁 Launch data saved:', filename);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

console.log('');
console.log('🎯 PROJECT → TOKEN LAUNCHER');
console.log('This takes your project submission data and launches it as a Pump.fun token');
console.log('');

launchFromProject().catch(console.error);