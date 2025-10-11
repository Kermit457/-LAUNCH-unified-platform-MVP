"use client"

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Trophy, TrendingUp, DollarSign, Gift,
  Users, Target, Swords, Clock, Plus
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

// Enhanced KPI Card Component
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
    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-xl transition-opacity`} />

    <div className="relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
            trend.direction === 'up'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            <TrendingUp className={`w-3 h-3 ${trend.direction === 'down' ? 'rotate-180' : ''}`} />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-zinc-500">{label}</div>
    </div>
  </motion.div>
)

// Enhanced Opportunity Card Component
const OpportunityCard = ({
  card,
  onJoin,
  onView
}: {
  card: ExtendedEarnCard
  onJoin: (id: string) => void
  onView: (id: string) => void
}) => {
  const getTypeGradient = (type: EarnType) => {
    switch(type) {
      case 'campaign': return 'from-green-500 to-emerald-500'
      case 'raid': return 'from-violet-500 to-fuchsia-500'
      case 'bounty': return 'from-cyan-500 to-blue-500'
      default: return 'from-zinc-600 to-zinc-700'
    }
  }

  const getTypeIcon = (type: EarnType) => {
    switch(type) {
      case 'campaign': return Gift
      case 'raid': return Swords
      case 'bounty': return Target
      default: return Trophy
    }
  }

  const Icon = getTypeIcon(card.type)
  const gradient = getTypeGradient(card.type)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={() => onView(card.id)}
    >
      <div className="relative h-full">
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />

        <div className="relative h-full p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 group-hover:border-zinc-700 transition-all">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-white group-hover:text-zinc-100 transition-colors line-clamp-2">
                  {card.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-br ${gradient} text-white`}>
                  {card.type}
                </span>
              </div>
              <p className="text-sm text-zinc-400 line-clamp-2">{card.description}</p>
            </div>
          </div>

          {/* Escrow Badge */}
          {card.escrowId && card.escrowStatus && card.escrowAmount && (
            <div className="mb-4">
              <EscrowStatusCard
                escrowId={card.escrowId}
                status={card.escrowStatus}
                totalAmount={card.escrowAmount}
                participantsTotal={card.expectedParticipants || 0}
                participantsPaid={card.paidParticipants || 0}
                compact={true}
              />
            </div>
          )}

          {/* Stats */}
          <div className="space-y-3 mb-4">
            {/* Reward */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Reward</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="font-bold text-white">
                  {typeof card.reward.value === 'number'
                    ? card.reward.value.toLocaleString()
                    : card.reward.value} {card.reward.currency}
                </span>
              </div>
            </div>

            {/* Deadline */}
            {card.endsAt && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Deadline</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span className="text-xs text-zinc-300">
                    {new Date(card.endsAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Participants */}
            {card.participantsCount !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Participants</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-zinc-400" />
                  <span className="text-xs text-zinc-300">{card.participantsCount}</span>
                </div>
              </div>
            )}

            {/* Progress */}
            {card.progress !== undefined && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-500">Progress</span>
                  <span className="text-zinc-300">{card.progress}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${card.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${gradient}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onJoin(card.id)
            }}
            className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-semibold hover:shadow-lg transition-all`}
          >
            Join Now
          </motion.button>
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

      {/* KPI Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Earn Rewards
            </h1>
            <p className="text-zinc-400">Complete campaigns, raids, and bounties to earn</p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <KPICard
              label="Today"
              value={`$${stats.today.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: '+12%', direction: 'up' }}
              gradient="from-green-500 to-emerald-500"
              delay={0}
            />
            <KPICard
              label="Last 7 Days"
              value={`$${stats.week.toLocaleString()}`}
              icon={TrendingUp}
              trend={{ value: '+24%', direction: 'up' }}
              gradient="from-emerald-500 to-teal-500"
              delay={0.1}
            />
            <KPICard
              label="Last 30 Days"
              value={`$${Math.round(stats.month).toLocaleString()}`}
              icon={Gift}
              trend={{ value: '+8%', direction: 'up' }}
              gradient="from-teal-500 to-cyan-500"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              {TABS.map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
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

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateCampaign}
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white text-sm font-medium transition-all shadow-lg hover:shadow-green-500/25"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Create Campaign
              </motion.button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 mt-4">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GlassCard key={i} className="h-64 animate-pulse">
                <div className="p-6">
                  <div className="h-4 bg-zinc-800 rounded mb-4" />
                  <div className="h-3 bg-zinc-800 rounded mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <h3 className="text-xl font-semibold text-white mb-2">No Opportunities Found</h3>
            <p className="text-zinc-400 mb-6">Check back soon for new earning opportunities</p>
            <PremiumButton
              variant="primary"
              onClick={handleCreateCampaign}
            >
              Create First Campaign
            </PremiumButton>
          </motion.div>
        )}

        {/* How It Works Section */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: '1. Choose Your Path',
                description: 'Pick campaigns, bounties, or raids based on your skills',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: Users,
                title: '2. Create & Engage',
                description: 'Produce content, complete tasks, or refer friends',
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                icon: DollarSign,
                title: '3. Get Paid',
                description: 'Earn automatically as you complete objectives',
                gradient: 'from-teal-500 to-cyan-500',
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
                  <GlassCard className="p-6 text-center h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-400">{step.description}</p>
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