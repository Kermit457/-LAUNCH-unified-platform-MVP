# YouTube Data API v3 Setup Guide

## 🎯 Purpose
Fetch real-time metrics (views, likes, comments) from YouTube videos when users submit clips.

## 📊 What You Get
- **Views Count**: Total video views
- **Likes**: Number of likes
- **Comments**: Number of comments
- **Auto-calculated Engagement**: `(likes + comments) / views * 100`

## 🔑 Getting Your Free API Key

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it: `LaunchOS Clips` (or whatever you prefer)
4. Click "Create"

### Step 2: Enable YouTube Data API v3
1. In your project, go to **APIs & Services** → **Library**
2. Search for: `YouTube Data API v3`
3. Click on it → Click **"Enable"**

### Step 3: Create API Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"API Key"**
3. Your API key will appear! Copy it.
4. (Optional) Click **"Restrict Key"** to limit it:
   - **Application restrictions**: None (for development)
   - **API restrictions**: Select "YouTube Data API v3" only
   - Click **"Save"**

### Step 4: Add to Your Project
1. Open `.env.local`
2. Replace `your_youtube_api_key_here` with your actual key:
   ```
   YOUTUBE_API_KEY=AIzaSyD...your_key_here
   ```
3. Restart your dev server

## 📈 Free Tier Limits
- **10,000 quota units per day** (generous!)
- Each video stats request costs **1 unit**
- This means: **10,000 clip submissions per day** for free

If you exceed this:
- Either request quota increase (free)
- Or implement caching (refresh metrics every 24h)

## 🧪 Testing
1. Submit a YouTube clip: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
2. Check console logs for: `📹 Creating clip document:`
3. The clip card should now show real views/likes/comments!

## 🔒 Security
- ✅ API key is server-side only (not exposed to browser)
- ✅ Restricted to YouTube Data API v3
- ✅ Free tier is sufficient for most use cases

## 🚀 Next Steps: TikTok API
For TikTok metrics, we have two options:

### Option A: Official TikTok API (Requires Approval)
1. Apply at: https://developers.tiktok.com/
2. Get approved (can take weeks)
3. Use Display API for public video stats

### Option B: Unofficial TikTok-Api (Python)
- Uses browser cookies (`ms_token`)
- No approval needed
- Requires Python backend service
- GitHub: https://github.com/davidteather/TikTok-Api

**Recommendation:** Start with YouTube (easiest), add TikTok later if needed.

## 📝 API Documentation
- [YouTube Data API v3 Docs](https://developers.google.com/youtube/v3/docs)
- [Video Statistics Endpoint](https://developers.google.com/youtube/v3/docs/videos/list)
