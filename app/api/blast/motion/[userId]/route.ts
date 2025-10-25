import { NextRequest, NextResponse } from 'next/server'
import { getMotionScore, getMotionEvents } from '@/lib/appwrite/services/blast-motion'

// GET /api/blast/motion/[userId] - Get user's Motion Score with breakdown
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const includeBreakdown = searchParams.get('breakdown') === 'true'

    // Get motion score
    const motionScore = await getMotionScore(params.userId)

    if (!motionScore) {
      return NextResponse.json({
        success: false,
        error: 'Motion score not found',
      }, { status: 404 })
    }

    // Get event breakdown if requested
    let events = null
    if (includeBreakdown) {
      events = await getMotionEvents(params.userId, 100) // Last 100 events
    }

    return NextResponse.json({
      success: true,
      motionScore,
      events,
    })

  } catch (error) {
    console.error('Get motion score error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch motion score',
    }, { status: 500 })
  }
}
