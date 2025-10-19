import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface UserProfile {
  $id: string
  userId: string
  username: string
  displayName: string
  bio?: string
  avatar?: string  // Changed from avatarUrl
  verified: boolean
  conviction: number
  totalEarnings: number
  roles: string[]
  walletAddress?: string
  followedLaunches?: string[]
  twitter?: string
  discord?: string
  website?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  contributionsJson?: string  // JSON string of contributions array
  curveId?: string  // 🆕 Auto-created CCM curve ID
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string) {
  if (!userId) {
    console.warn('getUserProfile called with empty userId')
    return null
  }

  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', userId), Query.limit(1)]
    )

    if (response.documents.length === 0) {
      return null
    }

    return response.documents[0] as unknown as UserProfile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * Get user profile by username
 */
export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.USERS,
      [Query.equal('username', username), Query.limit(1)]
    )

    if (response.documents.length === 0) {
      return null
    }

    return response.documents[0] as unknown as UserProfile
  } catch (error) {
    console.error(`Failed to fetch user by username ${username}:`, error)
    return null
  }
}

/**
 * Create user profile
 */
export async function createUserProfile(data: Omit<UserProfile, '$id'>): Promise<UserProfile | null> {
  try {
    const response = await databases.createDocument(
      DB_ID,
      COLLECTIONS.USERS,
      'unique()',
      data
    )

    return response as unknown as UserProfile
  } catch (error) {
    console.error('Failed to create user profile:', error)
    return null
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(profileId: string, data: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const response = await databases.updateDocument(
      DB_ID,
      COLLECTIONS.USERS,
      profileId,
      data
    )

    return response as unknown as UserProfile
  } catch (error) {
    console.error(`Failed to update user profile ${profileId}:`, error)
    return null
  }
}

/**
 * Search users by username
 */
export async function searchUsers(searchTerm: string, limit = 10): Promise<UserProfile[]> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.USERS,
      [
        Query.search('username', searchTerm),
        Query.limit(limit)
      ]
    )

    return response.documents as unknown as UserProfile[]
  } catch (error) {
    console.error(`Failed to search users for "${searchTerm}":`, error)
    return []
  }
}

/**
 * Get top users by conviction
 */
export async function getTopUsers(limit = 10): Promise<UserProfile[]> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.USERS,
      [
        Query.orderDesc('conviction'),
        Query.limit(limit)
      ]
    )

    return response.documents as unknown as UserProfile[]
  } catch (error) {
    console.error('Failed to fetch top users:', error)
    return []
  }
}

/**
 * Get all users (for network page)
 */
export async function getAllUsers(limit = 100) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.USERS,
    [
      Query.limit(limit),
      Query.orderDesc('conviction')
    ]
  )

  return response.documents as unknown as UserProfile[]
}

/**
 * Get multiple users by their user IDs
 */
export async function getUsersByIds(userIds: string[]) {
  if (userIds.length === 0) return []

  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.USERS,
    [
      Query.equal('userId', userIds),
      Query.limit(100)
    ]
  )

  return response.documents as unknown as UserProfile[]
}
