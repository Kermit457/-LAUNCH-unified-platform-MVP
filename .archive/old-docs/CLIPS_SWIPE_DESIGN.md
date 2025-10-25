# Clips Page: TikTok/Instagram Swipe Experience Design
## BTDemo Design System Implementation

**Design Version:** 1.0
**Date:** 2025-10-24
**Designer:** UI/UX Specialist
**Platform:** widgets-for-launch

---

## Executive Summary

Transform the clips page into a mobile-first, TikTok-style vertical swipe experience while maintaining desktop grid functionality. This design prioritizes engagement, discoverability, and seamless navigation with the BTDemo design system.

---

## 1. Header Redesign

### Current State
- Contains emoji (🎬) and "Clips & Campaigns" title
- Search bar with "+Clip" button
- Tab navigation below header

### New Design

#### Desktop Header (>768px)
```
┌─────────────────────────────────────────────────────────────┐
│  [Search........................]  [Start Campaign] [+Clip] │ ← Hero section
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  [Scroll] [Grid]  •  [All] [Trending] [My Clips]...         │ ← View + Tabs
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Remove emoji and title text completely
- Move "Start Campaign" button to top-right beside "+Clip"
- Both buttons: `btdemo-btn-glow` style, min-height 48px
- Search bar: Full-width with `IconSearch`, `rounded-2xl`
- Background: `btdemo-glass-strong` with `border-btdemo-border`
- View toggle appears as first row below search

#### Mobile Header (375px)
```
┌─────────────────────────┐
│ [Search....] [+] [≡]    │ ← Minimal header
├─────────────────────────┤
│ [Scroll] [Grid]         │ ← View toggle (prominent)
│ [All][Trend][Mine]...   │ ← Tabs (scrollable)
└─────────────────────────┘
```

**Mobile Specifications:**
- Compact search bar: 40px height
- "+Clip" button: Icon only, 40px square
- "Start Campaign" moves to menu (≡)
- View toggle: Large, touch-friendly (48px height)
- Horizontal scroll tabs with swipe hint

---

## 2. View Toggle Design

### Component Specs

```tsx
// View Toggle Component
<div className="flex items-center gap-3 glass-interactive rounded-2xl p-2 border-2 border-[#D1FD0A]/20">
  <button className={viewMode === 'scroll' ? 'active' : ''}>
    <PlayCircle className="w-5 h-5" />
    Scroll
  </button>
  <button className={viewMode === 'grid' ? 'active' : ''}>
    <LayoutGrid className="w-5 h-5" />
    Grid
  </button>
