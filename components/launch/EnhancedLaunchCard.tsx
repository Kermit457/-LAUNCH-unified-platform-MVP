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
} from 'lucide-react'
import { BuySellModal } from './BuySellModal'

// Helper to format numbers consistently on client and server
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Data contract for launch card with ownership
export type LaunchCardData = {
  id: string
  title: string
  subtitle?: string
  logoUrl?: string
  ticker?: string
  status: 'live' | 'upcoming' | 'ended'
  marketType: 'ccm' | 'icm'
  beliefScore: number // 0-100 conviction
  upvotes: number
  commentsCount: number

  // Stats
  viewCount?: number
  holders?: number // Number of key holders from curve
  keysSupply?: number // Total keys in circulation from curve
  launchSupplyPct?: number // % of total supply distributed at launch (e.g., 20 for 20%)
  revenueSharePct?: number // % of fees shared with holders (only show if > 0)
  priceChange24h?: number // e.g., 15.3 for +15.3%, -8.2 for -8.2%

  // Team/Contributors
  contributors?: Array<{
    name: string
    avatar: string
  }>

  // Portfolio data for current user
  myKeys: number
  mySharePct: number
  estLaunchTokens?: number | null
  currentPrice?: number

  // Airdrop/Merkle claim
  airdropAmount?: number // Amount of tokens claimable
  hasClaimedAirdrop?: boolean // Whether user has claimed

  // Socials
  twitterUrl?: string

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
 * Enhanced LaunchCard with prominent ownership indicators
 * Optimized for clear user journey: See ownership → Understand value → Take action
 */
export function EnhancedLaunchCard({ data }: { data: LaunchCardData }) {
  const router = useRouter()
  const [showTooltip, setShowTooltip] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'buy' | 'sell' | 'manage'>('buy')

  const hasPos = (data.myKeys ?? 0) > 0
  const shareDisplay = data.mySharePct > 0 ? data.mySharePct.toFixed(1) : '0.0'
  const hasUnclaimedAirdrop = data.airdropAmount && data.airdropAmount > 0 && !data.hasClaimedAirdrop

  // SVG circle for ownership ring - larger and more prominent
  const R = 28
  const C = 2 * Math.PI * R
  const pct = Math.max(0, Math.min(75, data.mySharePct ?? 0))
  const dash = C * (pct / 100)

  const isCCM = data.marketType === 'ccm'
  const statusColor =
    data.status === 'live' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30'
  const statusLabel = data.status === 'live' ? 'LIVE' : data.status.toUpperCase()
  const marketLabel = isCCM ? 'CCM' : 'ICM'
  const marketColor = isCCM ? 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'

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
    console.log('🔥 Buy Keys button clicked!', {
      hasOnBuyKeys: !!data.onBuyKeys,
      launchId: data.id,
      title: data.title
    })

    // If external onBuyKeys handler is provided, use that (e.g., SimpleBuySellModal)
    if (data.onBuyKeys) {
      console.log('✅ Calling onBuyKeys handler')
      data.onBuyKeys()
      return
    }

    console.log('⚠️ No onBuyKeys handler, using internal modal')
    // Otherwise use internal modal (fallback for dev/testing)
    if (hasPos) {
      setModalMode('manage')
    } else {
      setModalMode('buy')
    }
    setModalOpen(true)
  }

  const handleBuy = async (amount: number) => {
    console.log('Buy', amount, 'keys for', data.id)
    // Implement actual buy logic here
  }

  const handleSell = async (amount: number) => {
    console.log('Sell', amount, 'keys for', data.id)
    // Implement actual sell logic here
  }

  return (
    <div className="relative rounded-2xl bg-[rgba(255,255,255,0.06)] backdrop-blur-[8px] ring-1 ring-[rgba(255,255,255,0.10)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.35)] p-4 hover:ring-[rgba(255,255,255,0.15)] transition-all group">

      {/* Token Claim Banner */}
      {hasUnclaimedAirdrop && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#D1FD0A]/20 to-[#B8E008]/20 border-2 border-[#D1FD0A]/50 shadow-lg shadow-[#D1FD0A]/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-[#D1FD0A] animate-pulse" />
                <Sparkles className="w-6 h-6 text-[#D1FD0A] absolute inset-0 animate-ping opacity-75" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#B8E008]">Tokens Ready to Claim!</div>
                <div className="text-xs text-[#B8E008]/90">
                  {data.airdropAmount ? formatNumber(data.airdropAmount) : '0'} tokens available
                </div>
              </div>
            </div>
            <button
              onClick={data.onClaimAirdrop}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] hover:from-[#B8E008] hover:to-[#A6CF00] text-white font-bold text-sm transition-all whitespace-nowrap"
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
                ? 'bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] text-white shadow-lg shadow-[#D1FD0A]/50'
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

          {/* Twitter - Social Integration */}
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
            {/* Avatar with Ownership Ring + Active Border */}
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
                  {/* Progress - Orange gradient for ownership % */}
                  {hasPos && (
                    <circle
                      cx="34"
                      cy="34"
                      r={R}
                      className="transition-all duration-300"
                      strokeWidth="3.5"
                      stroke="url(#ownershipGradient)"
                      fill="none"
                      strokeDasharray={`${dash} ${C}`}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="ownershipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Avatar Image with ORANGE ACTIVE BORDER */}
                <div
                  className={cn(
                    'relative z-10 w-16 h-16 rounded-xl bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] flex items-center justify-center overflow-hidden transition-all',
                    hasPos
                      ? 'border-[3px] border-orange-500'
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
                            <span className="font-bold">{formatNumber(data.myKeys)}</span>
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
                <span className={cn('px-2 py-0.5 rounded border text-[10px] font-bold uppercase', marketColor)}>
                  {marketLabel}
                </span>
              </div>
              {data.subtitle && <p className="text-sm text-zinc-400 line-clamp-1">{data.subtitle}</p>}
            </div>

            {/* Action Icons + Contributors + Ownership Pill */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {/* Contributors - Profile Avatars */}
                {data.contributors && data.contributors.length > 0 && (
                  <div className="flex items-center -space-x-2 mr-2">
                    {data.contributors.slice(0, 3).map((contributor, idx) => (
                      <div
                        key={idx}
                        className="relative w-7 h-7 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] overflow-hidden hover:z-10 transition-transform hover:scale-110"
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
                      ? "bg-[#D1FD0A]/20 border border-[#D1FD0A]/50 hover:bg-[#D1FD0A]/30"
                      : "bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600"
                  )}
                  aria-label={data.notificationEnabled ? "Unsubscribe" : "Subscribe"}
                >
                  <Bell
                    className={cn(
                      "w-4 h-4 transition-colors",
                      data.notificationEnabled ? "text-[#D1FD0A] fill-[#D1FD0A]" : "text-zinc-400"
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

              {/* Ownership Pill - TOP RIGHT position */}
              {hasPos && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-green-500/60 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 shadow-lg shadow-green-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold text-green-400">Holding {formatNumber(data.myKeys)}</span>
                  <span className="text-[10px] font-semibold text-green-400/70">({shareDisplay}%)</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Row - Simplified */}
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
                    : 'bg-orange-500/10 text-orange-300 border-orange-500/30'
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

          {/* Conviction Bar - Community Confidence Signal */}
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
                {data.beliefScore >= 70 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                    HIGH
                  </span>
                )}
                {data.beliefScore >= 50 && data.beliefScore < 70 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    MEDIUM
                  </span>
                )}
                {data.beliefScore < 50 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-700/50 text-zinc-400 border border-zinc-600/30">
                    EARLY
                  </span>
                )}
              </div>
            </div>
            <div
              className="h-2.5 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50 relative group cursor-help"
              title="Confidence score based on key purchases, upvotes, contributor activity, and community engagement"
            >
              <div
                className={cn(
                  "h-full transition-all duration-500 relative",
                  data.beliefScore >= 70
                    ? "bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] shadow-lg shadow-[#D1FD0A]/50"
                    : data.beliefScore >= 50
                    ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 shadow-lg shadow-amber-500/30"
                    : "bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600"
                )}
                style={{ width: `${Math.max(0, Math.min(100, data.beliefScore))}%` }}
              >
                {/* Shimmer effect for high confidence */}
                {data.beliefScore >= 70 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                )}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-black/95 border border-zinc-700 rounded-lg text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 backdrop-blur-sm">
                <div className="text-[10px] font-medium">
                  Based on key purchases, upvotes,
                  <br />
                  contributor activity & community engagement
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-black/95 border-r border-b border-zinc-700 rotate-45" />
              </div>
            </div>
          </div>

          {/* Action Buttons - Clear CTA */}
          <div className="flex items-center gap-2">
            {/* Primary CTA - Most prominent */}
            <button
              onClick={handleBuyOrManage}
              data-cta={hasPos ? 'manage' : 'buy'}
              className={cn(
                'flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
                hasPos
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02]'
              )}
            >
              {hasPos ? (
                <>
                  <Users className="w-4 h-4" strokeWidth={2.5} />
                  Manage
                </>
              ) : (
                <>
                  Buy Keys
                  {data.currentPrice && <span className="opacity-90 font-normal">@{data.currentPrice.toFixed(3)}</span>}
                </>
              )}
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
              onClick={data.onDetails || (() => router.push(`/launch/${data.id}`))}
              className="px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 text-zinc-300 text-sm font-medium transition-all"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Buy/Sell/Manage Modal */}
      <BuySellModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        data={{
          title: data.title,
          logoUrl: data.logoUrl,
          currentPrice: data.currentPrice || 0,
          myKeys: data.myKeys,
          mySharePct: data.mySharePct,
          totalSupply: 1000, // TODO: Get from API
          priceChange24h: data.priceChange24h,
          estLaunchTokens: data.estLaunchTokens,
        }}
        onBuy={handleBuy}
        onSell={handleSell}
      />
    </div>
  )
}
