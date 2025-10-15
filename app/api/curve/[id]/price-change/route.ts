import { NextRequest, NextResponse } from 'next/server'
import { calculate24hPriceChange } from '@/lib/appwrite/services/price-history'
import { calculatePrice } from '@/lib/curve/bonding-math'
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: curveId } = params

    // Get current curve data
    const curve = await ServerCurveService.getCurveById(curveId)
    if (!curve) {
      return NextResponse.json(
        { error: 'Curve not found' },
        { status: 404 }
      )
    }

    // Calculate current price based on current supply
    const currentPrice = calculatePrice(curve.supply)

    // Get 24h price change
    const priceChange24h = await calculate24hPriceChange(curveId, currentPrice)

    return NextResponse.json({
      curveId,
      currentPrice,
      priceChange24h,
      supply: curve.supply,
    })
  } catch (error) {
    console.error('Failed to get price change:', error)
    return NextResponse.json(
      { error: 'Failed to calculate price change' },
      { status: 500 }
    )
  }
}
