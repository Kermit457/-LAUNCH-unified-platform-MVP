"use client"

import { useState, useCallback, useEffect } from 'react'
import { Upload, TrendingUp, Users, Zap, AlertCircle, CheckCircle, Image as ImageIcon, ChevronDown, ExternalLink, ImageIcon as ImagesIcon, Video, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TokenLaunchPreviewProps {
  onLaunch?: (data: TokenData) => void
}

interface TokenData {
  image: string | null
  name: string
  symbol: string
  description: string
  socialLinks?: {
    twitter?: string
    telegram?: string
    website?: string
    discord?: string
  }
  referenceImages?: string[]
  referenceClips?: string[]
  referenceTweets?: string[]
}

export function TokenLaunchPreview({ onLaunch }: TokenLaunchPreviewProps) {
  const [tokenData, setTokenData] = useState<TokenData>({
    image: null,
    name: '',
    symbol: '',
    description: '',
    socialLinks: {},
    referenceImages: [],
    referenceClips: [],
    referenceTweets: []
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [selectedTag, setSelectedTag] = useState<'ICM' | 'CCM' | 'CLUT'>('ICM')
  const [isExpanded, setIsExpanded] = useState(true)

  // Auto-collapse on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded && window.scrollY > 100) {
        setIsExpanded(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isExpanded])

  // Calculate success score based on filled fields
  const calculateSuccessScore = () => {
    let score = 0
    if (tokenData.image) score += 25
    if (tokenData.name.length >= 3) score += 25
    if (tokenData.symbol.length >= 2 && tokenData.symbol.length <= 10) score += 20
    if (tokenData.description.length >= 50) score += 30
    return score
  }

  const successScore = calculateSuccessScore()

  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setTokenData(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleImageUpload(file)
  }, [handleImageUpload])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(file)
  }

  const getSuccessColor = (score: number) => {
    if (score >= 80) return 'text-[#00FF88]'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getSuccessLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Work'
  }

  return (
    <section className="container mx-auto px-4 py-4">
      <div className="glass-premium p-4 rounded-2xl border border-[#00FF88]/20 transition-all duration-300 relative">

        {/* Collapse/Expand Button - Mobile Optimized */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-10 min-w-[44px] min-h-[44px] md:p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#00FF88] transition-all flex items-center justify-center"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <ChevronDown className={cn("w-5 h-5 md:w-4 md:h-4 text-zinc-400 transition-transform", !isExpanded && "rotate-180")} />
        </button>

        {/* Main Grid */}
        <div className={cn(
          "grid grid-cols-1 gap-4 items-start transition-all duration-300",
          isExpanded ? "lg:grid-cols-[1.2fr,1fr]" : "lg:grid-cols-1"
        )}>

          {/* LEFT: Form Inputs */}
          <div className={cn("space-y-3", !isExpanded && "hidden")}>

            {/* Compact Header with Title + Image + How it Works */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-gradient-main">Pre Launch</h2>

                {/* Tag Selection Pills */}
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedTag('ICM')}
                    className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold border transition-all",
                      selectedTag === 'ICM'
                        ? "border-[#00FF88] bg-[#00FF88]/10 text-[#00FF88]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-[#00FF88] hover:text-[#00FF88]"
                    )}
                  >
                    ICM
                  </button>
                  <button
                    onClick={() => setSelectedTag('CCM')}
                    className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold border transition-all",
                      selectedTag === 'CCM'
                        ? "border-[#00FF88] bg-[#00FF88]/10 text-[#00FF88]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-[#00FF88] hover:text-[#00FF88]"
                    )}
                  >
                    CCM
                  </button>
                  <button
                    onClick={() => setSelectedTag('CLUT')}
                    className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold border transition-all",
                      selectedTag === 'CLUT'
                        ? "border-[#00FF88] bg-[#00FF88]/10 text-[#00FF88]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-[#00FF88] hover:text-[#00FF88]"
                    )}
                  >
                    CLUT
                  </button>
                </div>
              </div>

              {/* Token Image Upload - Square */}
              <div>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  className={cn(
                    "relative w-16 h-16 rounded-lg border-2 border-dashed transition-all cursor-pointer",
                    isDragging ? "border-[#00FF88] bg-[#00FF88]/10" : "border-zinc-700 hover:border-zinc-600",
                    imagePreview && "border-solid border-[#00FF88]"
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {imagePreview ? (
                    <img src={imagePreview} alt="Token" className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* How it Works Link - Mobile Optimized */}
              <a
                href="#how-it-works"
                className="ml-auto px-4 py-3 md:py-2 min-h-[44px] flex items-center rounded-lg border border-zinc-800 hover:border-[#00FF88] text-white text-sm font-medium transition-all hover:bg-[#00FF88]/10"
              >
                How it works
              </a>
            </div>

            {/* Compact Form Fields in Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Token Name */}
              <input
                type="text"
                placeholder="Token Name"
                value={tokenData.name}
                onChange={(e) => setTokenData(prev => ({ ...prev, name: e.target.value }))}
                maxLength={31}
                className="px-4 py-3 min-h-[48px] rounded-lg bg-zinc-900 border border-zinc-800 text-white text-base placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all"
              />

              {/* Token Symbol */}
              <input
                type="text"
                placeholder="$TICKER"
                value={tokenData.symbol}
                onChange={(e) => setTokenData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                maxLength={10}
                className="px-4 py-3 min-h-[48px] rounded-lg bg-zinc-900 border border-zinc-800 text-white text-base placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all font-mono"
              />
            </div>

            {/* Token Description - Full Width - Mobile Optimized */}
            <textarea
              placeholder="Token Description"
              value={tokenData.description}
              onChange={(e) => setTokenData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-base placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all resize-none"
            />

            {/* More Options Expandable Section - Mobile Optimized */}
            <div>
              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="w-full flex items-center gap-2 px-4 py-3 min-h-[48px] rounded-lg bg-zinc-900 border border-zinc-800 text-white text-base hover:border-zinc-700 transition-all"
              >
                <span className="flex-1 text-left font-medium">More Options</span>
                <ChevronDown className={cn("w-5 h-5 transition-transform", showMoreOptions && "rotate-180")} />
              </button>

              {showMoreOptions && (
                <div className="mt-2 space-y-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  {/* Social Links */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span className="text-xs font-bold text-zinc-400">Social Links</span>
                    </div>
                    <input
                      type="url"
                      placeholder="Twitter URL"
                      value={tokenData.socialLinks?.twitter || ''}
                      onChange={(e) => setTokenData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, twitter: e.target.value } }))}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all"
                    />
                    <input
                      type="url"
                      placeholder="Telegram URL"
                      value={tokenData.socialLinks?.telegram || ''}
                      onChange={(e) => setTokenData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, telegram: e.target.value } }))}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all"
                    />
                    <input
                      type="url"
                      placeholder="Website URL"
                      value={tokenData.socialLinks?.website || ''}
                      onChange={(e) => setTokenData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, website: e.target.value } }))}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all"
                    />
                    <input
                      type="url"
                      placeholder="Discord URL"
                      value={tokenData.socialLinks?.discord || ''}
                      onChange={(e) => setTokenData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, discord: e.target.value } }))}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all"
                    />
                  </div>

                  {/* Reference Images - Upload 3-5 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ImagesIcon className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span className="text-xs font-bold text-zinc-400">Reference Images (3-5)</span>
                    </div>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div key={index} className="w-12 h-12 rounded border-2 border-dashed border-zinc-800 hover:border-zinc-700 flex items-center justify-center cursor-pointer bg-zinc-950">
                          <Upload className="w-4 h-4 text-zinc-600" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GitHub Link */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span className="text-xs font-bold text-zinc-400">GitHub Repository</span>
                    </div>
                    <input
                      type="url"
                      placeholder="GitHub URL"
                      value={tokenData.socialLinks?.website || ''}
                      onChange={(e) => setTokenData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, website: e.target.value } }))}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all"
                    />
                  </div>

                  {/* Tag Team Members */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span className="text-xs font-bold text-zinc-400">Tag Team Members</span>
                    </div>
                    <input
                      type="text"
                      placeholder="@username (comma separated)"
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all"
                    />
                  </div>

                  {/* Reference Clips */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span className="text-xs font-bold text-zinc-400">Reference Clips</span>
                    </div>
                    <textarea
                      placeholder="Clip URLs (one per line)"
                      value={tokenData.referenceClips?.join('\n') || ''}
                      onChange={(e) => setTokenData(prev => ({ ...prev, referenceClips: e.target.value.split('\n').filter(Boolean) }))}
                      rows={3}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all resize-none"
                    />
                  </div>

                  {/* Reference Tweets */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#00FF88]" />
                      <span className="text-xs font-bold text-zinc-400">Reference Tweets</span>
                    </div>
                    <textarea
                      placeholder="Tweet URLs (one per line)"
                      value={tokenData.referenceTweets?.join('\n') || ''}
                      onChange={(e) => setTokenData(prev => ({ ...prev, referenceTweets: e.target.value.split('\n').filter(Boolean) }))}
                      rows={3}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#00FF88] transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Collapsed View - Compact Summary */}
          {!isExpanded && (
            <div className="flex items-center gap-3 md:gap-4 w-full pr-14 md:pr-12">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Token" className="w-12 h-12 md:w-12 md:h-12 rounded-lg object-cover border border-[#00FF88] flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 md:w-12 md:h-12 rounded-lg border-2 border-dashed border-zinc-800 flex items-center justify-center bg-zinc-950 flex-shrink-0">
                    <Upload className="w-5 h-5 text-zinc-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-black text-white truncate">{tokenData.name || 'Pre Launch'}</h3>
                  <p className="text-sm md:text-xs text-zinc-400 font-mono truncate">{tokenData.symbol ? `$${tokenData.symbol}` : 'Configure your token'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-zinc-500">Success</div>
                  <div className={cn("text-lg font-black", getSuccessColor(successScore))}>{successScore}%</div>
                </div>
                <button
                  onClick={() => onLaunch?.(tokenData)}
                  disabled={successScore < 80}
                  className={cn(
                    "px-4 md:px-4 py-3 md:py-2 min-h-[44px] rounded-lg font-bold transition-all text-sm whitespace-nowrap",
                    successScore >= 80
                      ? "bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black hover:scale-105 active:scale-95"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  )}
                >
                  {successScore >= 80 ? 'Launch' : 'Complete'}
                </button>
              </div>
            </div>
          )}

          {/* RIGHT: Preview + Benefits */}
          <div className={cn("space-y-3", !isExpanded && "hidden")}>

            {/* Live Preview */}
            <div className="glass-premium p-3 rounded-xl border border-[#00FF88]/30 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-[#00FF88]" />
              <h3 className="text-xs font-bold text-white">Live Preview</h3>
              <span className="ml-auto px-1.5 py-0.5 rounded bg-[#00FF88]/10 text-[#00FF88] text-[10px] font-bold border border-[#00FF88]/30">
                LIVE
              </span>
            </div>

            {/* Token Preview */}
            <div className="flex items-start gap-2 mb-2">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0",
                imagePreview ? "border-[#00FF88]" : "border-zinc-800 bg-zinc-900"
              )}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-zinc-700" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-black text-white truncate">
                  {tokenData.name || 'Untitled'}
                </h4>
                <p className="text-[10px] text-zinc-400 font-mono">
                  {tokenData.symbol ? `$${tokenData.symbol}` : '$TICKER'}
                </p>
              </div>
            </div>

            {/* Description Preview */}
            <p className="text-[10px] text-zinc-300 leading-relaxed mb-2 line-clamp-2">
              {tokenData.description || 'Your token description will appear here...'}
            </p>

            {/* Success Score Compact */}
            <div className="mb-2 flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  {successScore >= 80 ? (
                    <CheckCircle className="w-3 h-3 text-[#00FF88]" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-yellow-400" />
                  )}
                  <span className="text-[10px] font-bold text-zinc-400">Success</span>
                </div>
                <div className={cn("text-base font-black", getSuccessColor(successScore))}>
                  {successScore}%
                </div>
              </div>

              {/* Score Bar */}
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    successScore >= 80 ? 'bg-[#00FF88]' :
                    successScore >= 60 ? 'bg-yellow-400' :
                    successScore >= 40 ? 'bg-orange-400' : 'bg-red-400'
                  )}
                  style={{ width: `${successScore}%` }}
                />
              </div>
            </div>

            {/* Launch Button - Mobile Optimized */}
            <button
              onClick={() => onLaunch?.(tokenData)}
              disabled={successScore < 80}
              className={cn(
                "w-full px-4 py-3 md:py-2 min-h-[44px] rounded-lg font-bold transition-all text-base md:text-sm",
                successScore >= 80
                  ? "bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black hover:scale-105 active:scale-95"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              )}
            >
              {successScore >= 80 ? 'Launch Token' : 'Complete Fields'}
            </button>
            </div>

            {/* Bonding Curve Explainer - Only visible when More Options is open */}
            {showMoreOptions && (
            <div className="glass-premium p-3 rounded-xl border border-[#00FF88]/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-[#00FF88]" />
                <h3 className="text-xs font-bold text-white">How It Works</h3>
              </div>

              {/* Curve Visualization */}
              <div className="relative h-32 mb-3 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-zinc-800/30" />
                  ))}
                </div>

                {/* Curve Path */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#00FF88', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#00FFFF', stopOpacity: 0.3 }} />
                    </linearGradient>
                  </defs>
                  {/* Exponential curve */}
                  <path
                    d="M 0 95 Q 50 70, 100 40 T 200 5"
                    fill="none"
                    stroke="url(#curveGradient)"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0 95 Q 50 70, 100 40 T 200 5 L 200 100 L 0 100 Z"
                    fill="url(#curveGradient)"
                  />
                  {/* Vertical line at graduation point */}
                  <line x1="140" y1="0" x2="140" y2="100" stroke="#00FF88" strokeWidth="1" strokeDasharray="2,2" />
                </svg>

                {/* Labels */}
                <div className="absolute bottom-1 left-1 text-[8px] text-zinc-500 font-mono">0 SOL</div>
                <div className="absolute top-1 left-1 text-[8px] text-zinc-500 font-mono">Price</div>
                <div className="absolute bottom-1 right-1 text-[8px] text-[#00FF88] font-bold">Graduation →</div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-zinc-950 rounded p-2 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 mb-0.5">Target</div>
                  <div className="text-xs font-bold text-white">85 SOL</div>
                </div>
                <div className="bg-zinc-950 rounded p-2 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 mb-0.5">LP Seed</div>
                  <div className="text-xs font-bold text-[#00FF88]">Auto</div>
                </div>
                <div className="bg-zinc-950 rounded p-2 border border-zinc-800">
                  <div className="text-[8px] text-zinc-500 mb-0.5">Supply</div>
                  <div className="text-xs font-bold text-white">1B</div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-[#00FF88] mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-zinc-300 leading-relaxed">
                    <span className="font-bold text-white">Fair Launch:</span> Price increases with each buy
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-[#00FF88] mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-zinc-300 leading-relaxed">
                    <span className="font-bold text-white">Auto LP:</span> Graduates to Pump.fun at 85 SOL
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-[#00FF88] mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-zinc-300 leading-relaxed">
                    <span className="font-bold text-white">Anti-Snipe:</span> Per-user limits protect early buyers
                  </p>
                </div>
              </div>
            </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

