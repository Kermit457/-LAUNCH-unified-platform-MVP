'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Delta = {
  value: number
  dir: 'up' | 'down'
}

export type KpiTileProps = {
  icon: LucideIcon
  label: string
  value: string
  delta?: Delta
  tooltip?: string
  progressPct?: number
}

export function KpiTile({ icon: Icon, label, value, delta, tooltip, progressPct }: KpiTileProps) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-5 relative group">
      {/* Delta chip - top right */}
      {delta && (
        <div
          className={cn(
            'absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1',
            delta.dir === 'up' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
          )}
        >
          {delta.dir === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {delta.value}%
        </div>
      )}

      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-500/20 via-lime-500/20 to-cyan-500/20 flex items-center justify-center mb-3 border border-white/10">
        <Icon className="w-5 h-5 text-lime-400" />
      </div>

      {/* Label */}
      <div className="text-sm text-white/60 mb-1" title={tooltip}>
        {label}
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-white mb-2">{value}</div>

      {/* Progress bar for Conviction */}
      {progressPct !== undefined && (
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Loading skeleton
export function KpiTileSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-5 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-white/10 mb-3" />
      <div className="h-4 w-20 bg-white/10 rounded mb-2" />
      <div className="h-8 w-16 bg-white/10 rounded" />
    </div>
  )
}
