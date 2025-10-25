/**
 * Sybil Resistance System for BLAST
 * Prevents multi-accounting and abuse
 *
 * Checks:
 * - Minimum key age (24h hold requirement)
 * - IP clustering (flag >3 accounts from same IP)
 * - Wallet verification (Privy external wallet required)
 * - Behavioral patterns (shadow downrank low acceptance rates)
 */

import { databases } from '@/lib/appwrite/client'
import { Query } from 'appwrite'

// Sybil detection configuration
export const SYBIL_CONFIG = {
  minKeyAge: 86400, // 24 hours in seconds
  maxAccountsPerIP: 3,
  minAcceptanceRate: 0.2, // 20% - below this gets shadow downranked
  minApplicationCount: 5, // Need at least 5 applications to calculate acceptance rate
  suspiciousVelocity: 10, // >10 applications in 1 hour = suspicious
} as const

type SybilCheckResult = {
  passed: boolean
  flags: string[]
  severity: 'none' | 'low' | 'medium' | 'high'
  allowAction: boolean
}

/**
 * Check if user's keys meet minimum age requirement
 */
export async function checkKeyAge(
  userId: string,
  userWallet: string
): Promise<{
  passed: boolean
  keyAge: number // seconds
  flag?: string
}> {
  try {
    // Query vault for oldest key lock
    const locks = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_VAULT!,
      [Query.equal('userId', userId), Query.orderAsc('lockedAt'), Query.limit(1)]
    )

    if (locks.documents.length === 0) {
      return {
        passed: false,
        keyAge: 0,
        flag: 'No keys held - new account',
      }
    }

    const oldestLock = locks.documents[0]
    const lockedAt = new Date(oldestLock.lockedAt).getTime() / 1000
    const now = Date.now() / 1000
    const keyAge = now - lockedAt

    return {
      passed: keyAge >= SYBIL_CONFIG.minKeyAge,
      keyAge,
      flag: keyAge < SYBIL_CONFIG.minKeyAge ? `Keys held for only ${Math.floor(keyAge / 3600)}h (need 24h)` : undefined,
    }
  } catch (error) {
    console.error('Key age check failed:', error)
    return { passed: false, keyAge: 0, flag: 'Error checking key age' }
  }
}

/**
 * Check for IP clustering (multiple accounts from same IP)
 */
export async function checkIPClustering(
  userId: string,
  ipAddress: string
): Promise<{
  passed: boolean
  accountCount: number
  flag?: string
}> {
  try {
    // In production, store IP addresses in a separate analytics collection
    // For now, we'll use a simple in-memory map
    const ipMap = new Map<string, Set<string>>()

    // Get IP from store (placeholder - implement with Redis/Appwrite)
    const accountsOnIP = ipMap.get(ipAddress) || new Set()
    accountsOnIP.add(userId)
    ipMap.set(ipAddress, accountsOnIP)

    const accountCount = accountsOnIP.size

    return {
      passed: accountCount <= SYBIL_CONFIG.maxAccountsPerIP,
      accountCount,
      flag: accountCount > SYBIL_CONFIG.maxAccountsPerIP ? `${accountCount} accounts from same IP` : undefined,
    }
  } catch (error) {
    console.error('IP clustering check failed:', error)
    return { passed: true, accountCount: 1 } // Fail open on error
  }
}

/**
 * Check wallet verification status (Privy external wallet)
 */
export async function checkWalletVerification(
  userWallet: string,
  walletType: 'embedded' | 'external'
): Promise<{
  passed: boolean
  flag?: string
}> {
  // Embedded wallets are easier to create in bulk (Sybil risk)
  // External wallets (Phantom, Backpack) require user to already have wallet
  const passed = walletType === 'external'

  return {
    passed,
    flag: !passed ? 'Embedded wallet detected - higher Sybil risk' : undefined,
  }
}

/**
 * Calculate user's acceptance rate
 */
export async function calculateAcceptanceRate(
  userId: string
): Promise<{
  rate: number
  totalApplications: number
  acceptedCount: number
}> {
  try {
    // Get all user's applications
    const applications = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_APPLICANTS!,
      [Query.equal('applicantId', userId), Query.limit(1000)]
    )

    const totalApplications = applications.documents.length
    const acceptedCount = applications.documents.filter(
      (app) => app.status === 'accepted'
    ).length

    const rate = totalApplications > 0 ? acceptedCount / totalApplications : 0

    return { rate, totalApplications, acceptedCount }
  } catch (error) {
    console.error('Acceptance rate calculation failed:', error)
    return { rate: 0, totalApplications: 0, acceptedCount: 0 }
  }
}

