/**
 * Appwrite Integration for EnhancedLaunchCard
 *
 * This module provides all the Appwrite queries and mutations needed
 * to fully wire the EnhancedLaunchCard component with backend data.
 */

import { databases, DB_ID } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

// ============================================================================
// COLLECTION IDs - These match the collections we just created
// ============================================================================

const DATABASE_ID = DB_ID

const COLLECTIONS = {
  LAUNCHES: 'launches',
  VOTES: 'votes',
  COMMENTS: 'comments',
  USER_HOLDINGS: 'user_holdings',
  NOTIFICATIONS: 'user_notifications',
  SHARES: 'share_analytics',
  AIRDROPS: 'airdrops',
  AIRDROP_CLAIMS: 'airdrop_claims',
  LAUNCH_CONTRIBUTORS: 'launch_contributors',
  PRICE_HISTORY: 'price_snapshots',
  TWITTER_ANALYTICS: 'twitter_clicks',
  COLLABORATION_REQUESTS: 'collaboration_requests',
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type UserHoldings = {
  launchId: string
  userId: string
  balance: number
  sharePercent: number
  totalInvested: number
  lastUpdated: string
}

export type AirdropData = {
  launchId: string
  userId: string
  amount: number
  proof: string[]
  claimed: boolean
  claimedAt?: string
}

export type Contributor = {
  name: string
  avatar: string
  role: string
  userId: string
}

export type NotificationPreference = {
  userId: string
  launchId: string
  enabled: boolean
  channels: ('email' | 'push' | 'sms')[]
}

export type PriceSnapshot = {
  launchId: string
  price: number
  timestamp: string
  volume24h?: number
}

// ============================================================================
// 1. USER HOLDINGS - Fetch user's key balance and share percentage
// ============================================================================

export async function getUserHoldings(
  userId: string,
  launchId: string
): Promise<UserHoldings | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USER_HOLDINGS,
      [
        Query.equal('userId', userId),
        Query.equal('launchId', launchId),
        Query.limit(1)
      ]
    )

    if (response.documents.length === 0) {
      return null
    }

    const doc = response.documents[0]
    return {
      launchId: doc.launchId,
      userId: doc.userId,
      balance: doc.balance,
      sharePercent: doc.sharePercent,
      totalInvested: doc.totalInvested,
      lastUpdated: doc.$updatedAt,
    }
  } catch (error) {
    console.error('Error fetching user holdings:', error)
    return null
  }
}

/**
 * Update user holdings after buy/sell transaction
 */
export async function updateUserHoldings(
  userId: string,
  launchId: string,
  newBalance: number,
  totalSupply: number,
  investmentAmount: number
): Promise<void> {
  try {
    const sharePercent = (newBalance / totalSupply) * 100

    // Try to update existing record
    const existing = await getUserHoldings(userId, launchId)

    if (existing) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USER_HOLDINGS,
        `${userId}_${launchId}`,
        {
          balance: newBalance,
          sharePercent,
          totalInvested: investmentAmount,
        }
      )
    } else {
      // Create new record
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USER_HOLDINGS,
        `${userId}_${launchId}`,
        {
          userId,
          launchId,
          balance: newBalance,
          sharePercent,
          totalInvested: investmentAmount,
        }
      )
    }
  } catch (error) {
    console.error('Error updating user holdings:', error)
    throw error
  }
}

// ============================================================================
// 2. AIRDROP - Check eligibility and claim status
// ============================================================================

export async function getAirdropData(
  userId: string,
  launchId: string
): Promise<AirdropData | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.AIRDROPS,
      [
        Query.equal('userId', userId),
        Query.equal('launchId', launchId),
        Query.limit(1)
      ]
    )

    if (response.documents.length === 0) {
      return null
    }

    const doc = response.documents[0]
    return {
      launchId: doc.launchId,
      userId: doc.userId,
      amount: doc.amount,
      proof: doc.proof,
      claimed: doc.claimed,
      claimedAt: doc.claimedAt,
    }
  } catch (error) {
    console.error('Error fetching airdrop data:', error)
    return null
  }
}

/**
 * Mark airdrop as claimed after successful on-chain claim
 */
export async function markAirdropClaimed(
  userId: string,
  launchId: string,
  txSignature: string
): Promise<void> {
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AIRDROP_CLAIMS,
      ID.unique(),
      {
        userId,
        launchId,
        claimedAt: new Date().toISOString(),
        txSignature,
      }
    )

    // Update airdrop record
    const airdrop = await getAirdropData(userId, launchId)
    if (airdrop) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.AIRDROPS,
        `${userId}_${launchId}`,
        {
          claimed: true,
          claimedAt: new Date().toISOString(),
        }
      )
    }
  } catch (error) {
    console.error('Error marking airdrop as claimed:', error)
    throw error
  }
}

// ============================================================================
// 3. CONTRIBUTORS - Fetch team members for a launch
// ============================================================================

export async function getLaunchContributors(
  launchId: string
): Promise<Contributor[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.LAUNCH_CONTRIBUTORS,
      [
        Query.equal('launchId', launchId),
        Query.limit(10)
      ]
    )

    return response.documents.map(doc => ({
      name: doc.name,
      avatar: doc.avatar || '',
      role: doc.role,
      userId: doc.userId,
    }))
  } catch (error) {
    console.error('Error fetching contributors:', error)
    return []
  }
}

/**
 * Add contributor to a launch
 */
