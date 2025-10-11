'use client'

import { useState, useEffect } from 'react'
import { DollarSign, X, ChevronDown } from 'lucide-react'
import { PremiumButton, Input, Label } from '../design-system'

interface CreateBountyModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (bounty: any) => void
}

const BOUNTY_TYPES = [
  { value: 'development', label: '💻 Development' },
  { value: 'design', label: '🎨 Design' },
  { value: 'content', label: '✍️ Content' },
  { value: 'marketing', label: '📣 Marketing' },
  { value: 'other', label: '⚡ Other' },
]

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: 'text-green-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'hard', label: 'Hard', color: 'text-red-400' },
]

export function CreateBountyModal({ open, onClose, onSubmit }: CreateBountyModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'development',
    reward: '',
    difficulty: 'medium',
    deadline: '',
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
    if (!formData.reward.trim()) newErrors.reward = 'Reward is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
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
    setFormData({ title: '', type: 'development', reward: '', difficulty: 'medium', deadline: '', description: '' })
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
                <DollarSign className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-white">Create Bounty</h2>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-design-zinc-800/50 rounded-lg transition-colors">
                <X className="w-4 h-4 text-design-zinc-400" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title <span className="text-red-400">*</span></Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Build landing page"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <span className="text-red-400 text-xs">{errors.title}</span>}
            </div>

            {/* Type & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="type">Type <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    {BOUNTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-design-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <div className="relative">
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-design-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Reward & Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="reward">Reward ($) <span className="text-red-400">*</span></Label>
                <Input
                  id="reward"
                  type="number"
                  value={formData.reward}
                  onChange={(e) => handleInputChange('reward', e.target.value)}
                  placeholder="1000"
                  className={errors.reward ? 'border-red-500' : ''}
                />
                {errors.reward && <span className="text-red-400 text-xs">{errors.reward}</span>}
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  placeholder="14 days"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description <span className="text-red-400">*</span></Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the bounty requirements..."
                rows={4}
                className={`w-full px-3 py-2 rounded-lg bg-design-zinc-900/50 border border-design-zinc-800 text-white text-sm placeholder:text-design-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <span className="text-red-400 text-xs">{errors.description}</span>}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <PremiumButton type="button" variant="ghost" onClick={handleClose} className="flex-1">
                Cancel
              </PremiumButton>
              <PremiumButton type="submit" variant="primary" className="flex-1">
                <DollarSign size={16} />
                Post Bounty
              </PremiumButton>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
