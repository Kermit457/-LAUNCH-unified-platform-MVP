require('dotenv').config()
const { Client, Databases, ID } = require('node-appwrite')

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

async function seedCurveData() {
  try {
    console.log('🌱 Seeding curve data...\n')

    // Sample users
    const users = [
      { id: 'demo-user-123', name: 'Demo Creator' },
      { id: 'alice-456', name: 'Alice' },
      { id: 'bob-789', name: 'Bob' },
      { id: 'charlie-012', name: 'Charlie' }
    ]

    // 1. Create sample curves
    console.log('📊 Creating sample curves...')

    const curve1 = await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVES,
      ID.unique(),
      {
        ownerType: 'user',
        ownerId: users[0].id,
        state: 'active',
        price: 0.015,
        reserve: 5.5,
        supply: 50,
        holders: 3,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      }
    )
    console.log('✅ Created curve for', users[0].name)

    const curve2 = await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVES,
      ID.unique(),
      {
        ownerType: 'user',
        ownerId: users[1].id,
        state: 'active',
        price: 0.025,
        reserve: 12.3,
        supply: 120,
        holders: 8,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
      }
    )
    console.log('✅ Created curve for', users[1].name)

    const curve3 = await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVES,
      ID.unique(),
      {
        ownerType: 'user',
        ownerId: users[2].id,
        state: 'frozen',
        price: 0.035,
        reserve: 25.7,
        supply: 150,
        holders: 12,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
      }
    )
    console.log('✅ Created curve for', users[2].name, '(frozen)')

    const curve4 = await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVES,
      ID.unique(),
      {
        ownerType: 'project',
        ownerId: 'project-001',
        state: 'launched',
        price: 0.05,
        reserve: 50.0,
        supply: 200,
        holders: 25,
        tokenMint: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        launchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    )
    console.log('✅ Created curve for Project (launched)')

    // 2. Create sample events for curve1
    console.log('\n📝 Creating sample events...')

    // Buy events
    await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVE_EVENTS,
      ID.unique(),
      {
        curveId: curve1.$id,
        type: 'buy',
        amount: 1.5,
        price: 0.012,
        keys: 10,
        userId: users[1].id,
        reserveFee: 1.41,
        projectFee: 0.045,
        platformFee: 0.03,
        referralFee: 0.015,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    )

    await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVE_EVENTS,
      ID.unique(),
      {
        curveId: curve1.$id,
        type: 'buy',
        amount: 2.0,
        price: 0.013,
        keys: 15,
        userId: users[2].id,
        reserveFee: 1.88,
        projectFee: 0.06,
        platformFee: 0.04,
        referralFee: 0.02,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    )

    await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVE_EVENTS,
      ID.unique(),
      {
        curveId: curve1.$id,
        type: 'buy',
        amount: 2.5,
        price: 0.014,
        keys: 18,
        userId: users[3].id,
        reserveFee: 2.35,
        projectFee: 0.075,
        platformFee: 0.05,
        referralFee: 0.025,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    )

    // Sell event
    await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVE_EVENTS,
      ID.unique(),
      {
        curveId: curve1.$id,
        type: 'sell',
        amount: 0.8,
        price: 0.014,
        keys: 7,
        userId: users[1].id,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    )

    console.log('✅ Created 4 events for', users[0].name)

    // 3. Create sample holders for curve1
    console.log('\n👥 Creating sample holders...')

    await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVE_HOLDERS,
      ID.unique(),
      {
        curveId: curve1.$id,
        userId: users[1].id,
        balance: 3,
        avgPrice: 0.012,
        totalInvested: 0.7,
        realizedPnl: 0.1,
        unrealizedPnl: 0.045,
        firstBuyAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastTradeAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    )

    await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVE_HOLDERS,
      ID.unique(),
      {
        curveId: curve1.$id,
        userId: users[2].id,
        balance: 15,
        avgPrice: 0.013,
        totalInvested: 2.0,
        realizedPnl: 0,
        unrealizedPnl: 0.225,
        firstBuyAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastTradeAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    )

    await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVE_HOLDERS,
      ID.unique(),
      {
        curveId: curve1.$id,
        userId: users[3].id,
        balance: 18,
        avgPrice: 0.014,
        totalInvested: 2.5,
        realizedPnl: 0,
        unrealizedPnl: 0.27,
        firstBuyAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        lastTradeAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    )

    console.log('✅ Created 3 holders for', users[0].name)

    // 4. Create sample holders for curve2
    await databases.createDocument(
      databaseId,
      COLLECTIONS.CURVE_HOLDERS,
      ID.unique(),
      {
        curveId: curve2.$id,
        userId: users[0].id,
        balance: 25,
        avgPrice: 0.020,
        totalInvested: 5.0,
        realizedPnl: 0,
        unrealizedPnl: 0.625,
        firstBuyAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        lastTradeAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    )

    console.log('✅ Created holder for', users[1].name)

    // 5. Create a sample snapshot for frozen curve
    console.log('\n📸 Creating sample snapshot...')

    const holdersData = JSON.stringify([
      { address: users[0].id, balance: 50, percentage: 33.33 },
      { address: users[1].id, balance: 40, percentage: 26.67 },
      { address: users[2].id, balance: 35, percentage: 23.33 },
      { address: users[3].id, balance: 25, percentage: 16.67 }
    ])

    await databases.createDocument(
      databaseId,
      COLLECTIONS.SNAPSHOTS,
      ID.unique(),
      {
        curveId: curve3.$id,
        merkleRoot: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        holdersData: holdersData,
        totalSupply: 150,
        totalHolders: 12,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    )

    console.log('✅ Created snapshot for frozen curve')

    console.log('\n✨ Seeding complete!')
    console.log('\n📊 Summary:')
    console.log(`   • 4 curves created (1 active demo, 1 active, 1 frozen, 1 launched)`)
    console.log(`   • 4 events created`)
    console.log(`   • 4 holders created`)
    console.log(`   • 1 snapshot created`)
    console.log('\n🎯 You can now test the demo at /curve-demo')

  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seedCurveData()
