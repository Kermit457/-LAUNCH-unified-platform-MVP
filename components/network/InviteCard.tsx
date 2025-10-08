"use client"

import { Check, X, Clock } from 'lucide-react'
import { NetworkInvite } from '@/lib/appwrite/services/network'
import { useState } from 'react'

interface InviteCardProps {
  invite: NetworkInvite
  senderName?: string
  senderAvatar?: string
  senderUsername?: string
  onAccept: (inviteId: string) => Promise<void>
  onReject: (inviteId: string) => Promise<void>
}

export function InviteCard({
  invite,
  senderName,
  senderAvatar,
  senderUsername,
  onAccept,
  onReject
}: InviteCardProps) {
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'accept' | 'reject' | null>(null)

  const handleAccept = async () => {
    try {
      setLoading(true)
      setAction('accept')
      await onAccept(invite.$id)
    } catch (error) {
      console.error('Failed to accept invite:', error)
    } finally {
      setLoading(false)
      setAction(null)
    }
  }

  const handleReject = async () => {
    try {
      setLoading(true)
      setAction('reject')
      await onReject(invite.$id)
    } catch (error) {
      console.error('Failed to reject invite:', error)
    } finally {
      setLoading(false)
      setAction(null)
    }
  }

  const displayName = senderName || senderUsername || 'Unknown User'
  const handle = senderUsername ? `@${senderUsername}` : ''
  const timeAgo = getTimeAgo(new Date(invite.$createdAt))

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 overflow-hidden">
        {senderAvatar ? (
          <img src={senderAvatar} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          displayName.slice(0, 2).toUpperCase()
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{displayName}</h3>
        {handle && (
          <p className="text-sm text-white/60 truncate">{handle}</p>
        )}
        {invite.message && (
          <p className="text-sm text-white/70 mt-1 line-clamp-2">{invite.message}</p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleAccept}
          disabled={loading}
          className="w-10 h-10 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 hover:border-green-500/60 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Accept invite"
        >
          {action === 'accept' ? (
            <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Check className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
          )}
        </button>
        <button
          onClick={handleReject}
          disabled={loading}
          className="w-10 h-10 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Reject invite"
        >
          {action === 'reject' ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <X className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}
