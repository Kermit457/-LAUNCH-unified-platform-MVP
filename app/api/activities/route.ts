import { NextRequest, NextResponse } from 'next/server'
import { getActivities, createActivity, markAllActivitiesAsRead } from '@/lib/appwrite/services/activities'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const activities = await getActivities(userId, limit)

    return NextResponse.json(activities)
  } catch (error: any) {
    console.error('Failed to fetch activities:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const activity = await createActivity(data)

    return NextResponse.json(activity, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create activity:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create activity' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    if (action === 'mark_all_read') {
      const count = await markAllActivitiesAsRead(userId)
      return NextResponse.json({ markedAsRead: count })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Failed to update activities:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update activities' },
      { status: 500 }
    )
  }
}
