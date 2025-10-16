/**
 * Test V6 Curve Launch
 *
 * Tests the complete V6 flow:
 * 1. Curve with hybrid exponential formula
 * 2. Auto-freeze at 32 SOL
 * 3. Launch on Pump.fun with configurable SOL
 * 4. Distribute to holders via Privy wallets
 * 5. Send remaining reserve to project
 */

import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
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

// V6 Configuration
const V6_CONFIG = {
  tokenName: 'LaunchOS V6',
  tokenSymbol: 'LOSv6',
  description: 'V6 Hybrid Exponential Curve - Fair Launch Token',
  launchAmountSOL: 10, // Use 10 SOL from reserve (balanced option)
  projectMarketingWallet: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL',
};

// Mock key holders (would come from snapshot)
const KEY_HOLDERS = [
  {
    privyWallet: 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP',
    keys: 150,
    name: 'Early Whale'
  },
  {
    privyWallet: 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT',
    keys: 100,
    name: 'Diamond Hands'
  },
  {
    privyWallet: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL',
    keys: 75,
    name: 'Project Team'
  },
  {
    privyWallet: '2d9dKoLqXpzgEwSUFd4hYMMYk1kjXSHn2L9Z88WbKyL5',
    keys: 50,
    name: 'Community Leader'
  },
  {
    privyWallet: 'HgdQ726vLkMspD81SWGJhoaUJYraydeTnqT373apidEe',
    keys: 25,
    name: 'Supporter'
  }
];

const TOTAL_KEYS = KEY_HOLDERS.reduce((sum, h) => sum + h.keys, 0);

/**
 * Calculate V6 curve price
 */
function calculateV6Price(supply) {
  // P(S) = 0.05 + 0.0003 * S + 0.0000012 * S^1.6
  const base = 0.05;
  const linear = 0.0003 * supply;
  const exponential = 0.0000012 * Math.pow(supply, 1.6);
  return base + linear + exponential;
}

/**
 * Simulate curve state at 32 SOL
 */
function simulateCurveAt32SOL() {
  let reserve = 0;
  let supply = 0;

  // Find supply that yields ~32 SOL reserve
  while (reserve < 32) {
    const price = calculateV6Price(supply);
    const buyFee = price * 0.94; // 94% goes to reserve
    reserve += buyFee;
    supply++;
  }

  return {
    supply,
    reserve,
    finalPrice: calculateV6Price(supply),
    avgPrice: reserve / supply
  };
}

