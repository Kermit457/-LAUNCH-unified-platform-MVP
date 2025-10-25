/**
 * useRejectApplicant - Reject application mutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastApplicantsService } from '@/lib/appwrite/services/blast-applicants'
import { BlastMotionService } from '@/lib/appwrite/services/blast-motion'
import { BlastNotificationsService } from '@/lib/appwrite/services/blast-notifications'
import { BlastRoomsService } from '@/lib/appwrite/services/blast-rooms'
import { toast } from 'sonner'

export function useRejectApplicant(roomId: string) {
  const { user } = usePrivy()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { applicationId: string; reason?: string }) => {
      if (!user) {
        throw new Error('Please sign in')
      }

      const application = await BlastApplicantsService.rejectApplication(
        params.applicationId,
        params.reason
      )

      // Record Motion Score event for rejection
      await BlastMotionService.recordEvent({
        type: 'rejected',
        actorId: application.userId,
        roomId,
      })

      // Send notification to applicant
      const room = await BlastRoomsService.getRoomById(roomId)
      await BlastNotificationsService.notifyApplicationRejected({
        userId: application.userId,
        roomTitle: room.title,
        roomId,
      })

      return application
    },

    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['blast-applicants', roomId] })
      queryClient.invalidateQueries({ queryKey: ['blast-room', roomId] })
      queryClient.invalidateQueries({ queryKey: ['blast-applications', data.userId] })

      toast.success('Application rejected', {
        description: 'Keys have been refunded'
      })
    },

    onError: (error: Error) => {
      toast.error('Failed to reject application', {
        description: error.message
      })
    },
  })
}
