# Clips Swipe Experience: Component Specifications
## Technical Implementation Guide

**Version:** 1.0
**Date:** 2025-10-24
**Reference:** CLIPS_SWIPE_DESIGN.md

---

## Component Architecture

### Component Tree
```
ClipPage
├── ClipHeader
│   ├── SearchBar
│   ├── ActionButtons (StartCampaign, AddClip)
│   └── ViewToggle (Scroll/Grid)
├── TabNavigation
│   └── TabItem[] (swipeable on mobile)
├── ClipScrollView (mobile default)
│   └── ClipScrollItem[]
│       ├── VideoPlayer
│       ├── ClipOverlay
│       │   ├── CreatorInfo
│       │   ├── ClipMetrics
│       │   └── ActionButtons
│       └── SwipeIndicator
└── ClipGridView (desktop default)
    └── ClipCard[]
        ├── VideoThumbnail
        ├── HoverOverlay
        └── ClipMeta
```

---

## 1. ClipHeader Component

### Interface
```tsx
interface ClipHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddClip: () => void
  onStartCampaign: () => void
  viewMode: 'scroll' | 'grid'
  onViewModeChange: (mode: 'scroll' | 'grid') => void
}
```

### Implementation
```tsx
export function ClipHeader({
  searchQuery,
  onSearchChange,
  onAddClip,
  onStartCampaign,
  viewMode,
  onViewModeChange
}: ClipHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-lg border-b border-[#3B3B3B]">
      {/* Desktop Header */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D1FD0A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search clips, creators, projects..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-900/80 border-2 border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D1FD0A]/50 focus:border-[#D1FD0A] transition-all"
            />
          </div>

          {/* Action Buttons */}
          <button
            onClick={onStartCampaign}
            className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all min-h-[48px]"
          >
            Start Campaign
          </button>
          <button
            onClick={onAddClip}
            className="px-6 py-3 rounded-xl bg-[#D1FD0A] hover:bg-[#B8E008] text-black font-bold transition-all min-h-[48px]"
          >
            + Clip
          </button>
        </div>

        {/* View Toggle */}
        <div className="mt-4 flex items-center gap-6">
          <ViewToggle mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden px-3 py-2">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="flex-1 pl-10 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm min-h-[40px]"
          />
          <IconSearch className="absolute left-6 top-4 w-4 h-4 text-zinc-500" />
          <button
            onClick={onAddClip}
            className="min-h-[40px] min-w-[40px] rounded-lg bg-[#D1FD0A] text-black font-bold flex items-center justify-center"
          >
            +
          </button>
        </div>

        <ViewToggle mode={viewMode} onChange={onViewModeChange} size="small" />
      </div>
    </header>
  )
}
```

---

## 2. ViewToggle Component

### Interface
```tsx
interface ViewToggleProps {
  mode: 'scroll' | 'grid'
  onChange: (mode: 'scroll' | 'grid') => void
  size?: 'small' | 'medium' | 'large'
}
```

### Implementation
```tsx
import { PlayCircle, LayoutGrid } from 'lucide-react'

export function ViewToggle({ mode, onChange, size = 'medium' }: ViewToggleProps) {
  const sizeClasses = {
    small: 'p-1 gap-1',
    medium: 'p-2 gap-2',
    large: 'p-3 gap-3'
  }

  const buttonSizes = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }

  return (
    <div className={cn(
      "inline-flex items-center rounded-2xl backdrop-blur-lg bg-zinc-900/50 border-2 border-[#D1FD0A]/20",
      sizeClasses[size]
    )}>
      <button
        onClick={() => onChange('scroll')}
        className={cn(
          "rounded-xl font-bold transition-all flex items-center gap-2 min-h-[44px]",
          buttonSizes[size],
          mode === 'scroll'
            ? "bg-[#D1FD0A] text-black"
            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
        )}
      >
        <PlayCircle className="w-4 h-4" />
        Scroll
      </button>
      <button
        onClick={() => onChange('grid')}
        className={cn(
          "rounded-xl font-bold transition-all flex items-center gap-2 min-h-[44px]",
          buttonSizes[size],
          mode === 'grid'
            ? "bg-[#D1FD0A] text-black"
            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        Grid
      </button>
    </div>
  )
}
```

