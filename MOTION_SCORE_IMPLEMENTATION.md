# Motion Score Implementation Plan - Make it VIRAL 🚀

## Executive Summary
Motion Score will be THE defining metric of the app - visible everywhere, updating in real-time, creating FOMO, and driving viral Twitter sharing. Think "Klout Score meets CT culture meets video game achievement system."

## 1. WHERE MOTION SCORE APPEARS 📍

### Primary Locations (Always Visible)
```typescript
// File: app/network/page.tsx (Line 28)
const [metrics, setMetrics] = useState({
  onlineNow: 0,
  openTasks: 0,
  holders: 0,
  collaborations: 0,
  motionScore: 0,        // ADD: User's current score
  globalRank: 0,         // ADD: Global ranking
  dailyChange: 0,        // ADD: Today's change
  streak: 0,             // ADD: Daily login streak
})

// File: components/network/UserCard.tsx (Line 21)
motionScore?: number      // ALREADY EXISTS - just need backend

// File: app/profile/page.tsx (Line 309)
// ADD: Motion Score Hero Section
<MotionScoreHero
  score={userMotionScore}
  rank={globalRank}
  percentile={topPercentile}
  streak={dailyStreak}
  nextMilestone={nextMilestone}
/>
```

### Secondary Locations (Context-Aware)
```typescript
// File: components/UnifiedCard.tsx
// ADD: Creator motion score badge
<MotionScoreBadge
  score={creatorMotionScore}
  size="sm"
  showRank={true}
/>

// File: app/discover/page.tsx (Line 268)
// REPLACE static "1,240" with real motion score
<div className="text-xl font-bold text-white font-led-dot">
  {userMotionScore}
</div>

// File: components/launch/LaunchDetailsModal.tsx
// ADD: Show project owner's motion score
```

### New Components to Create
```typescript
// components/motion/MotionScoreBadge.tsx - Mini badge for avatars
// components/motion/MotionScoreHero.tsx - Full dashboard
// components/motion/MotionScoreLeaderboard.tsx - Top 100 users
// components/motion/MotionScoreShareCard.tsx - Twitter share graphic
// components/motion/MotionScoreComparison.tsx - VS mode
// components/motion/MotionScoreAnimation.tsx - +points celebration
```

## 2. BACKEND ARCHITECTURE 🏗️

### Appwrite Collections
```typescript
// File: lib/appwrite/client.ts (Line 41)
// ADD to COLLECTIONS:
MOTION_SCORES: 'motion_scores',
MOTION_EVENTS: 'motion_events',
MOTION_MILESTONES: 'motion_milestones',
MOTION_LEADERBOARD: 'motion_leaderboard',

// MOTION_SCORES Collection Schema
{
  userId: string (unique),
  score: number,
  rank: number,
  percentile: number,

  // Breakdown
  keysScore: number,        // Points from key purchases
  clipsScore: number,       // Points from approved clips
  networkScore: number,     // Points from connections
  activityScore: number,    // Points from daily activity
  streakScore: number,      // Points from login streak

  // Metadata
  dailyChange: number,
  weeklyChange: number,
  allTimeHigh: number,
  currentStreak: number,
  longestStreak: number,

  // Achievements
  badges: string[],
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Legendary',

  // Timestamps
  lastCalculated: string,
  lastActive: string,
  createdAt: string,
  updatedAt: string
}

// MOTION_EVENTS Collection Schema
{
  userId: string,
  eventType: 'key_purchase' | 'clip_approved' | 'connection_made' | 'daily_login' | 'achievement_unlocked',
  points: number,
  metadata: object,
  timestamp: string
}
```

