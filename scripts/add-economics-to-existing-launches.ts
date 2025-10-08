import { config } from 'dotenv'
import { Client, Databases, Query } from 'node-appwrite'

config()

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const LAUNCHES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DB_ID || !LAUNCHES_COLLECTION_ID) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(ENDPOINT!)
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!)

const databases = new Databases(client)

async function addEconomicsToLaunches() {
  try {
    console.log('📊 Fetching existing launches...')

    // Get all launches
    const response = await databases.listDocuments(
      DB_ID!,
      LAUNCHES_COLLECTION_ID!,
      [Query.limit(100)]
    )

    console.log(`Found ${response.documents.length} launches\n`)

    // Update each launch with random economics data for demo
    for (const launch of response.documents) {
      try {
        // Skip if already has economics data
        if ((launch as any).contributionPoolPct !== undefined) {
          console.log(`⏭️  Skipping ${(launch as any).tokenName || launch.$id} - already has economics data`)
          continue
        }

        // Add random economics data (you can customize these values)
        const contributionPoolPct = Math.floor(Math.random() * 5) + 1 // 1-5%
        const feesSharePct = Math.floor(Math.random() * 20) + 5 // 5-25%

        await databases.updateDocument(
          DB_ID!,
          LAUNCHES_COLLECTION_ID!,
          launch.$id,
          {
            contributionPoolPct,
            feesSharePct,
          }
        )

        console.log(`✅ Updated ${(launch as any).tokenName || launch.$id}:`)
        console.log(`   🪙 Contribution Pool: ${contributionPoolPct}%`)
        console.log(`   💰 Fees Share: ${feesSharePct}%`)
      } catch (error: any) {
        console.error(`❌ Error updating ${launch.$id}:`, error.message)
      }
    }

    console.log('\n✨ Done! All launches now have economics data.')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

addEconomicsToLaunches()
