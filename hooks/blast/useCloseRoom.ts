/**
 * useCloseRoom - Manually close room and trigger refunds
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastRoomsService } from '@/lib/appwrite/services/blast-rooms'
import { BlastApplicantsService } from '@/lib/appwrite/services/blast-applicants'
import { BlastMotionService } from '@/lib/appwrite/services/blast-motion'
import { toast } from 'sonner'

export function useCloseRoom(roomId: string) {
  const { user } = usePrivy()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Please sign in')
      }

      // Close room
      const room = await BlastRoomsService.closeRoom(roomId)

      // Process refunds for all pending applicants
      await BlastApplicantsService.processRoomRefunds(roomId)

      // Record Motion Score event for creator
      await BlastMotionService.recordEvent({
        type: 'creates',
        actorId: user.id,
        roomId,
        metadata: { action: 'close' }
      })

      return room
    },

    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['blast-room', roomId] })
      queryClient.invalidateQueries({ queryKey: ['blast-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['blast-applicants', roomId] })

      toast.success('Room closed', {
        description: 'Refunds processed for active applicants'
      })
    },

    onError: (error: Error) => {
      toast.error('Failed to close room', {
        description: error.message
      })
    },
  })
}
