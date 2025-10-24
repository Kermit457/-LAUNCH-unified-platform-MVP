"use client"

import { UserPlus, Check, X } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { useRealtimeNetworkInvites } from '@/hooks/useRealtimeNetworkInvites'
import { acceptNetworkInvite, rejectNetworkInvite } from '@/lib/appwrite/services/network'
import { getUsersByIds } from '@/lib/appwrite/services/users'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import Link from 'next/link'

interface UserProfile {
  userId: string
  username: string
  displayName?: string
  avatar?: string
}

export function NetworkInvitesWidget() {
  const { userId } = useUser()
  const { success, error: showError } = useToast()
  const { invites, pendingCount } = useRealtimeNetworkInvites(
    userId || '',
    'received',
    'pending'
  )

  const [inviteSenders, setInviteSenders] = useState<Record<string, UserProfile>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch senders
  useEffect(() => {
    async function fetchSenders() {
      if (invites.length === 0) return

      const senderIds = Array.from(new Set(invites.map(inv => inv.senderId)))
      const users = await getUsersByIds(senderIds)

      const senderMap: Record<string, UserProfile> = {}
      users.forEach(user => {
        senderMap[user.userId] = user as UserProfile
      })

      setInviteSenders(senderMap)
    }

    fetchSenders()
  }, [invites])

  const handleAccept = async (inviteId: string) => {
    try {
      setActionLoading(inviteId)
      await acceptNetworkInvite(inviteId)
      success('Invite accepted!')
    } catch (error: any) {
      showError(error.message || 'Failed to accept')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (inviteId: string) => {
    try {
      setActionLoading(inviteId)
      await rejectNetworkInvite(inviteId)
      success('Invite rejected')
    } catch (error: any) {
      showError(error.message || 'Failed to reject')
    } finally {
      setActionLoading(null)
    }
  }

  if (!userId || pendingCount === 0) {
    return null
  }

  // Show max 3 invites
  const displayInvites = invites.slice(0, 3)

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-lime-400" />
          <h3 className="font-semibold text-white">Network Invites</h3>
          <span className="px-2 py-0.5 bg-lime-500 text-white text-xs font-bold rounded-full">
            {pendingCount}
          </span>
        </div>
        <Link
          href="/network?tab=invites"
          className="text-sm text-lime-400 hover:text-lime-300 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {displayInvites.map(invite => {
          const sender = inviteSenders[invite.senderId]
          const displayName = sender?.displayName || sender?.username || 'Unknown'
          const isLoading = actionLoading === invite.$id

          return (
            <div
              key={invite.$id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 overflow-hidden">
                {sender?.avatar ? (
                  <img src={sender.avatar} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  displayName.slice(0, 2).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{displayName}</p>
                {sender?.username && (
                  <p className="text-xs text-white/60 truncate">@{sender.username}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleAccept(invite.$id)}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 flex items-center justify-center transition-all disabled:opacity-50"
                  aria-label="Accept"
                >
                  <Check className="w-4 h-4 text-green-400" />
                </button>
                <button
                  onClick={() => handleReject(invite.$id)}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 flex items-center justify-center transition-all disabled:opacity-50"
                  aria-label="Reject"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {pendingCount > 3 && (
        <div className="mt-3 text-center">
          <Link
            href="/network?tab=invites"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            +{pendingCount - 3} more invites
          </Link>
        </div>
      )}
    </div>
  )
}
