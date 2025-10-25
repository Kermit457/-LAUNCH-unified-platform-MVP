import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/appwrite/services/blast-motion'

// GET /api/blast/leaderboard - Get top users by Motion Score
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const timeframe = searchParams.get('timeframe') || 'all' // all, week, month

    // Get leaderboard
    const leaderboard = await getLeaderboard(limit, offset)

    // Calculate ranks
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: offset + index + 1,
      medal: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null,
    }))

    return NextResponse.json({
      success: true,
      leaderboard: rankedLeaderboard,
      total: leaderboard.length,
      limit,
      offset,
    })

  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leaderboard',
    }, { status: 500 })
  }
}
