# Featured Projects Carousel - Quick Reference

## 🚀 Quick Start

### Import
```tsx
import { FeaturedProjectsCarousel } from '@/components/launch/FeaturedProjectsCarousel'
import type { UnifiedCardData } from '@/components/UnifiedCard'
```

### Basic Usage
```tsx
<FeaturedProjectsCarousel
  projects={projects}
  onBuyKeys={(project) => handleBuy(project)}
  onClipClick={(project) => handleClip(project)}
  onCollaborate={(project) => handleCollab(project)}
/>
```

## 📦 Props Interface

```typescript
interface FeaturedProjectsCarouselProps {
  projects: UnifiedCardData[]         // Array of projects to feature
  onBuyKeys?: (project) => void       // Handler for buy action
  onClipClick?: (project) => void     // Handler for clip submission
  onCollaborate?: (project) => void   // Handler for collaboration
}
```

## 🎨 Design Tokens

### Colors
```typescript
Primary:     '#D1FD0A'  // Lime green
Secondary:   '#00FF88'  // Green
Background:  '#000000'  // Black
Border:      '#3B3B3B'  // Zinc-800
```

### Typography
```typescript
Headings:    'text-3xl md:text-4xl font-black'
Ticker:      'font-led-dot text-xl md:text-2xl'
Metrics:     'font-led-dot text-3xl'
Labels:      'text-xs uppercase tracking-wider'
```

### Spacing
```typescript
Card:        'p-6 md:p-8'
Grid Gap:    'gap-6 md:gap-8'
Stats Gap:   'gap-3'
Section:     'py-8'
```

## 🏗️ Data Mapping

### From Spotlight to UnifiedCard
```typescript
const mappedProjects = spotlight.map((project, idx): UnifiedCardData => ({
  // Identity
  id: project.id,
  type: 'icm' | 'ccm' | 'meme',

  // Content
  title: project.title,
  subtitle: project.description,
  logoUrl: project.logoUrl,
  ticker: project.ticker,

  // Status
  status: 'live' | 'active' | 'frozen' | 'launched',

  // Metrics
  beliefScore: 0-100,           // Motion score
  upvotes: number,
  commentsCount: number,
  viewCount: number,
  clipViews: number,
  holders: number,

  // Price
  currentPrice: number,
  contractPrice: number,
  priceChange24h: number,       // +15.5 = up, -5.2 = down

  // Social
  contributors: Array,
  contributorsCount: number,
  twitterUrl: string,
  websiteUrl: string,

  // Handlers
  onVote: async () => {},
  onComment: () => {},
  onCollaborate: () => {},
  onBuyKeys: () => {},
  onClipClick: () => {},
  onNotificationToggle: () => {},
  onShare: () => {}
}))
```

## 🎯 Key Metrics Display

### Metric Cards
```typescript
// Market Cap - Green
<div className="glass-interactive p-4 rounded-xl">
  <div className="text-xs text-zinc-500">Market Cap</div>
  <div className="font-led-dot text-3xl text-[#00FF88]">
    ${formatCompact(marketCap)}
  </div>
</div>

// Holders - White
<div className="glass-interactive p-4 rounded-xl">
  <div className="text-xs text-zinc-500">Holders</div>
  <div className="font-led-dot text-3xl text-white">
    {holders}
  </div>
</div>

// Price - Lime with change
<div className="glass-interactive p-4 rounded-xl">
  <div className="text-xs text-zinc-500">Price</div>
  <div className="font-led-dot text-3xl text-[#D1FD0A]">
    {price.toFixed(3)}
  </div>
  <div className="text-sm font-bold text-[#00FF88]">
    +{change.toFixed(1)}%
  </div>
</div>
```

## 🔄 Carousel Navigation

### Controls
```typescript
// State
const [currentIndex, setCurrentIndex] = useState(0)

// Handlers
const handlePrev = () => {
  setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
}

const handleNext = () => {
  setCurrentIndex((prev) => (prev + 1) % projects.length)
}

// Buttons
<button onClick={handlePrev}>◀</button>
<button onClick={handleNext}>▶</button>

// Thumbnails
{projects.map((project, idx) => (
  <button
    onClick={() => setCurrentIndex(idx)}
    className={idx === currentIndex ? 'active' : ''}
  />
))}
```

