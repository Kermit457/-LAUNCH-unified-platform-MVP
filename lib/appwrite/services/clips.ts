import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'
import { getCampaign } from './campaigns'

export interface Clip {
  $id: string
  $createdAt: string
  $updatedAt: string
  clipId: string
  submittedBy: string
  campaignId?: string
  platform: 'twitter' | 'tiktok' | 'youtube' | 'twitch' | 'instagram'
  embedUrl: string
  thumbnailUrl?: string
  title?: string
  projectName?: string
  badge?: 'LIVE' | 'FROZEN' | 'LAUNCHED'
  // Platform metrics (fetched from APIs)
  views: number         // From platform API
  likes: number         // From platform API
  comments: number      // From platform API
  shares: number        // From platform API
  engagement: number    // Calculated: (likes + comments + shares) / views * 100
  // Our tracking
  clicks: number        // Clicks from our platform to their post
  referralCode?: string
  status: 'active' | 'pending' | 'rejected' | 'removed'
  ownerType?: 'user' | 'project'
  ownerId?: string
  approved: boolean
  metadata?: string
  // Creator/Project info (populated from ownerType/ownerId)
  creatorAvatar?: string
  creatorUsername?: string
  projectLogo?: string
  projectId?: string
}

/**
 * Detect social media platform from URL
 */
export function detectPlatform(url: string): 'twitter' | 'tiktok' | 'youtube' | 'twitch' | 'instagram' | null {
  const urlLower = url.toLowerCase()

  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter'
  if (urlLower.includes('tiktok.com')) return 'tiktok'
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube'
  if (urlLower.includes('twitch.tv')) return 'twitch'
  if (urlLower.includes('instagram.com')) return 'instagram'

  return null
}

/**
 * Generate unique referral code for tracking
 */
export function generateReferralCode(): string {
  return `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Fetch thumbnail URL from platform oEmbed API
 */
export async function fetchThumbnail(url: string, platform: string): Promise<string | undefined> {
  try {
    let oembedUrl = ''

    switch (platform) {
      case 'youtube':
        oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
        break
      case 'twitter':
        // Twitter oEmbed requires API key, skip for now
        return undefined
      case 'tiktok':
        oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
        break
      case 'instagram':
        // Instagram oEmbed requires access token, skip for now
        return undefined
      case 'twitch':
        // Twitch doesn't have public oEmbed, skip for now
        return undefined
      default:
        return undefined
    }

    if (!oembedUrl) return undefined

    const response = await fetch(oembedUrl)
    if (!response.ok) return undefined

    const data = await response.json()
    return data.thumbnail_url || undefined
  } catch (error) {
    console.warn('Failed to fetch thumbnail:', error)
    return undefined
  }
}

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Fetch platform metrics (views, likes, comments) via server API route
 */
export async function fetchPlatformMetrics(url: string, platform: string): Promise<{
  views: number
  likes: number
  comments: number
  shares: number
} | null> {
  try {
    const response = await fetch('/api/fetch-clip-metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, platform }),
    })

    if (!response.ok) {
      console.error('Failed to fetch metrics:', response.status)
      return null
    }

    const metrics = await response.json()
    return metrics
  } catch (error) {
    console.error('Failed to fetch platform metrics:', error)
    return null
  }
}

/**
 * Get all clips with optional filters
 */
export async function getClips(options?: {
  status?: 'active' | 'pending' | 'rejected' | 'removed'
  platform?: 'twitter' | 'tiktok' | 'youtube' | 'twitch' | 'instagram'
  campaignId?: string
  submittedBy?: string
  ownerType?: 'user' | 'project'
  ownerId?: string
  sortBy?: 'views' | 'createdAt'
  limit?: number
  offset?: number
}): Promise<Clip[]> {
  try {
    const queries = []

    if (options?.status) {
      queries.push(Query.equal('status', options.status))
    }

    if (options?.platform) {
      queries.push(Query.equal('platform', options.platform))
    }

    if (options?.campaignId) {
      queries.push(Query.equal('campaignId', options.campaignId))
    }

    if (options?.submittedBy) {
      queries.push(Query.equal('submittedBy', options.submittedBy))
    }

    if (options?.ownerType) {
      queries.push(Query.equal('ownerType', options.ownerType))
    }

    if (options?.ownerId) {
      queries.push(Query.equal('ownerId', options.ownerId))
    }

    // Sorting
    switch (options?.sortBy) {
      case 'views':
        queries.push(Query.orderDesc('views'))
        break
      default:
        queries.push(Query.orderDesc('$createdAt'))
    }

    if (options?.limit) {
      queries.push(Query.limit(options.limit))
    }

    if (options?.offset) {
      queries.push(Query.offset(options.offset))
    }

    const response = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.CLIPS,
      queries
    )

    return response.documents as unknown as Clip[]
  } catch (error) {
    console.error('Failed to fetch clips:', error)
    return []
  }
}

/**
 * Get a single clip by ID
 */
export async function getClip(clipId: string): Promise<Clip | null> {
  try {
    const response = await databases.getDocument(
      DB_ID,
      COLLECTIONS.CLIPS,
      clipId
    )

    return response as unknown as Clip
  } catch (error) {
    console.error(`Failed to fetch clip ${clipId}:`, error)
    return null
  }
}

/**
 * Submit a new clip
 */
export async function submitClip(data: {
  embedUrl: string
  submittedBy: string
  campaignId?: string
  title?: string
  projectName?: string
  projectId?: string
  creatorUsername?: string
  creatorAvatar?: string
  projectLogo?: string
  badge?: 'LIVE' | 'FROZEN' | 'LAUNCHED'
}): Promise<Clip | null> {
  try {
    // Detect platform from URL
    const platform = detectPlatform(data.embedUrl)
    if (!platform) {
      throw new Error('Unsupported platform. Please use Twitter, TikTok, YouTube, Twitch, or Instagram URLs.')
    }

    // Generate unique IDs
    const clipId = `clip_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    const referralCode = generateReferralCode()

    const documentData: any = {
      clipId,
      submittedBy: data.submittedBy,
      platform,
      embedUrl: data.embedUrl,
      status: data.campaignId ? 'pending' : 'active', // Pending if submitted to campaign
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0,
      clicks: 0,
      referralCode,
      approved: !data.campaignId, // Auto-approve if not campaign submission
      ownerType: 'user',
      ownerId: data.submittedBy
    }

    // Optional fields
    if (data.campaignId) documentData.campaignId = data.campaignId
    if (data.title) documentData.title = data.title
    if (data.projectName) documentData.projectName = data.projectName
    if (data.projectId) documentData.projectId = data.projectId
    if (data.creatorUsername) documentData.creatorUsername = data.creatorUsername
    if (data.creatorAvatar) documentData.creatorAvatar = data.creatorAvatar
    if (data.projectLogo) documentData.projectLogo = data.projectLogo
    if (data.badge) documentData.badge = data.badge

    // Fetch thumbnail from platform oEmbed API
    const thumbnailUrl = await fetchThumbnail(data.embedUrl, platform)
    if (thumbnailUrl) {
      documentData.thumbnailUrl = thumbnailUrl
    }

    // Fetch platform metrics (views, likes, comments)
    const metrics = await fetchPlatformMetrics(data.embedUrl, platform)
    if (metrics) {
      documentData.views = metrics.views
      documentData.likes = metrics.likes
      documentData.comments = metrics.comments
      documentData.shares = metrics.shares

      // Calculate engagement rate
      if (metrics.views > 0) {
        const totalInteractions = metrics.likes + metrics.comments + metrics.shares
        documentData.engagement = (totalInteractions / metrics.views) * 100
      }
    }

    console.log('📹 Creating clip document:', documentData)

    const response = await databases.createDocument(
      DB_ID,
      COLLECTIONS.CLIPS,
      'unique()',
      documentData
    )

    return response as unknown as Clip
  } catch (error) {
    console.error('Failed to submit clip:', error)
    throw error
  }
}

