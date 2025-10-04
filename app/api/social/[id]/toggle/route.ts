import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/social/:id/toggle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const action = await prisma.socialAction.findUnique({
      where: { id: params.id },
    })

    if (!action) {
      return NextResponse.json(
        { error: 'Social action not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.socialAction.update({
      where: { id: params.id },
      data: {
        active: !action.active,
      },
    })

    return NextResponse.json({
      ok: true,
      active: updated.active,
    })
  } catch (error) {
    console.error('Error toggling social action:', error)
    return NextResponse.json(
      { error: 'Failed to toggle social action' },
      { status: 500 }
    )
  }
}
