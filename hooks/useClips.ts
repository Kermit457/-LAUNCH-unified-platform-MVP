import { useQuery } from '@tanstack/react-query'
import { getClips, type Clip } from '@/lib/appwrite/services/clips'

interface UseClipsOptions {
  status?: 'active' | 'pending' | 'rejected' | 'removed'
  campaignId?: string
  submittedBy?: string
  sortBy?: 'views' | 'createdAt'
  limit?: number
  page?: number
  enabled?: boolean
  // Advanced filters
  platform?: string | string[]
  minEngagement?: number
  dateFrom?: string
  dateTo?: string
  search?: string
}

export function useClips(options?: UseClipsOptions) {
  const { page = 1, limit = 15, enabled = true, ...filters } = options || {}

  return useQuery<Clip[]>({
    queryKey: ['clips', filters, page, limit],
    queryFn: () => getClips({
      ...filters,
      limit,
      offset: (page - 1) * limit
    }),
    enabled,
    staleTime: 30000, // Cache for 30 seconds
    placeholderData: (prev) => prev, // Keep old data while loading new page
  })
}
