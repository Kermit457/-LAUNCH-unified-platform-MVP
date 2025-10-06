import { NextRequest, NextResponse } from 'next/server'
import { getCampaigns, createCampaign } from '@/lib/appwrite/services/campaigns'

// GET /api/campaigns - Get all campaigns
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as 'bounty' | 'quest' | 'airdrop' | undefined
    const status = searchParams.get('status') as 'active' | 'completed' | 'cancelled' | undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const campaigns = await getCampaigns({ type, status, limit })

    return NextResponse.json({ campaigns }, { status: 200 })
  } catch (error: any) {
    console.error('GET /api/campaigns error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ['title', 'description', 'type', 'creatorId', 'creatorName', 'budget', 'deadline']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const campaign = await createCampaign(body)

    return NextResponse.json({ campaign }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/campaigns error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create campaign' },
      { status: 500 }
    )
  }
}
