"use client"

import { useState } from 'react'
import { Bell, BellOff, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
  entityId: string
  entityType: 'project' | 'user' | 'community'
  initialFollowing?: boolean
  onFollow?: (entityId: string, following: boolean) => void
  variant?: 'default' | 'compact'
  className?: string
}

export function FollowButton({
  entityId,
  entityType,
  initialFollowing = false,
  onFollow,
  variant = 'default',
  className
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [showNotifMenu, setShowNotifMenu] = useState(false)

  const handleToggleFollow = () => {
    const newState = !following
    setFollowing(newState)
    onFollow?.(entityId, newState)

    if (newState) {
      // Show notification menu briefly
      setShowNotifMenu(true)
      setTimeout(() => setShowNotifMenu(false), 3000)
    } else {
      setShowNotifMenu(false)
    }
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggleFollow}
        className={cn(
          'p-2 rounded-lg transition-all',
          following
            ? 'bg-[#00FF88]/10 text-[#00FF88] hover:bg-[#00FF88]/20'
            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800',
          className
        )}
        title={following ? 'Unfollow' : 'Follow'}
      >
        {following ? (
          <Check className="w-4 h-4" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
      </button>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={handleToggleFollow}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all',
          following
            ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 hover:bg-[#00FF88]/20'
            : 'bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800'
        )}
      >
        {following ? (
          <>
            <Check className="w-4 h-4" />
            Following
          </>
        ) : (
          <>
            <Bell className="w-4 h-4" />
            Follow
          </>
        )}
      </button>

      {/* Notification Preferences Dropdown */}
      {showNotifMenu && (
        <div className="absolute top-full mt-2 left-0 w-64 glass-premium p-4 rounded-xl border border-zinc-800 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
          <div className="text-sm font-medium mb-3">Notify me when:</div>
          <div className="space-y-2">
            {[
              { id: 'launch', label: 'New launch', icon: '🚀' },
              { id: 'freeze', label: 'Curve freezes', icon: '❄️' },
              { id: 'milestone', label: 'Milestone reached', icon: '🎯' },
              { id: 'buyback', label: 'Buyback executed', icon: '🔥' }
            ].map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-[#00FF88] focus:ring-[#00FF88]/20"
                />
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => setShowNotifMenu(false)}
            className="w-full mt-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
