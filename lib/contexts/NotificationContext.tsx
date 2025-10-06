"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Notification, NotificationType, notificationCategoryMap, NotificationCategory } from '@/types/notification'

interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  unreadByCategory: Record<NotificationCategory, number>
  addNotification: (type: NotificationType, title: string, message: string, metadata?: Notification['metadata']) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAll: () => void
  getNotificationsByCategory: (category: NotificationCategory) => Notification[]
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('launchos_notifications')
    if (saved) {
      try {
        setNotifications(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load notifications:', e)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('launchos_notifications', JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Notification['metadata']
  ) => {
    const category = notificationCategoryMap[type]
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      category,
      title,
      message,
      timestamp: Date.now(),
      read: false,
      metadata
    }
    setNotifications(prev => [notification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getNotificationsByCategory = (category: NotificationCategory) => {
    return notifications.filter(n => n.category === category)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const unreadByCategory: Record<NotificationCategory, number> = {
    network: notifications.filter(n => n.category === 'network' && !n.read).length,
    campaign: notifications.filter(n => n.category === 'campaign' && !n.read).length,
    financial: notifications.filter(n => n.category === 'financial' && !n.read).length,
    platform: notifications.filter(n => n.category === 'platform' && !n.read).length,
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        unreadByCategory,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        getNotificationsByCategory
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
