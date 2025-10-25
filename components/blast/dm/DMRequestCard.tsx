/**
 * DMRequestCard - Display incoming/outgoing DM requests
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Coins,
  Loader2,
} from 'lucide-react'
import { useRespondDMRequest } from '@/hooks/blast/useRespondDMRequest'
import type { DMRequest } from '@/lib/types/blast'

interface DMRequestCardProps {
  request: DMRequest
  direction: 'incoming' | 'outgoing'
}

export function DMRequestCard({ request, direction }: DMRequestCardProps) {
  const { accept, decline, isAccepting, isDeclining } = useRespondDMRequest()
  const [showMessage, setShowMessage] = useState(false)

  const getStatusColor = () => {
    switch (request.status) {
      case 'accepted':
        return 'border-[#00FF88] bg-[#00FF88]/5'
      case 'declined':
      case 'expired':
        return 'border-red-500 bg-red-500/5'
      default:
        return 'border-zinc-800'
    }
  }

  const getStatusLabel = () => {
    switch (request.status) {
      case 'accepted':
        return { label: 'Accepted', icon: CheckCircle, color: 'text-[#00FF88]' }
      case 'declined':
        return { label: 'Declined', icon: XCircle, color: 'text-red-400' }
      case 'expired':
        return { label: 'Expired', icon: Clock, color: 'text-zinc-500' }
      default:
        return { label: 'Pending', icon: Clock, color: 'text-yellow-400' }
    }
  }

  const status = getStatusLabel()

  // Calculate time remaining
  const expiresAt = new Date(request.expiresAt)
  const now = new Date()
  const hoursRemaining = Math.max(0, (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`btdemo-glass rounded-xl p-6 border ${getStatusColor()}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          {direction === 'incoming' ? (
            request.requesterAvatar ? (
              <img
                src={request.requesterAvatar}
                alt={request.requesterName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-black text-lg">
                {request.requesterName?.charAt(0).toUpperCase()}
              </span>
            )
          ) : (
            request.targetName ? (
              <span className="text-white font-black text-lg">
                {request.targetName.charAt(0).toUpperCase()}
              </span>
            ) : null
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-black text-white">
                {direction === 'incoming' ? request.requesterName : request.targetName}
              </h3>
              <p className="text-sm text-zinc-400">
                {direction === 'incoming' ? 'wants to connect' : 'DM request sent'}
              </p>
            </div>

            {/* Keys offered */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400">
              <Coins className="w-4 h-4" />
              <span className="font-bold text-sm">{request.keysOffered}</span>
            </div>
          </div>

          {/* Message */}
          {showMessage ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800"
            >
              <p className="text-zinc-300 text-sm leading-relaxed">
                {request.message}
              </p>
            </motion.div>
          ) : (
            <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
              {request.message}
            </p>
          )}

          <button
            onClick={() => setShowMessage(!showMessage)}
            className="text-xs text-zinc-500 hover:text-zinc-300 mb-4"
          >
            {showMessage ? 'Show less' : 'Read full message'}
          </button>

          {/* Status / Actions */}
          {request.status === 'pending' ? (
            <div className="space-y-3">
              {/* Time remaining */}
              {hoursRemaining > 0 && (
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="w-3 h-3" />
                  Expires in {Math.ceil(hoursRemaining)}h
                </div>
              )}

              {/* Actions (for incoming only) */}
              {direction === 'incoming' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => accept({ requestId: request.$id })}
                    disabled={isAccepting || isDeclining}
                    className="flex-1 btdemo-btn-glow py-2 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAccepting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Accept
                  </button>
                  <button
                    onClick={() => decline(request.$id)}
                    disabled={isAccepting || isDeclining}
                    className="flex-1 btdemo-btn-glass py-2 flex items-center justify-center gap-2 text-red-400 border-red-500/20 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {isDeclining ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Decline
                  </button>
                </div>
              )}

              {/* Outgoing status */}
              {direction === 'outgoing' && (
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <status.icon className={`w-4 h-4 ${status.color}`} />
                  Waiting for response...
                </div>
              )}
            </div>
          ) : (
            <div className={`flex items-center gap-2 text-sm font-bold ${status.color}`}>
              <status.icon className="w-4 h-4" />
              {status.label}
              {request.status === 'accepted' && (
                <button className="ml-auto btdemo-btn-glass px-4 py-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Open Chat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
