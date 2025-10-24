'use client'

import { useState, useEffect } from 'react'
import { X, Link as LinkIcon, Play, Search, Loader2 } from 'lucide-react'
import { detectPlatform, fetchThumbnail } from '@/lib/appwrite/services/clips'
import { getLaunches, type Launch } from '@/lib/appwrite/services/launches'
import { getCampaigns, type Campaign } from '@/lib/appwrite/services/campaigns'

interface SubmitClipModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    embedUrl: string
    title?: string
    projectName?: string
    projectId?: string
    projectLogo?: string
    campaignId?: string
  }) => void
  preSelectedCampaignId?: string
  preSelectedCampaignTitle?: string
}

export function SubmitClipModal({
  open,
  onClose,
  onSubmit,
  preSelectedCampaignId,
  preSelectedCampaignTitle
}: SubmitClipModalProps) {
  const [embedUrl, setEmbedUrl] = useState('')
  const [title, setTitle] = useState('')
  const [projectName, setProjectName] = useState('')
  const [selectedProject, setSelectedProject] = useState<Launch | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [projects, setProjects] = useState<Launch[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [projectSearch, setProjectSearch] = useState('')
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false)
  const [error, setError] = useState('')
  const [platform, setPlatform] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // Load projects and campaigns when modal opens
  useEffect(() => {
    if (open) {
      getLaunches({ limit: 50 }).then(setProjects).catch(console.error)
      getCampaigns({ status: 'active', limit: 50 }).then(setCampaigns).catch(console.error)
    }
  }, [open])

  // Set pre-selected campaign if provided
  useEffect(() => {
    if (open && preSelectedCampaignId && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.campaignId === preSelectedCampaignId)
      if (campaign) {
        setSelectedCampaign(campaign)
      }
    }
  }, [open, preSelectedCampaignId, campaigns])

  const handleUrlChange = async (url: string) => {
    setEmbedUrl(url)
    setError('')
    setVideoPreview(null)

    if (url.trim()) {
      setIsValidating(true)
      const detected = detectPlatform(url)
      setPlatform(detected)

      if (!detected) {
        setError('Unsupported URL. Please use Twitter, TikTok, YouTube, Twitch, or Instagram links.')
        setIsValidating(false)
        return
      }

      // Auto-fetch video preview
      try {
        const thumbnail = await fetchThumbnail(url, detected)
        if (thumbnail) {
          setVideoPreview(thumbnail)
        }
      } catch (err) {
        console.error('Failed to fetch thumbnail:', err)
      }

      setIsValidating(false)
    } else {
      setPlatform(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!embedUrl.trim()) {
      setError('Please enter a video URL')
      return
    }

    const detected = detectPlatform(embedUrl)
    if (!detected) {
      setError('Invalid URL. Supported platforms: Twitter, TikTok, YouTube, Twitch, Instagram')
      return
    }

    onSubmit({
      embedUrl: embedUrl.trim(),
      title: title.trim() || undefined,
      projectName: selectedProject?.title || projectSearch.trim() || projectName.trim() || undefined,
      projectId: selectedProject?.launchId || undefined,
      projectLogo: selectedProject?.logoUrl || undefined,
      campaignId: selectedCampaign?.campaignId || undefined
    })

    handleClose()
  }

  const handleClose = () => {
    setEmbedUrl('')
    setTitle('')
    setProjectName('')
    setSelectedProject(null)
    setSelectedCampaign(null)
    setProjectSearch('')
    setShowProjectDropdown(false)
    setShowCampaignDropdown(false)
    setError('')
    setPlatform(null)
    setVideoPreview(null)
    setIsValidating(false)
    onClose()
  }

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.tokenSymbol?.toLowerCase().includes(projectSearch.toLowerCase())
  )

  const filteredCampaigns = campaigns.filter(c =>
    c.title.toLowerCase().includes(projectSearch.toLowerCase())
  )

  if (!open) return null

  const platformIcons: Record<string, string> = {
    twitter: '𝕏',
    tiktok: '🎵',
    youtube: '▶️',
    twitch: '🎮',
    instagram: '📷'
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 pointer-events-none overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-lg bg-neutral-950/95 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/10 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200 my-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Header */}
          <div className="border-b border-white/10 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Play className="w-4 h-4 md:w-5 md:h-5 text-[#D1FD0A]" />
                <h2 className="text-base md:text-lg font-bold text-white">Submit Clip</h2>
              </div>
              <button onClick={handleClose} className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/60" />
              </button>
            </div>
            {(preSelectedCampaignTitle || selectedCampaign) && (
              <p className="text-xs md:text-sm text-white/60 mt-1.5 md:mt-2">
                For campaign: <span className="text-white/80 font-medium">
                  {selectedCampaign?.title || preSelectedCampaignTitle}
                </span>
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-3 md:p-4 space-y-3 md:space-y-4">
            {/* URL Input */}
            <div>
              <label htmlFor="embedUrl" className="block text-xs md:text-sm font-medium text-white/80 mb-1.5 md:mb-2">
                Video URL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-white/40" />
                <input
                  id="embedUrl"
                  type="url"
                  value={embedUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://twitter.com/... or https://tiktok.com/..."
                  className="w-full pl-9 md:pl-10 pr-12 md:pr-16 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white/5 border border-white/10 text-white text-xs md:text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-transparent"
                />
                {isValidating ? (
                  <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/40 animate-spin" />
                  </div>
                ) : platform ? (
                  <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-base md:text-lg">
                    {platformIcons[platform]}
                  </div>
                ) : null}
              </div>
              {error && <p className="text-red-400 text-[10px] md:text-xs mt-1">{error}</p>}
              <p className="text-white/40 text-[10px] md:text-xs mt-1 md:mt-1.5">
                Supported: Twitter, TikTok, YouTube, Twitch, Instagram
              </p>

              {/* Video Preview */}
              {videoPreview && (
                <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={videoPreview}
                    alt="Video preview"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Campaign Linking (if not pre-selected) */}
            {!preSelectedCampaignId && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Link to Campaign <span className="text-white/40 text-xs">(optional)</span>
                </label>

                {selectedCampaign ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#D1FD0A]/10 border border-[#D1FD0A]/30">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{selectedCampaign.title}</div>
                      <div className="text-xs text-white/60 font-led-dot">
                        ${selectedCampaign.prizePool / 1000} per 1000 views
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCampaign(null)}
                      className="p-1 hover:bg-white/10 rounded transition"
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => {
                        setProjectSearch(e.target.value)
                        setShowCampaignDropdown(true)
                      }}
                      onFocus={() => setShowCampaignDropdown(true)}
                      placeholder="Search campaigns..."
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-transparent"
                    />

                    {showCampaignDropdown && filteredCampaigns.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto custom-scrollbar rounded-xl bg-neutral-900 border border-white/10 shadow-xl">
                        {filteredCampaigns.map((campaign) => (
                          <button
                            key={campaign.$id}
                            type="button"
                            onClick={() => {
                              setSelectedCampaign(campaign)
                              setProjectSearch('')
                              setShowCampaignDropdown(false)
                            }}
                            className="w-full flex items-center gap-2 p-2.5 hover:bg-white/5 transition text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white truncate">{campaign.title}</div>
                              <div className="text-xs text-white/60 font-led-dot">
                                ${campaign.prizePool / 1000} per 1000 views
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Title (optional) */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">
                Title <span className="text-white/40 text-xs">(optional)</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Describe your clip..."
                maxLength={200}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-transparent"
              />
            </div>

            {/* Tag Project (optional) */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tag Project <span className="text-white/40 text-xs">(optional)</span>
              </label>

              {selectedProject ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#D1FD0A]/10 border border-[#D1FD0A]/30">
                  {selectedProject.logoUrl && (
                    <img src={selectedProject.logoUrl} alt={selectedProject.title} className="size-8 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{selectedProject.title}</div>
                    {selectedProject.tokenSymbol && (
                      <div className="text-xs text-white/60">${selectedProject.tokenSymbol}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="p-1 hover:bg-white/10 rounded transition"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => {
                      setProjectSearch(e.target.value)
                      setShowProjectDropdown(true)
                    }}
                    onFocus={() => setShowProjectDropdown(true)}
                    placeholder="Search projects or enter custom name..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-transparent"
                  />

                  {showProjectDropdown && filteredProjects.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto custom-scrollbar rounded-xl bg-neutral-900 border border-white/10 shadow-xl">
                      {filteredProjects.map((project) => (
                        <button
                          key={project.$id}
                          type="button"
                          onClick={() => {
                            setSelectedProject(project)
                            setProjectSearch('')
                            setShowProjectDropdown(false)
                          }}
                          className="w-full flex items-center gap-2 p-2.5 hover:bg-white/5 transition text-left"
                        >
                          {project.logoUrl && (
                            <img src={project.logoUrl} alt={project.title} className="size-8 rounded-lg object-cover" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{project.title}</div>
                            {project.tokenSymbol && (
                              <div className="text-xs text-white/60">${project.tokenSymbol}</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!selectedProject && projectSearch && (
                <p className="text-white/40 text-xs mt-1.5">
                  Or press Enter to use "{projectSearch}" as custom project name
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="rounded-xl bg-[#D1FD0A]/10 border border-[#D1FD0A]/20 p-3">
              <p className="text-xs text-white/80 leading-relaxed">
                💡 Your clip will be embedded from the original platform. Make sure your post is public!
                {(selectedCampaign || preSelectedCampaignId) && ' It will be pending approval from the campaign owner.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 md:gap-3 pt-1 md:pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-white text-xs md:text-sm font-medium hover:bg-white/10 transition active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!embedUrl.trim() || !!error}
                className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white text-black text-xs md:text-sm font-medium hover:bg-neutral-200 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Submit Clip
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
