# Community Curation & Voting System - Master Implementation Plan

**Project:** ICM Motion - Network Page Transformation
**Status:** Ready for Implementation
**Timeline:** 6 Weeks to MVP
**Team Consensus:** UX + Backend + Full-Stack

---

## Executive Summary

Transform the Network page from basic metrics display into a **viral curation economy** where users earn by vetting projects through DAO-like voting mechanics.

### Core Value Proposition
- **For Curators:** Earn SOL by voting on quality projects (swipe, vote, earn, repeat)
- **For Projects:** Community-vetted badge = trust signal = higher launch success
- **For Platform:** Quality projects = network effects = sustainable growth

---

## Design Philosophy

### Twitter Viral Degen POV
- **Addictive:** Swipe voting (Tinder UX) - can't stop scrolling
- **Competitive:** Live leaderboards with real earnings visible
- **FOMO-driven:** Voting streaks, early voter bonuses, limited curator spots
- **Memeable:** Share earnings to Twitter, curator tier badges, "I voted before it launched"

### Motion Score Integration
Motion Score is now the **reputation currency** that determines:
- Voting power weight (√Motion Score)
- Curator tier eligibility
- Reward multipliers
- Queue priority

**Motion Score Drivers (New):**
- +30 max from curation accuracy
- +20 from curator tier
- +10 from voting streak
- -20 penalty for false approvals

---

## System Architecture

### Three-Layer System

```
Layer 1: Curation Queue (Submission → Review)
├── Users submit projects for vetting
├── Smart priority scoring (time + completeness + reputation)
└── Auto-assignment to qualified curators

Layer 2: Voting System (Community Decision)
├── DAO-style voting (simplified, not complex governance)
├── Reputation-weighted (√Motion Score = voting power)
├── Time-bound periods (48h for projects)
└── Real-time tallies via WebSocket

Layer 3: Reward Economy (Earn Mechanics)
├── Weekly SOL pools (platform fees + treasury)
├── Accuracy-based distribution (correct votes = rewards)
├── Quality multipliers (high accuracy = 2x rewards)
└── Instant claim to wallet
```

---

## Database Schema Summary

### Collections Created
1. **CURATION_PROPOSALS** - Voting proposals for projects
2. **VOTES** - Individual vote records with power calculation
3. **CURATION_QUEUE** - Projects pending review
4. **CURATOR_REVIEWS** - Initial curator assessments (pre-vote)
5. **CURATOR_STATS** - Performance metrics per user
6. **REWARD_POOL** - Monthly reward pools
7. **REWARD_DISTRIBUTIONS** - Individual earnings
8. **VOTING_SNAPSHOTS** - Time-series vote data

### Extended Collections
- **USERS:** Add `isCurator`, `curatorTier`, `totalVotesCast`, `motionScore`
- **PROJECTS:** Add `curationStatus`, `communityScore`, `launchEligible`

---

## UX Design Highlights

### Network Page Tabs

```
┌─────────────────────────────────────────────┐
│  Hot Takes | Vetted | Leaderboard | Active  │ ← Tab navigation
├─────────────────────────────────────────────┤
│                                             │
│   [Swipeable Voting Cards]                 │
│   ┌──────────────────────┐                 │
│   │  Project Card        │ ← Current vote  │
│   │  [Approve][Reject]   │                 │
│   └──────────────────────┘                 │
│                                             │
│   Progress: 234/1000 votes                 │
│   Your streak: 8 days 🔥                   │
│                                             │
└─────────────────────────────────────────────┘
```

### Voting Mechanics
- **Swipe left** = Reject
- **Swipe right** = Approve
- **Tap card** = View details
- **Double tap** = Quick approve (for experienced curators)

### Curator Tiers

