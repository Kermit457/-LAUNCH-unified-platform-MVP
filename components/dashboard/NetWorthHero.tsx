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
      {/* 🆕 Referral Dashboard - Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFD700]/20 via-zinc-900/60 to-[#FF8800]/20 border-2 border-[#FFD700]/30 p-8 mb-6"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF8800]/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6 mb-6">
            {/* Left: Title & Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF8800]">
                  <Gift className="w-7 h-7 text-black font-bold" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    Referral Program
                    <span className="px-3 py-1 rounded-lg bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] text-sm font-bold">
                      {referralStats.tier} Tier
                    </span>
                  </h1>
                  <p className="text-zinc-400 text-sm">
                    Earn <span className="text-[#00FF88] font-bold">3% lifetime trading commissions</span> + bonus XP from every referral
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Lifetime Commissions - MOST IMPORTANT */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-[#00FF88]/20 to-[#00DD77]/20 border-2 border-[#00FF88]/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#00FF88] text-black text-[10px] font-black rounded-bl-lg">
                    LIFETIME
                  </div>
                  <div className="flex items-center gap-2 mb-2 mt-2">
                    <DollarSign className="w-5 h-5 text-[#00FF88]" />
                    <span className="text-xs text-zinc-400 font-medium">Commissions Earned</span>
                  </div>
                  <div className="text-3xl font-bold text-[#00FF88] mb-1">
                    {referralStats.lifetimeCommissions.toFixed(2)} SOL
                  </div>
                  <div className="text-xs text-zinc-500">
                    ≈ ${(referralStats.lifetimeCommissions * 140).toFixed(0)} USD
                  </div>
                </div>

                {/* Total Referrals */}
                <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users2 className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-xs text-zinc-400 font-medium">Total Referrals</span>
                  </div>
                  <div className="text-3xl font-bold text-[#FFD700]">{referralStats.totalReferrals}</div>
                  <div className="text-xs text-zinc-500">Active users</div>
                </div>

                {/* Leaderboard Rank */}
                <div className="p-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-xs text-zinc-400 font-medium">Leaderboard</span>
                  </div>
                  <div className="text-3xl font-bold text-white">#{referralStats.leaderboardRank}</div>
                  <div className="text-xs text-zinc-500">{referralStats.xpEarned.toLocaleString()} XP</div>
                </div>
              </div>

              {/* Referral Link */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                <label className="text-xs text-zinc-400 font-medium mb-2 block">Your Referral Link</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-zinc-700 text-white font-mono text-sm">
                    {referralStats.referralLink}
                  </div>
                  <button
                    onClick={copyReferralLink}
                    className="px-4 py-3 rounded-lg bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold transition-all flex items-center gap-2"
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
                  <button
                    className="px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all flex items-center gap-2 border border-zinc-700"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Rewards Info */}
            <div className="w-80 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#00FF88]" />
                Earning Breakdown
              </h3>
              <div className="space-y-3">
                {/* Main Reward - Trading Commissions */}
                <div className="p-3 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">Trading Commissions</span>
                    <span className="text-[#00FF88] font-black text-lg">3%</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Earn 3% of ALL trading fees from your referrals
                  </p>
                  <div className="mt-2 pt-2 border-t border-[#00FF88]/20">
                    <span className="text-xs text-[#00FF88] font-bold">LIFETIME & PASSIVE</span>
                  </div>
                </div>

                {/* Bonus XP Rewards */}
                <div className="text-xs text-zinc-500 font-medium mb-2">+ Bonus XP Rewards:</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Friend joins</span>
                    <span className="text-[#FFD700] font-bold">+50 XP</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Activates curve</span>
                    <span className="text-[#FFD700] font-bold">+100 XP</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Launches project</span>
                    <span className="text-[#FFD700] font-bold">+200 XP</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <button className="w-full py-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-sm font-bold hover:bg-[#FFD700]/20 transition-all">
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Network + Net Worth Cards Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
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