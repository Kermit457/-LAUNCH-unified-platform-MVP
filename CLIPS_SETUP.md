# Clips Collection Setup Guide

## Quick Setup (Automated)

**Option 1: Run Setup Script**
```bash
# Make sure you have APPWRITE_API_KEY in .env
npx tsx scripts/setup-clips-collection.ts
```

**Option 2: Manual Setup in Appwrite Console**

### 1. Create Collection

Go to your Appwrite Console → Database → Create Collection

- **Collection ID**: `clips`
- **Name**: Clips
- **Permissions**:
  - Read: `any` (public)
  - Create: `users` (authenticated)
  - Update: `users`
  - Delete: `users`

### 2. Create Attributes

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| `clipId` | String | 50 | ✅ | - |
| `submittedBy` | String | 255 | ✅ | - |
| `campaignId` | String | 50 | ❌ | - |
| `platform` | String | 20 | ✅ | - |
| `embedUrl` | String | 500 | ✅ | - |
| `thumbnailUrl` | String | 500 | ❌ | - |
| `title` | String | 200 | ❌ | - |
| `projectName` | String | 100 | ❌ | - |
| `badge` | String | 20 | ❌ | - |
| `views` | Integer | - | ✅ | 0 |
| `likes` | Integer | - | ✅ | 0 |
| `comments` | Integer | - | ✅ | 0 |
| `shares` | Integer | - | ✅ | 0 |
| `engagement` | Float | - | ✅ | 0.0 |
| `clicks` | Integer | - | ✅ | 0 |
| `status` | String | 20 | ✅ | active |
| `ownerType` | String | 20 | ❌ | - |
| `ownerId` | String | 50 | ❌ | - |
| `referralCode` | String | 50 | ❌ | - |
| `approved` | Boolean | - | ✅ | false |
| `metadata` | String | 2000 | ❌ | - |

### 3. Create Indexes

1. **by_submittedBy**
   - Type: Key
   - Attributes: `submittedBy` (ASC)

2. **by_campaignId**
   - Type: Key
   - Attributes: `campaignId` (ASC)

3. **by_status**
   - Type: Key
   - Attributes: `status` (ASC)

4. **by_platform**
   - Type: Key
   - Attributes: `platform` (ASC)

5. **by_views_desc**
   - Type: Key
   - Attributes: `views` (DESC)

6. **by_engagement**
   - Type: Key
   - Attributes: `engagement` (DESC)

### 4. Test It!

Visit http://localhost:3000/clip and submit your first clip!

---

## Platform Metrics - Free APIs

### YouTube
- **API**: YouTube Data API v3
- **Endpoint**: `https://www.googleapis.com/youtube/v3/videos`
- **Metrics**: views, likes, comments
- **Docs**: https://developers.google.com/youtube/v3/docs/videos

### Twitter/X
- **API**: Twitter API v2 (Free tier available)
- **Endpoint**: `https://api.twitter.com/2/tweets`
- **Metrics**: views, likes, retweets, replies
- **Docs**: https://developer.twitter.com/en/docs/twitter-api

### TikTok
- **API**: TikTok Embed API (Public data only)
- **Endpoint**: `https://www.tiktok.com/oembed`
- **Metrics**: views, likes, comments, shares
- **Docs**: https://developers.tiktok.com/doc/embed-videos

### Instagram
- **API**: Instagram Basic Display API
- **Endpoint**: `https://graph.instagram.com`
- **Metrics**: likes, comments
- **Docs**: https://developers.facebook.com/docs/instagram-basic-display-api

### Twitch
- **API**: Twitch Helix API
- **Endpoint**: `https://api.twitch.tv/helix/videos`
- **Metrics**: views, duration
- **Docs**: https://dev.twitch.tv/docs/api/

---

## Next Steps

1. **Setup Collection** (run script or manual)
2. **Test Clip Submission** (paste a social URL)
3. **Implement Metrics Sync** (optional - background job to fetch stats)
4. **Add Thumbnail Fetching** (optional - use oEmbed APIs)

---

## Metrics Display

Current display on clip cards:
- ❤️ **Likes**: From platform API
- 💬 **Comments**: From platform API
- 🔄 **Shares**: From platform API
- 📊 **Engagement**: Calculated as (likes + comments + shares) / views * 100

Dashboard metrics:
- **Total Views**: Sum of all clip views
- **Total Likes**: Sum of all clip likes
- **Click-Through**: Clicks from our platform to social posts
- **Avg Engagement**: Average engagement rate across all clips
