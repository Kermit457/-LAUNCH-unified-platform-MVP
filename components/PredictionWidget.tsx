'use client'

import { useState, useEffect } from 'react'

interface PredictionData {
  id: string
  streamerId: string
  question: string
  options: string[]
  state: 'OPEN' | 'LOCKED' | 'SETTLED'
  tallies: Record<string, number>
  winningOption?: string
}

export default function PredictionWidget({ streamer }: { streamer: string }) {
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [userVote, setUserVote] = useState<string | null>(null)

  const fetchPrediction = async () => {
    try {
      const res = await fetch(`/api/predictions/active?streamer=${streamer}`)
      const data = await res.json()

      if (data.id) {
        setPrediction(data)
      } else {
        setPrediction(null)
      }
    } catch (error) {
      console.error('Error fetching prediction:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (option: string) => {
    if (!prediction || prediction.state !== 'OPEN' || voting) return

    setVoting(true)
    try {
      const res = await fetch(`/api/predictions/${prediction.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option }),
      })

      if (res.ok) {
        setUserVote(option)
        await fetchPrediction()
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVoting(false)
    }
  }

  useEffect(() => {
    fetchPrediction()
    const interval = setInterval(fetchPrediction, 12000) // Poll every 12 seconds
    return () => clearInterval(interval)
  }, [streamer])

  if (loading) {
    return (
      <div className="w-[420px] h-[240px] glass-card flex items-center justify-center">
        <div className="text-white/60 animate-pulse font-semibold">Loading...</div>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="w-[420px] h-[240px] glass-card flex items-center justify-center">
        <div className="text-white/60 text-center px-6 font-medium">
          No active prediction
        </div>
      </div>
    )
  }

  const totalVotes = Object.values(prediction.tallies).reduce((a, b) => a + b, 0)

  return (
    <div className="w-[420px] glass-card p-6">
      <div className="mb-5">
        <h2 className="gradient-text font-bold text-xl mb-2">{prediction.question}</h2>
        <div className="flex items-center gap-2">
          <div className={`
            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
            ${prediction.state === 'OPEN' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
            ${prediction.state === 'LOCKED' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : ''}
            ${prediction.state === 'SETTLED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''}
          `}>
            {prediction.state === 'OPEN' && 'VOTING OPEN'}
            {prediction.state === 'LOCKED' && 'LOCKED'}
            {prediction.state === 'SETTLED' && 'SETTLED'}
          </div>
          <div className="text-white/50 text-sm font-medium">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {prediction.options.map((option) => {
          const votes = prediction.tallies[option] || 0
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
          const isWinner = prediction.state === 'SETTLED' && prediction.winningOption === option
          const isUserVote = userVote === option

          return (
            <button
              key={option}
              onClick={() => handleVote(option)}
              disabled={prediction.state !== 'OPEN' || voting}
              className={`
                w-full relative overflow-hidden rounded-xl p-4 transition-all duration-300
                bg-white/5 border
                ${prediction.state === 'OPEN' ? 'hover:bg-white/10 hover:-translate-y-0.5 cursor-pointer border-white/10 hover:border-white/20' : 'cursor-default border-white/10'}
                ${isWinner ? 'ring-2 ring-green-400 bg-green-500/10 border-green-400/30' : ''}
                ${isUserVote && prediction.state === 'OPEN' ? 'ring-2 ring-indigo-400 border-indigo-400/30' : ''}
                disabled:opacity-50
              `}
            >
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  isWinner ? 'bg-gradient-to-r from-green-500/20 to-green-500/10' : 'bg-gradient-to-r from-indigo-500/20 to-lime-500/10'
                }`}
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

      {prediction.state === 'SETTLED' && prediction.winningOption && (
        <div className="mt-5 text-center">
          <div className="inline-block px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <span className="text-green-400 text-sm font-bold">
              🏆 Winner: {prediction.winningOption}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
