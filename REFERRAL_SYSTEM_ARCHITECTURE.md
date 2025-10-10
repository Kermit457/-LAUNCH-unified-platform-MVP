# 🎯 LaunchOS Referral System - Complete Architecture

**Status:** Implementation Ready
**Version:** 1.0
**Last Updated:** 2025-10-10

---

## 📊 Executive Summary

Implement a **complete referral tracking and rewards system** across LaunchOS that:
- Tracks referral attribution via URL params (`?ref=<handle>`)
- Distributes mock payouts: 94% reserve, 3% project, 2% platform, 1% referrer
- Routes unclaimed 1% to global Rewards Pool when no referrer exists
- Provides leaderboard, earnings tracking, and viral growth mechanics
- **Mock mode ready** - swap to on-chain later without API changes

---

## 🏗️ System Architecture

### Data Flow Diagram

```
User visits with ?ref=alice
         ↓
    Bind referrer (once per user)
         ↓
User performs action (Follow/Join/Buy)
         ↓
    POST /api/referral/event
         ↓
    Compute split:
    - Reserve: 94%
    - Project: 3%
    - Platform: 2%
    - Referral: 1% (to alice OR Rewards Pool)
         ↓
    Write to Appwrite:
    - referrals (event log)
    - referral_rewards (update alice total)
    - rewards_pools (if no referrer)
         ↓
    Return totals to UI
```

---

## 💾 Appwrite Collections Schema

### 1. **`referrals`** (Event Log)

Tracks every referral event that occurs.

```typescript
interface Referral {
  $id: string                    // Auto-generated
  $createdAt: string            // Auto timestamp

  // Core fields
  referrerId: string            // User who referred (can be null)
  referredId: string            // User who was referred
  action: 'follow' | 'join' | 'create' | 'buy' | 'boost'
  page: string                  // URL/page where action occurred

  // Amounts (mock for now, real later)
  grossAmount: number           // Total transaction amount
  reserveAmount: number         // 94%
  projectAmount: number         // 3%
  platformAmount: number        // 2%
  referralAmount: number        // 1%
  rewardsPoolAmount: number     // 1% if no referrer

  // Metadata
  projectId?: string            // If action related to project
  txId?: string                 // Future: on-chain tx hash
  status: 'pending' | 'completed' | 'failed'
}
```

**Indexes:**
- `referrerId` (for leaderboard queries)
- `referredId` (for user referral history)
- `$createdAt` (for time-based queries)
- `status` (filter completed only)

**Permissions:**
- Read: Any authenticated user
- Create: Server-side only (API routes)
- Update: Server-side only
- Delete: Admin only

---

### 2. **`referral_rewards`** (User Totals)

Aggregated earnings per user.

```typescript
interface ReferralReward {
  $id: string
  $createdAt: string
  $updatedAt: string

  // User identity
  referrerId: string            // The referrer earning rewards

  // Earnings totals
  totalEarned: number           // All-time earnings
  todayEarned: number           // Reset daily
  weekEarned: number            // Reset weekly
  monthEarned: number           // Reset monthly

  // Stats
  totalReferrals: number        // Count of successful referrals
  activeReferrals: number       // Referrals who took action
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'

  // Thresholds for levels
  // Bronze: 3+ total earned
  // Silver: 10+ total earned
  // Gold: 25+ total earned
  // Platinum: 100+ total earned
  // Diamond: 500+ total earned

  lastPayoutAt?: string
  lastResetAt: string           // For time-based resets
}
```

**Indexes:**
- `referrerId` (unique)
- `totalEarned` (for leaderboard)
- `level` (for tier-based queries)

**Permissions:**
- Read: Any authenticated user
- Create: Server-side only
- Update: Server-side only
- Delete: Admin only

---

### 3. **`rewards_pools`** (Global/Page Pools)

Tracks unclaimed referral fees that go to various reward pools.

