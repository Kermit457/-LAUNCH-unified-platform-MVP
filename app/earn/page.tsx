"use client"

import { useState, useMemo } from 'react'
import { EarnCard as EarnCardComponent, type EarnType } from '@/components/EarnCard'
import { earnCards, filterEarnCards } from '@/lib/sampleData'
import { Trophy, Filter, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'

const TABS = ['All', 'Campaign', 'Raid', 'Prediction', 'Quest', 'Bounty'] as const
type Tab = typeof TABS[number]

export default function EarnPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [sortBy, setSortBy] = useState<'trending' | 'payout' | 'closing'>('trending')

  const filteredCards = useMemo(() => {
    const filterType = activeTab.toLowerCase() as EarnType | 'all'
    let cards = filterEarnCards(filterType === 'all' ? 'all' : filterType)

    // Sort
    if (sortBy === 'payout') {
      cards = [...cards].sort((a, b) => b.reward.value - a.reward.value)
    } else if (sortBy === 'closing') {
      cards = [...cards].filter(c => c.duration).sort((a, b) => {
        // Simple duration sorting (would need proper parsing in production)
        return (a.duration || '').localeCompare(b.duration || '')
      })
    } else {
      // trending - sort by participants
      cards = [...cards].sort((a, b) => (b.participants || 0) - (a.participants || 0))
    }

    return cards
  }, [activeTab, sortBy])

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-8 h-8 neon-text-fuchsia" />
          <h1 className="text-4xl font-bold gradient-text-launchos">
            Earn & Engage
          </h1>
        </div>
        <p className="text-white/60 text-lg">
          Participate in campaigns, raids, predictions, and quests to earn rewards
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        {/* Type Tabs */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-white/60" />
            <span className="text-sm text-white/60">Filter by type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab
                    ? "bg-gradient-to-r from-launchos-fuchsia to-launchos-violet text-white shadow-neon-fuchsia"
                    : "bg-white/10 text-white/70 hover:text-white hover:bg-white/15"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-white/60" />
          <span className="text-sm text-white/60">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-launchos-fuchsia"
          >
            <option value="trending">🔥 Trending</option>
            <option value="payout">💰 Highest Payout</option>
            <option value="closing">⏰ Closing Soon</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Total Opportunities</div>
          <div className="text-2xl font-bold gradient-text-launchos">{filteredCards.length}</div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Live Now</div>
          <div className="text-2xl font-bold text-green-400">
            {filteredCards.filter(c => c.status === 'live').length}
          </div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Total Rewards Pool</div>
          <div className="text-2xl font-bold text-yellow-400">
            ${filteredCards.reduce((sum, c) => sum + c.reward.value, 0).toLocaleString()}
          </div>
        </div>
        <div className="glass-launchos p-4 rounded-xl">
          <div className="text-white/60 text-sm mb-1">Active Participants</div>
          <div className="text-2xl font-bold text-cyan-400">
            {filteredCards.reduce((sum, c) => sum + (c.participants || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Earn Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map(card => (
          <EarnCardComponent key={card.id} {...card} />
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-16 text-white/40">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <p>No earning opportunities found for this filter</p>
        </div>
      )}
    </div>
  )
}
