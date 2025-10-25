# Launch Page Data Architecture - Backend Design Document

**Created:** 2025-10-22
**Status:** Design Specification
**Version:** 1.0

---

## Executive Summary

This document defines the complete backend data layer architecture for the rebuilt /launch page, including database schema, API endpoints, real-time updates, caching strategy, and performance optimizations.

### Key Requirements

1. **Hero Metrics** - Real-time platform-wide statistics
2. **Spotlight Projects** - Top 3 performing projects
3. **Leaderboards** - Builders, Investors, Communities
4. **Active Feed** - Filterable/sortable project cards

---

## 1. Database Schema Design

### 1.1 New Collections

#### Collection: `projects`
Extends existing curve system to include project-specific metadata.

```typescript
interface Project {
  // Identity
  $id: string                    // Appwrite doc ID
  $createdAt: string
  $updatedAt: string

  projectId: string              // Unique identifier
  slug: string                   // URL-friendly slug (unique, indexed)

  // Core Data
  name: string
  description: string
  tagline: string                // Short pitch (80 chars)
  category: string               // "DeFi" | "Gaming" | "SocialFi" | "NFT" | "Infrastructure"

  // Media
  logo: string                   // Storage bucket URL
  coverImage?: string            // Hero banner
  galleryImages: string[]        // Additional screenshots

  // Social
  website?: string
  twitter?: string
  discord?: string
  telegram?: string
  github?: string

  // Curve Integration
  curveId: string                // Foreign key to curves collection
  ownerUserId: string            // Creator/founder user ID

  // Launch Status
  status: 'building' | 'live' | 'frozen' | 'launched'
  launchTarget: number           // Target TVL in SOL (e.g., 32)

  // Metrics (denormalized for performance)
  tvl: number                    // Current total value locked
  tvlChange24h: number           // Percentage change
  holdersCount: number           // Unique holders
  volume24h: number              // 24h trading volume

  // Engagement
  viewsCount: number             // Page views
  followersCount: number         // Users following project
  commentsCount: number          // Discussion activity

  // Tags & Discovery
  tags: string[]                 // ["AI", "Automation", "SaaS"]
  isVerified: boolean            // Platform verified
  isFeatured: boolean            // Editor's pick
  featuredAt?: string            // When featured started

  // Team
  teamSize: number               // Number of contributors
  teamMembers: string[]          // User IDs

  // Visibility
  isPublic: boolean              // Shown in discovery
  isDeleted: boolean             // Soft delete
}
```

**Indexes Required:**
- `slug` (unique, for routing)
- `status` (for filtering active projects)
- `curveId` (for joins)
- `category` (for filtering)
- `tvl` (descending, for sorting)
- `volume24h` (descending, for trending)
- `$createdAt` (descending, for latest)
- `isPublic` + `isDeleted` (compound, for visibility)

#### Collection: `platform_metrics` (Singleton/Time-Series)
Stores aggregated platform-wide statistics.

```typescript
interface PlatformMetrics {
  $id: string
  $createdAt: string

  // Aggregate Metrics
  totalTvl: number               // Sum of all project TVLs
  totalAirdropsValue: number     // Cumulative airdrop value
  activeProjectsCount: number    // Projects in 'live' status
  totalProjectsCount: number     // All-time projects

  // 24h Changes
  tvlChange24h: number           // Percentage
  activityChange24h: number      // Percentage

  // Volume
  volume24h: number
  volumeAllTime: number

  // Users
  totalUsers: number
  activeUsers24h: number

  // Computed at
  timestamp: string
  type: 'snapshot' | 'realtime'  // Snapshot = hourly, Realtime = live
}
```

**Indexes Required:**
- `timestamp` (descending, for latest)
- `type` (for filtering)

**Update Strategy:**
- **Realtime document**: Single doc ID `current` updated on every trade
- **Hourly snapshots**: Cron job creates snapshot docs for historical data
- **Cache**: Redis 5-minute TTL for `/api/metrics/hero`

#### Collection: `leaderboard_builders`
Pre-computed leaderboard for builders/creators.

```typescript
interface LeaderboardBuilder {
  $id: string
  $createdAt: string
  $updatedAt: string

  userId: string                 // Foreign key to users
  rank: number                   // Leaderboard position

  // Stats
  projectsLaunched: number       // Count of launched projects
  totalTvlRaised: number         // Sum across all projects
  totalHolders: number           // Unique holders across projects
  averageRoi: number             // Average ROI for holders

  // Engagement
  followersCount: number
  reputationScore: number        // Platform reputation (0-100)

  // Metadata
  username: string               // Denormalized for performance
  avatar?: string                // Denormalized
  isVerified: boolean

  // Computed at
  lastUpdated: string
}
```

**Indexes Required:**
- `userId` (unique)
- `rank` (ascending, for pagination)
- `totalTvlRaised` (descending, for sorting)

