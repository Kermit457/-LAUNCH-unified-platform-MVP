# BTDEMO Visual Guide

**Complete visual specification for the /btdemo showcase page**

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (Sticky)                                            [🔔][⚙] │
│ ┌──┐                                                              │
│ │🎯│ BATTLETECH DESIGN SYSTEM                                    │
│ └──┘ 47 Icons • Complete Component Library                       │
│                                                                   │
│ [Overview] [Icons] [Components] [Interactions] ← Active Tab Glow │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ MAIN CONTENT AREA                                                 │
│                                                                   │
│ ┌───────────────────────────────────────────┐                    │
│ │ Platform Overview                         │                    │
│ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │                    │
│ │ │92.4 │ │1,234│ │45.2K│ │2.8M │         │ ← LED Numbers      │
│ │ └─────┘ └─────┘ └─────┘ └─────┘         │                    │
│ └───────────────────────────────────────────┘                    │
│                                                                   │
│ Featured Projects                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                             │
│ │ [Hot]   │ │[Trending]│ │ [New]  │ ← Badges                    │
│ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │                             │
│ │ │ 🎯  │ │ │ │ 💻  │ │ │ │ 💰  │ │ ← Project Icons            │
│ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │                             │
│ │ Quantum │ │ Neural  │ │ Cyber   │                             │
│ │ [👁][📤]│ │ [👁][📤]│ │ [👁][📤]│ ← Actions                   │
│ └─────────┘ └─────────┘ └─────────┘                             │
│                                                                   │
│ [More sections below...]                                          │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Color Palette

### Primary Colors
```
LIME (Primary)     #D1FD0A  ████████  Text, borders, glow
Lime Hover         #B8E309  ████████  Interactive states
```

### Neutrals
```
Canvas             #000000  ████████  Background
Card Base          rgba(8, 8, 9, 0.60)  ████████  Cards
Card Hover         rgba(23, 23, 23, 0.60)  ████████  Active cards
Border             #3B3B3B  ████████  Default borders
```

### Text
```
Primary Text       #FFFFFF  ████████  Headlines, body
Muted Text         rgba(255, 255, 255, 0.60)  ████████  Secondary
Disabled Text      rgba(255, 255, 255, 0.40)  ████████  Inactive
```

### Accent Colors (Icons)
```
Cyan               #00FFFF  ████████  Solana, tech icons
Green              #00FF88  ████████  Money, positive
Gold               #FFD700  ████████  Achievement, top
Purple             #A855F7  ████████  Market cap, premium
Red                #FF4444  ████████  Alert, negative
Orange             #FF9900  ████████  Warning, notification
Blue               #1DA1F2  ████████  Twitter, social
```

---

## Typography System

### Display Font
```
Font Family:  'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial
Usage:        Headlines, titles, buttons
Weights:      Bold (700)
```

### Body Font
```
Font Family:  'Inter Tight', 'Inter', sans-serif
Usage:        Body text, descriptions
Weights:      Regular (400), Semibold (600)
```

### LED Display Font (Numbers)
```
Font Family:  'DSEG14', monospace
Usage:        Scores, stats, prices
Sizes:        15px, 16px, 32px
Letter Space: -1.28px
Color:        LIME (#D1FD0A)
Example:      92.4  (Motion Score)
```

---

## Component Specifications

### 1. Header (Sticky)
```
Height:           Desktop: 96px | Mobile: 80px
Background:       rgba(8, 8, 9, 0.8)
Backdrop Blur:    12px
Border Bottom:    1px solid #3B3B3B
Z-Index:          50

Logo Area:
  Icon Size:      Desktop: 56px | Mobile: 48px
  Icon Glow:      12.5px blur, 60% opacity
  Title Size:     Desktop: 32px | Mobile: 24px
  Title Color:    #D1FD0A
  Title Shadow:   0 0 20px rgba(209, 253, 10, 0.5)

Tab Navigation:
  Height:         40px
  Padding:        16px horizontal, 8px vertical
  Active BG:      rgba(209, 253, 10, 0.15)
  Active Border:  1px solid #D1FD0A
  Active Glow:    8px blur, 40% opacity
  Inactive Text:  rgba(255, 255, 255, 0.60)
```

