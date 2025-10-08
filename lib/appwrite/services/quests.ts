import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface Quest {
  $id: string
  $createdAt: string
  $updatedAt: string
  questId: string
  type: 'raid' | 'bounty'
  title: string
  description: string
  createdBy: string
  status: 'active' | 'completed' | 'cancelled' | 'live'
  poolAmount: number
  budgetTotal: number
  budgetPaid: number
  payPerTask: number
  platforms: string[]
  participants?: number
  deadline?: string
  requirements?: string[]
}

export async function createQuest(data: Omit<Quest, '$id' | '$createdAt' | '$updatedAt'>): Promise<Quest | null> {
  try {
    // Ensure budgetTotal exists, default to poolAmount if missing
    const budgetTotal = (data as any).budgetTotal !== undefined ? (data as any).budgetTotal : data.poolAmount

    // Only include fields that exist in Appwrite schema
    const documentData: any = {
      questId: data.questId,
      type: data.type,
      title: data.title,
      description: data.description,
      createdBy: data.createdBy,
      status: data.status,
      poolAmount: data.poolAmount,
      budgetTotal: budgetTotal,
      budgetPaid: data.budgetPaid,
      payPerTask: data.payPerTask,
      platforms: data.platforms
    }

    console.log('🔍 Creating quest document with data:', documentData)

    const quest = await databases.createDocument(
      DB_ID,
      COLLECTIONS.QUESTS,
      ID.unique(),
      documentData
    )

    return quest as unknown as Quest
  } catch (error) {
    console.error('Failed to create quest:', error)
    return null
  }
}

export async function getQuests(options?: { limit?: number; status?: string }): Promise<Quest[]> {
  try {
    const queries = []

    if (options?.status) {
      queries.push(Query.equal('status', options.status))
    }

    queries.push(Query.limit(options?.limit || 100))
    queries.push(Query.orderDesc('$createdAt'))

    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.QUESTS,
      queries
    )

    return response.documents as unknown as Quest[]
  } catch (error) {
    console.error('Failed to fetch quests:', error)
    return []
  }
}

export async function getQuestById(id: string): Promise<Quest | null> {
  try {
    const quest = await databases.getDocument(
      DB_ID,
      COLLECTIONS.QUESTS,
      id
    )

    return quest as unknown as Quest
  } catch (error) {
    console.error(`Failed to fetch quest ${id}:`, error)
    return null
  }
}

export async function updateQuest(id: string, data: Partial<Quest>): Promise<Quest | null> {
  try {
    const quest = await databases.updateDocument(
      DB_ID,
      COLLECTIONS.QUESTS,
      id,
      data
    )

    return quest as unknown as Quest
  } catch (error) {
    console.error(`Failed to update quest ${id}:`, error)
    return null
  }
}
