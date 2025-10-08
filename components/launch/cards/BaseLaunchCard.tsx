"use client"

import { ArrowUp, MessageSquare, Bell, Share2, Zap, Eye } from 'lucide-react'
import { cn } from '@/lib/cn'
import { LaunchCardData } from '@/types/launch'
import { ContributorRow } from '@/components/ContributorRow'

interface BaseLaunchCardProps {
  data: LaunchCardData
  children?: React.ReactNode
  hasVoted?: boolean
  onUpvote?: (id: string) => void
  onComment?: (id: string) => void
}

export function BaseLaunchCard({ data, children, hasVoted = false, onUpvote, onComment }: BaseLaunchCardProps) {
  const {
    id,
    title,
    subtitle,
    logoUrl,
    scope,
    status,
    convictionPct,
    commentsCount,
    upvotes,
    contributionPoolPct,
    feesSharePct,
  } = data

  const scopeColors: Record<string, string> = {
    ICM: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    CCM: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    MEME: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  }

  const statusColors = {
    LIVE: 'bg-green-500/20 text-green-300 border-green-500/40',
    UPCOMING: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-all">
      <div className="flex gap-3">
        {/* Left Rail - Upvote & Comments */}
        <div className="flex flex-col items-center gap-3 pt-1">
          {/* Upvote */}
          <button
            onClick={() => onUpvote?.(id)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Upvote"
            disabled={hasVoted}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg border flex items-center justify-center transition-all",
              hasVoted
                ? "bg-fuchsia-500/20 border-fuchsia-400/50"
                : "bg-white/5 hover:bg-white/10 border-white/10 group-hover:border-fuchsia-400/50 group-hover:bg-fuchsia-500/10"
            )}>
              <ArrowUp className={cn(
                "w-5 h-5 transition-colors",
                hasVoted
                  ? "text-fuchsia-400"
                  : "text-white/70 group-hover:text-fuchsia-400"
              )} />
            </div>
            <span className="text-sm text-white/50 font-medium">{upvotes}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => onComment?.(id)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Comments"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10">
              <MessageSquare className="w-5 h-5 text-white/70 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-sm text-white/50 font-medium">{commentsCount}</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row - Logo, Title, Scope Badge */}
          <div className="flex items-start gap-3 mb-3">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={title || 'Launch'} className="w-full h-full object-cover" />
              ) : (
                (title || '??').slice(0, 2).toUpperCase()
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3 className="font-bold text-white text-base truncate">{title || 'Untitled Launch'}</h3>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-bold border flex-shrink-0',
                    scopeColors[scope]
                  )}
                >
                  {scope}
                </span>
                {status && (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-bold border flex-shrink-0',
                      statusColors[status as 'LIVE' | 'UPCOMING']
                    )}
                  >
                    {status}
                  </span>
                )}

                {/* Action Icons - Bell & Share */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => console.log('Set reminder for:', id)}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:border-amber-400/50 hover:bg-amber-500/10 group flex-shrink-0"
                    aria-label="Set reminder"
                  >
                    <Bell className="w-3.5 h-3.5 text-white/70 group-hover:text-amber-400 transition-colors" />
                  </button>
                  <button
                    onClick={() => console.log('Share launch:', id)}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 group flex-shrink-0"
                    aria-label="Share"
                  >
                    <Share2 className="w-3.5 h-3.5 text-white/70 group-hover:text-cyan-400 transition-colors" />
                  </button>
                </div>
              </div>
              {subtitle && (
                <p className="text-sm text-white/60 truncate">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Conviction Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
              <span>Conviction</span>
              <span className="font-semibold text-white">{convictionPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, convictionPct))}%` }}
              />
            </div>
          </div>

          {/* Economics Badges */}
          {((contributionPoolPct !== undefined && contributionPoolPct > 0) || (feesSharePct !== undefined && feesSharePct > 0)) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {/* Contribution Pool Badge */}
              {contributionPoolPct !== undefined && contributionPoolPct > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-lg">🪙</span>
                  <span className="text-xs font-semibold text-emerald-300">
                    {contributionPoolPct}% Total Supply
                  </span>
                </div>
              )}

              {/* Fees Share Badge */}
              {feesSharePct !== undefined && feesSharePct > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <span className="text-lg">💰</span>
                  <span className="text-xs font-semibold text-amber-300">
                    {feesSharePct}% Fees Share
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Engagement Badges (Boost & View Counts) */}
          {((data.boostCount !== undefined && data.boostCount > 0) || (data.viewCount !== undefined && data.viewCount > 0)) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {/* Boost Count Badge */}
              {data.boostCount !== undefined && data.boostCount > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30">
                  <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span className="text-xs font-semibold text-fuchsia-300">
                    {data.boostCount} {data.boostCount === 1 ? 'Boost' : 'Boosts'}
                  </span>
                </div>
              )}

              {/* View Count Badge */}
              {data.viewCount !== undefined && data.viewCount > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/30">
                  <Eye className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xs font-semibold text-green-300">
                    {data.viewCount} {data.viewCount === 1 ? 'View' : 'Views'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Contributors Row */}
          {data.contributors && data.contributors.length > 0 && (
            <ContributorRow contributors={data.contributors} className="mb-3" />
          )}

          {/* Dynamic Children Content (Token row for LIVE, TGE countdown for UPCOMING) */}
          {children}
        </div>
      </div>
    </div>
  )
}
