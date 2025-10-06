import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export async function GET(req: NextRequest) {
  const timeframe = req.nextUrl.searchParams.get('timeframe') || 'all' // all, week, month
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10')

  try {
    // Get all users with earnings
    const users = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.USERS,
      [
        Query.orderDesc('totalEarnings'),
        Query.limit(limit)
      ]
    )

    const leaderboard = users.documents.map((user, index) => ({
      rank: index + 1,
      userId: user.$id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      totalEarnings: user.totalEarnings || 0,
      reputation: user.reputation || 0
    }))

    return NextResponse.json({ leaderboard, timeframe })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
