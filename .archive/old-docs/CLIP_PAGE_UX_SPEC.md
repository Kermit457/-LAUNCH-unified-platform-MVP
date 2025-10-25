# /clip Page - Comprehensive UX Design Specification

## Overview
This document provides complete UX flows, modal specifications, and interaction patterns for the /clip page. All designs follow the project's design system constraints and mobile-first principles.

---

## 1. Submit Clip Modal - Enhanced Design

### Current State Analysis
The existing SubmitClipModal (SubmitClipModal.tsx) has good foundations but needs enhancements for:
- Video preview auto-fetch
- Platform validation feedback
- Campaign linking UI
- Success state with shareable link

### Enhanced Modal Flow

#### Step 1: URL Input & Platform Detection
```tsx
// Layout: Single-step modal (600px max-width on desktop, full-width on mobile)

<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
  <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl">
    <div className="bg-neutral-900 rounded-2xl border border-white/10 h-full md:h-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-white" />
          <h2 className="text-lg font-bold text-white">Submit Clip</h2>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg">
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {/* Platform Selector - Visual Pills */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">
            Select Platform <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {platforms.map(p => (
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                  selectedPlatform === p.value
                    ? "border-fuchsia-500 bg-fuchsia-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  p.bgColor // e.g., "bg-red-600" for YouTube
                )}>
                  {p.icon}
                </div>
                <span className="text-xs font-medium text-white">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* URL Input with Live Validation */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Video URL <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
            <input
              type="url"
              placeholder="Paste your video link here..."
              className="w-full pl-10 pr-20 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            />
            {/* Live Validation Indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isValidating && <Loader2 className="w-4 h-4 animate-spin text-white/40" />}
              {isValid && <Check className="w-4 h-4 text-emerald-400" />}
              {error && <AlertCircle className="w-4 h-4 text-red-400" />}
            </div>
          </div>
          {/* Error State */}
          {error && (
            <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          {/* Success - Show Preview */}
          {videoMetadata && (
            <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex gap-3">
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                  {videoMetadata.thumbnail && (
                    <img src={videoMetadata.thumbnail} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{videoMetadata.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                    <span>{videoMetadata.views?.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{videoMetadata.duration}</span>
                  </div>
                </div>
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Optional: Custom Title */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Custom Title <span className="text-xs text-white/40">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Override auto-detected title..."
            maxLength={200}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
          />
          <p className="text-xs text-white/40 mt-1">
            {titleLength}/200 characters
          </p>
        </div>

        {/* Tag to Project - Enhanced Autocomplete */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Tag Project <span className="text-xs text-white/40">(optional)</span>
          </label>

          {selectedProject ? (
            /* Selected State */
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 border border-fuchsia-500/30">
              <img
                src={selectedProject.logoUrl}
                alt=""
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{selectedProject.title}</p>
                <p className="text-xs text-white/60">${selectedProject.tokenSymbol}</p>
              </div>
              <button
                type="button"
                className="p-1.5 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
          ) : (
            /* Search State */
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search projects or enter custom name..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
              />

              {/* Dropdown Results */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-2 max-h-64 overflow-y-auto custom-scrollbar rounded-xl bg-neutral-900 border border-white/10 shadow-2xl">
                  <div className="p-2 space-y-1">
                    {projects.map(project => (
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition text-left"
                      >
                        <img src={project.logoUrl} alt="" className="w-8 h-8 rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{project.title}</p>
                          <p className="text-xs text-white/60">${project.tokenSymbol}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {/* No Results */}
                  {filteredProjects.length === 0 && searchQuery && (
                    <div className="p-4 text-center">
                      <p className="text-sm text-white/60">No projects found</p>
                      <button
                        type="button"
                        className="mt-2 text-xs text-fuchsia-400 hover:text-fuchsia-300"
                      >
                        Use "{searchQuery}" as custom name
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Link to Campaign - Dropdown */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Submit to Campaign <span className="text-xs text-white/40">(optional)</span>
          </label>

          <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option value="">None - Just post to feed</option>
            {userCampaigns.map(c => (
              <option value={c.id}>{c.title} - ${c.ratePerThousand}/1k views</option>
            ))}
          </select>

          {selectedCampaign && (
            <div className="mt-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-xs text-blue-400">
                💰 This clip will be pending approval. If approved, you'll earn based on campaign metrics.
              </p>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 border border-fuchsia-500/20 p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/80 leading-relaxed">
              Your clip will be embedded from the original platform. Make sure it's public!
              Metrics update every 6 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions - Sticky */}
      <div className="p-4 border-t border-white/10 flex gap-3 flex-shrink-0">
        <button
          type="button"
          className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isValidating}
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Clip
        </button>
      </div>
    </div>
  </div>
</div>
```

#### Platform Configuration
```ts
const PLATFORMS = [
  {
    value: 'youtube',
    label: 'YouTube',
    icon: <YoutubeIcon />,
    bgColor: 'bg-red-600',
    placeholder: 'https://youtube.com/watch?v=...',
    regex: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    icon: <TiktokIcon />,
    bgColor: 'bg-black',
    placeholder: 'https://tiktok.com/@user/video/...',
    regex: /tiktok\.com\/@[\w.]+\/video\/(\d+)/
  },
  {
    value: 'twitter',
    label: 'X/Twitter',
    icon: <XIcon />,
    bgColor: 'bg-black',
    placeholder: 'https://x.com/user/status/...',
    regex: /(?:twitter\.com|x\.com)\/[\w]+\/status\/(\d+)/
  },
  {
    value: 'twitch',
    label: 'Twitch',
    icon: <TwitchIcon />,
    bgColor: 'bg-purple-600',
    placeholder: 'https://twitch.tv/videos/...',
    regex: /twitch\.tv\/videos\/(\d+)/
  },
  {
    value: 'instagram',
    label: 'Instagram',
    icon: <InstagramIcon />,
    bgColor: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
    placeholder: 'https://instagram.com/reel/...',
    regex: /instagram\.com\/(reel|p)\/([a-zA-Z0-9_-]+)/
  }
]
```

