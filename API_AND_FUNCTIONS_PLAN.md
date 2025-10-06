# API & Function Wiring Plan

Complete guide for Next.js API routes and Appwrite Functions needed for LaunchOS.

---

## Part 1: Next.js API Routes

### ✅ **Already Implemented:**

These routes already exist in the codebase:

#### **Launches**
- `GET /api/launches` - List all launches
- `GET /api/launches/[id]` - Get single launch
- `POST /api/launches/[id]/upvote` - Upvote a launch
- `POST /api/launches/[id]/follow` - Follow a launch

#### **Campaigns**
- `GET /api/campaigns` - List campaigns
- `GET /api/campaigns/[id]` - Get single campaign

#### **Submissions**
- `GET /api/submissions` - List submissions
- `POST /api/submissions/[id]/approve` - Approve submission (admin)

#### **Payouts**
- `GET /api/payouts` - List user payouts
- `POST /api/payouts/[id]/claim` - Claim a payout

#### **Activities**
- `GET /api/activities` - List user activities

#### **Network**
- `GET /api/network/invites` - List invites
- `POST /api/network/invites/[id]/accept` - Accept invite
- `POST /api/network/invites/[id]/reject` - Reject invite

#### **Social/Predictions**
- `GET /api/social` - Social feed
- `POST /api/social/[id]/click` - Track click
- `POST /api/social/[id]/toggle` - Toggle follow
- `GET /api/predictions` - List predictions
- `POST /api/predictions/[id]/vote` - Vote on prediction

#### **Dex Data**
- `GET /api/dex/candles?pairId=&interval=` - Get candles (currently mock data)

---

### 🔨 **Routes to Add:**

#### **1. Launch Contributors**
```typescript
// app/api/launches/[id]/contributors/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const launchId = params.id

    // Get all submissions for this launch
    const submissions = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.SUBMISSIONS,
      [
        Query.equal('launchId', launchId),
        Query.equal('status', 'approved'),
        Query.limit(100),
        Query.orderDesc('earnings')
      ]
    )

    // Aggregate by user
    const contributorMap = new Map()
    for (const sub of submissions.documents) {
      const existing = contributorMap.get(sub.userId) || {
        userId: sub.userId,
        userName: sub.userName || 'Anonymous',
        userAvatar: sub.userAvatar,
        totalEarnings: 0,
        submissionsCount: 0
      }
      existing.totalEarnings += sub.earnings || 0
      existing.submissionsCount += 1
      contributorMap.set(sub.userId, existing)
    }

    const contributors = Array.from(contributorMap.values())
      .sort((a, b) => b.totalEarnings - a.totalEarnings)

    return NextResponse.json({
      contributors,
      totalContributors: contributors.length,
      totalEarningsPaid: contributors.reduce((sum, c) => sum + c.totalEarnings, 0)
    })
  } catch (error) {
    console.error('Error fetching contributors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contributors' },
      { status: 500 }
    )
  }
}
```

**Purpose:** Get top contributors for a launch (for team/contributors display)

---

#### **2. Campaign Statistics**
```typescript
// app/api/campaigns/[id]/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id

    // Get campaign
    const campaign = await databases.getDocument(
      DB_ID,
      COLLECTIONS.CAMPAIGNS,
      campaignId
    )

    // Get submissions
    const submissions = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.SUBMISSIONS,
      [
        Query.equal('campaignId', campaignId),
        Query.limit(1000)
      ]
    )

    const approved = submissions.documents.filter(s => s.status === 'approved')
    const pending = submissions.documents.filter(s => s.status === 'pending')
    const rejected = submissions.documents.filter(s => s.status === 'rejected')

    const totalPaid = approved.reduce((sum, s) => sum + (s.earnings || 0), 0)
    const totalViews = approved.reduce((sum, s) => sum + (s.views || 0), 0)
    const uniqueCreators = new Set(submissions.documents.map(s => s.userId)).size

    return NextResponse.json({
      budget: campaign.budget,
      budgetPaid: totalPaid,
      budgetRemaining: campaign.budget - totalPaid,
      percentPaid: Math.round((totalPaid / campaign.budget) * 100),
      submissions: {
        total: submissions.documents.length,
        approved: approved.length,
        pending: pending.length,
        rejected: rejected.length
      },
      totalViews,
      uniqueCreators,
      averageEarningsPerSubmission: approved.length > 0 ? totalPaid / approved.length : 0
    })
  } catch (error) {
    console.error('Error fetching campaign stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign stats' },
      { status: 500 }
    )
  }
}
```

