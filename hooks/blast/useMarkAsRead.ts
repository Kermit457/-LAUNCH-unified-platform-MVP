/**
 * Hook: Mark notification as read
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastNotificationsService } from '@/lib/appwrite/services/blast-notifications'

export function useMarkAsRead() {
  const { user } = usePrivy()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await BlastNotificationsService.markAsRead(notificationId)
    },
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: ['blast-notifications'] })
      queryClient.invalidateQueries({ queryKey: ['blast-notifications-unread-count'] })
    },
  })
}

export function useMarkAllAsRead() {
  const { user } = usePrivy()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated')
      await BlastNotificationsService.markAllAsRead(user.id)
    },
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: ['blast-notifications'] })
      queryClient.invalidateQueries({ queryKey: ['blast-notifications-unread-count'] })
    },
  })
}
