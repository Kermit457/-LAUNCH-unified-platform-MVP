# 🚀 Referral System - Step-by-Step Implementation Plan

**Estimated Time:** 6-7 days
**Priority:** High
**Dependencies:** Appwrite, existing auth system

---

## 📅 Implementation Timeline

### **Day 1-2: Foundation & Database**
### **Day 2-3: API Layer**
### **Day 3: React Hooks**
### **Day 4-5: UI Components**
### **Day 5-6: Page Integration**
### **Day 6-7: Testing & QA**

---

## 🏗️ PHASE 1: Foundation (Day 1-2)

### Step 1.1: Create Appwrite Collections

**File:** Appwrite Console (manual) or migration script

**Collections to create:**

#### Collection 1: `referrals`
```bash
# In Appwrite Console → Database → Create Collection

Name: referrals
Collection ID: referrals

Attributes:
- referrerId (string, 128, not required)
- referredId (string, 128, required)
- action (enum: follow,join,create,buy,boost, required)
- page (string, 512, required)
- grossAmount (float, required)
- reserveAmount (float, required)
- projectAmount (float, required)
- platformAmount (float, required)
- referralAmount (float, required)
- rewardsPoolAmount (float, required)
- projectId (string, 128, not required)
- txId (string, 256, not required)
- status (enum: pending,completed,failed, required, default: completed)

Indexes:
- Key: referrerId_idx, Type: key, Attributes: referrerId
- Key: referredId_idx, Type: key, Attributes: referredId
- Key: createdAt_idx, Type: key, Attributes: $createdAt
- Key: status_idx, Type: key, Attributes: status

Permissions:
- Read: any
- Create: role:all (server)
- Update: role:all (server)
- Delete: role:admin
```

#### Collection 2: `referral_rewards`
```bash
Name: referral_rewards
Collection ID: referral_rewards

Attributes:
- referrerId (string, 128, required)
- totalEarned (float, required, default: 0)
- todayEarned (float, required, default: 0)
- weekEarned (float, required, default: 0)
- monthEarned (float, required, default: 0)
- totalReferrals (integer, required, default: 0)
- activeReferrals (integer, required, default: 0)
- level (enum: Bronze,Silver,Gold,Platinum,Diamond, required, default: Bronze)
- lastPayoutAt (datetime, not required)
- lastResetAt (datetime, required)

Indexes:
- Key: referrerId_idx, Type: unique, Attributes: referrerId
- Key: totalEarned_idx, Type: key, Attributes: totalEarned (DESC)
- Key: level_idx, Type: key, Attributes: level

Permissions:
- Read: any
- Create: role:all (server)
- Update: role:all (server)
- Delete: role:admin
```

#### Collection 3: `rewards_pools`
```bash
Name: rewards_pools
Collection ID: rewards_pools

Attributes:
- scope (enum: global,page, required)
- pageId (string, 128, not required)
- balance (float, required, default: 0)
- totalDeposited (float, required, default: 0)
- totalClaimed (float, required, default: 0)
- last7dInflow (float, required, default: 0)
- last30dInflow (float, required, default: 0)

Indexes:
- Key: scope_idx, Type: key, Attributes: scope
- Key: pageId_idx, Type: key, Attributes: pageId

Permissions:
- Read: any
- Create: role:admin
- Update: role:all (server)
- Delete: role:admin
```

#### Collection 4: Update `users` collection
```bash
Add these attributes to existing users collection:

- referredBy (string, 128, not required)
- referralSource (string, 512, not required)
- referralBoundAt (datetime, not required)
- referralCode (string, 64, not required)
- isReferralEligible (boolean, required, default: true)
```

---

### Step 1.2: Update Environment Variables

**File:** `.env`

