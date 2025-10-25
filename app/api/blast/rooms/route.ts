import { NextRequest, NextResponse } from 'next/server'
import { createRoom, getRooms } from '@/lib/appwrite/services/blast-rooms'
import { withRateLimit, getRateLimitHeaders, checkRateLimit } from '@/lib/blast/rate-limiter'
import { runSybilCheck, logSybilDetection } from '@/lib/blast/sybil-resistance'
import { z } from 'zod'

// Validation schema
const createRoomSchema = z.object({
  type: z.enum(['deal', 'airdrop', 'job', 'collab', 'funding']),
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(2000),
  creatorId: z.string(),
  creatorName: z.string(),
  creatorAvatar: z.string().optional(),
  creatorWallet: z.string(),
  walletType: z.enum(['embedded', 'external']).optional().default('embedded'),
  creatorMotionScore: z.number().optional().default(0),
  duration: z.enum(['24h', '48h', '72h']).default('72h'),
  minKeys: z.number().min(0).default(0),
  totalSlots: z.number().min(1).max(100),
  tags: z.array(z.string()).max(5).optional().default([]),
})

// POST /api/blast/rooms - Create a new room
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = createRoomSchema.parse(body)

    // 1. Rate limiting check (3 rooms per day)
    const rateLimitResult = await withRateLimit(validatedData.creatorId, 'createRoom')
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitResult.error,
        },
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      )
    }

    // 2. Sybil resistance check
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const sybilResult = await runSybilCheck(
      validatedData.creatorId,
      validatedData.creatorWallet,
      ipAddress,
      validatedData.walletType
    )

    // Block high severity Sybil attacks
    if (!sybilResult.allowAction) {
      await logSybilDetection(validatedData.creatorId, sybilResult, 'create_room')
      return NextResponse.json(
        {
          success: false,
          error: 'Account verification required',
          details: sybilResult.flags,
        },
        { status: 403 }
      )
    }

    // Log medium/low severity detections
    if (sybilResult.severity !== 'none') {
      await logSybilDetection(validatedData.creatorId, sybilResult, 'create_room')
    }

    // 3. Create room
    const room = await createRoom(validatedData)

    // 4. Get rate limit headers for response
    const rateLimitStatus = await checkRateLimit(validatedData.creatorId, 'createRoom')
    const headers = getRateLimitHeaders(
      'createRoom',
      rateLimitStatus.remaining,
      rateLimitStatus.resetAt
    )

    return NextResponse.json(
      {
        success: true,
        room,
        warnings: sybilResult.flags.length > 0 ? sybilResult.flags : undefined,
      },
      {
        status: 201,
        headers,
      }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 })
    }

    console.error('Create room error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create room',
    }, { status: 500 })
  }
}

// GET /api/blast/rooms - List rooms with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const filters = {
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      creatorId: searchParams.get('creatorId') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
    }

    const rooms = await getRooms(filters)

    return NextResponse.json({
      success: true,
      rooms,
      total: rooms.length,
    })

  } catch (error) {
    console.error('Get rooms error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch rooms',
    }, { status: 500 })
  }
}
