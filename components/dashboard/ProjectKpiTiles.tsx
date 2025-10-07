'use client'

import { KpiTile } from './KpiTile'
import { Coins, TrendingUp, Users, Award, Wallet, Activity } from 'lucide-react'
import type { Launch } from '@/lib/appwrite/services/launches'

interface ProjectKpiTilesProps {
  project: Launch
}

export function ProjectKpiTiles({ project }: ProjectKpiTilesProps) {
  // Format currency
  const formatUSDC = (amount?: number) => {
    const value = amount || 0
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`
    }
    return `$${value.toFixed(2)}`
  }

  // Format number with K/M suffix
  const formatNumber = (num?: number) => {
    const value = num || 0
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`
    }
    return value.toString()
  }

  // Format percentage change
  const formatPriceChange = (change?: number) => {
    const value = change || 0
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Market Cap */}
      <KpiTile
        icon={Coins}
        label="Market Cap"
        value={formatUSDC(project.marketCap)}
        tooltip="Current market capitalization of the token"
      />

      {/* 24h Volume */}
      <KpiTile
        icon={Activity}
        label="24h Volume"
        value={formatUSDC(project.volume24h)}
        tooltip="Trading volume in the last 24 hours"
      />

      {/* Price Change */}
      <KpiTile
        icon={TrendingUp}
        label="24h Change"
        value={formatPriceChange(project.priceChange24h)}
        tooltip="Price change in the last 24 hours"
      />

      {/* Holders */}
      <KpiTile
        icon={Users}
        label="Holders"
        value={formatNumber(project.holders)}
        tooltip="Number of unique token holders"
      />

      {/* Conviction */}
      <KpiTile
        icon={Award}
        label="Conviction"
        value={`${project.convictionPct || 0}%`}
        progressPct={project.convictionPct || 0}
        tooltip="Community conviction score"
      />

      {/* Contributors */}
      <KpiTile
        icon={Wallet}
        label="Contributors"
        value={project.contributors?.length.toString() || '0'}
        tooltip="Active contributors to the project"
      />
    </div>
  )
}