import { useState, useEffect, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'

interface ReferralStats {
  totalReferrals: number
  totalEarnings: number
  totalTransactions: number
  averageTransaction: number
  level: number
  levelName: string
  nextLevelProgress: number
  recentActivity: {
    action: string
    amount: number
    timestamp: string
    projectId?: string
  }[]
}

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  handle: string
  avatar: string
  totalReferrals: number
  totalEarnings: number
  recentReferrals: number
  level: number
  levelName: string
  nextLevelProgress: number
}

export function useReferralStats(userId?: string) {
  const { user } = usePrivy()
  const targetUserId = userId || user?.id
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    if (!targetUserId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/referral/track?userId=${targetUserId}&type=referrer`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch referral stats')
      }

      const data = await response.json()

      // Calculate level based on referrals
      const { calculateLevel } = await import('@/lib/referral')
      const levelInfo = calculateLevel(data.stats.totalReferrals)

      setStats({
        ...data.stats,
        level: levelInfo.level,
        levelName: levelInfo.name,
        nextLevelProgress: levelInfo.nextLevelProgress,
        recentActivity: data.referrals.slice(0, 10).map((r: any) => ({
          action: r.action,
          amount: r.referralAmount,
          timestamp: r.timestamp,
          projectId: r.projectId
        }))
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [targetUserId])

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async (
    limit = 50,
    offset = 0,
    timeframe = 'all'
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        timeframe
      })

      const response = await fetch(`/api/referral/leaderboard?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }

      const data = await response.json()
      setLeaderboard(data.leaderboard)

      // Find user's rank if they're in the leaderboard
      if (targetUserId) {
        const userEntry = data.leaderboard.find(
          (entry: LeaderboardEntry) => entry.userId === targetUserId
        )
        setUserRank(userEntry?.rank || null)
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [targetUserId])

  // Generate shareable referral link
  const generateReferralLink = useCallback((
    baseUrl?: string,
    page?: string
  ): string => {
    if (!targetUserId) return ''

    const base = baseUrl || window.location.origin
    const path = page || ''
    return `${base}${path}?ref=${targetUserId}`
  }, [targetUserId])

  // Copy referral link to clipboard
  const copyReferralLink = useCallback(async (
    baseUrl?: string,
    page?: string
  ): Promise<boolean> => {
    const link = generateReferralLink(baseUrl, page)
    if (!link) return false

    try {
      await navigator.clipboard.writeText(link)
      return true
    } catch (err) {
      console.error('Failed to copy link:', err)
      return false
    }
  }, [generateReferralLink])

  // Share referral link (mobile)
  const shareReferralLink = useCallback(async (
    title = 'Join me on LaunchOS',
    text = 'Launch your next big project with LaunchOS!',
    baseUrl?: string,
    page?: string
  ): Promise<boolean> => {
    const url = generateReferralLink(baseUrl, page)
    if (!url) return false

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return true
      } catch (err) {
        console.error('Failed to share:', err)
        return false
      }
    }

    // Fallback to copy
    return copyReferralLink(baseUrl, page)
  }, [generateReferralLink, copyReferralLink])

  // Get position in leaderboard
  const getLeaderboardPosition = useCallback((): {
    rank: number | null
    percentile: number | null
    isTopTen: boolean
  } => {
    if (!userRank || !leaderboard.length) {
      return { rank: null, percentile: null, isTopTen: false }
    }

    const percentile = ((leaderboard.length - userRank + 1) / leaderboard.length) * 100
    const isTopTen = userRank <= 10

    return { rank: userRank, percentile, isTopTen }
  }, [userRank, leaderboard])

  // Auto-fetch on mount
  useEffect(() => {
    if (targetUserId) {
      fetchStats()
      fetchLeaderboard()
    }
  }, [targetUserId, fetchStats, fetchLeaderboard])

  return {
    stats,
    leaderboard,
    userRank,
    isLoading,
    error,
    fetchStats,
    fetchLeaderboard,
    generateReferralLink,
    copyReferralLink,
    shareReferralLink,
    getLeaderboardPosition
  }
}