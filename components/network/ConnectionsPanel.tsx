'use client'

import { useState } from 'react'
import { Connection } from '@/lib/types'
import { Users, MessageSquare, Megaphone, Search, Pin, BellOff, X, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConnectionsPanelProps {
  connections: Connection[]
  onDM: (userId: string) => void
  onInviteToCampaign?: (userId: string) => void
  onPin?: (userId: string) => void
  onMute?: (userId: string) => void
  onRemove?: (userId: string) => void
  onStartGroup?: (userIds: string[]) => void
}

export function ConnectionsPanel({
  connections,
  onDM,
  onInviteToCampaign,
  onPin,
  onMute,
  onRemove,
  onStartGroup
}: ConnectionsPanelProps) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [selectedForGroup, setSelectedForGroup] = useState<Set<string>>(new Set())

  // Get unique roles
  const allRoles = Array.from(new Set(connections.flatMap(c => c.roles)))

  // Filter connections
  const filteredConnections = connections.filter(conn => {
    if (search && !conn.handle.toLowerCase().includes(search.toLowerCase()) &&
        !conn.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (roleFilter && !conn.roles.includes(roleFilter)) return false
    if (showUnreadOnly && conn.unread === 0) return false
    if (showOnlineOnly) {
      const isOnline = Date.now() - conn.lastActive < 5 * 60 * 1000
      if (!isOnline) return false
    }
    return true
  })

  // Sort: pinned first, then by unread, then by last active
  const sortedConnections = [...filteredConnections].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (a.unread !== b.unread) return b.unread - a.unread
    return b.lastActive - a.lastActive
  })

  const toggleGroupSelect = (userId: string) => {
    const next = new Set(selectedForGroup)
    if (next.has(userId)) {
      next.delete(userId)
    } else {
      next.add(userId)
    }
    setSelectedForGroup(next)
  }

  const handleStartGroup = () => {
    if (onStartGroup && selectedForGroup.size > 0) {
      onStartGroup(Array.from(selectedForGroup))
      setSelectedForGroup(new Set())
    }
  }

  if (connections.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
        <h2 className="text-lg font-bold text-white mb-4">Connections</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Users className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/60 text-sm">No connections yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Connections</h2>
        {selectedForGroup.size > 0 && onStartGroup && (
          <button
            onClick={handleStartGroup}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-black text-xs font-medium hover:opacity-90 transition-all flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            Start Group ({selectedForGroup.size})
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search connections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-white/40" />
        {allRoles.map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? null : role)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
              roleFilter === role
                ? 'bg-[#D1FD0A] text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            {role}
          </button>
        ))}
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={cn(
            'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
            showUnreadOnly
              ? 'bg-[#D1FD0A] text-black'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          )}
        >
          Unread
        </button>
        <button
          onClick={() => setShowOnlineOnly(!showOnlineOnly)}
          className={cn(
            'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
            showOnlineOnly
              ? 'bg-[#D1FD0A] text-black'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          )}
        >
          Online
        </button>
      </div>

      {/* Connections list */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
        {sortedConnections.map((conn) => {
          const isOnline = Date.now() - conn.lastActive < 5 * 60 * 1000

          return (
            <div
              key={conn.userId}
              className={cn(
                'p-3 rounded-lg border transition-colors',
                selectedForGroup.has(conn.userId)
                  ? 'bg-[#D1FD0A]/20 border-[#D1FD0A]/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Multi-select checkbox */}
                {onStartGroup && (
                  <input
                    type="checkbox"
                    checked={selectedForGroup.has(conn.userId)}
                    onChange={() => toggleGroupSelect(conn.userId)}
                    className="rounded border-white/20 bg-white/5 focus:ring-2 focus:ring-[#D1FD0A]/50"
                  />
                )}

                {/* Avatar with online status */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D1FD0A] to-[#B8E008] flex items-center justify-center text-black font-bold text-sm">
                    {conn.name.slice(0, 2).toUpperCase()}
                  </div>
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0B0F1A] rounded-full" />
                  )}
                  {conn.pinned && (
                    <div className="absolute -top-1 -right-1">
                      <Pin className="w-3 h-3 text-[#D1FD0A] fill-[#D1FD0A]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm truncate">{conn.handle}</span>
                    {conn.verified && (
                      <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {conn.roles.map((role, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-[#D1FD0A]/20 text-[#D1FD0A] border border-[#D1FD0A]/30">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Unread badge */}
                {conn.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-black">
                      {conn.unread > 9 ? '9+' : conn.unread}
                    </span>
                  </div>
                )}

                {/* Quick actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDM(conn.userId)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50"
                    title="DM"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  {onInviteToCampaign && (
                    <button
                      onClick={() => onInviteToCampaign(conn.userId)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50"
                      title="Invite to Campaign"
                    >
                      <Megaphone className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sortedConnections.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/60 text-sm">No connections match your filters</p>
        </div>
      )}
    </div>
  )
}
