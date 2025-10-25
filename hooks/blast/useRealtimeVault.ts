/**
 * Real-time vault updates hook
 * Shows live key locks/unlocks/refunds
 */

import { useEffect, useState } from 'react'
import { subscribeToVault, type VaultEvent } from '@/lib/blast/realtime'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeVault(userId: string | null) {
  const queryClient = useQueryClient()
  const [vaultEvent, setVaultEvent] = useState<VaultEvent | null>(null)

  useEffect(() => {
    if (!userId) return

    const unsubscribe = subscribeToVault(userId, (event) => {
      setVaultEvent(event)

      // Invalidate vault query to refetch
      queryClient.invalidateQueries({ queryKey: ['blast', 'vault', userId] })
    })

    return unsubscribe
  }, [userId, queryClient])

  return {
    vaultEvent,
    lastAction: vaultEvent?.type,
    lastAmount: vaultEvent?.amount,
  }
}
