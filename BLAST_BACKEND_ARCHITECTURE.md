# BLAST Network Hub - Backend Architecture

**Version:** 1.0
**Date:** 2025-10-24
**Status:** Production-Ready Design

---

## Executive Summary

Complete backend architecture for BLAST Network Hub - a key-gated dealflow platform with 72h Deal Rooms, Motion Score reputation system, and 24+ viral mechanics. Designed to integrate seamlessly with existing Appwrite database, Solana bonding curve program, and Next.js 14 frontend.

**Key Features:**
- 72h Deal Rooms with 5 structured post types
- Motion Score with exponential decay (τ = 72h)
- Priority queue algorithm for applicants
- Smart matching for intros
- DM Request Market with deposits
- Escrow with milestone-based releases
- 24+ viral mechanics (raid boosts, streak vault, witness mode, etc.)

---

## 1. Database Schema

### 1.1 BLAST_ROOMS

```typescript
// Collection ID: blast_rooms
{
  $id: string                    // Auto-generated

  // Basic Info
  type: 'deal' | 'airdrop' | 'job' | 'collab' | 'funding'
  founderId: string              // Creator user ID (indexed)
  title: string                  // Max 100 chars
  description: string            // Max 2000 chars
  tags: string[]                 // ["DeFi", "AI", "Gaming"] (indexed)

  // Slots & Gates
  totalSlots: number             // Default: 10
  filledSlots: number            // Default: 0
  minKeyToApply: number          // Default: 1 (tier-based)
  minKeyToCurate: number         // Default: 5
  minKeyToOpen: number           // Default: 25 (founders only)

  // Deposits & Stakes
  entryDeposit: number           // Keys required (default: 1)
  curatorBond: number            // Keys staked by curators (5-25)
  totalStaked: number            // Sum of all curator bonds

  // Lifecycle
  status: 'open' | 'hot' | 'closing' | 'closed' | 'archived'
  startTime: datetime            // ISO timestamp
  endTime: datetime              // +72h from start
  extended: boolean              // One-time 24h extension
  extendedAt?: datetime

  // Metrics (real-time)
  motionScore: number            // 0-100, calculated live
  applicantCount: number         // Total applicants
  acceptedCount: number          // Accepted (filled slots)
  rejectedCount: number
  watcherCount: number           // 0-key viewers
  messageCount: number           // Chat activity

  // Viral Mechanics
  raidBoostActive: boolean       // Hot status triggered
  raidBoostAt?: datetime
  raidBoostBy: string[]          // User IDs who boosted

  // Type-Specific Metadata
  metadata: {
    // Deal
    dealSize?: number            // USD value
    stage?: string               // "Pre-seed", "Seed", etc.
    equity?: string              // "5-10%"

    // Airdrop
    totalAllocation?: number     // Tokens to distribute
    requirements?: string[]

    // Job
    salary?: string              // "$80k-120k"
    location?: string            // "Remote", "NYC"
    skillsNeeded?: string[]

    // Collab
    lookingFor?: string[]        // ["Designer", "Dev"]
    duration?: string            // "3 months"

    // Funding
    fundingGoal?: number         // USD
    minTicket?: number
    maxTicket?: number
  }

  // Timestamps
  createdAt: datetime            // Auto
  updatedAt: datetime            // Auto
  closedAt?: datetime
}

// Indexes
- founderId (asc)
- type (asc)
- status (asc)
- tags (array)
- motionScore (desc)
- startTime (desc)
- endTime (asc)
- Composite: status + motionScore (desc)
- Composite: status + endTime (asc)
```

### 1.2 BLAST_APPLICANTS

```typescript
// Collection ID: blast_applicants
{
  $id: string
  roomId: string                 // FK to blast_rooms (indexed)
  userId: string                 // FK to users (indexed)

  // Application Data
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  message: string                // Pitch (max 500 chars)
  attachments: string[]          // File URLs
  skills: string[]               // Relevant skills

  // Priority Queue
  keysStaked: number             // Extra keys for priority (0-10)
  priorityScore: number          // Calculated rank (indexed, desc)
  queuePosition: number          // Current position

  // Deposits
  depositAmount: number          // Keys locked (=room.entryDeposit)
  depositRefunded: boolean
  depositForfeit: boolean        // No-show penalty

  // Activity Tracking
  activityCount: number          // Messages, reactions, etc.
  lastActiveAt?: datetime

  // Referral
  referredBy?: string            // User ID who referred

  // Timestamps
  appliedAt: datetime
  respondedAt?: datetime         // When accepted/rejected
  acceptedAt?: datetime
  rejectedAt?: datetime
}

// Indexes
- roomId + userId (unique composite)
- roomId (asc)
- userId (asc)
- status (asc)
- priorityScore (desc)
- appliedAt (desc)
- Composite: roomId + status + priorityScore (desc)
```

### 1.3 BLAST_EVENTS

```typescript
// Collection ID: blast_events
{
  $id: string

  // Event Context
  type: string                   // Event name (indexed)
  actorId: string                // User who performed (indexed)
  roomId?: string                // Associated room (indexed)
  targetId?: string              // Target user/entity (indexed)

  // Motion Score Weighting
  weight: number                 // 1-10 importance
  decayRate: number              // τ (tau) for e^(-Δt/τ), default: 72

  // Event-Specific Data
  metadata: {
    // For 'holder_growth'
    holdersDelta?: number

    // For 'key_buys'
    keysPurchased?: number
    solSpent?: number

    // For 'accepted_intros'
    introId?: string

    // For 'completed_bounties'
    bountyId?: string
    rewardAmount?: number

    // For 'curator_votes'
    voteType?: 'approve' | 'reject'

    // For 'room_attendance'
    durationMinutes?: number

    // Generic
    description?: string
  }

  timestamp: datetime            // Event time (indexed, desc)
}

// Event Types & Weights
const EVENT_WEIGHTS = {
  holder_growth: 8,              // Very important
  key_buys: 7,
  accepted_intros: 9,
  completed_bounties: 10,        // Max weight
  curator_votes: 5,
  room_attendance: 3,
  applies: 4,
  referrals: 6,
  watchtime: 2,
  task_completions: 5,
  dm_accepted: 4,
  raid_boost: 6,
  streak_complete: 5,
}

// Indexes
- actorId (asc)
- type (asc)
- roomId (asc)
- targetId (asc)
- timestamp (desc)
- Composite: actorId + timestamp (desc)
```

### 1.4 BLAST_ESCROWS

```typescript
// Collection ID: blast_escrows
{
  $id: string
  roomId: string                 // Associated room (indexed)
  founderId: string              // Payer (indexed)
  contributorId: string          // Recipient (indexed)

  // Terms
  totalAmount: number            // Total escrow value
  currency: 'USDC' | 'SOL' | 'keys'
  milestones: Array<{
    id: string                   // Unique ID
    description: string
    amount: number
    deadline?: datetime
    status: 'pending' | 'submitted' | 'approved' | 'rejected'
    proofUrl?: string
    submittedAt?: datetime
    reviewedAt?: datetime
  }>

  // Status
  status: 'active' | 'milestone_pending' | 'disputed' | 'completed' | 'refunded'
  currentMilestone: number       // Index (0-based)

  // Dispute
  disputeReason?: string
  disputedBy?: 'founder' | 'contributor'
  arbitratorId?: string          // Curator with high Motion Score
  arbitrationFee: number         // 0.03 keys (paid by loser)
  arbitrationDecision?: 'full_pay' | 'partial_pay' | 'refund'
  arbitrationNotes?: string

  // Timestamps
  createdAt: datetime
  completedAt?: datetime
  disputedAt?: datetime
  resolvedAt?: datetime
}

// Indexes
- roomId (asc)
- founderId (asc)
- contributorId (asc)
- status (asc)
- createdAt (desc)
```

### 1.5 BLAST_DM_REQUESTS

```typescript
// Collection ID: blast_dm_requests
{
  $id: string
  fromUserId: string             // Sender (indexed)
  toUserId: string               // Recipient (indexed)

  // Request
  message: string                // Brief pitch (max 200 chars)
  depositAmount: number          // Keys locked (default: 0.02)

  // Status
  status: 'pending' | 'accepted' | 'declined' | 'expired'

  // Outcome
  refunded: boolean
  dmThreadId?: string            // Chat room ID if accepted

  // Viral: Hall Pass
  hallPassUsed: boolean          // Free DM (10 accepts in 7 days)

  // Timestamps
  createdAt: datetime
  respondedAt?: datetime
  expiresAt: datetime            // 24h from creation
}

// Indexes
- fromUserId (asc)
- toUserId (asc)
- status (asc)
- createdAt (desc)
- expiresAt (asc)
- Composite: fromUserId + toUserId (check duplicates)
```

### 1.6 BLAST_INTROS

```typescript
// Collection ID: blast_intros
{
  $id: string
  requesterId: string            // Who wants intro (indexed)
  targetAId: string              // Person to intro (indexed)
  targetBId: string              // Intro to whom (indexed)

  // Context
  reason: string                 // Why intro makes sense (max 300 chars)
  tags: string[]                 // Shared interests
  matchScore: number             // Smart match score (0-100)
  depositAmount: number          // 0.02 key burn on accept

  // Status
  status: 'pending' | 'accepted' | 'declined'

  // Rewards (on accept)
  burnedToVault: number          // 50% of deposit
  rewardToCurator: number        // 50% to person making intro

  // Timestamps
  createdAt: datetime
  acceptedAt?: datetime
  declinedAt?: datetime
}

// Indexes
- requesterId (asc)
- targetAId (asc)
- targetBId (asc)
- status (asc)
- createdAt (desc)
```

### 1.7 BLAST_VAULT

```typescript
// Collection ID: blast_vault
{
  $id: string                    // Same as userId (primary key)
  userId: string                 // FK to users (unique)

  // Balances
  keyBalance: number             // Unlocked keys (default: 0)
  lockedKeys: number             // In active rooms/escrows (default: 0)
  solBalance: number             // Earnings in SOL (default: 0)
  usdcBalance: number            // Earnings in USDC (default: 0)
  pointsBalance: number          // Airdrop points (default: 0)

  // Earnings Breakdown
  fromRooms: number              // Room rewards
  fromIntros: number             // Intro bonuses
  fromReferrals: number          // Referral rewards
  fromCurating: number           // Curator bonuses
  fromEscrows: number            // Completed work

  // Refunds Pending
  pendingRefunds: Array<{
    amount: number
    reason: string               // "no_show", "room_cancelled", etc.
    roomId?: string
    scheduledAt: datetime
  }>

  // Viral Mechanics
  streakDays: number             // Consecutive daily actions (default: 0)
  streakVaultAmount: number      // Locked until 7-day streak
  lastStreakAction?: datetime

  // Timestamps
  createdAt: datetime
  updatedAt: datetime
}

// Indexes
- userId (unique)
- updatedAt (desc)
```

