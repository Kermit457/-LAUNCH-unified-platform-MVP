# LaunchOS Design System v2.0
**Unified Visual Identity - Based on Launches Demo**

---

## 1. Unified Design Principles

### Core Philosophy
**"Degen-Premium"** — High-energy, data-dense, visually striking without sacrificing clarity. Every element should feel fast, modern, and purposeful.

### Visual Pillars

1. **Dark Neon Foundation**
   - Deep black base creates contrast for vibrant gradients
   - Neon accents guide attention without overwhelming
   - Glass morphism adds depth without clutter

2. **Minimal Maximalism**
   - Dense information, compact presentation
   - Remove unnecessary text, use icons + tooltips
   - Hover states reveal details progressively

3. **Fluid Responsiveness**
   - Mobile-first grid that scales elegantly
   - Touch-friendly spacing (min 44px tap targets)
   - Adaptive typography (clamp() for fluid sizing)

4. **Motion with Purpose**
   - Micro-interactions confirm actions
   - Transitions under 300ms (150ms preferred)
   - Animations enhance understanding, not distract

5. **Consistent Hierarchy**
   - Gradient text = primary focus
   - White text = main content
   - Zinc-300 = secondary info
   - Zinc-500 = metadata/labels

---

## 2. Design Tokens

### Color System

```typescript
// Design Tokens - colors.ts
export const colors = {
  // Base
  base: {
    black: '#0a0a0c',
    darker: '#0f0f12',
    dark: '#18181b',
    card: '#1a1a1f',
  },

  // Gradients (primary brand)
  gradient: {
    primary: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 50%, #ec4899 100%)',
    primaryHover: 'linear-gradient(135deg, #9333ea 0%, #0891b2 50%, #db2777 100%)',
    conviction: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
    glow: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(6,182,212,0.2) 100%)',
  },

  // Accent colors
  accent: {
    violet: '#a855f7',
    purple: '#9333ea',
    cyan: '#06b6d4',
    teal: '#0891b2',
    magenta: '#ec4899',
    pink: '#db2777',
  },

  // Status colors
  status: {
    live: '#10b981',      // emerald-500
    upcoming: '#f59e0b',  // amber-500
    ended: '#6b7280',     // gray-500
    positive: '#10b981',
    negative: '#ef4444',  // red-500
  },

  // Scope colors
  scope: {
    icm: '#06b6d4',       // cyan-500
    ccm: '#a855f7',       // purple-500
  },

  // Text hierarchy
  text: {
    primary: '#ffffff',
    secondary: '#d4d4d8',  // zinc-300
    tertiary: '#a1a1aa',   // zinc-400
    muted: '#71717a',      // zinc-500
    disabled: '#52525b',   // zinc-600
  },

  // Borders & dividers
  border: {
    default: '#27272a',    // zinc-800
    light: '#3f3f46',      // zinc-700
    accent: 'rgba(168,85,247,0.3)',
  },

  // Backgrounds
  bg: {
    glass: 'rgba(255,255,255,0.05)',
    glassHover: 'rgba(255,255,255,0.08)',
    overlay: 'rgba(0,0,0,0.8)',
  },
}
```

### Typography Scale

```typescript
// Design Tokens - typography.ts
export const typography = {
  // Font families
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Monaco, Courier New, monospace',
  },

  // Font sizes (fluid scaling)
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  // Line heights
  leading: {
    none: '1',
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  // Font weights
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
}
```

### Spacing System

```typescript
// Design Tokens - spacing.ts
export const spacing = {
  // Base scale (4px grid)
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px

  // Semantic spacing
  section: {
    xs: '2rem',     // 32px
    sm: '3rem',     // 48px
    md: '4rem',     // 64px
    lg: '6rem',     // 96px
  },

  // Container widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}
```

### Border Radius

```typescript
// Design Tokens - radius.ts
export const radius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px - PRIMARY for cards
  '2xl': '1.5rem', // 24px - SECONDARY for hero cards
  '3xl': '2rem',   // 32px - TERTIARY for modals
  full: '9999px',  // Pills, avatars
}
```