**Update Strategy:**
- Recalculated daily via cron job
- Cache: Redis 1-hour TTL

#### Collection: `leaderboard_investors`
Pre-computed leaderboard for investors/holders.

```typescript
interface LeaderboardInvestor {
  $id: string
  $createdAt: string
  $updatedAt: string

  userId: string
  rank: number

  // Investment Stats
  totalInvested: number          // Sum of all purchases (SOL)
  currentValue: number           // Current portfolio value
  realizedPnl: number            // Profit from sells
  unrealizedPnl: number          // Paper gains
  totalRoi: number               // Percentage ROI

  // Activity
  projectsCount: number          // Number of projects invested in
  holdingsCount: number          // Number of active holdings
  avgHoldTime: number            // Days (avg)

  // Metadata
  username: string
  avatar?: string
  isVerified: boolean

  lastUpdated: string
}
```

**Indexes:** Same pattern as builders

#### Collection: `leaderboard_communities`
Community engagement leaderboard.

```typescript
interface LeaderboardCommunity {
  $id: string
  $createdAt: string
  $updatedAt: string

  projectId: string              // Foreign key
  rank: number

  // Community Stats
  membersCount: number           // Holders
  growthRate24h: number          // Percentage
  engagementScore: number        // Composite metric (0-100)

  // Activity
  messagesCount24h: number       // Discord/TG activity
  socialMentions24h: number      // Twitter mentions

  // Metadata
  projectName: string            // Denormalized
  logo?: string

  lastUpdated: string
}
```

### 1.2 Schema Modifications to Existing Collections

#### `curves` Collection - Add Fields
```typescript
// Add to existing Curve interface
interface Curve {
  // ... existing fields ...

  // NEW: Spotlight eligibility
  spotlightScore: number         // Composite score (0-100)
  spotlightEligible: boolean     // Auto-computed

  // NEW: Categorization
  category?: string              // Link to project category
  tags: string[]                 // Searchable tags
}
```

**Index:** `spotlightScore` (descending)

#### `users` Collection - Add Fields
```typescript
// Add to existing User interface (if not already present)
interface User {
  // ... existing fields ...

  // NEW: Leaderboard cache
  builderRank?: number
  investorRank?: number

  // NEW: Stats denormalization
  projectsCount: number
  investmentsCount: number
  totalEarnings: number
}
```

---

## 2. API Endpoints Design

### 2.1 Hero Metrics API

#### `GET /api/launch/metrics/hero`

**Purpose:** Fetch real-time platform-wide statistics

**Response:**
```typescript
{
  success: true,
  data: {
    vaultTvl: number,           // Total locked value (SOL)
    airdropsTotal: number,      // Cumulative airdrops (SOL)
    motionChange24h: number,    // Activity % change
    liveProjectsCount: number,  // Active projects

    // Metadata
    lastUpdated: string,
    cacheAge: number            // Seconds
  },
  meta: {
    cached: boolean,
    computedAt: string
  }
}
```

**Implementation:**
```typescript
// app/api/launch/metrics/hero/route.ts
import { serverDatabases, DB_ID, COLLECTIONS } from '@/lib/appwrite/server-client'
import { Query } from 'node-appwrite'
import { redis } from '@/lib/redis' // If using Redis

export async function GET(request: Request) {
  const CACHE_KEY = 'launch:hero:metrics'
  const CACHE_TTL = 300 // 5 minutes

  // Try cache first
  const cached = await redis?.get(CACHE_KEY)
  if (cached) {
    return Response.json({
      success: true,
      data: JSON.parse(cached),
      meta: { cached: true }
    })
  }

  // Fetch latest platform_metrics document
  const metricsDoc = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.PLATFORM_METRICS,
    [
      Query.equal('type', 'realtime'),
      Query.limit(1),
      Query.orderDesc('timestamp')
    ]
  )

  const metrics = metricsDoc.documents[0]

  const response = {
    vaultTvl: metrics.totalTvl,
    airdropsTotal: metrics.totalAirdropsValue,
    motionChange24h: metrics.activityChange24h,
    liveProjectsCount: metrics.activeProjectsCount,
    lastUpdated: metrics.timestamp,
    cacheAge: 0
  }

  // Cache result
  await redis?.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(response))

  return Response.json({
    success: true,
    data: response,
    meta: { cached: false, computedAt: new Date().toISOString() }
  })
}
```

**Performance Target:** < 50ms (cached), < 200ms (uncached)

---

### 2.2 Spotlight Projects API

#### `GET /api/launch/spotlight`

**Purpose:** Get top 3 performing projects

**Query Parameters:**
- `metric` (optional): `tvl` | `volume` | `growth` - Default: composite score