### 1.8 BLAST_MOTION_SCORES

```typescript
// Collection ID: blast_motion_scores
{
  $id: string                    // Same as userId
  userId: string                 // FK to users (unique, indexed)

  // Current Score
  currentScore: number           // 0-100 (indexed, desc)

  // Decay Parameters
  tau: number                    // Default: 72 (hours)
  lastDecayAt: datetime          // Last recalculation

  // Signal Breakdown (cached)
  signals: {
    holder_growth: number        // Weight: 8
    key_buys: number             // Weight: 7
    applies: number              // Weight: 4
    accepted_intros: number      // Weight: 9
    completed_bounties: number   // Weight: 10
    curator_votes: number        // Weight: 5
    room_attendance: number      // Weight: 3
    task_completions: number     // Weight: 5
    referrals: number            // Weight: 6
    watchtime: number            // Weight: 2
    dm_accepted: number          // Weight: 4
    raid_boost: number           // Weight: 6
    streak_complete: number      // Weight: 5
  }

  // History (snapshots)
  scoreHistory: Array<{
    score: number
    timestamp: datetime
  }>                             // Max 168 entries (hourly for 7 days)

  // Milestones
  peakScore: number              // All-time high
  peakScoreAt?: datetime

  // Timestamps
  createdAt: datetime
  updatedAt: datetime
}

// Indexes
- userId (unique)
- currentScore (desc)
- updatedAt (desc)
```

### 1.9 BLAST_CURATORS

```typescript
// Collection ID: blast_curators
{
  $id: string
  roomId: string                 // FK to blast_rooms (indexed)
  userId: string                 // Curator user ID (indexed)

  // Stake
  bondAmount: number             // 5-25 keys staked
  bondLocked: boolean            // Lock until room closes

  // Performance
  tagsApplied: string[]          // Tags curator added
  upvotes: number                // Community votes
  downvotes: number              // Abuse reports
  accuracyScore: number          // 0-100 (good curation = high)

  // Rewards
  bonusEarned: number            // Successful room bonus
  slashedAmount: number          // Penalty for mis-tags

  // Status
  status: 'active' | 'slashed' | 'completed'

  // Timestamps
  stakedAt: datetime
  unstakedAt?: datetime
}

// Indexes
- roomId + userId (unique composite)
- roomId (asc)
- userId (asc)
- accuracyScore (desc)
- stakedAt (desc)
```

---

## 2. Room Lifecycle State Machine

```typescript
// State: OPEN
// Duration: 72h timer starts
// Actions:
// - Applicants deposit keys → join queue
// - Curators stake 5-25 keys → tag/rank
// - Founder reviews queue → accept/reject
// - Watchers (0-key) can view (read-only)
// Transitions:
// - → HOT: 10+ holders in 10min OR motionScore >90
// - → CLOSING: <6h remaining OR slots filled
// - → CLOSED: 72h elapsed OR manually closed

// State: HOT
// Features:
// - Featured on homepage
// - Raid boost applied (+5 Motion to boosters)
// - 24h extension available (one-time)
// Transitions:
// - → CLOSING: <6h remaining
// - → CLOSED: 72h (+24h ext) elapsed

// State: CLOSING
// Features:
// - "Final Call" badge
// - Last slot = 2x Motion weight
// Transitions:
// - → CLOSED: All slots filled OR timer expires

// State: CLOSED
// Processing:
// 1. Process refunds (activity check)
//    - activityCount ≥ 2 → refund deposit
//    - activityCount < 2 → forfeit to vault
// 2. Distribute curator bonuses
//    - Successful room → bond + 10% bonus
//    - Failed room → slash 20%
// 3. Mint SBTs (non-transferable proofs)
//    - Accepted applicants get "Contributor" SBT
//    - Founder gets "Room Creator" SBT
// 4. Archive room
// Transitions:
// - → ARCHIVED: All processing complete

// State: ARCHIVED
// Features:
// - Read-only mode
// - Recap thread shareable
// - Historical data preserved
```

**State Machine Implementation:**

```typescript
// lib/blast/state-machine.ts

type RoomStatus = 'open' | 'hot' | 'closing' | 'closed' | 'archived'

interface StateTransition {
  from: RoomStatus
  to: RoomStatus
  condition: (room: BlastRoom) => boolean
  action: (room: BlastRoom) => Promise<void>
}

const TRANSITIONS: StateTransition[] = [
  // OPEN → HOT
  {
    from: 'open',
    to: 'hot',
    condition: (room) => {
      const recentBoosts = room.raidBoostBy.filter(
        b => b.timestamp > Date.now() - 10 * 60 * 1000 // 10 min
      ).length
      return recentBoosts >= 10 || room.motionScore > 90
    },
    action: async (room) => {
      await updateRoom(room.$id, {
        status: 'hot',
        raidBoostActive: true,
        raidBoostAt: new Date().toISOString(),
      })
      await notifyFounder(room.founderId, 'room_hot', room.$id)
    },
  },

  // OPEN → CLOSING
  {
    from: 'open',
    to: 'closing',
    condition: (room) => {
      const hoursLeft = (new Date(room.endTime).getTime() - Date.now()) / (1000 * 60 * 60)
      return hoursLeft < 6 || room.filledSlots >= room.totalSlots
    },
    action: async (room) => {
      await updateRoom(room.$id, { status: 'closing' })
      await notifyApplicants(room.$id, 'final_call')
    },
  },

  // HOT/CLOSING → CLOSED
  {
    from: ['hot', 'closing'],
    to: 'closed',
    condition: (room) => {
      return new Date(room.endTime) < new Date() || room.filledSlots >= room.totalSlots
    },
    action: async (room) => {
      await closeRoom(room.$id)
    },
  },

  // CLOSED → ARCHIVED
  {
    from: 'closed',
    to: 'archived',
    condition: (room) => {
      // Check if all processing complete
      return room.refundsProcessed && room.sbtsMinited && room.curatorsRewarded
    },
    action: async (room) => {
      await updateRoom(room.$id, { status: 'archived' })
      await generateRecapThread(room.$id)
    },
  },
]

async function processStateTransitions(roomId: string) {
  const room = await getRoom(roomId)

  for (const transition of TRANSITIONS) {
    if (transition.from === room.status || transition.from.includes(room.status)) {
      if (transition.condition(room)) {
        await transition.action(room)
        break // One transition per call
      }
    }
  }
}
```

---

## 3. Motion Score Calculation Engine

**Formula:**

```
Score(t) = Σ (weight_i × count_i × e^(-Δt_i / τ))

Where:
- weight_i = importance of event type (1-10)
- count_i = number of that event type
- Δt_i = hours since most recent event of that type
- τ = decay constant (72 hours = 3 days)
- e = Euler's number (2.71828...)
```

**Implementation:**

```typescript
// lib/blast/motion-score.ts

interface MotionScoreConfig {
  tau: number                    // Decay constant (hours)
  maxScore: number               // Cap at 100
  eventWeights: Record<string, number>
}

const CONFIG: MotionScoreConfig = {
  tau: 72,                       // 3-day half-life
  maxScore: 100,
  eventWeights: {
    holder_growth: 8,
    key_buys: 7,
    applies: 4,
    accepted_intros: 9,
    completed_bounties: 10,
    curator_votes: 5,
    room_attendance: 3,
    task_completions: 5,
    referrals: 6,
    watchtime: 2,
    dm_accepted: 4,
    raid_boost: 6,
    streak_complete: 5,
  },
}

async function calculateMotionScore(userId: string): Promise<number> {
  // Fetch all events for user
  const events = await databases.listDocuments(
    DATABASE_ID,
    'blast_events',
    [
      Query.equal('actorId', userId),
      Query.limit(1000),
      Query.orderDesc('timestamp'),
    ]
  )

  const now = Date.now()
  let totalScore = 0

  // Group events by type
  const eventsByType: Record<string, any[]> = {}
  for (const event of events.documents) {
    if (!eventsByType[event.type]) {
      eventsByType[event.type] = []
    }
    eventsByType[event.type].push(event)
  }

  // Calculate score for each event type
  for (const [type, typeEvents] of Object.entries(eventsByType)) {
    const weight = CONFIG.eventWeights[type] || 1
    const count = typeEvents.length

    // Use most recent event for decay calculation
    const mostRecentEvent = typeEvents[0]
    const eventTime = new Date(mostRecentEvent.timestamp).getTime()
    const hoursElapsed = (now - eventTime) / (1000 * 60 * 60)

    // Apply exponential decay
    const decayFactor = Math.exp(-hoursElapsed / CONFIG.tau)

    // Add to total
    const contribution = weight * count * decayFactor
    totalScore += contribution
  }

  // Normalize to 0-100 scale
  const normalizedScore = Math.min(totalScore, CONFIG.maxScore)

  return Math.round(normalizedScore * 100) / 100
}

async function updateMotionScore(userId: string): Promise<void> {
  const score = await calculateMotionScore(userId)

  // Update motion_scores collection
  await databases.updateDocument(
    DATABASE_ID,
    'blast_motion_scores',
    userId,
    {
      currentScore: score,
      lastDecayAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  )

  // Update signals breakdown (for UI display)
  const signals = await calculateSignalBreakdown(userId)
  await databases.updateDocument(
    DATABASE_ID,
    'blast_motion_scores',
    userId,
    { signals }
  )
}

async function calculateSignalBreakdown(userId: string): Promise<object> {
  const events = await databases.listDocuments(
    DATABASE_ID,
    'blast_events',
    [
      Query.equal('actorId', userId),
      Query.limit(1000),
    ]
  )

  const breakdown: Record<string, number> = {}

  for (const eventType of Object.keys(CONFIG.eventWeights)) {
    const typeEvents = events.documents.filter(e => e.type === eventType)
    breakdown[eventType] = typeEvents.length
  }

  return breakdown
}

// Real-time update on new event
export async function recordEvent(
  type: string,
  actorId: string,
  metadata: object,
  weight?: number
): Promise<void> {
  // Create event
  await databases.createDocument(
    DATABASE_ID,
    'blast_events',
    ID.unique(),
    {
      type,
      actorId,
      weight: weight || CONFIG.eventWeights[type] || 1,
      decayRate: CONFIG.tau,
      metadata,
      timestamp: new Date().toISOString(),
    }
  )

  // Trigger Motion Score recalculation
  await updateMotionScore(actorId)
}
```

