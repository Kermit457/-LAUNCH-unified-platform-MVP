import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases as databases, DB_ID } from '@/lib/appwrite/server'
import { ID, Query } from 'node-appwrite'

const NOTIFICATIONS_COLLECTION = 'user_notifications'

export async function POST(request: NextRequest) {
  try {
    const { userId, launchId, enabled, channels } = await request.json()

    if (!userId || !launchId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find existing preference
    const response = await databases.listDocuments(
      DB_ID,
      NOTIFICATIONS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.equal('launchId', launchId),
        Query.limit(1)
      ]
    )

    if (response.documents.length > 0) {
      // Update existing
      const docId = response.documents[0].$id
      await databases.updateDocument(
        DB_ID,
        NOTIFICATIONS_COLLECTION,
        docId,
        { enabled, channels }
      )
    } else {
      // Create new
      await databases.createDocument(
        DB_ID,
        NOTIFICATIONS_COLLECTION,
        ID.unique(),
        {
          userId,
          launchId,
          enabled,
          channels,
          createdAt: new Date().toISOString(),
        }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Notification toggle error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to toggle notifications' },
      { status: 500 }
    )
  }
}
