import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const launchId = params.id

    // Get current launch
    const launch = await databases.getDocument(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      launchId
    )

    // Increment upvotes
    const updatedLaunch = await databases.updateDocument(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      launchId,
      {
        upvotes: (launch.upvotes || 0) + 1
      }
    )

    return NextResponse.json(updatedLaunch)
  } catch (error: any) {
    console.error('Failed to upvote launch:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upvote launch' },
      { status: 500 }
    )
  }
}
