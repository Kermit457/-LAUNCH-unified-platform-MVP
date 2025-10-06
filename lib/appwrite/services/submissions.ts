import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface Submission {
  $id: string
  submissionId: string
  campaignId?: string
  questId?: string
  userId: string
  status: 'pending' | 'approved' | 'rejected'
  mediaUrl: string
  views: number
  earnings: number
  notes?: string
  reviewedAt?: string
  $createdAt: string
}

/**
 * Get submissions with filters
 */
export async function getSubmissions(options?: {
  userId?: string
  campaignId?: string
  questId?: string
  status?: string
  limit?: number
}) {
  const queries = []

  if (options?.userId) {
    queries.push(Query.equal('userId', options.userId))
  }

  if (options?.campaignId) {
    queries.push(Query.equal('campaignId', options.campaignId))
  }

  if (options?.questId) {
    queries.push(Query.equal('questId', options.questId))
  }

  if (options?.status) {
    queries.push(Query.equal('status', options.status))
  }

  queries.push(Query.limit(options?.limit || 100))
  queries.push(Query.orderDesc('$createdAt'))

  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.SUBMISSIONS,
    queries
  )

  return response.documents as unknown as Submission[]
}

/**
 * Get a single submission by ID
 */
export async function getSubmission(id: string) {
  const submission = await databases.getDocument(
    DB_ID,
    COLLECTIONS.SUBMISSIONS,
    id
  )

  return submission as unknown as Submission
}

/**
 * Create a new submission
 */
export async function createSubmission(data: Omit<Submission, '$id' | '$createdAt'>) {
  const submission = await databases.createDocument(
    DB_ID,
    COLLECTIONS.SUBMISSIONS,
    ID.unique(),
    {
      ...data,
      submissionId: data.submissionId || `sub_${Date.now()}`
    }
  )

  return submission as unknown as Submission
}

/**
 * Update a submission
 */
export async function updateSubmission(id: string, data: Partial<Submission>) {
  const submission = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.SUBMISSIONS,
    id,
    data
  )

  return submission as unknown as Submission
}

/**
 * Approve a submission
 */
export async function approveSubmission(id: string, earnings: number, notes?: string) {
  const submission = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.SUBMISSIONS,
    id,
    {
      status: 'approved',
      earnings,
      notes,
      reviewedAt: new Date().toISOString()
    }
  )

  return submission as unknown as Submission
}

/**
 * Reject a submission
 */
export async function rejectSubmission(id: string, notes?: string) {
  const submission = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.SUBMISSIONS,
    id,
    {
      status: 'rejected',
      earnings: 0,
      notes,
      reviewedAt: new Date().toISOString()
    }
  )

  return submission as unknown as Submission
}

/**
 * Delete a submission
 */
export async function deleteSubmission(id: string) {
  await databases.deleteDocument(
    DB_ID,
    COLLECTIONS.SUBMISSIONS,
    id
  )
}

/**
 * Get user's total submissions count
 */
export async function getUserSubmissionsCount(userId: string, status?: string) {
  const submissions = await getSubmissions({ userId, status, limit: 1000 })
  return submissions.length
}

/**
 * Get user's total earnings from submissions
 */
export async function getUserSubmissionsEarnings(userId: string) {
  const submissions = await getSubmissions({ userId, status: 'approved', limit: 1000 })

  const total = submissions.reduce((sum, sub) => sum + (sub.earnings || 0), 0)

  return total
}

/**
 * Get campaign's total submissions
 */
export async function getCampaignSubmissions(campaignId: string) {
  return getSubmissions({ campaignId, limit: 1000 })
}

/**
 * Get campaign's pending reviews count
 */
export async function getCampaignPendingReviews(campaignId: string) {
  const submissions = await getSubmissions({ campaignId, status: 'pending', limit: 1000 })
  return submissions.length
}
