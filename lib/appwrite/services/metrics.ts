/**
 * Launch Page Metrics Service
 * Provides aggregated platform-wide statistics for /launch page
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

export interface PlatformMetrics {
  totalProjects: number      // Total projects count
  activeLaunches: number     // Live/active projects
  volume24h: number          // Total clip views as volume proxy
  marketCap: number          // Total market cap (calculated from holders)
  timestamp: string          // Last update time
}

export interface SpotlightProject {
  id: string
  title: string
  description: string
  logoUrl: string
  ticker: string
  tvl: number
  tvlChange24h: number
  holders: number
  currentPrice: number
  priceChange24h: number
  status: string
  category: string
  createdBy: string
  createdAt: string
}

/**
 * Get real-time platform-wide metrics
 */
export async function getGlobalMetrics(): Promise<PlatformMetrics> {
  try {
    // Query all projects
    const projectsResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.PROJECTS,
      [Query.limit(5000)]
    )

    const projects = projectsResponse.documents

    // Count active/live projects
    const activeLaunches = projects.filter(p =>
      ['live', 'active'].includes(p.status)
    ).length

    // Get all clips to calculate volume
    const clipsResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.CLIPS,
      [Query.limit(5000)]
    )
    const totalVolume24h = clipsResponse.documents.reduce((sum: number, clip: any) =>
      sum + (clip.views || 0), 0
    )

    // Get unique holders count
    const holdersResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.HOLDERS,
      [Query.limit(5000)]
    )

    // Calculate market cap (simplified: holders * avg price)
    const marketCap = holdersResponse.documents.length * 1000 // Mock calculation

    return {
      totalProjects: projects.length,
      activeLaunches,
      volume24h: totalVolume24h,
      marketCap,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching global metrics:', error)

    // Return safe defaults on error
    return {
      totalProjects: 0,
      activeLaunches: 0,
      volume24h: 0,
      marketCap: 0,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Get top N projects for spotlight section
 * Sorted by belief score by default
 */
export async function getTopProjects(limit = 3): Promise<SpotlightProject[]> {
  try {
    // Get top projects sorted by belief score
    const projectsResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.PROJECTS,
      [
        Query.equal('status', ['active', 'live']),
        Query.orderDesc('beliefScore'),
        Query.limit(limit)
      ]
    )

    const projects = projectsResponse.documents

    // Fetch related data for each project
    const spotlightProjects = await Promise.all(
      projects.map(async (project: any) => {
        try {
          // Fetch holders and clips in parallel
          const [holders, clips] = await Promise.all([
            databases.listDocuments(DB_ID, COLLECTIONS.HOLDERS, [
              Query.equal('projectId', project.$id),
              Query.limit(100)
            ]).catch(() => ({ documents: [] })),

            databases.listDocuments(DB_ID, COLLECTIONS.CLIPS, [
              Query.equal('projectId', project.$id),
              Query.limit(100)
            ]).catch(() => ({ documents: [] }))
          ])

          // Calculate total views from clips
          const totalViews = clips.documents.reduce((sum: number, clip: any) =>
            sum + (clip.views || 0), 0
          )

          return {
            id: project.$id,
            title: project.title,
            description: project.subtitle || '',
            logoUrl: project.logoUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}`,
            ticker: project.ticker,
            tvl: holders.documents.length * 100, // Mock TVL calculation
            tvlChange24h: 0, // Would need historical data
            holders: holders.documents.length,
            currentPrice: 0.01, // Mock price
            priceChange24h: 0, // Would need historical data
            status: project.status,
            category: project.type || 'token',
            createdBy: project.creatorId,
            createdAt: project.$createdAt
          } as SpotlightProject
        } catch (error) {
          console.error(`Error processing project ${project.$id}:`, error)
          return null
        }
      })
    )

    // Filter out nulls
    return spotlightProjects.filter((p): p is SpotlightProject => p !== null)
  } catch (error) {
    console.error('Error fetching top projects:', error)
    return []
  }
}
