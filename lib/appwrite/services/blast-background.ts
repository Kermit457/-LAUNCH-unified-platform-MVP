/**
 * BLAST Background Jobs Service
 * Handles status transitions, refunds, and Motion Score decay
 *
 * This should be called by:
 * 1. Vercel Cron Job (recommended)
 * 2. API route hit by external cron service
 * 3. Client-side useEffect (fallback, less reliable)
 */

import { Query } from 'appwrite'
import { databases } from '../client'
import { BLAST_DATABASE_ID, BLAST_COLLECTIONS } from '../blast-config'
import { BlastRoomsService } from './blast-rooms'
import { BlastApplicantsService } from './blast-applicants'
import { BlastMotionService } from './blast-motion'
import type { BlastRoom } from '@/lib/types/blast'

const DB_ID = BLAST_DATABASE_ID
const ROOMS_COLLECTION = BLAST_COLLECTIONS.ROOMS

export class BlastBackgroundService {
  /**
   * Process room status transitions
   * Should run every 5 minutes
   */
  static async processRoomStatusTransitions(): Promise<{
    updated: number
    closed: number
    errors: string[]
  }> {
    const errors: string[] = []
    let updated = 0
    let closed = 0

    try {
      const now = new Date()

      // Get all non-closed rooms
      const rooms = await databases.listDocuments<BlastRoom>(
        DB_ID,
        ROOMS_COLLECTION,
        [
          Query.notEqual('status', 'closed'),
          Query.notEqual('status', 'archived'),
          Query.limit(100)
        ]
      )

      for (const room of rooms.documents) {
        try {
          const endTime = new Date(room.endTime)
          const timeRemaining = endTime.getTime() - now.getTime()
          const hoursRemaining = timeRemaining / (1000 * 60 * 60)

          // Transition to CLOSING (last 3 hours)
          if (room.status === 'hot' && hoursRemaining <= 3 && hoursRemaining > 0) {
            await BlastRoomsService.updateRoomStatus(room.$id, 'closing')
            updated++
            continue
          }

          // Transition to CLOSED (time expired)
          if (timeRemaining <= 0 && room.status !== 'closed') {
            await BlastRoomsService.closeRoom(room.$id)
            // Process refunds
            await BlastApplicantsService.processRoomRefunds(room.$id)
            closed++
            continue
          }

          // Transition to HOT (has engagement)
          if (room.status === 'open' && room.applicantCount >= 3) {
            await BlastRoomsService.updateRoomStatus(room.$id, 'hot')
            updated++
            continue
          }
        } catch (error) {
          errors.push(`Room ${room.$id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    } catch (error) {
      errors.push(`Global error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return { updated, closed, errors }
  }

  /**
   * Process Motion Score decay for all active users
   * Should run every hour
   */
  static async processMotionScoreDecay(): Promise<{
    processed: number
    errors: string[]
  }> {
    const errors: string[] = []
    let processed = 0

    try {
      // Get all Motion Score records
      const scores = await databases.listDocuments(
        DB_ID,
        BLAST_COLLECTIONS.MOTION_SCORES,
        [Query.limit(1000)]
      )

      const userIds = scores.documents.map(score => score.userId)

      // Batch calculate scores (applies decay)
      await BlastMotionService.batchCalculateScores(userIds)

      processed = userIds.length
    } catch (error) {
      errors.push(`Motion decay error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return { processed, errors }
  }

  /**
   * Process refunds for recently closed rooms
   * Should run every 10 minutes
   */
  static async processRecentRefunds(): Promise<{
    processed: number
    errors: string[]
  }> {
    const errors: string[] = []
    let processed = 0

    try {
      // Get rooms closed in last 15 minutes that haven't been processed
      const fifteenMinutesAgo = new Date()
      fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15)

      const closedRooms = await databases.listDocuments<BlastRoom>(
        DB_ID,
        ROOMS_COLLECTION,
        [
          Query.equal('status', 'closed'),
          Query.greaterThan('updatedAt', fifteenMinutesAgo.toISOString()),
          Query.limit(50)
        ]
      )

      for (const room of closedRooms.documents) {
        try {
          await BlastApplicantsService.processRoomRefunds(room.$id)
          processed++
        } catch (error) {
          // May already be processed, ignore
          if (error instanceof Error && !error.message.includes('already processed')) {
            errors.push(`Room ${room.$id}: ${error.message}`)
          }
        }
      }
    } catch (error) {
      errors.push(`Refund processing error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return { processed, errors }
  }

  /**
   * Run all background jobs
   * Can be called from a single cron endpoint
   */
  static async runAll(): Promise<{
    statusTransitions: Awaited<ReturnType<typeof BlastBackgroundService.processRoomStatusTransitions>>
    motionDecay: Awaited<ReturnType<typeof BlastBackgroundService.processMotionScoreDecay>>
    refunds: Awaited<ReturnType<typeof BlastBackgroundService.processRecentRefunds>>
  }> {
    const [statusTransitions, motionDecay, refunds] = await Promise.all([
      this.processRoomStatusTransitions(),
      this.processMotionScoreDecay(),
      this.processRecentRefunds()
    ])

    return { statusTransitions, motionDecay, refunds }
  }

  /**
   * Health check - get stats about pending jobs
   */
  static async getJobStats(): Promise<{
    activeRooms: number
    closingSoonRooms: number
    expiredRooms: number
    activeUsers: number
  }> {
    const now = new Date()
    const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000)

    const [
      activeRooms,
      closingSoon,
      expired,
      activeUsers
    ] = await Promise.all([
      databases.listDocuments(DB_ID, ROOMS_COLLECTION, [
        Query.equal('status', 'open'),
        Query.limit(1)
      ]),
      databases.listDocuments(DB_ID, ROOMS_COLLECTION, [
        Query.equal('status', 'hot'),
        Query.lessThan('endTime', threeHoursLater.toISOString()),
        Query.limit(1)
      ]),
      databases.listDocuments(DB_ID, ROOMS_COLLECTION, [
        Query.notEqual('status', 'closed'),
        Query.lessThan('endTime', now.toISOString()),
        Query.limit(1)
      ]),
      databases.listDocuments(DB_ID, BLAST_COLLECTIONS.MOTION_SCORES, [
        Query.greaterThan('currentScore', 0),
        Query.limit(1)
      ])
    ])

    return {
      activeRooms: activeRooms.total,
      closingSoonRooms: closingSoon.total,
      expiredRooms: expired.total,
      activeUsers: activeUsers.total
    }
  }
}
