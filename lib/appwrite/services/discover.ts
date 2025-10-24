/**
 * Discover Data Service
 * Fetches and transforms Appwrite data for Discover page listings
 */

import { databases } from '@/lib/appwrite/client'
import { Query } from 'appwrite'
import type { UnifiedCardData } from '@/components/UnifiedCard'
import type { AdvancedListingData } from '@/lib/advancedTradingData'

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

export interface DiscoverFilters {
  type?: 'all' | 'token' | 'nft' | 'ccm'
  status?: 'all' | 'live' | 'active' | 'experimental'
  sortBy?: 'trending' | 'new' | 'volume' | 'conviction' | 'active' | 'live'
  searchQuery?: string
  limit?: number
  offset?: number
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

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      queries.push(Query.equal('type', filters.type))
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      queries.push(Query.equal('status', filters.status))
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

    // Default sort: belief score
    let sortQuery = Query.orderDesc('beliefScore')

    // Apply sort
    switch (filters.sortBy) {
      case 'trending':
      case 'active':
      case 'live':
        sortQuery = Query.orderDesc('beliefScore')
        break
      case 'conviction':
        sortQuery = Query.orderDesc('beliefScore')
        break
      case 'new':
        sortQuery = Query.orderDesc('$createdAt')
        break
      default:
        sortQuery = Query.orderDesc('beliefScore')
        break
    }
    queries.push(sortQuery)

    // Fetch projects from Appwrite
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.PROJECTS,
      queries
    )

    const projects = response.documents

    // Fetch associated data for each project
    const unifiedData: UnifiedCardData[] = []
    const advancedData: AdvancedListingData[] = []

    for (const project of projects) {
      try {
        // Fetch related data in parallel
        const [clips, contributors, holders, votes, socialLinks] = await Promise.all([
          databases.listDocuments(DB_ID, COLLECTIONS.CLIPS, [
            Query.equal('projectId', project.$id),
            Query.limit(10)
          ]).catch(() => ({ documents: [] })),

          databases.listDocuments(DB_ID, COLLECTIONS.CONTRIBUTORS, [
            Query.equal('projectId', project.$id),
            Query.limit(10)
          ]).catch(() => ({ documents: [] })),

          databases.listDocuments(DB_ID, COLLECTIONS.HOLDERS, [
            Query.equal('projectId', project.$id),
            Query.limit(100)
          ]).catch(() => ({ documents: [] })),

          databases.listDocuments(DB_ID, COLLECTIONS.VOTES, [
            Query.equal('projectId', project.$id)
          ]).catch(() => ({ documents: [] })),

          databases.listDocuments(DB_ID, COLLECTIONS.SOCIAL_LINKS, [
            Query.equal('projectId', project.$id),
            Query.limit(1)
          ]).catch(() => ({ documents: [] }))
        ])

        // Calculate total clip views
        const totalViews = clips.documents.reduce((sum: number, clip: any) => sum + (clip.views || 0), 0)

        // Get creator info
        let creatorInfo: any = {}
        if (project.creatorId) {
          try {
            const creator = await databases.getDocument(DB_ID, COLLECTIONS.USERS, project.creatorId)
            creatorInfo = creator
          } catch (e) {
            // Creator not found, use defaults
          }
        }

        // Get social links
        const social = socialLinks.documents[0] || {}

        // Transform to UnifiedCardData
        const unified: UnifiedCardData = {
          id: project.$id,
          type: project.type === 'token' ? 'icm' : project.type === 'nft' ? 'meme' : 'ccm',
          title: project.title,
          subtitle: project.subtitle || '',
          ticker: project.ticker,
          logoUrl: project.logoUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}`,
          status: project.status,
          beliefScore: project.beliefScore || 0,
          upvotes: votes.documents.length,
          commentsCount: 0,
          viewCount: totalViews,
          holders: holders.documents.length,
          keysSupply: project.totalSupply || 0,
          priceChange24h: 0,
          currentPrice: 0.01,
          myKeys: 0,
          mySharePct: 0,
          estLaunchTokens: null,
          contributors: contributors.documents.slice(0, 4).map((c: any) => ({
            name: c.name,
            avatar: c.twitterAvatar || c.avatar || `https://unavatar.io/twitter/${c.twitterHandle}`,
            twitterHandle: c.twitterHandle
          })),
          websiteUrl: social.website,
          twitterUrl: social.twitter,
          telegramUrl: null,
          githubUrl: social.github,
          hasVoted: false,
          notificationEnabled: false,
          creatorId: project.creatorId,
        }

        // Transform to AdvancedListingData
        const advanced: AdvancedListingData = {
          id: project.$id,
          type: project.type === 'token' ? 'icm' : project.type === 'nft' ? 'meme' : 'ccm',
          title: project.title,
          subtitle: project.subtitle,
          ticker: project.ticker,
          logoUrl: project.logoUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}`,
          status: project.status,
          currentPrice: 0.01,
          priceChange24h: 0,
          holders: holders.documents.length,
          upvotes: votes.documents.length,
          commentsCount: 0,
          viewCount: totalViews,
          beliefScore: project.beliefScore || 0,
          myKeys: 0,
          mySharePct: 0,
          metrics: {
            volume24h: 0,
            volumeTotal: 0,
            marketCap: 0,
            holders: holders.documents.length,
            supply: project.totalSupply || 0,
            price: 0.01,
            priceChange24h: 0,
            liquidity: 0,
            createdAt: new Date(project.$createdAt).getTime(),
            lastActivity: new Date(project.$createdAt).getTime(),
            creatorName: creatorInfo.displayName || creatorInfo.username || project.creatorName || 'Anonymous',
            creatorAvatar: creatorInfo.avatar || project.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.creatorId}`,
            creatorWallet: project.creatorId,
            graduationPercent: 0,
            txCount24h: 0,
            top10HoldersPct: 0,
            creatorHeldPct: 0,
            snipersPct: 0,
            websiteUrl: social.website,
            twitterUrl: social.twitter,
            githubUrl: social.github,
            contributors: contributors.documents.slice(0, 4).map((c: any) => ({
              id: c.$id,
              name: c.name,
              avatar: c.twitterAvatar || c.avatar,
              twitterHandle: c.twitterHandle
            })),
            contributorsCount: contributors.documents.length
          },
          hasVoted: false,
          creatorId: project.creatorId,
        }

        unifiedData.push(unified)
        advancedData.push(advanced)
      } catch (err) {
        console.error(`Error processing project ${project.$id}:`, err)
      }
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
      COLLECTIONS.HOLDERS,
      [
        Query.equal('userId', userId),
        Query.limit(100)
      ]
    )

    // For now, just return count. Price calculation would require blockchain data
    return {
      totalValue: 0,
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
