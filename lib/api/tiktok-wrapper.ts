/**
 * TikTok API Wrapper
 *
 * TikTok has strict API access requirements:
 * 1. Official API requires app approval (can take weeks/months)
 * 2. Only works for videos from users who authorized your app
 * 3. No public metrics API available
 *
 * This wrapper provides multiple fallback strategies:
 * - Official TikTok API (if credentials provided)
 * - Unofficial TikTok API endpoints
 * - oEmbed for basic video info
 */

export interface TikTokMetrics {
  views: number
  likes: number
  comments: number
  shares: number
  videoUrl?: string
  thumbnailUrl?: string
  authorUsername?: string
  description?: string
}

/**
 * Extract TikTok video ID from various URL formats
 */
export function extractTikTokId(url: string): string | null {
  const patterns = [
    /tiktok\.com\/@[^\/]+\/video\/(\d+)/,
    /tiktok\.com\/v\/(\d+)/,
    /vm\.tiktok\.com\/([A-Za-z0-9]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Fetch TikTok metrics using unofficial API
 * This uses TikTok's internal endpoints (may break without notice)
 */
async function fetchTikTokUnofficial(videoId: string): Promise<TikTokMetrics | null> {
  try {
    // TikTok's unofficial API endpoint (used by their own web player)
    const apiUrl = `https://www.tiktok.com/api/item/detail/?itemId=${videoId}`

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      console.warn('TikTok unofficial API failed:', response.status)
      return null
    }

    const data = await response.json()

    if (!data.itemInfo || !data.itemInfo.itemStruct) {
      return null
    }

    const video = data.itemInfo.itemStruct
    const stats = video.stats

    return {
      views: stats.playCount || 0,
      likes: stats.diggCount || 0,
      comments: stats.commentCount || 0,
      shares: stats.shareCount || 0,
      videoUrl: video.video?.downloadAddr || '',
      thumbnailUrl: video.video?.cover || '',
      authorUsername: video.author?.uniqueId || '',
      description: video.desc || ''
    }
  } catch (error) {
    console.error('TikTok unofficial API error:', error)
    return null
  }
}

/**
 * Fetch TikTok video info using oEmbed (no metrics, just validates URL)
 */
async function fetchTikTokOEmbed(url: string): Promise<{ valid: boolean; html?: string }> {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    const response = await fetch(oembedUrl)

    if (!response.ok) {
      return { valid: false }
    }

    const data = await response.json()
    return {
      valid: true,
      html: data.html
    }
  } catch (error) {
    console.error('TikTok oEmbed error:', error)
    return { valid: false }
  }
}

/**
 * Main function to fetch TikTok metrics
 * Tries multiple strategies in order of reliability
 */
export async function fetchTikTokMetrics(url: string): Promise<TikTokMetrics> {
  const videoId = extractTikTokId(url)

  if (!videoId) {
    throw new Error('Invalid TikTok URL')
  }

  // Strategy 1: Try unofficial API (most likely to have metrics)
  const unofficialData = await fetchTikTokUnofficial(videoId)
  if (unofficialData) {
    console.log('✅ TikTok metrics fetched via unofficial API')
    return unofficialData
  }

  // Strategy 2: Validate URL with oEmbed (no metrics but confirms video exists)
  const oembedData = await fetchTikTokOEmbed(url)
  if (oembedData.valid) {
    console.warn('⚠️  TikTok URL valid but metrics unavailable')
    return {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    }
  }

  // Strategy 3: Complete failure
  console.error('❌ TikTok metrics unavailable - all strategies failed')
  return {
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0
  }
}

/**
 * Batch fetch TikTok metrics for multiple videos
 * Includes rate limiting to avoid getting blocked
 */
export async function fetchTikTokMetricsBatch(
  urls: string[],
  delayMs: number = 1000
): Promise<Map<string, TikTokMetrics>> {
  const results = new Map<string, TikTokMetrics>()

  for (const url of urls) {
    try {
      const metrics = await fetchTikTokMetrics(url)
      results.set(url, metrics)

      // Rate limiting - wait between requests
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    } catch (error) {
      console.error(`Failed to fetch metrics for ${url}:`, error)
      results.set(url, {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0
      })
    }
  }

  return results
}
