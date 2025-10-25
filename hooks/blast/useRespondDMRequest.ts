/**
 * useRespondDMRequest - Accept/decline DM requests
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastDMService } from '@/lib/appwrite/services/blast-dm'
import { BlastMotionService } from '@/lib/appwrite/services/blast-motion'
import { toast } from 'sonner'

export function useRespondDMRequest() {
  const { user } = usePrivy()
  const queryClient = useQueryClient()

  const acceptMutation = useMutation({
    mutationFn: async (params: { requestId: string; dmThreadId?: string }) => {
      if (!user) throw new Error('Please sign in')

      const dmRequest = await BlastDMService.acceptDMRequest(
        params.requestId,
        params.dmThreadId
      )

      // Record Motion Score event
      await BlastMotionService.recordEvent({
        type: 'accepted',
        actorId: user.id,
        targetId: dmRequest.requesterId,
        metadata: { action: 'dm_accepted' }
      })

      return dmRequest
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blast-dm-requests', user?.id, 'incoming'] })

      toast.success('DM Request accepted', {
        description: `You can now chat with ${data.requesterName}`
      })
    },

    onError: (error: Error) => {
      toast.error('Failed to accept request', {
        description: error.message
      })
    },
  })

  const declineMutation = useMutation({
    mutationFn: async (requestId: string) => {
      if (!user) throw new Error('Please sign in')

      const dmRequest = await BlastDMService.declineDMRequest(requestId)

      // Record Motion Score event
      await BlastMotionService.recordEvent({
        type: 'rejected',
        actorId: user.id,
        targetId: dmRequest.requesterId,
        metadata: { action: 'dm_declined' }
      })

      return dmRequest
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blast-dm-requests', user?.id, 'incoming'] })

      toast.success('DM Request declined', {
        description: `Keys refunded to ${data.requesterName}`
      })
    },

    onError: (error: Error) => {
      toast.error('Failed to decline request', {
        description: error.message
      })
    },
  })

  return {
    accept: acceptMutation.mutate,
    decline: declineMutation.mutate,
    isAccepting: acceptMutation.isPending,
    isDeclining: declineMutation.isPending
  }
}
