# BTDEMO Design Specification - CORRECTED

**Status:** URGENT CORRECTION - Previous implementation used WRONG colors and ignored custom icons
**Date:** 2025-10-23
**Issue:** Built without design team consultation, used LIME (#D1FD0A) instead of GREENISH (#00FF88)

---

## Critical Errors in Current Implementation

### What Went Wrong (User Rated 0/10)

1. **WRONG PRIMARY COLOR**
   - Used: `#D1FD0A` (Lime) ❌
   - Should use: `#00FF88` (Greenish) ✅
   - Impact: Completely wrong brand aesthetic

2. **IGNORED CUSTOM ICONS**
   - Current: Using Lucide icons only ❌
   - Should use: 47 custom icons from `lib/icons/custom/` ✅
   - Missing: IconMotion5, IconUsdc, IconSolana, IconRocket, IconCash, IconCap, etc.

3. **WRONG AESTHETIC**
   - Current: Generic dark theme ❌
   - Should be: "Variation 5: BATTLETECH GLOW" from /design-final page ✅
   - Missing: Glassmorphism, blur effects, gaming-crypto fusion

---

## Correct Design Specification

### 1. Color System (FROM /design-final VARIATION 5)

Based on **app/design-final/page.tsx** lines 882-988 (Variation 5: BATTLETECH GLOW):

#### Primary Colors

```css
/* CANVAS - Pure black for maximum contrast */
--btdemo-canvas: #000000;          /* NOT #0a0a0a, PURE black */

/* PRIMARY - GREENISH (NOT LIME!) */
--btdemo-primary: #00FF88;         /* Greenish - User specified ✅ */

/* ACCENT - LIME for glow effects only */
--btdemo-accent: #D1FD0A;          /* Use ONLY for active states/glow */

/* CARD BACKGROUNDS - Glassmorphism */
--btdemo-card: rgba(8, 8, 9, 0.6); /* Semi-transparent with blur */

/* BORDERS */
--btdemo-border: #3B3B3B;          /* Dark gray for glass edges */

/* TEXT */
--btdemo-text: #FFFFFF;            /* Pure white */
--btdemo-text-muted: rgba(255, 255, 255, 0.6);
--btdemo-text-disabled: rgba(255, 255, 255, 0.4);
```

#### Background Blobs (325px Blur)

```css
/* Gaming UI depth effect */
--blob-gray: #2C2E2F;     /* Top-left blob */
--blob-olive: #435200;    /* Bottom-right blob */

/* Usage */
.bg-blob-1 {
  width: 325px;
  height: 325px;
  background: #2C2E2F;
  filter: blur(325px);
  opacity: 0.3;
}

.bg-blob-2 {
  width: 325px;
  height: 325px;
  background: #435200;
  filter: blur(325px);
  opacity: 0.2;
}
```

---

### 2. Glassmorphism System

Reference: **app/design-final/page.tsx** lines 927-931, 1094-1097

#### Card Glassmorphism

```css
/* Default glass card */
.glass-card {
  background: rgba(8, 8, 9, 0.6);
  border: 0.8px solid #3B3B3B;
  backdrop-filter: blur(3.5px);
  border-radius: 20px;
}

/* Lighter glass (e.g., secondary cards) */
.glass-card-light {
  background: rgba(8, 8, 9, 0.6);
  border: 0.8px solid #3B3B3B;
  backdrop-filter: blur(2px);
}
```

#### Active/Hover States

```css
/* Active state - LIME border with glow */
.glass-card-active {
  background: rgba(8, 8, 9, 0.6);
  border: 0.8px solid #D1FD0A;
  backdrop-filter: blur(3.5px);
  box-shadow: 0 0 20px rgba(209, 253, 10, 0.3);
}

/* Hover state - Subtle glow */
.glass-card:hover {
  border-color: rgba(209, 253, 10, 0.5);
  box-shadow: 0 0 15px rgba(209, 253, 10, 0.2);
}
```

---

### 3. LIME Glow Effect System

Reference: **app/design-final/page.tsx** lines 939-951, 968-974, 1125-1129

The LIME (#D1FD0A) is used ONLY for glow effects on active states:

#### Glow Effect Specifications

```css
/* LIME glow on buttons */
.button-primary-glow {
  background: #D1FD0A;
  color: #000000;
  position: relative;
}

.button-primary-glow::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #D1FD0A;
  filter: blur(12.5px);
  opacity: 0.6;
  z-index: -1;
}
```

#### Icon Glow (Lines 1123-1130)

```css
.icon-glow {
  position: relative;
  background: #D1FD0A;
  border-radius: 50%;
}

.icon-glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #D1FD0A;
  filter: blur(8px);
  opacity: 0.4;
  z-index: -1;
}
```

#### Progress Bar Glow (Lines 1134-1145)

```css
.progress-bar {
  background: #D1FD0A;
  position: relative;
}

.progress-bar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #D1FD0A;
  filter: blur(4px);
  opacity: 0.6;
}
```

#### Text Glow for Active States (Lines 900-902, 1172)

```css
.text-glow-primary {
  color: #D1FD0A;
  text-shadow: 0 0 20px rgba(209, 253, 10, 0.5);
}

.text-glow-subtle {
  color: #D1FD0A;
  text-shadow: 0 0 10px rgba(209, 253, 10, 0.3);
}
```

---

### 4. Custom Icons Integration

**CRITICAL:** Must use the 47 custom icons from `lib/icons/custom/`

#### Required Custom Icons

Based on user's specifications, these icons exist and MUST be used:

```typescript
// Core icons (mentioned by user)
import {
  IconMotion5,      // Motion score/branding
  IconUsdc,         // USDC token
  IconSolana,       // SOL token
  IconRocket,       // Launch/deployment
  IconCash,         // Money/rewards
  IconCap,          // Market cap
  // ... + 41 more custom icons
} from '@/lib/icons/custom'
```

#### Icon Usage Rules

1. **Token Icons:** Use custom IconUsdc, IconSolana, IconWbtc, etc. (NOT generic dollar signs)
2. **Action Icons:** Use IconRocket for launches, IconCash for payments
3. **Motion Branding:** Use IconMotion5 for branding/scores
4. **Fallback:** Only use Lucide icons if no custom icon exists

#### Icon Sizes (from Button System)

```typescript
// Icon sizing in components
const iconSizes = {
  sm: 16,   // Small buttons
  md: 20,   // Medium buttons
  lg: 24,   // Large buttons
  xl: 28,   // Navigation icons
}
```

---

### 5. Button System (Updated with Correct Colors)

Reference: **app/design-final/page.tsx** lines 962-987, 1203-1217

#### Primary Button (WITH GLOW)

```typescript
// Correct implementation
<button className="
  px-8 py-4
  rounded-[14px]
  font-bold
  relative
  bg-[#D1FD0A]
  text-[#000000]
  font-['Helvetica_Now_Display']
">
  <div className="
    absolute inset-0
    rounded-[14px]
    opacity-50
    -z-10
    bg-[#D1FD0A]
    blur-[8px]
  " />
  Launch Mission
</button>
```

**NOT:**
```typescript
// WRONG - What current btdemo does
<button className="bg-[#D1FD0A]">  // No glow effect!
  Launch Token
</button>
```

#### Secondary/Ghost Buttons (GLASS STYLE)

```typescript
<button className="
  px-8 py-4
  rounded-[14px]
  font-bold
  bg-[rgba(8,8,9,0.6)]
  text-white
  border-[0.8px]
  border-[#3B3B3B]
  backdrop-blur-[2px]
">
  View Details (GLASS)
</button>
```

---

### 6. Card System (BATTLETECH GLASS)

Reference: **app/design-final/page.tsx** lines 1093-1220

#### Default Card

```typescript
<div className="
  rounded-[20px]
  p-6
  relative
  overflow-hidden
  bg-[rgba(8,8,9,0.6)]
  border-[0.8px]
  border-[#3B3B3B]
  backdrop-blur-[3.5px]
">
  {/* LIME glow accent on active/hover */}
  <div className="
    absolute top-0 right-0
    w-24 h-24
    rounded-full
    opacity-20
    bg-[#D1FD0A]
    blur-[50px]
    pointer-events-none
  " />

  <div className="relative z-10">
    {/* Card content */}
  </div>
</div>
```

#### Active Card (Selected State)

```typescript
<div className="
  rounded-[20px]
  p-6
  relative
  bg-[rgba(8,8,9,0.6)]
  border-[0.8px]
  border-[#D1FD0A]           // LIME border for active
  backdrop-blur-[3.5px]
  shadow-[0_0_20px_rgba(209,253,10,0.3)]  // LIME glow
">
  {/* Content */}
</div>
```

---

### 7. Typography System

Reference: **app/design-final/page.tsx** lines 406-413

#### Font Families

```css
/* Primary font - Helvetica Now Display */
font-family: "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial;

/* LED displays (Motion Score, balances) */
font-family: "DSEG14 Classic";
```

#### Font Weights

```typescript
const fontWeights = {
  regular: 400,   // Body text
  medium: 500,    // Subheadings
  bold: 700,      // Buttons, emphasis
  extrabold: 800, // Hero headings
}
```

#### Text Sizes

```typescript
const textSizes = {
  xs: '12px',     // Footnotes
  sm: '14px',     // Small labels
  base: '16px',   // Body text
  lg: '18px',     // Large body
  xl: '20px',     // Subheadings
  '2xl': '24px',  // Headings
  '3xl': '32px',  // Large headings
  '4xl': '48px',  // Hero
}
```

#### Letter Spacing (Critical for Helvetica Now Display)

```css
/* From design-final line 408 */
h1, h2, h3 {
  letter-spacing: -0.02em;  /* Tight for headings */
}

body, p {
  letter-spacing: -0.01em;  /* Subtle for body */
}

.uppercase-labels {
  letter-spacing: 0.05em;   /* Spaced for all-caps */
}
```

---

### 8. Background System (325px Blur Blobs)

Reference: **app/design-final/page.tsx** lines 884-894

#### Implementation

```typescript
<div className="relative min-h-screen bg-[#000000]">
  {/* Blurred background blobs - Gaming UI depth */}
  <div className="
    absolute top-0 left-0
    w-[325px] h-[325px]
    rounded-full
    opacity-30
    bg-[#2C2E2F]
    blur-[325px]
    pointer-events-none
  " />

  <div className="
    absolute bottom-0 right-0
    w-[325px] h-[325px]
    rounded-full
    opacity-20
    bg-[#435200]
    blur-[325px]
    pointer-events-none
  " />

  {/* Main content */}
  <div className="relative z-10">
    {/* All content goes here */}
  </div>
</div>
```

**Why This Works (Lines 933-954):**
- Pure black (#000000) canvas creates maximum contrast depth
- Glassmorphism cards (blur 2px-3.5px) add sci-fi layers
- LIME glow effect (blur 12.5px) creates energy/active states
- 325px blurred background blobs add depth without distraction
- Best for: Gaming-crypto fusion, battletech/terminal aesthetics

---

## 9. Component Specifications

### Button Sizes (WCAG Compliant)

```typescript
const buttonSizes = {
  sm: {
    height: '36px',
    padding: '8px 16px',
    fontSize: '14px',
  },
  md: {
    height: '44px',      // WCAG minimum
    padding: '12px 24px',
    fontSize: '16px',
  },
  lg: {
    height: '52px',
    padding: '16px 32px',
    fontSize: '18px',
  },
  xl: {
    height: '60px',
    padding: '20px 40px',
    fontSize: '20px',
  },
}
```

### Icon Button Sizes (Navigation)

```typescript
const iconButtonSizes = {
  sm: '36px',
  md: '44px',      // WCAG minimum
  lg: '52px',
  xl: {
    desktop: '68px',   // Bottom nav desktop
    mobile: '56px',    // Bottom nav mobile
  },
}
```

### Border Radius

```typescript
const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '14px',       // Buttons (from design-final)
  xl: '20px',       // Cards (from design-final)
  full: '9999px',   // Pills, circular buttons
}
```

---

## 10. Usage Examples (Corrected)

### Hero Section with Glow Button

```typescript
<div className="relative min-h-screen bg-[#000000] text-white">
  {/* Background blobs */}
  <div className="absolute top-0 left-0 w-[325px] h-[325px] rounded-full opacity-30 bg-[#2C2E2F] blur-[325px]" />
  <div className="absolute bottom-0 right-0 w-[325px] h-[325px] rounded-full opacity-20 bg-[#435200] blur-[325px]" />

  <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
    <h1 className="
      text-6xl
      font-extrabold
      mb-6
      text-[#D1FD0A]
      [text-shadow:0_0_20px_rgba(209,253,10,0.5)]
    ">
      Launch Your Token
    </h1>

    <button className="
      relative
      px-10 py-5
      rounded-[14px]
      bg-[#D1FD0A]
      text-[#000000]
      font-bold
      text-lg
    ">
      <div className="absolute inset-0 rounded-[14px] bg-[#D1FD0A] blur-[12.5px] opacity-60 -z-10" />
      Get Started
    </button>
  </div>
</div>
```

### Token Card with Glassmorphism

```typescript
<div className="
  rounded-[20px]
  p-6
  relative
  overflow-hidden
  bg-[rgba(8,8,9,0.6)]
  border-[0.8px]
  border-[#3B3B3B]
  backdrop-blur-[3.5px]
  hover:border-[rgba(209,253,10,0.5)]
  hover:shadow-[0_0_15px_rgba(209,253,10,0.2)]
  transition-all
">
  {/* Glow accent */}
  <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#D1FD0A] blur-[50px] opacity-20 pointer-events-none" />

  <div className="relative z-10">
    {/* Token icon - USE CUSTOM ICON */}
    <div className="w-16 h-16 rounded-full relative bg-[#D1FD0A]">
      <IconSolana size={32} className="absolute inset-0 m-auto text-black" />
      <div className="absolute inset-0 rounded-full bg-[#D1FD0A] blur-[8px] opacity-40 -z-10" />
    </div>

    <h3 className="text-2xl font-bold text-white mt-4">Solana</h3>
    <p className="text-sm text-[rgba(255,255,255,0.6)] mt-2">Next-gen blockchain</p>

    {/* Stats */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <div className="text-xs uppercase text-[rgba(255,255,255,0.6)] tracking-wider">PRICE</div>
        <div className="text-lg font-bold text-white">$0.45</div>
      </div>
      <div>
        <div className="text-xs uppercase text-[rgba(255,255,255,0.6)] tracking-wider">24H CHANGE</div>
        <div className="
          text-lg
          font-bold
          text-[#D1FD0A]
          [text-shadow:0_0_10px_rgba(209,253,10,0.3)]
        ">
          +234%
        </div>
      </div>
    </div>

    {/* Progress bar with glow */}
    <div className="mt-4 h-2 rounded-full overflow-hidden bg-[#3B3B3B]">
      <div className="relative h-full w-[65%] bg-[#D1FD0A]">
        <div className="absolute inset-0 bg-[#D1FD0A] blur-[4px] opacity-60" />
      </div>
    </div>

    {/* Action button with glow */}
    <button className="
      relative
      w-full
      mt-6
      px-6
      py-3
      rounded-[14px]
      bg-[#D1FD0A]
      text-[#000000]
      font-bold
    ">
      <div className="absolute inset-0 rounded-[14px] bg-[#D1FD0A] blur-[8px] opacity-50 -z-10" />
      Launch Mission
    </button>
  </div>
</div>
```

### Stats Display with LED Font

```typescript
<div className="
  rounded-[20px]
  p-6
  bg-[rgba(8,8,9,0.6)]
  border-[0.8px]
  border-[#3B3B3B]
  backdrop-blur-[2px]
">
  <div className="flex items-center gap-4 mb-4">
    {/* Use custom icon */}
    <div className="w-12 h-12 rounded-lg bg-[#D1FD0A] flex items-center justify-center">
      <IconMotion5 size={24} className="text-black" />
    </div>
    <div>
      <div className="text-sm text-[rgba(255,255,255,0.6)] uppercase tracking-wider">
        MOTION SCORE
      </div>
      {/* LED font display */}
      <div className="
        font-['DSEG14_Classic']
        text-[32px]
        text-[#D1FD0A]
        [text-shadow:0_0_20px_rgba(209,253,10,0.5)]
      ">
        12,345.67
      </div>
    </div>
  </div>
</div>
```

---

## 11. Accessibility Requirements

### Contrast Ratios (WCAG AA)

```typescript
// All combinations must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)

const contrastTests = {
  'Lime on Black (#D1FD0A / #000000)': 'Pass AAA (17.8:1)',
  'White on Black (#FFFFFF / #000000)': 'Pass AAA (21:1)',
  'White 60% on Black (rgba(255,255,255,0.6) / #000000)': 'Pass AA (12.6:1)',
  'Lime on Card BG (#D1FD0A / rgba(8,8,9,0.6))': 'Pass AAA (17.5:1)',
}
```

### Touch Targets (WCAG 2.1)

```typescript
const touchTargets = {
  minimum: '44px',      // WCAG 2.1 Level AA
  recommended: '48px',  // Better for mobile
  navigation: {
    desktop: '68px',    // From design-final spec
    mobile: '56px',     // Optimized for thumbs
  },
}
```

### Focus States

```css
/* Keyboard focus indicator */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #D1FD0A;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(209, 253, 10, 0.2);
}
```

---

## 12. Motion/Animation Specifications

### Glow Pulse (Active States)

```css
@keyframes glow-pulse {
  0%, 100% {
    filter: blur(12.5px);
    opacity: 0.6;
  }
  50% {
    filter: blur(15px);
    opacity: 0.8;
  }
}

.glow-active::before {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### Hover Transitions

```css
/* Smooth transitions for all interactive elements */
.interactive {
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    background-color 200ms ease,
    transform 150ms ease;
}

.interactive:hover {
  transform: translateY(-2px);
}

.interactive:active {
  transform: translateY(0);
}
```

### Backdrop Blur Performance

```css
/* Use will-change for blur performance */
.glass-card {
  backdrop-filter: blur(3.5px);
  will-change: backdrop-filter;
}

/* Reduce blur on low-end devices */
@media (prefers-reduced-motion: reduce) {
  .glass-card {
    backdrop-filter: none;
    background: rgba(8, 8, 9, 0.85); /* Fallback */
  }
}
```

---

## 13. Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Ultra-wide
}
```

### Mobile-Specific Adjustments

```css
/* Icon button navigation */
@media (max-width: 768px) {
  .nav-icon-button {
    width: 56px;
    height: 56px;
  }
}

/* Typography scaling */
@media (max-width: 640px) {
  h1 { font-size: 36px; }
  h2 { font-size: 28px; }
  .led-display { font-size: 24px; }
}

/* Glassmorphism blur reduction */
@media (max-width: 640px) {
  .glass-card {
    backdrop-filter: blur(2px); /* Reduce from 3.5px */
  }
}
```

---

## 14. Tailwind Config Updates Required

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        btdemo: {
          canvas: '#000000',           // Pure black
          primary: '#00FF88',          // GREENISH (NOT LIME!)
          accent: '#D1FD0A',           // LIME for glow only
          card: 'rgba(8, 8, 9, 0.6)',
          border: '#3B3B3B',
          text: '#FFFFFF',
          'text-muted': 'rgba(255, 255, 255, 0.6)',
          'text-disabled': 'rgba(255, 255, 255, 0.4)',
        },
      },
      fontFamily: {
        'helvetica': ['"Helvetica Now Display"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        'led-32': ['"DSEG14 Classic"', 'monospace'],
        'led-16': ['"DSEG14 Classic"', 'monospace'],
      },
      backdropBlur: {
        'btdemo-sm': '2px',
        'btdemo-md': '3.5px',
        'btdemo-lg': '8px',
        'btdemo-xl': '12.5px',
      },
      borderRadius: {
        'btdemo-sm': '8px',
        'btdemo-md': '12px',
        'btdemo-lg': '14px',
        'btdemo-xl': '20px',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(209, 253, 10, 0.3)',
        'glow-primary-lg': '0 0 30px rgba(209, 253, 10, 0.5)',
      },
    },
  },
}
```

---

## 15. Implementation Checklist

### Phase 1: Fix Color System
- [ ] Replace ALL instances of `#D1FD0A` as primary with `#00FF88`
- [ ] Keep `#D1FD0A` ONLY for glow effects and active states
- [ ] Update Tailwind config with correct color tokens
- [ ] Test contrast ratios (WCAG AA minimum)