### Shadows & Glows

```typescript
// Design Tokens - effects.ts
export const shadows = {
  // Standard shadows (minimal use)
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',

  // Glow effects (primary use)
  glow: {
    violet: '0 0 20px rgba(168, 85, 247, 0.3)',
    violetHover: '0 0 30px rgba(168, 85, 247, 0.5)',
    cyan: '0 0 20px rgba(6, 182, 212, 0.3)',
    emerald: '0 0 20px rgba(16, 185, 129, 0.3)',
    red: '0 0 20px rgba(239, 68, 68, 0.3)',
  },

  // Inner glow
  inner: {
    subtle: 'inset 0 0 20px rgba(168, 85, 247, 0.1)',
  },
}

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',

  // Specific properties
  all: 'all 150ms ease-in-out',
  colors: 'background-color 150ms ease-in-out, border-color 150ms ease-in-out, color 150ms ease-in-out',
  transform: 'transform 150ms ease-in-out',
  opacity: 'opacity 200ms ease-in-out',
}
```

---

## 3. Component System

### Base Card Component

```tsx
// components/ui/Card.tsx
interface CardProps {
  variant?: 'default' | 'gradient' | 'glass'
  glow?: boolean
  hover?: boolean
  className?: string
  children: React.ReactNode
}

export function Card({
  variant = 'default',
  glow = false,
  hover = true,
  className = '',
  children
}: CardProps) {
  return (
    <div className={cn(
      // Base styles
      'rounded-2xl border transition-all duration-150',

      // Variants
      variant === 'default' && 'bg-white/5 border-zinc-800',
      variant === 'gradient' && 'bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-white/10',
      variant === 'glass' && 'bg-white/5 backdrop-blur-xl border-white/10',

      // Glow effect
      glow && 'shadow-[0_0_20px_rgba(168,85,247,0.1)]',

      // Hover state
      hover && 'hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:border-white/20',

      className
    )}>
      {children}
    </div>
  )
}
```

### Tailwind Classes Reference

```css
/* Card Variants */
.card-default {
  @apply rounded-2xl bg-white/5 border border-zinc-800 transition-all duration-150;
}

.card-gradient {
  @apply rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 transition-all duration-150;
}

.card-glass {
  @apply rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-150;
}

.card-hover {
  @apply hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:border-white/20;
}

.card-glow {
  @apply shadow-[0_0_20px_rgba(168,85,247,0.1)];
}
```

### Button Component

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'boost'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  className?: string
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  glow = false,
  className = '',
  children
}: ButtonProps) {
  return (
    <button className={cn(
      // Base
      'rounded-xl font-semibold transition-all duration-150 flex items-center justify-center gap-2',

      // Sizes
      size === 'sm' && 'h-9 px-4 text-sm',
      size === 'md' && 'h-11 px-6 text-base',
      size === 'lg' && 'h-14 px-8 text-lg',

      // Variants
      variant === 'primary' && 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600',
      variant === 'secondary' && 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20',
      variant === 'ghost' && 'text-white/70 hover:text-white hover:bg-white/5',
      variant === 'boost' && 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]',

      // Glow
      glow && 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',

      className
    )}>
      {children}
    </button>
  )
}
```

### Status Chip Component

```tsx
// components/ui/StatusChip.tsx
interface StatusChipProps {
  type: 'live' | 'upcoming' | 'ended' | 'icm' | 'ccm'
  className?: string
}

export function StatusChip({ type, className = '' }: StatusChipProps) {
  const styles = {
    live: 'bg-emerald-500/10 text-emerald-500 border-emerald-600/30',
    upcoming: 'bg-amber-500/10 text-amber-500 border-amber-600/30',
    ended: 'bg-gray-500/10 text-gray-500 border-gray-600/30',
    icm: 'bg-cyan-500/10 text-cyan-500 border-cyan-600/30',
    ccm: 'bg-purple-500/10 text-purple-500 border-purple-600/30',
  }

  const labels = {
    live: 'LIVE',
    upcoming: 'UPCOMING',
    ended: 'ENDED',
    icm: 'ICM',
    ccm: 'CCM',
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border',
      styles[type],
      className
    )}>
      {type === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {labels[type]}
    </span>
  )
}
```

### Metric Pill Component

```tsx
// components/ui/MetricPill.tsx
interface MetricPillProps {
  label: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  variant?: 'default' | 'positive' | 'negative'
  className?: string
}

