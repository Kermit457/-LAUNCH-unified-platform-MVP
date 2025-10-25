/**
 * BLAST Analytics Service
 * Track and analyze room performance metrics
 */

import { ID, Query } from 'appwrite'
import { databases } from '../client'
import { BLAST_DATABASE_ID, BLAST_COLLECTIONS } from '../blast-config'
import { BlastRoomsService } from './blast-rooms'
import { BlastApplicantsService } from './blast-applicants'
import type { RoomAnalytics } from '@/lib/types/blast'

const DB_ID = BLAST_DATABASE_ID
const ANALYTICS_COLLECTION = BLAST_COLLECTIONS.ANALYTICS
const ROOMS_COLLECTION = BLAST_COLLECTIONS.ROOMS

export class BlastAnalyticsService {
  /**
   * Get or create analytics record for room
   */
  static async getOrCreateRoomAnalytics(roomId: string): Promise<RoomAnalytics> {
    try {
      // Try to get existing
      const existing = await databases.listDocuments(
        DB_ID,
        ANALYTICS_COLLECTION,
        [Query.equal('roomId', roomId), Query.limit(1)]
      )

      if (existing.total > 0) {
        return existing.documents[0] as any
      }

      // Create new
      const analytics = await databases.createDocument(
        DB_ID,
        ANALYTICS_COLLECTION,
        ID.unique(),
        {
          roomId,
          views: 0,
          applications: 0,
          acceptances: 0,
          rejections: 0,
          avgResponseTime: 0,
          totalKeysLocked: 0,
          peakMotionScore: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      )

      return analytics as any
    } catch (error) {
      throw new Error(`Failed to get analytics: ${error}`)
    }
  }

  /**
   * Calculate full room analytics
   */
  static async calculateRoomAnalytics(roomId: string): Promise<RoomAnalytics> {
    const room = await BlastRoomsService.getRoomById(roomId)
    const applicants = await BlastApplicantsService.getApplicationsByRoom(roomId)

    // Calculate acceptance rate
    const acceptances = applicants.filter(a => a.status === 'accepted').length
    const rejections = applicants.filter(a => a.status === 'rejected').length
    const acceptanceRate = applicants.length > 0 ? (acceptances / applicants.length) * 100 : 0

    // Calculate average response time (in hours)
    const respondedApps = applicants.filter(a => a.respondedAt)
    let avgResponseTime = 0
    if (respondedApps.length > 0) {
      const totalTime = respondedApps.reduce((sum, app) => {
        const applied = new Date(app.appliedAt).getTime()
        const responded = new Date(app.respondedAt!).getTime()
        return sum + (responded - applied)
      }, 0)
      avgResponseTime = totalTime / respondedApps.length / (1000 * 60 * 60) // Convert to hours
    }

    // Calculate keys metrics
    const totalKeysLocked = applicants.reduce((sum, app) => sum + app.keysStaked, 0)
    const avgKeysPerApplicant = applicants.length > 0 ? totalKeysLocked / applicants.length : 0

    // Get or update analytics record
    const analytics = await this.getOrCreateRoomAnalytics(roomId)

    await databases.updateDocument(
      DB_ID,
      ANALYTICS_COLLECTION,
      analytics.$id,
      {
        applications: applicants.length,
        acceptances,
        rejections,
        avgResponseTime: Math.round(avgResponseTime),
        totalKeysLocked,
        peakMotionScore: Math.max(analytics.peakMotionScore || 0, room.motionScore),
        updatedAt: new Date().toISOString()
      }
    )

    return {
      roomId,
      applicants: applicants.length,
      accepted: acceptances,
      acceptanceRate,
      views: analytics.views || 0,
      uniqueViewers: 0, // TODO: Track unique viewers
      avgTimeSpent: 0, // TODO: Track time spent
      totalKeysLocked,
      avgKeysPerApplicant,
      motionScorePeak: Math.max(analytics.peakMotionScore || 0, room.motionScore),
      motionScoreAvg: room.motionScore, // Simplified
      matchesCompleted: acceptances,
      refundsProcessed: 0, // TODO: Track from vault
      forfeitedDeposits: 0 // TODO: Track from vault
    }
  }

  /**
   * Track room view
   */
  static async trackRoomView(roomId: string): Promise<void> {
    const analytics = await this.getOrCreateRoomAnalytics(roomId)

    await databases.updateDocument(
      DB_ID,
      ANALYTICS_COLLECTION,
      analytics.$id,
      {
        views: (analytics.views || 0) + 1,
        updatedAt: new Date().toISOString()
      }
    )
  }

  /**
   * Get top rooms by metric
   */
  static async getTopRooms(
    metric: 'applications' | 'acceptances' | 'totalKeysLocked' | 'peakMotionScore',
    limit = 10
  ) {
    const response = await databases.listDocuments(
      DB_ID,
      ANALYTICS_COLLECTION,
      [
        Query.orderDesc(metric),
        Query.limit(limit)
      ]
    )

    return response.documents
  }

  /**
   * Get creator analytics
   */
  static async getCreatorAnalytics(creatorId: string) {
    const rooms = await BlastRoomsService.getRoomsByCreator(creatorId, 100)

    let totalApplicants = 0
    let totalAccepted = 0
    let totalKeysLocked = 0
    let totalViews = 0

    for (const room of rooms) {
      try {
        const analytics = await this.getOrCreateRoomAnalytics(room.$id)
        totalApplicants += analytics.applications || 0
        totalAccepted += analytics.acceptances || 0
        totalKeysLocked += analytics.totalKeysLocked || 0
        totalViews += analytics.views || 0
      } catch (error) {
        console.error(`Failed to get analytics for room ${room.$id}:`, error)
      }
    }

    return {
      roomsCreated: rooms.length,
      totalApplicants,
      totalAccepted,
      acceptanceRate: totalApplicants > 0 ? (totalAccepted / totalApplicants) * 100 : 0,
      totalKeysLocked,
      totalViews,
      avgApplicantsPerRoom: rooms.length > 0 ? totalApplicants / rooms.length : 0,
      avgAcceptanceRate: rooms.length > 0 ? (totalAccepted / totalApplicants) * 100 : 0
    }
  }

  /**
   * Get leaderboard data
   */
  static async getLeaderboard() {
    // Get top rooms
    const topByApplications = await this.getTopRooms('applications', 5)
    const topByKeys = await this.getTopRooms('totalKeysLocked', 5)
    const topByMotion = await this.getTopRooms('peakMotionScore', 5)

    // Get room details for each
    const roomIds = new Set([
      ...topByApplications.map(a => a.roomId),
      ...topByKeys.map(a => a.roomId),
      ...topByMotion.map(a => a.roomId)
    ])

    const roomDetails = await Promise.all(
      Array.from(roomIds).map(id =>
        BlastRoomsService.getRoomById(id).catch(() => null)
      )
    )

    const roomMap = new Map(
      roomDetails.filter(r => r !== null).map(r => [r!.$id, r])
    )

    return {
      topByApplications: topByApplications.map(a => ({
        ...a,
        room: roomMap.get(a.roomId)
      })),
      topByKeys: topByKeys.map(a => ({
        ...a,
        room: roomMap.get(a.roomId)
      })),
      topByMotion: topByMotion.map(a => ({
        ...a,
        room: roomMap.get(a.roomId)
      }))
    }
  }

  /**
   * Get analytics summary
   */
  static async getAnalyticsSummary() {
    const allRooms = await databases.listDocuments(
      DB_ID,
      ROOMS_COLLECTION,
      [Query.limit(1)]
    )

    const allAnalytics = await databases.listDocuments(
      DB_ID,
      ANALYTICS_COLLECTION,
      [Query.limit(1000)]
    )

    const totalApplicants = allAnalytics.documents.reduce(
      (sum, a) => sum + (a.applications || 0), 0
    )
    const totalKeysLocked = allAnalytics.documents.reduce(
      (sum, a) => sum + (a.totalKeysLocked || 0), 0
    )
    const totalViews = allAnalytics.documents.reduce(
      (sum, a) => sum + (a.views || 0), 0
    )

    return {
      totalRooms: allRooms.total,
      totalApplicants,
      totalKeysLocked,
      totalViews,
      avgApplicantsPerRoom: allRooms.total > 0 ? totalApplicants / allRooms.total : 0
    }
  }
}
