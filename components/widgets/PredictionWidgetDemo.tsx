'use client'

import { useState } from 'react'

interface PredictionWidgetDemoProps {
  question?: string
  options?: string[]
  initialTallies?: Record<string, number>
}

export default function PredictionWidgetDemo({
  question = "Will BTC go up in 15 minutes?",
  options = ["YES", "NO"],
  initialTallies = { YES: 42, NO: 28 }
}: PredictionWidgetDemoProps) {
  const [tallies, setTallies] = useState(initialTallies)
  const [userVote, setUserVote] = useState<string | null>(null)

  const handleVote = (option: string) => {
    if (userVote) return
    setTallies(prev => ({ ...prev, [option]: prev[option] + 1 }))
    setUserVote(option)
  }

  const totalVotes = Object.values(tallies).reduce((a, b) => a + b, 0)

  return (
    <div className="w-[420px] glass-card p-6">
      <div className="mb-5">
        <h2 className="gradient-text font-bold text-xl mb-2">{question}</h2>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-green-500/20 text-green-400 border border-green-500/30">
            VOTING OPEN
          </div>
          <div className="text-white/50 text-sm font-medium">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const votes = tallies[option] || 0
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
          const isUserVote = userVote === option

          return (
            <button
              key={option}
              onClick={() => handleVote(option)}
              disabled={!!userVote}
              className={`
                w-full relative overflow-hidden rounded-xl p-4 transition-all duration-300
                bg-white/5 border
                ${!userVote ? 'hover:bg-white/10 hover:-translate-y-0.5 cursor-pointer border-white/10 hover:border-white/20' : 'cursor-default border-white/10'}
                ${isUserVote ? 'ring-2 ring-indigo-400 border-indigo-400/30' : ''}
                disabled:opacity-50
              `}
            >
              <div
                className="absolute inset-0 transition-all duration-500 bg-gradient-to-r from-indigo-500/20 to-purple-500/10"
                style={{ width: `${percentage}%` }}
              />

              <div className="relative flex items-center justify-between text-white">
                <span className="font-bold text-base">{option}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm font-medium">{votes}</span>
                  <span className="text-white font-bold text-base">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
