import { NextRequest, NextResponse } from 'next/server'
import { extendRoom, getRoomById } from '@/lib/appwrite/services/blast-rooms'

// POST /api/blast/rooms/[id]/extend - Extend room by 24h (once per room)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const creatorId = body.creatorId

    if (!creatorId) {
      return NextResponse.json({
        success: false,
        error: 'Creator ID required',
      }, { status: 400 })
    }

    // Get room to verify ownership and extension status
    const room = await getRoomById(params.id)

    if (!room) {
      return NextResponse.json({
        success: false,
        error: 'Room not found',
      }, { status: 404 })
    }

    if (room.creatorId !== creatorId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - only room creator can extend',
      }, { status: 403 })
    }

    if (room.status === 'closed') {
      return NextResponse.json({
        success: false,
        error: 'Cannot extend closed room',
      }, { status: 400 })
    }

    if (room.extended) {
      return NextResponse.json({
        success: false,
        error: 'Room has already been extended (max 1 extension per room)',
      }, { status: 400 })
    }

    // Extend room by 24h
    const newEndTime = await extendRoom(params.id)

    return NextResponse.json({
      success: true,
      message: 'Room extended by 24 hours',
      newEndTime,
    })

  } catch (error) {
    console.error('Extend room error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extend room',
    }, { status: 500 })
  }
}
