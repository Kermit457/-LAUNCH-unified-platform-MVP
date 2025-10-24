import { useQuery } from '@tanstack/react-query'
import { getClips } from '@/lib/appwrite/services/clips'

/**
 * Hook to get count of pending clips for a project
 * Used for badge display on project cards
 */
export function usePendingClipCount(projectId: string, enabled = true) {
  return useQuery({
    queryKey: ['pending-clip-count', projectId],
    queryFn: async () => {
      const clips = await getClips({
        projectId,
        status: 'pending',
        limit: 100 // Get all pending clips (adjust if needed)
      })

      // Filter for only approved=false clips
      const pending = clips.filter(c => !c.approved)

      return pending.length
    },
    enabled: enabled && !!projectId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  })
}
