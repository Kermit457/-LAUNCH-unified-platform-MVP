import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'

/**
 * Increment view count for a launch
 */
export async function incrementViewCount(launchId: string): Promise<void> {
  try {
    // Get current launch
    const launch = await databases.getDocument(DB_ID, COLLECTIONS.LAUNCHES, launchId)

    // Increment view count
    const currentViews = (launch.viewCount || 0) as number
    await databases.updateDocument(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      launchId,
      { viewCount: currentViews + 1 }
    )
  } catch (error) {
    console.error('Failed to increment view count:', error)
    // Don't throw - view tracking shouldn't break the app
  }
}

/**
 * Increment boost count for a launch
 */
export async function incrementBoostCount(launchId: string): Promise<void> {
  try {
    // Get current launch
    const launch = await databases.getDocument(DB_ID, COLLECTIONS.LAUNCHES, launchId)

    // Increment boost count
    const currentBoosts = (launch.boostCount || 0) as number
    await databases.updateDocument(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      launchId,
      { boostCount: currentBoosts + 1 }
    )
  } catch (error) {
    console.error('Failed to increment boost count:', error)
    throw error // Boost is a user action, so we should show errors
  }
}

/**
 * Decrement boost count for a launch (if user removes boost)
 */
export async function decrementBoostCount(launchId: string): Promise<void> {
  try {
    // Get current launch
    const launch = await databases.getDocument(DB_ID, COLLECTIONS.LAUNCHES, launchId)

    // Decrement boost count (don't go below 0)
    const currentBoosts = (launch.boostCount || 0) as number
    await databases.updateDocument(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      launchId,
      { boostCount: Math.max(0, currentBoosts - 1) }
    )
  } catch (error) {
    console.error('Failed to decrement boost count:', error)
    throw error
  }
}

/**
 * Get view count for a launch
 */
export async function getViewCount(launchId: string): Promise<number> {
  try {
    const launch = await databases.getDocument(DB_ID, COLLECTIONS.LAUNCHES, launchId)
    return (launch.viewCount || 0) as number
  } catch (error) {
    console.error('Failed to get view count:', error)
    return 0
  }
}

/**
 * Get boost count for a launch
 */
export async function getBoostCount(launchId: string): Promise<number> {
  try {
    const launch = await databases.getDocument(DB_ID, COLLECTIONS.LAUNCHES, launchId)
    return (launch.boostCount || 0) as number
  } catch (error) {
    console.error('Failed to get boost count:', error)
    return 0
  }
}