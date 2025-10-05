"use client"

import { useState } from 'react'
import { X } from 'lucide-react'
import { Campaign, CampaignType, Mint } from '@/lib/types'
import { cn } from '@/lib/cn'

interface CampaignEditorProps {
  isOpen: boolean
  onClose: () => void
  campaign?: Campaign
  onSave: (campaign: Partial<Campaign>) => void
}

export function CampaignEditor({ isOpen, onClose, campaign, onSave }: CampaignEditorProps) {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    type: campaign?.type || 'clipping' as CampaignType,
    platforms: campaign?.rules.platforms || [] as ('x'|'youtube'|'tiktok'|'twitch')[],
    rateKind: campaign?.rate.kind || 'cpm' as 'cpm' | 'per_task',
    rateValue: campaign?.rate.value || 0,
    rateMint: campaign?.rate.mint || 'USDC' as Mint,
    budgetTotal: campaign?.budget.total.amount || 0,
    minDurationSec: campaign?.rules.minDurationSec || 0,
    maxDurationSec: campaign?.rules.maxDurationSec || 0,
    requiredTags: campaign?.rules.requiredTags?.join(', ') || '',
    requireWatermark: campaign?.rules.requireWatermark || false,
    endsAt: campaign?.endsAt ? new Date(campaign.endsAt).toISOString().split('T')[0] : ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...campaign,
      name: formData.name,
      type: formData.type,
      rate: {
        kind: formData.rateKind,
        value: formData.rateValue,
        mint: formData.rateMint
      },
      budget: {
        total: { mint: formData.rateMint, amount: formData.budgetTotal },
        locked: campaign?.budget.locked || { mint: formData.rateMint, amount: 0 },
        spent: campaign?.budget.spent || { mint: formData.rateMint, amount: 0 }
      },
      rules: {
        platforms: formData.platforms,
        minDurationSec: formData.minDurationSec || undefined,
        maxDurationSec: formData.maxDurationSec || undefined,
        requiredTags: formData.requiredTags ? formData.requiredTags.split(',').map(t => t.trim()) : undefined,
        requireWatermark: formData.requireWatermark
      },
      endsAt: formData.endsAt ? new Date(formData.endsAt).getTime() : undefined
    })
    onClose()
  }

  const togglePlatform = (platform: 'x'|'youtube'|'tiktok'|'twitch') => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-neutral-900 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-neutral-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {campaign ? 'Edit Campaign' : 'Create Campaign'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basics</h3>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Campaign Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Solana Summer Clips"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as CampaignType })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="clipping">Clipping</option>
                <option value="raid">Raid</option>
                <option value="bounty">Bounty</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {(['x', 'youtube', 'tiktok', 'twitch'] as const).map(platform => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                      formData.platforms.includes(platform)
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    )}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Rates</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Rate Type</label>
                <select
                  value={formData.rateKind}
                  onChange={(e) => setFormData({ ...formData, rateKind: e.target.value as 'cpm' | 'per_task' })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cpm">CPM</option>
                  <option value="per_task">Per Task</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Mint</label>
                <select
                  value={formData.rateMint}
                  onChange={(e) => setFormData({ ...formData, rateMint: e.target.value as Mint })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="USDC">USDC</option>
                  <option value="SOL">SOL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Rate Value ({formData.rateKind === 'cpm' ? 'per 1000 views' : 'per task'})
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.rateValue}
                onChange={(e) => setFormData({ ...formData, rateValue: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Budget</h3>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Total Budget ({formData.rateMint})
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.budgetTotal}
                onChange={(e) => setFormData({ ...formData, budgetTotal: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">End Date (optional)</label>
              <input
                type="date"
                value={formData.endsAt}
                onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Rules</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Min Duration (seconds, optional)
                </label>
                <input
                  type="number"
                  value={formData.minDurationSec}
                  onChange={(e) => setFormData({ ...formData, minDurationSec: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Max Duration (seconds, optional)
                </label>
                <input
                  type="number"
                  value={formData.maxDurationSec}
                  onChange={(e) => setFormData({ ...formData, maxDurationSec: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="180"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Required Tags (comma-separated, optional)
              </label>
              <input
                type="text"
                value={formData.requiredTags}
                onChange={(e) => setFormData({ ...formData, requiredTags: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="#Solana, @project"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="requireWatermark"
                checked={formData.requireWatermark}
                onChange={(e) => setFormData({ ...formData, requireWatermark: e.target.checked })}
                className="rounded border-white/20 bg-white/5"
              />
              <label htmlFor="requireWatermark" className="text-sm text-white/70">
                Require Watermark
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold transition-all shadow-lg"
            >
              {campaign ? 'Save Changes' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
