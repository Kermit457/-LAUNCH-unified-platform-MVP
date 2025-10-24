"use client"

import { Gift, Flame, Video, Users, Repeat, TrendingUp } from 'lucide-react'
import { IconCash } from '@/lib/icons'
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
            icon={IconCash}
            valueClassName="text-[#D1FD0A] font-led-dot"
          />
        </div>

        {/* Trading Volume - Liquidity Measure */}
        {tradingVolume !== undefined && (
          <div className="snap-center shrink-0 w-[160px] md:w-auto">
            <StatCard
              label="Trading Volume"
              value={formatCurrency(tradingVolume)}
              icon={Repeat}
              valueClassName="text-[#D1FD0A] font-led-dot"
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
              valueClassName="text-[#D1FD0A] font-led-dot"
            />
          </div>
        )}

        {/* 24h Motion - Core Activity Index */}
        <div className="snap-center shrink-0 w-[160px] md:w-auto">
          <StatCard
            label="24h Motion"
            value={metrics.motion24h}
            icon={TrendingUp}
            valueClassName="text-[#D1FD0A] font-led-dot"
          />
        </div>

        {/* Live Projects - Growth Pulse */}
        <div className="snap-center shrink-0 w-[160px] md:w-auto">
          <StatCard
            label="Live Projects"
            value={metrics.liveProjects}
            icon={Flame}
            valueClassName="text-[#D1FD0A] font-led-dot"
          />
        </div>
      </div>
    </section>
  )
}
