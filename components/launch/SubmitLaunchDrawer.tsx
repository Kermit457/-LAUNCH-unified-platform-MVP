"use client"

import { useState, useEffect } from 'react'
import { X, DollarSign, Calendar } from 'lucide-react'
import { SubmitLaunchInput } from '@/types/launch'
import { FileDropzone } from '@/components/common/FileDropzone'
import { uploadLogo } from '@/lib/storage'

interface SubmitLaunchDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SubmitLaunchInput) => void
}

const PLATFORMS = [
  { id: 'twitter' as const, label: 'Twitter/X' },
  { id: 'discord' as const, label: 'Discord' },
  { id: 'telegram' as const, label: 'Telegram' },
  { id: 'youtube' as const, label: 'YouTube' },
  { id: 'twitch' as const, label: 'Twitch' },
  { id: 'tiktok' as const, label: 'TikTok' },
  { id: 'obs' as const, label: 'OBS' },
]

// Base58 validation helper
const isValidBase58 = (str: string): boolean => {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/
  return base58Regex.test(str) && str.length >= 32 && str.length <= 44
}

export function SubmitLaunchDrawer({ isOpen, onClose, onSubmit }: SubmitLaunchDrawerProps) {
  // Load persisted scope
  const [scope, setScope] = useState<"ICM" | "CCM">(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('launchScope')
      return (saved === 'ICM' || saved === 'CCM') ? saved : 'ICM'
    }
    return 'ICM'
  })

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"Live" | "Upcoming">('Live')
  const [description, setDescription] = useState('')
  const [platforms, setPlatforms] = useState<SubmitLaunchInput['platforms']>([])

  const [existingToken, setExistingToken] = useState(false)
  const [mint, setMint] = useState('')
  const [treasury, setTreasury] = useState('')

  const [poolUsd, setPoolUsd] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')

  const [creator, setCreator] = useState('')

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

  // Validation
  const isTitleValid = title.trim().length > 0 && title.length <= 80
  const isSubtitleValid = subtitle.trim().length > 0 && subtitle.length <= 120
  const isLogoValid = logoFile !== null
  const isDescriptionValid = description.trim().length > 0 && description.length <= 500
  const arePlatformsValid = platforms.length >= 1

  const isMintValid = !mint || isValidBase58(mint)
  const isTreasuryValid = !treasury || isValidBase58(treasury)
  const areTokenFieldsValid = !existingToken || (scope === 'CCM') || (mint.trim() !== '' && treasury.trim() !== '' && isMintValid && isTreasuryValid)

  const isPoolValid = !poolUsd || (!isNaN(Number(poolUsd)) && Number(poolUsd) >= 0)
  const isEndDateValid = !endDate || !endTime || (new Date(`${endDate}T${endTime}`).getTime() >= Date.now())

  const isFormValid =
    isTitleValid &&
    isSubtitleValid &&
    isLogoValid &&
    isDescriptionValid &&
    arePlatformsValid &&
    areTokenFieldsValid &&
    isPoolValid &&
    isEndDateValid

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
      economics:
        poolUsd || (endDate && endTime)
          ? {
              poolUsd: poolUsd ? Number(poolUsd) : undefined,
              endAt: endDate && endTime ? new Date(`${endDate}T${endTime}`).getTime() : undefined,
            }
          : undefined,
      creator: creator.trim() || undefined,
      existingToken:
        scope === 'ICM' && existingToken
          ? {
              mint: mint.trim(),
              treasury: treasury.trim(),
            }
          : undefined,
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
      <div className="w-full max-w-2xl max-h-[92vh] bg-[#0D1220] rounded-2xl border border-white/10 shadow-2xl flex flex-col my-4">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-3 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Submit Your Project</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Required Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/90">Required</h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Project title"
                  maxLength={80}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                />
                <p className="mt-1 text-xs text-white/40 text-right">{title.length}/80</p>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Subtitle <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Brief subtitle"
                  maxLength={120}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
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
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === 'ICM'}
                      onChange={() => setScope('ICM')}
                      className="w-4 h-4 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                    <span className="text-sm text-white/90">ICM (Token)</span>
                  </label>
                  <label className="flex items-center gap-2 flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === 'CCM'}
                      onChange={() => setScope('CCM')}
                      className="w-4 h-4 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                    <span className="text-sm text-white/90">CCM (Creator)</span>
                  </label>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Live" | "Upcoming")}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                >
                  <option value="Live">Live</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
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
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80 resize-none"
                />
                <p className="mt-1 text-xs text-white/40 text-right">{description.length}/500</p>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Platforms <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => {
                    const isSelected = platforms.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-300'
                            : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {p.label}
                      </button>
                    )
                  })}
                </div>
                {platforms.length === 0 && (
                  <p className="mt-1 text-xs text-red-400">Select at least one platform</p>
                )}
              </div>
            </div>

            {/* Token Section (ICM only) */}
            {scope === 'ICM' && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/90">Token</h3>

                {/* Existing Token Toggle */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={existingToken}
                      onChange={(e) => setExistingToken(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                    <span className="text-sm text-white/70">Existing Token?</span>
                  </label>
                </div>

                {existingToken && (
                  <>
                    {/* Solana Token Mint Address */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Solana Token Mint Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={mint}
                        onChange={(e) => setMint(e.target.value)}
                        placeholder="SPL mint address (base58)"
                        className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                      />
                      <p className="mt-1 text-xs text-white/40">SPL mint address (base58). Solana only.</p>
                      {mint && !isMintValid && (
                        <p className="mt-1 text-xs text-red-400">Invalid base58 address (32-44 characters)</p>
                      )}
                    </div>

                    {/* Treasury Wallet Address */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Treasury Wallet Address <span className="text-red-400">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={treasury}
                          onChange={(e) => setTreasury(e.target.value)}
                          placeholder="Solana wallet address"
                          className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                        />
                        <button
                          disabled={!isTreasuryValid || treasury.trim() === ''}
                          className="px-4 h-12 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Verify
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-white/40">Receive wallet for fees and buybacks.</p>
                      {treasury && !isTreasuryValid && (
                        <p className="mt-1 text-xs text-red-400">Invalid base58 address (32-44 characters)</p>
                      )}
                      {treasury && isTreasuryValid && (
                        <p className="mt-1 text-xs text-emerald-400">Valid</p>
                      )}
                    </div>

                    <p className="text-xs text-white/40">💡 Solana only</p>
                  </>
                )}
              </div>
            )}

            {/* Economics (optional) */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-white/90">Economics (optional)</h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Pool $ */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Pool $</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="number"
                      value={poolUsd}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === '' || /^\d+\.?\d{0,2}$/.test(val)) {
                          setPoolUsd(val)
                        }
                      }}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full h-12 pl-10 pr-16 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                      USDC
                    </div>
                  </div>
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">End Time</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1 h-12 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-28 h-12 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                  </div>
                  {endDate && endTime && !isEndDateValid && (
                    <p className="mt-1 text-xs text-red-400">End time must be in the future</p>
                  )}
                </div>
              </div>
            </div>

            {/* Creator (optional) */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-white/90">Creator (optional)</h3>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Creator name / handle</label>
                <input
                  type="text"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  placeholder="@username or full name"
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="px-6 h-11 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
          >
            Submit Project
          </button>
        </div>
      </div>
    </div>
  )
}
