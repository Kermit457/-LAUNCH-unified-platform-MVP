"use client"

import { ArrowUp, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/cn'
import { LaunchCardData } from '@/types/launch'

interface BaseLaunchCardProps {
  data: LaunchCardData
  children?: React.ReactNode
  onUpvote?: (id: string) => void
  onComment?: (id: string) => void
}

export function BaseLaunchCard({ data, children, onUpvote, onComment }: BaseLaunchCardProps) {
  const {
    id,
    title,
    subtitle,
    logoUrl,
    scope,
    convictionPct,
    commentsCount,
    upvotes,
  } = data

  const scopeColors = {
    ICM: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    CCM: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
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
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group-hover:border-fuchsia-400/50 group-hover:bg-fuchsia-500/10">
              <ArrowUp className="w-4 h-4 text-white/70 group-hover:text-fuchsia-400 transition-colors" />
            </div>
            <span className="text-xs text-white/50 font-medium">{upvotes}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => onComment?.(id)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Comments"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10">
              <MessageSquare className="w-4 h-4 text-white/70 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-xs text-white/50 font-medium">{commentsCount}</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row - Logo, Title, Scope Badge */}
          <div className="flex items-start gap-3 mb-3">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                title.slice(0, 2).toUpperCase()
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-white text-base truncate">{title}</h3>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-bold border flex-shrink-0',
                    scopeColors[scope]
                  )}
                >
                  {scope}
                </span>
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

          {/* Dynamic Children Content (Token row for LIVE, TGE countdown for UPCOMING) */}
          {children}
        </div>
      </div>
    </div>
  )
}
