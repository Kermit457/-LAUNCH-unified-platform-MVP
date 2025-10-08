import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateId } from '@/lib/utils'

// POST /api/predictions - Create new prediction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { streamerId, question, options } = body

    if (!streamerId || !question || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const prediction = await prisma.prediction.create({
      data: {
        id: generateId(),
        streamerId,
        question,
        options,
        state: 'OPEN',
      },
    })

    return NextResponse.json({
      id: prediction.id,
      state: prediction.state,
    })
  } catch (error) {
    console.error('Error creating prediction:', error)
    return NextResponse.json(
      { error: 'Failed to create prediction' },
      { status: 500 }
    )
  }
}
