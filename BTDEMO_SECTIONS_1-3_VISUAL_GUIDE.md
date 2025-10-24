# BTDEMO Sections 1-3: Visual Reference Guide

**Quick Reference for Developers & Designers**

---

## Section 1: LaunchHeaderBTDemo

```
┌──────────────────────────────────────────────────────────────┐
│  [≡] 🚀 Launch    [🔍 Search projects...]  [🔔³] [💰] [Launch] │
│   ↓      ↓                   ↓                ↓    ↓       ↓   │
│  Menu  Logo              Search Bar        Bell Wallet  CTA   │
└──────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **Logo:** Rotating rocket on hover (360deg, 0.6s)
- **Search:** Icon pulses with glow on focus
- **Bell:** LED badge with notification count
- **Launch:** Pulsing rocket + lift on hover

**Colors:**
- Background: `glass-premium` (rgba(8, 8, 9, 0.60))
- Primary: `#D1FD0A` (lime green)
- Border: `rgba(255, 255, 255, 0.10)`

**Responsive:**
- Desktop: Full layout
- Mobile: Menu button + compact icons

---

## Section 2: TokenLaunchPreviewBTDemo

```
┌────────────────────────────────────────────────────────────┐
│  🚀 Launch Your Token              [▼] [×]                 │
│     Quick setup • No code required                         │
│  ┌────────────────────────────────────────────────────────┐
│  │  [EXPANDED STATE - Slides down in 300ms]              │
│  │                                                        │
│  │  ┌────────┐  ┌────────┐  ┌────────┐                  │
│  │  │ [1]    │  │ [2]    │  │ [3]    │                  │
│  │  │ Token  │  │ Bonding│  │ Deploy │                  │
│  │  │ Info   │  │ Curve  │  │        │                  │
│  │  └────────┘  └────────┘  └────────┘                  │
│  │                                                        │
│  │  [🚀 Start Launch Process]                            │
│  └────────────────────────────────────────────────────────┘
└────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **Icon:** Continuous pulse (2s loop, scale + glow)
- **Toggle:** Chevron rotates, height animates
- **Dismiss:** X rotates 90deg on hover
- **Steps:** Stagger in (0.1s, 0.2s, 0.3s delays)

**Animations:**
- Expand: `height: 0 → auto` (300ms)
- Collapse: `height: auto → 0` (200ms)
- Icon pulse: `scale(1 → 1.05 → 1)` + glow filter

---

## Section 3: HeroMetricsBTDemo

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ [📊]     │  │ [🚀]     │  │ [$]      │  │ [📈]     │
│          │  │          │  │      💵  │  │      ◎   │
│  847     │  │  124     │  │  $2.4M   │  │  $45M    │
│          │  │          │  │          │  │          │
│ Total    │  │ Active   │  │ 24h Vol  │  │ Market   │
│ Projects │  │ Launches │  │          │  │ Cap      │
│          │  │          │  │          │  │          │
│ +12.5% ↑ │  │ +8.3% ↑  │  │ +15.2% ↑ │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

**Key Elements:**
- **Icons:** Icon-specific animations on hover
  - Activity: Pulse + glow
  - Rocket: Bounce + rotate
  - Cash: Scale pulse
  - Market Cap: Rotate
- **Numbers:** Counter animation (0 → value, 800ms)
- **LED Font:** `font-led-32` with tabular numerals
- **Change:** Green/red arrows with percentage

**Hover State:**
```
┌──────────┐
│ [📊] ↑   │  ← Lifts 4px + glows
│  ⎯⎯⎯⎯⎯   │  ← LED text glows
│  847     │  ← Numbers glow
│          │
│ Total    │
│ Projects │
│ +12.5% ↑ │
└──────────┘
```

**Responsive Grid:**
- **Mobile (< 640px):** 1 column, stack vertically
- **Tablet (640-1024px):** 2×2 grid
- **Desktop (> 1024px):** 1×4 row

---

## Animation Timings

### Entrance Animations
```
Header:    y: -100 → 0     (500ms, ease-out)
Banner:    opacity: 0 → 1  (400ms)
Card 1:    delay: 0ms      (stagger start)
Card 2:    delay: 100ms    (+100ms)
Card 3:    delay: 200ms    (+100ms)
Card 4:    delay: 300ms    (+100ms)
```

### Hover Animations
```
Search icon:     300ms glow pulse
Wallet button:   scale(1.05) + shadow (200ms)
Launch button:   translateY(-2px) + glow (200ms)
Metric card:     translateY(-4px) scale(1.02) (200ms)
```

### Continuous Loops
```
Rocket icon (header):  bounce every 1.5s
Rocket icon (banner):  pulse every 2s
LED counter:           800ms one-time
```

---

## Color Palette

### Primary Colors
```css
--btdemo-primary: #D1FD0A        /* Lime Green */
--btdemo-canvas: #000000         /* Pure Black */
--btdemo-text: #FFFFFF           /* White */
--btdemo-text-dim: rgba(255, 255, 255, 0.72)
--btdemo-text-mute: rgba(255, 255, 255, 0.56)
```

### Glass Effects
```css
--glass-premium: rgba(8, 8, 9, 0.60) + blur(12px)
--glass-interactive: rgba(8, 8, 9, 0.40) + blur(8px)
--border-default: rgba(255, 255, 255, 0.10)
--border-hover: rgba(209, 253, 10, 0.30)
```

### Shadows
```css
--glow-primary: 0 0 24px rgba(209, 253, 10, 0.4)
--glow-hover: 0 8px 24px rgba(209, 253, 10, 0.4)
--shadow-card: 0 20px 40px rgba(209, 253, 10, 0.15)
```

---

## Typography

### LED Numerals
```css
.font-led-32 {
  font-family: 'DSEG14', monospace;
  font-size: 32px;
  letter-spacing: -1.28px;
  color: #D1FD0A;
  font-variant-numeric: tabular-nums;
}
```

### Body Text
```css
font-family: 'Archivo', 'Inter Tight', sans-serif;
```

### Weights
- Labels: 400 (regular)
- Headings: 600 (semibold)
- CTAs: 700 (bold)

---

## Icon Sizes

### Header Icons
- Menu: 24px
- Logo: 28px
- Search: 20px
- Notification: 24px
- Wallet: 20px

### Banner Icons
- Rocket: 32px
- Close: 20px
- Chevron: 20px

### Metric Icons
- Primary icon: 32px
- Currency badge: 20px
- Price arrow: 12px

---

## Spacing System

### Padding
- Cards: 24px (p-6)
- Buttons: 16px × 8px (px-4 py-2)
- Nav: 16px × 16px (px-4 py-4)

### Gap
- Card grid: 16px (gap-4)
- Icon + text: 8px (gap-2)
- Nav items: 12px (gap-3)

### Margins
- Section spacing: 16px (py-4)
- Banner to metrics: 16px
- Between sections: 24px

---

## Breakpoints

```css
/* Mobile First */
sm:  640px   /* 2 columns, compact nav */
md:  768px   /* Show labels, 2×2 grid */
lg:  1024px  /* Full desktop, 1×4 row */
xl:  1280px  /* Wide layout */
```

---

## Component Props

### LaunchHeaderBTDemo
```typescript
interface LaunchHeaderProps {
  onSearch?: (query: string) => void
  onLaunchClick?: () => void
  notificationCount?: number  // Default: 0
}
```

### TokenLaunchPreviewBTDemo
```typescript
interface TokenLaunchPreviewProps {
  onDismiss?: () => void
  initialExpanded?: boolean  // Default: false
}
```

### HeroMetricCard
```typescript
interface HeroMetricCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  change?: {
    value: number
    direction: 'up' | 'down'
  }
  currencyIcon?: LucideIcon
  index: number  // For stagger animation
}
```

### HeroMetricsBTDemo
```typescript
interface HeroMetricsProps {
  totalProjects: number
  activeLaunches: number
  volume24h: number     // Formatted as $2.4M
  marketCap: number     // Formatted as $45M
}
```

---

## Usage Example

```typescript
import { LaunchHeaderBTDemo } from '@/components/btdemo/LaunchHeaderBTDemo'
import { TokenLaunchPreviewBTDemo } from '@/components/btdemo/TokenLaunchPreviewBTDemo'
import { HeroMetricsBTDemo } from '@/components/btdemo/HeroMetricsBTDemo'

