import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID } from 'appwrite'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, type, targetId, metadata } = body

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'userId and type are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = [
      'launch_created',
      'submission_created',
      'payout_claimed',
      'comment_posted',
      'upvoted'
    ]

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Create activity event
    const activity = await databases.createDocument(
      DB_ID,
      COLLECTIONS.ACTIVITIES,
      ID.unique(),
      {
        userId,
        type,
        targetId: targetId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        createdAt: new Date().toISOString()
      }
    )

    return NextResponse.json({ success: true, activityId: activity.$id })
  } catch (error) {
    console.error('Error emitting event:', error)
    return NextResponse.json(
      { error: 'Failed to emit event' },
      { status: 500 }
    )
  }
}
