import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface Activity {
  $id: string
  activityId: string
  userId: string
  type: 'submission' | 'campaign_live' | 'payout' | 'approval' | 'topup' | 'network' | 'launch'
  category: 'campaign' | 'submission' | 'earning' | 'network' | 'launch'
  title: string
  message?: string
  metadata?: string
  actionUrl?: string
  read: boolean
  $createdAt: string

  // Entity scoping fields
  contextType?: 'user' | 'project'
  contextId?: string
}

/**
 * Get activities for a user or project context
 * Supports entity scoping via contextType and contextId
 */
export async function getActivities(userId: string, limit = 50, options?: {
  contextType?: 'user' | 'project'
  contextId?: string
}) {
  const queries = [
    Query.equal('userId', userId),
    Query.limit(limit),
    Query.orderDesc('$createdAt')
  ]

  // Entity scoping: filter by context
  if (options?.contextType) {
    queries.push(Query.equal('contextType', options.contextType))
  }

  if (options?.contextId) {
    queries.push(Query.equal('contextId', options.contextId))
  }

  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.ACTIVITIES,
    queries
  )

  return response.documents as unknown as Activity[]
}

/**
 * Get unread activity count
 */
export async function getUnreadActivityCount(userId: string) {
  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.ACTIVITIES,
    [
      Query.equal('userId', userId),
      Query.equal('read', false),
      Query.limit(100)
    ]
  )

  return response.total
}

/**
 * Create a new activity
 */
export async function createActivity(data: Omit<Activity, '$id' | '$createdAt'>) {
  const activity = await databases.createDocument(
    DB_ID,
    COLLECTIONS.ACTIVITIES,
    ID.unique(),
    {
      ...data,
      activityId: data.activityId || `activity_${Date.now()}`
    }
  )

  return activity as unknown as Activity
}

/**
 * Mark activity as read
 */
export async function markActivityAsRead(id: string) {
  const activity = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.ACTIVITIES,
    id,
    { read: true }
  )

  return activity as unknown as Activity
}

/**
 * Mark all activities as read for a user
 */
export async function markAllActivitiesAsRead(userId: string) {
  const activities = await getActivities(userId, 100)
  const unreadActivities = activities.filter(a => !a.read)

  const promises = unreadActivities.map(activity =>
    markActivityAsRead(activity.$id)
  )

  await Promise.all(promises)

  return unreadActivities.length
}

/**
 * Delete an activity
 */
export async function deleteActivity(id: string) {
  await databases.deleteDocument(
    DB_ID,
    COLLECTIONS.ACTIVITIES,
    id
  )
}

/**
 * Helper: Create submission activity
 */
export async function createSubmissionActivity(
  userId: string,
  submissionId: string,
  campaignTitle: string
) {
  return createActivity({
    activityId: `submission_${submissionId}`,
    userId,
    type: 'submission',
    category: 'submission',
    title: `New submission for "${campaignTitle}"`,
    message: 'Your submission is pending review',
    actionUrl: `/dashboard/submissions`,
    read: false
  })
}

/**
 * Helper: Create payout activity
 */
export async function createPayoutActivity(
  userId: string,
  payoutId: string,
  amount: number,
  currency: string
) {
  return createActivity({
    activityId: `payout_${payoutId}`,
    userId,
    type: 'payout',
    category: 'earning',
    title: `Payment of $${amount.toFixed(2)} ${currency} is claimable`,
    message: 'Click to claim your earnings',
    actionUrl: `/dashboard/earnings`,
    read: false
  })
}

/**
 * Helper: Create campaign live activity
 */
export async function createCampaignLiveActivity(
  userId: string,
  campaignId: string,
  campaignTitle: string
) {
  return createActivity({
    activityId: `campaign_${campaignId}`,
    userId,
    type: 'campaign_live',
    category: 'campaign',
    title: `Campaign "${campaignTitle}" is now live`,
    message: 'Start earning by participating now',
    actionUrl: `/campaign/${campaignId}`,
    read: false
  })
}
