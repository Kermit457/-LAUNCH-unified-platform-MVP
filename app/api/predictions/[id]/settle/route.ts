import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/predictions/:id/settle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { winningOption } = body

    if (!winningOption) {
      return NextResponse.json(
        { error: 'winningOption required' },
        { status: 400 }
      )
    }

    const prediction = await prisma.prediction.findUnique({
      where: { id: params.id },
    })

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      )
    }

    const options = prediction.options as string[]
    if (!options.includes(winningOption)) {
      return NextResponse.json(
        { error: 'Invalid winning option' },
        { status: 400 }
      )
    }

    const updated = await prisma.prediction.update({
      where: { id: params.id },
      data: {
        state: 'SETTLED',
        settledAt: new Date(),
        winningOption,
      },
    })

    return NextResponse.json({
      ok: true,
      winningOption: updated.winningOption,
    })
  } catch (error) {
    console.error('Error settling prediction:', error)
    return NextResponse.json(
      { error: 'Failed to settle prediction' },
      { status: 500 }
    )
  }
}
