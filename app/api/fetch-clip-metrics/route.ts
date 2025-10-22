import { NextRequest, NextResponse } from 'next/server'
import { fetchTikTokMetrics } from '@/lib/api/tiktok-wrapper'
import { fetchTwitterMetrics } from '@/lib/api/twitter-wrapper'

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
 * Extract TikTok video ID from URL
 */
function extractTikTokId(url: string): string | null {
  // TikTok URLs: https://www.tiktok.com/@username/video/1234567890
  // TikTok short URLs: https://vm.tiktok.com/XXXXX
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
 * API Route: Fetch clip metrics from platform APIs
 * POST /api/fetch-clip-metrics
 * Body: { url: string, platform: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { url, platform } = await request.json()

    if (!url || !platform) {
      return NextResponse.json(
        { error: 'Missing url or platform' },
        { status: 400 }
      )
    }

    switch (platform) {
      case 'youtube': {
        const videoId = extractYouTubeId(url)
        if (!videoId) {
          return NextResponse.json(
            { error: 'Invalid YouTube URL' },
            { status: 400 }
          )
        }

        const apiKey = process.env.YOUTUBE_API_KEY
        if (!apiKey) {
          console.warn('YouTube API key not configured')
          return NextResponse.json({
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0
          })
        }

        // Fetch video statistics from YouTube Data API v3
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          console.error('YouTube API error:', response.status, response.statusText)
          return NextResponse.json({
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0
          })
        }

        const data = await response.json()

        if (!data.items || data.items.length === 0) {
          return NextResponse.json({
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0
          })
        }

        const stats = data.items[0].statistics

        return NextResponse.json({
          views: parseInt(stats.viewCount || '0'),
          likes: parseInt(stats.likeCount || '0'),
          comments: parseInt(stats.commentCount || '0'),
          shares: 0 // YouTube API doesn't provide share count
        })
      }

      case 'tiktok': {
        // Use TikTok wrapper with unofficial API fallback
        try {
          const metrics = await fetchTikTokMetrics(url)

          return NextResponse.json({
            views: metrics.views,
            likes: metrics.likes,
            comments: metrics.comments,
            shares: metrics.shares
          })
        } catch (error) {
          console.error('TikTok error:', error)
          return NextResponse.json({
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0
          })
        }
      }

      case 'twitter': {
        // Use Twitter wrapper with graceful degradation
        try {
          const bearerToken = process.env.TWITTER_BEARER_TOKEN
          const metrics = await fetchTwitterMetrics(url, bearerToken)

          return NextResponse.json({
            views: metrics.views,
            likes: metrics.likes,
            comments: metrics.comments,
            shares: metrics.shares
          })
        } catch (error) {
          console.error('Twitter error:', error)
          return NextResponse.json({
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0
          })
        }
      }

      case 'instagram':
      case 'twitch':
      default:
        // Not implemented yet
        return NextResponse.json({
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        })
    }
  } catch (error) {
    console.error('Error fetching clip metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
