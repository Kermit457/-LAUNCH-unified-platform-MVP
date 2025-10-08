import { useState, useEffect } from 'react'
import { client, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { getNetworkInvites, type NetworkInvite } from '@/lib/appwrite/services/network'

/**
 * Hook for real-time network invites with Appwrite subscriptions
 *
 * Features:
 * - Fetches initial invites for a user
 * - Subscribes to real-time invite updates (create/update/delete)
 * - Tracks pending invite count
 * - Filters by type (sent/received) and status
 *
 * @param userId - The user ID to fetch invites for
 * @param type - Filter by 'sent', 'received', or undefined for both
 * @param status - Filter by status (pending/accepted/rejected)
 * @returns Invites, loading state, pending count, and error
 */
export function useRealtimeNetworkInvites(
  userId: string,
  type?: 'sent' | 'received',
  status?: 'pending' | 'accepted' | 'rejected'
) {
  const [invites, setInvites] = useState<NetworkInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingCount, setPendingCount] = useState(0)

  // Fetch initial invites
  useEffect(() => {
    async function fetchInvites() {
      if (!userId) return

      try {
        setLoading(true)
        const data = await getNetworkInvites({ userId, type, status })
        setInvites(data)

        // Count pending received invites
        const pending = data.filter(
          inv => inv.receiverId === userId && inv.status === 'pending'
        ).length
        setPendingCount(pending)

        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch network invites:', err)
        setError(err.message || 'Failed to load invites')
      } finally {
        setLoading(false)
      }
    }

    fetchInvites()
  }, [userId, type, status])

  // Subscribe to real-time invite updates
  useEffect(() => {
    if (!userId) return

    const unsubscribe = client.subscribe(
      [`databases.${DB_ID}.collections.${COLLECTIONS.NETWORK_INVITES}.documents`],
      (response) => {
        const payload = response.payload as NetworkInvite

        // Filter: only show invites for this user
        const isForUser = payload.senderId === userId || payload.receiverId === userId

        if (!isForUser) return

        // Apply type filter
        if (type === 'sent' && payload.senderId !== userId) return
        if (type === 'received' && payload.receiverId !== userId) return

        // Apply status filter
        if (status && payload.status !== status) return

        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          // New invite - prepend to list
          setInvites(prev => [payload, ...prev])

          // Update pending count if it's a pending received invite
          if (payload.receiverId === userId && payload.status === 'pending') {
            setPendingCount(prev => prev + 1)
          }
        } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          // Invite updated (e.g., accepted/rejected)
          setInvites(prev => prev.map(invite =>
            invite.$id === payload.$id ? payload : invite
          ))

          // Recalculate pending count
          setInvites(prev => {
            const pending = prev.filter(
              inv => inv.receiverId === userId && inv.status === 'pending'
            ).length
            setPendingCount(pending)
            return prev
          })
        } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          // Invite deleted
          setInvites(prev => prev.filter(invite => invite.$id !== payload.$id))

          // Update pending count if was pending
          if (payload.receiverId === userId && payload.status === 'pending') {
            setPendingCount(prev => Math.max(0, prev - 1))
          }
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [userId, type, status])

  return {
    invites,
    loading,
    error,
    pendingCount,
  }
}