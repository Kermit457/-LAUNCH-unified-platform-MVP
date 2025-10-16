/**
 * Appwrite Price History Collection Setup Script
 *
 * This script automatically creates the required attributes and indexes
 * for the price_history collection in Appwrite.
 *
 * Prerequisites:
 * - price_history collection must already exist in Appwrite
 * - APPWRITE_API_KEY must be set in .env
 * - Node.js and node-appwrite package installed
 *
 * Usage:
 *   node scripts/setup-price-history.js
 */

const sdk = require('node-appwrite')
require('dotenv').config()

// Configuration
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRICE_HISTORY_COLLECTION_ID || 'price_history'

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

// Attribute definitions
const attributes = [
  {
    key: 'curveId',
    type: 'string',
    size: 256,
    required: true,
    array: false,
    description: 'The ID of the curve this price snapshot belongs to'
  },
  {
    key: 'supply',
    type: 'double',
    required: true,
    description: 'Total supply of keys at the time of snapshot'
  },
  {
    key: 'price',
    type: 'double',
    required: true,
    description: 'Price per key at the time of snapshot'
  },
  {
    key: 'timestamp',
    type: 'string',
    size: 256,
    required: true,
    array: false,
    description: 'ISO 8601 timestamp of when the snapshot was taken'
  }
]

// Index definitions
const indexes = [
  {
    key: 'curveId_idx',
    type: 'key',
    attributes: ['curveId'],
    orders: ['ASC'],
    description: 'Index for querying snapshots by curve ID'
  },
  {
    key: 'timestamp_idx',
    type: 'key',
    attributes: ['timestamp'],
    orders: ['DESC'],
    description: 'Index for sorting snapshots by time (newest first)'
  },
  {
    key: 'curve_time_idx',
    type: 'key',
    attributes: ['curveId', 'timestamp'],
    orders: ['ASC', 'DESC'],
    description: 'Composite index for efficient 24h price change queries'
  }
]

// Helper function to wait for attribute/index creation
async function waitForCreation(message, delayMs = 2000) {
  console.log(`⏳ ${message}...`)
  await new Promise(resolve => setTimeout(resolve, delayMs))
}

// Create attributes
async function createAttributes() {
  console.log('\n📝 Creating attributes for price_history collection...\n')

  for (const attr of attributes) {
    try {
      console.log(`Creating attribute: ${attr.key} (${attr.type})`)

      if (attr.type === 'string') {
        await databases.createStringAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          attr.key,
          attr.size,
          attr.required,
          null, // default
          attr.array || false
        )
      } else if (attr.type === 'double') {
        await databases.createFloatAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          attr.key,
          attr.required,
          null, // min
          null, // max
          null, // default
          false // array
        )
      }

      console.log(`✅ Created: ${attr.key}`)
      await waitForCreation('Processing', 1500)

    } catch (error) {
      if (error.code === 409) {
        console.log(`⚠️  Attribute '${attr.key}' already exists, skipping...`)
      } else {
        console.error(`❌ Failed to create attribute '${attr.key}':`, error.message)
        throw error
      }
    }
  }

  console.log('\n✅ All attributes created successfully!\n')
}

// Create indexes
async function createIndexes() {
  console.log('\n🔍 Creating indexes for better query performance...\n')

  // Wait a bit to ensure all attributes are ready
  await waitForCreation('Waiting for attributes to be fully created', 3000)

  for (const index of indexes) {
    try {
      console.log(`Creating index: ${index.key}`)

      await databases.createIndex(
        DATABASE_ID,
        COLLECTION_ID,
        index.key,
        index.type,
        index.attributes,
        index.orders
      )

      console.log(`✅ Created: ${index.key}`)
      await waitForCreation('Processing', 2000)

    } catch (error) {
      if (error.code === 409) {
        console.log(`⚠️  Index '${index.key}' already exists, skipping...`)
      } else {
        console.error(`❌ Failed to create index '${index.key}':`, error.message)
        // Don't throw - indexes are optional
      }
    }
  }

  console.log('\n✅ All indexes created successfully!\n')
}

// Set permissions
async function setPermissions() {
  console.log('\n🔐 Setting up collection permissions...\n')

  try {
    await databases.updateCollection(
      DATABASE_ID,
      COLLECTION_ID,
      COLLECTION_ID, // name
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.any())
      ],
      false, // documentSecurity
      true   // enabled
    )

    console.log('✅ Permissions configured:')
    console.log('   - Any: Read, Create')
    console.log('   - Updates and Deletes: Disabled (immutable price history)\n')

  } catch (error) {
    console.error('❌ Failed to set permissions:', error.message)
    console.log('⚠️  You may need to set permissions manually in Appwrite Console\n')
  }
}

// Main execution
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║   Appwrite Price History Collection Setup Script         ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📊 Database: ${DATABASE_ID}`)
  console.log(`📦 Collection: ${COLLECTION_ID}`)
  console.log(`🌐 Endpoint: ${ENDPOINT}`)
  console.log('')

  try {
    // Step 1: Create attributes
    await createAttributes()

    // Step 2: Create indexes
    await createIndexes()

    // Step 3: Set permissions
    await setPermissions()

    // Success!
    console.log('╔═══════════════════════════════════════════════════════════╗')
    console.log('║                  🎉 Setup Complete!                       ║')
    console.log('╚═══════════════════════════════════════════════════════════╝')
    console.log('')
    console.log('Your price_history collection is now ready to use!')
    console.log('')
    console.log('Next steps:')
    console.log('1. ✅ Buy or sell some keys to create price snapshots')
    console.log('2. ✅ Wait 24 hours for historical data to accumulate')
    console.log('3. ✅ Check your launch cards for 24h price change badges')
    console.log('')

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    console.error('\nPlease check:')
    console.error('- Your Appwrite credentials are correct')
    console.error('- The price_history collection exists')
    console.error('- Your API key has the necessary permissions')
    process.exit(1)
  }
}

// Run the script
main()
