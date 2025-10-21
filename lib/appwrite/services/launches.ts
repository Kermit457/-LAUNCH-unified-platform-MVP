import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface Launch {
  $id: string
  launchId: string
  scope: 'ICM' | 'CCM'
  title: string
  subtitle?: string
  logoUrl?: string
  createdBy: string
  convictionPct: number
  commentsCount: number
  upvotes: number
  contributionPoolPct?: number
  feesSharePct?: number
  tgeDate?: string
  boostCount?: number
  viewCount?: number
  status: 'live' | 'active' | 'ended'
  $createdAt: string

  // Optional fields for token data (populated when token is live)
  tokenName?: string
  tokenSymbol?: string
  marketCap?: number
  volume24h?: number
  priceChange24h?: number
  holders?: number

  // Legacy fields (keeping for backward compatibility)
  tokenImage?: string
  description?: string
  creatorId?: string
  creatorName?: string
  creatorAvatar?: string
  tags?: string[]
  createdAt?: string
  team?: Array<{ name: string; role: string; avatar?: string }>
  contributors?: Array<{ name: string; amount: number; avatar?: string }>
}

/**
 * Get all launches with optional filters
 */
export async function getLaunches(options?: {
  status?: 'live' | 'upcoming' | 'ended'
  limit?: number
  offset?: number
  sortBy?: 'recent' | 'marketCap' | 'volume' | 'conviction'
}): Promise<Launch[]> {
  try {
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
  } catch (error) {
    console.error('Failed to fetch launches:', error)
    return []
  }
}

/**
 * Get a single launch by ID
 */
export async function getLaunch(launchId: string): Promise<Launch | null> {
  try {
    const response = await databases.getDocument(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      launchId
    )

    return response as unknown as Launch
  } catch (error) {
    console.error(`Failed to fetch launch ${launchId}:`, error)
    return null
  }
}

/**
 * Create a new launch
 */
export async function createLaunch(data: Omit<Launch, '$id' | 'createdAt'>): Promise<Launch | null> {
  try {
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
  } catch (error) {
    console.error('Failed to create launch:', error)
    return null
  }
}

/**
 * Update a launch
 */
export async function updateLaunch(launchId: string, data: Partial<Launch>): Promise<Launch | null> {
  try {
    const response = await databases.updateDocument(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      launchId,
      data
    )

    return response as unknown as Launch
  } catch (error) {
    console.error(`Failed to update launch ${launchId}:`, error)
    return null
  }
}

/**
 * Delete a launch
 */
export async function deleteLaunch(launchId: string): Promise<boolean> {
  try {
    await databases.deleteDocument(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      launchId
    )
    return true
  } catch (error) {
    console.error(`Failed to delete launch ${launchId}:`, error)
    return false
  }
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
export async function searchLaunches(searchTerm: string): Promise<Launch[]> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      [
        Query.search('tokenName', searchTerm),
      ]
    )

    return response.documents as unknown as Launch[]
  } catch (error) {
    console.error(`Failed to search launches for "${searchTerm}":`, error)
    return []
  }
}

/**
 * Upvote a launch (increment upvotes count)
 */
export async function upvoteLaunch(launchId: string): Promise<Launch | null> {
  try {
    // Get current launch to get current upvote count
    const launch = await getLaunch(launchId)

    if (!launch) {
      console.error(`Cannot upvote: launch ${launchId} not found`)
      return null
    }

    // Increment upvotes
    const response = await databases.updateDocument(
      DB_ID,
      COLLECTIONS.LAUNCHES,
      launchId,
      {
        upvotes: (launch.upvotes || 0) + 1
      }
    )

    return response as unknown as Launch
  } catch (error) {
    console.error(`Failed to upvote launch ${launchId}:`, error)
    return null
  }
}

/**
 * Get all projects created by a specific user
 */
export async function getUserProjects(userId: string) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.LAUNCHES,
    [
      Query.equal('createdBy', userId),
      Query.orderDesc('$createdAt')
    ]
  )

  return response.documents as unknown as Launch[]
}

/**
 * Get all projects a user is a member of (including owned projects)
 * This queries both projects created by the user AND projects they're a member of via project_members
 */
export async function getUserAccessibleProjects(userId: string) {
  // Get projects created by user
  const ownedProjects = await getUserProjects(userId)

  // Get projects where user is a member (will need project_members collection)
  // For now, just return owned projects
  // TODO: Join with project_members when that collection is populated

  return ownedProjects
}

/**
 * Create a new launch (matching actual Appwrite schema)
 */
export async function createLaunchDocument(data: {
  launchId: string
  scope: 'ICM' | 'CCM'

  // New schema fields
  title: string
  subtitle?: string
  logoUrl?: string

  // Legacy schema fields (for backward compatibility)
  tokenName?: string
  tokenSymbol?: string
  tokenImage?: string
  description?: string
  tags?: string[]

  // Metadata
  createdBy: string
  convictionPct?: number
  commentsCount?: number
  upvotes?: number
  contributionPoolPct?: number
  feesSharePct?: number
  status?: 'live' | 'active' | 'ended'
}) {
  const response = await databases.createDocument(
    DB_ID,
    COLLECTIONS.LAUNCHES,
    'unique()',
    {
      launchId: data.launchId,
      scope: data.scope,

      // New schema fields
      title: data.title,
      subtitle: data.subtitle || '',
      logoUrl: data.logoUrl || '',

      // Legacy schema fields (conditionally included for backward compatibility)
      ...(data.tokenName && { tokenName: data.tokenName }),
      ...(data.tokenSymbol && { tokenSymbol: data.tokenSymbol }),
      ...(data.tokenImage && { tokenImage: data.tokenImage }),
      ...(data.description && { description: data.description }),
      ...(data.tags && { tags: data.tags }),

      // Metadata
      createdBy: data.createdBy,
      convictionPct: data.convictionPct || 0,
      commentsCount: data.commentsCount || 0,
      upvotes: data.upvotes || 0,
      contributionPoolPct: data.contributionPoolPct,
      feesSharePct: data.feesSharePct,
      status: data.status || 'active',
    }
  )

  return response
}
