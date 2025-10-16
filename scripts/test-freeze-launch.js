/**
 * Test Freeze → Snapshot → Launch Flow
 *
 * This script tests the complete token launch process:
 * 1. Freeze the curve
 * 2. Create holder snapshot
 * 3. Deploy token to pump.fun
 * 4. Seed liquidity pool
 * 5. Airdrop to holders
 *
 * Usage:
 *   node scripts/test-freeze-launch.js <curveId> <userId>
 *
 * Example:
 *   node scripts/test-freeze-launch.js 68ea29f8d4f6c5a8e125 68e4a769003c81b6f818
 */

const sdk = require('node-appwrite')
require('dotenv').config()

// Configuration
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'

// Get parameters
const curveId = process.argv[2]
const userId = process.argv[3]

if (!curveId || !userId) {
  console.error('❌ Error: Missing required parameters')
  console.log('\nUsage:')
  console.log('  node scripts/test-freeze-launch.js <curveId> <userId>')
  console.log('\nExample:')
  console.log('  node scripts/test-freeze-launch.js 68ea29f8d4f6c5a8e125 68e4a769003c81b6f818')
  process.exit(1)
}

// Validate environment
if (!PROJECT_ID || !API_KEY) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

// Initialize Appwrite
const client = new sdk.Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY)

