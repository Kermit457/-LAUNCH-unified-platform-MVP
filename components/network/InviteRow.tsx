'use client'

import { Invite, Role } from '@/lib/types'
import { Check, X, MessageSquare, MoreVertical, BellOff, Flag } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface InviteRowProps {
  invite: Invite
  selected?: boolean
  onToggleSelect?: () => void
  onAccept: () => void
  onChat: () => void
  onDecline: () => void
  onMute?: () => void
  onReport?: () => void
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}

export function InviteRow({
  invite,
  selected,
  onToggleSelect,
  onAccept,
  onChat,
  onDecline,
  onMute,
  onReport
}: InviteRowProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className={cn(
      'p-3 rounded-lg border transition-colors',
      selected ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
    )}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="mt-1 rounded border-white/20 bg-white/5 focus:ring-2 focus:ring-fuchsia-400/80"
          />
        )}

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {invite.fromHandle.slice(1, 3).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{invite.fromHandle}</span>
            {invite.mutuals > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {invite.mutuals} mutual{invite.mutuals !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Pills for role/offer */}
          <div className="flex items-center gap-2 mb-2">
            {invite.role && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                {invite.role}
              </span>
            )}
            {invite.offer && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                {invite.offer}
              </span>
            )}
            {invite.project && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {invite.project.name}
              </span>
            )}
          </div>

          {invite.note && (
            <p className="text-xs text-white/60 mb-2 line-clamp-2">{invite.note}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">{timeAgo(invite.sentAt)}</span>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Show different buttons based on invite status */}
              {invite.status === 'sent' ? (
                // For sent invites, just show pending status
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30">
                  Pending Response
                </span>
              ) : (
                // For received invites, show accept/decline buttons
                <>
                  <button
                    onClick={onAccept}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white text-xs font-medium hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                    aria-label="Accept invite"
                  >
                    <Check className="w-3 h-3 inline mr-1" />
                    Accept
                  </button>
                  <button
                    onClick={onChat}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                    aria-label="Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onDecline}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                    aria-label="Decline"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Overflow menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-[#0B0F1A] border border-white/10 rounded-lg shadow-xl z-10">
                    {onMute && (
                      <button
                        onClick={() => { onMute(); setShowMenu(false) }}
                        className="w-full px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 flex items-center gap-2 rounded-t-lg"
                      >
                        <BellOff className="w-4 h-4" />
                        Mute sender
                      </button>
                    )}
                    {onReport && (
                      <button
                        onClick={() => { onReport(); setShowMenu(false) }}
                        className="w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/20 flex items-center gap-2 rounded-b-lg"
                      >
                        <Flag className="w-4 h-4" />
                        Report
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
