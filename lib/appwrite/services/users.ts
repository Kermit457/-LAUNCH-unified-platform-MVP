import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface UserProfile {
  $id: string
  userId: string
  username: string
  displayName?: string
  bio?: string
  avatarUrl?: string
  bannerUrl?: string
  verified: boolean
  conviction: number
  totalEarnings: number
  roles: string[]
  socialLinks?: {
    twitter?: string
    youtube?: string
    twitch?: string
    discord?: string
  }
  createdAt: string
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.USERS,
    [Query.equal('userId', userId), Query.limit(1)]
  )

  if (response.documents.length === 0) {
    return null
  }

  return response.documents[0] as unknown as UserProfile
}

/**
 * Get user profile by username
 */
export async function getUserByUsername(username: string) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.USERS,
    [Query.equal('username', username), Query.limit(1)]
  )

  if (response.documents.length === 0) {
    return null
  }

  return response.documents[0] as unknown as UserProfile
}

/**
 * Create user profile
 */
export async function createUserProfile(data: Omit<UserProfile, '$id' | 'createdAt'>) {
  const response = await databases.createDocument(
    DB_ID,
    COLLECTIONS.USERS,
    'unique()',
    {
      ...data,
      createdAt: new Date().toISOString(),
    }
  )

  return response as unknown as UserProfile
}

/**
 * Update user profile
 */
export async function updateUserProfile(profileId: string, data: Partial<UserProfile>) {
  const response = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.USERS,
    profileId,
    data
  )

  return response as unknown as UserProfile
}

/**
 * Search users by username
 */
export async function searchUsers(searchTerm: string, limit = 10) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.USERS,
    [
      Query.search('username', searchTerm),
      Query.limit(limit)
    ]
  )

  return response.documents as unknown as UserProfile[]
}

/**
 * Get top users by conviction
 */
export async function getTopUsers(limit = 10) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.USERS,
    [
      Query.orderDesc('conviction'),
      Query.limit(limit)
    ]
  )

  return response.documents as unknown as UserProfile[]
}
