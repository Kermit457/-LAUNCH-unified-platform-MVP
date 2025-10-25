/**
 * Real-time Motion Score updates hook
 * Replaces React Query polling with WebSocket
 */

import { useEffect, useState } from 'react'
import { subscribeToMotionScore, type MotionScoreEvent } from '@/lib/blast/realtime'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeMotion(userId: string | null) {
  const queryClient = useQueryClient()
  const [motionEvent, setMotionEvent] = useState<MotionScoreEvent | null>(null)

  useEffect(() => {
    if (!userId) return

    const unsubscribe = subscribeToMotionScore(userId, (event) => {
      setMotionEvent(event)

      // Update cache immediately for instant UI update
      queryClient.setQueryData(['blast', 'motion', userId], (old: any) => ({
        ...old,
        currentScore: event.score,
      }))

      // Also invalidate to refetch full breakdown
      queryClient.invalidateQueries({ queryKey: ['blast', 'motion', userId] })
    })

    return unsubscribe
  }, [userId, queryClient])

  return {
    motionEvent,
    currentScore: motionEvent?.score,
    scoreChange: motionEvent?.change,
  }
}