**Purpose:** Real-time campaign statistics (paid, views, creators, etc.)

---

#### **3. User Earnings Summary**
```typescript
// app/api/users/[id]/earnings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Get all approved submissions
    const submissions = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.SUBMISSIONS,
      [
        Query.equal('userId', userId),
        Query.equal('status', 'approved'),
        Query.limit(1000),
        Query.orderDesc('$createdAt')
      ]
    )

    // Get all payouts
    const payouts = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.PAYOUTS,
      [
        Query.equal('userId', userId),
        Query.limit(1000),
        Query.orderDesc('$createdAt')
      ]
    )

    const totalEarned = submissions.documents.reduce((sum, s) => sum + (s.earnings || 0), 0)
    const totalPaid = payouts.documents
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (p.net || p.amount), 0)
    const claimable = payouts.documents
      .filter(p => p.status === 'claimable')
      .reduce((sum, p) => sum + (p.net || p.amount), 0)

    return NextResponse.json({
      totalEarned,
      totalPaid,
      claimable,
      pendingReview: totalEarned - (totalPaid + claimable),
      submissions: {
        total: submissions.documents.length,
        totalViews: submissions.documents.reduce((sum, s) => sum + (s.views || 0), 0)
      },
      payouts: {
        total: payouts.documents.length,
        pending: payouts.documents.filter(p => p.status === 'pending').length,
        claimed: payouts.documents.filter(p => p.status === 'claimed').length,
        paid: payouts.documents.filter(p => p.status === 'paid').length
      }
    })
  } catch (error) {
    console.error('Error fetching user earnings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user earnings' },
      { status: 500 }
    )
  }
}
```

**Purpose:** Comprehensive earnings summary for user dashboard

---

#### **4. Token Market Data Proxy**
```typescript
// app/api/dex/token/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }

  try {
    // Fetch from Dexscreener
    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`
    const res = await fetch(url, {
      next: { revalidate: 30 } // Cache for 30 seconds
    })

    if (!res.ok) {
      throw new Error(`Dexscreener API error: ${res.status}`)
    }

    const data = await res.json()

    // Extract first pair data
    const pair = data.pairs?.[0]
    if (!pair) {
      return NextResponse.json({ error: 'No pair data found' }, { status: 404 })
    }

    return NextResponse.json({
      address: pair.baseToken.address,
      symbol: pair.baseToken.symbol,
      name: pair.baseToken.name,
      priceUsd: parseFloat(pair.priceUsd || '0'),
      volume24h: pair.volume?.h24 || 0,
      priceChange24h: pair.priceChange?.h24 || 0,
      liquidity: pair.liquidity?.usd || 0,
      fdv: pair.fdv || 0,
      marketCap: pair.marketCap || 0,
      pairAddress: pair.pairAddress,
      dexId: pair.dexId,
      chainId: pair.chainId
    })
  } catch (error) {
    console.error('Error fetching token data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    )
  }
}
```

**Purpose:** Proxy for Dexscreener token data with caching

---

#### **5. Events Emitter (Internal)**
```typescript
// app/api/events/emit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID } from 'appwrite'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, type, targetId, metadata } = body

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'userId and type are required' },
        { status: 400 }
      )
    }

    // Create activity event
    const activity = await databases.createDocument(
      DB_ID,
      COLLECTIONS.ACTIVITIES,
      ID.unique(),
      {
        userId,
        type,
        targetId: targetId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        createdAt: new Date().toISOString()
      }
    )

    return NextResponse.json({ success: true, activityId: activity.$id })
  } catch (error) {
    console.error('Error emitting event:', error)
    return NextResponse.json(
      { error: 'Failed to emit event' },
      { status: 500 }
    )
  }
}
```

**Purpose:** Internal API for emitting user activity events

---

#### **6. Leaderboard API**
```typescript
// app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

