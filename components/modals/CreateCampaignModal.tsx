'use client'

import { useState, useEffect } from 'react'
import { Video, X, Upload, DollarSign, Calendar, Target, Youtube, Twitter as TwitterIcon } from 'lucide-react'
import { PremiumButton, Input, Label } from '../design-system'
import { type CampaignFormData } from '@/lib/validations/clip'

interface CreateCampaignModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (campaign: CampaignFormData) => void
}

const CAMPAIGN_TYPES = [
  { value: 'clipping', label: '📹 Clipping' },
  { value: 'bounty', label: '🎯 Bounty' },
  { value: 'airdrop', label: '🪂 Airdrop' },
]

const PLATFORMS = [
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'twitter', label: 'Twitter/X', icon: TwitterIcon },
  { value: 'tiktok', label: 'TikTok', icon: Video },
]

const SOL_TO_USD = 140 // Mock exchange rate, should be fetched from API

export function CreateCampaignModal({ open, onClose, onSubmit }: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'clipping',
    budget: '',
    ratePerThousand: '',
    duration: '',
    description: '',
    platforms: [] as string[],
    requirements: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [budgetInUSD, setBudgetInUSD] = useState(0)
  const [newRequirement, setNewRequirement] = useState('')

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) handleClose()
    }
    if (open) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Calculate budget in USD when SOL budget changes
  useEffect(() => {
    if (formData.budget) {
      const solAmount = parseFloat(formData.budget)
      if (!isNaN(solAmount)) {
        setBudgetInUSD(solAmount * SOL_TO_USD)
      }
    } else {
      setBudgetInUSD(0)
    }
  }, [formData.budget])

  const handleInputChange = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required'
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData as CampaignFormData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      title: '',
      type: 'clipping',
      budget: '',
      ratePerThousand: '',
      duration: '',
      description: '',
      platforms: [],
      requirements: []
    })
    setErrors({})
    setBudgetInUSD(0)
    setNewRequirement('')
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 pointer-events-none overflow-y-auto">
        <div className="w-full max-w-md bg-design-zinc-950/95 backdrop-blur-xl rounded-xl md:rounded-2xl border border-design-zinc-800 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200 my-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Header */}
          <div className="border-b border-design-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-design-pink-400" />
                <h2 className="text-lg font-bold text-white">Create Campaign</h2>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-design-zinc-800/50 rounded-lg transition-colors">
                <X className="w-4 h-4 text-design-zinc-400" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Type */}
            <div>
              <Label htmlFor="type">Type <span className="text-red-400">*</span></Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-design-pink-500/50"
              >
                {CAMPAIGN_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title <span className="text-red-400">*</span></Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Clip my best moments"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <span className="text-red-400 text-xs">{errors.title}</span>}
            </div>

            {/* Budget (SOL) with USD Calculator */}
            <div>
              <Label htmlFor="budget">Budget (SOL) <span className="text-red-400">*</span></Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-design-zinc-400" />
                <Input
                  id="budget"
                  type="number"
                  step="0.1"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="5.0"
                  className={`pl-10 ${errors.budget ? 'border-red-500' : ''}`}
                />
              </div>
              {budgetInUSD > 0 && (
                <p className="text-xs text-design-zinc-400 mt-1">
                  ≈ ${budgetInUSD.toFixed(2)} USD
                </p>
              )}
              {errors.budget && <span className="text-red-400 text-xs">{errors.budget}</span>}
            </div>

            {/* Rate per 1000 views */}
            <div>
              <Label htmlFor="ratePerThousand">Rate per 1000 Views ($)</Label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-design-zinc-400" />
                <Input
                  id="ratePerThousand"
                  type="number"
                  step="0.01"
                  value={formData.ratePerThousand}
                  onChange={(e) => handleInputChange('ratePerThousand', e.target.value)}
                  placeholder="0.50"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-design-zinc-400 mt-1">
                Creators earn this rate per 1,000 views
              </p>
            </div>

            {/* Platform Multi-Select */}
            <div>
              <Label>Platforms <span className="text-red-400">*</span></Label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map((platform) => {
                  const Icon = platform.icon
                  const isSelected = formData.platforms.includes(platform.value)
                  return (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => togglePlatform(platform.value)}
                      className={`p-2.5 rounded-lg border transition-all text-sm flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-design-pink-500/20 border-design-pink-500 text-white'
                          : 'bg-design-zinc-900/50 border-design-zinc-800 text-design-zinc-400 hover:border-design-pink-500/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{platform.label.split('/')[0]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Duration Picker */}
            <div>
              <Label htmlFor="duration">Duration <span className="text-red-400">*</span></Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-design-zinc-400" />
                <select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className={`w-full pl-10 px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-design-pink-500/50 ${
                    errors.duration ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select duration</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
              {errors.duration && <span className="text-red-400 text-xs">{errors.duration}</span>}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Campaign details, goals, and guidelines..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white text-sm placeholder:text-design-zinc-500 focus:outline-none focus:ring-2 focus:ring-design-pink-500/50"
              />
            </div>

            {/* Submission Requirements Builder */}
            <div>
              <Label>Submission Requirements</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addRequirement()
                      }
                    }}
                    placeholder="e.g., Minimum 10 seconds"
                    className="flex-1 px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white text-sm placeholder:text-design-zinc-500 focus:outline-none focus:ring-2 focus:ring-design-pink-500/50"
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-3 py-2 rounded-lg bg-design-pink-500 text-white text-sm hover:bg-design-pink-600 transition"
                  >
                    Add
                  </button>
                </div>
                {formData.requirements.length > 0 && (
                  <div className="space-y-1">
                    {formData.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800"
                      >
                        <span className="flex-1 text-sm text-white">{req}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="p-1 hover:bg-design-zinc-800 rounded transition"
                        >
                          <X className="w-4 h-4 text-design-zinc-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <PremiumButton type="button" variant="ghost" onClick={handleClose} className="flex-1">
                Cancel
              </PremiumButton>
              <PremiumButton type="submit" variant="primary" className="flex-1">
                <Video size={16} />
                Create Campaign
              </PremiumButton>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
