/**
 * useCreateRoom - Create new Deal Room
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastRoomsService } from '@/lib/appwrite/services/blast-rooms'
import { BlastMotionService } from '@/lib/appwrite/services/blast-motion'
import { toast } from 'sonner'
import type { RoomInput } from '@/lib/validations/blast'

export function useCreateRoom() {
  const { user } = usePrivy()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RoomInput) => {
      if (!user) throw new Error('Not authenticated')

      // Get user's Motion Score
      const motionScore = await BlastMotionService.getOrCreateScore(user.id)

      // Create room
      const room = await BlastRoomsService.createRoom(
        input,
        user.id,
        user.twitter?.username || user.email?.address?.split('@')[0] || 'Anon',
        user.twitter?.profilePictureUrl,
        motionScore.currentScore
      )

      // Record event
      await BlastMotionService.recordEvent({
        type: 'room_attendance',
        actorId: user.id,
        roomId: room.$id,
      })

      return room
    },

    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ['blast-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] })

      toast.success('Room created!', {
        description: room.title
      })
    },

    onError: (error: Error) => {
      toast.error('Failed to create room', {
        description: error.message
      })
    },
  })
}
