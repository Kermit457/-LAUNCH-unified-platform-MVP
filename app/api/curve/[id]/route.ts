import { NextRequest, NextResponse } from 'next/server'
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'

// GET /api/curve/[id] - Get curve details with stats
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const searchParams = request.nextUrl.searchParams
    const includeHolders = searchParams.get('includeHolders') === 'true'
    const includeEvents = searchParams.get('includeEvents') === 'true'

    // Get curve
    const curve = await ServerCurveService.getCurveById(params.id)
    if (!curve) {
      return NextResponse.json(
        { error: 'Curve not found' },
        { status: 404 }
      )
    }

    // Build response
    const response: any = { curve }

    // Get 24h volume and fees
    const volume = await ServerCurveEventService.get24hVolume(params.id)
    const fees = await ServerCurveEventService.getFeeBreakdown(params.id)
    response.stats = {
      volume24h: volume,
      fees
    }

    // Include top holders if requested
    if (includeHolders) {
      const holders = await ServerCurveHolderService.getHoldersByCurve(params.id, 10)
      response.holders = holders
    }

    // Include recent events if requested
    if (includeEvents) {
      const events = await ServerCurveEventService.getEventsByCurve(params.id, 20)
      response.events = events
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Get curve error:', error)
    return NextResponse.json(
      { error: 'Failed to get curve' },
      { status: 500 }
    )
  }
}
