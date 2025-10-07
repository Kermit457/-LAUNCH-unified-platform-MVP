import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface Campaign {
  $id: string
  title: string
  description: string
  type: 'bounty' | 'quest' | 'airdrop'
  creatorId: string
  creatorName: string
  creatorAvatar?: string
  budget: number
  budgetPaid: number
  participants: number
  deadline: string
  status: 'active' | 'completed' | 'cancelled'
  requirements: string[]
  tags: string[]
  imageUrl?: string
  createdAt: string
  ratePerThousand?: number
  totalViews?: number
  platforms?: string[]
  socialLinks?: string[]
  creatorKitUrl?: string
  minViews?: number
  minDuration?: number
  maxDuration?: number
  topSubmissions?: any[]

  // Entity scoping fields
  ownerType: 'user' | 'project'
  ownerId: string
}

/**
 * Get all campaigns with optional filters
 * Supports entity scoping (filter by ownerType and ownerId)
 */
export async function getCampaigns(options?: {
  type?: 'bounty' | 'quest' | 'airdrop'
  status?: 'active' | 'completed' | 'cancelled'
  createdBy?: string
  ownerType?: 'user' | 'project'
  ownerId?: string
  limit?: number
  offset?: number
}) {
  const queries = []

  if (options?.type) {
    queries.push(Query.equal('type', options.type))
  }

  if (options?.status) {
    queries.push(Query.equal('status', options.status))
  }

  // Legacy support: createdBy (deprecated, use ownerId instead)
  if (options?.createdBy) {
    queries.push(Query.equal('createdBy', options.createdBy))
  }

  // Entity scoping: filter by owner
  if (options?.ownerType) {
    queries.push(Query.equal('ownerType', options.ownerType))
  }

  if (options?.ownerId) {
    queries.push(Query.equal('ownerId', options.ownerId))
  }

  if (options?.limit) {
    queries.push(Query.limit(options.limit))
  }

  if (options?.offset) {
    queries.push(Query.offset(options.offset))
  }

  queries.push(Query.orderDesc('$createdAt'))

  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.CAMPAIGNS,
    queries
  )

  return response.documents as unknown as Campaign[]
}

/**
 * Get a single campaign by ID
 */
export async function getCampaign(campaignId: string) {
  const response = await databases.getDocument(
    DB_ID,
    COLLECTIONS.CAMPAIGNS,
    campaignId
  )

  return response as unknown as Campaign
}

/**
 * Get a single campaign by ID
 */
export async function getCampaignById(id: string) {
  const campaign = await databases.getDocument(
    DB_ID,
    COLLECTIONS.CAMPAIGNS,
    id
  )

  return campaign as unknown as Campaign
}

/**
 * Create a new campaign
 */
export async function createCampaign(data: Omit<Campaign, '$id' | 'createdAt'>) {
  const response = await databases.createDocument(
    DB_ID,
    COLLECTIONS.CAMPAIGNS,
    'unique()',
    {
      ...data,
      createdAt: new Date().toISOString(),
    }
  )

  return response as unknown as Campaign
}

/**
 * Update a campaign
 */
export async function updateCampaign(campaignId: string, data: Partial<Campaign>) {
  const response = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.CAMPAIGNS,
    campaignId,
    data
  )

  return response as unknown as Campaign
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(campaignId: string) {
  await databases.deleteDocument(
    DB_ID,
    COLLECTIONS.CAMPAIGNS,
    campaignId
  )
}

/**
 * Get active campaigns
 */
export async function getActiveCampaigns(limit = 10) {
  return getCampaigns({ status: 'active', limit })
}
