import { NextRequest, NextResponse } from 'next/server'
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Get curve
    const curve = await ServerCurveService.getCurveById(params.id)
    if (!curve) {
      return NextResponse.json(
        { error: 'Curve not found' },
        { status: 404 }
      )
    }

    // Verify user is the owner
    if (curve.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Only the owner can freeze their curve' },
        { status: 403 }
      )
    }

    // Check curve state - can only freeze from active
    if (curve.state !== 'active') {
      return NextResponse.json(
        { error: `Curve is already ${curve.state}` },
        { status: 400 }
      )
    }

    // Check minimum supply requirement (e.g., 100 keys minimum)
    const MIN_SUPPLY_FOR_LAUNCH = 100
    if (curve.supply < MIN_SUPPLY_FOR_LAUNCH) {
      return NextResponse.json(
        { error: `Minimum ${MIN_SUPPLY_FOR_LAUNCH} keys required to launch` },
        { status: 400 }
      )
    }

    // Freeze the curve
    const frozenCurve = await ServerCurveService.freezeCurve(params.id)

    if (!frozenCurve) {
      return NextResponse.json(
        { error: 'Failed to freeze curve' },
        { status: 500 }
      )
    }

    // Create freeze event
    await ServerCurveEventService.createEvent({
      curveId: params.id,
      type: 'freeze',
      amount: 0,
      price: curve.price,
      userId,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      curve: frozenCurve,
      message: 'Curve frozen. Ready for snapshot and launch.'
    })

  } catch (error) {
    console.error('Freeze error:', error)
    return NextResponse.json(
      { error: 'Failed to freeze curve' },
      { status: 500 }
    )
  }
}
