require('dotenv').config()
const { Client, Databases } = require('node-appwrite')

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const databases = new Databases(client)
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

const COLLECTIONS = {
  CURVES: process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID || 'curves',
  CURVE_EVENTS: process.env.NEXT_PUBLIC_APPWRITE_CURVE_EVENTS_COLLECTION_ID || 'curve_events',
  CURVE_HOLDERS: process.env.NEXT_PUBLIC_APPWRITE_CURVE_HOLDERS_COLLECTION_ID || 'curve_holders',
  SNAPSHOTS: process.env.NEXT_PUBLIC_APPWRITE_SNAPSHOTS_COLLECTION_ID || 'snapshots',
}

async function verifySetup() {
  console.log('🔍 Verifying curve collections setup...\n')

  try {
    // Check Curves collection
    console.log('📋 Checking Curves collection...')
    try {
      const curvesCollection = await databases.getCollection(databaseId, COLLECTIONS.CURVES)
      console.log('✅ Curves collection exists')
      console.log(`   Attributes: ${curvesCollection.attributes.length}`)

      const requiredAttrs = ['ownerType', 'ownerId', 'state', 'price', 'reserve', 'supply', 'holders', 'createdAt']
      const existingAttrs = curvesCollection.attributes.map(a => a.key)

      console.log('\n   Required attributes:')
      requiredAttrs.forEach(attr => {
        const exists = existingAttrs.includes(attr)
        console.log(`   ${exists ? '✅' : '❌'} ${attr}`)
      })

      if (curvesCollection.attributes.length === 0) {
        console.log('\n   ⚠️  WARNING: No attributes found! The collection exists but is empty.')
        console.log('   Run: npm run setup-curves')
      }
    } catch (err) {
      console.log('❌ Curves collection not found')
      console.log('   Run: npm run setup-curves')
    }

    // Check Curve Events collection
    console.log('\n📋 Checking Curve Events collection...')
    try {
      const eventsCollection = await databases.getCollection(databaseId, COLLECTIONS.CURVE_EVENTS)
      console.log('✅ Curve Events collection exists')
      console.log(`   Attributes: ${eventsCollection.attributes.length}`)
    } catch (err) {
      console.log('❌ Curve Events collection not found')
    }

    // Check Curve Holders collection
    console.log('\n📋 Checking Curve Holders collection...')
    try {
      const holdersCollection = await databases.getCollection(databaseId, COLLECTIONS.CURVE_HOLDERS)
      console.log('✅ Curve Holders collection exists')
      console.log(`   Attributes: ${holdersCollection.attributes.length}`)
    } catch (err) {
      console.log('❌ Curve Holders collection not found')
    }

    // Check Snapshots collection
    console.log('\n📋 Checking Snapshots collection...')
    try {
      const snapshotsCollection = await databases.getCollection(databaseId, COLLECTIONS.SNAPSHOTS)
      console.log('✅ Snapshots collection exists')
      console.log(`   Attributes: ${snapshotsCollection.attributes.length}`)
    } catch (err) {
      console.log('❌ Snapshots collection not found')
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 Summary:')
    console.log('   If any collections are missing or have 0 attributes,')
    console.log('   run: npm run setup-curves')
    console.log('   Then wait 30 seconds for attributes to be created.')
    console.log('   Then run: npm run seed-curves')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

verifySetup()