**Response:**
```typescript
{
  success: true,
  data: [
    {
      projectId: string,
      name: string,
      description: string,
      logo: string,

      // Metrics
      tvl: number,
      tvlChange24h: number,
      status: 'LIVE' | 'FROZEN' | 'LAUNCHED',

      // Curve data
      price: number,
      holders: number,
      volume24h: number,

      // Metadata
      category: string,
      isVerified: boolean,
      slug: string,           // For routing

      // Computed
      spotlightScore: number
    }
  ],
  meta: {
    computedAt: string,
    criteria: string
  }
}
```

**Implementation:**
```typescript
// app/api/launch/spotlight/route.ts
export async function GET(request: Request) {
  const url = new URL(request.url)
  const metric = url.searchParams.get('metric') || 'composite'

  const CACHE_KEY = `launch:spotlight:${metric}`
  const CACHE_TTL = 600 // 10 minutes

  // Try cache
  const cached = await redis?.get(CACHE_KEY)
  if (cached) return Response.json(JSON.parse(cached))

  // Query projects with curves
  const projects = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECTS,
    [
      Query.equal('isPublic', true),
      Query.equal('isDeleted', false),
      Query.equal('status', ['live', 'frozen']),
      Query.orderDesc(metric === 'composite' ? 'spotlightScore' : metric === 'tvl' ? 'tvl' : 'volume24h'),
      Query.limit(3)
    ]
  )

  // Enrich with curve data
  const enriched = await Promise.all(
    projects.documents.map(async (project) => {
      const curve = await serverDatabases.getDocument(
        DB_ID,
        COLLECTIONS.CURVES,
        project.curveId
      )

      return {
        projectId: project.projectId,
        name: project.name,
        description: project.description,
        logo: project.logo,
        tvl: project.tvl,
        tvlChange24h: project.tvlChange24h,
        status: project.status.toUpperCase(),
        price: curve.price,
        holders: curve.holders,
        volume24h: curve.volume24h,
        category: project.category,
        isVerified: project.isVerified,
        slug: project.slug,
        spotlightScore: project.spotlightScore
      }
    })
  )

  const response = {
    success: true,
    data: enriched,
    meta: {
      computedAt: new Date().toISOString(),
      criteria: metric
    }
  }

  await redis?.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(response))

  return Response.json(response)
}
```

---

### 2.3 Leaderboard APIs

#### `GET /api/launch/leaderboard/builders`

**Query Parameters:**
- `limit` (default: 10)
- `offset` (default: 0)

**Response:**
```typescript
{
  success: true,
  data: [
    {
      rank: number,
      userId: string,
      username: string,
      avatar?: string,
      isVerified: boolean,

      launches: number,          // Projects launched
      totalTvl: number,          // Total raised
      averageRoi: number,        // Avg ROI %

      metadata: {
        lastUpdated: string
      }
    }
  ],
  pagination: {
    total: number,
    limit: number,
    offset: number,
    hasMore: boolean
  }
}
```

**Similar endpoints:**
- `GET /api/launch/leaderboard/investors`
- `GET /api/launch/leaderboard/communities`

**Implementation:**
```typescript
// app/api/launch/leaderboard/builders/route.ts
export async function GET(request: Request) {
  const url = new URL(request.url)
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const offset = parseInt(url.searchParams.get('offset') || '0')

  const CACHE_KEY = `leaderboard:builders:${limit}:${offset}`
  const CACHE_TTL = 3600 // 1 hour

  const cached = await redis?.get(CACHE_KEY)
  if (cached) return Response.json(JSON.parse(cached))

  const builders = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.LEADERBOARD_BUILDERS,
    [
      Query.orderAsc('rank'),
      Query.limit(limit),
      Query.offset(offset)
    ]
  )

  const total = builders.total

  const response = {
    success: true,
    data: builders.documents.map(b => ({
      rank: b.rank,
      userId: b.userId,
      username: b.username,
      avatar: b.avatar,
      isVerified: b.isVerified,
      launches: b.projectsLaunched,
      totalTvl: b.totalTvlRaised,
      averageRoi: b.averageRoi,
      metadata: {
        lastUpdated: b.lastUpdated
      }
    })),
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    }
  }

  await redis?.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(response))

  return Response.json(response)
}
```

---

### 2.4 Active Feed API

#### `GET /api/launch/feed`

**Purpose:** Filterable/sortable list of active projects

**Query Parameters:**
```typescript
{
  status?: 'all' | 'live' | 'frozen' | 'launched'  // Default: 'all'
  sortBy?: 'latest' | 'tvl' | 'trending'           // Default: 'trending'
  category?: string                                 // Optional category filter
  limit?: number                                    // Default: 20
  offset?: number                                   // Default: 0
  search?: string                                   // Search query
}
```

