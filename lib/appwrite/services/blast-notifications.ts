/**
 * BLAST Notifications Service
 * Real-time notification system for user actions
 */

import { ID, Query } from 'appwrite'
import { databases, account } from '../client'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const NOTIFICATIONS_COLLECTION = 'blast_notifications'

export type NotificationType =
  | 'application_accepted'
  | 'application_rejected'
  | 'dm_request_received'
  | 'dm_request_accepted'
  | 'dm_request_declined'
  | 'dm_request_expired'
  | 'room_closing_soon'
  | 'room_closed'
  | 'room_extended'
  | 'refund_processed'
  | 'new_applicant'
  | 'room_hot'
  | 'match_found'

export interface Notification {
  $id: string
  $createdAt: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  priority: 'low' | 'medium' | 'high'
}

export interface NotificationPreferences {
  $id?: string
  userId: string
  inApp: boolean
  email: boolean
  push: boolean
  types: {
    [key in NotificationType]?: boolean
  }
}

export class BlastNotificationsService {
  /**
   * Create a notification
   */
  static async createNotification(params: {
    userId: string
    type: NotificationType
    title: string
    message: string
    actionUrl?: string
    metadata?: Record<string, any>
    priority?: 'low' | 'medium' | 'high'
  }): Promise<Notification> {
    try {
      // Check user preferences first
      const prefs = await this.getUserPreferences(params.userId)

      // Skip if notifications disabled for this type
      if (prefs && prefs.types[params.type] === false) {
        console.log(`Notification skipped for ${params.userId}: ${params.type} disabled in preferences`)
        return null as any
      }

      // Skip if in-app notifications disabled
      if (prefs && !prefs.inApp) {
        console.log(`In-app notifications disabled for ${params.userId}`)
        return null as any
      }

      const notification = await databases.createDocument<Notification>(
        DB_ID,
        NOTIFICATIONS_COLLECTION,
        ID.unique(),
        {
          userId: params.userId,
          type: params.type,
          title: params.title,
          message: params.message,
          read: false,
          actionUrl: params.actionUrl,
          metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
          priority: params.priority || 'medium',
        }
      )

      return notification
    } catch (error) {
      console.error('Failed to create notification:', error)
      throw error
    }
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(
    userId: string,
    limit = 50,
    unreadOnly = false
  ): Promise<Notification[]> {
    try {
      const queries = [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
      ]

      if (unreadOnly) {
        queries.push(Query.equal('read', false))
      }

      const response = await databases.listDocuments<Notification>(
        DB_ID,
        NOTIFICATIONS_COLLECTION,
        queries
      )

      return response.documents.map(doc => ({
        ...doc,
        metadata: doc.metadata ? JSON.parse(doc.metadata as any) : undefined,
      }))
    } catch (error) {
      console.error('Failed to get notifications:', error)
      return []
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        NOTIFICATIONS_COLLECTION,
        [Query.equal('userId', userId), Query.equal('read', false), Query.limit(100)]
      )

      return response.total
    } catch (error) {
      console.error('Failed to get unread count:', error)
      return 0
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await databases.updateDocument(DB_ID, NOTIFICATIONS_COLLECTION, notificationId, {
        read: true,
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      throw error
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const notifications = await this.getUserNotifications(userId, 100, true)

      await Promise.all(
        notifications.map(notification => this.markAsRead(notification.$id))
      )
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      throw error
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      await databases.deleteDocument(DB_ID, NOTIFICATIONS_COLLECTION, notificationId)
    } catch (error) {
      console.error('Failed to delete notification:', error)
      throw error
    }
  }

  /**
   * Get user notification preferences
   */
  static async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const response = await databases.listDocuments<NotificationPreferences>(
        DB_ID,
        'blast_notification_preferences',
        [Query.equal('userId', userId), Query.limit(1)]
      )

      if (response.documents.length === 0) {
        return null
      }

      const doc = response.documents[0]
      return {
        ...doc,
        types: doc.types ? JSON.parse(doc.types as any) : {},
      }
    } catch (error) {
      console.error('Failed to get notification preferences:', error)
      return null
    }
  }

