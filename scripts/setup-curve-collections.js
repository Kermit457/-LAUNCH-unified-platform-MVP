require('dotenv').config()
const { Client, Databases, ID, Permission, Role } = require('node-appwrite')

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const databases = new Databases(client)
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function setupCurveCollections() {
  try {
    console.log('🚀 Setting up Curve system collections...\n')

    // 1. Create Curves Collection
    console.log('📋 Creating "curves" collection...')
    try {
      await databases.createCollection(
        databaseId,
        'curves',
        'Curves',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      )
      console.log('✅ Curves collection created')

      // Add attributes
      await databases.createEnumAttribute(databaseId, 'curves', 'ownerType', ['user', 'project'], true)
      await databases.createStringAttribute(databaseId, 'curves', 'ownerId', 255, true)
      await databases.createEnumAttribute(databaseId, 'curves', 'state', ['active', 'frozen', 'launched', 'utility'], true)
      await databases.createFloatAttribute(databaseId, 'curves', 'price', true)
      await databases.createFloatAttribute(databaseId, 'curves', 'reserve', true)
      await databases.createFloatAttribute(databaseId, 'curves', 'supply', true)
      await databases.createIntegerAttribute(databaseId, 'curves', 'holders', true)
      await databases.createFloatAttribute(databaseId, 'curves', 'volume24h', false, 0)
      await databases.createFloatAttribute(databaseId, 'curves', 'volumeTotal', false, 0)
      await databases.createFloatAttribute(databaseId, 'curves', 'marketCap', false, 0)
      await databases.createStringAttribute(databaseId, 'curves', 'tokenMint', 255, false)
      await databases.createStringAttribute(databaseId, 'curves', 'launchedAt', 255, false)
      await databases.createStringAttribute(databaseId, 'curves', 'createdAt', 255, true)

      console.log('⏳ Waiting for attributes...')
      await sleep(3000)

      // Create indexes
      console.log('📑 Creating indexes...')
      await databases.createIndex(databaseId, 'curves', 'ownerType_idx', 'key', ['ownerType'])
      await databases.createIndex(databaseId, 'curves', 'ownerId_idx', 'key', ['ownerId'])
      await databases.createIndex(databaseId, 'curves', 'state_idx', 'key', ['state'])
      await databases.createIndex(databaseId, 'curves', 'price_idx', 'key', ['price'], ['DESC'])
      await databases.createIndex(databaseId, 'curves', 'holders_idx', 'key', ['holders'], ['DESC'])
      await databases.createIndex(databaseId, 'curves', 'volume24h_idx', 'key', ['volume24h'], ['DESC'])

      console.log('✅ Curves collection setup complete\n')
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Curves collection already exists\n')
      } else {
        throw error
      }
    }

    // 2. Create Curve Events Collection
    console.log('📋 Creating "curve_events" collection...')
    try {
      await databases.createCollection(
        databaseId,
        'curve_events',
        'Curve Events',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      )
      console.log('✅ Curve Events collection created')

      // Add attributes
      await databases.createStringAttribute(databaseId, 'curve_events', 'curveId', 255, true)
      await databases.createEnumAttribute(databaseId, 'curve_events', 'type', ['buy', 'sell', 'freeze', 'launch'], true)
      await databases.createFloatAttribute(databaseId, 'curve_events', 'amount', true)
      await databases.createFloatAttribute(databaseId, 'curve_events', 'price', true)
      await databases.createFloatAttribute(databaseId, 'curve_events', 'keys', false)
      await databases.createStringAttribute(databaseId, 'curve_events', 'userId', 255, true)
      await databases.createStringAttribute(databaseId, 'curve_events', 'referrerId', 255, false)
      await databases.createFloatAttribute(databaseId, 'curve_events', 'reserveFee', false)
      await databases.createFloatAttribute(databaseId, 'curve_events', 'projectFee', false)
      await databases.createFloatAttribute(databaseId, 'curve_events', 'platformFee', false)
      await databases.createFloatAttribute(databaseId, 'curve_events', 'referralFee', false)
      await databases.createStringAttribute(databaseId, 'curve_events', 'txHash', 255, false)
      await databases.createStringAttribute(databaseId, 'curve_events', 'timestamp', 255, true)

      console.log('⏳ Waiting for attributes...')
      await sleep(3000)

      // Create indexes
      console.log('📑 Creating indexes...')
      await databases.createIndex(databaseId, 'curve_events', 'curveId_idx', 'key', ['curveId'])
      await databases.createIndex(databaseId, 'curve_events', 'type_idx', 'key', ['type'])
      await databases.createIndex(databaseId, 'curve_events', 'userId_idx', 'key', ['userId'])
      await databases.createIndex(databaseId, 'curve_events', 'timestamp_idx', 'key', ['timestamp'], ['DESC'])

      console.log('✅ Curve Events collection setup complete\n')
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Curve Events collection already exists\n')
      } else {
        throw error
      }
    }

    // 3. Create Curve Holders Collection
    console.log('📋 Creating "curve_holders" collection...')
    try {
      await databases.createCollection(
        databaseId,
        'curve_holders',
        'Curve Holders',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      )
      console.log('✅ Curve Holders collection created')

      // Add attributes
      await databases.createStringAttribute(databaseId, 'curve_holders', 'curveId', 255, true)
      await databases.createStringAttribute(databaseId, 'curve_holders', 'userId', 255, true)
      await databases.createFloatAttribute(databaseId, 'curve_holders', 'balance', true)
      await databases.createFloatAttribute(databaseId, 'curve_holders', 'avgPrice', false, 0)
      await databases.createFloatAttribute(databaseId, 'curve_holders', 'totalInvested', false, 0)
      await databases.createFloatAttribute(databaseId, 'curve_holders', 'realizedPnl', false, 0)
      await databases.createFloatAttribute(databaseId, 'curve_holders', 'unrealizedPnl', false, 0)
      await databases.createStringAttribute(databaseId, 'curve_holders', 'firstBuyAt', 255, true)
      await databases.createStringAttribute(databaseId, 'curve_holders', 'lastTradeAt', 255, true)

      console.log('⏳ Waiting for attributes...')
      await sleep(3000)

      // Create indexes
      console.log('📑 Creating indexes...')
      await databases.createIndex(databaseId, 'curve_holders', 'curveId_idx', 'key', ['curveId'])
      await databases.createIndex(databaseId, 'curve_holders', 'userId_idx', 'key', ['userId'])
      await databases.createIndex(databaseId, 'curve_holders', 'balance_idx', 'key', ['balance'], ['DESC'])
      await databases.createIndex(databaseId, 'curve_holders', 'composite_idx', 'key', ['curveId', 'userId'])

      console.log('✅ Curve Holders collection setup complete\n')
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Curve Holders collection already exists\n')
      } else {
        throw error
      }
    }

    // 4. Create Snapshots Collection
    console.log('📋 Creating "snapshots" collection...')
    try {
      await databases.createCollection(
        databaseId,
        'snapshots',
        'Snapshots',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      )
      console.log('✅ Snapshots collection created')

      // Add attributes
      await databases.createStringAttribute(databaseId, 'snapshots', 'curveId', 255, true)
      await databases.createStringAttribute(databaseId, 'snapshots', 'merkleRoot', 255, true)
      await databases.createStringAttribute(databaseId, 'snapshots', 'holdersData', 100000, true) // JSON stored as string
      await databases.createFloatAttribute(databaseId, 'snapshots', 'totalSupply', true)
      await databases.createIntegerAttribute(databaseId, 'snapshots', 'totalHolders', true)
      await databases.createStringAttribute(databaseId, 'snapshots', 'createdAt', 255, true)

      console.log('⏳ Waiting for attributes...')
      await sleep(3000)

      // Create indexes
      console.log('📑 Creating indexes...')
      await databases.createIndex(databaseId, 'snapshots', 'curveId_idx', 'key', ['curveId'])
      await databases.createIndex(databaseId, 'snapshots', 'createdAt_idx', 'key', ['createdAt'], ['DESC'])

      console.log('✅ Snapshots collection setup complete\n')
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Snapshots collection already exists\n')
      } else {
        throw error
      }
    }

    console.log('🎉 All Curve collections setup complete!')
    console.log('\n📝 Collections created:')
    console.log('   • curves - Main curve data')
    console.log('   • curve_events - Trade history')
    console.log('   • curve_holders - Holder balances')
    console.log('   • snapshots - Launch snapshots')
    console.log('\n✅ Ready for bonding curve implementation!')

  } catch (error) {
    console.error('❌ Error setting up collections:', error)
    process.exit(1)
  }
}

setupCurveCollections()