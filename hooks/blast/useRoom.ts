/**
 * useRoom - Get single room details with real-time updates
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BlastRoomsService } from '@/lib/appwrite/services/blast-rooms'
import { client } from '@/lib/appwrite/client'
import { CACHE_TTL } from '@/lib/constants/blast'
import type { BlastRoom } from '@/lib/types/blast'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!

export function useRoom(roomId: string | undefined) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['blast-room', roomId],
    queryFn: async () => {
      if (!roomId) throw new Error('Room ID required')
      return BlastRoomsService.getRoomById(roomId)
    },
    enabled: !!roomId,
    staleTime: CACHE_TTL.ROOM_DETAILS * 1000,
  })

  // Subscribe to real-time updates
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = client.subscribe(
      `databases.${DB_ID}.collections.blast_rooms.documents.${roomId}`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          queryClient.setQueryData<BlastRoom>(
            ['blast-room', roomId],
            response.payload as BlastRoom
          )
        }
      }
    )

    return () => unsubscribe()
  }, [roomId, queryClient])

  return query
}

/**
 * Get room analytics
 */
export function useRoomAnalytics(roomId: string | undefined) {
  return useQuery({
    queryKey: ['blast-room-analytics', roomId],
    queryFn: async () => {
      if (!roomId) throw new Error('Room ID required')
      return BlastRoomsService.getRoomAnalytics(roomId)
    },
    enabled: !!roomId,
    staleTime: 30_000,
  })
}