### 2. Stats Dashboard
```
Layout:           4-column grid (2-col mobile)
Gap:              24px (16px mobile)
Background:       rgba(8, 8, 9, 0.60)
Backdrop Blur:    4px
Border Radius:    24px (20px mobile)
Border:           0.8px solid #3B3B3B
Padding:          48px (32px mobile)

Stat Item:
  Icon Size:      20px
  Label Size:     12px uppercase
  Label Color:    #71717A (zinc-500)
  Value Font:     DSEG14, 32px (24px mobile)
  Value Color:    Varies by type
  Letter Space:   -1.28px
```

### 3. Project Cards
```
Layout:           3-column grid (1-col mobile)
Width:            Auto (fills grid)
Height:           Auto (min 280px)
Background:       rgba(8, 8, 9, 0.60)
Backdrop Blur:    4px
Border Radius:    20px
Border:           0.8px solid #3B3B3B
Padding:          24px
Transition:       all 300ms ease

Hover State:
  Background:     rgba(23, 23, 23, 0.60)
  Transform:      translateY(-4px)
  Border:         0.8px solid #D1FD0A (if selected)
  Glow:           20px blur, 30% opacity (if selected)

Badge:
  Position:       Absolute top-4 right-4
  Padding:        12px 16px
  Background:     rgba(209, 253, 10, 0.15)
  Border:         1px solid #D1FD0A
  Border Radius:  9999px (full)
  Font Size:      12px bold
  Color:          #D1FD0A

Icon Container:
  Size:           64px × 64px
  Background:     rgba(209, 253, 10, 0.1)
  Border:         1px solid #D1FD0A
  Border Radius:  12px
  Icon Size:      24px
  Icon Color:     #D1FD0A

Action Buttons:
  Size:           32px × 32px
  Background:     rgba(255, 255, 255, 0.05)
  Border:         1px solid rgba(255, 255, 255, 0.1)
  Border Radius:  8px
  Icon Size:      16px
  Icon Color:     #A1A1AA (zinc-400)
  Hover Color:    #FFFFFF
```

### 4. Icon Grid (Icons Tab)
```
Layout:           6-column grid (2-col mobile)
Gap:              16px
Background:       rgba(8, 8, 9, 0.60)
Backdrop Blur:    4px
Border Radius:    24px
Padding:          48px (32px mobile)

Icon Cell:
  Width:          Auto (fills grid)
  Height:         Auto (min 120px)
  Padding:        16px
  Background:     transparent → rgba(255, 255, 255, 0.05)
  Border:         1px transparent → 1px #D1FD0A
  Border Radius:  12px
  Transition:     all 200ms ease

Icon Container:
  Size:           64px × 64px
  Background:     rgba(255, 255, 255, 0.03) → rgba(209, 253, 10, 0.1)
  Border:         1px rgba(255, 255, 255, 0.05) → 1px #D1FD0A
  Border Radius:  12px
  Icon Size:      24px
  Transform:      scale(1.0) → scale(1.1)
  Glow:           12px blur, 40% opacity (on hover)

Label:
  Font Size:      12px
  Font Weight:    500 (medium)
  Color:          rgba(255, 255, 255, 0.60) → #D1FD0A
  Text Align:     Center
```

### 5. Button System

**Primary Button (LIME Glow)**
```
Padding:          24px 32px
Background:       #D1FD0A
Color:            #000000
Border Radius:    12px
Font Size:        16px
Font Weight:      700 (bold)
Font Family:      Helvetica Now Display

Glow Effect:
  Position:       Absolute, -z-10
  Background:     #D1FD0A
  Filter:         blur(12.5px)
  Opacity:        0.6 → 0.8 (hover)
  Border Radius:  12px
  Transition:     opacity 300ms

Icon:
  Size:           20px
  Color:          #000000
  Margin:         0 8px (gap)
```

