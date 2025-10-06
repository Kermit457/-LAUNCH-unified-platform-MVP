import { NextRequest, NextResponse } from 'next/server'
import { getSubmissions, createSubmission } from '@/lib/appwrite/services/submissions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || undefined
    const campaignId = searchParams.get('campaignId') || undefined
    const questId = searchParams.get('questId') || undefined
    const status = searchParams.get('status') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const submissions = await getSubmissions({ userId, campaignId, questId, status, limit })

    return NextResponse.json(submissions)
  } catch (error: any) {
    console.error('Failed to fetch submissions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const submission = await createSubmission(data)

    return NextResponse.json(submission, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create submission:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create submission' },
      { status: 500 }
    )
  }
}
