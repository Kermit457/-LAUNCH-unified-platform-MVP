/**
 * Hook: Get user notifications
 */

import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastNotificationsService } from '@/lib/appwrite/services/blast-notifications'

export function useNotifications(unreadOnly = false) {
  const { user } = usePrivy()

  return useQuery({
    queryKey: ['blast-notifications', user?.id, unreadOnly],
    queryFn: () => {
      if (!user) throw new Error('Not authenticated')
      return BlastNotificationsService.getUserNotifications(user.id, 50, unreadOnly)
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refresh every 30 seconds for real-time feel
  })
}
