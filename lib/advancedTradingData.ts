import type { UnifiedCardData } from '@/components/UnifiedCard'

/**
 * Extended trading metrics for advanced table view
 */
export interface TradingMetrics {
  // Core metrics
  graduationPercent: number // 0-100, progress toward Pump.fun launch
  marketCap: number // in SOL
  volume24h: number // in SOL
  volumeTotal: number // Total all-time volume
  txCount24h: number // number of transactions
  createdAt: number // timestamp
  holders: number
  supply: number
  price: number
  priceChange24h: number
  liquidity: number
  lastActivity: number

  // Distribution metrics (from pump.fun screenshots)
  top10HoldersPct: number // % held by top 10
  creatorHeldPct: number // % held by creator
  snipersPct: number // % held by early snipers

  // Social links
  telegram?: string
  website?: string

  // Creator info
  creatorName: string
  creatorAvatar: string
  creatorWallet: string
}

export type AdvancedListingData = UnifiedCardData & {
  metrics: TradingMetrics
  creatorId?: string // Creator user ID for invites
}

/**
 * Generate realistic trading metrics based on project age and type
 */
function generateMetrics(
  type: 'icm' | 'ccm' | 'meme',
  ageHours: number,
  popularity: 'low' | 'medium' | 'high' | 'viral'
): Omit<TradingMetrics, 'creatorName' | 'creatorAvatar' | 'creatorWallet'> {
  const baseMultiplier = {
    low: 1,
    medium: 3,
    high: 10,
    viral: 50
  }[popularity]

  const typeMultiplier = {
    icm: 1.5,
    ccm: 2.0,
    meme: 1.0
  }[type]

  const mult = baseMultiplier * typeMultiplier

  // Use deterministic values based on ageHours to avoid hydration mismatches
  const seed = ageHours % 100

  // Use a fixed base timestamp instead of Date.now() to avoid server/client mismatches
  const BASE_TIMESTAMP = 1734595200000 // Fixed timestamp: 2024-12-19

  return {
    graduationPercent: Math.min(98, (ageHours / 72) * 100 * (mult / 10)),
    marketCap: Math.floor((10000 + ageHours * 500) * mult),
    volume24h: Math.floor((2000 + ageHours * 100) * mult),
    txCount24h: Math.floor((50 + ageHours * 10) * mult),
    createdAt: BASE_TIMESTAMP - ageHours * 60 * 60 * 1000,
    top10HoldersPct: Math.min(95, 40 + (seed % 30)),
    creatorHeldPct: Math.min(40, 10 + (seed % 20)),
    snipersPct: Math.min(30, 5 + (seed % 15)),
    telegram: seed > 50 ? 'https://t.me/example' : undefined,
    website: seed > 30 ? 'https://example.com' : undefined,
  }
}

/**
 * Advanced listings with full trading metrics
 */
