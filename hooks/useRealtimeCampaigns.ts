'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { client, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import { type Campaign } from '@/lib/appwrite/services/campaigns'

interface RealtimeEvent {
  events: string[]
  payload: Campaign
}

/**
 * Hook to subscribe to realtime updates for campaigns
 * Automatically updates React Query cache when campaigns change
 */
export function useRealtimeCampaigns(enabled: boolean = true) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return

    // Subscribe to all campaign document events
    const channel = `databases.${DB_ID}.collections.${COLLECTIONS.CAMPAIGNS}.documents`

    const unsubscribe = client.subscribe(channel, (response: RealtimeEvent) => {
      const event = response.events[0]
      const campaign = response.payload

      // Handle different event types
      if (event.includes('.create')) {
        // New campaign created - add to cache
        queryClient.setQueryData<Campaign[]>(['campaigns'], (old = []) => {
          // Check if already exists to prevent duplicates
          if (old.some(c => c.$id === campaign.$id)) return old
          return [campaign, ...old]
        })
      } else if (event.includes('.update')) {
        // Campaign updated - update in cache
        queryClient.setQueryData<Campaign[]>(['campaigns'], (old = []) =>
          old.map(c => c.$id === campaign.$id ? campaign : c)
        )
      } else if (event.includes('.delete')) {
        // Campaign deleted - remove from cache
        queryClient.setQueryData<Campaign[]>(['campaigns'], (old = []) =>
          old.filter(c => c.$id !== campaign.$id)
        )
      }

      // Also invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    })

    return () => {
      unsubscribe()
    }
  }, [enabled, queryClient])
}
