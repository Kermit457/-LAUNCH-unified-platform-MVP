/**
 * BLAST Network Hub - Constants & Configuration
 * Tier gates, event weights, deposit amounts, and system parameters
 */

// ============================================================================
// KEY TIER SYSTEM
// ============================================================================

export const TIER_THRESHOLDS = {
  viewer: 0,       // Read-only access
  contributor: 1,  // Post, apply, DM
  curator: 5,      // Tag, rank, earn curator rewards (7d stake required)
  partner: 25,     // Open 72h Deal Rooms
} as const

export type KeyTier = keyof typeof TIER_THRESHOLDS

export const TIER_NAMES: Record<KeyTier, string> = {
  viewer: 'Viewer',
  contributor: 'Contributor',
  curator: 'Curator',
  partner: 'Partner',
}

export const TIER_COLORS: Record<KeyTier, string> = {
  viewer: 'text-zinc-500',
  contributor: 'text-green-400',
  curator: 'text-yellow-400',
  partner: 'text-purple-400',
}

export const TIER_ICONS: Record<KeyTier, string> = {
  viewer: '👁️',
  contributor: '✍️',
  curator: '⭐',
  partner: '👑',
}

// ============================================================================
// ROOM TYPES
// ============================================================================

export const ROOM_TYPES = {
  deal: {
    label: 'Deal',
    icon: '🤝',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Intros, partnerships, and connections',
  },
  airdrop: {
    label: 'Airdrop',
    icon: '🪂',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    description: 'Tasks, rewards, and token distributions',
  },
  job: {
    label: 'Job',
    icon: '💼',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'Bounties, gigs, and paid work',
  },
  collab: {
    label: 'Collab',
    icon: '🎙️',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Co-create, co-host, joint ventures',
  },
  funding: {
    label: 'Funding',
    icon: '💰',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    description: 'Pitches, investors, and fundraising',
  },
} as const

export type RoomType = keyof typeof ROOM_TYPES

// ============================================================================
// ROOM STATUS
// ============================================================================

