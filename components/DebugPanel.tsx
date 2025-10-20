"use client"

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useCurveActivation } from '@/contexts/CurveActivationContext'

/**
 * Global debug panel for testing activation modal
 * Shows on all pages when in development mode
 */
export function DebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { userId } = useUser()
  const { showActivationModal, setShowActivationModal, isActivated, progress } = useCurveActivation()

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold text-sm shadow-lg hover:bg-yellow-400 transition-all"
        >
          🔧 Debug
        </button>
      ) : (
        <div className="bg-yellow-900/95 border border-yellow-500/50 rounded-lg p-4 shadow-2xl backdrop-blur-sm max-w-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-yellow-400 font-bold text-sm">🔧 DEBUG PANEL</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-yellow-400 hover:text-yellow-300 font-bold text-lg"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 text-xs text-yellow-100 mb-3">
            <div>Modal: <span className="font-bold">{showActivationModal ? 'OPEN' : 'CLOSED'}</span></div>
            <div>Activated: <span className="font-bold">{isActivated ? 'YES' : 'NO'}</span></div>
            <div>Curve Exists: <span className="font-bold">{progress.curveExists ? 'YES' : 'NO'}</span></div>
            <div>Keys Owned: <span className="font-bold">{progress.currentKeys}/{progress.minKeysRequired}</span></div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowActivationModal(true)}
              className="w-full px-3 py-2 bg-yellow-500 text-black rounded-lg font-bold text-sm hover:bg-yellow-400 transition-all"
            >
              Force Open Modal
            </button>
            <button
              onClick={() => {
                if (userId) {
                  localStorage.removeItem(`onboarding_v6_${userId}`)
                  window.location.reload()
                }
              }}
              className="w-full px-3 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-400 transition-all"
            >
              Reset Onboarding
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
