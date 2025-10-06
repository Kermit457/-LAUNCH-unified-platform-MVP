import { NextRequest, NextResponse } from 'next/server'
import { getLaunches, createLaunch } from '@/lib/appwrite/services/launches'

// GET /api/launches - Get all launches
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as 'live' | 'upcoming' | 'ended' | undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const sortBy = searchParams.get('sortBy') as 'recent' | 'marketCap' | 'volume' | 'conviction' | undefined

    const launches = await getLaunches({ status, limit, sortBy })

    return NextResponse.json({ launches }, { status: 200 })
  } catch (error: any) {
    console.error('GET /api/launches error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch launches' },
      { status: 500 }
    )
  }
}

// POST /api/launches - Create a new launch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ['tokenName', 'tokenSymbol', 'description', 'creatorId', 'creatorName']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const launch = await createLaunch(body)

    return NextResponse.json({ launch }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/launches error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create launch' },
      { status: 500 }
    )
  }
}