### Service Implementation
```typescript
// File: lib/appwrite/services/motionScore.ts (CREATE NEW)
import { databases, DB_ID, COLLECTIONS } from '../client'
import { Query, ID } from 'appwrite'

export class MotionScoreService {
  // Calculate score based on all activities
  static async calculateMotionScore(userId: string): Promise<number> {
    const weights = {
      keyPurchase: 5,      // 5 points per SOL spent
      clipApproved: 10,    // 10 points per approved clip
      connection: 3,       // 3 points per connection
      dailyLogin: 2,       // 2 points per day streak
      holder: 1,           // 1 point per key holder
    }

    // Get user's activities
    const [curves, clips, connections, holdings] = await Promise.all([
      CurveService.getCurveByOwner('user', userId),
      getApprovedClipsCount(userId),
      getConnectionsCount(userId),
      getUserHoldingsValue(userId),
    ])

    let score = 0

    // Keys/Trading Activity (0-30 points)
    score += Math.min(30, holdings.totalValue * weights.keyPurchase)

    // Content Creation (0-30 points)
    score += Math.min(30, clips.count * weights.clipApproved)

    // Network Building (0-20 points)
    score += Math.min(20, connections.count * weights.connection)

    // Consistency/Streak (0-20 points)
    score += Math.min(20, calculateStreakBonus(userId))

    return Math.min(100, Math.round(score))
  }

  // Real-time score update
  static async updateScoreRealtime(userId: string, event: MotionEvent): Promise<void> {
    // 1. Record event
    await databases.createDocument(
      DB_ID,
      COLLECTIONS.MOTION_EVENTS,
      ID.unique(),
      {
        userId,
        eventType: event.type,
        points: event.points,
        metadata: event.metadata,
        timestamp: new Date().toISOString()
      }
    )

    // 2. Recalculate score
    const newScore = await this.calculateMotionScore(userId)

    // 3. Update user's score
    await this.updateUserScore(userId, newScore)

    // 4. Trigger real-time update via WebSocket
    await this.broadcastScoreUpdate(userId, newScore)
  }

  // Get leaderboard
  static async getLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
    const cached = await this.getCachedLeaderboard()
    if (cached && cached.age < 60000) return cached.data // 1 min cache

    const scores = await databases.listDocuments(
      DB_ID,
      COLLECTIONS.MOTION_SCORES,
      [
        Query.orderDesc('score'),
        Query.limit(limit)
      ]
    )

    const leaderboard = scores.documents.map((doc, index) => ({
      rank: index + 1,
      userId: doc.userId,
      username: doc.username,
      avatar: doc.avatar,
      score: doc.score,
      tier: doc.tier,
      dailyChange: doc.dailyChange,
      badges: doc.badges,
    }))

    await this.cacheLeaderboard(leaderboard)
    return leaderboard
  }
}
```

## 3. REAL-TIME UPDATES ⚡

### WebSocket Integration
```typescript
// File: hooks/useMotionScore.ts (CREATE NEW)
import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { client } from '@/lib/appwrite/client'

export function useMotionScore(userId?: string) {
  const { user } = usePrivy()
  const targetUserId = userId || user?.id
  const [score, setScore] = useState(0)
  const [rank, setRank] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<MotionEvent | null>(null)

  useEffect(() => {
    if (!targetUserId) return

    // Initial fetch
    MotionScoreService.getUserScore(targetUserId).then(data => {
      setScore(data.score)
      setRank(data.rank)
    })

    // Subscribe to real-time updates
    const unsubscribe = client.subscribe(
      `databases.${DB_ID}.collections.${COLLECTIONS.MOTION_SCORES}.documents.${targetUserId}`,
      (response) => {
        const newScore = response.payload.score
        const oldScore = score

        // Animate score change
        setIsUpdating(true)
        animateScoreChange(oldScore, newScore, (value) => {
          setScore(value)
        })

        // Show celebration if milestone
        if (Math.floor(newScore / 10) > Math.floor(oldScore / 10)) {
          celebrateMilestone(newScore)
        }

        setIsUpdating(false)
      }
    )

    return () => unsubscribe()
  }, [targetUserId])

  return { score, rank, isUpdating, lastUpdate }
}

// Animation helper
function animateScoreChange(from: number, to: number, setter: (n: number) => void) {
  const duration = 1000
  const steps = 30
  const increment = (to - from) / steps
  let current = from

  const interval = setInterval(() => {
    current += increment
    if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
      setter(to)
      clearInterval(interval)
    } else {
      setter(Math.round(current))
    }
  }, duration / steps)
}
```

### Trigger Points
```typescript
// File: hooks/useCurveTrade.ts
// ADD: After successful trade
await MotionScoreService.updateScoreRealtime(userId, {
  type: 'key_purchase',
  points: Math.round(solAmount * 5),
  metadata: { curveId, amount: solAmount }
})

// File: lib/appwrite/services/clips.ts (Line 409)
// ADD: After clip approval
if (approved) {
  await MotionScoreService.updateScoreRealtime(clip.submittedBy, {
    type: 'clip_approved',
    points: 10,
    metadata: { clipId, projectId: clip.projectId }
  })
}

// File: lib/appwrite/services/network.ts
// ADD: After connection accepted
await MotionScoreService.updateScoreRealtime(senderId, {
  type: 'connection_made',
  points: 3,
  metadata: { connectedUserId: receiverId }
})
```

