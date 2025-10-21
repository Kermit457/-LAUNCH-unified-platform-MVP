import type { UnifiedCardData } from '@/components/UnifiedCard'

/**
 * Unified Mock Data for all 3 curve types: ICM, CCM, MEME
 * Use this for testing the unified card system
 */

export const unifiedListings: UnifiedCardData[] = [
  // === ICM (Project Launches) ===
  {
    id: 'icm-1',
    type: 'icm',
    title: '$AIKIT Token Launch',
    subtitle: 'AI-powered toolkit for crypto traders and developers',
    ticker: '$AIKIT',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=AIKIT&backgroundColor=10b981',
    status: 'live',
    beliefScore: 87,
    upvotes: 127,
    commentsCount: 23,
    viewCount: 1247,
    holders: 248,
    keysSupply: 850,
    priceChange24h: 15.3,
    currentPrice: 0.025,
    myKeys: 50,
    mySharePct: 5.9,
    estLaunchTokens: 125000,
    contributors: [
      { name: 'Alice Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
      { name: 'Bob Tech', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    ],
    twitterUrl: 'https://twitter.com/aikit',
    hasVoted: true,
    notificationEnabled: true,
  },
  {
    id: 'icm-2',
    type: 'icm',
    title: '$DEFI Protocol V2',
    subtitle: 'Next-gen DeFi aggregator with cross-chain swaps',
    ticker: '$DEFI',
    status: 'active',
    beliefScore: 72,
    upvotes: 89,
    commentsCount: 12,
    viewCount: 892,
    currentPrice: 0.015,
    myKeys: 0,
    mySharePct: 0,
  },
  {
    id: 'icm-3',
    type: 'icm',
    title: '$NFT Marketplace Launch',
    subtitle: 'Zero-fee NFT trading platform',
    ticker: '$NFT',
    status: 'active',
    beliefScore: 64,
    upvotes: 156,
    commentsCount: 34,
    viewCount: 2103,
    holders: 412,
    priceChange24h: -3.2,
    currentPrice: 0.032,
    myKeys: 25,
    mySharePct: 2.1,
  },

  // === CCM (Creator Curves) ===
  {
    id: 'ccm-1',
    type: 'ccm',
    title: '@elonmusk Keys',
    subtitle: 'Tech entrepreneur & shitposter extraordinaire',
    ticker: 'ELON',
    logoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elon',
    status: 'live',
    beliefScore: 94,
    upvotes: 423,
    commentsCount: 89,
    viewCount: 8421,
    holders: 1240,
    keysSupply: 3500,
    priceChange24h: 42.7,
    currentPrice: 0.42,
    myKeys: 10,
    mySharePct: 0.8,
    estLaunchTokens: 50000,
    airdropAmount: 1000,
    hasClaimedAirdrop: false,
    contributors: [
      { name: 'Tesla', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Tesla' },
      { name: 'SpaceX', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=SpaceX' },
      { name: 'Neuralink', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Neuralink' },
    ],
    twitterUrl: 'https://twitter.com/elonmusk',
    hasVoted: true,
    notificationEnabled: true,
  },
  {
    id: 'ccm-2',
    type: 'ccm',
    title: '@mr_beast Keys',
    subtitle: 'YouTube legend & philanthropist',
    ticker: 'BEAST',
    status: 'active',
    beliefScore: 91,
    upvotes: 567,
    commentsCount: 123,
    viewCount: 12450,
    holders: 2100,
    priceChange24h: 28.4,
    currentPrice: 0.18,
    myKeys: 100,
    mySharePct: 4.8,
  },
  {
    id: 'ccm-3',
    type: 'ccm',
    title: '@vitalik Keys',
    subtitle: 'Ethereum co-founder & cryptographer',
    ticker: 'VB',
    status: 'frozen',
    beliefScore: 88,
    upvotes: 312,
    commentsCount: 56,
    viewCount: 5670,
    currentPrice: 0.25,
    myKeys: 0,
    mySharePct: 0,
  },

  // === MEME (Community Coins) ===
  {
    id: 'meme-1',
    type: 'meme',
    title: '$DEGEN V2',
    subtitle: 'The degen community is back with V2',
    ticker: '$DEGEN',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=DEGEN&backgroundColor=f59e0b',
    status: 'live',
    beliefScore: 95,
    upvotes: 834,
    commentsCount: 234,
    viewCount: 15320,
    holders: 5642,
    keysSupply: 12000,
    priceChange24h: 420.69,
    currentPrice: 0.0069,
    myKeys: 500,
    mySharePct: 4.2,
    estLaunchTokens: 2100000,
    contributors: [
      { name: 'Degen DAO', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DegenDAO' },
    ],
    hasVoted: true,
    notificationEnabled: true,
  },
  {
    id: 'meme-2',
    type: 'meme',
    title: '$PEPE 2.0',
    subtitle: 'The frog returns stronger than ever',
    ticker: '$PEPE',
    status: 'live',
    beliefScore: 78,
    upvotes: 456,
    commentsCount: 167,
    viewCount: 9870,
    holders: 3200,
    priceChange24h: -12.3,
    currentPrice: 0.0042,
    myKeys: 0,
    mySharePct: 0,
  },
  {
    id: 'meme-3',
    type: 'meme',
    title: '$BONK RELOADED',
    subtitle: 'Bonk is back to bonk the bonkers',
    ticker: '$BONK',
    status: 'active',
    beliefScore: 69,
    upvotes: 420,
    commentsCount: 69,
    viewCount: 4200,
    currentPrice: 0.00042,
    myKeys: 1000,
    mySharePct: 10.0,
  },
  {
    id: 'meme-4',
    type: 'meme',
    title: '$WIF Hat Edition',
    subtitle: 'Dog with hat is back and better',
    ticker: '$WIF',
    status: 'active',
    beliefScore: 82,
    upvotes: 367,
    commentsCount: 91,
    viewCount: 6540,
    holders: 1890,
    priceChange24h: 156.7,
    currentPrice: 0.0088,
    myKeys: 250,
    mySharePct: 13.2,
  },
]

/**
 * Filter listings by type
 */
export function filterByType(type: 'all' | 'icm' | 'ccm' | 'meme') {
  if (type === 'all') return unifiedListings
  return unifiedListings.filter(item => item.type === type)
}

/**
 * Filter by status
 */
export function filterByStatus(status: 'all' | 'live' | 'active' | 'frozen') {
  if (status === 'all') return unifiedListings
  return unifiedListings.filter(item => item.status === status)
}

/**
 * Sort listings
 */
export function sortListings(
  listings: UnifiedCardData[],
  sortBy: 'trending' | 'new' | 'volume' | 'conviction'
) {
  const sorted = [...listings]

  switch (sortBy) {
    case 'trending':
      // Score based on upvotes, views, belief score
      return sorted.sort((a, b) => {
        const scoreA = a.upvotes * 2 + (a.viewCount || 0) / 100 + a.beliefScore
        const scoreB = b.upvotes * 2 + (b.viewCount || 0) / 100 + b.beliefScore
        return scoreB - scoreA
      })

    case 'conviction':
      return sorted.sort((a, b) => b.beliefScore - a.beliefScore)

    case 'volume':
      return sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))

    case 'new':
      // For now just reverse (newest first)
      return sorted.reverse()

    default:
      return sorted
  }
}

/**
 * Get my holdings (user's portfolio)
 */
export function getMyHoldings() {
  return unifiedListings.filter(item => (item.myKeys || 0) > 0)
}

/**
 * Get listings I created
 */
export function getMyCurves() {
  // In real app, filter by creator === currentUser
  // For demo, return items where user has >10% ownership
  return unifiedListings.filter(item => (item.mySharePct || 0) > 10)
}