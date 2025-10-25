/**
 * useRoomFeed - Infinite scroll feed of rooms
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import { BlastRoomsService } from '@/lib/appwrite/services/blast-rooms'
import type { RoomFilters } from '@/lib/types/blast'
import { CACHE_TTL } from '@/lib/constants/blast'

export function useRoomFeed(filters: RoomFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['blast-rooms', filters],
    queryFn: async ({ pageParam = 0 }) => {
      return BlastRoomsService.getRooms({
        filters,
        limit: 10,
        offset: pageParam as number,
        sortBy: 'motionScore',
        sortOrder: 'desc',
      })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    initialPageParam: 0,
    staleTime: CACHE_TTL.ROOM_FEED * 1000,
    refetchInterval: 30_000, // Refresh every 30s for live updates
  })
}

/**
 * Get hot rooms (for homepage feature)
 */
export function useHotRooms(limit = 5) {
  return useQuery({
    queryKey: ['blast-hot-rooms', limit],
    queryFn: () => BlastRoomsService.getHotRooms(limit),
    staleTime: CACHE_TTL.ROOM_FEED * 1000,
    refetchInterval: 15_000, // Refresh every 15s (hot rooms change fast)
  })
}

/**
 * Get closing soon rooms
 */
export function useClosingSoonRooms(limit = 10) {
  return useQuery({
    queryKey: ['blast-closing-rooms', limit],
    queryFn: () => BlastRoomsService.getClosingSoonRooms(limit),
    staleTime: CACHE_TTL.ROOM_FEED * 1000,
    refetchInterval: 60_000, // Refresh every minute
  })
}

// Fix imports
import { useQuery } from '@tanstack/react-query'
