import { useState, useEffect } from 'react'
import { useUser } from './useUser'
import { CurveService } from '@/lib/appwrite/services/curves'
import { getUserProfile } from '@/lib/appwrite/services/users'

export interface CurveActivationProgress {
  hasMinKeys: boolean // User owns 10+ of their own keys
  currentKeys: number // Keys owned of their own curve
  minKeysRequired: number // Default: 10
  isActive: boolean // Curve is activated
  curveId?: string // User's auto-created CCM curve ID
}

/**
 * Hook to manage user's curve activation status
 *
 * ACTIVATION FLOW:
 * 1. User logs in with Twitter (Privy) → Auto-authenticated, avatar from Twitter
 * 2. CCM curve auto-created (status: inactive)
 * 3. Modal pops up: "Buy 10 of your own keys to activate"
 * 4. User buys 10+ keys → Curve activated → Platform unlocked
 *
 * UNLOCKS:
 * - Comment/upvote on projects
 * - Collaborate on launches
 * - Launch own projects
 * - Participate in Earn campaigns
 * - Visible in Discover feed
 */
export function useCurveActivation() {
  const { userId, user } = useUser()
  const [progress, setProgress] = useState<CurveActivationProgress>({
    hasMinKeys: false,
    currentKeys: 0,
    minKeysRequired: 10,
    isActive: false
  })
  const [loading, setLoading] = useState(true)
  const [showActivationModal, setShowActivationModal] = useState(false)

  useEffect(() => {
    async function checkActivationStatus() {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // TODO: Replace with actual Appwrite queries
        // Query logic:
        // 1. Get user's auto-created CCM curve by ownerId
        // 2. Count user's owned keys of their own curve
        // 3. Check curve status (inactive vs active)

        const mockProgress: CurveActivationProgress = {
          // Check if user owns 10+ of their own keys
          hasMinKeys: false, // TODO: Query: WHERE curveId = user.curveId AND ownerId = userId, COUNT >= 10
          currentKeys: 0, // TODO: Actual key count from query
          minKeysRequired: 10,

          // Check if curve is active
          isActive: false, // TODO: Get curve.status === 'active'

          curveId: undefined // user?.curveId // User's auto-created CCM curve ID
        }

        setProgress(mockProgress)

        // Auto-show modal on first login if curve not activated
        const hasSeenOnboarding = localStorage.getItem(`onboarding_seen_${userId}`)
        if (!mockProgress.isActive && !hasSeenOnboarding) {
          setShowActivationModal(true)
          localStorage.setItem(`onboarding_seen_${userId}`, 'true')
        }

      } catch (error) {
        console.error('Failed to check curve activation status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkActivationStatus()
  }, [userId, user])

  const activateCurve = async () => {
    if (!userId || !progress.curveId) return

    try {
      // TODO: Implement Appwrite mutation to activate curve
      // Update curve status from 'inactive' to 'active'

      console.log('Activating curve:', progress.curveId)

      // Refresh progress
      setProgress(prev => ({ ...prev, isActive: true }))
      setShowActivationModal(false)

      // Show success notification
      // TODO: Add toast notification

    } catch (error) {
      console.error('Failed to activate curve:', error)
      throw error
    }
  }

  const canActivate = progress.hasMinKeys

  return {
    progress,
    loading,
    showActivationModal,
    setShowActivationModal,
    activateCurve,
    canActivate,
    isActivated: progress.isActive
  }
}

/**
 * Hook to get curve activation incentives
 * Shows what user is missing out on by not activating
 */
export function useActivationIncentives(userId?: string) {
  const [incentives, setIncentives] = useState({
    interestedUsers: 0,
    potentialEarnings: 0,
    pendingCollaborations: 0,
    claimableAirdrops: 0
  })

  useEffect(() => {
    async function fetchIncentives() {
      if (!userId) return

      try {
        // TODO: Query Appwrite for:
        // - Users who viewed profile but can't buy keys (curve inactive)
        // - Collaboration requests
        // - Airdrops user is eligible for but can't claim

        // Mock data for now
        setIncentives({
          interestedUsers: Math.floor(Math.random() * 10) + 1,
          potentialEarnings: Math.floor(Math.random() * 500) + 50,
          pendingCollaborations: Math.floor(Math.random() * 3),
          claimableAirdrops: Math.floor(Math.random() * 5)
        })
      } catch (error) {
        console.error('Failed to fetch activation incentives:', error)
      }
    }

    fetchIncentives()
  }, [userId])

  return incentives
}