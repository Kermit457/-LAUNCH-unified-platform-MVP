import { NextRequest, NextResponse } from 'next/server'
import { rejectApplicant } from '@/lib/appwrite/services/blast-applicants'

// POST /api/blast/rooms/[id]/reject/[userId] - Reject applicant
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const body = await req.json()
    const reviewerId = body.reviewerId

    if (!reviewerId) {
      return NextResponse.json({
        success: false,
        error: 'Reviewer ID required',
      }, { status: 400 })
    }

    // Reject applicant
    await rejectApplicant(params.id, params.userId, reviewerId)

    return NextResponse.json({
      success: true,
      message: 'Applicant rejected',
    })

  } catch (error) {
    console.error('Reject applicant error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject applicant',
    }, { status: 500 })
  }
}
