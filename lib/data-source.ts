/**
 * Data Source Abstraction Layer
 *
 * This module provides a unified interface for fetching data,
 * automatically switching between mock data and real Appwrite data
 * based on the USE_MOCK_DATA environment variable.
 */

import { launchProjects } from './sampleData'
import { getLaunches, getLaunch, type Launch } from './appwrite/services/launches'
import { getCampaigns, getCampaignById, type Campaign } from './appwrite/services/campaigns'
import { getQuests, getQuestById, type Quest } from './appwrite/services/quests'
import { getSubmissions, type Submission } from './appwrite/services/submissions'
import { getPayouts, type Payout } from './appwrite/services/payouts'

// Feature flag from environment
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
export const SHOW_DEV_BANNER = process.env.NEXT_PUBLIC_SHOW_DEV_BANNER === 'true'

/**
 * Log data source mode on startup
 */
if (typeof window !== 'undefined') {
  console.log(`🔧 Data Source: ${USE_MOCK_DATA ? 'MOCK DATA' : 'APPWRITE (LIVE)'}`)
}

// ============================================================================
// LAUNCHES
// ============================================================================

export interface LaunchesOptions {
  status?: 'live' | 'upcoming' | 'ended'
  limit?: number
  offset?: number
  sortBy?: 'recent' | 'marketCap' | 'volume' | 'conviction'
}

/**
 * Get launches - auto-switches between mock and real data
 */
export async function getDataLaunches(options?: LaunchesOptions): Promise<any[]> {
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock launches data')
    let filtered = launchProjects

    // Filter by status
    if (options?.status) {
      filtered = filtered.filter(p => p.status === options.status)
    }

    // Apply limit
    if (options?.limit) {
      filtered = filtered.slice(0, options.limit)
    }

    return filtered
  } else {
    console.log('🔥 Fetching launches from Appwrite')
    return await getLaunches(options)
  }
}

/**
 * Get single launch by ID
 */
export async function getDataLaunch(id: string): Promise<any> {
  if (USE_MOCK_DATA) {
    console.log(`📦 Using mock launch data for ID: ${id}`)
    const launch = launchProjects.find(p => p.id === id)
    if (!launch) {
      throw new Error(`Launch not found: ${id}`)
    }
    return launch
  } else {
    console.log(`🔥 Fetching launch ${id} from Appwrite`)
    return await getLaunch(id)
  }
}

// ============================================================================
// CAMPAIGNS
// ============================================================================

export interface CampaignsOptions {
  type?: 'bounty' | 'quest' | 'airdrop'
  status?: 'active' | 'completed' | 'cancelled'
  createdBy?: string
  limit?: number
  offset?: number
}

/**
 * Get campaigns - auto-switches between mock and real data
 */
export async function getDataCampaigns(options?: CampaignsOptions): Promise<Campaign[]> {
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock campaigns data')
    // Mock campaigns data
    return [
      {
        $id: '1',
        title: 'Clip $COIN Launch Video',
        description: 'Create engaging short-form content showcasing the $COIN token launch.',
        type: 'bounty' as const,
        creatorId: 'creator1',
        creatorName: 'COIN Team',
        budget: 2000,
        budgetPaid: 400,
        participants: 23,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active' as const,
        requirements: ['Minimum 1000 views', 'Video length 30-180 seconds'],
        tags: ['video', 'youtube', 'tiktok'],
        createdAt: new Date().toISOString(),
        ratePerThousand: 20,
        totalViews: 45,
        platforms: ['youtube', 'tiktok', 'twitch']
      }
    ]
  } else {
    console.log('🔥 Fetching campaigns from Appwrite')
    return await getCampaigns(options)
  }
}

/**
 * Get single campaign by ID
 */
export async function getDataCampaign(id: string): Promise<Campaign> {
  if (USE_MOCK_DATA) {
    console.log(`📦 Using mock campaign data for ID: ${id}`)
    const campaigns = await getDataCampaigns()
    const campaign = campaigns.find(c => c.$id === id)
    if (!campaign) {
      throw new Error(`Campaign not found: ${id}`)
    }
    return campaign
  } else {
    console.log(`🔥 Fetching campaign ${id} from Appwrite`)
    return await getCampaignById(id)
  }
}