#### Validation Rules
```ts
// URL Validation Flow
const validateUrl = async (url: string, platform: string) => {
  setIsValidating(true)
  setError('')

  try {
    // 1. Check platform-specific regex
    const platformConfig = PLATFORMS.find(p => p.value === platform)
    if (!platformConfig?.regex.test(url)) {
      throw new Error(`Invalid ${platformConfig.label} URL format`)
    }

    // 2. Fetch video metadata (server-side function)
    const metadata = await fetchVideoMetadata(url, platform)

    if (!metadata) {
      throw new Error('Could not fetch video data. Check if the post is public.')
    }

    // 3. Validate video requirements
    if (selectedCampaign) {
      if (metadata.duration < selectedCampaign.minDuration) {
        throw new Error(`Video must be at least ${selectedCampaign.minDuration}s long`)
      }
      if (metadata.duration > selectedCampaign.maxDuration) {
        throw new Error(`Video must be shorter than ${selectedCampaign.maxDuration}s`)
      }
    }

    setVideoMetadata(metadata)
    setIsValid(true)
  } catch (err) {
    setError(err.message)
    setIsValid(false)
  } finally {
    setIsValidating(false)
  }
}
```

#### Success State
```tsx
// After successful submission, show success modal
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="w-full max-w-md bg-neutral-900 rounded-2xl border border-white/10 p-6 text-center">
    {/* Success Animation */}
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center animate-scale-in">
      <Check className="w-8 h-8 text-white" />
    </div>

    <h3 className="text-xl font-bold text-white mb-2">Clip Submitted!</h3>
    <p className="text-sm text-white/60 mb-6">
      {submittedToCampaign
        ? 'Your clip is pending approval. You'll be notified once it's reviewed.'
        : 'Your clip is now live on the feed!'
      }
    </p>

    {/* Shareable Link */}
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
      <p className="text-xs text-white/40 mb-2">Share your clip</p>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={shareUrl}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
        />
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/60" />}
        </button>
      </div>
    </div>

    {/* Social Share Buttons */}
    <div className="flex gap-2 mb-6">
      <button className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition flex items-center justify-center gap-2">
        <XIcon className="w-4 h-4" />
        <span>Share on X</span>
      </button>
      <button className="flex-1 px-4 py-2.5 rounded-xl bg-[#0088cc] text-white text-sm font-medium hover:bg-[#0077b3] transition flex items-center justify-center gap-2">
        <TelegramIcon className="w-4 h-4" />
        <span>Telegram</span>
      </button>
    </div>

    {/* Actions */}
    <div className="flex gap-3">
      <button
        onClick={onClose}
        className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition"
      >
        Close
      </button>
      <button
        onClick={viewClip}
        className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
      >
        View Clip
      </button>
    </div>
  </div>
</div>
```

---

## 2. Start Campaign Modal - Multi-Step Flow

### Overview
Transform the existing CreateCampaignModal into a comprehensive 4-step wizard with budget calculator and platform requirements.

### Step 1: Basic Info
```tsx
<div className="p-4 space-y-4">
  <div className="mb-2">
    <div className="flex items-center justify-between text-xs text-white/60 mb-2">
      <span>Step 1 of 4</span>
      <span>25% Complete</span>
    </div>
    <div className="h-1 w-full rounded-full bg-white/10">
      <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-300" />
    </div>
  </div>

  <div>
    <h3 className="text-lg font-bold text-white mb-1">Campaign Basics</h3>
    <p className="text-sm text-white/60">Let's start with the essentials</p>
  </div>

  {/* Campaign Type - Visual Cards */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-3">
      Campaign Type <span className="text-red-400">*</span>
    </label>
    <div className="grid grid-cols-1 gap-2">
      {CAMPAIGN_TYPES.map(type => (
        <button
          type="button"
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
            selectedType === type.value
              ? "border-fuchsia-500 bg-fuchsia-500/10"
              : "border-white/10 bg-white/5 hover:border-white/20"
          )}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
            {type.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{type.label}</p>
            <p className="text-xs text-white/60 mt-0.5">{type.description}</p>
          </div>
          {selectedType === type.value && (
            <Check className="w-5 h-5 text-fuchsia-400 flex-shrink-0" />
          )}
        </button>
      ))}
    </div>
  </div>

  {/* Campaign Title */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-2">
      Campaign Title <span className="text-red-400">*</span>
    </label>
    <input
      type="text"
      placeholder="e.g., Get $LAUNCH to 1M views"
      maxLength={100}
      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
    />
    <p className="text-xs text-white/40 mt-1">{titleLength}/100 characters</p>
  </div>

  {/* Description */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-2">
      Description <span className="text-red-400">*</span>
    </label>
    <textarea
      placeholder="Describe what creators should do..."
      rows={4}
      maxLength={500}
      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white resize-none"
    />
    <p className="text-xs text-white/40 mt-1">{descLength}/500 characters</p>
  </div>
</div>

{/* Footer */}
<div className="p-4 border-t border-white/10 flex gap-3">
  <button
    type="button"
    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition"
  >
    Cancel
  </button>
  <button
    type="button"
    disabled={!title || !description}
    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition disabled:opacity-50"
  >
    Next: Budget
  </button>
</div>
```

### Campaign Types Configuration
```ts
const CAMPAIGN_TYPES = [
  {
    value: 'clipping',
    label: 'Clipping Campaign',
    icon: '🎬',
    description: 'Pay creators to clip and share your project content'
  },
  {
    value: 'engagement',
    label: 'Engagement Campaign',
    icon: '💬',
    description: 'Reward likes, comments, and shares'
  },
  {
    value: 'streaming',
    label: 'Streaming Campaign',
    icon: '📺',
    description: 'Sponsor live streams featuring your project'
  },
  {
    value: 'content',
    label: 'Content Creation',
    icon: '📝',
    description: 'Commission original content about your project'
  }
]
```