**Background Job (Every 15 min):**

```typescript
// scripts/cron/update-motion-scores.ts

async function updateAllMotionScores() {
  console.log('[CRON] Updating Motion Scores...')

  // Get all users (paginated)
  let offset = 0
  const limit = 100

  while (true) {
    const users = await databases.listDocuments(
      DATABASE_ID,
      'users',
      [
        Query.limit(limit),
        Query.offset(offset),
      ]
    )

    if (users.documents.length === 0) break

    // Process in parallel (chunks of 10)
    const chunks = chunkArray(users.documents, 10)
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(user => updateMotionScore(user.$id))
      )
    }

    offset += limit
  }

  console.log('[CRON] Motion Scores updated!')
}

// Run every 15 minutes
setInterval(updateAllMotionScores, 15 * 60 * 1000)
```

---

## 4. Priority Queue Algorithm

**Formula:**

```
priorityScore = (keysStaked × 10) + (motionScore × 2) + (activityBonus × 5) + (referralBonus × 3)

Where:
- keysStaked: 0-10 extra keys for priority
- motionScore: current user Motion Score (0-100)
- activityBonus: messages/actions in room (max 10)
- referralBonus: brought new holders (max 5)
```

**Implementation:**

```typescript
// lib/blast/priority-queue.ts

interface PriorityFactors {
  keysStaked: number             // 0-10
  motionScore: number            // 0-100
  activityCount: number          // Messages, reactions
  referralCount: number          // Users referred to room
}

function calculatePriorityScore(factors: PriorityFactors): number {
  const {
    keysStaked,
    motionScore,
    activityCount,
    referralCount,
  } = factors

  // Activity bonus (capped at 10)
  const activityBonus = Math.min(activityCount, 10)

  // Referral bonus (capped at 5)
  const referralBonus = Math.min(referralCount, 5)

  // Weighted sum
  const score =
    (keysStaked * 10) +
    (motionScore * 2) +
    (activityBonus * 5) +
    (referralBonus * 3)

  return Math.round(score * 100) / 100
}

async function updateApplicantPriority(applicantId: string): Promise<void> {
  const applicant = await databases.getDocument(
    DATABASE_ID,
    'blast_applicants',
    applicantId
  )

  // Get user's Motion Score
  const motionScore = await databases.getDocument(
    DATABASE_ID,
    'blast_motion_scores',
    applicant.userId
  )

  // Count referrals to this room
  const referrals = await databases.listDocuments(
    DATABASE_ID,
    'blast_applicants',
    [
      Query.equal('roomId', applicant.roomId),
      Query.equal('referredBy', applicant.userId),
      Query.limit(100),
    ]
  )

  // Calculate priority
  const priorityScore = calculatePriorityScore({
    keysStaked: applicant.keysStaked,
    motionScore: motionScore.currentScore,
    activityCount: applicant.activityCount,
    referralCount: referrals.total,
  })

  // Update applicant
  await databases.updateDocument(
    DATABASE_ID,
    'blast_applicants',
    applicantId,
    { priorityScore }
  )
}

async function getApplicantQueue(roomId: string): Promise<Applicant[]> {
  const applicants = await databases.listDocuments(
    DATABASE_ID,
    'blast_applicants',
    [
      Query.equal('roomId', roomId),
      Query.equal('status', 'pending'),
      Query.orderDesc('priorityScore'),
      Query.limit(100),
    ]
  )

  // Add queue position
  return applicants.documents.map((app, index) => ({
    ...app,
    queuePosition: index + 1,
  }))
}
```

---

## 5. Deposit & Refund Logic

### 5.1 Entry Deposit

```typescript
// lib/blast/deposits.ts

async function applyToRoom(
  roomId: string,
  userId: string,
  keysStaked: number = 0
): Promise<string> {
  const room = await getRoom(roomId)
  const vault = await getVault(userId)

  // Check balance
  const totalRequired = room.entryDeposit + keysStaked
  if (vault.keyBalance < totalRequired) {
    throw new Error('Insufficient key balance')
  }

  // Lock keys
  await updateVault(userId, {
    keyBalance: vault.keyBalance - totalRequired,
    lockedKeys: vault.lockedKeys + totalRequired,
  })

  // Create application
  const applicant = await databases.createDocument(
    DATABASE_ID,
    'blast_applicants',
    ID.unique(),
    {
      roomId,
      userId,
      status: 'pending',
      depositAmount: room.entryDeposit,
      keysStaked,
      activityCount: 0,
      appliedAt: new Date().toISOString(),
    }
  )

  // Update room metrics
  await updateRoom(roomId, {
    applicantCount: room.applicantCount + 1,
  })

  // Record event
  await recordEvent('applies', userId, { roomId }, 4)

  return applicant.$id
}

async function processRefund(applicantId: string): Promise<void> {
  const applicant = await databases.getDocument(
    DATABASE_ID,
    'blast_applicants',
    applicantId
  )

  // Check refund eligibility
  const isEligible = applicant.activityCount >= 2

  if (isEligible) {
    // Refund deposit + staked keys
    const vault = await getVault(applicant.userId)
    const refundAmount = applicant.depositAmount + applicant.keysStaked

    await updateVault(applicant.userId, {
      keyBalance: vault.keyBalance + refundAmount,
      lockedKeys: vault.lockedKeys - refundAmount,
    })

    await updateApplicant(applicantId, {
      depositRefunded: true,
    })
  } else {
    // Forfeit deposit
    const vault = await getVault(applicant.userId)
    const forfeitAmount = applicant.depositAmount + applicant.keysStaked

    // Unlock (but not refund)
    await updateVault(applicant.userId, {
      lockedKeys: vault.lockedKeys - forfeitAmount,
    })

    // Distribute to curators + rewards pool
    await distributeForfeit(applicant.roomId, forfeitAmount)

    await updateApplicant(applicantId, {
      depositForfeit: true,
    })
  }
}
```

### 5.2 Curator Bond

```typescript
async function stakeCurator(
  roomId: string,
  userId: string,
  bondAmount: number
): Promise<void> {
  const room = await getRoom(roomId)

  // Validate bond amount
  if (bondAmount < room.minKeyToCurate || bondAmount > 25) {
    throw new Error('Invalid bond amount (5-25 keys)')
  }

  const vault = await getVault(userId)
  if (vault.keyBalance < bondAmount) {
    throw new Error('Insufficient balance')
  }

  // Lock keys
  await updateVault(userId, {
    keyBalance: vault.keyBalance - bondAmount,
    lockedKeys: vault.lockedKeys + bondAmount,
  })

  // Create curator entry
  await databases.createDocument(
    DATABASE_ID,
    'blast_curators',
    ID.unique(),
    {
      roomId,
      userId,
      bondAmount,
      bondLocked: true,
      status: 'active',
      upvotes: 0,
      downvotes: 0,
      accuracyScore: 50, // Start neutral
      stakedAt: new Date().toISOString(),
    }
  )

  // Update room
  await updateRoom(roomId, {
    totalStaked: room.totalStaked + bondAmount,
  })

  // Record event
  await recordEvent('curator_votes', userId, { roomId }, 5)
}

async function rewardCurator(curatorId: string): Promise<void> {
  const curator = await databases.getDocument(
    DATABASE_ID,
    'blast_curators',
    curatorId
  )

  const room = await getRoom(curator.roomId)

  // Determine bonus based on room success
  let bonusMultiplier = 1.0
  if (room.motionScore > 80) {
    bonusMultiplier = 1.1 // 10% bonus
  }

  const totalReturn = curator.bondAmount * bonusMultiplier

  // Unlock + bonus
  const vault = await getVault(curator.userId)
  await updateVault(curator.userId, {
    keyBalance: vault.keyBalance + totalReturn,
    lockedKeys: vault.lockedKeys - curator.bondAmount,
    fromCurating: vault.fromCurating + (totalReturn - curator.bondAmount),
  })

  await databases.updateDocument(
    DATABASE_ID,
    'blast_curators',
    curatorId,
    {
      bonusEarned: totalReturn - curator.bondAmount,
      status: 'completed',
      unstakedAt: new Date().toISOString(),
    }
  )
}

async function slashCurator(curatorId: string, reason: string): Promise<void> {
  const curator = await databases.getDocument(
    DATABASE_ID,
    'blast_curators',
    curatorId
  )

  const slashAmount = curator.bondAmount * 0.2 // 20% slash
  const returnAmount = curator.bondAmount - slashAmount

  // Return remaining
  const vault = await getVault(curator.userId)
  await updateVault(curator.userId, {
    keyBalance: vault.keyBalance + returnAmount,
    lockedKeys: vault.lockedKeys - curator.bondAmount,
  })

  // Burn slashed amount or add to rewards pool
  await addToRewardsPool(slashAmount)

  await databases.updateDocument(
    DATABASE_ID,
    'blast_curators',
    curatorId,
    {
      slashedAmount,
      status: 'slashed',
      unstakedAt: new Date().toISOString(),
    }
  )
}
```

### 5.3 DM Request Deposit

