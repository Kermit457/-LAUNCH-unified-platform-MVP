"use client"

import { DollarSign, Gift, TrendingUp, Flame, Video, Users, Repeat } from 'lucide-react'
import { StatCard } from '@/components/design-system/StatCard'
import { StatCardSkeleton } from '@/components/design-system/Skeleton'
import type { PlatformMetrics } from '@/lib/appwrite/services/metrics'
import { cn } from '@/lib/utils'

interface HeroMetricsProps {
  metrics: PlatformMetrics | null
  isLoading?: boolean
  clipStats?: {
    totalViews: number
    totalClips: number
    totalCreators: number
  }
  tradingVolume?: number
  networkActivity?: number
}

export function HeroMetrics({ metrics, isLoading, clipStats, tradingVolume, networkActivity }: HeroMetricsProps) {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8" aria-label="Platform Statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <StatCardSkeleton />
      </section>
    )
  }

  if (!metrics) return null

  // Format large numbers
  const formatCurrency = (num: number) => {
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
    return `$${num.toFixed(0)}`
  }

  const formatViews = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <section className="container mx-auto px-4 py-4 md:py-6" aria-label="Platform Statistics">
      {/* Single Row: Core Metrics Only - Mobile Optimized Scroll */}
      <div
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollPaddingLeft: '16px'
        }}
      >
        {/* Vault TVL - Market Trust Anchor */}
        <div className="snap-center shrink-0 w-[160px] md:w-auto">
          <StatCard
            label="Vault TVL"
            value={formatCurrency(metrics.vaultTVL)}
            icon={DollarSign}
            valueClassName="text-gradient-main"
          />
        </div>

        {/* 24h Motion - Core Activity Index */}
        <div className="snap-center shrink-0 w-[160px] md:w-auto">
          <StatCard
            label="24h Motion"
            value={`${metrics.motion24h >= 0 ? '+' : ''}${metrics.motion24h.toFixed(1)}%`}
            icon={TrendingUp}
            trend={metrics.motion24h}
            valueClassName={metrics.motion24h >= 0 ? 'text-[#00FF88]' : 'text-red-400'}
          />
        </div>

        {/* Live Projects - Growth Pulse */}
        <div className="snap-center shrink-0 w-[160px] md:w-auto">
          <StatCard
            label="Live Projects"
            value={metrics.liveProjects}
            icon={Flame}
            valueClassName="text-yellow-400"
          />
        </div>

        {/* Trading Volume - Liquidity Measure */}
        {tradingVolume !== undefined && (
          <div className="snap-center shrink-0 w-[160px] md:w-auto">
            <StatCard
              label="Trading Volume"
              value={formatCurrency(tradingVolume)}
              icon={TrendingUp}
              valueClassName="text-[#00FF88]"
            />
          </div>
        )}

        {/* Clip Views - Social Attention Proxy */}
        {clipStats && (
          <div className="snap-center shrink-0 w-[160px] md:w-auto">
            <StatCard
              label="Clip Views"
              value={formatViews(clipStats.totalViews)}
              icon={Video}
              valueClassName="text-purple-400"
            />
          </div>
        )}
      </div>
    </section>
  )
}