const databases = new sdk.Databases(client)

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║     Test: Freeze → Snapshot → Launch Flow                ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`🔑 Curve ID: ${curveId}`)
  console.log(`👤 User ID: ${userId}`)
  console.log('')

  try {
    // Step 1: Verify curve exists and get current state
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 STEP 1: Verify Curve State')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const curvesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID || 'curves'
    const curve = await databases.getDocument(DATABASE_ID, curvesCollectionId, curveId)

    console.log(`\n✅ Curve Found:`)
    console.log(`   Owner Type: ${curve.ownerType}`)
    console.log(`   Owner ID: ${curve.ownerId}`)
    console.log(`   State: ${curve.state}`)
    console.log(`   Supply: ${curve.supply} keys`)
    console.log(`   Holders: ${curve.holders}`)
    console.log(`   Reserve: ${curve.reserve} SOL`)
    console.log(`   Price: ${curve.price} SOL`)

    // Verify ownership
    if (curve.ownerId !== userId) {
      throw new Error(`User ${userId} is not the owner of this curve`)
    }

    // Check thresholds
    console.log(`\n📋 Launch Requirements:`)
    const meetsSupply = curve.supply >= 100
    const meetsHolders = curve.holders >= 4
    const meetsReserve = curve.reserve >= 10

    console.log(`   ${meetsSupply ? '✅' : '❌'} Supply: ${curve.supply} / 100 keys`)
    console.log(`   ${meetsHolders ? '✅' : '❌'} Holders: ${curve.holders} / 4`)
    console.log(`   ${meetsReserve ? '✅' : '❌'} Reserve: ${curve.reserve} / 10 SOL`)

    if (!meetsSupply || !meetsHolders || !meetsReserve) {
      throw new Error('Curve does not meet launch requirements')
    }

    // Step 2: Get holder snapshot preview
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📸 STEP 2: Preview Holder Snapshot')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const holdersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CURVE_HOLDERS_COLLECTION_ID || 'curve_holders'
    const holdersResponse = await databases.listDocuments(
      DATABASE_ID,
      holdersCollectionId,
      [sdk.Query.equal('curveId', curveId)]
    )

    console.log(`\n📊 Holders to receive airdrop: ${holdersResponse.documents.length}`)
    console.log(`\nTop Holders:`)

    const holders = holdersResponse.documents
      .map(h => ({
        userId: h.userId,
        balance: h.balance,
        percentage: (h.balance / curve.supply) * 100,
        tokens: h.balance * 1_000_000 // 1M tokens per key
      }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5)

    holders.forEach((h, i) => {
      console.log(`   ${i + 1}. User ${h.userId.substring(0, 12)}...`)
      console.log(`      Keys: ${h.balance.toFixed(2)} (${h.percentage.toFixed(2)}%)`)
      console.log(`      Will receive: ${h.tokens.toLocaleString()} tokens`)
    })

    // Step 3: Test freeze endpoint
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('❄️  STEP 3: Test Freeze Endpoint')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    if (curve.state === 'frozen') {
      console.log('\n⚠️  Curve is already frozen. Skipping freeze step.')
    } else {
      console.log('\n🔄 Calling /api/curve/{id}/freeze...')
      console.log(`   Endpoint: POST ${ENDPOINT.replace('/v1', '')}/api/curve/${curveId}/freeze`)
      console.log(`   This would freeze the curve (currently MOCK mode - not calling API)`)
      console.log('\n   In production, this will:')
      console.log('   1. Change curve state to "frozen"')
      console.log('   2. Prevent further buy/sell transactions')
      console.log('   3. Create a freeze event')
    }

    // Step 4: Test launch endpoint
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🚀 STEP 4: Test Launch Flow')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    console.log('\n📋 Launch Process Breakdown:')
    console.log('\n   Step 1/6: Freeze curve')
    console.log('   ✓ Change state to "frozen"')
    console.log('   ✓ Prevent new trades')

    console.log('\n   Step 2/6: Create holder snapshot')
    console.log(`   ✓ Capture ${holdersResponse.documents.length} holders`)
    console.log(`   ✓ Total supply: ${curve.supply} keys`)
    console.log('   ✓ Store in snapshots collection')

    console.log('\n   Step 3/6: Create SPL token')
    console.log(`   ✓ Name: ${curve.ownerType === 'user' ? 'Creator' : 'Project'} Token`)
    console.log(`   ✓ Symbol: (auto-generated)`)
    console.log(`   ✓ Decimals: 9`)
    console.log(`   ✓ Total Supply: ${(curve.supply * 1_000_000).toLocaleString()} tokens`)
    console.log('   ✓ Upload metadata to Arweave')

    console.log('\n   Step 4/6: Seed liquidity pool')
    console.log(`   ✓ SOL Amount: ${curve.reserve} SOL`)
    console.log(`   ✓ Initial Price: ${curve.price} SOL`)
    console.log('   ✓ Create Raydium/Orca pool')
    console.log('   ✓ Lock LP tokens (optional)')

    console.log('\n   Step 5/6: Automatic airdrop to holders')
    console.log(`   ✓ Send tokens to ${holdersResponse.documents.length} wallets`)
    console.log('   ✓ No claiming needed - automatic distribution')
    console.log('   ✓ Batch SPL transfers for efficiency')

    console.log('\n   Step 6/6: Finalize launch')
    console.log('   ✓ Update curve state to "launched"')
    console.log('   ✓ Store token mint address')
    console.log('   ✓ Create launch event')
    console.log('   ✓ Move reserve to LP (set reserve = 0)')

    // Step 5: Show expected result
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 STEP 5: Expected Results')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    console.log('\n📈 Token Details:')
    console.log(`   Total Supply: ${(curve.supply * 1_000_000).toLocaleString()} tokens`)
    console.log(`   Holders: ${holdersResponse.documents.length}`)
    console.log(`   LP SOL: ${curve.reserve} SOL`)
    console.log(`   Initial Price: ${curve.price} SOL`)

    console.log('\n💰 Airdrop Distribution:')
    holdersResponse.documents.forEach((h, i) => {
      const tokens = h.balance * 1_000_000
      const percentage = (h.balance / curve.supply) * 100
      if (i < 5) {
        console.log(`   ${i + 1}. ${h.userId.substring(0, 12)}...: ${tokens.toLocaleString()} tokens (${percentage.toFixed(2)}%)`)
      }
    })
    if (holdersResponse.documents.length > 5) {
      console.log(`   ... and ${holdersResponse.documents.length - 5} more holders`)
    }

    console.log('\n🔗 Links:')
    console.log(`   Pump.fun: https://pump.fun/{tokenMint}`)
    console.log(`   Solscan: https://solscan.io/token/{tokenMint}`)
    console.log(`   DEXScreener: https://dexscreener.com/solana/{tokenMint}`)

    // Summary
    console.log('\n')
    console.log('╔═══════════════════════════════════════════════════════════╗')
    console.log('║              ✅ Test Simulation Complete!                ║')
    console.log('╚═══════════════════════════════════════════════════════════╝')
    console.log('')
    console.log('📝 Next Steps to Run Actual Launch:')
    console.log('')
    console.log('1. 🔧 Implement Real Solana Integration:')
    console.log('   - Replace pump-fun/service.ts MOCK with real Solana SDK')
    console.log('   - Add @solana/spl-token for token creation')
    console.log('   - Add @metaplex-foundation/js for metadata')
    console.log('   - Add Raydium/Orca SDK for liquidity pools')
    console.log('')
    console.log('2. 🌐 Make API Call:')
    console.log(`   POST ${ENDPOINT.replace('/v1', '')}/api/curve/${curveId}/launch`)
    console.log(`   Body: { "userId": "${userId}", "p0": ${curve.price} }`)
    console.log('')
    console.log('3. 💾 Get User Wallet Addresses:')
    console.log('   - Fetch real Solana wallet addresses from user profiles')
    console.log('   - Currently using mock addresses: wallet-{userId}')
    console.log('')
    console.log('4. 🎯 Monitor Progress:')
    console.log('   - Watch console logs for each step')
    console.log('   - Check snapshots collection for holder data')
    console.log('   - Verify token mint on Solscan')
    console.log('   - Confirm airdrops in holder wallets')
    console.log('')
    console.log('⚠️  IMPORTANT: Currently in MOCK mode!')
    console.log('   No real blockchain transactions will occur.')
    console.log('   Update lib/pump-fun/service.ts for production.')
    console.log('')

  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('\nDetails:', error)
    process.exit(1)
  }
}

main()