**Response:**
```typescript
{
  success: true,
  data: [
    {
      projectId: string,
      slug: string,
      name: string,
      tagline: string,
      logo: string,
      category: string,
      tags: string[],

      // Status
      status: string,

      // Metrics
      tvl: number,
      tvlChange24h: number,
      holders: number,
      price: number,
      volume24h: number,

      // Progress
      launchTarget: number,
      progress: number,        // tvl / launchTarget * 100

      // Social
      followersCount: number,
      commentsCount: number,

      // Meta
      isVerified: boolean,
      isFeatured: boolean,
      createdAt: string
    }
  ],
  pagination: {
    total: number,
    limit: number,
    offset: number,
    hasMore: boolean
  },
  filters: {
    applied: { ... },          // Echo applied filters
    available: {               // Available filter options
      categories: string[],
      statuses: string[]
    }
  }
}
```

**Implementation:**
```typescript
// app/api/launch/feed/route.ts
export async function GET(request: Request) {
  const url = new URL(request.url)
  const status = url.searchParams.get('status') || 'all'
  const sortBy = url.searchParams.get('sortBy') || 'trending'
  const category = url.searchParams.get('category')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const offset = parseInt(url.searchParams.get('offset') || '0')
  const search = url.searchParams.get('search')

  // Build cache key
  const cacheKey = `launch:feed:${status}:${sortBy}:${category}:${limit}:${offset}:${search}`
  const cacheTTL = 300 // 5 minutes

  const cached = await redis?.get(cacheKey)
  if (cached) return Response.json(JSON.parse(cached))

  // Build query filters
  const queries = [
    Query.equal('isPublic', true),
    Query.equal('isDeleted', false)
  ]

  if (status !== 'all') {
    queries.push(Query.equal('status', status))
  }

  if (category) {
    queries.push(Query.equal('category', category))
  }

  if (search) {
    queries.push(Query.search('name', search))
  }

  // Add sorting
  const sortField = sortBy === 'latest' ? '$createdAt'
                  : sortBy === 'tvl' ? 'tvl'
                  : 'volume24h' // trending
  queries.push(Query.orderDesc(sortField))

  queries.push(Query.limit(limit))
  queries.push(Query.offset(offset))

  // Execute query
  const projects = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECTS,
    queries
  )

  // Enrich with curve data
  const enriched = await Promise.all(
    projects.documents.map(async (p) => {
      const curve = await serverDatabases.getDocument(
        DB_ID,
        COLLECTIONS.CURVES,
        p.curveId
      )

      return {
        projectId: p.projectId,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        logo: p.logo,
        category: p.category,
        tags: p.tags,
        status: p.status,
        tvl: p.tvl,
        tvlChange24h: p.tvlChange24h,
        holders: curve.holders,
        price: curve.price,
        volume24h: curve.volume24h,
        launchTarget: p.launchTarget,
        progress: (p.tvl / p.launchTarget) * 100,
        followersCount: p.followersCount,
        commentsCount: p.commentsCount,
        isVerified: p.isVerified,
        isFeatured: p.isFeatured,
        createdAt: p.$createdAt
      }
    })
  )

  // Get available filter options
  const categories = await getUniqueCategories()

  const response = {
    success: true,
    data: enriched,
    pagination: {
      total: projects.total,
      limit,
      offset,
      hasMore: offset + limit < projects.total
    },
    filters: {
      applied: { status, sortBy, category },
      available: {
        categories,
        statuses: ['all', 'live', 'frozen', 'launched']
      }
    }
  }

  await redis?.setex(cacheKey, cacheTTL, JSON.stringify(response))

  return Response.json(response)
}

async function getUniqueCategories(): Promise<string[]> {
  // Could cache this heavily since categories change infrequently
  const CACHE_KEY = 'launch:categories'
  const cached = await redis?.get(CACHE_KEY)
  if (cached) return JSON.parse(cached)

  const projects = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECTS,
    [Query.select(['category'])]
  )

  const unique = [...new Set(projects.documents.map(p => p.category))]
  await redis?.setex(CACHE_KEY, 86400, JSON.stringify(unique)) // 24h

  return unique
}
```

---

## 3. Real-Time Update Strategy

### 3.1 Appwrite Realtime vs Polling

**Recommendation:** **Hybrid Approach**

| Data Type | Update Method | Reason |
|-----------|---------------|--------|
| Hero Metrics | Polling (30s) | Low frequency, many clients |
| Spotlight Projects | Polling (60s) | Pre-computed, cached |
| Leaderboards | Static (on load) | Daily updates, heavy cache |
| Feed Projects | Appwrite Realtime | User-specific, real-time trades |

### 3.2 Appwrite Realtime Implementation

**Subscribe to Curves Updates:**
```typescript
// Frontend: hooks/useLaunchFeed.ts
import { client } from '@/lib/appwrite/client'

export function useLaunchFeedRealtime(projectIds: string[]) {
  useEffect(() => {
    const curveIds = projectIds.map(id => `curves.${id}`)

    const unsubscribe = client.subscribe(curveIds, (response) => {
      const event = response.events[0]
      const curveData = response.payload

      if (event.includes('.update')) {
        // Update local state with new curve data
        updateProjectMetrics(curveData)
      }
    })

    return () => unsubscribe()
  }, [projectIds])
}
```

