/**
 * Leaderboard Service
 * Provides rankings for Builders, Investors, and Communities
 */

import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'
import type { Curve } from '@/types/curve'

export interface BuilderRanking {
  rank: number
  userId: string
  displayName: string
  username: string
  avatar: string
  launchesCount: number
  totalTVL: number
  avgTVL: number
  successRate: number // % of launches that reached frozen/launched
}

export interface InvestorRanking {
  rank: number
  userId: string
  displayName: string
  username: string
  avatar: string
  investedAmount: number // Total SOL invested
  portfolioValue: number // Current value of holdings
  roi: number // Return on investment %
  holdingsCount: number // Number of different projects held
}

export interface CommunityRanking {
  rank: number
  communityId: string
  name: string
  logoUrl: string
  membersCount: number
  engagementScore: number // Activity metric
  totalTVL: number
  launchesCount: number
}

export interface ClipperRanking {
  rank: number
  userId: string
  displayName: string
  username: string
  avatar: string
  clipsCreated: number
  totalViews: number
  avgCTR: number // Average click-through rate
  totalEarnings: number // SOL earned from clips
  engagementScore: number // Weighted metric: views * CTR * clips
}

export interface TraderRanking {
  rank: number
  userId: string
  displayName: string
  username: string
  avatar: string
  totalVolume: number // Total SOL traded
  tradesCount: number
  winRate: number // % of profitable trades
  pnl: number // Total profit/loss in SOL
  avgTradeSize: number
}

/**
 * Get top builders by TVL and success rate
 */
export async function getBuildersLeaderboard(limit = 10): Promise<BuilderRanking[]> {
  try {
    // Get all launches
    const launchesResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      [Query.limit(1000)]
    )

    const launches = launchesResponse.documents as any[]

    // Group by creator
    const builderStats = new Map<string, {
      userId: string
      launchIds: string[]
      totalTVL: number
      successCount: number
    }>()

    for (const launch of launches) {
      const creatorId = launch.createdBy
      if (!creatorId) continue

      if (!builderStats.has(creatorId)) {
        builderStats.set(creatorId, {
          userId: creatorId,
          launchIds: [],
          totalTVL: 0,
          successCount: 0
        })
      }

      const stats = builderStats.get(creatorId)!
      stats.launchIds.push(launch.$id)

      // Count success if status is frozen or launched
      if (['frozen', 'launched'].includes(launch.status)) {
        stats.successCount++
      }
    }

    // Fetch curves to get TVL for each builder
    const builderRankings: BuilderRanking[] = []

    for (const [userId, stats] of builderStats.entries()) {
      // Get user profile
      let userProfile
      try {
        userProfile = await databases.getDocument(DB_ID, COLLECTIONS.USERS, userId)
      } catch {
        userProfile = {
          displayName: 'Anonymous',
          username: 'anon',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
        }
      }

      // Calculate total TVL from curves
      let totalTVL = 0
      for (const launchId of stats.launchIds) {
        try {
          const curveResponse = await databases.listDocuments(
            DB_ID,
            COLLECTIONS.CURVES,
            [
              Query.equal('ownerType', 'project'),
              Query.equal('ownerId', launchId),
              Query.limit(1)
            ]
          )

          if (curveResponse.documents.length > 0) {
            const curve = curveResponse.documents[0] as unknown as Curve
            totalTVL += curve.reserve || 0
          }
        } catch (error) {
          console.error(`Error fetching curve for launch ${launchId}:`, error)
        }
      }

      builderRankings.push({
        rank: 0, // Will be set after sorting
        userId,
        displayName: userProfile.displayName || 'Anonymous',
        username: userProfile.username || 'anon',
        avatar: userProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        launchesCount: stats.launchIds.length,
        totalTVL,
        avgTVL: totalTVL / Math.max(stats.launchIds.length, 1),
        successRate: (stats.successCount / Math.max(stats.launchIds.length, 1)) * 100
      })
    }

    // Sort by totalTVL and assign ranks
    const sorted = builderRankings
      .sort((a, b) => b.totalTVL - a.totalTVL)
      .slice(0, limit)
      .map((builder, index) => ({
        ...builder,
        rank: index + 1
      }))

    return sorted
  } catch (error) {
    console.error('Error fetching builders leaderboard:', error)
    return []
  }
}

/**
 * Get top investors by portfolio value and ROI
 */
