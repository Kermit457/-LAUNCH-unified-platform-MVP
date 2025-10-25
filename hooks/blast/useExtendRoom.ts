/**
 * useExtendRoom - Extend room by 24 hours (one-time only)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastRoomsService } from '@/lib/appwrite/services/blast-rooms'
import { BlastMotionService } from '@/lib/appwrite/services/blast-motion'
import { toast } from 'sonner'

export function useExtendRoom(roomId: string) {
  const { user } = usePrivy()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Please sign in')
      }

      const room = await BlastRoomsService.extendRoom(roomId)

      // Record Motion Score event for creator
      await BlastMotionService.recordEvent({
        type: 'creates',
        actorId: user.id,
        roomId,
        metadata: { action: 'extend' }
      })

      return room
    },

    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['blast-room', roomId] })
      queryClient.invalidateQueries({ queryKey: ['blast-rooms'] })

      toast.success('Room extended!', {
        description: `Extended by 24 hours until ${new Date(data.endTime).toLocaleString()}`
      })
    },

    onError: (error: Error) => {
      toast.error('Failed to extend room', {
        description: error.message
      })
    },
  })
}