### 3.3 Polling Strategy

**Hero Metrics Polling:**
```typescript
// Frontend: hooks/useHeroMetrics.ts
import { useQuery } from '@tanstack/react-query'

export function useHeroMetrics() {
  return useQuery({
    queryKey: ['launch', 'hero', 'metrics'],
    queryFn: async () => {
      const res = await fetch('/api/launch/metrics/hero')
      return res.json()
    },
    refetchInterval: 30000, // 30 seconds
    staleTime: 25000,       // Consider stale after 25s
  })
}
```

---

## 4. Data Aggregation & Computed Fields

### 4.1 Platform Metrics Aggregation

**Cron Job:** `scripts/cron/update-platform-metrics.ts`

```typescript
import { serverDatabases, DB_ID, COLLECTIONS } from '@/lib/appwrite/server-client'
import { Query } from 'node-appwrite'

export async function updatePlatformMetrics() {
  console.log('Starting platform metrics aggregation...')

  // Get all active projects
  const projects = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECTS,
    [
      Query.equal('isPublic', true),
      Query.equal('isDeleted', false)
    ]
  )

  // Aggregate TVL
  const totalTvl = projects.documents.reduce((sum, p) => sum + p.tvl, 0)

  // Count active projects
  const activeProjects = projects.documents.filter(p => p.status === 'live').length

  // Get historical data for 24h change
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const historicalMetrics = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.PLATFORM_METRICS,
    [
      Query.equal('type', 'snapshot'),
      Query.greaterThanEqual('timestamp', yesterday),
      Query.orderDesc('timestamp'),
      Query.limit(1)
    ]
  )

  const yesterdayTvl = historicalMetrics.documents[0]?.totalTvl || totalTvl
  const tvlChange24h = ((totalTvl - yesterdayTvl) / yesterdayTvl) * 100

  // Calculate total airdrops (from curve_events)
  const airdropEvents = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.CURVE_EVENTS,
    [
      Query.equal('type', 'launch')
    ]
  )

  const totalAirdrops = airdropEvents.documents.reduce((sum, e) => sum + (e.amount || 0), 0)

  // Get volume
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const recentEvents = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.CURVE_EVENTS,
    [
      Query.equal('type', ['buy', 'sell']),
      Query.greaterThan('timestamp', oneDayAgo)
    ]
  )

  const volume24h = recentEvents.documents.reduce((sum, e) => sum + e.amount, 0)

  // Update or create realtime document
  const metricsData = {
    totalTvl,
    totalAirdropsValue: totalAirdrops,
    activeProjectsCount: activeProjects,
    totalProjectsCount: projects.total,
    tvlChange24h,
    activityChange24h: 0, // TODO: Implement activity tracking
    volume24h,
    volumeAllTime: 0, // TODO: Calculate
    totalUsers: 0, // TODO: Get from users collection
    activeUsers24h: 0, // TODO: Track active sessions
    timestamp: new Date().toISOString(),
    type: 'realtime'
  }

  try {
    // Try to update existing 'current' document
    await serverDatabases.updateDocument(
      DB_ID,
      COLLECTIONS.PLATFORM_METRICS,
      'current',
      metricsData
    )
  } catch {
    // Create if doesn't exist
    await serverDatabases.createDocument(
      DB_ID,
      COLLECTIONS.PLATFORM_METRICS,
      'current',
      metricsData
    )
  }

  console.log('Platform metrics updated:', metricsData)

  return metricsData
}

// Run every 5 minutes
if (require.main === module) {
  setInterval(updatePlatformMetrics, 5 * 60 * 1000)
  updatePlatformMetrics() // Initial run
}
```

**Schedule:** Every 5 minutes (can be triggered on curve events for instant updates)

### 4.2 Leaderboard Computation

**Cron Job:** `scripts/cron/update-leaderboards.ts`

