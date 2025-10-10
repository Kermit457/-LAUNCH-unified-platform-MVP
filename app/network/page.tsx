"use client"

import { useState, useEffect } from 'react'
import { Users, UserPlus, Check, Globe, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/hooks/useUser'
import { useRealtimeNetworkInvites } from '@/hooks/useRealtimeNetworkInvites'
import { InviteCard } from '@/components/network/InviteCard'
import { ConnectionCard } from '@/components/network/ConnectionCard'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { acceptNetworkInvite, rejectNetworkInvite, getUserConnections } from '@/lib/appwrite/services/network'
import { getAllUsers, getUsersByIds } from '@/lib/appwrite/services/users'
import { useToast } from '@/hooks/useToast'
import { GlassCard, PremiumButton } from '@/components/design-system'

type Tab = 'discover' | 'invites' | 'connections'

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
  const [activeTab, setActiveTab] = useState<Tab>('discover')
  const [connections, setConnections] = useState<UserProfile[]>([])
  const [loadingConnections, setLoadingConnections] = useState(false)
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

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

      const senderIds = Array.from(new Set(invites.map(inv => inv.senderId)))
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

  // Fetch all users for discovery
  useEffect(() => {
    async function fetchAllUsers() {
      if (activeTab !== 'discover') return

      try {
        setLoadingUsers(true)
        const users = await getAllUsers(100)

        // Convert to ProfileCard format
        const profiles = users.map(user => ({
          id: user.$id,
          userId: user.userId,
          username: user.username,
          displayName: user.displayName || user.username,
          name: user.displayName || user.username,
          handle: `@${user.username}`,
          avatar: user.avatar,
          verified: user.verified || false,
          roles: user.roles || [],
          mutuals: [],
          bio: user.bio,
          socials: {
            twitter: user.twitter,
            discord: user.discord,
            website: user.website,
          },
          connected: connections.some(c => c.userId === user.userId),
          inviteSent: false,
          contributions: [],
        }))

        setAllUsers(profiles)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        setAllUsers([])
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchAllUsers()
  }, [activeTab, connections])

  // Accept invite handler
  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptNetworkInvite(inviteId)
      success('Invite accepted! You are now connected.')
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
    } catch (error: any) {
      console.error('Failed to reject invite:', error)
      showError(error.message || 'Failed to reject invite')
    }
  }

  // Remove connection handler
  const handleRemoveConnection = async (connectionUserId: string) => {
    console.log('Remove connection:', connectionUserId)
    showError('Remove connection not implemented yet')
  }

  // Clean stats for header
  const stats = [
    {
      label: "Connections",
      value: connections.length,
      icon: Users,
      color: "from-design-violet-500 to-design-purple-500"
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: UserPlus,
      color: "from-design-cyan-500 to-design-blue-500",
      pulse: pendingCount > 0
    },
    {
      label: "Network Reach",
      value: "2.4K",
      icon: Globe,
      color: "from-design-green-500 to-design-emerald-500"
    },
    {
      label: "Trust Score",
      value: "92",
      icon: Shield,
      color: "from-design-orange-500 to-design-pink-500"
    },
  ]

  return (
    <div className="min-h-screen pb-24">
      {/* Clean Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Network
        </motion.h1>
        <p className="text-design-zinc-400 text-lg">
          Connect with creators and grow your professional network
        </p>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="p-4 relative overflow-hidden">
            {stat.pulse && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            )}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-design-zinc-500">{stat.label}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 p-1.5 bg-design-zinc-900/50 backdrop-blur-xl rounded-xl border border-design-zinc-800 mb-8"
      >
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'discover'
              ? 'bg-gradient-to-r from-design-violet-500 to-design-purple-500 text-white shadow-lg'
              : 'text-design-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          Discover
        </button>

        <button
          onClick={() => setActiveTab('invites')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all relative ${
            activeTab === 'invites'
              ? 'bg-gradient-to-r from-design-violet-500 to-design-purple-500 text-white shadow-lg'
              : 'text-design-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Invites
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-design-orange-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('connections')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'connections'
              ? 'bg-gradient-to-r from-design-violet-500 to-design-purple-500 text-white shadow-lg'
              : 'text-design-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Check className="w-4 h-4" />
          Connections
          <span className="text-xs opacity-70">({connections.length})</span>
        </button>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <motion.div
            key="discover"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search/Filter Bar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Discover People
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-design-zinc-500">
                  {allUsers.length} users
                </span>
              </div>
            </div>

            {/* Loading State */}
            {loadingUsers && (
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-design-violet-500/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-design-violet-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Users Grid */}
            {!loadingUsers && allUsers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUsers.map((profile, index) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  >
                    <ProfileCard data={profile} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loadingUsers && allUsers.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <Users className="w-20 h-20 mx-auto mb-4 text-design-zinc-700" />
                <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                <p className="text-design-zinc-500">
                  Check back later to discover new people to connect with.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Invites Tab */}
        {activeTab === 'invites' && (
          <motion.div
            key="invites"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Pending Invites
                {pendingCount > 0 && (
                  <span className="ml-3 text-lg font-normal text-design-zinc-500">
                    ({pendingCount})
                  </span>
                )}
              </h2>
            </div>

            {/* Loading State */}
            {invitesLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-design-violet-500/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-design-violet-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Invites List */}
            {!invitesLoading && invites.length > 0 && (
              <div className="space-y-3">
                {invites.map((invite, index) => {
                  const sender = inviteSenders[invite.senderId]
                  return (
                    <motion.div
                      key={invite.$id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <InviteCard
                        invite={invite}
                        senderName={sender?.displayName}
                        senderAvatar={sender?.avatar}
                        senderUsername={sender?.username}
                        onAccept={handleAcceptInvite}
                        onReject={handleRejectInvite}
                      />
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Empty State */}
            {!invitesLoading && invites.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <GlassCard className="max-w-md mx-auto p-12">
                  <UserPlus className="w-20 h-20 mx-auto mb-4 text-design-zinc-700" />
                  <h3 className="text-xl font-semibold text-white mb-2">No pending invites</h3>
                  <p className="text-design-zinc-500 mb-6">
                    When someone sends you a connection request, it will appear here.
                  </p>
                  <PremiumButton
                    variant="primary"
                    onClick={() => setActiveTab('discover')}
                  >
                    Discover People
                  </PremiumButton>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <motion.div
            key="connections"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Your Connections
                <span className="ml-3 text-lg font-normal text-design-zinc-500">
                  ({connections.length})
                </span>
              </h2>
            </div>

            {/* Loading State */}
            {loadingConnections && (
              <div className="flex items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-design-violet-500/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-design-violet-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Connections Grid */}
            {!loadingConnections && connections.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((connection, index) => (
                  <motion.div
                    key={connection.$id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ConnectionCard
                      userId={connection.userId}
                      name={connection.displayName || connection.username}
                      username={connection.username}
                      avatar={connection.avatar}
                      bio={connection.bio}
                      roles={connection.roles}
                      onRemove={handleRemoveConnection}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loadingConnections && connections.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <GlassCard className="max-w-md mx-auto p-12">
                  <Users className="w-20 h-20 mx-auto mb-4 text-design-zinc-700" />
                  <h3 className="text-xl font-semibold text-white mb-2">No connections yet</h3>
                  <p className="text-design-zinc-500 mb-6">
                    Start building your network by accepting invites or discovering new people.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <PremiumButton
                      variant="secondary"
                      onClick={() => setActiveTab('invites')}
                    >
                      Check Invites
                    </PremiumButton>
                    <PremiumButton
                      variant="primary"
                      onClick={() => setActiveTab('discover')}
                    >
                      Discover People
                    </PremiumButton>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}