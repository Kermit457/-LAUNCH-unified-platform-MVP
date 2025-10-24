'use client'

import { useState } from 'react'
import { Trophy, DollarSign, Users, Video, Activity, Table as TableIcon, LayoutGrid } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdvancedTableViewBTDemo } from './AdvancedTableViewBTDemo'
import { UnifiedCardCompact } from '@/components/UnifiedCardCompact'
import type { BuilderRanking, InvestorRanking, CommunityRanking, ClipperRanking, TraderRanking } from '@/lib/appwrite/services/leaderboard'
import type { AdvancedListingData } from '@/lib/advancedTradingData'
import { cn } from '@/lib/cn'

type LeaderboardTab = 'builders' | 'investors' | 'communities' | 'clippers' | 'traders'
type ViewMode = 'table' | 'cards'

interface LeaderboardBTDemoProps {
  builders: BuilderRanking[]
  investors: InvestorRanking[]
  communities: CommunityRanking[]
  clippers: ClipperRanking[]
  traders: TraderRanking[]
}

export function LeaderboardBTDemo({
  builders,
  investors,
  communities,
  clippers,
  traders
}: LeaderboardBTDemoProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('builders')
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const tabs = [
    { id: 'builders' as const, icon: Trophy, label: 'Builders', data: builders },
    { id: 'investors' as const, icon: DollarSign, label: 'Investors', data: investors },
    { id: 'communities' as const, icon: Users, label: 'Communities', data: communities },
    { id: 'clippers' as const, icon: Video, label: 'Clippers', data: clippers },
    { id: 'traders' as const, icon: Activity, label: 'Traders', data: traders }
  ]

  const activeTabData = tabs.find(t => t.id === activeTab)

  // Convert rankings to listing format
  const convertToListingData = (): AdvancedListingData[] => {
    switch (activeTab) {
      case 'builders':
        return builders.map((builder) => ({
          id: builder.userId,
          type: 'icm' as const,
          title: builder.displayName,
          subtitle: `${builder.launchesCount} launches`,
          ticker: '',
          logoUrl: builder.avatar,
          status: 'active' as const,
          beliefScore: builder.successRate,
          upvotes: 0,
          commentsCount: 0,
          viewCount: 0,
          holders: builder.launchesCount,
          currentPrice: builder.totalTVL / 1000,
          priceChange24h: 0,
          metrics: {
            createdAt: Date.now(),
            creatorName: builder.displayName,
            creatorAvatar: builder.avatar,
            creatorWallet: builder.username,
            volume24h: builder.totalTVL,
            graduationPercent: builder.successRate
          }
        }))
      case 'investors':
        return investors.map((investor) => ({
          id: investor.userId,
          type: 'icm' as const,
          title: investor.displayName,
          subtitle: `${investor.holdingsCount} holdings`,
          ticker: '',
          logoUrl: investor.avatar,
          status: 'active' as const,
          beliefScore: Math.max(0, Math.min(100, investor.roi)),
          upvotes: 0,
          commentsCount: 0,
          viewCount: 0,
          holders: investor.holdingsCount,
          currentPrice: investor.portfolioValue / 1000,
          priceChange24h: investor.roi,
          metrics: {
            createdAt: Date.now(),
            creatorName: investor.displayName,
            creatorAvatar: investor.avatar,
            creatorWallet: investor.username,
            volume24h: investor.portfolioValue,
            graduationPercent: Math.max(0, Math.min(100, investor.roi))
          }
        }))
      default:
        return []
    }
  }

  const listingData = convertToListingData()

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header + View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">Leaderboards</h2>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-zinc-900 rounded-xl p-1.5 border border-zinc-800">
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
              viewMode === 'table'
                ? "bg-[#00FFFF] text-black"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <TableIcon className="w-4 h-4" />
            Table
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
              viewMode === 'cards'
                ? "bg-[#D1FD0A] text-black"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Cards
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap relative",
                  isActive
                    ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold",
                  isActive ? 'bg-[#00FF88]/20' : 'bg-zinc-800'
                )}>
                  {tab.data.length}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${viewMode}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'table' ? (
            <div className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl border border-zinc-800/50 overflow-hidden">
              <AdvancedTableViewBTDemo listings={listingData} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listingData.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <UnifiedCardCompact
                    data={{
                      ...listing,
                      onVote: async () => console.log('Vote'),
                      onComment: () => console.log('Comment'),
                      onCollaborate: () => console.log('Collaborate'),
                      onDetails: () => console.log('Details'),
                      onBuyKeys: () => console.log('Buy'),
                      onShare: () => console.log('Share'),
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
