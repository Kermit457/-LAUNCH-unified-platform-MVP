'use client'

import { UserPlus, X } from 'lucide-react'

interface Invite {
  id: string
  user: {
    handle: string
    name: string
    avatar: string
  }
  mutualConnections: number
}

interface NetworkInvitesProps {
  invites: Invite[]
  onAccept: (id: string) => void
  onDecline: (id: string) => void
}

export function NetworkInvites({ invites, onAccept, onDecline }: NetworkInvitesProps) {
  if (invites.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
        <h2 className="text-lg font-bold text-white mb-4">Network Invites</h2>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white/30" />
          </div>
          <p className="text-white/60 text-sm">No pending invites</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      <h2 className="text-lg font-bold text-white mb-4">Network Invites</h2>

      <div className="space-y-3">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            {/* User info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-500 via-lime-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {invite.user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">
                  {invite.user.handle}
                </div>
                <div className="text-xs text-white/50">
                  {invite.mutualConnections} mutual connection{invite.mutualConnections !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAccept(invite.id)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-lime-500 via-lime-500 to-cyan-500 text-white text-xs font-medium hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80"
              >
                Accept
              </button>
              <button
                onClick={() => onDecline(invite.id)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-lime-400/80"
                aria-label="Decline invite"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
