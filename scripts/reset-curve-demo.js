require('dotenv').config()
const { Client, Databases, Query } = require('node-appwrite')

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const databases = new Databases(client)
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

// Collection IDs
const COLLECTIONS = {
  CURVES: process.env.NEXT_PUBLIC_APPWRITE_CURVES_COLLECTION_ID || 'curves',
  CURVE_EVENTS: process.env.NEXT_PUBLIC_APPWRITE_CURVE_EVENTS_COLLECTION_ID || 'curve_events',
  CURVE_HOLDERS: process.env.NEXT_PUBLIC_APPWRITE_CURVE_HOLDERS_COLLECTION_ID || 'curve_holders',
  SNAPSHOTS: process.env.NEXT_PUBLIC_APPWRITE_SNAPSHOTS_COLLECTION_ID || 'snapshots',
}

const DEMO_USER_ID = 'demo-user-123'

async function resetCurveDemo() {
  try {
    console.log('🔄 Resetting curve demo for user:', DEMO_USER_ID)
    console.log('')

    // 1. Find all curves owned by demo user
    console.log('🔍 Finding demo user curves...')
    const curves = await databases.listDocuments(
      databaseId,
      COLLECTIONS.CURVES,
      [Query.equal('ownerId', DEMO_USER_ID)]
    )

    if (curves.documents.length === 0) {
      console.log('ℹ️  No curves found for demo user')
      return
    }

    console.log(`📊 Found ${curves.documents.length} curve(s)`)
    console.log('')

    // 2. Delete related data for each curve
    for (const curve of curves.documents) {
      console.log(`🗑️  Deleting data for curve: ${curve.$id}`)

      // Delete events
      try {
        const events = await databases.listDocuments(
          databaseId,
          COLLECTIONS.CURVE_EVENTS,
          [Query.equal('curveId', curve.$id)]
        )

        for (const event of events.documents) {
          await databases.deleteDocument(databaseId, COLLECTIONS.CURVE_EVENTS, event.$id)
        }
        console.log(`   ✅ Deleted ${events.documents.length} event(s)`)
      } catch (error) {
        console.log(`   ⚠️  No events to delete or error: ${error.message}`)
      }

      // Delete holders
      try {
        const holders = await databases.listDocuments(
          databaseId,
          COLLECTIONS.CURVE_HOLDERS,
          [Query.equal('curveId', curve.$id)]
        )

        for (const holder of holders.documents) {
          await databases.deleteDocument(databaseId, COLLECTIONS.CURVE_HOLDERS, holder.$id)
        }
        console.log(`   ✅ Deleted ${holders.documents.length} holder(s)`)
      } catch (error) {
        console.log(`   ⚠️  No holders to delete or error: ${error.message}`)
      }

      // Delete snapshots
      try {
        const snapshots = await databases.listDocuments(
          databaseId,
          COLLECTIONS.SNAPSHOTS,
          [Query.equal('curveId', curve.$id)]
        )

        for (const snapshot of snapshots.documents) {
          await databases.deleteDocument(databaseId, COLLECTIONS.SNAPSHOTS, snapshot.$id)
        }
        console.log(`   ✅ Deleted ${snapshots.documents.length} snapshot(s)`)
      } catch (error) {
        console.log(`   ⚠️  No snapshots to delete or error: ${error.message}`)
      }

      // Delete the curve itself
      await databases.deleteDocument(databaseId, COLLECTIONS.CURVES, curve.$id)
      console.log(`   ✅ Deleted curve`)
      console.log('')
    }

    // 3. Also delete any holder records where demo user is a holder
    console.log('🔍 Cleaning up demo user holder records...')
    try {
      const userHoldings = await databases.listDocuments(
        databaseId,
        COLLECTIONS.CURVE_HOLDERS,
        [Query.equal('userId', DEMO_USER_ID)]
      )

      for (const holding of userHoldings.documents) {
        await databases.deleteDocument(databaseId, COLLECTIONS.CURVE_HOLDERS, holding.$id)
      }
      console.log(`✅ Deleted ${userHoldings.documents.length} holder record(s)`)
    } catch (error) {
      console.log(`⚠️  No holder records to delete or error: ${error.message}`)
    }

    console.log('')
    console.log('✨ Reset complete!')
    console.log('')
    console.log('💡 Next steps:')
    console.log('   1. Refresh the /curve-demo page')
    console.log('   2. The demo will automatically create a new curve when you interact with it')
    console.log('')

  } catch (error) {
    console.error('❌ Error resetting demo:', error)
    process.exit(1)
  }
}

resetCurveDemo()
