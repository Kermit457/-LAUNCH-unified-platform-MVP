import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitClip, approveClip, type Clip } from '@/lib/appwrite/services/clips'
import { toast } from 'sonner'

export function useClipMutations() {
  const queryClient = useQueryClient()

  const submit = useMutation({
    mutationFn: submitClip,
    onSuccess: () => {
      // Invalidate all clips queries to refetch
      queryClient.invalidateQueries({ queryKey: ['clips'] })
      toast.success('Clip submitted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit clip')
    }
  })

  const approve = useMutation({
    mutationFn: ({ clipId, approved, userId }: { clipId: string, approved: boolean, userId?: string }) =>
      approveClip(clipId, approved, userId),

    // Optimistic update - immediately update UI
    onMutate: async ({ clipId, approved }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['clips'] })

      // Snapshot current state for rollback
      const previousClips = queryClient.getQueryData(['clips'])

      // Optimistically update all clips queries
      queryClient.setQueriesData({ queryKey: ['clips'] }, (old: any) => {
        if (!old) return old

        return old.map((clip: Clip) =>
          clip.$id === clipId
            ? { ...clip, approved, status: approved ? 'active' as const : 'rejected' as const }
            : clip
        )
      })

      return { previousClips }
    },

    // Rollback on error
    onError: (err, vars, context) => {
      if (context?.previousClips) {
        queryClient.setQueryData(['clips'], context.previousClips)
      }
      toast.error('Failed to update clip')
    },

    onSuccess: (_, { approved }) => {
      toast.success(approved ? 'Clip approved!' : 'Clip rejected')
    },

    // Always refetch after error or success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] })
    }
  })

  return { submit, approve }
}
