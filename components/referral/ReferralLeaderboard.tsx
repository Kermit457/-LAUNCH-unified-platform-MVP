"use client"

import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Users, Award } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useReferralStats } from '@/hooks/useReferralStats'

interface ReferralLeaderboardProps {
  limit?: number
  showUserRank?: boolean
  variant?: 'full' | 'compact'
}

export const ReferralLeaderboard = ({
  limit = 10,
  showUserRank = true,
  variant = 'full'
}: ReferralLeaderboardProps) => {
  const { leaderboard, userRank, isLoading, fetchLeaderboard, getLeaderboardPosition } = useReferralStats()
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all')

  useEffect(() => {
    fetchLeaderboard(limit, 0, timeframe)
  }, [timeframe, limit, fetchLeaderboard])

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getLevelColor = (level: number) => {
    if (level >= 5) return 'text-purple-400 bg-purple-500/10'
    if (level >= 4) return 'text-blue-400 bg-blue-500/10'
    if (level >= 3) return 'text-green-400 bg-green-500/10'
    if (level >= 2) return 'text-yellow-400 bg-yellow-500/10'
    return 'text-zinc-400 bg-zinc-800'
  }

  const position = getLeaderboardPosition()

  if (isLoading) {
    return (
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 rounded-xl border border-zinc-800 p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange-400" />
            Top Referrers
          </h3>
        </div>

        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((entry) => (
            <div
              key={entry.userId}
              className="flex items-center justify-between bg-zinc-900 rounded-lg p-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500 w-6">
                  #{entry.rank}
                </span>
                <span className="text-sm text-white truncate max-w-[120px]">
                  {entry.username}
                </span>
              </div>
              <span className="text-xs font-medium text-orange-400">
                {entry.totalReferrals}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border-b border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-lg">
              <Trophy className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Referral Leaderboard</h3>
              <p className="text-sm text-zinc-400">Top referrers this {timeframe === 'all' ? 'all time' : timeframe}</p>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2">
          {(['all', 'month', 'week'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {tf === 'all' ? 'All Time' : tf === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* User's Rank (if applicable) */}
      {showUserRank && userRank && (
        <div className="bg-orange-500/5 border-b border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/20 px-3 py-1 rounded-lg">
                <span className="text-sm font-bold text-orange-400">Your Rank</span>
              </div>
              <span className="text-lg font-bold text-white">#{userRank}</span>
              {position.isTopTen && (
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                  Top 10!
                </span>
              )}
            </div>
            {position.percentile && (
              <span className="text-sm text-zinc-400">
                Top {(100 - position.percentile).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="p-6">
        <div className="space-y-2">
          {leaderboard.map((entry, index) => {
            const medal = getMedalEmoji(entry.rank)
            const isUserEntry = showUserRank && entry.rank === userRank

            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  isUserEntry
                    ? 'bg-orange-500/10 border border-orange-500/20'
                    : 'bg-zinc-900 hover:bg-zinc-800'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800">
                  {medal ? (
                    <span className="text-xl">{medal}</span>
                  ) : (
                    <span className="text-sm font-bold text-zinc-400">#{entry.rank}</span>
                  )}
                </div>

                {/* Avatar & User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate">
                      {entry.username}
                    </p>
                    {entry.handle && (
                      <span className="text-xs text-zinc-500">@{entry.handle}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {entry.totalReferrals} referrals
                    </span>
                    {entry.recentReferrals > 0 && (
                      <span className="flex items-center gap-1 text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        +{entry.recentReferrals} this week
                      </span>
                    )}
                  </div>
                </div>

                {/* Level Badge */}
                <div className={`px-3 py-1 rounded-lg ${getLevelColor(entry.level)}`}>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span className="text-xs font-bold">{entry.levelName}</span>
                  </div>
                </div>

                {/* Earnings */}
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    ${entry.totalEarnings.toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-500">earned</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">No referral data yet</p>
            <p className="text-sm text-zinc-600 mt-1">Be the first to refer someone!</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}