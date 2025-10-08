import { config } from 'dotenv'
import { Client, Databases } from 'node-appwrite'

config()

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const LAUNCHES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DB_ID || !LAUNCHES_COLLECTION_ID) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_APPWRITE_ENDPOINT:', ENDPOINT)
  console.error('- NEXT_PUBLIC_APPWRITE_PROJECT_ID:', PROJECT_ID)
  console.error('- APPWRITE_API_KEY:', API_KEY ? 'present' : 'missing')
  console.error('- NEXT_PUBLIC_APPWRITE_DATABASE_ID:', DB_ID)
  console.error('- NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID:', LAUNCHES_COLLECTION_ID)
  process.exit(1)
}

const client = new Client()
  .setEndpoint(ENDPOINT!)
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!)

const databases = new Databases(client)

async function addEconomicsAttributes() {
  try {
    console.log('Adding economics attributes to launches collection...')

    // Add contributionPoolPct attribute
    console.log('Adding contributionPoolPct attribute...')
    await databases.createFloatAttribute(
      DB_ID!,
      LAUNCHES_COLLECTION_ID!,
      'contributionPoolPct',
      false, // not required
      undefined, // min
      undefined, // max
      undefined, // default
      false // array
    )
    console.log('✓ contributionPoolPct attribute created')

    // Add feesSharePct attribute
    console.log('Adding feesSharePct attribute...')
    await databases.createFloatAttribute(
      DB_ID!,
      LAUNCHES_COLLECTION_ID!,
      'feesSharePct',
      false, // not required
      undefined, // min
      undefined, // max
      undefined, // default
      false // array
    )
    console.log('✓ feesSharePct attribute created')

    console.log('\n✅ Successfully added economics attributes to launches collection!')
    console.log('The following attributes were added:')
    console.log('- contributionPoolPct (float, optional)')
    console.log('- feesSharePct (float, optional)')
  } catch (error: any) {
    console.error('❌ Error adding attributes:', error.message)
    if (error.response) {
      console.error('Response:', error.response)
    }
    process.exit(1)
  }
}

addEconomicsAttributes()