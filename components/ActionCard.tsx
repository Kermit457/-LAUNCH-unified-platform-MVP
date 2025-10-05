"use client"

import { useRouter } from 'next/navigation'
import { Share2, Eye, TrendingUp, Heart, Twitter, Music2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ActionCardKind = "campaign" | "raid" | "bounty"

export type Platform = "twitter" | "x" | "youtube" | "twitch" | "tiktok" | "music"

export type ActionCardProps = {
  kind: ActionCardKind
  title: string
  subtitle?: string
  avatarText?: string
  rateLabel?: string
  budgetPaid?: number
  budgetTotal?: number
  progressPct?: number
  typeLabel: string
  platforms?: Platform[]
  views?: number
  isFav?: boolean
  id?: string  // Add ID for navigation
  onShare?: () => void
  onJoin?: () => void
  onView?: () => void
  onToggleFav?: () => void
}

// Simple video icon component
const VideoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
)

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  x: Twitter,
  youtube: VideoIcon,
  twitch: VideoIcon,
  tiktok: Music2,
  music: Music2,
}

export function ActionCard({
  kind,
  title,
  subtitle,
  avatarText = "?",
  rateLabel,
  budgetPaid = 0,
  budgetTotal = 0,
  progressPct,
  typeLabel,
  platforms = [],
  views = 0,
  isFav = false,
  id,
  onShare,
  onJoin,
  onView,
  onToggleFav,
}: ActionCardProps) {
  const router = useRouter()
  const computedProgress = progressPct ?? (budgetTotal > 0 ? Math.round((budgetPaid / budgetTotal) * 100) : 0)

  const handleView = () => {
    if (onView) {
      onView()
    } else if (id) {
      const route = kind === 'campaign' ? `/campaign/${id}` : `/quest/${id}`
      router.push(route)
    }
  }

  const handleJoin = () => {
    if (onJoin) {
      onJoin()
    } else if (id) {
      const route = kind === 'campaign' ? `/campaign/${id}` : `/quest/${id}`
      router.push(route)
    }
  }

  // Color themes for each card type
  const colorThemes = {
    campaign: {
      avatar: 'from-fuchsia-500 via-pink-500 to-purple-600',
      border: 'border-fuchsia-500/30',
      progress: 'from-fuchsia-400 via-pink-400 to-purple-500',
      rate: 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300',
      button: 'from-fuchsia-500 via-pink-500 to-purple-600 hover:from-fuchsia-600 hover:via-pink-600 hover:to-purple-700',
      ring: 'focus:ring-fuchsia-400',
      typeBadge: 'bg-fuchsia-500/30 border-fuchsia-400/60 text-fuchsia-200',
    },
    raid: {
      avatar: 'from-red-500 via-orange-500 to-amber-500',
      border: 'border-red-500/30',
      progress: 'from-red-400 via-orange-400 to-amber-400',
      rate: 'bg-red-500/20 border-red-500/40 text-red-300',
      button: 'from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600',
      ring: 'focus:ring-red-400',
      typeBadge: 'bg-red-500/30 border-red-400/60 text-red-200',
    },
    bounty: {
      avatar: 'from-emerald-500 via-teal-500 to-cyan-500',
      border: 'border-emerald-500/30',
      progress: 'from-emerald-400 via-teal-400 to-cyan-400',
      rate: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
      button: 'from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600',
      ring: 'focus:ring-emerald-400',
      typeBadge: 'bg-emerald-500/30 border-emerald-400/60 text-emerald-200',
    },
  }

  const theme = colorThemes[kind]

  return (
    <div className={cn("rounded-3xl bg-[#0D1220] border p-5 text-white min-h-[200px] flex flex-col", theme.border)}>
      {/* Header row */}
      <div className="flex items-start gap-3 mb-2.5">
        {/* Avatar */}
        <div className={cn("w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-base flex-shrink-0", theme.avatar)}>
          {avatarText.slice(0, 2).toUpperCase()}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight line-clamp-2">{title}</h3>
        </div>

        {/* Share & Rate */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onShare}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4 text-white/70" />
          </button>
          {rateLabel && (
            <div
              className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap", theme.rate)}
              role="status"
            >
              {rateLabel}
            </div>
          )}
        </div>
      </div>

      {/* Payout row */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
          <span>${budgetPaid.toLocaleString('en-US')} of ${budgetTotal.toLocaleString('en-US')} paid out</span>
          <span className="font-semibold text-white/80">{computedProgress}%</span>
        </div>
        <div
          className="h-1.5 rounded-full bg-white/10 overflow-hidden"
          role="progressbar"
          aria-valuenow={computedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn("h-full bg-gradient-to-r transition-all duration-300", theme.progress)}
            style={{ width: `${Math.max(0, Math.min(100, computedProgress))}%` }}
          />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs mb-2.5">
        <div className="flex items-center gap-2">
          <div className={cn("px-2.5 py-1 rounded-lg border font-bold text-xs", theme.typeBadge)}>
            {typeLabel}
          </div>
          {platforms.length > 0 && (
            <div className="flex items-center gap-1">
              {platforms.slice(0, 3).map((platform, idx) => {
                const Icon = platformIcons[platform]
                if (!Icon) return null
                return (
                  <div key={idx} className="w-3.5 h-3.5 text-white/70">
                    {platform === 'x' ? (
                      <div className="w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold">X</div>
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>
                )
              })}
              {onToggleFav && (
                <button
                  onClick={onToggleFav}
                  className="ml-0.5 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
                  aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={cn("w-3.5 h-3.5 transition-colors", isFav ? "fill-pink-400 text-pink-400" : "text-white/50 hover:text-pink-400")} />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="text-white/60 text-xs flex-shrink-0">
          Views: <span className="text-white/90 font-medium">{views.toLocaleString('en-US')}</span>
        </div>
      </div>

      {/* Actions row */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        <button
          onClick={handleView}
          className="flex-1 h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="View details"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <button
          onClick={handleJoin}
          className={cn("flex-1 h-9 px-3 rounded-xl bg-gradient-to-r text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-2", theme.button, theme.ring)}
          aria-label="Join"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Join
        </button>
      </div>
    </div>
  )
}