```typescript
async function sendDMRequest(
  fromUserId: string,
  toUserId: string,
  message: string
): Promise<void> {
  const vault = await getVault(fromUserId)

  // Check Hall Pass (10 accepts in 7 days = free DM)
  const hasHallPass = await checkHallPass(fromUserId)

  const depositAmount = hasHallPass ? 0 : 0.02

  if (!hasHallPass && vault.keyBalance < depositAmount) {
    throw new Error('Insufficient balance')
  }

  // Lock deposit (if required)
  if (!hasHallPass) {
    await updateVault(fromUserId, {
      keyBalance: vault.keyBalance - depositAmount,
      lockedKeys: vault.lockedKeys + depositAmount,
    })
  }

  // Create request
  await databases.createDocument(
    DATABASE_ID,
    'blast_dm_requests',
    ID.unique(),
    {
      fromUserId,
      toUserId,
      message,
      depositAmount,
      status: 'pending',
      hallPassUsed: hasHallPass,
      refunded: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  )
}

async function acceptDMRequest(requestId: string): Promise<string> {
  const request = await databases.getDocument(
    DATABASE_ID,
    'blast_dm_requests',
    requestId
  )

  // Create DM thread
  const threadId = await createChatThread([request.fromUserId, request.toUserId])

  if (!request.hallPassUsed && request.depositAmount > 0) {
    // Split deposit: 50% burned to vault, 50% to recipient
    const burnAmount = request.depositAmount * 0.5
    const bonusAmount = request.depositAmount * 0.5

    // Unlock from sender
    const senderVault = await getVault(request.fromUserId)
    await updateVault(request.fromUserId, {
      lockedKeys: senderVault.lockedKeys - request.depositAmount,
    })

    // Bonus to recipient
    const recipientVault = await getVault(request.toUserId)
    await updateVault(request.toUserId, {
      keyBalance: recipientVault.keyBalance + bonusAmount,
    })

    // Burn to vault (global rewards pool)
    await addToRewardsPool(burnAmount)
  }

  // Update request
  await databases.updateDocument(
    DATABASE_ID,
    'blast_dm_requests',
    requestId,
    {
      status: 'accepted',
      dmThreadId: threadId,
      respondedAt: new Date().toISOString(),
    }
  )

  // Record event
  await recordEvent('dm_accepted', request.toUserId, { requestId }, 4)

  return threadId
}

async function declineDMRequest(requestId: string): Promise<void> {
  const request = await databases.getDocument(
    DATABASE_ID,
    'blast_dm_requests',
    requestId
  )

  // Refund deposit
  if (!request.hallPassUsed && request.depositAmount > 0) {
    const vault = await getVault(request.fromUserId)
    await updateVault(request.fromUserId, {
      keyBalance: vault.keyBalance + request.depositAmount,
      lockedKeys: vault.lockedKeys - request.depositAmount,
    })
  }

  await databases.updateDocument(
    DATABASE_ID,
    'blast_dm_requests',
    requestId,
    {
      status: 'declined',
      refunded: true,
      respondedAt: new Date().toISOString(),
    }
  )
}
```

---

## 6. Smart Matching Algorithm

**Formula:**

```
matchScore = (tagOverlap × 5) + (timezoneMatch × 3) + (sharedHolders × 4) + (complementarySkills × 6)

Where:
- tagOverlap: count of matching interest tags
- timezoneMatch: ±3h = 3pts, same = 5pts
- sharedHolders: mutual key holders
- complementarySkills: needed skills match offered skills
```

**Implementation:**

```typescript
// lib/blast/smart-match.ts

interface MatchCriteria {
  userId: string
  tags: string[]                 // Interests: ["DeFi", "AI", "Gaming"]
  timezone: string               // "America/New_York"
  skills: {
    offered: string[]            // ["React", "Solidity"]
    needed: string[]             // ["Design", "Marketing"]
  }
}

interface MatchResult {
  userId: string
  matchScore: number             // 0-100
  breakdown: {
    tagOverlap: number
    timezoneMatch: number
    sharedHolders: number
    complementarySkills: number
  }
}

async function getSmartMatches(criteria: MatchCriteria): Promise<MatchResult[]> {
  // Get all users (exclude self)
  const allUsers = await databases.listDocuments(
    DATABASE_ID,
    'users',
    [
      Query.notEqual('$id', criteria.userId),
      Query.limit(1000),
    ]
  )

  const matches: MatchResult[] = []

  for (const user of allUsers.documents) {
    const score = await calculateMatchScore(criteria, user)
    matches.push(score)
  }

  // Sort by score descending
  matches.sort((a, b) => b.matchScore - a.matchScore)

  // Return top 10
  return matches.slice(0, 10)
}

async function calculateMatchScore(
  criteria: MatchCriteria,
  targetUser: any
): Promise<MatchResult> {
  let breakdown = {
    tagOverlap: 0,
    timezoneMatch: 0,
    sharedHolders: 0,
    complementarySkills: 0,
  }

  // 1. Tag Overlap (max 20 points: 5 × 4 tags)
  const targetTags = targetUser.tags || []
  const overlap = criteria.tags.filter(tag => targetTags.includes(tag))
  breakdown.tagOverlap = overlap.length * 5

  // 2. Timezone Match (max 5 points)
  const targetTz = targetUser.timezone
  if (targetTz) {
    const hoursDiff = getTimezoneDiff(criteria.timezone, targetTz)
    if (hoursDiff === 0) {
      breakdown.timezoneMatch = 5
    } else if (hoursDiff <= 3) {
      breakdown.timezoneMatch = 3
    }
  }

  // 3. Shared Holders (max 20 points: 4 × 5 shared)
  const sharedHolders = await getSharedHolders(criteria.userId, targetUser.$id)
  breakdown.sharedHolders = Math.min(sharedHolders, 5) * 4

  // 4. Complementary Skills (max 18 points: 6 × 3 skills)
  const targetSkillsOffered = targetUser.skillsOffered || []
  const skillMatches = criteria.skills.needed.filter(
    skill => targetSkillsOffered.includes(skill)
  )
  breakdown.complementarySkills = Math.min(skillMatches.length, 3) * 6

  // Total score (max ~63, normalize to 100)
  const rawScore =
    breakdown.tagOverlap +
    breakdown.timezoneMatch +
    breakdown.sharedHolders +
    breakdown.complementarySkills

  const matchScore = Math.min(Math.round((rawScore / 63) * 100), 100)

  return {
    userId: targetUser.$id,
    matchScore,
    breakdown,
  }
}

async function getSharedHolders(userA: string, userB: string): Promise<number> {
  // Get curves where both users hold tokens
  const userAHoldings = await databases.listDocuments(
    DATABASE_ID,
    'curve_holders',
    [
      Query.equal('userId', userA),
      Query.greaterThan('tokenBalance', 0),
      Query.limit(100),
    ]
  )

  const userBHoldings = await databases.listDocuments(
    DATABASE_ID,
    'curve_holders',
    [
      Query.equal('userId', userB),
      Query.greaterThan('tokenBalance', 0),
      Query.limit(100),
    ]
  )

  const userACurves = new Set(userAHoldings.documents.map(h => h.curveAddress))
  const userBCurves = new Set(userBHoldings.documents.map(h => h.curveAddress))

  // Count intersections
  const shared = [...userACurves].filter(c => userBCurves.has(c))
  return shared.length
}

function getTimezoneDiff(tzA: string, tzB: string): number {
  const now = new Date()
  const dateA = new Date(now.toLocaleString('en-US', { timeZone: tzA }))
  const dateB = new Date(now.toLocaleString('en-US', { timeZone: tzB }))
  const diff = Math.abs(dateA.getTime() - dateB.getTime())
  return Math.round(diff / (1000 * 60 * 60)) // Hours
}
```

---

## 7. Escrow & Milestones

