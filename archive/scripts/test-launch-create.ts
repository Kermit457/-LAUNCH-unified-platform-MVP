import { config } from 'dotenv'
import { Client, Databases, ID } from 'node-appwrite'

config()

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

const databases = new Databases(client)
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const LAUNCHES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID!

async function testCreateLaunch() {
  try {
    console.log('🧪 Testing launch creation with minimal fields...\n')

    const testLaunch = {
      launchId: 'test_launch_123',
      scope: 'ICM',
      title: 'Test Launch',
      subtitle: 'This is a test subtitle',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=TEST&backgroundColor=14f195',
      createdBy: 'test_user',
      contributionPoolPct: 2,
      feesSharePct: 10,
      convictionPct: 85,
      commentsCount: 0,
      upvotes: 0,
      status: 'live',
    }

    console.log('Attempting to create launch with:', testLaunch)

    const result = await databases.createDocument(
      DB_ID,
      LAUNCHES_COLLECTION_ID,
      ID.unique(),
      testLaunch
    )

    console.log('\n✅ Success! Launch created:', result.$id)
    console.log('Fields that worked:', Object.keys(testLaunch))

    // Clean up - delete the test launch
    await databases.deleteDocument(DB_ID, LAUNCHES_COLLECTION_ID, result.$id)
    console.log('✅ Test launch deleted')

  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    console.error('\nThis tells us what fields are missing or incorrect.')
  }
}

testCreateLaunch()