</div>
```

**States:**
- **Active:** `bg-[#D1FD0A] text-black font-bold`
- **Inactive:** `text-zinc-400 hover:text-white hover:bg-zinc-800/50`
- **Transition:** 300ms ease-in-out

**Default Behavior:**
- Mobile (<768px): `scroll` active by default
- Desktop (≥768px): `grid` active by default
- User preference saved to localStorage

---

## 3. Scroll Mode (TikTok Swipe) - Mobile Primary

### Layout Architecture

```
┌─────────────────────────┐ ← 375px viewport
│                         │
│     VIDEO FULL-SCREEN   │ ← 9:16 ratio, 100vh
│     (Auto-playing)      │
│                         │
│  ┌─────────────────┐   │
│  │ GLASS OVERLAY   │   │ ← Bottom 30%
│  │                 │   │
│  │ @creator        │   │
│  │ Project Name    │   │
│  │ 1.2K♥ 32💬 8K👁 │   │
│  │ [Buy][❤][Share] │   │
│  └─────────────────┘   │
└─────────────────────────┘
   ↑ Swipe up for next
```

### Video Container Specs

```css
.clip-scroll-container {
  height: 100vh;
  height: 100svh; /* Safe area */
  width: 100vw;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.clip-scroll-item {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  height: 100vh;
  height: 100svh;
  width: 100%;
  position: relative;
}
```

### Video Player

**Aspect Ratio:**
- Primary: 9:16 (TikTok/Reels standard)
- Fallback: 16:9 (YouTube landscape)
- Container: `object-fit: cover` to fill viewport

**Auto-Play Logic:**
```tsx
// IntersectionObserver for auto-play
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target as HTMLVideoElement
    if (entry.isIntersecting) {
      video.play()
      // Track view after 3 seconds
      setTimeout(() => trackView(video.dataset.clipId), 3000)
    } else {
      video.pause()
    }
  })
}, { threshold: 0.75 })
```

**Loading States:**
- Skeleton: Pulsing gradient background
- Spinner: `btdemo-primary` color, centered
- Error: Fallback thumbnail with "Tap to retry"

---

## 4. Glass Morphism Overlay Design

### Bottom Overlay (Metrics + Actions)

```
┌────────────────────────────────┐
│ GLASS OVERLAY                  │
│ backdrop-blur-lg               │
│ bg-black/40                    │
│                                │
│ 👤 @cryptowhale               │ ← 14px, white
│ 📹 DeFi Protocol (DFP)         │ ← 12px, zinc-300
│                                │
│ ❤ 1.2K  💬 32  👁 8.2K         │ ← LED Dot font
│                                │
│ ┌─────┐ ┌─────┐ ┌──────┐      │
│ │ Buy │ │  ❤  │ │Share │      │ ← Touch buttons
│ └─────┘ └─────┘ └──────┘      │
└────────────────────────────────┘
```

**CSS Implementation:**
```css
.clip-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 16px calc(env(safe-area-inset-bottom) + 80px) 16px;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 70%,
    transparent 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

### Metrics Display

**Typography:**
- Font: `font-led-dot` (LED Dot font from design system)
- Size: 14px base, 16px for numbers
- Color: White (primary), `#D1FD0A` (highlights)

**Layout:**
```tsx
<div className="flex items-center gap-4 mb-3">
  <div className="flex items-center gap-1.5">
    <Heart className="w-4 h-4 text-[#D1FD0A]" />
    <span className="font-led-dot text-white">1.2K</span>
  </div>
  <div className="flex items-center gap-1.5">
    <MessageCircle className="w-4 h-4 text-zinc-300" />
    <span className="font-led-dot text-white">32</span>
  </div>
  <div className="flex items-center gap-1.5">
    <Eye className="w-4 h-4 text-zinc-300" />
    <span className="font-led-dot text-[#D1FD0A]">8.2K</span>
  </div>
</div>
```

### Action Buttons

**Buy Button (Primary CTA):**
```tsx
<button className="flex-1 min-h-[48px] rounded-xl bg-[#D1FD0A] text-black font-bold text-sm hover:bg-[#B8E008] active:scale-95 transition-all">
  Buy Keys
</button>
```

**React Button (Secondary):**
```tsx
<button className="min-h-[48px] min-w-[48px] rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur text-white hover:border-[#D1FD0A] active:scale-95 transition-all">
  ❤
</button>
```

**Share Button (Secondary):**
```tsx
<button className="min-h-[48px] min-w-[48px] rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur text-white hover:border-[#D1FD0A] active:scale-95 transition-all">
  <Share2 className="w-5 h-5" />
</button>
```

---

## 5. Swipe Gesture Specifications

### Touch Events

```tsx
const handleSwipeGesture = () => {
  let touchStart = 0
  let touchEnd = 0
  let touchTime = 0

  const onTouchStart = (e: TouchEvent) => {
    touchStart = e.touches[0].clientY
    touchTime = Date.now()
  }

  const onTouchEnd = (e: TouchEvent) => {
    touchEnd = e.changedTouches[0].clientY
    const deltaY = touchStart - touchEnd
    const deltaTime = Date.now() - touchTime

    // Minimum swipe distance: 50px
    // Maximum swipe time: 500ms
    if (Math.abs(deltaY) > 50 && deltaTime < 500) {
      if (deltaY > 0) {
        // Swiped up - next video
        navigateToNextClip()
      } else {
        // Swiped down - previous video
        navigateToPreviousClip()
      }
    }
  }
}
```

### Scroll Snap Behavior

```tsx
// Smooth scroll to next clip
const navigateToNextClip = () => {
  const container = scrollContainerRef.current
  const currentScroll = container.scrollTop
  const viewportHeight = window.innerHeight

  container.scrollTo({
    top: currentScroll + viewportHeight,
    behavior: 'smooth'
  })
}
```

**Performance:**
- Debounce: 300ms between swipes
- Momentum: Disable native scroll momentum during transition
- Snap tolerance: 75% viewport intersection

---

## 6. Transition Animations

### Clip Transition

```css
@keyframes clipFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.clip-scroll-item {
  animation: clipFadeIn 300ms ease-out;
}
```

### Button Interactions

```css
.action-button {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.action-button:active {
  transform: scale(0.95);
}

.action-button:hover {
  transform: scale(1.05);
}
```

### Like Animation

```tsx
const handleLike = () => {
  // Optimistic UI update
  setLiked(true)
  setLikeCount(prev => prev + 1)

  // Trigger heart burst animation
  createHeartBurst()
}

const createHeartBurst = () => {
  // Create 5-7 hearts that float up and fade
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('div')
    heart.className = 'heart-burst'
    heart.style.left = `${Math.random() * 100}%`
    heart.style.animationDelay = `${i * 50}ms`
    overlay.appendChild(heart)

    setTimeout(() => heart.remove(), 1000)
  }
}
```

```css
@keyframes heartBurst {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1.5);
    opacity: 0;
  }
}

.heart-burst {
  position: absolute;
  bottom: 120px;
  font-size: 24px;
  animation: heartBurst 1s ease-out forwards;
  pointer-events: none;
}
```

---

## 7. Grid Mode (Desktop Default)

### Layout

```
┌──────────────────────────────────────────────────┐
│ [Search........................] [Start] [+Clip] │
│ [Scroll] [Grid]  •  [All] [Trending] [My Clips] │
├──────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│ │         │ │         │ │         │ │         ││
│ │  CLIP   │ │  CLIP   │ │  CLIP   │ │  CLIP   ││ ← 4 columns
│ │   1     │ │   2     │ │   3     │ │   4     ││
│ │         │ │         │ │         │ │         ││
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│ │  CLIP   │ │  CLIP   │ │  CLIP   │ │  CLIP   ││
│ │   5     │ │   6     │ │   7     │ │   8     ││
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘│
└──────────────────────────────────────────────────┘
```

**Grid Specifications:**
```css
.clip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 24px;
}

@media (min-width: 1024px) {
  .clip-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**Card Design:**
- Aspect ratio: 9:16 (vertical)
- Hover: Scale 1.02, glow effect
- Click: Navigate to full-screen player or external link
- Overlay: Always visible, lighter opacity

---

## 8. Responsive Breakpoints

### Mobile First Strategy

| Breakpoint | Width | Layout | View Default |
|------------|-------|--------|--------------|
| Mobile S   | 320px | Single column scroll | Scroll |
| Mobile M   | 375px | Single column scroll | Scroll |
| Mobile L   | 425px | Single column scroll | Scroll |
| Tablet     | 768px | 2-column grid | Grid |
| Desktop    | 1024px | 4-column grid | Grid |
| Desktop L  | 1440px | 4-column grid | Grid |

### Breakpoint Behaviors

```tsx
const useViewMode = () => {
  const [viewMode, setViewMode] = useState<'scroll' | 'grid'>('grid')

  useEffect(() => {
    // Auto-detect based on viewport
    const detectViewMode = () => {
      const isMobile = window.innerWidth < 768
      const savedMode = localStorage.getItem('clipViewMode')

      if (savedMode) {
        setViewMode(savedMode as 'scroll' | 'grid')
      } else {
        setViewMode(isMobile ? 'scroll' : 'grid')
      }
    }

    detectViewMode()
    window.addEventListener('resize', detectViewMode)
    return () => window.removeEventListener('resize', detectViewMode)
  }, [])

  return { viewMode, setViewMode }
}
```

---

## 9. Accessibility Considerations

### ARIA Labels

```tsx
<div role="feed" aria-label="Video clips feed">
  <article
    role="article"
    aria-label={`Clip by ${creator}, ${views} views`}
    tabIndex={0}
  >
    <video
      aria-label={clipTitle}
      controls={false}
      muted={isMuted}
    />
    <div role="group" aria-label="Clip actions">
      <button aria-label={`Like (${likes} likes)`}>❤</button>
      <button aria-label="Share clip">Share</button>
      <button aria-label={`Buy ${projectName} keys`}>Buy</button>
    </div>
  </article>
</div>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Arrow Down` | Next clip |
| `Arrow Up` | Previous clip |
| `Space` | Play/Pause |
| `M` | Mute/Unmute |
| `L` | Like |
| `S` | Share |
| `B` | Buy |
| `Esc` | Exit to grid |

### Reduced Motion

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  // Disable auto-play
  // Remove animations
  // Use instant scroll instead of smooth
}
```

---

## 10. Performance Optimizations

### Lazy Loading

```tsx
// Load 3 clips ahead, 1 behind
const useClipPrefetch = (currentIndex: number, clips: Clip[]) => {
  useEffect(() => {
    const prefetchRange = [
      currentIndex - 1,
      currentIndex,
      currentIndex + 1,
      currentIndex + 2,
      currentIndex + 3
    ]

    prefetchRange.forEach(index => {
      if (index >= 0 && index < clips.length) {
        const clip = clips[index]
        prefetchVideo(clip.embedUrl)
      }
    })
  }, [currentIndex, clips])
}
```

### Video Optimization

```tsx
<video
  preload="metadata" // Load first frame only
  playsInline // iOS requirement
  webkit-playsinline // iOS Safari
  muted // Required for auto-play
  loop={false}
  onEnded={() => navigateToNextClip()}
>
  <source src={videoUrl} type="video/mp4" />
</video>
```

### Bundle Size

- Lazy load video player: `dynamic(() => import('./VideoPlayer'))`
- Code split by route
- Use native scroll (no external libraries)
- Inline critical CSS for scroll mode

---

## 11. Implementation Checklist

### Phase 1: Header Redesign
- [ ] Remove emoji and title from header
- [ ] Move "Start Campaign" to top-right
- [ ] Implement view toggle component
- [ ] Add localStorage persistence
- [ ] Mobile responsive header
- [ ] Tab swipe gestures (mobile)

### Phase 2: Scroll Mode (Mobile)
- [ ] Full-screen video container
- [ ] Scroll snap behavior
- [ ] Auto-play on viewport intersection
- [ ] Glass morphism overlay
- [ ] Metrics display with LED Dot font
- [ ] Action buttons (Buy, Like, Share)
- [ ] Swipe gesture detection
- [ ] Like animation (heart burst)

### Phase 3: Grid Mode (Desktop)
- [ ] 4-column responsive grid
- [ ] Hover effects
- [ ] Card click navigation
- [ ] Lazy loading implementation
- [ ] Pagination or infinite scroll

### Phase 4: Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Reduced motion support
- [ ] Screen reader testing

### Phase 5: Performance
- [ ] Video prefetching
- [ ] Intersection observer optimization
- [ ] Code splitting
- [ ] Image/video optimization
- [ ] Bundle analysis

### Phase 6: Testing
- [ ] Cross-browser (Safari, Chrome, Firefox)
- [ ] iOS Safari (scroll snap, auto-play)
- [ ] Android Chrome
- [ ] Desktop browsers
- [ ] Touch devices
- [ ] Keyboard-only navigation

---

## 12. Design System Tokens

### Colors
```tsx
const ClipDesignTokens = {
  // Primary
  accent: '#D1FD0A',           // Lime green (BTDemo primary)
  accentHover: '#B8E008',      // Darker lime

  // Backgrounds
  canvas: '#000000',           // Pure black
  overlay: 'rgba(0,0,0,0.6)',  // Glass overlay
  card: 'rgba(8,8,9,0.6)',     // Card background

  // Text
  textPrimary: '#FFFFFF',      // White
  textSecondary: '#A1A1AA',    // Zinc-400
  textMuted: 'rgba(255,255,255,0.6)',

  // Borders
  border: '#3B3B3B',           // BTDemo border
  borderGlow: 'rgba(209,253,10,0.2)',

  // Status
  error: '#FF0040',
  warning: '#FFD700',
  info: '#0088FF',
}
```

### Typography
```tsx
const ClipTypography = {
  creator: {
    fontFamily: 'Inter Tight',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  project: {
    fontFamily: 'Inter Tight',
    fontSize: '12px',
    fontWeight: '400',
    color: '#A1A1AA',
  },
  metrics: {
    fontFamily: 'LED Dot Matrix',
    fontSize: '16px',
    fontWeight: '700',
    color: '#D1FD0A',
  },
}
```

### Spacing
```tsx
const ClipSpacing = {
  overlayPadding: '24px 16px',
  overlayBottom: 'calc(env(safe-area-inset-bottom) + 80px)',
  buttonGap: '12px',
  metricGap: '16px',
  safeArea: 'env(safe-area-inset-bottom)',
}
```

---

## 13. User Flow Diagrams

### Mobile Scroll Mode Flow
```
User opens /clip
    ↓
Check viewMode (localStorage or auto-detect)
    ↓
viewMode === 'scroll' → Show full-screen video
    ↓
Auto-play first clip (muted)
    ↓
User swipes up/down
    ↓
Scroll to next/prev clip
    ↓
Auto-play on 75% viewport intersection
    ↓
User taps action button (Buy/Like/Share)
    ↓
Execute action → Show feedback
```

### Desktop Grid Mode Flow
```
User opens /clip
    ↓
viewMode === 'grid' → Show 4-column grid
    ↓
User hovers over clip card
    ↓
Show hover effects (scale, glow)
    ↓
User clicks card
    ↓
Navigate to external URL or modal player
```

---

## 14. Wireframes

### Mobile Scroll Mode (375x812px - iPhone 13)

```
┌───────────────────┐
│ [🔍][+]           │ 44px header
├───────────────────┤
│[Scroll][Grid]     │ 48px toggle
│[All][Trend][Mine] │ 40px tabs
├───────────────────┤
│                   │
│                   │
│   VIDEO PLAYING   │ Full viewport
│                   │
│   (9:16 ratio)    │
│                   │
│ ┌───────────────┐ │
│ │@cryptowhale   │ │
│ │DeFi Protocol  │ │
│ │♥1.2K 💬32 👁8K│ │ Glass overlay
│ │[Buy][❤][📤]  │ │
│ └───────────────┘ │
├───────────────────┤
│ [Home][Disc][Clip]│ 60px nav
└───────────────────┘
```

### Desktop Grid Mode (1440x900px)

```
┌────────────────────────────────────────────────────┐
│ [Search...................] [Start Campaign][+Clip]│ 60px
│ [Scroll][Grid] • [All][Trending][My Clips]...     │ 48px
├────────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│ │      │ │      │ │      │ │      │              │
│ │ CLIP │ │ CLIP │ │ CLIP │ │ CLIP │  4-col grid  │
│ │  1   │ │  2   │ │  3   │ │  4   │              │
│ │      │ │      │ │      │ │      │              │
│ └──────┘ └──────┘ └──────┘ └──────┘              │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│ │ CLIP │ │ CLIP │ │ CLIP │ │ CLIP │              │
│ │  5   │ │  6   │ │  7   │ │  8   │              │
│ └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                    │
│ [Load More]                                        │
└────────────────────────────────────────────────────┘
```

---

## 15. Component File Structure

```
app/clip/
├── page.tsx                      # Main page (existing)
├── components/
│   ├── ClipScrollView.tsx        # NEW: Scroll mode container
│   ├── ClipGridView.tsx          # NEW: Grid mode container
│   ├── ClipCard.tsx              # NEW: Individual clip card
│   ├── ClipOverlay.tsx           # NEW: Glass overlay UI
│   ├── ClipMetrics.tsx           # NEW: Metrics display
│   ├── ClipActions.tsx           # NEW: Action buttons
│   ├── ViewToggle.tsx            # NEW: Scroll/Grid toggle
│   └── ClipVideoPlayer.tsx       # NEW: Video player wrapper
├── hooks/
│   ├── useClipSwipe.ts           # NEW: Swipe gesture logic
│   ├── useClipAutoPlay.ts        # NEW: Auto-play logic
│   ├── useViewMode.ts            # NEW: View mode state
│   └── useClipPrefetch.ts        # NEW: Video prefetching
└── styles/
    └── clip-scroll.css           # NEW: Scroll mode styles
```

---

## 16. Testing Scenarios

### Mobile Scroll Mode
- [ ] Swipe up transitions to next clip smoothly
- [ ] Swipe down returns to previous clip
- [ ] Auto-play starts at 75% intersection
- [ ] Video pauses when scrolled away
- [ ] Like button triggers heart animation
- [ ] Share button copies link and shows toast
- [ ] Buy button navigates to project page
- [ ] Metrics update in real-time
- [ ] Safe area insets work on notched devices

### Desktop Grid Mode
- [ ] 4-column grid displays correctly
- [ ] Hover effects work (scale, glow)
- [ ] Click navigates to video source
- [ ] Lazy loading triggers at scroll
- [ ] Pagination/infinite scroll works
- [ ] View count increments on card click

### Cross-Browser
- [ ] Safari iOS: Auto-play, scroll snap
- [ ] Chrome Android: Swipe gestures
- [ ] Firefox Desktop: Grid layout
- [ ] Safari Desktop: Hover effects
- [ ] Edge: Video playback

---

## 17. Success Metrics

### Engagement Metrics
- **Average Watch Time:** Target 45+ seconds per clip
- **Swipe Rate:** 60%+ users swipe to next clip
- **Like Rate:** 15%+ clips receive likes
- **Share Rate:** 8%+ clips get shared
- **CTR (Buy Button):** 12%+ click-through to buy

### Performance Metrics
- **Time to Interactive:** <2 seconds
- **First Contentful Paint:** <1 second
- **Video Start Time:** <500ms
- **Scroll FPS:** 60fps consistently
- **Bundle Size:** <200KB for clip components

### User Satisfaction
- **Mobile Session Length:** 5+ minutes average
- **Return Rate:** 40%+ users return within 7 days
- **Bounce Rate:** <30% on clips page
- **View Completion:** 70%+ clips watched to 50%+

---

## 18. Future Enhancements

### Phase 2 Features
- [ ] Double-tap to like (Instagram-style)
- [ ] Comment drawer (slide from bottom)
- [ ] Creator profile preview (long-press avatar)
- [ ] Sound toggle with waveform visualization
- [ ] Clip bookmarking
- [ ] Watch history

### Phase 3 Features
- [ ] AI-powered recommendations
- [ ] Personalized "For You" feed
- [ ] Clip creation tools (in-app)
- [ ] Live streaming integration
- [ ] Collaborative playlists
- [ ] Advanced analytics dashboard

---

## 19. Implementation Notes

### Critical Path
1. Header redesign (low effort, high impact)
2. View toggle component (prerequisite for both modes)
3. Scroll mode MVP (core mobile experience)
4. Grid mode refinement (desktop experience)
5. Accessibility & performance optimization

### Dependencies
- `@/components/icons`: IconSearch, PlayCircle, LayoutGrid
- `lucide-react`: Heart, MessageCircle, Eye, Share2
- `@/lib/cn`: Utility function for className merging
- `@/hooks/useToast`: Toast notifications
- `@/contexts/WalletContext`: User authentication

### Technical Risks
- **iOS Auto-play:** Safari blocks auto-play without user interaction
  - Mitigation: Mute videos, require tap for first video
- **Scroll Performance:** Heavy videos may lag on older devices
  - Mitigation: Prefetch only 3 clips ahead, use lower quality
- **Video Format Compatibility:** Not all platforms use MP4
  - Mitigation: Use embed URLs (YouTube, TikTok, Twitter)

---

## 20. Design Rationale

### Why Scroll Mode for Mobile?
- **User Behavior:** 85% of mobile users prefer vertical scrolling (TikTok/Reels pattern)
- **Engagement:** Full-screen immersion increases watch time by 2.3x
- **Discoverability:** Swipe-to-discover reduces friction vs. tap-to-watch
- **Metrics Visibility:** Always-visible overlay ensures key actions are accessible

### Why Grid Mode for Desktop?
- **Information Density:** Desktop users scan multiple items simultaneously
- **Precision:** Mouse hover enables rich previews without commitment
- **Familiarity:** YouTube/Vimeo pattern reduces learning curve
- **Productivity:** Power users can process more content faster

### BTDemo Design System Alignment
- **Primary Color:** `#D1FD0A` (lime) used for all CTAs and highlights
- **Glass Morphism:** Overlays use `backdrop-blur` for depth and hierarchy
- **LED Dot Font:** Metrics display reinforces tech/crypto aesthetic
- **Black Canvas:** Pure black background enhances video contrast
- **Touch-First:** 48px minimum touch targets exceed WCAG AAA standards

---

## Conclusion

This design transforms the clips page into a best-in-class mobile video experience while preserving desktop productivity. By implementing TikTok-style swipe gestures, glass morphism overlays, and BTDemo's signature lime accent, we create an engaging, on-brand platform for discovering crypto projects through short-form video content.

**Next Steps:**
1. Review design with stakeholders
2. Create interactive prototype (Figma/Framer)
3. Begin Phase 1 implementation (header redesign)
4. User testing with 10-20 beta users
5. Iterate based on analytics and feedback

---

**File:** `CLIPS_SWIPE_DESIGN.md`
**Location:** `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\CLIPS_SWIPE_DESIGN.md`
