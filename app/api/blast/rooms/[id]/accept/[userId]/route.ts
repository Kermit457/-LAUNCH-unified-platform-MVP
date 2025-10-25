import { NextRequest, NextResponse } from 'next/server'
import { acceptApplicant } from '@/lib/appwrite/services/blast-applicants'

// POST /api/blast/rooms/[id]/accept/[userId] - Accept applicant
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

    // Accept applicant
    await acceptApplicant(params.id, params.userId, reviewerId)

    return NextResponse.json({
      success: true,
      message: 'Applicant accepted',
    })

  } catch (error) {
    console.error('Accept applicant error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to accept applicant',
    }, { status: 500 })
  }
}
