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

async function addCurveAttributes() {
  try {
    console.log('🔧 Adding attributes to Curves collection...\n')

    // Add attributes to Curves collection
    console.log('📝 Adding ownerType...')
    try {
      await databases.createEnumAttribute(databaseId, 'curves', 'ownerType', ['user', 'project'], true)
      console.log('✅ ownerType added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  ownerType already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding ownerId...')
    try {
      await databases.createStringAttribute(databaseId, 'curves', 'ownerId', 255, true)
      console.log('✅ ownerId added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  ownerId already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding state...')
    try {
      await databases.createEnumAttribute(databaseId, 'curves', 'state', ['active', 'frozen', 'launched', 'utility'], true)
      console.log('✅ state added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  state already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding price...')
    try {
      await databases.createFloatAttribute(databaseId, 'curves', 'price', true)
      console.log('✅ price added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  price already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding reserve...')
    try {
      await databases.createFloatAttribute(databaseId, 'curves', 'reserve', true)
      console.log('✅ reserve added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  reserve already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding supply...')
    try {
      await databases.createFloatAttribute(databaseId, 'curves', 'supply', true)
      console.log('✅ supply added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  supply already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding holders...')
    try {
      await databases.createIntegerAttribute(databaseId, 'curves', 'holders', true)
      console.log('✅ holders added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  holders already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding volume24h (optional)...')
    try {
      await databases.createFloatAttribute(databaseId, 'curves', 'volume24h', false, 0)
      console.log('✅ volume24h added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  volume24h already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding volumeTotal (optional)...')
    try {
      await databases.createFloatAttribute(databaseId, 'curves', 'volumeTotal', false, 0)
      console.log('✅ volumeTotal added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  volumeTotal already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding marketCap (optional)...')
    try {
      await databases.createFloatAttribute(databaseId, 'curves', 'marketCap', false, 0)
      console.log('✅ marketCap added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  marketCap already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding tokenMint (optional)...')
    try {
      await databases.createStringAttribute(databaseId, 'curves', 'tokenMint', 255, false)
      console.log('✅ tokenMint added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  tokenMint already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding launchedAt (optional)...')
    try {
      await databases.createStringAttribute(databaseId, 'curves', 'launchedAt', 255, false)
      console.log('✅ launchedAt added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  launchedAt already exists')
      else throw e
    }

    await sleep(1000)

    console.log('📝 Adding createdAt...')
    try {
      await databases.createStringAttribute(databaseId, 'curves', 'createdAt', 255, true)
      console.log('✅ createdAt added')
    } catch (e) {
      if (e.code === 409) console.log('⚠️  createdAt already exists')
      else throw e
    }

    console.log('\n✨ All attributes added!')
    console.log('⏳ Wait 30 seconds for Appwrite to process these attributes...')
    console.log('   Then run: npm run verify-curves')
    console.log('   Then run: npm run seed-curves')

  } catch (error) {
    console.error('❌ Error adding attributes:', error)
    process.exit(1)
  }
}

addCurveAttributes()
