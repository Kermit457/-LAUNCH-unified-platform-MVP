'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { InvitesPanel } from '@/components/network/InvitesPanel'
import { ConnectionsPanel } from '@/components/network/ConnectionsPanel'
import { RoomsList } from '@/components/chat/RoomsList'
import { CreateRoomDrawer } from '@/components/chat/CreateRoomDrawer'
import { ChatDrawer } from '@/components/chat/ChatDrawer'
import { useNetworkStore } from '@/lib/stores/useNetworkStore'
import type { Thread, Invite, Connection } from '@/lib/types'
import { useUser } from '@/hooks/useUser'
import {
  getNetworkInvites,
  acceptNetworkInvite,
  rejectNetworkInvite,
  getUserConnections
} from '@/lib/appwrite/services/network'
import { getUserThreads, createDMThread, createGroupThread } from '@/lib/appwrite/services/messages'

export default function NetworkPage() {
  const { user, userId } = useUser()
  const searchParams = useSearchParams()
  const [selectedConnections, setSelectedConnections] = useState<string[]>([])
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false })
  const [loading, setLoading] = useState(true)

  const invites = useNetworkStore(state => state.invites)
  const connections = useNetworkStore(state => state.connections)
  const threads = useNetworkStore(state => state.threads)
  const setInvites = useNetworkStore(state => state.setInvites)
  const setConnections = useNetworkStore(state => state.setConnections)
  const setThreads = useNetworkStore(state => state.setThreads)
  const pinConnection = useNetworkStore(state => state.pinConnection)
  const muteConnection = useNetworkStore(state => state.muteConnection)
  const removeConnection = useNetworkStore(state => state.removeConnection)
  const addThread = useNetworkStore(state => state.addThread)
  const setActiveThread = useNetworkStore(state => state.setActiveThread)

  // Fetch network data from Appwrite on mount
  useEffect(() => {
    async function fetchNetworkData() {
      if (!user) return

      try {
        setLoading(true)
        const userId = (user as any).$id || (user as any).id
        const [receivedInvites, sentInvites, connectionIds, appwriteThreads] = await Promise.all([
          getNetworkInvites({ userId, type: 'received', status: 'pending' }),
          getNetworkInvites({ userId, type: 'sent', status: 'pending' }),
          getUserConnections(userId),
          getUserThreads(userId).catch(() => []) // Threads collection may not exist yet
        ])

        // Convert received invites to dashboard format
        const dashboardReceivedInvites: Invite[] = receivedInvites.map(inv => ({
          id: inv.$id,
          fromUserId: inv.senderId,
          fromHandle: '@user', // Would need to fetch user details
          mutuals: 0,
          sentAt: new Date(inv.$createdAt).getTime(),
          status: 'pending',
          priority: 1
        }))

        // Convert sent invites to dashboard format (mark them differently)
        const dashboardSentInvites: Invite[] = sentInvites.map(inv => ({
          id: inv.$id,
          fromUserId: inv.receiverId,
          fromHandle: '@user', // Would need to fetch user details
          mutuals: 0,
          sentAt: new Date(inv.$createdAt).getTime(),
          status: 'sent' as any, // Mark as 'sent' to differentiate
          priority: 0.5
        }))

        // Combine all invites (received first, then sent)
        const dashboardInvites = [...dashboardReceivedInvites, ...dashboardSentInvites]

        // Convert connection IDs to Connection objects (simplified)
        const dashboardConnections: Connection[] = connectionIds.map(id => ({
          userId: id,
          handle: '@user',
          name: 'User',
          roles: [],
          mutuals: 0,
          lastActive: Date.now(),
          unread: 0
        }))

        // Convert Appwrite threads to dashboard format
        const dashboardThreads: Thread[] = appwriteThreads.map(t => ({
          id: t.$id,
          type: t.type,
          name: t.name,
          projectId: t.projectId,
          campaignId: t.campaignId,
          participantUserIds: t.participantIds,
          createdAt: new Date(t.$createdAt).getTime(),
          lastMsgAt: t.lastMessageAt ? new Date(t.lastMessageAt).getTime() : Date.now(),
          unread: 0
        }))

        setInvites(dashboardInvites)
        setConnections(dashboardConnections)
        setThreads(dashboardThreads)
      } catch (error) {
        console.error('Failed to fetch network data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNetworkData()
  }, [user, setInvites, setConnections, setThreads])

  const showToast = (message: string) => {
    setToast({ message, show: true })
    setTimeout(() => setToast({ message: '', show: false }), 3000)
  }

  const handleAcceptInvite = async (id: string) => {
    try {
      const invite = invites.find(inv => inv.id === id)
      if (!invite) return

      // Call Appwrite API to accept invite
      await acceptNetworkInvite(id)

      // Update local state
      setInvites(invites.filter(inv => inv.id !== id))

      // Create a thread for the new connection
      const newThread: Thread = {
        id: `thread_${Date.now()}`,
        type: 'dm',
        participantUserIds: [invite.fromUserId],
        createdAt: Date.now(),
        lastMsgAt: Date.now(),
        unread: 0,
        pinned: false,
      }
      addThread(newThread)

      showToast(`Connected with ${invite.fromHandle}`)
    } catch (error) {
      console.error('Failed to accept invite:', error)
      showToast('Failed to accept invite')
    }
  }

  const handleDeclineInvite = async (id: string) => {
    try {
      // Call Appwrite API to reject invite
      await rejectNetworkInvite(id)

      // Update local state
      setInvites(invites.filter(inv => inv.id !== id))

      showToast('Invite declined')
    } catch (error) {
      console.error('Failed to decline invite:', error)
      showToast('Failed to decline invite')
    }
  }

  const handleChat = (inviteId: string) => {
    console.log('Opening chat for invite:', inviteId)
    showToast('Chat feature coming soon')
  }

  const handleBulkAccept = (ids: string[]) => {
    ids.forEach(id => handleAcceptInvite(id))
  }

  const handleBulkDecline = (ids: string[]) => {
    ids.forEach(id => handleDeclineInvite(id))
  }

  const handleDM = async (otherUserId: string) => {
    if (!userId) return

    try {
      let threadId: string
      const existingThread = threads.find(
        t => t.type === 'dm' && t.participantUserIds.includes(otherUserId)
      )

      if (existingThread) {
        threadId = existingThread.id
      } else {
        // Create DM thread in Appwrite
        const appwriteThread = await createDMThread(userId, otherUserId)

        const newThread: Thread = {
          id: appwriteThread.$id,
          type: 'dm',
          participantUserIds: [otherUserId],
          createdAt: new Date(appwriteThread.$createdAt).getTime(),
          lastMsgAt: Date.now(),
          unread: 0,
          pinned: false,
        }
        addThread(newThread)
        threadId = newThread.id
      }

      setActiveThread(threadId)
      setIsChatOpen(true)
    } catch (error) {
      console.error('Failed to create DM thread:', error)
      showToast('Failed to open chat')
    }
  }

  const handleInviteToCampaign = (userId: string) => {
    console.log('Inviting to campaign:', userId)
    showToast('Invite sent')
  }

  const handlePin = (userId: string) => {
    pinConnection(userId)
  }

  const handleMute = (userId: string) => {
    muteConnection(userId)
  }

  const handleRemove = (userId: string) => {
    removeConnection(userId)
    showToast('Connection removed')
  }

  const handleStartGroup = (userIds: string[]) => {
    setSelectedConnections(userIds)
    setIsCreateRoomOpen(true)
  }

  const handleCreateRoom = async (data: { name: string; projectId?: string; campaignId?: string }) => {
    if (!userId) return

    try {
      // Create group thread in Appwrite
      const appwriteThread = await createGroupThread({
        name: data.name,
        participantIds: [...selectedConnections, userId],
        projectId: data.projectId,
        campaignId: data.campaignId
      })

      const newRoom: Thread = {
        id: appwriteThread.$id,
        type: 'group',
        name: data.name,
        projectId: data.projectId,
        campaignId: data.campaignId,
        participantUserIds: selectedConnections,
        createdAt: new Date(appwriteThread.$createdAt).getTime(),
        lastMsgAt: Date.now(),
        unread: 0,
        pinned: false,
      }
      addThread(newRoom)
      setIsCreateRoomOpen(false)
      setSelectedConnections([])
      showToast(`Group "${data.name}" created`)
    } catch (error) {
      console.error('Failed to create group:', error)
      showToast('Failed to create group')
    }
  }

  const handleSelectRoom = (roomId: string) => {
    setActiveThread(roomId)
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setActiveThread(null)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Network</h1>
        <p className="text-white/60">Manage invites, connections, and group chats</p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Invites + Connections */}
        <div className="lg:col-span-2 space-y-6">
          <InvitesPanel
            invites={invites}
            myRoles={['contributor', 'admin']}
            onAccept={handleAcceptInvite}
            onDecline={handleDeclineInvite}
            onChat={handleChat}
            onBulkAccept={handleBulkAccept}
            onBulkDecline={handleBulkDecline}
          />
          <ConnectionsPanel
            connections={connections}
            onDM={handleDM}
            onInviteToCampaign={handleInviteToCampaign}
            onPin={handlePin}
            onMute={handleMute}
            onRemove={handleRemove}
            onStartGroup={handleStartGroup}
          />
        </div>

        {/* Right Column: Rooms */}
        <div className="lg:col-span-1">
          <RoomsList
            rooms={threads}
            onSelectRoom={handleSelectRoom}
          />
        </div>
      </div>

      {/* Create Room Drawer */}
      <CreateRoomDrawer
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        selectedConnections={connections.filter(c => selectedConnections.includes(c.userId))}
        onCreateRoom={handleCreateRoom}
      />

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={handleCloseChat}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 fade-in">
          <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 text-sm text-white shadow-lg">
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}
