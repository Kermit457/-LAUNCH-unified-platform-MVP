import { Client, Databases, ID, Query } from 'node-appwrite'
import 'dotenv/config'

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '')

const databases = new Databases(client)
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db'

const COLLECTIONS = {
  PROJECTS: 'projects',
  CLIPS: 'clips',
  CONTRIBUTORS: 'contributors',
  VOTES: 'votes',
  HOLDERS: 'holders',
  SOCIAL_LINKS: 'social_links',
  USERS: 'users'
}

// Sample data templates
const TEST_PROJECTS = [
  {
    type: 'token',
    title: 'SolPulse',
    subtitle: 'Real-time Solana analytics dashboard',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=solpulse',
    ticker: 'PULSE',
    status: 'live',
    beliefScore: 92,
    upvotes: 234,
    mintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    totalSupply: 1000000,
    websiteUrl: 'https://solpulse.io',
    twitterUrl: 'https://twitter.com/solpulse',
    telegramUrl: 'https://t.me/solpulse',
    githubUrl: 'https://github.com/solpulse',
    isExperimental: false,
    creatorTwitter: 'alexdev'
  },
  {
    type: 'token',
    title: 'MemeVault',
    subtitle: 'Community-driven meme token launchpad',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=memevault',
    ticker: 'MEME',
    status: 'live',
    beliefScore: 88,
    upvotes: 567,
    mintAddress: 'So11111111111111111111111111111111111111112',
    totalSupply: 10000000,
    websiteUrl: 'https://memevault.fun',
    twitterUrl: 'https://twitter.com/memevault',
    telegramUrl: 'https://t.me/memevault',
    isExperimental: false,
    creatorTwitter: 'cryptomemes'
  },
  {
    type: 'token',
    title: 'DeFi Nexus',
    subtitle: 'Next-gen liquidity aggregator',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=definexus',
    ticker: 'DNX',
    status: 'active',
    beliefScore: 95,
    upvotes: 891,
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    totalSupply: 500000,
    websiteUrl: 'https://definexus.io',
    twitterUrl: 'https://twitter.com/definexus',
    telegramUrl: 'https://t.me/definexus',
    githubUrl: 'https://github.com/definexus',
    isExperimental: false,
    creatorTwitter: 'defibuilder'
  },
  {
    type: 'nft',
    title: 'Cyber Punks Reborn',
    subtitle: 'Generative art meets utility',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=cyberpunks',
    ticker: 'CPR',
    status: 'live',
    beliefScore: 86,
    upvotes: 432,
    mintAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    totalSupply: 10000,
    websiteUrl: 'https://cyberpunksreborn.xyz',
    twitterUrl: 'https://twitter.com/cyberpunksreborn',
    telegramUrl: 'https://t.me/cyberpunks',
    isExperimental: false,
    creatorTwitter: 'nftartist'
  },
  {
    type: 'token',
    title: 'GameFi Protocol',
    subtitle: 'Decentralized gaming infrastructure',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=gamefi',
    ticker: 'GFP',
    status: 'active',
    beliefScore: 91,
    upvotes: 678,
    mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    totalSupply: 2000000,
    websiteUrl: 'https://gamefiprotocol.gg',
    twitterUrl: 'https://twitter.com/gamefiprotocol',
    telegramUrl: 'https://t.me/gamefi',
    githubUrl: 'https://github.com/gamefi',
    isExperimental: false,
    creatorTwitter: 'gamerdev'
  },
  {
    type: 'token',
    title: 'SolSwap V3',
    subtitle: 'Lightning-fast DEX with zero fees',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=solswap',
    ticker: 'SWAP',
    status: 'live',
    beliefScore: 94,
    upvotes: 1023,
    mintAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    totalSupply: 100000000,
    websiteUrl: 'https://solswap.io',
    twitterUrl: 'https://twitter.com/solswap',
    telegramUrl: 'https://t.me/solswap',
    githubUrl: 'https://github.com/solswap',
    isExperimental: false,
    creatorTwitter: 'dexbuilder'
  },
  {
    type: 'token',
    title: 'AI Agents',
    subtitle: 'Autonomous trading bots on Solana',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=aiagents',
    ticker: 'AGENT',
    status: 'experimental',
    beliefScore: 78,
    upvotes: 321,
    mintAddress: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
    totalSupply: 50000000,
    websiteUrl: 'https://aiagents.ai',
    twitterUrl: 'https://twitter.com/aiagents',
    isExperimental: true,
    creatorTwitter: 'airesearcher'
  },
  {
    type: 'nft',
    title: 'Metaverse Land',
    subtitle: 'Virtual real estate on Solana',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=metaverse',
    ticker: 'META',
    status: 'active',
    beliefScore: 84,
    upvotes: 556,
    mintAddress: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
    totalSupply: 50000,
    websiteUrl: 'https://metaverseland.world',
    twitterUrl: 'https://twitter.com/metaverseland',
    telegramUrl: 'https://t.me/metaverse',
    isExperimental: false,
    creatorTwitter: 'virtualarchitect'
  },
  {
    type: 'token',
    title: 'DAO Governance',
    subtitle: 'Decentralized voting infrastructure',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=daogov',
    ticker: 'GOV',
    status: 'live',
    beliefScore: 89,
    upvotes: 445,
    mintAddress: 'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6',
    totalSupply: 10000000,
    websiteUrl: 'https://daogovernance.org',
    twitterUrl: 'https://twitter.com/daogovernance',
    telegramUrl: 'https://t.me/daogov',
    githubUrl: 'https://github.com/daogov',
    isExperimental: false,
    creatorTwitter: 'daobuilder'
  },
  {
    type: 'token',
    title: 'Yield Optimizer',
    subtitle: 'Auto-compound your Solana yields',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=yieldopt',
    ticker: 'YIELD',
    status: 'active',
    beliefScore: 93,
    upvotes: 778,
    mintAddress: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    totalSupply: 5000000,
    websiteUrl: 'https://yieldoptimizer.fi',
    twitterUrl: 'https://twitter.com/yieldoptimizer',
    telegramUrl: 'https://t.me/yieldopt',
    githubUrl: 'https://github.com/yieldopt',
    isExperimental: false,
    creatorTwitter: 'yieldfarmer'
  },
  {
    type: 'token',
    title: 'Social Token',
    subtitle: 'Creator economy powered by Solana',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=socialtoken',
    ticker: 'SOCIAL',
    status: 'live',
    beliefScore: 87,
    upvotes: 612,
    mintAddress: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    totalSupply: 100000000,
    websiteUrl: 'https://socialtoken.app',
    twitterUrl: 'https://twitter.com/socialtoken',
    telegramUrl: 'https://t.me/socialtoken',
    isExperimental: false,
    creatorTwitter: 'creatoreconomy'
  },
  {
    type: 'token',
    title: 'Privacy Protocol',
    subtitle: 'Anonymous transactions on Solana',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=privacy',
    ticker: 'PRIV',
    status: 'experimental',
    beliefScore: 81,
    upvotes: 289,
    mintAddress: 'AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3',
    totalSupply: 21000000,
    websiteUrl: 'https://privacyprotocol.network',
    twitterUrl: 'https://twitter.com/privacyprotocol',
    githubUrl: 'https://github.com/privacy',
    isExperimental: true,
    creatorTwitter: 'cryptoprivacy'
  }
]

