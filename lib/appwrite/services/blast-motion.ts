/**
 * BLAST Motion Score Service
 * Exponential decay reputation system
 */

import { ID, Query } from 'appwrite'
import { databases } from '../client'
import { BLAST_DATABASE_ID, BLAST_COLLECTIONS } from '../blast-config'
import type { MotionScore, MotionEvent as MotionEventType } from '@/lib/types/blast'
import { MOTION_WEIGHTS, MOTION_DECAY_TAU, type MotionEvent } from '@/lib/constants/blast'

const DB_ID = BLAST_DATABASE_ID
const MOTION_SCORES_COLLECTION = BLAST_COLLECTIONS.MOTION_SCORES
const MOTION_EVENTS_COLLECTION = BLAST_COLLECTIONS.MOTION_EVENTS

export class BlastMotionService {
  /**
   * Get or create Motion Score for user
   */
  static async getOrCreateScore(userId: string): Promise<MotionScore> {
    try {
      return await databases.getDocument<MotionScore>(
        DB_ID,
        MOTION_SCORES_COLLECTION,
        userId
      )
    } catch {
      // Create new score
      return await databases.createDocument<MotionScore>(
        DB_ID,
        MOTION_SCORES_COLLECTION,
        userId,
        {
          userId,
          currentScore: 0,
          baseScore: 0,
          decayAmount: 0,
          tau: MOTION_DECAY_TAU,
          lastDecayAt: new Date().toISOString(),
          signals: {} as Record<MotionEvent, number>,
          scoreHistory: [],
          peakScore: 0,
          updatedAt: new Date().toISOString(),
        }
      )
    }
  }

  /**
   * Record an event
   */
  static async recordEvent(params: {
    type: MotionEvent
    actorId: string
    roomId?: string
    targetId?: string
    metadata?: Record<string, any>
  }): Promise<MotionEventType> {
    const { type, actorId, roomId, targetId, metadata = {} } = params

    const weight = MOTION_WEIGHTS[type] || 0

    const event = await databases.createDocument<MotionEventType>(
      DB_ID,
      MOTION_EVENTS_COLLECTION,
      ID.unique(),
      {
        type,
        actorId,
        roomId: roomId || undefined,
        targetId: targetId || undefined,
        weight,
        decayRate: MOTION_DECAY_TAU,
        metadata,
        timestamp: new Date().toISOString(),
      }
    )

    // Update score immediately
    await this.calculateScore(actorId)

    return event
  }

  /**
   * Calculate current Motion Score with exponential decay
   */
  static async calculateScore(userId: string): Promise<MotionScore> {
    // Get or create score record
    const scoreRecord = await this.getOrCreateScore(userId)

    // Get all events from last 72 hours * 2 (to account for full decay)
    const since = new Date()
    since.setHours(since.getHours() - (MOTION_DECAY_TAU * 2))

    const events = await databases.listDocuments<MotionEventType>(
      DB_ID,
      MOTION_EVENTS_COLLECTION,
      [
        Query.equal('actorId', userId),
        Query.greaterThan('timestamp', since.toISOString()),
        Query.limit(1000)
      ]
    )

    // Calculate base score and signals
    let baseScore = 0
    const signals: Record<MotionEvent, number> = {} as any

    for (const event of events.documents) {
      const eventType = event.type as MotionEvent
      const points = MOTION_WEIGHTS[eventType] || 0
      baseScore += points
      signals[eventType] = (signals[eventType] || 0) + points
    }

    // Apply exponential decay: Score(t) = Σ (weight × e^(-Δt/τ))
    const now = Date.now()
    let decayedScore = 0

    for (const event of events.documents) {
      const eventTime = new Date(event.timestamp).getTime()
      const ageHours = (now - eventTime) / (1000 * 60 * 60)

      // Exponential decay factor: e^(-Δt/τ)
      const decayFactor = Math.exp(-ageHours / MOTION_DECAY_TAU)

      const eventPoints = event.weight * decayFactor
      decayedScore += eventPoints
    }

    // Round to integer
    const currentScore = Math.round(Math.min(decayedScore, 100))
    const decayAmount = baseScore - decayedScore

    // Update score history snapshot
    const scoreHistory = [
      ...scoreRecord.scoreHistory.slice(-23), // Keep last 24 snapshots
      {
        score: currentScore,
        timestamp: new Date().toISOString(),
      }
    ]

    // Update peak score
    const peakScore = Math.max(scoreRecord.peakScore, currentScore)

    // Update score record
    const updated = await databases.updateDocument<MotionScore>(
      DB_ID,
      MOTION_SCORES_COLLECTION,
      userId,
      {
        currentScore,
        baseScore,
        decayAmount,
        lastDecayAt: new Date().toISOString(),
        signals,
        scoreHistory,
        peakScore,
        updatedAt: new Date().toISOString(),
      }
    )

    return updated
  }

  /**
   * Get Motion Score breakdown
   */
  static async getScoreBreakdown(userId: string) {
    const score = await this.getOrCreateScore(userId)

    return {
      current: score.currentScore,
      base: score.baseScore,
      decay: score.decayAmount,
      signals: score.signals,
      history: score.scoreHistory,
      peak: score.peakScore,
      lastUpdated: score.lastDecayAt,
    }
  }

  /**
   * Get leaderboard
   */
  static async getLeaderboard(limit = 100): Promise<Array<{
    userId: string
    score: number
    rank: number
  }>> {
    const response = await databases.listDocuments<MotionScore>(
      DB_ID,
      MOTION_SCORES_COLLECTION,
      [
        Query.orderDesc('currentScore'),
        Query.limit(limit)
      ]
    )

    return response.documents.map((doc, index) => ({
      userId: doc.userId,
      score: doc.currentScore,
      rank: index + 1,
    }))
  }

  /**
   * Get user's rank
   */
  static async getUserRank(userId: string): Promise<number> {
    const score = await this.getOrCreateScore(userId)

    // Count how many users have higher scores
    const response = await databases.listDocuments<MotionScore>(
      DB_ID,
      MOTION_SCORES_COLLECTION,
      [
        Query.greaterThan('currentScore', score.currentScore),
        Query.limit(10000)
      ]
    )

    return response.total + 1
  }

  /**
   * Batch calculate scores (for cron job)
   */
  static async batchCalculateScores(userIds: string[]): Promise<void> {
    for (const userId of userIds) {
      try {
        await this.calculateScore(userId)
      } catch (error) {
        console.error(`Failed to calculate score for ${userId}:`, error)
      }
    }
  }

  /**
   * Get recent events for user
   */
  static async getRecentEvents(
    userId: string,
    limit = 50
  ): Promise<MotionEventType[]> {
    const response = await databases.listDocuments<MotionEventType>(
      DB_ID,
      MOTION_EVENTS_COLLECTION,
      [
        Query.equal('actorId', userId),
        Query.orderDesc('timestamp'),
        Query.limit(limit)
      ]
    )

    return response.documents
  }
}