export async function addContributor(
  launchId: string,
  userId: string,
  name: string,
  avatar: string,
  role: string
): Promise<void> {
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.LAUNCH_CONTRIBUTORS,
      ID.unique(),
      {
        launchId,
        userId,
        name,
        avatar,
        role,
        addedAt: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error('Error adding contributor:', error)
    throw error
  }
}

// ============================================================================
// 4. NOTIFICATIONS - Subscribe/unsubscribe to launch updates
// ============================================================================

export async function getNotificationPreference(
  userId: string,
  launchId: string
): Promise<NotificationPreference | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATIONS,
      [
        Query.equal('userId', userId),
        Query.equal('launchId', launchId),
        Query.limit(1)
      ]
    )

    if (response.documents.length === 0) {
      return null
    }

    const doc = response.documents[0]
    return {
      userId: doc.userId,
      launchId: doc.launchId,
      enabled: doc.enabled,
      channels: doc.channels,
    }
  } catch (error) {
    console.error('Error fetching notification preference:', error)
    return null
  }
}

/**
 * Toggle notification subscription
 * Uses server-side API to bypass client permissions
 */
export async function toggleNotifications(
  userId: string,
  launchId: string,
  enabled: boolean,
  channels: ('email' | 'push' | 'sms')[] = ['email']
): Promise<void> {
  try {
    // Call server-side API endpoint to handle Appwrite with proper permissions
    const response = await fetch('/api/notifications/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, launchId, enabled, channels })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to toggle notifications')
    }
  } catch (error) {
    console.error('Error toggling notifications:', error)
    throw error
  }
}

// ============================================================================
// 5. SHARE ANALYTICS - Track when users share a launch
// ============================================================================

export async function trackShare(
  userId: string,
  launchId: string,
  shareMethod: 'copy_link' | 'twitter' | 'telegram' | 'email'
): Promise<void> {
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SHARES,
      ID.unique(),
      {
        userId,
        launchId,
        shareMethod,
        sharedAt: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error('Error tracking share:', error)
  }
}

/**
 * Get share count for a launch
 */
export async function getShareCount(launchId: string): Promise<number> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SHARES,
      [
        Query.equal('launchId', launchId),
        Query.limit(1000)
      ]
    )
    return response.total
  } catch (error) {
    console.error('Error fetching share count:', error)
    return 0
  }
}

// ============================================================================
// 6. TWITTER ANALYTICS - Track Twitter link clicks
// ============================================================================

export async function trackTwitterClick(
  userId: string,
  launchId: string,
  twitterUrl: string
): Promise<void> {
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TWITTER_ANALYTICS,
      ID.unique(),
      {
        userId,
        launchId,
        twitterUrl,
        clickedAt: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error('Error tracking Twitter click:', error)
  }
}

// ============================================================================
// 7. PRICE HISTORY - Get 24h price change
// ============================================================================

export async function get24hPriceChange(
  launchId: string
): Promise<number | null> {
  try {
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PRICE_HISTORY,
      [
        Query.equal('launchId', launchId),
        Query.greaterThanEqual('timestamp', yesterday.toISOString()),
        Query.orderDesc('timestamp'),
        Query.limit(100)
      ]
    )

    if (response.documents.length < 2) {
      return null
    }

    const currentPrice = response.documents[0].price
    const oldPrice = response.documents[response.documents.length - 1].price

    const change = ((currentPrice - oldPrice) / oldPrice) * 100
    return change
  } catch (error) {
    console.error('Error calculating 24h price change:', error)
    return null
  }
}

/**
 * Save price snapshot (call this periodically, e.g., every 15 minutes)
 */
export async function savePriceSnapshot(
  launchId: string,
  price: number,
  volume24h?: number
): Promise<void> {
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.PRICE_HISTORY,
      ID.unique(),
      {
        launchId,
        price,
        volume24h,
        timestamp: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error('Error saving price snapshot:', error)
  }
}

// ============================================================================
// 8. COLLABORATION REQUESTS
// ============================================================================

export async function createCollaborationRequest(
  userId: string,
  launchId: string,
  message: string,
  skills: string[]
): Promise<void> {
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.COLLABORATION_REQUESTS,
      ID.unique(),
      {
        userId,
        launchId,
        message,
        skills,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error('Error creating collaboration request:', error)
    throw error
  }
}

// ============================================================================
// 9. BATCH FETCH - Get all card data in one call
// ============================================================================

export type EnhancedCardData = {
  holdings: UserHoldings | null
  airdrop: AirdropData | null
  contributors: Contributor[]
  notificationEnabled: boolean
  priceChange24h: number | null
}

/**
 * Fetch all data needed for EnhancedLaunchCard in a single batch call
 * This optimizes performance by making parallel requests
 */
export async function fetchEnhancedCardData(
  userId: string,
  launchId: string
): Promise<EnhancedCardData> {
  try {
    const [holdings, airdrop, contributors, notificationPref, priceChange] =
      await Promise.all([
        getUserHoldings(userId, launchId),
        getAirdropData(userId, launchId),
        getLaunchContributors(launchId),
        getNotificationPreference(userId, launchId),
        get24hPriceChange(launchId),
      ])

    return {
      holdings,
      airdrop,
      contributors,
      notificationEnabled: notificationPref?.enabled || false,
      priceChange24h: priceChange,
    }
  } catch (error) {
    console.error('Error fetching enhanced card data:', error)
    return {
      holdings: null,
      airdrop: null,
      contributors: [],
      notificationEnabled: false,
      priceChange24h: null,
    }
  }
}