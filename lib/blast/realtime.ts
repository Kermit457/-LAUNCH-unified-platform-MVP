/**
 * BLAST Real-Time Service
 * WebSocket-based real-time updates using Appwrite Realtime
 *
 * Replaces React Query polling (5s) with WebSocket subscriptions
 */

import { client } from '@/lib/appwrite/client'
import type { RealtimeResponseEvent } from 'appwrite'

type SubscriptionCallback<T = any> = (data: T) => void
type UnsubscribeFunction = () => void

// Event types
export type RoomEvent = {
  type: 'room.created' | 'room.updated' | 'room.closed' | 'room.status_changed'
  roomId: string
  data: any
}

export type ApplicantEvent = {
  type: 'applicant.joined' | 'applicant.accepted' | 'applicant.rejected'
  roomId: string
  applicantId: string
  data: any
}

export type MotionScoreEvent = {
  type: 'motion.updated' | 'motion.decayed'
  userId: string
  score: number
  change: number
}

export type VaultEvent = {
  type: 'vault.locked' | 'vault.unlocked' | 'vault.refunded'
  userId: string
  amount: number
  roomId?: string
}

export type NotificationEvent = {
  type: 'notification.new'
  userId: string
  notification: any
}

/**
 * Subscribe to room updates
 * Fires when room status changes, applicants join, etc.
 */
export function subscribeToRoom(
  roomId: string,
  callback: SubscriptionCallback<RoomEvent>
): UnsubscribeFunction {
  const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_ROOMS}.documents.${roomId}`

  const unsubscribe = client.subscribe<RealtimeResponseEvent<any>>(channel, (response) => {
    // Parse Appwrite event
    const eventType = response.events[0]

    if (eventType?.includes('create')) {
      callback({
        type: 'room.created',
        roomId,
        data: response.payload,
      })
    } else if (eventType?.includes('update')) {
      callback({
        type: 'room.updated',
        roomId,
        data: response.payload,
      })
    } else if (eventType?.includes('delete')) {
      callback({
        type: 'room.closed',
        roomId,
        data: response.payload,
      })
    }
  })

  return unsubscribe
}

/**
 * Subscribe to room applicant queue
 * Fires when new applicants join or get accepted/rejected
 */
export function subscribeToRoomApplicants(
  roomId: string,
  callback: SubscriptionCallback<ApplicantEvent>
): UnsubscribeFunction {
  const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_APPLICANTS}.documents`

  const unsubscribe = client.subscribe<RealtimeResponseEvent<any>>(channel, (response) => {
    const payload = response.payload

    // Filter only applicants for this room
    if (payload.roomId !== roomId) return

    const eventType = response.events[0]

    if (eventType?.includes('create')) {
      callback({
        type: 'applicant.joined',
        roomId,
        applicantId: payload.applicantId,
        data: payload,
      })
    } else if (eventType?.includes('update')) {
      // Check status change
      if (payload.status === 'accepted') {
        callback({
          type: 'applicant.accepted',
          roomId,
          applicantId: payload.applicantId,
          data: payload,
        })
      } else if (payload.status === 'rejected') {
        callback({
          type: 'applicant.rejected',
          roomId,
          applicantId: payload.applicantId,
          data: payload,
        })
      }
    }
  })

  return unsubscribe
}

/**
 * Subscribe to user's Motion Score updates
 */
export function subscribeToMotionScore(
  userId: string,
  callback: SubscriptionCallback<MotionScoreEvent>
): UnsubscribeFunction {
  const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_MOTION_SCORES}.documents`

  const unsubscribe = client.subscribe<RealtimeResponseEvent<any>>(channel, (response) => {
    const payload = response.payload

    // Filter only this user
    if (payload.userId !== userId) return

    const eventType = response.events[0]

    if (eventType?.includes('update')) {
      callback({
        type: 'motion.updated',
        userId,
        score: payload.currentScore,
        change: payload.lastChange || 0,
      })
    }
  })

  return unsubscribe
}

/**
 * Subscribe to global Motion Score leaderboard
 * Fires when any user's score changes
 */
export function subscribeToLeaderboard(
  callback: SubscriptionCallback<MotionScoreEvent>
): UnsubscribeFunction {
  const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_MOTION_SCORES}.documents`

  const unsubscribe = client.subscribe<RealtimeResponseEvent<any>>(channel, (response) => {
    const payload = response.payload
    const eventType = response.events[0]

    if (eventType?.includes('update') || eventType?.includes('create')) {
      callback({
        type: 'motion.updated',
        userId: payload.userId,
        score: payload.currentScore,
        change: payload.lastChange || 0,
      })
    }
  })

  return unsubscribe
}

