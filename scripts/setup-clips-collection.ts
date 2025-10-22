/**
 * Setup script for Clips collection in Appwrite
 * Run: npx tsx scripts/setup-clips-collection.ts
 */

import { Client, Databases, ID } from 'node-appwrite'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!) // Server API key required

const databases = new Databases(client)
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
const COLLECTION_ID = 'clips'

async function setupClipsCollection() {
  try {
    console.log('🎬 Creating Clips collection...')

    // Create collection
    const collection = await databases.createCollection(
      DB_ID,
      COLLECTION_ID,
      'Clips',
      [
        // Public read
        'read("any")',
        // Authenticated write
        'create("users")',
        'update("users")',
        'delete("users")'
      ]
    )

    console.log('✅ Collection created:', collection.$id)

    // Create attributes
    const attributes = [
      { key: 'clipId', type: 'string', size: 50, required: true },
      { key: 'submittedBy', type: 'string', size: 255, required: true },
      { key: 'campaignId', type: 'string', size: 50, required: false },
      { key: 'platform', type: 'string', size: 20, required: true },
      { key: 'embedUrl', type: 'string', size: 500, required: true },
      { key: 'thumbnailUrl', type: 'string', size: 500, required: false },
      { key: 'title', type: 'string', size: 200, required: false },
      { key: 'projectName', type: 'string', size: 100, required: false },
      { key: 'badge', type: 'string', size: 20, required: false },
      { key: 'views', type: 'integer', required: true },
      { key: 'likes', type: 'integer', required: true },
      { key: 'comments', type: 'integer', required: true },
      { key: 'shares', type: 'integer', required: true },
      { key: 'engagement', type: 'float', required: true },
      { key: 'clicks', type: 'integer', required: true },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'ownerType', type: 'string', size: 20, required: false },
      { key: 'ownerId', type: 'string', size: 50, required: false },
      { key: 'referralCode', type: 'string', size: 50, required: false },
      { key: 'approved', type: 'boolean', required: true },
      { key: 'metadata', type: 'string', size: 2000, required: false }
    ]

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DB_ID,
            COLLECTION_ID,
            attr.key,
            attr.size!,
            attr.required
          )
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DB_ID,
            COLLECTION_ID,
            attr.key,
            attr.required
          )
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(
            DB_ID,
            COLLECTION_ID,
            attr.key,
            attr.required
          )
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DB_ID,
            COLLECTION_ID,
            attr.key,
            attr.required
          )
        }

        console.log(`  ✓ Created attribute: ${attr.key}`)
        // Wait a bit to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error: any) {
        console.log(`  ⚠ Skipping ${attr.key}: ${error.message}`)
      }
    }

    // Create indexes
    console.log('\n📑 Creating indexes...')

    const indexes = [
      { key: 'by_submittedBy', type: 'key', attributes: ['submittedBy'] },
      { key: 'by_campaignId', type: 'key', attributes: ['campaignId'] },
      { key: 'by_status', type: 'key', attributes: ['status'] },
      { key: 'by_platform', type: 'key', attributes: ['platform'] },
      { key: 'by_views_desc', type: 'key', attributes: ['views'], orders: ['DESC'] },
      { key: 'by_engagement', type: 'key', attributes: ['engagement'], orders: ['DESC'] }
    ]

    for (const index of indexes) {
      try {
        await databases.createIndex(
          DB_ID,
          COLLECTION_ID,
          index.key,
          index.type as any,
          index.attributes,
          index.orders
        )
        console.log(`  ✓ Created index: ${index.key}`)
      } catch (error: any) {
        console.log(`  ⚠ Skipping ${index.key}: ${error.message}`)
      }
    }

    console.log('\n✅ Clips collection setup complete!')
    console.log('📝 Collection ID:', COLLECTION_ID)
    console.log('🔗 Add to .env: NEXT_PUBLIC_APPWRITE_CLIPS_COLLECTION_ID=clips')

  } catch (error: any) {
    console.error('❌ Error setting up collection:', error.message)
    process.exit(1)
  }
}

setupClipsCollection()
