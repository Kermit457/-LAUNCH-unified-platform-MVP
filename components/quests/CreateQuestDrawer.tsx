"use client"

import { useState, useEffect } from 'react'
import { X, Link2, Target, Coins, Calendar, Eye } from 'lucide-react'
import { CreateQuestInput, CampaignType, Mint, Platform, Evidence, MissionType } from '@/types/quest'
import { SegmentedControl } from '@/components/common/SegmentedControl'
import { TokenInput } from '@/components/common/TokenInput'
import { PlatformChips } from '@/components/common/PlatformChips'
import { TagTokenInput } from '@/components/common/TagTokenInput'
import { FileDropzone } from '@/components/common/FileDropzone'
import { PreviewCard } from './PreviewCard'

interface CreateQuestDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateQuestInput) => void
  initialType?: CampaignType
}

export function CreateQuestDrawer({ isOpen, onClose, onSubmit, initialType = 'raid' }: CreateQuestDrawerProps) {
  // Form state
  const [type, setType] = useState<CampaignType>(initialType)
  const [targetUrl, setTargetUrl] = useState('')
  const [mission, setMission] = useState<MissionType>('mission')
  const [title, setTitle] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [minDuration, setMinDuration] = useState('')

  // Sync type with initialType when drawer opens
  useEffect(() => {
    if (isOpen) {
      setType(initialType)
    }
  }, [isOpen, initialType])
  const [evidence, setEvidence] = useState<Evidence>('link')
  const [maxParticipants, setMaxParticipants] = useState('')
  const [perUserLimit, setPerUserLimit] = useState('')
  const [reviewerSla, setReviewerSla] = useState('')
  const [autoApprove, setAutoApprove] = useState(false)

  const [fundingKind, setFundingKind] = useState<'free' | 'paid'>('free')
  const [mint, setMint] = useState<Mint>('USDC')
  const [amount, setAmount] = useState('')
  const [cap, setCap] = useState('')

  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')

  // Reset mission when switching to bounty
  useEffect(() => {
    if (type === 'bounty') {
      setMission('mission')
    }
  }, [type])

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
  const isUrlValid = targetUrl.trim() !== '' && /^https?:\/\/.+/.test(targetUrl)
  const isTitleValid = title.trim().length >= 3
  const arePlatformsValid = platforms.length > 0
  const isMinDurationValid = !minDuration || (Number(minDuration) >= 5 && !isNaN(Number(minDuration)))
  const isAmountValid = !amount || (!isNaN(Number(amount)) && Number(amount) > 0)
  const isCapValid = !cap || (!isNaN(Number(cap)) && Number(cap) >= (Number(amount) || 0))

  const isFormValid =
    isUrlValid &&
    isTitleValid &&
    arePlatformsValid &&
    isMinDurationValid &&
    isAmountValid &&
    isCapValid &&
    (fundingKind === 'free' || (fundingKind === 'paid' && isAmountValid))

  // Build form data for preview
  const formData: Partial<CreateQuestInput> = {
    type,
    targetUrl,
    mission: type === 'raid' ? mission : undefined,
    title,
    logoFile: logoFile || undefined,
    rules: {
      platforms,
      requiredTags: tags.length > 0 ? tags : undefined,
      minDurationSec: minDuration ? Number(minDuration) : undefined,
      evidence,
      maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
      perUserLimit: perUserLimit ? Number(perUserLimit) : undefined,
      reviewerSlaHrs: reviewerSla ? Number(reviewerSla) : undefined,
      autoApprove,
    },
    funding: {
      kind: fundingKind,
      mint: fundingKind === 'paid' ? mint : undefined,
      model: fundingKind === 'paid' && amount
        ? {
            kind: type === 'raid' ? 'pool' : 'per_task',
            amount: Number(amount),
            cap: cap ? Number(cap) : undefined,
          }
        : undefined,
    },
    schedule: {
      startAt: startDate && startTime ? new Date(`${startDate}T${startTime}`).getTime() : undefined,
      endAt: endDate && endTime ? new Date(`${endDate}T${endTime}`).getTime() : undefined,
    },
  }

  const handleSubmit = () => {
    if (!isFormValid) return

    const output: CreateQuestInput = {
      type,
      targetUrl,
      mission: type === 'raid' ? mission : undefined,
      title,
      logoFile: logoFile || undefined,
      rules: {
        platforms,
        requiredTags: tags.length > 0 ? tags : undefined,
        minDurationSec: minDuration ? Number(minDuration) : undefined,
        evidence,
        maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
        perUserLimit: perUserLimit ? Number(perUserLimit) : undefined,
        reviewerSlaHrs: reviewerSla ? Number(reviewerSla) : undefined,
        autoApprove,
      },
      funding: {
        kind: fundingKind,
        mint: fundingKind === 'paid' ? mint : undefined,
        model: fundingKind === 'paid' && amount
          ? {
              kind: type === 'raid' ? 'pool' : 'per_task',
              amount: Number(amount),
              cap: type === 'bounty' && cap ? Number(cap) : undefined,
            }
          : undefined,
      },
      schedule: {
        startAt: startDate && startTime ? new Date(`${startDate}T${startTime}`).getTime() : undefined,
        endAt: endDate && endTime ? new Date(`${endDate}T${endTime}`).getTime() : undefined,
      },
    }

    onSubmit(output)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Modal Container */}
      <div className="w-full max-w-[95vw] lg:max-w-6xl max-h-[90vh] bg-[#0D1220] rounded-2xl border border-white/10 shadow-2xl flex flex-col my-4">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-3 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create Quest</h2>
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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Form Column */}
          <div className="space-y-6">
            {/* Type Switcher */}
            <div>
              <SegmentedControl
                options={['raid', 'bounty'] as CampaignType[]}
                value={type}
                onChange={setType}
                fullWidth
              />
            </div>

            {/* Section 1: Target */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-fuchsia-400" />
                <h3 className="font-semibold">Target</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Target URL <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>
                {targetUrl && !isUrlValid && (
                  <p className="mt-1 text-xs text-red-400">Must be a valid URL starting with http:// or https://</p>
                )}
              </div>

              {type === 'raid' && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Mission Type</label>
                  <SegmentedControl
                    options={['mission', 'takeover', 'support'] as MissionType[]}
                    value={mission}
                    onChange={setMission}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your quest a title"
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                />
                {title && !isTitleValid && (
                  <p className="mt-1 text-xs text-red-400">Title must be at least 3 characters</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Logo (optional)</label>
                <FileDropzone
                  file={logoFile}
                  onChange={setLogoFile}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                />
              </div>
            </div>

            {/* Section 2: Rules */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Eye className="w-5 h-5 text-fuchsia-400" />
                <h3 className="font-semibold">Rules</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Platforms <span className="text-red-400">*</span>
                </label>
                <PlatformChips selected={platforms} onChange={setPlatforms} />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Required Tags (optional)</label>
                <TagTokenInput
                  tokens={tags}
                  onChange={setTags}
                  placeholder="Type tag and press Enter (e.g., #solana, @username)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Min Duration (sec)</label>
                  <input
                    type="number"
                    value={minDuration}
                    onChange={(e) => setMinDuration(e.target.value)}
                    placeholder="5"
                    min="5"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                  {minDuration && !isMinDurationValid && (
                    <p className="mt-1 text-xs text-red-400">Must be ≥ 5 seconds</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Evidence</label>
                  <SegmentedControl
                    options={['link', 'video', 'screenshot'] as Evidence[]}
                    value={evidence}
                    onChange={setEvidence}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    placeholder="Unlimited"
                    min="1"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Per-User Limit</label>
                  <input
                    type="number"
                    value={perUserLimit}
                    onChange={(e) => setPerUserLimit(e.target.value)}
                    placeholder="Unlimited"
                    min="1"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Reviewer SLA (hrs)</label>
                  <input
                    type="number"
                    value={reviewerSla}
                    onChange={(e) => setReviewerSla(e.target.value)}
                    placeholder="24"
                    min="1"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 h-12 px-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={autoApprove}
                      onChange={(e) => setAutoApprove(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-400/80"
                    />
                    <span className="text-sm text-white/70">Auto-approve</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 3: Funding */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Coins className="w-5 h-5 text-fuchsia-400" />
                <h3 className="font-semibold">Funding</h3>
              </div>

              <div>
                <SegmentedControl
                  options={['free', 'paid'] as ('free' | 'paid')[]}
                  value={fundingKind}
                  onChange={setFundingKind}
                  fullWidth
                />
              </div>

              {fundingKind === 'paid' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Token</label>
                    <SegmentedControl
                      options={['USDC', 'SOL'] as Mint[]}
                      value={mint}
                      onChange={setMint}
                      fullWidth
                    />
                  </div>

                  <div>
                    <TokenInput
                      label={type === 'raid' ? 'Pool Amount' : 'Per-Task Amount'}
                      value={amount}
                      onChange={setAmount}
                      mint={mint}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  {type === 'bounty' && (
                    <div>
                      <TokenInput
                        label="Budget Cap (optional)"
                        value={cap}
                        onChange={setCap}
                        mint={mint}
                        placeholder="0.00"
                      />
                      {cap && !isCapValid && (
                        <p className="mt-1 text-xs text-red-400">Cap must be ≥ per-task amount</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Section 4: Schedule */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-fuchsia-400" />
                <h3 className="font-semibold">Schedule</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80"
            >
              Create Quest
            </button>
          </div>

          {/* Preview Column */}
          <div className="lg:sticky lg:top-0 lg:self-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <Eye className="w-4 h-4 text-fuchsia-400" />
                <h3 className="text-sm font-semibold">Preview</h3>
              </div>
              <PreviewCard formData={formData} />
              <p className="text-xs text-white/40 text-center">Live preview updates as you type</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}