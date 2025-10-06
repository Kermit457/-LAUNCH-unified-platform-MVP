import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const launchId = params.id

    // Get all submissions for this launch
    const submissions = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.SUBMISSIONS,
      [
        Query.equal('launchId', launchId),
        Query.equal('status', 'approved'),
        Query.limit(100),
        Query.orderDesc('earnings')
      ]
    )

    // Aggregate by user
    const contributorMap = new Map()
    for (const sub of submissions.documents) {
      const existing = contributorMap.get(sub.userId) || {
        userId: sub.userId,
        userName: sub.userName || 'Anonymous',
        userAvatar: sub.userAvatar,
        totalEarnings: 0,
        submissionsCount: 0
      }
      existing.totalEarnings += sub.earnings || 0
      existing.submissionsCount += 1
      contributorMap.set(sub.userId, existing)
    }

    const contributors = Array.from(contributorMap.values())
      .sort((a, b) => b.totalEarnings - a.totalEarnings)

    return NextResponse.json({
      contributors,
      totalContributors: contributors.length,
      totalEarningsPaid: contributors.reduce((sum, c) => sum + c.totalEarnings, 0)
    })
  } catch (error) {
    console.error('Error fetching contributors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contributors' },
      { status: 500 }
    )
  }
}
