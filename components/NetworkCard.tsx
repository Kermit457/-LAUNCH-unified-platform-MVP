'use client'

import { useState } from 'react'
import { MessageSquare, UserPlus, Share2, Users as UsersIcon, Megaphone, MoreVertical, Pin, BellOff, Ban, Flag, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type ConnectionState = "none" | "pending" | "connected" | "blocked"

export type NetworkCardProps = {
  id: string
  name: string
  handle: string
  roles: string[]
  verified?: boolean
  avatarUrl?: string
  mutuals?: number
  connection: ConnectionState
  isSelf?: boolean
  socials?: {
    twitter?: boolean
    youtube?: boolean
    twitch?: boolean
    website?: boolean
  }
  // actions
  onInvite?: (id: string) => void
  onCancelInvite?: (id: string) => void
  onChat?: (id: string) => void
  onFollow?: (id: string) => void
  onShare?: (id: string) => void
  onInviteToCampaign?: (id: string) => void
  onEditProfile?: () => void
}

const ROLE_COLORS: Record<string, string> = {
  Streamer: "bg-lime-500/20 text-lime-300 border-lime-500/40",
  Degen: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  Trader: "bg-green-500/20 text-green-300 border-green-500/40",
  Clipper: "bg-pink-500/20 text-pink-300 border-pink-500/40",
  Editor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Agency: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  Manager: "bg-lime-500/20 text-lime-300 border-lime-500/40",
  Project: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  Entertainer: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  Alpha: "bg-red-500/20 text-red-300 border-red-500/40",
}

export function NetworkCard({
  id,
  name,
  handle,
  roles,
  verified = false,
  avatarUrl,
  mutuals,
  connection,
  isSelf = false,
  socials = {},
  onInvite,
  onCancelInvite,
  onChat,
  onFollow,
  onShare,
  onInviteToCampaign,
  onEditProfile,
}: NetworkCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const avatarInitials = avatarUrl || name.slice(0, 2).toUpperCase()

  // Primary button logic
  const renderPrimaryButton = () => {
    if (isSelf) {
      return (
        <button
          onClick={onEditProfile}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80 flex items-center gap-2"
        >
          Edit Profile
        </button>
      )
    }

    if (connection === "connected") {
      return (
        <button
          onClick={() => onChat?.(id)}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80 flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
      )
    }

    if (connection === "pending") {
      return (
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            disabled
            className="h-10 px-4 rounded-xl bg-white/10 text-white/60 text-sm font-medium cursor-not-allowed opacity-60 focus:outline-none"
          >
            Invited
          </button>
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 rounded-lg text-xs text-white whitespace-nowrap shadow-lg">
              Awaiting response
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        onClick={() => onInvite?.(id)}
        className="h-10 px-4 rounded-xl bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80 flex items-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Invite
      </button>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:border-lime-500/30 transition-all group">
      {/* Avatar & Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lime-500 via-lime-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-lg truncate">{name}</h3>
            {verified && (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <p className="text-white/60 text-sm">{handle}</p>
        </div>
      </div>

      {/* Roles */}
      <div className="flex flex-wrap gap-2 mb-3">
        {roles.map(role => (
          <span
            key={role}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold border",
              ROLE_COLORS[role] || "bg-white/10 text-white/70 border-white/20"
            )}
          >
            {role}
          </span>
        ))}
      </div>

      {/* Mutuals */}
      {mutuals !== undefined && mutuals > 0 && (
        <div className="mb-3">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
            <UsersIcon className="w-3 h-3" />
            {mutuals} mutuals
          </div>
        </div>
      )}

      {/* Social Icons */}
      {(socials.twitter || socials.youtube || socials.twitch || socials.website) && (
        <div className="flex items-center gap-3 mb-4">
          {socials.twitter && (
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
          )}
          {socials.youtube && (
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          )}
          {socials.twitch && (
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
            </div>
          )}
          {socials.website && (
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Action Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Secondary actions (left) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShare?.(id)}
            className="h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>

          <button
            onClick={() => onFollow?.(id)}
            className="h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80"
          >
            Follow
          </button>

          {connection === "connected" && onInviteToCampaign && (
            <button
              onClick={() => onInviteToCampaign(id)}
              className="h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80 flex items-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              Invite to Campaign
            </button>
          )}
        </div>

        {/* Primary action + overflow menu (right) */}
        <div className="flex items-center gap-2">
          {renderPrimaryButton()}

          {/* Overflow menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80 flex items-center justify-center"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-[#0B0F1A] border border-white/10 shadow-xl z-20 py-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                    <Pin className="w-4 h-4" />
                    Pin
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                    <BellOff className="w-4 h-4" />
                    Mute
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                    <Ban className="w-4 h-4" />
                    Block
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Report
                  </button>
                  {connection === "pending" && onCancelInvite && (
                    <>
                      <div className="h-px bg-white/10 my-1" />
                      <button
                        onClick={() => {
                          onCancelInvite(id)
                          setMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        Cancel invite
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
