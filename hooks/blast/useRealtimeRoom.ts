/**
 * Real-time room updates hook
 * Replaces React Query polling with WebSocket
 */

import { useEffect, useState } from 'react'
import { subscribeToRoom, subscribeToRoomApplicants, type RoomEvent, type ApplicantEvent } from '@/lib/blast/realtime'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeRoom(roomId: string | null) {
  const queryClient = useQueryClient()
  const [roomEvent, setRoomEvent] = useState<RoomEvent | null>(null)
  const [applicantEvent, setApplicantEvent] = useState<ApplicantEvent | null>(null)

  useEffect(() => {
    if (!roomId) return

    // Subscribe to room updates
    const unsubscribeRoom = subscribeToRoom(roomId, (event) => {
      setRoomEvent(event)

      // Invalidate room query to refetch
      queryClient.invalidateQueries({ queryKey: ['blast', 'room', roomId] })
    })

    // Subscribe to applicant updates
    const unsubscribeApplicants = subscribeToRoomApplicants(roomId, (event) => {
      setApplicantEvent(event)

      // Invalidate applicants query to refetch
      queryClient.invalidateQueries({ queryKey: ['blast', 'applicants', roomId] })
    })

    return () => {
      unsubscribeRoom()
      unsubscribeApplicants()
    }
  }, [roomId, queryClient])

  return {
    roomEvent,
    applicantEvent,
  }
}
