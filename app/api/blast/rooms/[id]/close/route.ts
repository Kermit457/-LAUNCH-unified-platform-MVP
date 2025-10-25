import { NextRequest, NextResponse } from 'next/server'
import { closeRoom, getRoomById } from '@/lib/appwrite/services/blast-rooms'
import { processRefunds } from '@/lib/appwrite/services/blast-vault'

// POST /api/blast/rooms/[id]/close - Manually close a room
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

    // Get room to verify ownership
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
        error: 'Unauthorized - only room creator can close',
      }, { status: 403 })
    }

    if (room.status === 'closed') {
      return NextResponse.json({
        success: false,
        error: 'Room is already closed',
      }, { status: 400 })
    }

    // Close room
    await closeRoom(params.id)

    // Process refunds for all applicants
    await processRefunds(params.id)

    return NextResponse.json({
      success: true,
      message: 'Room closed successfully',
    })

  } catch (error) {
    console.error('Close room error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to close room',
    }, { status: 500 })
  }
}
