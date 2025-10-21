"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import {
  ArrowUp,
  MessageSquare,
  Eye,
  Bell,
  Share2,
  Users,
  Twitter,
  TrendingUp,
  Sparkles,
  Coins,
  Video,
  Flame
} from 'lucide-react'
import { BuySellModal } from './launch/BuySellModal'

// Helper to format numbers consistently
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Color schemes for each type - ICM Motion Color Palette
const colorSchemes = {
  icm: {
    name: 'Project',
    emoji: '💼',
    icon: Coins,
    badge: 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30',
    border: 'border-[#00FF88]/60',
    gradient: 'bg-[#00FF88]', // Green (Success, positive actions)
    glow: 'shadow-[#00FF88]/50',
    ring: 'text-[#00FF88]',
    buttonHover: 'hover:bg-[#00FF88]/90 hover:scale-105'
  },
  ccm: {
    name: 'Creator',
    emoji: '🎥',
    icon: Video,
    badge: 'bg-[#00FFFF]/20 text-[#00FFFF] border-[#00FFFF]/30',
    border: 'border-[#00FFFF]/60',
    gradient: 'bg-[#00FFFF]', // Cyan (Primary brand, highlights)
    glow: 'shadow-[#00FFFF]/50',
    ring: 'text-[#00FFFF]',
    buttonHover: 'hover:bg-[#00FFFF]/90 hover:scale-105'
  },
  meme: {
    name: 'Meme',
    emoji: '🔥',
    icon: Flame,
    badge: 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30',
    border: 'border-[#FFD700]/60',
    gradient: 'bg-[#FFD700]', // Yellow (Attention, warnings, energy)
    glow: 'shadow-[#FFD700]/50',
    ring: 'text-[#FFD700]',
    buttonHover: 'hover:bg-[#FFD700]/90 hover:scale-105'
  }
} as const

export type CurveType = keyof typeof colorSchemes

// Data contract for unified card
export type UnifiedCardData = {
  id: string
  type: CurveType // ICM, CCM, or MEME
  title: string
  subtitle?: string
  logoUrl?: string
  ticker?: string
  status: 'live' | 'upcoming' | 'ended' | 'active' | 'frozen' | 'launched'
  beliefScore: number // 0-100 conviction
  upvotes: number
  commentsCount: number

  // Stats
  viewCount?: number
  holders?: number
  keysSupply?: number
  priceChange24h?: number

  // Team/Contributors
  contributors?: Array<{
    name: string
    avatar: string
  }>

  // Portfolio data for current user
  myKeys?: number
  mySharePct?: number
  estLaunchTokens?: number | null
  currentPrice?: number

  // Airdrop/Merkle claim
  airdropAmount?: number
  hasClaimedAirdrop?: boolean

  // Socials
  twitterUrl?: string

  // Creator info
  creatorId?: string

  // State handlers
  hasVoted?: boolean
  isVoting?: boolean
  onVote?: () => Promise<void>
  onComment?: () => void
  onCollaborate?: () => void
  onDetails?: () => void
  onBuyKeys?: () => void
  onClaimAirdrop?: () => Promise<void>

  // Notification & sharing
  notificationEnabled?: boolean
  onNotificationToggle?: () => void
  onShare?: () => void
  onTwitterClick?: () => void
}

/**
 * UnifiedCard - Single card component for ICM, CCM, and MEME
 * Color-coded: Green (ICM), Purple (CCM), Orange (MEME)
 */