**Secondary Button (Glass)**
```
Padding:          24px 32px
Background:       rgba(8, 8, 9, 0.6)
Color:            #FFFFFF
Border:           0.8px solid #3B3B3B
Border Radius:    12px
Backdrop Blur:    2px
Font Size:        16px
Font Weight:      700
Font Family:      Helvetica Now Display

Hover State:
  Background:     rgba(23, 23, 23, 0.6)
  Border:         0.8px solid rgba(255, 255, 255, 0.2)

Icon:
  Size:           20px
  Color:          #A1A1AA → #FFFFFF (hover)
  Transition:     colors 200ms
```

### 6. List Items
```
Padding:          16px
Background:       rgba(8, 8, 9, 0.4)
Border:           1px solid rgba(255, 255, 255, 0.05)
Border Radius:    12px
Transition:       all 200ms ease

Hover State:
  Background:     rgba(23, 23, 23, 0.6)
  Border:         1px solid rgba(255, 255, 255, 0.1)
  Transform:      translateX(4px)

Icon:
  Size:           20px
  Color:          #D1FD0A
  Margin Right:   12px

Title:
  Font Size:      16px
  Font Weight:    600 (semibold)
  Color:          #FFFFFF

Description:
  Font Size:      14px
  Font Weight:    400 (regular)
  Color:          rgba(255, 255, 255, 0.60)

Right Element:
  Icon Size:      20px
  Color:          #71717A (zinc-500)
```

---

## Background Effects

### Blob 1 (Top Left)
```
Position:         top-0, left-0
Size:             325px × 325px
Background:       #2C2E2F (gray)
Opacity:          30%
Filter:           blur(325px)
Animation:        blob 20s ease-in-out infinite
```

### Blob 2 (Bottom Right)
```
Position:         bottom-0, right-0
Size:             325px × 325px
Background:       #435200 (olive)
Opacity:          20%
Filter:           blur(325px)
Animation:        blob 20s ease-in-out infinite
Animation Delay:  2s
```

### Blob 3 (Center)
```
Position:         center (translate -50%, -50%)
Size:             325px × 325px
Background:       #D1FD0A (lime)
Opacity:          10%
Filter:           blur(325px)
Animation:        blob 20s ease-in-out infinite
Animation Delay:  4s
```

---

## Animation Specifications

### Blob Animation (20s loop)
```css
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(40px, 40px) scale(1.05);
  }
}
```

### Icon Hover (200ms)
```css
transition: transform 200ms ease, colors 200ms ease

/* Default State */
transform: scale(1);
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.05);

/* Hover State */
transform: scale(1.1);
background: rgba(209, 253, 10, 0.1);
border: 1px solid #D1FD0A;
glow: 0 0 12px rgba([color], 0.4);
```

### Card Hover (300ms)
```css
transition: all 300ms ease

/* Default State */
transform: translateY(0);
background: rgba(8, 8, 9, 0.60);
border: 0.8px solid #3B3B3B;

/* Hover State */
transform: translateY(-4px);
background: rgba(23, 23, 23, 0.60);
border: 0.8px solid #D1FD0A (if selected);
box-shadow: 0 0 20px rgba(209, 253, 10, 0.3) (if selected);
```

### Button Glow (300ms)
```css
/* Glow Layer */
position: absolute;
inset: 0;
z-index: -10;
border-radius: inherit;
background: #D1FD0A;
filter: blur(12.5px);
opacity: 0.6;
transition: opacity 300ms ease;

/* Hover State */
opacity: 0.8;
```

### Tab Switch (200ms)
```css
transition: all 200ms ease

/* Inactive Tab */
background: transparent;
color: rgba(255, 255, 255, 0.60);
border: 1px solid transparent;

/* Active Tab */
background: rgba(209, 253, 10, 0.15);
color: #D1FD0A;
border: 1px solid #D1FD0A;
glow: 0 0 8px rgba(209, 253, 10, 0.4);
```

