"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@/hooks/useUser'
import { getNetworkInvites, acceptNetworkInvite, rejectNetworkInvite } from '@/lib/appwrite/services/network'
import { getUserProfile } from '@/lib/appwrite/services/users'

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
  const { userId } = useUser()
  const [activities, setActivities] = useState<NetworkActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch invites from Appwrite
  useEffect(() => {
    async function fetchInvites() {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        // Get received invites
        const receivedInvites = await getNetworkInvites({
          userId,
          type: 'received',
          status: 'pending'
        })

        // Fetch sender details and convert to NetworkActivity
        const inviteActivities = await Promise.all(
          receivedInvites.map(async (invite) => {
            const senderProfile = await getUserProfile(invite.senderId)

            return {
              id: invite.$id,
              type: 'invite_received' as const,
              userId: invite.senderId,
              username: senderProfile?.username || 'unknown',
              displayName: senderProfile?.displayName || senderProfile?.username || 'Unknown User',
              avatar: senderProfile?.avatar,
              timestamp: new Date(invite.$createdAt).getTime(),
              status: 'pending' as const,
              metadata: invite.message ? { message: invite.message } : undefined
            }
          })
        )

        setActivities(inviteActivities)
      } catch (error) {
        console.error('Failed to fetch network invites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvites()
  }, [userId])

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

  const acceptInvite = async (activityId: string) => {
    try {
      // Call Appwrite API
      await acceptNetworkInvite(activityId)

      // Update local state
      setActivities(prev =>
        prev.filter(activity => activity.id !== activityId)
      )
    } catch (error) {
      console.error('Failed to accept invite:', error)
    }
  }

  const declineInvite = async (activityId: string) => {
    try {
      // Call Appwrite API
      await rejectNetworkInvite(activityId)

      // Update local state
      setActivities(prev =>
        prev.filter(activity => activity.id !== activityId)
      )
    } catch (error) {
      console.error('Failed to decline invite:', error)
    }
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
