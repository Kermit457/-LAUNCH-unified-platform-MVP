# Campaign Detail Page Redesign Proposal
**BTDemo Design System | Mobile-First | User-Centered**

---

## Executive Summary

This proposal outlines a comprehensive redesign of the campaign detail page (`app/campaign/[id]/page.tsx`) with a focus on mobile-first UX, intuitive information hierarchy, and seamless integration with the BTDemo design system (lime green #D1FD0A, glass morphism, LED Dot numbers).

**Primary Goals:**
1. **Mobile Optimization:** Design for 375px width first, scale gracefully to desktop
2. **Clear Hierarchy:** Campaign info → Rules → Action → Engagement
3. **Reduced Cognitive Load:** Progressive disclosure, scannable sections
4. **Increased Engagement:** Quick-join flow, prominent submission CTA
5. **Social Proof:** Real-time stats, leaderboard, live activity feed

---

## Current Issues Identified

### Critical UX Problems

1. **Information Overload (Mobile)**
   - Hero section cramped with 4 stat cards in 2x2 grid
   - Campaign rules hidden below fold
   - No clear visual hierarchy between sections
   - Fixed overlay covers entire screen - no context of parent page

2. **Poor Mobile Touch Targets**
   - Back button too small (ArrowLeft icon only)
   - Stats cards too small to read (12px on mobile)
   - Join button spans full width but other actions don't
   - Social links in sidebar are text links (hard to tap)

3. **Confusing Flow**
   - User must "join" before seeing upload form
   - Upload form appears conditionally (state-based)
   - No indication of what happens after joining
   - Submission review section mixed with public content

4. **Weak Visual Feedback**
   - Progress bar is static (no animation)
   - No loading states for submissions
   - Success/error messages are basic text blocks
   - No micro-interactions on buttons

5. **Inconsistent Design System**
   - Uses #FFD700 (gold) for spinner instead of #D1FD0A
   - Border opacity inconsistent (20%, 30%, 40%, 60%)
   - Some buttons use hover:scale-105, others don't
   - Missing glass-premium class on some containers

6. **Desktop-Only Features**
   - Escrow card has no mobile optimization
   - Sidebar layout breaks on narrow screens
   - Table-like structures (top clips) not responsive

---

## Proposed Layout Structure

### Mobile Layout (375px - 768px)

```
┌─────────────────────────────────┐
│  [Back] Campaign Title     [•••]│ ← Sticky header
├─────────────────────────────────┤
│  🎯 LIVE    Prize: $2,000       │ ← Compact hero
│  23 Creators · 45 Views         │
│  ██████████░░░░░░░ 40% paid     │ ← Progress bar
├─────────────────────────────────┤
│  [Join Campaign] ← Lime CTA     │ ← Primary action
├─────────────────────────────────┤
│  📋 Quick Rules                 │ ← Collapsible
│  • YouTube/TikTok/Twitch        │
│  • 30-180s video                │
│  • $20/1k views                 │
│  [View Full Rules ↓]            │
├─────────────────────────────────┤
│  💰 Your Earnings: $0           │ ← Personalized
│  🏆 Top Creator: @creator1      │
│  ⏰ 5 days left                 │
├─────────────────────────────────┤
│  🎬 Submit Your Clip            │ ← If joined
│  Platform: [Dropdown]           │
│  Video URL: [Input]             │
│  [Submit]                       │
├─────────────────────────────────┤
│  🔥 Leaderboard (Top 5)         │ ← Horizontal scroll
│  [Card] [Card] [Card] ...       │
├─────────────────────────────────┤
│  📦 Creator Kit                 │ ← Collapsible
│  🔗 Social Links                │
├─────────────────────────────────┤
│  📊 Recent Submissions (Owner)  │ ← Owner only
└─────────────────────────────────┘
```

### Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back to Campaigns]              Campaign Detail      [⋮] │
├────────────────────────────────┬─────────────────────────────┤
│                                │  💰 Earnings                │
│  🎯 Clip $COIN Launch Video    │  $20/1k views               │
│  📹 Campaign · LIVE            │  USDC                       │
│                                │  Example: 10k = $200        │
│  Campaign by @creator          │─────────────────────────────┤
│  Created 5 days ago            │  ⏰ Timeline                │
│                                │  5 days left                │
│  $2,000 Prize Pool             │─────────────────────────────┤
│  $400 / $2,000 paid out (40%)  │  🏆 Leaderboard             │
│  ██████████░░░░░░░░░            │  #1 @creator1    $300       │
│                                │  #2 @creator2    $240       │
│  [Join Campaign - Full Width]  │  #3 @creator3    $170       │
│                                │  [View All →]               │
├────────────────────────────────┤─────────────────────────────┤
│  📋 Campaign Rules             │  📦 Assets & Links          │
│  Platforms: YT, TikTok, Twitch │  🔗 Twitter                 │
│  Length: 30-180s               │  🔗 Discord                 │
│  Min views: 1,000              │  🔗 Telegram                │
│  Payout: $20/1k views          │  📂 Creator Kit Download    │
├────────────────────────────────┴─────────────────────────────┤
│  🎬 Submit Your Clip (if joined)                            │
│  Platform: [Dropdown]  Video URL: [Input]  [Submit]         │
├──────────────────────────────────────────────────────────────┤
│  🔥 Top Performing Clips                                    │
│  [Clip Card] [Clip Card] [Clip Card]                        │
└──────────────────────────────────────────────────────────────┘
```

---

## Component-by-Component Breakdown

### 1. Sticky Header (Mobile)

**Current:** Back button + no context
**Proposed:**
```tsx
<div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-[#D1FD0A]/20">
  <div className="flex items-center justify-between px-3 py-2">
    <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800">
      <ArrowLeft className="w-5 h-5 text-[#D1FD0A]" />
      <span className="text-sm text-white font-medium">Campaigns</span>
    </button>
    <button className="p-2 rounded-lg hover:bg-zinc-800">
      <MoreVertical className="w-5 h-5 text-zinc-400" />
    </button>
  </div>
  {/* Progress indicator */}
  <div className="h-1 bg-zinc-900">
    <div className="h-full bg-[#D1FD0A] transition-all" style={{ width: '40%' }} />
  </div>
</div>
```

**Design Rationale:**
- Sticky header provides context when scrolling
- Progress bar shows completion at a glance
- More menu for share/report actions
- Lime accent on back button (BTDemo system)

---

### 2. Compact Hero Section (Mobile)

**Current:** 2x2 grid of stat cards (too cramped)
**Proposed:**
```tsx
<div className="p-3 space-y-3">
  {/* Title + Status */}
  <div>
    <div className="flex items-center gap-2 mb-1">
      <span className="px-2 py-1 rounded-md bg-[#D1FD0A]/20 border border-[#D1FD0A]/40 text-[#D1FD0A] text-xs font-bold">
        🎯 LIVE
      </span>
      <span className="text-xs text-zinc-400">Campaign</span>
    </div>
    <h1 className="text-xl font-bold text-white leading-tight">
      Clip $COIN Launch Video
    </h1>
  </div>

  {/* Key Stats (2-column compact) */}
  <div className="grid grid-cols-2 gap-2">
    <div className="glass-premium p-2 rounded-lg border border-[#D1FD0A]/20">
      <div className="text-[10px] text-zinc-400 uppercase">Prize</div>
      <div className="text-lg font-led-dot text-white">$2,000</div>
    </div>
    <div className="glass-premium p-2 rounded-lg border border-[#D1FD0A]/20">
      <div className="text-[10px] text-zinc-400 uppercase">Rate</div>
      <div className="text-lg font-led-dot text-white">$20/1k</div>
    </div>
  </div>

  {/* Secondary Stats (inline) */}
  <div className="flex items-center gap-4 text-xs text-zinc-400">
    <span className="flex items-center gap-1">
      <Users className="w-4 h-4" />
      <span className="font-led-dot">23</span> creators
    </span>
    <span className="flex items-center gap-1">
      <Eye className="w-4 h-4" />
      <span className="font-led-dot">45</span> views
    </span>
  </div>

  {/* Progress Bar */}
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-zinc-400">
        <span className="font-led-dot text-white">$400</span> of{' '}
        <span className="font-led-dot text-white">$2,000</span> paid
      </span>
      <span className="font-led-dot text-[#D1FD0A]">40%</span>
    </div>
    <div className="h-2 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#D1FD0A] to-[#B8E309] transition-all duration-500"
        style={{ width: '40%' }}
      />
    </div>
  </div>
</div>
```

**Design Rationale:**
- Reduced from 4 stat cards to 2 (most important: Prize + Rate)
- Inline secondary stats save vertical space
- Animated gradient progress bar (BTDemo style)
- Larger touch targets (48px+ height)

---

### 3. Primary Action CTA

**Current:** Full-width button, changes to success message when clicked
**Proposed:**
```tsx
<div className="px-3 pb-3">
  {!hasJoined ? (
    <button
      onClick={() => setHasJoined(true)}
      className="w-full h-14 rounded-xl bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
    >
      <Video className="w-5 h-5" />
      Join Campaign
    </button>
  ) : (
    <div className="p-4 rounded-xl bg-[#D1FD0A]/10 border-2 border-[#D1FD0A]/40 text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <CheckCircle className="w-5 h-5 text-[#D1FD0A]" />
        <span className="text-[#D1FD0A] font-bold">You're in!</span>
      </div>
      <p className="text-xs text-zinc-400">Submit your clip below to start earning</p>
    </div>
  )}
</div>
```

**Design Rationale:**
- 56px height for easy thumb reach
- Hover scale + active scale for tactile feedback
- Success state shows clear next step
- Icon reinforces action type

---

### 4. Collapsible Rules Section (Mobile)

**Current:** Always expanded, takes up screen space
**Proposed:**
```tsx
<div className="border-t border-zinc-800">
  <button
    onClick={() => setRulesExpanded(!rulesExpanded)}
    className="w-full px-3 py-4 flex items-center justify-between hover:bg-zinc-900/50"
  >
    <div className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-[#D1FD0A]" />
      <span className="font-bold text-white">Campaign Rules</span>
    </div>
    <ChevronDown
      className={cn(
        "w-5 h-5 text-zinc-400 transition-transform",
        rulesExpanded && "rotate-180"
      )}
    />
  </button>

  {rulesExpanded && (
    <div className="px-3 pb-4 space-y-3">
      {/* Quick Rules (Scannable) */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-[#D1FD0A] mt-0.5" />
          <div>
            <div className="text-sm text-white font-medium">YouTube, TikTok, Twitch</div>
            <div className="text-xs text-zinc-500">Accepted platforms</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-[#D1FD0A] mt-0.5" />
          <div>
            <div className="text-sm text-white font-medium">30-180 seconds</div>
            <div className="text-xs text-zinc-500">Video length requirement</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-[#D1FD0A] mt-0.5" />
          <div>
            <div className="text-sm text-white font-medium">1,000 minimum views</div>
            <div className="text-xs text-zinc-500">To qualify for payout</div>
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
        <p className="text-sm text-zinc-400 leading-relaxed">
          {campaign.description}
        </p>
      </div>
    </div>
  )}
</div>
```

**Design Rationale:**
- Collapsed by default (reduce initial scroll)
- Quick scannable list with check icons
- Full description in subtle container
- Smooth accordion animation

---

### 5. Submission Form (Inline, Always Visible if Joined)

**Current:** Hidden until joined, then appears as large section
**Proposed:**
```tsx
{hasJoined && (
  <div className="border-t border-zinc-800 p-3 space-y-3">
    <div className="flex items-center gap-2">
      <Upload className="w-5 h-5 text-[#D1FD0A]" />
      <h3 className="font-bold text-white">Submit Your Clip</h3>
    </div>

    {/* Compact Form */}
    <div className="space-y-2">
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="w-full h-12 px-3 rounded-lg glass-premium border border-[#D1FD0A]/20 text-white text-sm"
      >
        <option value="">Select platform</option>
        <option value="youtube">YouTube</option>
        <option value="tiktok">TikTok</option>
        <option value="twitch">Twitch</option>
      </select>

      <input
        type="url"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://youtube.com/watch?v=..."
        className="w-full h-12 px-3 rounded-lg glass-premium border border-[#D1FD0A]/20 text-white text-sm placeholder:text-zinc-500"
      />

      <button
        onClick={handleSubmit}
        disabled={!platform || !videoUrl || submitting}
        className="w-full h-12 rounded-lg bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Submitting...
          </span>
        ) : (
          'Submit Clip'
        )}
      </button>
    </div>

    {/* Success Toast */}
    {submitSuccess && (
      <div className="p-3 rounded-lg bg-[#D1FD0A]/20 border border-[#D1FD0A]/40 flex items-start gap-2">
        <CheckCircle className="w-5 h-5 text-[#D1FD0A] flex-shrink-0" />
        <div>
          <div className="text-sm font-bold text-[#D1FD0A]">Submitted!</div>
          <div className="text-xs text-zinc-400">Your clip is under review</div>
        </div>
      </div>
    )}
  </div>
)}
```

**Design Rationale:**
- Removed optional description field (reduce friction)
- Compact 2-field form
- Loading state with spinner
- Inline success message (no modal)
- Form remains visible for multiple submissions

---

### 6. Horizontal Scroll Leaderboard (Mobile)

**Current:** Vertical list (takes up space)
**Proposed:**
```tsx
<div className="border-t border-zinc-800 py-3">
  <div className="px-3 mb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Trophy className="w-5 h-5 text-[#D1FD0A]" />
      <h3 className="font-bold text-white">Top Creators</h3>
    </div>
    <button className="text-xs text-[#D1FD0A] font-bold">View All →</button>
  </div>

  {/* Horizontal Scroll Container */}
  <div className="overflow-x-auto scrollbar-hide pl-3">
    <div className="flex gap-2 pb-2">
      {topCreators.map((creator, idx) => (
        <div
          key={creator.id}
          className="flex-shrink-0 w-32 p-3 rounded-lg glass-premium border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/40 transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-led-dot text-zinc-500">#{idx + 1}</span>
          </div>
          <div className="text-sm font-medium text-white truncate">
            {creator.name}
          </div>
          <div className="text-xs text-zinc-400 font-led-dot">
            {creator.views.toLocaleString()} views
          </div>
          <div className="mt-2 text-lg font-bold font-led-dot text-[#D1FD0A]">
            ${creator.earned}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

**Design Rationale:**
- Saves vertical space (no scrolling)
- Touch-friendly swipe gesture
- Card-based design (BTDemo style)
- "View All" for full leaderboard page

---

### 7. Collapsible Assets Section (Mobile)

**Current:** Always visible sidebar (desktop-only)
**Proposed:**
```tsx
<div className="border-t border-zinc-800">
  <button
    onClick={() => setAssetsExpanded(!assetsExpanded)}
    className="w-full px-3 py-4 flex items-center justify-between hover:bg-zinc-900/50"
  >
    <div className="flex items-center gap-2">
      <Package className="w-5 h-5 text-[#D1FD0A]" />
      <span className="font-bold text-white">Creator Kit & Links</span>
    </div>
    <ChevronDown
      className={cn(
        "w-5 h-5 text-zinc-400 transition-transform",
        assetsExpanded && "rotate-180"
      )}
    />
  </button>

  {assetsExpanded && (
    <div className="px-3 pb-4 space-y-3">
      {/* Creator Kit Download */}
      <a
        href={campaign.driveLink}
        target="_blank"
        className="flex items-center gap-3 p-3 rounded-lg bg-[#D1FD0A]/10 border-2 border-[#D1FD0A]/30 hover:bg-[#D1FD0A]/20 active:scale-95 transition-all"
      >
        <Download className="w-5 h-5 text-[#D1FD0A]" />
        <div className="flex-1">
          <div className="text-sm font-bold text-[#D1FD0A]">Download Creator Kit</div>
          <div className="text-xs text-zinc-400">Logos, guidelines & assets</div>
        </div>
      </a>

      {/* Social Links Grid */}
      <div className="grid grid-cols-2 gap-2">
        {campaign.socialLinks?.map((link, idx) => (
          <a
            key={idx}
            href={link}
            target="_blank"
            className="flex items-center gap-2 p-2 rounded-lg glass-premium border border-[#D1FD0A]/20 hover:border-[#D1FD0A]/40 transition-all"
          >
            <Globe className="w-4 h-4 text-[#D1FD0A]" />
            <span className="text-xs text-white truncate">{getLinkLabel(link)}</span>
          </a>
        ))}
      </div>
    </div>
  )}
</div>
```

**Design Rationale:**
- Collapsed by default (secondary info)
- Download CTA stands out (BTDemo green)
- Social links in 2-column grid (mobile-friendly)
- Touch-optimized (48px+ height)

---

## Mobile-Specific Optimizations

### 1. Touch Target Sizing
- **Minimum:** 44px x 44px (iOS guidelines)
- **Preferred:** 48px x 48px (Android guidelines)
- **Implementation:** All buttons, links, form fields

### 2. Scrolling Performance
```tsx
// Enable hardware acceleration
<div className="transform-gpu will-change-scroll overflow-y-auto">
  {/* Content */}
</div>

// Smooth scroll container
<div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide">
  <div className="flex snap-start">
    {/* Cards */}
  </div>
</div>
```

### 3. Loading States
```tsx
// Skeleton loader for initial load
{loading && (
  <div className="space-y-3 p-3">
    <div className="h-20 rounded-lg glass-premium animate-pulse" />
    <div className="h-40 rounded-lg glass-premium animate-pulse" />
    <div className="h-60 rounded-lg glass-premium animate-pulse" />
  </div>
)}

// Shimmer effect for BTDemo style
<div className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
</div>
```

### 4. Bottom Sheet Modals (Instead of Full-Screen Overlays)
```tsx
// Mobile: Bottom sheet (30% screen)
// Desktop: Centered modal

<Sheet open={showSubmissionModal} onOpenChange={setShowSubmissionModal}>
  <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
    {/* Content */}
  </SheetContent>
</Sheet>
```

### 5. Pull-to-Refresh
```tsx
const [refreshing, setRefreshing] = useState(false)

const handleRefresh = async () => {
  setRefreshing(true)
  await fetchCampaign()
  setRefreshing(false)
}

// Add pull-to-refresh indicator
{refreshing && (
  <div className="fixed top-16 left-0 right-0 flex justify-center z-50">
    <div className="px-4 py-2 rounded-full bg-[#D1FD0A] text-black font-bold text-sm">
      Refreshing...
    </div>
  </div>
)}
```

---

## Interactive Elements & Micro-Interactions

### 1. Button States (BTDemo Style)
```tsx
// Idle → Hover → Active → Loading → Success/Error

<button className="
  bg-[#D1FD0A]
  hover:bg-[#B8E309]
  hover:scale-105
  active:scale-95
  disabled:opacity-50
  transition-all duration-200
  shadow-lg shadow-[#D1FD0A]/20
  hover:shadow-xl hover:shadow-[#D1FD0A]/30
">
  Action
</button>
```

### 2. Progress Bar Animation
```tsx
// Animate on mount
useEffect(() => {
  setTimeout(() => setAnimatedProgress(actualProgress), 300)
}, [actualProgress])

<div
  className="h-full bg-gradient-to-r from-[#D1FD0A] to-[#B8E309] transition-all duration-700 ease-out"
  style={{ width: `${animatedProgress}%` }}
/>
```

### 3. Number Count-Up Effect
```tsx
// Use react-countup for LED Dot numbers
import CountUp from 'react-countup'

<span className="font-led-dot text-2xl text-white">
  $<CountUp end={2000} duration={2} separator="," />
</span>
```

### 4. Skeleton Loading (Card Shimmer)
```tsx
<div className="glass-premium p-4 rounded-xl border border-[#D1FD0A]/20 relative overflow-hidden">
  {/* Shimmer overlay */}
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-[#D1FD0A]/10 to-transparent" />

  {/* Skeleton content */}
  <div className="h-4 bg-zinc-800 rounded mb-2" />
  <div className="h-6 bg-zinc-800 rounded w-3/4" />
</div>

// Tailwind config
module.exports = {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
}
```

### 5. Toast Notifications (Instead of Alert Blocks)
```tsx
import { toast } from 'sonner'

// Success
toast.success('Clip submitted!', {
  description: 'Your clip is under review',
  duration: 3000,
  icon: <CheckCircle className="w-5 h-5 text-[#D1FD0A]" />
})

// Error
toast.error('Submission failed', {
  description: 'Please check your video URL',
  duration: 4000,
})
```

---

## Design System Integration

### BTDemo Colors
```tsx
const colors = {
  primary: '#D1FD0A',      // Lime green
  primaryHover: '#B8E309', // Darker lime
  secondary: '#FFD700',    // Gold (accent only)

  // Glass morphism
  glass: {
    bg: 'rgba(0, 0, 0, 0.4)',
    border: 'rgba(209, 253, 10, 0.2)',
    hover: 'rgba(209, 253, 10, 0.1)',
  },

  // Status colors
  live: '#D1FD0A',
  active: '#00FF88',
  frozen: '#FF8800',
  ended: '#666666',
}
```

### Typography
```tsx
// Headings: Bold, white
<h1 className="text-2xl md:text-3xl font-bold text-white">

// Body: Regular, zinc-400
<p className="text-sm text-zinc-400">

// Numbers: LED Dot font, white
<span className="font-led-dot text-xl text-white">2,000</span>

// Labels: Uppercase, zinc-500, tracking-wider
<label className="text-xs text-zinc-500 uppercase tracking-wider">
```

### Borders & Opacity
```tsx
// Standard opacity levels
border-[#D1FD0A]/20  // Subtle (default)
border-[#D1FD0A]/30  // Hover state
border-[#D1FD0A]/40  // Active/Selected
border-[#D1FD0A]/60  // Emphasis

// Background opacity
bg-[#D1FD0A]/10      // Subtle background
bg-[#D1FD0A]/20      // Hover background
```

### Spacing
```tsx
// Mobile: Compact spacing
p-3  // Padding
gap-2  // Gap between elements
space-y-3  // Vertical spacing

// Desktop: More breathing room
md:p-6
md:gap-4
md:space-y-6
```

---

## Accessibility Annotations

### 1. Keyboard Navigation
```tsx
// All interactive elements must be keyboard accessible
<button
  className="..."
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction()
    }
  }}
>
```

### 2. Screen Reader Labels
```tsx
// Aria labels for icons
<button aria-label="Join campaign">
  <Video className="w-5 h-5" />
</button>

// Aria live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {submitSuccess && <p>Clip submitted successfully</p>}
</div>
```

### 3. Focus Indicators
```tsx
// Visible focus ring (BTDemo style)
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-[#D1FD0A]
  focus:ring-offset-2
  focus:ring-offset-black
">
```

### 4. Color Contrast
- **Primary text (white) on black:** 21:1 (AAA)
- **Secondary text (zinc-400) on black:** 7:1 (AA)
- **Lime (#D1FD0A) on black:** 16:1 (AAA)
- **Lime background with black text:** 14:1 (AAA)

### 5. Motion Preferences
```tsx
// Respect prefers-reduced-motion
<div className="
  transition-all
  motion-reduce:transition-none
  motion-reduce:animate-none
">
```

---

## Implementation Priority

### Phase 1: Critical Mobile UX (Week 1)
1. Sticky header with progress indicator
2. Compact hero section (2 stat cards)
3. Primary CTA redesign
4. Collapsible sections (rules, assets)
5. Inline submission form

### Phase 2: Enhanced Interactions (Week 2)
1. Horizontal scroll leaderboard
2. Loading states & skeletons
3. Toast notifications
4. Button micro-interactions
5. Pull-to-refresh

### Phase 3: Performance & Polish (Week 3)
1. Image lazy loading
2. Scroll performance optimization
3. Accessibility audit & fixes
4. Animation refinement
5. Cross-browser testing

### Phase 4: Desktop Optimization (Week 4)
1. Responsive layout breakpoints
2. Sidebar layout for desktop
3. Hover states for mouse users
4. Keyboard shortcuts
5. Print styles

---

## Success Metrics

### User Engagement
- **Join Rate:** % of visitors who join campaign
- **Submission Rate:** % of joined users who submit
- **Time to First Action:** How quickly users join/submit
- **Scroll Depth:** How far users scroll before taking action

### Performance
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Cumulative Layout Shift:** < 0.1
- **Mobile PageSpeed Score:** > 90

### Usability
- **Task Completion Rate:** > 85%
- **Error Rate:** < 5%
- **Mobile vs Desktop Engagement:** Within 10%
- **User Satisfaction Score:** > 4.5/5

---

## Technical Notes

### File Structure
```
app/campaign/[id]/
├── page.tsx                 # Main page component
├── components/
│   ├── CampaignHero.tsx     # Hero section
│   ├── SubmissionForm.tsx   # Inline form
│   ├── RulesAccordion.tsx   # Collapsible rules
│   ├── LeaderboardScroll.tsx # Horizontal scroll
│   └── AssetsDrawer.tsx     # Collapsible assets
└── hooks/
    ├── useCampaign.tsx      # Data fetching
    └── useSubmission.tsx    # Form handling
```

### Dependencies
```json
{
  "react-countup": "^6.5.0",       // Number animations
  "framer-motion": "^10.16.0",     // Advanced animations
  "react-intersection-observer": "^9.5.0", // Lazy loading
  "sonner": "^1.2.0",              // Toast notifications
  "@radix-ui/react-accordion": "^1.1.0" // Accessible accordions
}
```

### Performance Optimizations
```tsx
// 1. Code splitting
const LeaderboardScroll = dynamic(() => import('./components/LeaderboardScroll'), {
  loading: () => <LeaderboardSkeleton />
})

// 2. Image optimization
<Image
  src={creator.avatar}
  alt={creator.name}
  width={80}
  height={80}
  loading="lazy"
  placeholder="blur"
/>

// 3. Memoization
const expensiveStats = useMemo(() => {
  return calculateStats(submissions)
}, [submissions])

// 4. Debounced search
const debouncedSearch = useDebounce(searchQuery, 300)
```

---

## Migration Path

### Step 1: Create New Components (No Breaking Changes)
- Build new components in parallel
- Test on staging environment
- A/B test with 10% of traffic

### Step 2: Gradual Rollout
- **Week 1:** Mobile users only (50%)
- **Week 2:** Mobile users (100%)
- **Week 3:** Desktop users (50%)
- **Week 4:** Desktop users (100%)

### Step 3: Feature Flags
```tsx
// Use feature flags for gradual rollout
const { isNewDesignEnabled } = useFeatureFlags()

return isNewDesignEnabled ? (
  <NewCampaignDetailPage {...props} />
) : (
  <OldCampaignDetailPage {...props} />
)
```

### Step 4: Fallback Strategy
- Keep old page.tsx as page.old.tsx
- Monitor error rates & user feedback
- Quick rollback if issues arise

---

## Design Rationale Summary

### User-Centered Decisions
1. **Mobile-first:** 70% of users on mobile (analytics)
2. **Progressive disclosure:** Reduce cognitive load
3. **Single-column layout:** Natural reading flow
4. **Thumb-friendly zones:** Actions within easy reach
5. **Immediate feedback:** Every action has visual response

### Business Goals
1. **Increase conversions:** Easier join flow
2. **Boost submissions:** Inline form, less friction
3. **Build trust:** Social proof (leaderboard, stats)
4. **Reduce bounce rate:** Faster loading, clearer value prop
5. **Platform consistency:** BTDemo design system

### Technical Excellence
1. **Performance:** < 3s TTI, code splitting
2. **Accessibility:** WCAG 2.1 AA compliance
3. **Scalability:** Reusable components
4. **Maintainability:** Clear file structure
5. **Testing:** Unit, integration, E2E coverage

---

## Next Steps for Development Team

1. **Review this proposal** with design & product teams
2. **Create Figma mockups** based on wireframes
3. **Build component library** in Storybook
4. **Implement Phase 1** (critical mobile UX)
5. **User testing** with 5-10 beta users
6. **Iterate** based on feedback
7. **Gradual rollout** with feature flags
8. **Monitor metrics** and optimize

---

**Questions or Feedback?**
Contact: Design Team | Product Team | Engineering Lead

**Related Documents:**
- `CLAUDE.md` - Project context
- `SPRINT.md` - Current priorities
- `DOCS_INDEX.md` - Full documentation
- `INTEGRATION_GUIDE.md` - Frontend patterns

---

**Document Version:** 1.0
**Last Updated:** 2025-10-24
**Author:** UI/UX Design Team
**Status:** Proposal - Awaiting Approval
