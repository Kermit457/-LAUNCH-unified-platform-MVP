'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { CampaignTable } from '@/components/dashboard/Tables'
import { CampaignEditor } from '@/components/drawers/CampaignEditor'
import type { Campaign } from '@/lib/types'
import { useUser } from '@/hooks/useUser'
import {
  getCampaigns,
  updateCampaign as updateAppwriteCampaign,
  createCampaign as createAppwriteCampaign,
  Campaign as AppwriteCampaign
} from '@/lib/appwrite/services/campaigns'

// Helper function to convert Appwrite Campaign to Dashboard Campaign
function appwriteToDashboard(ac: AppwriteCampaign): Campaign {
  return {
    id: ac.$id,
    ownerId: ac.creatorId,
    type: ac.type === 'bounty' ? 'bounty' : ac.type === 'quest' ? 'raid' : 'clipping',
    name: ac.title,
    status: ac.status === 'active' ? 'live' : ac.status === 'completed' ? 'completed' : 'paused',
    rate: { kind: 'per_task', value: 0, mint: 'USDC' }, // Default
    budget: {
      total: { mint: 'USDC', amount: ac.budget || 0 },
      locked: { mint: 'USDC', amount: 0 },
      spent: { mint: 'USDC', amount: ac.budgetPaid || 0 }
    },
    rules: {
      platforms: ['x'],
      requiredTags: ac.tags || []
    },
    startsAt: new Date(ac.createdAt).getTime(),
    endsAt: ac.deadline ? new Date(ac.deadline).getTime() : undefined,
    isLive: ac.status === 'active'
  }
}

export default function CampaignsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | undefined>()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch campaigns from Appwrite
  useEffect(() => {
    async function fetchCampaigns() {
      if (!user) return

      try {
        setLoading(true)
        const data = await getCampaigns({ createdBy: user.$id })
        const converted = data.map(appwriteToDashboard)
        setCampaigns(converted)
      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
        setCampaigns([])
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [user])

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setIsEditorOpen(true)
  }

  const handleCreate = () => {
    setEditingCampaign(undefined)
    setIsEditorOpen(true)
  }

  const handleSave = async (data: Partial<Campaign>) => {
    if (!user) return

    try {
      if (editingCampaign) {
        // Update existing campaign in Appwrite
        await updateAppwriteCampaign(editingCampaign.id, {
          title: data.name || editingCampaign.name,
          description: '', // Add if available
          budget: data.budget?.total.amount || editingCampaign.budget.total.amount,
          tags: data.rules?.requiredTags || editingCampaign.rules.requiredTags || []
        })

        // Update local state optimistically
        setCampaigns(campaigns.map(c =>
          c.id === editingCampaign.id ? { ...c, ...data } : c
        ))
      } else {
        // Create new campaign in Appwrite
        const appwriteCampaign = await createAppwriteCampaign({
          title: data.name || 'New Campaign',
          description: '',
          type: data.type === 'bounty' ? 'bounty' : 'quest',
          creatorId: user.$id,
          creatorName: user.name || user.email || 'Unknown',
          budget: data.budget?.total.amount || 100,
          budgetPaid: 0,
          participants: 0,
          deadline: data.endsAt ? new Date(data.endsAt).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          requirements: [],
          tags: data.rules?.requiredTags || []
        })

        // Add to local state
        const newCampaign = appwriteToDashboard(appwriteCampaign)
        setCampaigns([newCampaign, ...campaigns])
      }
      setIsEditorOpen(false)
    } catch (error) {
      console.error('Failed to save campaign:', error)
      alert('Failed to save campaign. Please try again.')
    }
  }

  const handlePause = async (id: string) => {
    try {
      await updateAppwriteCampaign(id, { status: 'cancelled' })
      setCampaigns(campaigns.map(c =>
        c.id === id ? { ...c, status: 'paused' as const } : c
      ))
    } catch (error) {
      console.error('Failed to pause campaign:', error)
      alert('Failed to pause campaign')
    }
  }

  const handleResume = async (id: string) => {
    try {
      await updateAppwriteCampaign(id, { status: 'active' })
      setCampaigns(campaigns.map(c =>
        c.id === id ? { ...c, status: 'live' as const } : c
      ))
    } catch (error) {
      console.error('Failed to resume campaign:', error)
      alert('Failed to resume campaign')
    }
  }

  const handleTopUp = async (id: string, amount: number) => {
    try {
      const campaign = campaigns.find(c => c.id === id)
      if (!campaign) return

      const newTotal = campaign.budget.total.amount + amount
      await updateAppwriteCampaign(id, { budget: newTotal })

      setCampaigns(campaigns.map(c => {
        if (c.id === id) {
          return {
            ...c,
            budget: {
              ...c.budget,
              total: { ...c.budget.total, amount: newTotal }
            }
          }
        }
        return c
      }))
    } catch (error) {
      console.error('Failed to top up campaign:', error)
      alert('Failed to top up campaign budget')
    }
  }

  const handleReview = (id: string) => {
    router.push(`/dashboard/campaigns/${id}/review`)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Campaigns</h1>
            <p className="text-sm text-white/50 mt-1">Manage your bounties, raids, and clipping campaigns</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {/* Campaign Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white/60">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">No campaigns yet</p>
              <p className="text-white/40 text-sm">Create your first campaign to get started</p>
            </div>
          ) : (
            <CampaignTable
              campaigns={campaigns}
              onEdit={handleEdit}
              onPause={handlePause}
              onResume={handleResume}
              onTopUp={handleTopUp}
              onReview={handleReview}
            />
          )}
        </div>
      </div>

      {/* Campaign Editor Drawer */}
      <CampaignEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        campaign={editingCampaign}
      />
    </>
  )
}