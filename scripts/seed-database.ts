import { Client, Databases, ID } from 'node-appwrite'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env') })

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

const databases = new Databases(client)
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!

// Collection IDs
const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  LAUNCHES: process.env.NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID!,
  CAMPAIGNS: process.env.NEXT_PUBLIC_APPWRITE_CAMPAIGNS_COLLECTION_ID!,
}

// Sample Users Data (matching actual schema)
const sampleUsers = [
  {
    userId: 'user_crypto_whale',
    username: 'crypto_whale',
    displayName: 'Crypto Whale',
    bio: 'DeFi maximalist | Building the future of finance',
    verified: false,
    conviction: 95,
    totalEarnings: 12500,
    roles: ['Trader', 'Investor'],
  },
  {
    userId: 'user_nft_creator',
    username: 'nft_creator',
    displayName: 'NFT Artist',
    bio: 'Digital artist creating unique NFT collections',
    verified: false,
    conviction: 88,
    totalEarnings: 8900,
    roles: ['Creator', 'Artist'],
  },
  {
    userId: 'user_degen_trader',
    username: 'degen_trader',
    displayName: 'Degen Trader',
    bio: 'High risk, high reward. WAGMI 🚀',
    verified: false,
    conviction: 72,
    totalEarnings: 3400,
    roles: ['Trader', 'Degen'],
  },
  {
    userId: 'user_streamer_pro',
    username: 'streamer_pro',
    displayName: 'StreamerPro',
    bio: 'Crypto streaming daily | Building in public',
    verified: false,
    conviction: 91,
    totalEarnings: 15600,
    roles: ['Streamer', 'Creator'],
  },
  {
    userId: 'user_dev_builder',
    username: 'dev_builder',
    displayName: 'Dev Builder',
    bio: 'Full-stack developer | Solana ecosystem',
    verified: false,
    conviction: 94,
    totalEarnings: 22100,
    roles: ['Developer', 'Builder'],
  },
]

// Sample Launches Data (matching actual schema with launchId, scope, status, etc.)
const sampleLaunches = [
  {
    launchId: 'launch_solpump',
    scope: 'ICM',
    status: 'LIVE',
    title: 'SolPump',
    subtitle: 'Community-driven memecoin on Solana with innovative tokenomics',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=PUMP&backgroundColor=14f195',
    mint: 'So11111111111111111111111111111111111112',
    convictionPct: 87,
    commentsCount: 156,
    upvotes: 892,
    createdBy: 'user_crypto_whale',
  },
  {
    launchId: 'launch_defi',
    scope: 'ICM',
    status: 'LIVE',
    title: 'DeFi Protocol',
    subtitle: 'Next-gen DeFi protocol with automated yield strategies',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=DEFI&backgroundColor=2775ca',
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    convictionPct: 92,
    commentsCount: 342,
    upvotes: 1567,
    createdBy: 'user_dev_builder',
  },
  {
    launchId: 'launch_gamefi',
    scope: 'ICM',
    status: 'LIVE',
    title: 'GameFi Arena',
    subtitle: 'Play-to-earn gaming ecosystem with real rewards',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=ARENA&backgroundColor=ff6b00',
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    convictionPct: 79,
    commentsCount: 234,
    upvotes: 1023,
    createdBy: 'user_nft_creator',
  },
  {
    launchId: 'launch_aibot',
    scope: 'ICM',
    status: 'UPCOMING',
    title: 'AI Trading Bot',
    subtitle: 'AI-powered trading automation for crypto markets',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=AIBOT&backgroundColor=8b5cf6',
    convictionPct: 85,
    commentsCount: 89,
    upvotes: 456,
    tgeAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    createdBy: 'user_degen_trader',
  },
  {
    launchId: 'launch_launchos',
    scope: 'CCM',
    status: 'LIVE',
    title: 'LaunchOS Platform',
    subtitle: 'The engine of the internet capital market - LaunchOS native token',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=LOS&backgroundColor=ec4899',
    convictionPct: 96,
    commentsCount: 678,
    upvotes: 3421,
    createdBy: 'user_streamer_pro',
  },
]

