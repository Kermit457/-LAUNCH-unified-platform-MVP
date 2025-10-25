/**
 * BLAST Smart Matching Service
 * AI-powered recommendations for users and creators
 */

import { Query } from 'appwrite'
import { databases } from '../client'
import { BlastMotionService } from './blast-motion'
import { BlastApplicantsService } from './blast-applicants'
import { BlastRoomsService } from './blast-rooms'
import type { Room, Applicant } from '@/lib/types/blast'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const ROOMS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_BLAST_ROOMS_COLLECTION!
const APPLICANTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_BLAST_APPLICANTS_COLLECTION!

interface MatchScore {
  roomId: string
  score: number
  reasons: string[]
  room?: Room
}

interface ApplicantMatchScore {
  applicantId: string
  score: number
  reasons: string[]
  applicant?: Applicant
}

interface UserProfile {
  userId: string
  motionScore: number
  keyBalance: number
  applicationHistory: {
    roomType: string
    status: string
  }[]
}

export class BlastMatchingService {
  /**
   * Get recommended rooms for a user
   */
  static async getRecommendedRooms(
    userId: string,
    keyBalance: number,
    limit = 10
  ): Promise<MatchScore[]> {
    try {
      // Get user's Motion Score
      const userMotion = await BlastMotionService.getMotionScore(userId)
      const userMotionScore = userMotion?.score || 0

      // Get user's application history
      const history = await databases.listDocuments(DB_ID, APPLICANTS_COLLECTION, [
        Query.equal('userId', userId),
        Query.limit(50),
        Query.orderDesc('$createdAt'),
      ])

      const profile: UserProfile = {
        userId,
        motionScore: userMotionScore,
        keyBalance,
        applicationHistory: history.documents.map(doc => ({
          roomType: doc.roomType || 'deal',
          status: doc.status,
        })),
      }

      // Get active rooms (open or hot)
      const rooms = await databases.listDocuments<Room>(DB_ID, ROOMS_COLLECTION, [
        Query.equal('status', ['open', 'hot']),
        Query.limit(100),
        Query.orderDesc('motionScore'),
      ])

      // Calculate match scores
      const matches: MatchScore[] = []

      for (const room of rooms.documents) {
        // Skip if user is the creator
        if (room.creatorId === userId) continue

        // Skip if user already applied
        const alreadyApplied = profile.applicationHistory.some(
          h => h.roomType === room.type
        )

        const matchScore = this.calculateRoomMatchScore(profile, room)

        if (matchScore.score > 0) {
          matches.push({
            ...matchScore,
            roomId: room.$id,
            room,
          })
        }
      }

      // Sort by score descending
      matches.sort((a, b) => b.score - a.score)

      return matches.slice(0, limit)
    } catch (error) {
      console.error('Failed to get recommended rooms:', error)
      return []
    }
  }

  /**
   * Calculate match score between user and room
   */
  private static calculateRoomMatchScore(
    profile: UserProfile,
    room: Room
  ): { score: number; reasons: string[] } {
    let score = 0
    const reasons: string[] = []

    // Base score: Room motion score (0-50 points)
    const roomMotionWeight = Math.min(room.motionScore / 2, 50)
    score += roomMotionWeight
    if (room.motionScore > 50) {
      reasons.push('🔥 Hot room with high engagement')
    }

    // User motion score alignment (0-30 points)
    // High motion users → high value rooms, low motion → accessible rooms
    const motionAlignment = this.calculateMotionAlignment(
      profile.motionScore,
      room.minKeys || 0
    )
    score += motionAlignment
    if (motionAlignment > 20) {
      reasons.push('✨ Perfect match for your reputation')
    }

    // Key balance check (0-20 points, or disqualify)
    if (profile.keyBalance < (room.minKeys || 0)) {
      // User doesn't have enough keys - heavily penalize but don't disqualify
      score -= 50
      reasons.push(`🔒 Requires ${room.minKeys} keys (you have ${profile.keyBalance})`)
    } else {
      const keyFit = Math.min((profile.keyBalance / (room.minKeys || 1)) * 10, 20)
      score += keyFit
      if (keyFit > 15) {
        reasons.push('💰 You exceed the key requirement')
      }
    }

    // Room type preference (0-20 points)
    const typePreference = this.calculateTypePreference(profile.applicationHistory, room.type)
    score += typePreference
    if (typePreference > 15) {
      reasons.push(`🎯 Matches your interest in ${room.type} rooms`)
    }

    // Availability check (0-10 points)
    if (room.maxSlots) {
      const availabilityRatio = 1 - room.filledSlots / room.maxSlots
      const availabilityScore = availabilityRatio * 10
      score += availabilityScore

      if (availabilityRatio < 0.2) {
        reasons.push('⚡ Filling up fast!')
      } else if (availabilityRatio > 0.8) {
        reasons.push('🎫 Plenty of spots available')
      }
    } else {
      score += 10 // Unlimited slots
    }

    // Recency bonus (0-10 points)
    const hoursOld = (Date.now() - new Date(room.$createdAt).getTime()) / (1000 * 60 * 60)
    if (hoursOld < 24) {
      const recencyBonus = (24 - hoursOld) / 24 * 10
      score += recencyBonus
      if (hoursOld < 6) {
        reasons.push('🆕 Just posted!')
      }
    }

    return { score: Math.max(0, score), reasons }
  }

