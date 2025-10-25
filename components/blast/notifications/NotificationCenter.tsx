/**
 * NotificationCenter - Dropdown with notifications and badge count
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, CheckCheck, Loader2, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/blast/useNotifications'
import { useUnreadCount } from '@/hooks/blast/useUnreadCount'
import { useMarkAsRead, useMarkAllAsRead } from '@/hooks/blast/useMarkAsRead'
import { NotificationItem } from './NotificationItem'

export function NotificationCenter() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: notifications = [], isLoading } = useNotifications()
  const { data: unreadCount = 0 } = useUnreadCount()
  const markAsReadMutation = useMarkAsRead()
  const markAllAsReadMutation = useMarkAllAsRead()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    // Mark as read
    markAsReadMutation.mutate(notificationId)

    // Navigate if action URL provided
    if (actionUrl) {
      router.push(actionUrl)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative btdemo-btn-glass w-10 h-10 flex items-center justify-center"
      >
        <Bell className="w-5 h-5" />

        {/* Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-96 max-h-[600px] btdemo-glass rounded-xl border border-zinc-800 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-white">Notifications</h3>
                <button
                  onClick={() => {
                    router.push('/BLAST/settings/notifications')
                    setIsOpen(false)
                  }}
                  className="btdemo-btn-glass w-8 h-8 flex items-center justify-center"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {unreadCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">
                    {unreadCount} unread
                  </span>
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={markAllAsReadMutation.isPending}
                    className="text-xs text-[#00FF88] hover:underline disabled:opacity-50"
                  >
                    <CheckCheck className="w-3 h-3 inline mr-1" />
                    Mark all read
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-[#00FF88]" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">No notifications yet</p>
                  <p className="text-zinc-600 text-xs mt-1">
                    We'll notify you when something happens
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.$id}
                      notification={notification}
                      onClick={() =>
                        handleNotificationClick(notification.$id, notification.actionUrl)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-zinc-800 bg-zinc-900/50">
                <button
                  onClick={() => {
                    router.push('/BLAST/notifications')
                    setIsOpen(false)
                  }}
                  className="w-full text-center text-sm text-[#00FF88] hover:underline"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
