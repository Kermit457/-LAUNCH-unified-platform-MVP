"use client"

import { useState } from 'react'
import { UnifiedCard } from '@/components/UnifiedCard'
import { AdvancedTableView } from '@/components/AdvancedTableView'
import { CommentsDrawer } from '@/components/CommentsDrawer'
import { BuySellModal } from '@/components/launch/BuySellModal'
import { LaunchDetailsModal } from '@/components/launch/LaunchDetailsModal'
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer'
import { CoinListItem } from '@/components/mobile/CoinListItem'
import { unifiedListings, filterByType, filterByStatus, sortListings, getMyHoldings, getMyCurves } from '@/lib/unifiedMockData'
import { advancedListings, type AdvancedListingData } from '@/lib/advancedTradingData'
import type { CurveType } from '@/components/UnifiedCard'
import { Search, TrendingUp, DollarSign, Users, Zap, LayoutGrid, Table, Rocket } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useToast } from '@/hooks/useToast'
import { usePrivy } from '@privy-io/react-auth'
import { addVote, removeVote } from '@/lib/appwrite/services/votes'

export default function DiscoverPage() {
  const { success, info, error: showError, warning } = useToast()
  const { authenticated, user } = usePrivy()

  const [typeFilter, setTypeFilter] = useState<'all' | CurveType>('all')
  const [viewFilter, setViewFilter] = useState<'trending' | 'my-holdings' | 'my-curves' | 'following'>('trending')
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'active' | 'upcoming' | 'frozen'>('all')
  const [sortBy, setSortBy] = useState<'trending' | 'new' | 'volume' | 'conviction' | 'active' | 'live'>('trending')
  const [searchQuery, setSearchQuery] = useState('')
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('table') // Default to table view
  const [commentDrawerListing, setCommentDrawerListing] = useState<AdvancedListingData | null>(null)
  const [buyModalListing, setBuyModalListing] = useState<AdvancedListingData | null>(null)
  const [detailsModalListing, setDetailsModalListing] = useState<AdvancedListingData | null>(null)
  const [showSubmitDrawer, setShowSubmitDrawer] = useState(false)

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

  // Apply sort (with merged status filters)
  filtered = [...filtered].sort((a, b) => {
    // Handle merged status/sort options
    if (sortBy === 'active') {
      // Filter and sort by active status
      if (a.status === 'active' && b.status !== 'active') return -1
      if (b.status === 'active' && a.status !== 'active') return 1
      return (b.viewCount || 0) - (a.viewCount || 0)
    }
    if (sortBy === 'live') {
      // Filter and sort by live status
      if (a.status === 'live' && b.status !== 'live') return -1
      if (b.status === 'live' && a.status !== 'live') return 1
      return (b.viewCount || 0) - (a.viewCount || 0)
    }
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
    <div className="min-h-screen bg-black pb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 md:py-8">

        {/* Header - Super Compact on Mobile */}
        <div className="mb-3 md:mb-8">
          {/* Title Row - Horizontal on mobile */}
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <div>
              <h1 className="text-xl md:text-4xl lg:text-5xl font-black text-[#00FFFF] mb-1 md:mb-3">
                Discover
              </h1>
              <p className="text-xs md:text-lg text-zinc-400 hidden md:block">
                Markets for ideas, creators, and memes
              </p>
            </div>

            {/* Create Button - Always visible, compact on mobile */}
            <button
              onClick={() => setShowSubmitDrawer(true)}
              className="px-3 py-2 md:px-6 md:py-3.5 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC700] hover:from-[#FFE700] hover:to-[#FFD700] text-black font-bold transition-all hover:scale-105 flex items-center gap-1.5 md:gap-2 text-xs md:text-base"
            >
              <Rocket className="w-3.5 h-3.5 md:w-5 md:h-5" />
              <span>Create</span>
            </button>
          </div>

          {/* Desktop view toggle - hidden on mobile */}
          <div className="hidden md:flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-2 border-2 border-zinc-800/80 shadow-2xl max-w-md">
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

        {/* Stats Strip - Hidden on mobile, compact grid on tablet */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-4 md:mb-8">
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
          <StatCard
            icon={DollarSign}
            label="Referral Earnings"
            value="3.45 SOL"
            color="green"
          />
          <StatCard
            icon={Users}
            label="Total Referrals"
            value="12"
            color="blue"
          />
        </div>

        {/* Search Bar - Compact on mobile */}
        <div className="mb-3 md:mb-8">
          <div className="relative">
            <Search className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#00FFFF]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-14 pr-3 md:pr-5 py-2.5 md:py-4 rounded-lg md:rounded-2xl bg-zinc-900/80 border border-zinc-800 md:border-2 text-sm md:text-base text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00FFFF]/50 focus:border-[#00FFFF] transition-all font-medium"
            />
          </div>
        </div>

        {/* Filters - Ultra Compact on Mobile */}
        <div className="bg-zinc-900/30 backdrop-blur-xl rounded-md md:rounded-2xl border border-zinc-800/50 p-2 md:p-8 mb-2 md:mb-8">
          {/* Type Filter */}
          <div className="mb-2 md:mb-8">
            <label className="text-[10px] md:text-sm font-bold text-white mb-1 md:mb-4 block uppercase tracking-wider">Type</label>
            <div className="flex flex-wrap gap-1 md:gap-3">
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

          {/* Sort - Now includes Active and Life */}
          <div>
            <label className="text-[10px] md:text-sm font-bold text-white mb-1 md:mb-4 block uppercase tracking-wider">Sort</label>
            <div className="flex flex-wrap gap-1 md:gap-3">
              <FilterPill
                active={sortBy === 'trending'}
                onClick={() => setSortBy('trending')}
                small
                className="data-[active]:bg-[#FF0040]/20 data-[active]:border-[#FF0040] data-[active]:text-white"
              >
                Trending
              </FilterPill>
              <FilterPill
                active={sortBy === 'active'}
                onClick={() => setSortBy('active')}
                small
                className="data-[active]:bg-[#00FF88]/20 data-[active]:border-[#00FF88] data-[active]:text-white"
              >
                Active
              </FilterPill>
              <FilterPill
                active={sortBy === 'live'}
                onClick={() => setSortBy('live')}
                small
                className="data-[active]:bg-[#FF0040]/20 data-[active]:border-[#FF0040] data-[active]:text-white"
              >
                Live
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

          {/* Results Count */}
          <div className="mt-2 md:mt-6 pt-2 md:pt-6 border-t border-zinc-800/50 text-[10px] md:text-sm text-zinc-500">
            Showing <span className="text-[#00FFFF] font-bold">{filtered.length}</span> of{' '}
            <span className="text-white font-medium">{baseListings.length}</span> listings
          </div>
        </div>

        {/* Display Content Based on Mode */}
        {filtered.length > 0 ? (
          <>
            {/* Mobile List View - Always shown on mobile */}
            <div className="md:hidden flex flex-col gap-1.5">
              {filtered.map(listing => (
                <CoinListItem
                  key={listing.id}
                  id={listing.id}
                  name={listing.title}
                  ticker={listing.ticker || ''}
                  logoUrl={listing.logoUrl}
                  status={listing.status}
                  age={listing.metrics?.createdAt ? getTimeAgo(listing.metrics.createdAt) : '0d ago'}
                  motion={listing.metrics?.graduationPercent || 0}
                  upvotes={listing.upvotes || 0}
                  comments={listing.commentsCount || 0}
                  views={listing.viewCount}
                  price={listing.currentPrice || 0}
                  priceChange={listing.priceChange24h}
                  holders={listing.holders || 0}
                  creatorName={listing.metrics?.creatorName || 'Anonymous'}
                  creatorAvatar={listing.metrics?.creatorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  href={`/launch/${listing.id}`}
                  onBuy={() => setBuyModalListing(listing)}
                  onInvite={() => info('Invite', 'Invite to collaborate on ' + listing.title)}
                  onUpvote={async () => {
                    if (!authenticated || !user?.id) {
                      warning('Authentication Required', 'Please connect your wallet to vote')
                      return
                    }
                    try {
                      if (listing.hasVoted) {
                        await removeVote(listing.id, user.id)
                        listing.hasVoted = false
                        listing.upvotes = Math.max(0, (listing.upvotes || 0) - 1)
                        success('Vote Removed', 'Your vote has been removed')
                      } else {
                        await addVote(listing.id, user.id)
                        listing.hasVoted = true
                        listing.upvotes = (listing.upvotes || 0) + 1
                        success('Voted!', 'Your vote has been recorded')
                      }
                    } catch (error: any) {
                      showError('Vote Failed', error.message || 'Failed to vote')
                    }
                  }}
                  onComment={() => setCommentDrawerListing(listing)}
                  onNotify={() => success('Notifications', 'Notifications toggled for ' + listing.title)}
                  onShare={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: listing.title,
                        text: listing.subtitle || '',
                        url: window.location.origin + `/launch/${listing.id}`,
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.origin + `/launch/${listing.id}`)
                      success('Link Copied', 'Launch link copied to clipboard')
                    }
                  }}
                />
              ))}
            </div>

            {/* Desktop Views - Hidden on mobile */}
            <div className="hidden md:block">
              {displayMode === 'table' ? (
                // Table View
                <div className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl border border-zinc-800/50">
                  <AdvancedTableView
                    listings={filtered}
                    onBuyClick={(listing, amount) => {
                      setBuyModalListing(listing)
                    }}
                    onCollaborateClick={(listing) => {
                      info('Collaborate', 'Send invite to collaborate on ' + listing.title)
                    }}
                    onCommentClick={(listing) => {
                      setCommentDrawerListing(listing)
                    }}
                    onRowClick={(listing) => {
                      setDetailsModalListing(listing)
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
                          if (!authenticated || !user?.id) {
                            warning('Authentication Required', 'Please connect your wallet to vote')
                            return
                          }

                          try {
                            // Check if already voted (toggle logic)
                            if (listing.hasVoted) {
                              await removeVote(listing.id, user.id)
                              listing.hasVoted = false
                              listing.upvotes = Math.max(0, (listing.upvotes || 0) - 1)
                              success('Vote Removed', 'Your vote has been removed')
                            } else {
                              await addVote(listing.id, user.id)
                              listing.hasVoted = true
                              listing.upvotes = (listing.upvotes || 0) + 1
                              success('Voted!', 'Your vote has been recorded')
                            }
                          } catch (error: any) {
                            showError('Vote Failed', error.message || 'Failed to vote')
                          }
                        },
                        onComment: () => {
                          setCommentDrawerListing(listing)
                        },
                        onCollaborate: () => {
                          info('Collaborate', 'Send invite to collaborate on ' + listing.title)
                        },
                        onDetails: () => {
                          setDetailsModalListing(listing)
                        },
                        onBuyKeys: () => {
                          setBuyModalListing(listing)
                        },
                        onClaimAirdrop: async () => {
                          info('Airdrop Claim', 'Airdrop claiming coming soon!')
                        },
                        onNotificationToggle: () => {
                          success('Notifications', 'Notifications toggled')
                        },
                        onShare: () => {
                          if (navigator.share) {
                            navigator.share({
                              title: listing.title,
                              text: listing.subtitle || '',
                              url: window.location.origin + `/launch/${listing.id}`,
                            })
                          } else {
                            navigator.clipboard.writeText(window.location.origin + `/launch/${listing.id}`)
                            success('Link Copied', 'Launch link copied to clipboard')
                          }
                        },
                        onTwitterClick: () => {
                          // Twitter click handler - platforms not implemented yet
                        },
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
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

      {/* Comments Drawer */}
      {commentDrawerListing && (
        <CommentsDrawer
          project={{
            id: commentDrawerListing.id,
            title: commentDrawerListing.title,
            subtitle: commentDrawerListing.subtitle || '',
            logo: commentDrawerListing.logoUrl || '',
          } as any}
          open={!!commentDrawerListing}
          onClose={() => setCommentDrawerListing(null)}
          onAddComment={(comment) => {
            // Optimistically update comment count
            const listing = filtered.find(l => l.id === commentDrawerListing.id)
            if (listing) {
              listing.commentsCount = (listing.commentsCount || 0) + 1
            }
          }}
        />
      )}

      {/* Buy/Sell Modal */}
      {buyModalListing && (
        <BuySellModal
          open={!!buyModalListing}
          onClose={() => setBuyModalListing(null)}
          mode="buy"
          data={{
            title: buyModalListing.title,
            logoUrl: buyModalListing.logoUrl || '',
            currentPrice: buyModalListing.currentPrice || 0.01,
            myKeys: buyModalListing.myKeys || 0,
            mySharePct: buyModalListing.mySharePct || 0,
            totalSupply: 1000000,
            priceChange24h: buyModalListing.priceChange24h,
            estLaunchTokens: null,
          }}
          onBuy={async (amount) => {
            success('Buy', `Buying ${amount} keys...`)
            // TODO: Wire to actual buy function
          }}
          onSell={async (amount) => {
            success('Sell', `Selling ${amount} keys...`)
            // TODO: Wire to actual sell function
          }}
        />
      )}

      {/* Launch Details Modal */}
      {detailsModalListing && (
        <LaunchDetailsModal
          open={!!detailsModalListing}
          onClose={() => setDetailsModalListing(null)}
          launchId={detailsModalListing.id}
          listing={detailsModalListing}
        />
      )}

      {/* Submit Launch Drawer */}
      <SubmitLaunchDrawer
        isOpen={showSubmitDrawer}
        onClose={() => setShowSubmitDrawer(false)}
        onSubmit={(data) => {
          console.log('Launch submitted:', data)
          success('Launch submitted successfully!')
          setShowSubmitDrawer(false)
          // TODO: Send to backend API
        }}
      />
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
        "rounded md:rounded-lg md:rounded-xl font-bold transition-all border md:border-2",
        small ? "px-1.5 py-0.5 text-[10px] md:px-4 md:py-2 md:text-sm" : "px-2 py-1 text-[10px] md:px-5 md:py-2.5 md:text-base",
        active
          ? cn("scale-105", className) // Apply custom color classes only when active
          : "bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-zinc-600 hover:scale-105"
      )}
    >
      {children}
    </button>
  )
}

// Time Ago Helper
function getTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}