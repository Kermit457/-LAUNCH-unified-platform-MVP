/**
 * BLAST Rooms Service
 * Complete CRUD operations for Deal Rooms
 */

import { ID, Query } from 'appwrite'
import { databases } from '../client'
import { BLAST_DATABASE_ID, BLAST_COLLECTIONS } from '../blast-config'
import type { BlastRoom, RoomFilters, PaginatedRooms, RoomMetadata } from '@/lib/types/blast'
import type { RoomInput } from '@/lib/validations/blast'
import { getRoomDurationHours } from '@/lib/constants/blast'

const DB_ID = BLAST_DATABASE_ID
const ROOMS_COLLECTION = BLAST_COLLECTIONS.ROOMS

export class BlastRoomsService {
  /**
   * Create a new room
   */
  static async createRoom(
    input: RoomInput,
    creatorId: string,
    creatorName: string,
    creatorAvatar?: string,
    creatorMotionScore?: number
  ): Promise<BlastRoom> {
    // Calculate end time based on duration
    const durationHours = getRoomDurationHours(input.duration)
    const endTime = new Date()
    endTime.setHours(endTime.getHours() + durationHours)

    const roomData = {
      ...input,
      creatorId,
      creatorName,
      creatorAvatar: creatorAvatar || undefined,
      creatorMotionScore: creatorMotionScore || 0,

      // Initialize metrics
      filledSlots: 0,
      applicantCount: 0,
      acceptedCount: 0,
      watcherCount: 0,
      totalKeysLocked: 0,
      motionScore: 0,

      // Set status
      status: 'open' as const,
      extended: false,

      // Timestamps
      startTime: new Date().toISOString(),
      endTime: endTime.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const room = await databases.createDocument<BlastRoom>(
      DB_ID,
      ROOMS_COLLECTION,
      ID.unique(),
      roomData
    )

    return room
  }

  /**
   * Get rooms with filters and pagination
   */
  static async getRooms(params: {
    filters?: RoomFilters
    limit?: number
    offset?: number
    sortBy?: 'createdAt' | 'motionScore' | 'endTime'
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedRooms> {
    const {
      filters = {},
      limit = 10,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    const queries: string[] = []

    // Apply filters
    if (filters.type) {
      queries.push(Query.equal('type', filters.type))
    }

    if (filters.status) {
      queries.push(Query.equal('status', filters.status))
    }

    if (filters.tags && filters.tags.length > 0) {
      queries.push(Query.contains('tags', filters.tags))
    }

    if (filters.minMotionScore !== undefined) {
      queries.push(Query.greaterThanEqual('motionScore', filters.minMotionScore))
    }

    // Sorting
    if (sortOrder === 'desc') {
      queries.push(Query.orderDesc(sortBy))
    } else {
      queries.push(Query.orderAsc(sortBy))
    }

    // Pagination
    queries.push(Query.limit(limit))
    queries.push(Query.offset(offset))

    const response = await databases.listDocuments<BlastRoom>(
      DB_ID,
      ROOMS_COLLECTION,
      queries
    )

    return {
      rooms: response.documents,
      total: response.total,
      hasMore: offset + limit < response.total,
      nextCursor: offset + limit < response.total ? (offset + limit).toString() : undefined,
    }
  }

  /**
   * Get single room by ID
   */
  static async getRoomById(roomId: string): Promise<BlastRoom> {
    return databases.getDocument<BlastRoom>(
      DB_ID,
      ROOMS_COLLECTION,
      roomId
    )
  }

  /**
   * Update room
   */
  static async updateRoom(
    roomId: string,
    updates: Partial<BlastRoom>
  ): Promise<BlastRoom> {
    return databases.updateDocument<BlastRoom>(
      DB_ID,
      ROOMS_COLLECTION,
      roomId,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    )
  }

  /**
   * Update room status
   */
  static async updateRoomStatus(
    roomId: string,
    status: 'open' | 'hot' | 'closing' | 'closed' | 'archived'
  ): Promise<BlastRoom> {
    return this.updateRoom(roomId, { status })
  }

  /**
   * Increment applicant count
   */
  static async incrementApplicantCount(roomId: string): Promise<void> {
    const room = await this.getRoomById(roomId)
    await this.updateRoom(roomId, {
      applicantCount: room.applicantCount + 1
    })
  }

  /**
   * Increment accepted count and filled slots
   */
  static async incrementAcceptedCount(roomId: string): Promise<void> {
    const room = await this.getRoomById(roomId)
    await this.updateRoom(roomId, {
      acceptedCount: room.acceptedCount + 1,
      filledSlots: room.filledSlots + 1
    })
  }

  /**
   * Update Motion Score
   */
  static async updateMotionScore(
    roomId: string,
    motionScore: number
  ): Promise<void> {
    await this.updateRoom(roomId, { motionScore })
  }

  /**
   * Lock keys to room (update totalKeysLocked)
   */
  static async lockKeysToRoom(
    roomId: string,
    keysAmount: number
  ): Promise<void> {
    const room = await this.getRoomById(roomId)
    await this.updateRoom(roomId, {
      totalKeysLocked: room.totalKeysLocked + keysAmount
    })
  }

  /**
   * Extend room duration (one-time, 24h extension)
   */
  static async extendRoom(roomId: string): Promise<BlastRoom> {
    const room = await this.getRoomById(roomId)

    if (room.extended) {
      throw new Error('Room has already been extended')
    }

    if (room.status !== 'hot') {
      throw new Error('Only Hot rooms can be extended')
    }

    const newEndTime = new Date(room.endTime)
    newEndTime.setHours(newEndTime.getHours() + 24)

    return this.updateRoom(roomId, {
      endTime: newEndTime.toISOString(),
      extended: true
    })
  }

  /**
   * Close room
   */
  static async closeRoom(roomId: string): Promise<BlastRoom> {
    return this.updateRoomStatus(roomId, 'closed')
  }

  /**
   * Archive room
   */
  static async archiveRoom(roomId: string): Promise<BlastRoom> {
    return this.updateRoomStatus(roomId, 'archived')
  }

  /**
   * Check if room is full
   */
  static async isRoomFull(roomId: string): Promise<boolean> {
    const room = await this.getRoomById(roomId)
    return room.filledSlots >= room.totalSlots
  }

  /**
   * Check if room is expired
   */
  static async isRoomExpired(roomId: string): Promise<boolean> {
    const room = await this.getRoomById(roomId)
    return new Date(room.endTime) <= new Date()
  }

  /**
   * Get rooms by creator
   */
  static async getRoomsByCreator(
    creatorId: string,
    limit = 10
  ): Promise<BlastRoom[]> {
    const response = await databases.listDocuments<BlastRoom>(
      DB_ID,
      ROOMS_COLLECTION,
      [
        Query.equal('creatorId', creatorId),
        Query.orderDesc('createdAt'),
        Query.limit(limit)
      ]
    )

    return response.documents
  }

  /**
   * Get hot rooms (for homepage)
   */
  static async getHotRooms(limit = 5): Promise<BlastRoom[]> {
    const response = await databases.listDocuments<BlastRoom>(
      DB_ID,
      ROOMS_COLLECTION,
      [
        Query.equal('status', 'hot'),
        Query.orderDesc('motionScore'),
        Query.limit(limit)
      ]
    )

    return response.documents
  }

  /**
   * Get closing soon rooms
   */
  static async getClosingSoonRooms(limit = 10): Promise<BlastRoom[]> {
    const response = await databases.listDocuments<BlastRoom>(
      DB_ID,
      ROOMS_COLLECTION,
      [
        Query.equal('status', 'closing'),
        Query.orderAsc('endTime'),
        Query.limit(limit)
      ]
    )

    return response.documents
  }

  /**
   * Search rooms by title/description
   */
  static async searchRooms(
    query: string,
    limit = 20
  ): Promise<BlastRoom[]> {
    const response = await databases.listDocuments<BlastRoom>(
      DB_ID,
      ROOMS_COLLECTION,
      [
        Query.search('title', query),
        Query.limit(limit)
      ]
    )

    return response.documents
  }

  /**
   * Get room analytics
   */
  static async getRoomAnalytics(roomId: string) {
    const room = await this.getRoomById(roomId)

    return {
      applicants: room.applicantCount,
      accepted: room.acceptedCount,
      acceptanceRate: room.applicantCount > 0
        ? (room.acceptedCount / room.applicantCount) * 100
        : 0,
      keysLocked: room.totalKeysLocked,
      motionScore: room.motionScore,
      fillRate: (room.filledSlots / room.totalSlots) * 100,
      timeRemaining: Math.max(
        0,
        new Date(room.endTime).getTime() - new Date().getTime()
      ) / 1000, // seconds
    }
  }

  /**
   * Delete room (admin only, use sparingly)
   */
  static async deleteRoom(roomId: string): Promise<void> {
    await databases.deleteDocument(DB_ID, ROOMS_COLLECTION, roomId)
  }
}
