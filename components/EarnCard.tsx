'use client'

import { useState } from 'react'
import { Trophy, Target, Zap, DollarSign, Clock, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CampaignCard } from './CampaignCard'
import { RaidCard } from './RaidCard'
import { BountyCard } from './BountyCard'
import type { Platform } from './ActionCard'

export type EarnType = 'campaign' | 'raid' | 'prediction' | 'quest' | 'bounty'
export type Currency = 'USDC' | 'LAUNCH' | 'PTS'

export interface EarnCard {
  id: string
  type: EarnType
  title: string
  platform: string[]
  reward: {
    currency: Currency
    value: number
    per?: string // "1k views", "pool", etc
  }
  progress: {
    paid: number
    pool: number
  }
  duration?: string // "3h left", "Ends in 2d"
  participants?: number
  status: 'live' | 'upcoming' | 'ended'
}

interface EarnCardProps extends EarnCard {
  onClick?: () => void
}

export function EarnCard(props: EarnCardProps) {
  const { id, type, title, platform, reward, progress, duration, participants, status, onClick } = props
  const [isHovered, setIsHovered] = useState(false)
  const [isFav, setIsFav] = useState(false)

  const progressPercent = Math.min(100, Math.round((progress.paid / progress.pool) * 100))

  // Use ActionCard for campaigns, raids, and bounties
  if (type === 'campaign' || type === 'raid' || type === 'bounty') {
    const avatarText = title.slice(0, 2)
    const platforms = platform.map(p => p.toLowerCase() as Platform)

    const commonProps = {
      id,
      title,
      avatarText,
      budgetPaid: progress.paid,
      budgetTotal: progress.pool,
      progressPct: progressPercent,
      platforms,
      views: participants || 0,
      isFav,
      onShare: () => console.log('Share', title),
      onJoin: onClick,
      onView: onClick,
      onToggleFav: () => setIsFav(!isFav),
    }

    if (type === 'campaign') {
      return <CampaignCard {...commonProps} ratePerThousand={reward.value} />
    } else if (type === 'raid') {
      return <RaidCard {...commonProps} poolAmount={progress.pool} />
    } else {
      return <BountyCard {...commonProps} payPerTask={reward.value} />
    }
  }

  // Hide predictions and quests
  if (type === 'prediction' || type === 'quest') {
    return null
  }

  // Type-specific styling
  const typeConfig = {
    campaign: {
      label: '📹 Campaign',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-300',
      ctaLabel: 'Join Campaign'
    },
    raid: {
      label: '⚔️ Raid',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-300',
      ctaLabel: 'Join Raid'
    },
    prediction: {
      label: '🎯 Prediction',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-300',
      ctaLabel: 'Vote Now'
    },
    quest: {
      label: '🎮 Quest',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-300',
      ctaLabel: 'Complete Task'
    },
    bounty: {
      label: '💰 Bounty',
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-300',
      ctaLabel: 'Submit Entry'
    }
  }

  const config = (typeConfig as any)[type] || typeConfig.quest

  const formatReward = () => {
    const symbol = reward.currency === 'USDC' ? '$' : reward.currency === 'LAUNCH' ? '$LAUNCH' : ''
    const value = reward.value.toLocaleString('en-US')
    const per = reward.per ? ` / ${reward.per}` : ''
    return `${symbol}${value}${per}`
  }

  return (
    <div
      className={cn(
        "glass-card p-4 hover:border-white/30 transition-all duration-300 cursor-pointer group h-[180px] flex flex-col",
        isHovered && "scale-[1.02] -translate-y-1"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold", config.bgColor, config.borderColor, "border")}>
              {config.label}
            </span>
            <span className={cn(
              'px-2 py-0.5 rounded text-xs font-bold',
              status === 'live' && 'bg-green-500/20 text-green-300',
              status === 'upcoming' && 'bg-amber-500/20 text-amber-300',
              status === 'ended' && 'bg-gray-500/20 text-gray-400'
            )}>
              {status.toUpperCase()}
            </span>
          </div>
          <h3 className="font-bold text-white text-sm line-clamp-2 mb-2">
            {title}
          </h3>
        </div>
      </div>

      {/* Reward Badge */}
      <div className="mb-3">
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
          config.bgColor,
          config.borderColor
        )}>
          <DollarSign size={14} className={config.textColor} />
          <span className={cn("text-sm font-bold", config.textColor)}>
            {formatReward()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 flex-1">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>${progress.paid.toLocaleString('en-US')} paid</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className={cn("h-full bg-gradient-to-r transition-all duration-500", config.color)}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {duration && (
            <div className="flex items-center gap-1 text-orange-300">
              <Clock size={12} />
              <span>{duration}</span>
            </div>
          )}
          {participants !== undefined && (
            <div className="flex items-center gap-1 text-white/60">
              <Users size={12} />
              <span>{participants}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {platform.slice(0, 2).map((p) => (
            <span key={p} className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/70">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
