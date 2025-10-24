/**
 * Launch Page Feed Service
 * Provides filterable/sortable project feed for /launch page
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

export interface FeedFilters {
  status?: 'all' | 'live' | 'active' | 'experimental'
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
    }

    // Search query
    if (searchQuery) {
      queries.push(Query.search('title', searchQuery))
    }

    // Sorting
    if (sortBy === 'latest') {
      queries.push(Query.orderDesc('$createdAt'))
    } else if (sortBy === 'trending') {
      queries.push(Query.orderDesc('beliefScore'))
    }

    // Pagination
    queries.push(Query.limit(limit))
    queries.push(Query.offset(offset))

    // Fetch projects
    const projectsResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.PROJECTS,
      queries
    )

    const projects = projectsResponse.documents as any[]

    // Fetch related data and build feed items
    const feedProjects = await Promise.all(
      projects.map(async (project) => {
        try {
          // Fetch related data in parallel
          const [clips, holders, votes] = await Promise.all([
            databases.listDocuments(DB_ID, COLLECTIONS.CLIPS, [
              Query.equal('projectId', project.$id),
              Query.limit(100)
            ]).catch(() => ({ documents: [] })),

            databases.listDocuments(DB_ID, COLLECTIONS.HOLDERS, [
              Query.equal('projectId', project.$id),
              Query.limit(100)
            ]).catch(() => ({ documents: [] })),

            databases.listDocuments(DB_ID, COLLECTIONS.VOTES, [
              Query.equal('projectId', project.$id)
            ]).catch(() => ({ documents: [] }))
          ])

          // Calculate metrics
          const totalViews = clips.documents.reduce((sum: number, clip: any) => sum + (clip.views || 0), 0)
          const trendingScore = project.beliefScore || 0

          return {
            id: project.$id,
            title: project.title,
            description: project.subtitle || '',
            logoUrl: project.logoUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}`,
            ticker: project.ticker,
            status: project.status,
            category: project.type || 'token',

            tvl: 0, // Would come from blockchain
            holders: holders.documents.length,
            currentPrice: 0.01, // Would come from blockchain
            priceChange24h: 0, // Would come from blockchain
            volume24h: totalViews, // Using clip views as proxy for activity

            createdBy: project.creatorId,
            createdAt: project.$createdAt,

            trendingScore
          } as FeedProject
        } catch (error) {
          console.error(`Error processing project ${project.$id}:`, error)
          return null
        }
      })
    )

    // Filter out nulls
    const validProjects = feedProjects.filter((p): p is FeedProject => p !== null)

    // Apply client-side sorting if needed
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
