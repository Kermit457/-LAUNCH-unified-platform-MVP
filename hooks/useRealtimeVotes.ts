import { useState, useEffect, useCallback } from 'react'
import { client, DB_ID, COLLECTIONS } from '@/lib/appwrite/client'
import {
  getVoteCount,
  hasUserVoted,
  addVote,
  removeVote,
  type Vote,
} from '@/lib/appwrite/services/votes'
import { useUser } from './useUser'

/**
 * Hook for real-time vote tracking with Appwrite subscriptions
 *
 * Features:
 * - Fetches initial vote count for a launch
 * - Subscribes to real-time vote changes (create/delete)
 * - Tracks if current user has voted
 * - Provides toggle vote function
 *
 * @param launchId - The launch ID to track votes for
 * @returns Vote count, loading state, and vote actions
 */
export function useRealtimeVotes(launchId: string) {
  const [voteCount, setVoteCount] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const { user, userId } = useUser()

  // Fetch initial vote count and user vote status
  useEffect(() => {
    async function fetchVoteData() {
      try {
        setLoading(true)
        const [count, voted] = await Promise.all([
          getVoteCount(launchId),
          userId ? hasUserVoted(launchId, userId) : Promise.resolve(false),
        ])
        setVoteCount(count)
        setHasVoted(voted)
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch vote data:', err)
        setError(err.message || 'Failed to load votes')
      } finally {
        setLoading(false)
      }
    }

    if (launchId) {
      fetchVoteData()
    }
  }, [launchId, userId])

  // Subscribe to real-time vote updates
  useEffect(() => {
    if (!launchId) return

    // Subscribe to all votes in the Votes collection
    const unsubscribe = client.subscribe(
      [`databases.${DB_ID}.collections.${COLLECTIONS.VOTES}.documents`],
      (response) => {
        const payload = response.payload as Vote

        // Only handle votes for this launch
        if (payload.launchId !== launchId) return

        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          // New vote added
          setVoteCount((prev) => prev + 1)

          // Check if it's the current user's vote
          if (userId && payload.userId === userId) {
            setHasVoted(true)
          }
        } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          // Vote removed
          setVoteCount((prev) => Math.max(0, prev - 1))

          // Check if it's the current user's vote
          if (userId && payload.userId === userId) {
            setHasVoted(false)
          }
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [launchId, userId])

  // Toggle vote (add or remove)
  const toggleVote = useCallback(async () => {
    if (!user || !userId) {
      throw new Error('You must be logged in to vote')
    }

    try {
      setIsVoting(true)

      if (hasVoted) {
        // Remove vote
        await removeVote(launchId, userId)
        // Real-time subscription will handle state update
      } else {
        // Add vote
        await addVote(launchId, userId)
        // Real-time subscription will handle state update
      }
    } catch (err: any) {
      console.error('Failed to toggle vote:', err)
      throw new Error(err.message || 'Failed to update vote')
    } finally {
      setIsVoting(false)
    }
  }, [launchId, user, userId, hasVoted])

  return {
    voteCount,
    hasVoted,
    loading,
    error,
    isVoting,
    toggleVote,
  }
}
