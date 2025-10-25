/**
 * useUserApplications - Fetch applications submitted by the current user
 */

import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastApplicantsService } from '@/lib/appwrite/services/blast-applicants'
import type { BlastApplicant } from '@/lib/types/blast'

export function useUserApplications(status?: 'pending' | 'accepted' | 'rejected') {
  const { user } = usePrivy()

  return useQuery<BlastApplicant[]>({
    queryKey: ['blast-applications', user?.id, status],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated')
      return BlastApplicantsService.getApplicationsByUser(user.id, status)
    },
    enabled: !!user,
    refetchInterval: 10000, // Real-time updates every 10s
  })
}