| Tier | Requirements | Voting Power | Perks |
|------|--------------|--------------|-------|
| **Degen** | 10+ keys held | 1x | Vote + earn |
| **Veteran** | 50 votes, 60% accuracy | 1.5x | Featured badge |
| **Elite** | 200 votes, 70% accuracy | 2x | Veto power on rejects |
| **Legendary** | Top 10, 75% accuracy | 2.5x | Whitelist privileges |

### Earn Transparency

```
Your Week's Impact:
├── Votes cast: 42
├── Accuracy: 78%
├── Base reward: 0.234 SOL
├── Multiplier: 1.5x (Elite tier)
└── Total earned: 0.351 SOL ✅ Claim
```

---

## Backend Architecture

### Voting Power Formula

```typescript
votingPower = √(motionScore) × stakeMultiplier × tierMultiplier × accuracyBonus

Where:
- √(motionScore): Square root for diminishing returns (0-31.6 range)
- stakeMultiplier: 1.0 (future: 1 + √(stakedTokens/1000) × 0.5)
- tierMultiplier: 1.0 (Degen) → 2.5 (Legendary)
- accuracyBonus: 1.0 + (accuracy/100) × 0.3 (up to +30%)
```

**Example:**
- New user (Score 100): √100 × 1.0 × 1.0 × 1.0 = **10 power**
- Elite curator (Score 500, 85% acc): √500 × 1.0 × 2.0 × 1.255 = **56 power**
- Whale capped at 1000 power max (prevents dominance)

### Reward Distribution Formula

```typescript
yourShare = (yourScore / totalScore) × weeklyPool

yourScore = (correctVotes × accuracy) × qualityMultiplier

qualityMultiplier:
- ≥80% accuracy: 1.5x
- 60-79%: 1.0x
- <60%: 0.5x (penalty)
```

**Example Weekly Pool (500 SOL):**
- Curator A: 30 votes, 90% acc → 30 × 0.9 × 1.5 = 40.5 points
- Curator B: 20 votes, 75% acc → 20 × 0.75 × 1.0 = 15 points
- Curator C: 10 votes, 50% acc → 10 × 0.5 × 0.5 = 2.5 points

Total: 58 points
A earns: (40.5/58) × 500 = **349 SOL**
B earns: (15/58) × 500 = **129 SOL**
C earns: (2.5/58) × 500 = **22 SOL**

### Pool Funding Sources

```
Weekly Pool Breakdown:
├── Platform fees (1% of launches): ~20 SOL/week
├── Rejected submission fees (2.5 SOL): ~5 SOL/week
├── Treasury allocation: 5 SOL/week
└── Total: ~30 SOL/week (scales with volume)
```

---

## Anti-Gaming Measures

### Sybil Resistance
1. **Economic Barrier:** Must hold 10+ keys (0.5 SOL commitment)
2. **Time Lock:** Keys must be held for 24h before voting
3. **Vote Weight:** Accuracy > holdings (quality over quantity)
4. **Pattern Detection:** Flag coordinated voting (same IP, time clustering)
5. **Cost Analysis:** Creating 100 fake accounts = 50 SOL (not profitable)

### Quality Enforcement
- **Strike System:** 3 strikes for <50% accuracy = 30-day suspension
- **Retroactive Audits:** Projects audited 30 days post-launch
- **Accuracy Recalculation:** Curator scores adjusted based on project success
- **Tier Demotion:** Low accuracy = automatic tier downgrade

---

## API Endpoints

### Voting APIs
```typescript
POST   /api/curation/proposals          // Create vote
GET    /api/curation/proposals          // List active votes
GET    /api/curation/proposals/:id      // Get details + tally
POST   /api/curation/proposals/:id/vote // Cast vote
POST   /api/curation/proposals/:id/finalize // Finalize (cron)
```

### Queue APIs
```typescript
POST   /api/curation/queue/submit       // Submit project
GET    /api/curation/queue              // Get my queue
POST   /api/curation/queue/:id/claim    // Claim review
POST   /api/curation/queue/:id/review   // Submit review
```

