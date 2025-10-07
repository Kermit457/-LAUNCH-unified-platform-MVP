# Social OAuth Implementation Guide

## ✅ Setup Complete

### 1. Environment Variables Added
All OAuth credentials are configured in `.env`:
- Instagram (Meta Graph API)
- TikTok (Login Kit)
- YouTube (Google OAuth)
- Discord

### 2. UI Updated
Profile page (`/dashboard/profile`) now shows all social connections:
- Twitter ✅ (via Privy - already working!)
- YouTube
- Instagram
- TikTok
- Discord
- Website

---

## 🔧 API Routes to Create

### Structure:
```
app/api/connect/
  ├── instagram/
  │   ├── route.ts (initiates OAuth)
  │   └── callback/route.ts (handles response)
  ├── tiktok/
  │   ├── route.ts
  │   └── callback/route.ts
  ├── youtube/
  │   ├── route.ts
  │   └── callback/route.ts
  └── discord/
      ├── route.ts
      └── callback/route.ts
```

---

## 📝 Implementation Templates

### Instagram OAuth (`app/api/connect/instagram/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const redirectUri = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&scope=user_profile&response_type=code`

  return NextResponse.redirect(redirectUri)
}
```

### Instagram Callback (`app/api/connect/instagram/callback/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  // Exchange code for access token
  const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.INSTAGRAM_CLIENT_ID!,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
      code: code!,
    }),
  })

  const { access_token } = await tokenResponse.json()

  // Get user profile
  const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${access_token}`)
  const userData = await userResponse.json()

  // TODO: Save to Appwrite user profile
  // await updateUserProfile(userId, { instagramUsername: userData.username })

  return NextResponse.redirect('/dashboard/profile?instagram=success')
}
```

---

### TikTok OAuth (`app/api/connect/tiktok/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const redirectUri = `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&scope=user.info.basic&redirect_uri=${process.env.TIKTOK_REDIRECT_URI}&response_type=code`

  return NextResponse.redirect(redirectUri)
}
```

### TikTok Callback (`app/api/connect/tiktok/callback/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  // Exchange code for token
  const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code: code!,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
    }),
  })

  const { access_token } = await tokenResponse.json()

  // Get user info
  const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,avatar_url', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  const userData = await userResponse.json()

  // TODO: Save to Appwrite

  return NextResponse.redirect('/dashboard/profile?tiktok=success')
}
```

---

### YouTube OAuth (`app/api/connect/youtube/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.YOUTUBE_CLIENT_ID}&redirect_uri=${process.env.YOUTUBE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly`

  return NextResponse.redirect(redirectUri)
}
```

### YouTube Callback (`app/api/connect/youtube/callback/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  // Exchange code for token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: code!,
      client_id: process.env.YOUTUBE_CLIENT_ID!,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
      redirect_uri: process.env.YOUTUBE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  })

  const { access_token } = await tokenResponse.json()

  // Get channel info
  const channelResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?mine=true&part=id,snippet', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  const channelData = await channelResponse.json()

  // TODO: Save to Appwrite

  return NextResponse.redirect('/dashboard/profile?youtube=success')
}
```

---

### Discord OAuth (`app/api/connect/discord/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const redirectUri = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI!)}&response_type=code&scope=identify`

  return NextResponse.redirect(redirectUri)
}
```

### Discord Callback (`app/api/connect/discord/callback/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  // Exchange code for token
  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code: code!,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    }),
  })

  const { access_token } = await tokenResponse.json()

  // Get user info
  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  const userData = await userResponse.json()
  // userData = { id, username, discriminator, avatar }

  // TODO: Save to Appwrite

  return NextResponse.redirect('/dashboard/profile?discord=success')
}
```

---

## 🔗 Wire Up Profile Page

Update `/dashboard/profile/page.tsx` to add click handlers:

```typescript
const handleConnectInstagram = () => {
  window.location.href = '/api/connect/instagram'
}

const handleConnectTikTok = () => {
  window.location.href = '/api/connect/tiktok'
}

const handleConnectYouTube = () => {
  window.location.href = '/api/connect/youtube'
}

const handleConnectDiscord = () => {
  window.location.href = '/api/connect/discord'
}
```

Then update the buttons:
```tsx
<Button variant="secondary" size="sm" onClick={handleConnectInstagram}>
  Connect
</Button>
```

---

## 📊 Store in Appwrite

Add these fields to the `users` collection schema:
- `instagramUsername` (string, optional)
- `tiktokUsername` (string, optional)
- `youtubeChannelId` (string, optional)
- `discordUsername` (string, optional)
- `website` (string, optional)

---

## 🎯 Next Steps

1. **Create Developer Apps**:
   - Instagram: https://developers.facebook.com/apps
   - TikTok: https://developers.tiktok.com
   - YouTube: https://console.cloud.google.com
   - Discord: https://discord.com/developers/applications

2. **Get Credentials**: Copy Client IDs and Secrets to `.env`

3. **Create API Routes**: Use the templates above

4. **Update Appwrite Schema**: Add social username fields

5. **Wire Up Buttons**: Add onClick handlers to profile page

---

## ✨ Testing

1. Click "Connect" on Instagram
2. Gets redirected to Instagram OAuth
3. User authorizes
4. Callback receives code
5. Exchange for token
6. Fetch user profile
7. Save to Appwrite
8. Redirect back to profile with success message
9. Profile page shows "Connected" with username

---

All templates are ready to use! Just create the files and replace the TODOs with Appwrite updates.
