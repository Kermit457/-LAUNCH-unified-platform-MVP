import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface Launch {
  $id: string
  tokenName: string
  tokenSymbol: string
  tokenImage?: string
  description: string
  creatorId: string
  creatorName: string
  creatorAvatar?: string
  marketCap: number
  volume24h: number
  priceChange24h: number
  holders: number
  convictionPct: number
  commentsCount: number
  upvotes: number
  tags: string[]
  createdAt: string
  status: 'live' | 'upcoming' | 'ended'
}

/**
 * Get all launches with optional filters
 */
export async function getLaunches(options?: {
  status?: 'live' | 'upcoming' | 'ended'
  limit?: number
  offset?: number
  sortBy?: 'recent' | 'marketCap' | 'volume' | 'conviction'
}) {
  const queries = []

  if (options?.status) {
    queries.push(Query.equal('status', options.status))
  }

  if (options?.limit) {
    queries.push(Query.limit(options.limit))
  }

  if (options?.offset) {
    queries.push(Query.offset(options.offset))
  }

  // Sort options
  switch (options?.sortBy) {
    case 'marketCap':
      queries.push(Query.orderDesc('marketCap'))
      break
    case 'volume':
      queries.push(Query.orderDesc('volume24h'))
      break
    case 'conviction':
      queries.push(Query.orderDesc('convictionPct'))
      break
    case 'recent':
    default:
      queries.push(Query.orderDesc('$createdAt'))
      break
  }

  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.LAUNCHES,
    queries
  )

  return response.documents as unknown as Launch[]
}

/**
 * Get a single launch by ID
 */
export async function getLaunch(launchId: string) {
  const response = await databases.getDocument(
    DB_ID,
    COLLECTIONS.LAUNCHES,
    launchId
  )

  return response as unknown as Launch
}

/**
 * Create a new launch
 */
export async function createLaunch(data: Omit<Launch, '$id' | 'createdAt'>) {
  const response = await databases.createDocument(
    DB_ID,
    COLLECTIONS.LAUNCHES,
    'unique()',
    {
      ...data,
      createdAt: new Date().toISOString(),
    }
  )

  return response as unknown as Launch
}

/**
 * Update a launch
 */
export async function updateLaunch(launchId: string, data: Partial<Launch>) {
  const response = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.LAUNCHES,
    launchId,
    data
  )

  return response as unknown as Launch
}

/**
 * Delete a launch
 */
export async function deleteLaunch(launchId: string) {
  await databases.deleteDocument(
    DB_ID,
    COLLECTIONS.LAUNCHES,
    launchId
  )
}

/**
 * Get live launches
 */
export async function getLiveLaunches(limit = 10) {
  return getLaunches({ status: 'live', limit, sortBy: 'recent' })
}

/**
 * Search launches by name or symbol
 */
export async function searchLaunches(searchTerm: string) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.LAUNCHES,
    [
      Query.search('tokenName', searchTerm),
    ]
  )

  return response.documents as unknown as Launch[]
}