### Curator APIs
```typescript
GET    /api/curators/me/stats           // My performance
GET    /api/curators/leaderboard        // Top curators
```

### Rewards APIs
```typescript
GET    /api/rewards/pools/current       // Current pool
GET    /api/rewards/me                  // My earnings
POST   /api/rewards/claim/:id           // Claim SOL
```

---

## Full-Stack Integration

### Component Tree

```
app/network/page.tsx
├── CurationTabs (main container)
│   ├── TabNavigation
│   ├── PendingReviewsTab
│   │   ├── VotingQueue (infinite scroll)
│   │   ├── VotingCard (per project)
│   │   │   ├── ProjectPreview
│   │   │   ├── VoteProgress (real-time)
│   │   │   └── VoteButtons (approve/reject)
│   │   └── EmptyState
│   ├── ApprovedTab
│   │   └── ApprovedProjectsGrid
│   ├── MyVotesTab
│   │   └── VoteHistory
│   ├── LeaderboardTab
│   │   ├── TopCurators
│   │   ├── WeeklyChampions
│   │   └── ShareCard
│   └── RewardsTab
│       ├── EarningsOverview
│       ├── ClaimButton
│       └── RewardHistory
└── CuratorDashboard (sticky sidebar)
    ├── MotionScore
    ├── VotingStreak
    ├── AccuracyMeter
    └── QuickStats
```

### React Query Hooks

```typescript
// hooks/curation/useVotingQueue.ts
useVotingQueue(userId) // Infinite scroll queue

// hooks/curation/useSubmitVote.ts
useSubmitVote() // Optimistic updates

// hooks/curation/useCuratorStats.ts
useCuratorStats(userId) // Performance metrics

// hooks/curation/useRewardBalance.ts
useRewardBalance() // Pending rewards

// hooks/curation/useVoteSubscription.ts
useVoteSubscription(projectId) // Real-time updates
```

### State Management

```typescript
// React Query cache keys
['voting-queue', userId]           // Paginated queue
['project-votes', projectId]       // Vote tallies
['curator-stats', userId]          // Performance
['reward-balance', userId]         // Earnings
['leaderboard', period]            // Rankings
```

---

## Implementation Roadmap

### Week 1-2: Foundation (Backend + Database)
**Goal:** Set up backend infrastructure

**Tasks:**
- [ ] Create Appwrite collections (8 new + extend 2)
- [ ] Implement voting service (`lib/appwrite/services/voting.ts`)
- [ ] Implement curation service (`lib/appwrite/services/curation.ts`)
- [ ] Implement rewards service (`lib/appwrite/services/rewards.ts`)
- [ ] Add validation schemas (`lib/validations/curation.ts`)
- [ ] Set up real-time subscriptions
- [ ] Write API endpoint tests

**Deliverables:**
- Working API endpoints
- Database schema deployed
- Test coverage >80%

### Week 3-4: Core Components (Frontend)
**Goal:** Build voting UI

**Tasks:**
- [ ] Create VotingCard component
- [ ] Create VoteButton component
- [ ] Create VoteProgress component (with WebSocket)
- [ ] Build CuratorDashboard sidebar
- [ ] Implement React Query hooks
- [ ] Add optimistic updates
- [ ] Build loading/error states

**Deliverables:**
- Functional voting interface
- Real-time vote updates
- Mobile-responsive design

### Week 5: Network Page Integration
**Goal:** Launch curation tabs on Network page

**Tasks:**
- [ ] Refactor `app/network/page.tsx` with tabs
- [ ] Create PendingReviewsTab
- [ ] Create LeaderboardTab
- [ ] Create RewardsTab
- [ ] Add tab navigation
- [ ] Implement infinite scroll
- [ ] Add share functionality

**Deliverables:**
- Full Network page redesign
- All tabs functional
- Viral share cards

### Week 6: Rewards + Anti-Gaming
**Goal:** Enable earnings and prevent abuse

