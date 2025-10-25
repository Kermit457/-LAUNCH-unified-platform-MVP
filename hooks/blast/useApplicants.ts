/**
 * useApplicants - Fetch applicants for a room (priority-sorted)
 */

import { useQuery } from '@tanstack/react-query'
import { BlastApplicantsService } from '@/lib/appwrite/services/blast-applicants'
import type { BlastApplicant } from '@/lib/types/blast'

export function useApplicants(
  roomId: string,
  status?: 'pending' | 'accepted' | 'rejected'
) {
  return useQuery<BlastApplicant[]>({
    queryKey: ['blast-applicants', roomId, status],
    queryFn: () => BlastApplicantsService.getApplicationsByRoom(roomId, status),
    enabled: !!roomId,
    refetchInterval: 5000, // Real-time updates every 5s
  })
}