### Step 2: Budget & Rewards
```tsx
<div className="p-4 space-y-4">
  {/* Progress */}
  <div className="mb-2">
    <div className="flex items-center justify-between text-xs text-white/60 mb-2">
      <span>Step 2 of 4</span>
      <span>50% Complete</span>
    </div>
    <div className="h-1 w-full rounded-full bg-white/10">
      <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-300" />
    </div>
  </div>

  <div>
    <h3 className="text-lg font-bold text-white mb-1">Budget & Rewards</h3>
    <p className="text-sm text-white/60">Set your investment and payout structure</p>
  </div>

  {/* Total Budget */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-2">
      Total Budget <span className="text-red-400">*</span>
    </label>
    <div className="relative">
      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      <input
        type="number"
        placeholder="1000"
        step="10"
        min="50"
        className="w-full pl-10 pr-16 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60">
        USD
      </div>
    </div>
    <p className="text-xs text-white/40 mt-1">Minimum $50</p>
  </div>

  {/* Reward Structure */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-3">
      Payout Method <span className="text-red-400">*</span>
    </label>
    <div className="space-y-2">
      <button
        type="button"
        className={cn(
          "w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left",
          payoutMethod === 'per_view'
            ? "border-fuchsia-500 bg-fuchsia-500/10"
            : "border-white/10 bg-white/5 hover:border-white/20"
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 text-sm">
          📊
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Per 1,000 Views</p>
          <p className="text-xs text-white/60 mt-0.5">Pay based on view count performance</p>
        </div>
        {payoutMethod === 'per_view' && <Check className="w-5 h-5 text-fuchsia-400" />}
      </button>

      <button
        type="button"
        className={cn(
          "w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left",
          payoutMethod === 'fixed'
            ? "border-fuchsia-500 bg-fuchsia-500/10"
            : "border-white/10 bg-white/5 hover:border-white/20"
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 text-sm">
          💰
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Fixed Bounty</p>
          <p className="text-xs text-white/60 mt-0.5">Set reward per approved submission</p>
        </div>
        {payoutMethod === 'fixed' && <Check className="w-5 h-5 text-fuchsia-400" />}
      </button>

      <button
        type="button"
        className={cn(
          "w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left",
          payoutMethod === 'prize_pool'
            ? "border-fuchsia-500 bg-fuchsia-500/10"
            : "border-white/10 bg-white/5 hover:border-white/20"
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-sm">
          🏆
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Prize Pool</p>
          <p className="text-xs text-white/60 mt-0.5">Top performers split the total budget</p>
        </div>
        {payoutMethod === 'prize_pool' && <Check className="w-5 h-5 text-fuchsia-400" />}
      </button>
    </div>
  </div>

  {/* Rate Configuration (conditional on payout method) */}
  {payoutMethod === 'per_view' && (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-2">
        Rate per 1,000 Views <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="number"
          placeholder="5.00"
          step="0.50"
          min="0.50"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
        />
      </div>
    </div>
  )}

  {payoutMethod === 'fixed' && (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-2">
        Bounty per Approved Clip <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="number"
          placeholder="25.00"
          step="1"
          min="5"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
        />
      </div>
    </div>
  )}

  {/* Budget Calculator Preview */}
  <div className="rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 border border-fuchsia-500/30 p-4">
    <div className="flex items-center gap-2 mb-3">
      <Calculator className="w-4 h-4 text-fuchsia-400" />
      <h4 className="text-sm font-semibold text-white">Budget Projection</h4>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-white/60">Total Budget:</span>
        <span className="font-semibold text-white">${budget}</span>
      </div>
      {payoutMethod === 'per_view' && (
        <>
          <div className="flex justify-between">
            <span className="text-white/60">Rate:</span>
            <span className="text-white">${ratePerThousand} / 1k views</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Estimated Reach:</span>
            <span className="font-semibold text-emerald-400">
              {((budget / ratePerThousand) * 1000).toLocaleString()} views
            </span>
          </div>
        </>
      )}
      {payoutMethod === 'fixed' && (
        <div className="flex justify-between">
          <span className="text-white/60">Max Clips:</span>
          <span className="font-semibold text-emerald-400">
            {Math.floor(budget / fixedBounty)} submissions
          </span>
        </div>
      )}
    </div>
  </div>

  {/* Duration */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-2">
      Campaign Duration <span className="text-red-400">*</span>
    </label>
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        className={cn(
          "px-4 py-2.5 rounded-xl border transition",
          duration === 7
            ? "border-fuchsia-500 bg-fuchsia-500/10 text-white"
            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20"
        )}
      >
        7 Days
      </button>
      <button
        type="button"
        className={cn(
          "px-4 py-2.5 rounded-xl border transition",
          duration === 14
            ? "border-fuchsia-500 bg-fuchsia-500/10 text-white"
            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20"
        )}
      >
        14 Days
      </button>
      <button
        type="button"
        className={cn(
          "px-4 py-2.5 rounded-xl border transition",
          duration === 30
            ? "border-fuchsia-500 bg-fuchsia-500/10 text-white"
            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20"
        )}
      >
        30 Days
      </button>
      <button
        type="button"
        className={cn(
          "px-4 py-2.5 rounded-xl border transition",
          duration === -1
            ? "border-fuchsia-500 bg-fuchsia-500/10 text-white"
            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20"
        )}
      >
        Custom
      </button>
    </div>
    {duration === -1 && (
      <input
        type="date"
        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white mt-2"
      />
    )}
  </div>
</div>

{/* Footer */}
<div className="p-4 border-t border-white/10 flex gap-3">
  <button
    type="button"
    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition"
  >
    Back
  </button>
  <button
    type="button"
    disabled={!budget || !payoutMethod || !duration}
    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition disabled:opacity-50"
  >
    Next: Requirements
  </button>
</div>
```

### Step 3: Platform & Requirements
```tsx
<div className="p-4 space-y-4">
  {/* Progress */}
  <div className="mb-2">
    <div className="flex items-center justify-between text-xs text-white/60 mb-2">
      <span>Step 3 of 4</span>
      <span>75% Complete</span>
    </div>
    <div className="h-1 w-full rounded-full bg-white/10">
      <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-300" />
    </div>
  </div>

  <div>
    <h3 className="text-lg font-bold text-white mb-1">Content Requirements</h3>
    <p className="text-sm text-white/60">Define what you're looking for</p>
  </div>

  {/* Platform Requirements */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-3">
      Accepted Platforms <span className="text-red-400">*</span>
    </label>
    <div className="grid grid-cols-2 gap-2">
      {PLATFORMS.map(platform => (
        <button
          type="button"
          onClick={() => togglePlatform(platform.value)}
          className={cn(
            "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
            selectedPlatforms.includes(platform.value)
              ? "border-fuchsia-500 bg-fuchsia-500/10"
              : "border-white/10 bg-white/5 hover:border-white/20"
          )}
        >
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", platform.bgColor)}>
            {platform.icon}
          </div>
          <span className="text-sm font-medium text-white">{platform.label}</span>
          {selectedPlatforms.includes(platform.value) && (
            <Check className="w-4 h-4 text-fuchsia-400 ml-auto" />
          )}
        </button>
      ))}
    </div>
    {selectedPlatforms.length === 0 && (
      <p className="text-xs text-red-400 mt-1">Select at least one platform</p>
    )}
  </div>

  {/* Video Duration Requirements */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-2">
      Video Duration Requirements
    </label>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-white/60 mb-1">Min Duration (seconds)</label>
        <input
          type="number"
          placeholder="15"
          min="1"
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-white/60 mb-1">Max Duration (seconds)</label>
        <input
          type="number"
          placeholder="120"
          min="1"
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
        />
      </div>
    </div>
    <p className="text-xs text-white/40 mt-1">Leave blank for no restrictions</p>
  </div>

  {/* Required Elements */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-2">
      Required Elements in Submission
    </label>
    <div className="space-y-2">
      {REQUIRED_ELEMENTS.map(element => (
        <label
          key={element.value}
          className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition cursor-pointer"
        >
          <input
            type="checkbox"
            checked={requiredElements.includes(element.value)}
            onChange={() => toggleRequiredElement(element.value)}
            className="w-5 h-5 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-0 mt-0.5"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{element.label}</p>
            <p className="text-xs text-white/60 mt-0.5">{element.description}</p>
          </div>
        </label>
      ))}
    </div>
  </div>

  {/* Custom Guidelines */}
  <div>
    <label className="block text-sm font-medium text-white/80 mb-2">
      Additional Guidelines <span className="text-xs text-white/40">(optional)</span>
    </label>
    <textarea
      placeholder="E.g., Must mention our token ticker, must include our logo, avoid controversial topics..."
      rows={4}
      maxLength={1000}
      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm resize-none"
    />
    <p className="text-xs text-white/40 mt-1">{guidelinesLength}/1000 characters</p>
  </div>
</div>

{/* Footer */}
<div className="p-4 border-t border-white/10 flex gap-3">
  <button
    type="button"
    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition"
  >
    Back
  </button>
  <button
    type="button"
    disabled={selectedPlatforms.length === 0}
    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition disabled:opacity-50"
  >
    Next: Review
  </button>
</div>
```