// Sample Campaigns Data (matching actual schema with campaignId, ratePerThousand, etc.)
const sampleCampaigns = [
  {
    campaignId: 'campaign_tiktok',
    title: 'Create Viral TikTok Content',
    description: 'Create engaging TikTok videos showcasing our DeFi protocol. Best performing videos win!',
    createdBy: 'user_dev_builder',
    status: 'live',
    ratePerThousand: 25.0,
    budgetTotal: 5000,
    budgetPaid: 1200,
    platforms: ['tiktok', 'youtube'],
    clipDurationMin: 30,
    clipDurationMax: 180,
    views: 45000,
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    campaignId: 'campaign_twitter_raid',
    title: 'Twitter Raid - New Launch',
    description: 'Help us spread the word about our new token launch. Retweet, like, and engage!',
    createdBy: 'user_crypto_whale',
    status: 'live',
    ratePerThousand: 15.0,
    budgetTotal: 2500,
    budgetPaid: 800,
    platforms: ['twitter'],
    views: 123000,
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    campaignId: 'campaign_airdrop',
    title: 'Community Airdrop - Early Supporters',
    description: 'Rewarding our early supporters with exclusive airdrops. Complete tasks to qualify.',
    createdBy: 'user_streamer_pro',
    status: 'live',
    ratePerThousand: 10.0,
    budgetTotal: 10000,
    budgetPaid: 0,
    platforms: ['twitter', 'discord', 'telegram'],
    views: 567000,
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    campaignId: 'campaign_bugbounty',
    title: 'Bug Bounty Program',
    description: 'Find and report security vulnerabilities in our smart contracts. High rewards for critical bugs.',
    createdBy: 'user_dev_builder',
    status: 'live',
    ratePerThousand: 100.0,
    budgetTotal: 25000,
    budgetPaid: 5000,
    platforms: ['github', 'discord'],
    views: 23000,
    endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    campaignId: 'campaign_meme',
    title: 'Meme Contest - Best GameFi Meme',
    description: 'Create the funniest GameFi meme! Top 10 memes win prizes.',
    createdBy: 'user_nft_creator',
    status: 'live',
    ratePerThousand: 5.0,
    budgetTotal: 1500,
    budgetPaid: 500,
    platforms: ['twitter', 'reddit'],
    views: 89000,
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n')

  try {
    // Seed Users
    console.log('👥 Creating sample users...')
    for (const userData of sampleUsers) {
      try {
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.USERS,
          ID.unique(),
          userData
        )
        console.log(`✅ Created user: @${userData.username}`)
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`⚠️  User @${userData.username} already exists`)
        } else {
          console.error(`❌ Error creating user @${userData.username}:`, error.message)
        }
      }
    }

    // Seed Launches
    console.log('\n🚀 Creating sample launches...')
    for (const launchData of sampleLaunches) {
      try {
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.LAUNCHES,
          ID.unique(),
          launchData
        )
        console.log(`✅ Created launch: ${launchData.title}`)
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`⚠️  Launch ${launchData.title} already exists`)
        } else {
          console.error(`❌ Error creating launch ${launchData.title}:`, error.message)
        }
      }
    }

    // Seed Campaigns
    console.log('\n📢 Creating sample campaigns...')
    for (const campaignData of sampleCampaigns) {
      try {
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.CAMPAIGNS,
          ID.unique(),
          campaignData
        )
        console.log(`✅ Created campaign: ${campaignData.title}`)
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`⚠️  Campaign ${campaignData.title} already exists`)
        } else {
          console.error(`❌ Error creating campaign ${campaignData.title}:`, error.message)
        }
      }
    }

    console.log('\n✨ Database seeding complete!')
    console.log('\n📊 Summary:')
    console.log(`   Users: ${sampleUsers.length}`)
    console.log(`   Launches: ${sampleLaunches.length}`)
    console.log(`   Campaigns: ${sampleCampaigns.length}`)
    console.log('\n🎉 Your database is now populated with sample data!')
    console.log('\n🔗 Check it out:')
    console.log('   - Discover: http://localhost:3002/discover')
    console.log('   - Earn: http://localhost:3002/earn')
    console.log('   - Network: http://localhost:3002/network')

  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run the seed
seedDatabase()
