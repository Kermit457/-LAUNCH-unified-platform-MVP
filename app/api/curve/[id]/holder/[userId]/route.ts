import { NextRequest, NextResponse } from 'next/server'
import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'

// GET /api/curve/[id]/holder/[userId] - Get user's holder position
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const params = await context.params
    const holder = await ServerCurveHolderService.getHolder(params.id, params.userId)

    if (!holder) {
      return NextResponse.json(
        { error: 'Holder position not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ holder })

  } catch (error) {
    console.error('Get holder error:', error)
    return NextResponse.json(
      { error: 'Failed to get holder' },
      { status: 500 }
    )
  }
}
