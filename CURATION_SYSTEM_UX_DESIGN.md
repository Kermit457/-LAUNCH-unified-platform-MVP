# Community Curation & Voting System - UX Design Document

**Project:** ICM Motion - Solana Launch Platform
**Feature:** Network Page Curation Economy
**Version:** 1.0
**Date:** 2025-10-24
**Design Philosophy:** Twitter Viral Degen POV - Make it memeable, competitive, FOMO-driven

---

## Executive Summary

Transform the Network page from a static people directory into a high-velocity curation marketplace where degens farm alpha by vetting projects. Think "TikTok for dealflow" meets "DAO voting" but stripped down to pure dopamine hits.

**Core Loop:** Submit → Vote → Earn → Flex → Repeat

---

## 1. Core UX Principles

### 1.1 Viral Degen Mindset
- **Instant Gratification**: Vote counts update live, rewards visible immediately
- **Competition**: Leaderboards front-and-center, streaks gamified
- **FOMO Mechanics**: Limited voting windows, early-voter bonuses
- **Status Flex**: Curator badges, tier icons, verified checkmarks
- **Low Friction**: Swipe/tap voting (mobile-first), no essays

### 1.2 Trust Without Bureaucracy
- **Skin in the Game**: Must hold keys to vote (sybil resistance via on-chain holdings)
- **Reputation at Stake**: Bad votes hurt your Motion Score
- **Transparency**: All votes public, full vote history visible
- **Social Proof**: See what top curators voted

---

## 2. User Flows

### 2.1 Project Submission Flow

```
Entry Points:
- "Submit Project" button (Network page header)
- "Post Dealflow" button (Dealflow section)
- Deep link from project launch flow

Flow:
1. Click "Submit for Curation" button
   └─> Requires: Wallet connected + 10+ keys owned (activation threshold)

2. Submission Modal Opens
   ┌─────────────────────────────────────┐
   │ Submit Project for Community Review │
   ├─────────────────────────────────────┤
   │ Project Name: [____________]        │
   │ Twitter/X: [@___________]           │
   │ Category: [DeFi ▼]                  │
   │ One-liner: [_________________]      │
   │ Why now?: [_________________]       │
   │                                     │
   │ Stake Submission Fee: 0.1 SOL       │
   │ (Refunded if approved 70%+)         │
   │                                     │
   │ [Cancel]  [Submit for Review 🚀]   │
   └─────────────────────────────────────┘

3. Confirmation Toast
   "Your project is live! Voting ends in 48h"
   → Auto-navigate to project's voting page

4. Project enters "Pending Queue"
   - Visible in "Hot Takes" tab
   - 48-hour voting window starts
   - Submitter gets real-time vote updates
```

**Anti-Spam Mechanics:**
- 0.1 SOL submission fee (refunded if project gets 70%+ approval)
- Max 1 submission per user per 24h
- Must have Motion Score > 20 to submit
- Repeat rejections (3+) = 7-day cooldown

---

### 2.2 Curator Voting Flow

```
Entry Points:
- "Hot Takes" tab (projects pending review)
- Notification: "3 new projects to review"
- Direct link from Twitter share

Flow:
1. Curator opens "Hot Takes" tab

2. Swipeable Project Cards (Tinder-style)
   ┌─────────────────────────────────────┐
   │ 🔥 DeFi Aggregator on Solana        │
   │ @degen_protocol                     │
   ├─────────────────────────────────────┤
   │ "Cross-chain yield farming with     │
   │  AI-powered strategies"             │
   │                                     │
   │ Why Now: "Solana DeFi TVL at ATH"   │
   │                                     │
   │ Category: DeFi                      │
   │ Voting Ends: 22h 14m                │
   │                                     │
   │ Current Vote: 67% Approve (23 votes)│
   │ Top Curators: 12/15 approved        │
   ├─────────────────────────────────────┤
   │ [👎 Pass]    [📊 Details]  [👍 Gem] │
   └─────────────────────────────────────┘

3. Tap Vote Button
   - Instant visual feedback (card flies left/right)
   - Confetti if you match top curators
   - Toast: "+5 XP • Streak: 3 days"

4. Vote Recorded
   - On-chain vote logged (lightweight PDA)
   - Motion Score updated based on outcome
   - Leaderboard position recalculated
```

**Vote Types:**
- **Gem** (👍): Project is vetted, should be featured
- **Pass** (👎): Not ready / low quality
- **Report** (🚩): Spam / scam (triggers immediate review)

**Voting Power:**
- Base: 1 vote = 1 vote (egalitarian)
- Multipliers:
  - Motion Score 80-100: 1.5x weight
  - Top 10 Curator: 2x weight
  - 30-day streak: 1.25x weight
  - Early voter bonus: 1.1x (first 10 votes)

---

### 2.3 Earn & Reward Flow

```
Reward Distribution:
┌─────────────────────────────────────┐
│ Your Curation Earnings              │
├─────────────────────────────────────┤
│ Pending Rewards:     0.234 SOL      │
│ This Week:          +0.089 SOL      │
│ All-Time:            2.456 SOL      │
│                                     │
│ Breakdown:                          │
│ ├─ Good Votes:      +0.145 SOL      │
│ ├─ Streak Bonus:    +0.034 SOL      │
│ ├─ Early Votes:     +0.055 SOL      │
│ └─ Bad Votes:       -0.012 SOL      │
│                                     │
│ Pool Share: 3.2% of weekly pool     │
│ (You're #12 of 234 curators)        │
│                                     │
│ [Claim Rewards 💰]                  │
└─────────────────────────────────────┘

Reward Calculation:
1. Weekly Reward Pool = Platform fees (1% of all trades)
2. Your Share = (Your Score / Total Scores) × Pool
3. Your Score = Good Votes × Multipliers - Bad Votes

Good Vote = Your vote matched final outcome (70%+ threshold)
Bad Vote = Your vote was wrong + project was flagged as spam
```