## 🎬 Animations

### Framer Motion Setup
```typescript
import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence mode="wait">
  <motion.div
    key={project.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
  >
    {/* Card content */}
  </motion.div>
</AnimatePresence>
```

## 🎨 Styling Classes

### Glass Effects
```css
glass-premium         /* Main card background */
glass-interactive     /* Metric cards */
```

### Hover Effects
```css
group                          /* Parent element */
group-hover:scale-105         /* Logo scale */
hover:border-[#D1FD0A]        /* Border glow */
hover:shadow-[#D1FD0A]/30     /* Shadow glow */
```

### Text Styles
```css
btdemo-text-glow-intense      /* Glowing text */
font-led-dot                   /* LED numbers */
font-black                     /* Heavy weight */
tracking-wider                 /* Letter spacing */
```

## 📱 Responsive Design

### Breakpoints
```css
Mobile:    default (< 768px)
Tablet:    md: (768px+)
Desktop:   lg: (1024px+)
```

### Layout Classes
```typescript
// Two-column grid (desktop)
className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8"

// Stats grid
className="grid grid-cols-3 gap-3"  // Desktop
className="grid grid-cols-1 gap-3"  // Mobile

// CTAs
className="grid grid-cols-1 md:grid-cols-3 gap-3"
```

## 🔧 Helper Functions

### Number Formatting
```typescript
// Standard format: 1,250
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Compact format: 12.5K, 2.5M
const formatCompact = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}
```

## 🎯 Action Handlers

### Buy Keys
```typescript
onBuyKeys={(project) => {
  setSelectedProject(project)
  setTradeModalOpen(true)
}}
```

### Submit Clip
```typescript
onClipClick={(project) => {
  setSelectedProject(project)
  setClipModalOpen(true)
}}
```

### Collaborate
```typescript
onCollaborate={(project) => {
  setSelectedProject(project)
  setCollaborateModalOpen(true)
}}
```

## 🏷️ Type Badges

### Color Schemes
```typescript
const colorSchemes = {
  icm: {
    badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
    border: 'border-[#D1FD0A]/60',
    icon: IconRocket
  },
  ccm: {
    badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
    border: 'border-[#D1FD0A]/60',
    icon: IconMotion
  },
  meme: {
    badge: 'bg-[#D1FD0A]/20 text-[#D1FD0A] border-[#D1FD0A]/30',
    border: 'border-[#D1FD0A]/60',
    icon: IconCult
  }
}
```

## 🎪 Motion Bar

### Implementation
```tsx
<div className="h-4 rounded-full bg-zinc-800 border-2 border-zinc-700">
  <div
    className="h-full bg-gradient-to-r from-[#D1FD0A] to-[#00FF88] shadow-lg shadow-[#D1FD0A]/50"
    style={{ width: `${beliefScore}%` }}
  />
</div>
```

## 👥 Contributors Display

```tsx
<div className="flex items-center -space-x-3">
  {contributors.slice(0, 6).map((c, idx) => (
    <div className="w-10 h-10 rounded-full border-2 border-zinc-900">
      <img src={c.avatar} alt={c.name} />
    </div>
  ))}
  {count > 6 && (
    <div className="w-10 h-10 rounded-full bg-zinc-800">
      +{count - 6}
    </div>
  )}
</div>
```

## 🔔 Notification Toggle

```tsx
<button
  onClick={onNotificationToggle}
  className={cn(
    "p-3 rounded-xl transition-all",
    enabled
      ? "bg-[#D1FD0A]/20 border-2 border-[#D1FD0A]"
      : "bg-zinc-800 border-2 border-zinc-700"
  )}
>
  <IconNotification
    className={enabled ? 'text-[#D1FD0A]' : 'text-zinc-400'}
  />
</button>
```

## 📊 Status Badges

