import { useState, useEffect, useCallback } from 'react'
import { client, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import {
  getViewCount,
  getBoostCount,
  incrementBoostCount,
  decrementBoostCount,
  incrementViewCount,
} from '@/lib/appwrite/services/tracking'

/**
 * Hook for real-time boost and view tracking
 *
 * Features:
 * - Tracks boost count in real-time
 * - Tracks view count in real-time
 * - Provides boost/unboost functions
 * - Auto-increments views on mount (optional)
 *
 * @param launchId - The launch ID to track
 * @param trackView - Whether to increment view count on mount (default: true)
 * @returns Boost/view counts, loading state, and actions
 */
export function useRealtimeTracking(launchId: string, trackView = true) {
  const [boostCount, setBoostCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBoosting, setIsBoosting] = useState(false)

  // Fetch initial counts and track view
  useEffect(() => {
    async function fetchCounts() {
      if (!launchId) return

      try {
        setLoading(true)

        // Fetch counts in parallel
        const [boosts, views] = await Promise.all([
          getBoostCount(launchId),
          getViewCount(launchId),
        ])

        setBoostCount(boosts)
        setViewCount(views)

        // Increment view count if tracking enabled
        if (trackView) {
          await incrementViewCount(launchId)
        }

        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch tracking data:', err)
        setError(err.message || 'Failed to load tracking data')
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [launchId, trackView])

  // Subscribe to real-time launch updates
  useEffect(() => {
    if (!launchId) return

    const unsubscribe = client.subscribe(
      [`databases.${DB_ID}.collections.${COLLECTIONS.LAUNCHES}.documents.${launchId}`],
      (response) => {
        const payload = response.payload as any

        if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          // Update boost count if changed
          if (payload.boostCount !== undefined) {
            setBoostCount(payload.boostCount)
          }

          // Update view count if changed
          if (payload.viewCount !== undefined) {
            setViewCount(payload.viewCount)
          }
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [launchId])

  // Boost action
  const boost = useCallback(async () => {
    if (!launchId) {
      throw new Error('No launch ID provided')
    }

    try {
      setIsBoosting(true)
      await incrementBoostCount(launchId)
      // Real-time subscription will update the count
    } catch (err: any) {
      console.error('Failed to boost:', err)
      throw new Error(err.message || 'Failed to boost launch')
    } finally {
      setIsBoosting(false)
    }
  }, [launchId])

  // Unboost action (if needed)
  const unboost = useCallback(async () => {
    if (!launchId) {
      throw new Error('No launch ID provided')
    }

    try {
      setIsBoosting(true)
      await decrementBoostCount(launchId)
      // Real-time subscription will update the count
    } catch (err: any) {
      console.error('Failed to unboost:', err)
      throw new Error(err.message || 'Failed to remove boost')
    } finally {
      setIsBoosting(false)
    }
  }, [launchId])

  return {
    boostCount,
    viewCount,
    loading,
    error,
    isBoosting,
    boost,
    unboost,
  }
}