**Pool Funding Sources:**
1. **Platform Fees**: 1% of bonding curve trades → curator pool
2. **Submission Fees**: Rejected project fees → curator rewards
3. **Treasury Allocation**: 10% of treasury yield → curator pool
4. **Referral Kickbacks**: 0.5% of referred curator earnings

**Claim Mechanics:**
- Auto-claim every Friday (gas-optimized batch)
- Manual claim anytime (pays own gas)
- Minimum claim: 0.01 SOL (anti-dust)

---

## 3. Curator Progression System

### 3.1 Curator Tiers

```
Tier 0: Lurker
├─ Requirements: None
├─ Privileges: View projects, no voting
└─ Path: Buy 10 keys → Tier 1

Tier 1: Degen Curator ⚡
├─ Requirements: 10+ keys owned
├─ Privileges: Vote, earn base rewards
├─ Vote Weight: 1x
└─ Path: 50 good votes + 60% accuracy → Tier 2

Tier 2: Veteran Curator 💎
├─ Requirements: 50+ good votes, 60%+ accuracy
├─ Privileges: Tier 1 + early access to submissions
├─ Vote Weight: 1.5x
├─ Bonus: +25% rewards
└─ Path: 200 good votes + 70% accuracy + Motion Score 80+ → Tier 3

Tier 3: Elite Curator 👑
├─ Requirements: 200+ good votes, 70%+ accuracy, Motion Score 80+
├─ Privileges: Tier 2 + featured on leaderboard
├─ Vote Weight: 2x
├─ Bonus: +50% rewards, exclusive deals access
└─ Path: Top 10 all-time + 75% accuracy → Tier 4

Tier 4: Legendary Curator 🏆
├─ Requirements: Top 10 all-time, 75%+ accuracy
├─ Privileges: All + veto power on reported projects
├─ Vote Weight: 2.5x
├─ Bonus: +100% rewards, DAO governance rights
└─ Flex: Custom badge, profile highlight
```

### 3.2 Visual Indicators

**Badge System:**
- Tier badge (top-right of profile card)
- Animated glow effect for Elite/Legendary
- Hover tooltip: "Elite Curator • 234 good votes • 72% accuracy"

**Profile Enhancements:**
- Curator stats on hover
- Vote history timeline
- Accuracy chart
- Earnings dashboard

---

## 4. Network Page Redesign

### 4.1 Tab Structure

```
┌─────────────────────────────────────────────────────────┐
│ Network                                     [+ Submit]  │
├─────────────────────────────────────────────────────────┤
│ [🔥 Hot Takes] [✅ Vetted] [📊 Leaderboard] [👤 Active] │
└─────────────────────────────────────────────────────────┘

Tab 1: Hot Takes (Pending Curation)
├─ Swipeable project cards (Tinder UI)
├─ Sort: Trending / Newest / Ending Soon
├─ Filter: Category / Vote count
└─ Quick vote buttons (Gem / Pass / Report)

Tab 2: Vetted Projects (Approved 70%+)
├─ Grid view (like current PeopleGrid)
├─ Sort: Trending / Newest / Most Holders
├─ Filter: Category / Curator tier
└─ Trust signals: Vote count, top curator approval

Tab 3: Leaderboard
├─ Top Curators (weekly + all-time)
├─ Sort: Earnings / Accuracy / Streak
├─ Your Rank (highlighted)
└─ Prize pool countdown

Tab 4: Active Users (existing)
├─ Keep current PeopleGrid
├─ Add curator tier badges
└─ Filter: Curator tier
```

### 4.2 Hot Takes Tab - Detailed Wireframe

```
┌───────────────────────────────────────────────────────────────┐
│ 🔥 Hot Takes                        [Trending ▼] [All ▼]     │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌─────────────────────────────────────────────────────┐    │
│   │ 🚀 AI-Powered MEV Bot on Solana                     │    │
│   │ @mev_degen_ai                                       │    │
│   ├─────────────────────────────────────────────────────┤    │
│   │                                                     │    │
│   │ "Front-running protection with AI detection"       │    │
│   │                                                     │    │
│   │ Why Now: "MEV volume 10x in Q4"                    │    │
│   │                                                     │    │
│   │ Category: DeFi Tools                                │    │
│   │                                                     │    │
│   │ ⏰ 18h 23m left • 0.1 SOL staked                   │    │
│   │                                                     │    │
│   │ ┌─────────────────────────────────────────────┐    │    │
│   │ │ 👍 67% Gem (34 votes)                        │    │    │
│   │ │ ████████████░░░░░░░░                         │    │    │
│   │ │                                              │    │    │
│   │ │ Top Curators: ✅ ✅ ✅ ⏳ ✅ (4/5 approved)    │    │    │
│   │ └─────────────────────────────────────────────┘    │    │
│   │                                                     │    │
│   │ [👎 Pass]   [📊 Full Details]   [👍 It's a Gem]   │    │
│   │                                                     │    │
│   └─────────────────────────────────────────────────────┘    │
│                                                               │
│   ← Swipe for next project (12 pending)                      │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Interaction:**
- Swipe left = Pass
- Swipe right = Gem
- Tap card = Full details modal
- Tap votes = See who voted what

### 4.3 Vetted Projects Tab

```
┌───────────────────────────────────────────────────────────────┐
│ ✅ Vetted Projects                     [Trending ▼] [All ▼]  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ [Image]  │  │ [Image]  │  │ [Image]  │  │ [Image]  │     │
│  │          │  │          │  │          │  │          │     │
│  │ DeFi Pro │  │ NFT Hub  │  │ Meme DAO │  │ AI Trade │     │
│  │ @defi_p  │  │ @nft_hub │  │ @meme_d  │  │ @ai_trad │     │
│  │          │  │          │  │          │  │          │     │
│  │ ✅ 89%   │  │ ✅ 78%   │  │ ✅ 72%   │  │ ✅ 94%   │     │
│  │ 124 👥   │  │ 89 👥    │  │ 234 👥   │  │ 45 👥    │     │
│  │ 👑x3     │  │ 💎x5     │  │ 💎x2     │  │ 👑x4     │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                               │
│  Grid continues...                                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘

