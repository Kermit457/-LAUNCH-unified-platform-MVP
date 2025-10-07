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
  QUESTS: process.env.NEXT_PUBLIC_APPWRITE_QUESTS_COLLECTION_ID!,
  NETWORK_INVITES: process.env.NEXT_PUBLIC_APPWRITE_NETWORK_INVITES_COLLECTION_ID || '',
  NETWORK_CONNECTIONS: process.env.NEXT_PUBLIC_APPWRITE_NETWORK_CONNECTIONS_COLLECTION_ID || '',
}

// Sample Users Data (matching actual Appwrite schema)
const sampleUsers = [
  {
    userId: 'user_crypto_whale',
    username: 'crypto_whale',
    displayName: 'Crypto Whale 🐋',
    bio: 'DeFi maximalist | Building the future of finance | #Web3',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cryptowhale&backgroundColor=b6e3f4',
    verified: true,
    conviction: 95,
    totalEarnings: 12500,
    roles: ['Trader', 'Investor', 'Alpha'],
  },
  {
    userId: 'user_nft_creator',
    username: 'nft_creator',
    displayName: 'NFT Artist',
    bio: 'Digital artist creating unique NFT collections | 1/1 art 🎨',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nftcreator&backgroundColor=ffd5dc',
    verified: false,
    conviction: 88,
    totalEarnings: 8900,
    roles: ['Creator', 'Artist'],
  },
  {
    userId: 'user_degen_trader',
    username: 'degen_trader',
    displayName: 'Degen Trader',
    bio: 'High risk, high reward. WAGMI 🚀 | Not financial advice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=degentrader&backgroundColor=c0aede',
    verified: false,
    conviction: 72,
    totalEarnings: 3400,
    roles: ['Trader', 'Degen'],
  },
  {
    userId: 'user_streamer_pro',
    username: 'streamer_pro',
    displayName: 'StreamerPro 🎮',
    bio: 'Crypto streaming daily | Building in public | Solana maxi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=streamerpro&backgroundColor=d1d4f9',
    verified: true,
    conviction: 91,
    totalEarnings: 15600,
    roles: ['Streamer', 'Creator'],
  },
  {
    userId: 'user_dev_builder',
    username: 'dev_builder',
    displayName: 'Dev Builder',
    bio: 'Full-stack developer | Solana ecosystem | Open source contributor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devbuilder&backgroundColor=ffdfbf',
    verified: true,
    conviction: 94,
    totalEarnings: 22100,
    roles: ['Developer', 'Builder'],
  },
  {
    userId: 'user_alpha_hunter',
    username: 'alpha_hunter',
    displayName: 'Alpha Hunter 🎯',
    bio: 'On-chain alpha | Early caller | 100x hunter | Follow for gems 💎',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alphahunter&backgroundColor=b6e3f4',
    verified: true,
    conviction: 97,
    totalEarnings: 45000,
    roles: ['Alpha', 'Trader', 'Influencer'],
  },
  {
    userId: 'user_meme_queen',
    username: 'meme_queen',
    displayName: 'Meme Queen 👑',
    bio: 'Memecoin enthusiast | Creating viral content | Community first 🔥',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=memequeen&backgroundColor=ffd5dc',
    verified: false,
    conviction: 68,
    totalEarnings: 5600,
    roles: ['Creator', 'Degen', 'Entertainer'],
  },
  {
    userId: 'user_yield_farmer',
    username: 'yield_farmer',
    displayName: 'Yield Farmer 🌾',
    bio: 'DeFi yield optimization | LP strategies | Teaching sustainable farming',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yieldfarmer&backgroundColor=c0aede',
    verified: false,
    conviction: 85,
    totalEarnings: 18900,
    roles: ['Trader', 'Educator'],
  },
  {
    userId: 'user_nft_flipper',
    username: 'nft_flipper',
    displayName: 'NFT Flipper',
    bio: 'NFT trader | Floor sweeper | Rare trait hunter | Up only 📈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nftflipper&backgroundColor=d1d4f9',
    verified: false,
    conviction: 76,
    totalEarnings: 12300,
    roles: ['Trader', 'Collector'],
  },
  {
    userId: 'user_web3_designer',
    username: 'web3_designer',
    displayName: 'Web3 Designer ✨',
    bio: 'UI/UX for Web3 | Building beautiful dApps | Design system enthusiast',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=web3designer&backgroundColor=ffdfbf',
    verified: false,
    conviction: 82,
    totalEarnings: 9800,
    roles: ['Creator', 'Designer'],
  },
  {
    userId: 'user_dao_coordinator',
    username: 'dao_coordinator',
    displayName: 'DAO Coordinator',
    bio: 'Governance expert | Community organizer | Decentralization advocate',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daocoordinator&backgroundColor=b6e3f4',
    verified: true,
    conviction: 89,
    totalEarnings: 14200,
    roles: ['Manager', 'Organizer'],
  },
  {
    userId: 'user_clipper_king',
    username: 'clipper_king',
    displayName: 'Clipper King 🎬',
    bio: 'Creating viral clips | Stream highlights | Video editor | 10M+ views',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=clipperking&backgroundColor=ffd5dc',
    verified: false,
    conviction: 73,
    totalEarnings: 7800,
    roles: ['Clipper', 'Editor', 'Creator'],
  },
  {
    userId: 'user_protocol_researcher',
    username: 'protocol_researcher',
    displayName: 'Protocol Researcher 🔬',
    bio: 'Deep diving into protocols | Security auditor | Smart contract analyst',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=protocolresearcher&backgroundColor=c0aede',
    verified: true,
    conviction: 96,
    totalEarnings: 31500,
    roles: ['Researcher', 'Developer'],
  },
  {
    userId: 'user_social_raider',
    username: 'social_raider',
    displayName: 'Social Raider ⚡',
    bio: 'Community raids | Engagement farming | Growth hacker | Let\'s grow together',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=socialraider&backgroundColor=d1d4f9',
    verified: false,
    conviction: 65,
    totalEarnings: 4200,
    roles: ['Raider', 'Marketer'],
  },
  {
    userId: 'user_project_launcher',
    username: 'project_launcher',
    displayName: 'Project Launcher 🚀',
    bio: 'Serial entrepreneur | 5 successful launches | Building the next unicorn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=projectlauncher&backgroundColor=ffdfbf',
    verified: true,
    conviction: 92,
    totalEarnings: 67800,
    roles: ['Project', 'Founder', 'Builder'],
  },
]

