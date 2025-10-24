'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Users, DollarSign, Calendar, UserPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CollaborateModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: string
    name: string
    ticker: string
    logo: string
  }
}

interface CollaborationRequest {
  type: 'marketing' | 'technical' | 'funding' | 'partnership'
  budget: string
  timeline: string
  description: string
}

const collaborationTypes = [
  { value: 'marketing', label: 'Marketing & Growth', icon: Users },
  { value: 'technical', label: 'Technical Integration', icon: UserPlus },
  { value: 'funding', label: 'Funding & Investment', icon: DollarSign },
  { value: 'partnership', label: 'Strategic Partnership', icon: Calendar }
] as const

export function CollaborateModal({ isOpen, onClose, project }: CollaborateModalProps): JSX.Element {
  const [formData, setFormData] = useState<CollaborationRequest>({
    type: 'marketing',
    budget: '',
    timeline: '',
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const firstInputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus first input on mount
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Form validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 50) {
      newErrors.description = 'Please provide at least 50 characters'
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required'
    }

    if (!formData.timeline.trim()) {
      newErrors.timeline = 'Timeline is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (validate()) {
      console.log('Collaboration request:', formData)
      onClose()
    }
  }

  const handleBackdropClick = (): void => {
    onClose()
  }

  const handleContentClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl glass-premium rounded-3xl border border-zinc-800 p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={handleContentClick}
              role="dialog"
              aria-labelledby="modal-title"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img src={project.logo} alt={project.name} className="w-12 h-12 rounded-xl" />
                  <div>
                    <h3 id="modal-title" className="font-bold text-xl">Collaborate with {project.name}</h3>
                    <p className="text-sm text-zinc-400">Submit a partnership proposal</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="icon-interactive p-2 rounded-xl hover:bg-zinc-800"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Collaboration Type */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Collaboration Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {collaborationTypes.map((type) => {
                      const Icon = type.icon
                      const isSelected = formData.type === type.value
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={`p-4 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-[#D1FD0A]/10 border-[#D1FD0A] text-white'
                              : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-[#D1FD0A]' : 'text-zinc-500'}`} />
                          <span className="text-xs font-medium">{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Proposal Description *
                  </label>
                  <textarea
                    id="description"
                    ref={firstInputRef}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your collaboration proposal in detail..."
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500 min-h-[160px] resize-none"
                    maxLength={1000}
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? 'description-error' : 'description-hint'}
                  />
                  {errors.description && (
                    <p id="description-error" className="text-xs text-red-400 mt-1" role="alert">{errors.description}</p>
                  )}
                  <p id="description-hint" className="text-xs text-zinc-500 mt-1">
                    {formData.description.length}/1000 characters (min. 50)
                  </p>
                </div>

                {/* Budget & Timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium mb-2">
                      Budget (SOL) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="budget"
                        type="text"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="e.g., 100 SOL"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500"
                        aria-invalid={!!errors.budget}
                        aria-describedby={errors.budget ? 'budget-error' : undefined}
                      />
                    </div>
                    {errors.budget && (
                      <p id="budget-error" className="text-xs text-red-400 mt-1" role="alert">{errors.budget}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium mb-2">
                      Timeline *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="timeline"
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        placeholder="e.g., 2-4 weeks"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500"
                        aria-invalid={!!errors.timeline}
                        aria-describedby={errors.timeline ? 'timeline-error' : undefined}
                      />
                    </div>
                    {errors.timeline && (
                      <p id="timeline-error" className="text-xs text-red-400 mt-1" role="alert">{errors.timeline}</p>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="glass-interactive p-4 rounded-xl border border-zinc-800/50">
                  <div className="flex items-start gap-3">
                    <UserPlus className="w-5 h-5 text-[#D1FD0A] flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-zinc-300 mb-1">
                        Your proposal will be reviewed by the {project.name} team.
                      </p>
                      <p className="text-zinc-500 text-xs">
                        Average response time: 2-3 business days
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.description || !formData.budget || !formData.timeline}
                    className="flex-[2] px-4 py-3 bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black rounded-xl font-bold hover:scale-105 hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <UserPlus size={20} />
                    Submit Proposal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