### Required Elements Configuration
```ts
const REQUIRED_ELEMENTS = [
  {
    value: 'project_tag',
    label: 'Tag Project/Token',
    description: 'Creator must tag your project in the post'
  },
  {
    value: 'website_link',
    label: 'Website Link',
    description: 'Must include link to your website in description'
  },
  {
    value: 'ticker_mention',
    label: 'Ticker Symbol',
    description: 'Must mention your token ticker (e.g., $LAUNCH)'
  },
  {
    value: 'logo_display',
    label: 'Logo Display',
    description: 'Your logo must be visible in the video'
  },
  {
    value: 'hashtags',
    label: 'Specific Hashtags',
    description: 'Must use campaign-specific hashtags'
  }
]
```

### Step 4: Review & Launch
```tsx
<div className="p-4 space-y-4">
  {/* Progress */}
  <div className="mb-2">
    <div className="flex items-center justify-between text-xs text-white/60 mb-2">
      <span>Step 4 of 4</span>
      <span>Review & Launch</span>
    </div>
    <div className="h-1 w-full rounded-full bg-white/10">
      <div className="h-full w-full rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-300" />
    </div>
  </div>

  <div>
    <h3 className="text-lg font-bold text-white mb-1">Review Your Campaign</h3>
    <p className="text-sm text-white/60">Double-check everything before launching</p>
  </div>

  {/* Campaign Summary Card */}
  <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
    {/* Header */}
    <div className="p-4 border-b border-white/10">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
          {campaignType.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-white truncate">{title}</h4>
          <p className="text-xs text-white/60 mt-0.5">{campaignType.label}</p>
        </div>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="p-1.5 hover:bg-white/5 rounded-lg transition"
        >
          <Edit2 className="w-4 h-4 text-white/60" />
        </button>
      </div>
    </div>

    {/* Details */}
    <div className="p-4 space-y-3">
      {/* Budget */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Total Budget:</span>
        <span className="text-lg font-bold text-white">${budget}</span>
      </div>

      {/* Payout */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Payout Method:</span>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{payoutMethod === 'per_view' ? 'Per 1,000 Views' : payoutMethod === 'fixed' ? 'Fixed Bounty' : 'Prize Pool'}</p>
          <p className="text-xs text-white/60">
            {payoutMethod === 'per_view' && `$${ratePerThousand} / 1k views`}
            {payoutMethod === 'fixed' && `$${fixedBounty} per clip`}
            {payoutMethod === 'prize_pool' && 'Top performers split pool'}
          </p>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Duration:</span>
        <span className="text-sm font-semibold text-white">{duration} days</span>
      </div>

      {/* Platforms */}
      <div>
        <p className="text-sm text-white/60 mb-2">Accepted Platforms:</p>
        <div className="flex flex-wrap gap-2">
          {selectedPlatforms.map(p => {
            const platform = PLATFORMS.find(pl => pl.value === p)
            return (
              <div key={p} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                <div className={cn("w-5 h-5 rounded flex items-center justify-center text-xs", platform.bgColor)}>
                  {platform.icon}
                </div>
                <span className="text-xs text-white">{platform.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Video Requirements */}
      {(minDuration || maxDuration) && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Video Duration:</span>
          <span className="text-sm font-semibold text-white">
            {minDuration || 0}s - {maxDuration || '∞'}s
          </span>
        </div>
      )}

      {/* Required Elements */}
      {requiredElements.length > 0 && (
        <div>
          <p className="text-sm text-white/60 mb-2">Required:</p>
          <div className="space-y-1">
            {requiredElements.map(el => {
              const element = REQUIRED_ELEMENTS.find(e => e.value === el)
              return (
                <div key={el} className="flex items-center gap-2 text-xs text-white/80">
                  <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span>{element.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Cost Breakdown */}
  <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/30 p-4">
    <h4 className="text-sm font-semibold text-white mb-3">Cost Breakdown</h4>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-white/60">Campaign Budget:</span>
        <span className="text-white">${budget}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/60">Platform Fee (5%):</span>
        <span className="text-white">${(budget * 0.05).toFixed(2)}</span>
      </div>
      <div className="h-px bg-white/10 my-2" />
      <div className="flex justify-between">
        <span className="font-semibold text-white">Total Cost:</span>
        <span className="font-bold text-white text-lg">${(budget * 1.05).toFixed(2)}</span>
      </div>
    </div>
  </div>

  {/* Terms Agreement */}
  <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
    <input
      type="checkbox"
      checked={agreedToTerms}
      onChange={(e) => setAgreedToTerms(e.target.checked)}
      className="w-5 h-5 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-0 mt-0.5 flex-shrink-0"
    />
    <div>
      <p className="text-sm text-white">I agree to the Campaign Terms</p>
      <p className="text-xs text-white/60 mt-0.5">
        By launching this campaign, you agree to pay approved submissions according to the rules above.
        <a href="/terms" className="text-fuchsia-400 hover:text-fuchsia-300 ml-1">Read full terms</a>
      </p>
    </div>
  </label>
</div>

{/* Footer */}
<div className="p-4 border-t border-white/10 flex gap-3">
  <button
    type="button"
    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition"
  >
    Back
  </button>
  <button
    type="submit"
    disabled={!agreedToTerms || isSubmitting}
    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
  >
    {isSubmitting ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Launching...</span>
      </>
    ) : (
      <>
        <Rocket className="w-4 h-4" />
        <span>Launch Campaign</span>
      </>
    )}
  </button>
</div>
```

