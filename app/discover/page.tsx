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

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-3">
              Discover
            </h1>
            <p className="text-lg text-zinc-400">
              Markets for ideas, creators, and memes
            </p>
          </div>

          {/* Display Mode Toggle */}
          <div className="flex items-center gap-2 bg-zinc-900/50 rounded-xl p-1 border border-zinc-800">
            <button
              onClick={() => setDisplayMode('cards')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                displayMode === 'cards'
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Cards
            </button>
            <button
              onClick={() => setDisplayMode('table')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                displayMode === 'table'
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <Table className="w-4 h-4" />
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
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search projects, creators, memes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900/30 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-6 mb-8">
          {/* Type Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium text-zinc-400 mb-3 block">Type</label>
            <div className="flex flex-wrap gap-2">
              <FilterPill
                active={typeFilter === 'all'}
                onClick={() => setTypeFilter('all')}
              >
                All
              </FilterPill>
              <FilterPill
                active={typeFilter === 'icm'}
                onClick={() => setTypeFilter('icm')}
                className="data-[active]:bg-green-500/20 data-[active]:border-green-500/50 data-[active]:text-green-400"
              >
                💼 Projects
              </FilterPill>
              <FilterPill
                active={typeFilter === 'ccm'}
                onClick={() => setTypeFilter('ccm')}
                className="data-[active]:bg-purple-500/20 data-[active]:border-purple-500/50 data-[active]:text-purple-400"
              >
                🎥 Creators
              </FilterPill>
              <FilterPill
                active={typeFilter === 'meme'}
                onClick={() => setTypeFilter('meme')}
                className="data-[active]:bg-orange-500/20 data-[active]:border-orange-500/50 data-[active]:text-orange-400"
              >
                🔥 Memes
              </FilterPill>
            </div>
          </div>

          {/* Status & Sort Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-3 block">Stage</label>
              <div className="flex flex-wrap gap-2">
                <FilterPill
                  active={statusFilter === 'all'}
                  onClick={() => setStatusFilter('all')}
                  small
                >
                  All
                </FilterPill>
                <FilterPill
                  active={statusFilter === 'active'}
                  onClick={() => setStatusFilter('active')}
                  small
                >
                  Active
                </FilterPill>
                <FilterPill
                  active={statusFilter === 'live'}
                  onClick={() => setStatusFilter('live')}
                  small
                >
                  Live
                </FilterPill>
                <FilterPill
                  active={statusFilter === 'frozen'}
                  onClick={() => setStatusFilter('frozen')}
                  small
                >
                  Frozen
                </FilterPill>
                <FilterPill
                  active={statusFilter === 'upcoming'}
                  onClick={() => setStatusFilter('upcoming')}
                  small
                >
                  Upcoming
                </FilterPill>
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-3 block">Sort</label>
              <div className="flex flex-wrap gap-2">
                <FilterPill
                  active={sortBy === 'trending'}
                  onClick={() => setSortBy('trending')}
                  small
                >
                  Trending
                </FilterPill>
                <FilterPill
                  active={sortBy === 'conviction'}
                  onClick={() => setSortBy('conviction')}
                  small
                >
                  Conviction
                </FilterPill>
                <FilterPill
                  active={sortBy === 'volume'}
                  onClick={() => setSortBy('volume')}
                  small
                >
                  Volume
                </FilterPill>
                <FilterPill
                  active={sortBy === 'new'}
                  onClick={() => setSortBy('new')}
                  small
                >
                  New
                </FilterPill>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-zinc-800/50 text-sm text-zinc-500">
            Showing <span className="text-white font-medium">{filtered.length}</span> of{' '}
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
              className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-all"
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
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400'
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
        "rounded-lg font-medium transition-all border",
        small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        active
          ? "bg-white/10 border-white/30 text-white shadow-lg"
          : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white",
        className
      )}
    >
      {children}
    </button>
  )
}