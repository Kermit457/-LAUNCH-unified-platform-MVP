import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id

    // Get campaign
    const campaign = await databases.getDocument(
      DB_ID,
      COLLECTIONS.CAMPAIGNS,
      campaignId
    )

    // Get submissions
    const submissions = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.SUBMISSIONS,
      [
        Query.equal('campaignId', campaignId),
        Query.limit(1000)
      ]
    )

    const approved = submissions.documents.filter(s => s.status === 'approved')
    const pending = submissions.documents.filter(s => s.status === 'pending')
    const rejected = submissions.documents.filter(s => s.status === 'rejected')

    const totalPaid = approved.reduce((sum, s) => sum + (s.earnings || 0), 0)
    const totalViews = approved.reduce((sum, s) => sum + (s.views || 0), 0)
    const uniqueCreators = new Set(submissions.documents.map(s => s.userId)).size

    return NextResponse.json({
      budget: campaign.budget,
      budgetPaid: totalPaid,
      budgetRemaining: campaign.budget - totalPaid,
      percentPaid: Math.round((totalPaid / campaign.budget) * 100),
      submissions: {
        total: submissions.documents.length,
        approved: approved.length,
        pending: pending.length,
        rejected: rejected.length
      },
      totalViews,
      uniqueCreators,
      averageEarningsPerSubmission: approved.length > 0 ? totalPaid / approved.length : 0
    })
  } catch (error) {
    console.error('Error fetching campaign stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign stats' },
      { status: 500 }
    )
  }
}
