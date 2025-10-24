/**
 * Leaderboard Service
 * Provides rankings for Builders, Investors, and Communities
 */

import { databases } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

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
 * Get top builders by project count and belief score
 */
export async function getBuildersLeaderboard(limit = 10): Promise<BuilderRanking[]> {
  try {
    // Get all projects
    const projectsResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.PROJECTS,
      [Query.limit(1000)]
    )

    const projects = projectsResponse.documents as any[]

    // Group by creator
    const builderStats = new Map<string, {
      userId: string
      projectIds: string[]
      totalBeliefScore: number
      successCount: number
    }>()

    for (const project of projects) {
      const creatorId = project.creatorId
      if (!creatorId) continue

      if (!builderStats.has(creatorId)) {
        builderStats.set(creatorId, {
          userId: creatorId,
          projectIds: [],
          totalBeliefScore: 0,
          successCount: 0
        })
      }

      const stats = builderStats.get(creatorId)!
      stats.projectIds.push(project.$id)
      stats.totalBeliefScore += project.beliefScore || 0

      // Count success if status is live or active
      if (['live', 'active'].includes(project.status)) {
        stats.successCount++
      }
    }

    // Create rankings
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

      // Use belief score as TVL proxy
      const totalTVL = stats.totalBeliefScore * 100

      builderRankings.push({
        rank: 0, // Will be set after sorting
        userId,
        displayName: userProfile.displayName || 'Anonymous',
        username: userProfile.username || 'anon',
        avatar: userProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        launchesCount: stats.projectIds.length,
        totalTVL,
        avgTVL: totalTVL / Math.max(stats.projectIds.length, 1),
        successRate: (stats.successCount / Math.max(stats.projectIds.length, 1)) * 100
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
 * Get top investors by holdings count
 */
export async function getInvestorsLeaderboard(limit = 10): Promise<InvestorRanking[]> {
  try {
    // Get all holders
    const holdersResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.HOLDERS,
      [Query.limit(5000)]
    )

    const holders = holdersResponse.documents as any[]

    // Group by user ID
    const investorStats = new Map<string, {
      userId: string
      holdingsCount: number
      projectIds: Set<string>
    }>()

    for (const holder of holders) {
      const userId = holder.userId
      if (!userId) continue

      if (!investorStats.has(userId)) {
        investorStats.set(userId, {
          userId,
          holdingsCount: 0,
          projectIds: new Set()
        })
      }

      const stats = investorStats.get(userId)!
      stats.holdingsCount++
      stats.projectIds.add(holder.projectId)
    }

    // Create rankings
    const investorRankings: InvestorRanking[] = []

    for (const [userId, stats] of investorStats.entries()) {
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

      // Mock investment values
      const portfolioValue = stats.holdingsCount * 1000
      const investedAmount = stats.holdingsCount * 900
      const roi = ((portfolioValue - investedAmount) / investedAmount) * 100

      investorRankings.push({
        rank: 0,
        userId,
        displayName: userProfile.displayName || 'Anonymous',
        username: userProfile.username || 'anon',
        avatar: userProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        investedAmount,
        portfolioValue,
        roi,
        holdingsCount: stats.projectIds.size
      })
    }

    // Sort by holdings count and assign ranks
    const sorted = investorRankings
      .sort((a, b) => b.holdingsCount - a.holdingsCount)
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
 * Get top communities by project type
 */
export async function getCommunitiesLeaderboard(limit = 10): Promise<CommunityRanking[]> {
  try {
    // Group projects by type
    const projectsResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.PROJECTS,
      [Query.limit(1000)]
    )

    const projects = projectsResponse.documents as any[]

    const categoryStats = new Map<string, {
      name: string
      projectIds: string[]
      totalBeliefScore: number
    }>()

    for (const project of projects) {
      const category = project.type || 'Other'

      if (!categoryStats.has(category)) {
        categoryStats.set(category, {
          name: category,
          projectIds: [],
          totalBeliefScore: 0
        })
      }

      const stats = categoryStats.get(category)!
      stats.projectIds.push(project.$id)
      stats.totalBeliefScore += project.beliefScore || 0
    }

    // Create rankings
    const communityRankings: CommunityRanking[] = []

    for (const [category, stats] of categoryStats.entries()) {
      const totalTVL = stats.totalBeliefScore * 100

      communityRankings.push({
        rank: 0,
        communityId: category.toLowerCase(),
        name: category.charAt(0).toUpperCase() + category.slice(1),
        logoUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${category}`,
        membersCount: stats.projectIds.length * 10, // Mock: assume 10 members per project
        engagementScore: Math.floor(stats.totalBeliefScore / stats.projectIds.length) || 0,
        totalTVL,
        launchesCount: stats.projectIds.length
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
    // Get all clips
    const clipsResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.CLIPS,
      [Query.limit(5000)]
    )

    const clips = clipsResponse.documents as any[]

    // Group by user
    const clipperStats = new Map<string, {
      userId: string
      clipsCount: number
      totalViews: number
      totalClicks: number
      totalEngagement: number
    }>()

    for (const clip of clips) {
      const userId = clip.userId
      if (!userId) continue

      if (!clipperStats.has(userId)) {
        clipperStats.set(userId, {
          userId,
          clipsCount: 0,
          totalViews: 0,
          totalClicks: 0,
          totalEngagement: 0
        })
      }

      const stats = clipperStats.get(userId)!
      stats.clipsCount++
      stats.totalViews += clip.views || 0
      stats.totalClicks += clip.clicks || 0
      stats.totalEngagement += clip.engagement || 0
    }

    // Create rankings
    const clipperRankings: ClipperRanking[] = []

    for (const [userId, stats] of clipperStats.entries()) {
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

      const avgCTR = stats.totalViews > 0 ? (stats.totalClicks / stats.totalViews) * 100 : 0
      const engagementScore = Math.floor(stats.totalEngagement)
      const totalEarnings = stats.clipsCount * 0.5 // Mock earnings

      clipperRankings.push({
        rank: 0,
        userId,
        displayName: userProfile.displayName || 'Anonymous',
        username: userProfile.username || 'anon',
        avatar: userProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        clipsCreated: stats.clipsCount,
        totalViews: stats.totalViews,
        avgCTR,
        totalEarnings,
        engagementScore
      })
    }

    // Sort by engagement score and assign ranks
    const sorted = clipperRankings
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limit)
      .map((clipper, index) => ({
        ...clipper,
        rank: index + 1
      }))

    return sorted
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
