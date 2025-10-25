/**
 * Rate Limiting System for BLAST
 * Prevents spam and abuse across all API endpoints
 *
 * Production: Replace in-memory store with Redis for multi-instance support
 */

type RateLimitConfig = {
  limit: number // Max requests
  window: number // Time window in seconds
}

type RateLimitEntry = {
  count: number
  resetAt: number // Unix timestamp
}

// Rate limit configurations
export const RATE_LIMITS = {
  // Room operations
  applyToRoom: { limit: 10, window: 3600 }, // 10 per hour
  createRoom: { limit: 3, window: 86400 }, // 3 per day
  curateRoom: { limit: 20, window: 3600 }, // 20 per hour

  // Communication
  dmRequest: { limit: 5, window: 86400 }, // 5 per day
  introRequest: { limit: 3, window: 86400 }, // 3 per day

  // Vault operations
  vaultWithdraw: { limit: 10, window: 3600 }, // 10 per hour

  // General API
  apiRead: { limit: 100, window: 60 }, // 100 per minute
  apiWrite: { limit: 30, window: 60 }, // 30 per minute
} as const

// In-memory store (replace with Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Math.floor(Date.now() / 1000)
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key)
      }
    }
  }, 300000) // 5 minutes
}

/**
 * Check if user has exceeded rate limit
 */
export async function checkRateLimit(
  userId: string,
  action: keyof typeof RATE_LIMITS
): Promise<{
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfter?: number
}> {
  const config = RATE_LIMITS[action]
  const key = `${userId}:${action}`
  const now = Math.floor(Date.now() / 1000)

  let entry = rateLimitStore.get(key)

  // Initialize or reset if window expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.window,
    }
    rateLimitStore.set(key, entry)
  }

  // Check limit
  const allowed = entry.count < config.limit
  const remaining = Math.max(0, config.limit - entry.count)
  const retryAfter = allowed ? undefined : entry.resetAt - now

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
    retryAfter,
  }
}

/**
 * Increment rate limit counter
 */
export async function incrementRateLimit(
  userId: string,
  action: keyof typeof RATE_LIMITS
): Promise<void> {
  const key = `${userId}:${action}`
  const entry = rateLimitStore.get(key)

  if (entry) {
    entry.count++
  }
}

/**
 * Reset rate limit for a user (admin use)
 */
export async function resetRateLimit(
  userId: string,
  action: keyof typeof RATE_LIMITS
): Promise<void> {
  const key = `${userId}:${action}`
  rateLimitStore.delete(key)
}

/**
 * Get all rate limit stats for a user
 */
export async function getRateLimitStats(userId: string): Promise<{
  [K in keyof typeof RATE_LIMITS]?: {
    count: number
    limit: number
    resetAt: number
  }
}> {
  const stats: any = {}
  const now = Math.floor(Date.now() / 1000)

  for (const action of Object.keys(RATE_LIMITS) as Array<keyof typeof RATE_LIMITS>) {
    const key = `${userId}:${action}`
    const entry = rateLimitStore.get(key)

    if (entry && entry.resetAt > now) {
      stats[action] = {
        count: entry.count,
        limit: RATE_LIMITS[action].limit,
        resetAt: entry.resetAt,
      }
    }
  }

  return stats
}

/**
 * Middleware helper for Next.js API routes
 */
export async function withRateLimit(
  userId: string | null | undefined,
  action: keyof typeof RATE_LIMITS
): Promise<
  | { allowed: true }
  | {
      allowed: false
      error: string
      retryAfter: number
      headers: Record<string, string>
    }
> {
  if (!userId) {
    return {
      allowed: false,
      error: 'Unauthorized',
      retryAfter: 0,
      headers: {},
    }
  }

  const result = await checkRateLimit(userId, action)

  if (!result.allowed) {
    return {
      allowed: false,
      error: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
      retryAfter: result.retryAfter!,
      headers: {
        'X-RateLimit-Limit': String(RATE_LIMITS[action].limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.resetAt),
        'Retry-After': String(result.retryAfter),
      },
    }
  }

  // Increment counter
  await incrementRateLimit(userId, action)

  return { allowed: true }
}

/**
 * Add rate limit headers to response
 */
export function getRateLimitHeaders(
  action: keyof typeof RATE_LIMITS,
  remaining: number,
  resetAt: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(RATE_LIMITS[action].limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetAt),
  }
}
