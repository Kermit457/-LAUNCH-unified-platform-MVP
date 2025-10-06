import { NextRequest, NextResponse } from 'next/server'
import { getPayouts, createPayout } from '@/lib/appwrite/services/payouts'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || undefined
    const status = searchParams.get('status') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const payouts = await getPayouts({ userId, status, limit })

    return NextResponse.json(payouts)
  } catch (error: any) {
    console.error('Failed to fetch payouts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payouts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const payout = await createPayout(data)

    return NextResponse.json(payout, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create payout:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payout' },
      { status: 500 }
    )
  }
}
