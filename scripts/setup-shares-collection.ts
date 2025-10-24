/**
 * Setup script for Shares collection in Appwrite
 * Run: npx tsx scripts/setup-shares-collection.ts
 */

import { Client, Databases } from 'node-appwrite'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

const databases = new Databases(client)
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
const COLLECTION_ID = 'clip_shares'

async function setupSharesCollection() {
  try {
    console.log('🔗 Creating Clip Shares collection...')

    // Create collection
    const collection = await databases.createCollection(
      DB_ID,
      COLLECTION_ID,
      'Clip Shares',
      [
        'read("any")',
        'create("any")', // Allow anonymous sharing
        'update("users")',
        'delete("users")'
      ]
    )

    console.log('✅ Collection created:', collection.$id)

    // Create attributes
    const attributes = [
      { key: 'clipId', type: 'string', size: 50, required: true },
      { key: 'userId', type: 'string', size: 255, required: false }, // null if anonymous
      { key: 'platform', type: 'string', size: 20, required: true }, // twitter, copy, telegram, etc.
      { key: 'referralCode', type: 'string', size: 50, required: true },
    ]

    for (const attr of attributes) {
      try {
        await databases.createStringAttribute(
          DB_ID,
          COLLECTION_ID,
          attr.key,
          attr.size!,
          attr.required
        )
        console.log(`  ✓ Created attribute: ${attr.key}`)
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error: any) {
        console.log(`  ⚠ Skipping ${attr.key}: ${error.message}`)
      }
    }

    // Create indexes
    console.log('\n📑 Creating indexes...')

    const indexes = [
      { key: 'by_clipId', attributes: ['clipId'] },
      { key: 'by_userId', attributes: ['userId'] },
      { key: 'by_referralCode', attributes: ['referralCode'] },
      { key: 'by_platform', attributes: ['platform'] }
    ]

    for (const index of indexes) {
      try {
        await databases.createIndex(
          DB_ID,
          COLLECTION_ID,
          index.key,
          'key',
          index.attributes
        )
        console.log(`  ✓ Created index: ${index.key}`)
      } catch (error: any) {
        console.log(`  ⚠ Skipping ${index.key}: ${error.message}`)
      }
    }

    console.log('\n✅ Shares collection setup complete!')
    console.log('📝 Collection ID:', COLLECTION_ID)
    console.log('🔗 Add to .env: NEXT_PUBLIC_APPWRITE_SHARES_COLLECTION_ID=clip_shares')

  } catch (error: any) {
    console.error('❌ Error setting up collection:', error.message)
    process.exit(1)
  }
}

setupSharesCollection()
