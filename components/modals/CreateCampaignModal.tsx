'use client'

import { useState, useEffect } from 'react'
import { Video, X, Upload } from 'lucide-react'
import { PremiumButton, Input, Label } from '../design-system'

interface CreateCampaignModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (campaign: any) => void
}

const CAMPAIGN_TYPES = [
  { value: 'clipping', label: '📹 Clipping' },
  { value: 'streaming', label: '📺 Streaming' },
  { value: 'content', label: '📝 Content' },
]

export function CreateCampaignModal({ open, onClose, onSubmit }: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'clipping',
    budget: '',
    duration: '',
    description: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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
    onSubmit(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({ title: '', type: 'clipping', budget: '', duration: '', description: '' })
    setErrors({})
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-design-zinc-950/95 backdrop-blur-xl rounded-2xl border border-design-zinc-800 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200">
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

            {/* Budget & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="budget">Budget ($) <span className="text-red-400">*</span></Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="500"
                  className={errors.budget ? 'border-red-500' : ''}
                />
                {errors.budget && <span className="text-red-400 text-xs">{errors.budget}</span>}
              </div>
              <div>
                <Label htmlFor="duration">Duration <span className="text-red-400">*</span></Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="7 days"
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && <span className="text-red-400 text-xs">{errors.duration}</span>}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Campaign details..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white text-sm placeholder:text-design-zinc-500 focus:outline-none focus:ring-2 focus:ring-design-pink-500/50"
              />
            </div>

            {/* Upload Section */}
            <div className="border-2 border-dashed border-design-zinc-800 rounded-xl p-4 text-center hover:border-design-pink-500/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-design-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-design-zinc-400">Drop files or click to browse</p>
              <p className="text-xs text-design-zinc-600 mt-1">Max 5MB</p>
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