// ============================================================================
// QUESTS / RAIDS
// ============================================================================

export interface QuestsOptions {
  limit?: number
  status?: string
}

/**
 * Get quests/raids - auto-switches between mock and real data
 */
export async function getDataQuests(options?: QuestsOptions): Promise<Quest[]> {
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock quests data')
    return [
      {
        $id: '1',
        questId: 'quest_1',
        type: 'raid' as const,
        title: 'Raid $COIN Twitter Launch',
        description: 'Like, retweet, and engage with the $COIN launch announcement',
        createdBy: 'creator1',
        status: 'active' as const,
        poolAmount: 1000,
        participants: 45,
        requirements: ['Follow @coinproject', 'Like launch tweet', 'Retweet with tag'],
        platforms: ['twitter'],
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      }
    ]
  } else {
    console.log('🔥 Fetching quests from Appwrite')
    return await getQuests(options)
  }
}

/**
 * Get single quest by ID
 */
export async function getDataQuest(id: string): Promise<Quest> {
  if (USE_MOCK_DATA) {
    console.log(`📦 Using mock quest data for ID: ${id}`)
    const quests = await getDataQuests()
    const quest = quests.find(q => q.$id === id)
    if (!quest) {
      throw new Error(`Quest not found: ${id}`)
    }
    return quest
  } else {
    console.log(`🔥 Fetching quest ${id} from Appwrite`)
    return await getQuestById(id)
  }
}

// ============================================================================
// SUBMISSIONS
// ============================================================================

export interface SubmissionsOptions {
  userId?: string
  campaignId?: string
  questId?: string
  status?: string
  limit?: number
}

/**
 * Get submissions - auto-switches between mock and real data
 */
export async function getDataSubmissions(options?: SubmissionsOptions): Promise<Submission[]> {
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock submissions data')
    return [
      {
        $id: '1',
        submissionId: 'sub_1',
        userId: options?.userId || 'user1',
        campaignId: options?.campaignId,
        questId: options?.questId,
        status: 'approved' as const,
        mediaUrl: 'https://youtube.com/watch?v=example',
        views: 15000,
        earnings: 300,
        $createdAt: new Date().toISOString()
      },
      {
        $id: '2',
        submissionId: 'sub_2',
        userId: options?.userId || 'user1',
        campaignId: options?.campaignId,
        questId: options?.questId,
        status: 'approved' as const,
        mediaUrl: 'https://youtube.com/watch?v=example2',
        views: 12000,
        earnings: 240,
        $createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  } else {
    console.log('🔥 Fetching submissions from Appwrite')
    return await getSubmissions(options)
  }
}

// ============================================================================
// PAYOUTS
// ============================================================================

export interface PayoutsOptions {
  userId?: string
  status?: string
  limit?: number
}

/**
 * Get payouts - auto-switches between mock and real data
 */
export async function getDataPayouts(options?: PayoutsOptions): Promise<Payout[]> {
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock payouts data')
    return [
      {
        $id: '1',
        payoutId: 'payout_1',
        userId: options?.userId || 'user1',
        amount: 300,
        currency: 'USDC',
        status: 'paid' as const,
        net: 285,
        fee: 15,
        txHash: '0x1234567890abcdef',
        paidAt: new Date().toISOString(),
        $createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        $id: '2',
        payoutId: 'payout_2',
        userId: options?.userId || 'user1',
        amount: 240,
        currency: 'USDC',
        status: 'claimable' as const,
        net: 228,
        fee: 12,
        $createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  } else {
    console.log('🔥 Fetching payouts from Appwrite')
    return await getPayouts(options)
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get data source mode
 */
export function getDataSourceMode(): 'mock' | 'live' {
  return USE_MOCK_DATA ? 'mock' : 'live'
}

/**
 * Check if using mock data
 */
export function isUsingMockData(): boolean {
  return USE_MOCK_DATA
}

/**
 * Check if dev banner should be shown
 */
export function shouldShowDevBanner(): boolean {
  return SHOW_DEV_BANNER || USE_MOCK_DATA
}
