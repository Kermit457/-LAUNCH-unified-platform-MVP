/**
 * useVault - Get user's vault status (locked keys, earnings)
 */

import { useQuery } from '@tanstack/react-query'
import { BlastVaultService } from '@/lib/appwrite/services/blast-vault'
import { CACHE_TTL } from '@/lib/constants/blast'

export function useVault(userId: string | undefined) {
  return useQuery({
    queryKey: ['vault-status', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      return BlastVaultService.getVaultStatus(userId)
    },
    enabled: !!userId,
    staleTime: CACHE_TTL.USER_VAULT * 1000,
  })
}

/**
 * Get user's active locks
 */
export function useActiveLocks(userId: string | undefined) {
  return useQuery({
    queryKey: ['active-locks', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      return BlastVaultService.getUserActiveLocks(userId)
    },
    enabled: !!userId,
    staleTime: 30_000,
  })
}
