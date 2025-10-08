'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OverviewHeader, DashboardMode, LinkedProject } from '@/components/dashboard/OverviewHeader'
import { KpiTile } from '@/components/dashboard/KpiTile'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ProjectKpiTiles } from '@/components/dashboard/ProjectKpiTiles'
import { ActivityList, Activity } from '@/components/dashboard/ActivityList'
import { AlertCircle, TrendingUp, DollarSign, Zap, Target, Award } from 'lucide-react'
import { CreateQuestDrawer } from '@/components/quests/CreateQuestDrawer'
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal'
import { EntitySelectorModal, EntityOption } from '@/components/launch/EntitySelectorModal'
import { CampaignType } from '@/types/quest'
import { NetworkActivityWidget } from '@/components/dashboard/NetworkActivityWidget'
import { NetworkInvitesWidget } from '@/components/dashboard/NetworkInvitesWidget'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useUser } from '@/hooks/useUser'
import { ActivitiesFeed } from '@/components/ActivitiesFeed'
import { getUserProfile } from '@/lib/appwrite/services/users'
import type { UserProfile } from '@/lib/appwrite/services/users'
import { getSubmissions } from '@/lib/appwrite/services/submissions'
import { getCampaigns } from '@/lib/appwrite/services/campaigns'
import { getPayouts } from '@/lib/appwrite/services/payouts'
import { getActivities } from '@/lib/appwrite/services/activities'
import type { Activity as AppwriteActivity } from '@/lib/appwrite/services/activities'
import { getUserProjects, getLaunch } from '@/lib/appwrite/services/launches'
import type { Launch } from '@/lib/appwrite/services/launches'
import { createQuest } from '@/lib/appwrite/services/quests'
import { createCampaign } from '@/lib/appwrite/services/campaigns'

