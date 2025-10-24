'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { client, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { type Clip } from '@/lib/appwrite/services/clips'

interface RealtimeEvent {
  events: string[]
  payload: Clip
}

/**
 * Hook to subscribe to realtime updates for clips
 * Automatically updates React Query cache when clips change
 */
export function useRealtimeClips(enabled: boolean = true) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return

    // Subscribe to all clip document events
    const channel = `databases.${DB_ID}.collections.${COLLECTIONS.CLIPS}.documents`

    const unsubscribe = client.subscribe(channel, (response: RealtimeEvent) => {
      const event = response.events[0]
      const clip = response.payload

      // Handle different event types
      if (event.includes('.create')) {
        // New clip created - add to cache
        queryClient.setQueryData<Clip[]>(['clips'], (old = []) => {
          // Check if already exists to prevent duplicates
          if (old.some(c => c.$id === clip.$id)) return old
          return [clip, ...old]
        })
      } else if (event.includes('.update')) {
        // Clip updated - update in cache
        queryClient.setQueryData<Clip[]>(['clips'], (old = []) =>
          old.map(c => c.$id === clip.$id ? clip : c)
        )
      } else if (event.includes('.delete')) {
        // Clip deleted - remove from cache
        queryClient.setQueryData<Clip[]>(['clips'], (old = []) =>
          old.filter(c => c.$id !== clip.$id)
        )
      }

      // Also invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['clips'] })
    })

    return () => {
      unsubscribe()
    }
  }, [enabled, queryClient])
}
