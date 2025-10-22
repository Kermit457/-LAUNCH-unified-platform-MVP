/**
 * Update Clips Collection - Add Missing Attributes
 *
 * Adds projectId, creatorUsername, creatorAvatar, projectLogo to existing clips collection
 *
 * Usage: node scripts/update-clips-collection.mjs
 */

import { Client, Databases } from 'node-appwrite'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const COLLECTION_ID = 'clips'

if (!PROJECT_ID || !API_KEY || !DATABASE_ID) {
  console.error('❌ Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY, NEXT_PUBLIC_APPWRITE_DATABASE_ID')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY)

const databases = new Databases(client)

const newAttributes = [
  {
    key: 'projectId',
    type: 'string',
    size: 255,
    required: false,
    description: 'Project/Launch ID this clip is tagged with'
  },
  {
    key: 'creatorUsername',
    type: 'string',
    size: 255,
    required: false,
    description: 'Privy user username (Twitter/Email/Google)'
  },
  {
    key: 'creatorAvatar',
    type: 'string',
    size: 2000,
    required: false,
    description: 'URL to creator avatar (Twitter profile pic or DiceBear)'
  },
  {
    key: 'projectLogo',
    type: 'string',
    size: 2000,
    required: false,
    description: 'URL to project logo'
  }
]

async function addAttribute(attr) {
  try {
    console.log(`Adding attribute: ${attr.key}...`)

    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      attr.key,
      attr.size,
      attr.required,
      undefined, // default value
      false      // array
    )

    console.log(`✅ Attribute added: ${attr.key}`)

    // Wait 2 seconds to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000))

  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  Attribute already exists: ${attr.key}`)
    } else {
      console.error(`❌ Error adding attribute ${attr.key}:`, error.message)
      throw error
    }
  }
}

async function updateClipsCollection() {
  console.log('🚀 Updating clips collection with new attributes...\n')
  console.log(`Database: ${DATABASE_ID}`)
  console.log(`Collection: ${COLLECTION_ID}\n`)

  for (const attr of newAttributes) {
    await addAttribute(attr)
  }

  console.log('\n✅ Clips collection updated successfully!')
  console.log('You can now submit clips with projectId, creatorUsername, creatorAvatar, and projectLogo')
}

updateClipsCollection().catch(error => {
  console.error('❌ Update failed:', error)
  process.exit(1)
})
