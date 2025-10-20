import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile } from '@/lib/appwrite/services/users'
import { calculateLevel } from '@/lib/referral'
import { appwriteClient } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

const { database, referralsCollectionId } = appwriteClient

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const timeframe = searchParams.get('timeframe') || 'all' // all, month, week

    // Build query filters
    const queries: string[] = [
      Query.orderDesc('$createdAt'),
      Query.limit(1000)
    ]

    // Add timeframe filter
    if (timeframe === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      queries.push(Query.greaterThanEqual('$createdAt', monthAgo.toISOString()))
    } else if (timeframe === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      queries.push(Query.greaterThanEqual('$createdAt', weekAgo.toISOString()))
    }

    // Fetch referrals from database
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      referralsCollectionId,
      queries
    )

    // Aggregate by referrer
    const referrerStats = new Map<string, {
      referrerId: string
      totalReferrals: number
      totalEarnings: number
      recentReferrals: number
    }>()

    for (const doc of response.documents) {
      const referrerId = doc.referrerId as string | null
      if (!referrerId) continue

      const existing = referrerStats.get(referrerId) || {
        referrerId,
        totalReferrals: 0,
        totalEarnings: 0,
        recentReferrals: 0
      }

      existing.totalReferrals++
      existing.totalEarnings += (doc.referralAmount as number) || 0

      // Count recent referrals (last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const createdAt = new Date(doc.$createdAt)
      if (createdAt > weekAgo) {
        existing.recentReferrals++
      }

      referrerStats.set(referrerId, existing)
    }

    // Convert to array and sort by total earnings
    const leaderboardData = Array.from(referrerStats.values())
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(offset, offset + limit)

    // Enrich with user data and calculate levels
    const enrichedLeaderboard = await Promise.all(
      leaderboardData.map(async (entry, index) => {
        const user = await getUserProfile(entry.referrerId)
        const level = calculateLevel(entry.totalReferrals)

        return {
          rank: offset + index + 1,
          userId: entry.referrerId,
          username: user?.username || 'Unknown',
          displayName: user?.displayName || user?.username || 'Unknown',
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