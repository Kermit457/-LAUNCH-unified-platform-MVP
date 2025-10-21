"use client"

import { useState, useEffect } from 'react'
import { UnifiedCard } from '@/components/UnifiedCard'
import { AdvancedTableView } from '@/components/AdvancedTableView'
import { CommentsDrawer } from '@/components/CommentsDrawer'
import { BuySellModal } from '@/components/launch/BuySellModal'
import { LaunchDetailsModal } from '@/components/launch/LaunchDetailsModal'
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer'
import { CoinListItem } from '@/components/mobile/CoinListItem'
import { ActivityFeed } from '@/components/discover/ActivityFeed'
import { type UnifiedCardData, type CurveType } from '@/components/UnifiedCard'
import { type AdvancedListingData } from '@/lib/advancedTradingData'
import { Search, TrendingUp, DollarSign, Users, Zap, LayoutGrid, Table, Rocket } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useToast } from '@/hooks/useToast'
import { usePrivy } from '@privy-io/react-auth'
import { addVote, removeVote } from '@/lib/appwrite/services/votes'
import { sendNetworkInvite } from '@/lib/appwrite/services/network'
import { getDiscoverListings, getUserHoldings } from '@/lib/appwrite/services/discover'
import { useCurveTrade } from '@/hooks/useCurveTrade'
import { createLaunchDocument } from '@/lib/appwrite/services/launches'

