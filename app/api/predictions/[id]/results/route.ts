import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/predictions/:id/results
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prediction = await prisma.prediction.findUnique({
      where: { id: params.id },
      include: {
        votes: true,
      },
    })

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      )
    }

    // Calculate tallies
    const tallies: Record<string, number> = {}
    const options = prediction.options as string[]

    options.forEach((option) => {
      tallies[option] = 0
    })

    prediction.votes.forEach((vote) => {
      if (tallies[vote.option] !== undefined) {
        tallies[vote.option] += vote.weight
      }
    })

    // Get winners if settled
    let winners = undefined
    if (prediction.state === 'SETTLED' && prediction.winningOption) {
      winners = prediction.votes
        .filter((vote) => vote.option === prediction.winningOption)
        .map((vote) => ({
          userId: vote.userId,
          weight: vote.weight,
        }))
    }

    return NextResponse.json({
      id: prediction.id,
      state: prediction.state,
      tallies,
      winningOption: prediction.winningOption,
      winners,
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}
