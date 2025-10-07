"use client"

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EarnCard as EarnCardComponent, type EarnType } from '@/components/EarnCard'
import { earnCards, filterEarnCards } from '@/lib/sampleData'
import { Trophy, Filter, TrendingUp, Video, Swords, DollarSign } from 'lucide-react'
import { CreateQuestDrawer } from '@/components/quests/CreateQuestDrawer'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { CampaignType } from '@/types/quest'
import { Button } from '@/components/ui/button'
import { getCampaigns, createCampaign } from '@/lib/appwrite/services/campaigns'
import { getQuests, createQuest } from '@/lib/appwrite/services/quests'
import type { EarnCard } from '@/components/EarnCard'
import { useUser } from '@/hooks/useUser'
import { uploadLogo } from '@/lib/storage'

const TABS = ['All', 'Campaign', 'Raid', 'Bounty'] as const
type Tab = typeof TABS[number]

export default function EarnPage() {
  const router = useRouter()
  const { userId, name } = useUser()
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [sortBy, setSortBy] = useState<'trending' | 'payout' | 'closing'>('trending')
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false)
  const [initialQuestType, setInitialQuestType] = useState<CampaignType>('raid')
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)
  const [allCards, setAllCards] = useState<EarnCard[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch campaigns and quests from Appwrite
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch both campaigns and quests in parallel
        // Note: Don't filter by status - fetch all and filter client-side
        const [campaignsData, questsData] = await Promise.all([
          getCampaigns({ limit: 100 }),
          getQuests({ limit: 100 })
        ])

        // Convert campaigns to EarnCard
        const campaignCards: EarnCard[] = campaignsData.map(campaign => ({
          id: campaign.$id,
          title: campaign.title || 'Untitled Campaign',
          description: campaign.description || '',
          type: 'campaign' as EarnType,
          reward: {
            value: campaign.budgetTotal || campaign.prizePool || 0,
            currency: 'USDC'
          },
          participants: campaign.participants || 0,
          duration: campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'No deadline',
          imageUrl: campaign.imageUrl,
          tags: campaign.tags || [],
          platform: campaign.platforms || ['LaunchOS'],
          progress: {
            paid: campaign.budgetPaid || 0,
            pool: campaign.budgetTotal || campaign.prizePool || 0
          },
          status: (campaign.status as any) === 'live' || campaign.status === 'active' ? 'live' : campaign.status === 'completed' ? 'ended' : 'live',
        }))

        // Convert quests to EarnCard
        const questCards: EarnCard[] = questsData.map(quest => ({
          id: quest.$id,
          title: quest.title,
          description: quest.description,
          type: quest.type as EarnType, // 'raid' or 'bounty'
          reward: {
            value: quest.poolAmount,
            currency: 'USDC'
          },
          participants: quest.participants || 0,
          duration: quest.deadline ? new Date(quest.deadline).toLocaleDateString() : 'No deadline',
          imageUrl: undefined, // Quest doesn't have imageUrl field
          tags: quest.platforms || [],
          platform: quest.platforms || ['LaunchOS'],
          progress: {
            paid: 0,
            pool: quest.poolAmount
          },
          status: quest.status === 'active' ? 'live' : quest.status === 'completed' ? 'ended' : 'upcoming',
        }))

        // Combine both
        const combined = [...campaignCards, ...questCards]
        console.log('📊 Fetched from Appwrite:', {
          campaigns: campaignCards.length,
          quests: questCards.length,
          total: combined.length
        })
        setAllCards(combined)
      } catch (error) {
        console.error('❌ Failed to fetch data from Appwrite:', error)
        console.log('⚠️ Falling back to mock data')
        // Fall back to mock data
        setAllCards(earnCards)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCards = useMemo(() => {
    const filterType = activeTab.toLowerCase() as EarnType | 'all'
    // Use real data if loaded, otherwise fall back to mock data
    let cards = allCards.length > 0
      ? (filterType === 'all' ? allCards : allCards.filter(c => c.type === filterType))
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
  }, [activeTab, sortBy, allCards])

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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading opportunities from Appwrite...</p>
        </div>
      )}

      {/* Earn Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map(card => (
            <EarnCardComponent key={card.id} {...card} />
          ))}
        </div>
      )}

      {!loading && filteredCards.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
          <p>No earning opportunities found for this filter</p>
          <p className="text-sm mt-2">Try running: npm run seed</p>
        </div>
      )}

      {/* Create Quest Drawer */}
      <CreateQuestDrawer
        isOpen={isCreateQuestOpen}
        initialType={initialQuestType}
        onClose={() => setIsCreateQuestOpen(false)}
        onSubmit={async (data: any) => {
          try {
            // Create quest in Appwrite
            const budgetAmount = (data as any).poolAmount || 0
            const quest = await createQuest({
              questId: data.id || `quest_${Date.now()}`,
              type: data.type,
              title: data.title,
              description: (data as any).description || '',
              createdBy: userId || 'anonymous',
              status: 'active',
              poolAmount: budgetAmount,
              budgetTotal: budgetAmount,
              budgetPaid: 0,
              payPerTask: 0,
              platforms: (data as any).platforms || []
            })

            // Navigate to correct route based on type
            const route = data.type === 'raid' ? `/raids/${quest.$id}` : `/bounties/${quest.$id}`
            router.push(route)
            setIsCreateQuestOpen(false)
          } catch (error) {
            console.error('Failed to create quest:', error)
            alert('Failed to create quest. Please try again.')
          }
        }}
      />

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onSubmit={async (data: any) => {
          try {
            console.log('🎬 Creating campaign from /earn page with data:', data)

            // Upload image if provided
            let imageUrl = ''
            if (data.image) {
              try {
                imageUrl = await uploadLogo(data.image)
                console.log('✅ Image uploaded:', imageUrl)
              } catch (uploadError: any) {
                console.error('❌ Image upload failed:', uploadError)
                alert(`Image upload failed: ${uploadError.message}. Campaign will be created without image.`)
              }
            }

            // Create campaign in Appwrite with proper fields
            const campaign = await createCampaign({
              campaignId: crypto.randomUUID(),
              type: 'clipping',
              title: data.title,
              description: data.description || '',
              createdBy: userId || 'anonymous',
              status: 'active',
              prizePool: data.prizePoolUsd || 0,
              budgetTotal: data.prizePoolUsd || 0,
              ratePerThousand: data.payoutPerKUsd || 0,
              minViews: data.minViewsRequired || 0,
              minDuration: data.videoLen?.minSec || 0,
              maxDuration: data.videoLen?.maxSec || 0,
              platforms: data.platforms || [],
              socialLinks: data.socialLinks || [],
              gdocUrl: data.driveLink || '',
              imageUrl: imageUrl,
              ownerType: 'user',
              ownerId: userId || 'anonymous'
            })

            console.log('✅ Campaign created:', campaign)
            alert('🎉 Campaign created successfully!')
            router.push(`/campaign/${campaign.$id}`)
            setIsCreateCampaignOpen(false)
          } catch (error: any) {
            console.error('Failed to create campaign:', error)
            alert(`Failed to create campaign: ${error.message || 'Unknown error'}`)
          }
        }}
      />
    </div>
  )
}