const SAMPLE_USERS = [
  { walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', displayName: 'Alex Developer', twitterHandle: 'alexdev', role: 'developer' },
  { walletAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', displayName: 'Crypto Memes', twitterHandle: 'cryptomemes', role: 'creator' },
  { walletAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', displayName: 'DeFi Builder', twitterHandle: 'defibuilder', role: 'developer' },
  { walletAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', displayName: 'NFT Artist', twitterHandle: 'nftartist', role: 'artist' },
  { walletAddress: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', displayName: 'Gamer Dev', twitterHandle: 'gamerdev', role: 'developer' },
  { walletAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', displayName: 'DEX Builder', twitterHandle: 'dexbuilder', role: 'developer' },
  { walletAddress: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE', displayName: 'AI Researcher', twitterHandle: 'airesearcher', role: 'researcher' },
  { walletAddress: 'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6', displayName: 'Virtual Architect', twitterHandle: 'virtualarchitect', role: 'creator' },
  { walletAddress: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn', displayName: 'DAO Builder', twitterHandle: 'daobuilder', role: 'developer' },
  { walletAddress: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt', displayName: 'Yield Farmer', twitterHandle: 'yieldfarmer', role: 'trader' },
  { walletAddress: 'AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3', displayName: 'Creator Economy', twitterHandle: 'creatoreconomy', role: 'creator' },
  { walletAddress: 'So11111111111111111111111111111111111111112', displayName: 'Crypto Privacy', twitterHandle: 'cryptoprivacy', role: 'researcher' }
]

const VIDEO_PLATFORMS = ['YouTube', 'TikTok', 'Twitter', 'Instagram']
const CLIP_TITLES = [
  'Project Launch Announcement',
  'Weekly Update #',
  'Community AMA Highlights',
  'Product Demo',
  'Behind the Scenes',
  'Tutorial: Getting Started',
  'Roadmap 2024',
  'Partnership Announcement',
  'Team Introduction',
  'Tokenomics Explained'
]

// Helper function to clear collection
async function clearCollection(collectionId) {
  try {
    const response = await databases.listDocuments(DB_ID, collectionId, [Query.limit(100)])
    for (const doc of response.documents) {
      await databases.deleteDocument(DB_ID, collectionId, doc.$id)
    }
    console.log(`   🗑️  Cleared ${response.documents.length} documents from ${collectionId}`)
  } catch (error) {
    console.log(`   ⏭️  Collection ${collectionId} is already empty or doesn't exist`)
  }
}

// Main seed function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n')

  // Step 1: Clear all collections
  console.log('📋 Step 1: Clearing existing data...')
  for (const collectionId of Object.values(COLLECTIONS)) {
    await clearCollection(collectionId)
  }
  console.log('✅ All collections cleared\n')

  // Step 2: Create users first
  console.log('📋 Step 2: Creating users...')
  const userIds = {}
  for (const user of SAMPLE_USERS) {
    try {
      const userId = ID.unique()
      const created = await databases.createDocument(
        DB_ID,
        COLLECTIONS.USERS,
        userId,
        {
          userId: userId,
          username: user.twitterHandle || user.displayName.toLowerCase().replace(/\s/g, '_'),
          ...user,
          roles: [user.role || 'member'],
          avatar: `https://unavatar.io/twitter/${user.twitterHandle}`,
          bio: `Building on Solana | ${user.role}`
        }
      )
      userIds[user.twitterHandle] = created.$id
      console.log(`   ✅ Created user: ${user.displayName}`)
    } catch (error) {
      console.log(`   ⚠️  Error creating user ${user.displayName}:`, error.message)
    }
  }
  console.log(`✅ Created ${Object.keys(userIds).length} users\n`)

  // Step 3: Create projects with all related data
  console.log('📋 Step 3: Creating projects with full data...')

  for (let i = 0; i < TEST_PROJECTS.length; i++) {
    const projectData = TEST_PROJECTS[i]
    const creatorHandle = projectData.creatorTwitter
    const creatorUserId = userIds[creatorHandle]
    const creator = SAMPLE_USERS.find(u => u.twitterHandle === creatorHandle)

    console.log(`\n   🚀 Creating project ${i + 1}/12: ${projectData.title}`)

    try {
      // Extract social URLs before creating project
      const { websiteUrl, twitterUrl, telegramUrl, githubUrl, ...projectFields } = projectData

      // Create project
      const project = await databases.createDocument(
        DB_ID,
        COLLECTIONS.PROJECTS,
        ID.unique(),
        {
          ...projectFields,
          creatorId: creatorUserId,
          creatorName: creator?.displayName || 'Anonymous',
          creatorAvatar: `https://unavatar.io/twitter/${creatorHandle}`
        }
      )
      console.log(`      ✅ Project created`)

      // Create social links (only include fields with values)
      const socialLinksData = { projectId: project.$id }
      if (websiteUrl) socialLinksData.website = websiteUrl
      if (twitterUrl) socialLinksData.twitter = twitterUrl
      // TODO: Add telegram once attribute is verified in Appwrite
      // if (telegramUrl) socialLinksData.telegram = telegramUrl
      if (githubUrl) socialLinksData.github = githubUrl

      await databases.createDocument(
        DB_ID,
        COLLECTIONS.SOCIAL_LINKS,
        ID.unique(),
        socialLinksData
      )
      console.log(`      ✅ Social links added`)

      // Add 3-5 clips per project
      const clipCount = 3 + Math.floor(Math.random() * 3)
      for (let c = 0; c < clipCount; c++) {
        const randomUser = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)]
        const clipId = ID.unique()
        const submitterId = userIds[randomUser.twitterHandle]
        const videoId = Math.random().toString(36).substring(7)
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.CLIPS,
          clipId,
          {
            clipId: clipId,
            projectId: project.$id,
            userId: submitterId,
            submittedBy: submitterId,
            clipUrl: `https://youtube.com/watch?v=${videoId}`,
            embedUrl: `https://youtube.com/embed/${videoId}`,
            title: `${CLIP_TITLES[c % CLIP_TITLES.length]}${c > 5 ? c - 5 : ''}`,
            description: `Check out this update about ${projectData.title}!`,
            views: Math.floor(Math.random() * 5000) + 500,
            likes: Math.floor(Math.random() * 500) + 50,
            comments: Math.floor(Math.random() * 100) + 5,
            shares: Math.floor(Math.random() * 50) + 2,
            clicks: Math.floor(Math.random() * 300) + 50,
            engagement: Math.floor(Math.random() * 80) + 20,  // Engagement score 20-100
            platform: VIDEO_PLATFORMS[Math.floor(Math.random() * VIDEO_PLATFORMS.length)],
            status: 'approved',
            approved: true
          }
        )
      }
      console.log(`      ✅ Added ${clipCount} clips`)

      // Add 4-8 contributors
      const contributorCount = 4 + Math.floor(Math.random() * 5)
      const selectedContributors = SAMPLE_USERS.sort(() => 0.5 - Math.random()).slice(0, contributorCount)

      for (const contributor of selectedContributors) {
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.CONTRIBUTORS,
          ID.unique(),
          {
            projectId: project.$id,
            userId: userIds[contributor.twitterHandle],
            name: contributor.displayName,
            avatar: `https://unavatar.io/twitter/${contributor.twitterHandle}`,
            twitterHandle: contributor.twitterHandle,
            twitterAvatar: `https://unavatar.io/twitter/${contributor.twitterHandle}`,
            role: contributor.role,
            joinedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
          }
        )
      }
      console.log(`      ✅ Added ${contributorCount} contributors`)

      // Add 10-50 key holders
      const holderCount = 10 + Math.floor(Math.random() * 40)
      for (let h = 0; h < holderCount; h++) {
        const randomWallet = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.HOLDERS,
          ID.unique(),
          {
            projectId: project.$id,
            walletAddress: randomWallet,
            amount: Math.random() * 10000,
            lastUpdated: new Date().toISOString()
          }
        )
      }
      console.log(`      ✅ Added ${holderCount} token holders`)

      // Add random votes (30-80% of users voting)
      const voteCount = Math.floor(SAMPLE_USERS.length * (0.3 + Math.random() * 0.5))
      const voters = SAMPLE_USERS.sort(() => 0.5 - Math.random()).slice(0, voteCount)

      for (const voter of voters) {
        const voteId = ID.unique()
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.VOTES,
          voteId,
          {
            voteId: voteId,
            launchId: project.$id,  // Same as projectId for compatibility
            projectId: project.$id,
            userId: userIds[voter.twitterHandle]
          }
        )
      }
      console.log(`      ✅ Added ${voteCount} votes`)

    } catch (error) {
      console.log(`      ❌ Error creating project: ${error.message}`)
    }
  }

  console.log('\n🎉 Database seeding completed successfully!\n')

  // Print summary
  console.log('📊 Summary:')
  console.log(`   Projects: ${TEST_PROJECTS.length}`)
  console.log(`   Users: ${SAMPLE_USERS.length}`)
  console.log(`   Clips: ~${TEST_PROJECTS.length * 4} (3-5 per project)`)
  console.log(`   Contributors: ~${TEST_PROJECTS.length * 6} (4-8 per project)`)
  console.log(`   Token Holders: ~${TEST_PROJECTS.length * 30} (10-50 per project)`)
  console.log(`   Votes: ~${TEST_PROJECTS.length * 6} (varies per project)`)
  console.log('\n✅ Your database is ready for testing!')
}

// Run the seed
seedDatabase().catch(error => {
  console.error('❌ Seeding failed:', error)
  process.exit(1)
})
