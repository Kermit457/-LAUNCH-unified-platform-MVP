'use client'

import { useState } from 'react'
import { Rocket } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-400" />
            Submit Your Project
          </DialogTitle>
          <DialogDescription>
            Share your launch, campaign, raid, or any project with the $LAUNCH community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
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
              <span className="text-white/40 ml-auto">{formData.title.length}/80</span>
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-white">
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
              <span className="text-white/40 ml-auto">{formData.subtitle.length}/120</span>
            </div>
          </div>

          {/* Type & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-white">
                Type <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value as ProjectType)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white">
                Status <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value as Status)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">🟢 Live</SelectItem>
                  <SelectItem value="upcoming">🟡 Upcoming</SelectItem>
                  <SelectItem value="ended">⚫ Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tell the community about your project..."
              maxLength={500}
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            <div className="flex justify-between text-xs">
              {errors.description && <span className="text-red-400">{errors.description}</span>}
              <span className="text-white/40 ml-auto">{formData.description.length}/500</span>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <Label className="text-white">
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
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
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
              <Label htmlFor="creator" className="text-white text-xs">
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
              <Label htmlFor="pool" className="text-white text-xs">
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
              <Label htmlFor="endTime" className="text-white text-xs">
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Rocket size={16} />
              Submit Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
