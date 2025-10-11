export type ReferralAction = 'follow' | 'join' | 'create' | 'buy' | 'boost'
export type ReferralStatus = 'pending' | 'completed' | 'failed'
export type ReferralLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
export type PoolScope = 'global' | 'page'
export type LeaderboardRange = 'day' | 'week' | 'month' | 'all'

export interface Referral {
  $id: string
  $createdAt: string
  referrerId: string | null
  referredId: string
  action: ReferralAction
  page: string
  grossAmount: number
  reserveAmount: number
  projectAmount: number
  platformAmount: number
  referralAmount: number
  rewardsPoolAmount: number
  projectId?: string
  txId?: string
  status: ReferralStatus
}

export interface ReferralReward {
  $id: string
  $createdAt: string
  $updatedAt: string
  referrerId: string
  totalEarned: number
  todayEarned: number
  weekEarned: number
  monthEarned: number
  totalReferrals: number
  activeReferrals: number
  level: ReferralLevel
  lastPayoutAt?: string
  lastResetAt: string
}

export interface RewardsPool {
  $id: string
  $createdAt: string
  $updatedAt: string
  scope: PoolScope
  pageId?: string
  balance: number
  totalDeposited: number
  totalClaimed: number
  last7dInflow: number
  last30dInflow: number
}

export interface ReferralSplit {
  gross: number
  reserve: number
  project: number
  platform: number
  referral: number
  toRewardsPool: boolean
}

export interface LeaderboardEntry {
  rank: number
  referrerId: string
  username: string
  avatar?: string
  earned: number
  referralCount: number
  level: ReferralLevel
}

export interface ReferralStats {
  userId: string
  totalEarned: number
  todayEarned: number
  weekEarned: number
  monthEarned: number
  totalReferrals: number
  activeReferrals: number
  level: ReferralLevel
  rank: number
  referralCode: string
}

export interface LevelProgress {
  current: ReferralLevel
  next: ReferralLevel | null
  progress: number // 0-100
  amountToNext: number
}