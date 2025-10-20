"use client"

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Trophy, TrendingUp, DollarSign, Gift,
  Users, Target, Swords, Clock, Plus, Camera
} from 'lucide-react'
import { GlassCard, PremiumButton } from '@/components/design-system'

// Import existing functionality - PRESERVE ALL APPWRITE CONNECTIONS
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { EntitySelectorModal, EntityOption } from '@/components/launch/EntitySelectorModal'
import { EscrowStatusCard, type EscrowStatus } from '@/components/payments/EscrowStatusCard'
import { getCampaigns } from '@/lib/appwrite/services/campaigns'
import { getQuests } from '@/lib/appwrite/services/quests'
import { getUserProfile } from '@/lib/appwrite/services/users'
import { getUserProjects } from '@/lib/appwrite/services/launches'
import { useUser } from '@/hooks/useUser'
import type { EarnType } from '@/components/EarnCard'

// Extended EarnCard type for this page
interface ExtendedEarnCard {
  id: string
  type: EarnType
  title: string
  description?: string
  platform: string[]
  reward: {
    currency: string
    value: number | string
  }
  progress?: number
  participantsCount?: number
  endsAt?: string
  status: 'live' | 'upcoming' | 'ended' | 'active' | 'completed' | 'cancelled'
  createdBy?: string
  createdAt?: string
  // Escrow fields
  escrowId?: string
  escrowStatus?: EscrowStatus
  escrowAmount?: number
  paidParticipants?: number
  expectedParticipants?: number
}

const TABS = ['All', 'Campaign', 'Clips'] as const
type Tab = typeof TABS[number]

