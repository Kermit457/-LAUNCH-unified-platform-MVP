/**
 * Hook: Get best-fit applicants for a room (creator view)
 */

import { useQuery } from '@tanstack/react-query'
import { BlastMatchingService } from '@/lib/appwrite/services/blast-matching'

export function useBestFitApplicants(roomId: string, limit = 50) {
  return useQuery({
    queryKey: ['blast-best-fit-applicants', roomId, limit],
    queryFn: () => BlastMatchingService.getBestFitApplicants(roomId, limit),
    enabled: !!roomId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 2, // Refresh every 2 minutes
  })
}
