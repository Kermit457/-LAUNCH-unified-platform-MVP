# Featured Projects Carousel - Visual Design Guide

## Component Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Featured Projects                                            ◀  1/3  ▶ │
│  Top performing launches with the highest motion scores                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┬────────────────────────────────────────────────┐ │
│  │                  │  LaunchOS Platform      $LOS                   │ │
│  │    ┌────────┐    │  ┌──────┐  ┌─────┐                            │ │
│  │    │        │ 93 │  │ LIVE │  │ ICM │                            │ │
│  │    │  LOGO  │    │  └──────┘  └─────┘                            │ │
│  │    │        │    │  Revolutionary Web3 launch platform...        │ │
│  │    └────────┘    │                                                │ │
│  │   [Lab] [Top]    │  ┌─────────┬─────────┬─────────┐              │ │
│  │                  │  │ 👁 12.5K │ ⬆ 42   │ 💬 18   │              │ │
│  │  ┌────────────┐  │  └─────────┴─────────┴─────────┘              │ │
│  │  │ Market Cap │  │                                                │ │
│  │  │  $2.5M     │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 93%   │ │
│  │  └────────────┘  │  Motion                                        │ │
│  │  ┌────────────┐  │                                                │ │
│  │  │  Holders   │  │  👤👤👤👤👤👤 +6                              │ │
│  │  │    124     │  │  Contributors                                  │ │
│  │  └────────────┘  │                                                │ │
│  │  ┌────────────┐  │  ┌──────────────────────────────────────────┐ │ │
│  │  │   Price    │  │  │        BUY KEYS  ◎ 0.050                 │ │ │
│  │  │   0.050    │  │  └──────────────────────────────────────────┘ │ │
│  │  │  +15.5%    │  │  ┌────────┐  ┌──────────┬──────────┐         │ │
│  │  └────────────┘  │  │ Clips  │  │Collab    │ Details  │         │ │
│  └──────────────────┴──┴────────┴──┴──────────┴──────────┴─────────┘ │
│                                                                          │
│  [img] [img] [img] [img] [img]  ← Thumbnail Navigation                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## Layout Breakdown

### Desktop Layout (1024px+)

```
Grid: [300px | 1fr]

┌─────────────────────────────────────────────────────────────────┐
│                        FEATURED CARD                             │
│ ┌──────────────┬────────────────────────────────────────────┐   │
│ │              │                                             │   │
│ │ LOGO COLUMN  │          CONTENT COLUMN                    │   │
│ │   (300px)    │              (flex)                        │   │
│ │              │                                             │   │
│ │ ┌──────────┐ │  Header Row                                │   │
│ │ │          │ │  ├─ Title (3xl-4xl bold)                   │   │
│ │ │   LOGO   │ │  ├─ Ticker (LED dot)                       │   │
│ │ │ 240x240  │ │  ├─ Status Badge                           │   │
│ │ │          │ │  └─ Type Badge                             │   │
│ │ └──────────┘ │                                             │   │
│ │   [Motion]   │  Stats Grid (3 columns)                    │   │
│ │     93       │  ├─ Views (IconAim)                         │   │
│ │              │  ├─ Upvotes (IconUpvote)                    │   │
│ │ ┌──────────┐ │  └─ Comments (IconMessage)                 │   │
│ │ │Market Cap│ │                                             │   │
│ │ │  $2.5M   │ │  Motion Bar                                │   │
│ │ └──────────┘ │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 93%     │   │
│ │              │                                             │   │
│ │ ┌──────────┐ │  Contributors                              │   │
│ │ │ Holders  │ │  👤👤👤👤👤👤 +6                          │   │
│ │ │   124    │ │                                             │   │
│ │ └──────────┘ │  CTAs                                      │   │
│ │              │  ┌────────────────────────────────────┐     │   │
│ │ ┌──────────┐ │  │     BUY KEYS  ◎ 0.050             │     │   │
│ │ │  Price   │ │  └────────────────────────────────────┘     │   │
│ │ │  0.050   │ │  ┌──────┐ ┌─────────┬─────────┐            │   │
│ │ │ +15.5%   │ │  │Clips │ │Collab   │Details  │            │   │
│ │ └──────────┘ │  └──────┘ └─────────┴─────────┘            │   │
│ └──────────────┴────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
Single Column Stack

┌──────────────────────────────┐
│                              │
│      ┌────────────┐          │
│      │            │   [93]   │
│      │    LOGO    │          │
│      │   160x160  │  [Lab]   │
│      └────────────┘          │
│                              │
│ ┌──────────────────────────┐ │
│ │ Market Cap: $2.5M        │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Holders: 124             │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ Price: 0.050 (+15.5%)    │ │
│ └──────────────────────────┘ │
│                              │
│ LaunchOS Platform            │
│ $LOS                         │
│ [LIVE] [ICM]                 │
│                              │
│ Revolutionary Web3 platform  │
│                              │
│ ┌────┬────┬────┐             │
│ │ 👁 │ ⬆ │ 💬 │             │
│ └────┴────┴────┘             │
│                              │
│ ━━━━━━━━━━━━━━━━━━━━ 93%   │
│ Motion                       │
│                              │
│ 👤👤👤👤👤👤 +6            │
│                              │
│ ┌──────────────────────────┐ │
│ │  BUY KEYS  ◎ 0.050       │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │       Clips              │ │
│ └──────────────────────────┘ │
│ ┌─────────┬────────────────┐ │
│ │Collab   │   Details      │ │
│ └─────────┴────────────────┘ │
└──────────────────────────────┘
```