// Sample Launches Data (matching Appwrite Launch schema)
const sampleLaunches = [
  {
    launchId: 'launch_solpump',
    scope: 'ICM',
    title: 'SolPump',
    subtitle: 'Community-driven memecoin on Solana',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=PUMP&backgroundColor=14f195',
    createdBy: 'user_crypto_whale',
    convictionPct: 87,
    commentsCount: 0,
    upvotes: 0,
    contributionPoolPct: 2,
    feesSharePct: 10,
    status: 'live',
  },
  {
    launchId: 'launch_defi',
    scope: 'ICM',
    title: 'DeFi Protocol',
    subtitle: 'Next-gen DeFi with automated yield strategies',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=DEFI&backgroundColor=2775ca',
    createdBy: 'user_dev_builder',
    convictionPct: 92,
    commentsCount: 0,
    upvotes: 0,
    contributionPoolPct: 5,
    feesSharePct: 15,
    status: 'live',
  },
  {
    launchId: 'launch_gamefi',
    scope: 'ICM',
    title: 'GameFi Arena',
    subtitle: 'Play-to-earn gaming ecosystem with real rewards',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=ARENA&backgroundColor=ff6b00',
    createdBy: 'user_nft_creator',
    convictionPct: 79,
    commentsCount: 0,
    upvotes: 0,
    contributionPoolPct: 3,
    feesSharePct: 20,
    status: 'live',
  },
  {
    launchId: 'launch_aibot',
    scope: 'ICM',
    title: 'AI Trading Bot',
    subtitle: 'AI-powered trading automation for crypto markets',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=AIBOT&backgroundColor=8b5cf6',
    createdBy: 'user_degen_trader',
    convictionPct: 85,
    commentsCount: 0,
    upvotes: 0,
    contributionPoolPct: 1,
    feesSharePct: 5,
    status: 'upcoming',
  },
  {
    launchId: 'launch_launchos',
    scope: 'CCM',
    title: 'LaunchOS Platform',
    subtitle: 'The engine of the internet capital market',
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=LOS&backgroundColor=ec4899',
    createdBy: 'user_streamer_pro',
    convictionPct: 96,
    commentsCount: 0,
    upvotes: 0,
    contributionPoolPct: 3,
    feesSharePct: 25,
    status: 'live',
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

// Sample Quests Data (raids and bounties)
const sampleQuests = [
  // RAIDS
  {
    questId: 'quest_raid_twitter',
    type: 'raid',
    title: 'Twitter Engagement Raid',
    description: 'Help us reach 10K followers! Like, retweet, and engage with our content for rewards.',
    createdBy: 'user_social_raider',
    status: 'live',
    budgetTotal: 1500,
    budgetPaid: 0,
    poolAmount: 1500,
    platforms: ['twitter'],
  },
  {
    questId: 'quest_raid_discord',
    type: 'raid',
    title: 'Discord Community Raid',
    description: 'Join our Discord and help us grow to 5K members. Invite friends and be active!',
    createdBy: 'user_dao_coordinator',
    status: 'live',
    budgetTotal: 2000,
    budgetPaid: 0,
    poolAmount: 2000,
    platforms: ['discord'],
  },
  {
    questId: 'quest_raid_youtube',
    type: 'raid',
    title: 'YouTube Subscribe Raid',
    description: 'Subscribe to our channel and watch our latest video for a share of the pool!',
    createdBy: 'user_streamer_pro',
    status: 'live',
    budgetTotal: 1000,
    budgetPaid: 0,
    poolAmount: 1000,
    platforms: ['youtube'],
  },

  // BOUNTIES
  {
    questId: 'quest_bounty_content',
    type: 'bounty',
    title: 'Content Creation Bounty',
    description: 'Create educational content about our DeFi protocol. Articles, videos, or threads welcome!',
    createdBy: 'user_dev_builder',
    status: 'live',
    budgetTotal: 5000,
    budgetPaid: 0,
    poolAmount: 5000,
    platforms: ['twitter', 'youtube', 'medium'],
  },
  {
    questId: 'quest_bounty_design',
    type: 'bounty',
    title: 'Logo Design Bounty',
    description: 'Design a new logo for our upcoming NFT collection. Best design wins $500 USDC!',
    createdBy: 'user_nft_creator',
    status: 'live',
    budgetTotal: 500,
    budgetPaid: 0,
    poolAmount: 500,
    platforms: ['behance', 'dribbble'],
  },
  {
    questId: 'quest_bounty_translation',
    type: 'bounty',
    title: 'Documentation Translation',
    description: 'Translate our docs to Spanish, French, or Chinese. $50 per language!',
    createdBy: 'user_project_launcher',
    status: 'live',
    budgetTotal: 300,
    budgetPaid: 0,
    poolAmount: 300,
    platforms: ['github'],
  },
  {
    questId: 'quest_bounty_security',
    type: 'bounty',
    title: 'Smart Contract Audit Bounty',
    description: 'Find bugs in our smart contracts. Critical bugs pay up to $10K!',
    createdBy: 'user_protocol_researcher',
    status: 'live',
    budgetTotal: 15000,
    budgetPaid: 0,
    poolAmount: 15000,
    platforms: ['github'],
  },
]

// Sample Network Invites (pending connection requests)
const sampleNetworkInvites = [
  {
    inviteId: 'invite_1',
    senderId: 'user_alpha_hunter',
    receiverId: 'user_crypto_whale',
    message: 'Hey! Love your DeFi insights. Let\'s connect and share alpha!',
    status: 'pending',
  },
  {
    inviteId: 'invite_2',
    senderId: 'user_dao_coordinator',
    receiverId: 'user_dev_builder',
    message: 'We need your expertise for our DAO governance implementation!',
    status: 'pending',
  },
  {
    inviteId: 'invite_3',
    senderId: 'user_clipper_king',
    receiverId: 'user_streamer_pro',
    message: 'Want to collab on some viral clips? I think we could create something amazing!',
    status: 'pending',
  },
  {
    inviteId: 'invite_4',
    senderId: 'user_meme_queen',
    receiverId: 'user_nft_creator',
    message: 'Your art is incredible! Let\'s create some meme NFTs together!',
    status: 'pending',
  },
]

// Sample Network Connections (accepted connections)
const sampleNetworkConnections = [
  {
    connectionId: 'conn_1',
    userId1: 'user_crypto_whale',
    userId2: 'user_dev_builder',
    connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    connectionId: 'conn_2',
    userId1: 'user_streamer_pro',
    userId2: 'user_nft_creator',
    connectedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    connectionId: 'conn_3',
    userId1: 'user_alpha_hunter',
    userId2: 'user_protocol_researcher',
    connectedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    connectionId: 'conn_4',
    userId1: 'user_dev_builder',
    userId2: 'user_protocol_researcher',
    connectedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    connectionId: 'conn_5',
    userId1: 'user_project_launcher',
    userId2: 'user_dao_coordinator',
    connectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    connectionId: 'conn_6',
    userId1: 'user_yield_farmer',
    userId2: 'user_crypto_whale',
    connectedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    connectionId: 'conn_7',
    userId1: 'user_nft_flipper',
    userId2: 'user_nft_creator',
    connectedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    connectionId: 'conn_8',
    userId1: 'user_web3_designer',
    userId2: 'user_project_launcher',
    connectedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
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

    // Seed Quests (raids and bounties)
    console.log('\n🎯 Creating sample quests (raids & bounties)...')
    for (const questData of sampleQuests) {
      try {
        await databases.createDocument(
          DB_ID,
          COLLECTIONS.QUESTS,
          ID.unique(),
          questData
        )
        console.log(`✅ Created ${questData.type}: ${questData.title}`)
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`⚠️  Quest ${questData.title} already exists`)
        } else {
          console.error(`❌ Error creating quest ${questData.title}:`, error.message)
        }
      }
    }

    // Seed Network Invites (if collection exists)
    if (COLLECTIONS.NETWORK_INVITES) {
      console.log('\n💌 Creating network invites...')
      for (const inviteData of sampleNetworkInvites) {
        try {
          await databases.createDocument(
            DB_ID,
            COLLECTIONS.NETWORK_INVITES,
            ID.unique(),
            inviteData
          )
          console.log(`✅ Created invite: ${inviteData.senderId} → ${inviteData.receiverId}`)
        } catch (error: any) {
          if (error.code === 409) {
            console.log(`⚠️  Invite already exists`)
          } else {
            console.error(`❌ Error creating invite:`, error.message)
          }
        }
      }
    } else {
      console.log('\n⚠️  Skipping network invites (collection not configured)')
    }

    // Seed Network Connections (if collection exists)
    if (COLLECTIONS.NETWORK_CONNECTIONS) {
      console.log('\n🤝 Creating network connections...')
      for (const connectionData of sampleNetworkConnections) {
        try {
          await databases.createDocument(
            DB_ID,
            COLLECTIONS.NETWORK_CONNECTIONS,
            ID.unique(),
            connectionData
          )
          console.log(`✅ Created connection: ${connectionData.userId1} ↔ ${connectionData.userId2}`)
        } catch (error: any) {
          if (error.code === 409) {
            console.log(`⚠️  Connection already exists`)
          } else {
            console.error(`❌ Error creating connection:`, error.message)
          }
        }
      }
    } else {
      console.log('\n⚠️  Skipping network connections (collection not configured)')
    }

    console.log('\n✨ Database seeding complete!')
    console.log('\n📊 Summary:')
    console.log(`   Users: ${sampleUsers.length}`)
    console.log(`   Launches: ${sampleLaunches.length}`)
    console.log(`   Campaigns: ${sampleCampaigns.length}`)
    console.log(`   Quests: ${sampleQuests.length} (${sampleQuests.filter(q => q.type === 'raid').length} raids, ${sampleQuests.filter(q => q.type === 'bounty').length} bounties)`)
    console.log(`   Network Invites: ${COLLECTIONS.NETWORK_INVITES ? sampleNetworkInvites.length : 0}`)
    console.log(`   Network Connections: ${COLLECTIONS.NETWORK_CONNECTIONS ? sampleNetworkConnections.length : 0}`)
    console.log('\n🎉 Your database is now populated with sample data!')
    console.log('\n🔗 Check it out:')
    console.log('   - Discover: http://localhost:3001/discover')
    console.log('   - Earn: http://localhost:3001/earn')
    console.log('   - Network: http://localhost:3001/network')
    console.log('   - Dashboard: http://localhost:3001/dashboard')

  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run the seed
seedDatabase()