**Tasks:**
- [ ] Fund initial reward pool (100 SOL)
- [ ] Implement claim functionality
- [ ] Add Solana transfer integration
- [ ] Deploy anomaly detection (background jobs)
- [ ] Set up retroactive accuracy audits
- [ ] Implement strike system
- [ ] Add dispute resolution flow

**Deliverables:**
- Working claim system
- Anti-gaming measures active
- First reward distribution

### Week 7+: Scale + Optimize
**Goal:** Polish and grow

**Tasks:**
- [ ] Performance optimizations (caching, indexing)
- [ ] A/B test voting UX (swipe vs buttons)
- [ ] Launch curator referral program
- [ ] Add mobile app (PWA)
- [ ] Integrate on-chain voting (future)
- [ ] DAO governance expansion

---

## Motion Score Backend Implementation

### New Motion Score Calculation

```typescript
async function calculateMotionScore(userId: string): Promise<number> {
  const user = await getUser(userId)
  const curator = await getCuratorStats(userId)

  let score = 0

  // Existing: On-chain activity (40 points)
  score += user.keysHeld * 2 // 2 points per key
  score += user.totalTrades * 0.5 // 0.5 per trade

  // Existing: Social engagement (20 points)
  score += user.referrals * 5 // 5 points per referral
  score += user.twitterShares * 1 // 1 point per share

  // NEW: Curation accuracy (30 points)
  if (curator.totalReviews >= 10) {
    score += (curator.overallAccuracy / 100) * 30
  }

  // NEW: Curator tier bonus (20 points)
  const tierBonuses = {
    degen: 0,
    veteran: 5,
    elite: 10,
    legendary: 20
  }
  score += tierBonuses[curator.tier] || 0

  // NEW: Voting streak (10 points)
  const streakBonus = Math.min(user.votingStreak, 10) // Max 10 days
  score += streakBonus

  // Cap at 100
  return Math.min(score, 100)
}
```

### Decay Mechanics

```typescript
async function applyMotionScoreDecay() {
  // Run daily cron job
  const users = await getAllUsers()

  for (const user of users) {
    const daysSinceLastActivity = getDaysSince(user.lastActiveAt)

    if (daysSinceLastActivity > 7) {
      // Lose 1 point per day of inactivity (max -30)
      const decay = Math.min(daysSinceLastActivity - 7, 30)

      await updateUser(user.id, {
        motionScore: Math.max(user.motionScore - decay, 0)
      })
    }

    // Reset voting streak if >48h gap
    if (daysSinceLastActivity > 2) {
      await updateUser(user.id, { votingStreak: 0 })
    }
  }
}
```

---

## Viral Features

### Auto-Tweet Sharing

```typescript
// After voting, auto-generate Twitter share card
const shareText = `Just voted on ${project.title} on @ICMMotion 🚀\n\n` +
  `My Motion Score: ${user.motionScore}\n` +
  `Voting Streak: ${user.votingStreak} days 🔥\n` +
  `Earnings this week: ${weeklyEarnings} SOL\n\n` +
  `Join the curator economy 👇`

// Generate OG image with stats
const shareImage = generateCuratorCard({
  username: user.name,
  tier: curator.tier,
  accuracy: curator.overallAccuracy,
  earnings: weeklyEarnings
})
```

### Leaderboard Competition

```typescript
// Live rankings update every 5 minutes
const leaderboard = {
  global: topCurators.slice(0, 100),
  weekly: weeklyTopEarners.slice(0, 20),
  category: {
    defi: topInCategory('defi'),
    gaming: topInCategory('gaming'),
    social: topInCategory('social')
  }
}

// Your rank display
const yourRank = {
  global: '#234 of 1,482',
  movement: '+12 this week',
  nextTier: 'Elite (45 votes away)',
  gapToTop10: '127 points'
}
```

### Early Voter Bonuses

