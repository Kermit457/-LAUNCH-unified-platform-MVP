"use client"

import { motion } from 'framer-motion'
import { Users, TrendingUp, Copy, Share2, Award, Zap } from 'lucide-react'
import { useState } from 'react'
import { useReferralStats } from '@/hooks/useReferralStats'

interface ReferralCardProps {
  userId?: string
  variant?: 'default' | 'compact'
  showLeaderboardLink?: boolean
}

export const ReferralCard = ({
  userId,
  variant = 'default',
  showLeaderboardLink = true
}: ReferralCardProps) => {
  const { stats, generateReferralLink, copyReferralLink, shareReferralLink, isLoading } = useReferralStats(userId)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyReferralLink()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    await shareReferralLink()
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/3 mb-4" />
        <div className="h-4 bg-zinc-800 rounded w-2/3" />
      </div>
    )
  }

  if (!stats) return null

  const referralLink = generateReferralLink()

  // Level colors
  const getLevelColor = (level: number) => {
    if (level >= 5) return 'text-purple-400'
    if (level >= 4) return 'text-blue-400'
    if (level >= 3) return 'text-green-400'
    if (level >= 2) return 'text-yellow-400'
    return 'text-zinc-400'
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 rounded-xl border border-zinc-800 p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className={`w-5 h-5 ${getLevelColor(stats.level)}`} />
            <div>
              <p className="text-sm font-medium text-white">{stats.levelName}</p>
              <p className="text-xs text-zinc-500">{stats.totalReferrals} referrals</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">${stats.totalEarnings.toFixed(2)}</p>
            <p className="text-xs text-zinc-500">earned</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {copied ? (
            <>✓ Copied!</>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Referral Link
            </>
          )}
        </button>
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
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Referral Program</h3>
            <p className="text-sm text-zinc-400">Earn 1% of every transaction</p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-lg">
            <Award className={`w-5 h-5 ${getLevelColor(stats.level)}`} />
            <span className={`text-sm font-bold ${getLevelColor(stats.level)}`}>
              {stats.levelName}
            </span>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Level {stats.level}</span>
            <span>{stats.nextLevelProgress}% to next level</span>
          </div>
          <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.nextLevelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-500 to-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 p-6 border-b border-zinc-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-orange-400" />
            <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
          </div>
          <p className="text-xs text-zinc-500">Referrals</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-purple-400" />
            <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
          </div>
          <p className="text-xs text-zinc-500">Transactions</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <p className="text-2xl font-bold text-white">${stats.totalEarnings.toFixed(2)}</p>
          </div>
          <p className="text-xs text-zinc-500">Earned</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="p-6">
        <label className="text-sm font-medium text-zinc-400 mb-2 block">
          Your Referral Link
        </label>
        <div className="flex gap-2">
          <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-400 truncate font-mono">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {copied ? (
              <>✓</>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg border border-zinc-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Activity */}
        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-zinc-400 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {stats.recentActivity.slice(0, 3).map((activity, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-zinc-900 rounded-lg p-3">
                  <span className="text-zinc-400 capitalize">{activity.action.replace('_', ' ')}</span>
                  <span className="text-orange-400 font-medium">+${activity.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showLeaderboardLink && (
          <a
            href="/community?tab=referrals"
            className="mt-4 w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 border border-zinc-800"
          >
            View Leaderboard
          </a>
        )}
      </div>
    </motion.div>
  )
}