```typescript
export async function updateBuildersLeaderboard() {
  // Get all users with projects
  const projects = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECTS,
    [Query.limit(10000)] // Adjust as needed
  )

  // Group by owner
  const builderStats = new Map<string, {
    userId: string
    projectsLaunched: number
    totalTvlRaised: number
    totalHolders: number
    projects: any[]
  }>()

  for (const project of projects.documents) {
    const userId = project.ownerUserId
    const existing = builderStats.get(userId) || {
      userId,
      projectsLaunched: 0,
      totalTvlRaised: 0,
      totalHolders: 0,
      projects: []
    }

    existing.projectsLaunched++
    existing.totalTvlRaised += project.tvl
    existing.totalHolders += project.holdersCount
    existing.projects.push(project)

    builderStats.set(userId, existing)
  }

  // Sort by total TVL
  const sorted = Array.from(builderStats.values())
    .sort((a, b) => b.totalTvlRaised - a.totalTvlRaised)

  // Enrich with user data and save
  for (let i = 0; i < sorted.length; i++) {
    const builder = sorted[i]
    const user = await serverDatabases.getDocument(
      DB_ID,
      COLLECTIONS.USERS,
      builder.userId
    )

    // Calculate average ROI (would need holder data)
    const averageRoi = 0 // TODO: Implement

    const leaderboardData = {
      userId: builder.userId,
      rank: i + 1,
      projectsLaunched: builder.projectsLaunched,
      totalTvlRaised: builder.totalTvlRaised,
      totalHolders: builder.totalHolders,
      averageRoi,
      followersCount: user.followersCount || 0,
      reputationScore: user.reputationScore || 50,
      username: user.username,
      avatar: user.avatar,
      isVerified: user.isVerified || false,
      lastUpdated: new Date().toISOString()
    }

    try {
      // Try to update existing
      const existing = await serverDatabases.listDocuments(
        DB_ID,
        COLLECTIONS.LEADERBOARD_BUILDERS,
        [Query.equal('userId', builder.userId), Query.limit(1)]
      )

      if (existing.documents.length > 0) {
        await serverDatabases.updateDocument(
          DB_ID,
          COLLECTIONS.LEADERBOARD_BUILDERS,
          existing.documents[0].$id,
          leaderboardData
        )
      } else {
        await serverDatabases.createDocument(
          DB_ID,
          COLLECTIONS.LEADERBOARD_BUILDERS,
          'unique()',
          leaderboardData
        )
      }
    } catch (error) {
      console.error(`Error updating builder leaderboard for ${builder.userId}:`, error)
    }
  }

  console.log(`Updated ${sorted.length} builders in leaderboard`)
}
```

**Schedule:** Daily at 00:00 UTC

### 4.3 Project Denormalization

**On Curve Update:**
```typescript
// Webhook or function triggered on curve.update
export async function syncProjectMetrics(curveId: string) {
  const curve = await serverDatabases.getDocument(
    DB_ID,
    COLLECTIONS.CURVES,
    curveId
  )

  // Find associated project
  const projects = await serverDatabases.listDocuments(
    DB_ID,
    COLLECTIONS.PROJECTS,
    [Query.equal('curveId', curveId), Query.limit(1)]
  )

  if (projects.documents.length === 0) return

  const project = projects.documents[0]

  // Update denormalized fields
  await serverDatabases.updateDocument(
    DB_ID,
    COLLECTIONS.PROJECTS,
    project.$id,
    {
      tvl: curve.reserve,
      holdersCount: curve.holders,
      volume24h: curve.volume24h
    }
  )
}
```

---

## 5. Caching Strategy

### 5.1 Cache Layers

**Layer 1: Redis (Server-Side)**
- Hero metrics: 5 min TTL
- Spotlight projects: 10 min TTL
- Leaderboards: 1 hour TTL
- Feed queries: 5 min TTL
- Categories list: 24 hour TTL

**Layer 2: React Query (Client-Side)**
```typescript
// queryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,      // 30s
      cacheTime: 300000,     // 5min
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  }
})
```

**Layer 3: Appwrite (Database)**
- Denormalized fields reduce join queries
- Indexes on all filter/sort columns
- Composite indexes for common queries

### 5.2 Cache Invalidation

**Event-Driven Invalidation:**
```typescript
// On curve trade event
export async function onCurveTradeEvent(curveId: string) {
  // Invalidate related caches
  await redis?.del([
    'launch:hero:metrics',
    `launch:spotlight:*`,
    `launch:feed:*`,
    `curve:${curveId}:*`
  ])

  // Update denormalized fields
  await syncProjectMetrics(curveId)

  // Trigger platform metrics recalculation
  await updatePlatformMetrics()
}
```

### 5.3 Cache Warming

**Pre-populate on deploy:**
```typescript
// scripts/warm-cache.ts
export async function warmLaunchPageCache() {
  console.log('Warming launch page caches...')

  // Fetch hero metrics
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/launch/metrics/hero`)

  // Fetch spotlight
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/launch/spotlight`)

  // Fetch leaderboards
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/launch/leaderboard/builders`)
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/launch/leaderboard/investors`)

  // Fetch feed (default view)
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/launch/feed?status=all&sortBy=trending`)

  console.log('Cache warming complete')
}
```

---

## 6. Data Consistency Concerns

### 6.1 Eventual Consistency Model

**Accepted Trade-offs:**
- Hero metrics may lag by up to 5 minutes
- Leaderboards updated daily (acceptable for rankings)
- Feed data may be stale by 5 minutes

**Critical Consistency:**
- Individual project data must be real-time (use Appwrite Realtime)
- Trade execution data must be immediately consistent

### 6.2 Race Condition Handling

**Optimistic Updates:**
```typescript
// Frontend: Optimistic UI update
const { mutate } = useMutation({
  mutationFn: buyKeys,
  onMutate: async (variables) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['project', variables.projectId])

    // Snapshot previous value
    const previous = queryClient.getQueryData(['project', variables.projectId])

    // Optimistically update
    queryClient.setQueryData(['project', variables.projectId], (old: any) => ({
      ...old,
      tvl: old.tvl + variables.amount,
      holders: old.holders + (variables.isNewHolder ? 1 : 0)
    }))

    return { previous }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['project', variables.projectId], context.previous)
  },
  onSuccess: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries(['project'])
  }
})
```

### 6.3 Distributed Lock (Optional)

For critical operations (e.g., platform metrics updates):
```typescript
import Redlock from 'redlock'

