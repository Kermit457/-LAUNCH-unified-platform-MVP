'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CampaignTable } from '@/components/dashboard/Tables'
import { CampaignEditor } from '@/components/drawers/CampaignEditor'
import { mockCampaigns } from '@/lib/dashboardData'
import type { Campaign } from '@/lib/types'

export default function CampaignsPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | undefined>()
  const [campaigns, setCampaigns] = useState(mockCampaigns)

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setIsEditorOpen(true)
  }

  const handleCreate = () => {
    setEditingCampaign(undefined)
    setIsEditorOpen(true)
  }

  const handleSave = (data: Partial<Campaign>) => {
    if (editingCampaign) {
      // Update existing
      setCampaigns(campaigns.map(c =>
        c.id === editingCampaign.id ? { ...c, ...data } : c
      ))
    } else {
      // Create new
      const newCampaign: Campaign = {
        id: `camp_${Date.now()}`,
        ownerId: 'user_123',
        type: data.type || 'clipping',
        name: data.name || 'New Campaign',
        status: 'paused',
        rate: data.rate || { kind: 'cpm', value: 5, mint: 'USDC' },
        budget: data.budget || {
          total: { mint: 'USDC', amount: 100 },
          locked: { mint: 'USDC', amount: 0 },
          spent: { mint: 'USDC', amount: 0 }
        },
        rules: data.rules || {
          platforms: ['x'],
          minDurationSec: 30,
          requiredTags: [],
          requireWatermark: false
        },
        startsAt: Date.now(),
        endsAt: data.endsAt
      }
      setCampaigns([newCampaign, ...campaigns])
    }
    setIsEditorOpen(false)
  }

  const handlePause = (id: string) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, status: 'paused' as const } : c
    ))
  }

  const handleResume = (id: string) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, status: 'live' as const } : c
    ))
  }

  const handleTopUp = (id: string, amount: number) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id) {
        const newTotal = c.budget.total.amount + amount
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
          <CampaignTable
            campaigns={campaigns}
            onEdit={handleEdit}
            onPause={handlePause}
            onResume={handleResume}
            onTopUp={handleTopUp}
          />
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