"use client"

import { useState } from 'react'
import { Check, MoreVertical, Share2, UserPlus, MessageCircle, Edit, Users } from 'lucide-react'
import { ProfileCardProps } from '@/types/network'
import { RoleChip } from './RoleChip'
import { StatsBar } from './StatsBar'
import { LinkPills } from './LinkPills'
import { cn } from '@/lib/cn'

export function ProfileCard({
  id,
  name,
  handle,
  avatarUrl,
  bannerUrl,
  verified,
  roles,
  mutuals,
  bio,
  x,
  links,
  state,
  onInvite,
  onCancelInvite,
  onChat,
  onFollow,
  onShare,
  onInviteToCampaign,
  onEditProfile,
  variant = 'default',
}: ProfileCardProps) {
  const [showOverflow, setShowOverflow] = useState(false)

  const isCompact = variant === 'compact'

  // Determine primary action
  const renderPrimaryAction = () => {
    switch (state) {
      case 'none':
        return (
          <button
            onClick={() => onInvite?.(id)}
            className="flex-1 h-10 px-4 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
            aria-label="Invite to network"
          >
            Invite
          </button>
        )

      case 'pending':
        return (
          <div className="flex-1 flex items-center gap-2">
            <button
              disabled
              className="flex-1 h-10 px-4 rounded-xl bg-white/10 text-white/50 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Invitation pending"
              title="Awaiting response"
            >
              <Check className="w-4 h-4" />
              Invited
            </button>
            <div className="relative">
              <button
                onClick={() => setShowOverflow(!showOverflow)}
                className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showOverflow && (
                <div className="absolute right-0 top-12 w-48 rounded-xl bg-[#0D1220] border border-white/10 shadow-xl overflow-hidden z-10">
                  <button
                    onClick={() => {
                      onCancelInvite?.(id)
                      setShowOverflow(false)
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel invite
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                    Pin
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                    Mute
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors">
                    Block
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors">
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      case 'connected':
        return (
          <div className="flex-1 flex items-center gap-2">
            <button
              onClick={() => onChat?.(id)}
              className="flex-1 h-10 px-4 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 flex items-center justify-center gap-2"
              aria-label="Open chat"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={() => onInviteToCampaign?.(id)}
              className="h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 whitespace-nowrap"
              aria-label="Invite to campaign"
            >
              Invite to Campaign
            </button>
          </div>
        )

      case 'self':
        return (
          <button
            onClick={onEditProfile}
            className="flex-1 h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 flex items-center justify-center gap-2"
            aria-label="Edit profile"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        )
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all hover:ring-1 hover:ring-white/15 hover:-translate-y-0.5',
        'focus-within:ring-2 focus-within:ring-fuchsia-400/50'
      )}
    >
      {/* Banner strip (optional) */}
      {!isCompact && bannerUrl && (
        <div
          className="h-20 bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 bg-cover bg-center"
          style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined }}
        />
      )}
      {!isCompact && !bannerUrl && (
        <div className="h-20 bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20" />
      )}

      {/* Main content */}
      <div className="p-5">
        {/* Header row: avatar + name/handle/roles */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className={cn(
              'w-14 h-14 rounded-2xl border-2 border-white/20 bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center font-bold text-white text-lg flex-shrink-0 overflow-hidden',
              !isCompact && '-mt-7',
              verified && 'ring-2 ring-fuchsia-400/50 ring-offset-2 ring-offset-[#0D1220]'
            )}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              name.slice(0, 2).toUpperCase()
            )}
          </div>

          {/* Name, handle, roles, mutuals */}
          <div className="flex-1 min-w-0">
            {/* Name + verified */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-bold text-white text-base truncate">{name}</h3>
              {verified && (
                <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {x?.verified && (
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 3h7L22 9.5v7L15.5 23h-7L2 16.5v-7L8.5 3z" />
                  <path d="M10 8l4 4-4 4" stroke="white" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>

            {/* Handle */}
            <div className="text-sm text-white/50 mb-2">{handle}</div>

            {/* Roles + Mutuals */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {roles.slice(0, 3).map((role, idx) => (
                <RoleChip key={idx} role={role} />
              ))}
              {mutuals !== undefined && mutuals > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Users className="w-3 h-3" />
                  {mutuals} mutuals
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {!isCompact && bio && (
          <p className="text-sm text-white/70 line-clamp-1 mb-3">{bio}</p>
        )}

        {/* Stats bar (arena-like) */}
        {!isCompact && <StatsBar x={x} />}

        {/* Link icons row */}
        <div className="mt-4 mb-4">
          <LinkPills links={links} />
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2">
          {/* Secondary actions on left */}
          <button
            onClick={() => onShare?.(id)}
            className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
            aria-label="Share profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onFollow?.(id)}
            className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
            aria-label="Follow user"
          >
            <UserPlus className="w-4 h-4" />
          </button>

          {/* Primary action on right */}
          {renderPrimaryAction()}
        </div>
      </div>

      {/* Click outside to close overflow menu */}
      {showOverflow && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowOverflow(false)}
        />
      )}
    </div>
  )
}
