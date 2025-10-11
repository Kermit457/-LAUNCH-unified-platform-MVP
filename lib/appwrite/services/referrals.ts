import { ID, Query } from 'appwrite'
import { appwriteClient } from '../client'
import type { Referral, ReferralAction, ReferralWithDetails } from '@/types/referral'

const { database, referralsCollectionId } = appwriteClient

export class ReferralService {
  /**
   * Create a new referral record
   */
  static async createReferral(
    referral: Omit<Referral, 'id' | 'timestamp'>
  ): Promise<Referral> {
    try {
      const document = await database.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralsCollectionId,
        ID.unique(),
        {
          ...referral,
          timestamp: new Date().toISOString(),
        }
      )
      return document as unknown as Referral
    } catch (error) {
      console.error('Error creating referral:', error)
      throw error
    }
  }

  /**
   * Get referral by ID
   */
  static async getReferralById(referralId: string): Promise<Referral | null> {
    try {
      const document = await database.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralsCollectionId,
        referralId
      )
      return document as unknown as Referral
    } catch (error) {
      console.error('Error fetching referral:', error)
      return null
    }
  }

  /**
   * Get all referrals for a specific user (as referrer)
   */
  static async getReferralsByReferrer(
    referrerId: string,
    limit = 100,
    offset = 0
  ): Promise<Referral[]> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralsCollectionId,
        [
          Query.equal('referrerId', referrerId),
          Query.orderDesc('timestamp'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return response.documents as unknown as Referral[]
    } catch (error) {
      console.error('Error fetching referrer referrals:', error)
      return []
    }
  }

  /**
   * Get all referrals for a specific user (as referred)
   */
  static async getReferralsByReferred(
    referredId: string,
    limit = 100,
    offset = 0
  ): Promise<Referral[]> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralsCollectionId,
        [
          Query.equal('referredId', referredId),
          Query.orderDesc('timestamp'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return response.documents as unknown as Referral[]
    } catch (error) {
      console.error('Error fetching referred referrals:', error)
      return []
    }
  }

  /**
   * Get referrals by action type
   */
  static async getReferralsByAction(
    action: ReferralAction,
    limit = 100,
    offset = 0
  ): Promise<Referral[]> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralsCollectionId,
        [
          Query.equal('action', action),
          Query.orderDesc('timestamp'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return response.documents as unknown as Referral[]
    } catch (error) {
      console.error('Error fetching referrals by action:', error)
      return []
    }
  }

  /**
   * Get referrals by project
   */
  static async getReferralsByProject(
    projectId: string,
    limit = 100,
    offset = 0
  ): Promise<Referral[]> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralsCollectionId,
        [
          Query.equal('projectId', projectId),
          Query.orderDesc('timestamp'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )
      return response.documents as unknown as Referral[]
    } catch (error) {
      console.error('Error fetching project referrals:', error)
      return []
    }
  }

  /**
   * Check if a user has been referred
   */
  static async hasBeenReferred(userId: string): Promise<boolean> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralsCollectionId,
        [
          Query.equal('referredId', userId),
          Query.equal('action', 'profile_creation' as ReferralAction),
          Query.limit(1)
        ]
      )
      return response.documents.length > 0
    } catch (error) {
      console.error('Error checking referral status:', error)
      return false
    }
  }

  /**
   * Get user's referrer (if any)
   */
  static async getUserReferrer(userId: string): Promise<string | null> {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralsCollectionId,
        [
          Query.equal('referredId', userId),
          Query.equal('action', 'profile_creation' as ReferralAction),
          Query.limit(1)
        ]
      )
      if (response.documents.length > 0) {
        const referral = response.documents[0] as unknown as Referral
        return referral.referrerId
      }
      return null
    } catch (error) {
      console.error('Error getting user referrer:', error)
      return null
    }
  }

  /**
   * Get total earnings from referrals
   */
  static async getTotalEarnings(referrerId: string): Promise<number> {
    try {
      const referrals = await this.getReferralsByReferrer(referrerId, 1000, 0)
      return referrals.reduce((total, referral) => total + referral.referralAmount, 0)
    } catch (error) {
      console.error('Error calculating total earnings:', error)
      return 0
    }
  }

  /**
   * Get referral stats for a user
   */
  static async getReferralStats(referrerId: string): Promise<{
    totalReferrals: number
    totalEarnings: number
    totalTransactions: number
    averageTransaction: number
  }> {
    try {
      const referrals = await this.getReferralsByReferrer(referrerId, 1000, 0)
      const totalReferrals = new Set(referrals.map(r => r.referredId)).size
      const totalEarnings = referrals.reduce((sum, r) => sum + r.referralAmount, 0)
      const totalTransactions = referrals.length
      const averageTransaction = totalTransactions > 0 ? totalEarnings / totalTransactions : 0

      return {
        totalReferrals,
        totalEarnings,
        totalTransactions,
        averageTransaction
      }
    } catch (error) {
      console.error('Error getting referral stats:', error)
      return {
        totalReferrals: 0,
        totalEarnings: 0,
        totalTransactions: 0,
        averageTransaction: 0
      }
    }
  }

  /**
   * Get recent referral activity
   */
  static async getRecentActivity(
    referrerId: string,
    days = 7
  ): Promise<Referral[]> {
    try {
      const since = new Date()
      since.setDate(since.getDate() - days)

      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        referralsCollectionId,
        [
          Query.equal('referrerId', referrerId),
          Query.greaterThanEqual('timestamp', since.toISOString()),
          Query.orderDesc('timestamp'),
          Query.limit(100)
        ]
      )
      return response.documents as unknown as Referral[]
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }
  }
}