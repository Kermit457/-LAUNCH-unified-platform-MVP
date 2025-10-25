/**
 * useRoomAnalytics - Fetch room performance metrics
 */

import { useQuery } from '@tanstack/react-query'
import { BlastAnalyticsService } from '@/lib/appwrite/services/blast-analytics'
import type { RoomAnalytics } from '@/lib/types/blast'

export function useRoomAnalytics(roomId: string) {
  return useQuery<RoomAnalytics>({
    queryKey: ['blast-analytics', roomId],
    queryFn: () => BlastAnalyticsService.calculateRoomAnalytics(roomId),
    enabled: !!roomId,
    refetchInterval: 30000, // Update every 30s
  })
}