## 4. VIRAL SHARING FEATURES 🐦

### Share Card Generator
```typescript
// File: components/motion/MotionScoreShareCard.tsx (CREATE NEW)
import { useState } from 'react'
import html2canvas from 'html2canvas'

export function MotionScoreShareCard({ userId, score, rank, tier, badges }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateAndShare = async () => {
    setIsGenerating(true)

    // Capture card as image
    const element = document.getElementById('motion-score-card')
    const canvas = await html2canvas(element)
    const blob = await canvasToBlob(canvas)

    // Create shareable link
    const shareUrl = `${window.location.origin}/motion/${userId}`
    const tweetText = getViralTweetText(score, rank, tier)

    // Open Twitter with pre-filled tweet
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank')

    setIsGenerating(false)
  }

  const getViralTweetText = (score: number, rank: number, tier: string) => {
    const texts = {
      legendary: [
        `Motion Score: ${score} 🔥\nRank: #${rank}\n\nCall me ${tier}, I'm literally him @icm_motion`,
        `Just hit ${score} Motion Score 🚀\n\nNGMI if you're not top ${rank} @icm_motion`,
        `${score} Motion Score\n#${rank} Global\n\nI don't touch grass, I touch gains @icm_motion`
      ],
      high: [
        `Motion Score ${score} and climbing 📈\n\nWho's ready to get mogged? @icm_motion`,
        `Rank #${rank} with ${score} Motion Score\n\nLFG or stay poor @icm_motion`
      ],
      mid: [
        `${score} Motion Score secured 💪\n\nTop ${Math.round(rank/10)*10} and not stopping @icm_motion`,
        `Grinding my way to ${score} Motion Score\n\nWe're all gonna make it @icm_motion`
      ],
      low: [
        `Started from the bottom now we're at ${score} 📊\n\nMotion Score only goes up @icm_motion`,
        `${score} Motion Score today, ${score * 2} tomorrow\n\nBuilding in public @icm_motion`
      ]
    }

    const category = score >= 80 ? 'legendary' : score >= 60 ? 'high' : score >= 40 ? 'mid' : 'low'
    const options = texts[category]
    return options[Math.floor(Math.random() * options.length)]
  }

  return (
    <div id="motion-score-card" className="w-[600px] h-[315px] bg-black p-8">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D1FD0A]/20 to-[#00FF88]/20" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <img src="/logo.svg" className="h-8" />
          <div className="text-xs text-zinc-500">icmmotion.com</div>
        </div>

        <div className="text-center mb-6">
          <div className="text-7xl font-black text-[#D1FD0A] mb-2">{score}</div>
          <div className="text-xl text-white">Motion Score</div>
        </div>

        <div className="flex items-center justify-around">
          <div>
            <div className="text-3xl font-bold text-white">#{rank}</div>
            <div className="text-xs text-zinc-400">Global Rank</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#00FF88]">{tier}</div>
            <div className="text-xs text-zinc-400">Tier</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mt-4">
          {badges.slice(0, 5).map(badge => (
            <div key={badge} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]" />
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Comparison Tool
```typescript
// File: components/motion/MotionScoreComparison.tsx (CREATE NEW)
export function MotionScoreComparison({ user1, user2 }) {
  const winner = user1.score > user2.score ? user1 : user2
  const loser = user1.score > user2.score ? user2 : user1
  const diff = Math.abs(user1.score - user2.score)

  const getBattleText = () => {
    if (diff > 30) return `${winner.name} absolutely MOGGED ${loser.name} 💀`
    if (diff > 15) return `${winner.name} is clear of ${loser.name} 📈`
    if (diff > 5) return `Close battle but ${winner.name} takes the W`
    return `Basically tied, both gigachads`
  }

  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-[#D1FD0A]/30">
      <h3 className="text-xl font-bold text-center mb-4">{getBattleText()}</h3>

      <div className="grid grid-cols-3 gap-4 items-center">
        {/* User 1 */}
        <div className="text-center">
          <img src={user1.avatar} className="w-20 h-20 rounded-full mx-auto mb-2" />
          <div className="text-lg font-bold">{user1.name}</div>
          <div className="text-3xl font-black text-[#D1FD0A]">{user1.score}</div>
        </div>

        {/* VS */}
        <div className="text-center">
          <div className="text-4xl font-black text-zinc-500">VS</div>
          <div className="text-sm text-zinc-400 mt-2">
            {diff} point difference
          </div>
        </div>

        {/* User 2 */}
        <div className="text-center">
          <img src={user2.avatar} className="w-20 h-20 rounded-full mx-auto mb-2" />
          <div className="text-lg font-bold">{user2.name}</div>
          <div className="text-3xl font-black text-[#D1FD0A]">{user2.score}</div>
        </div>
      </div>

      <button className="w-full mt-4 py-3 rounded-xl bg-[#D1FD0A] text-black font-bold">
        Share Battle Result 🐦
      </button>
    </div>
  )
}
```

## 5. GAMIFICATION UX 🎮

### Score Update Animation
```typescript
// File: components/motion/MotionScoreAnimation.tsx (CREATE NEW)
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export function MotionScoreAnimation({ oldScore, newScore, show }) {
  const diff = newScore - oldScore
  const isMilestone = Math.floor(newScore / 10) > Math.floor(oldScore / 10)

  useEffect(() => {
    if (show && isMilestone) {
      // Fire confetti for milestones
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D1FD0A', '#00FF88', '#FFD700']
      })
    }
  }, [show, isMilestone])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.5 }}
          className="fixed bottom-20 right-4 z-50"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D1FD0A] to-[#00FF88] text-black">
            <div className="text-3xl font-black mb-1">+{diff}</div>
            <div className="text-sm font-bold">Motion Score!</div>
            {isMilestone && (
              <div className="mt-2 text-xs">🎉 Milestone Reached!</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Daily Streak System
```typescript
// File: components/motion/DailyStreak.tsx (CREATE NEW)
export function DailyStreak({ currentStreak, recordStreak }) {
  const [showReminder, setShowReminder] = useState(false)

  // Check if user is about to lose streak
  useEffect(() => {
    const lastActive = localStorage.getItem('lastActive')
    const now = new Date()
    const last = new Date(lastActive)
    const hoursSinceActive = (now - last) / (1000 * 60 * 60)

    if (hoursSinceActive > 20 && currentStreak > 0) {
      setShowReminder(true)
      // Send push notification
      sendStreakReminder()
    }
  }, [currentStreak])

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🔥</span>
          <div>
            <div className="text-2xl font-black text-white">{currentStreak}</div>
            <div className="text-xs text-zinc-400">Day Streak</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-zinc-400">Record</div>
          <div className="text-lg font-bold text-orange-400">{recordStreak}</div>
        </div>
      </div>

      {showReminder && (
        <div className="mt-2 p-2 rounded bg-red-500/20 border border-red-500/30">
          <div className="text-xs text-red-400">
            ⚠️ Login within 4 hours or lose your streak!
          </div>
        </div>
      )}
    </div>
  )
}
```

## 6. PERFORMANCE OPTIMIZATION 🚀

### Caching Strategy
```typescript
// File: lib/cache/motionScoreCache.ts (CREATE NEW)
class MotionScoreCache {
  private cache = new Map<string, CachedScore>()
  private batchQueue = new Set<string>()
  private batchTimer: NodeJS.Timeout | null = null

  // Get score with cache
  async getScore(userId: string): Promise<number> {
    // Check memory cache
    const cached = this.cache.get(userId)
    if (cached && Date.now() - cached.timestamp < 60000) {
      return cached.score
    }

    // Check Redis cache
    const redisScore = await redis.get(`motion:${userId}`)
    if (redisScore) {
      this.cache.set(userId, {
        score: parseInt(redisScore),
        timestamp: Date.now()
      })
      return parseInt(redisScore)
    }

    // Fetch from Appwrite
    const score = await MotionScoreService.getUserScore(userId)
    this.cacheScore(userId, score)
    return score
  }

  // Batch fetch for grids
  async batchGetScores(userIds: string[]): Promise<Map<string, number>> {
    const results = new Map<string, number>()
    const misses: string[] = []

    // Check cache first
    for (const userId of userIds) {
      const cached = this.cache.get(userId)
      if (cached && Date.now() - cached.timestamp < 60000) {
        results.set(userId, cached.score)
      } else {
        misses.push(userId)
      }
    }

    // Batch fetch misses
    if (misses.length > 0) {
      const scores = await MotionScoreService.batchGetScores(misses)
      scores.forEach((score, userId) => {
        results.set(userId, score)
        this.cacheScore(userId, score)
      })
    }

    return results
  }

  // Invalidate on update
  invalidate(userId: string) {
    this.cache.delete(userId)
    redis.del(`motion:${userId}`)
  }
}

export const motionScoreCache = new MotionScoreCache()
```

### Database Indexes
```sql
-- Indexes for MOTION_SCORES collection
CREATE INDEX idx_motion_scores_user ON motion_scores(userId);
CREATE INDEX idx_motion_scores_score_desc ON motion_scores(score DESC);
CREATE INDEX idx_motion_scores_rank ON motion_scores(rank);
CREATE INDEX idx_motion_scores_tier_score ON motion_scores(tier, score DESC);
CREATE INDEX idx_motion_scores_updated ON motion_scores(updatedAt DESC);

-- Indexes for MOTION_EVENTS collection
CREATE INDEX idx_motion_events_user_time ON motion_events(userId, timestamp DESC);
CREATE INDEX idx_motion_events_type_time ON motion_events(eventType, timestamp DESC);

-- Compound index for leaderboard queries
CREATE INDEX idx_motion_leaderboard ON motion_scores(score DESC, rank, userId);
```

## 7. WEEK 1 IMPLEMENTATION PLAN 📅

### Day 1: Backend Foundation
```bash
✅ Create Appwrite collections (MOTION_SCORES, MOTION_EVENTS)
✅ Implement MotionScoreService base methods
✅ Set up calculation logic
✅ Create test data
```

### Day 2: Integration Points
```bash
✅ Hook into clip approval flow
✅ Hook into key purchase flow
✅ Hook into network connections
✅ Add daily login tracking
```

### Day 3: Frontend Components
```bash
✅ Create MotionScore display component
✅ Add to Network page
✅ Add to UserCard component
✅ Add to Profile page
```

### Day 4: Real-time & Animations
```bash
✅ Implement WebSocket subscriptions
✅ Create score update animations
✅ Add celebration effects
✅ Build notification system
```

### Day 5: Viral Features
```bash
✅ Build share card generator
✅ Create comparison tool
✅ Add Twitter integration
✅ Implement leaderboard
```

### Day 6-7: Polish & Launch
```bash
✅ Performance optimization
✅ Caching layer
✅ Testing & bug fixes
✅ Launch announcement
```

## 8. SUCCESS METRICS 📊

### KPIs to Track
- **Daily Active Users checking Motion Score**: Target 80%+
- **Share rate**: Target 20% of users share score weekly
- **Viral coefficient**: Each share brings 0.3+ new users
- **Engagement lift**: 40% increase in daily actions
- **Retention**: 30% increase in D7 retention

### A/B Tests to Run
1. **Score visibility**: Always visible vs. on-demand
2. **Update frequency**: Real-time vs. batched updates
3. **Celebration intensity**: Subtle vs. explosive
4. **Share incentives**: Points for sharing vs. no incentive
5. **Leaderboard size**: Top 10 vs. Top 100

## 9. VIRAL GROWTH MECHANICS 🌊

### Social Proof Loops
1. User increases Motion Score → Auto-tweet option
2. Friend sees tweet → Clicks through to app
3. Friend wants higher score → Signs up
4. Friend competes → Shares their score
5. Loop continues

### FOMO Triggers
- "🔥 anon just passed you in Motion Score!"
- "📈 You're 5 points from Top 100!"
- "⚠️ Your streak ends in 2 hours!"
- "🎯 New achievement available: Score 75+"

### Competitive Elements
- Daily/Weekly/Monthly leaderboards
- Guild/Team competitions
- Score betting/predictions
- Achievement races

## 10. TECHNICAL DEBT PREVENTION 🛠️

### Scalability Considerations
- Implement score calculation queue for large batches
- Use materialized views for leaderboards
- Implement gradual rollout with feature flags
- Plan for 100k+ concurrent users

### Monitoring & Analytics
- Track calculation performance
- Monitor cache hit rates
- Alert on scoring anomalies
- Dashboard for score distribution

---

## IMMEDIATE NEXT STEPS 🎯

1. **Create MotionScoreService** (`lib/appwrite/services/motionScore.ts`)
2. **Add Motion Score to Network page** (`app/network/page.tsx`)
3. **Update UserCard to show scores** (`components/network/UserCard.tsx`)
4. **Create useMotionScore hook** (`hooks/useMotionScore.ts`)
5. **Build MotionScoreHero component** (`components/motion/MotionScoreHero.tsx`)

Motion Score isn't just a feature - it's THE feature that makes users obsessed with the app. Every action increases it, every milestone feels amazing, and everyone wants to flex their score on Twitter.

**Ship this week. Make it viral. LFG! 🚀**