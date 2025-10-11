'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, MessageCircle, Search, Filter } from 'lucide-react'
import { PremiumButton } from '@/components/design-system'
import { useUser } from '@/hooks/useUser'
import { getUserConnections } from '@/lib/appwrite/services/network'
import { motion } from 'framer-motion'

type Connection = {
  id: string
  name: string
  username: string
  avatar?: string
  status: 'online' | 'offline'
  mutualConnections: number
}

export default function NetworkPage() {
  const { userId } = useUser()
  const [loading, setLoading] = useState(true)
  const [connections, setConnections] = useState<Connection[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchNetwork() {
      if (!userId) return

      try {
        setLoading(true)
        const connectionIds = await getUserConnections(userId)

        // Mock connections for now - replace with actual user data fetch
        const mockConnections: Connection[] = connectionIds.slice(0, 10).map((id, i) => ({
          id,
          name: `User ${i + 1}`,
          username: `user${i + 1}`,
          status: i % 2 === 0 ? 'online' : 'offline',
          mutualConnections: Math.floor(Math.random() * 20)
        }))

        setConnections(mockConnections)
      } catch (error) {
        console.error('Failed to fetch network:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNetwork()
  }, [userId])

  const filteredConnections = connections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-design-purple-500 mx-auto mb-4"></div>
          <p className="text-design-zinc-400">Loading network...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-design-purple-600/20 via-design-pink-600/20 to-design-purple-800/20 rounded-2xl border border-design-zinc-800 p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Network</h1>
            <p className="text-design-zinc-400">Manage your connections and collaborations</p>
          </div>
          <PremiumButton variant="primary">
            <UserPlus size={16} />
            Invite People
          </PremiumButton>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-design-purple-500/10 border border-design-purple-500/20">
              <Users className="w-5 h-5 text-design-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Total Connections</h3>
          </div>
          <div className="text-3xl font-bold text-white">{connections.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-semibold text-white">Online Now</h3>
          </div>
          <div className="text-3xl font-bold text-white">
            {connections.filter(c => c.status === 'online').length}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-design-pink-500/10 border border-design-pink-500/20">
              <MessageCircle className="w-5 h-5 text-design-pink-400" />
            </div>
            <h3 className="font-semibold text-white">Active Chats</h3>
          </div>
          <div className="text-3xl font-bold text-white">8</div>
        </motion.div>
      </div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-4"
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-design-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connections..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-design-zinc-900 border border-design-zinc-800 text-white placeholder:text-design-zinc-500 focus:outline-none focus:ring-2 focus:ring-design-purple-500/50"
            />
          </div>
          <PremiumButton variant="ghost">
            <Filter size={16} />
            Filter
          </PremiumButton>
        </div>
      </motion.div>

      {/* Connections Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Your Connections</h2>

        {filteredConnections.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-design-zinc-600 mx-auto mb-4" />
            <p className="text-design-zinc-400">No connections found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnections.map((connection, i) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-design-zinc-800/50 rounded-xl p-4 border border-design-zinc-700 hover:border-design-purple-500/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    {connection.avatar ? (
                      <img
                        src={connection.avatar}
                        alt={connection.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-design-purple-500 to-design-pink-500 flex items-center justify-center text-white font-bold">
                        {connection.name.charAt(0)}
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-design-zinc-800 ${
                      connection.status === 'online' ? 'bg-green-500' : 'bg-design-zinc-600'
                    }`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{connection.name}</h3>
                    <p className="text-sm text-design-zinc-400">@{connection.username}</p>
                    <p className="text-xs text-design-zinc-500 mt-1">
                      {connection.mutualConnections} mutual connections
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <PremiumButton variant="ghost" className="flex-1" size="sm">
                    <MessageCircle size={14} />
                    Message
                  </PremiumButton>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
