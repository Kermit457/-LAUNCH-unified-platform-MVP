import { databases, DB_ID } from '../client'
import { ID, Query } from 'appwrite'

const LIVE_STREAMS_COLLECTION = 'live_streams'

export interface LiveStreamView {
  $id?: string
  streamId: string
  mint: string
  viewerCount: number
  lastUpdated: string
}

/**
 * Track viewer count for a live stream
 */
export async function updateViewerCount(mint: string, viewerCount: number): Promise<LiveStreamView> {
  try {
    // Try to find existing record
    const existing = await databases.listDocuments(
      DB_ID,
      LIVE_STREAMS_COLLECTION,
      [Query.equal('mint', mint), Query.limit(1)]
    )

    const data = {
      streamId: mint,
      mint,
      viewerCount,
      lastUpdated: new Date().toISOString(),
    }

    if (existing.documents.length > 0) {
      // Update existing
      const updated = await databases.updateDocument(
        DB_ID,
        LIVE_STREAMS_COLLECTION,
        existing.documents[0].$id,
        data
      )
      return updated as LiveStreamView
    } else {
      // Create new
      const created = await databases.createDocument(
        DB_ID,
        LIVE_STREAMS_COLLECTION,
        ID.unique(),
        data
      )
      return created as LiveStreamView
    }
  } catch (error) {
    console.error('Error updating viewer count:', error)
    throw error
  }
}

/**
 * Get viewer count for a specific stream
 */
export async function getViewerCount(mint: string): Promise<number> {
  try {
    const result = await databases.listDocuments(
      DB_ID,
      LIVE_STREAMS_COLLECTION,
      [Query.equal('mint', mint), Query.limit(1)]
    )

    if (result.documents.length > 0) {
      return (result.documents[0] as LiveStreamView).viewerCount || 0
    }
    return 0
  } catch (error) {
    console.error('Error getting viewer count:', error)
    return 0
  }
}

/**
 * Get viewer counts for multiple streams (batch)
 */
export async function getViewerCounts(mints: string[]): Promise<Record<string, number>> {
  try {
    const result = await databases.listDocuments(
      DB_ID,
      LIVE_STREAMS_COLLECTION,
      [Query.equal('mint', mints), Query.limit(100)]
    )

    const counts: Record<string, number> = {}
    result.documents.forEach((doc) => {
      const stream = doc as LiveStreamView
      counts[stream.mint] = stream.viewerCount || 0
    })

    return counts
  } catch (error) {
    console.error('Error getting viewer counts:', error)
    return {}
  }
}

/**
 * Increment viewer count (simulates a new viewer joining)
 */
export async function incrementViewerCount(mint: string): Promise<number> {
  try {
    const current = await getViewerCount(mint)
    const newCount = current + 1
    await updateViewerCount(mint, newCount)
    return newCount
  } catch (error) {
    console.error('Error incrementing viewer count:', error)
    return 0
  }
}

/**
 * Decrement viewer count (simulates a viewer leaving)
 */
export async function decrementViewerCount(mint: string): Promise<number> {
  try {
    const current = await getViewerCount(mint)
    const newCount = Math.max(0, current - 1)
    await updateViewerCount(mint, newCount)
    return newCount
  } catch (error) {
    console.error('Error decrementing viewer count:', error)
    return 0
  }
}
