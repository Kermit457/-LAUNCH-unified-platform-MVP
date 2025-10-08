import { NextRequest, NextResponse } from 'next/server'
import { mockPredictions } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

// GET /api/predictions/active?streamer=<id>
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const streamerId = searchParams.get('streamer')

    if (!streamerId) {
      return NextResponse.json(
        { error: 'streamer parameter required' },
        { status: 400 }
      )
    }

    // Find the most recent OPEN or LOCKED prediction
    const prediction = mockPredictions.find(
      (p) => p.streamerId === streamerId && (p.state === 'OPEN' || p.state === 'LOCKED')
    )

    if (!prediction) {
      return NextResponse.json({ prediction: null })
    }

    return NextResponse.json({
      id: prediction.id,
      streamerId: prediction.streamerId,
      question: prediction.question,
      options: prediction.options,
      state: prediction.state,
      tallies: prediction.tallies,
    })
  } catch (error) {
    console.error('Error fetching active prediction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active prediction' },
      { status: 500 }
    )
  }
}
