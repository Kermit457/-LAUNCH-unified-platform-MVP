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
  ratePerThousand: number
  minViews: number
  minDuration: number
  maxDuration: number
  platforms: string[]
  socialLinks: string[]
  gdocUrl: string
  imageUrl: string
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
export async function createCampaign(data: Omit<Campaign, '$id' | '$createdAt' | '$updatedAt'>) {
  // Ensure required fields exist (defensive against TypeScript caching issues)
  const campaignId = (data as any).campaignId || `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const createdBy = (data as any).createdBy || (data as any).userId || 'unknown'
  const ratePerThousand = (data as any).ratePerThousand !== undefined ? (data as any).ratePerThousand : ((data as any).payoutRate || 0)
  const budgetTotal = (data as any).budgetTotal !== undefined ? (data as any).budgetTotal : ((data as any).prizePool || (data as any).budget || 0)

  // Only include fields that exist in Appwrite schema
  const documentData: any = {
    campaignId: campaignId,
    type: data.type,
    title: data.title,
    description: data.description,
    createdBy: createdBy,
    status: data.status,
    prizePool: data.prizePool,
    budgetTotal: budgetTotal,
    ratePerThousand: ratePerThousand,
    minViews: data.minViews,
    minDuration: data.minDuration,
    maxDuration: data.maxDuration,
    platforms: data.platforms,
    socialLinks: data.socialLinks,
    gdocUrl: data.gdocUrl,
    imageUrl: data.imageUrl
  }

  console.log('🎬 Creating campaign document with data:', documentData)
  console.log('🎬 campaignId:', documentData.campaignId)
  console.log('🎬 createdBy:', documentData.createdBy)
  console.log('🎬 ratePerThousand:', documentData.ratePerThousand)
  console.log('🎬 budgetTotal:', documentData.budgetTotal)
  console.log('🎬 prizePool:', documentData.prizePool)
  console.log('�� All field values:', {
    campaignId: documentData.campaignId,
    type: documentData.type,
    title: documentData.title
  })

  const response = await databases.createDocument(
    DB_ID,
    COLLECTIONS.CAMPAIGNS,
    'unique()',
    documentData
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