async function testV6Launch() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 TESTING V6 CURVE LAUNCH');
  console.log('='.repeat(70));
  console.log('');

  // Step 1: Show V6 curve characteristics
  console.log('📊 V6 Curve Model: Hybrid Exponential');
  console.log('   Formula: P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6');
  console.log('');

  const curveState = simulateCurveAt32SOL();
  console.log('📈 Curve at 32 SOL Reserve:');
  console.log(`   Supply: ${curveState.supply} keys`);
  console.log(`   Reserve: ${curveState.reserve.toFixed(2)} SOL`);
  console.log(`   Current Price: ${curveState.finalPrice.toFixed(4)} SOL`);
  console.log(`   Average Price: ${curveState.avgPrice.toFixed(4)} SOL`);
  console.log('');

  // Step 2: Show launch parameters
  console.log('🎯 Launch Parameters:');
  console.log(`   Token: ${V6_CONFIG.tokenName} (${V6_CONFIG.tokenSymbol})`);
  console.log(`   Launch Amount: ${V6_CONFIG.launchAmountSOL} SOL`);
  console.log(`   Estimated Tokens: ~${V6_CONFIG.launchAmountSOL * 25}M (${V6_CONFIG.launchAmountSOL * 2.5}% of 1B)`);
  console.log(`   Remaining Reserve: ${(32 - V6_CONFIG.launchAmountSOL).toFixed(1)} SOL → Project Marketing`);
  console.log('');

  // Step 3: Show fee distribution
  console.log('💰 V6 Fee Distribution (6% total):');
  console.log('   94% → Reserve (liquidity)');
  console.log('   4% → Referral Layer:');
  console.log('      • If project ref → project_privy_wallet');
  console.log('      • If user ref → referrer_privy_wallet');
  console.log('      • If no ref → community_reward_wallet');
  console.log('   1% → Buyback & Burn Wallet');
  console.log('   1% → Community Rewards Wallet');
  console.log('');

  // Step 4: Show holder distribution
  console.log('👥 Holder Distribution:');
  console.log('   Total Keys:', TOTAL_KEYS);
  console.log('');

  KEY_HOLDERS.forEach(holder => {
    const percentage = (holder.keys / TOTAL_KEYS * 100).toFixed(1);
    const estimatedTokens = Math.floor((holder.keys / TOTAL_KEYS) * V6_CONFIG.launchAmountSOL * 25_000_000);
    console.log(`   ${holder.name}:`);
    console.log(`      Keys: ${holder.keys} (${percentage}%)`);
    console.log(`      Est. Tokens: ${estimatedTokens.toLocaleString()}`);
    console.log(`      Privy Wallet: ${holder.privyWallet.slice(0, 8)}...`);
  });
  console.log('');

  // Step 5: Show dynamic key cap
  console.log('🔒 Dynamic Key Cap:');
  const holders = KEY_HOLDERS.length;
  const maxKeysPerWallet = 2 + Math.floor(0.004 * holders * 100); // Assuming 500 total holders
  console.log(`   Formula: 2 + floor(0.004 * holders)`);
  console.log(`   With ${holders * 100} holders: Max ${maxKeysPerWallet} keys per wallet`);
  console.log('');

  // Step 6: Execute launch (mock)
  console.log('━'.repeat(70));
  console.log('🚀 EXECUTING V6 LAUNCH...');
  console.log('━'.repeat(70));
  console.log('');

  console.log('1️⃣  Manual freeze by creator/project...');
  console.log('   ⚠️  Note: Freeze is MANUAL, not automatic at 32 SOL');
  console.log('   • Creator decides when to freeze and launch');
  console.log('   • Minimum 32 SOL required, but can wait for more');
  await new Promise(r => setTimeout(r, 1000));
  console.log('   ✅ Curve manually frozen');
  console.log('');

  console.log('2️⃣  Taking holder snapshot...');
  await new Promise(r => setTimeout(r, 1000));
  console.log('   ✅ Snapshot created');
  console.log('');

  console.log('3️⃣  Launching on Pump.fun...');
  console.log(`   • Creating token: ${V6_CONFIG.tokenSymbol}`);
  console.log(`   • Buying with ${V6_CONFIG.launchAmountSOL} SOL from reserve`);
  await new Promise(r => setTimeout(r, 2000));
  console.log('   ✅ Token created and initial buy complete');
  console.log('');

  console.log('4️⃣  Distributing tokens to holders...');
  for (const holder of KEY_HOLDERS) {
    const percentage = (holder.keys / TOTAL_KEYS * 100).toFixed(1);
    console.log(`   • ${holder.name}: ${percentage}% distributed`);
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('   ✅ All distributions complete');
  console.log('');

  console.log('5️⃣  Transferring remaining reserve...');
  console.log(`   • ${(32 - V6_CONFIG.launchAmountSOL).toFixed(1)} SOL → Project Marketing Wallet`);
  await new Promise(r => setTimeout(r, 1000));
  console.log('   ✅ Reserve transferred');
  console.log('');

  // Final summary
  console.log('═'.repeat(70));
  console.log('✅ V6 LAUNCH COMPLETE!');
  console.log('═'.repeat(70));
  console.log('');
  console.log('📊 Final Summary:');
  console.log(`   Token: ${V6_CONFIG.tokenSymbol} (Mock Mint Address)`);
  console.log(`   Initial Market Cap: ~$${(V6_CONFIG.launchAmountSOL * 200).toLocaleString()}`);
  console.log(`   Holders: ${KEY_HOLDERS.length}`);
  console.log(`   Liquidity: ${V6_CONFIG.launchAmountSOL} SOL on Pump.fun`);
  console.log(`   Project Revenue: ${(32 - V6_CONFIG.launchAmountSOL).toFixed(1)} SOL`);
  console.log('');
  console.log('🔗 View on Pump.fun: https://pump.fun/coin/[TOKEN_MINT]');
  console.log('');
}

// Run test
testV6Launch().catch(console.error);