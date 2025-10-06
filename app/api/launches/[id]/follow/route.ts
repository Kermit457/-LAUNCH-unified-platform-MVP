import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID } from 'appwrite'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json()
    const launchId = params.id

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Create a follow record in a 'follows' collection
    // For now, we'll store this in user's profile as a simple array
    // TODO: Create a dedicated 'follows' collection for better scalability

    // Get user profile
    const userProfile = await databases.getDocument(
      DB_ID,
      COLLECTIONS.USERS,
      userId
    )

    // Get current followed launches (if exists)
    const followedLaunches = (userProfile.followedLaunches || []) as string[]

    // Toggle follow
    const isFollowing = followedLaunches.includes(launchId)
    const updatedFollows = isFollowing
      ? followedLaunches.filter(id => id !== launchId)
      : [...followedLaunches, launchId]

    // Update user profile
    await databases.updateDocument(
      DB_ID,
      COLLECTIONS.USERS,
      userId,
      {
        followedLaunches: updatedFollows
      }
    )

    return NextResponse.json({
      success: true,
      isFollowing: !isFollowing,
      followCount: updatedFollows.length
    })
  } catch (error: any) {
    console.error('Failed to follow launch:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to follow launch' },
      { status: 500 }
    )
  }
}
