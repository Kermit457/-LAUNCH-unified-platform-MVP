/**
 * Hook: Get and update notification preferences
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastNotificationsService, NotificationPreferences } from '@/lib/appwrite/services/blast-notifications'
import { toast } from 'sonner'

export function useNotificationPreferences() {
  const { user } = usePrivy()

  return useQuery({
    queryKey: ['blast-notification-preferences', user?.id],
    queryFn: () => {
      if (!user) throw new Error('Not authenticated')
      return BlastNotificationsService.getUserPreferences(user.id)
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useUpdateNotificationPreferences() {
  const { user } = usePrivy()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (preferences: Partial<NotificationPreferences>) => {
      if (!user) throw new Error('Not authenticated')
      return BlastNotificationsService.updateUserPreferences(user.id, preferences)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blast-notification-preferences'] })
      toast.success('Preferences updated')
    },
    onError: () => {
      toast.error('Failed to update preferences')
    },
  })
}