Trust Signals:
├─ ✅ Approval % (size = confidence)
├─ 👥 Vote count
├─ 👑 Elite curator count
├─ 💎 Veteran curator count
└─ Hover: Full vote breakdown
```

### 4.4 Leaderboard Tab

```
┌───────────────────────────────────────────────────────────────┐
│ 📊 Curator Leaderboard               [Weekly ▼] [Earnings ▼] │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Weekly Prize Pool: 12.34 SOL                                │
│  Ends in: 3d 14h 23m                                         │
│                                                               │
│  ┌───┬──────────────────────┬────────┬─────────┬───────┐     │
│  │ # │ Curator              │ Votes  │ Accuracy│ Earned│     │
│  ├───┼──────────────────────┼────────┼─────────┼───────┤     │
│  │ 1 │ 👑 @alpha_hunter     │ 234    │ 89%     │ 2.34  │     │
│  │ 2 │ 👑 @degen_vc         │ 198    │ 87%     │ 1.89  │     │
│  │ 3 │ 💎 @gem_finder       │ 176    │ 84%     │ 1.56  │     │
│  │...│ ...                  │ ...    │ ...     │ ...   │     │
│  │ 12│ 💎 You (@yourhandle) │ 89     │ 72%     │ 0.89  │ ← YOU
│  │...│ ...                  │ ...    │ ...     │ ...   │     │
│  └───┴──────────────────────┴────────┴─────────┴───────┘     │
│                                                               │
│  Your Stats:                                                 │
│  ┌────────────────────────────────────────────────────┐      │
│  │ Rank: #12 of 234 (Top 5%)                         │      │
│  │ Streak: 8 days 🔥                                  │      │
│  │ Total Earned: 12.45 SOL                           │      │
│  │ Accuracy: 72% (▲ 3% this week)                    │      │
│  │                                                    │      │
│  │ [View Full Stats]  [Share Results 📤]             │      │
│  └────────────────────────────────────────────────────┘      │
│                                                               │
└───────────────────────────────────────────────────────────────┘

Gamification:
├─ Animated rank changes (up/down arrows)
├─ Streak fire emoji (gets bigger each day)
├─ Prize pool countdown (creates urgency)
└─ Share button (Twitter auto-tweet)
```

---

## 5. Voting Mechanics Specification

### 5.1 Vote Weight Formula

```typescript
interface VoteWeight {
  baseVote: 1 // Everyone starts equal
  motionScoreMultiplier: number // 1.0 - 1.5x
  tierMultiplier: number // 1.0 - 2.5x
  streakBonus: number // 1.0 - 1.25x
  earlyVoterBonus: number // 1.0 - 1.1x
}

function calculateVoteWeight(curator: Curator): number {
  const base = 1
  const motionBonus = curator.motionScore >= 80 ? 1.5 : 1.0
  const tierBonus = getTierMultiplier(curator.tier) // 1x, 1.5x, 2x, 2.5x
  const streakBonus = curator.streakDays >= 30 ? 1.25 : 1.0
  const earlyBonus = curator.votePosition <= 10 ? 1.1 : 1.0

  return base * motionBonus * tierBonus * streakBonus * earlyBonus
}

// Example:
// Elite curator (2x) + Motion Score 85 (1.5x) + 35-day streak (1.25x) + Early vote (1.1x)
// = 1 × 1.5 × 2 × 1.25 × 1.1 = 4.125x vote weight
```

### 5.2 Outcome Determination

```typescript
interface VotingOutcome {
  totalGemVotes: number // Weighted sum
  totalPassVotes: number // Weighted sum
  totalReportVotes: number // Weighted sum (auto-triggers at 3+ reports)
  approvalPercentage: number // gemVotes / (gemVotes + passVotes)
  status: 'approved' | 'rejected' | 'reported'
}

function determineOutcome(votes: Vote[]): VotingOutcome {
  const weighted = votes.map(v => ({
    ...v,
    weight: calculateVoteWeight(v.curator)
  }))

  const gemTotal = weighted.filter(v => v.vote === 'gem').reduce((sum, v) => sum + v.weight, 0)
  const passTotal = weighted.filter(v => v.vote === 'pass').reduce((sum, v) => sum + v.weight, 0)
  const reportTotal = weighted.filter(v => v.vote === 'report').length // Unweighted

  // Auto-reject if 3+ reports (spam detection)
  if (reportTotal >= 3) {
    return { status: 'reported', approvalPercentage: 0, ... }
  }

  const approvalPct = gemTotal / (gemTotal + passTotal)

  return {
    totalGemVotes: gemTotal,
    totalPassVotes: passTotal,
    totalReportVotes: reportTotal,
    approvalPercentage: approvalPct,
    status: approvalPct >= 0.70 ? 'approved' : 'rejected'
  }
}
```

### 5.3 Curator Score Update

```typescript
interface CuratorScoreUpdate {
  voteAccuracy: number // Updated after outcome determined
  motionScoreDelta: number // +5 for good vote, -10 for bad vote
  rewardDelta: number // SOL earned/lost
}

