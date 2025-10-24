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
    if (level >= 5) return 'text-lime-400'
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
      className="bg-gradient-to-br from-[#0a1628] to-[#0c1d3a] rounded-2xl border border-[#1e3a5f]/50 overflow-hidden"
    >
      {/* Compact Header with Gold Badge */}
      <div className="bg-gradient-to-r from-[#0088FF]/10 to-[#0066CC]/10 border-b border-[#1e3a5f]/50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0088FF]/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#0088FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">Referral Program</h3>
                <span className="px-2 py-0.5 bg-[#FFD700] text-black text-xs font-bold rounded">
                  Gold Tier
                </span>
              </div>
              <p className="text-xs text-[#5a9fd4]">Earn 3% lifetime trading commissions + bonus XP from every referral</p>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Stats Layout */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-6 p-5">
        {/* Left: Stats */}
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#0088FF]/10 to-transparent rounded-xl p-3 border border-[#1e3a5f]/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#5a9fd4] uppercase tracking-wide">Commissions Earned</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{stats.totalEarnings.toFixed(2)} SOL</span>
              <span className="text-xs text-[#5a9fd4]">≈ $483 USD</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-[#0088FF]/10 to-transparent rounded-lg p-2 border border-[#1e3a5f]/30">
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-3 h-3 text-[#0088FF]" />
                <span className="text-xs text-[#5a9fd4]">Total Referrals</span>
              </div>
              <p className="text-xl font-bold text-white">{stats.totalReferrals}</p>
              <p className="text-[10px] text-[#5a9fd4]">Active users</p>
            </div>

            <div className="bg-gradient-to-br from-[#0088FF]/10 to-transparent rounded-lg p-2 border border-[#1e3a5f]/30">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-[#0088FF]" />
                <span className="text-xs text-[#5a9fd4]">Transactions</span>
              </div>
              <p className="text-xl font-bold text-white">{stats.totalTransactions}</p>
              <p className="text-[10px] text-[#5a9fd4]">Total volume</p>
            </div>
          </div>
        </div>

        {/* Center: Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-[#1e3a5f]/30 to-transparent" />

        {/* Right: Referral Link */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[#5a9fd4] mb-2 block uppercase tracking-wide">
              Your Referral Link
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#0a1628] border border-[#1e3a5f]/50 rounded-lg px-3 py-2 text-xs text-[#5a9fd4] truncate font-mono">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-[#FFD700] hover:bg-[#FFED4E] text-black'
                }`}
              >
                {copied ? (
                  <>✓ Copy</>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-2 bg-[#0088FF]/10 hover:bg-[#0088FF]/20 text-[#0088FF] rounded-lg border border-[#1e3a5f]/50 transition-colors"
              >
                <Share2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Earning Breakdown - Compact */}
          <div className="bg-gradient-to-br from-[#0088FF]/10 to-transparent rounded-xl p-3 border border-[#1e3a5f]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#5a9fd4] uppercase tracking-wide">Earning Breakdown</span>
              <span className="text-[10px] font-bold text-[#00FF88]">3%</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5a9fd4]">Trading Commissions</span>
                <span className="font-bold text-[#00FF88]">3%</span>
              </div>
              <p className="text-[10px] text-[#5a9fd4] leading-tight">
                Earn 3% of ALL trading fees from your referrals
              </p>
              <div className="border-t border-[#1e3a5f]/30 pt-2 mt-2">
                <p className="text-[10px] font-bold text-[#5a9fd4] uppercase mb-1">Lifetime & Passive</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#5a9fd4]">= Bonus XP Rewards:</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#5a9fd4]">Friend joins</span>
                    <span className="text-[#FFD700] font-bold">+50 XP</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#5a9fd4]">Activates curve</span>
                    <span className="text-[#FFD700] font-bold">+100 XP</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#5a9fd4]">Launches project</span>
                    <span className="text-[#FFD700] font-bold">+200 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showLeaderboardLink && (
            <button
              onClick={() => window.location.href = '/community?tab=referrals'}
              className="w-full bg-gradient-to-r from-[#0088FF] to-[#0066CC] hover:from-[#0099FF] hover:to-[#0077DD] text-white text-xs font-bold py-2 rounded-lg transition-all"
            >
              View Leaderboard
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}