const redlock = new Redlock([redisClient], {
  retryCount: 3,
  retryDelay: 200
})

export async function updatePlatformMetricsWithLock() {
  const lock = await redlock.lock('lock:platform-metrics', 5000) // 5s TTL

  try {
    await updatePlatformMetrics()
  } finally {
    await lock.unlock()
  }
}
```

---

## 7. Performance Optimizations

### 7.1 Query Performance

**Estimated Query Times (with indexes):**

| Query | Without Index | With Index | Target |
|-------|---------------|------------|--------|
| Hero metrics | 500ms | 50ms | < 100ms |
| Spotlight (top 3) | 800ms | 80ms | < 150ms |
| Feed (20 items) | 1200ms | 150ms | < 300ms |
| Leaderboard (10) | 400ms | 40ms | < 100ms |

### 7.2 Denormalization Strategy

**Trade-off Analysis:**

**Denormalize:**
- Project name/logo in leaderboards (avoids joins)
- TVL/holders in projects (from curves)
- User metadata in leaderboards

**Normalize:**
- Curve trading data (source of truth)
- User profiles (frequently updated)
- Campaign data (complex relationships)

### 7.3 Batch Operations

**Bulk Leaderboard Updates:**
```typescript
// Use Appwrite batch API
import { ID } from 'node-appwrite'

export async function batchUpdateLeaderboard(entries: LeaderboardEntry[]) {
  const batchSize = 100

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize)

    await Promise.all(
      batch.map(entry =>
        serverDatabases.createDocument(
          DB_ID,
          COLLECTIONS.LEADERBOARD_BUILDERS,
          ID.unique(),
          entry
        )
      )
    )
  }
}
```

### 7.4 CDN Caching

**Static Data Caching:**
```typescript
// Next.js API Route with CDN headers
export async function GET(request: Request) {
  const data = await fetchLeaderboard()

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'CDN-Cache-Control': 'max-age=3600'
    }
  })
}
```

---

## 8. Monitoring & Observability

### 8.1 Key Metrics to Track

**API Performance:**
- P50, P95, P99 latency per endpoint
- Error rate
- Cache hit rate
- Query execution time

**Data Quality:**
- Denormalization lag (time between curve update and project sync)
- Cache staleness
- Missing data (null checks on enriched responses)

**Business Metrics:**
- API calls per endpoint
- Most filtered categories
- Most viewed projects

### 8.2 Logging Strategy

```typescript
// Structured logging
export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    const result = await fetchData()

    logger.info('API request completed', {
      endpoint: '/api/launch/feed',
      duration: Date.now() - startTime,
      cached: result.cached,
      resultCount: result.data.length
    })

    return Response.json(result)
  } catch (error) {
    logger.error('API request failed', {
      endpoint: '/api/launch/feed',
      duration: Date.now() - startTime,
      error: error.message
    })

    throw error
  }
}
```

---

## 9. Migration Plan

### Phase 1: Schema Setup (Week 1)
1. Create `projects` collection
2. Create `platform_metrics` collection
3. Create leaderboard collections
4. Add indexes
5. Migrate existing curve data to projects

### Phase 2: API Development (Week 1-2)
1. Implement hero metrics API
2. Implement spotlight API
3. Implement leaderboard APIs
4. Implement feed API
5. Add caching layer

### Phase 3: Background Jobs (Week 2)
1. Platform metrics aggregation cron
2. Leaderboard computation cron
3. Denormalization sync functions
4. Cache warming scripts

### Phase 4: Frontend Integration (Week 2-3)
1. Create React Query hooks
2. Implement real-time subscriptions
3. Build UI components
4. Performance testing
5. Load testing

### Phase 5: Optimization (Week 3)
1. Index tuning
2. Cache optimization
3. Query optimization
4. CDN configuration

---

## 10. Technology Stack Recommendations

### Required Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.90.5",  // Already installed
    "appwrite": "^16.0.2",                // Already installed
    "node-appwrite": "^14.2.0",           // Already installed
    "ioredis": "^5.3.0",                  // For Redis caching
    "redlock": "^5.0.0"                   // For distributed locks
  }
}
```

