"use client"

import { useState } from 'react'
import { Copy, ExternalLink, TrendingUp, Eye, Heart, Check, Users, DollarSign, BarChart3 } from 'lucide-react'
import { BaseLaunchCard } from './BaseLaunchCard'
import { PriceSpark } from './PriceSpark'
import { LaunchCardData } from '@/types/launch'
import { useTokenData } from '@/lib/tokenData'
import { fmtUsd, fmtPct, fmtNum, isNewToken } from '@/lib/format'
import { cn } from '@/lib/cn'

interface LiveLaunchCardProps {
  data: LaunchCardData
  onUpvote?: (id: string) => void
  onComment?: (id: string) => void
  onBoost?: (id: string) => void
  onFollow?: (id: string) => void
  onView?: (id: string) => void
}

export function LiveLaunchCard({
  data,
  onUpvote,
  onComment,
  onBoost,
  onFollow,
  onView,
}: LiveLaunchCardProps) {
  const [copied, setCopied] = useState(false)
  const { data: tokenData, loading, error } = useTokenData(data.mint, 15000)

  const handleCopy = async () => {
    if (!data.mint) return
    await navigator.clipboard.writeText(data.mint)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasTokenData = tokenData.priceUsd !== undefined

  const showNewBadge = isNewToken(tokenData.createdAt)

  return (
    <BaseLaunchCard data={data} onUpvote={onUpvote} onComment={onComment}>
      {/* Token Row (only for ICM with mint) */}
      {data.scope === 'ICM' && data.mint && (
        <div className="mb-3 pb-3 border-b border-white/10">
          <div className="flex flex-col gap-2">
            {/* Token Address - Full Display */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 flex-shrink-0">Token:</span>
              <code className="text-[10px] sm:text-xs text-white/80 font-mono flex-1 min-w-0 truncate select-all">
                {data.mint}
              </code>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Copy */}
              <button
                onClick={handleCopy}
                className="h-6 px-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-[10px] transition-all flex items-center gap-1"
                aria-label="Copy mint address"
                data-cta="card-copy-address"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Solscan */}
              {tokenData.solscanUrl && (
                <a
                  href={tokenData.solscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-6 px-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-[10px] transition-all flex items-center gap-1"
                  aria-label="View on Solscan"
                  data-cta="card-view-solscan"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden sm:inline">Scan</span>
                </a>
              )}

              {/* Chart */}
              {tokenData.dexUrl && (
                <a
                  href={tokenData.dexUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-6 px-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-[10px] transition-all flex items-center gap-1"
                  aria-label="View Chart"
                  data-cta="card-view-chart"
                >
                  <BarChart3 className="w-3 h-3" />
                  <span className="hidden sm:inline">Chart</span>
                </a>
              )}

              {/* New Badge */}
              {showNewBadge && (
                <span className="ml-auto px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                  🆕 New
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Token KPIs - Simplified Grid (only if we have price data) */}
      {data.scope === 'ICM' && data.mint && hasTokenData && !loading && (
        <div className="mb-3">
          <div className="grid grid-cols-3 gap-2">
            {/* Price */}
            {tokenData.priceUsd !== undefined && (
              <div className="bg-white/[0.02] rounded-lg p-2 border border-white/5">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span className="text-[10px] text-white/50 uppercase font-semibold">Price</span>
                </div>
                <div className="text-sm font-bold text-white mb-0.5">{fmtUsd(tokenData.priceUsd)}</div>
                {tokenData.change24h !== undefined && (
                  <div
                    className={cn(
                      'text-[10px] font-bold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded',
                      tokenData.change24h >= 0
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    )}
                  >
                    {tokenData.change24h >= 0 ? '↗' : '↘'}
                    {fmtPct(tokenData.change24h)}
                  </div>
                )}
                {tokenData.spark && <PriceSpark data={tokenData.spark} className="mt-1" />}
              </div>
            )}

            {/* 24h Volume */}
            {tokenData.vol24hUsd !== undefined && (
              <div className="bg-white/[0.02] rounded-lg p-2 border border-white/5">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-purple-400" />
                  <span className="text-[10px] text-white/50 uppercase font-semibold">24h Vol</span>
                </div>
                <div className="text-sm font-bold text-white">{fmtUsd(tokenData.vol24hUsd)}</div>
              </div>
            )}

            {/* Holders */}
            {tokenData.holders !== undefined && (
              <div className="bg-white/[0.02] rounded-lg p-2 border border-white/5">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] text-white/50 uppercase font-semibold">Holders</span>
                </div>
                <div className="text-sm font-bold text-white">{fmtNum(tokenData.holders)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading Skeleton - 3 KPIs */}
      {data.scope === 'ICM' && data.mint && loading && (
        <div className="mb-3">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/[0.02] rounded-lg p-2 border border-white/5">
                <div className="h-3 w-12 bg-white/10 rounded animate-pulse mb-2" />
                <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {data.scope === 'ICM' && data.mint && error && !loading && (
        <div className="mb-3 text-xs text-white/40 italic">No on-chain data yet.</div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Boost */}
        <button
          onClick={() => onBoost?.(data.id)}
          className="flex-1 min-w-[100px] h-9 px-3 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 text-white text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 flex items-center justify-center gap-1.5"
          data-cta="card-boost-launch"
        >
          <TrendingUp className="w-4 h-4" />
          Boost
        </button>

        {/* Follow */}
        <button
          onClick={() => onFollow?.(data.id)}
          className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center gap-1.5"
          data-cta="card-follow-launch"
        >
          <Heart className="w-4 h-4" />
          <span className="hidden sm:inline">Follow</span>
        </button>

        {/* View Launch */}
        <button
          onClick={() => onView?.(data.id)}
          className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center gap-1.5"
          data-cta="card-view-launch"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">View</span>
        </button>
      </div>
    </BaseLaunchCard>
  )
}
