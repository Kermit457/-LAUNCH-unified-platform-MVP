import { useState, useEffect } from 'react'
import { client, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { getActivities, type Activity } from '@/lib/appwrite/services/activities'

/**
 * Hook for real-time activities feed with Appwrite subscriptions
 *
 * Features:
 * - Fetches initial activities for a user
 * - Subscribes to real-time activity updates (create/update/delete)
 * - Automatically updates UI when new activities arrive
 * - Supports filtering by context (user/project)
 *
 * @param userId - The user ID to fetch activities for
 * @param limit - Maximum number of activities to show (default: 20)
 * @param options - Optional filters (contextType, contextId)
 * @returns Activities, loading state, and error
 */
export function useRealtimeActivities(
  userId: string,
  limit = 20,
  options?: {
    contextType?: 'user' | 'project'
    contextId?: string
  }
) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch initial activities
  useEffect(() => {
    async function fetchActivities() {
      if (!userId) return

      try {
        setLoading(true)
        const data = await getActivities(userId, limit, options)
        setActivities(data)

        // Calculate unread count
        const unread = data.filter(a => !a.read).length
        setUnreadCount(unread)

        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch activities:', err)
        setError(err.message || 'Failed to load activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId, limit, options?.contextType, options?.contextId])

  // Subscribe to real-time activity updates
  useEffect(() => {
    if (!userId) return

    const unsubscribe = client.subscribe(
      [`databases.${DB_ID}.collections.${COLLECTIONS.ACTIVITIES}.documents`],
      (response) => {
        const payload = response.payload as Activity

        // Filter: only show activities for this user
        if (payload.userId !== userId) return

        // Filter by context if specified
        if (options?.contextType && payload.contextType !== options.contextType) return
        if (options?.contextId && payload.contextId !== options.contextId) return

        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          // New activity - prepend to list, respect limit
          setActivities(prev => [payload, ...prev].slice(0, limit))

          // Update unread count if not read
          if (!payload.read) {
            setUnreadCount(prev => prev + 1)
          }
        } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          // Activity updated (e.g., marked as read)
          setActivities(prev => prev.map(activity =>
            activity.$id === payload.$id ? payload : activity
          ))

          // Recalculate unread count
          setActivities(prev => {
            const unread = prev.filter(a => !a.read).length
            setUnreadCount(unread)
            return prev
          })
        } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          // Activity deleted
          setActivities(prev => prev.filter(activity => activity.$id !== payload.$id))

          // Update unread count if was unread
          if (!payload.read) {
            setUnreadCount(prev => Math.max(0, prev - 1))
          }
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [userId, limit, options?.contextType, options?.contextId])

  return {
    activities,
    loading,
    error,
    unreadCount,
  }
}
