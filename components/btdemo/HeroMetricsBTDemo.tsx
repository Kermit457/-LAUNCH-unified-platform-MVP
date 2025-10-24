'use client'

import { HeroMetricCard } from './HeroMetricCard'
import { Lock, TrendingUp, Rocket, DollarSign, Eye } from 'lucide-react'
import { IconSolana, IconUsdc } from '@/lib/icons'

interface HeroMetricsProps {
  vaultTVL?: number
  motion24h?: number
  liveProjects?: number
  tradingVolume?: number
  clipViews?: number
}

export function HeroMetricsBTDemo({
  vaultTVL = 0,
  motion24h = 0,
  liveProjects = 3,
  tradingVolume = 1800000,
  clipViews = 588600
}: HeroMetricsProps): JSX.Element {
  /**
   * Format large numbers to abbreviated form (e.g., 2M, 45M)
   */
  const formatLargeNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(0)}M`
    }
    if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(0)}K`
    }
    return `$${num.toFixed(0)}`
  }

  /**
   * Format views count (e.g., 589K)
   */
  const formatViews = (num: number): string => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(0)}M`
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(0)}K`
    }
    return num.toString()
  }

  /**
   * Format percentage with sign
   */
  const formatPercentage = (num: number): string => {
    const sign = num >= 0 ? '+' : ''
    return `${sign}${num.toFixed(0)}%`
  }

  return (
    <section className="container mx-auto px-4 py-4 md:py-6">
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="flex overflow-x-auto gap-3 md:gap-4 md:grid md:grid-cols-3 lg:grid-cols-5 snap-x snap-mandatory pb-2 -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <HeroMetricCard
          icon={Lock}
          label="Vault TVL"
          value={formatLargeNumber(vaultTVL)}
          index={0}
        />

        <HeroMetricCard
          icon={DollarSign}
          label="Trading Volume"
          value={formatLargeNumber(tradingVolume)}
          index={1}
        />

        <HeroMetricCard
          icon={Eye}
          label="Clip Views"
          value={formatViews(clipViews)}
          index={2}
        />

        <HeroMetricCard
          icon={TrendingUp}
          label="24h Motion"
          value={motion24h}
          index={3}
        />

        <HeroMetricCard
          icon={Rocket}
          label="Live Projects"
          value={liveProjects}
          index={4}
        />
      </div>
    </section>
  )
}
