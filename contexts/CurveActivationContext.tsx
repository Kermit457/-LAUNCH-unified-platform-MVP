"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@/hooks/useUser'
import { PublicKey } from '@solana/web3.js'
// import { getCurveStatus, getUserKeyHoldings, curveExistsOnChain } from '@/lib/solana/create-curve'

// Stub implementations for unavailable functions
const getCurveStatus = async (twitterHandle: string) => null
const getUserKeyHoldings = async (twitterHandle: string, wallet: PublicKey) => 0
const curveExistsOnChain = async (twitterHandle: string) => false

export interface CurveActivationProgress {
  hasMinKeys: boolean
  currentKeys: number
  minKeysRequired: number
  isActive: boolean
  curveExists: boolean
  twitterHandle?: string
}

interface CurveActivationContextType {
  progress: CurveActivationProgress
  loading: boolean
  showActivationModal: boolean
  setShowActivationModal: (show: boolean) => void
  activateCurve: () => void
  canActivate: boolean
  isActivated: boolean
  needsCreation: boolean
}

const CurveActivationContext = createContext<CurveActivationContextType | undefined>(undefined)

export function CurveActivationProvider({ children }: { children: ReactNode }) {
  const { userId, username, user } = useUser()
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

        const twitterHandle = username

        console.log('📊 Checking activation for:', {
          userId,
          twitterHandle,
          wallet: solanaWallet
        })

        // 1. Check if curve exists on-chain
        const exists = await curveExistsOnChain(twitterHandle)

        if (!exists) {
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

          // Show modal for first-time users
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
    // Re-check every 30 seconds (reduced from 10) to catch key purchases
    const interval = setInterval(checkActivationStatus, 30000)

    return () => clearInterval(interval)
  }, [userId, username, user])

  const activateCurve = async () => {
    setShowActivationModal(false)
  }

  return (
    <CurveActivationContext.Provider
      value={{
        progress,
        loading,
        showActivationModal,
        setShowActivationModal,
        activateCurve,
        canActivate: progress.hasMinKeys,
        isActivated: progress.isActive,
        needsCreation: !progress.curveExists
      }}
    >
      {children}
    </CurveActivationContext.Provider>
  )
}

export function useCurveActivation() {
  const context = useContext(CurveActivationContext)
  if (!context) {
    throw new Error('useCurveActivation must be used within CurveActivationProvider')
  }
  return context
}