// Enhanced KPI Card Component - Super Compact on Mobile
const KPICard = ({
  label,
  value,
  icon: Icon,
  trend,
  gradient,
  delay = 0
}: {
  label: string
  value: string | number
  icon: any
  trend?: { value: string; direction: 'up' | 'down' }
  gradient: string
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    whileHover={{ scale: 1.02, y: -2 }}
    className="relative group"
  >
    <div className={`absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-xl transition-opacity`} />

    <div className="relative p-2 md:p-6 rounded-lg md:rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between mb-1 md:mb-4">
        <div className={`p-1.5 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 md:gap-1 text-[9px] md:text-sm font-semibold px-1 md:px-2 py-0.5 md:py-1 rounded-full ${
            trend.direction === 'up'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            <TrendingUp className={`w-2 h-2 md:w-3 md:h-3 ${trend.direction === 'down' ? 'rotate-180' : ''}`} />
            <span className="hidden sm:inline">{trend.value}</span>
          </div>
        )}
      </div>
      <div className="text-base md:text-3xl font-bold text-white mb-0.5 md:mb-1">{value}</div>
      <div className="text-[10px] md:text-sm text-zinc-500">{label}</div>
    </div>
  </motion.div>
)

// Enhanced Opportunity Card Component - Redesigned to match reference
const OpportunityCard = ({
  card,
  onJoin,
  onView
}: {
  card: ExtendedEarnCard
  onJoin: (id: string) => void
  onView: (id: string) => void
}) => {
  const getTypeIcon = (type: EarnType) => {
    switch(type) {
      case 'campaign': return Camera
      case 'raid': return Swords
      case 'bounty': return Target
      default: return Trophy
    }
  }

  const Icon = getTypeIcon(card.type)

  // Calculate budget progress
  const budgetTotal = typeof card.reward.value === 'number' ? card.reward.value : 0
  const budgetPaid = card.escrowAmount ? (card.paidParticipants || 0) * (budgetTotal / (card.expectedParticipants || 1)) : 0
  const budgetProgressPct = budgetTotal > 0 ? Math.round((budgetPaid / budgetTotal) * 100) : 0

  // Calculate rate per 1000 (mock calculation based on total budget and expected participants)
  const ratePerThousand = card.expectedParticipants && card.expectedParticipants > 0
    ? (budgetTotal / card.expectedParticipants / 1000).toFixed(2)
    : (budgetTotal / 10000).toFixed(2) // fallback estimate

  // Mock views count (in real app, this would come from Appwrite)
  const viewsCount = card.participantsCount ? card.participantsCount * 12345 : 7584093

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <div className="relative h-full">
        <div className="relative h-full p-2 md:p-5 rounded-lg md:rounded-2xl bg-zinc-900/60 backdrop-blur-xl border md:border-2 border-zinc-800 group-hover:border-[#FFD700]/30 transition-all">

          {/* Header: Logo and Price Badge */}
          <div className="flex items-start justify-between mb-1.5 md:mb-3">
            <div className="p-1 md:p-2.5 rounded-lg md:rounded-xl bg-[#FFD700]/20 border md:border-2 border-[#FFD700]/30 flex-shrink-0">
              <Icon className="w-3.5 h-3.5 md:w-7 md:h-7 text-[#FFD700]" />
            </div>
            <div className="px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-md md:rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
              <span className="text-[#FFD700] text-[9px] md:text-sm font-bold">
                ${ratePerThousand} / 1000
              </span>
            </div>
          </div>

          {/* Campaign Name */}
          <h3 className="font-bold text-white text-xs md:text-base mb-0.5 md:mb-1.5 line-clamp-1">
            {card.title}
          </h3>

          {/* Earnings Description - Desktop only */}
          <p className="hidden md:block text-xs text-zinc-400 mb-3">
            (Earn ${ratePerThousand} per 1,000 Views)
          </p>

          {/* Budget Progress */}
          <div className="mb-1.5 md:mb-3">
            <div className="flex items-center justify-between text-[9px] md:text-xs mb-0.5 md:mb-1.5">
              <span className="text-zinc-400">
                <span className="hidden md:inline">${Math.round(budgetPaid).toLocaleString()} of ${budgetTotal.toLocaleString()} paid out</span>
                <span className="md:hidden">${Math.round(budgetPaid / 1000).toFixed(0)}K/${Math.round(budgetTotal / 1000).toFixed(0)}K</span>
              </span>
              <span className="text-[#FFD700] font-bold">{budgetProgressPct}%</span>
            </div>
            <div className="h-1 md:h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${budgetProgressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-[#FFD700]"
              />
            </div>
          </div>

          {/* Type and Platform Icons */}
          <div className="flex items-center justify-between mb-1.5 md:mb-3">
            <div className="px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg bg-zinc-800/60 border border-zinc-700">
              <span className="text-[9px] md:text-xs text-zinc-300 font-medium">
                Type: {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
              </span>
            </div>

            {/* Platform Icons */}
            {card.platform && card.platform.length > 0 && (
              <div className="flex items-center gap-0.5 md:gap-1.5">
                {card.platform.slice(0, 3).map((platform, i) => (
                  <span key={i} className="text-xs md:text-base">
                    {platform === 'twitter' && '🐦'}
                    {platform === 'youtube' && '📹'}
                    {platform === 'tiktok' && '🎵'}
                    {platform === 'instagram' && '📷'}
                    {platform === 'discord' && '💬'}
                    {platform === 'telegram' && '✈️'}
                    {!['twitter', 'youtube', 'tiktok', 'instagram', 'discord', 'telegram'].includes(platform) && '🌐'}
                  </span>
                ))}
                {card.platform.length > 3 && (
                  <span className="text-[9px] md:text-xs text-zinc-500 ml-0.5 md:ml-1">+{card.platform.length - 3}</span>
                )}
              </div>
            )}
          </div>

          {/* Views Count */}
          <div className="flex items-center justify-end mb-1.5 md:mb-3">
            <span className="text-[9px] md:text-xs text-zinc-400">
              Views: <span className="text-white font-semibold">{viewsCount > 1000000 ? `${(viewsCount / 1000000).toFixed(1)}M` : viewsCount.toLocaleString()}</span>
            </span>
          </div>

          {/* Two Button Layout */}
          <div className="grid grid-cols-2 gap-1.5 md:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation()
                onView(card.id)
              }}
              className="py-1 md:py-2 rounded-md md:rounded-xl bg-zinc-800/80 border border-zinc-700 text-white text-[10px] md:text-sm font-bold hover:bg-zinc-700/80 transition-all"
            >
              View
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation()
                onJoin(card.id)
              }}
              className="py-1 md:py-2 rounded-md md:rounded-xl bg-[#FFD700] text-black text-[10px] md:text-sm font-bold hover:bg-[#FFD700]/90 transition-all"
            >
              Join
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function EarnPage() {
  const router = useRouter()
  const { userId } = useUser()
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [sortBy, setSortBy] = useState<'trending' | 'payout' | 'closing'>('trending')
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)
  const [allCards, setAllCards] = useState<ExtendedEarnCard[]>([])
  const [loading, setLoading] = useState(true)

  // Entity selector state
  const [showEntitySelector, setShowEntitySelector] = useState(false)
  const [entitySelectorAction, setEntitySelectorAction] = useState<'campaign' | 'quest'>('campaign')
  const [profile, setProfile] = useState<any>(null)
  const [linkedProjects, setLinkedProjects] = useState<any[]>([])

  // Fetch user profile and projects
  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return
      try {
        const [userProfile, projects] = await Promise.all([
          getUserProfile(userId),
          getUserProjects(userId)
        ])
        setProfile(userProfile)
        setLinkedProjects(projects.map(p => ({
          id: p.$id,
          name: p.title,
          description: p.subtitle || p.description || '',
          logo: p.logoUrl
        })))
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }
    fetchUserData()
  }, [userId])

  // Handle entity selection and proceed with creating campaign/quest
  const handleEntitySelected = (_entity: EntityOption) => {
    setShowEntitySelector(false)

    if (entitySelectorAction === 'campaign') {
      setIsCreateCampaignOpen(true)
    }
  }

  // Fetch campaigns and quests from Appwrite
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        const [campaignsData, questsData] = await Promise.all([
          getCampaigns({ limit: 100 }),
          getQuests({ limit: 100 })
        ])

        // Convert campaigns to ExtendedEarnCard format
        const campaignCards: ExtendedEarnCard[] = campaignsData.map((campaign, index) => {
          // Mock escrow data for campaigns (alternating statuses for demo)
          const escrowStatuses: EscrowStatus[] = ['funded', 'pending', 'partial', 'released']
          const hasEscrow = index % 2 === 0 // Every other campaign has escrow
          const escrowStatus = escrowStatuses[index % escrowStatuses.length]
          const budgetInUSD = campaign.budgetTotal || campaign.prizePool || 0
          const budgetInSOL = budgetInUSD / 140 // Mock conversion rate: 140 USD/SOL
          const expectedParticipants = 10
          const paidParticipants = escrowStatus === 'partial' ? 5 : escrowStatus === 'released' ? 10 : 0

          return {
            id: campaign.$id,
            title: campaign.title || 'Untitled Campaign',
            description: campaign.description || '',
            type: 'campaign' as EarnType,
            platform: campaign.platforms || [],
            reward: {
              value: campaign.budgetTotal || campaign.prizePool || 0,
              currency: 'USDC'
            },
            status: campaign.status || 'active',
            participantsCount: campaign.participants || 0,
            endsAt: campaign.deadline,
            progress: 0,
            createdBy: campaign.createdBy,
            createdAt: campaign.$createdAt,
            // Mock escrow data
            escrowId: hasEscrow ? `escrow_${campaign.$id.slice(0, 8)}` : undefined,
            escrowStatus: hasEscrow ? escrowStatus : undefined,
            escrowAmount: hasEscrow ? budgetInSOL : undefined,
            expectedParticipants: hasEscrow ? expectedParticipants : undefined,
            paidParticipants: hasEscrow ? paidParticipants : undefined,
          }
        })

        // Convert quests to ExtendedEarnCard format
        const questCards: ExtendedEarnCard[] = questsData.map(quest => {
          const questType = quest.type === 'raid' ? 'raid' : 'bounty'
          return {
            id: quest.$id,
            title: quest.title || 'Untitled Quest',
            description: quest.description || '',
            type: questType as EarnType,
            platform: quest.platforms || [],
            reward: {
              value: 0,
              currency: 'USDC'
            },
            status: quest.status || 'active',
            participantsCount: quest.participants || 0,
            endsAt: quest.deadline,
            progress: 0,
            createdBy: quest.createdBy,
            createdAt: quest.$createdAt,
          }
        })

        setAllCards([...campaignCards, ...questCards])
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setAllCards([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter cards based on active tab
  const filteredCards = useMemo(() => {
    let filtered = [...allCards]

    // Filter by type
    if (activeTab !== 'All' && activeTab !== 'Clips') {
      const typeMap = {
        'Campaign': 'campaign',
        'Raid': 'raid',
        'Bounty': 'bounty'
      }
      filtered = filtered.filter(card => card.type === typeMap[activeTab])
    }

    // Sort
    switch (sortBy) {
      case 'payout':
        filtered.sort((a, b) => {
          const aValue = typeof a.reward.value === 'number' ? a.reward.value : 0
          const bValue = typeof b.reward.value === 'number' ? b.reward.value : 0
          return bValue - aValue
        })
        break
      case 'closing':
        filtered.sort((a, b) => {
          const aTime = a.endsAt ? new Date(a.endsAt).getTime() : Infinity
          const bTime = b.endsAt ? new Date(b.endsAt).getTime() : Infinity
          return aTime - bTime
        })
        break
      case 'trending':
      default:
        filtered.sort((a, b) => (b.participantsCount || 0) - (a.participantsCount || 0))
        break
    }

    return filtered
  }, [allCards, activeTab, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    const today = allCards.filter(card => {
      const createdAt = new Date(card.createdAt || 0)
      const now = new Date()
      return createdAt.toDateString() === now.toDateString()
    }).reduce((sum, card) => {
      const value = typeof card.reward.value === 'number' ? card.reward.value : 0
      return sum + value
    }, 0)

    const week = allCards.reduce((sum, card) => {
      const value = typeof card.reward.value === 'number' ? card.reward.value : 0
      return sum + value
    }, 0)

    const month = week * 4.3 // Rough estimate

    return { today, week, month }
  }, [allCards])

  const handleJoinOpportunity = (id: string) => {
    router.push(`/campaign/${id}`)
  }

  const handleViewOpportunity = (id: string) => {
    router.push(`/campaign/${id}`)
  }

  const handleCreateCampaign = () => {
    setEntitySelectorAction('campaign')
    setShowEntitySelector(true)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]"
        />
      </div>

      {/* Hero Section - ULTRA Compact on Mobile */}
      <section className="relative z-10 px-3 sm:px-6 lg:px-8 pt-2 md:pt-8 pb-2 md:pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Row - Earn left, Create right */}
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-4xl font-black text-[#FFD700]"
            >
              Earn
            </motion.h1>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateCampaign}
              className="flex items-center gap-1.5 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl bg-[#FFD700] hover:bg-[#FFD700]/90 text-black text-sm md:text-base font-bold transition-all"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Create</span>
            </motion.button>
          </div>

          {/* Combined Stats Box - All in one line */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/60 backdrop-blur-xl rounded-lg md:rounded-xl border border-zinc-800 p-2 md:p-4 mb-3 md:mb-4"
          >
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="text-center">
                <div className="text-base md:text-2xl font-bold text-[#FFD700]">
                  ${stats.today.toLocaleString()}
                </div>
                <div className="text-[10px] md:text-xs text-zinc-500">Available</div>
              </div>
              <div className="text-center border-x border-zinc-800">
                <div className="text-base md:text-2xl font-bold text-[#FFD700]">
                  ${stats.week.toLocaleString()}
                </div>
                <div className="text-[10px] md:text-xs text-zinc-500">Paid</div>
              </div>
              <div className="text-center">
                <div className="text-base md:text-2xl font-bold text-[#FFD700]">
                  ${Math.round(stats.month).toLocaleString()}
                </div>
                <div className="text-[10px] md:text-xs text-zinc-500">Total Pool</div>
              </div>
            </div>
          </motion.div>

          {/* Clipping Info - Thin on mobile, more detail on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg md:rounded-xl px-3 md:px-5 py-1.5 md:py-3 mb-3 md:mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-sm md:text-xl">🎬</span>
                <div>
                  <span className="text-xs md:text-base font-bold text-[#FFD700]">Clipping</span>
                  <p className="hidden md:block text-xs text-zinc-400 mt-0.5">
                    Create 30-60s promotional videos for projects
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs md:text-base font-bold text-[#FFD700]">5-50 SOL</span>
                <span className="hidden md:block text-xs text-zinc-400">per submission</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2 md:gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 md:gap-2">
              {TABS.map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-[#FFD700] text-black'
                      : 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800/60 border border-zinc-800'
                  }`}
                >
                  {tab}
                  {tab !== 'All' && tab !== 'Clips' && (
                    <span className="ml-1.5 text-xs opacity-70">
                      ({filteredCards.filter(c =>
                        tab === 'Campaign' ? c.type === 'campaign' :
                        tab === 'Raid' ? c.type === 'raid' :
                        tab === 'Bounty' ? c.type === 'bounty' : true
                      ).length})
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-1 md:gap-2 mt-2 md:mt-4">
            <span className="text-xs text-zinc-500">Sort by:</span>
            {['trending', 'payout', 'closing'].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  sortBy === sort
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Opportunities Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <GlassCard key={i} className="h-32 md:h-48 animate-pulse">
                <div className="p-2 md:p-4">
                  <div className="h-3 md:h-4 bg-zinc-800 rounded mb-2 md:mb-3" />
                  <div className="h-2 md:h-3 bg-zinc-800 rounded mb-1 md:mb-2" />
                  <div className="h-2 md:h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-6">
            {filteredCards.map((card) => (
              <OpportunityCard
                key={card.id}
                card={card}
                onJoin={handleJoinOpportunity}
                onView={handleViewOpportunity}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Target className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Campaigns</h3>
            <p className="text-zinc-400 mb-6">
              Be the first! Create a campaign and get content creators to promote your project
            </p>
            <PremiumButton
              variant="primary"
              onClick={handleCreateCampaign}
            >
              Create Your First Campaign
            </PremiumButton>
          </motion.div>
        )}

        {/* How It Works Section */}
        <section className="mt-6 md:mt-16 hidden md:block">
          <h2 className="text-lg md:text-2xl font-bold text-white text-center mb-2 md:mb-3">How to Start Earning</h2>
          <p className="text-center text-zinc-400 mb-4 md:mb-8 max-w-2xl mx-auto text-xs md:text-sm">
            Join campaigns, create content for projects you believe in, and get paid in SOL
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: '1. Browse Campaigns',
                description: 'Find projects looking for clips, tweets, memes, and more. Choose campaigns that match your skills.',
                gradient: 'from-[#FFD700] to-[#FFD700]',
              },
              {
                icon: Users,
                title: '2. Create Content',
                description: 'Make videos, design graphics, write threads, or create memes. Submit your work for review.',
                gradient: 'from-[#FFD700] to-[#FFD700]',
              },
              {
                icon: DollarSign,
                title: '3. Earn SOL',
                description: 'Get paid instantly when your content is approved. Bonus rewards for high-performing submissions.',
                gradient: 'from-[#FFD700] to-[#FFD700]',
              },
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-5 text-center h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                    <p className="text-xs text-zinc-400">{step.description}</p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Modals */}
      <EntitySelectorModal
        isOpen={showEntitySelector}
        onClose={() => setShowEntitySelector(false)}
        onSelect={handleEntitySelected}
        userProfile={profile}
        projects={linkedProjects}
      />

      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onSubmit={(campaign) => {
          console.log('Campaign created:', campaign)
          setIsCreateCampaignOpen(false)
          // Refresh data
          window.location.reload()
        }}
      />

    </div>
  )
}