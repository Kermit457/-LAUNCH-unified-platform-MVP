/**
 * RoomCard - Matches BTDemo ProjectCard design EXACTLY
 */

'use client'

import { useState } from 'react'
import type { BlastRoom } from '@/lib/types/blast'
import { ROOM_TYPES } from '@/lib/constants/blast'
import { Countdown } from '../shared/Countdown'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import {
  IconMotionScoreBadge,
  IconCash,
  IconGem,
  IconComputer,
  IconNetwork,
  IconContributorBubble,
  IconLightning,
  IconMessage,
  IconCollabExpand,
  IconRocket,
  IconLab,
  IconFreeze,
  IconAttention,
  IconCap,
  IconDeposit,
  IconMotion,
  IconUpvote,
  IconUsdc,
  IconSolana,
  IconActivityBadge,
  IconTrophy,
  IconPriceUp,
  IconWeb,
  IconTwitter,
  IconTelegram,
  IconDiscord
} from '@/lib/icons'

interface RoomCardProps {
  room: BlastRoom
  onClick?: () => void
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  const [imageError, setImageError] = useState(false)
  const { keyBalance } = useKeyGate()

  const canApply = keyBalance >= room.minKeysToApply
  const fillRate = (room.filledSlots / room.totalSlots) * 100

  const getIcon = () => {
    switch (room.type) {
      case 'deal': return <IconCash className="icon-primary" size={32} />
      case 'airdrop': return <IconGem className="icon-primary" size={32} />
      case 'job': return <IconComputer className="icon-primary" size={32} />
      case 'collab': return <IconNetwork className="icon-primary" size={32} />
      case 'funding': return <IconCash className="icon-primary" size={32} />
      default: return <IconMotion className="icon-primary" size={32} />
    }
  }

  return (
    <article className="glass-premium p-6 rounded-3xl group hover:shadow-xl hover:shadow-primary/50 transition-all border-2 border-primary/50 hover:border-primary">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {room.creatorAvatar && !imageError ? (
              <img
                src={room.creatorAvatar}
                alt={room.creatorName}
                className="w-16 h-16 rounded-2xl object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center token-logo-glow">
                {getIcon()}
              </div>
            )}
            <IconMotionScoreBadge
              score={room.creatorMotionScore}
              size={30}
              className="absolute -bottom-2 -right-2"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="card-title">{room.title}</h3>
              {room.status === 'hot' && <IconLab className="text-[#D1FD0A]" size={16} />}
            </div>
            <p className="card-subtitle">{room.creatorName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="icon-interactive">
            <IconCollabExpand size={20} />
          </button>
          <button className="icon-interactive-primary">
            <IconLightning size={20} />
          </button>
        </div>
      </div>

      {/* Motion Score Display */}
      <div className="p-4 glass-interactive rounded-xl transition-all border-2 border-primary/50 hover:border-primary mb-4">
        <div className="flex items-center gap-3">
          <IconMotion className="icon-primary" size={32} />
          <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min(100, room.motionScore || 0))}%` }}
            />
          </div>
          <div className="font-led-dot text-3xl text-primary">{room.motionScore || 0}</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-interactive p-3 rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
          <div className="flex items-center gap-2 mb-1">
            <IconContributorBubble size={16} className="icon-muted" />
            <span className="stat-label">Applicants</span>
          </div>
          <div className="font-led-dot text-xl text-primary">{room.applicantCount || 0}</div>
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <IconActivityBadge size={10} className="icon-muted" />
            <span>of {room.totalSlots} slots</span>
          </div>
        </div>

        <div className="glass-interactive p-3 rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
          <div className="flex items-center gap-2 mb-1">
            <IconDeposit size={16} className="icon-muted" />
            <span className="stat-label">Min Keys</span>
          </div>
          <div className="font-led-dot text-xl text-primary">{room.minKeysToApply}</div>
          <div className="flex items-center gap-1 text-xs">
            {canApply ? (
              <span className="text-green-400">✓ Eligible</span>
            ) : (
              <span className="text-[#FF005C]">✗ Locked</span>
            )}
          </div>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="badge-success flex items-center gap-1">
          <IconRocket size={12} />
          <span>{room.status === 'open' ? 'Open' : 'Closed'}</span>
        </div>
        {room.status === 'hot' && (
          <div className="badge-primary flex items-center gap-1">
            <IconTrophy size={12} />
            <span>Hot</span>
          </div>
        )}
        {fillRate > 80 && (
          <div className="badge-warning flex items-center gap-1">
            <IconAttention size={12} />
            <span>Filling Fast</span>
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between mb-4 p-3 glass-interactive rounded-xl transition-all border-2 border-primary/50 hover:border-primary">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 icon-interactive-primary group">
            <IconUpvote size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-led-dot text-xl text-primary">{room.upvotes || 0}</span>
          </button>

          <button className="flex items-center gap-2 icon-interactive">
            <IconMessage size={20} />
            <span className="font-led-dot text-xl text-primary">{room.comments || 0}</span>
          </button>

          <div className="flex items-center gap-2">
            <IconCap size={16} className="icon-muted" />
            <Countdown endTime={room.endTime} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          disabled={!canApply}
          className={`font-bold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
            canApply
              ? 'bg-[#D1FD0A] hover:bg-[#B8E309] text-black hover:shadow-lg hover:shadow-primary/50'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          <IconLightning size={20} className={canApply ? 'text-black' : 'text-zinc-600'} />
          <span>Apply Now</span>
        </button>
        <button className="bg-zinc-800 hover:bg-zinc-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-[#D1FD0A] flex items-center justify-center gap-2">
          <IconCollabExpand size={20} className="text-[#D1FD0A]" />
          <span className="text-[#D1FD0A]">View Details</span>
        </button>
      </div>

      {/* Social Links */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-800">
        <a href="#" className="icon-interactive-primary">
          <IconWeb size={20} />
        </a>
        <a href="#" className="icon-interactive">
          <IconTwitter size={20} />
        </a>
        <a href="#" className="icon-interactive">
          <IconTelegram size={20} />
        </a>
        <a href="#" className="icon-interactive">
          <IconDiscord size={20} />
        </a>
      </div>
    </article>
  )
}