---

## 3. Campaign Card Action Modals

### View Campaign Detail Modal
```tsx
// Full-screen modal on mobile, centered on desktop
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
  <div className="w-full md:max-w-3xl md:mx-4 bg-neutral-900 md:rounded-2xl border-t md:border border-white/10 max-h-[90vh] flex flex-col">
    {/* Header */}
    <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-xl">
          {campaign.title.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{campaign.title}</h2>
          <p className="text-xs text-white/60">{campaign.type}</p>
        </div>
      </div>
      <button className="p-2 hover:bg-white/5 rounded-lg">
        <X className="w-4 h-4 text-white/60" />
      </button>
    </div>

    {/* Content - Scrollable */}
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/60 mb-1">Total Budget</p>
          <p className="text-lg font-bold text-white">${campaign.budgetTotal}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/60 mb-1">Paid Out</p>
          <p className="text-lg font-bold text-white">${campaign.budgetPaid}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/60 mb-1">Submissions</p>
          <p className="text-lg font-bold text-white">{campaign.totalSubmissions}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/60 mb-1">Total Views</p>
          <p className="text-lg font-bold text-emerald-400">{campaign.totalViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/80">Budget Remaining</span>
          <span className="text-sm font-bold text-white">
            {Math.round(((campaign.budgetTotal - campaign.budgetPaid) / campaign.budgetTotal) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-500"
            style={{ width: `${((campaign.budgetTotal - campaign.budgetPaid) / campaign.budgetTotal) * 100}%` }}
          />
        </div>
        <p className="text-xs text-white/60 mt-2">
          ${campaign.budgetTotal - campaign.budgetPaid} remaining of ${campaign.budgetTotal}
        </p>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
        <p className="text-sm text-white/80 leading-relaxed">{campaign.description}</p>
      </div>

      {/* Requirements */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Requirements</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/80">Minimum {campaign.minViews} views</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/80">
              Video duration: {campaign.minDuration}s - {campaign.maxDuration}s
            </p>
          </div>
          {campaign.platforms.map(p => (
            <div key={p} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/80 capitalize">{p} videos accepted</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Top Performers</h3>
        <div className="space-y-2">
          {topSubmissions.map((submission, idx) => (
            <div key={submission.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                idx === 0 && "bg-gradient-to-br from-yellow-500 to-orange-600 text-white",
                idx === 1 && "bg-gradient-to-br from-gray-400 to-gray-600 text-white",
                idx === 2 && "bg-gradient-to-br from-orange-700 to-orange-900 text-white",
                idx > 2 && "bg-white/5 text-white/60"
              )}>
                #{idx + 1}
              </div>
              <img
                src={submission.creatorAvatar}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">@{submission.creatorUsername}</p>
                <p className="text-xs text-white/60">{submission.views.toLocaleString()} views</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400">${submission.earned}</p>
                <p className="text-xs text-white/60">earned</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Submissions */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Recent Submissions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {recentClips.map(clip => (
            <button
              key={clip.id}
              onClick={() => viewClip(clip.id)}
              className="aspect-[9/16] rounded-xl overflow-hidden bg-neutral-800 border border-white/10 hover:border-white/20 transition group"
            >
              <img
                src={clip.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Footer Actions */}
    <div className="p-4 border-t border-white/10 flex gap-3 flex-shrink-0">
      <button
        onClick={shareCampaign}
        className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>
      <button
        onClick={() => openSubmitModal(campaign.id)}
        className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>Submit Clip</span>
      </button>
    </div>
  </div>
</div>
```

---

## 4. Clip Card Interaction Enhancements

### Buy Button - Quick Buy Modal
```tsx
// Lightweight modal for quick token purchase
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
  <div className="w-full md:max-w-md bg-neutral-900 rounded-t-2xl md:rounded-2xl border-t md:border border-white/10">
    {/* Header */}
    <div className="p-4 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={project.logoUrl} alt="" className="w-10 h-10 rounded-lg" />
          <div>
            <h3 className="text-base font-bold text-white">{project.title}</h3>
            <p className="text-xs text-white/60">${project.tokenSymbol}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg">
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>
    </div>

    {/* Quick Buy Form */}
    <div className="p-4 space-y-4">
      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          You Pay
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="0.1"
            step="0.01"
            className="w-full pl-3 pr-16 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60">
            SOL
          </div>
        </div>
      </div>

      {/* You Receive */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          You Receive (estimated)
        </label>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-lg font-bold text-white">{estimatedTokens} ${project.tokenSymbol}</p>
        </div>
      </div>

      {/* Price Impact */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">Price Impact:</span>
        <span className={cn(
          "font-semibold",
          priceImpact < 1 ? "text-emerald-400" : priceImpact < 5 ? "text-yellow-400" : "text-red-400"
        )}>
          {priceImpact.toFixed(2)}%
        </span>
      </div>

      {/* Slippage Settings */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/80">Slippage Tolerance</span>
          <button className="text-xs text-fuchsia-400 hover:text-fuchsia-300">
            Custom
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[0.5, 1, 2, 5].map(val => (
            <button
              key={val}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition",
                slippage === val
                  ? "bg-fuchsia-500 text-white"
                  : "bg-white/5 text-white/80 hover:bg-white/10"
              )}
            >
              {val}%
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="p-4 border-t border-white/10 space-y-3">
      <button
        disabled={!amount || isProcessing}
        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4" />
            <span>Buy ${project.tokenSymbol}</span>
          </>
        )}
      </button>
      <button
        onClick={viewFullChart}
        className="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition"
      >
        View Full Chart & Stats
      </button>
    </div>
  </div>
</div>
```

