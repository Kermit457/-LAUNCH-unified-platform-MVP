import { NextRequest, NextResponse } from 'next/server'
import { mockSocialActions } from '@/lib/mock-data'

// GET /api/social?streamer=<id>
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

    const actions = mockSocialActions
      .filter((a) => a.streamerId === streamerId && a.active)
      .map((a) => ({
        id: a.id,
        label: a.label,
        targetUrl: a.targetUrl,
        counter: a.counter,
        goal: a.goal,
      }))

    return NextResponse.json(actions)
  } catch (error) {
    console.error('Error fetching social actions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social actions' },
      { status: 500 }
    )
  }
}

// POST /api/social - Create new social action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { streamerId, actionKey, label, targetUrl, goal } = body

    if (!streamerId || !actionKey || !label || !targetUrl) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const action = await prisma.socialAction.create({
      data: {
        id: generateId(),
        streamerId,
        actionKey,
        label,
        targetUrl,
        goal: goal || 0,
      },
    })

    return NextResponse.json({
      id: action.id,
      actionKey: action.actionKey,
    })
  } catch (error) {
    console.error('Error creating social action:', error)
    return NextResponse.json(
      { error: 'Failed to create social action' },
      { status: 500 }
    )
  }
}
