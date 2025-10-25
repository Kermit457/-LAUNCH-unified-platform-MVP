/**
 * useApplyToRoom - Submit application with key deposit
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth'
import { useKeyGate } from './useKeyGate'
import { BlastApplicantsService } from '@/lib/appwrite/services/blast-applicants'
import { BlastVaultService } from '@/lib/appwrite/services/blast-vault'
import { BlastRoomsService } from '@/lib/appwrite/services/blast-rooms'
import { BlastMotionService } from '@/lib/appwrite/services/blast-motion'
import { useCurveActivation } from '@/contexts/CurveActivationContext'
import { toast } from 'sonner'
import type { ApplicationInput } from '@/lib/validations/blast'

export function useApplyToRoom() {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { keyBalance } = useKeyGate()
  const { curveState } = useCurveActivation()
  const queryClient = useQueryClient()

  const wallet = wallets[0]

  return useMutation({
    mutationFn: async (input: ApplicationInput) => {
      if (!user || !wallet?.address) {
        throw new Error('Please connect your wallet')
      }

      const { roomId, message, keysToStake, attachments } = input

      // Check balance
      if (keyBalance < keysToStake) {
        throw new Error(`Insufficient keys. You have ${keyBalance}`)
      }

      // Get room to verify it's open
      const room = await BlastRoomsService.getRoomById(roomId)
      if (room.status === 'closed' || room.status === 'archived') {
        throw new Error('Room is closed')
      }

      // Check if already applied
      const hasApplied = await BlastApplicantsService.hasApplied(user.id, roomId)
      if (hasApplied) {
        throw new Error('Already applied to this room')
      }

      // Lock keys
      const { lock } = await BlastVaultService.lockKeysForRoom(
        user.id,
        wallet.address,
        roomId,
        keysToStake,
        curveState?.twitterHandle || user.twitter?.username || ''
      )

      // Get user's Motion Score
      const motionScore = await BlastMotionService.getOrCreateScore(user.id)

      // Submit application
      const application = await BlastApplicantsService.apply({
        roomId,
        userId: user.id,
        userName: user.twitter?.username || user.email?.address?.split('@')[0] || 'Anon',
        userAvatar: user.twitter?.profilePictureUrl,
        userMotionScore: motionScore.currentScore,
        message,
        keysStaked: keysToStake,
        lockId: lock.$id,
        attachments,
      })

      // Record Motion Score event
      await BlastMotionService.recordEvent({
        type: 'applies',
        actorId: user.id,
        roomId,
      })

      // Update room keys locked
      await BlastRoomsService.lockKeysToRoom(roomId, keysToStake)

      return application
    },

    onSuccess: (data, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['blast-room', variables.roomId] })
      queryClient.invalidateQueries({ queryKey: ['blast-applications', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['vault-status', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['key-balance'] })

      toast.success('Application submitted!', {
        description: `${variables.keysToStake} keys locked`
      })
    },

    onError: (error: Error) => {
      toast.error('Failed to apply', {
        description: error.message
      })
    },
  })
}
