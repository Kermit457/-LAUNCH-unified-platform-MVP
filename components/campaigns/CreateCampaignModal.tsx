"use client"

import { useState, useEffect } from 'react'
import { X, Image as ImageIcon, DollarSign, Calendar, Link2, FileText, Eye } from 'lucide-react'
import { CreateClipCampaignInput } from '@/types/campaign'
import { FileDropzone } from '@/components/common/FileDropzone'
import { EscrowPaymentModal } from '@/components/payments'

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateClipCampaignInput) => void
}

export function CreateCampaignModal({ isOpen, onClose, onSubmit }: CreateCampaignModalProps) {
  // Form state
  const [title, setTitle] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [platforms, setPlatforms] = useState<("youtube" | "tiktok" | "twitch" | "x")[]>([])
  const [videoLenMin, setVideoLenMin] = useState('')
  const [videoLenMax, setVideoLenMax] = useState('')
  const [prizePoolUsd, setPrizePoolUsd] = useState('')
  const [payoutPerKUsd, setPayoutPerKUsd] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [socialLinks, setSocialLinks] = useState<string[]>([''])
  const [description, setDescription] = useState('')
  const [conditions, setConditions] = useState('')
  const [minViewsRequired, setMinViewsRequired] = useState('')
  const [autoApprove, setAutoApprove] = useState(false)

  // Escrow state
  const [showEscrowModal, setShowEscrowModal] = useState(false)
  const [campaignCreated, setCampaignCreated] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>()

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Validation
  const isTitleValid = title.trim().length > 0 && title.length <= 80
  const isImageValid = image !== null
  const isPrizePoolValid = !isNaN(Number(prizePoolUsd)) && Number(prizePoolUsd) > 0
  const isPayoutValid = !isNaN(Number(payoutPerKUsd)) && Number(payoutPerKUsd) >= 0

  const isEndDateValid = (() => {
    if (!endDate || !endTime) return false
    const endTimestamp = new Date(`${endDate}T${endTime}`).getTime()
    const minTime = Date.now() + 60 * 60 * 1000 // now + 1 hour
    return endTimestamp >= minTime
  })()

  const areSocialLinksValid = (() => {
    const validLinks = socialLinks.filter(link => {
      const trimmed = link.trim()
      return trimmed.length > 0 && /^https?:\/\/.+/.test(trimmed)
    })
    return validLinks.length >= 1
  })()

  const isDriveLinkValid = !driveLink || /^https?:\/\/.+/.test(driveLink)
  const isMinViewsValid = !minViewsRequired || (!isNaN(Number(minViewsRequired)) && Number(minViewsRequired) >= 0)
  const arePlatformsValid = platforms.length >= 1
  const isVideoLenValid = (() => {
    if (!videoLenMin && !videoLenMax) return true
    const min = Number(videoLenMin)
    const max = Number(videoLenMax)
    if (videoLenMin && videoLenMax) {
      return !isNaN(min) && !isNaN(max) && min > 0 && max > 0 && min < max
    }
    if (videoLenMin) return !isNaN(min) && min > 0
    if (videoLenMax) return !isNaN(max) && max > 0
    return true
  })()

  const isFormValid =
    isTitleValid &&
    isImageValid &&
    arePlatformsValid &&
    isVideoLenValid &&
    isPrizePoolValid &&
    isPayoutValid &&
    isEndDateValid &&
    areSocialLinksValid &&
    isDriveLinkValid &&
    isMinViewsValid

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, ''])
  }

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks]
    newLinks[index] = value
    setSocialLinks(newLinks)
  }

  const togglePlatform = (platform: "youtube" | "tiktok" | "twitch" | "x") => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  // Create image preview when image changes
  useEffect(() => {
    if (image) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(image)
    } else {
      setImagePreview(undefined)
    }
  }, [image])

  const handleSubmit = () => {
    if (!isFormValid) return

    const validSocialLinks = socialLinks.filter(link => link.trim().length > 0)

    const videoLen = (videoLenMin || videoLenMax) ? {
      minSec: videoLenMin ? Number(videoLenMin) : undefined,
      maxSec: videoLenMax ? Number(videoLenMax) : undefined,
    } : undefined

    const output: CreateClipCampaignInput = {
      title: title.trim(),
      image: image || undefined,
      platforms,
      videoLen,
      prizePoolUsd: Number(prizePoolUsd),
      payoutPerKUsd: Number(payoutPerKUsd),
      endAt: new Date(`${endDate}T${endTime}`).getTime(),
      driveLink: driveLink.trim() || undefined,
      socialLinks: validSocialLinks,
      description: description.trim() || undefined,
      conditions: conditions.trim() || undefined,
      minViewsRequired: minViewsRequired ? Number(minViewsRequired) : undefined,
      autoApprove,
    }

    onSubmit(output)

    // Show escrow modal after campaign created
    setCampaignCreated(true)
    setShowEscrowModal(true)
  }

  const handleEscrowFund = async (amount: number) => {
    // Mock escrow creation
    await new Promise(resolve => setTimeout(resolve, 2000))

    return {
      success: true,
      escrowId: `escrow_${Date.now()}`
    }
  }

  const handleEscrowClose = () => {
    setShowEscrowModal(false)
    setCampaignCreated(false)
    onClose() // Close main modal too
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
      <div className="w-full max-w-3xl max-h-[92vh] bg-[#0D1220] rounded-2xl border border-white/10 shadow-2xl flex flex-col my-4">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-3 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create Clipping Campaign</h2>
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
            {/* Required Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-fuchsia-400" />
                <h3 className="font-semibold">Required Information</h3>
              </div>

              {/* Campaign Title */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Campaign Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter campaign title"
                  maxLength={80}
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                />
                <div className="mt-1 flex justify-between text-xs">
                  {title && !isTitleValid && title.length > 80 && (
                    <p className="text-red-400">Title must be 80 characters or less</p>
                  )}
                  <p className="text-white/40 ml-auto">{title.length}/80</p>
                </div>
              </div>

              {/* Campaign Image */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Campaign Image <span className="text-red-400">*</span>
                </label>
                <FileDropzone
                  file={image}
                  onChange={setImage}
                  accept="image/png,image/jpeg,image/jpg"
                  maxSize={5 * 1024 * 1024}
                  label="Upload Campaign Image"
                />
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Platforms <span className="text-red-400">*</span> <span className="text-white/50">(at least 1)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['youtube', 'tiktok', 'twitch', 'x'] as const).map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        platforms.includes(platform)
                          ? 'bg-fuchsia-500 text-white border border-fuchsia-400'
                          : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {platform === 'x' ? 'X' : platform}
                    </button>
                  ))}
                </div>
                {platforms.length === 0 && (
                  <p className="mt-1 text-xs text-white/40">Select at least one platform</p>
                )}
              </div>

              {/* Video Length */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Video Length <span className="text-white/50">(optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      value={videoLenMin}
                      onChange={(e) => setVideoLenMin(e.target.value)}
                      placeholder="Min seconds"
                      min="1"
                      step="1"
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                    <p className="mt-1 text-xs text-white/40">Minimum duration (seconds)</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={videoLenMax}
                      onChange={(e) => setVideoLenMax(e.target.value)}
                      placeholder="Max seconds"
                      min="1"
                      step="1"
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                    <p className="mt-1 text-xs text-white/40">Maximum duration (seconds)</p>
                  </div>
                </div>
                {!isVideoLenValid && (videoLenMin || videoLenMax) && (
                  <p className="mt-1 text-xs text-red-400">
                    {videoLenMin && videoLenMax && Number(videoLenMin) >= Number(videoLenMax)
                      ? 'Min must be less than max'
                      : 'Must be greater than 0'}
                  </p>
                )}
              </div>

              {/* Prize Pool & Payout per 1k Views */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Prize Pool <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="number"
                      value={prizePoolUsd}
                      onChange={(e) => {
                        const val = e.target.value
                        // Allow up to 2 decimal places
                        if (val === '' || /^\d+\.?\d{0,2}$/.test(val)) {
                          setPrizePoolUsd(val)
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
                  {prizePoolUsd && !isPrizePoolValid && (
                    <p className="mt-1 text-xs text-red-400">Must be greater than 0</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Payout per 1k Views <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="number"
                      value={payoutPerKUsd}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === '' || /^\d+\.?\d{0,2}$/.test(val)) {
                          setPayoutPerKUsd(val)
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
                  {payoutPerKUsd && !isPayoutValid && (
                    <p className="mt-1 text-xs text-red-400">Must be 0 or greater</p>
                  )}
                </div>
              </div>

              {/* Campaign End Date */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Campaign End Date <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>
                {endDate && endTime && !isEndDateValid && (
                  <p className="mt-1 text-xs text-red-400">End date must be at least 1 hour from now</p>
                )}
              </div>

              {/* Social Media Links */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Social Media Links <span className="text-red-400">*</span> <span className="text-white/50">(at least 1)</span>
                </label>
                <div className="space-y-2">
                  {socialLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                          placeholder="https://..."
                          className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                        />
                      </div>
                      {socialLinks.length > 1 && (
                        <button
                          onClick={() => handleRemoveSocialLink(index)}
                          className="px-3 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddSocialLink}
                    className="text-sm text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                  >
                    + Add another link
                  </button>
                </div>
                {!areSocialLinksValid && socialLinks.some(l => l.trim()) && (
                  <p className="mt-1 text-xs text-red-400">At least one valid URL is required</p>
                )}
              </div>

              {/* Google Drive Link */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Google Drive Link <span className="text-white/50">(optional)</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="url"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>
                {driveLink && !isDriveLinkValid && (
                  <p className="mt-1 text-xs text-red-400">Must be a valid URL</p>
                )}
              </div>
            </div>

            {/* Optional Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Eye className="w-5 h-5 text-fuchsia-400" />
                <h3 className="font-semibold">Optional Information</h3>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your campaign..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80 resize-none"
                />
              </div>

              {/* Campaign Conditions */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Campaign Conditions</label>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="List any conditions or requirements..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80 resize-none"
                />
              </div>

              {/* Minimum Views Required & Auto-approve */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Minimum Views Required</label>
                  <input
                    type="number"
                    value={minViewsRequired}
                    onChange={(e) => setMinViewsRequired(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                  {minViewsRequired && !isMinViewsValid && (
                    <p className="mt-1 text-xs text-red-400">Must be 0 or greater</p>
                  )}
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 h-12 px-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors w-full">
                    <input
                      type="checkbox"
                      checked={autoApprove}
                      onChange={(e) => setAutoApprove(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                    <span className="text-sm text-white/70">Auto-approve Submissions</span>
                  </label>
                </div>
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
            Create Campaign
          </button>
        </div>
      </div>

      {/* Escrow Payment Modal - Shows after campaign created */}
      {campaignCreated && (
        <EscrowPaymentModal
          isOpen={showEscrowModal}
          onClose={handleEscrowClose}
          campaignTitle={title}
          campaignImage={imagePreview}
          totalBudget={Number(prizePoolUsd) / 140} // Convert USD to SOL (mock rate)
          expectedParticipants={10} // Mock for now
          onFundEscrow={handleEscrowFund}
        />
      )}
    </div>
  )
}