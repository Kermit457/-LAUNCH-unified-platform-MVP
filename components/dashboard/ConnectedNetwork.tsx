'use client'

import { MessageSquare, MoreVertical } from 'lucide-react'
import { useState } from 'react'

interface Connection {
  id: string
  user: {
    handle: string
    name: string
    avatar: string
  }
  lastMessage?: string
  lastMessageTime?: number
  unreadCount?: number
  online?: boolean
}

interface ConnectedNetworkProps {
  connections: Connection[]
  onOpenChat: (id: string) => void
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  return `${Math.floor(seconds / 604800)}w`
}

export function ConnectedNetwork({ connections, onOpenChat }: ConnectedNetworkProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredConnections = filter === 'unread'
    ? connections.filter(c => c.unreadCount && c.unreadCount > 0)
    : connections

  if (connections.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
        <h2 className="text-lg font-bold text-white mb-4">Connected Network</h2>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white/30" />
          </div>
          <p className="text-white/60 text-sm">No connections yet</p>
          <p className="text-white/40 text-xs mt-1">Accept invites to start networking</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      {/* Header with filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Connected Network</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-lime-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === 'unread'
                ? 'bg-lime-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Connections list */}
      <div className="space-y-2">
        {filteredConnections.map((connection) => (
          <div
            key={connection.id}
            onClick={() => onOpenChat(connection.id)}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-500 via-lime-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {connection.user.name.slice(0, 2).toUpperCase()}
                </div>
                {connection.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0B0F1A] rounded-full" />
                )}
              </div>

              {/* User info and message preview */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white text-sm truncate">
                    {connection.user.handle}
                  </span>
                  {connection.lastMessageTime && (
                    <span className="text-xs text-white/40 ml-2 flex-shrink-0">
                      {timeAgo(connection.lastMessageTime)}
                    </span>
                  )}
                </div>
                {connection.lastMessage && (
                  <p className="text-xs text-white/60 truncate">
                    {connection.lastMessage}
                  </p>
                )}
              </div>

              {/* Unread badge or chat icon */}
              <div className="flex-shrink-0">
                {connection.unreadCount && connection.unreadCount > 0 ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-lime-500 to-lime-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {connection.unreadCount > 9 ? '9+' : connection.unreadCount}
                    </span>
                  </div>
                ) : (
                  <MessageSquare className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredConnections.length === 0 && filter === 'unread' && (
        <div className="text-center py-8">
          <p className="text-white/60 text-sm">No unread messages</p>
        </div>
      )}
    </div>
  )
}