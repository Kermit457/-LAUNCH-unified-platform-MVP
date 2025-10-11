import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export interface Campaign {
  $id: string
  $createdAt: string
  $updatedAt: string
  campaignId: string
  type: 'clipping' | 'bounty' | 'airdrop'
  title: string
  description: string
  createdBy: string
  status: 'active' | 'completed' | 'cancelled'
  prizePool: number
  budgetTotal: number
  budgetPaid?: number
  ratePerThousand: number
  minViews: number
  minDuration: number
  maxDuration: number
  platforms: string[]
  socialLinks: string[]
  gdocUrl: string
  imageUrl: string
  ownerType: 'user' | 'project'
  ownerId: string
  participants?: number
  deadline?: string
  tags?: string[]
  requirements?: string[]
  // Escrow fields
  escrowId?: string
  escrowStatus?: 'pending' | 'funded' | 'released' | 'cancelled' | 'partial'
  escrowAmount?: number
  escrowFundedAt?: string
  paidParticipants?: number
  expectedParticipants?: number
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
}): Promise<Campaign[]> {
  try {
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
  } catch (error) {
    console.error('Failed to fetch campaigns:', error)
    return []
  }
}

/**
 * Get a single campaign by ID
 */
export async function getCampaign(campaignId: string): Promise<Campaign | null> {
  try {
    const response = await databases.getDocument(
      DB_ID,
      COLLECTIONS.CAMPAIGNS,
      campaignId
    )

    return response as unknown as Campaign
  } catch (error) {
    console.error(`Failed to fetch campaign ${campaignId}:`, error)
    return null
  }
}

/**
 * Get a single campaign by ID
 */
export async function getCampaignById(id: string): Promise<Campaign | null> {
  try {
    const campaign = await databases.getDocument(
      DB_ID,
      COLLECTIONS.CAMPAIGNS,
      id
    )

    return campaign as unknown as Campaign
  } catch (error) {
    console.error(`Failed to fetch campaign ${id}:`, error)
    return null
  }
}

/**
 * Create a new campaign
 */
export async function createCampaign(data: Omit<Campaign, '$id' | '$createdAt' | '$updatedAt'>): Promise<Campaign | null> {
  try {
    // Ensure required fields exist with proper fallbacks
    const campaignId = data.campaignId || `campaign_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    const createdBy = data.createdBy || 'unknown'
    const ratePerThousand = data.ratePerThousand ?? 0
    const budgetTotal = data.budgetTotal ?? data.prizePool ?? 0
    const prizePool = data.prizePool ?? 0
    const platforms = Array.isArray(data.platforms) ? data.platforms : []
    const socialLinks = Array.isArray(data.socialLinks) ? data.socialLinks : []

    // Ensure entity scoping fields exist
    const ownerType = data.ownerType || 'user'
    const ownerId = data.ownerId || createdBy

    // Only include fields that exist in Appwrite schema
    const documentData: any = {
      campaignId,
      type: data.type,
      title: data.title,
      description: data.description || '',
      createdBy,
      status: data.status,
      prizePool,
      budgetTotal,
      ratePerThousand,
      minViews: data.minViews ?? 0,
      minDuration: data.minDuration ?? 0,
      maxDuration: data.maxDuration ?? 0,
      platforms,
      socialLinks,
      gdocUrl: data.gdocUrl || '',
      imageUrl: data.imageUrl || '',
      ownerType,
      ownerId
    }

    console.log('🎬 Creating campaign document with data:', documentData)

    const response = await databases.createDocument(
      DB_ID,
      COLLECTIONS.CAMPAIGNS,
      'unique()',
      documentData
    )

    return response as unknown as Campaign
  } catch (error) {
    console.error('Failed to create campaign:', error)
    return null
  }
}

/**
 * Update a campaign
 */
export async function updateCampaign(campaignId: string, data: Partial<Campaign>): Promise<Campaign | null> {
  try {
    const response = await databases.updateDocument(
      DB_ID,
      COLLECTIONS.CAMPAIGNS,
      campaignId,
      data
    )

    return response as unknown as Campaign
  } catch (error) {
    console.error(`Failed to update campaign ${campaignId}:`, error)
    return null
  }
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(campaignId: string): Promise<boolean> {
  try {
    await databases.deleteDocument(
      DB_ID,
      COLLECTIONS.CAMPAIGNS,
      campaignId
    )
    return true
  } catch (error) {
    console.error(`Failed to delete campaign ${campaignId}:`, error)
    return false
  }
}

/**
 * Get active campaigns
 */
export async function getActiveCampaigns(limit = 10) {
  return getCampaigns({ status: 'active', limit })
}
