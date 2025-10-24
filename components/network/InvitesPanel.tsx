'use client'

import { useState } from 'react'
import { Invite } from '@/lib/types'
import { InviteRow } from './InviteRow'
import { UserPlus, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { rankInvites } from '@/lib/inviteRanking'

interface InvitesPanelProps {
  invites: Invite[]
  myRoles?: string[]
  onAccept: (id: string) => void
  onDecline: (id: string) => void
  onChat: (id: string) => void
  onBulkAccept?: (ids: string[]) => void
  onBulkDecline?: (ids: string[]) => void
}

type FilterType = 'all' | 'priority' | 'unread'

export function InvitesPanel({
  invites,
  myRoles = [],
  onAccept,
  onDecline,
  onChat,
  onBulkAccept,
  onBulkDecline
}: InvitesPanelProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Rank invites by priority
  const rankedInvites = rankInvites(invites.filter(inv => inv.status === 'pending'), myRoles)

  // Apply filters
  const filteredInvites = rankedInvites.filter(inv => {
    if (filter === 'priority') return inv.priority >= 0.5
    if (filter === 'unread') return true // all pending invites are "unread"
    return true
  })

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelected(next)
  }

  const toggleSelectAll = () => {
    if (selected.size === filteredInvites.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredInvites.map(inv => inv.id)))
    }
  }

  const handleBulkAccept = () => {
    if (onBulkAccept) {
      onBulkAccept(Array.from(selected))
      setSelected(new Set())
    }
  }

  const handleBulkDecline = () => {
    if (onBulkDecline) {
      onBulkDecline(Array.from(selected))
      setSelected(new Set())
    }
  }

  if (invites.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
        <h2 className="text-lg font-bold text-white mb-4">Invites</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/60 text-sm">No invites. Get discovered by creating a campaign.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Invites</h2>

        {/* Filter chips */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-all',
              filter === 'all' ? 'bg-[#D1FD0A] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('priority')}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-all',
              filter === 'priority' ? 'bg-[#D1FD0A] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            Priority
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-medium transition-all',
              filter === 'unread' ? 'bg-[#D1FD0A] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Bulk actions toolbar */}
      {selected.size > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-[#D1FD0A]/20 border border-[#D1FD0A]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selected.size === filteredInvites.length}
              onChange={toggleSelectAll}
              className="rounded border-white/20 bg-white/5 focus:ring-2 focus:ring-[#D1FD0A]/50"
            />
            <span className="text-sm text-white font-medium">
              {selected.size} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkAccept}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-black text-xs font-medium hover:opacity-90 transition-all flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Bulk Accept
            </button>
            <button
              onClick={handleBulkDecline}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-medium transition-all flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Bulk Decline
            </button>
          </div>
        </div>
      )}

      {/* Invites list */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        {filteredInvites.map((invite) => (
          <InviteRow
            key={invite.id}
            invite={invite}
            selected={selected.has(invite.id)}
            onToggleSelect={() => toggleSelect(invite.id)}
            onAccept={() => {
              onAccept(invite.id)
              if (selected.has(invite.id)) {
                const next = new Set(selected)
                next.delete(invite.id)
                setSelected(next)
              }
            }}
            onChat={() => onChat(invite.id)}
            onDecline={() => {
              onDecline(invite.id)
              if (selected.has(invite.id)) {
                const next = new Set(selected)
                next.delete(invite.id)
                setSelected(next)
              }
            }}
            onMute={() => console.log('Mute:', invite.id)}
            onReport={() => console.log('Report:', invite.id)}
          />
        ))}
      </div>

      {filteredInvites.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/60 text-sm">No {filter} invites</p>
        </div>
      )}
    </div>
  )
}
