/**
 * BLAST Network Hub - TypeScript Types
 * All type definitions for rooms, applications, motion scores, and more
 */

import type { Models } from 'appwrite'
import type { KeyTier, RoomType, RoomStatus, RoomDuration, MotionEvent, CuratorTier } from '@/lib/constants/blast'

// ============================================================================
// ROOM TYPES
// ============================================================================

export interface BlastRoom extends Models.Document {
  // Core fields
  type: RoomType
  title: string
  description: string
  tags: string[]

  // Creator
  creatorId: string
  creatorName: string
  creatorAvatar?: string
  creatorMotionScore: number

  // Slots & Gates
  totalSlots: number
  filledSlots: number
  minKeysToApply: number
  minKeysToCurate: number
  entryDeposit: number

  // Lifecycle
  status: RoomStatus
  startTime: string
  endTime: string
  extended: boolean

  // Metrics
  motionScore: number
  applicantCount: number
  acceptedCount: number
  watcherCount: number
  totalKeysLocked: number

  // Type-specific metadata
  metadata: RoomMetadata

  // Timestamps
  createdAt: string
  updatedAt: string
}

export type RoomMetadata =
  | DealMetadata
  | AirdropMetadata
  | JobMetadata
  | CollabMetadata
  | FundingMetadata

export interface DealMetadata {
  fundingStage?: string
  ticketSize?: string
  region?: string
  investorType?: string[]
}

export interface AirdropMetadata {
  totalSupply: number
  perSlotReward: number
  tasks: AirdropTask[]
  antiBot: {
    minWalletAge?: string
    socialVerify?: boolean
    quiz?: boolean
  }
  progress: {
    claimed: number
    remaining: number
  }
}

export interface AirdropTask {
  type: string
  description: string
  points: number
  completed?: boolean
}

export interface JobMetadata {
  budget: number
  currency: 'USDC' | 'SOL' | 'keys'
  skills: string[]
  milestones: JobMilestone[]
  escrowEnabled: boolean
  disputeEnabled: boolean
}

export interface JobMilestone {
  description: string
  amount: number
  deadline?: string
  status: 'pending' | 'in_progress' | 'completed' | 'disputed'
}

export interface CollabMetadata {
  roles: string[]
  schedule?: string
  liveSignal?: {
    holdersJoined: number
    watchers: number
  }
  voiceEnabled?: boolean
}

export interface FundingMetadata {
  amount: string
  stage: string
  raised?: string
  investors?: number
  minKeysToView?: number
  minKeysToIntro?: number
  pitchDeck?: string
  metrics?: {
    revenue?: string
    growth?: string
    users?: string
  }
}

// ============================================================================
// APPLICANT TYPES
// ============================================================================

export interface BlastApplicant extends Models.Document {
  roomId: string
  userId: string
  userName: string
  userAvatar?: string
  userMotionScore: number

  // Application
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  message: string
  attachments: string[]

  // Priority
  keysStaked: number
  priorityScore: number

  // Deposits
  depositAmount: number
  depositRefunded: boolean
  depositForfeit: boolean
  lockId: string

  // Activity
  activityCount: number
  activities: ActivityRecord[]
  lastActiveAt: string

  // Timestamps
  appliedAt: string
  respondedAt?: string
}

export interface ActivityRecord {
  type: string
  timestamp: string
  metadata?: Record<string, any>
}

// ============================================================================
// MOTION SCORE TYPES
// ============================================================================

export interface MotionScore extends Models.Document {
  userId: string

  // Current score
  currentScore: number
  baseScore: number
  decayAmount: number

  // Decay parameters
  tau: number
  lastDecayAt: string

  // Signal breakdown
  signals: Record<MotionEvent, number>

  // History
  scoreHistory: ScoreSnapshot[]
  peakScore: number

  // Timestamps
  updatedAt: string
}

export interface ScoreSnapshot {
  score: number
  timestamp: string
}

export interface MotionEvent extends Models.Document {
  type: MotionEvent
  actorId: string
  roomId?: string
  targetId?: string

  // Weighting
  weight: number
  decayRate: number

  metadata: Record<string, any>
  timestamp: string
}

// ============================================================================
// VAULT TYPES
// ============================================================================

export interface BlastVault extends Models.Document {
  userId: string
  walletAddress: string

  // Balances
  totalKeysLocked: number

  // Earnings
  solBalance: number
  usdcBalance: number
  pointsBalance: number

  // Earnings breakdown
  fromRooms: number
  fromIntros: number
  fromReferrals: number
  fromCurating: number

  // Pending refunds
  pendingRefunds: PendingRefund[]

  // Timestamps
  updatedAt: string
}

export interface PendingRefund {
  amount: number
  roomId: string
  reason: string
  expectedAt: string
}

export interface KeyLock extends Models.Document {
  userId: string
  roomId: string
  amount: number
  status: 'locked' | 'released' | 'forfeited'

  // Timestamps
  lockedAt: string
  unlockedAt?: string
}

// ============================================================================
// DM & INTRO TYPES
// ============================================================================

export interface DMRequest extends Models.Document {
  fromUserId: string
  fromUserName: string
  fromUserAvatar?: string

  toUserId: string
  toUserName: string

  // Request
  message: string
  depositAmount: number

  status: 'pending' | 'accepted' | 'declined' | 'expired'

  // Outcome
  refunded: boolean
  dmThreadId?: string

  // Timestamps
  respondedAt?: string
  expiresAt: string
  createdAt: string
}

export interface IntroRequest extends Models.Document {
  requesterId: string
  requesterName: string

  targetAId: string
  targetAName: string

