"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import {
  IconUpvote,
  IconMessage,
  IconNetwork,
  IconUsdc,
  IconCap,
  IconLightning,
  IconRocket,
  IconFreeze,
  IconComputer,
  IconMotion5,
  IconCash,
  IconMotionScoreBadge,
} from '@/lib/icons'
import { BuySellModal } from './launch/BuySellModal'

// Helper to format numbers consistently
const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return new Intl.NumberFormat('en-US').format(num)
}

// Compact color schemes
const colorSchemes = {
  icm: {
    name: 'Project',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    badgeIcon: IconCash,
  },
  ccm: {
    name: 'Creator',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    badgeIcon: IconComputer,
  },
  meme: {
    name: 'Meme',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    badgeIcon: IconRocket,
  }
} as const

export type CurveType = keyof typeof colorSchemes

export type UnifiedCardData = {
  id: string
  type: CurveType
  title: string
  logoUrl?: string
  ticker?: string
  status: 'live' | 'active' | 'ended' | 'frozen' | 'launched'
  beliefScore: number // 0-100
  upvotes: number
  commentsCount: number
  holders?: number
  keysSupply?: number
  myKeys?: number
  mySharePct?: number
  currentPrice?: number
  hasVoted?: boolean
  isVoting?: boolean
  onVote?: () => Promise<void>
  onComment?: () => void
  onBuyKeys?: () => void
}

/**
 * UnifiedCardCompact - Redesigned for 2-column layout
 * Features:
 * - Compact padding (p-4)
 * - Smaller text sizes
 * - Essential info only
 * - Clean scannable layout
 * - LED font for numbers
 * - Lime green accents
 */
