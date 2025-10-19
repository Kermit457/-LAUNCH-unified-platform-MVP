"use client"

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Coins, Users2, MessageCircle, Rocket, Activity } from 'lucide-react'
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

  return (
    <div className="mb-8">
      {/* Main Net Worth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 via-zinc-900/60 to-pink-900/40 border border-purple-500/20 p-8 mb-6"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Net Worth</h1>
              <p className="text-zinc-400 text-sm">Your total portfolio value</p>
            </div>
          </div>

          {/* Main Value */}
          <div className="mb-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              {stats.totalValue.toFixed(2)} SOL
            </div>
            <div className="text-2xl text-zinc-400">
              ≈ ${(stats.totalValue * 120).toLocaleString()} USD
            </div>
          </div>

          {/* 24h Change */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl ${
              isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
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