export function UnifiedCard({ data }: { data: UnifiedCardData }) {
  const router = useRouter()
  const [showTooltip, setShowTooltip] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'buy' | 'sell' | 'manage'>('buy')

  const scheme = colorSchemes[data.type]
  const IconComponent = scheme.icon

  const hasPos = (data.myKeys ?? 0) > 0
  const shareDisplay = data.mySharePct && data.mySharePct > 0 ? data.mySharePct.toFixed(1) : '0.0'
  const hasUnclaimedAirdrop = data.airdropAmount && data.airdropAmount > 0 && !data.hasClaimedAirdrop

  // SVG circle for ownership ring
  const R = 28
  const C = 2 * Math.PI * R
  const pct = Math.max(0, Math.min(75, data.mySharePct ?? 0))
  const dash = C * (pct / 100)

  // Status badge color
  const statusColors = {
    live: 'bg-green-500/20 text-green-400 border-green-500/30',
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    upcoming: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    frozen: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    ended: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    launched: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  }

  const statusLabel = data.status?.toUpperCase() || 'LIVE'
  const statusColor = statusColors[data.status || 'live']

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
    // If onBuyKeys callback provided, use that (page-level modal)
    if (data.onBuyKeys) {
      data.onBuyKeys()
      return
    }
    // Otherwise use internal modal
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
    <div className="relative rounded-2xl bg-[rgba(255,255,255,0.06)] backdrop-blur-[8px] ring-1 ring-[rgba(255,255,255,0.10)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.35)] p-4 hover:ring-[rgba(255,255,255,0.15)] transition-all group">

      {/* Token Claim Banner */}
      {hasUnclaimedAirdrop && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-purple-500/20 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-fuchsia-400 animate-pulse" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute inset-0 animate-ping opacity-75" />
              </div>
              <div>
                <div className="text-sm font-bold text-purple-200">Tokens Ready to Claim!</div>
                <div className="text-xs text-purple-300/90">
                  {data.airdropAmount ? formatNumber(data.airdropAmount) : '0'} tokens available
                </div>
              </div>
            </div>
            <button
              onClick={data.onClaimAirdrop}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 hover:from-purple-400 hover:via-fuchsia-400 hover:to-purple-400 text-white font-bold text-sm transition-all whitespace-nowrap"
            >
              Claim Tokens
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {/* Left Column: Voting + Actions */}
        <div className="flex flex-col items-center gap-2">
          {/* Upvote */}
          <button
            onClick={handleVote}
            disabled={data.isVoting}
            className={cn(
              'flex flex-col items-center justify-center w-14 h-14 rounded-xl font-bold text-lg transition-all relative',
              data.hasVoted
                ? `${scheme.gradient} text-black`
                : 'bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 text-zinc-300 hover:text-white hover:scale-105',
              data.isVoting && 'opacity-50 cursor-not-allowed'
            )}
            aria-label="Upvote"
          >
            <ArrowUp className="w-5 h-5 mb-0.5" strokeWidth={2.5} />
            <span className="text-sm font-bold">{data.upvotes}</span>
          </button>

          {/* Comments */}
          <button
            onClick={data.onComment}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 transition-all"
            aria-label="Comments"
          >
            <MessageSquare className="w-4 h-4 mb-0.5 text-zinc-400" />
            <span className="text-xs text-zinc-400 font-medium">{data.commentsCount || 0}</span>
          </button>

          {/* Twitter */}
          {data.twitterUrl && (
            <a
              href={data.twitterUrl}
              target="_blank"
              rel="noreferrer"
              onClick={data.onTwitterClick}
              className="flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-800/80 hover:bg-sky-500/20 border border-zinc-700/50 hover:border-sky-500/40 transition-all group/twitter"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-zinc-400 group-hover/twitter:text-sky-400 transition-colors" />
            </a>
          )}
        </div>

        {/* Right: Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start gap-3 mb-3">
            {/* Avatar with Ownership Ring + Type-Colored Border */}
            <div className="relative flex-shrink-0">
              <div
                className="relative w-16 h-16 cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={hasPos ? `Your share: ${shareDisplay}%` : 'No ownership yet'}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
              >
                {/* SVG Ring - Ownership Progress */}
                <svg
                  className="absolute inset-0 pointer-events-none"
                  viewBox="0 0 68 68"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  {/* Track */}
                  <circle
                    cx="34"
                    cy="34"
                    r={R}
                    className={cn('transition-all', hasPos ? 'text-zinc-700' : 'text-zinc-800')}
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                  />
                  {/* Progress - Type-colored ring */}
                  {hasPos && (
                    <circle
                      cx="34"
                      cy="34"
                      r={R}
                      className={cn('transition-all duration-300', scheme.ring)}
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      strokeDasharray={`${dash} ${C}`}
                      strokeLinecap="round"
                    />
                  )}
                </svg>

                {/* Avatar Image with TYPE-COLORED BORDER */}
                <div
                  className={cn(
                    'relative z-10 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden transition-all',
                    hasPos
                      ? `border-[3px] ${scheme.border}`
                      : 'border-2 border-zinc-800'
                  )}
                >
                  {data.logoUrl ? (
                    <img src={data.logoUrl} alt={data.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xl font-bold">{data.title.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                {/* Tooltip on Hover */}
                {showTooltip && (
                  <div
                    role="tooltip"
                    className="absolute left-20 top-0 z-30 rounded-lg bg-black/95 border border-green-500/30 px-3 py-2 text-xs whitespace-nowrap backdrop-blur shadow-xl"
                  >
                    <div className="font-bold text-green-400 mb-1">Your Position</div>
                    <div className="text-white">
                      {hasPos ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-400">Share:</span>
                            <span className="font-bold">{shareDisplay}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-400">Keys:</span>
                            <span className="font-bold">{formatNumber(data.myKeys!)}</span>
                          </div>
                          {data.estLaunchTokens != null && (
                            <div className="flex items-center gap-2 mt-1 pt-1 border-t border-zinc-700">
                              <span className="text-zinc-400">Est. tokens:</span>
                              <span className="font-bold text-green-400">{formatNumber(data.estLaunchTokens)}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-zinc-400">Buy keys to gain ownership</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title + Badges */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-lg font-bold text-white">{data.title}</h3>
                <span className={cn('px-2 py-0.5 rounded border text-[10px] font-bold uppercase', statusColor)}>
                  {statusLabel}
                </span>
                <span className={cn('px-2 py-0.5 rounded border text-[10px] font-bold uppercase flex items-center gap-1', scheme.badge)}>
                  <IconComponent className="w-3 h-3" />
                  {scheme.name}
                </span>
              </div>
              {data.subtitle && <p className="text-sm text-zinc-400 line-clamp-1">{data.subtitle}</p>}
            </div>

            {/* Action Icons + Contributors + Ownership Pill */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {/* Contributors */}
                {data.contributors && data.contributors.length > 0 && (
                  <div className="flex items-center -space-x-2 mr-2">
                    {data.contributors.slice(0, 3).map((contributor, idx) => (
                      <div
                        key={idx}
                        className="relative w-7 h-7 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-purple-500 to-blue-600 overflow-hidden hover:z-10 transition-transform hover:scale-110"
                        title={contributor.name}
                      >
                        {contributor.avatar ? (
                          <img
                            src={contributor.avatar}
                            alt={contributor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                            {contributor.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    ))}
                    {data.contributors.length > 3 && (
                      <div className="w-7 h-7 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-zinc-400 text-[10px] font-bold">
                        +{data.contributors.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={data.onNotificationToggle}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    data.notificationEnabled
                      ? `${scheme.badge} hover:opacity-80`
                      : "bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600"
                  )}
                  aria-label={data.notificationEnabled ? "Unsubscribe" : "Subscribe"}
                >
                  <Bell
                    className={cn(
                      "w-4 h-4 transition-colors",
                      data.notificationEnabled ? scheme.badge.includes('green') ? 'text-green-400 fill-green-400' : scheme.badge.includes('purple') ? 'text-purple-400 fill-purple-400' : 'text-orange-400 fill-orange-400' : "text-zinc-400"
                    )}
                  />
                </button>
                <button
                  onClick={data.onShare}
                  className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 transition-all"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* Ownership Pill */}
              {hasPos && (
                <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2", scheme.border, scheme.badge)}>
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", scheme.badge.split(' ')[1])} />
                  <span className={cn("text-xs font-bold", scheme.badge.split(' ')[1])}>Holding {formatNumber(data.myKeys!)}</span>
                  <span className="text-[10px] font-semibold opacity-70">({shareDisplay}%)</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-3 mb-3 text-xs">
            {data.viewCount !== undefined && (
              <div className="flex items-center gap-1 text-zinc-400">
                <Eye className="w-3.5 h-3.5" />
                <span>{formatNumber(data.viewCount)}</span>
              </div>
            )}

            {/* 24h Price Change */}
            {data.priceChange24h !== undefined && data.priceChange24h !== null && (
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded border font-semibold',
                  data.priceChange24h >= 0
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                    : 'bg-red-500/10 text-red-300 border-red-500/30'
                )}
              >
                <TrendingUp
                  className={cn('w-3.5 h-3.5', data.priceChange24h < 0 && 'rotate-180')}
                />
                <span>
                  {data.priceChange24h >= 0 ? '+' : ''}
                  {data.priceChange24h.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Conviction Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400">Community Confidence</span>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "font-bold text-sm",
                  data.beliefScore >= 70 ? "text-green-400" : data.beliefScore >= 50 ? "text-amber-400" : "text-zinc-400"
                )}>
                  {Math.round(data.beliefScore)}%
                </span>
              </div>
            </div>
            <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50 relative group cursor-help">
              <div
                className={cn(
                  "h-full transition-all duration-500 relative",
                  scheme.gradient
                )}
                style={{ width: `${Math.max(0, Math.min(100, data.beliefScore))}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Primary CTA - Type-colored */}
            <button
              onClick={handleBuyOrManage}
              data-cta={hasPos ? 'manage' : 'buy'}
              className={cn(
                'flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
                scheme.gradient,
                scheme.buttonHover,
                'text-black hover:scale-[1.02]'
              )}
            >
              <>
                Buy Keys
                {data.currentPrice && <span className="opacity-90 font-normal">@{data.currentPrice.toFixed(3)}</span>}
              </>
            </button>

            {/* Secondary Actions */}
            <button
              onClick={data.onCollaborate}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 text-zinc-300 text-sm font-medium transition-all"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Collaborate</span>
            </button>

            <button
              onClick={data.onDetails || (() => router.push(`/curve/${data.id}`))}
              className="px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 text-zinc-300 text-sm font-medium transition-all"
            >
              Details
            </button>
          </div>
        </div>
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
            priceChange24h: data.priceChange24h,
            estLaunchTokens: data.estLaunchTokens,
          }}
          onBuy={handleBuy}
          onSell={handleSell}
        />
      )}
    </div>
  )
}