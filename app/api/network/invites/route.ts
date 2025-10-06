import { NextRequest, NextResponse } from 'next/server'
import { getNetworkInvites, sendNetworkInvite } from '@/lib/appwrite/services/network'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') || undefined
    const type = searchParams.get('type') as 'sent' | 'received' | undefined

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const invites = await getNetworkInvites({ userId, status, type })

    return NextResponse.json(invites)
  } catch (error: any) {
    console.error('Failed to fetch network invites:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch network invites' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const invite = await sendNetworkInvite(data)

    return NextResponse.json(invite, { status: 201 })
  } catch (error: any) {
    console.error('Failed to send network invite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send network invite' },
      { status: 500 }
    )
  }
}