export async function GET(req: NextRequest) {
  const timeframe = req.nextUrl.searchParams.get('timeframe') || 'all' // all, week, month
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10')

  try {
    // Get all users with earnings
    const users = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.USERS,
      [
        Query.orderDesc('totalEarnings'),
        Query.limit(limit)
      ]
    )

    const leaderboard = users.documents.map((user, index) => ({
      rank: index + 1,
      userId: user.$id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      totalEarnings: user.totalEarnings || 0,
      reputation: user.reputation || 0
    }))

    return NextResponse.json({ leaderboard, timeframe })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
```

**Purpose:** User earnings leaderboard

---

## Part 2: Appwrite Functions

### **Function 1: Candles Cache Updater**

**Name:** `candles-cache-updater`
**Runtime:** Node.js 18
**Trigger:** Scheduled (every 1 minute)
**Purpose:** Fetch candles from Dexscreener and cache in Appwrite

#### **Environment Variables:**
```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=launchos_db
DEXSCREENER_API_URL=https://api.dexscreener.com
```

#### **Function Code:**
```typescript
// functions/candles-cache-updater/src/main.ts
import { Client, Databases, Query } from 'node-appwrite'

interface CandleData {
  t: number // timestamp (unix seconds)
  o: number // open
  h: number // high
  l: number // low
  c: number // close
  v: number // volume
}

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

  const databases = new Databases(client)
  const DB_ID = process.env.APPWRITE_DATABASE_ID!

  try {
    log('Starting candles cache update...')

    // Get all active launches with token addresses
    const launches = await databases.listDocuments(
      DB_ID,
      'launches',
      [
        Query.equal('status', 'live'),
        Query.limit(100)
      ]
    )

    log(`Found ${launches.documents.length} active launches`)

    for (const launch of launches.documents) {
      const tokenAddress = launch.tokenAddress || launch.tokenSymbol

      if (!tokenAddress) {
        log(`Skipping launch ${launch.$id} - no token address`)
        continue
      }

      try {
        // Fetch from Dexscreener
        const dexUrl = `${process.env.DEXSCREENER_API_URL}/latest/dex/tokens/${tokenAddress}`
        const dexRes = await fetch(dexUrl)
        const dexData = await dexRes.json()

        if (!dexData.pairs || dexData.pairs.length === 0) {
          log(`No pairs found for ${tokenAddress}`)
          continue
        }

        const pair = dexData.pairs[0]
        const pairAddress = pair.pairAddress

        // Fetch candles (if Dexscreener supports it - currently they don't have candles API)
        // For now, we'll cache the latest price as a single candle
        const now = Math.floor(Date.now() / 1000)
        const candle: CandleData = {
          t: now,
          o: parseFloat(pair.priceUsd || '0'),
          h: parseFloat(pair.priceUsd || '0'),
          l: parseFloat(pair.priceUsd || '0'),
          c: parseFloat(pair.priceUsd || '0'),
          v: pair.volume?.h24 || 0
        }

        // Store in candles_cache collection
        await databases.createDocument(
          DB_ID,
          'candles_cache',
          'unique()',
          {
            pairId: pairAddress,
            launchId: launch.$id,
            interval: '1m',
            timestamp: now,
            open: candle.o,
            high: candle.h,
            low: candle.l,
            close: candle.c,
            volume: candle.v,
            createdAt: new Date().toISOString()
          }
        )

        log(`Cached candle for ${tokenAddress} at ${candle.c}`)

        // Update launch with latest data
        await databases.updateDocument(
          DB_ID,
          'launches',
          launch.$id,
          {
            volume24h: pair.volume?.h24 || 0,
            priceChange24h: pair.priceChange?.h24 || 0,
            marketCap: pair.marketCap || 0
          }
        )
      } catch (err) {
        error(`Error processing launch ${launch.$id}: ${err}`)
      }
    }

    log('Candles cache update completed')
    return res.json({ success: true, processedCount: launches.documents.length })
  } catch (err) {
    error(`Fatal error: ${err}`)
    return res.json({ success: false, error: String(err) }, 500)
  }
}
```

#### **Deployment Commands:**
```bash
# Create function
appwrite functions create \
  --functionId candles-cache-updater \
  --name "Candles Cache Updater" \
  --runtime node-18.0 \
  --execute any \
  --timeout 900

