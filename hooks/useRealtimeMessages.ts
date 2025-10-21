import { useState, useEffect } from 'react'
import { client, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { getThreadMessages } from '@/lib/appwrite/services/messages'

export interface FormattedMessage {
  id: string
  threadId: string
  fromUserId: string
  fromHandle?: string
  content: string
  sentAt: number
  edited?: boolean
  reactions?: Array<{ emoji: string; userIds: string[] }>
}

/**
 * Hook for real-time chat messages with Appwrite subscriptions
 *
 * Features:
 * - Fetches initial messages for a thread
 * - Subscribes to real-time message updates (create/update/delete)
 * - Automatically updates UI when new messages arrive
 * - Supports pagination with cursor
 *
 * @param threadId - The thread/room ID to fetch messages for
 * @param limit - Maximum number of messages to show (default: 50)
 * @returns Messages, loading state, error, and refresh function
 */
export function useRealtimeMessages(
  threadId: string | null,
  limit = 50
) {
  const [messages, setMessages] = useState<FormattedMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial messages
  useEffect(() => {
    async function fetchMessages() {
      if (!threadId) {
        setMessages([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getThreadMessages(threadId, limit)

        // Format messages
        const formatted: FormattedMessage[] = data.map(m => ({
          id: m.$id,
          threadId: m.threadId,
          fromUserId: m.senderId,
          fromHandle: '@user',
          content: m.text,
          sentAt: new Date(m.$createdAt).getTime(),
        }))

        setMessages(formatted)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch messages:', err)
        setError(err.message || 'Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [threadId, limit])

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!threadId) return

    let unsubscribe: (() => void) | null = null

    // Add a small delay to ensure WebSocket is ready
    const timer = setTimeout(() => {
      try {
        unsubscribe = client.subscribe(
          [`databases.${DB_ID}.collections.${COLLECTIONS.MESSAGES}.documents`],
          (response) => {
            const payload = response.payload as any

            // Filter: only show messages for this thread
            if (payload.threadId !== threadId) return

            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
              // New message - append to list
              const newMessage: FormattedMessage = {
                id: payload.$id,
                threadId: payload.threadId,
                fromUserId: payload.senderId,
                fromHandle: '@user',
                content: payload.text,
                sentAt: new Date(payload.$createdAt).getTime(),
                edited: payload.edited || false,
                reactions: payload.reactions || [],
              }

              setMessages((prev) => [...prev, newMessage])
            } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
              // Message updated (e.g., edited, reactions added)
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === payload.$id
                    ? {
                        ...msg,
                        content: payload.text,
                        edited: payload.edited || false,
                        reactions: payload.reactions || [],
                      }
                    : msg
                )
              )
            } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
              // Message deleted
              setMessages((prev) => prev.filter((msg) => msg.id !== payload.$id))
            }
          }
        )
      } catch (err) {
        console.error('Failed to subscribe to messages:', err)
      }
    }, 100)

    // Cleanup
    return () => {
      clearTimeout(timer)
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch (err) {
          console.error('Failed to unsubscribe:', err)
        }
      }
    }
  }, [threadId])

  // Manual refresh function
  const refresh = async () => {
    if (!threadId) return

    try {
      const data = await getThreadMessages(threadId, limit)
      // Transform Message[] to FormattedMessage[]
      const formatted = data.map(msg => ({
        ...msg,
        id: msg.$id,
        fromUserId: msg.senderId,
        content: msg.text,  // Message uses 'text' field
        sentAt: new Date(msg.$createdAt).getTime()  // Convert to timestamp
      }))
      setMessages(formatted as FormattedMessage[])
      setError(null)
    } catch (err: any) {
      console.error('Failed to refresh messages:', err)
      setError(err.message || 'Failed to refresh messages')
    }
  }

  return {
    messages,
    loading,
    error,
    refresh,
  }
}
