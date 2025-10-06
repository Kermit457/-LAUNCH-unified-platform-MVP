"use client"

import { TrendingUp, Users, DollarSign, Droplet } from 'lucide-react'
import { fmtUsd, fmtPct, fmtNum } from '@/lib/format'

interface TokenStats {
  priceUsd?: number
  change24h?: number
  vol24hUsd?: number
  holders?: number
  mcapUsd?: number
  liqUsd?: number
}

interface TokenStatsCompactProps {
  stats: TokenStats
  loading?: boolean
  className?: string
}

export function TokenStatsCompact({ stats, loading, className = '' }: TokenStatsCompactProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-2 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
            <div className="h-3 w-12 bg-white/10 rounded animate-pulse mb-2" />
            <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-2 ${className}`}>
      {/* 24H Change */}
      {stats.change24h !== undefined && (
        <div className={`rounded-xl p-3 border
          ${stats.change24h >= 0
            ? 'bg-emerald-500/10 border-emerald-600/30'
            : 'bg-red-500/10 border-red-600/30'
          }`}
        >
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs">{stats.change24h >= 0 ? '▲' : '▼'}</span>
            <span className={`text-[10px] uppercase font-semibold tracking-wide
              ${stats.change24h >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
              24H
            </span>
          </div>
          <div className={`text-lg font-bold
            ${stats.change24h >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            {fmtPct(stats.change24h)}
          </div>
        </div>
      )}

      {/* 24H Volume */}
      {stats.vol24hUsd !== undefined && (
        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-white/50 uppercase font-semibold tracking-wide">VOL</span>
          </div>
          <div className="text-lg font-bold text-white">{fmtUsd(stats.vol24hUsd)}</div>
        </div>
      )}

      {/* Holders */}
      {stats.holders !== undefined && (
        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-1 mb-1">
            <Users className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] text-white/50 uppercase font-semibold tracking-wide">HOLDERS</span>
          </div>
          <div className="text-lg font-bold text-white">{fmtNum(stats.holders)}</div>
        </div>
      )}

      {/* Market Cap */}
      {stats.mcapUsd !== undefined && (
        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-white/50 uppercase font-semibold tracking-wide">MCAP</span>
          </div>
          <div className="text-lg font-bold text-white">{fmtUsd(stats.mcapUsd)}</div>
        </div>
      )}
    </div>
  )
}