```bash
# Add these lines to .env

# Referral Collections
NEXT_PUBLIC_APPWRITE_REFERRALS_COLLECTION_ID=referrals
NEXT_PUBLIC_APPWRITE_REFERRAL_REWARDS_COLLECTION_ID=referral_rewards
NEXT_PUBLIC_APPWRITE_REWARDS_POOLS_COLLECTION_ID=rewards_pools

# Fee Configuration
REFERRAL_PERCENTAGE=1
PROJECT_FEE_PERCENTAGE=3
PLATFORM_FEE_PERCENTAGE=2
RESERVE_PERCENTAGE=94

# Leaderboard
LEADERBOARD_TOP_COUNT=10

# Future: On-chain wallets
PROJECT_FEE_WALLET=
PLATFORM_FEE_WALLET=
```

---

### Step 1.3: Create TypeScript Types

**File:** `types/referral.ts`

```typescript
export type ReferralAction = 'follow' | 'join' | 'create' | 'buy' | 'boost'
export type ReferralStatus = 'pending' | 'completed' | 'failed'
export type ReferralLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
export type PoolScope = 'global' | 'page'
export type LeaderboardRange = 'day' | 'week' | 'month' | 'all'

export interface Referral {
  $id: string
  $createdAt: string
  referrerId: string | null
  referredId: string
  action: ReferralAction
  page: string
  grossAmount: number
  reserveAmount: number
  projectAmount: number
  platformAmount: number
  referralAmount: number
  rewardsPoolAmount: number
  projectId?: string
  txId?: string
  status: ReferralStatus
}

export interface ReferralReward {
  $id: string
  $createdAt: string
  $updatedAt: string
  referrerId: string
  totalEarned: number
  todayEarned: number
  weekEarned: number
  monthEarned: number
  totalReferrals: number
  activeReferrals: number
  level: ReferralLevel
  lastPayoutAt?: string
  lastResetAt: string
}

export interface RewardsPool {
  $id: string
  $createdAt: string
  $updatedAt: string
  scope: PoolScope
  pageId?: string
  balance: number
  totalDeposited: number
  totalClaimed: number
  last7dInflow: number
  last30dInflow: number
}

export interface ReferralSplit {
  gross: number
  reserve: number
  project: number
  platform: number
  referral: number
  toRewardsPool: boolean
}

export interface LeaderboardEntry {
  rank: number
  referrerId: string
  username: string
  avatar?: string
  earned: number
  referralCount: number
  level: ReferralLevel
}
```

---

### Step 1.4: Create Core Utility Functions

**File:** `lib/referral.ts`