```tsx
// Live
<span className="px-4 py-2 rounded-xl bg-[#D1FD0A]/20 text-[#D1FD0A] border-2 border-[#D1FD0A]/40">
  LIVE
</span>

// Frozen
<span className="px-4 py-2 rounded-xl bg-orange-500/20 text-orange-400 border-2 border-orange-500/30">
  FROZEN
</span>

// Launched
<span className="px-4 py-2 rounded-xl bg-[#D1FD0A]/20 text-[#D1FD0A] border-2 border-[#D1FD0A]/40">
  LAUNCHED
</span>
```

## 🖼️ Logo Display

```tsx
<div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl border-4 border-[#D1FD0A]/60">
  {logoUrl ? (
    <img src={logoUrl} alt={title} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
      <span className="text-4xl font-bold">
        {title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )}

  {/* Motion Badge */}
  <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-[#D1FD0A] rounded-xl">
    <div className="text-xs font-bold">Motion</div>
    <div className="font-led-dot text-2xl">{beliefScore}</div>
  </div>
</div>
```

## 🎨 Button Variants

### Primary (Buy Keys)
```tsx
<button className="bg-[#D1FD0A] hover:bg-[#B8E309] text-black font-black px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-[#D1FD0A]/50">
  BUY KEYS
</button>
```

### Secondary (Clips)
```tsx
<button className="bg-zinc-800 hover:bg-zinc-700 font-bold px-6 py-4 rounded-xl border-2 border-[#D1FD0A]">
  <Film className="w-5 h-5 text-[#D1FD0A]" />
  <span className="text-[#D1FD0A]">Clips</span>
</button>
```

### Tertiary (Details)
```tsx
<button className="bg-zinc-800 hover:bg-zinc-700 font-semibold px-4 py-3 rounded-xl border border-zinc-700 hover:border-[#D1FD0A]/50">
  View Details
</button>
```

## 🔍 Search & Filter

### Not implemented in carousel
Recommended pattern for parent page:

```tsx
const [searchQuery, setSearchQuery] = useState('')

const filteredProjects = projects.filter(p =>
  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  p.ticker.toLowerCase().includes(searchQuery.toLowerCase())
)

<FeaturedProjectsCarousel projects={filteredProjects} />
```

## ⚡ Performance Tips

1. **Memoize formatting functions**
```typescript
const formatNumber = useMemo(() =>
  (num: number) => new Intl.NumberFormat('en-US').format(num),
  []
)
```

2. **Lazy load thumbnails**
```tsx
<img loading="lazy" src={thumbnail} alt={title} />
```

3. **Reduce motion for accessibility**
```tsx
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

4. **Use React.memo for cards**
```typescript
export const FeaturedCard = React.memo(FeaturedCardComponent)
```

## 🐛 Common Issues

### Images not loading
```tsx
// Add error handler
<img
  src={logoUrl}
  alt={title}
  onError={(e) => {
    e.currentTarget.src = fallbackImage
  }}
/>
```

### Carousel stuck
```tsx
// Ensure projects array is not empty
if (!projects || projects.length === 0) return null
```

### Layout breaking on mobile
```tsx
// Use overflow-x-auto for thumbnails
<div className="flex overflow-x-auto pb-4 btdemo-scrollbar">
```

## 📚 Related Components

- `UnifiedCard.tsx` - Base card structure
- `BuySellModal.tsx` - Trading interface
- `SubmitClipModal.tsx` - Clip submission
- `CollaborateModal.tsx` - Collaboration interface
- `CommentsDrawer.tsx` - Comments view

## 🔗 File Paths

```
Component:
c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\launch\FeaturedProjectsCarousel.tsx

Implementation:
c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\launch\page.tsx

Documentation:
c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\FEATURED_PROJECTS_IMPLEMENTATION.md
c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\FEATURED_PROJECTS_VISUAL_GUIDE.md
```

## ✅ Checklist

Before deploying:
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Verify all handlers work
- [ ] Check image loading
- [ ] Test carousel navigation
- [ ] Validate accessibility
- [ ] Performance audit
- [ ] Browser compatibility
- [ ] Error states handled
