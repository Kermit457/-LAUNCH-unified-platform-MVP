import { NextRequest, NextResponse } from 'next/server'
import { approveSubmission } from '@/lib/appwrite/services/submissions'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { earnings, notes } = await request.json()

    const submission = await approveSubmission(params.id, earnings, notes)

    return NextResponse.json(submission)
  } catch (error: any) {
    console.error('Failed to approve submission:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to approve submission' },
      { status: 500 }
    )
  }
}
