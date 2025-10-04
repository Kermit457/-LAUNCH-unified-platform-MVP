'use client'

import { useState } from 'react'

interface SocialAction {
  id: string
  label: string
  counter: number
  goal: number
}

export default function SocialWidgetDemo() {
  const [actions, setActions] = useState<SocialAction[]>([
    { id: '1', label: 'Join Telegram', counter: 123, goal: 200 },
    { id: '2', label: 'Follow on Twitter', counter: 87, goal: 150 },
    { id: '3', label: 'Join Discord', counter: 156, goal: 100 },
  ])

  const handleClick = (id: string) => {
    setActions(prev =>
      prev.map(action =>
        action.id === id ? { ...action, counter: action.counter + 1 } : action
      )
    )
  }

  return (
    <div className="w-[420px] glass-card p-6">
      <div className="mb-5">
        <h2 className="gradient-text font-bold text-xl">Social Goals</h2>
        <p className="text-white/50 text-sm mt-1">Help us reach our community goals!</p>
      </div>

      <div className="space-y-4">
        {actions.map((action) => {
          const percentage = action.goal > 0 ? (action.counter / action.goal) * 100 : 0
          const goalReached = action.counter >= action.goal

          return (
            <div key={action.id} className="space-y-2">
              <button
                onClick={() => handleClick(action.id)}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              >
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold text-base">{action.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm font-medium">{action.counter}</span>
                    <span className="text-white/40">/</span>
                    <span className="text-white font-bold text-base">{action.goal}</span>
                  </div>
                </div>
              </button>

              <div className="relative">
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      goalReached
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600'
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
