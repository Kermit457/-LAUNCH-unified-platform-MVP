/**
 * RoomManagementCard - Individual room card with quick actions
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ExternalLink,
  Users,
  Clock,
  Zap,
  TrendingUp,
  Timer,
  XCircle,
  MoreVertical,
  BarChart3,
  CheckCircle,
} from 'lucide-react'
import { useExtendRoom } from '@/hooks/blast/useExtendRoom'
import { useCloseRoom } from '@/hooks/blast/useCloseRoom'
import type { Room } from '@/lib/types/blast'
import { Countdown } from '@/components/blast/shared/Countdown'

interface RoomManagementCardProps {
  room: Room
}

export function RoomManagementCard({ room }: RoomManagementCardProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const extendMutation = useExtendRoom(room.$id)
  const closeMutation = useCloseRoom(room.$id)

  const getRoomTypeColor = () => {
    switch (room.type) {
      case 'deal':
        return 'from-green-500 to-emerald-500'
      case 'airdrop':
        return 'from-purple-500 to-pink-500'
      case 'job':
        return 'from-blue-500 to-cyan-500'
      case 'collab':
        return 'from-cyan-500 to-teal-500'
      case 'funding':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-zinc-500 to-zinc-600'
    }
  }

  const getStatusBadge = () => {
    switch (room.status) {
      case 'hot':
        return (
          <div className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Hot
          </div>
        )
      case 'closing':
        return (
          <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Closing Soon
          </div>
        )
      case 'closed':
        return (
          <div className="px-3 py-1 rounded-full bg-zinc-700/50 text-zinc-500 text-xs font-bold">
            Closed
          </div>
        )
      case 'open':
        return (
          <div className="px-3 py-1 rounded-full bg-[#00FF88]/20 text-[#00FF88] text-xs font-bold">
            Open
          </div>
        )
      default:
        return null
    }
  }

  const handleExtend = () => {
    if (window.confirm('Extend this room by 24 hours?')) {
      extendMutation.mutate()
    }
    setShowMenu(false)
  }

  const handleClose = () => {
    if (
      window.confirm(
        'Close this room early? Applicants will be refunded and the room will become inactive.'
      )
    ) {
      closeMutation.mutate()
    }
    setShowMenu(false)
  }

  const pendingApplicants = room.applicantCount || 0
  const fillPercentage = room.maxSlots ? (room.filledSlots / room.maxSlots) * 100 : 0

  return (
    <div className="btdemo-glass rounded-xl p-6 border border-zinc-800 hover:border-[#00FF88]/30 transition-all">
      <div className="flex items-start gap-4">
        {/* Left - Room Info */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRoomTypeColor()} text-white text-xs font-bold uppercase`}
            >
              {room.type}
            </div>
            {getStatusBadge()}
          </div>

          {/* Title */}
          <h3 className="text-lg font-black text-white mb-2 leading-tight">
            {room.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{room.description}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-xs text-zinc-500 mb-1">Applicants</div>
              <div className="text-lg font-bold text-white flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-400" />
                {pendingApplicants}
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-500 mb-1">Motion</div>
              <div className="text-lg font-bold text-[#00FF88] flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {room.motionScore}
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-500 mb-1">Min Keys</div>
              <div className="text-lg font-bold text-white">{room.minKeys || 0}</div>
            </div>

            <div>
              <div className="text-xs text-zinc-500 mb-1">Slots</div>
              <div className="text-lg font-bold text-white">
                {room.filledSlots}/{room.maxSlots || '∞'}
              </div>
            </div>
          </div>

          {/* Progress Bar (if maxSlots exists) */}
          {room.maxSlots && (
            <div className="mb-4">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPercentage}%` }}
                  className={`h-full bg-gradient-to-r ${getRoomTypeColor()}`}
                />
              </div>
            </div>
          )}

          {/* Time Remaining */}
          {room.status !== 'closed' && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Clock className="w-4 h-4" />
              <Countdown endTime={room.endTime} />
            </div>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push(`/BLAST/room/${room.$id}`)}
            className="btdemo-btn-glass w-10 h-10 flex items-center justify-center"
            title="View Room"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push(`/BLAST/room/${room.$id}?tab=analytics`)}
            className="btdemo-btn-glass w-10 h-10 flex items-center justify-center"
            title="Analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Actions Menu */}
          {room.status !== 'closed' && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="btdemo-btn-glass w-10 h-10 flex items-center justify-center"
                title="More Actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 mt-2 w-48 btdemo-glass rounded-xl border border-zinc-800 p-2 z-50"
                >
                  {room.status === 'hot' && !room.extended && (
                    <button
                      onClick={handleExtend}
                      disabled={extendMutation.isPending}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-zinc-800 text-sm text-white disabled:opacity-50"
                    >
                      <Timer className="w-4 h-4 inline mr-2" />
                      {extendMutation.isPending ? 'Extending...' : 'Extend 24h'}
                    </button>
                  )}

                  {room.extended && (
                    <div className="px-4 py-2 text-xs text-zinc-500">
                      <CheckCircle className="w-3 h-3 inline mr-2" />
                      Already extended
                    </div>
                  )}

                  <div className="h-px bg-zinc-800 my-1" />

                  <button
                    onClick={handleClose}
                    disabled={closeMutation.isPending}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-zinc-800 text-sm text-red-400 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    {closeMutation.isPending ? 'Closing...' : 'Close Early'}
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
