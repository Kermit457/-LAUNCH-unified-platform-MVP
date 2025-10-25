/**
 * useDMRequests - Fetch incoming/outgoing DM requests
 */

import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastDMService } from '@/lib/appwrite/services/blast-dm'
import type { DMRequest } from '@/lib/types/blast'

export function useDMRequests(
  direction: 'incoming' | 'outgoing',
  status?: 'pending' | 'accepted' | 'declined' | 'expired'
) {
  const { user } = usePrivy()

  return useQuery<DMRequest[]>({
    queryKey: ['blast-dm-requests', user?.id, direction, status],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')

      if (direction === 'incoming') {
        return BlastDMService.getIncomingRequests(user.id, status)
      } else {
        return BlastDMService.getOutgoingRequests(user.id, status)
      }
    },
    enabled: !!user,
    refetchInterval: 10000, // Check every 10s for new requests
  })
}
