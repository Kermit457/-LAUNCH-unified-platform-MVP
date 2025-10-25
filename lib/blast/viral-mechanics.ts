/**
 * BLAST Viral Mechanics Engine
 * Implements 24 viral growth levers
 */

// Viral Mechanic Types
export type ViralMechanicType =
  | 'raid_boost'
  | 'key_streak'
  | 'witness_to_speak'
  | 'curator_draft'
  | 'slot_snipe'
  | 'intro_bounty'
  | 'flash_airdrop'
  | 'hall_pass'
  | 'bring_a_builder'

// Raid Boost Configuration
export const RAID_BOOST = {
  threshold: 10, // holders needed
  window: 600, // 10 minutes in seconds
  reward: 'homepage_feature',
  motionBonus: 5, // +5 Motion per booster
  duration: 86400, // 24h feature duration
} as const

// Key Streak Vault Configuration
export const KEY_STREAK = {
  days: 7,
  bonusRefund: 0.1, // 10% bonus
  minActions: 1, // minimum daily actions
} as const

// Witness-to-Speak Configuration
export const WITNESS_TO_SPEAK = {
  watchDuration: 300, // 5 minutes in seconds
  offerDuration: 600, // 10 minutes offer window
  keysOffered: 1,
  micDuration: 600, // 10 minutes mic access
} as const

// Curator Draft Configuration
export const CURATOR_DRAFT = {
  topCurators: 3,
  draftsPerRoom: 1,
  minCuratorScore: 50,
} as const

// Slot Snipe Configuration
export const SLOT_SNIPE = {
  finalCallWindow: 300, // 5 minutes
  motionMultiplier: 2, // 2x Motion weight
} as const

// Intro Bounty Configuration
export const INTRO_BOUNTY = {
  depositAmount: 0.02,
  winnerBadge: 'first_intro',
} as const

// Flash Airdrop Configuration
export const FLASH_AIRDROP = {
  motionThreshold: 95,
  rewardPerEntrant: 0.05,
} as const

// Hall Pass Configuration
export const HALL_PASS = {
  acceptedDMs: 10,
  timeWindow: 604800, // 7 days
  passDuration: 86400, // 24h
} as const

// Bring-a-Builder Configuration
export const BRING_A_BUILDER = {
  verifiedRoles: ['developer', 'designer'],
  queueBoost: 2,
  sbtReward: 'builder_duo',
} as const

/**
 * Check if Raid Boost is active for a room
 */
export function checkRaidBoost(boosts: { userId: string; timestamp: number }[]): {
  active: boolean
  count: number
  timeRemaining: number
} {
  const now = Date.now() / 1000
  const recentBoosts = boosts.filter(
    (b) => now - b.timestamp <= RAID_BOOST.window
  )

  const uniqueHolders = new Set(recentBoosts.map((b) => b.userId))
  const active = uniqueHolders.size >= RAID_BOOST.threshold

  const oldestRecentBoost = Math.min(...recentBoosts.map((b) => b.timestamp))
  const timeRemaining = Math.max(0, RAID_BOOST.window - (now - oldestRecentBoost))

  return {
    active,
    count: uniqueHolders.size,
    timeRemaining,
  }
}

/**
 * Check if user has active key streak
 */
export function checkKeyStreak(activityDates: Date[]): {
  hasStreak: boolean
  currentStreak: number
  bonusEligible: boolean
} {
  if (activityDates.length === 0) {
    return { hasStreak: false, currentStreak: 0, bonusEligible: false }
  }

  // Sort dates in descending order
  const sortedDates = activityDates
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a)

  const uniqueDates = [...new Set(sortedDates)]
  const today = new Date().setHours(0, 0, 0, 0)

  // Check if streak is still active (last activity today or yesterday)
  const lastActivity = uniqueDates[0]
  const daysSinceLastActivity = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24))

  if (daysSinceLastActivity > 1) {
    return { hasStreak: false, currentStreak: 0, bonusEligible: false }
  }

  // Count consecutive days
  let currentStreak = 1
  for (let i = 1; i < uniqueDates.length; i++) {
    const daysDiff = Math.floor((uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24))
    if (daysDiff === 1) {
      currentStreak++
    } else {
      break
    }
  }

  return {
    hasStreak: currentStreak > 0,
    currentStreak,
    bonusEligible: currentStreak >= KEY_STREAK.days,
  }
}

/**
 * Check if Witness-to-Speak offer should be shown
 */
export function checkWitnessOffer(
  watchTime: number,
  keyBalance: number
): {
  showOffer: boolean
  progress: number
} {
  const progress = Math.min(100, (watchTime / WITNESS_TO_SPEAK.watchDuration) * 100)
  const showOffer = watchTime >= WITNESS_TO_SPEAK.watchDuration && keyBalance === 0

  return { showOffer, progress }
}

/**
 * Check if user is eligible for Curator Draft
 */
export function checkCuratorDraft(
  curatorRank: number,
  curatorMotionScore: number,
  roomDraftCount: number
): {
  eligible: boolean
  draftsRemaining: number
} {
  const eligible =
    curatorRank <= CURATOR_DRAFT.topCurators &&
    curatorMotionScore >= CURATOR_DRAFT.minCuratorScore &&
    roomDraftCount < CURATOR_DRAFT.draftsPerRoom

  return {
    eligible,
    draftsRemaining: CURATOR_DRAFT.draftsPerRoom - roomDraftCount,
  }
}

/**
 * Check if Slot Snipe is active
 */
export function checkSlotSnipe(
  filledSlots: number,
  totalSlots: number,
  roomEndTime: Date
): {
  active: boolean
  timeRemaining: number
} {
  const isLastSlot = filledSlots === totalSlots - 1
  const now = Date.now()
  const endTime = new Date(roomEndTime).getTime()
  const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000))

  return {
    active: isLastSlot && timeRemaining <= SLOT_SNIPE.finalCallWindow,
    timeRemaining,
  }
}

/**
 * Calculate refund with streak bonus
 */
export function calculateStreakRefund(
  baseRefund: number,
  hasStreak: boolean
): number {
  if (!hasStreak) return baseRefund
  return baseRefund * (1 + KEY_STREAK.bonusRefund)
}

/**
 * Calculate priority score with slot snipe multiplier
 */
export function calculateSlotSnipePriority(
  basePriority: number,
  isSlotSnipe: boolean
): number {
  if (!isSlotSnipe) return basePriority
  return basePriority * SLOT_SNIPE.motionMultiplier
}

/**
 * Check if Flash Airdrop should trigger
 */
export function checkFlashAirdrop(
  motionScore: number,
  alreadyTriggered: boolean
): {
  shouldTrigger: boolean
  rewardPerEntrant: number
} {
  return {
    shouldTrigger: motionScore >= FLASH_AIRDROP.motionThreshold && !alreadyTriggered,
    rewardPerEntrant: FLASH_AIRDROP.rewardPerEntrant,
  }
}

/**
 * Check Hall Pass eligibility
 */
export function checkHallPass(
  acceptedDMs: number,
  lastDMTime: number
): {
  hasPass: boolean
  dmsRemaining: number
} {
  const hasPass = acceptedDMs >= HALL_PASS.acceptedDMs
  const now = Date.now() / 1000

  // Check if pass is still valid (within 24h of earning it)
  const passExpired = hasPass && now - lastDMTime > HALL_PASS.passDuration

  return {
    hasPass: hasPass && !passExpired,
    dmsRemaining: Math.max(0, HALL_PASS.acceptedDMs - acceptedDMs),
  }
}