export default function DashboardOverview() {
  const router = useRouter()
  const { userId } = useUser()
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

  // Dashboard mode state
  const [mode, setMode] = useState<DashboardMode>('user')
  const [linkedProjects, setLinkedProjects] = useState<LinkedProject[]>([])
  const [selectedProject, setSelectedProject] = useState<LinkedProject | null>(null)
  const [currentProjectData, setCurrentProjectData] = useState<Launch | null>(null)

  // Modal states
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false)
  const [initialQuestType, setInitialQuestType] = useState<CampaignType>('raid')
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)

  // Entity selector state
  const [showEntitySelector, setShowEntitySelector] = useState(false)
  const [entitySelectorAction, setEntitySelectorAction] = useState<'campaign' | 'quest'>('campaign')
  const [selectedEntity, setSelectedEntity] = useState<EntityOption | null>(null)

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

  // Fetch user's projects for mode switcher
  useEffect(() => {
    async function fetchProjects() {
      if (!userId) return

      try {
        const projects = await getUserProjects(userId)
        const projectList: LinkedProject[] = projects.map(p => ({
          id: p.$id,
          title: p.title || p.tokenName || 'Unnamed Project',
          logoUrl: p.logoUrl || p.tokenImage,
          scope: p.scope || 'ICM'
        }))
        setLinkedProjects(projectList)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }

    fetchProjects()
  }, [userId])

  // Fetch current project data when in project mode
  useEffect(() => {
    async function fetchProjectData() {
      if (mode === 'project' && selectedProject) {
        try {
          const projectData = await getLaunch(selectedProject.id)
          setCurrentProjectData(projectData)
        } catch (error) {
          console.error('Failed to fetch project data:', error)
        }
      }
    }

    fetchProjectData()
  }, [mode, selectedProject])

  // Handle mode change
  const handleModeChange = (newMode: DashboardMode, project?: LinkedProject) => {
    setMode(newMode)
    if (newMode === 'project' && project) {
      setSelectedProject(project)
    } else {
      setSelectedProject(null)
      setCurrentProjectData(null)
    }
  }

  // Fetch dashboard data from Appwrite - ENTITY SCOPED
  useEffect(() => {
    async function fetchDashboardData() {
      if (!userId) return

      try {
        setLoading(true)

        // Determine entity scope based on mode
        const ownerType = mode === 'project' ? 'project' : 'user'
        const ownerId = mode === 'project' && selectedProject ? selectedProject.id : userId

        console.log(`📊 Fetching dashboard data for ${ownerType}:`, ownerId)

        // Fetch all data in parallel - ENTITY SCOPED
        const [submissions, campaigns, payouts, userActivities] = await Promise.all([
          getSubmissions({
            ownerType,
            ownerId,
            userId: mode === 'user' ? userId : undefined // Only filter by userId in user mode
          }),
          getCampaigns({
            ownerType,
            ownerId
          }),
          getPayouts({
            ownerType,
            ownerId,
            userId: mode === 'user' ? userId : undefined
          }),
          getActivities(userId, 10, {
            contextType: ownerType,
            contextId: ownerId
          })
        ])

        console.log(`📊 Found: ${campaigns.length} campaigns, ${submissions.length} submissions, ${payouts.length} payouts`)

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
  }, [userId, mode, selectedProject])

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
        {/* Header band with mode switcher */}
        <OverviewHeader
          handle={`@${profile?.username || 'user'}`}
          name={profile?.displayName || 'User'}
          roles={profile?.roles || ['Member']}
          verified={profile?.verified || false}
          walletAddress={userId || ''}
          avatar={profile?.avatar}
          mode={mode}
          selectedProject={selectedProject}
          linkedProjects={linkedProjects}
          onModeChange={handleModeChange}
        />

        {/* Conditional KPI Tiles based on mode */}
        {mode === 'user' ? (
          /* User Mode KPIs */
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
        ) : (
          /* Project Mode KPIs */
          currentProjectData && <ProjectKpiTiles project={currentProjectData} />
        )}

        {/* Unified Quick Actions - Same for User & Project */}
        <QuickActions
          onCreateCampaign={() => {
            setEntitySelectorAction('campaign')
            setShowEntitySelector(true)
          }}
          onCreateRaid={() => {
            setEntitySelectorAction('quest')
            setInitialQuestType('raid')
            setShowEntitySelector(true)
          }}
          onCreateBounty={() => {
            setEntitySelectorAction('quest')
            setInitialQuestType('bounty')
            setShowEntitySelector(true)
          }}
          onViewAnalytics={() => router.push('/dashboard/analytics')}
          onOpenSettings={() => router.push('/dashboard/settings')}
        />

      {/* Network Invites (if any) */}
      <NetworkInvitesWidget />

      {/* Network Summary + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Activity Widget */}
        <NetworkActivityWidget />

        {/* Recent Activity */}
        <div className="lg:col-span-3">
          <ActivityList activities={activities} />
        </div>
      </div>

      {/* Real-time Activities Feed */}
      <div className="glass-card p-6">
        <ActivitiesFeed />
      </div>

      {/* Entity Selector Modal */}
      {profile && (
        <EntitySelectorModal
          isOpen={showEntitySelector}
          onClose={() => setShowEntitySelector(false)}
          onSelect={(entity) => {
            setSelectedEntity(entity)
            setShowEntitySelector(false)

            // Open appropriate creation modal based on action
            if (entitySelectorAction === 'campaign') {
              setIsCreateCampaignOpen(true)
            } else {
              setIsCreateQuestOpen(true)
            }
          }}
          onCreateNewProject={() => {
            // TODO: Implement create new project flow
            alert('Create new project flow coming soon!')
          }}
          userProfile={{
            id: userId || '',
            name: profile.displayName || 'User',
            username: profile.username,
            avatar: profile.avatar
          }}
          projects={linkedProjects}
        />
      )}

      {/* Create Quest Drawer */}
      <CreateQuestDrawer
        isOpen={isCreateQuestOpen}
        initialType={initialQuestType}
        onClose={() => setIsCreateQuestOpen(false)}
        onSubmit={async (data) => {
          if (!userId) {
            alert('Please sign in to create a quest')
            return
          }

          if (!selectedEntity) {
            alert('Please select an entity first')
            return
          }

          try {
            console.log('🎯 Creating quest with entity:', selectedEntity, data)

            // Upload logo if provided
            let logoUrl = ''
            if (data.logoFile) {
              console.log('📤 Uploading quest logo...')
              const { uploadLogo } = await import('@/lib/storage')
              try {
                logoUrl = await uploadLogo(data.logoFile)
                console.log('✅ Logo uploaded:', logoUrl)
              } catch (uploadError: any) {
                console.error('❌ Logo upload failed:', uploadError)
                alert(`Logo upload failed: ${uploadError.message}. Quest will be created without logo.`)
              }
            }

            // Create quest document
            const budgetAmount = data.funding?.kind === 'paid' && data.funding.model?.amount ? Number(data.funding.model.amount) : 0

            console.log('💰 Budget amount calculated:', budgetAmount)

            // @ts-ignore - Bypass type check for budgetTotal field
            const newQuest = await createQuest({
              questId: data.id || crypto.randomUUID(),
              type: data.type,
              title: data.title,
              description: data.targetUrl || data.title,
              createdBy: userId,
              status: 'active' as const,
              poolAmount: budgetAmount,
              budgetTotal: budgetAmount,
              budgetPaid: 0,
              payPerTask: 0,
              platforms: data.rules.platforms.map(p => p.toString())
            })

            console.log('✅ Quest created:', newQuest)

            alert('🎉 Quest created successfully!')
            setIsCreateQuestOpen(false)
            setSelectedEntity(null)
          } catch (error: any) {
            console.error('Failed to create quest:', error)
            alert(`Failed to create quest: ${error.message || 'Unknown error'}`)
          }
        }}
      />

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onSubmit={async (data) => {
          if (!userId) {
            alert('Please sign in to create a campaign')
            return
          }

          if (!selectedEntity) {
            alert('Please select an entity first')
            return
          }

          try {
            console.log('🎬 Creating campaign with entity:', selectedEntity, data)

            // Upload campaign image if provided
            let imageUrl = ''
            if (data.image) {
              console.log('📤 Uploading campaign image...')
              const { uploadLogo } = await import('@/lib/storage')
              try {
                imageUrl = await uploadLogo(data.image)
                console.log('✅ Image uploaded:', imageUrl)
              } catch (uploadError: any) {
                console.error('❌ Image upload failed:', uploadError)
                alert(`Image upload failed: ${uploadError.message}. Campaign will be created without image.`)
              }
            }

            // Determine entity context from selectedEntity
            const ownerType = selectedEntity.type === 'user' ? 'user' : 'project'
            const ownerId = selectedEntity.type === 'user' ? userId : selectedEntity.id

            // Create campaign document with entity scoping
            const newCampaign = await createCampaign({
              campaignId: crypto.randomUUID(),
              type: 'clipping',
              title: data.title,
              description: data.description || '',
              createdBy: userId,
              status: 'active',
              prizePool: data.prizePoolUsd,
              budgetTotal: data.prizePoolUsd,
              ratePerThousand: data.payoutPerKUsd,
              minViews: data.minViewsRequired || 0,
              minDuration: data.videoLen?.minSec || 0,
              maxDuration: data.videoLen?.maxSec || 0,
              platforms: data.platforms,
              socialLinks: data.socialLinks,
              gdocUrl: data.driveLink || '',
              imageUrl: imageUrl,
              ownerType: ownerType,
              ownerId: ownerId
            })

            console.log('✅ Campaign created:', newCampaign)

            alert('🎉 Campaign created successfully!')
            setIsCreateCampaignOpen(false)
            setSelectedEntity(null)
          } catch (error: any) {
            console.error('Failed to create campaign:', error)
            alert(`Failed to create campaign: ${error.message || 'Unknown error'}`)
          }
        }}
      />
      </div>
    </ProtectedRoute>
  )
}
