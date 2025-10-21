import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface Dealflow {
  $id: string
  dealflowId: string
  userId: string
  title: string
  description: string
  dealType: 'partnership' | 'investment' | 'collaboration' | 'service'
  budget?: number
  timeline: string
  contactMethod: 'dm' | 'email' | 'telegram'
  contactInfo: string
  status: 'active' | 'closed' | 'completed'
  $createdAt: string
}

/**
 * Create a new dealflow submission
 */
export async function createDealflow(data: {
  userId: string
  title: string
  description: string
  dealType: 'partnership' | 'investment' | 'collaboration' | 'service'
  budget?: number
  timeline: string
  contactMethod: 'dm' | 'email' | 'telegram'
  contactInfo: string
}): Promise<Dealflow | null> {
  try {
    const dealflow = await databases.createDocument(
      DB_ID,
      COLLECTIONS.DEALFLOW,
      ID.unique(),
      {
        dealflowId: `deal_${Date.now()}`,
        ...data,
        status: 'active'
      }
    )

    return dealflow as unknown as Dealflow
  } catch (error) {
    console.error('Failed to create dealflow:', error)
    throw error
  }
}

/**
 * Get all active dealflow opportunities
 */
export async function getActiveDealflows(limit = 50): Promise<Dealflow[]> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.DEALFLOW,
      [
        Query.equal('status', 'active'),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    )

    return response.documents as unknown as Dealflow[]
  } catch (error) {
    console.error('Failed to fetch dealflows:', error)
    return []
  }
}

/**
 * Get dealflows by user
 */
export async function getUserDealflows(userId: string): Promise<Dealflow[]> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.DEALFLOW,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    )

    return response.documents as unknown as Dealflow[]
  } catch (error) {
    console.error('Failed to fetch user dealflows:', error)
    return []
  }
}

/**
 * Get dealflow by ID
 */
export async function getDealflow(id: string): Promise<Dealflow | null> {
  try {
    const dealflow = await databases.getDocument(
      DB_ID,
      COLLECTIONS.DEALFLOW,
      id
    )

    return dealflow as unknown as Dealflow
  } catch (error) {
    console.error(`Failed to fetch dealflow ${id}:`, error)
    return null
  }
}

/**
 * Update dealflow status
 */
export async function updateDealflowStatus(
  id: string,
  status: 'active' | 'closed' | 'completed'
): Promise<Dealflow | null> {
  try {
    const dealflow = await databases.updateDocument(
      DB_ID,
      COLLECTIONS.DEALFLOW,
      id,
      { status }
    )

    return dealflow as unknown as Dealflow
  } catch (error) {
    console.error('Failed to update dealflow status:', error)
    return null
  }
}

/**
 * Delete a dealflow
 */
export async function deleteDealflow(id: string): Promise<boolean> {
  try {
    await databases.deleteDocument(
      DB_ID,
      COLLECTIONS.DEALFLOW,
      id
    )
    return true
  } catch (error) {
    console.error('Failed to delete dealflow:', error)
    return false
  }
}