---

## 3. ClipScrollView Component

### Interface
```tsx
interface ClipScrollViewProps {
  clips: Clip[]
  currentIndex: number
  onIndexChange: (index: number) => void
  onLike: (clipId: string) => void
  onShare: (clipId: string) => void
  onBuy: (clipId: string) => void
}
```

### Implementation
```tsx
import { useEffect, useRef } from 'react'
import { useClipSwipe } from '@/hooks/useClipSwipe'
import { useClipAutoPlay } from '@/hooks/useClipAutoPlay'

export function ClipScrollView({
  clips,
  currentIndex,
  onIndexChange,
  onLike,
  onShare,
  onBuy
}: ClipScrollViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Custom hooks for swipe and auto-play
  useClipSwipe(containerRef, currentIndex, onIndexChange)
  useClipAutoPlay(containerRef, clips)

  return (
    <div
      ref={containerRef}
      className="clip-scroll-container h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth'
      }}
    >
      {clips.map((clip, index) => (
        <ClipScrollItem
          key={clip.$id}
          clip={clip}
          isActive={index === currentIndex}
          onLike={() => onLike(clip.$id)}
          onShare={() => onShare(clip.$id)}
          onBuy={() => onBuy(clip.$id)}
        />
      ))}
    </div>
  )
}
```

### Styles
```css
.clip-scroll-container {
  height: 100vh;
  height: 100svh; /* Safe viewport height */
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.clip-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
```

---

## 4. ClipScrollItem Component

### Interface
```tsx
interface ClipScrollItemProps {
  clip: Clip
  isActive: boolean
  onLike: () => void
  onShare: () => void
  onBuy: () => void
}
```

### Implementation
```tsx
export function ClipScrollItem({
  clip,
  isActive,
  onLike,
  onShare,
  onBuy
}: ClipScrollItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play()
    } else if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [isActive])

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike()
    // Trigger heart burst animation
    triggerHeartBurst()
  }

  return (
    <div
      className="clip-scroll-item relative h-screen snap-start snap-always"
      style={{ height: '100vh', height: '100svh' }}
    >
      {/* Video Player */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={clip.videoUrl}
        playsInline
        muted={isMuted}
        loop={false}
        preload="metadata"
      />

      {/* Mute Toggle (Top Right) */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Clip Overlay */}
      <ClipOverlay
        clip={clip}
        isLiked={isLiked}
        onLike={handleLike}
        onShare={onShare}
        onBuy={onBuy}
      />
    </div>
  )
}
```

---

## 5. ClipOverlay Component

### Interface
```tsx
interface ClipOverlayProps {
  clip: Clip
  isLiked: boolean
  onLike: () => void
  onShare: () => void
  onBuy: () => void
}
```

### Implementation
```tsx
import { Heart, MessageCircle, Eye, Share2 } from 'lucide-react'

export function ClipOverlay({
  clip,
  isLiked,
  onLike,
  onShare,
  onBuy
}: ClipOverlayProps) {
  return (
    <div className="clip-overlay absolute inset-x-0 bottom-0 z-10">
      <div className="px-4 pb-safe">
        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={clip.creatorAvatar}
            alt={clip.creatorUsername}
            className="w-10 h-10 rounded-full border-2 border-white/20"
          />
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">
              @{clip.creatorUsername}
            </div>
            <div className="text-zinc-300 text-xs">
              {clip.projectName}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <Heart className={cn(
              "w-4 h-4",
              isLiked ? "text-red-500 fill-red-500" : "text-[#D1FD0A]"
            )} />
            <span className="font-led-dot text-white text-sm">
              {formatNumber(clip.likes)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-zinc-300" />
            <span className="font-led-dot text-white text-sm">
              {formatNumber(clip.comments)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-zinc-300" />
            <span className="font-led-dot text-[#D1FD0A] text-sm">
              {formatNumber(clip.views)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBuy}
            className="flex-1 min-h-[48px] rounded-xl bg-[#D1FD0A] hover:bg-[#B8E008] active:scale-95 text-black font-bold text-sm transition-all"
          >
            Buy Keys
          </button>
          <button
            onClick={onLike}
            className="min-h-[48px] min-w-[48px] rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur text-white hover:border-[#D1FD0A] active:scale-95 transition-all"
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
          <button
            onClick={onShare}
            className="min-h-[48px] min-w-[48px] rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur text-white hover:border-[#D1FD0A] active:scale-95 transition-all flex items-center justify-center"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
```