### React Button - Emoji Picker
```tsx
// Floating reaction picker
<div className="relative">
  <button
    onClick={() => setShowReactionPicker(!showReactionPicker)}
    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10 transition active:scale-95"
  >
    React
  </button>

  {showReactionPicker && (
    <div className="absolute bottom-full left-0 mb-2 p-2 rounded-xl bg-neutral-900 border border-white/10 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
      <div className="flex gap-1">
        {REACTIONS.map(reaction => (
          <button
            key={reaction.value}
            onClick={() => handleReact(clipId, reaction.value)}
            className="w-10 h-10 rounded-lg hover:bg-white/5 transition flex items-center justify-center text-2xl relative group"
          >
            <span className="transition-transform duration-200 group-hover:scale-125">
              {reaction.emoji}
            </span>
            {/* Count Badge */}
            {clip.reactions[reaction.value] > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-fuchsia-500 rounded-full">
                {clip.reactions[reaction.value]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
```

### Reactions Configuration
```ts
const REACTIONS = [
  { value: 'fire', emoji: '🔥', label: 'Fire' },
  { value: 'rocket', emoji: '🚀', label: 'Rocket' },
  { value: 'diamond', emoji: '💎', label: 'Diamond Hands' },
  { value: 'heart', emoji: '❤️', label: 'Love' },
  { value: 'hundred', emoji: '💯', label: '100' },
  { value: 'clap', emoji: '👏', label: 'Clap' },
  { value: 'eyes', emoji: '👀', label: 'Eyes' }
]
```

### Share Button - Enhanced
```tsx
const handleShare = (clipId: string) => {
  const shareUrl = `${window.location.origin}/clip?id=${clipId}`

  // 1. Copy to clipboard
  navigator.clipboard.writeText(shareUrl)

  // 2. Show toast with share options
  toast.custom((t) => (
    <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 shadow-2xl min-w-[300px]">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Link Copied!</p>
          <p className="text-xs text-white/60 mt-0.5">Share this clip on social media</p>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="p-1 hover:bg-white/5 rounded">
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Social Share Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => shareToX(shareUrl)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-white/10 transition"
        >
          <XIcon className="w-4 h-4" />
          <span>Share on X</span>
        </button>
        <button
          onClick={() => shareToTelegram(shareUrl)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0088cc] text-white text-sm font-medium hover:bg-[#0077b3] transition"
        >
          <TelegramIcon className="w-4 h-4" />
          <span>Telegram</span>
        </button>
      </div>
    </div>
  ), {
    duration: 5000,
    position: 'bottom-center'
  })
}

// Share to X/Twitter
const shareToX = (url: string) => {
  const text = `Check out this clip! 🎬`
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank'
  )
}

// Share to Telegram
const shareToTelegram = (url: string) => {
  const text = `Check out this clip!`
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    '_blank'
  )
}
```

---

## 5. Tab Content Designs