  targetBId: string
  targetBName: string

  // Context
  reason: string
  tags: string[]
  depositAmount: number

  status: 'pending' | 'accepted' | 'declined'

  // Reward split
  burnedToVault: number
  rewardToCurator: number

  // Timestamps
  createdAt: string
  acceptedAt?: string
}

export interface SmartMatch {
  userId: string
  userName: string
  userAvatar?: string
  motionScore: number

  matchScore: number
  breakdown: {
    tagOverlap: number
    timezoneMatch: number
    sharedHolders: number
    complementarySkills: number
  }

  tags: string[]
  skills: string[]
  timezone: string
}

// ============================================================================
// CURATOR TYPES
// ============================================================================

export interface CuratorStats extends Models.Document {
  userId: string

  // Performance
  totalReviews: number
  approvalAccuracy: number
  rejectionAccuracy: number
  overallAccuracy: number

  // Tier
  tier: CuratorTier
  tierMultiplier: number

  // Activity
  reviewsLast30Days: number
  votesLast30Days: number
  lastActiveAt: string

  // Rewards
  totalEarnedSOL: number
  totalEarnedUSD: number
  pendingRewards: number

  // Penalties
  strikes: number
  suspendedUntil?: string

  // Gaming detection
  suspiciousActivityFlags: string[]

  // Timestamps
  updatedAt: string
}

export interface CuratorReview extends Models.Document {
  roomId: string
  curatorId: string

  // Decision
  decision: 'approve' | 'reject' | 'needs_work'

  // Quality scores (1-5)
  scores: {
    legitimacy: number
    innovation: number
    execution: number
    community: number
    marketFit: number
  }
  averageScore: number

  // Feedback
  feedback: string
  internalNotes?: string

  // Time tracking
  timeSpentSeconds: number

  // Quality check (retroactive)
  accuracyScore?: number

  // Timestamps
  createdAt: string
  updatedAt: string
}

// ============================================================================
// ESCROW TYPES
// ============================================================================

export interface BlastEscrow extends Models.Document {
  roomId: string
  founderId: string
  contributorId: string

  // Terms
  totalAmount: number
  currency: 'USDC' | 'SOL' | 'keys'
  milestones: EscrowMilestone[]

  // Status
  status: 'active' | 'milestone_pending' | 'disputed' | 'completed' | 'refunded'
  currentMilestone: number

  // Dispute
  disputeReason?: string
  arbitratorId?: string

  // Timestamps
  createdAt: string
  completedAt?: string
}

export interface EscrowMilestone {
  description: string
  amount: number
  status: 'pending' | 'submitted' | 'approved' | 'disputed'
  proofUrl?: string
  submittedAt?: string
  approvedAt?: string
}

// ============================================================================
// FEED & FILTERS
// ============================================================================

export interface RoomFilters {
  type?: RoomType
  tags?: string[]
  minMotionScore?: number
  status?: RoomStatus
  tier?: KeyTier
  deadline?: 'today' | '7d' | '30d'
  budget?: { min: number; max: number }
}

export interface PaginatedRooms {
  rooms: BlastRoom[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface ComposerState {
  isOpen: boolean
  selectedType: RoomType | null
  draft: Partial<BlastRoom> | null
}

export interface ModalState {
  apply: {
    isOpen: boolean
    roomId: string | null
  }
  dm: {
    isOpen: boolean
    userId: string | null
  }
  intro: {
    isOpen: boolean
    targetUserId: string | null
  }
  vault: {
    isOpen: boolean
  }
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface BlastNotification {
  id: string
  type: 'room_accepted' | 'room_rejected' | 'dm_received' | 'intro_accepted' | 'refund_processed' | 'milestone_approved'
  title: string
  message: string

  // Action
  actionLabel?: string
  actionUrl?: string

  // Metadata
  roomId?: string
  userId?: string
  amount?: number

  // Status
  read: boolean

  // Timestamps
  createdAt: string
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface RoomAnalytics {
  roomId: string

  // Performance
  applicants: number
  accepted: number
  acceptanceRate: number

  // Engagement
  views: number
  uniqueViewers: number
  avgTimeSpent: number

  // Keys
  totalKeysLocked: number
  avgKeysPerApplicant: number

  // Motion
  motionScorePeak: number
  motionScoreAvg: number

  // Outcomes
  matchesCompleted: number
  refundsProcessed: number
  forfeitedDeposits: number
}

export interface UserAnalytics {
  userId: string

  // Participation
  roomsCreated: number
  roomsApplied: number
  roomsAccepted: number
  acceptanceRate: number

  // Earnings
  totalEarned: number
  earningsThisMonth: number

  // Motion
  currentMotionScore: number
  peakMotionScore: number
  motionRank: number

  // Activity
  lastActiveAt: string
  activeDays: number
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export interface UseKeyGateReturn {
  keyBalance: number
  tier: KeyTier
  canPost: boolean
  canCurate: boolean
  canOpenRooms: boolean
  isLoading: boolean
  refetch: () => Promise<void>
}

export interface UseRoomFeedReturn {
  rooms: BlastRoom[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  refetch: () => void
}

export interface UseMotionScoreReturn {
  score: MotionScore | null
  isLoading: boolean
  refetch: () => void
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CreateRoomResponse {
  roomId: string
  room: BlastRoom
}

export interface ApplyToRoomResponse {
  applicationId: string
  application: BlastApplicant
  lockId: string
}

export interface VaultStatusResponse {
  totalLocked: number
  activeLocks: KeyLock[]
  pendingRefunds: PendingRefund[]
  earnings: {
    sol: number
    usdc: number
    points: number
  }
}
