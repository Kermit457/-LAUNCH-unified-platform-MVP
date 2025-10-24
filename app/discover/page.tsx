"use client"

import { useState, useEffect } from 'react'
import { UnifiedCard } from '@/components/UnifiedCard'
import { AdvancedTableViewBTDemo } from '@/components/btdemo/AdvancedTableViewBTDemo'
import { CommentsDrawer } from '@/components/CommentsDrawer'
import { BuySellModal } from '@/components/launch/BuySellModal'
import { LaunchDetailsModal } from '@/components/launch/LaunchDetailsModal'
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer'
import { TokenLaunchPreview } from '@/components/launch/TokenLaunchPreview'
import { type UnifiedCardData, type CurveType } from '@/components/UnifiedCard'
import { type AdvancedListingData } from '@/lib/advancedTradingData'
import { LayoutGrid, Table } from 'lucide-react'
import { IconSearch, IconPriceUp, IconCash, IconNetwork, IconLightning, IconRocket } from '@/lib/icons'
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'active' | 'frozen'>('all')
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-4">

        {/* Token Launch Preview */}
        <TokenLaunchPreview
          onLaunch={(data) => {
            console.log('Token launch data:', data)
            setShowSubmitDrawer(true)
          }}
        />

        {/* Header - Desktop Only */}
        <div className="hidden md:block mb-4">

          {/* View Toggle & Stats - Combined Row */}
          <div className="hidden md:flex items-center justify-between gap-6">
            {/* View Toggle */}
            <div className="flex items-center gap-3 glass-interactive rounded-2xl p-2 border-2 border-[#D1FD0A]/20 shadow-2xl">
              <button
                onClick={() => setDisplayMode('cards')}
                className={cn(
                  "px-6 py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3",
                  displayMode === 'cards'
                    ? "bg-[#D1FD0A] text-black"
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
                    ? "bg-[#D1FD0A] text-black"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Table className="w-5 h-5" />
                Table
              </button>
            </div>

            {/* Compact Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D1FD0A]/10 border-2 border-[#D1FD0A]/30 hover:border-[#D1FD0A]/50 transition-all">
                <IconCash size={20} className="text-[#D1FD0A]" />
                <div>
                  <div className="text-xs text-zinc-400">Holdings</div>
                  <div className="text-xl font-bold text-white font-led-dot">{totalValue.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D1FD0A]/10 border-2 border-[#D1FD0A]/30 hover:border-[#D1FD0A]/50 transition-all">
                <IconNetwork size={20} className="text-[#D1FD0A]" />
                <div>
                  <div className="text-xs text-zinc-400">Network</div>
                  <div className="text-xl font-bold text-white font-led-dot">248</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D1FD0A]/10 border-2 border-[#D1FD0A]/30 hover:border-[#D1FD0A]/50 transition-all">
                <IconLightning size={20} className="text-[#D1FD0A]" />
                <div>
                  <div className="text-xs text-zinc-400">Referral</div>
                  <div className="text-xl font-bold text-white font-led-dot">1,240</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D1FD0A]/10 border-2 border-[#D1FD0A]/30 hover:border-[#D1FD0A]/50 transition-all">
                <IconCash size={20} className="text-[#D1FD0A]" />
                <div>
                  <div className="text-xs text-zinc-400">Earnings</div>
                  <div className="text-xl font-bold text-white font-led-dot">3.45</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Display - Mobile Only, Above Bottom Nav */}
        <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 px-3 pb-2">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-lg">
            <div className="flex items-center gap-1.5">
              <IconCash size={14} className="text-[#D1FD0A]" />
              <span className="text-[10px] text-zinc-400 font-medium">Balances</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-led-dot">${(totalValue * 0.1).toFixed(2)}</span>
              <button
                onClick={() => {/* Handle deposit */}}
                className="px-3 py-1.5 min-h-[36px] rounded bg-[#D1FD0A]/15 border border-[#D1FD0A]/40 text-xs font-bold text-[#D1FD0A] active:scale-95 transition-all"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Compact on mobile */}
        <div className="mb-2 md:mb-4">
          <div className="relative">
            <IconSearch size={20} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#D1FD0A]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-14 pr-3 md:pr-5 py-2 min-h-[40px] md:py-3 md:min-h-[48px] rounded-lg md:rounded-2xl bg-zinc-900/80 border border-zinc-800 md:border-2 text-base text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A] transition-all font-medium"
            />
          </div>
        </div>

        {/* Filters - Everything on One Line Mobile */}
        <div className="glass-premium rounded-md md:rounded-2xl border-2 border-[#D1FD0A]/20 p-1.5 md:p-4 lg:p-5 mb-2 md:mb-4">
          {/* Desktop Version - Single Row */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mb-2 flex-wrap">
              {/* Type Filters */}
              <div className="flex items-center gap-1.5 md:gap-2">
                <label className="text-xs md:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">Type</label>
                <div className="flex gap-1 md:gap-1.5">
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
                    className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
                  >
                    ICM
                  </FilterPill>
                  <FilterPill
                    active={typeFilter === 'ccm'}
                    onClick={() => setTypeFilter('ccm')}
                    className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
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
              <div className="w-px h-6 md:h-8 bg-zinc-700 hidden md:block"></div>

              {/* Sort Filters */}
              <div className="flex items-center gap-1.5 md:gap-2">
                <label className="text-xs md:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">Sort</label>
                <div className="flex gap-1 md:gap-1.5 flex-wrap">
                  <FilterPill
                    active={sortBy === 'trending'}
                    onClick={() => setSortBy('trending')}
                    className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
                  >
                    Trending
                  </FilterPill>
                  <FilterPill
                    active={sortBy === 'active'}
                    onClick={() => setSortBy('active')}
                    className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
                  >
                    Active
                  </FilterPill>
                  <FilterPill
                    active={sortBy === 'live'}
                    onClick={() => setSortBy('live')}
                    className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
                  >
                    Live
                  </FilterPill>
                  <FilterPill
                    active={sortBy === 'conviction'}
                    onClick={() => setSortBy('conviction')}
                    className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
                  >
                    Conviction
                  </FilterPill>
                  <FilterPill
                    active={sortBy === 'volume'}
                    onClick={() => setSortBy('volume')}
                    className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
                  >
                    Volume
                  </FilterPill>
                  <FilterPill
                    active={sortBy === 'new'}
                    onClick={() => setSortBy('new')}
                    className="data-[active]:bg-[#FFD700]/20 data-[active]:border-[#FFD700] data-[active]:text-white"
                  >
                    New
                  </FilterPill>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-800/50 text-sm text-zinc-500">
              Showing <span className="text-[#D1FD0A] font-bold font-led-dot">{filtered.length}</span> of{' '}
              <span className="text-white font-medium font-led-dot">{baseListings.length}</span> listings
            </div>
          </div>

          {/* Mobile Version - Single Row */}
          <div className="md:hidden">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
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
                className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
              >
                ICM
              </FilterPill>
              <FilterPill
                active={typeFilter === 'ccm'}
                onClick={() => setTypeFilter('ccm')}
                className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
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
                className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
              >
                Trend
              </FilterPill>
              <FilterPill
                active={sortBy === 'active'}
                onClick={() => setSortBy('active')}
                className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
              >
                Active
              </FilterPill>
              <FilterPill
                active={sortBy === 'live'}
                onClick={() => setSortBy('live')}
                className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
              >
                Live
              </FilterPill>
              <FilterPill
                active={sortBy === 'conviction'}
                onClick={() => setSortBy('conviction')}
                className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
              >
                Conv
              </FilterPill>
              <FilterPill
                active={sortBy === 'volume'}
                onClick={() => setSortBy('volume')}
                className="data-[active]:bg-[#D1FD0A]/20 data-[active]:border-[#D1FD0A] data-[active]:text-white"
              >
                Vol
              </FilterPill>
              <FilterPill
                active={sortBy === 'new'}
                onClick={() => setSortBy('new')}
                className="data-[active]:bg-[#FFD700]/20 data-[active]:border-[#FFD700] data-[active]:text-white"
              >
                New
              </FilterPill>
            </div>

            {/* Results Count - Mobile */}
            <div className="mt-1 pt-1 border-t border-zinc-800/50 text-[8px] text-zinc-500">
              Showing <span className="text-[#D1FD0A] font-bold font-led-dot">{filtered.length}</span> of <span className="font-led-dot">{baseListings.length}</span>
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
            {/* Mobile Card View - Optimized UnifiedCard */}
            <div className="md:hidden space-y-2 p-2">
              {filtered.map(listing => (
                <UnifiedCard
                  key={listing.id}
                  data={{
                    ...listing,
                    keyHolders: [],
                    contributors: listing.metrics?.contributors || [],
                    contributorsCount: listing.metrics?.contributorsCount || 0,
                    onVote: async () => {
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
                    },
                    onComment: () => setCommentDrawerListing(listing),
                    onCommentsClick: () => setCommentDrawerListing(listing),
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
                    onBuyKeys: () => setBuyModalListing(listing),
                    onClipClick: () => info('Create Clip', `Create a clip for ${listing.title}`),
                    onDetails: () => setDetailsModalListing(listing),
                    onNotificationToggle: () => {
                      listing.notificationEnabled = !listing.notificationEnabled
                      success('Notifications', listing.notificationEnabled ? 'Enabled for ' + listing.title : 'Disabled for ' + listing.title)
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
                    myKeys: 0,
                    mySharePct: 0
                  }}
                />
              ))}
            </div>

            {/* Desktop Views - Hidden on mobile */}
            <div className="hidden md:block">
              {displayMode === 'table' ? (
                // Table View
                <div className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl border border-zinc-800/50 overflow-x-auto custom-scrollbar">
                  <AdvancedTableViewBTDemo
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
                    onClipClick={(listing) => {
                      info('Create Clip', `Create a clip for ${listing.title}`)
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
                          listing.notificationEnabled = !listing.notificationEnabled
                          success('Notifications', listing.notificationEnabled ? 'Enabled for ' + listing.title : 'Disabled for ' + listing.title)
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
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D1FD0A] to-[#0088FF] hover:scale-105 text-white font-bold transition-transform"
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
              status: data.status === 'Live' ? 'live' : 'active'
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
  color: 'green' | 'lime' | 'blue' | 'orange'
}) {
  const colorClasses = {
    green: 'bg-[#00FF88]/10 border-[#00FF88]/20 text-[#00FF88]',
    lime: 'bg-[#D1FD0A]/10 border-[#D1FD0A]/20 text-[#D1FD0A]',
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
        "rounded md:rounded-lg lg:rounded-xl font-bold transition-all border md:border-2 whitespace-nowrap flex-shrink-0",
        small
          ? "px-1.5 py-0.5 text-[9px] md:px-3 md:py-1.5 md:text-xs lg:px-4 lg:py-2 lg:text-sm"
          : "px-2 py-1 text-[10px] md:px-4 md:py-2 md:text-sm lg:px-5 lg:py-2.5 lg:text-base",
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