```typescript
// lib/blast/escrow.ts

interface Milestone {
  id: string
  description: string
  amount: number                 // Portion of total
  deadline?: string
  status: 'pending' | 'submitted' | 'approved' | 'rejected'
  proofUrl?: string
  submittedAt?: string
  reviewedAt?: string
}

async function createEscrow(
  roomId: string,
  founderId: string,
  contributorId: string,
  totalAmount: number,
  currency: 'USDC' | 'SOL' | 'keys',
  milestones: Omit<Milestone, 'id' | 'status'>[]
): Promise<string> {
  // Validate funds
  if (currency === 'keys') {
    const vault = await getVault(founderId)
    if (vault.keyBalance < totalAmount) {
      throw new Error('Insufficient key balance')
    }
  }

  // Lock funds
  if (currency === 'keys') {
    const vault = await getVault(founderId)
    await updateVault(founderId, {
      keyBalance: vault.keyBalance - totalAmount,
      lockedKeys: vault.lockedKeys + totalAmount,
    })
  }
  // For USDC/SOL: integrate with Solana escrow program

  // Create escrow
  const escrow = await databases.createDocument(
    DATABASE_ID,
    'blast_escrows',
    ID.unique(),
    {
      roomId,
      founderId,
      contributorId,
      totalAmount,
      currency,
      milestones: milestones.map((m, i) => ({
        ...m,
        id: `milestone_${i}`,
        status: 'pending',
      })),
      status: 'active',
      currentMilestone: 0,
      arbitrationFee: 0.03,
      createdAt: new Date().toISOString(),
    }
  )

  return escrow.$id
}

async function submitMilestone(
  escrowId: string,
  milestoneId: string,
  proofUrl: string
): Promise<void> {
  const escrow = await databases.getDocument(
    DATABASE_ID,
    'blast_escrows',
    escrowId
  )

  const milestones = escrow.milestones.map((m: Milestone) => {
    if (m.id === milestoneId) {
      return {
        ...m,
        status: 'submitted',
        proofUrl,
        submittedAt: new Date().toISOString(),
      }
    }
    return m
  })

  await databases.updateDocument(
    DATABASE_ID,
    'blast_escrows',
    escrowId,
    {
      milestones,
      status: 'milestone_pending',
    }
  )

  // Notify founder
  await notifyUser(escrow.founderId, 'milestone_submitted', escrowId)
}

async function approveMilestone(
  escrowId: string,
  milestoneId: string
): Promise<void> {
  const escrow = await databases.getDocument(
    DATABASE_ID,
    'blast_escrows',
    escrowId
  )

  const milestone = escrow.milestones.find((m: Milestone) => m.id === milestoneId)
  if (!milestone) throw new Error('Milestone not found')

  // Release funds
  if (escrow.currency === 'keys') {
    const founderVault = await getVault(escrow.founderId)
    const contributorVault = await getVault(escrow.contributorId)

    await updateVault(escrow.founderId, {
      lockedKeys: founderVault.lockedKeys - milestone.amount,
    })

    await updateVault(escrow.contributorId, {
      keyBalance: contributorVault.keyBalance + milestone.amount,
      fromEscrows: contributorVault.fromEscrows + milestone.amount,
    })
  }

  // Update milestone
  const milestones = escrow.milestones.map((m: Milestone) => {
    if (m.id === milestoneId) {
      return {
        ...m,
        status: 'approved',
        reviewedAt: new Date().toISOString(),
      }
    }
    return m
  })

  // Check if all milestones complete
  const allComplete = milestones.every((m: Milestone) => m.status === 'approved')

  await databases.updateDocument(
    DATABASE_ID,
    'blast_escrows',
    escrowId,
    {
      milestones,
      status: allComplete ? 'completed' : 'active',
      currentMilestone: escrow.currentMilestone + 1,
      completedAt: allComplete ? new Date().toISOString() : undefined,
    }
  )

  // Record event
  await recordEvent('completed_bounties', escrow.contributorId, { escrowId }, 10)
}

async function disputeEscrow(
  escrowId: string,
  disputedBy: 'founder' | 'contributor',
  reason: string
): Promise<void> {
  const escrow = await databases.getDocument(
    DATABASE_ID,
    'blast_escrows',
    escrowId
  )

  // Charge dispute fee
  const disputerId = disputedBy === 'founder' ? escrow.founderId : escrow.contributorId
  const vault = await getVault(disputerId)

  if (vault.keyBalance < 0.03) {
    throw new Error('Insufficient balance for dispute fee')
  }

  await updateVault(disputerId, {
    keyBalance: vault.keyBalance - 0.03,
  })

  // Assign arbitrator (high Motion Score curator)
  const arbitrator = await findArbitrator()

  await databases.updateDocument(
    DATABASE_ID,
    'blast_escrows',
    escrowId,
    {
      status: 'disputed',
      disputeReason: reason,
      disputedBy,
      arbitratorId: arbitrator.$id,
      disputedAt: new Date().toISOString(),
    }
  )

  // Notify arbitrator
  await notifyUser(arbitrator.$id, 'arbitration_assigned', escrowId)
}

async function resolveDispute(
  escrowId: string,
  decision: 'full_pay' | 'partial_pay' | 'refund',
  notes: string
): Promise<void> {
  const escrow = await databases.getDocument(
    DATABASE_ID,
    'blast_escrows',
    escrowId
  )

  // Execute decision
  const remainingAmount = escrow.totalAmount - getTotalReleased(escrow.milestones)

  if (decision === 'full_pay') {
    // Pay contributor
    await releaseEscrow(escrow.contributorId, remainingAmount, escrow.currency)
  } else if (decision === 'refund') {
    // Refund founder
    await releaseEscrow(escrow.founderId, remainingAmount, escrow.currency)
  } else {
    // Partial: split 50/50
    const half = remainingAmount / 2
    await releaseEscrow(escrow.contributorId, half, escrow.currency)
    await releaseEscrow(escrow.founderId, half, escrow.currency)
  }

  // Pay arbitrator fee (loser pays)
  const loser = decision === 'full_pay' ? escrow.founderId : escrow.contributorId
  const arbitratorVault = await getVault(escrow.arbitratorId)

  await updateVault(escrow.arbitratorId, {
    keyBalance: arbitratorVault.keyBalance + 0.03,
  })

  await databases.updateDocument(
    DATABASE_ID,
    'blast_escrows',
    escrowId,
    {
      status: 'completed',
      arbitrationDecision: decision,
      arbitrationNotes: notes,
      resolvedAt: new Date().toISOString(),
    }
  )
}

async function findArbitrator(): Promise<any> {
  // Get top Motion Score curators
  const curators = await databases.listDocuments(
    DATABASE_ID,
    'blast_motion_scores',
    [
      Query.greaterThan('currentScore', 80),
      Query.orderDesc('currentScore'),
      Query.limit(10),
    ]
  )

  // Random selection from top 10
  const randomIndex = Math.floor(Math.random() * curators.documents.length)
  return curators.documents[randomIndex]
}
```

---

## 8. Viral Mechanics Implementation

### 8.1 Raid Boost

```typescript
// lib/blast/viral/raid-boost.ts

async function boostRoom(roomId: string, userId: string): Promise<void> {
  const room = await getRoom(roomId)

  // Add user to boosters
  const boosters = room.raidBoostBy || []
  if (boosters.includes(userId)) {
    throw new Error('Already boosted this room')
  }

  boosters.push(userId)

  // Check if threshold reached (10+ in 10min)
  const recentBoosts = boosters.filter((b: any) => {
    const boostTime = new Date(b.timestamp).getTime()
    const now = Date.now()
    return (now - boostTime) < 10 * 60 * 1000
  })

  const shouldActivateHot = recentBoosts.length >= 10

  // Update room
  await updateRoom(roomId, {
    raidBoostBy: boosters,
    status: shouldActivateHot ? 'hot' : room.status,
    raidBoostActive: shouldActivateHot,
    raidBoostAt: shouldActivateHot ? new Date().toISOString() : room.raidBoostAt,
  })

  // Reward booster (+5 Motion)
  await recordEvent('raid_boost', userId, { roomId }, 6)

  // Notify all applicants if Hot
  if (shouldActivateHot) {
    await notifyRoomParticipants(roomId, 'room_hot')
  }
}
```

### 8.2 Streak Vault

```typescript
// lib/blast/viral/streak-vault.ts

async function recordDailyAction(userId: string, actionType: string): Promise<void> {
  const vault = await getVault(userId)
  const now = new Date()
  const lastAction = vault.lastStreakAction ? new Date(vault.lastStreakAction) : null

  let newStreak = vault.streakDays || 0

  // Check if same day
  if (lastAction) {
    const sameDay = now.toDateString() === lastAction.toDateString()
    if (sameDay) return // Already recorded today

    const nextDay = new Date(lastAction)
    nextDay.setDate(nextDay.getDate() + 1)
    const isConsecutive = now.toDateString() === nextDay.toDateString()

    if (isConsecutive) {
      newStreak += 1
    } else {
      newStreak = 1 // Reset
    }
  } else {
    newStreak = 1
  }

  // Update vault
  await updateVault(userId, {
    streakDays: newStreak,
    lastStreakAction: now.toISOString(),
  })

  // Reward on 7-day streak
  if (newStreak === 7) {
    const bonus = vault.streakVaultAmount * 1.1 // 10% bonus
    await updateVault(userId, {
      keyBalance: vault.keyBalance + bonus,
      streakVaultAmount: 0,
      streakDays: 0,
    })

    await recordEvent('streak_complete', userId, { days: 7 }, 5)
    await notifyUser(userId, 'streak_reward', { amount: bonus })
  }
}
```

### 8.3 Witness-to-Speak

```typescript
// lib/blast/viral/witness-mode.ts

interface WitnessSession {
  userId: string
  roomId: string
  startTime: datetime
  micAccess: boolean
}

const witnessSessions = new Map<string, WitnessSession>()

async function startWitnessing(userId: string, roomId: string): Promise<void> {
  const sessionId = `${userId}_${roomId}`

  witnessSessions.set(sessionId, {
    userId,
    roomId,
    startTime: new Date().toISOString(),
    micAccess: false,
  })

  // Track watchtime
  await recordEvent('watchtime', userId, { roomId }, 2)

  // After 5min, offer mic access
  setTimeout(async () => {
    const session = witnessSessions.get(sessionId)
    if (session) {
      await offerMicAccess(userId, roomId)
    }
  }, 5 * 60 * 1000)
}

async function offerMicAccess(userId: string, roomId: string): Promise<void> {
  // Check if user has 0 keys
  const vault = await getVault(userId)

  if (vault.keyBalance === 0) {
    // Offer: "Buy 1 key for 10 min mic access"
    await notifyUser(userId, 'mic_offer', {
      roomId,
      cost: 1,
      duration: 10,
    })
  }
}

async function grantMicAccess(userId: string, roomId: string): Promise<void> {
  const vault = await getVault(userId)

  if (vault.keyBalance < 1) {
    throw new Error('Insufficient balance')
  }

  // Deduct key
  await updateVault(userId, {
    keyBalance: vault.keyBalance - 1,
  })

  // Grant 10min mic
  const sessionId = `${userId}_${roomId}`
  const session = witnessSessions.get(sessionId)

  if (session) {
    session.micAccess = true
    witnessSessions.set(sessionId, session)

    // Revoke after 10min
    setTimeout(() => {
      const s = witnessSessions.get(sessionId)
      if (s) {
        s.micAccess = false
        witnessSessions.set(sessionId, s)
      }
    }, 10 * 60 * 1000)
  }
}
```

### 8.4 Curator Draft

```typescript
// lib/blast/viral/curator-draft.ts

async function draftApplicant(
  roomId: string,
  curatorId: string,
  applicantId: string
): Promise<void> {
  const curator = await databases.listDocuments(
    DATABASE_ID,
    'blast_curators',
    [
      Query.equal('roomId', roomId),
      Query.equal('userId', curatorId),
      Query.limit(1),
    ]
  )

  if (curator.total === 0) {
    throw new Error('Not a curator')
  }

  // Check if curator already drafted
  if (curator.documents[0].hasDrafted) {
    throw new Error('Already used draft pick')
  }

  // Force-accept applicant
  await acceptApplicant(roomId, applicantId)

  // Mark curator as used draft
  await databases.updateDocument(
    DATABASE_ID,
    'blast_curators',
    curator.documents[0].$id,
    { hasDrafted: true }
  )

  await notifyUser(applicantId, 'drafted_by_curator', { curatorId })
}
```

### 8.5 Flash Airdrop

```typescript
// lib/blast/viral/flash-airdrop.ts

async function checkFlashAirdrop(roomId: string): Promise<void> {
  const room = await getRoom(roomId)

  if (room.motionScore >= 95 && !room.flashAirdropTriggered) {
    // Get all current applicants
    const applicants = await databases.listDocuments(
      DATABASE_ID,
      'blast_applicants',
      [
        Query.equal('roomId', roomId),
        Query.equal('status', ['pending', 'accepted']),
        Query.limit(100),
      ]
    )

    // Distribute points
    const pointsPerUser = 100

    for (const app of applicants.documents) {
      const vault = await getVault(app.userId)
      await updateVault(app.userId, {
        pointsBalance: vault.pointsBalance + pointsPerUser,
      })
    }

    // Mark as triggered
    await updateRoom(roomId, {
      flashAirdropTriggered: true,
    })

    await notifyRoomParticipants(roomId, 'flash_airdrop', { points: pointsPerUser })
  }
}
```

