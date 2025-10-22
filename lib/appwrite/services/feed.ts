/**
 * Launch Page Feed Service
 * Provides filterable/sortable project feed for /launch page
 */

import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'
import type { Curve } from '@/types/curve'

export interface FeedFilters {
  status?: 'all' | 'live' | 'frozen' | 'launched'
  sortBy?: 'latest' | 'tvl' | 'trending'
  searchQuery?: string
  limit?: number
  offset?: number
}

export interface FeedProject {
  id: string
  title: string
  description: string
  logoUrl: string
  ticker: string
  status: string
  category: string

  // Metrics
  tvl: number
  holders: number
  currentPrice: number
  priceChange24h: number
  volume24h: number

  // Metadata
  createdBy: string
  createdAt: string

  // UI helpers
  trendingScore?: number
}

/**
 * Get project feed with filters and sorting
 */
export async function getProjectFeed(filters: FeedFilters = {}): Promise<FeedProject[]> {
  const {
    status = 'all',
    sortBy = 'latest',
    searchQuery = '',
    limit = 20,
    offset = 0
  } = filters

  try {
    // Build Appwrite queries
    const queries: string[] = []

    // Filter by status
    if (status !== 'all') {
      queries.push(Query.equal('status', status))
    } else {
      // Show active statuses by default
      queries.push(Query.equal('status', ['active', 'live', 'frozen', 'launched']))
    }

    // Search query
    if (searchQuery) {
      queries.push(Query.search('title', searchQuery))
    }

    // Sorting
    if (sortBy === 'latest') {
      queries.push(Query.orderDesc('$createdAt'))
    }
    // Note: TVL and trending sorting requires fetching curves first

    // Pagination
    queries.push(Query.limit(limit))
    queries.push(Query.offset(offset))

    // Fetch launches
    const launchesResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      queries
    )

    const launches = launchesResponse.documents as any[]

    // Fetch curves and build feed items
    const feedProjects = await Promise.all(
      launches.map(async (launch) => {
        try {
          // Get curve for project
          const curveResponse = await databases.listDocuments(
            DB_ID,
            COLLECTIONS.CURVES,
            [
              Query.equal('ownerType', 'project'),
              Query.equal('ownerId', launch.$id),
              Query.limit(1)
            ]
          )

          const curve = curveResponse.documents[0] as unknown as Curve | undefined

          // Calculate trending score
          const trendingScore = curve ? calculateTrendingScore(curve) : 0

          return {
            id: launch.$id,
            title: launch.title,
            description: launch.description || launch.subtitle || '',
            logoUrl: launch.logoUrl || launch.tokenImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${launch.title}&backgroundColor=10b981`,
            ticker: launch.tokenSymbol || '',
            status: launch.status,
            category: launch.scope || 'meme',

            tvl: curve?.reserve || 0,
            holders: curve?.holders || 0,
            currentPrice: curve?.price || 0.01,
            priceChange24h: curve?.priceChange24h || 0,
            volume24h: curve?.volume24h || 0,

            createdBy: launch.createdBy,
            createdAt: launch.$createdAt,

            trendingScore
          } as FeedProject
        } catch (error) {
          console.error(`Error processing launch ${launch.$id}:`, error)
          return null
        }
      })
    )

    // Filter out nulls
    const validProjects = feedProjects.filter((p): p is FeedProject => p !== null)

    // Apply client-side sorting if needed (for TVL or trending)
    if (sortBy === 'tvl') {
      validProjects.sort((a, b) => b.tvl - a.tvl)
    } else if (sortBy === 'trending') {
      validProjects.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    }

    return validProjects
  } catch (error) {
    console.error('Error fetching project feed:', error)
    return []
  }
}

/**
 * Calculate trending score for a project
 * Weighted combination of volume, holder growth, and price action
 */
function calculateTrendingScore(curve: Curve): number {
  const volumeScore = (curve.volumeChange24h || 0) * 0.4
  const holderScore = (curve.holderChange24h || 0) * 0.3
  const priceScore = (curve.priceChange24h || 0) * 0.3

  return volumeScore + holderScore + priceScore
}
