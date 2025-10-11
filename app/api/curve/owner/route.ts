import { NextRequest, NextResponse } from 'next/server'
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'

// GET /api/curve/owner?ownerType=user&ownerId=123 - Get curve by owner
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ownerType = searchParams.get('ownerType') as 'user' | 'project'
    const ownerId = searchParams.get('ownerId')

    if (!ownerType || !ownerId) {
      return NextResponse.json(
        { error: 'Missing ownerType or ownerId' },
        { status: 400 }
      )
    }

    const curve = await ServerCurveService.getCurveByOwner(ownerType, ownerId)

    if (!curve) {
      return NextResponse.json(
        { error: 'Curve not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ curve })

  } catch (error) {
    console.error('Get curve by owner error:', error)
    return NextResponse.json(
      { error: 'Failed to get curve' },
      { status: 500 }
    )
  }
}
