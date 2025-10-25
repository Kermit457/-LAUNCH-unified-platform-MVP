/**
 * NotificationItem - Individual notification display
 */

'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import type { Notification, NotificationType } from '@/lib/appwrite/services/blast-notifications'
import { formatDistanceToNow } from 'date-fns'

interface NotificationItemProps {
  notification: Notification
  onClick: () => void
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'application_accepted':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'application_rejected':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'dm_request_received':
      case 'dm_request_accepted':
      case 'dm_request_declined':
        return <MessageSquare className="w-5 h-5 text-[#00FF88]" />
      case 'new_applicant':
        return <Users className="w-5 h-5 text-blue-400" />
      case 'room_closing_soon':
      case 'room_closed':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'room_extended':
        return <Clock className="w-5 h-5 text-[#00FF88]" />
      case 'room_hot':
        return <TrendingUp className="w-5 h-5 text-orange-400" />
      case 'refund_processed':
        return <RefreshCw className="w-5 h-5 text-cyan-400" />
      case 'match_found':
        return <Sparkles className="w-5 h-5 text-[#00FF88]" />
      default:
        return <AlertCircle className="w-5 h-5 text-zinc-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-[#00FF88]'
      case 'medium':
        return 'border-l-blue-400'
      case 'low':
        return 'border-l-zinc-700'
      default:
        return 'border-l-zinc-700'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClick}
      className={`p-4 hover:bg-zinc-800/30 transition-colors cursor-pointer border-l-2 ${getPriorityColor(
        notification.priority
      )} ${!notification.read ? 'bg-zinc-800/20' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className={`text-sm font-bold ${
                !notification.read ? 'text-white' : 'text-zinc-300'
              }`}
            >
              {notification.title}
            </h4>

            {/* Unread Indicator */}
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-[#00FF88] flex-shrink-0 mt-1" />
            )}
          </div>

          <p className="text-sm text-zinc-400 mb-2">{notification.message}</p>

          {/* Timestamp */}
          <p className="text-xs text-zinc-600">
            {formatDistanceToNow(new Date(notification.$createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
