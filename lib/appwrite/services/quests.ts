import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface Quest {
  $id: string
  questId: string
  type: 'raid' | 'bounty'
  title: string
  description: string
  createdBy: string
  status: 'active' | 'completed' | 'cancelled'
  poolAmount: number
  participants: number
  requirements: string[]
  platforms: string[]
  deadline: string
  createdAt: string
}

export async function createQuest(data: Omit<Quest, '$id' | 'createdAt'>) {
  const quest = await databases.createDocument(
    DB_ID,
    COLLECTIONS.QUESTS,
    ID.unique(),
    {
      ...data,
      createdAt: new Date().toISOString()
    }
  )

  return quest as unknown as Quest
}

export async function getQuests(options?: { limit?: number; status?: string }) {
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
}

export async function getQuestById(id: string) {
  const quest = await databases.getDocument(
    DB_ID,
    COLLECTIONS.QUESTS,
    id
  )

  return quest as unknown as Quest
}

export async function updateQuest(id: string, data: Partial<Quest>) {
  const quest = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.QUESTS,
    id,
    data
  )

  return quest as unknown as Quest
}
