require('dotenv').config()
const { Client, Databases, Query } = require('node-appwrite')

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const databases = new Databases(client)
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const CURVES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID || 'curves'

async function listCurves() {
  try {
    console.log('📋 Listing all curves...\n')

    const response = await databases.listDocuments(
      databaseId,
      CURVES_COLLECTION_ID,
      [Query.limit(10)]
    )

    if (response.documents.length === 0) {
      console.log('❌ No curves found. Run: npm run seed-curves')
      return
    }

    console.log(`Found ${response.documents.length} curves:\n`)

    response.documents.forEach((curve, index) => {
      console.log(`${index + 1}. Curve ID: ${curve.$id}`)
      console.log(`   Owner: ${curve.ownerType}:${curve.ownerId}`)
      console.log(`   State: ${curve.state}`)
      console.log(`   Supply: ${curve.supply}`)
      console.log(`   Price: ${curve.price} SOL`)
      console.log(`   Reserve: ${curve.reserve} SOL`)
      console.log('')
    })

    console.log('\n💡 Use any of these IDs in your test page!')
    console.log(`   Example: curveId="${response.documents[0].$id}"`)
  } catch (error) {
    console.error('❌ Error listing curves:', error.message)
  }
}

listCurves()
