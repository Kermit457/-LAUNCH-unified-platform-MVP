export type NotificationType =
  | 'invite_received'
  | 'invite_accepted'
  | 'invite_declined'
  | 'message_received'
  | 'submission_new'
  | 'submission_approved'
  | 'submission_rejected'
  | 'campaign_live'
  | 'campaign_budget_low'
  | 'quest_reward_claimable'
  | 'payout_received'
  | 'payout_claimable'
  | 'budget_topped_up'
  | 'payment_failed'
  | 'feature_announcement'
  | 'system_maintenance'
  | 'achievement_unlocked'
  | 'milestone_reached'

export type NotificationCategory = 'network' | 'campaign' | 'financial' | 'platform'

export interface Notification {
  id: string
  type: NotificationType
  category: NotificationCategory
  title: string
  message: string
  timestamp: number
  read: boolean
  actionUrl?: string
  actionLabel?: string
  metadata?: {
    userId?: string
    username?: string
    avatar?: string
    campaignId?: string
    campaignName?: string
    submissionId?: string
    amount?: number
    currency?: string
    [key: string]: any
  }
}

export const notificationCategoryMap: Record<NotificationType, NotificationCategory> = {
  invite_received: 'network',
  invite_accepted: 'network',
  invite_declined: 'network',
  message_received: 'network',
  submission_new: 'campaign',
  submission_approved: 'campaign',
  submission_rejected: 'campaign',
  campaign_live: 'campaign',
  campaign_budget_low: 'campaign',
  quest_reward_claimable: 'campaign',
  payout_received: 'financial',
  payout_claimable: 'financial',
  budget_topped_up: 'financial',
  payment_failed: 'financial',
  feature_announcement: 'platform',
  system_maintenance: 'platform',
  achievement_unlocked: 'platform',
  milestone_reached: 'platform',
}