```typescript
import type { ReferralSplit, ReferralLevel } from '@/types/referral'

// Constants
export const REFERRAL_PERCENTAGE = parseFloat(process.env.REFERRAL_PERCENTAGE || '1') / 100
export const PROJECT_FEE_PERCENTAGE = parseFloat(process.env.PROJECT_FEE_PERCENTAGE || '3') / 100
export const PLATFORM_FEE_PERCENTAGE = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '2') / 100
export const RESERVE_PERCENTAGE = parseFloat(process.env.RESERVE_PERCENTAGE || '94') / 100

// Level thresholds
export const REFERRAL_LEVELS = {
  Bronze: { min: 0, max: 2.99, color: '#CD7F32', next: 'Silver' },
  Silver: { min: 3, max: 9.99, color: '#C0C0C0', next: 'Gold' },
  Gold: { min: 10, max: 24.99, color: '#FFD700', next: 'Platinum' },
  Platinum: { min: 25, max: 99.99, color: '#E5E4E2', next: 'Diamond' },
  Diamond: { min: 100, max: Infinity, color: '#B9F2FF', next: null }
} as const

/**
 * Extract referral code from URL
 */
export function getRefFromURL(url?: string): string | null {
  if (typeof window === 'undefined' && !url) return null

  const urlString = url || window.location.href
  const urlObj = new URL(urlString)
  return urlObj.searchParams.get('ref')
}

/**
 * Check if referral is self-referral
 */
export function isSelfReferral(userId: string, referrerId: string): boolean {
  return userId === referrerId
}

/**
 * Compute referral split
 */
export function computeSplit(grossAmount: number, hasReferrer: boolean): ReferralSplit {
  const reserve = grossAmount * RESERVE_PERCENTAGE
  const project = grossAmount * PROJECT_FEE_PERCENTAGE
  const platform = grossAmount * PLATFORM_FEE_PERCENTAGE
  const referral = grossAmount * REFERRAL_PERCENTAGE

  return {
    gross: grossAmount,
    reserve,
    project,
    platform,
    referral,
    toRewardsPool: !hasReferrer
  }
}

/**
 * Calculate referral level based on total earned
 */
export function calculateLevel(totalEarned: number): ReferralLevel {
  for (const [level, { min, max }] of Object.entries(REFERRAL_LEVELS)) {
    if (totalEarned >= min && totalEarned <= max) {
      return level as ReferralLevel
    }
  }
  return 'Bronze'
}

/**
 * Calculate progress to next level
 */
export function calculateLevelProgress(totalEarned: number): {
  current: ReferralLevel
  next: ReferralLevel | null
  progress: number // 0-100
  amountToNext: number
} {
  const current = calculateLevel(totalEarned)
  const currentLevelData = REFERRAL_LEVELS[current]
  const next = currentLevelData.next as ReferralLevel | null

  if (!next) {
    return { current, next: null, progress: 100, amountToNext: 0 }
  }

  const nextLevelData = REFERRAL_LEVELS[next]
  const progressInLevel = totalEarned - currentLevelData.min
  const levelRange = currentLevelData.max - currentLevelData.min
  const progress = (progressInLevel / levelRange) * 100
  const amountToNext = nextLevelData.min - totalEarned

  return { current, next, progress: Math.min(progress, 100), amountToNext }
}

/**
 * Store referral code in localStorage
 */
export function storeReferralCode(ref: string): void {
  if (typeof window === 'undefined') return

  try {
    const existing = localStorage.getItem('referral_code')
    if (!existing) {
      localStorage.setItem('referral_code', ref)
      localStorage.setItem('referral_stored_at', new Date().toISOString())
    }
  } catch (error) {
    console.error('Failed to store referral code:', error)
  }
}

/**
 * Get stored referral code from localStorage
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem('referral_code')
  } catch (error) {
    console.error('Failed to get referral code:', error)
    return null
  }
}

/**
 * Generate referral link
 */
export function generateReferralLink(code: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://launchos.com')
  return `${base}/?ref=${encodeURIComponent(code)}`
}

/**
 * Format currency amount
 */
export function formatAmount(amount: number, currency: string = 'USDC'): string {
  return `${amount.toFixed(2)} ${currency}`
}
```

---

### Step 1.5: Create Appwrite Service Files

**File:** `lib/appwrite/services/referrals.ts`

```typescript
import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { Query, ID } from 'appwrite'
import type { Referral, ReferralAction, ReferralStatus } from '@/types/referral'

export async function createReferralEvent(data: {
  referrerId: string | null
  referredId: string
  action: ReferralAction
  page: string
  grossAmount: number
  reserveAmount: number
  projectAmount: number
  platformAmount: number
  referralAmount: number
  rewardsPoolAmount: number
  projectId?: string
  status?: ReferralStatus
}): Promise<Referral> {
  const doc = await databases.createDocument(
    DB_ID,
    COLLECTIONS.REFERRALS,
    ID.unique(),
    {
      ...data,
      status: data.status || 'completed',
      txId: null
    }
  )

  return doc as unknown as Referral
}

export async function getReferralsByUser(
  userId: string,
  limit: number = 100
): Promise<Referral[]> {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.REFERRALS,
    [
      Query.equal('referredId', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(limit)
    ]
  )

  return response.documents as unknown as Referral[]
}

export async function getReferralsByReferrer(
  referrerId: string,
  limit: number = 100
): Promise<Referral[]> {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.REFERRALS,
    [
      Query.equal('referrerId', referrerId),
      Query.equal('status', 'completed'),
      Query.orderDesc('$createdAt'),
      Query.limit(limit)
    ]
  )

  return response.documents as unknown as Referral[]
}
```

Continue in next response...
