/**
 * useCreateDMRequest - Send DM request mutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { BlastDMService } from '@/lib/appwrite/services/blast-dm'
import { BlastVaultService } from '@/lib/appwrite/services/blast-vault'
import { BlastMotionService } from '@/lib/appwrite/services/blast-motion'
import { useWallets } from '@privy-io/react-auth'
import { useKeyGate } from './useKeyGate'
import { toast } from 'sonner'

export function useCreateDMRequest() {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { keyBalance } = useKeyGate()
  const queryClient = useQueryClient()

  const wallet = wallets[0]

  return useMutation({
    mutationFn: async (params: {
      toUserId: string
      toUserName: string
      message: string
      keysOffered: number
      roomId?: string
    }) => {
      if (!user || !wallet?.address) {
        throw new Error('Please connect your wallet')
      }

      const { toUserId, toUserName, message, keysOffered, roomId } = params

      // Check key balance
      if (keyBalance < keysOffered) {
        throw new Error(`Insufficient keys. You have ${keyBalance}`)
      }

      // Lock keys
      await BlastVaultService.lockKeysForRoom(
        user.id,
        wallet.address,
        `dm_${toUserId}`, // Use DM-specific room ID
        keysOffered,
        user.twitter?.username || user.email?.address?.split('@')[0] || 'Anon'
      )

      // Create DM request
      const dmRequest = await BlastDMService.createDMRequest({
        fromUserId: user.id,
        fromUserName: user.twitter?.username || user.email?.address?.split('@')[0] || 'Anon',
        fromUserAvatar: user.twitter?.profilePictureUrl,
        toUserId,
        toUserName,
        message,
        depositAmount: keysOffered,
        roomId
      })

      // Record Motion Score event
      await BlastMotionService.recordEvent({
        type: 'creates',
        actorId: user.id,
        targetId: toUserId,
        metadata: { action: 'dm_request', keys: keysOffered }
      })

      return dmRequest
    },

    onSuccess: (data, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['blast-dm-requests', user?.id, 'outgoing'] })
      queryClient.invalidateQueries({ queryKey: ['vault-status', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['key-balance'] })

      toast.success('DM Request sent!', {
        description: `${variables.keysOffered} keys locked until response`
      })
    },

    onError: (error: Error) => {
      toast.error('Failed to send DM request', {
        description: error.message
      })
    },
  })
}