### 8.6 Hall Pass

```typescript
// lib/blast/viral/hall-pass.ts

async function checkHallPass(userId: string): Promise<boolean> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // Count accepted DM requests in last 7 days
  const accepted = await databases.listDocuments(
    DATABASE_ID,
    'blast_dm_requests',
    [
      Query.equal('toUserId', userId),
      Query.equal('status', 'accepted'),
      Query.greaterThan('respondedAt', sevenDaysAgo.toISOString()),
      Query.limit(100),
    ]
  )

  return accepted.total >= 10
}
```

---

## 9. API Endpoints

### 9.1 Room APIs

```typescript
// app/api/blast/rooms/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { databases, DATABASE_ID } from '@/lib/appwrite/client'
import { Query, ID } from 'node-appwrite'

// POST /api/blast/rooms - Create room
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, type, title, description, tags, totalSlots, metadata } = body

    // Validate user has min keys
    const vault = await getVault(userId)
    const room = await getDefaultRoomConfig(type)

    if (vault.keyBalance < room.minKeyToOpen) {
      return NextResponse.json(
        { error: 'Insufficient keys to create room' },
        { status: 400 }
      )
    }

    // Create room
    const newRoom = await databases.createDocument(
      DATABASE_ID,
      'blast_rooms',
      ID.unique(),
      {
        type,
        founderId: userId,
        title,
        description,
        tags,
        totalSlots: totalSlots || 10,
        filledSlots: 0,
        minKeyToApply: room.minKeyToApply,
        minKeyToCurate: room.minKeyToCurate,
        minKeyToOpen: room.minKeyToOpen,
        entryDeposit: 1,
        curatorBond: 5,
        totalStaked: 0,
        status: 'open',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        extended: false,
        motionScore: 0,
        applicantCount: 0,
        acceptedCount: 0,
        rejectedCount: 0,
        watcherCount: 0,
        messageCount: 0,
        raidBoostActive: false,
        raidBoostBy: [],
        metadata: metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    )

    // Record event
    await recordEvent('room_created', userId, { roomId: newRoom.$id }, 5)

    return NextResponse.json(newRoom)
  } catch (error) {
    console.error('[POST /api/blast/rooms]', error)
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 })
  }
}

// GET /api/blast/rooms - List rooms
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status') || 'open'
    const sort = searchParams.get('sort') || 'motionScore'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const queries: string[] = [
      Query.equal('status', status),
      Query.limit(limit),
      Query.offset(offset),
    ]

    if (type) {
      queries.push(Query.equal('type', type))
    }

    if (sort === 'motionScore') {
      queries.push(Query.orderDesc('motionScore'))
    } else if (sort === 'recent') {
      queries.push(Query.orderDesc('createdAt'))
    } else if (sort === 'closing') {
      queries.push(Query.orderAsc('endTime'))
    }

    const rooms = await databases.listDocuments(
      DATABASE_ID,
      'blast_rooms',
      queries
    )

    return NextResponse.json(rooms)
  } catch (error) {
    console.error('[GET /api/blast/rooms]', error)
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
  }
}
```

```typescript
// app/api/blast/rooms/[id]/route.ts

// GET /api/blast/rooms/:id - Get room details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const room = await databases.getDocument(
      DATABASE_ID,
      'blast_rooms',
      params.id
    )

    // Increment view count
    await databases.updateDocument(
      DATABASE_ID,
      'blast_rooms',
      params.id,
      { watcherCount: room.watcherCount + 1 }
    )

    return NextResponse.json(room)
  } catch (error) {
    console.error('[GET /api/blast/rooms/:id]', error)
    return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  }
}
```

```typescript
// app/api/blast/rooms/[id]/apply/route.ts

// POST /api/blast/rooms/:id/apply - Apply to room
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { userId, message, keysStaked, skills, attachments } = body

    const applicantId = await applyToRoom(
      params.id,
      userId,
      message,
      keysStaked,
      skills,
      attachments
    )

    return NextResponse.json({ applicantId })
  } catch (error) {
    console.error('[POST /api/blast/rooms/:id/apply]', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
```

```typescript
// app/api/blast/rooms/[id]/close/route.ts

// POST /api/blast/rooms/:id/close - Founder closes room
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { userId } = body

    const room = await getRoom(params.id)

    if (room.founderId !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    await closeRoom(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST /api/blast/rooms/:id/close]', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
```

### 9.2 Applicant APIs

```typescript
// app/api/blast/rooms/[id]/applicants/route.ts

// GET /api/blast/rooms/:id/applicants - Get applicant queue
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicants = await getApplicantQueue(params.id)

    return NextResponse.json(applicants)
  } catch (error) {
    console.error('[GET /api/blast/rooms/:id/applicants]', error)
    return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 })
  }
}
```

```typescript
// app/api/blast/rooms/[id]/accept/[userId]/route.ts

// POST /api/blast/rooms/:id/accept/:userId - Accept applicant
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const body = await req.json()
    const { founderId } = body

    await acceptApplicant(params.id, params.userId, founderId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST /api/blast/rooms/:id/accept/:userId]', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
```

### 9.3 DM Market APIs

```typescript
// app/api/blast/dm/request/route.ts

// POST /api/blast/dm/request - Send DM request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fromUserId, toUserId, message } = body

    await sendDMRequest(fromUserId, toUserId, message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST /api/blast/dm/request]', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
```

```typescript
// app/api/blast/dm/[id]/accept/route.ts

// POST /api/blast/dm/:id/accept - Accept DM request
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const threadId = await acceptDMRequest(params.id)

    return NextResponse.json({ threadId })
  } catch (error) {
    console.error('[POST /api/blast/dm/:id/accept]', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
```

### 9.4 Motion Score APIs

```typescript
// app/api/blast/motion/[userId]/route.ts

// GET /api/blast/motion/:userId - Get Motion Score
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const score = await databases.getDocument(
      DATABASE_ID,
      'blast_motion_scores',
      params.userId
    )

    return NextResponse.json(score)
  } catch (error) {
    console.error('[GET /api/blast/motion/:userId]', error)
    return NextResponse.json({ error: 'Score not found' }, { status: 404 })
  }
}
```

```typescript
// app/api/blast/leaderboard/route.ts

// GET /api/blast/leaderboard - Top 100 Motion Scores
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '100')

    const leaderboard = await databases.listDocuments(
      DATABASE_ID,
      'blast_motion_scores',
      [
        Query.orderDesc('currentScore'),
        Query.limit(limit),
      ]
    )

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('[GET /api/blast/leaderboard]', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
```

### 9.5 Vault APIs

```typescript
// app/api/blast/vault/[userId]/route.ts

// GET /api/blast/vault/:userId - Get vault balances
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const vault = await getVault(params.userId)

    return NextResponse.json(vault)
  } catch (error) {
    console.error('[GET /api/blast/vault/:userId]', error)
    return NextResponse.json({ error: 'Vault not found' }, { status: 404 })
  }
}
```

---

## 10. Real-Time Events (WebSocket)

**Using Appwrite Realtime:**

```typescript
// lib/blast/realtime.ts

import { client } from '@/lib/appwrite/client'

// Subscribe to room updates
export function subscribeToRoom(roomId: string, callback: (data: any) => void) {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.blast_rooms.documents.${roomId}`,
    callback
  )
}

// Subscribe to applicant queue
export function subscribeToApplicants(roomId: string, callback: (data: any) => void) {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.blast_applicants.documents`,
    (response) => {
      if (response.payload.roomId === roomId) {
        callback(response)
      }
    }
  )
}

// Subscribe to Motion Score updates
export function subscribeToMotionScore(userId: string, callback: (data: any) => void) {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.blast_motion_scores.documents.${userId}`,
    callback
  )
}

// Subscribe to vault updates
export function subscribeToVault(userId: string, callback: (data: any) => void) {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.blast_vault.documents.${userId}`,
    callback
  )
}

// Subscribe to leaderboard (top 10 changes)
export function subscribeToLeaderboard(callback: (data: any) => void) {
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.blast_motion_scores.documents`,
    (response) => {
      if (response.payload.currentScore >= 80) {
        callback(response)
      }
    }
  )
}
```

**Frontend Usage:**

```typescript
// components/blast/RoomDetail.tsx

import { useEffect, useState } from 'react'
import { subscribeToRoom, subscribeToApplicants } from '@/lib/blast/realtime'

export function RoomDetail({ roomId }: { roomId: string }) {
  const [room, setRoom] = useState(null)
  const [applicants, setApplicants] = useState([])

  useEffect(() => {
    // Subscribe to room updates
    const unsubscribeRoom = subscribeToRoom(roomId, (response) => {
      setRoom(response.payload)
    })

    // Subscribe to applicant queue
    const unsubscribeApplicants = subscribeToApplicants(roomId, (response) => {
      // Re-fetch queue
      fetchApplicants()
    })

    return () => {
      unsubscribeRoom()
      unsubscribeApplicants()
    }
  }, [roomId])

  // ...
}
```

---

## 11. Background Jobs (Cron)

### 11.1 Motion Score Updates (Every 15 min)

```typescript
// scripts/cron/update-motion-scores.ts

import { updateAllMotionScores } from '@/lib/blast/motion-score'

async function main() {
  console.log('[CRON] Starting Motion Score update...')
  await updateAllMotionScores()
  console.log('[CRON] Motion Score update complete!')
}

// Run every 15 minutes
setInterval(main, 15 * 60 * 1000)
main() // Run immediately
```

### 11.2 Room Deadlines (Every 5 min)

```typescript
// scripts/cron/check-room-deadlines.ts

import { processStateTransitions } from '@/lib/blast/state-machine'
import { databases, DATABASE_ID } from '@/lib/appwrite/client'
import { Query } from 'node-appwrite'

async function main() {
  console.log('[CRON] Checking room deadlines...')

  // Get all active rooms
  const rooms = await databases.listDocuments(
    DATABASE_ID,
    'blast_rooms',
    [
      Query.equal('status', ['open', 'hot', 'closing']),
      Query.limit(100),
    ]
  )

  for (const room of rooms.documents) {
    await processStateTransitions(room.$id)
  }

  console.log('[CRON] Room deadlines checked!')
}

