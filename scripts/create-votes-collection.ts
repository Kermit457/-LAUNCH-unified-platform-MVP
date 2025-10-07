/**
 * Script to create the Votes collection in Appwrite
 * Run with: npx tsx scripts/create-votes-collection.ts
 */

import { config } from 'dotenv'
import { Client, Databases, ID } from 'node-appwrite'

// Load environment variables from .env file
config()

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error('❌ Missing required environment variables:')
  if (!ENDPOINT) console.error('  - NEXT_PUBLIC_APPWRITE_ENDPOINT')
  if (!PROJECT_ID) console.error('  - NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  if (!API_KEY) console.error('  - APPWRITE_API_KEY')
  console.error('\nPlease check your .env file')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY)

const databases = new Databases(client)

async function createVotesCollection() {
  try {
    console.log('🔨 Creating Votes collection...')

    // Create the collection
    const collection = await databases.createCollection(
      DB_ID,
      'votes', // Collection ID
      'Votes',  // Collection Name
      [
        // Permissions
        'read("any")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ]
    )

    console.log('✅ Votes collection created:', collection.$id)

    // Create attributes
    console.log('📝 Creating attributes...')

    // 1. voteId (string, required, unique)
    await databases.createStringAttribute(
      DB_ID,
      'votes',
      'voteId',
      255,
      true, // required
      undefined, // default value
      false // array
    )
    console.log('  ✓ voteId attribute created')

    // Wait for attribute to be available
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 2. launchId (string, required)
    await databases.createStringAttribute(
      DB_ID,
      'votes',
      'launchId',
      255,
      true // required
    )
    console.log('  ✓ launchId attribute created')

    await new Promise(resolve => setTimeout(resolve, 2000))

    // 3. userId (string, required)
    await databases.createStringAttribute(
      DB_ID,
      'votes',
      'userId',
      255,
      true // required
    )
    console.log('  ✓ userId attribute created')

    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create indexes for faster queries
    console.log('🔍 Creating indexes...')

    // Index for finding votes by launch
    await databases.createIndex(
      DB_ID,
      'votes',
      'idx_launchId',
      'key',
      ['launchId']
    )
    console.log('  ✓ launchId index created')

    // Index for finding votes by user
    await databases.createIndex(
      DB_ID,
      'votes',
      'idx_userId',
      'key',
      ['userId']
    )
    console.log('  ✓ userId index created')

    // Composite index for checking if user voted on specific launch
    await databases.createIndex(
      DB_ID,
      'votes',
      'idx_launchId_userId',
      'key',
      ['launchId', 'userId']
    )
    console.log('  ✓ Composite index created')

    console.log('\n🎉 Votes collection setup complete!')
    console.log('\n📋 Collection details:')
    console.log('  Collection ID: votes')
    console.log('  Attributes: voteId, launchId, userId')
    console.log('  Indexes: launchId, userId, launchId+userId')

  } catch (error: any) {
    if (error.code === 409) {
      console.log('ℹ️  Votes collection already exists')
    } else {
      console.error('❌ Error creating votes collection:', error.message)
      throw error
    }
  }
}

// Run the script
createVotesCollection()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Failed:', error)
    process.exit(1)
  })
