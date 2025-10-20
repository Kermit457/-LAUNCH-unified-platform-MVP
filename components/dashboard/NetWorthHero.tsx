"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Coins, Users2, MessageCircle, Rocket, Activity, Gift, Copy, Check, Share2, Trophy, Zap } from 'lucide-react'
import type { NetWorthStats } from '@/lib/dashboardMockData'

interface NetWorthHeroProps {
  stats: NetWorthStats
  holdingsCount: number
  curvesOwnedCount: number
  collaborationsCount: number
  pendingCollabsCount: number
  unreadMessagesCount: number
  networkSize: number
}

export function NetWorthHero({
  stats,
  holdingsCount,
  curvesOwnedCount,
  collaborationsCount,
  pendingCollabsCount,
  unreadMessagesCount,
  networkSize
}: NetWorthHeroProps) {
  const isPositive = stats.change24h >= 0
  const [copied, setCopied] = useState(false)

  // Mock referral data - will be replaced with real data
  const referralStats = {
    totalReferrals: 12,
    lifetimeCommissions: 3.45, // SOL earned from referral trading fees
    xpEarned: 1240,
    leaderboardRank: 42,
    referralLink: 'icmmotion.com/ref/mirko',
    tier: 'Gold' // Bronze, Silver, Gold, Platinum, Diamond
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://${referralStats.referralLink}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-8">
      {/* Referral Network + Network + Net Worth Cards Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Referral Network Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1628] to-[#0c1d3a] border-2 border-[#1e3a5f]/50 p-8"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-96 h-96 bg-[#0088FF]/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-[#0066CC]/10 rounded-full blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0088FF] to-[#0066CC]">
                <Gift className="w-7 h-7 text-white font-bold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Referral Network</h1>
                <p className="text-[#5a9fd4] text-sm">3% lifetime commissions</p>
              </div>
            </div>

            {/* Main Value - Commissions Earned */}
            <div className="mb-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-[#00FF88] via-[#00DD77] to-[#00CC66] bg-clip-text text-transparent mb-2">
                {referralStats.lifetimeCommissions.toFixed(2)}
              </div>
              <div className="text-2xl text-zinc-400">
                SOL earned
              </div>
            </div>

            {/* Referral Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088FF]/20 border border-[#1e3a5f]/50">
                <Users2 className="w-5 h-5 text-[#0088FF]" />
                <div>
                  <div className="text-xs text-zinc-500">Referrals</div>
                  <div className="font-bold text-white">
                    {referralStats.totalReferrals}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/30">
                <Trophy className="w-5 h-5 text-[#FFD700]" />
                <div>
                  <div className="text-xs text-zinc-500">Rank</div>
                  <div className="font-bold text-white">
                    #{referralStats.leaderboardRank}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Network Card - Blue Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0088FF]/20 via-zinc-900/60 to-[#0044FF]/20 border border-[#0088FF]/30 p-8"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-96 h-96 bg-[#0088FF]/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-[#0044FF]/20 rounded-full blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0088FF] to-[#0044FF]">
                <Users2 className="w-7 h-7 text-white font-bold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Network</h1>
                <p className="text-zinc-400 text-sm">Your total reach</p>
              </div>
            </div>

            {/* Main Value */}
            <div className="mb-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-[#0088FF] via-[#00AAFF] to-[#00DDFF] bg-clip-text text-transparent mb-2" suppressHydrationWarning>
                {networkSize.toLocaleString()}
              </div>
              <div className="text-2xl text-zinc-400">
                Total connections
              </div>
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088FF]/20 border border-[#0088FF]/30">
                <Users2 className="w-5 h-5 text-[#0088FF]" />
                <div>
                  <div className="text-xs text-zinc-500">Holders</div>
                  <div className="font-bold text-white" suppressHydrationWarning>
                    {holdingsCount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00AAFF]/20 border border-[#00AAFF]/30">
                <Rocket className="w-5 h-5 text-[#00AAFF]" />
                <div>
                  <div className="text-xs text-zinc-500">Collaborations</div>
                  <div className="font-bold text-white" suppressHydrationWarning>
                    {collaborationsCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Net Worth Card - Green/Yellow Gradient (moved to right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00FF88]/20 via-zinc-900/60 to-[#FFD700]/20 border border-[#00FF88]/30 p-8"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-96 h-96 bg-[#00FF88]/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#00FF88] to-[#FFD700]">
                <DollarSign className="w-7 h-7 text-black font-bold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Net Worth</h1>
                <p className="text-zinc-400 text-sm">Your total portfolio value</p>
              </div>
            </div>

            {/* Main Value */}
            <div className="mb-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-[#00FF88] via-[#FFD700] to-[#FF8800] bg-clip-text text-transparent mb-2">
                {stats.totalValue.toFixed(2)} SOL
              </div>
              <div className="text-2xl text-zinc-400">
                ≈ ${(stats.totalValue * 120).toLocaleString()} USD
              </div>
            </div>

            {/* 24h Change */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl ${
                isPositive ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30' : 'bg-[#FF0040]/20 text-[#FF0040] border border-[#FF0040]/30'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="font-bold text-lg">
                  {isPositive ? '+' : ''}{stats.change24h.toFixed(2)} SOL
                </span>
                <span className="text-sm">
                  ({isPositive ? '+' : ''}{stats.changePercent.toFixed(1)}%)
                </span>
              </div>
              <span className="text-zinc-500 text-sm">24h change</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referral Link Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#0a1628] to-[#0c1d3a] border-2 border-[#1e3a5f]/50 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-4">
          {/* Referral Link Input */}
          <div className="flex-1 flex items-center gap-3">
            <label className="text-sm font-medium text-[#5a9fd4] whitespace-nowrap">Your Referral Link</label>
            <div className="flex-1 px-4 py-3 rounded-lg bg-[#0a1628] border border-[#1e3a5f]/50 text-[#5a9fd4] font-mono text-sm">
              {referralStats.referralLink}
            </div>
            <button
              onClick={copyReferralLink}
              className="px-6 py-3 rounded-lg bg-[#0088FF] hover:bg-[#0066CC] text-white font-bold transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button className="px-6 py-3 rounded-lg bg-[#0088FF]/10 hover:bg-[#0088FF]/20 text-[#0088FF] font-bold transition-all flex items-center gap-2 border border-[#1e3a5f]/50">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* View Leaderboard Button */}
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#0088FF] to-[#0066CC] hover:from-[#0099FF] hover:to-[#0077DD] text-white font-bold transition-all whitespace-nowrap">
            View Leaderboard
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Earned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-orange-500/50 transition-all group"
        >
          <div className="flex items-center gap-2 mb-3">
            <Coins className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-zinc-500 font-medium">Total Earned</span>
          </div>
          <div className="text-2xl font-bold text-orange-400 mb-1">
            {stats.totalEarned.lifetime.toFixed(1)} SOL
          </div>
          <div className="text-xs text-zinc-600">
            +{stats.totalEarned.thisMonth.toFixed(1)} this month
          </div>
        </motion.div>

        {/* Holdings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-blue-500/50 transition-all group"
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-zinc-500 font-medium">Holdings</span>
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {holdingsCount}
          </div>
          <div className="text-xs text-zinc-600">
            Positions across curves
          </div>
        </motion.div>

        {/* Curves Owned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-green-500/50 transition-all group"
        >
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="w-5 h-5 text-green-400" />
            <span className="text-xs text-zinc-500 font-medium">Curves Owned</span>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">
            {curvesOwnedCount}
          </div>
          <div className="text-xs text-zinc-600">
            Projects launched
          </div>
        </motion.div>

        {/* Collaborations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-purple-500/50 transition-all group relative"
        >
          {pendingCollabsCount > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white">
              {pendingCollabsCount}
            </div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <Users2 className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-zinc-500 font-medium">Collaborations</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {collaborationsCount}
          </div>
          <div className="text-xs text-zinc-600">
            {pendingCollabsCount > 0 ? `${pendingCollabsCount} pending` : 'Active projects'}
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-pink-500/50 transition-all group relative"
        >
          {unreadMessagesCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white"
            >
              {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
            </motion.div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-pink-400" />
            <span className="text-xs text-zinc-500 font-medium">Messages</span>
          </div>
          <div className="text-2xl font-bold text-pink-400 mb-1">
            {unreadMessagesCount}
          </div>
          <div className="text-xs text-zinc-600">
            Unread messages
          </div>
        </motion.div>

        {/* Network Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-cyan-500/50 transition-all group"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users2 className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-zinc-500 font-medium">Network</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400 mb-1">
            {networkSize.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-600">
            Total reach
          </div>
        </motion.div>
      </div>
    </div>
  )
}