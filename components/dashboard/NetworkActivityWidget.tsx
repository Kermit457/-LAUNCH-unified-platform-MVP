"use client"

import { useNetwork } from '@/lib/contexts/NetworkContext'
import { Check, X, MessageCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'

export function NetworkActivityWidget() {
  const { invites, messages, pendingInvitesCount, unreadMessagesCount, acceptInvite, declineInvite } = useNetwork()

  const pendingInvites = invites.filter(i => i.status === 'pending').slice(0, 3)
  const recentMessages = messages.filter(m => m.status === 'unread').slice(0, 3)

  if (pendingInvitesCount === 0 && unreadMessagesCount === 0) {
    return null
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-fuchsia-400" />
          Network Activity
        </h3>
        <Link
          href="/network"
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Pending Invites */}
      {pendingInvitesCount > 0 && (
        <div className="mb-6">
          <div className="text-sm text-zinc-500 uppercase tracking-wide mb-3">
            Pending Invites ({pendingInvitesCount})
          </div>
          <div className="space-y-3">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {invite.avatar ? (
                      <img src={invite.avatar} alt={invite.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                        {invite.displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{invite.displayName}</div>
                    <div className="text-xs text-zinc-500">@{invite.username}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => acceptInvite(invite.id)}
                    className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 transition-colors"
                    title="Accept"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => declineInvite(invite.id)}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 transition-colors"
                    title="Decline"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unread Messages */}
      {unreadMessagesCount > 0 && (
        <div>
          <div className="text-sm text-zinc-500 uppercase tracking-wide mb-3">
            Unread Messages ({unreadMessagesCount})
          </div>
          <div className="space-y-2">
            {recentMessages.map((message) => (
              <Link
                key={message.id}
                href={`/messages/${message.userId}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-fuchsia-500/50 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  {message.avatar ? (
                    <img src={message.avatar} alt={message.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                      {message.displayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-fuchsia-400 transition-colors truncate">
                    {message.displayName}
                  </div>
                  <div className="text-xs text-zinc-500 truncate">
                    {message.metadata?.message || 'New message'}
                  </div>
                </div>

                {/* Icon */}
                <MessageCircle className="w-4 h-4 text-pink-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
