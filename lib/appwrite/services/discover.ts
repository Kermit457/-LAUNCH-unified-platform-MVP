/**
 * Discover Data Service
 * Fetches and transforms Appwrite data for Discover page listings
 */

import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'
import type { UnifiedCardData } from '@/components/UnifiedCard'
import type { AdvancedListingData } from '@/lib/advancedTradingData'
import type { Curve } from '@/types/curve'
import type { Launch } from './launches'
import { getLaunches } from './launches'
import { CurveService } from './curves'
import { getUserProfile } from './users'

export interface DiscoverFilters {
  type?: 'all' | 'icm' | 'ccm' | 'meme'
  status?: 'all' | 'live' | 'active' | 'upcoming' | 'frozen'
  sortBy?: 'trending' | 'new' | 'volume' | 'conviction' | 'active' | 'live'
  searchQuery?: string
  limit?: number
  offset?: number
}

/**
 * Transform Launch + Curve data to UnifiedCardData format
 */
function transformToUnifiedCard(
  launch: Launch,
  curve: Curve | null,
  userProfile: any
): UnifiedCardData {
  const type = launch.scope === 'ICM' ? 'icm' : launch.scope === 'CCM' ? 'ccm' : 'meme'

  return {
    id: launch.$id,
    type,
    title: launch.title,
    subtitle: launch.subtitle || launch.description || '',
    ticker: launch.tokenSymbol || '',
    logoUrl: launch.logoUrl || launch.tokenImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${launch.title}&backgroundColor=10b981`,
    status: launch.status as 'live' | 'upcoming' | 'ended',
    beliefScore: Math.round(launch.convictionPct || 0),
    upvotes: launch.upvotes || 0,
    commentsCount: launch.commentsCount || 0,
    viewCount: launch.viewCount || 0,
    holders: curve?.holders || launch.holders || 0,
    keysSupply: curve?.supply || 0,
    priceChange24h: curve?.priceChange24h || launch.priceChange24h || 0,
    currentPrice: curve?.price || 0.01,
    myKeys: 0, // TODO: Query from CURVE_HOLDERS for current user
    mySharePct: 0, // TODO: Calculate from holdings
    estLaunchTokens: null,
    contributors: userProfile ? [{
      name: userProfile.displayName || userProfile.username || 'Anonymous',
      avatar: userProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${launch.createdBy}`
    }] : [],
    twitterUrl: userProfile?.twitter ? `https://twitter.com/${userProfile.twitter}` : undefined,
    hasVoted: false, // TODO: Check VOTES collection for current user
    notificationEnabled: false,
    creatorId: launch.createdBy,
  }
}

/**
 * Transform Launch + Curve data to AdvancedListingData format (for table view)
 */
function transformToAdvancedListing(
  launch: Launch,
  curve: Curve | null,
  userProfile: any
): AdvancedListingData {
  const type = launch.scope === 'ICM' ? 'icm' : launch.scope === 'CCM' ? 'ccm' : 'meme'

  return {
    id: launch.$id,
    type,
    title: launch.title,
    subtitle: launch.subtitle || launch.description,
    ticker: launch.tokenSymbol,
    logoUrl: launch.logoUrl || launch.tokenImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${launch.title}`,
    status: launch.status as 'live' | 'active' | 'upcoming' | 'frozen',

    // Metrics
    currentPrice: curve?.price || 0.01,
    priceChange24h: curve?.priceChange24h || launch.priceChange24h || 0,
    holders: curve?.holders || launch.holders || 0,
    upvotes: launch.upvotes || 0,
    commentsCount: launch.commentsCount || 0,
    viewCount: launch.viewCount || 0,
    beliefScore: Math.round(launch.convictionPct || 0),

    // Holdings
    myKeys: 0, // TODO: Query from CURVE_HOLDERS
    mySharePct: 0,

    // Advanced metrics
    metrics: {
      volume24h: curve?.volume24h || 0,
      volumeTotal: curve?.volumeTotal || 0,
      marketCap: curve?.marketCap || 0,
      holders: curve?.holders || launch.holders || 0,
      supply: curve?.supply || 0,
      price: curve?.price || 0.01,
      priceChange24h: curve?.priceChange24h || launch.priceChange24h || 0,
      liquidity: curve?.reserve || 0,
      createdAt: new Date(launch.$createdAt).getTime(),
      lastActivity: curve?.updatedAt ? new Date(curve.updatedAt).getTime() : new Date(launch.$createdAt).getTime(),
      creatorName: userProfile?.displayName || userProfile?.username || 'Anonymous',
      creatorAvatar: userProfile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${launch.createdBy}`,
      graduationPercent: Math.min(100, ((curve?.marketCap || 0) / 69000) * 100), // $69k graduation target
    },

    hasVoted: false, // TODO: Check VOTES collection
    creatorId: launch.createdBy,
  }
}