---

## Responsive Breakpoints

### Mobile (<640px)
- 2-column icon grid
- 1-column project cards
- Compact header (48px icon)
- Reduced padding (16px)
- Stacked stats (2-column)

### Tablet (640px - 1024px)
- 3-column icon grid
- 2-column project cards
- Medium spacing (20px)
- 3-column stats

### Desktop (>1024px)
- 6-column icon grid
- 3-column project cards
- Full spacing (24px)
- 4-column stats

---

## Accessibility Features

### Focus States
```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-purple-500
focus-visible:ring-offset-2
focus-visible:ring-offset-black
```

### ARIA Labels
- All buttons have `aria-label`
- Interactive icons have descriptions
- Semantic HTML structure
- Skip links for navigation

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate
- Arrow keys in tab navigation
- Escape to close modals

### Color Contrast
- Text/Background: 7:1 (AAA)
- Interactive elements: 4.5:1 (AA)
- LIME on black: 13.4:1 ✅

---

## Icon Usage Guide

### Size Variants
```typescript
size={16}  // Small (inline text)
size={20}  // Default (buttons, lists)
size={24}  // Large (cards, headers)
```

### Color Classes
```typescript
className="text-[#D1FD0A]"     // Primary LIME
className="text-white"          // White
className="text-zinc-400"       // Muted
className="text-cyan-400"       // Accent cyan
className="text-green-400"      // Accent green
className="text-purple-400"     // Accent purple
```

### Semantic Colors
```
Motion Icons:    #D1FD0A (LIME)
Money Icons:     #00FF88 (Green)
Warning Icons:   #FF9900 (Orange)
Tech Icons:      #00FFFF (Cyan)
Trophy Icons:    #FFD700 (Gold)
```

---

## Code Examples

### Icon Implementation
```typescript
import { IconMotion, IconRocket, IconWallet } from '@/lib/icons'

// Basic usage
<IconMotion size={20} className="text-[#D1FD0A]" />

// With hover effect
<IconRocket
  size={24}
  className="text-zinc-400 hover:text-white transition-colors duration-200"
/>

// In button
<button className="flex items-center gap-2">
  <IconWallet size={20} className="text-white" />
  <span>Connect Wallet</span>
</button>
```

### Card with Glow
```typescript
<div
  className="rounded-2xl p-6 relative"
  style={{
    background: 'rgba(8, 8, 9, 0.60)',
    border: '0.8px solid #3B3B3B',
    backdropFilter: 'blur(4px)',
  }}
>
  {/* Glow effect */}
  <div
    className="absolute inset-0 rounded-2xl opacity-30 -z-10"
    style={{
      background: '#D1FD0A',
      filter: 'blur(20px)',
    }}
  />
  {/* Content */}
</div>
```

### LED Number Display
```typescript
<div
  style={{
    fontFamily: 'DSEG14, monospace',
    fontSize: '32px',
    color: '#D1FD0A',
    letterSpacing: '-1.28px',
  }}
>
  92.4
</div>
```

---

## Performance Metrics

### Bundle Analysis
```
Page Size:        48.1 kB
First Load JS:    801 kB (includes vendor bundle)
Vendor Bundle:    751 kB (shared across pages)
```

### Target Metrics
```
LCP:              <2.5s ✅
FID:              <100ms ✅
CLS:              <0.1 ✅
TTI:              <3.5s ✅
```

---

## Browser Compatibility

| Feature              | Chrome | Firefox | Safari | Edge |
|---------------------|--------|---------|--------|------|
| backdrop-filter     | 76+    | 103+    | 9+     | 79+  |
| CSS Grid            | 57+    | 52+     | 10.1+  | 16+  |
| CSS Variables       | 49+    | 31+     | 9.1+   | 15+  |
| Web Fonts (WOFF2)   | 36+    | 39+     | 10+    | 14+  |

---

**END OF VISUAL GUIDE**