## Color Palette

### Primary Colors
```
Lime Green (Primary):    #D1FD0A  rgb(209, 253, 10)
Green (Secondary):       #00FF88  rgb(0, 255, 136)
Black (Canvas):          #000000  rgb(0, 0, 0)
```

### Text Colors
```
White (Primary):         #FFFFFF  rgba(255, 255, 255, 1.0)
Muted:                   #FFFFFF  rgba(255, 255, 255, 0.6)
Dim:                     #FFFFFF  rgba(255, 255, 255, 0.4)
```

### UI Colors
```
Border:                  #3B3B3B  (zinc-800)
Card Background:         rgba(8, 8, 9, 0.6)
Card Hover:              rgba(8, 8, 9, 0.8)
```

### Status Colors
```
Success/Up:              #00FF88  (green)
Error/Down:              #FF0040  (red)
Warning:                 #FFD700  (gold)
Info:                    #0088FF  (blue)
```

## Typography

### Font Families
```css
Headings:    "Helvetica Now Display", "Helvetica Neue", system-ui
LED Numbers: "LED Dot Matrix", monospace
Body:        system-ui, sans-serif
```

### Font Sizes
```
Title:           text-3xl md:text-4xl    (1.875rem - 2.25rem)
Ticker:          text-xl md:text-2xl     (1.25rem - 1.5rem)
Motion Score:    text-2xl                (1.5rem)
Large Metrics:   text-3xl                (1.875rem)
Stats:           text-xl                 (1.25rem)
Labels:          text-xs                 (0.75rem)
Body:            text-base md:text-lg    (1rem - 1.125rem)
```

### Font Weights
```
Black:      font-black    (900)
Bold:       font-bold     (700)
Semibold:   font-semibold (600)
Medium:     font-medium   (500)
```

## Spacing System

### Padding
```
Card:         p-6 md:p-8           (1.5rem - 2rem)
Metric:       p-3 md:p-4           (0.75rem - 1rem)
Button:       px-6 py-3 md:px-8 py-4
```

### Gaps
```
Grid:         gap-6 md:gap-8       (1.5rem - 2rem)
Inline:       gap-2 md:gap-3       (0.5rem - 0.75rem)
Stats:        gap-3                (0.75rem)
```

### Margins
```
Section:      py-8                 (2rem)
Header:       mb-6                 (1.5rem)
Element:      mb-4                 (1rem)
Tight:        mb-2                 (0.5rem)
```

## Border Styles

### Widths
```
Standard:     border              (1px)
Thick:        border-2            (2px)
Extra:        border-4            (4px)
```

### Radius
```
Small:        rounded-xl          (0.75rem)
Medium:       rounded-2xl         (1rem)
Large:        rounded-3xl         (1.5rem)
Full:         rounded-full        (9999px)
```

### Colors
```
Default:      border-zinc-800
Active:       border-[#D1FD0A]
Hover:        border-[#D1FD0A]/50
Subtle:       border-zinc-700
```

## Shadow Effects

### Standard Shadows
```css
Glass Card:
  box-shadow: 0 0 40px rgba(209, 253, 10, 0.15)

Card Hover:
  box-shadow: 0 20px 40px rgba(209, 253, 10, 0.3)

Button Hover:
  box-shadow: 0 0 40px rgba(209, 253, 10, 0.7)
```

### Glow Effects
```css
Primary Glow:
  shadow-[#D1FD0A]/50

Intense Glow:
  shadow-[#D1FD0A]/70

Subtle Glow:
  shadow-[#D1FD0A]/30
```

## Icon Sizes

```
Small:        w-4 h-4             (1rem)
Medium:       w-5 h-5             (1.25rem)
Large:        w-6 h-6             (1.5rem)
Extra:        w-8 h-8             (2rem)
```

## Component States

### Default
```css
background: glass-premium
border: 2px solid #D1FD0A/50
opacity: 1
```

