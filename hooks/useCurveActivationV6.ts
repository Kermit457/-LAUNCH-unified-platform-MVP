import { useState, useEffect } from 'react'
import { useUser } from './useUser'
import { PublicKey } from '@solana/web3.js'
// import { getCurveStatus, getUserKeyHoldings, curveExistsOnChain } from '@/lib/solana/create-curve'

// Stub implementations for unavailable functions
const getCurveStatus = async (twitterHandle: string) => null
const getUserKeyHoldings = async (twitterHandle: string, wallet: PublicKey) => 0
const curveExistsOnChain = async (twitterHandle: string) => false

export interface CurveActivationProgress {
  hasMinKeys: boolean // User owns 10+ of their own keys
  currentKeys: number // Keys owned of their own curve
  minKeysRequired: number // Default: 10
  isActive: boolean // Curve is activated (status: Active on-chain)
  curveExists: boolean // Curve has been created on-chain
  twitterHandle?: string // User's Twitter handle (curve identifier)
}

/**
 * Hook to manage user's curve activation status (V6 Solana version)
 *
 * ACTIVATION FLOW:
 * 1. User logs in with Twitter (Privy) → Auto-authenticated
 * 2. Curve created on-chain with status: Pending
 * 3. Modal pops up: "Buy 10 of your own keys to activate"
 * 4. User buys keys → Curve status changes to Active
 *
 * UNLOCKS when status === Active:
 * - Comment/upvote on projects
 * - Collaborate on launches
 * - Launch own projects
 * - Participate in Earn campaigns
 * - Visible in Discover feed
 */
export function useCurveActivationV6() {
  const { userId, username, user } = useUser() // username from Privy Twitter
  const [progress, setProgress] = useState<CurveActivationProgress>({
    hasMinKeys: false,
    currentKeys: 0,
    minKeysRequired: 10,
    isActive: false,
    curveExists: false
  })
  const [loading, setLoading] = useState(true)
  const [showActivationModal, setShowActivationModal] = useState(false)

  useEffect(() => {
    async function checkActivationStatus() {
      console.log('🔍 useCurveActivationV6 running:', { userId, username, hasUser: !!user })

      if (!userId || !username) {
        console.log('⚠️ Missing userId or username, skipping activation check')
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Get user's Solana wallet from Privy
        const solanaWallet = user?.wallet?.address
        if (!solanaWallet) {
          console.log('⚠️ User has no Solana wallet')
          setLoading(false)
          return
        }

        const twitterHandle = username // From Privy

        console.log('📊 Checking activation for:', {
          userId,
          twitterHandle,
          wallet: solanaWallet
        })

        // 1. Check if curve exists on-chain
        const exists = await curveExistsOnChain(twitterHandle)

        if (!exists) {
          // Curve hasn't been created yet
          const newProgress = {
            hasMinKeys: false,
            currentKeys: 0,
            minKeysRequired: 10,
            isActive: false,
            curveExists: false,
            twitterHandle
          }
          setProgress(newProgress)
          console.log('ℹ️ Curve not yet created on-chain')

          // 🆕 Show modal for first-time users to create + activate curve
          const hasSeenOnboarding = localStorage.getItem(`onboarding_v6_${userId}`)
          console.log('🔍 Modal trigger check (no curve):', {
            curveExists: false,
            hasSeenOnboarding,
            willShowModal: !hasSeenOnboarding
          })
          if (!hasSeenOnboarding) {
            console.log('✅ SHOWING ACTIVATION MODAL (curve creation needed)')
            setShowActivationModal(true)
            localStorage.setItem(`onboarding_v6_${userId}`, 'true')
          }

          setLoading(false)
          return
        }

        // 2. Get curve status from on-chain
        const curveStatus = await getCurveStatus(twitterHandle)

        // 3. Get user's key holdings
        const userWallet = new PublicKey(solanaWallet)
        const currentKeys = await getUserKeyHoldings(twitterHandle, userWallet)

        const newProgress: CurveActivationProgress = {
          hasMinKeys: currentKeys >= 10,
          currentKeys,
          minKeysRequired: 10,
          // Curve is active when status === 'active' on-chain
          isActive: curveStatus === 'active',
          curveExists: true,
          twitterHandle
        }

        setProgress(newProgress)

        console.log('✅ Activation status:', {
          curveStatus,
          currentKeys,
          isActive: newProgress.isActive,
          hasMinKeys: newProgress.hasMinKeys
        })

        // Auto-show modal on first login if not activated
        const hasSeenOnboarding = localStorage.getItem(`onboarding_v6_${userId}`)
        console.log('🔍 Modal trigger check:', {
          isActive: newProgress.isActive,
          hasSeenOnboarding,
          willShowModal: !newProgress.isActive && !hasSeenOnboarding
        })
        if (!newProgress.isActive && !hasSeenOnboarding) {
          console.log('✅ SHOWING ACTIVATION MODAL')
          setShowActivationModal(true)
          localStorage.setItem(`onboarding_v6_${userId}`, 'true')
        }

      } catch (error) {
        console.error('❌ Failed to check activation status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkActivationStatus()
    // Re-check every 10 seconds to catch key purchases
    const interval = setInterval(checkActivationStatus, 10000)

    return () => clearInterval(interval)
  }, [userId, username, user])

  const activateCurve = async () => {
    // Activation happens automatically when user buys 10+ keys
    // This function just closes the modal
    setShowActivationModal(false)
  }

  return {
    progress,
    loading,
    showActivationModal,
    setShowActivationModal,
    activateCurve,
    canActivate: progress.hasMinKeys,
    isActivated: progress.isActive,
    needsCreation: !progress.curveExists
  }
}
