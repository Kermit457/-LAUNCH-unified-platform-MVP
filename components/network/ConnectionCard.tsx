"use client"

import { MessageCircle, UserMinus, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface ConnectionCardProps {
  userId: string
  name: string
  username?: string
  avatar?: string
  bio?: string
  roles?: string[]
  mutualCount?: number
  onRemove?: (userId: string) => Promise<void>
}

export function ConnectionCard({
  userId,
  name,
  username,
  avatar,
  bio,
  roles = [],
  mutualCount = 0,
  onRemove
}: ConnectionCardProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleRemove = async () => {
    if (!onRemove) return

    try {
      setLoading(true)
      await onRemove(userId)
    } catch (error) {
      console.error('Failed to remove connection:', error)
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  const displayName = name || username || 'Unknown User'
  const handle = username ? `@${username}` : ''

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link
          href={`/profile/${userId}`}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden hover:scale-105 transition-transform"
        >
          {avatar ? (
            <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            displayName.slice(0, 2).toUpperCase()
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${userId}`} className="hover:text-fuchsia-400 transition-colors">
            <h3 className="font-semibold text-white truncate">{displayName}</h3>
          </Link>
          {handle && (
            <p className="text-sm text-white/60 truncate">{handle}</p>
          )}

          {/* Roles */}
          {roles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {roles.slice(0, 3).map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 rounded text-xs font-medium bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                >
                  {role}
                </span>
              ))}
              {roles.length > 3 && (
                <span className="px-2 py-0.5 rounded text-xs font-medium text-white/60">
                  +{roles.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-white/70 line-clamp-2">{bio}</p>
      )}

      {/* Mutual Connections */}
      {mutualCount > 0 && (
        <div className="text-xs text-white/50">
          {mutualCount} mutual connection{mutualCount !== 1 ? 's' : ''}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <Link
          href={`/messages/${userId}`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-fuchsia-500/40 transition-all text-sm font-medium text-white/80 hover:text-white"
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </Link>

        <Link
          href={`/profile/${userId}`}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 transition-all"
          aria-label="View profile"
        >
          <ExternalLink className="w-4 h-4 text-white/70 hover:text-cyan-400" />
        </Link>

        {onRemove && !showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 transition-all group"
            aria-label="Remove connection"
          >
            <UserMinus className="w-4 h-4 text-white/70 group-hover:text-red-400" />
          </button>
        )}

        {showConfirm && (
          <button
            onClick={handleRemove}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 transition-all text-sm font-medium text-red-400 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <UserMinus className="w-4 h-4" />
                Confirm Remove
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
