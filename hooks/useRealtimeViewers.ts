import { useEffect, useState } from 'react'
import { client, DB_ID } from '@/lib/appwrite/client'
import { getViewerCount, incrementViewerCount, decrementViewerCount } from '@/lib/appwrite/services/live-streams'

const LIVE_STREAMS_COLLECTION = 'live_streams'

interface UseRealtimeViewersOptions {
  mint: string
  enabled?: boolean
  joinStream?: boolean // Auto-increment viewer count on mount
}

/**
 * Hook for real-time viewer count updates using Appwrite Realtime
 */
export function useRealtimeViewers({ mint, enabled = true, joinStream = false }: UseRealtimeViewersOptions) {
  const [viewerCount, setViewerCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !mint) {
      setLoading(false)
      return
    }

    let unsubscribe: (() => void) | undefined

    const init = async () => {
      try {
        // Get initial viewer count
        const count = await getViewerCount(mint)
        setViewerCount(count)

        // Join stream if requested (increment count)
        if (joinStream) {
          const newCount = await incrementViewerCount(mint)
          setViewerCount(newCount)
        }

        // Subscribe to real-time updates
        unsubscribe = client.subscribe(
          `databases.${DB_ID}.collections.${LIVE_STREAMS_COLLECTION}.documents`,
          (response: any) => {
            // Filter for this specific stream
            if (response.payload && response.payload.mint === mint) {
              setViewerCount(response.payload.viewerCount || 0)
            }
          }
        )

        setLoading(false)
      } catch (err) {
        console.error('Error initializing realtime viewers:', err)
        setError(err instanceof Error ? err.message : 'Failed to load viewer count')
        setLoading(false)
      }
    }

    init()

    return () => {
      // Cleanup: decrement viewer count if we joined
      if (joinStream && mint) {
        decrementViewerCount(mint).catch(console.error)
      }

      // Unsubscribe from realtime
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [mint, enabled, joinStream])

  return { viewerCount, loading, error }
}
