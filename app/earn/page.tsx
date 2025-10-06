"use client"

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EarnCard as EarnCardComponent, type EarnType } from '@/components/EarnCard'
import { earnCards, filterEarnCards } from '@/lib/sampleData'
import { Trophy, Filter, TrendingUp, Video, Swords, DollarSign } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CreateQuestDrawer } from '@/components/quests/CreateQuestDrawer'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { CampaignType } from '@/types/quest'
import { Button } from '@/components/ui/button'
import { getCampaigns } from '@/lib/appwrite/services/campaigns'
import type { EarnCard } from '@/components/EarnCard'

const TABS = ['All', 'Campaign', 'Raid', 'Bounty'] as const
type Tab = typeof TABS[number]

export default function EarnPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [sortBy, setSortBy] = useState<'trending' | 'payout' | 'closing'>('trending')
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false)
  const [initialQuestType, setInitialQuestType] = useState<CampaignType>('raid')
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)
  const [campaigns, setCampaigns] = useState<EarnCard[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch campaigns from Appwrite
  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true)
        const data = await getCampaigns({ status: 'active', limit: 100 })

        // Convert Appwrite Campaign type to EarnCard
        const converted: EarnCard[] = data.map(campaign => ({
          id: campaign.$id,
          title: campaign.title,
          description: campaign.description,
          type: campaign.type as EarnType,
          reward: {
            value: campaign.budget,
            currency: 'USDC'
          },
          participants: campaign.participants,
          duration: new Date(campaign.deadline).toLocaleDateString(),
          imageUrl: campaign.imageUrl,
          tags: campaign.tags,
          platform: ['LaunchOS'],
          progress: {
            paid: campaign.budgetPaid,
            pool: campaign.budget
          },
          status: campaign.status === 'active' ? 'live' : campaign.status === 'completed' ? 'ended' : 'upcoming',
        }))

        setCampaigns(converted)
      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
        // Fall back to mock data
        setCampaigns(earnCards)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const filteredCards = useMemo(() => {
    const filterType = activeTab.toLowerCase() as EarnType | 'all'
    // Use real data if loaded, otherwise fall back to mock data
    let cards = campaigns.length > 0
      ? (filterType === 'all' ? campaigns : campaigns.filter(c => c.type === filterType))
      : filterEarnCards(filterType === 'all' ? 'all' : filterType)

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
  }, [activeTab, sortBy, campaigns])

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-8 h-8 text-fuchsia-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Earn & Engage
          </h1>
        </div>
        <p className="text-zinc-400 text-lg">
          Participate in campaigns, raids, predictions, and quests to earn rewards
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        {/* Type Tabs */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-zinc-500" />
            <span className="text-sm text-zinc-500">Filter by type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map(tab => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "default" : "secondary"}
                size="sm"
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-zinc-500" />
          <span className="text-sm text-zinc-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 backdrop-blur-xl"
          >
            <option value="trending">🔥 Trending</option>
            <option value="payout">💰 Highest Payout</option>
            <option value="closing">⏰ Closing Soon</option>
          </select>
        </div>
      </div>

      {/* Create Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setIsCreateCampaignOpen(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-600 hover:from-fuchsia-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold text-sm transition-all shadow-lg hover:shadow-fuchsia-500/50 flex items-center justify-center gap-2"
        >
          <Video className="w-5 h-5" />
          Create Clipping Campaign
        </button>
        <button
          onClick={() => {
            setInitialQuestType('raid')
            setIsCreateQuestOpen(true)
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold text-sm transition-all shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
        >
          <Swords className="w-5 h-5" />
          Create Raid
        </button>
        <button
          onClick={() => {
            setInitialQuestType('bounty')
            setIsCreateQuestOpen(true)
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
        >
          <DollarSign className="w-5 h-5" />
          Create Bounty
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xl">
          <div className="text-zinc-500 text-sm mb-1">Total Opportunities</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">{filteredCards.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xl">
          <div className="text-zinc-500 text-sm mb-1">Live Now</div>
          <div className="text-2xl font-bold text-green-400">
            {filteredCards.filter(c => c.status === 'live').length}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xl">
          <div className="text-zinc-500 text-sm mb-1">Total Rewards Pool</div>
          <div className="text-2xl font-bold text-yellow-400">
            ${filteredCards.reduce((sum, c) => sum + c.reward.value, 0).toLocaleString('en-US')}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-xl">
          <div className="text-zinc-500 text-sm mb-1">Active Participants</div>
          <div className="text-2xl font-bold text-cyan-400">
            {filteredCards.reduce((sum, c) => sum + (c.participants || 0), 0).toLocaleString('en-US')}
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
        <div className="text-center py-16 text-zinc-500">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
          <p>No earning opportunities found for this filter</p>
        </div>
      )}

      {/* Create Quest Drawer */}
      <CreateQuestDrawer
        isOpen={isCreateQuestOpen}
        initialType={initialQuestType}
        onClose={() => setIsCreateQuestOpen(false)}
        onSubmit={(data) => {
          // Store quest with key: `${data.type}:${data.id}` to prevent collisions
          // TODO: Replace with Supabase insert
          console.log(`${data.type}:${data.id}`, 'Quest created:', data)

          // Navigate to correct route based on type
          const route = data.type === 'raid' ? `/raids/${data.id}` : `/bounties/${data.id}`
          router.push(route)

          setIsCreateQuestOpen(false)
        }}
      />

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onSubmit={(data) => {
          console.log('Campaign created:', data)
          setIsCreateCampaignOpen(false)
        }}
      />
    </div>
  )
}
