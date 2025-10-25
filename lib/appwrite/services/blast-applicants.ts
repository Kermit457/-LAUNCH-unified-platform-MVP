/**
 * BLAST Applicants Service
 * Application submission, priority queue, and approval flow
 */

import { ID, Query } from 'appwrite'
import { databases } from '../client'
import { BLAST_DATABASE_ID, BLAST_COLLECTIONS } from '../blast-config'
import type { BlastApplicant, ActivityRecord } from '@/lib/types/blast'
import { BlastVaultService } from './blast-vault'
import { BlastRoomsService } from './blast-rooms'
import { PRIORITY_WEIGHTS } from '@/lib/constants/blast'

const DB_ID = BLAST_DATABASE_ID
const APPLICANTS_COLLECTION = BLAST_COLLECTIONS.APPLICANTS

export class BlastApplicantsService {
  /**
   * Submit application to room
   */
  static async apply(params: {
    roomId: string
    userId: string
    userName: string
    userAvatar?: string
    userMotionScore: number
    message: string
    keysStaked: number
    lockId: string
    attachments?: string[]
  }): Promise<BlastApplicant> {
    const {
      roomId,
      userId,
      userName,
      userAvatar,
      userMotionScore,
      message,
      keysStaked,
      lockId,
      attachments = []
    } = params

    // Check if already applied
    const existing = await databases.listDocuments<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      [
        Query.equal('roomId', roomId),
        Query.equal('userId', userId)
      ]
    )

    if (existing.total > 0) {
      throw new Error('Already applied to this room')
    }

    // Calculate priority score
    const priorityScore = this.calculatePriorityScore({
      keysStaked,
      motionScore: userMotionScore,
      activityBonus: 0, // Initial, will be updated
      referralBonus: 0, // TODO: Check if brought new holders
    })

