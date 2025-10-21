"use client"

import { useState } from 'react'
import { X, Briefcase, DollarSign, Users, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/useToast'

interface DealflowModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DealflowSubmission) => Promise<void>
}

export interface DealflowSubmission {
  title: string
  description: string
  dealType: 'partnership' | 'investment' | 'collaboration' | 'service'
  budget?: number
  timeline: string
  contactMethod: 'dm' | 'email' | 'telegram'
  contactInfo: string
}

const DEAL_TYPES = [
  { id: 'partnership' as const, label: 'Partnership', icon: Users, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
  { id: 'investment' as const, label: 'Investment', icon: DollarSign, color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
  { id: 'collaboration' as const, label: 'Collaboration', icon: Briefcase, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
  { id: 'service' as const, label: 'Service', icon: Calendar, color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30' },
]

const CONTACT_METHODS = [
  { id: 'dm' as const, label: 'Direct Message' },
  { id: 'email' as const, label: 'Email' },
  { id: 'telegram' as const, label: 'Telegram' },
]

export function DealflowModal({ isOpen, onClose, onSubmit }: DealflowModalProps) {
  const { success, error: showError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dealType, setDealType] = useState<DealflowSubmission['dealType']>('partnership')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [contactMethod, setContactMethod] = useState<DealflowSubmission['contactMethod']>('dm')
  const [contactInfo, setContactInfo] = useState('')

  const isValid = title.trim().length > 0 &&
                  description.trim().length > 0 &&
                  timeline.trim().length > 0 &&
                  contactInfo.trim().length > 0

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        dealType,
        budget: budget ? parseFloat(budget) : undefined,
        timeline: timeline.trim(),
        contactMethod,
        contactInfo: contactInfo.trim(),
      })

      success('Dealflow Submitted!', 'Your deal has been posted to the network')

      // Reset form
      setTitle('')
      setDescription('')
      setDealType('partnership')
      setBudget('')
      setTimeline('')
      setContactMethod('dm')
      setContactInfo('')

      onClose()
    } catch (error: any) {
      showError('Submission Failed', error.message || 'Please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Submit Dealflow</h2>
                  <p className="text-sm text-zinc-500 mt-1">Share opportunities with the network</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-300" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Deal Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Looking for Solana Developer"
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/50 focus:border-[#00FF88]/50 transition-all"
                  />
                  <p className="mt-1 text-xs text-zinc-500 text-right">{title.length}/100</p>
                </div>

                {/* Deal Type */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Deal Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {DEAL_TYPES.map((type) => {
                      const Icon = type.icon
                      const isSelected = dealType === type.id
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setDealType(type.id)}
                          className={`p-3 rounded-lg border transition-all ${
                            isSelected
                              ? `bg-gradient-to-br ${type.color}`
                              : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mb-1 mx-auto ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                          <div className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                            {type.label}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your deal, requirements, and what you're looking for..."
                    maxLength={500}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/50 focus:border-[#00FF88]/50 resize-none transition-all"
                  />
                  <p className="mt-1 text-xs text-zinc-500 text-right">{description.length}/500</p>
                </div>

                {/* Budget & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Budget (SOL)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Optional"
                        min="0"
                        step="0.1"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/50 focus:border-[#00FF88]/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Timeline <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="e.g., 2-3 weeks, ASAP"
                      className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/50 focus:border-[#00FF88]/50 transition-all"
                    />
                  </div>
                </div>

                {/* Contact Method */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Preferred Contact Method <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {CONTACT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setContactMethod(method.id)}
                        className={`px-4 py-3 rounded-lg border font-semibold text-sm transition-all ${
                          contactMethod === method.id
                            ? 'bg-[#00FF88]/10 border-[#00FF88]/50 text-[#00FF88]'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    {contactMethod === 'email' ? 'Email Address' : contactMethod === 'telegram' ? 'Telegram Handle' : 'Discord Handle'} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder={
                      contactMethod === 'email' ? 'your@email.com' :
                      contactMethod === 'telegram' ? '@yourhandle' :
                      'yourhandle#1234'
                    }
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/50 focus:border-[#00FF88]/50 transition-all"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-zinc-950">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-lg font-bold bg-zinc-800 hover:bg-zinc-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isValid || isSubmitting}
                  className="px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-[#00FF88] to-[#00DD77] hover:from-[#00DD77] hover:to-[#00FF88] text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Dealflow'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}