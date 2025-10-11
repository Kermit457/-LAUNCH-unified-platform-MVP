import { useState, useEffect, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'

interface ReferralReward {
  id: string
  amount: number
  type: string
  status: 'pending' | 'claimed' | 'expired'
  createdAt: string
  claimedAt?: string
  metadata?: any
}

interface RewardStats {
  pendingCount: number
  pendingAmount: number
  claimedCount: number
  claimedAmount: number
  expiredCount: number
  expiredAmount: number
  totalAmount: number
}

interface UseReferralRewardsOptions {
  autoFetch?: boolean
  fetchInterval?: number
}

export function useReferralRewards(options: UseReferralRewardsOptions = {}) {
  const { autoFetch = true, fetchInterval } = options
  const { user, authenticated } = usePrivy()
  const [rewards, setRewards] = useState<ReferralReward[]>([])
  const [stats, setStats] = useState<RewardStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch rewards
  const fetchRewards = useCallback(async (status?: string) => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ userId: user.id })
      if (status) params.append('status', status)

      const response = await fetch(`/api/referral/rewards?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch rewards')
      }

      const data = await response.json()
      setRewards(data.rewards)
      setStats(data.stats)
    } catch (err) {
      console.error('Error fetching rewards:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Claim a single reward
  const claimReward = useCallback(async (
    rewardId: string,
    walletAddress: string
  ): Promise<boolean> => {
    if (!user?.id) return false

    try {
      const response = await fetch('/api/referral/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'claim',
          rewardId,
          walletAddress
        })
      })

      if (!response.ok) {
        throw new Error('Failed to claim reward')
      }

      const result = await response.json()

      // Refresh rewards after claiming
      await fetchRewards()

      return result.success
    } catch (err) {
      console.error('Error claiming reward:', err)
      setError(err as Error)
      return false
    }
  }, [user, fetchRewards])

  // Batch claim all pending rewards
  const claimAllRewards = useCallback(async (
    walletAddress: string
  ): Promise<{
    success: boolean
    claimed: number
    totalAmount: number
  }> => {
    if (!user?.id) {
      return { success: false, claimed: 0, totalAmount: 0 }
    }

    try {
      const response = await fetch('/api/referral/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch-claim',
          userId: user.id,
          walletAddress
        })
      })

      if (!response.ok) {
        throw new Error('Failed to batch claim rewards')
      }

      const result = await response.json()

      // Refresh rewards after claiming
      await fetchRewards()

      return {
        success: result.success,
        claimed: result.claimed.length,
        totalAmount: result.totalAmount
      }
    } catch (err) {
      console.error('Error batch claiming rewards:', err)
      setError(err as Error)
      return { success: false, claimed: 0, totalAmount: 0 }
    }
  }, [user, fetchRewards])

  // Get pending rewards
  const getPendingRewards = useCallback((): ReferralReward[] => {
    return rewards.filter(r => r.status === 'pending')
  }, [rewards])

  // Get claimed rewards
  const getClaimedRewards = useCallback((): ReferralReward[] => {
    return rewards.filter(r => r.status === 'claimed')
  }, [rewards])

  // Calculate total pending amount
  const getTotalPendingAmount = useCallback((): number => {
    return getPendingRewards().reduce((sum, r) => sum + r.amount, 0)
  }, [getPendingRewards])

  // Auto-fetch on mount and interval
  useEffect(() => {
    if (autoFetch && authenticated && user) {
      fetchRewards()
    }
  }, [autoFetch, authenticated, user, fetchRewards])

  // Set up polling interval
  useEffect(() => {
    if (!fetchInterval || !authenticated || !user) return

    const interval = setInterval(() => {
      fetchRewards()
    }, fetchInterval)

    return () => clearInterval(interval)
  }, [fetchInterval, authenticated, user, fetchRewards])

  return {
    rewards,
    stats,
    isLoading,
    error,
    fetchRewards,
    claimReward,
    claimAllRewards,
    getPendingRewards,
    getClaimedRewards,
    getTotalPendingAmount,
    hasPendingRewards: getPendingRewards().length > 0
  }
}