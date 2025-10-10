import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import {
  trackReferrer,
  getReferrer,
  clearReferrer,
  isValidReferralCode
} from '@/lib/referral'

interface UseReferralTrackingOptions {
  autoTrack?: boolean
  onReferralDetected?: (referrerCode: string) => void
  onReferralTracked?: (result: any) => void
  onError?: (error: Error) => void
}

export function useReferralTracking(options: UseReferralTrackingOptions = {}) {
  const { autoTrack = true, onReferralDetected, onReferralTracked, onError } = options
  const router = useRouter()
  const { user, authenticated } = usePrivy()
  const [referrerCode, setReferrerCode] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [trackingResult, setTrackingResult] = useState<any>(null)

  // Check for referral code in URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const urlParams = new URLSearchParams(window.location.search)
    const ref = urlParams.get('ref')

    if (ref && isValidReferralCode(ref)) {
      // Store the referrer
      trackReferrer(ref)
      setReferrerCode(ref)

      // Notify callback
      onReferralDetected?.(ref)

      // Clean up URL (remove ref parameter)
      urlParams.delete('ref')
      const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname

      router.replace(newUrl)
    } else {
      // Check if we have a stored referrer
      const storedReferrer = getReferrer()
      if (storedReferrer) {
        setReferrerCode(storedReferrer)
      }
    }
  }, [router, onReferralDetected])

  // Auto-track profile creation when user authenticates
  useEffect(() => {
    if (!autoTrack || !authenticated || !user || !referrerCode) return

    trackProfileCreation()
  }, [autoTrack, authenticated, user, referrerCode])

  // Track profile creation
  const trackProfileCreation = useCallback(async () => {
    if (!user || !referrerCode || isTracking) return

    setIsTracking(true)
    try {
      const response = await fetch('/api/referral/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerId: referrerCode,
          referredId: user.id,
          action: 'profile_creation',
          grossAmount: 0,
          metadata: {
            userEmail: user.email?.address,
            userWallet: user.wallet?.address,
            timestamp: new Date().toISOString()
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        // If user is already referred, clear the local referrer
        if (response.status === 409) {
          clearReferrer()
          setReferrerCode(null)
        }
        throw new Error(error.error || 'Failed to track referral')
      }

      const result = await response.json()
      setTrackingResult(result)
      onReferralTracked?.(result)

      // Clear the referrer after successful tracking
      clearReferrer()
      setReferrerCode(null)
    } catch (error) {
      console.error('Error tracking referral:', error)
      onError?.(error as Error)
    } finally {
      setIsTracking(false)
    }
  }, [user, referrerCode, isTracking, onReferralTracked, onError])

  // Track a custom action
  const trackAction = useCallback(async (
    action: string,
    grossAmount: number,
    projectId?: string,
    metadata?: any
  ) => {
    if (!user) return

    try {
      const response = await fetch('/api/referral/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerId: await getUserReferrer(user.id),
          referredId: user.id,
          action,
          grossAmount,
          projectId,
          metadata
        })
      })

      if (!response.ok) {
        throw new Error('Failed to track action')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error tracking action:', error)
      onError?.(error as Error)
      throw error
    }
  }, [user, onError])

  // Get user's referrer from backend
  const getUserReferrer = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/referral/track?userId=${userId}&type=referred`)
      if (!response.ok) return null

      const data = await response.json()
      const referralRecord = data.referrals.find(
        (r: any) => r.action === 'profile_creation'
      )
      return referralRecord?.referrerId || null
    } catch {
      return null
    }
  }, [])

  // Generate referral link for current user
  const generateReferralLink = useCallback((baseUrl?: string): string => {
    if (!user?.id) return ''

    const base = baseUrl || window.location.origin
    return `${base}?ref=${user.id}`
  }, [user])

  return {
    referrerCode,
    isTracking,
    trackingResult,
    trackProfileCreation,
    trackAction,
    generateReferralLink,
    hasReferrer: !!referrerCode,
    clearReferrer: () => {
      clearReferrer()
      setReferrerCode(null)
    }
  }
}