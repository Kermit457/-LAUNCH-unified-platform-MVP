/**
 * Twitter/X API Wrapper
 *
 * Twitter API v2 Options:
 * 1. Free Tier: 1,500 tweets/month read limit
 * 2. Basic ($100/mo): 10,000 tweets/month
 * 3. Pro ($5,000/mo): 1M tweets/month
 *
 * This wrapper provides fallbacks when API limits are reached
 */

export interface TwitterMetrics {
  views: number
  likes: number
  comments: number
  shares: number
  bookmarks?: number
  quotes?: number
  tweetUrl?: string
  authorUsername?: string
  text?: string
  createdAt?: string
}

/**
 * Extract tweet ID from various Twitter/X URL formats
 */
export function extractTweetId(url: string): string | null {
  const patterns = [
    /twitter\.com\/[^\/]+\/status\/(\d+)/,
    /x\.com\/[^\/]+\/status\/(\d+)/,
    /twitter\.com\/i\/web\/status\/(\d+)/,
    /x\.com\/i\/web\/status\/(\d+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Fetch tweet metrics using Twitter API v2
 */
export async function fetchTwitterMetrics(
  url: string,
  bearerToken?: string
): Promise<TwitterMetrics> {
  const tweetId = extractTweetId(url)

  if (!tweetId) {
    throw new Error('Invalid Twitter URL')
  }

  // If no bearer token, return zeros (graceful degradation)
  if (!bearerToken) {
    console.warn('⚠️  Twitter Bearer Token not configured - metrics unavailable')
    return {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      tweetUrl: url
    }
  }

  try {
    // Twitter API v2 endpoint with public metrics
    const apiUrl = `https://api.twitter.com/2/tweets/${tweetId}?` +
      'tweet.fields=public_metrics,created_at,author_id&' +
      'expansions=author_id&' +
      'user.fields=username'

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'User-Agent': 'LaunchOS-v1'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Twitter API error:', response.status, errorText)

      // Check if rate limited
      if (response.status === 429) {
        const resetTime = response.headers.get('x-rate-limit-reset')
        console.warn(`Rate limited. Resets at: ${resetTime}`)
      }

      return {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        tweetUrl: url
      }
    }

    const data = await response.json()

    if (!data.data || !data.data.public_metrics) {
      return {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        tweetUrl: url
      }
    }

    const tweet = data.data
    const metrics = tweet.public_metrics
    const author = data.includes?.users?.[0]

    return {
      views: metrics.impression_count || 0,
      likes: metrics.like_count || 0,
      comments: metrics.reply_count || 0,
      shares: metrics.retweet_count || 0,
      bookmarks: metrics.bookmark_count || 0,
      quotes: metrics.quote_count || 0,
      tweetUrl: url,
      authorUsername: author?.username || '',
      text: tweet.text || '',
      createdAt: tweet.created_at || ''
    }
  } catch (error) {
    console.error('Twitter API error:', error)
    return {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      tweetUrl: url
    }
  }
}

/**
 * Validate Twitter URL using oEmbed (free, no auth required)
 */
export async function validateTwitterUrl(url: string): Promise<boolean> {
  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`
    const response = await fetch(oembedUrl)
    return response.ok
  } catch (error) {
    console.error('Twitter oEmbed error:', error)
    return false
  }
}

/**
 * Batch fetch Twitter metrics with rate limiting
 */
export async function fetchTwitterMetricsBatch(
  urls: string[],
  bearerToken: string,
  delayMs: number = 500
): Promise<Map<string, TwitterMetrics>> {
  const results = new Map<string, TwitterMetrics>()

  for (const url of urls) {
    try {
      const metrics = await fetchTwitterMetrics(url, bearerToken)
      results.set(url, metrics)

      // Rate limiting - Twitter allows 15 requests per 15min window for free tier
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    } catch (error) {
      console.error(`Failed to fetch metrics for ${url}:`, error)
      results.set(url, {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        tweetUrl: url
      })
    }
  }

  return results
}

/**
 * Get Twitter API rate limit status
 */
export async function getTwitterRateLimitStatus(bearerToken: string) {
  try {
    const response = await fetch('https://api.twitter.com/2/tweets/sample/stream', {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    })

    return {
      limit: response.headers.get('x-rate-limit-limit'),
      remaining: response.headers.get('x-rate-limit-remaining'),
      reset: response.headers.get('x-rate-limit-reset')
    }
  } catch (error) {
    console.error('Failed to get rate limit status:', error)
    return null
  }
}