/**
 * Subscribe to user's vault updates
 */
export function subscribeToVault(
  userId: string,
  callback: SubscriptionCallback<VaultEvent>
): UnsubscribeFunction {
  const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_VAULT}.documents`

  const unsubscribe = client.subscribe<RealtimeResponseEvent<any>>(channel, (response) => {
    const payload = response.payload

    // Filter only this user
    if (payload.userId !== userId) return

    const eventType = response.events[0]

    if (eventType?.includes('create')) {
      callback({
        type: 'vault.locked',
        userId,
        amount: payload.keysLocked,
        roomId: payload.roomId,
      })
    } else if (eventType?.includes('update')) {
      // Check if keys were unlocked
      if (payload.status === 'unlocked') {
        callback({
          type: 'vault.unlocked',
          userId,
          amount: payload.keysLocked,
          roomId: payload.roomId,
        })
      } else if (payload.status === 'refunded') {
        callback({
          type: 'vault.refunded',
          userId,
          amount: payload.keysLocked,
          roomId: payload.roomId,
        })
      }
    }
  })

  return unsubscribe
}

/**
 * Subscribe to user's notifications
 */
export function subscribeToNotifications(
  userId: string,
  callback: SubscriptionCallback<NotificationEvent>
): UnsubscribeFunction {
  const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_NOTIFICATIONS}.documents`

  const unsubscribe = client.subscribe<RealtimeResponseEvent<any>>(channel, (response) => {
    const payload = response.payload

    // Filter only this user
    if (payload.userId !== userId) return

    const eventType = response.events[0]

    if (eventType?.includes('create')) {
      callback({
        type: 'notification.new',
        userId,
        notification: payload,
      })
    }
  })

  return unsubscribe
}

/**
 * Subscribe to all rooms (global feed)
 * Fires when any room is created or updated
 */
export function subscribeToAllRooms(
  callback: SubscriptionCallback<RoomEvent>
): UnsubscribeFunction {
  const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLAST_ROOMS}.documents`

  const unsubscribe = client.subscribe<RealtimeResponseEvent<any>>(channel, (response) => {
    const payload = response.payload
    const eventType = response.events[0]

    if (eventType?.includes('create')) {
      callback({
        type: 'room.created',
        roomId: payload.$id,
        data: payload,
      })
    } else if (eventType?.includes('update')) {
      // Check if status changed
      callback({
        type: 'room.updated',
        roomId: payload.$id,
        data: payload,
      })
    }
  })

  return unsubscribe
}

/**
 * Multi-subscription manager
 * Subscribe to multiple channels at once and get single unsubscribe
 */
export class RealtimeManager {
  private subscriptions: UnsubscribeFunction[] = []

  subscribe<T>(
    type: 'room' | 'applicants' | 'motion' | 'vault' | 'notifications' | 'leaderboard' | 'all_rooms',
    identifier: string | null,
    callback: SubscriptionCallback<T>
  ): void {
    let unsubscribe: UnsubscribeFunction

    switch (type) {
      case 'room':
        if (!identifier) throw new Error('Room ID required')
        unsubscribe = subscribeToRoom(identifier, callback as any)
        break

      case 'applicants':
        if (!identifier) throw new Error('Room ID required')
        unsubscribe = subscribeToRoomApplicants(identifier, callback as any)
        break

      case 'motion':
        if (!identifier) throw new Error('User ID required')
        unsubscribe = subscribeToMotionScore(identifier, callback as any)
        break

      case 'vault':
        if (!identifier) throw new Error('User ID required')
        unsubscribe = subscribeToVault(identifier, callback as any)
        break

      case 'notifications':
        if (!identifier) throw new Error('User ID required')
        unsubscribe = subscribeToNotifications(identifier, callback as any)
        break

      case 'leaderboard':
        unsubscribe = subscribeToLeaderboard(callback as any)
        break

      case 'all_rooms':
        unsubscribe = subscribeToAllRooms(callback as any)
        break

      default:
        throw new Error(`Unknown subscription type: ${type}`)
    }

    this.subscriptions.push(unsubscribe)
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
    this.subscriptions = []
  }
}
