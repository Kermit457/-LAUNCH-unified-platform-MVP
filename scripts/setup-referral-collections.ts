import { Client, Databases, ID, Permission, Role } from 'node-appwrite'

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

const databases = new Databases(client)

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!

async function setupReferralCollections() {
  try {
    console.log('🚀 Setting up referral system collections...\n')

    // 1. Create Referrals Collection
    console.log('📋 Creating "referrals" collection...')
    try {
      await databases.createCollection(
        databaseId,
        'referrals',
        'Referrals',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      )
      console.log('✅ Referrals collection created')

      // Add attributes
      await databases.createStringAttribute(databaseId, 'referrals', 'referrerId', 255, false)
      await databases.createStringAttribute(databaseId, 'referrals', 'referredId', 255, true)
      await databases.createStringAttribute(databaseId, 'referrals', 'action', 50, true)
      await databases.createFloatAttribute(databaseId, 'referrals', 'grossAmount', true)
      await databases.createFloatAttribute(databaseId, 'referrals', 'reserveAmount', true)
      await databases.createFloatAttribute(databaseId, 'referrals', 'projectAmount', true)
      await databases.createFloatAttribute(databaseId, 'referrals', 'platformAmount', true)
      await databases.createFloatAttribute(databaseId, 'referrals', 'referralAmount', true)
      await databases.createStringAttribute(databaseId, 'referrals', 'projectId', 255, false)
      await databases.createStringAttribute(databaseId, 'referrals', 'timestamp', 255, true)

      // Wait for attributes to be created
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create indexes
      await databases.createIndex(databaseId, 'referrals', 'referrerId_idx', 'key', ['referrerId'])
      await databases.createIndex(databaseId, 'referrals', 'referredId_idx', 'key', ['referredId'])
      await databases.createIndex(databaseId, 'referrals', 'action_idx', 'key', ['action'])
      await databases.createIndex(databaseId, 'referrals', 'projectId_idx', 'key', ['projectId'])
      await databases.createIndex(databaseId, 'referrals', 'timestamp_idx', 'key', ['timestamp'], ['DESC'])

      console.log('✅ Referrals attributes and indexes created\n')
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  Referrals collection already exists\n')
      } else {
        throw error
      }
    }

    // 2. Create Referral Rewards Collection
    console.log('📋 Creating "referral_rewards" collection...')
    try {
      await databases.createCollection(
        databaseId,
        'referral_rewards',
        'Referral Rewards',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      )
      console.log('✅ Referral Rewards collection created')

      // Add attributes
      await databases.createStringAttribute(databaseId, 'referral_rewards', 'userId', 255, true)
      await databases.createStringAttribute(databaseId, 'referral_rewards', 'referralId', 255, true)
      await databases.createFloatAttribute(databaseId, 'referral_rewards', 'amount', true)
      await databases.createStringAttribute(databaseId, 'referral_rewards', 'type', 50, true)
      await databases.createEnumAttribute(databaseId, 'referral_rewards', 'status', ['pending', 'claimed', 'expired'], true)
      await databases.createStringAttribute(databaseId, 'referral_rewards', 'walletAddress', 255, false)
      await databases.createStringAttribute(databaseId, 'referral_rewards', 'createdAt', 255, true)
      await databases.createStringAttribute(databaseId, 'referral_rewards', 'claimedAt', 255, false)

      // Wait for attributes to be created
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create indexes
      await databases.createIndex(databaseId, 'referral_rewards', 'userId_idx', 'key', ['userId'])
      await databases.createIndex(databaseId, 'referral_rewards', 'referralId_idx', 'key', ['referralId'])
      await databases.createIndex(databaseId, 'referral_rewards', 'status_idx', 'key', ['status'])
      await databases.createIndex(databaseId, 'referral_rewards', 'createdAt_idx', 'key', ['createdAt'], ['DESC'])

      console.log('✅ Referral Rewards attributes and indexes created\n')
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  Referral Rewards collection already exists\n')
      } else {
        throw error
      }
    }

    // 3. Create Rewards Pools Collection
    console.log('📋 Creating "rewards_pools" collection...')
    try {
      await databases.createCollection(
        databaseId,
        'rewards_pools',
        'Rewards Pools',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      )
      console.log('✅ Rewards Pools collection created')

      // Add attributes
      await databases.createEnumAttribute(databaseId, 'rewards_pools', 'type', ['main', 'project', 'campaign'], true)
      await databases.createStringAttribute(databaseId, 'rewards_pools', 'projectId', 255, false)
      await databases.createFloatAttribute(databaseId, 'rewards_pools', 'balance', true, undefined, 0)
      await databases.createFloatAttribute(databaseId, 'rewards_pools', 'totalDeposited', true, undefined, 0)
      await databases.createFloatAttribute(databaseId, 'rewards_pools', 'totalDistributed', true, undefined, 0)
      await databases.createIntegerAttribute(databaseId, 'rewards_pools', 'totalContributors', true, undefined, undefined, 0)
      await databases.createStringAttribute(databaseId, 'rewards_pools', 'createdAt', 255, true)
      await databases.createStringAttribute(databaseId, 'rewards_pools', 'lastUpdated', 255, true)

      // Wait for attributes to be created
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create indexes
      await databases.createIndex(databaseId, 'rewards_pools', 'type_idx', 'key', ['type'])
      await databases.createIndex(databaseId, 'rewards_pools', 'projectId_idx', 'key', ['projectId'])
      await databases.createIndex(databaseId, 'rewards_pools', 'balance_idx', 'key', ['balance'], ['DESC'])

      console.log('✅ Rewards Pools attributes and indexes created\n')
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  Rewards Pools collection already exists\n')
      } else {
        throw error
      }
    }

    console.log('🎉 All referral collections setup complete!')
    console.log('\n📝 Collections created:')
    console.log('  • referrals')
    console.log('  • referral_rewards')
    console.log('  • rewards_pools')

  } catch (error) {
    console.error('❌ Error setting up collections:', error)
    process.exit(1)
  }
}

setupReferralCollections()