export const ROOM_STATUS = {
  open: {
    label: 'Open',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  hot: {
    label: 'Hot Now',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    icon: '🔥',
  },
  closing: {
    label: 'Closing Soon',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    icon: '⏰',
  },
  closed: {
    label: 'Closed',
    color: 'text-zinc-500',
    bgColor: 'bg-zinc-500/10',
  },
  archived: {
    label: 'Archived',
    color: 'text-zinc-600',
    bgColor: 'bg-zinc-600/10',
  },
} as const

export type RoomStatus = keyof typeof ROOM_STATUS

// ============================================================================
// DEPOSIT AMOUNTS (in keys)
// ============================================================================

export const DEPOSITS = {
  ROOM_ENTRY: 1,           // Default entry deposit for rooms
  CURATOR_BOND_MIN: 5,     // Minimum curator bond
  CURATOR_BOND_MAX: 25,    // Maximum curator bond
  DM_REQUEST: 0.02,        // DM request deposit (burned on accept)
  INTRO_REQUEST: 0.02,     // Intro request deposit (burned on accept)
  MIC_TOP_UP: 0.05,        // Voice mic priority (per 10 min)
  TASK_COLLATERAL: 0.2,    // Bounty taker collateral
} as const

// ============================================================================
// MOTION SCORE - EVENT WEIGHTS
// ============================================================================

export const MOTION_WEIGHTS = {
  // High-value events (10-20 points)
  room_success: 20,              // Room filled with matches
  accepted_intro: 15,            // Intro request accepted
  holder_growth: 10,             // New key holders acquired
  completed_bounty: 10,          // Milestone approved

  // Medium-value events (5-9 points)
  application_accepted: 8,       // Accepted to room
  key_buys: 7,                   // Bought keys on curve
  referrals: 6,                  // Referred new user
  curator_vote: 5,               // Tagged/ranked rooms
  dm_accepted: 5,                // DM request accepted
  task_completion: 5,            // Completed task

  // Low-value events (1-4 points)
  applies: 4,                    // Applied to room
  room_attendance: 3,            // Joined room chat
  watchtime: 2,                  // Watched room (viewer)
  message_sent: 1,               // Sent chat message
} as const

export type MotionEvent = keyof typeof MOTION_WEIGHTS

// Motion Score decay constant (τ - tau)
export const MOTION_DECAY_TAU = 72 // Hours (3 days half-life)

// ============================================================================
// PRIORITY QUEUE - SCORING WEIGHTS
// ============================================================================

export const PRIORITY_WEIGHTS = {
  KEYS_STAKED: 10,        // More keys = higher priority
  MOTION_SCORE: 2,        // Reputation multiplier
  ACTIVITY_BONUS: 5,      // Active in room
  REFERRAL_BONUS: 3,      // Brought new holders
} as const

// ============================================================================
// VIRAL MECHANICS - THRESHOLDS
// ============================================================================

export const VIRAL_THRESHOLDS = {
  // Raid Boost: 10 holders boost in 10 minutes → Hot status
  RAID_BOOST_HOLDERS: 10,
  RAID_BOOST_TIME_MINUTES: 10,
  RAID_BOOST_MOTION_BONUS: 5,

  // Streak Vault: 7 days daily action → deposit + 10% bonus
  STREAK_VAULT_DAYS: 7,
  STREAK_VAULT_BONUS: 0.1, // 10%

  // Witness-to-Speak: 5 min watch → offer to buy 1 key for mic
  WITNESS_TIME_MINUTES: 5,
  WITNESS_MIC_DURATION_MINUTES: 10,

  // Flash Airdrop: Motion 95+ → instant drop
  FLASH_AIRDROP_MOTION_THRESHOLD: 95,

  // Hall Pass: 10 DM accepts in 7 days → free DMs for 24h
  HALL_PASS_DM_COUNT: 10,
  HALL_PASS_DURATION_DAYS: 7,
  HALL_PASS_FREE_DURATION_HOURS: 24,

  // Hot Room threshold
  HOT_MOTION_THRESHOLD: 90,
  HOT_HOLDER_JOIN_COUNT: 10,
  HOT_TIME_WINDOW_MINUTES: 10,
} as const

// ============================================================================
// ROOM DURATION OPTIONS
// ============================================================================

export const ROOM_DURATIONS = {
  '24h': { hours: 24, label: '24 hours' },
  '48h': { hours: 48, label: '48 hours' },
  '72h': { hours: 72, label: '72 hours' },
} as const

export type RoomDuration = keyof typeof ROOM_DURATIONS

// Room extension (one-time, only for Hot rooms)
export const ROOM_EXTENSION_HOURS = 24

// ============================================================================
// RATE LIMITS
// ============================================================================

export const RATE_LIMITS = {
  APPLY_TO_ROOM: { requests: 10, window: 3600 },        // 10 per hour
  CREATE_ROOM: { requests: 3, window: 86400 },          // 3 per day
  DM_REQUEST: { requests: 5, window: 86400 },           // 5 per day
  INTRO_REQUEST: { requests: 3, window: 86400 },        // 3 per day
  CURATOR_TAG: { requests: 20, window: 3600 },          // 20 per hour
} as const

// ============================================================================
// REFUND CONDITIONS
// ============================================================================

export const REFUND_CONDITIONS = {
  MIN_ACTIVITY_COUNT: 2,     // Must have 2+ actions to get refund
  CURATOR_BONUS_MULTIPLIER: 0.1, // 10% bonus for successful curation
  NO_SHOW_FORFEIT: true,     // Forfeit deposit if no activity
  FORFEIT_SPLIT: {
    VAULT: 0.5,              // 50% to rewards vault
    CURATORS: 0.5,           // 50% to curator pool
  },
} as const

// ============================================================================
// SMART MATCHING - SCORING WEIGHTS
// ============================================================================

export const MATCHING_WEIGHTS = {
  TAG_OVERLAP: 5,               // Shared interest tags
  TIMEZONE_MATCH: 3,            // Within ±3h timezone
  SHARED_HOLDERS: 4,            // Mutual key holders
  COMPLEMENTARY_SKILLS: 6,      // Needed skills match offered
} as const

// ============================================================================
// CURATOR PERFORMANCE TIERS
// ============================================================================

export const CURATOR_TIERS = {
  bronze: {
    minReviews: 0,
    minAccuracy: 0,
    multiplier: 1.0,
    label: 'Bronze Curator',
    color: 'text-orange-600',
  },
  silver: {
    minReviews: 10,
    minAccuracy: 65,
    multiplier: 1.2,
    label: 'Silver Curator',
    color: 'text-zinc-400',
  },
  gold: {
    minReviews: 25,
    minAccuracy: 75,
    multiplier: 1.5,
    label: 'Gold Curator',
    color: 'text-yellow-400',
  },
  platinum: {
    minReviews: 50,
    minAccuracy: 85,
    multiplier: 2.0,
    label: 'Platinum Curator',
    color: 'text-purple-400',
  },
} as const

export type CuratorTier = keyof typeof CURATOR_TIERS

// ============================================================================
// ACTIVITY TYPES (for refund eligibility)
// ============================================================================

export const ACTIVITY_TYPES = [
  'message_sent',
  'reaction_added',
  'vote_cast',
  'applicant_reviewed',
  'intro_made',
  'file_uploaded',
  'task_completed',
] as const

export type ActivityType = typeof ACTIVITY_TYPES[number]

// ============================================================================
// CACHE TTLs (seconds)
// ============================================================================

export const CACHE_TTL = {
  ROOM_FEED: 30,              // 30 seconds
  ROOM_DETAILS: 15,           // 15 seconds
  MOTION_SCORE: 300,          // 5 minutes
  LEADERBOARD: 600,           // 10 minutes
  USER_VAULT: 60,             // 1 minute
  KEY_BALANCE: 30,            // 30 seconds
} as const

// ============================================================================
// TAGS & CATEGORIES
// ============================================================================

export const ROOM_TAGS = {
  industries: [
    'DeFi',
    'Gaming',
    'AI',
    'Social',
    'Infrastructure',
    'NFT',
    'DAO',
    'Payments',
    'Privacy',
    'Metaverse',
  ],
  stages: [
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B+',
    'Growth',
  ],
  regions: [
    'North America',
    'Europe',
    'Asia',
    'Latin America',
    'Global',
  ],
  skills: [
    'Solidity',
    'Rust',
    'TypeScript',
    'React',
    'Design',
    'Marketing',
    'Community',
    'BD',
  ],
} as const

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  VOICE_CHAT_ENABLED: false,       // Voice in rooms (future)
  ON_CHAIN_VOTING: false,          // On-chain dispute resolution
  ESCROW_ENABLED: true,            // Job escrows
  DM_MARKET_ENABLED: true,         // DM request system
  INTRO_MATCHING_ENABLED: true,    // Smart matching
  VIRAL_MECHANICS_ENABLED: true,   // Raid boost, streak vault, etc
} as const

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI = {
  FEED_PAGE_SIZE: 10,              // Rooms per page
  MAX_TAGS_PER_ROOM: 5,            // Tag limit
  MAX_ATTACHMENTS: 3,              // File upload limit
  MAX_DESCRIPTION_LENGTH: 500,     // Character limit
  MIN_DESCRIPTION_LENGTH: 20,      // Minimum description
  COUNTDOWN_UPDATE_INTERVAL: 60000, // 1 minute
  MOTION_UPDATE_INTERVAL: 60000,   // 1 minute
  SKELETON_COUNT: 3,               // Loading skeletons
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getTierFromKeys(keyBalance: number): KeyTier {
  if (keyBalance >= TIER_THRESHOLDS.partner) return 'partner'
  if (keyBalance >= TIER_THRESHOLDS.curator) return 'curator'
  if (keyBalance >= TIER_THRESHOLDS.contributor) return 'contributor'
  return 'viewer'
}

export function getTierLabel(tier: KeyTier): string {
  return TIER_NAMES[tier]
}

export function getTierColor(tier: KeyTier): string {
  return TIER_COLORS[tier]
}

export function getRoomTypeConfig(type: RoomType) {
  return ROOM_TYPES[type]
}

export function getRoomStatusConfig(status: RoomStatus) {
  return ROOM_STATUS[status]
}

export function getMotionWeight(event: MotionEvent): number {
  return MOTION_WEIGHTS[event] || 0
}

export function formatDuration(hours: number): string {
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  if (remainingHours === 0) return `${days}d`
  return `${days}d ${remainingHours}h`
}

export function getRoomDurationHours(duration: RoomDuration): number {
  return ROOM_DURATIONS[duration].hours
}

export function getCuratorTierFromStats(reviews: number, accuracy: number): CuratorTier {
  if (reviews >= CURATOR_TIERS.platinum.minReviews && accuracy >= CURATOR_TIERS.platinum.minAccuracy) {
    return 'platinum'
  }
  if (reviews >= CURATOR_TIERS.gold.minReviews && accuracy >= CURATOR_TIERS.gold.minAccuracy) {
    return 'gold'
  }
  if (reviews >= CURATOR_TIERS.silver.minReviews && accuracy >= CURATOR_TIERS.silver.minAccuracy) {
    return 'silver'
  }
  return 'bronze'
}