/**
 * Check for suspicious velocity (too many applications in short time)
 */
export async function checkApplicationVelocity(
  userId: string
): Promise<{
  passed: boolean
  recentCount: number
  flag?: string
}> {
  try {
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()

    const recentApplications = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_APPLICANTS!,
      [
        Query.equal('applicantId', userId),
        Query.greaterThan('createdAt', oneHourAgo),
      ]
    )

    const recentCount = recentApplications.documents.length
    const passed = recentCount <= SYBIL_CONFIG.suspiciousVelocity

    return {
      passed,
      recentCount,
      flag: !passed ? `${recentCount} applications in 1 hour - suspicious velocity` : undefined,
    }
  } catch (error) {
    console.error('Velocity check failed:', error)
    return { passed: true, recentCount: 0 }
  }
}

/**
 * Comprehensive Sybil resistance check
 */
export async function runSybilCheck(
  userId: string,
  userWallet: string,
  ipAddress: string,
  walletType: 'embedded' | 'external'
): Promise<SybilCheckResult> {
  const flags: string[] = []
  let severity: 'none' | 'low' | 'medium' | 'high' = 'none'

  // Run all checks in parallel
  const [keyAgeResult, ipResult, walletResult, acceptanceResult, velocityResult] =
    await Promise.all([
      checkKeyAge(userId, userWallet),
      checkIPClustering(userId, ipAddress),
      checkWalletVerification(userWallet, walletType),
      calculateAcceptanceRate(userId),
      checkApplicationVelocity(userId),
    ])

  // Key age check (HIGH severity)
  if (!keyAgeResult.passed && keyAgeResult.flag) {
    flags.push(keyAgeResult.flag)
    severity = 'high'
  }

  // IP clustering (MEDIUM severity)
  if (!ipResult.passed && ipResult.flag) {
    flags.push(ipResult.flag)
    if (severity === 'none') severity = 'medium'
  }

  // Wallet verification (LOW severity)
  if (!walletResult.passed && walletResult.flag) {
    flags.push(walletResult.flag)
    if (severity === 'none') severity = 'low'
  }

  // Acceptance rate (MEDIUM severity)
  if (
    acceptanceResult.totalApplications >= SYBIL_CONFIG.minApplicationCount &&
    acceptanceResult.rate < SYBIL_CONFIG.minAcceptanceRate
  ) {
    flags.push(
      `Low acceptance rate: ${(acceptanceResult.rate * 100).toFixed(1)}% (${acceptanceResult.acceptedCount}/${acceptanceResult.totalApplications})`
    )
    if (severity === 'none' || severity === 'low') severity = 'medium'
  }

  // Application velocity (HIGH severity)
  if (!velocityResult.passed && velocityResult.flag) {
    flags.push(velocityResult.flag)
    severity = 'high'
  }

  // Determine if action should be allowed
  // HIGH severity = block
  // MEDIUM severity = shadow downrank (allow but lower priority)
  // LOW severity = allow with warning
  const allowAction = severity !== 'high'

  return {
    passed: flags.length === 0,
    flags,
    severity,
    allowAction,
  }
}

/**
 * Calculate Sybil penalty for priority score
 */
export function calculateSybilPenalty(severity: 'none' | 'low' | 'medium' | 'high'): number {
  switch (severity) {
    case 'high':
      return -1000 // Essentially blocks (priority will be negative)
    case 'medium':
      return -50 // Significant downrank
    case 'low':
      return -10 // Minor downrank
    case 'none':
    default:
      return 0
  }
}

/**
 * Log Sybil detection event (for monitoring)
 */
export async function logSybilDetection(
  userId: string,
  result: SybilCheckResult,
  action: string
): Promise<void> {
  if (result.severity === 'none') return

  try {
    // Log to analytics collection
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_ANALYTICS!,
      'unique()',
      {
        type: 'sybil_detection',
        userId,
        action,
        severity: result.severity,
        flags: result.flags,
        timestamp: new Date().toISOString(),
      }
    )
  } catch (error) {
    console.error('Failed to log Sybil detection:', error)
  }
}