    // Create application
    const application = await databases.createDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      ID.unique(),
      {
        roomId,
        userId,
        userName,
        userAvatar: userAvatar || undefined,
        userMotionScore,
        status: 'pending',
        message,
        attachments,
        keysStaked,
        priorityScore,
        depositAmount: keysStaked,
        depositRefunded: false,
        depositForfeit: false,
        lockId,
        activityCount: 0,
        activities: [],
        lastActiveAt: new Date().toISOString(),
        appliedAt: new Date().toISOString(),
      }
    )

    // Update room applicant count
    await BlastRoomsService.incrementApplicantCount(roomId)

    return application
  }

  /**
   * Get applications for a room (priority queue)
   */
  static async getApplicationsByRoom(
    roomId: string,
    status?: 'pending' | 'accepted' | 'rejected'
  ): Promise<BlastApplicant[]> {
    const queries = [
      Query.equal('roomId', roomId),
      Query.orderDesc('priorityScore'),
      Query.limit(100)
    ]

    if (status) {
      queries.push(Query.equal('status', status))
    }

    const response = await databases.listDocuments<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      queries
    )

    return response.documents
  }

  /**
   * Get applications by user
   */
  static async getApplicationsByUser(
    userId: string,
    status?: string
  ): Promise<BlastApplicant[]> {
    const queries = [
      Query.equal('userId', userId),
      Query.orderDesc('appliedAt'),
      Query.limit(50)
    ]

    if (status) {
      queries.push(Query.equal('status', status))
    }

    const response = await databases.listDocuments<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      queries
    )

    return response.documents
  }

  /**
   * Accept application
   */
  static async acceptApplication(
    applicationId: string,
    acceptedBy: string
  ): Promise<BlastApplicant> {
    const application = await databases.getDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId
    )

    if (application.status !== 'pending') {
      throw new Error('Application is not pending')
    }

    // Update application
    const updated = await databases.updateDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId,
      {
        status: 'accepted',
        respondedAt: new Date().toISOString(),
      }
    )

    // Update room accepted count
    await BlastRoomsService.incrementAcceptedCount(application.roomId)

    // Release keys if activity criteria met
    if (application.activityCount >= 2) {
      await BlastVaultService.releaseKeys(application.lockId)
    }

    return updated
  }

  /**
   * Reject application
   */
  static async rejectApplication(
    applicationId: string,
    reason?: string
  ): Promise<BlastApplicant> {
    const application = await databases.getDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId
    )

    if (application.status !== 'pending') {
      throw new Error('Application is not pending')
    }

    // Update application
    const updated = await databases.updateDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId,
      {
        status: 'rejected',
        respondedAt: new Date().toISOString(),
      }
    )

    // Refund keys
    await BlastVaultService.releaseKeys(application.lockId)

    return updated
  }

  /**
   * Withdraw application
   */
  static async withdrawApplication(applicationId: string): Promise<BlastApplicant> {
    const application = await databases.getDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId
    )

    if (application.status !== 'pending') {
      throw new Error('Can only withdraw pending applications')
    }

    // Update application
    const updated = await databases.updateDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId,
      {
        status: 'withdrawn',
      }
    )

    // Refund keys
    await BlastVaultService.releaseKeys(application.lockId)

    return updated
  }

  /**
   * Add activity to application
   */
  static async addActivity(
    applicationId: string,
    activityType: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const application = await databases.getDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId
    )

    const activity: ActivityRecord = {
      type: activityType,
      timestamp: new Date().toISOString(),
      metadata,
    }

    await databases.updateDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId,
      {
        activityCount: application.activityCount + 1,
        activities: [...application.activities, activity],
        lastActiveAt: new Date().toISOString(),
      }
    )

    // Recalculate priority score
    await this.updatePriorityScore(applicationId)
  }

  /**
   * Calculate priority score
   */
  private static calculatePriorityScore(params: {
    keysStaked: number
    motionScore: number
    activityBonus: number
    referralBonus: number
  }): number {
    const { keysStaked, motionScore, activityBonus, referralBonus } = params

    return (
      keysStaked * PRIORITY_WEIGHTS.KEYS_STAKED +
      motionScore * PRIORITY_WEIGHTS.MOTION_SCORE +
      activityBonus * PRIORITY_WEIGHTS.ACTIVITY_BONUS +
      referralBonus * PRIORITY_WEIGHTS.REFERRAL_BONUS
    )
  }

  /**
   * Update priority score
   */
  static async updatePriorityScore(applicationId: string): Promise<void> {
    const application = await databases.getDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId
    )

    const activityBonus = Math.min(application.activityCount, 10)

    const newScore = this.calculatePriorityScore({
      keysStaked: application.keysStaked,
      motionScore: application.userMotionScore,
      activityBonus,
      referralBonus: 0, // TODO: Calculate referral bonus
    })

    await databases.updateDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId,
      {
        priorityScore: newScore,
      }
    )
  }

  /**
   * Process refunds for closed room
   */
  static async processRoomRefunds(roomId: string): Promise<void> {
    const applications = await this.getApplicationsByRoom(roomId, 'pending')

    for (const app of applications) {
      // Check if eligible for refund
      if (app.activityCount >= 2) {
        // Refund keys
        await BlastVaultService.releaseKeys(app.lockId)

        await databases.updateDocument<BlastApplicant>(
          DB_ID,
          APPLICANTS_COLLECTION,
          app.$id,
          {
            depositRefunded: true,
          }
        )
      } else {
        // Forfeit keys (no-show)
        await BlastVaultService.forfeitKeys(app.lockId)

        await databases.updateDocument<BlastApplicant>(
          DB_ID,
          APPLICANTS_COLLECTION,
          app.$id,
          {
            depositForfeit: true,
          }
        )
      }
    }
  }

  /**
   * Get application by ID
   */
  static async getApplicationById(applicationId: string): Promise<BlastApplicant> {
    return databases.getDocument<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      applicationId
    )
  }

  /**
   * Check if user has applied to room
   */
  static async hasApplied(userId: string, roomId: string): Promise<boolean> {
    const response = await databases.listDocuments<BlastApplicant>(
      DB_ID,
      APPLICANTS_COLLECTION,
      [
        Query.equal('userId', userId),
        Query.equal('roomId', roomId),
        Query.limit(1)
      ]
    )

    return response.total > 0
  }
}
