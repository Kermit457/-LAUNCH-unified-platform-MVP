'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { IconClose, IconNotification, IconMotion, IconVerified, IconAttention } from '@/lib/icons'
import { useNotifications } from '@/hooks/blast/useNotifications'
import { useMarkAsRead } from '@/hooks/blast/useMarkAsRead'
import { useUnreadCount } from '@/hooks/blast/useUnreadCount'
import { usePrivy } from '@privy-io/react-auth'
import { formatDistanceToNow } from 'date-fns'

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const NOTIFICATION_ICONS: Record<string, any> = {
  room_accepted: IconVerified,
  room_rejected: IconAttention,
  dm_received: IconNotification,
  intro_matched: IconMotion,
  room_closing: IconAttention,
  milestone_approved: IconVerified,
  default: IconNotification,
}

const NOTIFICATION_COLORS: Record<string, string> = {
  room_accepted: 'text-[#4ADE80]',
  room_rejected: 'text-[#FF6B6B]',
  dm_received: 'text-primary',
  intro_matched: 'text-primary',
  room_closing: 'text-[#FFA500]',
  milestone_approved: 'text-[#4ADE80]',
  default: 'text-zinc-400',
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { user } = usePrivy()
  const { data: notifications, isLoading } = useNotifications(user?.id)
  const { data: unreadCount } = useUnreadCount(user?.id)
  const { mutate: markAsRead } = useMarkAsRead()

  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    markAsRead(notificationId)
    if (actionUrl) {
      window.location.href = actionUrl
      onClose()
    }
  }

  const handleMarkAllRead = () => {
    notifications
      ?.filter((n) => !n.read)
      .forEach((n) => markAsRead(n.$id))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l-2 border-primary/50 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <IconNotification className="icon-primary" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Notifications</h2>
                    <p className="text-sm text-zinc-400">
                      {unreadCount || 0} unread
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <IconClose size={24} className="text-zinc-400" />
                </button>
              </div>

              {/* Mark All Read */}
              {unreadCount && unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="w-full mb-4 px-4 py-2 glass-interactive rounded-xl text-sm text-primary hover:bg-white/10 transition-all"
                >
                  Mark all as read
                </button>
              )}

              {/* Notifications List */}
              {isLoading ? (
                <div className="glass-interactive p-12 rounded-2xl text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-sm text-zinc-400">Loading notifications...</p>
                </div>
              ) : notifications && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const Icon =
                      NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.default
                    const iconColor =
                      NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.default

                    return (
                      <motion.div
                        key={notification.$id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`glass-interactive p-4 rounded-xl cursor-pointer transition-all hover:bg-white/10 ${
                          !notification.read
                            ? 'border-2 border-primary/50'
                            : 'border-2 border-transparent'
                        }`}
                        onClick={() =>
                          handleNotificationClick(notification.$id, notification.actionUrl)
                        }
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="shrink-0">
                            <Icon size={24} className={iconColor} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-white font-medium text-sm">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                              )}
                            </div>

                            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
                              {notification.message}
                            </p>

                            {/* Priority Badge */}
                            {notification.priority === 'high' && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/50 mb-2">
                                <IconAttention size={12} className="text-[#FF6B6B]" />
                                <span className="text-xs text-[#FF6B6B] font-medium">
                                  High Priority
                                </span>
                              </div>
                            )}

                            {/* Timestamp */}
                            <div className="text-xs text-zinc-500">
                              {formatDistanceToNow(new Date(notification.$createdAt), {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Action URL Indicator */}
                        {notification.actionUrl && (
                          <div className="mt-3 pt-3 border-t border-zinc-700">
                            <div className="text-xs text-primary hover:text-[#B8E309] flex items-center gap-1">
                              <span>View details</span>
                              <span>→</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="glass-interactive p-12 rounded-2xl text-center">
                  <IconNotification size={48} className="text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 mb-1">No notifications</p>
                  <p className="text-xs text-zinc-500">
                    You're all caught up!
                  </p>
                </div>
              )}

              {/* Filter Tabs (Optional Enhancement) */}
              <div className="mt-6 p-4 glass-interactive rounded-2xl">
                <div className="text-xs font-bold text-zinc-400 mb-3">NOTIFICATION TYPES</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <IconVerified size={14} className="text-[#4ADE80]" />
                    <span>Acceptances</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <IconAttention size={14} className="text-[#FF6B6B]" />
                    <span>Rejections</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <IconNotification size={14} className="text-primary" />
                    <span>DMs</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <IconMotion size={14} className="text-primary" />
                    <span>Intros</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 p-3 glass-interactive rounded-xl">
                <p className="text-xs text-zinc-400 leading-relaxed text-center">
                  Notifications are sent when rooms update, you're accepted/rejected, or receive DMs
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