/**
 * Update clip statistics (from platform API data)
 */
export async function updateClipStats(
  clipId: string,
  stats: {
    views?: number
    likes?: number
    comments?: number
    shares?: number
    clicks?: number
  }
): Promise<Clip | null> {
  try {
    const updateData: any = {}

    if (stats.views !== undefined) updateData.views = stats.views
    if (stats.likes !== undefined) updateData.likes = stats.likes
    if (stats.comments !== undefined) updateData.comments = stats.comments
    if (stats.shares !== undefined) updateData.shares = stats.shares
    if (stats.clicks !== undefined) updateData.clicks = stats.clicks

    // Calculate engagement rate
    if (stats.views !== undefined && stats.views > 0) {
      const totalInteractions = (stats.likes || 0) + (stats.comments || 0) + (stats.shares || 0)
      updateData.engagement = (totalInteractions / stats.views) * 100
    }

    const response = await databases.updateDocument(
      DB_ID,
      COLLECTIONS.CLIPS,
      clipId,
      updateData
    )

    return response as unknown as Clip
  } catch (error) {
    console.error(`Failed to update clip stats ${clipId}:`, error)
    return null
  }
}

/**
 * Approve/reject a clip (for campaign owners)
 * @param clipId - The clip ID to approve/reject
 * @param approved - Whether to approve (true) or reject (false)
 * @param userId - The user ID attempting the action (for authorization)
 */
export async function approveClip(clipId: string, approved: boolean, userId?: string): Promise<Clip | null> {
  try {
    // Authorization: Verify user owns the campaign
    if (userId) {
      const clip = await getClip(clipId)
      if (!clip) {
        throw new Error('Clip not found')
      }

      if (clip.campaignId) {
        const campaign = await getCampaign(clip.campaignId)
        if (!campaign) {
          throw new Error('Campaign not found')
        }

        if (campaign.createdBy !== userId) {
          throw new Error('Unauthorized: You do not own this campaign')
        }
      }
    }

    const response = await databases.updateDocument(
      DB_ID,
      COLLECTIONS.CLIPS,
      clipId,
      {
        approved,
        status: approved ? 'active' : 'rejected'
      }
    )

    return response as unknown as Clip
  } catch (error) {
    console.error(`Failed to approve clip ${clipId}:`, error)
    throw error // Re-throw for proper error handling
  }
}

/**
 * Delete a clip
 */
export async function deleteClip(clipId: string): Promise<boolean> {
  try {
    await databases.deleteDocument(
      DB_ID,
      COLLECTIONS.CLIPS,
      clipId
    )
    return true
  } catch (error) {
    console.error(`Failed to delete clip ${clipId}:`, error)
    return false
  }
}

/**
 * Get top clips (by views, trending, etc.)
 */
export async function getTopClips(sortBy: 'views' | 'createdAt' = 'views', limit = 12): Promise<Clip[]> {
  return getClips({ status: 'active', sortBy, limit })
}

/**
 * Get clips by campaign
 */
export async function getCampaignClips(campaignId: string, limit = 50): Promise<Clip[]> {
  return getClips({ campaignId, limit })
}

/**
 * Get user's submitted clips
 */
export async function getUserClips(userId: string, limit = 50): Promise<Clip[]> {
  return getClips({ submittedBy: userId, limit })
}
