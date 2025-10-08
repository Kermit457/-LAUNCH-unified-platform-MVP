"use client"

import { useState, useEffect } from 'react'
import { Users, UserPlus, Check } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { useRealtimeNetworkInvites } from '@/hooks/useRealtimeNetworkInvites'
import { InviteCard } from '@/components/network/InviteCard'
import { ConnectionCard } from '@/components/network/ConnectionCard'
import { acceptNetworkInvite, rejectNetworkInvite, getUserConnections } from '@/lib/appwrite/services/network'
import { getUsersByIds } from '@/lib/appwrite/services/users'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'

type Tab = 'invites' | 'connections' | 'discover'

interface UserProfile {
  userId: string
  $id: string
  username: string
  displayName?: string
  avatar?: string
  bio?: string
  roles?: string[]
}

export default function NetworkPage() {
  const { userId } = useUser()
  const { success, error: showError } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('invites')
  const [connections, setConnections] = useState<UserProfile[]>([])
  const [loadingConnections, setLoadingConnections] = useState(false)

  // Real-time pending invites
  const { invites, pendingCount, loading: invitesLoading } = useRealtimeNetworkInvites(
    userId || '',
    'received',
    'pending'
  )

  // Fetch senders for invites
  const [inviteSenders, setInviteSenders] = useState<Record<string, UserProfile>>({})

  useEffect(() => {
    async function fetchInviteSenders() {
      if (invites.length === 0) return

      const senderIds = [...new Set(invites.map(inv => inv.senderId))]
      const users = await getUsersByIds(senderIds)

      const senderMap: Record<string, UserProfile> = {}
      users.forEach(user => {
        senderMap[user.userId] = user as UserProfile
      })

      setInviteSenders(senderMap)
    }

    fetchInviteSenders()
  }, [invites])

  // Fetch user connections
  useEffect(() => {
    async function fetchConnections() {
      if (!userId || activeTab !== 'connections') return

      try {
        setLoadingConnections(true)
        const connectionIds = await getUserConnections(userId)

        if (connectionIds.length > 0) {
          const users = await getUsersByIds(connectionIds)
          setConnections(users as UserProfile[])
        } else {
          setConnections([])
        }
      } catch (error) {
        console.error('Failed to fetch connections:', error)
        setConnections([])
      } finally {
        setLoadingConnections(false)
      }
    }

    fetchConnections()
  }, [userId, activeTab])

  // Accept invite handler
  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptNetworkInvite(inviteId)
      success('Invite accepted! You are now connected.')
      // Real-time hook will update the UI automatically
    } catch (error: any) {
      console.error('Failed to accept invite:', error)
      showError(error.message || 'Failed to accept invite')
    }
  }

  // Reject invite handler
  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectNetworkInvite(inviteId)
      success('Invite rejected')
      // Real-time hook will update the UI automatically
    } catch (error: any) {
      console.error('Failed to reject invite:', error)
      showError(error.message || 'Failed to reject invite')
    }
  }

  // Remove connection handler
  const handleRemoveConnection = async (connectionUserId: string) => {
    // TODO: Implement remove connection
    console.log('Remove connection:', connectionUserId)
    showError('Remove connection not implemented yet')
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-8 h-8 text-fuchsia-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Network
          </h1>
        </div>
        <p className="text-zinc-300 text-lg">
          Manage your connections and network invites
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-white/10">
        <button
          onClick={() => setActiveTab('invites')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'invites'
              ? 'text-white border-b-2 border-fuchsia-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Invites
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-fuchsia-500 text-white text-xs font-bold rounded-full">
                {pendingCount}
              </span>
            )}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('connections')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'connections'
              ? 'text-white border-b-2 border-fuchsia-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Connections
            <span className="text-xs text-white/60">({connections.length})</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('discover')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'discover'
              ? 'text-white border-b-2 border-fuchsia-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Discover
          </span>
        </button>
      </div>

      {/* Invites Tab */}
      {activeTab === 'invites' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Pending Invites
              {pendingCount > 0 && (
                <span className="ml-3 text-lg font-normal text-white/60">
                  ({pendingCount})
                </span>
              )}
            </h2>
          </div>

          {/* Loading State */}
          {invitesLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
              <p className="text-zinc-500">Loading invites...</p>
            </div>
          )}

          {/* Invites List */}
          {!invitesLoading && invites.length > 0 && (
            <div className="space-y-3">
              {invites.map(invite => {
                const sender = inviteSenders[invite.senderId]
                return (
                  <InviteCard
                    key={invite.$id}
                    invite={invite}
                    senderName={sender?.displayName}
                    senderAvatar={sender?.avatar}
                    senderUsername={sender?.username}
                    onAccept={handleAcceptInvite}
                    onReject={handleRejectInvite}
                  />
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {!invitesLoading && invites.length === 0 && (
            <div className="text-center py-16 px-4 rounded-xl bg-white/5 border border-white/10">
              <UserPlus className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <h3 className="text-xl font-semibold text-white mb-2">No pending invites</h3>
              <p className="text-white/60 mb-6">
                When someone sends you a connection request, it will appear here.
              </p>
              <Button
                variant="boost"
                onClick={() => setActiveTab('discover')}
              >
                Discover People
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Your Connections
              <span className="ml-3 text-lg font-normal text-white/60">
                ({connections.length})
              </span>
            </h2>
          </div>

          {/* Loading State */}
          {loadingConnections && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
              <p className="text-zinc-500">Loading connections...</p>
            </div>
          )}

          {/* Connections Grid */}
          {!loadingConnections && connections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map(connection => (
                <ConnectionCard
                  key={connection.$id}
                  userId={connection.userId}
                  name={connection.displayName || connection.username}
                  username={connection.username}
                  avatar={connection.avatar}
                  bio={connection.bio}
                  roles={connection.roles}
                  onRemove={handleRemoveConnection}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loadingConnections && connections.length === 0 && (
            <div className="text-center py-16 px-4 rounded-xl bg-white/5 border border-white/10">
              <Users className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <h3 className="text-xl font-semibold text-white mb-2">No connections yet</h3>
              <p className="text-white/60 mb-6">
                Start building your network by accepting invites or discovering new people.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setActiveTab('invites')}
                >
                  Check Invites
                </Button>
                <Button
                  variant="boost"
                  onClick={() => setActiveTab('discover')}
                >
                  Discover People
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Discover Tab - Placeholder */}
      {activeTab === 'discover' && (
        <div className="text-center py-16 px-4 rounded-xl bg-white/5 border border-white/10">
          <Users className="w-16 h-16 mx-auto mb-4 text-white/40" />
          <h3 className="text-xl font-semibold text-white mb-2">Discover People (Coming Soon)</h3>
          <p className="text-white/60 mb-6">
            This feature will help you find and connect with creators, streamers, and traders.
          </p>
          <p className="text-sm text-white/50">
            For now, you can browse the full network on the main page.
          </p>
        </div>
      )}
    </div>
  )
}