function updateCuratorScore(curator: Curator, vote: Vote, outcome: VotingOutcome) {
  const wasCorrect = (
    (vote.vote === 'gem' && outcome.status === 'approved') ||
    (vote.vote === 'pass' && outcome.status === 'rejected') ||
    (vote.vote === 'report' && outcome.status === 'reported')
  )

  if (wasCorrect) {
    curator.goodVotes++
    curator.motionScore += 5
    curator.pendingRewards += calculateReward(vote.weight)
    curator.currentStreak++
  } else {
    curator.badVotes++
    curator.motionScore -= 10
    curator.currentStreak = 0 // Reset streak

    // Extra penalty for false reports (crying wolf)
    if (vote.vote === 'report' && outcome.status !== 'reported') {
      curator.motionScore -= 20
      curator.reportAbusePenalty = true // Temp ban from reporting
    }
  }

  // Update accuracy
  curator.accuracy = curator.goodVotes / (curator.goodVotes + curator.badVotes)

  // Check tier progression
  checkTierUpgrade(curator)
}
```

---

## 6. Anti-Gaming UX Measures

### 6.1 Sybil Resistance

**On-Chain Requirements:**
- Must hold 10+ keys to vote (real SOL commitment)
- Keys must be held for 24h+ before vote counts (prevents flash voting)
- Wallet age > 7 days (prevents new wallet spam)

**UX Indicators:**
```
┌─────────────────────────────────────┐
│ ⚠️ Vote Not Eligible                │
├─────────────────────────────────────┤
│ You need 10 keys to vote.           │
│ Current: 3 keys                     │
│                                     │
│ Why? Prevents spam and ensures      │
│ curators have skin in the game.     │
│                                     │
│ [Buy Keys to Unlock Voting]         │
└─────────────────────────────────────┘
```

### 6.2 Vote Manipulation Detection

**Pattern Detection:**
- Same curator + same submitter repeatedly → Flag
- Voting only on friends' projects → Accuracy penalty
- Always voting with crowd → "Sheep" badge (reduce multiplier)
- Random voting → Accuracy drops → Tier demotion

**UX Feedback:**
```
Toast: "⚠️ Low conviction detected"
"Your votes match the crowd 95% of the time.
Vote independently to earn trust bonuses."
```

### 6.3 Spam Project Detection

**Auto-Flags:**
- Same submitter > 3 projects/week
- 3+ report votes within 1h
- Submission text contains spam keywords
- Twitter account < 30 days old

**UX Flow:**
```
Project submitted → Auto-scan → Flagged
  ↓
Shown to Elite+ curators only (manual review)
  ↓
If 2+ Elite curators vote "Report" → Auto-reject
  ↓
Submitter banned for 30 days
Submission fee burned (not refunded)
```

### 6.4 Reward Farming Prevention

**Rate Limits:**
- Max 50 votes/day per curator
- Cooldown: 2min between votes (prevents bot spam)
- Reward claims max 1x/day

**UX:**
```
┌─────────────────────────────────────┐
│ 🚨 Slow down, degen!                │
├─────────────────────────────────────┤
│ You've hit the daily vote limit:    │
│ 50/50 votes used                    │
│                                     │
│ Resets in: 8h 23m                   │
│                                     │
│ Quality > Quantity                  │
│ Focus on accuracy to climb ranks.   │
└─────────────────────────────────────┘
```

---

## 7. Motion Score Integration

### 7.1 Existing Motion Score Component

The Motion Score (0-100) already exists in the codebase as a display component. This curation system will provide **real backend logic** to calculate and update it.

**New Score Factors:**
```typescript
interface MotionScoreFactors {
  baseScore: 50 // Everyone starts here

  // Existing factors (to be implemented):
  curveActivation: number // +10 for activated curve
  keyHoldings: number // +1 per 10 keys held (max +20)
  socialActivity: number // +5 for verified Twitter

  // NEW Curation factors:
  curationAccuracy: number // +30 max (70%+ accuracy)
  curationVolume: number // +10 max (100+ good votes)
  curatorTier: number // +5 per tier (max +20)
  votingStreak: number // +10 max (30+ day streak)

  // Penalties:
  spamReports: number // -20 per false report
  inactivity: number // -5 if no votes in 7 days
}

function calculateMotionScore(user: User): number {
  const factors = getScoreFactors(user)

  const score =
    factors.baseScore +
    factors.curveActivation +
    factors.keyHoldings +
    factors.socialActivity +
    factors.curationAccuracy +
    factors.curationVolume +
    factors.curatorTier +
    factors.votingStreak -
    factors.spamReports -
    factors.inactivity

  return Math.max(0, Math.min(100, score)) // Clamp 0-100
}
```

### 7.2 Score Display Updates

**Profile Card Enhancement:**
```
┌─────────────────────────────────────┐
│  [Avatar]  @username                │
│                                     │
│  Motion Score: 87 💎                │
│  ██████████████████░░ 87/100        │
│                                     │
│  Breakdown:                         │
│  ├─ Curation Accuracy: +28          │
│  ├─ Curator Tier: +15 (Elite)       │
│  ├─ Voting Streak: +8               │
│  ├─ Key Holdings: +12               │
│  └─ Activity: +6                    │
└─────────────────────────────────────┘
```

**Hover Tooltip:**
```
Motion Score 87 💎
━━━━━━━━━━━━━━━━━━
Elite Curator
234 good votes • 72% accuracy
8-day streak 🔥
```

---

## 8. Notification System Integration

### 8.1 New Notification Types

Extend the existing toast + dropdown notification system:

**Curation Notifications:**
```typescript
type CurationNotification =
  | { type: 'project_pending', projectId: string, endsIn: number }
  | { type: 'vote_matched_elite', projectId: string, eliteCurator: string }
  | { type: 'project_approved', projectId: string, approval: number }
  | { type: 'project_rejected', projectId: string }
  | { type: 'reward_earned', amount: number, reason: string }
  | { type: 'tier_upgraded', newTier: CuratorTier }
  | { type: 'streak_milestone', days: number }
  | { type: 'leaderboard_rank_change', oldRank: number, newRank: number }
