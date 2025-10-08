import { NextRequest, NextResponse } from 'next/server'
import { mockPredictions, mockVotes } from '@/lib/mock-data'
import { hashIp, getClientIp } from '@/lib/utils'

// POST /api/predictions/:id/vote
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    let { userId, option } = body

    if (!option) {
      return NextResponse.json(
        { error: 'option required' },
        { status: 400 }
      )
    }

    const prediction = mockPredictions.find((p) => p.id === params.id)

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      )
    }

    if (prediction.state !== 'OPEN') {
      return NextResponse.json(
        { error: 'Prediction is not open for voting' },
        { status: 400 }
      )
    }

    if (!prediction.options.includes(option)) {
      return NextResponse.json(
        { error: 'Invalid option' },
        { status: 400 }
      )
    }

    // Generate anonymous userId if not provided
    if (!userId) {
      const ip = getClientIp(request)
      const ua = request.headers.get('user-agent') || ''
      userId = hashIp(`${ip}:${ua}`)
    }

    // Record vote and update tallies
    const voteKey = `${params.id}:${userId}`
    const previousVote = mockVotes.get(voteKey)

    // Remove previous vote from tally
    if (previousVote && prediction.tallies[previousVote] !== undefined) {
      prediction.tallies[previousVote] -= 1
    }

    // Add new vote to tally
    if (prediction.tallies[option] !== undefined) {
      prediction.tallies[option] += 1
    } else {
      prediction.tallies[option] = 1
    }

    // Store the vote
    mockVotes.set(voteKey, option)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    )
  }
}