  /**
   * Update user notification preferences
   */
  static async updateUserPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    try {
      // Check if preferences exist
      const existing = await this.getUserPreferences(userId)

      if (existing) {
        // Update existing
        const updated = await databases.updateDocument<NotificationPreferences>(
          DB_ID,
          'blast_notification_preferences',
          existing.$id!,
          {
            inApp: preferences.inApp ?? existing.inApp,
            email: preferences.email ?? existing.email,
            push: preferences.push ?? existing.push,
            types: preferences.types
              ? JSON.stringify(preferences.types)
              : JSON.stringify(existing.types),
          }
        )

        return {
          ...updated,
          types: JSON.parse(updated.types as any),
        }
      } else {
        // Create new
        const created = await databases.createDocument<NotificationPreferences>(
          DB_ID,
          'blast_notification_preferences',
          ID.unique(),
          {
            userId,
            inApp: preferences.inApp ?? true,
            email: preferences.email ?? false,
            push: preferences.push ?? false,
            types: preferences.types ? JSON.stringify(preferences.types) : '{}',
          }
        )

        return {
          ...created,
          types: JSON.parse(created.types as any),
        }
      }
    } catch (error) {
      console.error('Failed to update notification preferences:', error)
      throw error
    }
  }

  /**
   * Helper: Send notification when application is accepted
   */
  static async notifyApplicationAccepted(params: {
    userId: string
    roomTitle: string
    roomId: string
  }): Promise<void> {
    await this.createNotification({
      userId: params.userId,
      type: 'application_accepted',
      title: '🎉 Application Accepted!',
      message: `Your application to "${params.roomTitle}" has been accepted!`,
      actionUrl: `/BLAST/room/${params.roomId}`,
      priority: 'high',
      metadata: { roomId: params.roomId },
    })
  }

  /**
   * Helper: Send notification when application is rejected
   */
  static async notifyApplicationRejected(params: {
    userId: string
    roomTitle: string
    roomId: string
  }): Promise<void> {
    await this.createNotification({
      userId: params.userId,
      type: 'application_rejected',
      title: 'Application Not Accepted',
      message: `Your application to "${params.roomTitle}" was not accepted. Your keys have been refunded.`,
      actionUrl: `/BLAST`,
      priority: 'medium',
      metadata: { roomId: params.roomId },
    })
  }

  /**
   * Helper: Send notification for new DM request
   */
  static async notifyDMRequestReceived(params: {
    userId: string
    fromUserName: string
    message: string
    keysOffered: number
  }): Promise<void> {
    await this.createNotification({
      userId: params.userId,
      type: 'dm_request_received',
      title: '💬 New DM Request',
      message: `${params.fromUserName} wants to connect (${params.keysOffered} keys offered)`,
      actionUrl: `/BLAST/inbox`,
      priority: 'high',
      metadata: { fromUserName: params.fromUserName, keysOffered: params.keysOffered },
    })
  }

  /**
   * Helper: Send notification when DM request is accepted
   */
  static async notifyDMRequestAccepted(params: {
    userId: string
    acceptedByName: string
  }): Promise<void> {
    await this.createNotification({
      userId: params.userId,
      type: 'dm_request_accepted',
      title: '✅ DM Request Accepted',
      message: `${params.acceptedByName} accepted your DM request!`,
      actionUrl: `/BLAST/inbox`,
      priority: 'high',
      metadata: { acceptedByName: params.acceptedByName },
    })
  }

  /**
   * Helper: Send notification when room has new applicant
   */
  static async notifyNewApplicant(params: {
    userId: string
    roomTitle: string
    roomId: string
    applicantName: string
  }): Promise<void> {
    await this.createNotification({
      userId: params.userId,
      type: 'new_applicant',
      title: '🆕 New Applicant',
      message: `${params.applicantName} applied to "${params.roomTitle}"`,
      actionUrl: `/BLAST/room/${params.roomId}`,
      priority: 'medium',
      metadata: { roomId: params.roomId, applicantName: params.applicantName },
    })
  }

  /**
   * Helper: Send notification when room is closing soon
   */
  static async notifyRoomClosingSoon(params: {
    userId: string
    roomTitle: string
    roomId: string
    hoursRemaining: number
  }): Promise<void> {
    await this.createNotification({
      userId: params.userId,
      type: 'room_closing_soon',
      title: '⏰ Room Closing Soon',
      message: `"${params.roomTitle}" closes in ${params.hoursRemaining} hours`,
      actionUrl: `/BLAST/room/${params.roomId}`,
      priority: 'medium',
      metadata: { roomId: params.roomId, hoursRemaining: params.hoursRemaining },
    })
  }

  /**
   * Helper: Send notification when room goes hot
   */
  static async notifyRoomHot(params: {
    userId: string
    roomTitle: string
    roomId: string
  }): Promise<void> {
    await this.createNotification({
      userId: params.userId,
      type: 'room_hot',
      title: '🔥 Your Room is Hot!',
      message: `"${params.roomTitle}" is trending with high engagement`,
      actionUrl: `/BLAST/room/${params.roomId}`,
      priority: 'high',
      metadata: { roomId: params.roomId },
    })
  }

  /**
   * Helper: Send notification for refund processed
   */
  static async notifyRefundProcessed(params: {
    userId: string
    amount: number
    reason: string
  }): Promise<void> {
    await this.createNotification({
      userId: params.userId,
      type: 'refund_processed',
      title: '💰 Refund Processed',
      message: `${params.amount} keys refunded: ${params.reason}`,
      actionUrl: `/BLAST`,
      priority: 'low',
      metadata: { amount: params.amount, reason: params.reason },
    })
  }
}
