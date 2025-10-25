/**
 * BLAST DM Request Service
 * Pay-to-DM marketplace for room introductions
 */

import { ID, Query } from 'appwrite'
import { databases } from '../client'
import { BLAST_DATABASE_ID, BLAST_COLLECTIONS } from '../blast-config'
import type { DMRequest } from '@/lib/types/blast'

const DB_ID = BLAST_DATABASE_ID
const DM_REQUESTS_COLLECTION = BLAST_COLLECTIONS.DM_REQUESTS

export class BlastDMService {
  /**
   * Create DM request
   */
  static async createDMRequest(params: {
    fromUserId: string
    fromUserName: string
    fromUserAvatar?: string
    toUserId: string
    toUserName: string
    message: string
    depositAmount: number
    roomId?: string
  }): Promise<DMRequest> {
    const {
      fromUserId,
      fromUserName,
      fromUserAvatar,
      toUserId,
      toUserName,
      message,
      depositAmount,
      roomId
    } = params

    // Check if user has already sent a pending request
    const existing = await databases.listDocuments<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      [
        Query.equal('fromUserId', fromUserId),
        Query.equal('toUserId', toUserId),
        Query.equal('status', 'pending')
      ]
    )

    if (existing.total > 0) {
      throw new Error('You already have a pending request to this user')
    }

    // Create expiration time (48 hours)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48)

    const dmRequest = await databases.createDocument<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      ID.unique(),
      {
        requesterId: fromUserId,
        requesterName: fromUserName,
        requesterAvatar: fromUserAvatar,
        targetId: toUserId,
        targetName: toUserName,
        roomId: roomId || undefined,
        message,
        keysOffered: depositAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
      }
    )

    return {
      ...dmRequest,
      fromUserId,
      fromUserName,
      fromUserAvatar,
      toUserId,
      toUserName,
      depositAmount,
      refunded: false
    } as DMRequest
  }

  /**
   * Accept DM request
   */
  static async acceptDMRequest(
    requestId: string,
    dmThreadId?: string
  ): Promise<DMRequest> {
    const request = await databases.getDocument<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      requestId
    )

    if (request.status !== 'pending') {
      throw new Error('Request is not pending')
    }

    // Check if expired
    if (new Date(request.expiresAt) < new Date()) {
      throw new Error('Request has expired')
    }

    const updated = await databases.updateDocument<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      requestId,
      {
        status: 'accepted',
        respondedAt: new Date().toISOString(),
        dmThreadId: dmThreadId || undefined
      }
    )

    return updated
  }

  /**
   * Decline DM request (refund keys)
   */
  static async declineDMRequest(requestId: string): Promise<DMRequest> {
    const request = await databases.getDocument<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      requestId
    )

    if (request.status !== 'pending') {
      throw new Error('Request is not pending')
    }

    const updated = await databases.updateDocument<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      requestId,
      {
        status: 'declined',
        respondedAt: new Date().toISOString(),
        refunded: true
      }
    )

    // TODO: Process refund to fromUserId

    return updated
  }

  /**
   * Get incoming DM requests (for user)
   */
  static async getIncomingRequests(
    userId: string,
    status?: 'pending' | 'accepted' | 'declined' | 'expired'
  ): Promise<DMRequest[]> {
    const queries = [
      Query.equal('targetId', userId),
      Query.orderDesc('createdAt'),
      Query.limit(50)
    ]

    if (status) {
      queries.push(Query.equal('status', status))
    }

    const response = await databases.listDocuments<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      queries
    )

    return response.documents
  }

  /**
   * Get outgoing DM requests (sent by user)
   */
  static async getOutgoingRequests(
    userId: string,
    status?: 'pending' | 'accepted' | 'declined' | 'expired'
  ): Promise<DMRequest[]> {
    const queries = [
      Query.equal('requesterId', userId),
      Query.orderDesc('createdAt'),
      Query.limit(50)
    ]

    if (status) {
      queries.push(Query.equal('status', status))
    }

    const response = await databases.listDocuments<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      queries
    )

    return response.documents
  }

  /**
   * Process expired DM requests
   */
  static async processExpiredRequests(): Promise<{ processed: number }> {
    const now = new Date()

    const expired = await databases.listDocuments<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      [
        Query.equal('status', 'pending'),
        Query.lessThan('expiresAt', now.toISOString()),
        Query.limit(100)
      ]
    )

    let processed = 0

    for (const request of expired.documents) {
      try {
        await databases.updateDocument<DMRequest>(
          DB_ID,
          DM_REQUESTS_COLLECTION,
          request.$id,
          {
            status: 'expired',
            refunded: true
          }
        )

        // TODO: Process refund

        processed++
      } catch (error) {
        console.error(`Failed to expire request ${request.$id}:`, error)
      }
    }

    return { processed }
  }

  /**
   * Get DM request by ID
   */
  static async getDMRequest(requestId: string): Promise<DMRequest> {
    return databases.getDocument<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      requestId
    )
  }

  /**
   * Get DM request count for user
   */
  static async getPendingRequestCount(userId: string): Promise<number> {
    const response = await databases.listDocuments<DMRequest>(
      DB_ID,
      DM_REQUESTS_COLLECTION,
      [
        Query.equal('targetId', userId),
        Query.equal('status', 'pending'),
        Query.limit(1)
      ]
    )

    return response.total
  }
}