```typescript
interface RewardsPool {
  $id: string
  $createdAt: string
  $updatedAt: string

  // Pool identity
  scope: 'global' | 'page'      // Global or page-specific
  pageId?: string               // If scope=page, which page/project

  // Balance tracking
  balance: number               // Current pool balance
  totalDeposited: number        // All-time deposits
  totalClaimed: number          // All-time claims

  // Inflow tracking (for UI pills)
  last7dInflow: number          // Last 7 days deposits
  last30dInflow: number         // Last 30 days deposits

  // Distribution rules
  distributionRules?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    eligibility: 'all' | 'active' | 'top_contributors'
  }
}
```

**Indexes:**
- `scope`
- `pageId`

**Permissions:**
- Read: Any authenticated user
- Create: Admin only
- Update: Server-side only
- Delete: Admin only

---

### 4. **Update `users` Collection**

Add referral tracking fields to existing users collection:

```typescript
interface User {
  // ... existing fields

  // NEW: Referral fields
  referredBy?: string           // First referrer (bound once, never changes)
  referralSource?: string       // Page where they were referred from
  referralBoundAt?: string      // When referral was bound
  referralCode?: string         // Their unique referral code (username or userId)

  // Metadata
  isReferralEligible: boolean   // Can earn referral rewards (default: true)
  referralStats?: {
    totalReferred: number
    activeReferrals: number
    earnings: number
  }
}
```

---

## 🔧 Environment Variables

Add to `.env`:

```bash
# Referral System
NEXT_PUBLIC_APPWRITE_REFERRALS_COLLECTION_ID=referrals
NEXT_PUBLIC_APPWRITE_REFERRAL_REWARDS_COLLECTION_ID=referral_rewards
NEXT_PUBLIC_APPWRITE_REWARDS_POOLS_COLLECTION_ID=rewards_pools

# Fee Recipients (for future on-chain)
PROJECT_FEE_WALLET=<solana_address>
PLATFORM_FEE_WALLET=<solana_address>

# Referral Configuration
REFERRAL_PERCENTAGE=1                    # 1% to referrer
PROJECT_FEE_PERCENTAGE=3                 # 3% to project
PLATFORM_FEE_PERCENTAGE=2                # 2% to platform
RESERVE_PERCENTAGE=94                    # 94% to reserve/curve

# Leaderboard
LEADERBOARD_TOP_COUNT=10                 # Top N referrers to show
```

---

## 📂 File Structure

```
WIDGETS FOR LAUNCH/
├── lib/
│   ├── referral.ts                      # NEW - Core referral utilities
│   ├── appwrite/services/
│   │   ├── referrals.ts                 # NEW - Referral CRUD
│   │   ├── referral-rewards.ts          # NEW - Rewards CRUD
│   │   └── rewards-pools.ts             # NEW - Pools CRUD
│   └── constants/
│       └── referral-config.ts           # NEW - Referral constants
│
├── hooks/
│   ├── useReferral.ts                   # NEW - Referral state hook
│   ├── useReferralTracking.ts           # NEW - URL tracking hook
│   └── useRewardsPool.ts                # NEW - Pool balance hook
│
├── components/
│   ├── referral/
│   │   ├── ReferralModal.tsx            # NEW - Share referral link
│   │   ├── RewardsPill.tsx              # NEW - Pool balance display
│   │   ├── TopReferrers.tsx             # NEW - Leaderboard widget
│   │   ├── ReferralEarningsCard.tsx     # NEW - Dashboard widget
│   │   └── ReferralShareButton.tsx      # NEW - Quick share button
│   └── ...existing components
│
├── app/
│   ├── api/
│   │   └── referral/
│   │       ├── register/route.ts        # NEW - POST bind referrer
│   │       ├── event/route.ts           # NEW - POST log referral event
│   │       ├── leaderboard/route.ts     # NEW - GET top referrers
│   │       └── stats/route.ts           # NEW - GET user stats
│   ├── overview/page.tsx                # UPDATE - Add referral widgets
│   ├── discover/page.tsx                # UPDATE - Add referral CTAs
│   └── u/[handle]/page.tsx              # UPDATE - Add referral section
│
└── types/
    └── referral.ts                      # NEW - TypeScript types
```

