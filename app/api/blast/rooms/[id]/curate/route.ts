import { NextRequest, NextResponse } from 'next/server'
import { updateRoomTags, rankApplicant } from '@/lib/appwrite/services/blast-rooms'
import { lockKeysForRoom } from '@/lib/appwrite/services/blast-vault'
import { z } from 'zod'

// Validation schema
const curateSchema = z.object({
  curatorId: z.string(),
  action: z.enum(['tag', 'rank']),
  // For tagging
  tags: z.array(z.string()).max(5).optional(),
  // For ranking
  applicantId: z.string().optional(),
  priorityBoost: z.number().min(0).max(10).optional(),
  // Curator bond
  keysStaked: z.number().min(5).max(25),
})

// POST /api/blast/rooms/[id]/curate - Curator actions (tag rooms, rank applicants)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = curateSchema.parse(body)

    // Lock curator bond (5-25 keys)
    await lockKeysForRoom(
      validatedData.curatorId,
      params.id,
      validatedData.keysStaked,
      'curator_bond'
    )

    // Perform curation action
    if (validatedData.action === 'tag' && validatedData.tags) {
      await updateRoomTags(params.id, validatedData.tags)
    } else if (validatedData.action === 'rank' && validatedData.applicantId) {
      await rankApplicant(
        params.id,
        validatedData.applicantId,
        validatedData.priorityBoost || 0
      )
    }

    return NextResponse.json({
      success: true,
      message: `Room ${validatedData.action}ed successfully`,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 })
    }

    console.error('Curate room error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to curate room',
    }, { status: 500 })
  }
}
