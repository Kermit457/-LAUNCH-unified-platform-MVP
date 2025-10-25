/**
 * Real-time leaderboard updates hook
 * Shows live Motion Score changes across all users
 */

import { useEffect, useState } from 'react'
import { subscribeToLeaderboard, type MotionScoreEvent } from '@/lib/blast/realtime'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeLeaderboard() {
  const queryClient = useQueryClient()
  const [recentUpdates, setRecentUpdates] = useState<MotionScoreEvent[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((event) => {
      // Add to recent updates (keep last 10)
      setRecentUpdates((prev) => {
        const updated = [event, ...prev].slice(0, 10)
        return updated
      })

      // Invalidate leaderboard query to refetch
      queryClient.invalidateQueries({ queryKey: ['blast', 'leaderboard'] })
    })

    return unsubscribe
  }, [queryClient])

  return {
    recentUpdates,
  }
}
