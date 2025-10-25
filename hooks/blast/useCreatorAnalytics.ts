/**
 * useCreatorAnalytics - Fetch creator performance metrics
 */

import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastAnalyticsService } from '@/lib/appwrite/services/blast-analytics'

export function useCreatorAnalytics() {
  const { user } = usePrivy()

  return useQuery({
    queryKey: ['blast-creator-analytics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      return BlastAnalyticsService.getCreatorAnalytics(user.id)
    },
    enabled: !!user,
    staleTime: 60000, // Cache for 1 minute
  })
}
