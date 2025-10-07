/**
 * Script to automatically add missing attributes to Appwrite quests collection
 * Run with: npm run fix-quests
 */

import { Client, Databases } from 'node-appwrite'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Appwrite configuration from .env
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1'
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68e34a030010f2321359'
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || ''
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'
const COLLECTION_ID = 'quests'

console.log('🔍 Checking environment variables...')
console.log('APPWRITE_ENDPOINT:', APPWRITE_ENDPOINT)
console.log('APPWRITE_PROJECT_ID:', APPWRITE_PROJECT_ID)
console.log('DATABASE_ID:', DATABASE_ID)
console.log('APPWRITE_API_KEY:', APPWRITE_API_KEY ? `${APPWRITE_API_KEY.substring(0, 20)}...` : '(not found)')

if (!APPWRITE_API_KEY) {
  console.error('❌ APPWRITE_API_KEY not found in .env file')
  console.error('💡 Make sure your .env file contains: APPWRITE_API_KEY=your_key_here')
  process.exit(1)
}

// Initialize Appwrite client with admin API key
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY)

const databases = new Databases(client)

// Define all required attributes for quests
const attributesToAdd = [
  {
    key: 'questId',
    type: 'string',
    size: 255,
    required: false,
    default: '',
    array: false,
    description: 'Unique quest ID'
  },
  {
    key: 'type',
    type: 'string',
    size: 50,
    required: false,
    default: 'raid',
    array: false,
    description: 'Quest type (raid or bounty)'
  },
  {
    key: 'title',
    type: 'string',
    size: 255,
    required: false,
    default: '',
    array: false,
    description: 'Quest title'
  },
  {
    key: 'description',
    type: 'string',
    size: 5000,
    required: false,
    default: '',
    array: false,
    description: 'Quest description'
  },
  {
    key: 'createdBy',
    type: 'string',
    size: 255,
    required: false,
    default: '',
    array: false,
    description: 'Creator user ID'
  },
  {
    key: 'status',
    type: 'string',
    size: 50,
    required: false,
    default: 'active',
    array: false,
    description: 'Quest status (active, completed, cancelled, live)'
  },
  {
    key: 'poolAmount',
    type: 'double',
    required: false,
    default: 0,
    array: false,
    min: 0,
    description: 'Total pool amount in USDC'
  },
  {
    key: 'budgetTotal',
    type: 'double',
    required: false,
    default: 0,
    array: false,
    min: 0,
    description: 'Total budget'
  },
  {
    key: 'budgetPaid',
    type: 'double',
    required: false,
    default: 0,
    array: false,
    min: 0,
    description: 'Amount paid out'
  },
  {
    key: 'payPerTask',
    type: 'double',
    required: false,
    default: 0,
    array: false,
    min: 0,
    description: 'Payment per task completion'
  },
  {
    key: 'platforms',
    type: 'string',
    size: 100,
    required: false,
    default: null,
    array: true,
    description: 'Platforms array'
  },
  {
    key: 'participants',
    type: 'integer',
    required: false,
    default: 0,
    array: false,
    min: 0,
    description: 'Number of participants'
  },
  {
    key: 'deadline',
    type: 'string',
    size: 255,
    required: false,
    default: '',
    array: false,
    description: 'Quest deadline (ISO string)'
  },
  {
    key: 'requirements',
    type: 'string',
    size: 500,
    required: false,
    default: null,
    array: true,
    description: 'Quest requirements'
  },
  {
    key: 'ownerType',
    type: 'string',
    size: 20,
    required: false,
    default: 'user',
    array: false,
    description: 'Owner type (user or project)'
  },
  {
    key: 'ownerId',
    type: 'string',
    size: 255,
    required: false,
    default: '',
    array: false,
    description: 'Owner entity ID'
  }
]

async function checkAttributeExists(key: string): Promise<boolean> {
  try {
    await databases.getAttribute(DATABASE_ID, COLLECTION_ID, key)
    return true
  } catch (error: any) {
    if (error.code === 404) {
      return false
    }
    throw error
  }
}

async function createAttribute(attr: any) {
  try {
    const exists = await checkAttributeExists(attr.key)

    if (exists) {
      console.log(`⏭️  Skipping ${attr.key} - already exists`)
      return
    }

    console.log(`📝 Creating attribute: ${attr.key} (${attr.type})`)

    switch (attr.type) {
      case 'string':
        await databases.createStringAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          attr.key,
          attr.size,
          attr.required,
          attr.default,
          attr.array
        )
        break

      case 'integer':
        await databases.createIntegerAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          attr.key,
          attr.required,
          attr.min,
          attr.max,
          attr.default,
          attr.array
        )
        break

      case 'double':
        await databases.createFloatAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          attr.key,
          attr.required,
          attr.min,
          attr.max,
          attr.default,
          attr.array
        )
        break

      default:
        console.error(`❌ Unknown type: ${attr.type}`)
        return
    }

    console.log(`✅ Created ${attr.key}`)

    // Wait a bit for Appwrite to process
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error: any) {
    console.error(`❌ Failed to create ${attr.key}:`, error.message)
  }
}

async function main() {
  console.log('🚀 Starting Appwrite Quests Schema Fix\n')
  console.log(`Endpoint: ${APPWRITE_ENDPOINT}`)
  console.log(`Project: ${APPWRITE_PROJECT_ID}`)
  console.log(`Database: ${DATABASE_ID}`)
  console.log(`Collection: ${COLLECTION_ID}\n`)

  console.log(`📋 Adding ${attributesToAdd.length} attributes...\n`)

  for (const attr of attributesToAdd) {
    await createAttribute(attr)
  }

  console.log('\n✅ Schema fix completed!')
  console.log('\n💡 Note: It may take a few moments for all attributes to be fully available.')
  console.log('💡 Try creating a quest again in ~30 seconds.')
}

main().catch(error => {
  console.error('❌ Script failed:', error)
  process.exit(1)
})