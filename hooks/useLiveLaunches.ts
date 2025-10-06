import { useState, useEffect } from 'react'
import { getLiveLaunches } from '@/lib/appwrite/services/launches'
import { client, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import type { Launch } from '@/lib/appwrite/services/launches'

/**
 * Hook for real-time live launches with Appwrite subscriptions
 */
export function useLiveLaunches(limit = 10) {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial launches
  useEffect(() => {
    async function fetchLaunches() {
      try {
        setLoading(true)
        const data = await getLiveLaunches(limit)
        setLaunches(data)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch live launches:', err)
        setError(err.message || 'Failed to load launches')
      } finally {
        setLoading(false)
      }
    }

    fetchLaunches()
  }, [limit])

  // Subscribe to real-time updates for live launches
  useEffect(() => {
    const unsubscribe = client.subscribe(
      [`databases.${DB_ID}.collections.${COLLECTIONS.LAUNCHES}.documents`],
      (response) => {
        const payload = response.payload as any

        // Only handle live launches
        if (payload.status !== 'live') return

        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          // New launch created
          setLaunches((prev) => [payload as Launch, ...prev].slice(0, limit))
        } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          // Launch updated (price, volume, holders, etc.)
          setLaunches((prev) =>
            prev.map((launch) => (launch.$id === payload.$id ? (payload as Launch) : launch))
          )
        } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          // Launch removed or status changed
          setLaunches((prev) => prev.filter((launch) => launch.$id !== payload.$id))
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [limit])

  return {
    launches,
    loading,
    error,
  }
}
