import { NextRequest, NextResponse } from 'next/server'
import { getCampaign, updateCampaign, deleteCampaign } from '@/lib/appwrite/services/campaigns'

// GET /api/campaigns/[id] - Get a single campaign
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await getCampaign(params.id)
    return NextResponse.json({ campaign }, { status: 200 })
  } catch (error: any) {
    console.error(`GET /api/campaigns/${params.id} error:`, error)
    if (error.code === 404) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaign' },
      { status: 500 }
    )
  }
}

// PATCH /api/campaigns/[id] - Update a campaign
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const campaign = await updateCampaign(params.id, body)
    return NextResponse.json({ campaign }, { status: 200 })
  } catch (error: any) {
    console.error(`PATCH /api/campaigns/${params.id} error:`, error)
    if (error.code === 404) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update campaign' },
      { status: 500 }
    )
  }
}

// DELETE /api/campaigns/[id] - Delete a campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCampaign(params.id)
    return NextResponse.json({ message: 'Campaign deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error(`DELETE /api/campaigns/${params.id} error:`, error)
    if (error.code === 404) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}