```

**Examples:**
```
Toast: "🎉 You matched 3 Elite curators!"
Dropdown: "Your vote on @degen_protocol matched @alpha_hunter, @gem_finder, @degen_vc"

Toast: "⏰ 12 new projects to review"
Dropdown: "3 DeFi • 5 NFT • 4 Meme - Vote before 6PM to earn early bonus"

Toast: "💰 +0.089 SOL earned this week"
Dropdown: "12 good votes • 2 early bonuses • Rank #14 → #12"

Toast: "🔥 10-day streak! You're on fire!"
Dropdown: "Keep it going! 20 days = 1.25x multiplier"
```

### 8.2 Real-Time Updates

**WebSocket Events:**
```typescript
// When a project you voted on gets a new vote
socket.on('project_vote_update', (data) => {
  updateProjectCard(data.projectId, data.newApproval)
  if (data.newApproval >= 70) {
    toast.success('Your pick is looking good! 👍')
  }
})

// When voting period ends
socket.on('project_outcome', (data) => {
  if (data.myVoteCorrect) {
    toast.success(`+${data.reward} SOL • Good call!`)
    confetti()
  } else {
    toast.error(`Wrong call. -10 Motion Score`)
  }
})

// When rank changes
socket.on('leaderboard_update', (data) => {
  if (data.rankImproved) {
    toast.success(`You're now #${data.newRank}! 📈`)
  }
})
```

---

## 9. Technical Implementation Notes

### 9.1 Database Schema (Appwrite)

**New Collections:**

```typescript
// Curation Submissions
collection CurationSubmissions {
  submissionId: string (unique)
  projectId: string (FK to projects)
  userId: string (submitter)
  title: string
  description: string
  category: string
  twitterHandle: string
  submissionFee: number (SOL)
  status: 'pending' | 'approved' | 'rejected' | 'reported'
  votingEndsAt: timestamp
  createdAt: timestamp
}

// Curation Votes
collection CurationVotes {
  voteId: string (unique)
  submissionId: string (FK)
  curatorId: string (FK to users)
  vote: 'gem' | 'pass' | 'report'
  voteWeight: number (calculated at vote time)
  votedAt: timestamp
  outcomeCorrect: boolean (set after voting ends)
}

// Curator Stats
collection CuratorStats {
  userId: string (PK)
  tier: number (0-4)
  totalVotes: number
  goodVotes: number
  badVotes: number
  accuracy: number (percentage)
  currentStreak: number
  longestStreak: number
  totalEarned: number (SOL)
  pendingRewards: number (SOL)
  motionScore: number (0-100)
  lastVoteAt: timestamp
  reportAbusePenalty: boolean
}

// Reward Distributions
collection RewardDistributions {
  distributionId: string (unique)
  weekStarting: timestamp
  totalPool: number (SOL)
  totalCurators: number
  distributions: json // { userId: amount }
  status: 'pending' | 'distributed'
}
```

### 9.2 On-Chain Program (Solana)

**New Instructions:**

```rust
// Lightweight vote recording (PDA per submission)
pub struct CurationVote {
    pub submission_id: [u8; 32],
    pub curator: Pubkey,
    pub vote: VoteType, // 0=pass, 1=gem, 2=report
    pub weight: u16, // Scaled by 100 (e.g., 425 = 4.25x)
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum VoteType {
    Pass,
    Gem,
    Report,
}

// Instructions
pub fn submit_project(
    ctx: Context<SubmitProject>,
    submission_id: [u8; 32],
    category: u8,
) -> Result<()> {
    // Verify submission fee paid
    // Create submission PDA
    // Emit event for off-chain indexing
}

pub fn cast_vote(
    ctx: Context<CastVote>,
    submission_id: [u8; 32],
    vote: VoteType,
) -> Result<()> {
    // Verify curator has 10+ keys
    // Verify voting period active
    // Record vote in PDA
    // Emit event
}

pub fn distribute_rewards(
    ctx: Context<DistributeRewards>,
    week_id: u64,
) -> Result<()> {
    // Admin-only
    // Batch transfer from pool to curators
}
```

**Why On-Chain?**
- Vote immutability (can't change vote after submission)
- Transparent vote history
- Sybil resistance (key ownership verified on-chain)
- Reward distribution trustless

**Why Off-Chain (Appwrite)?**
- Fast UI updates (no RPC lag)
- Complex queries (leaderboards, filtering)
- Notification triggers
- Historical analytics

---

## 10. Mobile-First Design

### 10.1 Swipe Voting (Primary UX)

**Gesture Controls:**
```
← Swipe Left = Pass (👎)
→ Swipe Right = Gem (👍)
↑ Swipe Up = Report (🚩)
Tap = View Details
```

**Visual Feedback:**
- Card tilts in swipe direction
- Background color changes (red/green)
- Haptic feedback on mobile
- Confetti on "Gem" swipe

**Example (React Native / Framer Motion):**
```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, info) => {
    if (info.offset.x > 100) handleVote('gem')
    if (info.offset.x < -100) handleVote('pass')
  }}
  whileDrag={{
    rotate: info.offset.x * 0.1,
    scale: 1.05
  }}
>
  <ProjectCard {...project} />
