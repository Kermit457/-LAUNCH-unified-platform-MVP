import type { ReferralSplit, ReferralLevel, LevelProgress } from '@/types/referral'

// Constants from environment variables
export const REFERRAL_PERCENTAGE = parseFloat(process.env.REFERRAL_PERCENTAGE || '1') / 100
export const PROJECT_FEE_PERCENTAGE = parseFloat(process.env.PROJECT_FEE_PERCENTAGE || '3') / 100
export const PLATFORM_FEE_PERCENTAGE = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '2') / 100
export const RESERVE_PERCENTAGE = parseFloat(process.env.RESERVE_PERCENTAGE || '94') / 100

// Level thresholds and configuration
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
  try {
    const urlObj = new URL(urlString)
    return urlObj.searchParams.get('ref')
  } catch (error) {
    console.error('Invalid URL for referral extraction:', error)
    return null
  }
}

/**
 * Check if referral is self-referral
 */
export function isSelfReferral(userId: string, referrerId: string): boolean {
  return userId === referrerId
}

/**
 * Compute referral split from gross amount
 */
export function computeSplit(grossAmount: number, hasReferrer: boolean): ReferralSplit {
  const reserve = grossAmount * RESERVE_PERCENTAGE
  const project = grossAmount * PROJECT_FEE_PERCENTAGE
  const platform = grossAmount * PLATFORM_FEE_PERCENTAGE
  const referral = grossAmount * REFERRAL_PERCENTAGE

  return {
    gross: grossAmount,
    reserve: parseFloat(reserve.toFixed(4)),
    project: parseFloat(project.toFixed(4)),
    platform: parseFloat(platform.toFixed(4)),
    referral: parseFloat(referral.toFixed(4)),
    toRewardsPool: !hasReferrer
  }
}

/**
 * Calculate referral level with progress (used by hooks)
 */
export function calculateLevel(totalReferrals: number): {
  level: number
  name: string
  nextLevelProgress: number
} {
  let level = 1
  let name = 'Bronze'

  if (totalReferrals >= 100) {
    level = 5
    name = 'Diamond'
  } else if (totalReferrals >= 25) {
    level = 4
    name = 'Platinum'
  } else if (totalReferrals >= 10) {
    level = 3
    name = 'Gold'
  } else if (totalReferrals >= 3) {
    level = 2
    name = 'Silver'
  }

  // Calculate progress to next level
  let nextLevelProgress = 0
  if (level === 1) {
    nextLevelProgress = (totalReferrals / 3) * 100
  } else if (level === 2) {
    nextLevelProgress = ((totalReferrals - 3) / 7) * 100
  } else if (level === 3) {
    nextLevelProgress = ((totalReferrals - 10) / 15) * 100
  } else if (level === 4) {
    nextLevelProgress = ((totalReferrals - 25) / 75) * 100
  } else {
    nextLevelProgress = 100
  }

  return {
    level,
    name,
    nextLevelProgress: Math.min(Math.max(nextLevelProgress, 0), 100)
  }
}

/**
 * Calculate referral level based on total earned (legacy)
 */
export function calculateLevelByEarnings(totalEarned: number): ReferralLevel {
  for (const [level, { min, max }] of Object.entries(REFERRAL_LEVELS)) {
    if (totalEarned >= min && totalEarned <= max) {
      return level as ReferralLevel
    }
  }
  return 'Bronze'
}

/**
 * Calculate progress to next level (legacy)
 */
export function calculateLevelProgress(totalEarned: number): LevelProgress {
  const current = calculateLevelByEarnings(totalEarned)
  const currentLevelData = REFERRAL_LEVELS[current]
  const next = currentLevelData.next as ReferralLevel | null

  if (!next) {
    return { current, next: null, progress: 100, amountToNext: 0 }
  }

  const nextLevelData = REFERRAL_LEVELS[next]
  const progressInLevel = totalEarned - currentLevelData.min
  const levelRange = currentLevelData.max - currentLevelData.min + 0.01 // Add small amount to handle edge
  const progress = (progressInLevel / levelRange) * 100
  const amountToNext = nextLevelData.min - totalEarned

  return {
    current,
    next,
    progress: Math.min(Math.max(progress, 0), 100),
    amountToNext: Math.max(amountToNext, 0)
  }
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
      localStorage.setItem('referral_page', window.location.pathname)
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
 * Clear stored referral code (useful after binding)
 */
export function clearStoredReferralCode(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem('referral_code')
    localStorage.removeItem('referral_stored_at')
    localStorage.removeItem('referral_page')
  } catch (error) {
    console.error('Failed to clear referral code:', error)
  }
}

/**
 * Generate referral link for a user
 */
export function generateReferralLink(code: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://launchos.com')
  return `${base}/?ref=${encodeURIComponent(code)}`
}

/**
 * Format currency amount with proper decimals
 */
export function formatAmount(amount: number, currency: string = 'USDC'): string {
  return `${amount.toFixed(2)} ${currency}`
}

/**
 * Get level color for UI display
 */
export function getLevelColor(level: ReferralLevel): string {
  return REFERRAL_LEVELS[level].color
}

/**
 * Get level badge emoji
 */
export function getLevelEmoji(level: ReferralLevel): string {
  const emojis = {
    Bronze: '🥉',
    Silver: '🥈',
    Gold: '🥇',
    Platinum: '💎',
    Diamond: '💠'
  }
  return emojis[level] || '🥉'
}

/**
 * Format referral stats for display
 */
export function formatReferralStats(stats: {
  totalEarned: number
  todayEarned: number
  weekEarned: number
  monthEarned: number
}): {
  today: string
  week: string
  month: string
  allTime: string
} {
  return {
    today: formatAmount(stats.todayEarned),
    week: formatAmount(stats.weekEarned),
    month: formatAmount(stats.monthEarned),
    allTime: formatAmount(stats.totalEarned)
  }
}

/**
 * Track referrer (alias for storeReferralCode)
 */
export function trackReferrer(referrerCode: string): void {
  storeReferralCode(referrerCode)
}

/**
 * Get referrer (alias for getStoredReferralCode)
 */
export function getReferrer(): string | null {
  return getStoredReferralCode()
}

/**
 * Clear referrer (alias for clearStoredReferralCode)
 */
export function clearReferrer(): void {
  clearStoredReferralCode()
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false
  // Basic validation: alphanumeric, 6-50 characters
  return /^[a-zA-Z0-9_-]{6,50}$/.test(code)
}

/**
 * Calculate time until next period reset
 */
export function getTimeUntilReset(period: 'day' | 'week' | 'month'): string {
  const now = new Date()
  let nextReset: Date

  switch (period) {
    case 'day':
      nextReset = new Date(now)
      nextReset.setDate(nextReset.getDate() + 1)
      nextReset.setHours(0, 0, 0, 0)
      break
    case 'week':
      nextReset = new Date(now)
      const daysUntilSunday = (7 - now.getDay()) % 7 || 7
      nextReset.setDate(nextReset.getDate() + daysUntilSunday)
      nextReset.setHours(0, 0, 0, 0)
      break
    case 'month':
      nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      break
  }

  const diff = nextReset.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  return `${hours}h ${minutes}m`
}