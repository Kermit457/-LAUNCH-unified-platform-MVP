/**
 * useLeaderboard - Fetch top performing rooms
 */

import { useQuery } from '@tanstack/react-query'
import { BlastAnalyticsService } from '@/lib/appwrite/services/blast-analytics'

export function useLeaderboard() {
  return useQuery({
    queryKey: ['blast-leaderboard'],
    queryFn: () => BlastAnalyticsService.getLeaderboard(),
    refetchInterval: 60000, // Update every minute
  })
}