</motion.div>
```

### 10.2 Compact Stats Display

**Mobile Header:**
```
┌─────────────────────────────────────┐
│ 🔥 Hot Takes        [Filter ▼] [≡] │
├─────────────────────────────────────┤
│ You: #12 • 8🔥 • 0.89 SOL          │
└─────────────────────────────────────┘
```

**Tap to Expand:**
```
┌─────────────────────────────────────┐
│ Your Curator Stats                  │
├─────────────────────────────────────┤
│ Rank: #12 of 234                    │
│ Streak: 8 days 🔥                   │
│ Pending: 0.089 SOL                  │
│ Accuracy: 72%                       │
│ [View Full Stats]                   │
└─────────────────────────────────────┘
```

---

## 11. Viral & Social Features

### 11.1 Twitter Integration

**Auto-Generated Tweets:**
```
User clicks "Share Results"
  ↓
Opens Twitter with pre-filled text:

"Just earned 0.234 SOL curating gems on @ICM_Motion 💎

Rank: #12
Accuracy: 72%
Streak: 8 days 🔥

Think you can beat me? 👇
[link to leaderboard]"
```

**Project Share:**
```
User taps "Share" on project card
  ↓
Twitter pre-fill:

"Found a gem 💎

@project_handle is building [category]

Voting ends in 18h - what do you think?

Vote now: [link]
#SolanaDeFi #CurationDAO"
```

### 11.2 Referral Mechanics

**Curator Referral Bonus:**
- Invite someone → They become curator → You earn 10% of their rewards (forever)
- Display: "Your referrals earned you +0.045 SOL this week"

**Leaderboard:**
```
┌─────────────────────────────────────┐
│ Top Referrers                       │
├─────────────────────────────────────┤
│ 1. @alpha_hunter    89 referrals    │
│ 2. @degen_vc        67 referrals    │
│ 3. You              12 referrals    │
└─────────────────────────────────────┘
```

### 11.3 FOMO Triggers

**Countdown Timers:**
```
"⏰ Voting ends in 2h 34m"
"🚨 Last chance to vote on 5 projects!"
"💰 Weekly rewards in 8h 14m"
```

**Live Activity Feed:**
```
┌─────────────────────────────────────┐
│ Recent Activity                     │
├─────────────────────────────────────┤
│ 👑 @alpha_hunter voted Gem • 2m ago │
│ 💎 @gem_finder voted Pass • 5m ago  │
│ ⚡ You earned +0.012 SOL • 8m ago   │
│ 🔥 @degen_vc hit 30-day streak!     │
└─────────────────────────────────────┘
```

**Scarcity:**
```
"🔥 Only 3 Elite curator slots left this month"
"⚡ Early voter bonus expires in 4 votes"
```

---

## 12. Accessibility & Inclusivity

### 12.1 Language Support

**Initial:** English only
**Roadmap:** Spanish, Mandarin, Portuguese (high crypto adoption)

**UI Pattern:**
```typescript
const translations = {
  en: { vote_gem: "It's a Gem", vote_pass: "Pass" },
  es: { vote_gem: "Es una Joya", vote_pass: "Pasar" },
  zh: { vote_gem: "宝石", vote_pass: "跳过" }
}
```

### 12.2 Screen Reader Support

**ARIA Labels:**
```tsx
<button aria-label="Vote gem on DeFi Aggregator project. Current approval: 67%">
  👍 Gem
</button>

<div role="progressbar" aria-valuenow={67} aria-valuemin={0} aria-valuemax={100}>
  67% Approval
</div>
```

### 12.3 Color Contrast

**WCAG AAA Compliance:**
- Primary (#D1FD0A lime) on dark: 12.1:1 ratio ✅
- Error red (#FF3B3B): 4.8:1 ratio ✅
- Success green (#00FF88): 5.2:1 ratio ✅

**Colorblind Mode:**
- Add shapes to colors (Gem = ✓, Pass = ✗)
- Pattern fills in charts

---

## 13. Success Metrics (KPIs)

### 13.1 Platform Health

```
Key Metrics:
├─ Daily Active Curators (DAC)
│  Target: 100+ within 30 days
│
├─ Curation Accuracy (platform-wide)
│  Target: 65%+ (better than random)
│
├─ Projects Submitted
│  Target: 20+/week
│
├─ Voting Participation
│  Target: 80%+ of curators vote weekly
│
└─ Reward Pool Growth
   Target: 10%+ week-over-week
