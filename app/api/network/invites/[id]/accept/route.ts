import { NextRequest, NextResponse } from 'next/server'
import { acceptNetworkInvite } from '@/lib/appwrite/services/network'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invite = await acceptNetworkInvite(params.id)

    return NextResponse.json(invite)
  } catch (error: any) {
    console.error('Failed to accept invite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to accept invite' },
      { status: 500 }
    )
  }
}
