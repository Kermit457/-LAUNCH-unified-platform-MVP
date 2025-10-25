/**
 * Hook: Get recommended rooms for user
 */

import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { useKeyGate } from './useKeyGate'
import { BlastMatchingService } from '@/lib/appwrite/services/blast-matching'

export function useRecommendedRooms(limit = 10) {
  const { user } = usePrivy()
  const { keyBalance } = useKeyGate()

  return useQuery({
    queryKey: ['blast-recommended-rooms', user?.id, keyBalance, limit],
    queryFn: () => {
      if (!user) throw new Error('Not authenticated')
      return BlastMatchingService.getRecommendedRooms(user.id, keyBalance, limit)
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 minutes
  })
}
