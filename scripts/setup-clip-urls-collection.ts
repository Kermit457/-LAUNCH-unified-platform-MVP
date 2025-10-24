/**
 * Setup script for Clip URLs collection in Appwrite
 * Enables multi-platform URL support per clip
 * Run: npx tsx scripts/setup-clip-urls-collection.ts
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
const COLLECTION_ID = 'clip_urls'

async function setupClipUrlsCollection() {
  try {
    console.log('🔗 Creating Clip URLs collection...')

    // Create collection
    const collection = await databases.createCollection(
      DB_ID,
      COLLECTION_ID,
      'Clip URLs',
      [
        'read("any")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ]
    )

    console.log('✅ Collection created:', collection.$id)

    // Create attributes
    const stringAttributes = [
      { key: 'clipId', size: 50, required: true },
      { key: 'platform', size: 20, required: true },
      { key: 'url', size: 500, required: true },
    ]

    const booleanAttributes = [
      { key: 'isPrimary', required: true },
    ]

    const integerAttributes = [
      { key: 'views', required: true },
    ]

    // Create string attributes
    for (const attr of stringAttributes) {
      try {
        await databases.createStringAttribute(
          DB_ID,
          COLLECTION_ID,
          attr.key,
          attr.size,
          attr.required
        )
        console.log(`  ✓ Created attribute: ${attr.key}`)
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error: any) {
        console.log(`  ⚠ Skipping ${attr.key}: ${error.message}`)
      }
    }

    // Create boolean attributes
    for (const attr of booleanAttributes) {
      try {
        await databases.createBooleanAttribute(
          DB_ID,
          COLLECTION_ID,
          attr.key,
          attr.required
        )
        console.log(`  ✓ Created attribute: ${attr.key}`)
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error: any) {
        console.log(`  ⚠ Skipping ${attr.key}: ${error.message}`)
      }
    }

    // Create integer attributes
    for (const attr of integerAttributes) {
      try {
        await databases.createIntegerAttribute(
          DB_ID,
          COLLECTION_ID,
          attr.key,
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
      { key: 'by_platform', attributes: ['platform'] },
      { key: 'by_isPrimary', attributes: ['isPrimary'] },
      { key: 'by_clipId_platform', attributes: ['clipId', 'platform'] }
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

    console.log('\n✅ Clip URLs collection setup complete!')
    console.log('📝 Collection ID:', COLLECTION_ID)
    console.log('🔗 Add to .env: NEXT_PUBLIC_APPWRITE_CLIP_URLS_COLLECTION_ID=clip_urls')

  } catch (error: any) {
    console.error('❌ Error setting up collection:', error.message)
    process.exit(1)
  }
}

setupClipUrlsCollection()