  /**
   * Calculate how well user's motion score aligns with room requirements
   */
  private static calculateMotionAlignment(
    userMotion: number,
    roomMinKeys: number
  ): number {
    // High motion users are better fits for high-barrier rooms
    // Low motion users are better fits for accessible rooms

    if (roomMinKeys === 0) {
      // Open to all - slight preference for lower motion
      return userMotion < 50 ? 20 : 15
    }

    if (roomMinKeys >= 10) {
      // High barrier - prefer high motion
      return Math.min((userMotion / 100) * 30, 30)
    }

    if (roomMinKeys >= 5) {
      // Medium barrier - prefer medium motion
      const idealMotion = 50
      const distance = Math.abs(userMotion - idealMotion)
      return Math.max(0, 25 - distance / 5)
    }

    // Low barrier - accessible to all
    return 20
  }

  /**
   * Calculate user's preference for room type based on history
   */
  private static calculateTypePreference(
    history: { roomType: string; status: string }[],
    roomType: string
  ): number {
    if (history.length === 0) return 10 // Neutral for new users

    // Count applications and acceptances for this type
    const typeApplications = history.filter(h => h.roomType === roomType)
    const typeAcceptances = typeApplications.filter(h => h.status === 'accepted')

    // Strong preference if user has applied to this type before
    if (typeApplications.length > 0) {
      const successRate = typeAcceptances.length / typeApplications.length
      return 15 + successRate * 5 // 15-20 points
    }

    // Slight preference for types user hasn't tried yet (exploration)
    const uniqueTypes = new Set(history.map(h => h.roomType))
    if (!uniqueTypes.has(roomType)) {
      return 12 // Encourage diversity
    }

    return 10 // Neutral
  }

  /**
   * Get best-fit applicants for a room (creator view)
   */
  static async getBestFitApplicants(
    roomId: string,
    limit = 50
  ): Promise<ApplicantMatchScore[]> {
    try {
      const room = await BlastRoomsService.getRoomById(roomId)
      const applicants = await BlastApplicantsService.getApplicationsByRoom(roomId)

      const matches: ApplicantMatchScore[] = []

      for (const applicant of applicants) {
        // Get applicant's Motion Score
        const motionScore = await BlastMotionService.getMotionScore(applicant.userId)
        const applicantMotion = motionScore?.score || 0

        const matchScore = this.calculateApplicantMatchScore(
          applicant,
          applicantMotion,
          room
        )

        matches.push({
          ...matchScore,
          applicantId: applicant.$id,
          applicant,
        })
      }

      // Sort by score descending
      matches.sort((a, b) => b.score - a.score)

      return matches.slice(0, limit)
    } catch (error) {
      console.error('Failed to get best fit applicants:', error)
      return []
    }
  }

  /**
   * Calculate applicant match score for a room
   */
  private static calculateApplicantMatchScore(
    applicant: Applicant,
    applicantMotion: number,
    room: Room
  ): { score: number; reasons: string[] } {
    let score = 0
    const reasons: string[] = []

    // Base score: Keys staked (0-40 points)
    const keysRatio = applicant.keysStaked / Math.max(room.minKeys || 1, 1)
    const keysScore = Math.min(keysRatio * 20, 40)
    score += keysScore

    if (keysRatio >= 2) {
      reasons.push(`💎 Staked ${applicant.keysStaked}x minimum`)
    } else if (applicant.keysStaked > (room.minKeys || 0)) {
      reasons.push(`✅ Staked ${applicant.keysStaked} keys`)
    }

    // Motion Score (0-40 points)
    const motionScore = Math.min((applicantMotion / 100) * 40, 40)
    score += motionScore

    if (applicantMotion > 75) {
      reasons.push('🌟 Highly reputable member')
    } else if (applicantMotion > 50) {
      reasons.push('⭐ Active community member')
    } else if (applicantMotion < 20) {
      reasons.push('🆕 New to the network')
    }

    // Priority score from queue (0-20 points)
    const priorityScore = Math.min((applicant.priorityScore / 100) * 20, 20)
    score += priorityScore

    if (priorityScore > 15) {
      reasons.push('🎯 High priority in queue')
    }

    // Application quality indicators
    if (applicant.message && applicant.message.length > 100) {
      score += 10
      reasons.push('📝 Detailed application')
    } else if (applicant.message && applicant.message.length > 20) {
      score += 5
    }

    // Recency (0-10 points)
    const hoursOld = (Date.now() - new Date(applicant.appliedAt).getTime()) / (1000 * 60 * 60)
    if (hoursOld < 1) {
      score += 10
      reasons.push('⚡ Just applied')
    } else if (hoursOld < 6) {
      score += 5
    }

    return { score, reasons }
  }

  /**
   * Get match score for a specific user-room pair
   */
  static async getMatchScore(
    userId: string,
    roomId: string,
    keyBalance: number
  ): Promise<MatchScore | null> {
    try {
      const room = await BlastRoomsService.getRoomById(roomId)
      const userMotion = await BlastMotionService.getMotionScore(userId)

      const history = await databases.listDocuments(DB_ID, APPLICANTS_COLLECTION, [
        Query.equal('userId', userId),
        Query.limit(50),
      ])

      const profile: UserProfile = {
        userId,
        motionScore: userMotion?.score || 0,
        keyBalance,
        applicationHistory: history.documents.map(doc => ({
          roomType: doc.roomType || 'deal',
          status: doc.status,
        })),
      }

      const matchScore = this.calculateRoomMatchScore(profile, room)

      return {
        roomId: room.$id,
        ...matchScore,
        room,
      }
    } catch (error) {
      console.error('Failed to get match score:', error)
      return null
    }
  }
}
