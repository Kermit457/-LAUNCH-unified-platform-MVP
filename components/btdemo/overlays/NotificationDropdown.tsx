'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, TrendingUp, MessageCircle, Users, Zap, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement>
}

interface Notification {
  id: string
  type: 'buy' | 'comment' | 'follow' | 'launch'
  title: string
  message: string
  timestamp: number
  read: boolean
  link?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'buy',
    title: 'New Buy Activity',
    message: 'CryptoWhale bought 50 keys of LaunchOS',
    timestamp: Date.now() - 1000 * 60 * 2,
    read: false
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'BuilderDao commented on your launch',
    timestamp: Date.now() - 1000 * 60 * 15,
    read: false
  },
  {
    id: '3',
    type: 'follow',
    title: 'New Follower',
    message: 'DeFiMaxi started following you',
    timestamp: Date.now() - 1000 * 60 * 30,
    read: false
  },
  {
    id: '4',
    type: 'launch',
    title: 'Launch Milestone',
    message: 'Your token reached 100 holders!',
    timestamp: Date.now() - 1000 * 60 * 60,
    read: true
  },
  {
    id: '5',
    type: 'buy',
    title: 'Large Purchase',
    message: 'MegaInvestor bought 100 keys',
    timestamp: Date.now() - 1000 * 60 * 120,
    read: true
  }
]

export function NotificationDropdown({ isOpen, onClose, anchorRef }: NotificationDropdownProps): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on escape or click outside
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }

    const handleClickOutside = (e: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, anchorRef])

  const getIcon = (type: Notification['type']): JSX.Element => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="w-5 h-5" />
      case 'comment':
        return <MessageCircle className="w-5 h-5" />
      case 'follow':
        return <Users className="w-5 h-5" />
      case 'launch':
        return <Zap className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: Notification['type']): string => {
    switch (type) {
      case 'buy':
        return 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30'
      case 'comment':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'follow':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
      case 'launch':
        return 'bg-[#D1FD0A]/10 text-[#D1FD0A] border-[#D1FD0A]/30'
    }
  }

  const formatTimestamp = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const markAsRead = (id: string): void => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = (): void => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2 w-[400px] glass-premium border border-zinc-800 rounded-2xl shadow-2xl z-50"
          role="dialog"
          aria-label="Notifications"
          aria-modal="false"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#D1FD0A]" />
              <h3 className="font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-[#D1FD0A]/10 border border-[#D1FD0A]/30 text-[#D1FD0A] text-xs font-led-15 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#D1FD0A] hover:text-white transition-colors font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 text-sm">No notifications</p>
                <p className="text-zinc-600 text-xs mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-zinc-900/20' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      markAsRead(notification.id)
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${getTypeColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-white">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#D1FD0A] rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mb-1.5">{notification.message}</p>
                      <span className="text-xs text-zinc-600">{formatTimestamp(notification.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-zinc-800 text-center">
              <button
                onClick={onClose}
                className="text-xs text-[#D1FD0A] hover:text-white transition-colors font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