# Set environment variables
appwrite functions updateVariables \
  --functionId candles-cache-updater \
  --variables "APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1" \
  --variables "APPWRITE_PROJECT_ID=your_project_id" \
  --variables "APPWRITE_API_KEY=your_api_key" \
  --variables "APPWRITE_DATABASE_ID=launchos_db" \
  --variables "DEXSCREENER_API_URL=https://api.dexscreener.com"

# Deploy function
cd functions/candles-cache-updater
npm install
npm run build
appwrite functions deploy \
  --functionId candles-cache-updater

# Create schedule (every 1 minute)
appwrite functions createExecution \
  --functionId candles-cache-updater \
  --schedule "* * * * *"
```

---

### **Function 2: Activity Bins Aggregator**

**Name:** `activity-bins-aggregator`
**Runtime:** Node.js 18
**Trigger:** Scheduled (every 5 minutes)
**Purpose:** Aggregate activity events into time-binned buckets for charts

#### **Environment Variables:**
```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=launchos_db
```

#### **Function Code:**
```typescript
// functions/activity-bins-aggregator/src/main.ts
import { Client, Databases, Query } from 'node-appwrite'

interface ActivityBin {
  launchId: string
  binStart: number // Unix timestamp (start of 5-min bin)
  binEnd: number
  upvotes: number
  comments: number
  views: number
  totalActivity: number
}

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

  const databases = new Databases(client)
  const DB_ID = process.env.APPWRITE_DATABASE_ID!

  try {
    log('Starting activity bins aggregation...')

    // Get current 5-minute bin
    const now = Math.floor(Date.now() / 1000)
    const binSize = 5 * 60 // 5 minutes
    const binStart = Math.floor(now / binSize) * binSize
    const binEnd = binStart + binSize

    log(`Processing bin: ${new Date(binStart * 1000).toISOString()} to ${new Date(binEnd * 1000).toISOString()}`)

    // Get activities in this time range
    const activities = await databases.listDocuments(
      DB_ID,
      'activities',
      [
        Query.greaterThanEqual('createdAt', new Date(binStart * 1000).toISOString()),
        Query.lessThan('createdAt', new Date(binEnd * 1000).toISOString()),
        Query.limit(1000)
      ]
    )

    log(`Found ${activities.documents.length} activities in this bin`)

    // Group by launch/target
    const bins: Map<string, ActivityBin> = new Map()

    for (const activity of activities.documents) {
      const targetId = activity.targetId || 'global'

      if (!bins.has(targetId)) {
        bins.set(targetId, {
          launchId: targetId,
          binStart,
          binEnd,
          upvotes: 0,
          comments: 0,
          views: 0,
          totalActivity: 0
        })
      }

      const bin = bins.get(targetId)!

      // Count activity types
      switch (activity.type) {
        case 'upvoted':
          bin.upvotes++
          break
        case 'comment_posted':
          bin.comments++
          break
        case 'launch_viewed':
          bin.views++
          break
      }

      bin.totalActivity++
    }

    // Store bins in database
    for (const [launchId, bin] of bins.entries()) {
      try {
        await databases.createDocument(
          DB_ID,
          'activity_bins',
          'unique()',
          {
            launchId,
            binStart,
            binEnd,
            upvotes: bin.upvotes,
            comments: bin.comments,
            views: bin.views,
            totalActivity: bin.totalActivity,
            createdAt: new Date().toISOString()
          }
        )

        log(`Created bin for ${launchId}: ${bin.totalActivity} activities`)
      } catch (err) {
        error(`Error creating bin for ${launchId}: ${err}`)
      }
    }

    log(`Activity bins aggregation completed. Processed ${bins.size} bins`)
    return res.json({ success: true, binsCreated: bins.size })
  } catch (err) {
    error(`Fatal error: ${err}`)
    return res.json({ success: false, error: String(err) }, 500)
  }
}
```

#### **Deployment Commands:**
```bash
# Create function
appwrite functions create \
  --functionId activity-bins-aggregator \
  --name "Activity Bins Aggregator" \
  --runtime node-18.0 \
  --execute any \
  --timeout 600

