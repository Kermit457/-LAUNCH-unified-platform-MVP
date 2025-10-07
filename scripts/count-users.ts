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

async function countUsers() {
  console.log('📊 Counting users in Appwrite...\n')

  try {
    // Get all users
    const response = await databases.listDocuments(DB_ID, USERS_COLLECTION_ID, [])

    console.log(`Total users in database: ${response.total}`)
    console.log(`Users returned: ${response.documents.length}`)

    console.log('\n👥 Sample of users:')
    response.documents.slice(0, 10).forEach((doc: any, i) => {
      console.log(`${i + 1}. ${doc.username} (${doc.displayName}) - ID: ${doc.userId}`)
    })

    // Count test users vs real users
    const testUsers = response.documents.filter((doc: any) =>
      doc.userId?.startsWith('user_') || doc.username?.includes('_')
    )

    console.log(`\n📈 Breakdown:`)
    console.log(`  - Test users (user_*): ${testUsers.length}`)
    console.log(`  - Real users: ${response.documents.length - testUsers.length}`)

  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
  }
}

countUsers()