import { useQuery } from '@tanstack/react-query'
import { getCampaigns, type Campaign } from '@/lib/appwrite/services/campaigns'

interface UseCampaignsOptions {
  createdBy?: string
  status?: 'active' | 'completed' | 'cancelled'
  limit?: number
  enabled?: boolean
}

export function useCampaigns(options?: UseCampaignsOptions) {
  const { enabled = true, ...filters } = options || {}

  return useQuery<Campaign[]>({
    queryKey: ['campaigns', filters],
    queryFn: () => getCampaigns(filters),
    enabled: enabled && !!filters.createdBy, // Only fetch if user ID exists
    staleTime: 60000, // Cache for 1 minute
  })
}