```

### 13.2 User Engagement

```
Per-User Metrics:
├─ Avg votes/user/day: 8+
├─ Streak retention: 40%+ at 7 days
├─ Tier progression: 20% reach Veteran in 30 days
└─ Referrals/curator: 2+ in first month
```

### 13.3 Revenue Impact

```
Financial Metrics:
├─ Curation fee revenue: Track submission fees
├─ Trading volume increase: Vetted projects should drive 20%+ more volume
├─ Retention: Curators retain 30%+ longer than non-curators
└─ Referral multiplier: Curator referrals = 2x value
```

---

## 14. Rollout Plan

### Phase 1: MVP (Week 1-2)
```
✓ Hot Takes tab (submit + vote)
✓ Basic voting (equal weight, no multipliers)
✓ Tier 0 & 1 only
✓ Manual reward distribution (admin)
✓ Simple leaderboard
```

### Phase 2: Gamification (Week 3-4)
```
✓ Tier 2-4 + progression
✓ Vote weight multipliers
✓ Streak tracking
✓ Auto-tweet sharing
✓ Referral tracking
```

### Phase 3: Automation (Week 5-6)
```
✓ Auto reward distribution (on-chain)
✓ Real-time notifications
✓ Anti-gaming detection
✓ Advanced analytics dashboard
```

### Phase 4: Scale (Week 7+)
```
✓ Mobile app (React Native)
✓ API for third-party integrations
✓ DAO governance (top curators vote on platform changes)
✓ Cross-chain expansion (Ethereum, Base)
```

---

## 15. Edge Cases & Failure Modes

### 15.1 Low Participation
**Problem:** Not enough curators voting
**Solution:**
- Notification push: "5 projects need votes!"
- Bonus rewards for first 20 voters
- Display opportunity cost: "You missed 0.12 SOL last week"

### 15.2 Vote Brigading
**Problem:** Coordinated voting to game system
**Solution:**
- Pattern detection (same curator + submitter)
- Reduce multiplier for "always voting together"
- Manual review by Elite curators

### 15.3 Spam Submissions
**Problem:** Low-quality projects flooding queue
**Solution:**
- 0.1 SOL submission fee (burned if rejected)
- 3-rejection cooldown (7 days)
- Auto-flag keywords (rug, Ponzi, etc.)

### 15.4 Curator Burnout
**Problem:** Fatigue from voting 50 projects/day
**Solution:**
- Optional digest mode (vote on 5/day, still earn)
- Rest days don't break streak (1 skip/week)
- Focus on quality: "Vote on 10, earn more than voting on 50 bad votes"

### 15.5 Whale Domination
**Problem:** One curator owns 10,000 keys, controls all votes
**Solution:**
- Cap vote weight at 5x (even with 10k keys)
- Tiered pools (separate rewards for Tier 1 vs Elite)
- Accuracy matters more than holdings

---

## 16. Questions Answered

### Q1: What makes a "good curator" vs spam voter?

**Good Curator:**
- Accuracy > 65%
- Votes independently (not always with crowd)
- Consistent activity (7+ votes/week)
- Low report abuse (false flags)
- Long-term holder (keys held > 30 days)

**Spam Voter:**
- Accuracy < 50% (worse than random)
- Votes only on trending projects
- Irregular activity (bursts then absent)
- Submits own projects repeatedly
- New wallet with instant key purchase

**UX Indicator:**
```
Good Curator Badge: ✅ "Trusted Curator"
Spam Warning: ⚠️ "Low Conviction"
```

---

### Q2: How do we prevent sybil attacks in voting?

**Multi-Layer Defense:**

1. **Economic Barrier:** 10 keys × 0.05 SOL = 0.5 SOL minimum
   Cost to create 100 fake accounts: 50 SOL

2. **Time Lock:** Keys must be held 24h before vote counts
   Prevents flash voting

3. **Wallet Age:** Wallet must be > 7 days old
   Prevents fresh wallet spam

4. **Pattern Detection:**
   - Same IP voting multiple times → Flag
   - Same submitter + voter pattern → Reduce weight
   - Always voting together → "Collusion detected"

5. **Accuracy Penalty:**
   Fake accounts will have low accuracy → Low earnings → Not worth effort

**Cost-Benefit Analysis:**
```
Attacker Cost: 50 SOL (100 accounts × 0.5 SOL)
Expected Earnings: ~0.5 SOL/week (split 100 ways, low accuracy)
ROI: -99% (not profitable)
```

---

### Q3: Should voting power be equal or weighted?

**Answer: Weighted, but with caps**

**Rationale:**
- Equal voting = sybil attacks easy
- Pure wealth voting = whales dominate
- Hybrid = best of both worlds

**Weight Factors (in order of importance):**
1. **Accuracy (30%)**: Proven track record
2. **Tier (25%)**: Progression system
3. **Streak (20%)**: Consistent engagement
4. **Motion Score (15%)**: Overall reputation
5. **Early Voter (10%)**: Reward conviction

**Example:**
```
Curator A: 10 keys, 85% accuracy, Elite tier
Vote Weight: 4.2x

Curator B: 1000 keys, 45% accuracy, Tier 1
Vote Weight: 1.8x (capped)

Result: Quality beats quantity
```

---

### Q4: How are reward pools funded?

**Revenue Sources:**

1. **Platform Trading Fees (Primary)**
   - 1% of all bonding curve trades → curator pool
   - Estimated: 10k SOL/month volume × 1% = 100 SOL/month

2. **Submission Fees (Secondary)**
   - 0.1 SOL per submission
   - Rejected projects: fee burned (50%) + curator pool (50%)
   - Estimated: 50 submissions/week × 0.05 SOL = 2.5 SOL/week

3. **Treasury Allocation (Growth Fund)**
   - 10% of platform treasury yield
   - Estimated: 5 SOL/week

4. **Referral Kickbacks**
   - 0.5% of referred curator earnings
   - Self-sustaining growth

**Total Pool Estimate:**
```
Week 1: ~30 SOL
Month 1: ~150 SOL
Month 3: ~500 SOL (as volume scales)
```

**Distribution:**
```
Weekly Pool: 100 SOL
├─ Top 10 Curators: 40 SOL (40%)
├─ Tier 3-4: 30 SOL (30%)
├─ Tier 2: 20 SOL (20%)
└─ Tier 1: 10 SOL (10%)
```

---

### Q5: What happens to poorly-curated projects?

**Rejection Flow:**

```
Project submitted → Voting period (48h)
  ↓
Approval < 70%
  ↓