export function UnifiedCardCompact({ data }: { data: UnifiedCardData }) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'buy' | 'sell' | 'manage'>('buy')

  const scheme = colorSchemes[data.type]
  const BadgeIcon = scheme.badgeIcon

  const hasPos = (data.myKeys ?? 0) > 0
  const shareDisplay = data.mySharePct && data.mySharePct > 0 ? data.mySharePct.toFixed(1) : '0.0'

  // Status badge setup
  const statusConfig = {
    live: { color: 'badge-success', icon: IconRocket, text: 'LIVE' },
    active: { color: 'badge-primary', icon: IconMotion5, text: 'ACTIVE' },
    frozen: { color: 'badge-warning', icon: IconFreeze, text: 'FROZEN' },
    ended: { color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', icon: IconComputer, text: 'ENDED' },
    launched: { color: 'badge-success', icon: IconRocket, text: 'LAUNCHED' }
  }

  const statusInfo = statusConfig[data.status || 'live']
  const StatusIcon = statusInfo.icon

  const handleVote = async () => {
    if (data.onVote && !data.isVoting) {
      try {
        await data.onVote()
      } catch (error) {
        console.error('Vote failed:', error)
      }
    }
  }

  const handleBuyOrManage = () => {
    if (data.onBuyKeys) {
      data.onBuyKeys()
      return
    }
    setModalMode('buy')
    setModalOpen(true)
  }

  const handleBuy = async (amount: number) => {
    console.log('Buy', amount, 'keys for', data.id)
  }

  const handleSell = async (amount: number) => {
    console.log('Sell', amount, 'keys for', data.id)
  }

  return (
    <div className="glass-premium p-4 rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all border-2 border-primary/50 hover:border-primary group">

      {/* Header: Avatar + Title + Ticker + Status */}
      <div className="flex items-start gap-2 mb-3">
        {/* Avatar with Motion Score Badge */}
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              'w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden transition-all border-2',
              hasPos ? 'border-primary shadow-md shadow-primary/30' : 'border-zinc-800'
            )}
          >
            {data.logoUrl ? (
              <img src={data.logoUrl} alt={data.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary text-sm font-bold">{data.title.slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          {/* Motion Score Badge Overlay */}
          <IconMotionScoreBadge
            score={data.beliefScore}
            size={20}
            className="absolute -bottom-1 -right-1"
          />
        </div>

        {/* Title + Badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-base font-bold text-white tracking-tight truncate">{data.title}</h3>
            {data.ticker && (
              <span className="text-xs text-zinc-500 font-mono">${data.ticker}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Status Badge */}
            <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1', statusInfo.color)}>
              <StatusIcon className="w-2.5 h-2.5" />
              {statusInfo.text}
            </span>

            {/* Type Badge */}
            <span className={cn('px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1', scheme.badgeColor)}>
              <BadgeIcon className="w-2.5 h-2.5" />
              {scheme.name}
            </span>
          </div>
        </div>
      </div>

      {/* Belief Score Bar - Compact Horizontal */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-zinc-400 font-semibold">Belief Score</span>
          <span className="font-led-dot text-sm text-primary">{Math.round(data.beliefScore)}</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50 relative">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, data.beliefScore))}%` }}
          />
        </div>
      </div>

      {/* Key Stats Row - Icons + Numbers Only */}
      <div className="flex items-center gap-2 mb-3">
        {/* Upvotes */}
        <button
          onClick={handleVote}
          disabled={data.isVoting}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded text-xs transition-all border',
            data.hasVoted
              ? 'bg-primary/20 border-primary text-primary'
              : 'glass-interactive border-primary/50 hover:border-primary text-zinc-400 hover:text-primary',
            data.isVoting && 'opacity-50 cursor-not-allowed'
          )}
        >
          <IconUpvote className="w-3 h-3" />
          <span className="font-led-dot text-xs">{formatNumber(data.upvotes)}</span>
        </button>

        {/* Comments */}
        <button
          onClick={data.onComment}
          className="flex items-center gap-1 px-2 py-1 rounded glass-interactive text-xs transition-all border border-primary/50 hover:border-primary"
        >
          <IconMessage className="w-3 h-3 text-zinc-400" />
          <span className="font-led-dot text-xs text-primary">{formatNumber(data.commentsCount || 0)}</span>
        </button>

        {/* Holders */}
        {data.holders !== undefined && (
          <div className="flex items-center gap-1 px-2 py-1 rounded glass-interactive text-xs border border-primary/30">
            <IconNetwork className="w-3 h-3 text-zinc-400" />
            <span className="font-led-dot text-xs text-primary">{formatNumber(data.holders)}</span>
          </div>
        )}
      </div>

      {/* Price & Supply - 2 Columns Compact */}
      {(data.currentPrice || data.keysSupply) && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {data.currentPrice && (
            <div className="glass-interactive p-2 rounded-lg border border-primary/50 hover:border-primary transition-all">
              <div className="flex items-center gap-1 mb-0.5">
                <IconUsdc className="w-3 h-3 text-zinc-400" />
                <span className="text-[9px] text-zinc-400 uppercase tracking-wide">Price</span>
              </div>
              <div className="font-led-dot text-sm text-primary">${data.currentPrice.toFixed(3)}</div>
            </div>
          )}

          {data.keysSupply && (
            <div className="glass-interactive p-2 rounded-lg border border-primary/50 hover:border-primary transition-all">
              <div className="flex items-center gap-1 mb-0.5">
                <IconCap className="w-3 h-3 text-zinc-400" />
                <span className="text-[9px] text-zinc-400 uppercase tracking-wide">Supply</span>
              </div>
              <div className="font-led-dot text-sm text-primary">{formatNumber(data.keysSupply)}</div>
            </div>
          )}
        </div>
      )}

      {/* My Position - Only if > 0 */}
      {hasPos && (
        <div className="mb-3 p-2 rounded-lg bg-primary/10 border border-primary/50">
          <div className="text-[9px] text-zinc-400 uppercase tracking-wide mb-1">My Position</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-300">Keys:</span>
              <span className="font-led-dot text-sm text-primary">{formatNumber(data.myKeys!)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-300">Share:</span>
              <span className="font-led-dot text-sm text-primary">{shareDisplay}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons Row - Small & Compact */}
      <div className="flex items-center gap-2">
        {/* Vote Button */}
        <button
          onClick={handleVote}
          disabled={data.isVoting}
          className={cn(
            'px-3 py-2 rounded-lg text-xs font-semibold transition-all border flex-1',
            data.hasVoted
              ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30'
              : 'glass-interactive border-primary/50 hover:border-primary text-zinc-300 hover:text-primary',
            data.isVoting && 'opacity-50 cursor-not-allowed'
          )}
        >
          Vote
        </button>

        {/* Comment Button */}
        <button
          onClick={data.onComment}
          className="px-3 py-2 rounded-lg text-xs font-semibold glass-interactive transition-all border border-primary/50 hover:border-primary flex-1"
        >
          Comment
        </button>

        {/* Buy Keys Button - Primary CTA */}
        <button
          onClick={handleBuyOrManage}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black font-bold text-xs transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex-1"
        >
          <IconLightning className="w-3.5 h-3.5" />
          Buy Keys
        </button>
      </div>

      {/* Buy/Sell/Manage Modal */}
      {data.currentPrice && (
        <BuySellModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={modalMode}
          data={{
            title: data.title,
            logoUrl: data.logoUrl,
            currentPrice: data.currentPrice,
            myKeys: data.myKeys || 0,
            mySharePct: data.mySharePct || 0,
            totalSupply: 1000,
            priceChange24h: 0,
            estLaunchTokens: null,
          }}
          onBuy={handleBuy}
          onSell={handleSell}
        />
      )}
    </div>
  )
}
