import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface Vote {
  $id: string
  voteId: string
  launchId: string
  userId: string
  $createdAt: string
}

/**
 * Check if user has voted on a launch
 */
export async function hasUserVoted(launchId: string, userId: string): Promise<boolean> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.VOTES,
      [
        Query.equal('launchId', launchId),
        Query.equal('userId', userId),
        Query.limit(1)
      ]
    )

    return response.total > 0
  } catch (error) {
    console.error('Failed to check vote:', error)
    return false
  }
}

/**
 * Add a vote for a launch
 */
export async function addVote(launchId: string, userId: string) {
  // Check if already voted
  const alreadyVoted = await hasUserVoted(launchId, userId)
  if (alreadyVoted) {
    throw new Error('You have already voted for this launch')
  }

  const vote = await databases.createDocument(
    DB_ID,
    COLLECTIONS.VOTES,
    ID.unique(),
    {
      voteId: `vote_${Date.now()}_${userId}`,
      launchId,
      userId
    }
  )

  return vote as unknown as Vote
}

/**
 * Remove a vote
 */
export async function removeVote(launchId: string, userId: string) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.VOTES,
    [
      Query.equal('launchId', launchId),
      Query.equal('userId', userId),
      Query.limit(1)
    ]
  )

  if (response.total > 0) {
    await databases.deleteDocument(
      DB_ID,
      COLLECTIONS.VOTES,
      response.documents[0].$id
    )
  }
}

/**
 * Get vote count for a launch
 */
export async function getVoteCount(launchId: string): Promise<number> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.VOTES,
      [
        Query.equal('launchId', launchId),
        Query.limit(1000)
      ]
    )

    return response.total
  } catch (error) {
    console.error('Failed to get vote count:', error)
    return 0
  }
}

/**
 * Get launches user has voted for
 */
export async function getUserVotes(userId: string): Promise<string[]> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.VOTES,
      [
        Query.equal('userId', userId),
        Query.limit(1000)
      ]
    )

    return response.documents.map((doc: any) => doc.launchId)
  } catch (error) {
    console.error('Failed to get user votes:', error)
    return []
  }
}