```typescript
// First 10 voters get 1.1x multiplier
if (voteCount < 10) {
  rewardMultiplier *= 1.1
}

// Voters within first hour get featured badge
if (votedWithinMinutes < 60) {
  await addAchievement(userId, 'early_bird')
}
```

---

## Security & Compliance

### Rate Limiting
- **Voting:** 10 votes per hour
- **Reviews:** 5 reviews per hour
- **Claims:** 1 claim per day

### Validation
- All inputs validated with Zod schemas
- Wallet signatures verified
- SQL injection prevention (Appwrite handles)
- XSS protection (React auto-escapes)

### Audit Trail
- All votes logged with IP + timestamp
- Vote changes tracked
- Reward distributions immutable
- Dispute resolution history

---

## Success Metrics

### Week 1 Goals
- 50 curators onboarded
- 100 votes cast
- 10 projects approved
- 5 SOL distributed

### Month 1 Goals
- 200 active curators
- 1,000 votes cast
- 50 projects approved
- 50 SOL distributed
- 70% approval accuracy

### Quarter 1 Goals
- 1,000 curators
- 10,000 votes cast
- 200 projects approved
- 500 SOL distributed
- 75% approval accuracy
- Featured in Solana newsletter

---

## File Structure

```
widgets-for-launch/
├── app/
│   └── network/
│       ├── page.tsx (refactored)
│       └── tabs/
│           ├── PendingReviewsTab.tsx
│           ├── ApprovedTab.tsx
│           ├── MyVotesTab.tsx
│           ├── LeaderboardTab.tsx
│           └── RewardsTab.tsx
├── components/
│   └── curation/
│       ├── VotingCard.tsx
│       ├── VoteButton.tsx
│       ├── VoteProgress.tsx
│       ├── VotingResults.tsx
│       ├── CuratorDashboard.tsx
│       ├── CuratorBadge.tsx
│       ├── RewardClaimButton.tsx
│       └── ProjectSubmissionForm.tsx
├── hooks/
│   └── curation/
│       ├── useVotingQueue.ts
│       ├── useSubmitVote.ts
│       ├── useCuratorStats.ts
│       ├── useRewardBalance.ts
│       ├── useVoteSubscription.ts
│       └── useLeaderboard.ts
├── lib/
│   ├── appwrite/
│   │   └── services/
│   │       ├── voting.ts
│   │       ├── curation.ts
│   │       ├── rewards.ts
│   │       └── motion-score.ts
│   └── validations/
│       └── curation.ts
├── scripts/
│   ├── create-curation-collections.js
│   ├── seed-initial-pool.js
│   └── run-accuracy-audit.js
└── docs/
    ├── CURATION_SYSTEM_UX_DESIGN.md
    ├── CURATION_SYSTEM_BACKEND_ARCHITECTURE.md (this file)
    ├── CURATION_SYSTEM_FULLSTACK_INTEGRATION.md
    └── CURATION_SYSTEM_MASTER_PLAN.md (you are here)
```

---

## Next Steps

1. **Review & Approve** this master plan with team
2. **Week 1 Sprint:** Backend infrastructure setup
3. **User Testing:** Invite 10 beta curators for feedback
4. **Iterate:** A/B test voting UX (swipe vs tap)
5. **Launch:** Public release with 100 SOL pool

---

## Questions for Product Review

1. **Pool Size:** Start with 30 SOL/week or 100 SOL/week?
2. **Voting Period:** 48 hours or 7 days for project approval?
3. **Curator Onboarding:** Open to all or invite-only beta?
4. **Key Requirement:** 10 keys to vote or lower barrier?
5. **Tier Names:** Keep "Degen/Veteran/Elite/Legendary" or rebrand?

---

**Status:** Ready for Engineering Handoff
**Confidence Level:** 95%
**Risk Areas:** Reward pool sustainability, sybil attacks at scale
**Mitigation:** Start small (50 curators), monitor closely, adjust formulas

Let's ship this! 🚀
