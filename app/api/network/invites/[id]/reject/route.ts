import { NextRequest, NextResponse } from 'next/server'
import { rejectNetworkInvite } from '@/lib/appwrite/services/network'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invite = await rejectNetworkInvite(params.id)

    return NextResponse.json(invite)
  } catch (error: any) {
    console.error('Failed to reject invite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reject invite' },
      { status: 500 }
    )
  }
}
