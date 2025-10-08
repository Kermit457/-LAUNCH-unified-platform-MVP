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
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS!

async function checkUsersSchema() {
  console.log('🔍 Checking users collection schema...\n')

  try {
    // Get collection metadata
    const collection = await databases.getCollection(DB_ID, USERS_COLLECTION_ID)

    console.log('📋 Collection:', collection.name)
    console.log('📊 Total documents:', (collection as any).total)
    console.log('\n📝 Attributes:')

    // Required attributes for UserProfile interface
    const requiredAttributes = [
      { key: 'userId', type: 'string', required: true },
      { key: 'username', type: 'string', required: true },
      { key: 'displayName', type: 'string', required: true },
      { key: 'bio', type: 'string', required: false },
      { key: 'avatar', type: 'string', required: false },
      { key: 'verified', type: 'boolean', required: true },
      { key: 'conviction', type: 'integer', required: true },
      { key: 'totalEarnings', type: 'double', required: true },
      { key: 'roles', type: 'string[]', required: true },
      { key: 'walletAddress', type: 'string', required: false },
      { key: 'followedLaunches', type: 'string[]', required: false },
    ]

    const existingAttributes = collection.attributes.map((attr: any) => attr.key)

    console.log('\n✅ Existing attributes:')
    collection.attributes.forEach((attr: any) => {
      console.log(`   - ${attr.key} (${attr.type})${attr.required ? ' [required]' : ''}${attr.array ? ' [array]' : ''}`)
    })

    const missingAttributes = requiredAttributes.filter(
      req => !existingAttributes.includes(req.key)
    )

    if (missingAttributes.length > 0) {
      console.log('\n❌ Missing required attributes:')
      missingAttributes.forEach(attr => {
        console.log(`   - ${attr.key} (${attr.type})${attr.required ? ' [required]' : ''}`)
      })
      console.log('\n💡 Run: npm run fix-users-schema')
    } else {
      console.log('\n✅ All required attributes exist!')
    }

    // Try to list documents
    console.log('\n👥 Fetching users...')
    const docs = await databases.listDocuments(DB_ID, USERS_COLLECTION_ID)
    console.log(`   Found ${docs.documents.length} users`)

    if (docs.documents.length > 0) {
      console.log('\n👤 Sample user:')
      const user = docs.documents[0]
      console.log(`   - ID: ${user.$id}`)
      console.log(`   - userId: ${(user as any).userId}`)
      console.log(`   - username: ${(user as any).username}`)
      console.log(`   - displayName: ${(user as any).displayName}`)
    }

  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    if (error.code === 404) {
      console.log('\n💡 Collection not found. Check your NEXT_PUBLIC_APPWRITE_COLLECTION_USERS in .env')
    }
  }
}

checkUsersSchema()