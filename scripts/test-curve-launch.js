/**
 * Test Curve to Pump.fun Launch Flow
 *
 * This script demonstrates the complete process:
 * 1. Freeze a curve
 * 2. Take a snapshot
 * 3. Launch token on Pump.fun
 * 4. Distribute tokens to holders
 *
 * Run: node scripts/test-curve-launch.js <curveId>
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE = 'http://localhost:3000/api';
const CURVE_ID = process.argv[2] || 'test-curve-1';

async function testCurveLaunch() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 TESTING CURVE TO PUMP.FUN LAUNCH FLOW');
  console.log('='.repeat(70));
  console.log('Curve ID:', CURVE_ID);
  console.log('');

  try {
    // Step 1: Check launch readiness
    console.log('📊 Checking launch readiness...');
    const readinessResponse = await fetch(`${API_BASE}/curve/launch?curveId=${CURVE_ID}`);
    const readiness = await readinessResponse.json();

    console.log('   Status:', readiness.status);
    console.log('   Is Ready:', readiness.isReady);
    console.log('   Requirements:');
    console.log('     - Frozen:', readiness.requirements?.isFrozen || false);
    console.log('     - Has Snapshot:', readiness.requirements?.hasSnapshot || false);
    console.log('     - Has Holders:', readiness.requirements?.hasHolders || false);

    if (readiness.stats) {
      console.log('   Stats:');
      console.log('     - Holders:', readiness.stats.holderCount);
      console.log('     - Supply:', readiness.stats.totalSupply);
      console.log('     - Market Cap:', readiness.stats.marketCap);
    }

    // Step 2: Freeze curve if not frozen
    if (!readiness.requirements?.isFrozen) {
      console.log('\n🧊 Freezing curve...');
      const freezeResponse = await fetch(`${API_BASE}/curve/${CURVE_ID}/freeze`, {
        method: 'POST'
      });
      const freezeResult = await freezeResponse.json();
      console.log('   Result:', freezeResult.message || 'Frozen');
    }

    // Step 3: Take snapshot if not exists
    if (!readiness.requirements?.hasSnapshot) {
      console.log('\n📸 Taking snapshot...');
      const snapshotResponse = await fetch(`${API_BASE}/curve/${CURVE_ID}/snapshot`, {
        method: 'POST'
      });
      const snapshotResult = await snapshotResponse.json();
      console.log('   Snapshot ID:', snapshotResult.snapshotId);
      console.log('   Holders:', snapshotResult.holderCount);
    }

    // Step 4: Show distribution preview
    if (readiness.distributionPreview) {
      console.log('\n📊 Token Distribution Preview:');
      console.log('   Total Supply: 1,000,000,000 tokens');
      console.log('   Bonding Curve: 793,000,000 (79.3%) - For holders');
      console.log('   Liquidity Pool: 207,000,000 (20.7%) - Locked at graduation');
      console.log('   Graduation: 84.985 SOL raised');

      if (readiness.distributionPreview.holderDistributions) {
        console.log('\n   Top Holders:');
        readiness.distributionPreview.holderDistributions.slice(0, 5).forEach(holder => {
          console.log(`     ${holder.userId}: ${holder.tokenAmount.toLocaleString()} tokens (${holder.percentage.toFixed(2)}%)`);
        });
      }
    }

    // Step 5: Launch token
    console.log('\n🚀 Launching token on Pump.fun...');
    console.log('   (This would create a real token in production)');

    const launchParams = {
      curveId: CURVE_ID,
      tokenName: `Curve ${CURVE_ID} Token`,
      tokenSymbol: `CRV${CURVE_ID.slice(-4).toUpperCase()}`,
      description: 'Token launched from bonding curve graduation',
      twitter: '@curvetoken',
      telegram: 't.me/curvetoken',
      website: 'https://curvetoken.com',
      initialBuySOL: 0.001
    };

    console.log('\n📝 Launch Parameters:');
    console.log('   Name:', launchParams.tokenName);
    console.log('   Symbol:', launchParams.tokenSymbol);
    console.log('   Initial Buy:', launchParams.initialBuySOL, 'SOL');

    // In production, this would actually launch the token
    const mockLaunchResponse = {
      success: true,
      tokenMint: `MOCK${Date.now()}`,
      signature: `sig_${Date.now()}`,
      pumpFunUrl: `https://pump.fun/coin/MOCK${Date.now()}`,
      distribution: {
        totalSupply: 1000000000,
        bondingCurveSupply: 793000000,
        liquidityPoolSupply: 207000000,
        holderDistributions: [
          { userId: 'user1', percentage: 45, tokenAmount: 356850000 },
          { userId: 'user2', percentage: 30, tokenAmount: 237900000 },
          { userId: 'user3', percentage: 15, tokenAmount: 118950000 },
          { userId: 'user4', percentage: 10, tokenAmount: 79300000 }
        ]
      }
    };

    if (mockLaunchResponse.success) {
      console.log('\n' + '='.repeat(70));
      console.log('✅ TOKEN LAUNCHED SUCCESSFULLY!');
      console.log('='.repeat(70));
      console.log('\n📊 Results:');
      console.log('   Token Mint:', mockLaunchResponse.tokenMint);
      console.log('   Transaction:', mockLaunchResponse.signature);
      console.log('   Pump.fun URL:', mockLaunchResponse.pumpFunUrl);

      console.log('\n💰 Token Distribution:');
      console.log('   Total: 1,000,000,000 tokens');
      console.log('   Bonding Curve: 793,000,000 (79.3%)');
      console.log('   Liquidity Pool: 207,000,000 (20.7%)');

      console.log('\n🎁 Holder Airdrops:');
      mockLaunchResponse.distribution.holderDistributions.forEach(holder => {
        console.log(`   ${holder.userId}: ${holder.tokenAmount.toLocaleString()} tokens (${holder.percentage}%)`);
      });

      console.log('\n📈 Next Steps:');
      console.log('   1. Holders receive their tokens automatically');
      console.log('   2. Trading starts on bonding curve (1.25% fee)');
      console.log('   3. Creator earns 0.30% of all trades');
      console.log('   4. Graduates to PumpSwap at ~$69k market cap');
      console.log('   5. Dynamic fees 0.05%-0.95% after graduation');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(70));
  console.log('📚 Documentation:');
  console.log('   - Integration: PUMP_FUN_INTEGRATION.md');
  console.log('   - Fee Structure: PROJECT_ASCEND_FEES_2025.md');
  console.log('   - Setup Guide: PUMP_FUN_SETUP.md');
  console.log('='.repeat(70));
  console.log('');
}

// Check if node-fetch is installed
try {
  require('node-fetch');
} catch {
  console.log('📦 Please install node-fetch:');
  console.log('   npm install node-fetch@2 --legacy-peer-deps');
  process.exit(1);
}

// Run test
testCurveLaunch().catch(console.error);