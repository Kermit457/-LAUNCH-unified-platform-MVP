import { NextRequest, NextResponse } from 'next/server'
import { claimPayout } from '@/lib/appwrite/services/payouts'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payout = await claimPayout(params.id)

    return NextResponse.json(payout)
  } catch (error: any) {
    console.error('Failed to claim payout:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to claim payout' },
      { status: 500 }
    )
  }
}
