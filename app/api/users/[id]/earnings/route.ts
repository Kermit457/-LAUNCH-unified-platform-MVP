import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Get all approved submissions
    const submissions = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.SUBMISSIONS,
      [
        Query.equal('userId', userId),
        Query.equal('status', 'approved'),
        Query.limit(1000),
        Query.orderDesc('$createdAt')
      ]
    )

    // Get all payouts
    const payouts = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.PAYOUTS,
      [
        Query.equal('userId', userId),
        Query.limit(1000),
        Query.orderDesc('$createdAt')
      ]
    )

    const totalEarned = submissions.documents.reduce((sum, s) => sum + (s.earnings || 0), 0)
    const totalPaid = payouts.documents
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (p.net || p.amount), 0)
    const claimable = payouts.documents
      .filter(p => p.status === 'claimable')
      .reduce((sum, p) => sum + (p.net || p.amount), 0)

    return NextResponse.json({
      totalEarned,
      totalPaid,
      claimable,
      pendingReview: totalEarned - (totalPaid + claimable),
      submissions: {
        total: submissions.documents.length,
        totalViews: submissions.documents.reduce((sum, s) => sum + (s.views || 0), 0)
      },
      payouts: {
        total: payouts.documents.length,
        pending: payouts.documents.filter(p => p.status === 'pending').length,
        claimed: payouts.documents.filter(p => p.status === 'claimed').length,
        paid: payouts.documents.filter(p => p.status === 'paid').length
      }
    })
  } catch (error) {
    console.error('Error fetching user earnings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user earnings' },
      { status: 500 }
    )
  }
}
