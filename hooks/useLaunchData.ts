"use client"

import { useState, useEffect } from 'react'
import { getGlobalMetrics, getTopProjects } from '@/lib/appwrite/services/metrics'
import { getBuildersLeaderboard, getInvestorsLeaderboard, getCommunitiesLeaderboard, getClippersLeaderboard, getTradersLeaderboard } from '@/lib/appwrite/services/leaderboard'
import { getProjectFeed } from '@/lib/appwrite/services/feed'
import type { PlatformMetrics, SpotlightProject } from '@/lib/appwrite/services/metrics'
import type { BuilderRanking, InvestorRanking, CommunityRanking, ClipperRanking, TraderRanking } from '@/lib/appwrite/services/leaderboard'
import type { FeedProject } from '@/lib/appwrite/services/feed'

interface LaunchData {
  metrics: PlatformMetrics | null
  spotlight: SpotlightProject[]
  builders: BuilderRanking[]
  investors: InvestorRanking[]
  communities: CommunityRanking[]
  clippers: ClipperRanking[]
  traders: TraderRanking[]
  feed: FeedProject[]
  isLoading: boolean
  error: string | null
}

/**
 * Main hook for /launch page data
 * Fetches all data with client-side caching
 */
export function useLaunchData(feedFilters?: { status: string; sortBy: string }) {
  const [data, setData] = useState<LaunchData>({
    metrics: null,
    spotlight: [],
    builders: [],
    investors: [],
    communities: [],
    clippers: [],
    traders: [],
    feed: [],
    isLoading: true,
    error: null
  })

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        // Fetch all data in parallel
        const [metrics, spotlight, builders, investors, communities, clippers, traders, feed] = await Promise.all([
          getGlobalMetrics(),
          getTopProjects(3),
          getBuildersLeaderboard(10),
          getInvestorsLeaderboard(10),
          getCommunitiesLeaderboard(10),
          getClippersLeaderboard(10),
          getTradersLeaderboard(10),
          getProjectFeed({
            status: feedFilters?.status === 'all' ? undefined : (feedFilters?.status as any),
            sortBy: feedFilters?.sortBy as any,
            limit: 20
          })
        ])

        if (mounted) {
          setData({
            metrics,
            spotlight,
            builders,
            investors,
            communities,
            clippers,
            traders,
            feed,
            isLoading: false,
            error: null
          })
        }
      } catch (error) {
        console.error('Error fetching launch data:', error)
        if (mounted) {
          setData(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load data'
          }))
        }
      }
    }

    fetchData()

    // Refetch every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [feedFilters?.status, feedFilters?.sortBy])

  return data
}
