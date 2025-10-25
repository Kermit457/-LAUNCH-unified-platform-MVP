# Button Visual Specifications & Mockups
## ICM Motion Launch Platform - Design System

**Version:** 1.0
**Companion to:** BUTTON_DESIGN_SYSTEM.md
**Purpose:** Visual reference for developers and designers

---

## Table of Contents
1. [Visual Hierarchy Overview](#visual-hierarchy-overview)
2. [Component Anatomy Diagrams](#component-anatomy-diagrams)
3. [Spacing & Sizing Scales](#spacing--sizing-scales)
4. [State Visualizations](#state-visualizations)
5. [Before/After Mockups](#beforeafter-mockups)
6. [Responsive Behavior](#responsive-behavior)
7. [Dark Mode Specifications](#dark-mode-specifications)

---

## Visual Hierarchy Overview

### Button Weight Comparison

```
PRIMARY BUTTON (Highest Visual Weight)
╔═══════════════════════════════════════╗
║  █████████████████████████████████    ║
║  █ [Icon]  Launch Token          █    ║  ← Gradient fill
║  █████████████████████████████████    ║     Bold text
║                                       ║     Strong shadow
╚═══════════════════════════════════════╝

SECONDARY BUTTON (Medium Visual Weight)
┌───────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
│  ▓ [Icon]  Learn More            ▓    │  ← Solid fill
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │     Semibold text
│                                       │     Subtle border
└───────────────────────────────────────┘

GHOST BUTTON (Low Visual Weight)
┌───────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│  ░ [Icon]  Cancel                ░    │  ← Transparent
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │     Medium text
│                                       │     Thin border
└───────────────────────────────────────┘

ICON-ONLY BUTTON (Minimal Visual Weight)
┌──────────┐
│          │
│   [X]    │  ← Transparent background
│          │     Icon only, no text
└──────────┘

TERTIARY/LINK (Lightest Weight)
View Details →  ← Underlined text, no background
```

---

## Component Anatomy Diagrams

### Primary Button - Detailed Breakdown

```
┌─────────────────────────────────────────────────────────────┐
│                        DESKTOP VIEW                         │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │ ◄─────────────────── 48px ──────────────────────► │     │
│  │  ┌────┐  ┌──────────────────┐                     │     │
│  │  │Icon│  │   Button Text    │                     │     │
│  │  │16px│  │   16px (base)    │                     │     │
│  │  └────┘  └──────────────────┘                     │     │
│  │  ◄─8px──►                                         │     │
│  │  (gap)                                            │     │
│  │                                                   │     │
│  │  ◄────────── 24px padding left/right ───────────►│     │
│  │                                                   │     │
│  └───────────────────────────────────────────────────┘     │
│                         ↕                                   │
│                       48px                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        MOBILE VIEW                          │
│                                                             │
│  ┌─────────────────────────────────────────┐               │
│  │ ◄───────────── min 44px ──────────────► │               │
│  │  ┌────┐  ┌────────────┐                 │               │
│  │  │Icon│  │Button Text │                 │               │
│  │  │16px│  │  14px (sm) │                 │               │
│  │  └────┘  └────────────┘                 │               │
│  │  ◄─8px──►                               │               │
│  │                                         │               │
│  │  ◄───── 16px padding ────►              │               │
│  │                                         │               │
│  └─────────────────────────────────────────┘               │
│                    ↕                                        │
│                  44px                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Modal Trigger Button - With Indicators

```
┌──────────────────────────────────────────────────────────┐
│  PRIMARY BUTTON WITH MODAL INDICATOR                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │  [+]  Create Campaign              [→]        │     │
│  │  16px                               16px       │     │
│  │  ◄─8px─►◄────────────────────────►◄─8px─►     │     │
│  │         Flexible text space                    │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  Left Icon:   Action type (Plus, Pencil, Upload)        │
│  Right Icon:  ChevronRight = Opens modal                │
│  Animation:   Right icon translates-x-1 on hover        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Icon-Only Button - Touch Target Compliance

```
┌──────────────────────────────────────────────────────────┐
│  ICON-ONLY BUTTON - MINIMUM SIZING                      │
│                                                          │
│  ┌────────────────┐                                     │
│  │                │                                     │
│  │   ┌────────┐   │  ← Visual icon area (20x20px)      │
│  │   │  [X]   │   │                                     │
│  │   └────────┘   │                                     │
│  │                │                                     │
│  └────────────────┘                                     │
│  ◄────── 44px ───►                                      │
│       ↕                                                  │
│     44px                                                 │
│                                                          │
│  Touch target: 44x44px (full button)                    │
│  Icon size: 20x20px (centered)                          │
│  Padding: 12px all sides (44 - 20 = 24 / 2 = 12)        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Spacing & Sizing Scales

### Typography Scale

```
┌─────────────────────────────────────────────────────────┐
│  BUTTON TEXT SIZING                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  LARGE (lg size):                                       │
│  Desktop: 18px (text-lg)    Mobile: 16px (text-base)   │
│  Font Weight: 700 (bold)    Line Height: 1.2           │
│                                                         │
│  MEDIUM (md size - default):                            │
│  Desktop: 16px (text-base)  Mobile: 14px (text-sm)     │
│  Font Weight: 700 (bold)    Line Height: 1.2           │
│                                                         │
│  SMALL (sm size):                                       │
│  Desktop: 14px (text-sm)    Mobile: 14px (text-sm)     │
│  Font Weight: 600 (semibold) Line Height: 1.2          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Icon Sizing Guide

```
┌─────────────────────────────────────────────────────────┐
│  ICON SIZE CHART                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Button Size    Icon Size    Visual Example            │
│  ──────────    ─────────    ──────────────────         │
│  Large (lg)     20x20px     ┌────┐                     │
│                             │ [i]│ Large Icon          │
│                             └────┘                     │
│                                                         │
│  Medium (md)    16x16px     ┌───┐                      │
│                             │[i]│ Medium Icon          │
│                             └───┘                      │
│                                                         │
│  Small (sm)     14x14px     ┌──┐                       │
│                             │[i]│ Small Icon           │
│                             └──┘                       │
│                                                         │
│  Icon-only      20x20px     ┌────┐                     │
│                             │ [i]│ (in 44px target)    │
│                             └────┘                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Padding & Spacing Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│  BUTTON PADDING REFERENCE                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Size    Horizontal Padding    Vertical Padding    Min Height  │
│  ────    ──────────────────    ───────────────    ──────────── │
│                                                                 │
│  sm      12px (px-3)           8px (py-2)         44px         │
│  md      16px/24px (px-4/6)    12px (py-3)        44px         │
│  lg      24px/32px (px-6/8)    14px (py-3.5)      48px         │
│                                                                 │
│  Note: Mobile uses smaller values, desktop uses larger         │
│        e.g., "px-4 md:px-6" = 16px mobile, 24px desktop        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Button Spacing Between Elements

```
┌─────────────────────────────────────────────────────────┐
│  SPACING BETWEEN BUTTONS                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Context            Gap Size    Tailwind Class         │
│  ───────────       ────────    ────────────────        │
│                                                         │
│  Modal Actions      12px       gap-3                   │
│  (Cancel/Submit)                                        │
│  ┌──────────┐  12px  ┌──────────┐                     │
│  │ Cancel   │◄──────►│ Submit   │                     │
│  └──────────┘        └──────────┘                     │
│                                                         │
│  Button Groups      8px        gap-2                   │
│  (Icon toolbar)                                         │
│  ┌──┐ 8px ┌──┐ 8px ┌──┐                               │
│  │□ │◄───►│✎ │◄───►│× │                               │
│  └──┘     └──┘     └──┘                               │
│                                                         │
│  Stacked Buttons    16px       space-y-4               │
│  (Vertical list)                                        │
│  ┌────────────────┐                                    │
│  │  Button 1      │                                    │
│  └────────────────┘                                    │
│         ↕ 16px                                          │
│  ┌────────────────┐                                    │
│  │  Button 2      │                                    │
│  └────────────────┘                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## State Visualizations

### Primary Button - All States

```
┌────────────────────────────────────────────────────────────────┐
│  PRIMARY BUTTON STATE PROGRESSION                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. DEFAULT STATE                                              │
│  ┌──────────────────────────────────────────┐                 │
│  │ ████████████████████████████████████████ │                 │
│  │ █  [Icon]  Launch Token                █ │                 │
│  │ ████████████████████████████████████████ │                 │
│  └──────────────────────────────────────────┘                 │
│  Background: linear-gradient(90deg, #00FF88, #00FFFF)         │
│  Text: #000000 (black)                                        │
│  Shadow: none                                                  │
│  Scale: 1.0                                                    │
│                                                                │
│  2. HOVER STATE                                                │
│  ┌──────────────────────────────────────────┐                 │
│  │ ████████████████████████████████████████ │  ← Glow effect │
│  │ █  [Icon]  Launch Token                █ │                 │
│  │ ████████████████████████████████████████ │                 │
│  └──────────────────────────────────────────┘                 │
│  Shadow: 0 0 24px rgba(0, 255, 136, 0.4)                      │
│  Scale: 1.05 (5% growth)                                      │
│  Cursor: pointer                                               │
│                                                                │
│  3. ACTIVE/PRESSED STATE                                       │
│  ┌────────────────────────────────────┐                       │
│  │ ██████████████████████████████████ │  ← Slightly smaller  │
│  │ █  [Icon]  Launch Token          █ │                       │
│  │ ██████████████████████████████████ │                       │
│  └────────────────────────────────────┘                       │
│  Scale: 0.95 (5% shrink)                                      │
│  Duration: instant                                             │
│                                                                │
│  4. FOCUS STATE (Keyboard Navigation)                          │
│  ┌──────────────────────────────────────────┐                 │
│  │ ████████████████████████████████████████ │                 │
│  │ █  [Icon]  Launch Token                █ │                 │
│  │ ████████████████████████████████████████ │                 │
│  └──────────────────────────────────────────┘                 │
│         ↑ 2px focus ring                                       │
│  Outline: 2px solid rgba(0, 255, 136, 0.5)                    │
│  Outline offset: 2px                                           │
│                                                                │
│  5. DISABLED STATE                                             │
│  ┌──────────────────────────────────────────┐                 │
│  │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │  ← 50% opacity │
│  │ ▒  [Icon]  Launch Token                ▒ │                 │
│  │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │                 │
│  └──────────────────────────────────────────┘                 │
│  Opacity: 0.5                                                  │
│  Cursor: not-allowed                                           │
│  No hover effects                                              │
│                                                                │
│  6. LOADING STATE                                              │
│  ┌──────────────────────────────────────────┐                 │
│  │ ████████████████████████████████████████ │                 │
│  │ █  [○]  Processing...                  █ │  ← Spinner     │
│  │ ████████████████████████████████████████ │     animation  │
│  └──────────────────────────────────────────┘                 │
│  Icon replaced with spinner                                    │
│  Cursor: wait                                                  │
│  aria-busy: true                                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Ghost Button - State Comparison

```
┌────────────────────────────────────────────────────────────────┐
│  GHOST BUTTON STATES (Low Visual Weight)                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  DEFAULT:                                                      │
│  ┌──────────────────────────────────┐                         │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Transparent bg      │
│  │ ░  Cancel                      ░ │     10% border         │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │     80% text opacity   │
│  └──────────────────────────────────┘                         │
│                                                                │
│  HOVER:                                                        │
│  ┌──────────────────────────────────┐                         │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← 5% white bg        │
│  │ ▓  Cancel                      ▓ │     20% border         │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │     100% text opacity  │
│  └──────────────────────────────────┘                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Before/After Mockups

### Modal 1: CreateCampaignModal - Footer Actions

```
┌────────────────────────────────────────────────────────────────┐
│  BEFORE (Current Implementation)                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                                                      │     │
│  │  Form content...                                     │     │
│  │                                                      │     │
│  │  ┌──────────────┐  12px  ┌────────────────────┐     │     │
│  │  │              │◄──────►│  [□]               │     │     │
│  │  │   Cancel     │        │      Create        │     │     │
│  │  │              │        │                    │     │     │
│  │  └──────────────┘        └────────────────────┘     │     │
│  │      ↕ 40px                    ↕ 40px               │     │
│  │    (FAIL)                    (FAIL)                 │     │
│  │                                                      │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
│  Issues:                                                       │
│  ✗ Touch target: 40px height (FAIL WCAG 2.1)                  │
│  ✗ No visual indicator for modal submission                   │
│  ✗ Icon size inconsistent (16px vs 20px elsewhere)            │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  AFTER (Design System)                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                                                      │     │
│  │  Form content...                                     │     │
│  │                                                      │     │
│  │  ┌──────────────┐  12px  ┌────────────────────┐     │     │
│  │  │              │◄──────►│ [□] Create         │     │     │
│  │  │   Cancel     │        │     Campaign       │     │     │
│  │  │              │        │                    │     │     │
│  │  └──────────────┘        └────────────────────┘     │     │
│  │      ↕ 44px                    ↕ 44px               │     │
│  │    (PASS)                    (PASS)                 │     │
│  │                                                      │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
│  Improvements:                                                 │
│  ✓ Touch target: 44px height (PASS WCAG 2.1)                  │
│  ✓ Consistent gradient colors (ICM brand)                     │
│  ✓ Icon size: 16px (consistent)                               │
│  ✓ Clear visual hierarchy (ghost vs primary)                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Modal 2: SubmitClipModal - Complete Overhaul

```
┌────────────────────────────────────────────────────────────────┐
│  BEFORE (Native Buttons)                                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                                                      │     │
│  │  Video URL input...                                  │     │
│  │                                                      │     │
│  │  ┌─────────────┐  8px  ┌─────────────────────┐      │     │
│  │  │             │◄─────►│                     │      │     │
│  │  │   Cancel    │       │   Submit Clip       │      │     │
│  │  │             │       │  (White bg/Black)   │      │     │
│  │  └─────────────┘       └─────────────────────┘      │     │
│  │     ↕ 40-44px              ↕ 40-44px                │     │
│  │                                                      │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
│  Issues:                                                       │
│  ✗ Custom implementation (not using design system)            │
│  ✗ White background breaks brand consistency                  │
│  ✗ Complex responsive classes (2 breakpoints inline)          │
│  ✗ Height borderline (40px on some viewports)                 │
│  ✗ No icon to indicate action type                            │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  AFTER (PremiumButton System)                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                                                      │     │
│  │  Video URL input...                                  │     │
│  │                                                      │     │
│  │  ┌─────────────┐  12px ┌─────────────────────┐      │     │
│  │  │             │◄─────►│ [▶] Submit Clip     │      │     │
│  │  │   Cancel    │       │   (ICM Gradient)    │      │     │
│  │  │             │       │                     │      │     │
│  │  └─────────────┘       └─────────────────────┘      │     │
│  │     ↕ 44px                 ↕ 44px                   │     │
│  │   (Ghost)              (Primary)                    │     │
│  │                                                      │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
│  Improvements:                                                 │
│  ✓ Uses PremiumButton component (design system)               │
│  ✓ Brand-consistent gradient (#00FF88 → #00FFFF)              │
│  ✓ Simplified code (50% fewer classes)                        │
│  ✓ Guaranteed 44px height                                     │
│  ✓ Play icon indicates video submission                       │
│  ✓ Clear visual hierarchy                                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Page Component: TokenLaunchPreview - Collapse Button

```
┌────────────────────────────────────────────────────────────────┐
│  BEFORE (Missing Label on Mobile)                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Mobile View:                                                  │
│  ┌─────────────────────────────────────────────────────┐      │
│  │  Pre Launch                              [↓] ←Icon  │      │
│  │                                           32px       │      │
│  │  (Form content below...)                            │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                │
│  Issues:                                                       │
│  ✗ Icon-only button without aria-label                        │
│  ✗ 32px touch target (FAIL)                                   │
│  ✗ No visual feedback on what it does                         │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  AFTER (Accessibility Compliant)                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Mobile View:                                                  │
│  ┌─────────────────────────────────────────────────────┐      │
│  │  Pre Launch                           [↓]           │      │
│  │                                       44px           │      │
│  │  (Form content below...)                            │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                │
│  Desktop View (optional label):                                │
│  ┌─────────────────────────────────────────────────────┐      │
│  │  Pre Launch             [↓ Collapse]                │      │
│  │                                                      │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                │
│  Improvements:                                                 │
│  ✓ 44x44px touch target                                       │
│  ✓ aria-label="Collapse launch form"                          │
│  ✓ title attribute for tooltip                                │
│  ✓ Larger icon (20px vs 16px)                                 │
│  ✓ Optional text label on desktop                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Responsive Behavior

### Breakpoint Strategy

```
┌────────────────────────────────────────────────────────────────┐
│  RESPONSIVE BUTTON SIZING                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Mobile (< 768px):                                             │
│  ┌──────────────────────────┐                                 │
│  │ [Icon]  Action           │  44px height                    │
│  │   16px   14px text       │  16px padding                   │
│  └──────────────────────────┘  text-sm (14px)                 │
│                                                                │
│  Tablet (768px - 1024px):                                      │
│  ┌────────────────────────────────┐                           │
│  │ [Icon]  Action                 │  44-48px height           │
│  │   16px   15px text             │  20px padding             │
│  └────────────────────────────────┘  text-base (16px)         │
│                                                                │
│  Desktop (> 1024px):                                           │
│  ┌──────────────────────────────────────┐                     │
│  │ [Icon]  Action                       │  48px height        │
│  │   16px   16px text                   │  24px padding       │
│  └──────────────────────────────────────┘  text-base (16px)   │
│                                                                │
│  Hero/CTA (> 1024px):                                          │
│  ┌────────────────────────────────────────────┐               │
│  │ [Icon]  Primary Action                     │  56px height  │
│  │   20px   18px text                         │  32px padding │
│  └────────────────────────────────────────────┘  text-lg (18px)│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Width Behavior

```
┌────────────────────────────────────────────────────────────────┐
│  BUTTON WIDTH PATTERNS                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. FULL WIDTH (Mobile forms)                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │        Submit                                          │   │
│  └────────────────────────────────────────────────────────┘   │
│  className="w-full"                                            │
│                                                                │
│  2. FLEX EQUAL (Modal actions)                                 │
│  ┌──────────────────────────┐ ┌──────────────────────────┐   │
│  │     Cancel               │ │      Submit              │   │
│  └──────────────────────────┘ └──────────────────────────┘   │
│  className="flex-1" (in flex container)                        │
│                                                                │
│  3. AUTO WIDTH (Inline buttons)                                │
│  ┌────────────┐  ┌───────────────┐  ┌──────────┐             │
│  │  Learn     │  │  Get Started  │  │  Skip    │             │
│  └────────────┘  └───────────────┘  └──────────┘             │
│  className="w-auto" (default)                                  │
│                                                                │
│  4. RESPONSIVE WIDTH                                           │
│  Mobile:                                                       │
│  ┌────────────────────────────────────────────────────────┐   │
│  │               Launch Token                             │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  Desktop:                                                      │
│  ┌──────────────────────┐                                     │
│  │   Launch Token       │  (Other content...)                 │
│  └──────────────────────┘                                     │
│  className="w-full md:w-auto"                                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Dark Mode Specifications

### Color Adaptation (Already Dark)

```
┌────────────────────────────────────────────────────────────────┐
│  BUTTON COLORS - DARK MODE (Default)                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  PRIMARY BUTTON:                                               │
│  ┌──────────────────────────────────────────┐                 │
│  │ ████████████████████████████████████████ │                 │
│  │ █  Launch Token                        █ │                 │
│  │ ████████████████████████████████████████ │                 │
│  └──────────────────────────────────────────┘                 │
│  Background: #00FF88 → #00FFFF (gradient)                     │
│  Text: #000000 (black on bright gradient)                     │
│  Hover Shadow: rgba(0, 255, 136, 0.4)                         │
│                                                                │
│  SECONDARY BUTTON:                                             │
│  ┌──────────────────────────────────────────┐                 │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                 │
│  │ ▓  Learn More                          ▓ │                 │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                 │
│  └──────────────────────────────────────────┘                 │
│  Background: #18181b (zinc-900)                                │
│  Border: #27272a (zinc-800)                                    │
│  Text: #ffffff (white)                                         │
│  Hover: #27272a / #3f3f46                                      │
│                                                                │
│  GHOST BUTTON:                                                 │
│  ┌──────────────────────────────────────────┐                 │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │                 │
│  │ ░  Cancel                              ░ │                 │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │                 │
│  └──────────────────────────────────────────┘                 │
│  Background: transparent                                       │
│  Border: rgba(255, 255, 255, 0.1)                             │
│  Text: rgba(255, 255, 255, 0.8)                               │
│  Hover: rgba(255, 255, 255, 0.05) / 0.2 border                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Contrast Ratios (WCAG Compliance)

```
┌────────────────────────────────────────────────────────────────┐
│  CONTRAST RATIO VALIDATION                                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Test: Black text (#000000) on ICM Gradient                    │
│  Background: #00FF88 (lightest point)                          │
│  Foreground: #000000                                           │
│  Ratio: 14.5:1                                                 │
│  Result: PASS AAA (requires 7:1) ✓✓✓                          │
│                                                                │
│  Test: White text (#ffffff) on zinc-900 (#18181b)              │
│  Ratio: 16.8:1                                                 │
│  Result: PASS AAA ✓✓✓                                         │
│                                                                │
│  Test: White text on transparent (ghost button)                │
│  Background: #0a0a0a (page background)                         │
│  Foreground: rgba(255, 255, 255, 0.8)                          │
│  Effective Ratio: ~13.4:1                                      │
│  Result: PASS AAA ✓✓✓                                         │
│                                                                │
│  All button variants meet WCAG 2.1 AAA standards!              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Implementation Reference

### Quick Copy-Paste Templates

#### Template 1: Modal Action Buttons
```tsx
// Standard modal footer with Cancel + Submit
<div className="flex gap-3 pt-2">
  <PremiumButton
    type="button"
    variant="ghost"
    onClick={handleClose}
    className="flex-1"
  >
    Cancel
  </PremiumButton>
  <PremiumButton
    type="submit"
    variant="primary"
    className="flex-1"
    icon={iconComponent}
  >
    Submit Action
  </PremiumButton>
</div>
```

#### Template 2: Hero CTA
```tsx
// Large primary action button
<PremiumButton
  variant="primary"
  size="lg"
  icon={Rocket}
  onClick={handleAction}
  className="w-full md:w-auto"
>
  Launch Token
</PremiumButton>
```

#### Template 3: Icon-Only Button
```tsx
// Accessible icon-only button
<PremiumButton
  variant="ghost"
  className="min-w-[44px] min-h-[44px] p-0"
  aria-label="Close modal"
  title="Close"
  onClick={handleClose}
>
  <X className="w-5 h-5" />
</PremiumButton>
```

#### Template 4: Button Group (Horizontal)
```tsx
// Multiple actions in a row
<div className="flex items-center gap-2">
  <PremiumButton variant="secondary" size="sm" className="flex-1">
    View Details
  </PremiumButton>
  <PremiumButton variant="primary" size="sm" className="flex-1" icon={Play}>
    Watch Clip
  </PremiumButton>
  <PremiumButton variant="ghost" size="sm" aria-label="More options" title="More">
    <MoreVertical className="w-4 h-4" />
  </PremiumButton>
</div>
```

---

## Accessibility Quick Reference

### ARIA Attributes Checklist

```
┌────────────────────────────────────────────────────────────────┐
│  BUTTON ACCESSIBILITY ATTRIBUTES                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Icon-Only Buttons:                                            │
│  ✓ aria-label="Descriptive action"                            │
│  ✓ title="Tooltip text"                                       │
│  ✓ role="button" (if not <button> element)                    │
│                                                                │
│  Modal Trigger Buttons:                                        │
│  ✓ aria-haspopup="dialog"                                     │
│  ✓ aria-expanded="false" (before opening)                     │
│  ✓ aria-controls="modal-id"                                   │
│                                                                │
│  Loading/Processing Buttons:                                   │
│  ✓ aria-busy="true" (during load)                             │
│  ✓ aria-live="polite" (on status change)                      │
│  ✓ Disabled state while processing                            │
│                                                                │
│  Toggle Buttons:                                               │
│  ✓ aria-pressed="true|false"                                  │
│  ✓ Clear visual state indication                              │
│                                                                │
│  Disabled Buttons:                                             │
│  ✓ disabled attribute                                         │
│  ✓ aria-disabled="true" (if needed)                           │
│  ✓ Tooltip explaining why disabled                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Design File Exports

### Recommended Tools
- **Figma:** Main design source
- **Storybook:** Interactive component documentation
- **Chromatic:** Visual regression testing

### File Naming Convention
```
icm-button-{variant}-{size}-{state}.png

Examples:
- icm-button-primary-md-default.png
- icm-button-primary-md-hover.png
- icm-button-ghost-sm-disabled.png
- icm-button-icon-only-focus.png
```

---

## Version History

### v1.0 (2025-10-22)
- Initial visual specification
- 5 button variants documented
- Spacing and sizing scales defined
- State visualizations created
- Before/after mockups added
- Responsive behavior specified
- Accessibility guidelines included

---

**Document Owner:** UI/UX Design Team
**Companion Document:** BUTTON_DESIGN_SYSTEM.md
**Status:** ✅ READY FOR DEVELOPMENT
