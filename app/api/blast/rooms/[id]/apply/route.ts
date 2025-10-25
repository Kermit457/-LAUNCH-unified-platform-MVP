import { NextRequest, NextResponse } from 'next/server'
import { applyToRoom } from '@/lib/appwrite/services/blast-applicants'
import { withRateLimit, getRateLimitHeaders, checkRateLimit } from '@/lib/blast/rate-limiter'
import { runSybilCheck, logSybilDetection, calculateSybilPenalty } from '@/lib/blast/sybil-resistance'
import { z } from 'zod'

// Validation schema
const applySchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  userWallet: z.string(),
  walletType: z.enum(['embedded', 'external']).optional().default('embedded'),
  userMotionScore: z.number().optional().default(0),
  message: z.string().min(10).max(2000),
  keysStaked: z.number().min(0),
  depositAmount: z.number().min(0),
  attachments: z.array(z.string()).max(3).optional().default([]),
})

// POST /api/blast/rooms/[id]/apply - Apply to room
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = applySchema.parse(body)

    // 1. Rate limiting check
    const rateLimitResult = await withRateLimit(validatedData.userId, 'applyToRoom')
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
      validatedData.userId,
      validatedData.userWallet,
      ipAddress,
      validatedData.walletType
    )

    // Block high severity Sybil attacks
    if (!sybilResult.allowAction) {
      await logSybilDetection(validatedData.userId, sybilResult, 'apply_to_room')
      return NextResponse.json(
        {
          success: false,
          error: 'Account verification required',
          details: sybilResult.flags,
        },
        { status: 403 }
      )
    }

    // Apply Sybil penalty to priority score (medium/low severity)
    const sybilPenalty = calculateSybilPenalty(sybilResult.severity)
    const adjustedMotionScore = Math.max(0, (validatedData.userMotionScore || 0) + sybilPenalty)

    // Log medium/low severity detections
    if (sybilResult.severity !== 'none') {
      await logSybilDetection(validatedData.userId, sybilResult, 'apply_to_room')
    }

    // 3. Apply to room with adjusted score
    const application = await applyToRoom(params.id, {
      ...validatedData,
      userMotionScore: adjustedMotionScore,
    })

    // 4. Get rate limit headers for response
    const rateLimitStatus = await checkRateLimit(validatedData.userId, 'applyToRoom')
    const headers = getRateLimitHeaders(
      'applyToRoom',
      rateLimitStatus.remaining,
      rateLimitStatus.resetAt
    )

    return NextResponse.json(
      {
        success: true,
        application,
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

    console.error('Apply to room error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to apply to room',
    }, { status: 500 })
  }
}
