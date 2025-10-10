'use client'

import { useState, useEffect } from 'react'
import { Rocket, X, ChevronDown } from 'lucide-react'
import { PremiumButton, Input, Label } from '@/components/design-system'
import type { Project, ProjectType, Status } from '@/types'

interface SubmitLaunchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (project: Project) => void
}

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'launch', label: '🚀 Launch' },
  { value: 'campaign', label: '📹 Campaign' },
  { value: 'raid', label: '⚔️ Raid' },
  { value: 'prediction', label: '🎯 Prediction' },
  { value: 'ad', label: '💰 Ad' },
  { value: 'quest', label: '🎮 Quest' },
  { value: 'spotlight', label: '⭐ Spotlight' },
]

const PLATFORMS = ['twitter', 'discord', 'telegram', 'youtube', 'twitch', 'tiktok', 'obs']

const STATUSES: { value: Status; label: string }[] = [
  { value: 'live', label: '🟢 Live' },
  { value: 'upcoming', label: '🟡 Upcoming' },
  { value: 'ended', label: '⚫ Ended' },
]

export function SubmitLaunchModal({ open, onOpenChange, onSubmit }: SubmitLaunchModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'launch' as ProjectType,
    description: '',
    platforms: [] as string[],
    status: 'live' as Status,
    creator: '',
    pool: '',
    endTime: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose()
      }
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 80) {
      newErrors.title = 'Title must be 80 characters or less'
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle is required'
    } else if (formData.subtitle.length > 120) {
      newErrors.subtitle = 'Subtitle must be 120 characters or less'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less'
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'Select at least one platform'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Generate new project
    const newProject: Project = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      type: formData.type,
      title: formData.title,
      subtitle: formData.subtitle,
      status: formData.status,
      platforms: formData.platforms,
      creator: formData.creator || 'Anonymous',
      upvotes: 0,
      comments: [],
      createdAt: new Date(),
      cta: { label: 'View', href: '#' },
    }

    // Add optional fields
    if (formData.pool) {
      newProject.progress = {
        paid: 0,
        pool: parseInt(formData.pool) || 0,
      }
    }

    if (formData.endTime) {
      newProject.endTime = formData.endTime
    }

    onSubmit(newProject)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      type: 'launch',
      description: '',
      platforms: [],
      status: 'live',
      creator: '',
      pool: '',
      endTime: '',
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-design-zinc-950/95 backdrop-blur-xl rounded-2xl border border-design-zinc-800 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="sticky top-0 bg-design-zinc-950/95 backdrop-blur-xl border-b border-design-zinc-800 p-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-design-purple-400" />
                <h2 className="text-lg font-bold text-white">Submit Your Project</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-design-zinc-800/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-design-zinc-400" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., $MEME Token Launch"
                maxLength={80}
                className={errors.title ? 'border-red-500' : ''}
              />
              <div className="flex justify-between text-xs">
                {errors.title && <span className="text-red-400">{errors.title}</span>}
                <span className="text-design-zinc-500 ml-auto">{formData.title.length}/80</span>
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">
                Subtitle <span className="text-red-400">*</span>
              </Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="e.g., Community-driven meme coin with revolutionary tokenomics"
                maxLength={120}
                className={errors.subtitle ? 'border-red-500' : ''}
              />
              <div className="flex justify-between text-xs">
                {errors.subtitle && <span className="text-red-400">{errors.subtitle}</span>}
                <span className="text-design-zinc-500 ml-auto">{formData.subtitle.length}/120</span>
              </div>
            </div>

            {/* Type & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as ProjectType)}
                    className="w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-design-purple-500/50 transition-all duration-200"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-design-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as Status)}
                    className="w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-design-purple-500/50 transition-all duration-200"
                  >
                    {STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-design-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-400">*</span>
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell the community about your project..."
                maxLength={500}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white placeholder:text-design-zinc-500 focus:outline-none focus:ring-2 focus:ring-design-purple-500/50 transition-all duration-200 ${errors.description ? 'border-red-500' : ''}`}
              />
              <div className="flex justify-between text-xs">
                {errors.description && <span className="text-red-400">{errors.description}</span>}
                <span className="text-design-zinc-500 ml-auto">{formData.description.length}/500</span>
              </div>
            </div>

            {/* Platforms */}
            <div className="space-y-2">
              <Label>
                Platforms <span className="text-red-400">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      formData.platforms.includes(platform)
                        ? 'bg-gradient-to-r from-design-pink-500 to-design-purple-600 text-white'
                        : 'bg-design-zinc-900/50 text-design-zinc-400 hover:bg-design-zinc-800 border border-design-zinc-800'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
              {errors.platforms && <span className="text-red-400 text-xs">{errors.platforms}</span>}
            </div>

            {/* Optional Fields Row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Creator */}
              <div className="space-y-2">
                <Label htmlFor="creator" className="text-xs">
                  Creator (optional)
                </Label>
                <Input
                  id="creator"
                  value={formData.creator}
                  onChange={(e) => handleInputChange('creator', e.target.value)}
                  placeholder="Your name"
                  className="text-sm"
                />
              </div>

              {/* Pool/Budget */}
              <div className="space-y-2">
                <Label htmlFor="pool" className="text-xs">
                  Pool $ (optional)
                </Label>
                <Input
                  id="pool"
                  type="number"
                  value={formData.pool}
                  onChange={(e) => handleInputChange('pool', e.target.value)}
                  placeholder="5000"
                  className="text-sm"
                />
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-xs">
                  End Time (optional)
                </Label>
                <Input
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  placeholder="2h 30m"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-4">
              <PremiumButton
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </PremiumButton>
              <PremiumButton
                type="submit"
                variant="primary"
                className="flex-1"
              >
                <Rocket size={16} />
                Submit Project
              </PremiumButton>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
