import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { ID, Query } from 'appwrite'

export interface Message {
  $id: string
  messageId: string
  threadId: string
  senderId: string
  receiverId: string
  text: string
  read: boolean
  $createdAt: string
}

export interface Thread {
  $id: string
  threadId: string
  type: 'dm' | 'group'
  name?: string
  participantIds: string[]
  lastMessageAt?: string
  projectId?: string
  campaignId?: string
  $createdAt: string
}

/**
 * Get all threads for a user
 */
export async function getUserThreads(userId: string) {
  const queries = [
    Query.contains('participantIds', userId),
    Query.orderDesc('lastMessageAt'),
    Query.limit(100)
  ]

  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.THREADS,
    queries
  )

  return response.documents as unknown as Thread[]
}

/**
 * Get messages for a thread
 */
export async function getThreadMessages(threadId: string, limit = 100) {
  const queries = [
    Query.equal('threadId', threadId),
    Query.orderAsc('$createdAt'),
    Query.limit(limit)
  ]

  const response = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.MESSAGES,
    queries
  )

  return response.documents as unknown as Message[]
}

/**
 * Send a message in a thread
 */
export async function sendMessage(data: {
  threadId: string
  senderId: string
  receiverId: string
  text: string
}) {
  const message = await databases.createDocument(
    DB_ID,
    COLLECTIONS.MESSAGES,
    ID.unique(),
    {
      messageId: `msg_${Date.now()}`,
      threadId: data.threadId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      text: data.text,
      read: false
    }
  )

  // Update thread's lastMessageAt
  try {
    await databases.updateDocument(
      DB_ID,
      COLLECTIONS.THREADS,
      data.threadId,
      {
        lastMessageAt: new Date().toISOString()
      }
    )
  } catch (error) {
    console.warn('Failed to update thread timestamp:', error)
  }

  return message as unknown as Message
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string) {
  const message = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.MESSAGES,
    messageId,
    {
      read: true
    }
  )

  return message as unknown as Message
}

/**
 * Mark all messages in a thread as read
 */
export async function markThreadAsRead(threadId: string, userId: string) {
  const messages = await getThreadMessages(threadId)

  // Mark unread messages as read
  const unreadMessages = messages.filter(m => !m.read && m.senderId !== userId)

  await Promise.all(
    unreadMessages.map(m => markMessageAsRead(m.$id))
  )

  return unreadMessages.length
}

/**
 * Create a new DM thread
 */
export async function createDMThread(userId1: string, userId2: string) {
  // Check if thread already exists
  const existing = await databases.listDocuments(
    DB_ID,
    COLLECTIONS.THREADS,
    [
      Query.equal('type', 'dm'),
      Query.contains('participantIds', userId1),
      Query.contains('participantIds', userId2)
    ]
  )

  if (existing.total > 0) {
    return existing.documents[0] as unknown as Thread
  }

  // Create new thread
  const thread = await databases.createDocument(
    DB_ID,
    COLLECTIONS.THREADS,
    ID.unique(),
    {
      threadId: `thread_${Date.now()}`,
      type: 'dm',
      participantIds: [userId1, userId2],
      lastMessageAt: new Date().toISOString()
    }
  )

  return thread as unknown as Thread
}

/**
 * Create a new group thread
 */
export async function createGroupThread(data: {
  name: string
  participantIds: string[]
  projectId?: string
  campaignId?: string
}) {
  const thread = await databases.createDocument(
    DB_ID,
    COLLECTIONS.THREADS,
    ID.unique(),
    {
      threadId: `thread_${Date.now()}`,
      type: 'group',
      ...data,
      lastMessageAt: new Date().toISOString()
    }
  )

  return thread as unknown as Thread
}

/**
 * Get unread message count for a user
 */
export async function getUnreadCount(userId: string) {
  const threads = await getUserThreads(userId)
  let unreadCount = 0

  for (const thread of threads) {
    const messages = await getThreadMessages(thread.$id)
    unreadCount += messages.filter(m => !m.read && m.senderId !== userId).length
  }

  return unreadCount
}

/**
 * Delete a thread
 */
export async function deleteThread(threadId: string) {
  // Delete all messages in thread
  const messages = await getThreadMessages(threadId)
  await Promise.all(
    messages.map(m => databases.deleteDocument(DB_ID, COLLECTIONS.MESSAGES, m.$id))
  )

  // Delete thread
  await databases.deleteDocument(DB_ID, COLLECTIONS.THREADS, threadId)
}
