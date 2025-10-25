import { NextRequest, NextResponse } from 'next/server'
import { unlockKeys } from '@/lib/appwrite/services/blast-vault'
import { z } from 'zod'

// Validation schema
const withdrawSchema = z.object({
  userId: z.string(),
  lockId: z.string(),
  reason: z.string().optional(),
})

// POST /api/blast/vault/withdraw - Unlock keys from vault
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = withdrawSchema.parse(body)

    // Unlock keys
    await unlockKeys(validatedData.userId, validatedData.lockId, validatedData.reason)

    return NextResponse.json({
      success: true,
      message: 'Keys unlocked successfully',
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 })
    }

    console.error('Withdraw error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unlock keys',
    }, { status: 500 })
  }
}