/**
 * Fetch discover page listings with filters
 */
export async function getDiscoverListings(filters: DiscoverFilters = {}): Promise<{
  unified: UnifiedCardData[]
  advanced: AdvancedListingData[]
}> {
  try {
    const queries: any[] = []

    // Apply type filter (ICM vs CCM, meme would be a tag or separate collection)
    if (filters.type && filters.type !== 'all') {
      if (filters.type === 'icm') {
        queries.push(Query.equal('scope', 'ICM'))
      } else if (filters.type === 'ccm') {
        queries.push(Query.equal('scope', 'CCM'))
      }
      // MEME type would need additional logic
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active' || filters.status === 'live') {
        queries.push(Query.equal('status', 'live'))
      } else if (filters.status === 'upcoming') {
        queries.push(Query.equal('status', 'upcoming'))
      } else if (filters.status === 'frozen') {
        // Frozen status would come from curve state
        // We'll filter this after fetching curves
      }
    }

    // Apply search
    if (filters.searchQuery) {
      queries.push(Query.search('title', filters.searchQuery))
    }

    // Apply limit and offset
    queries.push(Query.limit(filters.limit || 50))
    if (filters.offset) {
      queries.push(Query.offset(filters.offset))
    }

    // Default sort: recent
    let sortQuery = Query.orderDesc('$createdAt')

    // Apply sort
    switch (filters.sortBy) {
      case 'trending':
        sortQuery = Query.orderDesc('viewCount')
        break
      case 'conviction':
        sortQuery = Query.orderDesc('convictionPct')
        break
      case 'volume':
        sortQuery = Query.orderDesc('volume24h')
        break
      case 'new':
      default:
        sortQuery = Query.orderDesc('$createdAt')
        break
    }
    queries.push(sortQuery)

    // Fetch launches from Appwrite
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      queries
    )

    const launches = response.documents as unknown as Launch[]

    // Fetch associated curves and user profiles
    const unifiedData: UnifiedCardData[] = []
    const advancedData: AdvancedListingData[] = []

    for (const launch of launches) {
      // Get curve data if it exists
      const curve = await CurveService.getCurveByOwner('project', launch.$id)

      // Get creator profile
      const userProfile = await getUserProfile(launch.createdBy)

      // Transform to both formats
      const unified = transformToUnifiedCard(launch, curve, userProfile)
      const advanced = transformToAdvancedListing(launch, curve, userProfile)

      // Apply frozen filter if needed
      if (filters.status === 'frozen' && curve?.state !== 'frozen') {
        continue
      }

      unifiedData.push(unified)
      advancedData.push(advanced)
    }

    // Post-processing sort for volume (since it comes from curves)
    if (filters.sortBy === 'volume') {
      advancedData.sort((a, b) => b.metrics.volume24h - a.metrics.volume24h)
    }

    return {
      unified: unifiedData,
      advanced: advancedData
    }
  } catch (error) {
    console.error('Failed to fetch discover listings:', error)
    return {
      unified: [],
      advanced: []
    }
  }
}

/**
 * Get user's holdings for display on discover page
 */
export async function getUserHoldings(userId: string): Promise<{
  totalValue: number
  holdingsCount: number
}> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.CURVE_HOLDERS,
      [
        Query.equal('userId', userId),
        Query.greaterThan('balance', 0),
        Query.limit(100)
      ]
    )

    let totalValue = 0
    for (const holding of response.documents) {
      // Get curve to get current price
      const curve = await CurveService.getCurveById(holding.curveId as string)
      if (curve) {
        totalValue += (holding.balance as number) * curve.price
      }
    }

    return {
      totalValue,
      holdingsCount: response.documents.length
    }
  } catch (error) {
    console.error('Failed to fetch user holdings:', error)
    return {
      totalValue: 0,
      holdingsCount: 0
    }
  }
}