export default function DiscoverPage() {
  const { success, info, error: showError, warning } = useToast()
  const { authenticated, user } = usePrivy()
  const { buyKeys, sellKeys, isProcessing: isTrading } = useCurveTrade()

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

  // Real data from Appwrite
  const [unifiedListings, setUnifiedListings] = useState<UnifiedCardData[]>([])
  const [advancedListings, setAdvancedListings] = useState<AdvancedListingData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userHoldingsValue, setUserHoldingsValue] = useState(0)

  // Load listings from Appwrite
  useEffect(() => {
    async function loadListings() {
      setIsLoading(true)
      try {
        const data = await getDiscoverListings({
          type: typeFilter,
          status: statusFilter,
          sortBy,
          searchQuery: searchQuery || undefined,
        })
        setUnifiedListings(data.unified)
        setAdvancedListings(data.advanced)

        // Load user holdings if authenticated
        if (user?.id) {
          const holdings = await getUserHoldings(user.id)
          setUserHoldingsValue(holdings.totalValue)
        }
      } catch (error) {
        console.error('Failed to load discover listings:', error)
        showError('Failed to Load', 'Could not load listings')
      } finally {
        setIsLoading(false)
      }
    }
    loadListings()
  }, [typeFilter, statusFilter, sortBy, searchQuery, user?.id])

  // Use advancedListings as base for filtering
  let filtered = advancedListings

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
  const totalValue = userHoldingsValue
  const totalCurves = filtered.filter(item => item.mySharePct && item.mySharePct > 10).length
  const baseListings = advancedListings

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-6">
      {/* Sticky Header - Mobile */}
      <div className="md:hidden sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-zinc-800">
        <div className="px-3 py-2 flex items-center justify-between">
          <h1 className="text-base font-black text-[#00FFFF]">
            Discover
          </h1>
          <button
            onClick={() => setShowSubmitDrawer(true)}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFC700] hover:from-[#FFE700] hover:to-[#FFD700] text-black font-bold transition-all flex items-center gap-1 text-[10px]"
          >
            <Rocket className="w-3 h-3" />
            <span>Create</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 md:py-8">

        {/* Header - Desktop Only */}
        <div className="hidden md:block mb-8">
          {/* Title Row - Horizontal on mobile */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-[#00FFFF] mb-3">
                Discover
              </h1>
              <p className="text-lg text-zinc-400">
                Markets for ideas, creators, and memes
              </p>
            </div>

            {/* Create Button - Desktop */}
            <button
              onClick={() => setShowSubmitDrawer(true)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC700] hover:from-[#FFE700] hover:to-[#FFD700] text-black font-bold transition-all hover:scale-105 flex items-center gap-2 text-base"
            >
              <Rocket className="w-5 h-5" />
              <span>Create</span>
            </button>
          </div>

          {/* View Toggle & Stats - Combined Row */}
          <div className="hidden md:flex items-center justify-between gap-6">
            {/* View Toggle */}
            <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-2 border-2 border-zinc-800/80 shadow-2xl">
              <button
                onClick={() => setDisplayMode('cards')}
                className={cn(
                  "px-6 py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3",
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
                  "px-6 py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3",
                  displayMode === 'table'
                    ? "bg-[#00FFFF] text-black"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Table className="w-5 h-5" />
                Table
              </button>
            </div>

            {/* Compact Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                <DollarSign className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-[10px] text-zinc-500">Holdings</div>
                  <div className="text-sm font-bold text-white">{totalValue.toFixed(2)} SOL</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                <Users className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-[10px] text-zinc-500">Network</div>
                  <div className="text-sm font-bold text-white">248</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
                <Zap className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-[10px] text-zinc-500">Referral</div>
                  <div className="text-sm font-bold text-white">1,240</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                <DollarSign className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-[10px] text-zinc-500">Earnings</div>
                  <div className="text-sm font-bold text-white">3.45 SOL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Display - Mobile Only, Above Bottom Nav */}
        <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 px-3 pb-2">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-lg">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#00FF88]" />
              <span className="text-[10px] text-zinc-400 font-medium">Balances</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">${(totalValue * 0.1).toFixed(2)}</span>
              <button
                onClick={() => {/* Handle deposit */}}
                className="px-2 py-0.5 rounded bg-[#00FF88]/15 border border-[#00FF88]/40 text-[9px] font-bold text-[#00FF88] active:scale-95 transition-all"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>


        {/* Live Activity Feed */}
        <ActivityFeed />

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

        {/* Filters - Everything on One Line Mobile */}
        <div className="bg-zinc-900/30 backdrop-blur-xl rounded-md md:rounded-2xl border border-zinc-800/50 p-1.5 md:p-8 mb-2 md:mb-8">
          {/* Desktop Version - Single Row */}
          <div className="hidden md:block">
            <div className="flex items-center gap-8 mb-6">
              {/* Type Filters */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">Type</label>
                <div className="flex gap-3">
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
                    ICM
                  </FilterPill>
                  <FilterPill
                    active={typeFilter === 'ccm'}
                    onClick={() => setTypeFilter('ccm')}
                    className="data-[active]:bg-[#00FFFF]/20 data-[active]:border-[#00FFFF] data-[active]:text-white"
                  >
                    CCM
                  </FilterPill>
                  <FilterPill
                    active={typeFilter === 'meme'}
                    onClick={() => setTypeFilter('meme')}
                    className="data-[active]:bg-[#FFD700]/20 data-[active]:border-[#FFD700] data-[active]:text-white"
                  >
                    CULT
                  </FilterPill>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-zinc-700"></div>

              {/* Sort Filters */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">Sort</label>
                <div className="flex gap-3">
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
            </div>
            <div className="pt-6 border-t border-zinc-800/50 text-sm text-zinc-500">
              Showing <span className="text-[#00FFFF] font-bold">{filtered.length}</span> of{' '}
              <span className="text-white font-medium">{baseListings.length}</span> listings
            </div>
          </div>

          {/* Mobile Version - Single Row */}
          <div className="md:hidden">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {/* Type Section */}
              <span className="text-[8px] font-bold text-zinc-500 uppercase flex-shrink-0">Type:</span>
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
                ICM
              </FilterPill>
              <FilterPill
                active={typeFilter === 'ccm'}
                onClick={() => setTypeFilter('ccm')}
                className="data-[active]:bg-[#00FFFF]/20 data-[active]:border-[#00FFFF] data-[active]:text-white"
              >
                CCM
              </FilterPill>
              <FilterPill
                active={typeFilter === 'meme'}
                onClick={() => setTypeFilter('meme')}
                className="data-[active]:bg-[#FFD700]/20 data-[active]:border-[#FFD700] data-[active]:text-white"
              >
                CULT
              </FilterPill>

              {/* Divider */}
              <div className="w-px h-4 bg-zinc-700 flex-shrink-0 mx-0.5"></div>

              {/* Sort Section */}
              <span className="text-[8px] font-bold text-zinc-500 uppercase flex-shrink-0">Sort:</span>
              <FilterPill
                active={sortBy === 'trending'}
                onClick={() => setSortBy('trending')}
                small
                className="data-[active]:bg-[#FF0040]/20 data-[active]:border-[#FF0040] data-[active]:text-white"
              >
                Trend
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
                Conv
              </FilterPill>
              <FilterPill
                active={sortBy === 'volume'}
                onClick={() => setSortBy('volume')}
                small
                className="data-[active]:bg-[#0088FF]/20 data-[active]:border-[#0088FF] data-[active]:text-white"
              >
                Vol
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

            {/* Results Count - Mobile */}
            <div className="mt-1 pt-1 border-t border-zinc-800/50 text-[8px] text-zinc-500">
              Showing <span className="text-[#00FFFF] font-bold">{filtered.length}</span> of {baseListings.length}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">⏳</div>
            <h3 className="text-2xl font-bold text-white mb-2">Loading listings...</h3>
            <p className="text-zinc-400">Fetching data from Appwrite</p>
          </div>
        ) : filtered.length > 0 ? (
          <div>
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
                  type={listing.type as 'icm' | 'ccm' | 'meme'}
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
                    onCollaborateClick={async (listing) => {
                      if (!user?.id) {
                        showError('Not Authenticated', 'Please log in to send collaboration invites')
                        return
                      }

                      if (!listing.creatorId) {
                        showError('Invalid Listing', 'Cannot find project creator')
                        return
                      }

                      try {
                        const invite = await sendNetworkInvite({
                          senderId: user.id,
                          receiverId: listing.creatorId,
                          message: `Interested in collaborating on ${listing.title}!`
                        })

                        if (invite) {
                          success('Invite Sent!', `Collaboration invite sent for ${listing.title}`)
                        } else {
                          warning('Already Sent', 'You may have already sent an invite to this user')
                        }
                      } catch (error: any) {
                        showError('Failed to Send Invite', error.message)
                      }
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
                        onCollaborate: async () => {
                          if (!user?.id) {
                            showError('Not Authenticated', 'Please log in to send collaboration invites')
                            return
                          }

                          if (!listing.creatorId) {
                            showError('Invalid Listing', 'Cannot find project creator')
                            return
                          }

                          try {
                            const invite = await sendNetworkInvite({
                              senderId: user.id,
                              receiverId: listing.creatorId,
                              message: `Interested in collaborating on ${listing.title}!`
                            })

                            if (invite) {
                              success('Invite Sent!', `Collaboration invite sent for ${listing.title}`)
                            } else {
                              warning('Already Sent', 'You may have already sent an invite to this user')
                            }
                          } catch (error: any) {
                            showError('Failed to Send Invite', error.message)
                          }
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
          </div>
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
            if (!buyModalListing.id) {
              showError('Invalid Listing', 'Cannot find project ID')
              return
            }

            const result = await buyKeys(buyModalListing.id, amount, undefined)

            if (result.success) {
              success('Keys Purchased!', result.message || `Bought ${amount} SOL worth of keys`)
              setBuyModalListing(null)
              // Refresh listings
              const data = await getDiscoverListings({
                type: typeFilter,
                status: statusFilter,
                sortBy,
                searchQuery: searchQuery || undefined,
              })
              setAdvancedListings(data.advanced)
              setUnifiedListings(data.unified)
            } else {
              showError('Purchase Failed', result.error || 'Failed to buy keys')
            }
          }}
          onSell={async (keysToSell) => {
            if (!buyModalListing.id) {
              showError('Invalid Listing', 'Cannot find project ID')
              return
            }

            const result = await sellKeys(buyModalListing.id, keysToSell)

            if (result.success) {
              success('Keys Sold!', result.message || `Sold ${keysToSell} keys`)
              setBuyModalListing(null)
              // Refresh listings
              const data = await getDiscoverListings({
                type: typeFilter,
                status: statusFilter,
                sortBy,
                searchQuery: searchQuery || undefined,
              })
              setAdvancedListings(data.advanced)
              setUnifiedListings(data.unified)
            } else {
              showError('Sell Failed', result.error || 'Failed to sell keys')
            }
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
        onSubmit={async (data) => {
          if (!user?.id) {
            showError('Not Authenticated', 'Please log in to create a launch')
            return
          }

          try {
            // TODO: Upload logoFile to storage and get URL
            const logoUrl = '' // Placeholder until file upload is wired

            // Create launch in Appwrite
            const launch = await createLaunchDocument({
              launchId: `launch_${Date.now()}`,
              scope: data.scope === 'MEME' ? 'CCM' : data.scope, // Map MEME to CCM
              title: data.title,
              subtitle: data.subtitle || data.description,
              logoUrl: logoUrl,
              description: data.description,
              createdBy: user.id,
              convictionPct: 0,
              commentsCount: 0,
              upvotes: 0,
              status: data.status === 'Live' ? 'live' : 'upcoming'
            })

            if (launch) {
              success('Launch Created!', `${data.title} has been submitted`)
              setShowSubmitDrawer(false)

              // Refresh listings to show new launch
              const newListings = await getDiscoverListings({
                type: typeFilter,
                status: statusFilter,
                sortBy,
                searchQuery: searchQuery || undefined,
              })
              setAdvancedListings(newListings.advanced)
              setUnifiedListings(newListings.unified)
            }
          } catch (error: any) {
            showError('Submission Failed', error.message || 'Failed to create launch')
          }
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
        "rounded md:rounded-lg md:rounded-xl font-bold transition-all border md:border-2 whitespace-nowrap flex-shrink-0",
        small ? "px-1 py-0.5 text-[8px] md:px-4 md:py-2 md:text-sm" : "px-1.5 py-0.5 text-[8px] md:px-5 md:py-2.5 md:text-base",
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