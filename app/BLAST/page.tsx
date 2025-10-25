/**
 * BLAST Network Hub - Main Page
 * 🎄 MERRY CHRISTMAS! 🎄
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Sparkles, Loader2, Trophy, MessageSquare, LayoutDashboard } from 'lucide-react'
import { FilterSidebar } from '@/components/blast/filters/FilterSidebar'
import { MyPanel } from '@/components/blast/panels/MyPanel'
import { DealCard } from '@/components/blast/cards/DealCard'
import { AirdropCard } from '@/components/blast/cards/AirdropCard'
import { JobCard } from '@/components/blast/cards/JobCard'
import { CollabCard } from '@/components/blast/cards/CollabCard'
import { FundingCard } from '@/components/blast/cards/FundingCard'
import { BlastComposer } from '@/components/blast/composer/BlastComposer'
import { RecommendedRooms } from '@/components/blast/matching/RecommendedRooms'
import { NotificationCenter } from '@/components/blast/notifications/NotificationCenter'
import { useKeyGate } from '@/hooks/blast/useKeyGate'
import { useRoomFeed } from '@/hooks/blast/useRoomFeed'
import { usePrivy } from '@privy-io/react-auth'
import { motion } from 'framer-motion'
import type { RoomFilters } from '@/lib/types/blast'

export default function BlastPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<RoomFilters>({})
  const [showComposer, setShowComposer] = useState(false)

  const { authenticated } = usePrivy()
  const { keyBalance, tier, canPost } = useKeyGate()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useRoomFeed(filters)

  const rooms = data?.pages.flatMap((page: any) => page.rooms) ?? []

  // Render the correct card type based on room.type
  const renderRoomCard = (room: typeof rooms[0]) => {
    const onClick = () => {
      router.push(`/BLAST/room/${room.$id}`)
    }

    switch (room.type) {
      case 'deal':
        return <DealCard room={room} onClick={onClick} />
      case 'airdrop':
        return <AirdropCard room={room} onClick={onClick} />
      case 'job':
        return <JobCard room={room} onClick={onClick} />
      case 'collab':
        return <CollabCard room={room} onClick={onClick} />
      case 'funding':
        return <FundingCard room={room} onClick={onClick} />
      default:
        return <DealCard room={room} onClick={onClick} />
    }
  }

  return (
    <div className="min-h-screen bg-btdemo-canvas">
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <aside className="hidden lg:block w-64 border-r border-zinc-900 h-screen sticky top-0 overflow-y-auto">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
          />
        </aside>

        {/* Center - Main Feed */}
        <main className="flex-1 max-w-3xl mx-auto">
          {/* Hero Header */}
          <div className="p-6 lg:p-8 border-b border-zinc-900 glass-premium">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <h1 className="text-5xl lg:text-6xl font-black gradient-text-launchos">
                  BLAST
                </h1>
                <Sparkles className="w-10 h-10 icon-primary animate-pulse-glow" />
              </div>

              <p className="text-zinc-300 text-lg">
                Network Hub for deals, airdrops, jobs & opportunities.
              </p>

              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                {authenticated && <NotificationCenter />}
                {authenticated && (
                  <button
                    onClick={() => router.push('/BLAST/dashboard')}
                    className="btdemo-btn-glass px-4 py-2 text-sm font-bold flex items-center gap-2 hover:border-[#00FF88]/30 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#00FF88]" />
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => router.push('/BLAST/leaderboard')}
                  className="btdemo-btn-glass px-4 py-2 text-sm font-bold flex items-center gap-2 hover:border-yellow-400/30 transition-all"
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Leaderboard
                </button>
                <button
                  onClick={() => router.push('/BLAST/inbox')}
                  className="btdemo-btn-glass px-4 py-2 text-sm font-bold flex items-center gap-2 hover:border-[#00FF88]/30 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#00FF88]" />
                  Inbox
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 p-4 glass-interactive rounded-xl border-2 border-primary/50">
                <div>
                  <div className="stat-label mb-1">Your Tier</div>
                  <div className="font-led-dot text-xl text-primary capitalize">{tier}</div>
                </div>
                <div>
                  <div className="stat-label mb-1">Keys</div>
                  <div className="font-led-dot text-xl text-primary">{keyBalance}</div>
                </div>
                <div>
                  <div className="stat-label mb-1">Active Rooms</div>
                  <div className="font-led-dot text-xl text-primary">{rooms.length}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feed */}
          <div className="p-6 space-y-4">
            {/* Recommended Rooms (AI-powered) */}
            {authenticated && !isLoading && <RecommendedRooms />}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 btdemo-glass rounded-xl animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">
                  Failed to load rooms
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btdemo-btn-glass px-6 py-3"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && rooms.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 space-y-6"
              >
                <div className="text-6xl">🚀</div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">
                    No rooms yet
                  </h2>
                  <p className="text-zinc-400">
                    Be the first to create a room!
                  </p>
                </div>

                {canPost ? (
                  <button
                    onClick={() => setShowComposer(true)}
                    className="btdemo-btn-glow px-8 py-4 text-lg"
                  >
                    Create First Room
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-500">
                      Requires 1 key to create rooms
                    </p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="btdemo-btn-glass px-6 py-3"
                    >
                      Buy Keys
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Room Cards */}
            {rooms.map((room, index) => (
              <motion.div
                key={room.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {renderRoomCard(room)}
              </motion.div>
            ))}

            {/* Load More */}
            {hasNextPage && (
              <div className="text-center py-6">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="btdemo-btn-glass px-8 py-3 flex items-center gap-2 mx-auto"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}

            {/* End of Feed */}
            {!hasNextPage && rooms.length > 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm">
                You've reached the end
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - My Panel */}
        <aside className="hidden xl:block w-80 border-l border-zinc-900 h-screen sticky top-0 overflow-y-auto">
          <MyPanel />
        </aside>
      </div>

      {/* Floating Composer Button */}
      {authenticated && canPost && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComposer(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full btdemo-btn-glow shadow-2xl flex items-center justify-center z-50"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      )}

      {/* Composer Modal */}
      <BlastComposer
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
      />
    </div>
  )
}