### Hover
```css
transform: translateY(-2px)
border: 2px solid #D1FD0A
box-shadow: 0 20px 40px rgba(209, 253, 10, 0.3)
```

### Active/Selected
```css
border: 2px solid #D1FD0A
box-shadow: 0 0 40px rgba(209, 253, 10, 0.5)
scale: 1.1
```

### Disabled
```css
opacity: 0.5
cursor: not-allowed
filter: grayscale(50%)
```

## Animation Timings

### Transitions
```css
Fast:         150ms
Default:      300ms
Slow:         500ms
Easing:       cubic-bezier(0.4, 0, 0.2, 1)
```

### Framer Motion
```typescript
duration: 0.4
ease: [0.4, 0, 0.2, 1]  // Custom easing
```

### Pulse
```css
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
```

## Interactive Elements

### Button Styles

**Primary (Buy Keys):**
```css
background: #D1FD0A
color: #000000
font-weight: 900
padding: 1rem 2rem
border-radius: 0.75rem
box-shadow: 0 0 40px rgba(209, 253, 10, 0.5)

hover:
  background: #B8E309
  box-shadow: 0 0 60px rgba(209, 253, 10, 0.7)
```

**Secondary (Clips):**
```css
background: #1a1a1a
color: #D1FD0A
border: 2px solid #D1FD0A
font-weight: 700
padding: 1rem 1.5rem

hover:
  background: #262626
  box-shadow: 0 0 30px rgba(209, 253, 10, 0.3)
```

**Tertiary (Details):**
```css
background: #1a1a1a
color: #ffffff
border: 1px solid #3B3B3B
font-weight: 600

hover:
  border-color: #D1FD0A/50
  color: #D1FD0A
```

### Navigation Controls
```css
background: #171717
padding: 0.75rem
border: 2px solid #3B3B3B
border-radius: 0.75rem

hover:
  border-color: #D1FD0A/50
  box-shadow: 0 0 20px rgba(209, 253, 10, 0.2)
```

## Metric Cards

### Structure
```
┌─────────────────┐
│ Label (xs)      │
│ ────────────    │
│ Value (3xl)     │
│ LED Font        │
└─────────────────┘
```

### Styles
```css
background: glass-interactive
padding: 1rem
border: 1px solid #3B3B3B
border-radius: 0.75rem

hover:
  border-color: #D1FD0A/30
```

### Color Coding
```
Market Cap:    #00FF88  (green - success)
Holders:       #FFFFFF  (white - neutral)
Price:         #D1FD0A  (lime - primary)
Views:         #D1FD0A  (lime - primary)
Upvotes:       #FFFFFF  (white - neutral)
Comments:      #FFFFFF  (white - neutral)
```

## Motion Bar

### Structure
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 93%
```

### Styles
```css
Track:
  height: 1rem
  background: #1a1a1a
  border: 2px solid #3B3B3B
  border-radius: 9999px

Fill:
  background: linear-gradient(to right, #D1FD0A, #00FF88)
  box-shadow: 0 0 20px rgba(209, 253, 10, 0.5)
  transition: width 500ms ease
```

## Responsive Breakpoints

```css
Mobile:       < 768px
Tablet:       768px - 1024px
Desktop:      > 1024px
Wide:         > 1440px
```

### Layout Changes

**Mobile:**
- Single column
- Logo 160x160px
- Stats stack vertically
- Full-width buttons
- Simplified navigation

**Tablet:**
- Two column grid starts
- Logo 200x200px
- Stats in 2-column grid
- Combined buttons

**Desktop:**
- Full two-column layout
- Logo 240x240px
- Stats in 3-column grid
- All features visible

## Accessibility

### Color Contrast Ratios
```
Primary on Black:     16.8:1  (AAA)
White on Black:       21:1    (AAA)
Muted on Black:       12.6:1  (AAA)
Lime on Glass:        14.2:1  (AAA)
```

### Focus Indicators
```css
focus:
  outline: 2px solid #D1FD0A
  outline-offset: 2px
```

### ARIA Labels
- All interactive elements labeled
- Icon buttons have descriptive labels
- Status changes announced
- Navigation context provided

## Performance

### Critical CSS
```
- Glass effects
- Typography
- Color variables
- Layout grid
```

### Deferred
```
- Animations
- Hover effects
- Transition timings
```

### Image Optimization
- Logo: WebP format, 240x240px max
- Thumbnails: 100x100px
- Lazy loading on thumbnails
- Error fallback to initials

## Browser Compatibility

```
Chrome:     90+  ✓
Firefox:    88+  ✓
Safari:     14+  ✓
Edge:       90+  ✓
```

### Fallbacks
- CSS Grid → Flexbox
- backdrop-filter → solid background
- Custom fonts → system-ui
- Animations → reduced motion