---

## 🔌 API Routes Specification

### 1. **POST `/api/referral/register`**

Bind a referrer to a new user (first-time only).

**Request:**
```typescript
{
  ref: string           // Referrer handle or userId
  page: string          // Page URL where referred
  userId: string        // User being referred
}
```

**Response:**
```typescript
{
  success: boolean
  bound: boolean        // true if newly bound, false if already had referrer
  referrerId: string | null
  message: string
}
```

**Logic:**
1. Check if user already has `referredBy` set
2. If yes, return `bound: false` (can't override)
3. If no, validate referrer exists
4. Check not self-referral
5. Update user with `referredBy`, `referralSource`, `referralBoundAt`
6. Return success

---

### 2. **POST `/api/referral/event`**

Log a referral event and compute splits.

**Request:**
```typescript
{
  userId: string              // User performing action
  action: 'follow' | 'join' | 'create' | 'buy' | 'boost'
  page: string                // URL/page
  grossAmount: number         // Total mock amount (e.g., 1.0 SOL)
  projectId?: string          // If related to a project
}
```

**Response:**
```typescript
{
  success: boolean
  split: {
    gross: number
    reserve: number           // 94%
    project: number           // 3%
    platform: number          // 2%
    referral: number          // 1% (to referrer OR rewards pool)
    toRewardsPool: boolean    // true if no referrer
  }
  referrerId: string | null
  rewardedAmount: number      // Amount added to referrer/pool
}
```

**Logic:**
1. Get user's `referredBy` from Appwrite
2. Compute splits based on percentages
3. Create `referrals` document
4. If `referredBy` exists:
   - Update `referral_rewards` (add to totals)
5. If no `referredBy`:
   - Update `rewards_pools` (add to global pool)
6. Return split breakdown

---

### 3. **GET `/api/referral/leaderboard`**

Get top referrers by timeframe.

**Query Params:**
```typescript
{
  range?: 'day' | 'week' | 'month' | 'all'  // Default: 'week'
  limit?: number                             // Default: 10
}
```

**Response:**
```typescript
{
  leaderboard: Array<{
    rank: number
    referrerId: string
    username: string
    avatar?: string
    earned: number
    referralCount: number
    level: string
  }>
  range: string
  totalReferrers: number
}
```

**Logic:**
1. Query `referral_rewards`
2. Sort by appropriate field (todayEarned, weekEarned, etc.)
3. Join with `users` to get usernames/avatars
4. Return top N

---

### 4. **GET `/api/referral/stats`**

Get referral stats for a specific user.

**Query Params:**
```typescript
{
  userId: string
}
```

**Response:**
```typescript
{
  userId: string
  totalEarned: number
  todayEarned: number
  weekEarned: number
  monthEarned: number
  totalReferrals: number
  activeReferrals: number
  level: string
  rank: number              // Global rank
  referralCode: string      // Their referral link code
}
```

---

## 🧮 Split Calculation Logic

```typescript
// lib/referral.ts

export interface ReferralSplit {
  gross: number
  reserve: number
  project: number
  platform: number
  referral: number
  toRewardsPool: boolean
}

export function computeSplit(grossAmount: number, hasReferrer: boolean): ReferralSplit {
  const reserve = grossAmount * 0.94
  const project = grossAmount * 0.03
  const platform = grossAmount * 0.02
  const referral = grossAmount * 0.01

  return {
    gross: grossAmount,
    reserve,
    project,
    platform,
    referral,
    toRewardsPool: !hasReferrer
  }
}

// Level thresholds
export const REFERRAL_LEVELS = {
  Bronze: { min: 0, max: 2.99, color: '#CD7F32' },
  Silver: { min: 3, max: 9.99, color: '#C0C0C0' },
  Gold: { min: 10, max: 24.99, color: '#FFD700' },
  Platinum: { min: 25, max: 99.99, color: '#E5E4E2' },
  Diamond: { min: 100, max: Infinity, color: '#B9F2FF' }
} as const

export function calculateLevel(totalEarned: number): keyof typeof REFERRAL_LEVELS {
  for (const [level, { min, max }] of Object.entries(REFERRAL_LEVELS)) {
    if (totalEarned >= min && totalEarned <= max) {
      return level as keyof typeof REFERRAL_LEVELS
    }
  }
  return 'Bronze'
}
```

---

## 🎨 UI Components Specifications

### 1. **ReferralModal**

```typescript
// components/referral/ReferralModal.tsx

interface ReferralModalProps {
  open: boolean
  onClose: () => void
  userId: string
  username: string
}

// Features:
// - Show referral link: https://launchos.com/?ref={username}
// - Copy button with success toast
// - Share on X/Twitter button
// - Show current earnings (today, all-time)
// - Show referral count
// - Show level badge (Bronze/Silver/Gold)
```

### 2. **RewardsPill**

```typescript
// components/referral/RewardsPill.tsx

interface RewardsPillProps {
  balance: number
  last7dInflow: number
  onClick?: () => void
}

// Features:
// - Compact pill design
// - Shows pool balance
// - Shows "+$X in 7d" with green up arrow
// - Clickable to show pool details modal
```

### 3. **TopReferrers**

```typescript
// components/referral/TopReferrers.tsx

interface TopReferrersProps {
  range: 'day' | 'week' | 'month' | 'all'
  limit?: number
}

// Features:
// - Horizontal scrollable list of top referrers
// - Avatar, username, earned amount, level badge
// - Click to view profile
// - Animated entrance
```

### 4. **ReferralEarningsCard**

```typescript
// components/referral/ReferralEarningsCard.tsx

interface ReferralEarningsCardProps {
  userId: string
}

// Features:
// - Dashboard widget
// - Shows today earnings, all-time
// - Shows level with progress bar to next
// - "Invite friends" CTA button
// - Referral count
```

---

## 🔄 Implementation Phases

### **Phase 1: Foundation** (Day 1-2)
- [ ] Create Appwrite collections with schemas
- [ ] Add environment variables
- [ ] Create TypeScript types
- [ ] Build core utility functions (`lib/referral.ts`)
- [ ] Create Appwrite service files

### **Phase 2: API Layer** (Day 2-3)
- [ ] Implement `/api/referral/register`
- [ ] Implement `/api/referral/event`
- [ ] Implement `/api/referral/leaderboard`
- [ ] Implement `/api/referral/stats`
- [ ] Test all API endpoints

### **Phase 3: React Hooks** (Day 3)
- [ ] Create `useReferral` hook
- [ ] Create `useReferralTracking` hook (URL param detection)
- [ ] Create `useRewardsPool` hook
- [ ] Test hooks integration

### **Phase 4: UI Components** (Day 4-5)
- [ ] Build ReferralModal
- [ ] Build RewardsPill
- [ ] Build TopReferrers
- [ ] Build ReferralEarningsCard
- [ ] Build ReferralShareButton

### **Phase 5: Page Integration** (Day 5-6)
- [ ] Wire `/overview` (dashboard) - Add ReferralEarningsCard + RewardsPill
- [ ] Wire `/discover` - Add referral CTAs to cards + share button
- [ ] Wire `/u/[handle]` - Add referral section + top referrers

### **Phase 6: Testing & QA** (Day 6-7)
- [ ] Test referral binding (first-time only)
- [ ] Test self-referral blocking
- [ ] Test split calculations
- [ ] Test rewards pool routing
- [ ] Test leaderboard accuracy
- [ ] Generate QA report

---

## ✅ Success Criteria

### Functional Requirements
- [ ] New user with `?ref=alice` binds to alice as referrer
- [ ] Subsequent visits with different `?ref` do NOT override
- [ ] Self-referral is blocked
- [ ] Actions trigger referral events correctly
- [ ] Splits are calculated accurately (94/3/2/1)
- [ ] Referrer earnings accumulate in `referral_rewards`
- [ ] Unclaimed 1% goes to global Rewards Pool
- [ ] Leaderboard shows correct rankings
- [ ] All TypeScript types are correct
- [ ] Zero console errors
- [ ] Dark theme preserved

### Performance Requirements
- [ ] API responses < 200ms
- [ ] Leaderboard queries optimized with indexes
- [ ] No N+1 query issues
- [ ] Efficient Appwrite reads (use Query.limit)

---

## 🧪 Testing Scenarios

### Scenario 1: New User Referral
```
1. User A shares link: https://launchos.com/?ref=alice
2. User B (new) clicks link
3. System binds B.referredBy = alice
4. B performs action (Follow project)
5. System logs referral event
6. Alice's totalEarned increases by 1% of action amount
7. Verify in Appwrite: referrals collection has new doc
```

### Scenario 2: No Referrer
```
1. User C visits directly (no ?ref param)
2. C performs action (Join campaign)
3. System logs referral event with referrerId = null
4. 1% goes to global Rewards Pool
5. Verify rewards_pools.balance increased
```

### Scenario 3: Self-Referral Blocked
```
1. User D tries to use own referral link
2. System detects userId === referrerId
3. Blocks binding
4. Returns error message
```

### Scenario 4: Override Attempt Blocked
```
1. User E already bound to alice
2. E visits link with ?ref=bob
3. System checks E.referredBy already set
4. Ignores bob, keeps alice
5. Returns message: "Already referred by alice"
```

---

## 📈 Analytics & Monitoring

Track these metrics:

- Total referrals created
- Conversion rate (referral → active user)
- Average earnings per referrer
- Top referrers (daily/weekly/monthly)
- Rewards Pool balance over time
- Distribution of user levels
- Actions triggering most referrals
- Self-referral attempt rate (for fraud detection)

---

## 🚀 Future Enhancements (Post-Curve)

1. **On-Chain Integration**
   - Swap mock splits to real Solana transactions
   - Update `txId` field with actual tx hashes
   - Integrate with escrow system

2. **Advanced Features**
   - Multi-tier referrals (2-level deep)
   - Referral contests/challenges
   - Bonus multipliers for top performers
   - Referral NFTs (level badges as NFTs)
   - Automated pool distributions

3. **Gamification**
   - Achievements for referral milestones
   - Leaderboard rewards
   - Seasonal competitions
   - Referral streaks

---

## 📝 QA Report Template

After implementation, generate this report:

| Page | Element | Expected Behavior | Status | Fixes Needed |
|------|---------|-------------------|--------|--------------|
| /overview | Referral Earnings Card | Shows today/all-time earnings | ✅/❌ | |
| /overview | Rewards Pool Pill | Shows balance + 7d inflow | ✅/❌ | |
| /overview | "Invite friends" CTA | Opens ReferralModal | ✅/❌ | |
| /discover | Referral share button | Copies link to clipboard | ✅/❌ | |
| /discover | Card "Invite & earn 1%" | Opens share popover | ✅/❌ | |
| /discover | Action buttons | Trigger POST /api/referral/event | ✅/❌ | |
| /u/[handle] | Referral link section | Shows personal link (own profile) | ✅/❌ | |
| /u/[handle] | Top Referrers widget | Shows leaderboard | ✅/❌ | |
| /u/[handle] | Action buttons | Trigger referral events | ✅/❌ | |
| API | POST /api/referral/register | Binds referrer (first-time only) | ✅/❌ | |
| API | POST /api/referral/event | Logs event + computes splits | ✅/❌ | |
| API | GET /api/referral/leaderboard | Returns top referrers | ✅/❌ | |
| API | GET /api/referral/stats | Returns user stats | ✅/❌ | |

---

## 🎯 Next Steps

1. Review this architecture document
2. Confirm Appwrite collection schemas
3. Start Phase 1 implementation
4. Daily standup to track progress
5. Generate QA report after Phase 6
6. Merge to main
7. Proceed to Curve UI integration

---

**Ready to implement? Let's start with Phase 1: Foundation!** 🚀