### Infrastructure

**Redis:**
- **Recommended:** Upstash Redis (serverless, Next.js compatible)
- **Alternative:** Redis Labs (managed)
- **Dev:** Local Redis Docker container

**Cron Jobs:**
- **Recommended:** Vercel Cron (if on Vercel)
- **Alternative:** GitHub Actions scheduled workflows
- **Alternative:** Appwrite Functions (Cloud Functions)

---

## 11. Security Considerations

### 11.1 Rate Limiting

```typescript
// middleware/rateLimit.ts
import { redis } from '@/lib/redis'

export async function rateLimit(identifier: string, limit: number, window: number) {
  const key = `ratelimit:${identifier}`
  const current = await redis.incr(key)

  if (current === 1) {
    await redis.expire(key, window)
  }

  if (current > limit) {
    throw new Error('Rate limit exceeded')
  }

  return {
    allowed: true,
    remaining: limit - current
  }
}

// Usage in API route
export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  await rateLimit(ip, 60, 60) // 60 requests per minute

  // ... rest of handler
}
```

### 11.2 Input Validation

```typescript
import { z } from 'zod'

const feedQuerySchema = z.object({
  status: z.enum(['all', 'live', 'frozen', 'launched']).default('all'),
  sortBy: z.enum(['latest', 'tvl', 'trending']).default('trending'),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().max(100).optional()
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams)

  const validated = feedQuerySchema.parse(params)

  // Use validated params
  // ...
}
```

---

## 12. Testing Strategy

### 12.1 API Tests

```typescript
// __tests__/api/launch/feed.test.ts
import { GET } from '@/app/api/launch/feed/route'

describe('/api/launch/feed', () => {
  it('should return projects with default filters', async () => {
    const request = new Request('http://localhost/api/launch/feed')
    const response = await GET(request)
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.data).toBeInstanceOf(Array)
    expect(data.pagination).toHaveProperty('total')
  })

  it('should filter by status', async () => {
    const request = new Request('http://localhost/api/launch/feed?status=live')
    const response = await GET(request)
    const data = await response.json()

    expect(data.data.every(p => p.status === 'live')).toBe(true)
  })

  it('should sort by TVL', async () => {
    const request = new Request('http://localhost/api/launch/feed?sortBy=tvl')
    const response = await GET(request)
    const data = await response.json()

    const tvls = data.data.map(p => p.tvl)
    expect(tvls).toEqual([...tvls].sort((a, b) => b - a))
  })
})
```

### 12.2 Performance Tests

```typescript
// scripts/load-test.ts
import { performance } from 'perf_hooks'

async function loadTest() {
  const endpoints = [
    '/api/launch/metrics/hero',
    '/api/launch/spotlight',
    '/api/launch/feed'
  ]

  for (const endpoint of endpoints) {
    const start = performance.now()

    const promises = Array(100).fill(null).map(() =>
      fetch(`http://localhost:3000${endpoint}`)
    )

    await Promise.all(promises)

    const duration = performance.now() - start
    console.log(`${endpoint}: ${duration}ms for 100 concurrent requests`)
  }
}

loadTest()
```

---

## 13. Documentation & Handoff

### 13.1 API Documentation

Generate OpenAPI spec:
```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: Launch Page API
  version: 1.0.0

paths:
  /api/launch/metrics/hero:
    get:
      summary: Get platform-wide hero metrics
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      vaultTvl:
                        type: number
                      airdropsTotal:
                        type: number
                      # ... etc
```

### 13.2 Runbook

**Daily Operations:**
1. Monitor Redis cache hit rate (target > 80%)
2. Check cron job execution logs
3. Review API error rates

**Incident Response:**
- Cache miss storm → Manually trigger cache warming
- Slow queries → Check index usage in Appwrite console
- Data inconsistency → Run sync scripts manually

---

## Summary

This architecture provides:

1. **Scalable Database Schema** - Optimized collections with proper indexes
2. **Performant APIs** - Multi-layer caching, denormalization, batch operations
3. **Real-Time Updates** - Hybrid polling + Appwrite Realtime
4. **Data Consistency** - Aggregation jobs, event-driven sync, optimistic UI
5. **Observability** - Structured logging, metrics, monitoring
6. **Security** - Rate limiting, input validation, distributed locks

**Performance Targets:**
- Hero Metrics: < 100ms (cached)
- Spotlight: < 150ms (cached)
- Feed: < 300ms (20 items, cached)
- Leaderboards: < 100ms (cached)

**Next Steps:**
1. Review and approve architecture
2. Create Appwrite collections (use setup scripts)
3. Implement API routes
4. Build cron jobs
5. Integrate frontend hooks
6. Performance testing
7. Production deployment

---

**Questions or concerns?** This architecture is designed to handle 1000+ concurrent users with sub-second response times while maintaining data accuracy.
