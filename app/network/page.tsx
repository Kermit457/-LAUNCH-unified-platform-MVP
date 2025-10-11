"use client"

import { useState, useEffect } from 'react'
import { Users, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { CreatorProfileCard, SimpleBuySellModal } from '@/components/design-system'
import { CollaborateModal } from '@/components/launch/CollaborateModal'
import { getAllUsers } from '@/lib/appwrite/services/users'
import { useCurvesByOwners } from '@/hooks/useCurvesByOwners'
import { useUser } from '@/hooks/useUser'
import type { Curve } from '@/types/curve'

interface UserProfile {
  userId: string
  $id: string
  username: string
  displayName?: string
  avatar?: string
  bio?: string
  roles?: string[]
  twitter?: string
  website?: string
}

export default function NetworkPage() {
  const { userId } = useUser()
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'builder' | 'designer' | 'developer'>('all')

  // Buy/Sell Modal State
  const [buySellModalOpen, setBuySellModalOpen] = useState(false)
  const [selectedCurveData, setSelectedCurveData] = useState<{
    curve: Curve | null
    creatorName: string
    creatorAvatar?: string
  } | null>(null)

  // Invite Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<{
    id: string
    name: string
    avatar?: string
  } | null>(null)

  // Fetch all users
  useEffect(() => {
    async function fetchCreators() {
      try {
        setLoading(true)
        const users = await getAllUsers(100)

        // Map users to creator card format (without curve data yet)
        const creatorData = users.map((user: UserProfile) => ({
          id: user.userId || user.$id,
          name: user.displayName || user.username || 'Anonymous',
          handle: `@${user.username || 'user'}`,
          bio: user.bio || 'Web3 creator and builder',
          avatarUrl: user.avatar,
          isVerified: user.roles?.includes('verified') || false,
          badges: user.roles?.filter((role: string) =>
            ['Builder', 'Designer', 'Developer', 'Creator'].includes(role)
          ) || ['Builder'],
          followers: Math.floor(Math.random() * 2000) + 100, // Mock data
          projectsCount: Math.floor(Math.random() * 15) + 1, // Mock data
          viewCount: Math.floor(Math.random() * 10000) + 500, // Mock data
          twitter: user.twitter,
          website: user.website
        }))

        setCreators(creatorData)
      } catch (error) {
        console.error('Failed to fetch creators:', error)
        setCreators([])
      } finally {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])

  // Fetch curves for all creators
  const creatorOwners = creators.map(creator => ({
    id: creator.id,
    type: 'user' as const
  }))
  const { curves: creatorCurves } = useCurvesByOwners(creatorOwners)

  // Merge curve data with creators
  const creatorsWithCurves = creators.map(creator => {
    const curve = creatorCurves.get(creator.id)
    return {
      ...creator,
      keyPrice: curve?.price || 0.01,
      keyHolders: curve?.holders || 0,
      convictionPct: curve ? Math.min(Math.round((curve.reserve / (curve.supply * curve.price)) * 100), 100) : 50
    }
  })

  // Filter creators (use creatorsWithCurves which includes real curve data)
  const filteredCreators = creatorsWithCurves.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.handle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' ||
                       creator.badges.some((badge: string) => badge.toLowerCase() === filterRole)
    return matchesSearch && matchesRole
  })

  // Handle Buy Keys click
  const handleBuyKeys = (creator: any) => {
    const curve = creatorCurves.get(creator.id)
    setSelectedCurveData({
      curve: curve || null,
      creatorName: creator.name,
      creatorAvatar: creator.avatarUrl
    })
    setBuySellModalOpen(true)
  }

  // Handle Invite click
  const handleInvite = (creator: any) => {
    setSelectedCreator({
      id: creator.id,
      name: creator.name,
      avatar: creator.avatarUrl
    })
    setInviteModalOpen(true)
  }

  // Handle sending invite
  const handleSendInvite = async (message: string) => {
    if (!selectedCreator) return

    // TODO: Implement actual invite API call
    console.log('Sending invite to:', selectedCreator.name)
    console.log('Message:', message)

    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Creators</h1>
          </div>
          <p className="text-zinc-400 text-lg">Discover and connect with talented creators in the ecosystem</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            {['all', 'builder', 'designer', 'developer'].map((role) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterRole(role as any)}
                className={`px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                  filterRole === role
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
              {filteredCreators.length}
            </div>
            <div className="text-sm text-zinc-500">Total Creators</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
              {creatorsWithCurves.filter(c => c.isVerified).length}
            </div>
            <div className="text-sm text-zinc-500">Verified</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">
              {creatorsWithCurves.reduce((sum, c) => sum + c.keyHolders, 0)}
            </div>
            <div className="text-sm text-zinc-500">Total Key Holders</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">
              {Math.round(creatorsWithCurves.reduce((sum, c) => sum + c.convictionPct, 0) / creatorsWithCurves.length || 0)}%
            </div>
            <div className="text-sm text-zinc-500">Avg Conviction</div>
          </div>
        </motion.div>

        {/* Creators Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-zinc-900/40 animate-pulse" />
            ))}
          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No creators found</h3>
            <p className="text-zinc-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CreatorProfileCard
                  creator={creator}
                  onBuyKeys={() => handleBuyKeys(creator)}
                  onInvite={() => handleInvite(creator)}
                  onDetails={() => console.log('View details:', creator.name)}
                  onNotify={() => console.log('Notify:', creator.name)}
                  onShare={() => console.log('Share:', creator.name)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Buy/Sell Keys Modal */}
      {selectedCurveData && selectedCurveData.curve && (
        <SimpleBuySellModal
          isOpen={buySellModalOpen}
          onClose={() => {
            setBuySellModalOpen(false)
            setSelectedCurveData(null)
          }}
          curve={selectedCurveData.curve}
          ownerName={selectedCurveData.creatorName}
          ownerAvatar={selectedCurveData.creatorAvatar}
          userBalance={10} // TODO: Get from wallet
          userKeys={0} // TODO: Get from curve holders
          onTrade={async (type, keys) => {
            if (!userId || !selectedCurveData.curve) return

            const endpoint = `/api/curve/${selectedCurveData.curve.id}/${type}`
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ keys, userId })
            })

            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.error || 'Transaction failed')
            }

            // Refresh to get updated curve data
            // TODO: Implement optimistic update or refetch
          }}
        />
      )}

      {/* Invite/Collaborate Modal */}
      {selectedCreator && (
        <CollaborateModal
          open={inviteModalOpen}
          onClose={() => {
            setInviteModalOpen(false)
            setSelectedCreator(null)
          }}
          launchId={selectedCreator.id}
          launchTitle={`Collaborate with ${selectedCreator.name}`}
          creatorName={selectedCreator.name}
          creatorAvatar={selectedCreator.avatar}
          onSendInvite={handleSendInvite}
        />
      )}
    </div>
  )
}
