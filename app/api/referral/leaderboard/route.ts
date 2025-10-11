import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/appwrite/services/referrals'
import { getUserById } from '@/lib/appwrite/services/users'
import { calculateLevel } from '@/lib/referral'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const timeframe = searchParams.get('timeframe') || 'all' // all, month, week

    // For now, we'll fetch all referrals and aggregate them
    // In production, you'd want to use a more efficient approach with caching
    const allReferrals = await ReferralService.getReferralsByAction(
      'profile_creation',
      1000,
      0
    )

    // Filter by timeframe
    let filteredReferrals = allReferrals
    if (timeframe === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      filteredReferrals = allReferrals.filter(
        r => new Date(r.timestamp) > monthAgo
      )
    } else if (timeframe === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      filteredReferrals = allReferrals.filter(
        r => new Date(r.timestamp) > weekAgo
      )
    }

    // Aggregate by referrer
    const referrerStats = new Map<string, {
      referrerId: string
      totalReferrals: number
      totalEarnings: number
      recentReferrals: number
    }>()

    for (const referral of filteredReferrals) {
      if (!referral.referrerId) continue

      const existing = referrerStats.get(referral.referrerId) || {
        referrerId: referral.referrerId,
        totalReferrals: 0,
        totalEarnings: 0,
        recentReferrals: 0
      }

      existing.totalReferrals++
      existing.totalEarnings += referral.referralAmount

      // Count recent referrals (last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      if (new Date(referral.timestamp) > weekAgo) {
        existing.recentReferrals++
      }

      referrerStats.set(referral.referrerId, existing)
    }

    // Convert to array and sort by total earnings
    const leaderboardData = Array.from(referrerStats.values())
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(offset, offset + limit)

    // Enrich with user data and calculate levels
    const enrichedLeaderboard = await Promise.all(
      leaderboardData.map(async (entry, index) => {
        const user = await getUserById(entry.referrerId)
        const level = calculateLevel(entry.totalReferrals)

        return {
          rank: offset + index + 1,
          userId: entry.referrerId,
          username: user?.username || 'Unknown',
          handle: user?.handle || '',
          avatar: user?.avatar || '',
          totalReferrals: entry.totalReferrals,
          totalEarnings: entry.totalEarnings,
          recentReferrals: entry.recentReferrals,
          level: level.level,
          levelName: level.name,
          nextLevelProgress: level.nextLevelProgress
        }
      })
    )

    return NextResponse.json({
      leaderboard: enrichedLeaderboard,
      pagination: {
        limit,
        offset,
        total: referrerStats.size
      }
    })
  } catch (error) {
    console.error('Error fetching referral leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}