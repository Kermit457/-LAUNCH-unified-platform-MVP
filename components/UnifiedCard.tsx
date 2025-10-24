"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import {
  Share2,
  Users,
  Sparkles,
  Film,
  Globe,
  Github,
  Star
} from 'lucide-react'
import {
  IconUpvote,
  IconMessage,
  IconAim,
  IconNotification,
  IconTwitter,
  IconPriceUp,
  IconPriceDown,
  IconSolana,
  IconLab,
  IconTopPerformer,
  IconWeb,
  IconTelegram,
  IconGithub,
  IconLightning,
  IconRocket,
  IconCash,
  IconMotion,
  IconCult
} from '@/lib/icons'
import { BuySellModal } from './launch/BuySellModal'

// Helper to format numbers consistently
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Color schemes for each type - btdemo design system
const colorSchemes = {
  icm: {
    name: 'Project',
    emoji: '💼',
    icon: IconRocket,
    badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
    border: 'border-[#D1FD0A]/60',
    gradient: 'bg-[#D1FD0A]', // Lime green - btdemo primary
    glow: 'shadow-[#D1FD0A]/50',
    ring: 'text-[#D1FD0A]',
    buttonHover: 'hover:bg-[#B8E309] hover:scale-105'
  },
  ccm: {
    name: 'Creator',
    emoji: '🎥',
    icon: IconMotion,
    badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
    border: 'border-[#D1FD0A]/60',
    gradient: 'bg-[#D1FD0A]', // Lime green - btdemo primary
    glow: 'shadow-[#D1FD0A]/50',
    ring: 'text-[#D1FD0A]',
    buttonHover: 'hover:bg-[#B8E309] hover:scale-105'
  },
  meme: {
    name: 'Meme',
    emoji: '🔥',
    icon: IconCash,
    badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
    border: 'border-[#D1FD0A]/60',
    gradient: 'bg-[#D1FD0A]', // Lime green - btdemo primary
    glow: 'shadow-[#D1FD0A]/50',
    ring: 'text-[#D1FD0A]',
    buttonHover: 'hover:bg-[#B8E309] hover:scale-105'
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
  status: 'live' | 'active' | 'ended' | 'frozen' | 'launched'
  beliefScore: number // 0-100 conviction
  upvotes: number
  commentsCount: number

  // Stats - Enhanced with blockchain data
  viewCount?: number // Total clip views
  clipViews?: number // Aggregated clip views
  clips?: Array<{ views: number }>
  holders?: number
  keyHolders?: Array<any> // Actual token holders from blockchain
  keysSupply?: number
  priceChange24h?: number

  // Price from smart contract
  currentPrice?: number
  contractPrice?: number // Direct from Solana contract
  priceFromChain?: number

  // Team/Contributors - Enhanced with Twitter data
  contributors?: Array<{
    id?: string
    name: string
    avatar: string
    twitterHandle?: string
    twitterAvatar?: string
    handle?: string
  }>
  networkMembers?: Array<any>
  contributorsCount?: number

  // Portfolio data for current user
  myKeys?: number
  mySharePct?: number
  estLaunchTokens?: number | null

  // Airdrop/Merkle claim
  airdropAmount?: number
  hasClaimedAirdrop?: boolean

  // Enhanced Social Links
  twitterUrl?: string
  websiteUrl?: string
  telegramUrl?: string
  githubUrl?: string
  socialLinks?: {
    twitter?: string
    website?: string
    telegram?: string
    github?: string
  }

  // Creator info - Enhanced
  creatorId?: string
  creator?: {
    displayName?: string
    avatar?: string
    twitterHandle?: string
  }
  creatorName?: string
  creatorAvatar?: string

  // Additional metadata
  isExperimental?: boolean
  isLab?: boolean

  // State handlers
  hasVoted?: boolean
  isVoting?: boolean
  onVote?: () => Promise<void>
  onComment?: () => void
  onCollaborate?: () => void
  onDetails?: () => void
  onBuyKeys?: () => void
  onClaimAirdrop?: () => Promise<void>
  onClipClick?: () => void // New CLIPS handler

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
  const R = 35
  const C = 2 * Math.PI * R
  const pct = Math.max(0, Math.min(75, data.mySharePct ?? 0))
  const dash = C * (pct / 100)

  // Status badge color - btdemo design
  const statusColors = {
    live: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
    active: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
    frozen: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    ended: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    launched: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30'
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
    <div className="glass-premium p-6 rounded-3xl group hover:shadow-xl hover:shadow-primary/50 transition-all border-2 border-primary/50 hover:border-primary">

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
              'flex flex-col items-center justify-center w-16 h-16 rounded-xl font-bold text-lg transition-all relative',
              data.hasVoted
                ? `${scheme.gradient} text-black`
                : 'bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 text-zinc-300 hover:text-white hover:scale-105',
              data.isVoting && 'opacity-50 cursor-not-allowed'
            )}
            aria-label="Upvote"
          >
            <IconUpvote className="w-6 h-6 mb-0.5 icon-primary" />
            <span className="font-led-dot text-xl text-primary">{data.upvotes}</span>
          </button>

          {/* Comments */}
          <button
            onClick={data.onCommentsClick}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 transition-all text-zinc-400 hover:text-white"
            aria-label="Comments"
          >
            <IconMessage className="w-5 h-5 mb-0.5" />
            <span className="text-xs font-medium">{data.comments}</span>
          </button>

          {/* Twitter */}
          {data.twitterUrl && (
            <a
              href={data.twitterUrl}
              target="_blank"
              rel="noreferrer"
              onClick={data.onTwitterClick}
              className="flex items-center justify-center w-16 h-16 rounded-xl bg-zinc-800/80 hover:bg-[#D1FD0A]/20 border border-zinc-700/50 hover:border-[#D1FD0A]/40 transition-all group/twitter"
              aria-label="Twitter"
            >
              <IconTwitter className="w-5 h-5 text-zinc-400 group-hover/twitter:text-[#D1FD0A] transition-colors" />
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
                className="relative w-20 h-20 cursor-pointer"
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
                  viewBox="0 0 84 84"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  {/* Track */}
                  <circle
                    cx="42"
                    cy="42"
                    r="35"
                    className={cn('transition-all', hasPos ? 'text-zinc-700' : 'text-zinc-800')}
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                  />
                  {/* Progress - Type-colored ring */}
                  {hasPos && (
                    <circle
                      cx="42"
                      cy="42"
                      r="35"
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
                    'relative z-10 w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden transition-all',
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
                <h3 className="text-xl font-bold text-white tracking-tight">{data.title}</h3>
                {data.ticker && (
                  <span className="font-led-dot text-sm md:text-base text-[#D1FD0A] tracking-wider">${data.ticker}</span>
                )}
                <IconLab className="w-5 h-5 text-[#D1FD0A]" title="Verified Project" />
                <IconTopPerformer className="w-5 h-5 text-[#D1FD0A]" title="Top Performer" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm', statusColor)}>
                  {statusLabel}
                </span>

                {/* Status Icons */}
                {(data.isLab || data.isExperimental) && (
                  <IconLab className="w-4 h-4 text-[#D1FD0A]" title="Lab Project" />
                )}
                {data.beliefScore >= 90 && (
                  <IconTopPerformer className="w-4 h-4 text-[#D1FD0A]" title="Top Performer" />
                )}
                {data.type === 'ccm' && (
                  <Star className="w-4 h-4 text-[#D1FD0A]" title="Creator Project" />
                )}
                {data.type === 'meme' && (
                  <IconCult className="w-4 h-4 text-[#D1FD0A]" title="CULT" />
                )}
              </div>
              {data.subtitle && <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{data.subtitle}</p>}
            </div>

            {/* Action Icons + Contributors + Ownership Pill */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {/* Contributors - With Twitter avatars */}
                {(data.contributors || data.networkMembers) && (data.contributors?.length > 0 || data.networkMembers?.length > 0) && (
                  <div className="flex items-center -space-x-2 mr-2">
                    {(data.contributors || data.networkMembers || []).slice(0, 3).map((contributor: any, idx: number) => (
                      <div
                        key={contributor.id || idx}
                        className="relative w-7 h-7 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-purple-500 to-blue-600 overflow-hidden hover:z-10 transition-transform hover:scale-110 cursor-pointer"
                        title={contributor.name || contributor.handle || `@${contributor.twitterHandle}`}
                        onClick={() => {
                          if (contributor.twitterHandle) {
                            window.open(`https://twitter.com/${contributor.twitterHandle}`, '_blank')
                          }
                        }}
                      >
                        <img
                          src={
                            contributor.twitterAvatar ||
                            contributor.avatar ||
                            (contributor.twitterHandle ? `https://unavatar.io/twitter/${contributor.twitterHandle}` : null) ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.id || contributor.name || idx}`
                          }
                          alt={contributor.name || contributor.handle || `Contributor ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {(data.contributorsCount || data.contributors?.length || data.networkMembers?.length || 0) > 3 && (
                      <div className="w-7 h-7 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-zinc-400 text-[10px] font-bold">
                        +{(data.contributorsCount || data.contributors?.length || data.networkMembers?.length || 0) - 3}
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
                  <IconNotification
                    className={cn(
                      "w-4 h-4 transition-colors",
                      data.notificationEnabled ? 'text-[#D1FD0A] fill-[#D1FD0A]' : "text-zinc-400"
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

          {/* Stats Row with Social Icons */}
          <div className="flex items-center justify-between gap-3 mb-3 text-xs">
            <div className="flex items-center gap-3">
              {/* Social Icons - Clickable when URLs exist */}
              <div className="flex items-center gap-1.5">
                {data.websiteUrl || data.socialLinks?.website ? (
                  <Globe
                    className="w-5 h-5 text-[#D1FD0A] cursor-pointer hover:text-[#B8E309] transition-colors"
                    onClick={() => window.open(data.websiteUrl || data.socialLinks?.website, '_blank')}
                    title={data.websiteUrl || data.socialLinks?.website}
                  />
                ) : (
                  <Globe className="w-5 h-5 text-zinc-600 opacity-30" />
                )}

                {data.twitterUrl || data.socialLinks?.twitter || data.creator?.twitterHandle ? (
                  <IconTwitter
                    className="w-5 h-5 text-[#D1FD0A] cursor-pointer hover:text-[#B8E309] transition-colors"
                    onClick={() => window.open(data.twitterUrl || data.socialLinks?.twitter || `https://twitter.com/${data.creator?.twitterHandle}`, '_blank')}
                    title={data.twitterUrl || data.socialLinks?.twitter}
                  />
                ) : (
                  <IconTwitter className="w-5 h-5 text-zinc-600 opacity-30" />
                )}

                {data.telegramUrl || data.socialLinks?.telegram ? (
                  <IconTelegram
                    className="w-5 h-5 text-[#D1FD0A] cursor-pointer hover:text-[#B8E309] transition-colors"
                    onClick={() => window.open(data.telegramUrl || data.socialLinks?.telegram, '_blank')}
                    title={data.telegramUrl || data.socialLinks?.telegram}
                  />
                ) : (
                  <IconTelegram className="w-5 h-5 text-zinc-600 opacity-30" />
                )}

                {data.githubUrl || data.socialLinks?.github ? (
                  <Github
                    className="w-5 h-5 text-[#D1FD0A] cursor-pointer hover:text-[#B8E309] transition-colors"
                    onClick={() => window.open(data.githubUrl || data.socialLinks?.github, '_blank')}
                    title={data.githubUrl || data.socialLinks?.github}
                  />
                ) : (
                  <Github className="w-5 h-5 text-zinc-600 opacity-30" />
                )}
              </div>

              {/* Views - Aggregated from clips */}
              {(data.clipViews || data.viewCount || data.clips) !== undefined && (
                <div className="flex items-center gap-1">
                  <IconAim className="w-3.5 h-3.5 icon-muted" />
                  <span className="font-led-dot text-xl text-primary">
                    {formatNumber(
                      data.clipViews ||
                      data.clips?.reduce((acc, clip) => acc + (clip.views || 0), 0) ||
                      data.viewCount ||
                      0
                    )}
                  </span>
                </div>
              )}

              {/* Holders - Real key holders */}
              {(data.keyHolders || data.holders) !== undefined && (
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 icon-muted" />
                  <span className="font-led-dot text-xl text-primary">
                    {data.keyHolders?.length || data.holders || 0}
                  </span>
                </div>
              )}

              {/* 24h Price Change - No Box */}
              {data.priceChange24h !== undefined && data.priceChange24h !== null && (
                <div className={cn(
                  'flex items-center gap-1 font-semibold',
                  data.priceChange24h >= 0 ? 'text-[#D1FD0A]' : 'text-red-400'
                )}>
                  {data.priceChange24h >= 0 ? (
                    <IconPriceUp className="w-3.5 h-3.5" />
                  ) : (
                    <IconPriceDown className="w-3.5 h-3.5" />
                  )}
                  <span className="font-led-dot text-lg">
                    {data.priceChange24h >= 0 ? '+' : ''}
                    {data.priceChange24h.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Motion Bar */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-1.5">
              <IconMotion className="w-5 h-5 text-[#D1FD0A]" />
              <span className="text-xs text-zinc-400">Motion</span>
              <div className="flex-1 h-2.5 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50 relative group cursor-help">
                <div
                  className={cn(
                    "h-full transition-all duration-500 relative",
                    scheme.gradient
                  )}
                  style={{ width: `${Math.max(0, Math.min(100, data.beliefScore))}%` }}
                />
              </div>
              <span className="font-led-dot text-xl text-primary">
                {Math.round(data.beliefScore)}%
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Primary CTA - btdemo styled */}
            <button
              onClick={handleBuyOrManage}
              data-cta={hasPos ? 'manage' : 'buy'}
              className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2"
            >
              <span className="text-black font-bold">BUY</span>
              {(data.contractPrice || data.priceFromChain || data.currentPrice) && (
                <>
                  <IconSolana size={16} className="text-black opacity-80" />
                  <span className="font-led-dot text-xl text-black">
                    {(data.contractPrice || data.priceFromChain || data.currentPrice || 0).toFixed(3)}
                  </span>
                </>
              )}
            </button>

            {/* Secondary Actions - btdemo styled */}
            <button
              onClick={data.onClipClick}
              className="bg-zinc-800 hover:bg-zinc-700 font-semibold px-5 py-3 rounded-xl transition-all duration-300 border-2 border-[#D1FD0A] flex items-center justify-center gap-2"
              title="Submit Clip"
            >
              <Film className="w-5 h-5 text-[#D1FD0A]" />
              <span className="text-[#D1FD0A]">+ Clips</span>
            </button>

            <button
              onClick={data.onCollaborate}
              className="bg-zinc-800 hover:bg-zinc-700 font-semibold px-5 py-3 rounded-xl transition-all duration-300 border-2 border-[#D1FD0A] flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5 text-[#D1FD0A]" />
              <span className="hidden sm:inline text-[#D1FD0A]">Collaborate</span>
            </button>

            <button
              onClick={data.onDetails || (() => router.push(`/curve/${data.id}`))}
              className="bg-zinc-800 hover:bg-zinc-700 font-semibold px-5 py-3 rounded-xl transition-all duration-300 border-2 border-[#D1FD0A] flex items-center justify-center"
            >
              <span className="text-[#D1FD0A]">Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Buy/Sell/Manage Modal */}
      {(data.contractPrice || data.priceFromChain || data.currentPrice) && (
        <BuySellModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={modalMode}
          data={{
            title: data.title,
            logoUrl: data.logoUrl,
            currentPrice: data.contractPrice || data.priceFromChain || data.currentPrice || 0,
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