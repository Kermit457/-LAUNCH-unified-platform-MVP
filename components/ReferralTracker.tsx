"use client"

import { useEffect } from 'react'
import { useReferralTracking } from '@/hooks/useReferralTracking'

/**
 * ReferralTracker component
 * Auto-tracks referral codes from URL parameters (?ref=handle)
 * Should be placed in the app layout to work across all pages
 */
export function ReferralTracker() {
  const { referrerCode, trackProfileCreation } = useReferralTracking({
    autoTrack: true,
    onReferralDetected: (code) => {
      console.log('Referral detected:', code)
    },
    onReferralTracked: (result) => {
      console.log('Referral tracked successfully:', result)
    },
    onError: (error) => {
      console.error('Referral tracking error:', error)
    }
  })

  return null // This component doesn't render anything
}
