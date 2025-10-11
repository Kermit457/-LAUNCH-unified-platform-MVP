import { ID, Query } from 'appwrite'
import { appwriteClient } from '../client'
import type { ReferralReward, RewardStatus } from '@/types/referral'

const { database, referralRewardsCollectionId } = appwriteClient

export class ReferralRewardService {
  /**
   * Create a new referral reward
   */
  static async createReward(
    reward: Omit<ReferralReward, 'id' | 'createdAt' | 'claimedAt'>
  ): Promise<ReferralReward> {
    try {
      const document = await database.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralRewardsCollectionId,
        ID.unique(),
        {
          ...reward,
          createdAt: new Date().toISOString(),
          claimedAt: reward.status === 'claimed' ? new Date().toISOString() : null
        }
      )
      return document as unknown as ReferralReward
    } catch (error) {
      console.error('Error creating referral reward:', error)
      throw error
    }
  }

  /**
   * Get reward by ID
   */
  static async getRewardById(rewardId: string): Promise<ReferralReward | null> {
    try {
      const document = await database.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralRewardsCollectionId,
        rewardId
      )
      return document as unknown as ReferralReward
    } catch (error) {
      console.error('Error fetching reward:', error)
      return null
    }
  }

  /**
   * Get all rewards for a user
   */
  static async getUserRewards(
    userId: string,
    status?: RewardStatus,
    limit = 100,
    offset = 0
  ): Promise<ReferralReward[]> {
    try {
      const queries = [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ]

      if (status) {
        queries.push(Query.equal('status', status))
      }

      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralRewardsCollectionId,
        queries
      )
      return response.documents as unknown as ReferralReward[]
    } catch (error) {
      console.error('Error fetching user rewards:', error)
      return []
    }
  }

  /**
   * Get pending rewards for a user
   */
  static async getPendingRewards(userId: string): Promise<ReferralReward[]> {
    return this.getUserRewards(userId, 'pending')
  }

  /**
   * Get claimed rewards for a user
   */
  static async getClaimedRewards(userId: string): Promise<ReferralReward[]> {
    return this.getUserRewards(userId, 'claimed')
  }

  /**
   * Claim a reward
   */
  static async claimReward(
    rewardId: string,
    walletAddress: string
  ): Promise<ReferralReward | null> {
    try {
      const reward = await this.getRewardById(rewardId)
      if (!reward || reward.status !== 'pending') {
        console.error('Reward not found or already claimed')
        return null
      }

      const updatedReward = await database.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralRewardsCollectionId,
        rewardId,
        {
          status: 'claimed',
          claimedAt: new Date().toISOString(),
          walletAddress
        }
      )
      return updatedReward as unknown as ReferralReward
    } catch (error) {
      console.error('Error claiming reward:', error)
      return null
    }
  }

  /**
   * Batch claim multiple rewards
   */
  static async batchClaimRewards(
    userId: string,
    walletAddress: string
  ): Promise<{
    claimed: ReferralReward[]
    failed: string[]
    totalAmount: number
  }> {
    try {
      const pendingRewards = await this.getPendingRewards(userId)
      const claimed: ReferralReward[] = []
      const failed: string[] = []
      let totalAmount = 0

      for (const reward of pendingRewards) {
        const claimedReward = await this.claimReward(reward.id, walletAddress)
        if (claimedReward) {
          claimed.push(claimedReward)
          totalAmount += claimedReward.amount
        } else {
          failed.push(reward.id)
        }
      }

      return { claimed, failed, totalAmount }
    } catch (error) {
      console.error('Error batch claiming rewards:', error)
      return { claimed: [], failed: [], totalAmount: 0 }
    }
  }

  /**
   * Get total pending rewards amount
   */
  static async getTotalPendingAmount(userId: string): Promise<number> {
    try {
      const pendingRewards = await this.getPendingRewards(userId)
      return pendingRewards.reduce((total, reward) => total + reward.amount, 0)
    } catch (error) {
      console.error('Error calculating pending amount:', error)
      return 0
    }
  }

  /**
   * Get total claimed rewards amount
   */
  static async getTotalClaimedAmount(userId: string): Promise<number> {
    try {
      const claimedRewards = await this.getClaimedRewards(userId)
      return claimedRewards.reduce((total, reward) => total + reward.amount, 0)
    } catch (error) {
      console.error('Error calculating claimed amount:', error)
      return 0
    }
  }

  /**
   * Get reward statistics
   */
  static async getRewardStats(userId: string): Promise<{
    pendingCount: number
    pendingAmount: number
    claimedCount: number
    claimedAmount: number
    expiredCount: number
    expiredAmount: number
    totalAmount: number
  }> {
    try {
      const [pending, claimed, expired] = await Promise.all([
        this.getUserRewards(userId, 'pending'),
        this.getUserRewards(userId, 'claimed'),
        this.getUserRewards(userId, 'expired')
      ])

      const pendingAmount = pending.reduce((sum, r) => sum + r.amount, 0)
      const claimedAmount = claimed.reduce((sum, r) => sum + r.amount, 0)
      const expiredAmount = expired.reduce((sum, r) => sum + r.amount, 0)

      return {
        pendingCount: pending.length,
        pendingAmount,
        claimedCount: claimed.length,
        claimedAmount,
        expiredCount: expired.length,
        expiredAmount,
        totalAmount: pendingAmount + claimedAmount + expiredAmount
      }
    } catch (error) {
      console.error('Error getting reward stats:', error)
      return {
        pendingCount: 0,
        pendingAmount: 0,
        claimedCount: 0,
        claimedAmount: 0,
        expiredCount: 0,
        expiredAmount: 0,
        totalAmount: 0
      }
    }
  }

  /**
   * Check and expire old unclaimed rewards
   */
  static async expireOldRewards(daysOld = 90): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralRewardsCollectionId,
        [
          Query.equal('status', 'pending'),
          Query.lessThan('createdAt', cutoffDate.toISOString()),
          Query.limit(100)
        ]
      )

      let expiredCount = 0
      for (const reward of response.documents) {
        try {
          await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            referralRewardsCollectionId,
            reward.$id,
            { status: 'expired' }
          )
          expiredCount++
        } catch (error) {
          console.error(`Error expiring reward ${reward.$id}:`, error)
        }
      }

      return expiredCount
    } catch (error) {
      console.error('Error expiring old rewards:', error)
      return 0
    }
  }

  /**
   * Get rewards by referral ID
   */
  static async getRewardsByReferralId(referralId: string): Promise<ReferralReward[]> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralRewardsCollectionId,
        [
          Query.equal('referralId', referralId),
          Query.orderDesc('createdAt')
        ]
      )
      return response.documents as unknown as ReferralReward[]
    } catch (error) {
      console.error('Error fetching rewards by referral:', error)
      return []
    }
  }

  /**
   * Get recent reward activity
   */
  static async getRecentActivity(
    userId: string,
    days = 7
  ): Promise<ReferralReward[]> {
    try {
      const since = new Date()
      since.setDate(since.getDate() - days)

      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralRewardsCollectionId,
        [
          Query.equal('userId', userId),
          Query.greaterThanEqual('createdAt', since.toISOString()),
          Query.orderDesc('createdAt'),
          Query.limit(50)
        ]
      )
      return response.documents as unknown as ReferralReward[]
    } catch (error) {
      console.error('Error fetching recent reward activity:', error)
      return []
    }
  }
}