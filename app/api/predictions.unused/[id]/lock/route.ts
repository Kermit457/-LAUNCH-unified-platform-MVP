import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/predictions/:id/lock
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prediction = await prisma.prediction.findUnique({
      where: { id: params.id },
    })

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      )
    }

    if (prediction.state !== 'OPEN') {
      return NextResponse.json(
        { error: 'Can only lock OPEN predictions' },
        { status: 400 }
      )
    }

    const updated = await prisma.prediction.update({
      where: { id: params.id },
      data: {
        state: 'LOCKED',
        lockedAt: new Date(),
      },
    })

    return NextResponse.json({ ok: true, state: updated.state })
  } catch (error) {
    console.error('Error locking prediction:', error)
    return NextResponse.json(
      { error: 'Failed to lock prediction' },
      { status: 500 }
    )
  }
}