export default function LaunchPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleLaunchClick = () => {
    console.log('Launch token')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <LaunchHeaderBTDemo
        onSearch={setSearchQuery}
        onLaunchClick={handleLaunchClick}
        notificationCount={3}
      />

      <TokenLaunchPreviewBTDemo
        initialExpanded={false}
      />

      <HeroMetricsBTDemo
        totalProjects={847}
        activeLaunches={124}
        volume24h={2400000}
        marketCap={45000000}
      />
    </div>
  )
}
```

---

## Performance Notes

### Optimizations
- ✅ GPU-accelerated transforms (translateY, scale)
- ✅ No layout thrashing (opacity, transform only)
- ✅ RequestAnimationFrame for counter
- ✅ Memoized number formatting
- ✅ Tree-shakeable icon imports

### Bundle Size
- LaunchHeader: ~7.5KB
- TokenLaunchPreview: ~7.7KB
- HeroMetricCard: ~5.5KB
- HeroMetrics: ~1.9KB
- **Total:** ~22.6KB (uncompressed)

### Dependencies
- Framer Motion (shared vendor chunk)
- Lucide React icons (tree-shaken)
- Custom icon library (local)

---

## Accessibility Checklist

- [x] All buttons have aria-labels
- [x] Keyboard navigation works
- [x] Focus states visible
- [x] Color contrast >= 4.5:1
- [x] Touch targets >= 44×44px
- [x] Screen reader friendly
- [x] No motion for prefers-reduced-motion users
- [x] Semantic HTML (nav, button, input)

---

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Mobile Safari | 14+ | ✅ Full support |
| Samsung Internet | 14+ | ✅ Full support |

**Requires:**
- backdrop-filter support
- CSS custom properties
- Flexbox / Grid
- requestAnimationFrame

---

## Troubleshooting

### LED Numbers Not Showing
**Problem:** Numbers appear as boxes
**Solution:** Check DSEG14 font loaded in `/public/fonts/`

### Glass Effect Not Blurring
**Problem:** No backdrop blur
**Solution:** Check browser supports `backdrop-filter`

### Animations Janky
**Problem:** Stuttering animations
**Solution:** Use `transform` and `opacity` only (GPU-accelerated)

### Icons Not Found
**Problem:** Cannot find module '@/lib/icons'
**Solution:** Check icon exports in `lib/icons/index.tsx`

### Mobile Menu Not Working
**Problem:** Menu doesn't expand
**Solution:** Check AnimatePresence wraps motion.div

---

## Next Implementation: Sections 4-7

1. **Filters Bar** - Badge components, sort dropdown
2. **Project Cards** - Full card with 30+ icons
3. **Leaderboards** - Top performers with rankings
4. **Help Section** - Onboarding cards

See `BTDEMO_COMPREHENSIVE_DESIGN_SPEC.md` for complete specifications.
