'use client'

import { useState, useEffect } from 'react'

interface SocialAction {
  id: string
  label: string
  targetUrl: string
  counter: number
  goal: number
}

export default function SocialWidget({ streamer }: { streamer: string }) {
  const [actions, setActions] = useState<SocialAction[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  const fetchActions = async () => {
    try {
      const res = await fetch(`/api/social?streamer=${streamer}`)
      const data = await res.json()
      setActions(data)
    } catch (error) {
      console.error('Error fetching social actions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = async (action: SocialAction) => {
    // Open URL in new tab
    window.open(action.targetUrl, '_blank')

    // Record click
    try {
      const res = await fetch(`/api/social/${action.id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (res.ok) {
        const data = await res.json()

        // Update local state
        setActions((prev) =>
          prev.map((a) =>
            a.id === action.id ? { ...a, counter: data.counter } : a
          )
        )

        // Show confetti if goal reached
        if (data.counter >= action.goal && action.goal > 0) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      }
    } catch (error) {
      console.error('Error recording click:', error)
    }
  }

  useEffect(() => {
    fetchActions()
    const interval = setInterval(fetchActions, 15000) // Poll every 15 seconds
    return () => clearInterval(interval)
  }, [streamer])

  if (loading) {
    return (
      <div className="w-[420px] h-[240px] glass-card flex items-center justify-center">
        <div className="text-white/60 animate-pulse font-semibold">Loading...</div>
      </div>
    )
  }

  if (actions.length === 0) {
    return (
      <div className="w-[420px] h-[240px] glass-card flex items-center justify-center">
        <div className="text-white/60 text-center px-6 font-medium">
          No social actions available
        </div>
      </div>
    )
  }

  return (
    <div className="w-[420px] glass-card p-6 relative">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      <div className="mb-5">
        <h2 className="gradient-text font-bold text-xl">Social Goals</h2>
        <p className="text-white/50 text-sm mt-1">Help us reach our community goals!</p>
      </div>

      <div className="space-y-4">
        {actions.map((action) => {
          const percentage = action.goal > 0 ? (action.counter / action.goal) * 100 : 0
          const goalReached = action.counter >= action.goal && action.goal > 0

          return (
            <div key={action.id} className="space-y-2">
              <button
                onClick={() => handleClick(action)}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              >
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold text-base">{action.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm font-medium">{action.counter}</span>
                    {action.goal > 0 && (
                      <>
                        <span className="text-white/40">/</span>
                        <span className="text-white font-bold text-base">{action.goal}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>

              {action.goal > 0 && (
                <div className="relative">
                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        goalReached
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : 'bg-gradient-to-r from-indigo-500 to-lime-600'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {goalReached && (
                    <div className="absolute -top-1 right-0 flex items-center gap-1">
                      <span className="text-green-400 text-xs font-bold">GOAL REACHED!</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
