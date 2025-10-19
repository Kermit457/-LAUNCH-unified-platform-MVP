import { Client, Databases } from 'node-appwrite'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

const databases = new Databases(client)

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users'

const attributesToAdd = [
  {
    key: 'twitter',
    type: 'string',
    size: 100,
    required: false,
    default: null,
  },
  {
    key: 'discord',
    type: 'string',
    size: 100,
    required: false,
    default: null,
  },
  {
    key: 'website',
    type: 'string',
    size: 500,
    required: false,
    default: null,
  },
  {
    key: 'instagram',
    type: 'string',
    size: 100,
    required: false,
    default: null,
  },
  {
    key: 'tiktok',
    type: 'string',
    size: 100,
    required: false,
    default: null,
  },
  {
    key: 'youtube',
    type: 'string',
    size: 100,
    required: false,
    default: null,
  },
  {
    key: 'contributionsJson',
    type: 'string',
    size: 10000,
    required: false,
    default: null,
  },
]

async function addAttributes() {
  console.log('🔧 Adding social & contribution attributes to users collection...\n')

  for (const attr of attributesToAdd) {
    try {
      console.log(`⏳ Adding attribute: ${attr.key} (${attr.type})...`)

      await databases.createStringAttribute(
        DB_ID,
        USERS_COLLECTION_ID,
        attr.key,
        attr.size,
        attr.required,
        undefined, // default value
        false // array
      )

      console.log(`✅ Successfully added: ${attr.key}`)

      // Wait a bit between attributes to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`⏭️  Attribute ${attr.key} already exists`)
      } else {
        console.error(`❌ Failed to add ${attr.key}:`, error.message)
      }
    }
  }

  console.log('\n🎉 Schema update complete!')
  console.log('\n💡 Now run: npm run seed-network')
}

addAttributes()