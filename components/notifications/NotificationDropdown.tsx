"use client"

import { Bell, Check, CheckCheck, X, Users, Zap, DollarSign, Sparkles } from 'lucide-react'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { Notification, NotificationCategory } from '@/types/notification'
import { formatDistanceToNow } from '@/lib/format'

const categoryIcons: Record<NotificationCategory, any> = {
  network: Users,
  campaign: Zap,
  financial: DollarSign,
  platform: Sparkles,
}

const categoryColors: Record<NotificationCategory, string> = {
  network: 'text-fuchsia-400',
  campaign: 'text-purple-400',
  financial: 'text-emerald-400',
  platform: 'text-cyan-400',
}

function NotificationItem({ notification, onMarkRead, onClear }: {
  notification: Notification
  onMarkRead: () => void
  onClear: () => void
}) {
  const Icon = categoryIcons[notification.category]
  const colorClass = categoryColors[notification.category]

  return (
    <div
      className={`group relative p-4 border-b border-white/10 transition-all ${
        notification.read ? 'bg-transparent' : 'bg-white/5'
      } hover:bg-white/10`}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-fuchsia-500" />
      )}

      <div className="flex items-start gap-3 pl-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg bg-white/5 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-white truncate">
              {notification.title}
            </h4>
            <span className="text-xs text-white/50 whitespace-nowrap">
              {formatDistanceToNow(notification.timestamp)}
            </span>
          </div>
          <p className="text-sm text-white/70 line-clamp-2 mb-2">
            {notification.message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!notification.read && (
              <button
                onClick={onMarkRead}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark read
              </button>
            )}
            <button
              onClick={onClear}
              className="text-xs text-white/50 hover:text-white/70 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotificationDropdown({ isOpen, onClose }: {
  isOpen: boolean
  onClose: () => void
}) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, clearAll } = useNotifications()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown Panel */}
      <div className="absolute right-0 top-full mt-2 w-96 max-h-[600px] rounded-2xl bg-zinc-900/95 border border-white/10 backdrop-blur-xl shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-fuchsia-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-xs font-semibold">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs text-fuchsia-400 hover:text-fuchsia-300 disabled:text-white/30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" />
              Mark all read
            </button>
            <span className="text-white/30">•</span>
            <button
              onClick={clearAll}
              className="text-xs text-white/50 hover:text-white/70 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-white/50 text-sm text-center">
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={() => markAsRead(notification.id)}
                onClear={() => clearNotification(notification.id)}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}
