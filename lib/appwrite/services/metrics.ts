/**
 * Launch Page Metrics Service
 * Provides aggregated platform-wide statistics for /launch page
 */

import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'
import type { Curve } from '@/types/curve'

export interface PlatformMetrics {
  vaultTVL: number           // Total value locked across all curves
  airdropTotal: number       // Total airdrop value distributed
  motion24h: number          // 24h percentage change in activity
  liveProjects: number       // Count of active/live projects
  totalVolume24h: number     // 24h trading volume
  totalHolders: number       // Unique holders across all curves
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
    // Query all active curves
    const curvesResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.CURVES,
      [
        Query.equal('state', 'active'),
        Query.limit(5000) // High limit to get all curves
      ]
    )

    const curves = curvesResponse.documents as unknown as Curve[]

    // Calculate aggregates
    const vaultTVL = curves.reduce((sum, curve) => sum + (curve.reserve || 0), 0)
    const totalVolume24h = curves.reduce((sum, curve) => sum + (curve.volume24h || 0), 0)
    const totalHolders = curves.reduce((sum, curve) => sum + (curve.holders || 0), 0)
    const liveProjects = curves.filter(c => c.state === 'active').length

    // Calculate 24h motion (percentage change)
    // For now, use volume change as proxy - can be refined with historical data
    const motion24h = curves.reduce((sum, curve) => {
      const volumeChange = curve.volumeChange24h || 0
      return sum + volumeChange
    }, 0) / Math.max(curves.length, 1)

    // Airdrop total - placeholder (would come from separate airdrops collection)
    const airdropTotal = 0 // TODO: Query from airdrops collection when implemented

    return {
      vaultTVL,
      airdropTotal,
      motion24h,
      liveProjects,
      totalVolume24h,
      totalHolders,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching global metrics:', error)

    // Return safe defaults on error
    return {
      vaultTVL: 0,
      airdropTotal: 0,
      motion24h: 0,
      liveProjects: 0,
      totalVolume24h: 0,
      totalHolders: 0,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Get top N projects for spotlight section
 * Sorted by TVL (reserve) by default
 */
export async function getTopProjects(limit = 3): Promise<SpotlightProject[]> {
  try {
    // Get launches with curves, sorted by TVL
    const launchesResponse = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      [
        Query.equal('status', ['active', 'live']),
        Query.orderDesc('$createdAt'),
        Query.limit(100) // Get more to filter
      ]
    )

    const launches = launchesResponse.documents as any[]

    // Fetch curves for each launch and calculate TVL
    const projectsWithMetrics = await Promise.all(
      launches.map(async (launch) => {
        try {
          // Find curve by owner
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

          return {
            id: launch.$id,
            title: launch.title,
            description: launch.description || launch.subtitle || '',
            logoUrl: launch.logoUrl || launch.tokenImage || `https://api.dicebear.com/7.x/shapes/svg?seed=${launch.title}&backgroundColor=10b981`,
            ticker: launch.tokenSymbol || '',
            tvl: curve?.reserve || 0,
            tvlChange24h: curve?.reserveChange24h || 0,
            holders: curve?.holders || 0,
            currentPrice: curve?.price || 0.01,
            priceChange24h: curve?.priceChange24h || 0,
            status: launch.status,
            category: launch.scope || 'meme',
            createdBy: launch.createdBy,
            createdAt: launch.$createdAt,
            // Internal sort key
            _sortScore: curve?.reserve || 0
          }
        } catch (error) {
          console.error(`Error fetching curve for launch ${launch.$id}:`, error)
          return null
        }
      })
    )

    // Filter out nulls and sort by TVL
    const validProjects = projectsWithMetrics
      .filter((p): p is SpotlightProject & { _sortScore: number } => p !== null)
      .sort((a, b) => b._sortScore - a._sortScore)
      .slice(0, limit)

    // Remove internal sort key
    return validProjects.map(({ _sortScore, ...project }) => project)
  } catch (error) {
    console.error('Error fetching top projects:', error)
    return []
  }
}

/**
 * Get trending score for a project (algorithm placeholder)
 * Factors: volume change, holder growth, price action
 */
function calculateTrendingScore(curve: Curve): number {
  const volumeScore = (curve.volumeChange24h || 0) * 0.4
  const holderScore = (curve.holderChange24h || 0) * 0.3
  const priceScore = (curve.priceChange24h || 0) * 0.3

  return volumeScore + holderScore + priceScore
}
