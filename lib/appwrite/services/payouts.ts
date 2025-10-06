import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface Payout {
  $id: string
  payoutId: string
  userId: string
  campaignId?: string
  questId?: string
  amount: number
  currency: string
  status: 'pending' | 'claimable' | 'claimed' | 'paid'
  txHash?: string
  claimedAt?: string
  paidAt?: string
  fee?: number
  net?: number
  $createdAt: string
}

/**
 * Get payouts for a user
 */
export async function getPayouts(options?: {
  userId?: string
  status?: string
  limit?: number
}) {
  const queries = []

  if (options?.userId) {
    queries.push(Query.equal('userId', options.userId))
  }

  if (options?.status) {
    queries.push(Query.equal('status', options.status))
  }

  queries.push(Query.limit(options?.limit || 100))
  queries.push(Query.orderDesc('$createdAt'))

  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.PAYOUTS,
    queries
  )

  return response.documents as unknown as Payout[]
}

/**
 * Get a single payout by ID
 */
export async function getPayout(id: string) {
  const payout = await databases.getDocument(
    DB_ID,
    COLLECTIONS.PAYOUTS,
    id
  )

  return payout as unknown as Payout
}

/**
 * Create a new payout
 */
export async function createPayout(data: Omit<Payout, '$id' | '$createdAt'>) {
  const payout = await databases.createDocument(
    DB_ID,
    COLLECTIONS.PAYOUTS,
    ID.unique(),
    data
  )

  return payout as unknown as Payout
}

/**
 * Update a payout
 */
export async function updatePayout(id: string, data: Partial<Payout>) {
  const payout = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.PAYOUTS,
    id,
    data
  )

  return payout as unknown as Payout
}

/**
 * Claim a payout (update status to claimed)
 */
export async function claimPayout(id: string) {
  const payout = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.PAYOUTS,
    id,
    {
      status: 'claimed',
      claimedAt: new Date().toISOString()
    }
  )

  return payout as unknown as Payout
}

/**
 * Get user's total earnings
 */
export async function getUserTotalEarnings(userId: string) {
  const payouts = await getPayouts({ userId })

  const total = payouts.reduce((sum, payout) => {
    return sum + (payout.net || payout.amount)
  }, 0)

  return total
}

/**
 * Get user's claimable balance
 */
export async function getUserClaimableBalance(userId: string) {
  const payouts = await getPayouts({ userId, status: 'claimable' })

  const total = payouts.reduce((sum, payout) => {
    return sum + (payout.net || payout.amount)
  }, 0)

  return total
}