export async function getInvestorsLeaderboard(limit = 10): Promise<InvestorRanking[]> {
  try {
    // Get all curve holders
    const holdersResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.CURVE_HOLDERS,
      [Query.limit(5000)]
    )

    const holders = holdersResponse.documents as any[]

    // Group by holder ID
    const investorStats = new Map<string, {
      userId: string
      totalInvested: number
      currentValue: number
      holdingsCount: number
    }>()

    for (const holder of holders) {
      const userId = holder.holderId
      if (!userId) continue

      if (!investorStats.has(userId)) {
        investorStats.set(userId, {
          userId,
          totalInvested: 0,
          currentValue: 0,
          holdingsCount: 0
        })
      }

      const stats = investorStats.get(userId)!

      // Add to invested amount (from events or holder.invested field)
      stats.totalInvested += holder.invested || 0

      // Get current curve to calculate portfolio value
      try {
        const curve = await databases.getDocument(
          DB_ID,
          COLLECTIONS.CURVES,
          holder.curveId
        ) as unknown as Curve

        const currentValue = (holder.balance || 0) * (curve.price || 0)
        stats.currentValue += currentValue
      } catch (error) {
        // Curve not found, skip
      }

      stats.holdingsCount++
    }

    // Fetch user profiles and create rankings
    const investorRankings: InvestorRanking[] = []

    for (const [userId, stats] of investorStats.entries()) {
      // Skip if no investment
      if (stats.totalInvested === 0) continue

      // Get user profile
      let userProfile
      try {
        userProfile = await databases.getDocument(DB_ID, COLLECTIONS.USERS, userId)
      } catch {
        userProfile = {
          displayName: 'Anonymous',
          username: 'anon',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
        }
      }

      const roi = ((stats.currentValue - stats.totalInvested) / stats.totalInvested) * 100

      investorRankings.push({
        rank: 0,
        userId,
        displayName: userProfile.displayName || 'Anonymous',
        username: userProfile.username || 'anon',
        avatar: userProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        investedAmount: stats.totalInvested,
        portfolioValue: stats.currentValue,
        roi,
        holdingsCount: stats.holdingsCount
      })
    }

    // Sort by portfolio value and assign ranks
    const sorted = investorRankings
      .sort((a, b) => b.portfolioValue - a.portfolioValue)
      .slice(0, limit)
      .map((investor, index) => ({
        ...investor,
        rank: index + 1
      }))

    return sorted
  } catch (error) {
    console.error('Error fetching investors leaderboard:', error)
    return []
  }
}

/**
 * Get top communities by members and engagement
 * Note: This is a placeholder - requires communities collection
 */
