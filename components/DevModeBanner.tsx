"use client"

import { useState, useEffect } from 'react'
import { AlertTriangle, X, Database, Wifi } from 'lucide-react'
import { shouldShowDevBanner, getDataSourceMode, isUsingMockData } from '@/lib/data-source'

/**
 * DevModeBanner Component
 *
 * Displays a prominent banner when the app is using mock data or in dev mode.
 * Shows at the top of the screen with clear visual indicators.
 */
export function DevModeBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Only show if feature flag is enabled
    if (shouldShowDevBanner()) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    // Store dismissal in sessionStorage (persists for current tab only)
    sessionStorage.setItem('devBannerDismissed', 'true')
  }

  // Don't render if not visible or dismissed
  if (!isVisible || isDismissed) {
    return null
  }

  const mode = getDataSourceMode()
  const usingMock = isUsingMockData()

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] ${
        usingMock
          ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500'
          : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500'
      } text-white shadow-lg animate-in slide-in-from-top duration-300`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Icon + Message */}
          <div className="flex items-center gap-3 flex-1">
            {usingMock ? (
              <Database className="w-5 h-5 flex-shrink-0 animate-pulse" />
            ) : (
              <Wifi className="w-5 h-5 flex-shrink-0" />
            )}

            <div className="flex-1">
              <div className="font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {usingMock ? 'DEVELOPMENT MODE: MOCK DATA ACTIVE' : 'DEVELOPMENT MODE'}
              </div>

              <div className="text-xs opacity-90 mt-0.5">
                {usingMock ? (
                  <>
                    Data is not saved. Using mock/sample data for development.{' '}
                    <span className="font-semibold">Set NEXT_PUBLIC_USE_MOCK_DATA=false to use live data.</span>
                  </>
                ) : (
                  <>
                    Connected to Appwrite (live data).{' '}
                    <span className="font-semibold">Development banner active.</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Badge + Dismiss */}
          <div className="flex items-center gap-3">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                usingMock
                  ? 'bg-orange-600/50 border border-orange-400'
                  : 'bg-blue-600/50 border border-blue-400'
              }`}
            >
              {usingMock ? (
                <>
                  <Database className="w-3 h-3" />
                  MOCK
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3" />
                  LIVE
                </>
              )}
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 rounded hover:bg-white/20 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * DevModeIndicator Component
 *
 * Smaller, persistent indicator for dev mode (shows in corner after banner is dismissed)
 */
export function DevModeIndicator() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (shouldShowDevBanner()) {
      // Check if banner was dismissed
      const dismissed = sessionStorage.getItem('devBannerDismissed')
      if (dismissed) {
        setIsVisible(true)
      }
    }
  }, [])

  if (!isVisible) return null

  const usingMock = isUsingMockData()

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg shadow-lg ${
        usingMock
          ? 'bg-orange-500 border border-orange-400'
          : 'bg-blue-500 border border-blue-400'
      } text-white text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      {usingMock ? (
        <>
          <Database className="w-3 h-3" />
          MOCK DATA
        </>
      ) : (
        <>
          <Wifi className="w-3 h-3" />
          DEV MODE
        </>
      )}
    </div>
  )
}