┌─────────────────────────────────────┐
│ ❌ Project Rejected                 │
├─────────────────────────────────────┤
│ Your project didn't meet community  │
│ standards (32% approval).           │
│                                     │
│ Feedback from curators:             │
│ • "Unclear value prop"              │
│ • "Team not doxxed"                 │
│ • "Low Twitter engagement"          │
│                                     │
│ Submission fee: Not refunded        │
│                                     │
│ Next steps:                         │
│ 1. Address feedback                 │
│ 2. Resubmit in 7 days               │
│                                     │
│ [View Detailed Feedback]            │
└─────────────────────────────────────┘
```

**Consequences:**
- Submission fee NOT refunded (0.1 SOL lost)
- Project NOT shown in Vetted tab
- Submitter can retry after 7-day cooldown
- 3 rejections = 30-day ban

**Curator Rewards:**
- Curators who voted "Pass" earn share of submission fee
- Incentivizes quality control

**Feedback Loop:**
- Elite curators can leave 1-sentence feedback
- Submitter sees why project was rejected
- Encourages improvement, not just spam

---

## 17. Design Files & Handoff

### 17.1 File Structure

```
designs/
├─ wireframes/
│  ├─ network-page-tabs.fig
│  ├─ hot-takes-swipe.fig
│  ├─ leaderboard.fig
│  └─ curator-stats.fig
│
├─ components/
│  ├─ project-card.tsx (reference implementation)
│  ├─ vote-button.tsx
│  ├─ curator-badge.tsx
│  └─ reward-pool.tsx
│
├─ flows/
│  ├─ submission-flow.pdf
│  ├─ voting-flow.pdf
│  └─ reward-claim-flow.pdf
│
└─ specs/
   ├─ voting-mechanics.md (this doc)
   ├─ database-schema.sql
   └─ api-endpoints.yaml
```

### 17.2 Implementation Priority

**Week 1 (Critical Path):**
1. Database schema (Appwrite collections)
2. Hot Takes tab UI (swipeable cards)
3. Basic voting (equal weight)
4. Submission flow

**Week 2 (Core Features):**
1. Leaderboard tab
2. Curator tier system
3. Vote weight calculation
4. Reward calculation (manual distribution)

**Week 3 (Polish):**
1. Notifications
2. Real-time updates (WebSocket)
3. Twitter sharing
4. Mobile optimizations

**Week 4 (Scale):**
1. On-chain vote recording
2. Auto reward distribution
3. Anti-gaming detection
4. Analytics dashboard

---

## 18. Final Thoughts

### Design Rationale

This curation system is designed to feel like **"farming alpha"** not homework:

1. **Instant Feedback**: Vote → See result → Earn reward (dopamine loop)
2. **Clear Progression**: Tier badges, leaderboard rank (status)
3. **Social Proof**: Top curators, streak tracking (FOMO)
4. **Economic Incentive**: Real SOL earnings (not just points)
5. **Quality Focus**: Accuracy > Volume (sustainable)

### Why This Will Work

1. **Aligned Incentives**: Good curators earn more → Platform quality improves → More users → More fees → Bigger pool
2. **Sybil Resistant**: Economic + time barriers make spam unprofitable
3. **Memeable**: "I earned $200 this month curating meme coins" tweets itself
4. **Mobile-First**: Swipe voting = addictive (TikTok muscle memory)
5. **Sustainable**: Pool funded by platform fees, not VC money

### Potential Risks

1. **Low Initial Participation**: Mitigate with genesis rewards (2x for first 50 curators)
2. **Whale Takeover**: Mitigate with vote weight caps + accuracy focus
3. **Spam Submissions**: Mitigate with fees + cooldowns
4. **Curator Burnout**: Mitigate with optional digest mode + rest days

---

## Appendix A: Visual References

### Color Palette
```
Primary: #D1FD0A (Lime) - CTAs, highlights
Secondary: #00FF88 (Green) - Approval, success
Tertiary: #FFD700 (Gold) - Elite tier, rewards
Error: #FF3B3B (Red) - Rejection, warnings
Background: #0A0A0A (Near-black) - Canvas
Glass: rgba(255,255,255,0.05) - Cards
```

### Typography
```
Headings: Inter, 700-900 weight
Body: Inter, 400-500 weight
Monospace: JetBrains Mono (wallet addresses, stats)
LED Displays: "LED Dot Matrix" font (counters, timers)
```

### Iconography
```
Vote Gem: 👍 or 💎 (both used contextually)
Vote Pass: 👎 or ✗
Vote Report: 🚩
Curator Tiers: ⚡💎👑🏆
Streak: 🔥
Earnings: 💰
Accuracy: 🎯
Rank: 📊
```

---

## Appendix B: Copy & Microcopy

### Button Labels
```
Primary CTA: "Vote Now" / "It's a Gem" / "Submit Project"
Secondary: "View Details" / "See Leaderboard" / "Claim Rewards"
Tertiary: "Share" / "Filter" / "More"
```

### Empty States
```
No pending projects:
"No projects to review right now. Check back soon or submit your own!"

No earnings yet:
"Start voting to earn rewards! 💰 First vote earns 2x bonus."

No curator tier:
"Buy 10 keys to unlock curator status and start earning."
```

### Error Messages
```
Insufficient keys:
"You need 10 keys to vote. Buy keys to unlock curator privileges."

Vote limit hit:
"Daily vote limit reached (50/50). Quality > Quantity. Rest up, champ!"

Submission rejected:
"Your project didn't meet community standards. Review feedback and try again in 7 days."
```

### Success Messages
```
Vote cast:
"Vote recorded! 🎯 Early voter bonus: +0.002 SOL"

Tier upgraded:
"You're now a Veteran Curator! 💎 Vote weight increased to 1.5x"

Reward claimed:
"0.234 SOL claimed! 💰 Keep voting to earn more."
```

---

**End of Document**

**Files Referenced:**
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\network\page.tsx`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\network\Dealflow.tsx`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\lib\appwrite\services\dealflow.ts`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\contexts\CurveActivationContext.tsx`

**Next Steps:**
1. Review with engineering team (estimate 4-week build)
2. Create Figma wireframes (2 days)
3. Set up Appwrite collections (1 day)
4. Implement Phase 1 MVP (Week 1-2)
5. User testing with 10 beta curators (Week 3)
6. Iterate based on feedback (Week 4)
7. Launch 🚀
