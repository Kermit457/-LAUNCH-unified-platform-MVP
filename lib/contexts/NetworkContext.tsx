"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface NetworkActivity {
  id: string
  type: 'invite_sent' | 'invite_received' | 'message_sent' | 'message_received'
  userId: string // the other user's ID
  username: string // the other user's @handle
  displayName: string
  avatar?: string
  timestamp: number
  status: 'pending' | 'accepted' | 'declined' | 'read' | 'unread'
  metadata?: {
    message?: string
    sharedProject?: string
  }
}

interface NetworkContextType {
  activities: NetworkActivity[]
  invites: NetworkActivity[]
  messages: NetworkActivity[]
  pendingInvitesCount: number
  unreadMessagesCount: number
  addInvite: (userId: string, username: string, displayName: string, avatar?: string) => void
  addMessage: (userId: string, username: string, displayName: string, message: string, avatar?: string) => void
  acceptInvite: (activityId: string) => void
  declineInvite: (activityId: string) => void
  markMessageAsRead: (activityId: string) => void
  clearAll: () => void
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<NetworkActivity[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('network_activities')
    if (stored) {
      try {
        setActivities(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse network activities:', e)
      }
    }
  }, [])

  // Save to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem('network_activities', JSON.stringify(activities))
  }, [activities])

  const addInvite = (userId: string, username: string, displayName: string, avatar?: string) => {
    const newActivity: NetworkActivity = {
      id: `invite_${Date.now()}_${userId}`,
      type: 'invite_sent',
      userId,
      username,
      displayName,
      avatar,
      timestamp: Date.now(),
      status: 'pending'
    }
    setActivities(prev => [newActivity, ...prev])
  }

  const addMessage = (userId: string, username: string, displayName: string, message: string, avatar?: string) => {
    const newActivity: NetworkActivity = {
      id: `message_${Date.now()}_${userId}`,
      type: 'message_sent',
      userId,
      username,
      displayName,
      avatar,
      timestamp: Date.now(),
      status: 'unread',
      metadata: { message }
    }
    setActivities(prev => [newActivity, ...prev])
  }

  const acceptInvite = (activityId: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, status: 'accepted' as const }
          : activity
      )
    )
  }

  const declineInvite = (activityId: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, status: 'declined' as const }
          : activity
      )
    )
  }

  const markMessageAsRead = (activityId: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, status: 'read' as const }
          : activity
      )
    )
  }

  const clearAll = () => {
    setActivities([])
    localStorage.removeItem('network_activities')
  }

  // Computed values
  const invites = activities.filter(a => a.type.includes('invite'))
  const messages = activities.filter(a => a.type.includes('message'))
  const pendingInvitesCount = invites.filter(a => a.status === 'pending').length
  const unreadMessagesCount = messages.filter(a => a.status === 'unread').length

  return (
    <NetworkContext.Provider
      value={{
        activities,
        invites,
        messages,
        pendingInvitesCount,
        unreadMessagesCount,
        addInvite,
        addMessage,
        acceptInvite,
        declineInvite,
        markMessageAsRead,
        clearAll
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider')
  }
  return context
}