export const advancedListings: AdvancedListingData[] = [
  // === ICM (Ideas/Projects) - High conviction, slower growth ===
  {
    id: 'icm-1',
    type: 'icm',
    title: 'AI Development Toolkit',
    subtitle: 'Open-source AI tools for Web3 builders',
    ticker: '$AIKIT',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=AIKIT&backgroundColor=10b981',
    status: 'active',
    beliefScore: 87,
    upvotes: 247,
    commentsCount: 56,
    viewCount: 2840,
    holders: 203,
    keysSupply: 1200,
    priceChange24h: 15.3,
    currentPrice: 0.045,
    myKeys: 50,
    mySharePct: 4.2,
    twitterUrl: 'https://twitter.com/aikit',
    hasVoted: true,
    notificationEnabled: true,
    metrics: {
      ...generateMetrics('icm', 41, 'high'),
      creatorName: 'DevTeam.eth',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevTeam',
      creatorWallet: 'DK6...xuD9',
      telegram: 'https://t.me/aikit',
      website: 'https://aikit.dev',
    }
  },

  {
    id: 'icm-2',
    type: 'icm',
    title: 'DeFi Insurance Protocol',
    subtitle: 'Decentralized smart contract insurance',
    ticker: '$SAFE',
    status: 'active',
    beliefScore: 72,
    upvotes: 156,
    commentsCount: 28,
    viewCount: 1920,
    holders: 89,
    priceChange24h: 8.2,
    currentPrice: 0.028,
    myKeys: 0,
    mySharePct: 0,
    twitterUrl: 'https://twitter.com/safeprotocol',
    metrics: {
      ...generateMetrics('icm', 13, 'medium'),
      creatorName: 'SafeBuilder',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SafeBuilder',
      creatorWallet: '8H5...rVTb',
    }
  },

  {
    id: 'icm-3',
    type: 'icm',
    title: 'Cross-Chain Bridge V3',
    subtitle: 'Lightning-fast multi-chain swaps',
    ticker: '$BRIDGE',
    status: 'live',
    beliefScore: 64,
    upvotes: 98,
    commentsCount: 19,
    viewCount: 1240,
    holders: 124,
    priceChange24h: -2.1,
    currentPrice: 0.019,
    myKeys: 25,
    mySharePct: 1.8,
    metrics: {
      ...generateMetrics('icm', 6, 'medium'),
      creatorName: 'BridgeDAO',
      creatorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=BridgeDAO',
      creatorWallet: '2Jd...dw2G',
      website: 'https://bridge.xyz',
    }
  },

  // === CCM (Creators) - Medium conviction, personality-driven ===
  {
    id: 'ccm-1',
    type: 'ccm',
    title: '@CryptoKing',
    subtitle: 'Trading alpha & market analysis',
    ticker: '$KING',
    logoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoKing',
    status: 'live',
    beliefScore: 94,
    upvotes: 542,
    commentsCount: 134,
    viewCount: 12400,
    holders: 1240,
    keysSupply: 4200,
    priceChange24h: 42.7,
    currentPrice: 0.18,
    myKeys: 100,
    mySharePct: 2.4,
    airdropAmount: 5000,
    hasClaimedAirdrop: false,
    twitterUrl: 'https://twitter.com/cryptoking',
    hasVoted: true,
    notificationEnabled: true,
    metrics: {
      ...generateMetrics('ccm', 56, 'viral'),
      creatorName: 'CryptoKing',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoKing',
      creatorWallet: 'BQp...NHiv',
      telegram: 'https://t.me/cryptokingchat',
      website: 'https://cryptoking.io',
    }
  },

  {
    id: 'ccm-2',
    type: 'ccm',
    title: '@NFTArtist',
    subtitle: 'Digital artist & metaverse builder',
    ticker: '$ART',
    logoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NFTArtist',
    status: 'active',
    beliefScore: 78,
    upvotes: 234,
    commentsCount: 67,
    viewCount: 5600,
    holders: 456,
    priceChange24h: 12.4,
    currentPrice: 0.089,
    myKeys: 30,
    mySharePct: 1.2,
    twitterUrl: 'https://twitter.com/nftartist',
    metrics: {
      ...generateMetrics('ccm', 10, 'high'),
      creatorName: 'NFTArtist',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NFTArtist',
      creatorWallet: 'CVj...wLDP',
      website: 'https://nftartist.com',
    }
  },

  // === MEME - Low conviction, high volume, viral potential ===
  {
    id: 'meme-1',
    type: 'meme',
    title: 'Pepe Lambo',
    subtitle: 'When moon ser? 🚀🐸',
    ticker: '$PEPEL',
    logoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=PEPEL&backgroundColor=f97316',
    status: 'live',
    beliefScore: 42,
    upvotes: 1240,
    commentsCount: 423,
    viewCount: 28400,
    holders: 5607,
    keysSupply: 12000,
    priceChange24h: 156.8,
    currentPrice: 0.0012,
    myKeys: 1000,
    mySharePct: 8.3,
    twitterUrl: 'https://twitter.com/pepelambo',
    hasVoted: true,
    metrics: {
      ...generateMetrics('meme', 44, 'viral'),
      creatorName: 'PepeDegen',
      creatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PepeDegen',
      creatorWallet: '2ET...jfNB',
      telegram: 'https://t.me/pepelambo',
    }
  },

  {
    id: 'meme-2',
    type: 'meme',
    title: 'Doge CEO',
    subtitle: 'Much wow, very business',
    ticker: '$DCEO',
    logoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=DCEO&backgroundColor=eab308',
    status: 'active',
    beliefScore: 38,
    upvotes: 892,
    commentsCount: 234,
    viewCount: 18200,
    holders: 3197,
    priceChange24h: 89.2,
    currentPrice: 0.0089,
    myKeys: 500,
    mySharePct: 5.1,
    metrics: {
      ...generateMetrics('meme', 3, 'viral'),
      creatorName: 'DogeWhale',
      creatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DogeWhale',
      creatorWallet: 'Dar...w5fY',
      telegram: 'https://t.me/dogeceo',
      website: 'https://dogeceo.meme',
    }
  },

  {
    id: 'meme-3',
    type: 'meme',
    title: 'Skull Trooper',
    subtitle: 'Spooky szn all year 💀',
    ticker: '$SKULL',
    logoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SKULL&backgroundColor=6366f1',
    status: 'live',
    beliefScore: 55,
    upvotes: 645,
    commentsCount: 178,
    viewCount: 14200,
    holders: 508,
    priceChange24h: 18.3,
    currentPrice: 0.0065,
    myKeys: 200,
    mySharePct: 3.2,
    twitterUrl: 'https://twitter.com/skulltrooper',
    metrics: {
      ...generateMetrics('meme', 3, 'high'),
      creatorName: 'SkullMaster',
      creatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SkullMaster',
      creatorWallet: 'B2S...PJAn',
    }
  },

  {
    id: 'meme-4',
    type: 'meme',
    title: 'BurnCoin',
    subtitle: 'We burn everything 🔥',
    ticker: '$BURN',
    status: 'active',
    beliefScore: 29,
    upvotes: 423,
    commentsCount: 98,
    viewCount: 8900,
    holders: 31164,
    priceChange24h: -12.4,
    currentPrice: 0.0001,
    myKeys: 0,
    mySharePct: 0,
    metrics: {
      ...generateMetrics('meme', 5, 'medium'),
      creatorName: 'BurnMaster',
      creatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BurnMaster',
      creatorWallet: 'CeE...hyte',
      telegram: 'https://t.me/burncoin',
    }
  },

  {
    id: 'meme-5',
    type: 'meme',
    title: 'Rewards Coin',
    subtitle: 'Pump rewards for holders',
    ticker: '$RWD',
    status: 'active',
    beliefScore: 23,
    upvotes: 537,
    commentsCount: 124,
    viewCount: 12100,
    holders: 688,
    priceChange24h: 0.6,
    currentPrice: 0.0023,
    myKeys: 0,
    mySharePct: 0,
    metrics: {
      ...generateMetrics('meme', 26, 'low'),
      creatorName: 'RewardsPump',
      creatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RewardsPump',
      creatorWallet: '2zpG...Pump',
    }
  },

  {
    id: 'meme-6',
    type: 'meme',
    title: 'HealthCoin',
    subtitle: 'Most valuable community',
    ticker: '$HLTH',
    status: 'live',
    beliefScore: 25,
    upvotes: 191,
    commentsCount: 48,
    viewCount: 5348,
    holders: 5348,
    priceChange24h: 0.1,
    currentPrice: 0.0010,
    myKeys: 0,
    mySharePct: 0,
    metrics: {
      ...generateMetrics('meme', 1, 'medium'),
      creatorName: 'HealthPump',
      creatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=HealthPump',
      creatorWallet: 'C2bN...Pump',
      website: 'https://healthcoin.xyz',
    }
  },

  {
    id: 'meme-7',
    type: 'meme',
    title: 'RubyCoin',
    subtitle: 'Gems only 💎',
    ticker: '$RUBY',
    status: 'active',
    beliefScore: 23,
    upvotes: 3197,
    commentsCount: 892,
    viewCount: 81651,
    holders: 3197,
    priceChange24h: 23.1,
    currentPrice: 0.0963,
    myKeys: 150,
    mySharePct: 2.1,
    twitterUrl: 'https://twitter.com/rubycoin',
    metrics: {
      ...generateMetrics('meme', 2, 'viral'),
      creatorName: 'RubyDev',
      creatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RubyDev',
      creatorWallet: '2VBD...bQcn',
      telegram: 'https://t.me/rubycoin',
    }
  },

  {
    id: 'meme-8',
    type: 'meme',
    title: 'Chinese Andy',
    subtitle: 'Nihao from Shanghai',
    ticker: '$ANDY',
    status: 'live',
    beliefScore: 50,
    upvotes: 203,
    commentsCount: 67,
    viewCount: 4650,
    holders: 203,
    priceChange24h: 16.4,
    currentPrice: 0.0100,
    myKeys: 0,
    mySharePct: 0,
    twitterUrl: 'https://twitter.com/chineseand',
    metrics: {
      ...generateMetrics('meme', 1, 'medium'),
      creatorName: 'AndyCrypto',
      creatorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AndyCrypto',
      creatorWallet: 'CeE...hyte',
      website: 'https://chineseandy.com',
    }
  },
]

/**
 * Format time ago from timestamp
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return '< 1m'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return `${days}d`
}

/**
 * Format large numbers (1.2K, 4.5M, etc.)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
  return `$${num.toFixed(0)}`
}

/**
 * Format SOL with proper decimals
 */
export function formatSOL(amount: number): string {
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K SOL`
  if (amount >= 1) return `${amount.toFixed(2)} SOL`
  return `${amount.toFixed(4)} SOL`
}