export function MetricPill({
  label,
  value,
  change,
  icon,
  variant = 'default',
  className = ''
}: MetricPillProps) {
  return (
    <div className={cn(
      'rounded-xl p-3 border transition-all duration-150',
      variant === 'default' && 'bg-white/5 border-zinc-800',
      variant === 'positive' && 'bg-emerald-500/10 border-emerald-600/30',
      variant === 'negative' && 'bg-red-500/10 border-red-600/30',
      'hover:border-white/20',
      className
    )}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-white/60">{icon}</span>}
        <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-white">{value}</span>
        {change !== undefined && (
          <span className={cn(
            'text-xs font-medium',
            change >= 0 ? 'text-emerald-500' : 'text-red-500'
          )}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  )
}
```

### Conviction Bar Component

```tsx
// components/ui/ConvictionBar.tsx
interface ConvictionBarProps {
  percentage: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export function ConvictionBar({
  percentage,
  label = 'Conviction',
  showPercentage = true,
  className = ''
}: ConvictionBarProps) {
  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>}
          {showPercentage && <span className="text-sm font-bold text-white">{percentage}%</span>}
        </div>
      )}
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

### Tab Control Component

```tsx
// components/ui/Tabs.tsx
interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={cn(
      'inline-flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10',
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 flex items-center gap-2',
            activeTab === tab.id
              ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

### Avatar Group Component

```tsx
// components/ui/AvatarGroup.tsx
interface Contributor {
  avatar: string
  name: string
}

interface AvatarGroupProps {
  contributors: Contributor[]
  max?: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function AvatarGroup({
  contributors,
  max = 5,
  size = 'md',
  label,
  className = ''
}: AvatarGroupProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  const visible = contributors.slice(0, max)
  const overflow = contributors.length - max

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {label && <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>}
      <div className="flex -space-x-2">
        {visible.map((contributor, idx) => (
          <img
            key={idx}
            src={contributor.avatar}
            alt={contributor.name}
            title={contributor.name}
            className={cn(
              'rounded-full border-2 border-[#0f0f12]',
              sizes[size]
            )}
          />
        ))}
        {overflow > 0 && (
          <div className={cn(
            'rounded-full bg-white/10 border-2 border-[#0f0f12] flex items-center justify-center text-xs text-white/60 font-medium',
            sizes[size]
          )}>
            +{overflow}
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 4. Visual Hierarchy & Layout System

### Hierarchy Principles

**Level 1: Primary Focus** (Draws attention first)
- Gradient text headlines
- Boost/Primary action buttons
- LIVE status indicators
- Price with large bold typography
- Conviction bars at high percentage

**Level 2: Key Information** (Secondary scan)
- White text labels
- Token symbols/names
- Metric values
- Status chips
- Navigation active states

**Level 3: Supporting Details** (Tertiary)
- Zinc-300 descriptions
- Metadata labels
- Social links
- Contributor avatars

**Level 4: Background Context** (Lowest priority)
- Zinc-500 timestamps
- Muted labels
- Dividers
- Card backgrounds

### Grid System

```typescript
// Layout grid constants
export const grid = {
  // Columns
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },

  // Gap spacing
  gap: {
    sm: 'gap-4',     // 16px
    md: 'gap-6',     // 24px
    lg: 'gap-8',     // 32px
  },

  // Container padding
  padding: {
    mobile: 'px-4',   // 16px
    tablet: 'px-6',   // 24px
    desktop: 'px-8',  // 32px
  },
}
```

### Page Layout Template

```tsx
// Layout structure for all pages
<main className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
  {/* Nav */}
  <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10">
    {/* Nav content */}
  </nav>

  {/* Page content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    {/* Page-specific content */}
  </div>
</main>
```

---

## 5. Section-by-Section Layout Plans

### Home Page

**Structure:**
```
┌─────────────────────────────────────────┐
│ Hero Section (full viewport height)    │
│ - Gradient headline (text-6xl)         │
│ - Subtitle (text-xl, zinc-300)         │
│ - Dual CTAs (Boost gradient + Ghost)   │
│ - Animated stats counters (4 pills)    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Featured Launches (3-col grid)         │
│ - Launch Demo card style                │
│ - Hover expansion effect                │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ How It Works (3-col icon grid)         │
│ - Icon + gradient headline + text       │
└─────────────────────────────────────────┘
```

**Key Components:**
- Hero: `text-6xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent`
- Stat pills: `MetricPill` with animated counter
- Feature cards: `Card variant="gradient" glow hover`

### Discover Page

**Structure:**
```
┌─────────────────────────────────────────┐
│ Filter Bar (sticky)                     │
│ - Tabs: All | ICM | CCM                 │
│ - Sort dropdown                         │
│ - Search bar                            │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Launch Grid (responsive)                │
│ - Mobile: 1-col                         │
│ - Tablet: 2-col                         │
│ - Desktop: 3-col                        │
│ - Each card: Launch Demo style          │
└─────────────────────────────────────────┘
```

**Key Components:**
- Filter: `Tabs` component with floating style
- Cards: Compact version of Launch Demo card
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### Live Page

**Structure:**
```
┌─────────────────────────────────────────┐
│ Stats Bar (horizontal metrics)         │
│ - Total Live | 24h Volume | Top Gainer │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Live Launches Grid                      │
│ - Same as Discover but LIVE only        │
│ - Glow effect on cards                  │
│ - Real-time price updates               │
└─────────────────────────────────────────┘
```

**Key Components:**
- Live cards: `Card glow` with pulse animation
- Price: Auto-updating with fade transition
- Grid: Same as Discover

### Earn Page

**Structure:**
```
┌─────────────────────────────────────────┐
│ Campaign Grid (3-col responsive)        │
│ - Card per campaign                     │
│ - Type badge (Raid/Bounty/Clip)        │
│ - Reward amount (prominent)             │
│ - Tasks remaining (progress bar)        │
│ - CTA button                            │
└─────────────────────────────────────────┘
```

**Campaign Card Layout:**
```
┌──────────────────────────┐
│ [Badge] Type             │
│ Campaign Title           │
│ Reward: $XXX             │
│ ──────────── 70%        │ <- Progress
│ Tasks: 7/10              │
│ [Join Campaign →]        │
└──────────────────────────┘
```

**Key Components:**
- Badge: `StatusChip` with custom variant
- Progress: `ConvictionBar` repurposed for tasks
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### Tools Page

**Structure:**
```
┌─────────────────────────────────────────┐
│ Tools Grid (3-col)                      │
│ ┌──────┐  ┌──────┐  ┌──────┐          │
│ │ Icon │  │ Icon │  │ Icon │          │
│ │ Name │  │ Name │  │ Name │          │
│ └──────┘  └──────┘  └──────┘          │
│ Hover reveals description               │
└─────────────────────────────────────────┘
```

**Tool Card Layout:**
```
Default state:
┌──────────────┐
│   [Icon]     │
│   Tool Name  │
└──────────────┘

Hover state:
┌──────────────┐
│   [Icon]     │
│   Tool Name  │
│ Description  │
│   [Use →]    │
└──────────────┘
```

**Key Components:**
- Icon: Large gradient icon (64px)
- Hover expansion: `group-hover:h-auto` transition
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### Network Page

**Structure:**
```
┌─────────────────────────────────────────┐
│ Filter/Sort Bar                         │
│ - Tabs: All | Following | Followers     │
│ - Search                                │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Profile Grid (2-col on desktop)        │
│ ┌────────────────┐ ┌────────────────┐  │
│ │ ProfileCard    │ │ ProfileCard    │  │
│ └────────────────┘ └────────────────┘  │
└─────────────────────────────────────────┘
```

**ProfileCard Layout:**
```
┌────────────────────────────────┐
│ [Avatar] Name @handle          │
│ Bio text (1 line truncate)     │
│ [Social badges: X TG DC]       │
│ Contributions: [avatars]       │
│ [Follow] [Message]             │
└────────────────────────────────┘
```

**Key Components:**
- Social badges: Icon-only circular chips
- Contributions: `AvatarGroup max={3}`
- Actions: `Button variant="secondary" size="sm"`
- Grid: `grid grid-cols-1 lg:grid-cols-2 gap-6`

### Profile Page (Creator/Project)

**Structure:**
```
┌─────────────────────────────────────────┐
│ Header Card (gradient)                  │
│ - Avatar + Cover                        │
│ - Name + handle                         │
│ - Bio                                   │
│ - Social links (icon row)               │
│ - Stats pills (followers, launches, etc)│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Tabs (Launches | Activity | About)     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Tab Content                             │
│ - Launches: Grid of launch cards        │
│ - Activity: Timeline list               │
│ - About: Rich text content              │
└─────────────────────────────────────────┘
```

**Key Components:**
- Header: `Card variant="gradient" glow`
- Stats: Row of `MetricPill` components
- Tabs: `Tabs` with neon glow on active
- Content grid: Matches respective page grids

### Launch Detail Page

**Current Implementation (Already Optimal):**
```
┌─────────────────────────────────────────┐
│ LaunchHeaderCompact                     │
│ - Logo + Title + Badges                 │
│ - Social icons (icon-only)              │
│ - Team + Contributors (avatar bubbles)  │
│ - Conviction bar                        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ ChartTabs (Insights | Chart)           │
│ - Price display above                   │
│ - Chart with contributor avatars        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ TokenStatsCompact (4-col grid)         │
│ - 24H Change | Volume | Holders | MCap  │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ AboutCollapse (expandable)              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Actions (sticky on mobile)              │
│ [Boost] [Follow] [View]                 │
└─────────────────────────────────────────┘
```

**Refinements Needed:**
- Ensure all cards use `rounded-2xl`
- Dexscreener embed matches page `rounded-xl`
- Stats grid uses `MetricPill` component
- Actions use `Button variant="boost"` for Boost

---

## 6. Component Class Conventions

### Standard Patterns

```tsx
// Card wrapper
className="rounded-2xl bg-white/5 border border-zinc-800 p-6 transition-all duration-150 hover:scale-[1.02] hover:border-white/20"

// Section title
className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-6"

// Grid container
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Flex row with items
className="flex items-center gap-4"

// Text hierarchy
className="text-white"          // Primary
className="text-zinc-300"       // Secondary
className="text-zinc-500"       // Muted

// Interactive element
className="transition-all duration-150 hover:scale-105 active:scale-95"

// Glass effect
className="backdrop-blur-xl bg-white/5 border border-white/10"

// Gradient background
className="bg-gradient-to-br from-black via-purple-950/20 to-black"

// Glow effect
className="shadow-[0_0_20px_rgba(168,85,247,0.2)]"
```

---

## 7. Responsive Breakpoints

```typescript
// Tailwind breakpoints
export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Wide desktop
  '2xl': '1536px', // Ultra wide
}

// Usage patterns
{
  mobile: 'px-4 py-6',
  tablet: 'md:px-6 md:py-8',
  desktop: 'lg:px-8 lg:py-12',
}

// Grid responsive
{
  base: 'grid-cols-1',
  tablet: 'md:grid-cols-2',
  desktop: 'lg:grid-cols-3',
  wide: 'xl:grid-cols-4',
}
```

---

## 8. Interaction Patterns

### Hover States

```tsx
// Cards
hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:border-white/20

// Buttons
hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]

// Text links
hover:text-white hover:underline

// Icons
hover:text-cyan-500 hover:scale-110
```

### Focus States

```tsx
// Form inputs
focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent

// Buttons
focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black
```

### Active States

```tsx
// Buttons
active:scale-95

// Tabs
data-[state=active]:bg-white/10 data-[state=active]:border-white/20
```

### Loading States

```tsx
// Skeleton
animate-pulse bg-white/5

// Spinner
animate-spin border-2 border-white/20 border-t-purple-500
```

---

## 9. Accessibility Considerations

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 for normal, 3:1 for large)
- White on dark backgrounds: ✓ Pass
- Zinc-300 on dark: ✓ Pass
- Zinc-500 on dark: Use for non-essential text only

### Focus Indicators
- Always visible focus rings
- Purple glow matches brand
- Skip links for keyboard navigation

### Semantic HTML
- Use proper heading hierarchy (h1 → h6)
- ARIA labels for icon-only buttons
- Alt text for all images/avatars
- Descriptive link text

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] Install and configure design tokens
- [ ] Create base components (Card, Button, Tabs, etc.)
- [ ] Set up global styles and Tailwind config
- [ ] Create component library Storybook/showcase

### Phase 2: Page Updates (Week 2-3)
- [ ] Home page redesign
- [ ] Discover page unification
- [ ] Live page updates
- [ ] Earn page card redesign
- [ ] Tools page icon grid
- [ ] Network page profile cards
- [ ] Profile page header redesign

### Phase 3: Polish (Week 4)
- [ ] Launch detail refinements (already 90% done)
- [ ] Responsive testing all pages
- [ ] Animation polish
- [ ] Accessibility audit
- [ ] Performance optimization

### Phase 4: Documentation
- [ ] Component usage docs
- [ ] Design system guidelines
- [ ] Developer handoff materials
- [ ] Brand guidelines document

---

## 11. Color Refinement Suggestions

### Current Palette Analysis
**Strengths:**
- Purple/violet provides strong brand identity
- Cyan adds freshness and tech feel
- Magenta/pink creates energy and urgency

**Potential Adjustments:**

**Option A: Cooler Tones** (More professional)
```typescript
primary: '#8b5cf6',    // Violet-500 (slightly cooler)
accent: '#0ea5e9',     // Sky-500 (brighter cyan)
highlight: '#d946ef',  // Fuchsia-500 (less pink)
```

**Option B: Warmer Tones** (More energetic)
```typescript
primary: '#a855f7',    // Purple-500 (current)
accent: '#06b6d4',     // Cyan-500 (current)
highlight: '#f43f5e',  // Rose-500 (more vibrant)
```

**Option C: Balanced** (Recommended)
```typescript
primary: '#a855f7',    // Purple-500 (keep)
accent: '#22d3ee',     // Cyan-400 (slightly brighter)
highlight: '#ec4899',  // Pink-500 (keep)
tertiary: '#8b5cf6',   // Violet-500 (add for variety)
```

**Recommendation:** Option C maintains current brand while adding violet as tertiary for deeper variety in gradients.

### Gradient Refinements

**Current:**
```css
from-fuchsia-500 via-purple-500 to-cyan-500
```

**Enhanced Options:**

**3-stop smooth:**
```css
from-violet-500 via-fuchsia-500 to-cyan-500
```

**5-stop vibrant:**
```css
from-violet-600 via-fuchsia-500 via-purple-500 via-pink-500 to-cyan-400
```

**Radial for heroes:**
```css
bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/50 via-black to-black
```

---

## Summary

This design system provides:

1. ✅ **Unified visual identity** based on Launches Demo
2. ✅ **Complete token system** (colors, typography, spacing, effects)
3. ✅ **Reusable components** with Tailwind classes
4. ✅ **Visual hierarchy guidelines** for all pages
5. ✅ **Section-by-section layouts** with wireframes
6. ✅ **Responsive patterns** and accessibility standards
7. ✅ **Implementation roadmap** with phases

**Next Steps:**
1. Review and approve color palette
2. Build component library
3. Apply to each page systematically
4. Test responsive behavior
5. Conduct accessibility audit

The system ensures every page feels like part of the same cohesive "degen-premium" experience while maintaining clarity and usability.