### Analytics Tab
```tsx
<div className="space-y-6">
  {/* Time Range Selector */}
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-white">Performance Analytics</h2>
    <div className="flex gap-2">
      {['7D', '30D', '90D', 'All'].map(range => (
        <button
          key={range}
          className={cn(
            "px-3 py-1.5 rounded-xl text-sm font-medium transition",
            selectedRange === range
              ? "bg-white text-black"
              : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
          )}
        >
          {range}
        </button>
      ))}
    </div>
  </div>

  {/* Key Metrics Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
      <div className="flex items-center gap-2 mb-2">
        <Eye className="w-4 h-4 text-blue-400" />
        <span className="text-xs text-white/60">Total Views</span>
      </div>
      <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
      <div className="flex items-center gap-1 mt-1">
        <TrendingUp className="w-3 h-3 text-emerald-400" />
        <span className="text-xs text-emerald-400">+12.3%</span>
      </div>
    </div>

    <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
      <div className="flex items-center gap-2 mb-2">
        <Heart className="w-4 h-4 text-red-400" />
        <span className="text-xs text-white/60">Total Engagement</span>
      </div>
      <p className="text-2xl font-bold text-white">{engagement}%</p>
      <div className="flex items-center gap-1 mt-1">
        <TrendingUp className="w-3 h-3 text-emerald-400" />
        <span className="text-xs text-emerald-400">+5.7%</span>
      </div>
    </div>

    <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="w-4 h-4 text-emerald-400" />
        <span className="text-xs text-white/60">Earnings</span>
      </div>
      <p className="text-2xl font-bold text-white">${earnings}</p>
      <div className="flex items-center gap-1 mt-1">
        <TrendingUp className="w-3 h-3 text-emerald-400" />
        <span className="text-xs text-emerald-400">+$42</span>
      </div>
    </div>

    <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
      <div className="flex items-center gap-2 mb-2">
        <Video className="w-4 h-4 text-fuchsia-400" />
        <span className="text-xs text-white/60">Total Clips</span>
      </div>
      <p className="text-2xl font-bold text-white">{totalClips}</p>
      <div className="flex items-center gap-1 mt-1">
        <Plus className="w-3 h-3 text-white/60" />
        <span className="text-xs text-white/60">3 this week</span>
      </div>
    </div>
  </div>

  {/* Views Chart */}
  <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
    <h3 className="text-sm font-semibold text-white mb-4">Views Over Time</h3>
    {/* Chart placeholder - integrate with recharts or similar */}
    <div className="h-64 rounded-xl bg-white/5 flex items-center justify-center">
      <p className="text-sm text-white/40">Chart: Views trend graph</p>
    </div>
  </div>

  {/* Platform Distribution */}
  <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
    <h3 className="text-sm font-semibold text-white mb-4">Platform Breakdown</h3>
    <div className="space-y-3">
      {platformStats.map(platform => (
        <div key={platform.name}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className={cn("w-6 h-6 rounded flex items-center justify-center", platform.bgColor)}>
                {platform.icon}
              </div>
              <span className="text-sm text-white">{platform.name}</span>
            </div>
            <span className="text-sm font-semibold text-white">{platform.views.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className={cn("h-full transition-all duration-500", platform.barColor)}
              style={{ width: `${(platform.views / totalViews) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Top Performing Clips */}
  <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-white">Top Performing Clips</h3>
      <button className="text-xs text-fuchsia-400 hover:text-fuchsia-300">View All</button>
    </div>
    <div className="space-y-2">
      {topClips.map((clip, idx) => (
        <div key={clip.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
            #{idx + 1}
          </div>
          <div className="w-16 h-24 rounded-lg overflow-hidden bg-neutral-800">
            <img src={clip.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{clip.title || 'Untitled'}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
              <span>{clip.views.toLocaleString()} views</span>
              <span>•</span>
              <span>{clip.engagement.toFixed(1)}% engagement</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-emerald-400">${clip.earnings}</p>
            <p className="text-xs text-white/60">earned</p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Earnings Breakdown */}
  <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
    <h3 className="text-sm font-semibold text-white mb-4">Earnings Breakdown</h3>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Campaign Rewards:</span>
        <span className="text-sm font-semibold text-white">${campaignEarnings}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Performance Bonuses:</span>
        <span className="text-sm font-semibold text-white">${bonusEarnings}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Referral Earnings:</span>
        <span className="text-sm font-semibold text-white">${referralEarnings}</span>
      </div>
      <div className="h-px bg-white/10 my-2" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Total Earnings:</span>
        <span className="text-xl font-bold text-emerald-400">${totalEarnings}</span>
      </div>
    </div>
  </div>
</div>
```

### My Clips Tab
```tsx
<div className="space-y-4">
  {/* Header with Filters */}
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
    <div className="flex-1">
      <h2 className="text-lg font-semibold text-white">My Clips</h2>
      <p className="text-sm text-white/60 mt-0.5">{userClips.length} total submissions</p>
    </div>

    {/* Status Filter Pills */}
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {CLIP_STATUSES.map(status => (
        <button
          key={status.value}
          onClick={() => setStatusFilter(status.value)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition",
            statusFilter === status.value
              ? "bg-white text-black"
              : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
          )}
        >
          {status.label}
          {status.count > 0 && (
            <span className="ml-1.5 text-xs opacity-80">({status.count})</span>
          )}
        </button>
      ))}
    </div>

    {/* Sort Dropdown */}
    <select className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
      <option value="recent">Most Recent</option>
      <option value="views">Most Views</option>
      <option value="earnings">Highest Earnings</option>
      <option value="engagement">Best Engagement</option>
    </select>
  </div>

  {/* Empty State */}
  {filteredClips.length === 0 && (
    <div className="text-center py-20">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
        <Video className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Clips Yet</h3>
      <p className="text-sm text-white/60 mb-6">Start sharing your content to earn rewards!</p>
      <button
        onClick={() => setSubmitClipOpen(true)}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
      >
        Submit Your First Clip
      </button>
    </div>
  )}

  {/* Clips Grid */}
  {filteredClips.length > 0 && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredClips.map(clip => (
        <div key={clip.id} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden group">
          {/* Thumbnail */}
          <div className="relative aspect-[9/16] bg-neutral-800">
            <img
              src={clip.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <div className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
                clip.status === 'active' && "bg-emerald-500/90 text-white",
                clip.status === 'pending' && "bg-yellow-500/90 text-black",
                clip.status === 'rejected' && "bg-red-500/90 text-white"
              )}>
                {clip.status === 'active' && 'Live'}
                {clip.status === 'pending' && 'Pending Review'}
                {clip.status === 'rejected' && 'Rejected'}
              </div>
            </div>

            {/* Platform Badge */}
            <div className="absolute top-3 right-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", clip.platformBg)}>
                {clip.platformIcon}
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{clip.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{clip.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{clip.comments.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <p className="text-sm font-medium text-white line-clamp-2">
              {clip.title || 'Untitled Clip'}
            </p>

            {/* Campaign Badge (if applicable) */}
            {clip.campaignId && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-blue-400 truncate">{clip.campaignTitle}</span>
              </div>
            )}

            {/* Earnings */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Earnings:</span>
              <span className="text-sm font-bold text-emerald-400">${clip.earnings}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => viewClip(clip.id)}
                className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition"
              >
                View
              </button>
              {clip.status === 'active' && (
                <button
                  onClick={() => shareClip(clip.id)}
                  className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
              {clip.status === 'pending' && (
                <button
                  onClick={() => editClip(clip.id)}
                  className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => deleteClip(clip.id)}
                className="px-3 py-2 rounded-lg border border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

### Campaigns Tab (User's Created Campaigns)
```tsx
<div className="space-y-4">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-lg font-semibold text-white">My Campaigns</h2>
      <p className="text-sm text-white/60 mt-0.5">{userCampaigns.length} campaigns created</p>
    </div>
    <button
      onClick={() => setCreateCampaignOpen(true)}
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      <span>New Campaign</span>
    </button>
  </div>

  {/* Status Tabs */}
  <div className="flex gap-2">
    <button
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition",
        campaignFilter === 'active'
          ? "bg-white text-black"
          : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
      )}
    >
      Active ({activeCampaigns.length})
    </button>
    <button
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition",
        campaignFilter === 'completed'
          ? "bg-white text-black"
          : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
      )}
    >
      Completed ({completedCampaigns.length})
    </button>
    <button
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition",
        campaignFilter === 'draft'
          ? "bg-white text-black"
          : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
      )}
    >
      Drafts ({draftCampaigns.length})
    </button>
  </div>

  {/* Empty State */}
  {filteredCampaigns.length === 0 && (
    <div className="text-center py-20">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
        <Megaphone className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Campaigns Yet</h3>
      <p className="text-sm text-white/60 mb-6">Create your first campaign to start getting content!</p>
      <button
        onClick={() => setCreateCampaignOpen(true)}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
      >
        Create Campaign
      </button>
    </div>
  )}

  {/* Campaigns List */}
  {filteredCampaigns.length > 0 && (
    <div className="space-y-4">
      {filteredCampaigns.map(campaign => (
        <div key={campaign.id} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0">
              {campaign.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-white truncate">{campaign.title}</h3>
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0",
                  campaign.status === 'active' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
                  campaign.status === 'completed' && "bg-blue-500/10 text-blue-400 border border-blue-500/30",
                  campaign.status === 'draft' && "bg-white/5 text-white/60 border border-white/10"
                )}>
                  {campaign.status === 'active' && 'Active'}
                  {campaign.status === 'completed' && 'Completed'}
                  {campaign.status === 'draft' && 'Draft'}
                </div>
              </div>
              <p className="text-xs text-white/60 mt-1">{campaign.type}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-xs text-white/60 mb-1">Budget</p>
              <p className="text-sm font-bold text-white">${campaign.budgetTotal}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-xs text-white/60 mb-1">Paid Out</p>
              <p className="text-sm font-bold text-white">${campaign.budgetPaid}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-xs text-white/60 mb-1">Submissions</p>
              <p className="text-sm font-bold text-white">{campaign.totalSubmissions}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-xs text-white/60 mb-1">Total Views</p>
              <p className="text-sm font-bold text-emerald-400">{campaign.totalViews.toLocaleString()}</p>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
              <span>Budget Spent</span>
              <span>{Math.round((campaign.budgetPaid / campaign.budgetTotal) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-500"
                style={{ width: `${(campaign.budgetPaid / campaign.budgetTotal) * 100}%` }}
              />
            </div>
          </div>

          {/* Pending Review Badge */}
          {campaign.pendingCount > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/30">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <p className="text-sm text-orange-400 font-medium">
                  {campaign.pendingCount} submission{campaign.pendingCount !== 1 ? 's' : ''} pending review
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {campaign.status === 'active' && campaign.pendingCount > 0 && (
              <button
                onClick={() => router.push(`/campaign/${campaign.id}/review`)}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:from-orange-600 hover:to-red-700 transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Review ({campaign.pendingCount})</span>
              </button>
            )}
            <button
              onClick={() => viewCampaignDetails(campaign.id)}
              className="flex-1 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              <BarChart2 className="w-4 h-4" />
              <span>View Stats</span>
            </button>
            {campaign.status === 'active' && (
              <button
                onClick={() => editCampaign(campaign.id)}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            {campaign.status === 'draft' && (
              <button
                onClick={() => publishCampaign(campaign.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-600 hover:to-purple-700 transition"
              >
                <Rocket className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

---

## 6. Loading & Error States

### Loading States
```tsx
// Skeleton for Campaign Cards
const CampaignCardSkeleton = () => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 animate-pulse">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-12 h-12 rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-2 bg-white/10 rounded" />
      <div className="h-8 bg-white/10 rounded" />
    </div>
  </div>
)

// Skeleton for Clip Cards
const ClipCardSkeleton = () => (
  <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden animate-pulse">
    <div className="aspect-[9/16] bg-white/10" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-3 bg-white/10 rounded w-1/2" />
    </div>
  </div>
)
```

### Error States
```tsx
// Generic Error Component
const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry
}: ErrorStateProps) => (
  <div className="text-center py-20">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
      <AlertCircle className="w-8 h-8 text-red-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-white/60 mb-6 max-w-md mx-auto">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition flex items-center gap-2 mx-auto"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    )}
  </div>
)
```

---

## 7. Mobile Responsive Specifications

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-Specific Adjustments

```tsx
// Modal adaptations for mobile
const modalClasses = cn(
  // Mobile: Full screen with safe area padding
  "fixed inset-0 md:inset-auto",
  "md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
  "md:w-full md:max-w-lg md:max-h-[90vh]",
  // Safe area insets for mobile notch/nav
  "pb-[env(safe-area-inset-bottom)]"
)

// Tab navigation - horizontal scroll on mobile
<div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
  {tabs.map(tab => (
    <button className="flex-shrink-0 px-3 py-1.5 rounded-full whitespace-nowrap">
      {tab}
    </button>
  ))}
</div>

// Grid responsive layouts
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
  {/* Auto-adjusts based on screen size */}
</div>
```

---

## Design System Color Reference

```css
/* Primary Actions */
.btn-primary: bg-gradient-to-r from-fuchsia-500 to-purple-600
.btn-success: bg-gradient-to-r from-emerald-500 to-teal-600
.btn-warning: bg-gradient-to-r from-orange-500 to-red-600

/* Card Backgrounds */
.card-bg: bg-neutral-900 border-white/10
.card-hover: bg-neutral-900 border-white/20

/* Text */
.text-primary: text-white
.text-secondary: text-white/80
.text-muted: text-white/60
.text-disabled: text-white/40

/* Status Colors */
.status-success: text-emerald-400 bg-emerald-500/10 border-emerald-500/30
.status-pending: text-yellow-400 bg-yellow-500/10 border-yellow-500/30
.status-error: text-red-400 bg-red-500/10 border-red-500/30
.status-info: text-blue-400 bg-blue-500/10 border-blue-500/30

/* Platform Colors */
.platform-youtube: bg-red-600
.platform-tiktok: bg-black
.platform-twitter: bg-black
.platform-twitch: bg-purple-600
.platform-instagram: bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500

/* Solana Green (for success states) */
.solana-green: #14F195
```

---

## Accessibility Requirements

1. **Keyboard Navigation**: All interactive elements must be keyboard accessible (Tab, Enter, Esc)
2. **ARIA Labels**: All icon-only buttons must have aria-label
3. **Focus Indicators**: Visible focus rings on all interactive elements
4. **Screen Reader**: Meaningful alt text for images, proper heading hierarchy
5. **Color Contrast**: Maintain WCAG AA standards (4.5:1 for normal text)

---

## Animation Specifications

```tsx
// Modal enter/exit
className="animate-in zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95"

// Toast notifications
className="animate-slide-in"

// Reaction feedback
className="transition-transform duration-200 hover:scale-125"

// Button interactions
className="transition active:scale-95"

// Card hover
className="transition-all duration-300 hover:-translate-y-0.5"
```

---

## File Structure for Implementation

```
components/
├── modals/
│   ├── SubmitClipModal.tsx (enhance existing)
│   ├── CreateCampaignModal.tsx (enhance existing)
│   ├── CampaignDetailModal.tsx (new)
│   ├── QuickBuyModal.tsx (new)
│   └── ReactionPicker.tsx (new)
├── clip/
│   ├── ClipCard.tsx (existing with enhancements)
│   ├── CampaignCard.tsx (existing with enhancements)
│   ├── AnalyticsTab.tsx (new)
│   ├── MyClipsTab.tsx (new)
│   └── MyCampaignsTab.tsx (new)
└── ui/
    ├── EmptyState.tsx (new)
    ├── ErrorState.tsx (new)
    └── Skeleton.tsx (new)

lib/
├── appwrite/
│   └── services/
│       ├── clips.ts (enhance with metadata fetch)
│       ├── campaigns.ts (enhance)
│       └── analytics.ts (new)
└── utils/
    ├── platformDetection.ts (enhance)
    ├── shareUtils.ts (new)
    └── chartUtils.ts (new)
```

---

## Implementation Priority

### Phase 1 (Critical - Week 1)
1. Enhanced Submit Clip Modal with platform selector
2. Multi-step Create Campaign Modal
3. Campaign Detail Modal (View action)
4. Reaction picker for clips

### Phase 2 (High - Week 2)
1. Analytics Tab with charts
2. My Clips Tab with filters
3. Quick Buy Modal
4. Share functionality with social intents

### Phase 3 (Medium - Week 3)
1. My Campaigns Tab
2. Advanced filtering/sorting
3. Performance optimizations
4. Animation polish

---

This specification provides complete UX flows and component structures ready for implementation. All designs follow the established design system and are optimized for both mobile and desktop experiences.
