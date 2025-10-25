/**
 * useKeyGate - Core hook for key-based access control
 * Reads key balance from on-chain bonding curve and determines tier
 */

import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth'
import { getKeyBalance, subscribeToKeyBalance } from '@/lib/solana/blast/getKeyBalance'
import { getTierFromKeys } from '@/lib/constants/blast'
import { TIER_THRESHOLDS, CACHE_TTL } from '@/lib/constants/blast'
import type { UseKeyGateReturn } from '@/lib/types/blast'
import { useEffect } from 'react'
import { useCurveActivation } from '@/contexts/CurveActivationContext'

export function useKeyGate(): UseKeyGateReturn {
  const { user, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const { curveState } = useCurveActivation()

  // Get user's connected Solana wallet
  const wallet = wallets.find(w => w.walletClientType === 'privy')
  const walletAddress = wallet?.address

  // Owner ID for curve lookup (use Twitter handle from curve state)
  const ownerId = curveState?.twitterHandle || user?.twitter?.username || ''

  // Fetch key balance from on-chain
  const {
    data: keyBalance = 0,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['key-balance', walletAddress, ownerId],
    queryFn: async () => {
      if (!walletAddress || !ownerId) {
        return 0
      }

      try {
        const balance = await getKeyBalance(walletAddress, ownerId)
        return balance
      } catch (error) {
        console.error('Failed to fetch key balance:', error)
        return 0
      }
    },
    enabled: !!walletAddress && !!ownerId && authenticated,
    staleTime: CACHE_TTL.KEY_BALANCE * 1000,
    refetchInterval: 60_000, // Refetch every minute
    retry: 2,
  })

  // Subscribe to real-time balance updates
  useEffect(() => {
    if (!walletAddress || !ownerId || !authenticated) {
      return
    }

    const unsubscribe = subscribeToKeyBalance(
      walletAddress,
      ownerId,
      (newBalance) => {
        // Invalidate cache and refetch
        refetch()
      }
    )

    return () => unsubscribe()
  }, [walletAddress, ownerId, authenticated, refetch])

  // Determine tier from key balance
  const tier = getTierFromKeys(keyBalance)

  // Calculate permissions
  const canPost = keyBalance >= TIER_THRESHOLDS.contributor
  const canCurate = keyBalance >= TIER_THRESHOLDS.curator
  const canOpenRooms = keyBalance >= TIER_THRESHOLDS.partner

  return {
    keyBalance,
    tier,
    canPost,
    canCurate,
    canOpenRooms,
    isLoading,
    refetch: async () => {
      await refetch()
    },
  }
}

/**
 * Hook to check if user has minimum keys
 */
export function useHasMinimumKeys(requiredKeys: number): {
  hasKeys: boolean
  isLoading: boolean
  keyBalance: number
} {
  const { keyBalance, isLoading } = useKeyGate()

  return {
    hasKeys: keyBalance >= requiredKeys,
    isLoading,
    keyBalance,
  }
}

/**
 * Hook to get tier display info
 */
export function useTierInfo() {
  const { tier, keyBalance } = useKeyGate()

  const nextTier = (() => {
    if (tier === 'partner') return null
    if (tier === 'curator') return 'partner'
    if (tier === 'contributor') return 'curator'
    return 'contributor'
  })()

  const keysToNextTier = (() => {
    if (!nextTier) return 0
    const nextThreshold = TIER_THRESHOLDS[nextTier]
    return Math.max(0, nextThreshold - keyBalance)
  })()

  return {
    tier,
    nextTier,
    keysToNextTier,
    keyBalance,
  }
}
