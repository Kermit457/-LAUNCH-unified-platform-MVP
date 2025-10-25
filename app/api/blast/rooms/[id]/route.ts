import { NextRequest, NextResponse } from 'next/server'
import { getRoomById } from '@/lib/appwrite/services/blast-rooms'

// GET /api/blast/rooms/[id] - Get single room
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const room = await getRoomById(params.id)

    if (!room) {
      return NextResponse.json({
        success: false,
        error: 'Room not found',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      room,
    })

  } catch (error) {
    console.error('Get room error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch room',
    }, { status: 500 })
  }
}
