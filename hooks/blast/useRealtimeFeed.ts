/**
 * Real-time room feed hook
 * Shows new rooms as they're created
 */

import { useEffect, useState } from 'react'
import { subscribeToAllRooms, type RoomEvent } from '@/lib/blast/realtime'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeFeed() {
  const queryClient = useQueryClient()
  const [newRooms, setNewRooms] = useState<RoomEvent[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToAllRooms((event) => {
      if (event.type === 'room.created') {
        // Add to new rooms list (keep last 5)
        setNewRooms((prev) => {
          const updated = [event, ...prev].slice(0, 5)
          return updated
        })

        // Show toast notification (optional)
        // toast.info(`New room: ${event.data.title}`)
      }

      // Invalidate feed query to refetch
      queryClient.invalidateQueries({ queryKey: ['blast', 'rooms'] })
    })

    return unsubscribe
  }, [queryClient])

  return {
    newRooms,
    clearNewRooms: () => setNewRooms([]),
  }
}
