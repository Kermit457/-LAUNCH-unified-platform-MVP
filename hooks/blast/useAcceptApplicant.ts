/**
 * useAcceptApplicant - Accept application mutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastApplicantsService } from '@/lib/appwrite/services/blast-applicants'
import { BlastMotionService } from '@/lib/appwrite/services/blast-motion'
import { BlastNotificationsService } from '@/lib/appwrite/services/blast-notifications'
import { BlastRoomsService } from '@/lib/appwrite/services/blast-rooms'
import { toast } from 'sonner'

export function useAcceptApplicant(roomId: string) {
  const { user } = usePrivy()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (applicationId: string) => {
      if (!user) {
        throw new Error('Please sign in')
      }

      const application = await BlastApplicantsService.acceptApplication(
        applicationId,
        user.id
      )

      // Record Motion Score event for applicant
      await BlastMotionService.recordEvent({
        type: 'accepted',
        actorId: application.userId,
        roomId,
      })

      // Send notification to applicant
      const room = await BlastRoomsService.getRoomById(roomId)
      await BlastNotificationsService.notifyApplicationAccepted({
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

      toast.success('Application accepted', {
        description: `${data.userName} has been accepted to the room`
      })
    },

    onError: (error: Error) => {
      toast.error('Failed to accept application', {
        description: error.message
      })
    },
  })
}
