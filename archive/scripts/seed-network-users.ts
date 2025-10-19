import { Client, Databases, ID } from 'node-appwrite'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

const databases = new Databases(client)

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users'

const testUsers = [
  {
    userId: 'user_alpha_hunter_001',
    username: 'alpha_hunter',
    displayName: 'Alpha Hunter',
    bio: 'On-chain alpha | Early caller | 100x hunter | Follow for gems 💎',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alpha',
    verified: true,
    conviction: 850,
    totalEarnings: 12500,
    roles: ['Alpha', 'Trader', 'Influencer'],
    walletAddress: '0x1234567890123456789012345678901234567890',
    twitter: 'alphahunter',
    discord: 'AlphaHunter#1337',
    website: 'https://alphacalls.io',
    instagram: 'alphahunter',
    contributionsJson: JSON.stringify([
      { name: 'DeFiLaunch', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=defilaunch', role: 'Advisor' },
      { name: 'Web3Social', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=web3social', role: 'Contributor' },
      { name: 'YieldProtocol', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=yieldprotocol', role: 'Advisor' },
    ]),
  },
  {
    userId: 'user_crypto_whale_002',
    username: 'crypto_whale',
    displayName: 'Crypto Whale 🐋',
    bio: 'DeFi enthusiast | NFT collector | Building in public',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=whale',
    verified: true,
    conviction: 920,
    totalEarnings: 25000,
    roles: ['Trader', 'Builder', 'Influencer'],
    walletAddress: '0x2345678901234567890123456789012345678901',
    twitter: 'cryptowhale',
    discord: 'CryptoWhale#0420',
    instagram: 'cryptowhale',
    contributionsJson: JSON.stringify([
      { name: 'NFTMarket', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=nftmarket', role: 'Creator' },
      { name: 'DeFiLaunch', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=defilaunch', role: 'Contributor' },
      { name: 'MemeDAO', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=memedao', role: 'Advisor' },
      { name: 'YieldProtocol', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=yieldprotocol', role: 'Contributor' },
    ]),
  },
  {
    userId: 'user_degen_stream_003',
    username: 'degen_stream',
    displayName: 'Degen Streamer',
    bio: 'Live trading | Meme coin specialist | Not financial advice 🎮',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=degen',
    verified: false,
    conviction: 650,
    totalEarnings: 8900,
    roles: ['Streamer', 'Trader'],
    walletAddress: '0x3456789012345678901234567890123456789012',
    twitter: 'degenstream',
    tiktok: 'degenstream',
    youtube: '@degenstream',
    website: 'https://twitch.tv/degenstream',
    contributionsJson: JSON.stringify([
      { name: 'MemeDAO', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=memedao', role: 'Contributor' },
      { name: 'CryptoGaming', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=cryptogaming', role: 'Contributor' },
    ]),
  },
  {
    userId: 'user_nft_artist_004',
    username: 'pixel_artist',
    displayName: 'Pixel Artist',
    bio: 'NFT artist | Generative art | 1/1s | Commissions open 🎨',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pixel',
    verified: true,
    conviction: 780,
    totalEarnings: 15600,
    roles: ['Creator', 'Artist'],
    walletAddress: '0x4567890123456789012345678901234567890123',
    twitter: 'pixelartist',
    instagram: 'pixelartist',
    website: 'https://pixelnfts.art',
    contributionsJson: JSON.stringify([
      { name: 'NFTMarket', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=nftmarket', role: 'Creator' },
      { name: 'MetaverseHub', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=metaversehub', role: 'Creator' },
      { name: 'Web3Social', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=web3social', role: 'Contributor' },
    ]),
  },
  {
    userId: 'user_smart_contract_005',
    username: 'solidity_dev',
    displayName: 'Solidity Dev',
    bio: 'Smart contract auditor | Web3 builder | Security first 🔒',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=solidity',
    verified: true,
    conviction: 890,
    totalEarnings: 22000,
    roles: ['Builder', 'Developer'],
    walletAddress: '0x5678901234567890123456789012345678901234',
    twitter: 'soliditydev',
    discord: 'SolidityDev#8080',
    website: 'https://github.com/soliditydev',
    contributionsJson: JSON.stringify([
      { name: 'DeFiLaunch', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=defilaunch', role: 'Creator' },
      { name: 'YieldProtocol', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=yieldprotocol', role: 'Creator' },
      { name: 'ChainLink', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=chainlink', role: 'Advisor' },
    ]),
  },
  {
    userId: 'user_yield_farmer_006',
    username: 'yield_farmer',
    displayName: 'Yield Farmer 🌾',
    bio: 'DeFi yield strategies | LP provider | APY hunter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farmer',
    verified: false,
    conviction: 720,
    totalEarnings: 18300,
    roles: ['Trader', 'DeFi'],
    walletAddress: '0x6789012345678901234567890123456789012345',
    twitter: 'yieldfarmer',
    contributionsJson: JSON.stringify([
      { name: 'YieldProtocol', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=yieldprotocol', role: 'Contributor' },
      { name: 'DeFiLaunch', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=defilaunch', role: 'Contributor' },
    ]),
  },
  {
    userId: 'user_meme_lord_007',
    username: 'meme_lord',
    displayName: 'Meme Lord',
    bio: 'Meme coin trader | Diamond hands 💎🙌 | To the moon! 🚀',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meme',
    verified: false,
    conviction: 550,
    totalEarnings: 6700,
    roles: ['Trader', 'Influencer'],
    walletAddress: '0x7890123456789012345678901234567890123456',
    twitter: 'memelord',
    tiktok: 'memelord',
    discord: 'MemeLord#6969',
    contributionsJson: JSON.stringify([
      { name: 'MemeDAO', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=memedao', role: 'Creator' },
    ]),
  },
  {
    userId: 'user_dao_voter_008',
    username: 'dao_voter',
    displayName: 'DAO Voter',
    bio: 'Active in governance | Community first | Decentralization advocate',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=dao',
    verified: true,
    conviction: 810,
    totalEarnings: 14200,
    roles: ['Member', 'Influencer'],
    walletAddress: '0x8901234567890123456789012345678901234567',
    twitter: 'daovoter',
    website: 'https://snapshot.org/@daovoter',
    contributionsJson: JSON.stringify([
      { name: 'MemeDAO', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=memedao', role: 'Advisor' },
      { name: 'Web3Social', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=web3social', role: 'Advisor' },
    ]),
  },
  {
    userId: 'user_airdrop_hunter_009',
    username: 'airdrop_hunter',
    displayName: 'Airdrop Hunter',
    bio: 'Free money enthusiast | Testnet grinder | Airdrop strategies',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=airdrop',
    verified: false,
    conviction: 620,
    totalEarnings: 9800,
    roles: ['Member', 'Trader'],
    walletAddress: '0x9012345678901234567890123456789012345678',
    twitter: 'airdrophunter',
    youtube: '@airdrophunter',
    contributionsJson: JSON.stringify([
      { name: 'ChainLink', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=chainlink', role: 'Contributor' },
    ]),
  },
  {
    userId: 'user_blockchain_analyst_010',
    username: 'onchain_analyst',
    displayName: 'On-Chain Analyst',
    bio: 'Data-driven trading | Chain analysis | Whale watching 🐋',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=analyst',
    verified: true,
    conviction: 860,
    totalEarnings: 19500,
    roles: ['Alpha', 'Trader'],
    walletAddress: '0xa123456789012345678901234567890123456789',
    twitter: 'onchainanalyst',
    website: 'https://dune.com/@onchainanalyst',
    contributionsJson: JSON.stringify([
      { name: 'ChainLink', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=chainlink', role: 'Advisor' },
      { name: 'DeFiLaunch', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=defilaunch', role: 'Contributor' },
    ]),
  },
]

async function seedNetworkUsers() {
  console.log('🌱 Seeding network users...\n')

  try {
    // Check existing users
    const existing = await databases.listDocuments(DB_ID, USERS_COLLECTION_ID)
    console.log(`📊 Found ${existing.documents.length} existing users`)

    let created = 0
    let skipped = 0

    for (const user of testUsers) {
      // Check if user already exists
      const existingUser = existing.documents.find(
        (doc: any) => doc.userId === user.userId || doc.username === user.username
      )

      if (existingUser) {
        console.log(`⏭️  Skipping ${user.username} - already exists`)
        skipped++
        continue
      }

      try {
        await databases.createDocument(
          DB_ID,
          USERS_COLLECTION_ID,
          ID.unique(),
          user
        )
        console.log(`✅ Created user: ${user.username} (@${user.displayName})`)
        created++
      } catch (error: any) {
        console.error(`❌ Failed to create ${user.username}:`, error.message)
      }
    }

    console.log('\n🎉 Seeding complete!')
    console.log(`   - Created: ${created} users`)
    console.log(`   - Skipped: ${skipped} users`)
    console.log(`   - Total in DB: ${existing.documents.length + created} users`)
    console.log('\n💡 Refresh http://localhost:3000/network to see the new users!')

  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    if (error.code === 404) {
      console.log('💡 Collection not found. Check your NEXT_PUBLIC_APPWRITE_COLLECTION_USERS in .env')
    }
  }
}

seedNetworkUsers()