export async function getCommunitiesLeaderboard(limit = 10): Promise<CommunityRanking[]> {
  try {
    // TODO: Implement when communities collection exists
    // For now, return mock data or group by project categories

    // Placeholder: Group launches by category (scope)
    const launchesResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      [Query.limit(1000)]
    )

    const launches = launchesResponse.documents as any[]

    const categoryStats = new Map<string, {
      name: string
      launchIds: string[]
      totalTVL: number
    }>()

    for (const launch of launches) {
      const category = launch.scope || 'Other'

      if (!categoryStats.has(category)) {
        categoryStats.set(category, {
          name: category,
          launchIds: [],
          totalTVL: 0
        })
      }

      categoryStats.get(category)!.launchIds.push(launch.$id)
    }

    // Calculate TVL for each category
    const communityRankings: CommunityRanking[] = []

    for (const [category, stats] of categoryStats.entries()) {
      let totalTVL = 0

      for (const launchId of stats.launchIds) {
        try {
          const curveResponse = await databases.listDocuments(
            DB_ID,
            COLLECTIONS.CURVES,
            [
              Query.equal('ownerType', 'project'),
              Query.equal('ownerId', launchId),
              Query.limit(1)
            ]
          )

          if (curveResponse.documents.length > 0) {
            const curve = curveResponse.documents[0] as unknown as Curve
            totalTVL += curve.reserve || 0
          }
        } catch (error) {
          // Skip on error
        }
      }

      communityRankings.push({
        rank: 0,
        communityId: category.toLowerCase(),
        name: category,
        logoUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${category}&backgroundColor=10b981`,
        membersCount: stats.launchIds.length * 10, // Mock: assume 10 members per launch
        engagementScore: Math.floor(Math.random() * 100), // Mock engagement
        totalTVL,
        launchesCount: stats.launchIds.length
      })
    }

    // Sort by TVL and assign ranks
    const sorted = communityRankings
      .sort((a, b) => b.totalTVL - a.totalTVL)
      .slice(0, limit)
      .map((community, index) => ({
        ...community,
        rank: index + 1
      }))

    return sorted
  } catch (error) {
    console.error('Error fetching communities leaderboard:', error)
    return []
  }
}

/**
 * Get top clippers by engagement and views
 */
export async function getClippersLeaderboard(limit = 10): Promise<ClipperRanking[]> {
  try {
    // TODO: Implement when clips collection exists
    // For now, return mock data

    const mockClippers: ClipperRanking[] = [
      {
        rank: 1,
        userId: 'clipper1',
        displayName: 'ClipMaster',
        username: 'clipmaster',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=clipper1',
        clipsCreated: 142,
        totalViews: 854200,
        avgCTR: 1.8,
        totalEarnings: 24.5,
        engagementScore: 2183
      },
      {
        rank: 2,
        userId: 'clipper2',
        displayName: 'ViralQueen',
        username: 'viralqueen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=clipper2',
        clipsCreated: 98,
        totalViews: 621000,
        avgCTR: 1.5,
        totalEarnings: 18.2,
        engagementScore: 912
      },
      {
        rank: 3,
        userId: 'clipper3',
        displayName: 'ContentKing',
        username: 'contentking',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=clipper3',
        clipsCreated: 76,
        totalViews: 445000,
        avgCTR: 1.2,
        totalEarnings: 12.8,
        engagementScore: 406
      },
      {
        rank: 4,
        userId: 'clipper4',
        displayName: 'TrendSetter',
        username: 'trendsetter',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=clipper4',
        clipsCreated: 54,
        totalViews: 298000,
        avgCTR: 0.9,
        totalEarnings: 8.4,
        engagementScore: 145
      },
      {
        rank: 5,
        userId: 'clipper5',
        displayName: 'ClipWizard',
        username: 'clipwizard',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=clipper5',
        clipsCreated: 42,
        totalViews: 187000,
        avgCTR: 0.7,
        totalEarnings: 5.6,
        engagementScore: 55
      },
      {
        rank: 6,
        userId: 'clipper6',
        displayName: 'Anonymous',
        username: 'anon',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=clipper6',
        clipsCreated: 31,
        totalViews: 124000,
        avgCTR: 0.6,
        totalEarnings: 3.2,
        engagementScore: 23
      }
    ]

    return mockClippers.slice(0, limit)
  } catch (error) {
    console.error('Error fetching clippers leaderboard:', error)
    return []
  }
}

/**
 * Get top traders by volume and PnL
 */
export async function getTradersLeaderboard(limit = 10): Promise<TraderRanking[]> {
  try {
    // TODO: Implement when trade events are tracked
    // For now, return mock data

    const mockTraders: TraderRanking[] = [
      {
        rank: 1,
        userId: 'trader1',
        displayName: 'DiamondHands',
        username: 'diamondhands',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader1',
        totalVolume: 1245.6,
        tradesCount: 342,
        winRate: 68.4,
        pnl: 248.9,
        avgTradeSize: 3.64
      },
      {
        rank: 2,
        userId: 'trader2',
        displayName: 'WhaleWatcher',
        username: 'whalewatcher',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader2',
        totalVolume: 892.3,
        tradesCount: 218,
        winRate: 64.2,
        pnl: 164.5,
        avgTradeSize: 4.09
      },
      {
        rank: 3,
        userId: 'trader3',
        displayName: 'QuickFlip',
        username: 'quickflip',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader3',
        totalVolume: 654.8,
        tradesCount: 567,
        winRate: 58.9,
        pnl: 98.2,
        avgTradeSize: 1.15
      },
      {
        rank: 4,
        userId: 'trader4',
        displayName: 'AlphaSeeker',
        username: 'alphaseeker',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader4',
        totalVolume: 487.2,
        tradesCount: 156,
        winRate: 71.2,
        pnl: 124.6,
        avgTradeSize: 3.12
      },
      {
        rank: 5,
        userId: 'trader5',
        displayName: 'DegenerateApe',
        username: 'degenerateape',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader5',
        totalVolume: 398.5,
        tradesCount: 892,
        winRate: 52.3,
        pnl: 45.8,
        avgTradeSize: 0.45
      },
      {
        rank: 6,
        userId: 'trader6',
        displayName: 'Anonymous',
        username: 'anon',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader6',
        totalVolume: 287.9,
        tradesCount: 124,
        winRate: 48.4,
        pnl: -12.3,
        avgTradeSize: 2.32
      }
    ]

    return mockTraders.slice(0, limit)
  } catch (error) {
    console.error('Error fetching traders leaderboard:', error)
    return []
  }
}
