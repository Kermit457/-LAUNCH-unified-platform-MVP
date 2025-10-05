'use client'

import { Thread } from '@/lib/types'
import { Hash, Users, Pin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoomsListProps {
  rooms: Thread[]
  onSelectRoom: (roomId: string) => void
  selectedRoomId?: string
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}

export function RoomsList({ rooms, onSelectRoom, selectedRoomId }: RoomsListProps) {
  const groupRooms = rooms.filter(r => r.type === 'group')

  // Sort: pinned first, then by last message time
  const sortedRooms = [...groupRooms].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.lastMsgAt - a.lastMsgAt
  })

  if (sortedRooms.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
        <h2 className="text-lg font-bold text-white mb-4">Rooms</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Users className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/60 text-sm">No rooms. Start a group with your connections.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6">
      <h2 className="text-lg font-bold text-white mb-4">Rooms</h2>

      <div className="space-y-2">
        {sortedRooms.map(room => (
          <div
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={cn(
              'p-3 rounded-lg border transition-colors cursor-pointer',
              selectedRoomId === room.id
                ? 'bg-purple-500/20 border-purple-500/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            )}
          >
            <div className="flex items-center gap-3">
              {/* Room icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Hash className="w-5 h-5 text-fuchsia-400" />
              </div>

              {/* Room info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm truncate">
                    {room.name || 'Unnamed Room'}
                  </span>
                  {room.pinned && (
                    <Pin className="w-3 h-3 text-fuchsia-400 fill-fuchsia-400 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <Users className="w-3 h-3" />
                    {room.participantUserIds.length}
                  </div>
                  <span className="text-xs text-white/40">
                    {timeAgo(room.lastMsgAt)}
                  </span>
                </div>
              </div>

              {/* Unread badge */}
              {room.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">
                    {room.unread > 9 ? '9+' : room.unread}
                  </span>
                </div>
              )}
            </div>

            {/* Project/Campaign tags */}
            {(room.projectId || room.campaignId) && (
              <div className="mt-2 flex items-center gap-2">
                {room.projectId && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Project
                  </span>
                )}
                {room.campaignId && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                    Campaign
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}