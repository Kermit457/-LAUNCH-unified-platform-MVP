# Social Platform API Setup Guide

This guide explains how to set up API keys for fetching real metrics from social platforms.

## Overview

The `/clip` page fetches real video metrics from:
- ✅ **YouTube** - Fully supported with API key
- ✅ **Twitter/X** - Supported with Bearer Token
- ⚠️  **TikTok** - Unofficial API (may break) or official API with approval
- ❌ **Instagram** - Requires Facebook Business account
- ❌ **Twitch** - Not yet implemented

---

## YouTube Data API v3 Setup

### 1. Get API Key (Free - 10,000 requests/day)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "YouTube Data API v3"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key

### 2. Add to Environment Variables

```env
# .env.local
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Metrics Available
- Views (`viewCount`)
- Likes (`likeCount`)
- Comments (`commentCount`)
- Shares (not available from YouTube API)

### 4. Rate Limits
- **Free tier**: 10,000 units/day
- Each video stats request costs **1 unit**
- Monitor usage: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas

---

## Twitter/X API v2 Setup

### 1. Get Bearer Token

#### Option 1: Free Tier (1,500 tweets/month)
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign up for Developer Account (requires approval - can take 1-3 days)
3. Create a new App
4. Go to "Keys and Tokens" → Generate "Bearer Token"
5. Copy the Bearer Token

#### Option 2: Basic Plan ($100/month - 10,000 tweets/month)
- Better for production use
- Higher rate limits

### 2. Add to Environment Variables

```env
# .env.local
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAABearerTokenHere
```

### 3. Metrics Available
- Views (`impression_count`) - **Only available for your own tweets**
- Likes (`like_count`)
- Comments/Replies (`reply_count`)
- Retweets (`retweet_count`)
- Quotes (`quote_count`)
- Bookmarks (`bookmark_count`)

### 4. Rate Limits
| Tier | Monthly Tweets | Price |
|------|---------------|-------|
| Free | 1,500 | $0 |
| Basic | 10,000 | $100/mo |
| Pro | 1,000,000 | $5,000/mo |

### 5. Important Notes
- **View counts** only available for:
  - Your own tweets (the app owner's tweets)
  - Tweets from users who authorized your app
- For other users' tweets, `impression_count` will be `null`

---

## TikTok API Setup

### Option 1: Unofficial API (Free, but may break)

**No setup required** - Uses TikTok's internal endpoints

**Pros:**
- No API key needed
- Works for any public video
- Returns all metrics (views, likes, comments, shares)

**Cons:**
- May break without notice if TikTok changes their endpoints
- Against TikTok's ToS (use at your own risk)
- May get IP-banned if too many requests

**Implementation:** Already included in `lib/api/tiktok-wrapper.ts`

### Option 2: Official TikTok API (Requires approval)

#### Step 1: Apply for TikTok Developer Account
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Register account
3. Apply for "Content Posting API" or "Research API"
4. **Wait for approval** (can take weeks or months)

#### Step 2: Get Credentials
1. Create an App in TikTok Developer Portal
2. Get Client Key and Client Secret

#### Step 3: User OAuth Flow
- Each creator must authorize your app
- You can only fetch metrics for videos from users who authorized you
- Not suitable for aggregating public videos

```env
# .env.local
TIKTOK_CLIENT_KEY=awxxxxxxxxxxxx
TIKTOK_CLIENT_SECRET=xxxxxxxxxxxxxx
```

### Recommendation
**Use unofficial API for now**, but be prepared to switch to official API if it breaks or you get approval.

---

## Instagram API Setup

### Requirements
- Facebook Business Account
- Instagram Business or Creator Account
- Facebook App with Instagram Basic Display or Instagram Graph API

### Steps
1. Create [Facebook App](https://developers.facebook.com/apps/)
2. Add "Instagram Basic Display" or "Instagram Graph API"
3. Get Instagram Business Account ID
4. Request permissions for `instagram_basic`, `instagram_manage_insights`

### Metrics Available
- Impressions
- Reach
- Engagement
- Saves

### Note
Instagram API is complex and requires business accounts. Not recommended for user-generated content aggregation.

---

## Environment Variables Summary

Add these to `.env.local`:

```env
# YouTube (Required for YouTube metrics)
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Twitter (Optional - graceful degradation if missing)
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAABearerTokenHere

# TikTok (Optional - uses unofficial API if not provided)
TIKTOK_CLIENT_KEY=awxxxxxxxxxxxx
TIKTOK_CLIENT_SECRET=xxxxxxxxxxxxxx

# Instagram (Not implemented)
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=

# Twitch (Not implemented)
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
```

---

## Testing API Integration

### 1. Test YouTube API
```bash
curl -X POST http://localhost:3000/api/fetch-clip-metrics \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "platform": "youtube"
  }'
```

Expected response:
```json
{
  "views": 1234567,
  "likes": 12345,
  "comments": 1234,
  "shares": 0
}
```

### 2. Test Twitter API
```bash
curl -X POST http://localhost:3000/api/fetch-clip-metrics \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://twitter.com/username/status/1234567890",
    "platform": "twitter"
  }'
```

### 3. Test TikTok API
```bash
curl -X POST http://localhost:3000/api/fetch-clip-metrics \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.tiktok.com/@username/video/1234567890",
    "platform": "tiktok"
  }'
```

---

## Error Handling

All API wrappers implement graceful degradation:

1. **API key missing**: Returns `{ views: 0, likes: 0, comments: 0, shares: 0 }`
2. **Rate limit exceeded**: Returns zeros and logs warning
3. **Invalid URL**: Returns 400 error
4. **Network error**: Returns zeros and logs error

No user-facing errors - always returns valid metric objects.

---

## Cost Estimation

### For 1,000 clips/day:

| Platform | Free Tier | Paid Tier | Estimated Cost |
|----------|-----------|-----------|----------------|
| YouTube | 10,000 req/day | $0 | **Free** |
| Twitter | 1,500 req/month | $100/month for 10K | **$100/mo** |
| TikTok (unofficial) | Unlimited | N/A | **Free** |
| TikTok (official) | 100 req/day | Contact sales | **Unknown** |

**Recommended for production:**
- YouTube API: Free tier sufficient
- Twitter: Free tier (150 clips) or Basic ($100/mo for 10K clips)
- TikTok: Unofficial API (free, but risky)

---

## Monitoring & Alerts

### YouTube Quota Monitoring
```typescript
// Check quota usage
https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
```

### Twitter Rate Limit Monitoring
```typescript
import { getTwitterRateLimitStatus } from '@/lib/api/twitter-wrapper'

const status = await getTwitterRateLimitStatus(bearerToken)
console.log('Remaining:', status.remaining)
console.log('Resets at:', new Date(parseInt(status.reset) * 1000))
```

### TikTok Health Check
```typescript
// No official health check - monitor error rates in logs
// If unofficial API starts returning 0s, consider switching to official
```

---

## Security Best Practices

1. **Never commit API keys** - Use `.env.local` (already in `.gitignore`)
2. **Rotate keys regularly** - Especially if exposed
3. **Use environment-specific keys** - Different keys for dev/staging/prod
4. **Monitor usage** - Set up alerts for quota/rate limit warnings
5. **Implement caching** - Reduce API calls with Redis/Vercel KV

---

## Next Steps

1. ✅ Set up YouTube API key (required)
2. ✅ Set up Twitter Bearer Token (optional but recommended)
3. ⏳ Monitor TikTok unofficial API reliability
4. ⏳ Apply for TikTok official API (backup plan)
5. ⏳ Implement caching to reduce API costs
