import { NextRequest, NextResponse } from 'next/server'
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
import { calculateSellProceeds, calculatePrice } from '@/lib/curve/bonding-math'
import { recordPriceSnapshot } from '@/lib/appwrite/services/price-history'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { keys, userId } = await request.json()

    if (!keys || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check curve state
    if (curve.state !== 'active') {
      return NextResponse.json(
        { error: `Curve is ${curve.state}, trading disabled` },
        { status: 400 }
      )
    }

    // Check user has enough keys
    const holder = await ServerCurveHolderService.getHolder(params.id, userId)
    if (!holder || holder.balance < keys) {
      return NextResponse.json(
        { error: 'Insufficient keys to sell' },
        { status: 400 }
      )
    }

    // Calculate sell proceeds using bonding curve math
    const solProceeds = calculateSellProceeds(curve.supply, keys)
    const newSupply = curve.supply - keys
    const newPrice = calculatePrice(newSupply)

    // Check reserve has enough funds
    if (curve.reserve < solProceeds) {
      return NextResponse.json(
        { error: 'Insufficient reserve liquidity' },
        { status: 400 }
      )
    }

    // TODO: In production, execute payout transaction here
    // For now, we're mocking the payout

    // Update curve state
    const newReserve = curve.reserve - solProceeds
    const volume24h = curve.volume24h + solProceeds
    const volumeTotal = curve.volumeTotal + solProceeds
    const marketCap = newSupply * newPrice

    await ServerCurveService.updateCurve(params.id, {
      supply: newSupply,
      price: newPrice,
      reserve: newReserve,
      volume24h,
      volumeTotal,
      marketCap
    })

    // Create event
    const event = await ServerCurveEventService.createEvent({
      curveId: params.id,
      type: 'sell',
      amount: solProceeds,
      price: newPrice,
      keys,
      userId,
      timestamp: new Date().toISOString()
    })

    // Update holder position
    const updatedHolder = await ServerCurveHolderService.processSell(
      params.id,
      userId,
      keys,
      newPrice,
      solProceeds
    )

    // Check if holder sold all keys
    if (!updatedHolder || updatedHolder.balance === 0) {
      // Holder exited position
      await ServerCurveService.updateCurve(params.id, {
        holders: Math.max(0, curve.holders - 1)
      })
    }

    // Record price snapshot for 24h tracking
    try {
      await recordPriceSnapshot(params.id, newSupply, newPrice)
    } catch (snapshotError) {
      console.error('Failed to record price snapshot:', snapshotError)
      // Don't fail the transaction if snapshot recording fails
    }

    // Return updated curve and holder data
    const updatedCurve = await ServerCurveService.getCurveById(params.id)

    return NextResponse.json({
      success: true,
      curve: updatedCurve,
      holder: updatedHolder,
      event,
      solProceeds
    })

  } catch (error) {
    console.error('Sell error:', error)
    return NextResponse.json(
      { error: 'Failed to process sell' },
      { status: 500 }
    )
  }
}
