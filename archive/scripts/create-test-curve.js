/**
 * Create Test Curve with Real Wallet Holders
 *
 * This creates a curve with your real wallet addresses as holders
 * so we can test the actual airdrop distribution when launching
 *
 * Run: node scripts/create-test-curve.js
 */

// Your real wallet addresses
const REAL_WALLETS = [
  {
    address: 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP',
    userId: 'holder_1',
    balance: 350000,  // 35% of curve
    name: 'Whale Alpha'
  },
  {
    address: 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT',
    userId: 'holder_2',
    balance: 250000,  // 25% of curve
    name: 'Whale Beta'
  },
  {
    address: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL',
    userId: 'holder_3',
    balance: 150000,  // 15% of curve
    name: 'Diamond Hands'
  },
  {
    address: '2d9dKoLqXpzgEwSUFd4hYMMYk1kjXSHn2L9Z88WbKyL5',
    userId: 'holder_4',
    balance: 100000,  // 10% of curve
    name: 'Early Investor'
  },
  {
    address: 'HgdQ726vLkMspD81SWGJhoaUJYraydeTnqT373apidEe',
    userId: 'holder_5',
    balance: 75000,   // 7.5% of curve
    name: 'Steady Holder'
  },
  {
    address: 'BrFWPnjDw6pTqW3NGo38bRKEqfYXE62KkMfCgLqJzpxJ',
    userId: 'holder_6',
    balance: 50000,   // 5% of curve
    name: 'Community Member'
  },
  {
    address: '6t3m2A8R7yysvbanHV2hRWRuf6EK9uDJWHSzyQGp4Zbp',
    userId: 'holder_7',
    balance: 25000,   // 2.5% of curve
    name: 'Supporter'
  }
];

const TOTAL_SUPPLY = 1000000; // 1M curve tokens
const BONDING_CURVE_TOKENS = 793000000; // 793M Pump.fun tokens to distribute

console.log('\n' + '='.repeat(70));
console.log('🎯 CREATING TEST CURVE WITH REAL WALLETS');
console.log('='.repeat(70));
console.log('');

// Display curve details
console.log('📊 CURVE DETAILS:');
console.log('  Name:         Launch Test Curve');
console.log('  ID:           curve_launch_test_' + Date.now());
console.log('  Total Supply: 1,000,000 curve tokens');
console.log('  Holders:      ' + REAL_WALLETS.length);
console.log('  Status:       Ready to freeze');
console.log('');

// Display holder distribution
console.log('👥 HOLDERS & DISTRIBUTION:');
console.log('=' .repeat(70));
console.log('  Name                Wallet Address                              Curve %   Pump.fun Tokens');
console.log('-'.repeat(70));

let totalDistributed = 0;
const distribution = REAL_WALLETS.map(holder => {
  const percentage = (holder.balance / TOTAL_SUPPLY) * 100;
  const pumpTokens = Math.floor((holder.balance / TOTAL_SUPPLY) * BONDING_CURVE_TOKENS);
  totalDistributed += pumpTokens;

  const displayAddress = holder.address.slice(0, 6) + '...' + holder.address.slice(-4);
  console.log(
    `  ${holder.name.padEnd(20)}${displayAddress.padEnd(15)}` +
    `${percentage.toFixed(1).padStart(6)}%` +
    `   ${pumpTokens.toLocaleString().padStart(15)}`
  );

  return {
    ...holder,
    percentage,
    pumpTokens
  };
});

console.log('-'.repeat(70));
console.log(`  ${'TOTAL'.padEnd(20)}${''.padEnd(15)}` +
  `${100.0.toFixed(1).padStart(6)}%` +
  `   ${totalDistributed.toLocaleString().padStart(15)}`);

// Create snapshot data
const snapshot = {
  curveId: 'curve_launch_test_' + Date.now(),
  timestamp: new Date().toISOString(),
  totalSupply: TOTAL_SUPPLY,
  holders: distribution.map(h => ({
    userId: h.userId,
    walletAddress: h.address,
    name: h.name,
    balance: h.balance,
    percentage: h.percentage,
    estimatedTokens: h.pumpTokens
  }))
};

// Save snapshot to file
const fs = require('fs');
const filename = `curve-snapshot-${Date.now()}.json`;
fs.writeFileSync(filename, JSON.stringify(snapshot, null, 2));

console.log('\n' + '='.repeat(70));
console.log('💾 SNAPSHOT SAVED');
console.log('=' .repeat(70));
console.log('  File: ' + filename);
console.log('');

// Show launch preview
console.log('🚀 LAUNCH PREVIEW');
console.log('=' .repeat(70));
console.log('When you launch this curve on Pump.fun:');
console.log('');
console.log('1️⃣  TOKEN CREATION:');
console.log('    • Name: [You choose]');
console.log('    • Symbol: [You choose]');
console.log('    • Total Supply: 1,000,000,000 tokens');
console.log('    • Bonding Curve: 793,000,000 tokens (79.3%)');
console.log('    • Liquidity Pool: 207,000,000 tokens (20.7%)');
console.log('');

console.log('2️⃣  AUTOMATIC AIRDROPS:');
distribution.forEach((holder, i) => {
  console.log(`    ${i + 1}. ${holder.name.padEnd(20)} → ${holder.pumpTokens.toLocaleString().padStart(12)} tokens`);
  console.log(`       Wallet: ${holder.address}`);
});

console.log('');
console.log('3️⃣  REVENUE STRUCTURE:');
console.log('    • Bonding Curve: 1.25% fee (you earn 0.30%)');
console.log('    • Post-Graduation: 0.05%-0.95% (you earn 30%)');
console.log('    • Example: $100k volume = $300 earned');

console.log('\n' + '='.repeat(70));
console.log('📋 NEXT STEPS');
console.log('=' .repeat(70));
console.log('');
console.log('1. Review the distribution above');
console.log('2. Choose your token name and symbol');
console.log('3. Launch on Pump.fun (mainnet)');
console.log('4. Tokens automatically airdropped to all wallets');
console.log('5. Start earning fees immediately!');
console.log('');
console.log('💡 Ready to launch? Run:');
console.log('   node scripts/launch-with-wallets.js ' + filename);
console.log('');
console.log('='.repeat(70));
console.log('');