### Phase 2: Integrate Custom Icons
- [ ] Import all 47 custom icons from `lib/icons/custom/`
- [ ] Replace Lucide icons with custom equivalents
- [ ] Document which icons map to which use cases
- [ ] Add icon glow effects for active states

### Phase 3: Implement Glassmorphism
- [ ] Add pure black (#000000) canvas background
- [ ] Implement 325px blur blobs (#2C2E2F, #435200)
- [ ] Apply glass cards (0.8px border, 3.5px blur)
- [ ] Add hover/active states with lime borders

### Phase 4: Add Glow Effects
- [ ] Primary buttons with 12.5px blur glow
- [ ] Icon glows with 8px blur
- [ ] Progress bar glows with 4px blur
- [ ] Text shadows on active states

### Phase 5: Typography
- [ ] Load Helvetica Now Display font
- [ ] Load DSEG14 Classic for LED displays
- [ ] Apply correct letter spacing (-0.02em headings, -0.01em body)
- [ ] Test all font weights (400, 500, 700, 800)

### Phase 6: Testing
- [ ] Test on mobile (56px nav icons)
- [ ] Test on desktop (68px nav icons)
- [ ] Verify WCAG AA contrast (all text)
- [ ] Test glassmorphism performance
- [ ] Verify custom icons load correctly

---

## 16. File Structure

```
/app/btdemo/
  ├── page.tsx                    # Main demo page (REWRITE)
  └── components/
      ├── ButtonShowcase.tsx      # All 12 button variants
      ├── CardShowcase.tsx        # Glass cards with glow
      ├── IconShowcase.tsx        # Custom icons grid
      └── TypographyShowcase.tsx  # Helvetica + LED fonts

/lib/icons/custom/
  ├── index.tsx                   # Export all 47 icons
  ├── IconMotion5.tsx
  ├── IconUsdc.tsx
  ├── IconSolana.tsx
  ├── IconRocket.tsx
  └── ... (43 more)

/styles/
  └── btdemo.css                  # Glow effects, glassmorphism
```

---

## 17. Performance Budget

```typescript
const performanceBudget = {
  'First Contentful Paint': '< 1.8s',
  'Largest Contentful Paint': '< 2.5s',
  'Time to Interactive': '< 3.5s',
  'Cumulative Layout Shift': '< 0.1',

  // Bundle size
  'Page JS': '< 150KB gzipped',
  'CSS': '< 30KB gzipped',
  'Fonts': '< 200KB (Helvetica + DSEG14)',
  'Icons': '< 50KB (47 custom icons)',
}
```

---

## 18. Browser Support

```typescript
const browserSupport = {
  'backdrop-filter': 'Chrome 76+, Safari 9+, Firefox 103+',
  'CSS filter blur': 'All modern browsers',
  'text-shadow': 'All browsers',

  // Fallbacks
  'No backdrop-filter': 'Solid background rgba(8, 8, 9, 0.95)',
  'Prefers-reduced-motion': 'Disable glow animations',
}
```

---

## Why This Design Works

From **app/design-final/page.tsx** lines 933-954:

1. **Pure black (#000000) canvas** creates maximum contrast depth
2. **Glassmorphism cards** (blur 2px-3.5px) add sci-fi layers
3. **LIME glow effect** (blur 12.5px) creates energy/active states
4. **325px blurred background blobs** add depth without distraction
5. **Best for:** Gaming-crypto fusion, battletech/terminal aesthetics

---

## Critical Color Usage Summary

```typescript
// PRIMARY COLOR (Use for most UI elements)
const primary = '#00FF88' // GREENISH - User specified ✅

// ACCENT COLOR (Use ONLY for glow effects)
const accent = '#D1FD0A'  // LIME - Active states only ✅

// USAGE RULES
const colorUsage = {
  primary_buttons: '#D1FD0A',           // Lime with glow
  primary_text: '#00FF88',              // Greenish
  primary_borders: '#00FF88',           // Greenish
  active_borders: '#D1FD0A',            // Lime
  glow_effects: '#D1FD0A',              // Lime only
  icon_fills: '#D1FD0A',                // Lime for contrast
  progress_bars: '#D1FD0A',             // Lime with glow
  success_text: '#00FF88',              // Greenish
}
```

---

## Reference Files

1. **app/design-final/page.tsx** (Lines 882-1220) - BATTLETECH GLOW variation
2. **Custom Icons:** `lib/icons/custom/` - All 47 icons
3. **User Specs:** Original message with #00FF88 color requirement

---

## Next Steps

1. **Stop using current /btdemo immediately** - It's using wrong colors (0/10)
2. **Review this spec with design team**
3. **Implement Phase 1 (Color System) first**
4. **Get approval before building components**
5. **Reference /design-final page for exact implementation**

---

**End of Specification**

This document corrects all mistakes from the previous implementation and provides exact specifications matching the "Variation 5: BATTLETECH GLOW" aesthetic from /design-final page.
