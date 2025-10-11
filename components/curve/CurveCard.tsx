"use client"

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, Activity, Lock, Rocket, Sparkles } from 'lucide-react'
import type { Curve, CurveStats } from '@/types/curve'
import { formatPrice, formatLargeNumber } from '@/lib/curve/bonding-math'

interface CurveCardProps {
  curve: Curve
  stats?: CurveStats
  variant?: 'default' | 'compact'
  onClick?: () => void
}

export const CurveCard = ({
  curve,
  stats,
  variant = 'default',
  onClick
}: CurveCardProps) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'active':
        return 'border-purple-500/30 bg-purple-500/5'
      case 'frozen':
        return 'border-amber-500/30 bg-amber-500/5'
      case 'launched':
        return 'border-green-500/30 bg-green-500/5'
      case 'utility':
        return 'border-blue-500/30 bg-blue-500/5'
      default:
        return 'border-zinc-800 bg-zinc-900/50'
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'active':
        return <Activity className="w-4 h-4 text-purple-400" />
      case 'frozen':
        return <Lock className="w-4 h-4 text-amber-400" />
      case 'launched':
        return <Rocket className="w-4 h-4 text-green-400" />
      case 'utility':
        return <Sparkles className="w-4 h-4 text-blue-400" />
      default:
        return null
    }
  }

  const getStateBadgeColor = (state: string) => {
    switch (state) {
      case 'active':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'frozen':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'launched':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'utility':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700'
    }
  }

  const priceChange = stats?.priceChange24h || 0
  const isPositive = priceChange >= 0

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`cursor-pointer rounded-xl border p-4 transition-all ${getStateColor(curve.state)}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStateIcon(curve.state)}
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStateBadgeColor(curve.state)}`}>
              {curve.state.toUpperCase()}
            </span>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-white">
              {formatPrice(curve.price)}
            </p>
            {stats && (
              <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(priceChange).toFixed(2)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-zinc-500">Holders</p>
            <p className="text-sm font-bold text-white">{curve.holders}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Volume 24h</p>
            <p className="text-sm font-bold text-white">${formatLargeNumber(curve.volume24h)}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border overflow-hidden transition-all ${getStateColor(curve.state)}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStateIcon(curve.state)}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">
                  {curve.ownerType === 'user' ? 'Creator Key' : 'Project Key'}
                </h3>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${getStateBadgeColor(curve.state)}`}>
                  {curve.state.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-zinc-400">{curve.ownerId}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-white">
              {formatPrice(curve.price)}
            </p>
            {stats && (
              <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(priceChange).toFixed(2)}%</span>
                <span className="text-zinc-500">24h</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-zinc-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-zinc-500">Holders</p>
            </div>
            <p className="text-2xl font-bold text-white">{curve.holders}</p>
            {stats?.holdersChange24h !== undefined && (
              <p className={`text-xs ${stats.holdersChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.holdersChange24h >= 0 ? '+' : ''}{stats.holdersChange24h}
              </p>
            )}
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-orange-400" />
              <p className="text-xs text-zinc-500">Volume 24h</p>
            </div>
            <p className="text-2xl font-bold text-white">${formatLargeNumber(curve.volume24h)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Market Cap</p>
            <p className="text-lg font-bold text-white">${formatLargeNumber(curve.marketCap)}</p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-1">Reserve</p>
            <p className="text-lg font-bold text-white">${formatLargeNumber(curve.reserve)}</p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-1">Supply</p>
            <p className="text-lg font-bold text-white">{(curve.supply || 0).toFixed(2)}</p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-1">Total Volume</p>
            <p className="text-lg font-bold text-white">${formatLargeNumber(curve.volumeTotal)}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      {curve.state === 'launched' && curve.tokenMint && (
        <div className="px-6 py-3 bg-green-500/10 border-t border-green-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Token Address</span>
            <span className="text-xs font-mono text-green-400">
              {curve.tokenMint.slice(0, 8)}...{curve.tokenMint.slice(-6)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}