### Styles
```css
.clip-overlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.2) 80%,
    transparent 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
}

@supports (padding: max(0px)) {
  .clip-overlay {
    padding-bottom: max(80px, env(safe-area-inset-bottom));
  }
}
```

---

## 6. ClipGridView Component

### Interface
```tsx
interface ClipGridViewProps {
  clips: Clip[]
  onClipClick: (clipId: string) => void
}
```

### Implementation
```tsx
export function ClipGridView({ clips, onClipClick }: ClipGridViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {clips.map(clip => (
          <ClipCard
            key={clip.$id}
            clip={clip}
            onClick={() => onClipClick(clip.$id)}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## 7. ClipCard Component (Grid)

### Interface
```tsx
interface ClipCardProps {
  clip: Clip
  onClick: () => void
}
```

### Implementation
```tsx
export function ClipCard({ clip, onClick }: ClipCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Thumbnail */}
      <img
        src={clip.thumbnailUrl}
        alt={clip.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
      />

      {/* Hover Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",
        isHovered && "opacity-100"
      )}>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Creator */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={clip.creatorAvatar}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white text-sm font-medium">
              @{clip.creatorUsername}
            </span>
          </div>

          {/* Metrics */}
          <div className="flex gap-3 text-xs text-white/80">
            <span>❤️ {formatNumber(clip.likes)}</span>
            <span>💬 {formatNumber(clip.comments)}</span>
            <span>👁 {formatNumber(clip.views)}</span>
          </div>
        </div>
      </div>

      {/* Platform Badge */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 backdrop-blur flex items-center justify-center">
        {getPlatformIcon(clip.platform)}
      </div>
    </div>
  )
}
```

---

## 8. Custom Hooks

### useClipSwipe Hook
```tsx
import { useRef, useEffect } from 'react'

export function useClipSwipe(
  containerRef: RefObject<HTMLDivElement>,
  currentIndex: number,
  onIndexChange: (index: number) => void
) {
  const touchStartRef = useRef({ y: 0, time: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        y: e.touches[0].clientY,
        time: Date.now()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEnd = e.changedTouches[0].clientY
      const deltaY = touchStartRef.current.y - touchEnd
      const deltaTime = Date.now() - touchStartRef.current.time

      // Swipe threshold: 50px, max 500ms
      if (Math.abs(deltaY) > 50 && deltaTime < 500) {
        if (deltaY > 0) {
          // Swipe up - next clip
          onIndexChange(currentIndex + 1)
        } else {
          // Swipe down - previous clip
          onIndexChange(Math.max(0, currentIndex - 1))
        }
      }
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [containerRef, currentIndex, onIndexChange])
}
```

### useClipAutoPlay Hook
```tsx
import { useEffect, useRef } from 'react'

export function useClipAutoPlay(
  containerRef: RefObject<HTMLDivElement>,
  clips: Clip[]
) {
  const observerRef = useRef<IntersectionObserver>()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target.querySelector('video')
          if (!video) return

          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            video.play()

            // Track view after 3 seconds
            setTimeout(() => {
              const clipId = video.dataset.clipId
              if (clipId) trackView(clipId)
            }, 3000)
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.75 }
    )

    // Observe all clip items
    const items = container.querySelectorAll('.clip-scroll-item')
    items.forEach(item => observerRef.current?.observe(item))

    return () => {
      observerRef.current?.disconnect()
    }
  }, [containerRef, clips])
}

async function trackView(clipId: string) {
  // TODO: Update view count in Appwrite
  console.log('Track view:', clipId)
}
```

### useViewMode Hook
```tsx
import { useState, useEffect } from 'react'

