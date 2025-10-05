'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { InvitesPanel } from '@/components/network/InvitesPanel'
import { ConnectionsPanel } from '@/components/network/ConnectionsPanel'
import { RoomsList } from '@/components/chat/RoomsList'
import { CreateRoomDrawer } from '@/components/chat/CreateRoomDrawer'
import { useNetworkStore } from '@/lib/stores/useNetworkStore'
import type { Thread } from '@/lib/types'

export default function NetworkPage() {
  const searchParams = useSearchParams()
  const [selectedConnections, setSelectedConnections] = useState<string[]>([])
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false })

  const invites = useNetworkStore(state => state.invites)
  const connections = useNetworkStore(state => state.connections)
  const threads = useNetworkStore(state => state.threads)
  const acceptInvite = useNetworkStore(state => state.acceptInvite)
  const declineInvite = useNetworkStore(state => state.declineInvite)
  const pinConnection = useNetworkStore(state => state.pinConnection)
  const muteConnection = useNetworkStore(state => state.muteConnection)
  const removeConnection = useNetworkStore(state => state.removeConnection)
  const addThread = useNetworkStore(state => state.addThread)

  const showToast = (message: string) => {
    setToast({ message, show: true })
    setTimeout(() => setToast({ message: '', show: false }), 3000)
  }

  const handleAcceptInvite = (id: string) => {
    const invite = invites.find(inv => inv.id === id)
    if (!invite) return

    acceptInvite(id)

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
  }

  const handleDeclineInvite = (id: string) => {
    declineInvite(id)
    showToast('Invite declined')
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

  const handleDM = (userId: string) => {
    const existingThread = threads.find(
      t => t.type === 'dm' && t.participantUserIds.includes(userId)
    )
    if (existingThread) {
      console.log('Opening existing DM:', existingThread.id)
    } else {
      const newThread: Thread = {
        id: `thread_${Date.now()}`,
        type: 'dm',
        participantUserIds: [userId],
        createdAt: Date.now(),
        lastMsgAt: Date.now(),
        unread: 0,
        pinned: false,
      }
      addThread(newThread)
      console.log('Created new DM:', newThread.id)
    }
    showToast('DM opened')
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

  const handleCreateRoom = (name: string, projectId?: string, campaignId?: string) => {
    const newRoom: Thread = {
      id: `room_${Date.now()}`,
      type: 'group',
      name,
      projectId,
      campaignId,
      participantUserIds: selectedConnections,
      createdAt: Date.now(),
      lastMsgAt: Date.now(),
      unread: 0,
      pinned: false,
    }
    addThread(newRoom)
    setIsCreateRoomOpen(false)
    setSelectedConnections([])
    showToast(`Group "${name}" created`)
  }

  const handleSelectRoom = (roomId: string) => {
    console.log('Opening room:', roomId)
    showToast('Room chat opening soon')
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
