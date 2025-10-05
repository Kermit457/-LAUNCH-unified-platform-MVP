'use client'

import { useState } from 'react'
import Link from 'next/link'
import { OverviewHeader } from '@/components/dashboard/OverviewHeader'
import { KpiTile } from '@/components/dashboard/KpiTile'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ActivityList, Activity } from '@/components/dashboard/ActivityList'
import { AlertCircle, TrendingUp, DollarSign, Zap, Target, Award, Users } from 'lucide-react'
import { mockCampaigns, mockSubmissions, mockPayouts } from '@/lib/dashboardData'
import { useNetworkStore } from '@/lib/stores/useNetworkStore'
import { CreateQuestDrawer } from '@/components/quests/CreateQuestDrawer'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { CampaignType } from '@/types/quest'

export default function DashboardOverview() {
  const pendingInvites = useNetworkStore(state => state.getPendingInvitesCount())
  const unreadDMs = useNetworkStore(state => state.getUnreadDMsCount())

  // Modal states
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false)
  const [initialQuestType, setInitialQuestType] = useState<CampaignType>('raid')
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)

  // Calculate KPIs from mock data
  const pendingReviews = mockSubmissions.filter(s => s.status === 'pending').length
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'live').length

  const pendingAmount = mockSubmissions
    .filter(s => s.status === 'approved')
    .reduce((sum, s) => sum + s.reward.amount, 0)

  const claimableAmount = mockPayouts
    .filter(p => p.status === 'claimable')
    .reduce((sum, p) => sum + (p.net || p.amount), 0)

  const thirtyDayEarnings = mockPayouts
    .filter(p => p.status === 'paid' && Date.now() - p.createdAt < 30 * 24 * 60 * 60 * 1000)
    .reduce((sum, p) => sum + (p.net || p.amount), 0)

  const conviction = 87 // Mock conviction score

  // Format currency with Intl
  const formatUSDC = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Activity feed
  const activities: Activity[] = [
    {
      id: '1',
      kind: 'submission',
      title: 'New submission from @creator_123',
      source: 'Solana Summer Clips',
      ts: Date.now() - 2 * 60 * 1000, // 2 min ago
    },
    {
      id: '2',
      kind: 'campaign_live',
      title: 'Campaign "Holiday Raid" went live',
      ts: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
    },
    {
      id: '3',
      kind: 'payout',
      title: 'Payment of $45.00 USDC claimed',
      ts: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
    },
    {
      id: '4',
      kind: 'approval',
      title: 'Submission approved for @influencer_99',
      source: 'NFT Launch Clips',
      ts: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    },
    {
      id: '5',
      kind: 'topup',
      title: 'Budget topped up on "Clipping Contest"',
      ts: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header band */}
      <OverviewHeader
        handle="@alpha_fren"
        name="Alpha Fren"
        roles={['Creator', 'Advertiser']}
        verified={true}
        walletAddress="FRENwABC123XYZ789x7gH2"
      />

      {/* KPI Grid - 6 tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiTile
          icon={AlertCircle}
          label="Pending Reviews"
          value={pendingReviews.toString()}
          delta={{ value: 12, dir: 'up' }}
          tooltip="Number of submissions awaiting review"
        />
        <KpiTile
          icon={TrendingUp}
          label="Active Campaigns"
          value={activeCampaigns.toString()}
          delta={{ value: 2, dir: 'up' }}
          tooltip="Campaigns currently live"
        />
        <KpiTile
          icon={DollarSign}
          label="Pending $"
          value={formatUSDC(pendingAmount)}
        />
        <KpiTile
          icon={Zap}
          label="Claimable $"
          value={formatUSDC(claimableAmount)}
          delta={{ value: 8, dir: 'up' }}
        />
        <KpiTile
          icon={Target}
          label="30d Earnings"
          value={formatUSDC(thirtyDayEarnings)}
          delta={{ value: 15, dir: 'up' }}
        />
        <KpiTile
          icon={Award}
          label="Conviction"
          value={`${conviction}%`}
          delta={{ value: 3, dir: 'up' }}
          progressPct={conviction}
          tooltip="Overall platform trust score"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions
        onCreateCampaign={() => setIsCreateCampaignOpen(true)}
        onCreateRaid={() => {
          setInitialQuestType('raid')
          setIsCreateQuestOpen(true)
        }}
        onCreateBounty={() => {
          setInitialQuestType('bounty')
          setIsCreateQuestOpen(true)
        }}
      />

      {/* Network Summary + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Summary Card */}
        <Link
          href="/dashboard/network"
          className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 hover:border-fuchsia-500/30 transition-all group"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-fuchsia-400" />
            Network
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Invites:</span>
              <span className="text-white font-medium">{pendingInvites}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Unread:</span>
              <span className="text-white font-medium">{unreadDMs}</span>
            </div>
          </div>
          <div className="mt-4 text-fuchsia-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            View Network
            <span>→</span>
          </div>
        </Link>

        {/* Recent Activity */}
        <div className="lg:col-span-3">
          <ActivityList activities={activities} />
        </div>
      </div>

      {/* Create Quest Drawer */}
      <CreateQuestDrawer
        isOpen={isCreateQuestOpen}
        initialType={initialQuestType}
        onClose={() => setIsCreateQuestOpen(false)}
        onSubmit={(data) => {
          console.log('Quest created:', data)
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
