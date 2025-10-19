/**
 * Add Test Price Snapshot (25 hours ago)
 *
 * This script creates a price snapshot from 25 hours ago
 * so you can immediately test the 24h price change feature
 * without waiting 24 hours.
 *
 * Usage:
 *   node scripts/add-test-price-snapshot.js <curveId>
 *
 * Example:
 *   node scripts/add-test-price-snapshot.js 68ea29f8d4f6c5a8e125
 */

const sdk = require('node-appwrite')
require('dotenv').config()

// Configuration
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRICE_HISTORY_COLLECTION_ID || 'price_history'

// Get curveId from command line
const curveId = process.argv[2]

if (!curveId) {
  console.error('❌ Error: Please provide a curveId')
  console.log('\nUsage:')
  console.log('  node scripts/add-test-price-snapshot.js <curveId>')
  console.log('\nExample:')
  console.log('  node scripts/add-test-price-snapshot.js 68ea29f8d4f6c5a8e125')
  console.log('\nAvailable curves from your screenshot:')
  console.log('  - 68ea29f8d4f6c5a8e125 (LaunchOS Platform)')
  console.log('  - 68ea29fb60f74aea6698 (GameFi Arena)')
  process.exit(1)
}

// Validate environment variables
if (!PROJECT_ID || !API_KEY) {
  console.error('❌ Missing required environment variables:')
  if (!PROJECT_ID) console.error('  - NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  if (!API_KEY) console.error('  - APPWRITE_API_KEY')
  process.exit(1)
}

// Initialize Appwrite client
const client = new sdk.Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY)

const databases = new sdk.Databases(client)

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║       Add Test Price Snapshot (25 hours ago)             ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📊 Database: ${DATABASE_ID}`)
  console.log(`📦 Collection: ${COLLECTION_ID}`)
  console.log(`🔑 Curve ID: ${curveId}`)
  console.log('')

  try {
    // Step 1: Get current curve data from Appwrite
    console.log('🔍 Fetching current curve data from Appwrite...')

    const curvesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID || 'curves'

    const curveDoc = await databases.getDocument(
      DATABASE_ID,
      curvesCollectionId,
      curveId
    )

    const currentPrice = curveDoc.price || 0.05
    const currentSupply = curveDoc.supply || 10

    console.log(`✅ Current Price: ${currentPrice.toFixed(6)} SOL`)
    console.log(`✅ Current Supply: ${currentSupply} keys`)
    console.log('')

    // Step 2: Calculate "old" price (lower to show positive change)
    const oldPrice = currentPrice * 0.85 // 15% lower = +15% gain
    const oldSupply = Math.max(1, currentSupply - 5) // 5 keys less

    console.log(`📉 Creating historical snapshot:`)
    console.log(`   Old Price: ${oldPrice.toFixed(6)} SOL`)
    console.log(`   Old Supply: ${oldSupply} keys`)
    console.log(`   Expected Change: +${((currentPrice - oldPrice) / oldPrice * 100).toFixed(1)}%`)
    console.log('')

    // Step 3: Create timestamp from 25 hours ago
    const twentyFiveHoursAgo = new Date(Date.now() - 25 * 60 * 60 * 1000)
    const timestamp = twentyFiveHoursAgo.toISOString()

    console.log(`⏰ Timestamp: ${timestamp}`)
    console.log('')

    // Step 4: Create the snapshot
    console.log('💾 Creating price snapshot...')
    const snapshot = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      sdk.ID.unique(),
      {
        curveId,
        supply: oldSupply,
        price: oldPrice,
        timestamp
      }
    )

    console.log('✅ Snapshot created successfully!')
    console.log('')
    console.log('╔═══════════════════════════════════════════════════════════╗')
    console.log('║                  🎉 Success!                              ║')
    console.log('╚═══════════════════════════════════════════════════════════╝')
    console.log('')
    console.log('📋 Snapshot Details:')
    console.log(`   ID: ${snapshot.$id}`)
    console.log(`   Curve: ${curveId}`)
    console.log(`   Price: ${oldPrice.toFixed(6)} SOL`)
    console.log(`   Supply: ${oldSupply} keys`)
    console.log(`   Time: ${timestamp}`)
    console.log('')
    console.log('🚀 Next Steps:')
    console.log('1. Refresh your discover page')
    console.log('2. Look for the 24h price change badge in the top-right corner of the card')
    console.log('3. The badge should show a green +X.X% indicator!')
    console.log('')

  } catch (error) {
    console.error('\n❌ Failed to create snapshot:', error.message)
    console.error('\nTroubleshooting:')
    console.error('- Verify the curveId exists in your database')
    console.error('- Check that the price_history collection is set up correctly')
    console.error('- Ensure your API key has create permissions')
    process.exit(1)
  }
}

main()