# Set environment variables
appwrite functions updateVariables \
  --functionId activity-bins-aggregator \
  --variables "APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1" \
  --variables "APPWRITE_PROJECT_ID=your_project_id" \
  --variables "APPWRITE_API_KEY=your_api_key" \
  --variables "APPWRITE_DATABASE_ID=launchos_db"

# Deploy function
cd functions/activity-bins-aggregator
npm install
npm run build
appwrite functions deploy \
  --functionId activity-bins-aggregator

# Create schedule (every 5 minutes)
appwrite functions createExecution \
  --functionId activity-bins-aggregator \
  --schedule "*/5 * * * *"
```

---

### **Function 3: Contribution Verifier**

**Name:** `contribution-verifier`
**Runtime:** Node.js 18
**Trigger:** Event-driven (on submission creation)
**Purpose:** Verify submissions and calculate earnings

#### **Environment Variables:**
```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=launchos_db
YOUTUBE_API_KEY=your_youtube_key
TWITTER_BEARER_TOKEN=your_twitter_token
```

#### **Function Code:**
```typescript
// functions/contribution-verifier/src/main.ts
import { Client, Databases } from 'node-appwrite'

interface SubmissionVerification {
  submissionId: string
  verified: boolean
  actualViews: number
  earnings: number
  errors: string[]
}

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

  const databases = new Databases(client)
  const DB_ID = process.env.APPWRITE_DATABASE_ID!

  try {
    const payload = JSON.parse(req.variables.APPWRITE_FUNCTION_EVENT_DATA || '{}')
    const submissionId = payload.$id

    if (!submissionId) {
      throw new Error('No submission ID provided')
    }

    log(`Verifying submission: ${submissionId}`)

    // Get submission
    const submission = await databases.getDocument(
      DB_ID,
      'submissions',
      submissionId
    )

    // Get campaign/quest
    const campaignId = submission.campaignId
    const questId = submission.questId

    let campaign: any = null
    let quest: any = null

    if (campaignId) {
      campaign = await databases.getDocument(DB_ID, 'campaigns', campaignId)
    } else if (questId) {
      quest = await databases.getDocument(DB_ID, 'quests', questId)
    } else {
      throw new Error('Submission has no campaign or quest')
    }

    const verification: SubmissionVerification = {
      submissionId,
      verified: false,
      actualViews: 0,
      earnings: 0,
      errors: []
    }

    // Verify media URL and get view count
    const mediaUrl = submission.mediaUrl

    try {
      if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
        // Extract video ID
        const videoId = extractYoutubeId(mediaUrl)

        // Fetch video stats from YouTube API
        const ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
        const ytRes = await fetch(ytUrl)
        const ytData = await ytRes.json()

        if (ytData.items && ytData.items.length > 0) {
          verification.actualViews = parseInt(ytData.items[0].statistics.viewCount || '0')
          verification.verified = true
        } else {
          verification.errors.push('YouTube video not found')
        }
      } else if (mediaUrl.includes('twitter.com') || mediaUrl.includes('x.com')) {
        // Twitter/X verification would go here
        // Note: Twitter API v2 requires different authentication
        verification.errors.push('Twitter verification not yet implemented')
      } else {
        verification.errors.push('Unsupported platform')
      }
    } catch (err) {
      error(`Error verifying media: ${err}`)
      verification.errors.push(`Verification failed: ${err}`)
    }

    // Calculate earnings
    if (verification.verified && campaign) {
      const minViews = campaign.minViews || 0
      const ratePerThousand = campaign.ratePerThousand || 0

      if (verification.actualViews >= minViews) {
        verification.earnings = (verification.actualViews / 1000) * ratePerThousand
      } else {
        verification.errors.push(`Minimum views not met (${minViews} required, ${verification.actualViews} actual)`)
      }
    }

    // Update submission
    await databases.updateDocument(
      DB_ID,
      'submissions',
      submissionId,
      {
        views: verification.actualViews,
        earnings: verification.earnings,
        status: verification.verified && verification.earnings > 0 ? 'approved' : 'rejected',
        notes: verification.errors.join('; '),
        reviewedAt: new Date().toISOString()
      }
    )

    // Create payout if approved
    if (verification.verified && verification.earnings > 0) {
      await databases.createDocument(
        DB_ID,
        'payouts',
        'unique()',
        {
          payoutId: `payout_${Date.now()}`,
          userId: submission.userId,
          campaignId: campaignId || null,
          questId: questId || null,
          amount: verification.earnings,
          currency: 'USDC',
          status: 'claimable',
          net: verification.earnings * 0.95, // 5% platform fee
          fee: verification.earnings * 0.05,
          createdAt: new Date().toISOString()
        }
      )

      log(`Created payout for ${submission.userId}: $${verification.earnings}`)
    }

    log(`Verification complete: ${JSON.stringify(verification)}`)
    return res.json({ success: true, verification })
  } catch (err) {
    error(`Fatal error: ${err}`)
    return res.json({ success: false, error: String(err) }, 500)
  }
}

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  return match ? match[1] : ''
}
```

#### **Deployment Commands:**
```bash
# Create function
appwrite functions create \
  --functionId contribution-verifier \
  --name "Contribution Verifier" \
  --runtime node-18.0 \
  --execute any \
  --timeout 300 \
  --events "databases.*.collections.submissions.documents.*.create"

