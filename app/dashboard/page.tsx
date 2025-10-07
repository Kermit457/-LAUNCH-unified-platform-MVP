'use client'

import { useState, useEffect } from 'react'
import { OverviewHeader } from '@/components/dashboard/OverviewHeader'
import { KpiTile } from '@/components/dashboard/KpiTile'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ActivityList, Activity } from '@/components/dashboard/ActivityList'
import { AlertCircle, TrendingUp, DollarSign, Zap, Target, Award } from 'lucide-react'
import { CreateQuestDrawer } from '@/components/quests/CreateQuestDrawer'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { CampaignType } from '@/types/quest'
import { NetworkActivityWidget } from '@/components/dashboard/NetworkActivityWidget'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useUser } from '@/hooks/useUser'
import { getUserProfile } from '@/lib/appwrite/services/users'
import type { UserProfile } from '@/lib/appwrite/services/users'
import { getSubmissions } from '@/lib/appwrite/services/submissions'
import { getCampaigns } from '@/lib/appwrite/services/campaigns'
import { getPayouts } from '@/lib/appwrite/services/payouts'
import { getActivities } from '@/lib/appwrite/services/activities'
import type { Activity as AppwriteActivity } from '@/lib/appwrite/services/activities'

export default function DashboardOverview() {
  const { user, userId } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [kpiData, setKpiData] = useState({
    pendingReviews: 0,
    activeCampaigns: 0,
    pendingAmount: 0,
    claimableAmount: 0,
    thirtyDayEarnings: 0
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false)
  const [initialQuestType, setInitialQuestType] = useState<CampaignType>('raid')
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)

  // Fetch user profile from Appwrite
  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return

      console.log('📊 Dashboard fetching profile for userId:', userId)

      try {
        const data = await getUserProfile(userId)
        console.log('📊 Profile data from Appwrite:', data)
        if (data) {
          setProfile(data)
        } else {
          console.warn('📊 No profile found in Appwrite for userId:', userId)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [userId])

  // Fetch dashboard data from Appwrite
  useEffect(() => {
    async function fetchDashboardData() {
      if (!userId) return

      try {
        setLoading(true)

        // Fetch all data in parallel
        const [submissions, campaigns, payouts, userActivities] = await Promise.all([
          getSubmissions({ userId }),
          getCampaigns({ createdBy: userId }),
          getPayouts({ userId }),
          getActivities(userId, 10)
        ])

        // Calculate KPIs
        const pendingReviews = submissions.filter(s => s.status === 'pending').length
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length

        const pendingAmount = submissions
          .filter(s => s.status === 'approved')
          .reduce((sum, s) => sum + (s.earnings || 0), 0)

        const claimableAmount = payouts
          .filter(p => p.status === 'claimable')
          .reduce((sum, p) => sum + (p.net || p.amount), 0)

        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
        const thirtyDayEarnings = payouts
          .filter(p => p.status === 'paid' && new Date(p.$createdAt).getTime() > thirtyDaysAgo)
          .reduce((sum, p) => sum + (p.net || p.amount), 0)

        setKpiData({
          pendingReviews,
          activeCampaigns,
          pendingAmount,
          claimableAmount,
          thirtyDayEarnings
        })

        // Convert Appwrite activities to Activity format
        const convertedActivities: Activity[] = userActivities.map(activity => ({
          id: activity.$id,
          kind: activity.type as any,
          title: activity.title,
          source: activity.message,
          ts: new Date(activity.$createdAt).getTime()
        }))

        setActivities(convertedActivities)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [userId])

  const conviction = profile?.conviction || 0

  // Format currency with Intl
  const formatUSDC = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header band */}
        <OverviewHeader
          handle={`@${profile?.username || 'user'}`}
          name={profile?.displayName || 'User'}
          roles={profile?.roles || ['Member']}
          verified={profile?.verified || false}
          walletAddress={userId || ''}
          avatar={profile?.avatar}
        />

      {/* KPI Grid - 6 tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiTile
          icon={AlertCircle}
          label="Pending Reviews"
          value={kpiData.pendingReviews.toString()}
          tooltip="Number of submissions awaiting review"
        />
        <KpiTile
          icon={TrendingUp}
          label="Active Campaigns"
          value={kpiData.activeCampaigns.toString()}
          tooltip="Campaigns currently live"
        />
        <KpiTile
          icon={DollarSign}
          label="Pending $"
          value={formatUSDC(kpiData.pendingAmount)}
        />
        <KpiTile
          icon={Zap}
          label="Claimable $"
          value={formatUSDC(kpiData.claimableAmount)}
        />
        <KpiTile
          icon={Target}
          label="30d Earnings"
          value={formatUSDC(kpiData.thirtyDayEarnings)}
        />
        <KpiTile
          icon={Award}
          label="Conviction"
          value={`${conviction}%`}
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
        {/* Network Activity Widget */}
        <NetworkActivityWidget />

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
    </ProtectedRoute>
  )
}
