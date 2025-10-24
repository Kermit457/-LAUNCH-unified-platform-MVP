import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 60000, // 1 minute (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