setInterval(main, 5 * 60 * 1000)
main()
```

### 11.3 Process Refunds (Every 5 min)

```typescript
// scripts/cron/process-refunds.ts

import { processRefund } from '@/lib/blast/deposits'
import { databases, DATABASE_ID } from '@/lib/appwrite/client'
import { Query } from 'node-appwrite'

async function main() {
  console.log('[CRON] Processing refunds...')

  // Get closed rooms with unprocessed refunds
  const closedRooms = await databases.listDocuments(
    DATABASE_ID,
    'blast_rooms',
    [
      Query.equal('status', 'closed'),
      Query.equal('refundsProcessed', false),
      Query.limit(50),
    ]
  )

  for (const room of closedRooms.documents) {
    // Get all applicants
    const applicants = await databases.listDocuments(
      DATABASE_ID,
      'blast_applicants',
      [
        Query.equal('roomId', room.$id),
        Query.limit(100),
      ]
    )

    // Process refunds in batches of 10
    for (let i = 0; i < applicants.documents.length; i += 10) {
      const batch = applicants.documents.slice(i, i + 10)
      await Promise.all(
        batch.map(app => processRefund(app.$id))
      )
    }

    // Mark as processed
    await databases.updateDocument(
      DATABASE_ID,
      'blast_rooms',
      room.$id,
      { refundsProcessed: true }
    )
  }

  console.log('[CRON] Refunds processed!')
}

setInterval(main, 5 * 60 * 1000)
main()
```

### 11.4 Expired DM Requests (Every 15 min)

```typescript
// scripts/cron/expire-dm-requests.ts

import { databases, DATABASE_ID } from '@/lib/appwrite/client'
import { Query } from 'node-appwrite'

async function main() {
  console.log('[CRON] Checking expired DM requests...')

  const now = new Date().toISOString()

  const expired = await databases.listDocuments(
    DATABASE_ID,
    'blast_dm_requests',
    [
      Query.equal('status', 'pending'),
      Query.lessThan('expiresAt', now),
      Query.limit(100),
    ]
  )

  for (const request of expired.documents) {
    // Refund deposit
    if (!request.hallPassUsed && request.depositAmount > 0) {
      const vault = await getVault(request.fromUserId)
      await updateVault(request.fromUserId, {
        keyBalance: vault.keyBalance + request.depositAmount,
        lockedKeys: vault.lockedKeys - request.depositAmount,
      })
    }

    // Mark as expired
    await databases.updateDocument(
      DATABASE_ID,
      'blast_dm_requests',
      request.$id,
      {
        status: 'expired',
        refunded: true,
      }
    )
  }

  console.log(`[CRON] ${expired.total} DM requests expired!`)
}

setInterval(main, 15 * 60 * 1000)
main()
```

### 11.5 Motion Score Snapshots (Every hour)

```typescript
// scripts/cron/snapshot-motion-scores.ts

import { databases, DATABASE_ID } from '@/lib/appwrite/client'
import { Query } from 'node-appwrite'

async function main() {
  console.log('[CRON] Creating Motion Score snapshots...')

  const scores = await databases.listDocuments(
    DATABASE_ID,
    'blast_motion_scores',
    [
      Query.limit(1000),
    ]
  )

  for (const score of scores.documents) {
    const history = score.scoreHistory || []

    // Keep last 168 entries (7 days hourly)
    if (history.length >= 168) {
      history.shift() // Remove oldest
    }

    history.push({
      score: score.currentScore,
      timestamp: new Date().toISOString(),
    })

    await databases.updateDocument(
      DATABASE_ID,
      'blast_motion_scores',
      score.$id,
      { scoreHistory: history }
    )
  }

  console.log('[CRON] Snapshots created!')
}

setInterval(main, 60 * 60 * 1000) // Every hour
main()
```

---

## 12. Integration with Existing Systems

### 12.1 Keys (Solana)

**Read on-chain balance → sync with vault:**

```typescript
// lib/blast/sync-keys.ts

import { Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider } from '@coral-xyz/anchor'

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC!)

export async function syncKeysFromChain(userId: string, walletAddress: string): Promise<void> {
  // Get user's key holdings from Solana bonding curve
  const holdings = await getCurveHoldings(walletAddress)

  // Calculate total keys held
  const totalKeys = holdings.reduce((sum, h) => sum + h.balance, 0)

  // Update vault (off-chain tracking)
  const vault = await getVault(userId)

  await updateVault(userId, {
    keyBalance: totalKeys - vault.lockedKeys, // Available = total - locked
  })
}

async function getCurveHoldings(walletAddress: string): Promise<Array<{ curveAddress: string; balance: number }>> {
  // Query Solana program for user's PDA accounts
  // Return array of holdings

  // Placeholder implementation
  return []
}
```

### 12.2 Chat System (Existing)

**Reuse for Deal Room messages:**

```typescript
// lib/blast/chat-integration.ts

import { createChatThread } from '@/lib/chat' // Existing chat system

export async function createRoomChat(roomId: string, participants: string[]): Promise<string> {
  // Create chat thread for room
  const threadId = await createChatThread({
    type: 'blast_room',
    participants,
    metadata: { roomId },
  })

  return threadId
}

export async function sendRoomMessage(
  roomId: string,
  senderId: string,
  content: string
): Promise<void> {
  // Send message to room chat
  await sendMessage(roomId, senderId, content)

  // Increment activity count for sender
  const applicant = await databases.listDocuments(
    DATABASE_ID,
    'blast_applicants',
    [
      Query.equal('roomId', roomId),
      Query.equal('userId', senderId),
      Query.limit(1),
    ]
  )

  if (applicant.total > 0) {
    await databases.updateDocument(
      DATABASE_ID,
      'blast_applicants',
      applicant.documents[0].$id,
      {
        activityCount: applicant.documents[0].activityCount + 1,
        lastActiveAt: new Date().toISOString(),
      }
    )
  }

  // Update room message count
  const room = await getRoom(roomId)
  await updateRoom(roomId, {
    messageCount: room.messageCount + 1,
  })
}
```

### 12.3 Motion Score Component

**Extend existing component:**

```typescript
// components/blast/MotionScoreBadge.tsx

import { useEffect, useState } from 'react'
import { subscribeToMotionScore } from '@/lib/blast/realtime'

interface MotionScoreProps {
  userId: string
  showBreakdown?: boolean
}

