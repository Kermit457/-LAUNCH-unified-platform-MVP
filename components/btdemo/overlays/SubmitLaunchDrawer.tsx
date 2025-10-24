'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Rocket, Image as ImageIcon, Globe, Twitter, MessageCircle, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SubmitLaunchDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LaunchFormData) => void
}

interface LaunchFormData {
  name: string
  symbol: string
  description: string
  logo?: File
  social: {
    twitter?: string
    discord?: string
    telegram?: string
    website?: string
  }
}

export function SubmitLaunchDrawer({ isOpen, onClose, onSubmit }: SubmitLaunchDrawerProps): JSX.Element {
  const [formData, setFormData] = useState<LaunchFormData>({
    name: '',
    symbol: '',
    description: '',
    social: {}
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

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

    if (!formData.name.trim()) {
      newErrors.name = 'Token name is required'
    } else if (formData.name.length > 40) {
      newErrors.name = 'Token name must be 40 characters or less'
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required'
    } else if (formData.symbol.length < 3 || formData.symbol.length > 5) {
      newErrors.symbol = 'Symbol must be 3-5 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
      onClose()
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setFormData({ ...formData, logo: file })
      }
    }
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed inset-y-0 right-0 w-full md:w-[480px] glass-premium border-l border-zinc-800 z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="drawer-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Rocket className="w-7 h-7 text-[#D1FD0A]" />
                <h2 id="drawer-title" className="text-2xl font-bold">Launch Your Token</h2>
              </div>
              <button
                onClick={onClose}
                className="icon-interactive p-2 rounded-xl hover:bg-zinc-800 transition-colors"
                aria-label="Close drawer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Token Name */}
              <div>
                <label htmlFor="token-name" className="block text-sm font-medium mb-2">
                  Token Name *
                </label>
                <input
                  id="token-name"
                  ref={firstInputRef}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="LaunchOS Platform"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500"
                  maxLength={40}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : 'name-hint'}
                />
                {errors.name && (
                  <p id="name-error" className="text-xs text-red-400 mt-1" role="alert">{errors.name}</p>
                )}
                <p id="name-hint" className="text-xs text-zinc-500 mt-1">
                  {formData.name.length}/40 characters
                </p>
              </div>

              {/* Symbol */}
              <div>
                <label htmlFor="token-symbol" className="block text-sm font-medium mb-2">
                  Symbol *
                </label>
                <input
                  id="token-symbol"
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  placeholder="LOS"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500 uppercase"
                  maxLength={5}
                  aria-invalid={!!errors.symbol}
                  aria-describedby={errors.symbol ? 'symbol-error' : 'symbol-hint'}
                />
                {errors.symbol && (
                  <p id="symbol-error" className="text-xs text-red-400 mt-1" role="alert">{errors.symbol}</p>
                )}
                <p id="symbol-hint" className="text-xs text-zinc-500 mt-1">3-5 characters</p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="token-description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="token-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500 min-h-[120px] resize-none"
                  maxLength={500}
                  aria-describedby="description-hint"
                />
                <p id="description-hint" className="text-xs text-zinc-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Token Logo
                </label>
                <div
                  className={`glass-interactive border-2 border-dashed ${
                    dragActive ? 'border-[#D1FD0A]' : 'border-zinc-700'
                  } rounded-xl p-8 text-center hover:border-[#D1FD0A]/50 transition-all cursor-pointer`}
                  onDragEnter={() => setDragActive(true)}
                  onDragLeave={() => setDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload token logo"
                >
                  <ImageIcon className="w-8 h-8 text-[#D1FD0A] mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">
                    {formData.logo ? formData.logo.name : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-xs text-zinc-500">PNG, JPG, GIF (max 2MB)</p>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium mb-3">Social Links</label>
                <div className="space-y-3">
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="url"
                      value={formData.social.twitter || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        social: { ...formData.social, twitter: e.target.value }
                      })}
                      placeholder="https://twitter.com/yourproject"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500"
                      aria-label="Twitter URL"
                    />
                  </div>

                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="url"
                      value={formData.social.discord || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        social: { ...formData.social, discord: e.target.value }
                      })}
                      placeholder="https://discord.gg/yourserver"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500"
                      aria-label="Discord URL"
                    />
                  </div>

                  <div className="relative">
                    <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="url"
                      value={formData.social.telegram || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        social: { ...formData.social, telegram: e.target.value }
                      })}
                      placeholder="https://t.me/yourgroup"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500"
                      aria-label="Telegram URL"
                    />
                  </div>

                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="url"
                      value={formData.social.website || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        social: { ...formData.social, website: e.target.value }
                      })}
                      placeholder="https://yourproject.com"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-[#D1FD0A] focus:outline-none transition-colors text-white placeholder:text-zinc-500"
                      aria-label="Website URL"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Footer Actions */}
            <div className="p-6 bg-black/95 backdrop-blur-xl border-t border-zinc-800 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.symbol}
                  className="flex-[2] px-4 py-3 bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black rounded-xl font-bold hover:scale-105 hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Rocket size={20} />
                  Launch Token
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