export function useViewMode() {
  const [viewMode, setViewMode] = useState<'scroll' | 'grid'>('grid')

  useEffect(() => {
    // Auto-detect based on viewport
    const detectViewMode = () => {
      const isMobile = window.innerWidth < 768
      const savedMode = localStorage.getItem('clipViewMode') as 'scroll' | 'grid' | null

      if (savedMode) {
        setViewMode(savedMode)
      } else {
        setViewMode(isMobile ? 'scroll' : 'grid')
      }
    }

    detectViewMode()
    window.addEventListener('resize', detectViewMode)
    return () => window.removeEventListener('resize', detectViewMode)
  }, [])

  const updateViewMode = (mode: 'scroll' | 'grid') => {
    setViewMode(mode)
    localStorage.setItem('clipViewMode', mode)
  }

  return { viewMode, setViewMode: updateViewMode }
}
```

---

## 9. Animation Utilities

### Heart Burst Animation
```tsx
export function triggerHeartBurst(targetElement: HTMLElement) {
  const heartCount = 6
  const container = targetElement.closest('.clip-scroll-item')

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div')
    heart.className = 'heart-burst'
    heart.textContent = '❤️'
    heart.style.left = `${20 + Math.random() * 60}%`
    heart.style.animationDelay = `${i * 50}ms`

    container?.appendChild(heart)

    setTimeout(() => heart.remove(), 1000)
  }
}
```

### CSS Keyframes
```css
@keyframes heartBurst {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-120px) scale(1.5);
    opacity: 0;
  }
}

.heart-burst {
  position: absolute;
  bottom: 140px;
  font-size: 28px;
  animation: heartBurst 1s ease-out forwards;
  pointer-events: none;
  z-index: 30;
}
```

---

## 10. Utility Functions

### Platform Detection
```tsx
export function getPlatformIcon(platform: string) {
  const icons = {
    youtube: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    instagram: '📷'
  }

  return icons[platform as keyof typeof icons] || '🎬'
}
```

---

## 11. TypeScript Interfaces

```tsx
export interface Clip {
  $id: string
  embedUrl: string
  videoUrl?: string
  thumbnailUrl?: string
  title?: string
  platform: 'youtube' | 'tiktok' | 'twitter' | 'instagram'
  views: number
  likes: number
  comments: number
  clicks: number
  engagement: number
  creatorUsername?: string
  creatorAvatar?: string
  projectName?: string
  projectId?: string
  projectLogo?: string
  campaignId?: string
  status: 'active' | 'pending' | 'rejected'
  submittedBy: string
  $createdAt: string
}

export interface ClipMetrics {
  views: number
  likes: number
  comments: number
  shares: number
  clicks: number
  engagement: number
  watchTime: number
  completionRate: number
}

export interface ClipFilters {
  platform?: 'youtube' | 'tiktok' | 'twitter' | 'instagram'
  status?: 'active' | 'pending' | 'rejected'
  sortBy?: 'views' | 'likes' | 'engagement' | 'recent'
  searchQuery?: string
  campaignId?: string
}
```

---

## 12. Testing Checklist

### Unit Tests
- [ ] ViewToggle component state changes
- [ ] ClipOverlay renders metrics correctly
- [ ] formatNumber utility works (1K, 1M)
- [ ] getPlatformIcon returns correct icons
- [ ] useViewMode hook detects mobile/desktop
- [ ] useClipSwipe calculates swipe direction

### Integration Tests
- [ ] ClipScrollView auto-plays videos
- [ ] Swipe gestures navigate clips
- [ ] Like button increments count
- [ ] Share button copies URL
- [ ] Buy button navigates correctly
- [ ] Grid view displays 4 columns

### E2E Tests
- [ ] Mobile scroll mode loads
- [ ] Desktop grid mode loads
- [ ] View toggle switches modes
- [ ] Video plays on scroll
- [ ] Metrics update in real-time
- [ ] Safe area insets work on iPhone

---

## Summary

This component specification provides:
- **7 core components** with full TypeScript interfaces
- **3 custom hooks** for swipe, auto-play, and view mode
- **Animation utilities** for heart burst and transitions
- **Utility functions** for platform detection and formatting
- **Complete styling** with CSS-in-JS and Tailwind
- **Testing checklist** for quality assurance

All components follow BTDemo design system with `#D1FD0A` lime accent, glass morphism, LED Dot font, and touch-first interaction patterns.

---

**File:** `CLIPS_COMPONENT_SPECS.md`
**Location:** `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\CLIPS_COMPONENT_SPECS.md`
