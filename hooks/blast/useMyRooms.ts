/**
 * Hook: Get rooms created by current user
 */

import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { databases } from '@/lib/appwrite/client'
import { Query } from 'appwrite'
import type { Room } from '@/lib/types/blast'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const ROOMS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_BLAST_ROOMS_COLLECTION!

export function useMyRooms() {
  const { user } = usePrivy()

  return useQuery({
    queryKey: ['blast-my-rooms', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')

      const response = await databases.listDocuments<Room>(DB_ID, ROOMS_COLLECTION, [
        Query.equal('creatorId', user.id),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ])

      return response.documents
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 2, // Refresh every 2 minutes
  })
}
