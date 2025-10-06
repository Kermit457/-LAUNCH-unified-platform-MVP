import { NextRequest, NextResponse } from 'next/server'
import { getLaunch, updateLaunch, deleteLaunch } from '@/lib/appwrite/services/launches'

// GET /api/launches/[id] - Get a single launch
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const launch = await getLaunch(params.id)
    return NextResponse.json({ launch }, { status: 200 })
  } catch (error: any) {
    console.error(`GET /api/launches/${params.id} error:`, error)
    if (error.code === 404) {
      return NextResponse.json({ error: 'Launch not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch launch' },
      { status: 500 }
    )
  }
}

// PATCH /api/launches/[id] - Update a launch
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const launch = await updateLaunch(params.id, body)
    return NextResponse.json({ launch }, { status: 200 })
  } catch (error: any) {
    console.error(`PATCH /api/launches/${params.id} error:`, error)
    if (error.code === 404) {
      return NextResponse.json({ error: 'Launch not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update launch' },
      { status: 500 }
    )
  }
}

// DELETE /api/launches/[id] - Delete a launch
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteLaunch(params.id)
    return NextResponse.json({ message: 'Launch deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error(`DELETE /api/launches/${params.id} error:`, error)
    if (error.code === 404) {
      return NextResponse.json({ error: 'Launch not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete launch' },
      { status: 500 }
    )
  }
}
