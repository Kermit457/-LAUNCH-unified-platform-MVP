require('dotenv').config()
const { Client, Databases } = require('node-appwrite')

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const databases = new Databases(client)
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function addSnapshotAttributes() {
  try {
    console.log('🔧 Adding attributes to Snapshots collection...\n')

    console.log('📝 Adding merkleRoot...')
    try {
      await databases.createStringAttribute(databaseId, 'snapshots', 'merkleRoot', 255, true)
      console.log('✅ merkleRoot added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  merkleRoot already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding holdersData (large string for JSON)...')
    try {
      await databases.createStringAttribute(databaseId, 'snapshots', 'holdersData', 100000, true)
      console.log('✅ holdersData added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  holdersData already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding totalSupply...')
    try {
      await databases.createFloatAttribute(databaseId, 'snapshots', 'totalSupply', true)
      console.log('✅ totalSupply added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  totalSupply already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding totalHolders...')
    try {
      await databases.createIntegerAttribute(databaseId, 'snapshots', 'totalHolders', true)
      console.log('✅ totalHolders added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  totalHolders already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding createdAt...')
    try {
      await databases.createStringAttribute(databaseId, 'snapshots', 'createdAt', 255, true)
      console.log('✅ createdAt added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  createdAt already exists')
      else throw e
    }

    console.log('\n✨ All snapshot attributes added!')
    console.log('⏳ Wait 30 seconds for Appwrite to process these attributes...')
    console.log('   Then run: npm run seed-curves')

  } catch (error) {
    console.error('❌ Error adding attributes:', error)
    process.exit(1)
  }
}

addSnapshotAttributes()
