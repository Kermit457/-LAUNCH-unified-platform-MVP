/**
 * Hook: Get unread notification count
 */

import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastNotificationsService } from '@/lib/appwrite/services/blast-notifications'

export function useUnreadCount() {
  const { user } = usePrivy()

  return useQuery({
    queryKey: ['blast-notifications-unread-count', user?.id],
    queryFn: () => {
      if (!user) throw new Error('Not authenticated')
      return BlastNotificationsService.getUnreadCount(user.id)
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refresh every 30 seconds
  })
}
