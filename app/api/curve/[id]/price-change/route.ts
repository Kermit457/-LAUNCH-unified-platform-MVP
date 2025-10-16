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
  } catch (error: any) {
    console.error('Failed to get price change:', error)

    // Provide more specific error messages
    if (error?.code === 404) {
      return NextResponse.json(
        {
          error: 'Price history collection not configured',
          details: 'Please ensure NEXT_PUBLIC_APPWRITE_PRICE_HISTORY_COLLECTION_ID is set and the collection exists in Appwrite',
          priceChange24h: null
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to calculate price change', details: error?.message },
      { status: 500 }
    )
  }
}
