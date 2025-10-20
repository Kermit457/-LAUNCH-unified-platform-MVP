"use client"

import { useState } from 'react'
import { UnifiedCard } from '@/components/UnifiedCard'
import { AdvancedTableView } from '@/components/AdvancedTableView'
import { unifiedListings, filterByType, filterByStatus, sortListings, getMyHoldings, getMyCurves } from '@/lib/unifiedMockData'
import { advancedListings, type AdvancedListingData } from '@/lib/advancedTradingData'
import type { CurveType } from '@/components/UnifiedCard'
import { Search, TrendingUp, DollarSign, Users, Zap, LayoutGrid, Table } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function DiscoverPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | CurveType>('all')
  const [viewFilter, setViewFilter] = useState<'trending' | 'my-holdings' | 'my-curves' | 'following'>('trending')
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'active' | 'upcoming' | 'frozen'>('all')
  const [sortBy, setSortBy] = useState<'trending' | 'new' | 'volume' | 'conviction'>('trending')
  const [searchQuery, setSearchQuery] = useState('')
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('table') // Default to table view

  // Get base listings based on view filter - use advancedListings for table view
  let baseListings: AdvancedListingData[] = advancedListings

  // Apply type filter
  let filtered = baseListings
  if (typeFilter !== 'all') {
    filtered = filtered.filter(item => item.type === typeFilter)
  }

  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter(item => item.status === statusFilter)
  }

  // Apply search
  if (searchQuery) {
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ticker?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Apply sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'trending') {
      return (b.viewCount || 0) - (a.viewCount || 0)
    }
    if (sortBy === 'conviction') {
      return (b.beliefScore || 0) - (a.beliefScore || 0)
    }
    if (sortBy === 'volume') {
      return b.metrics.volume24h - a.metrics.volume24h
    }
    if (sortBy === 'new') {
      return b.metrics.createdAt - a.metrics.createdAt
    }
    return 0
  })

  // Calculate stats for logged-in user
  const myHoldings = filtered.filter(item => (item.myKeys || 0) > 0)
  const totalValue = myHoldings.reduce((sum, item) => {
    return sum + (item.myKeys || 0) * (item.currentPrice || 0)
  }, 0)
  const totalCurves = filtered.filter(item => item.mySharePct && item.mySharePct > 10).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header with Prominent View Toggle */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-[#00FFFF] mb-3">
                Discover
              </h1>
              <p className="text-lg text-zinc-400">
                Markets for ideas, creators, and memes
              </p>
            </div>
          </div>

          {/* Display Mode Toggle - Prominent */}
          <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-2 border-2 border-zinc-800/80 shadow-2xl max-w-md">
            <button
              onClick={() => setDisplayMode('cards')}
              className={cn(
                "flex-1 px-6 py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3",
                displayMode === 'cards'
                  ? "bg-[#00FFFF] text-black"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
              Cards
            </button>
            <button
              onClick={() => setDisplayMode('table')}
              className={cn(
                "flex-1 px-6 py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3",
                displayMode === 'table'
                  ? "bg-[#00FFFF] text-black"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              <Table className="w-5 h-5" />
              Table
            </button>
          </div>
        </div>

        {/* Stats Strip (for logged-in users) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={DollarSign}
            label="Holdings Value"
            value={`${totalValue.toFixed(2)} SOL`}
            change="+12.5%"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Curves Created"
            value={totalCurves.toString()}
            color="purple"
          />
          <StatCard
            icon={Users}
            label="Network Size"
            value="248"
            color="blue"
          />
          <StatCard
            icon={Zap}
            label="Referral XP"
            value="1,240"
            color="orange"
          />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00FFFF]" />
            <input
              type="text"
              placeholder="Search projects, creators, memes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-zinc-900/80 border-2 border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00FFFF]/50 focus:border-[#00FFFF] transition-all font-medium"
            />
          </div>
        </div>

        {/* Filters - Better Spacing */}
        <div className="bg-zinc-900/30 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-8 mb-8">
          {/* Type Filter */}
          <div className="mb-8">
            <label className="text-sm font-bold text-white mb-4 block uppercase tracking-wider">Type</label>
            <div className="flex flex-wrap gap-3">
              <FilterPill
                active={typeFilter === 'all'}
                onClick={() => setTypeFilter('all')}
                className="data-[active]:bg-zinc-800/50 data-[active]:border-zinc-700 data-[active]:text-white"
              >
                All
              </FilterPill>
              <FilterPill
                active={typeFilter === 'icm'}
                onClick={() => setTypeFilter('icm')}
                className="data-[active]:bg-[#00FF88]/20 data-[active]:border-[#00FF88] data-[active]:text-white"
              >
                💼 Projects
              </FilterPill>
              <FilterPill
                active={typeFilter === 'ccm'}
                onClick={() => setTypeFilter('ccm')}
                className="data-[active]:bg-[#00FFFF]/20 data-[active]:border-[#00FFFF] data-[active]:text-white"
              >
                🎥 Creators
              </FilterPill>
              <FilterPill
                active={typeFilter === 'meme'}
                onClick={() => setTypeFilter('meme')}
                className="data-[active]:bg-[#FFD700]/20 data-[active]:border-[#FFD700] data-[active]:text-white"
              >
                🔥 Memes
              </FilterPill>
            </div>
          </div>

          {/* Status & Sort Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-bold text-white mb-4 block uppercase tracking-wider">Stage</label>
              <div className="flex flex-wrap gap-3">
                <FilterPill
                  active={statusFilter === 'all'}
                  onClick={() => setStatusFilter('all')}
                  small
                  className="data-[active]:bg-zinc-800/50 data-[active]:border-zinc-700 data-[active]:text-white"
                >
                  All
                </FilterPill>
                <FilterPill
                  active={statusFilter === 'active'}
                  onClick={() => setStatusFilter('active')}
                  small
                  className="data-[active]:bg-[#00FF88]/20 data-[active]:border-[#00FF88] data-[active]:text-white"
                >
                  Active
                </FilterPill>
                <FilterPill
                  active={statusFilter === 'live'}
                  onClick={() => setStatusFilter('live')}
                  small
                  className="data-[active]:bg-[#FF0040]/20 data-[active]:border-[#FF0040] data-[active]:text-white"
                >
                  Live
                </FilterPill>
                <FilterPill
                  active={statusFilter === 'frozen'}
                  onClick={() => setStatusFilter('frozen')}
                  small
                  className="data-[active]:bg-[#00FFFF]/20 data-[active]:border-[#00FFFF] data-[active]:text-white"
                >
                  Frozen
                </FilterPill>
                <FilterPill
                  active={statusFilter === 'upcoming'}
                  onClick={() => setStatusFilter('upcoming')}
                  small
                  className="data-[active]:bg-[#0088FF]/20 data-[active]:border-[#0088FF] data-[active]:text-white"
                >
                  Upcoming
                </FilterPill>
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-bold text-white mb-4 block uppercase tracking-wider">Sort</label>
              <div className="flex flex-wrap gap-3">
                <FilterPill
                  active={sortBy === 'trending'}
                  onClick={() => setSortBy('trending')}
                  small
                  className="data-[active]:bg-[#FF0040]/20 data-[active]:border-[#FF0040] data-[active]:text-white"
                >
                  Trending
                </FilterPill>
                <FilterPill
                  active={sortBy === 'conviction'}
                  onClick={() => setSortBy('conviction')}
                  small
                  className="data-[active]:bg-[#8800FF]/20 data-[active]:border-[#8800FF] data-[active]:text-white"
                >
                  Conviction
                </FilterPill>
                <FilterPill
                  active={sortBy === 'volume'}
                  onClick={() => setSortBy('volume')}
                  small
                  className="data-[active]:bg-[#0088FF]/20 data-[active]:border-[#0088FF] data-[active]:text-white"
                >
                  Volume
                </FilterPill>
                <FilterPill
                  active={sortBy === 'new'}
                  onClick={() => setSortBy('new')}
                  small
                  className="data-[active]:bg-[#FFD700]/20 data-[active]:border-[#FFD700] data-[active]:text-white"
                >
                  New
                </FilterPill>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-zinc-800/50 text-sm text-zinc-500">
            Showing <span className="text-[#00FFFF] font-bold">{filtered.length}</span> of{' '}
            <span className="text-white font-medium">{baseListings.length}</span> listings
          </div>
        </div>

        {/* Display Content Based on Mode */}
        {filtered.length > 0 ? (
          <>
            {displayMode === 'table' ? (
              // Table View
              <div className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl border border-zinc-800/50 overflow-hidden">
                <AdvancedTableView
                  listings={filtered}
                  onBuyClick={(listing, amount) => {
                    console.log(`Buy ${amount} SOL of`, listing.title)
                  }}
                />
              </div>
            ) : (
              // Card Grid View
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map(listing => (
                  <UnifiedCard
                    key={listing.id}
                    data={{
                      ...listing,
                      onVote: async () => {
                        console.log('Voted for', listing.title)
                      },
                      onComment: () => {
                        console.log('Comment on', listing.title)
                      },
                      onCollaborate: () => {
                        console.log('Collaborate on', listing.title)
                      },
                      onDetails: () => {
                        console.log('View details for', listing.title)
                      },
                      onBuyKeys: () => {
                        console.log('Buy keys for', listing.title)
                      },
                      onClaimAirdrop: async () => {
                        console.log('Claim airdrop for', listing.title)
                      },
                      onNotificationToggle: () => {
                        console.log('Toggle notifications for', listing.title)
                      },
                      onShare: () => {
                        console.log('Share', listing.title)
                      },
                      onTwitterClick: () => {
                        console.log('Open Twitter for', listing.title)
                      },
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No listings found</h3>
            <p className="text-zinc-400 mb-6">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : 'Try adjusting your filters'}
            </p>
            <button
              onClick={() => {
                setTypeFilter('all')
                setStatusFilter('all')
                setSearchQuery('')
                setViewFilter('trending')
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8800FF] to-[#0088FF] hover:scale-105 text-white font-bold transition-transform"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Stats Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  color
}: {
  icon: any
  label: string
  value: string
  change?: string
  color: 'green' | 'purple' | 'blue' | 'orange'
}) {
  const colorClasses = {
    green: 'bg-[#00FF88]/10 border-[#00FF88]/20 text-[#00FF88]',
    purple: 'bg-[#8800FF]/10 border-[#8800FF]/20 text-[#8800FF]',
    blue: 'bg-[#0088FF]/10 border-[#0088FF]/20 text-[#0088FF]',
    orange: 'bg-[#FF8800]/10 border-[#FF8800]/20 text-[#FF8800]'
  }

  return (
    <div className={cn(
      "rounded-xl border backdrop-blur-sm p-4 transition-all hover:scale-105",
      colorClasses[color]
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium text-zinc-400">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      {change && (
        <div className="text-xs text-green-400 font-medium mt-1">
          {change}
        </div>
      )}
    </div>
  )
}

// Filter Pill Component
function FilterPill({
  children,
  active,
  onClick,
  className = '',
  small = false
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  className?: string
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      data-active={active}
      className={cn(
        "rounded-xl font-bold transition-all border-2",
        small ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-base",
        active
          ? cn("scale-105", className) // Apply custom color classes only when active
          : "bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-zinc-600 hover:scale-105"
      )}
    >
      {children}
    </button>
  )
}