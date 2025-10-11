'use client'

import { useState, useEffect } from 'react'
import { Video, Plus, Play, Pause, Trash2, Edit } from 'lucide-react'
import { PremiumButton } from '@/components/design-system'
import { useUser } from '@/hooks/useUser'
import { getCampaigns } from '@/lib/appwrite/services/campaigns'
import { motion } from 'framer-motion'

type Campaign = {
  id: string
  title: string
  status: 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  submissions: number
  createdAt: number
}

export default function CampaignsPage() {
  const { userId } = useUser()
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    async function fetchCampaigns() {
      if (!userId) return

      try {
        setLoading(true)
        const data = await getCampaigns({ createdBy: userId })
        const converted: Campaign[] = data.map(c => ({
          id: c.$id,
          title: c.title,
          status: c.status === 'active' ? 'active' : c.status === 'completed' ? 'completed' : 'paused',
          budget: c.budgetTotal || 0,
          spent: c.budgetPaid || 0,
          submissions: 0,
          createdAt: new Date(c.$createdAt).getTime()
        }))
        setCampaigns(converted)
      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-design-purple-500 mx-auto mb-4"></div>
          <p className="text-design-zinc-400">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active')
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-design-purple-600/20 via-design-pink-600/20 to-design-purple-800/20 rounded-2xl border border-design-zinc-800 p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
            <p className="text-design-zinc-400">Manage your content campaigns</p>
          </div>
          <PremiumButton variant="primary">
            <Plus size={16} />
            Create Campaign
          </PremiumButton>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-design-purple-500/10 border border-design-purple-500/20">
              <Video className="w-5 h-5 text-design-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Active Campaigns</h3>
          </div>
          <div className="text-3xl font-bold text-white">{activeCampaigns.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <Video className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-semibold text-white">Total Budget</h3>
          </div>
          <div className="text-3xl font-bold text-white">${totalBudget.toLocaleString()}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Video className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="font-semibold text-white">Total Spent</h3>
          </div>
          <div className="text-3xl font-bold text-white">${totalSpent.toLocaleString()}</div>
        </motion.div>
      </div>

      {/* Campaigns List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-design-zinc-900/50 rounded-xl border border-design-zinc-800 overflow-hidden"
      >
        <div className="p-6 border-b border-design-zinc-800">
          <h2 className="text-xl font-bold text-white">Your Campaigns</h2>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <Video className="w-12 h-12 text-design-zinc-600 mx-auto mb-4" />
            <p className="text-design-zinc-400 mb-2">No campaigns yet</p>
            <p className="text-sm text-design-zinc-600 mb-4">Create your first campaign to get started</p>
            <PremiumButton variant="primary">
              <Plus size={16} />
              Create Campaign
            </PremiumButton>
          </div>
        ) : (
          <div className="divide-y divide-design-zinc-800">
            {campaigns.map((campaign, i) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 hover:bg-design-zinc-800/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{campaign.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : campaign.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-design-zinc-400">
                      <span>Budget: ${campaign.budget.toLocaleString()}</span>
                      <span>Spent: ${campaign.spent.toLocaleString()}</span>
                      <span>{campaign.submissions} submissions</span>
                      <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 bg-design-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-design-purple-500 to-design-pink-500"
                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <PremiumButton variant="ghost" size="sm">
                      <Edit size={14} />
                    </PremiumButton>
                    <PremiumButton variant="ghost" size="sm">
                      {campaign.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </PremiumButton>
                    <PremiumButton variant="ghost" size="sm">
                      <Trash2 size={14} />
                    </PremiumButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