# Set environment variables
appwrite functions updateVariables \
  --functionId contribution-verifier \
  --variables "APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1" \
  --variables "APPWRITE_PROJECT_ID=your_project_id" \
  --variables "APPWRITE_API_KEY=your_api_key" \
  --variables "APPWRITE_DATABASE_ID=launchos_db" \
  --variables "YOUTUBE_API_KEY=your_youtube_key"

# Deploy function
cd functions/contribution-verifier
npm install
npm run build
appwrite functions deploy \
  --functionId contribution-verifier
```

---

## Part 3: Additional Collections Needed

### **Candles Cache Collection**
```bash
appwrite collections create \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --name "Candles Cache"

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key pairId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key launchId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key interval \
  --size 10 \
  --required true

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key timestamp \
  --required true

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key open \
  --required true

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key high \
  --required true

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key low \
  --required true

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key close \
  --required true

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key volume \
  --required true

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId candles_cache \
  --key pairId_timestamp_idx \
  --type key \
  --attributes pairId,timestamp \
  --orders ASC,DESC
```

### **Activity Bins Collection**
```bash
appwrite collections create \
  --databaseId launchos_db \
  --collectionId activity_bins \
  --name "Activity Bins"

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId activity_bins \
  --key launchId \
  --size 255 \
  --required true

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId activity_bins \
  --key binStart \
  --required true

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId activity_bins \
  --key binEnd \
  --required true

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId activity_bins \
  --key upvotes \
  --required true \
  --default 0

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId activity_bins \
  --key comments \
  --required true \
  --default 0

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId activity_bins \
  --key views \
  --required true \
  --default 0

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId activity_bins \
  --key totalActivity \
  --required true \
  --default 0

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId activity_bins \
  --key launchId_binStart_idx \
  --type key \
  --attributes launchId,binStart \
  --orders ASC,DESC
```

---

## Summary

### Next.js API Routes Status:
- ✅ **12 routes** already implemented
- 🔨 **6 new routes** to add:
  1. `GET /api/launches/[id]/contributors`
  2. `GET /api/campaigns/[id]/stats`
  3. `GET /api/users/[id]/earnings`
  4. `GET /api/dex/token?address=`
  5. `POST /api/events/emit`
  6. `GET /api/leaderboard`

### Appwrite Functions:
- **3 functions** to create:
  1. `candles-cache-updater` (scheduled, every 1 min)
  2. `activity-bins-aggregator` (scheduled, every 5 min)
  3. `contribution-verifier` (event-driven, on submission)

### Additional Collections:
- `candles_cache` - Store historical price data
- `activity_bins` - Store aggregated activity for charts