export function MotionScoreBadge({ userId, showBreakdown }: MotionScoreProps) {
  const [score, setScore] = useState<any>(null)

  useEffect(() => {
    // Fetch initial score
    fetch(`/api/blast/motion/${userId}`)
      .then(res => res.json())
      .then(setScore)

    // Subscribe to updates
    const unsubscribe = subscribeToMotionScore(userId, (response) => {
      setScore(response.payload)
    })

    return unsubscribe
  }, [userId])

  if (!score) return <div>Loading...</div>

  return (
    <div className="motion-score-badge">
      <div className="score">{score.currentScore}</div>
      <div className="label">Motion Score</div>

      {showBreakdown && (
        <div className="breakdown">
          {Object.entries(score.signals).map(([signal, count]) => (
            <div key={signal}>
              {signal}: {count}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 13. Anti-Abuse Measures

### 13.1 Rate Limits

```typescript
// lib/blast/rate-limit.ts

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

interface RateLimit {
  action: string
  limit: number
  window: number                 // Seconds
}

const LIMITS: Record<string, RateLimit> = {
  apply_to_room: { action: 'apply', limit: 10, window: 3600 },       // 10 per hour
  create_room: { action: 'create', limit: 3, window: 86400 },        // 3 per day
  dm_request: { action: 'dm', limit: 5, window: 86400 },             // 5 per day
  intro_request: { action: 'intro', limit: 3, window: 86400 },       // 3 per day
}

export async function checkRateLimit(
  userId: string,
  action: keyof typeof LIMITS
): Promise<boolean> {
  const config = LIMITS[action]
  const key = `ratelimit:${userId}:${action}`

  const current = await redis.get(key)

  if (current && parseInt(current as string) >= config.limit) {
    return false // Rate limited
  }

  // Increment
  await redis.incr(key)
  await redis.expire(key, config.window)

  return true
}
```

### 13.2 Spam Detection

```typescript
// lib/blast/spam-detection.ts

async function detectSpam(userId: string): Promise<boolean> {
  // Get user's application history
  const applications = await databases.listDocuments(
    DATABASE_ID,
    'blast_applicants',
    [
      Query.equal('userId', userId),
      Query.orderDesc('appliedAt'),
      Query.limit(20),
    ]
  )

  if (applications.total === 0) return false

  // Check acceptance rate
  const accepted = applications.documents.filter(a => a.status === 'accepted').length
  const acceptanceRate = accepted / applications.total

  // If <10% acceptance rate after 20 applications → spam
  if (applications.total >= 20 && acceptanceRate < 0.1) {
    return true
  }

  return false
}

async function shadowDownrank(userId: string): Promise<void> {
  // Reduce priority score multiplier
  const applicants = await databases.listDocuments(
    DATABASE_ID,
    'blast_applicants',
    [
      Query.equal('userId', userId),
      Query.equal('status', 'pending'),
      Query.limit(100),
    ]
  )

  for (const app of applicants.documents) {
    await databases.updateDocument(
      DATABASE_ID,
      'blast_applicants',
      app.$id,
      {
        priorityScore: app.priorityScore * 0.5, // 50% penalty
      }
    )
  }
}
```

### 13.3 Sybil Resistance

```typescript
// lib/blast/sybil-check.ts

async function checkSybil(userId: string): Promise<boolean> {
  const user = await databases.getDocument(DATABASE_ID, 'users', userId)

  // Check key age
  const keyHoldings = await databases.listDocuments(
    DATABASE_ID,
    'curve_holders',
    [
      Query.equal('userId', userId),
      Query.greaterThan('tokenBalance', 0),
      Query.limit(1),
    ]
  )

  if (keyHoldings.total > 0) {
    const firstBuyDate = new Date(keyHoldings.documents[0].firstBuyAt)
    const hoursSinceFirstBuy = (Date.now() - firstBuyDate.getTime()) / (1000 * 60 * 60)

    // Require 24h key age
    if (hoursSinceFirstBuy < 24) {
      return true // Potential sybil
    }
  }

  // Check wallet verification
  if (!user.walletAddress) {
    return true
  }

  return false
}
```

---

## 14. Performance Optimizations

### 14.1 Caching

```typescript
// lib/blast/cache.ts

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

const CACHE_TTL = {
  room_feed: 30,                 // 30s
  motion_score: 300,             // 5min
  leaderboard: 600,              // 10min
  vault: 60,                     // 1min
}

export async function getCachedRoomFeed(cacheKey: string): Promise<any[] | null> {
  const cached = await redis.get(cacheKey)
  return cached ? JSON.parse(cached as string) : null
}

export async function setCachedRoomFeed(cacheKey: string, data: any[]): Promise<void> {
  await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL.room_feed })
}

export async function getCachedMotionScore(userId: string): Promise<any | null> {
  const cached = await redis.get(`motion:${userId}`)
  return cached ? JSON.parse(cached as string) : null
}

export async function setCachedMotionScore(userId: string, score: any): Promise<void> {
  await redis.set(`motion:${userId}`, JSON.stringify(score), { ex: CACHE_TTL.motion_score })
}
```

### 14.2 Database Indexes

**Critical indexes for performance:**

```typescript
// BLAST_ROOMS
- Composite: status + motionScore (DESC)      // For "Hot Now" feed
- Composite: status + endTime (ASC)           // For "Closing Soon"
- Composite: type + status + createdAt (DESC) // Filtered listings

// BLAST_APPLICANTS
- Composite: roomId + status + priorityScore (DESC)  // Priority queue
- Composite: userId + status                          // User's applications

// BLAST_EVENTS
- Composite: actorId + timestamp (DESC)       // User event history

// BLAST_MOTION_SCORES
- currentScore (DESC)                         // Leaderboard
```

### 14.3 Batch Operations

```typescript
// lib/blast/batch-operations.ts

export async function batchUpdateMotionScores(userIds: string[]): Promise<void> {
  // Process in chunks of 10
  const chunks = chunkArray(userIds, 10)

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(userId => updateMotionScore(userId))
    )
  }
}

export async function batchProcessRefunds(applicantIds: string[]): Promise<void> {
  // Process in chunks of 10
  const chunks = chunkArray(applicantIds, 10)

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(id => processRefund(id))
    )
  }
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}
```

---

## 15. Answers to Questions

### Q1: Should escrows use Solana SPL tokens or off-chain USDC?

**Recommendation: Hybrid approach**

- **Keys:** Off-chain (Appwrite vault) for speed & UX
- **USDC/SOL:** On-chain (Solana escrow program) for security & trustlessness

**Rationale:**
- Keys are already tracked off-chain (bonding curve state)
- USDC/SOL escrows should be trustless (smart contract)
- For small amounts (<$100), off-chain is acceptable
- For large amounts (>$1000), on-chain is mandatory

**Implementation:**
- Small escrows (<$100): Appwrite vault (instant, no gas)
- Large escrows (>$1000): Solana SPL Token Program (secure, trustless)

### Q2: How to prevent curator collusion?

**Multi-layer defense:**

1. **Reputation staking:**
   - Curators stake 5-25 keys (skin in the game)
   - Slashed 20% if abuse detected

2. **Community voting:**
   - Room participants can downvote bad curators
   - 3+ downvotes → investigation → slash

3. **Random sampling:**
   - Admin spot-checks 5% of rooms
   - Curators don't know which rooms are audited

4. **Accuracy score:**
   - Track curator performance over time
   - Low accuracy → lose curator privileges

5. **Diversify curators:**
   - Require 3+ curators per room (no single point of failure)
   - Weighted voting (higher stakes = more weight)

### Q3: Should Motion Score decay be per-signal or global?

**Recommendation: Per-signal decay**

**Rationale:**
- More accurate representation of recent activity
- Prevents single old event from dominating score
- Allows for multi-dimensional reputation

**Implementation:**
```typescript
// Per-signal decay
for (const [type, events] of Object.entries(eventsByType)) {
  const mostRecentEvent = events[0] // Latest event of this type
  const hoursElapsed = (now - eventTime) / (1000 * 60 * 60)
  const decayFactor = Math.exp(-hoursElapsed / tau)

  const contribution = weight * events.length * decayFactor
  totalScore += contribution
}
```

This ensures:
- Active users maintain high scores
- Inactive users decay faster
- Recent diverse activity is rewarded

### Q4: Max room lifetime: strict 72h or allow multiple extensions?

**Recommendation: Strict 72h + ONE 24h extension**

**Rationale:**
- Creates urgency (scarcity drives engagement)
- Prevents rooms from becoming stale
- One extension allows for "Hot" rooms to capitalize on momentum
- Multiple extensions dilute the time pressure

**Rules:**
- Extension only available if room hits "Hot" status (motionScore >90 OR raid boost)
- Extension costs 0.05 keys (prevents abuse)
- No extensions after first one (max lifetime: 96h)

### Q5: Should we integrate on-chain voting for high-stakes decisions?

**Recommendation: Yes, for escrow disputes >$1000**

**Implementation:**
- Small disputes (<$1000): Off-chain arbitrator (high Motion Score curator)
- Large disputes (>$1000): On-chain vote (weighted by key holdings)

**Voting mechanism:**
```solidity
// Pseudo-Solana program
pub fn vote_on_dispute(
  dispute_id: u64,
  voter: Pubkey,
  decision: DisputeDecision,
  keys_held: u64,
) -> Result<()> {
  // Weight = sqrt(keys_held) to prevent whale dominance
  let vote_weight = (keys_held as f64).sqrt() as u64;

  // Record vote
  dispute.votes[decision] += vote_weight;

  // Auto-resolve after 48h
  if dispute.created_at + 48h < now {
    execute_majority_decision(dispute);
  }

  Ok(())
}
```

**Benefits:**
- Decentralized governance for high-stakes
- Community has skin in the game
- Prevents single-point-of-failure arbitrator

---

## 16. Migration Plan

### Phase 1: Database Setup (Week 1)

1. Create Appwrite collections:
   - BLAST_ROOMS
   - BLAST_APPLICANTS
   - BLAST_EVENTS
   - BLAST_ESCROWS
   - BLAST_DM_REQUESTS
   - BLAST_INTROS
   - BLAST_VAULT
   - BLAST_MOTION_SCORES
   - BLAST_CURATORS

2. Create indexes (see Section 14.2)

3. Seed test data:
   - Import existing users → BLAST_VAULT
   - Create sample rooms (3 per type)

### Phase 2: Core APIs (Week 2)

1. Implement Room APIs:
   - Create, list, get, close

2. Implement Motion Score engine:
   - Event recording
   - Score calculation
   - Background job

3. Implement Vault APIs:
   - Deposits, withdrawals, refunds

### Phase 3: Viral Mechanics (Week 3)

1. Raid Boost
2. Streak Vault
3. Witness-to-Speak
4. Hall Pass
5. Flash Airdrop

### Phase 4: Launch (Week 4)

1. Enable Deals + Airdrops only
2. Monitor metrics
3. Iterate based on feedback

### Phase 5: Expansion (Week 5-6)

1. Add Jobs, Collabs, Funding
2. Integrate on-chain escrow (for USDC/SOL)
3. Launch leaderboard

---

## 17. Monitoring & Analytics

**Key Metrics:**

1. **Room Health:**
   - Avg time to fill slots
   - Acceptance rate
   - Avg Motion Score

2. **User Engagement:**
   - Daily active applicants
   - Avg applications per user
   - Refund rate

3. **Viral Mechanics:**
   - Raid boost trigger rate
   - Streak completion rate
   - DM acceptance rate

4. **Economic:**
   - Keys locked in rooms
   - Avg escrow size
   - Curator slash rate

**Dashboard:**
- Real-time room count by status
- Motion Score distribution histogram
- Top 10 leaderboard
- Revenue (keys burned/fees)

---

## File Locations

### Backend Services
```
lib/
├── blast/
│   ├── rooms.ts                 # Room CRUD
│   ├── deposits.ts              # Deposit/refund logic
│   ├── motion-score.ts          # Motion Score engine
│   ├── priority-queue.ts        # Applicant ranking
│   ├── smart-match.ts           # Intro matching
│   ├── escrow.ts                # Escrow & milestones
│   ├── state-machine.ts         # Room lifecycle
│   ├── realtime.ts              # WebSocket subscriptions
│   ├── rate-limit.ts            # Anti-abuse
│   ├── cache.ts                 # Redis caching
│   └── viral/
│       ├── raid-boost.ts
│       ├── streak-vault.ts
│       ├── witness-mode.ts
│       ├── curator-draft.ts
│       ├── flash-airdrop.ts
│       └── hall-pass.ts
```

### API Routes
```
app/api/blast/
├── rooms/
│   ├── route.ts                 # POST /api/blast/rooms
│   └── [id]/
│       ├── route.ts             # GET /api/blast/rooms/:id
│       ├── apply/route.ts       # POST /api/blast/rooms/:id/apply
│       ├── close/route.ts       # POST /api/blast/rooms/:id/close
│       ├── extend/route.ts      # POST /api/blast/rooms/:id/extend
│       ├── applicants/route.ts  # GET /api/blast/rooms/:id/applicants
│       ├── accept/[userId]/route.ts
│       └── reject/[userId]/route.ts
├── dm/
│   ├── request/route.ts         # POST /api/blast/dm/request
│   └── [id]/
│       ├── accept/route.ts
│       └── decline/route.ts
├── intro/
│   ├── request/route.ts         # POST /api/blast/intro/request
│   ├── matches/route.ts         # GET /api/blast/intro/matches
│   └── [id]/accept/route.ts
├── motion/
│   └── [userId]/route.ts        # GET /api/blast/motion/:userId
├── leaderboard/route.ts         # GET /api/blast/leaderboard
└── vault/
    └── [userId]/route.ts        # GET /api/blast/vault/:userId
```

### Cron Jobs
```
scripts/cron/
├── update-motion-scores.ts      # Every 15 min
├── check-room-deadlines.ts      # Every 5 min
├── process-refunds.ts           # Every 5 min
├── expire-dm-requests.ts        # Every 15 min
└── snapshot-motion-scores.ts    # Every hour
```

---

**End of Architecture Document**

This architecture is production-ready and integrates seamlessly with your existing Appwrite database, Solana bonding curve, and Next.js frontend. All algorithms are specified with concrete formulas and implementation details.
