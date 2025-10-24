"use client"

import { useState, useEffect } from 'react'
import { X, DollarSign, Coins, Camera, Smile } from 'lucide-react'
import { SubmitLaunchInput } from '@/types/launch'
import { FileDropzone } from '@/components/common/FileDropzone'
import { uploadLogo } from '@/lib/storage'

interface SubmitLaunchDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SubmitLaunchInput) => void
  isLoading?: boolean
  error?: string | null
}

const PLATFORMS = [
  { id: 'discord' as const, label: 'Discord', placeholder: 'https://discord.gg/yourserver' },
  { id: 'telegram' as const, label: 'Telegram', placeholder: 'https://t.me/yourchannel' },
  { id: 'youtube' as const, label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
  { id: 'twitch' as const, label: 'Twitch', placeholder: 'https://twitch.tv/yourchannel' },
  { id: 'tiktok' as const, label: 'TikTok', placeholder: 'https://tiktok.com/@youraccount' },
]

// Base58 validation helper
const isValidBase58 = (str: string): boolean => {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/
  return base58Regex.test(str) && str.length >= 32 && str.length <= 44
}

export function SubmitLaunchDrawer({ isOpen, onClose, onSubmit, isLoading = false, error }: SubmitLaunchDrawerProps) {
  // Load persisted scope
  const [scope, setScope] = useState<"ICM" | "CCM" | "MEME">(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('launchScope')
      return (saved === 'ICM' || saved === 'CCM' || saved === 'MEME') ? saved : 'ICM'
    }
    return 'ICM'
  })

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"Live" | "Upcoming">('Upcoming')
  const [tokenAddress, setTokenAddress] = useState('')
  const [description, setDescription] = useState('')
  const [platforms, setPlatforms] = useState<SubmitLaunchInput['platforms']>([])
  const [projectLink, setProjectLink] = useState('')
  const [projectImages, setProjectImages] = useState<File[]>([])

  // Platform links
  const [twitterLink, setTwitterLink] = useState('')
  const [platformLinks, setPlatformLinks] = useState<Record<string, string>>({
    discord: '',
    telegram: '',
    youtube: '',
    twitch: '',
    tiktok: '',
  })

  // Persist scope
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('launchScope', scope)
    }
  }, [scope])

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const togglePlatform = (platformId: typeof PLATFORMS[number]['id']) => {
    setPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  // Form Validation
  const isTitleValid = title.trim().length > 0 && title.length <= 80
  const isSubtitleValid = subtitle.trim().length > 0 && subtitle.length <= 120
  const isLogoValid = logoFile !== null
  const isDescriptionValid = description.trim().length > 0 && description.length <= 500
  const isTwitterValid = twitterLink.trim().length > 0 // Twitter is mandatory
  const areProjectImagesValid = projectImages.length >= 3 && projectImages.length <= 5

  const isFormValid =
    isTitleValid &&
    isSubtitleValid &&
    isLogoValid &&
    isDescriptionValid &&
    isTwitterValid &&
    areProjectImagesValid

  const handleSubmit = () => {
    if (!isFormValid || !logoFile) return

    const output: SubmitLaunchInput = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      logoFile,
      scope,
      status,
      description: description.trim(),
      platforms,
      projectLink: projectLink.trim() || undefined,
      projectImages,
      tokenAddress: tokenAddress.trim() || undefined,
    }

    onSubmit(output)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Modal Container */}
      <div className="w-full max-w-2xl max-h-[92vh] bg-design-zinc-950/95 backdrop-blur-xl rounded-2xl border border-design-zinc-800 shadow-2xl flex flex-col my-4">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-3 border-b border-design-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Submit Your Project</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-design-zinc-800/50 transition-colors text-design-zinc-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          <div className="space-y-6">
            {/* Required Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/90">Required</h3>

              {/* Token Name */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Token Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Solana"
                  maxLength={80}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A]/50 transition-all"
                />
                <p className="mt-1 text-xs text-white/40 text-right">{title.length}/80</p>
              </div>

              {/* Token Ticker */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Token Ticker <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g., SOL"
                  maxLength={120}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A]/50 transition-all"
                />
                <p className="mt-1 text-xs text-white/40 text-right">{subtitle.length}/120</p>
              </div>

              {/* Project Logo */}
              <div>
                <FileDropzone
                  file={logoFile}
                  onChange={setLogoFile}
                  label="Project Logo *"
                  accept="image/png,image/jpeg,image/jpg"
                  maxSize={5 * 1024 * 1024}
                />
                <p className="mt-1 text-xs text-white/40">PNG or JPG, max 5MB. Square (1:1) recommended.</p>
              </div>

              {/* Scope */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Scope <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* ICM - Lime */}
                  <label className={`flex flex-col items-center justify-center h-20 px-4 rounded-xl border cursor-pointer transition-all ${
                    scope === 'ICM'
                      ? 'bg-gradient-to-br from-[#D1FD0A]/20 to-[#B8E008]/10 border-[#D1FD0A]/50 shadow-lg shadow-[#D1FD0A]/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#D1FD0A]/30'
                  }`}>
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === 'ICM'}
                      onChange={() => setScope('ICM')}
                      className="sr-only"
                    />
                    <Coins className={`w-6 h-6 mb-1 transition-colors ${scope === 'ICM' ? 'text-[#D1FD0A]' : 'text-white/70'}`} />
                    <span className={`text-xs font-medium transition-colors ${scope === 'ICM' ? 'text-[#D1FD0A]' : 'text-white/70'}`}>ICM</span>
                  </label>

                  {/* CCM - Lime */}
                  <label className={`flex flex-col items-center justify-center h-20 px-4 rounded-xl border cursor-pointer transition-all ${
                    scope === 'CCM'
                      ? 'bg-gradient-to-br from-[#D1FD0A]/20 to-[#B8E008]/10 border-[#D1FD0A]/50 shadow-lg shadow-[#D1FD0A]/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#D1FD0A]/30'
                  }`}>
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === 'CCM'}
                      onChange={() => setScope('CCM')}
                      className="sr-only"
                    />
                    <Camera className={`w-6 h-6 mb-1 transition-colors ${scope === 'CCM' ? 'text-[#D1FD0A]' : 'text-white/70'}`} />
                    <span className={`text-xs font-medium transition-colors ${scope === 'CCM' ? 'text-[#D1FD0A]' : 'text-white/70'}`}>CCM</span>
                  </label>

                  {/* MEME - Cyan */}
                  <label className={`flex flex-col items-center justify-center h-20 px-4 rounded-xl border cursor-pointer transition-all ${
                    scope === 'MEME'
                      ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/30'
                  }`}>
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === 'MEME'}
                      onChange={() => setScope('MEME')}
                      className="sr-only"
                    />
                    <Smile className={`w-6 h-6 mb-1 transition-colors ${scope === 'MEME' ? 'text-cyan-400' : 'text-white/70'}`} />
                    <span className={`text-xs font-medium transition-colors ${scope === 'MEME' ? 'text-cyan-300' : 'text-white/70'}`}>MEME</span>
                  </label>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Status <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Upcoming - Lime gradient */}
                  <button
                    type="button"
                    onClick={() => setStatus('Upcoming')}
                    className={`h-12 px-4 rounded-xl border font-medium transition-all ${
                      status === 'Upcoming'
                        ? 'bg-gradient-to-r from-[#D1FD0A]/20 to-[#B8E008]/20 border-[#D1FD0A]/50 text-[#D1FD0A] shadow-lg shadow-[#D1FD0A]/20'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-[#D1FD0A]/30'
                    }`}
                  >
                    Upcoming
                  </button>

                  {/* Live - Emerald/Green (traditional live indicator) */}
                  <button
                    type="button"
                    onClick={() => setStatus('Live')}
                    className={`h-12 px-4 rounded-xl border font-medium transition-all ${
                      status === 'Live'
                        ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/20'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-emerald-500/30'
                    }`}
                  >
                    Live
                  </button>
                </div>

                {/* Token Address (only show when Live is selected) */}
                {status === 'Live' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Token Address
                    </label>
                    <input
                      type="text"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      placeholder="Enter token contract address"
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                    />
                    <p className="mt-1 text-xs text-white/40">Optional: Add the contract address if token is already live</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project..."
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A]/50 resize-none transition-all"
                />
                <p className="mt-1 text-xs text-white/40 text-right">{description.length}/500</p>
              </div>

              {/* Project Link */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Project Link
                </label>
                <input
                  type="url"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  placeholder="https://yourproject.com"
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A]/50 transition-all"
                />
                <p className="mt-1 text-xs text-white/40">Website or project homepage (optional)</p>
              </div>

              {/* Twitter/X - Required */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Twitter/X <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={twitterLink}
                  onChange={(e) => setTwitterLink(e.target.value)}
                  placeholder="https://twitter.com/yourproject or https://x.com/yourproject"
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A]/50 transition-all"
                />
                {!isTwitterValid && (
                  <p className="mt-1 text-xs text-red-400">Twitter/X is required</p>
                )}
              </div>

              {/* Other Platforms - Optional */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Other Platforms
                </label>
                <p className="text-xs text-white/40 mb-3">Click to add links (optional)</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PLATFORMS.map(p => {
                    const isSelected = platforms.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlatform(p.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#D1FD0A]/20 to-[#B8E008]/20 border border-[#D1FD0A]/50 text-[#D1FD0A] shadow-md shadow-[#D1FD0A]/10'
                            : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:border-[#D1FD0A]/30'
                        }`}
                      >
                        {p.label}
                      </button>
                    )
                  })}
                </div>

                {/* Dynamic input fields for selected platforms */}
                <div className="space-y-3">
                  {PLATFORMS.filter(p => platforms.includes(p.id)).map(p => (
                    <div key={p.id}>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">
                        {p.label} Link
                      </label>
                      <input
                        type="url"
                        value={platformLinks[p.id] || ''}
                        onChange={(e) => setPlatformLinks(prev => ({ ...prev, [p.id]: e.target.value }))}
                        placeholder={p.placeholder}
                        className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A]/50 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Images */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Project Images <span className="text-red-400">*</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      if (files.length > 5) {
                        setProjectImages(files.slice(0, 5))
                      } else {
                        setProjectImages(files)
                      }
                    }}
                    className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#D1FD0A]/20 file:text-black hover:file:bg-[#D1FD0A]/30 file:cursor-pointer"
                  />
                  <p className="text-xs text-white/40">
                    Upload 3-5 images showcasing your project (PNG or JPG, max 5MB each)
                  </p>
                  {projectImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {projectImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => setProjectImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {projectImages.length > 0 && projectImages.length < 3 && (
                    <p className="text-xs text-red-400">At least 3 images required ({projectImages.length}/3)</p>
                  )}
                  {projectImages.length > 5 && (
                    <p className="text-xs text-red-400">Maximum 5 images allowed</p>
                  )}
                  {projectImages.length >= 3 && projectImages.length <= 5 && (
                    <p className="text-xs text-emerald-400">✓ {projectImages.length} images added</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-white/10">
          {/* Error Message */}
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="px-6 h-11 rounded-xl bg-gradient-to-r from-[#D1FD0A] to-[#B8E008] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#B8E008] to-[#A0C007] transition-all focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Submit Project'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
