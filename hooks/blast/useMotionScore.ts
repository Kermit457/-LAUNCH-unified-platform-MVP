/**
 * useMotionScore - Get user's Motion Score with live updates
 */

import { useQuery } from '@tanstack/react-query'
import { BlastMotionService } from '@/lib/appwrite/services/blast-motion'
import { CACHE_TTL } from '@/lib/constants/blast'

export function useMotionScore(userId: string | undefined) {
  return useQuery({
    queryKey: ['motion-score', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      return BlastMotionService.getScoreBreakdown(userId)
    },
    enabled: !!userId,
    staleTime: CACHE_TTL.MOTION_SCORE * 1000,
    refetchInterval: 60_000, // Update every minute for decay
  })
}

/**
 * Get Motion Score leaderboard
 */
export function useMotionLeaderboard(limit = 100) {
  return useQuery({
    queryKey: ['motion-leaderboard', limit],
    queryFn: () => BlastMotionService.getLeaderboard(limit),
    staleTime: CACHE_TTL.LEADERBOARD * 1000,
    refetchInterval: 30_000,
  })
}

/**
 * Get user's rank
 */
export function useUserRank(userId: string | undefined) {
  return useQuery({
    queryKey: ['motion-rank', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      return BlastMotionService.getUserRank(userId)
    },
    enabled: !!userId,
    staleTime: CACHE_TTL.LEADERBOARD * 1000,
  })
}
