import { NextRequest, NextResponse } from 'next/server'
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'

// POST /api/curve/create - Create a new curve
export async function POST(request: NextRequest) {
  try {
    const { ownerType, ownerId, basePrice } = await request.json()

    if (!ownerType || !ownerId) {
      return NextResponse.json(
        { error: 'Missing required fields: ownerType, ownerId' },
        { status: 400 }
      )
    }

    if (ownerType !== 'user' && ownerType !== 'project') {
      return NextResponse.json(
        { error: 'ownerType must be "user" or "project"' },
        { status: 400 }
      )
    }

    // Check if curve already exists for this owner
    const existingCurve = await ServerCurveService.getCurveByOwner(ownerType, ownerId)
    if (existingCurve) {
      return NextResponse.json(
        { error: 'Curve already exists for this owner', curve: existingCurve },
        { status: 409 }
      )
    }

    // Create curve
    const curve = await ServerCurveService.createCurve({
      ownerType,
      ownerId,
      basePrice: basePrice || 0.01 // Default to 0.01 SOL
    })

    return NextResponse.json({
      success: true,
      curve,
      message: 'Curve created successfully'
    })

  } catch (error) {
    console.error('Create curve error:', error)
    return NextResponse.json(
      { error: 'Failed to create curve' },
      { status: 500 }
    )
  }
}
