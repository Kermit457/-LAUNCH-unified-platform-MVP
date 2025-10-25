# BLAST Network Hub - World-Class Design System V1

**Project:** BLAST Network Hub - Viral Dealflow Platform
**Design Quality Target:** 10/10 (Premium Web3 Product)
**Design Philosophy:** Binance meets Linear meets Stripe
**Version:** 1.0
**Date:** 2025-10-25

---

## Table of Contents
1. [Design Tokens](#design-tokens)
2. [Component Library](#component-library)
3. [Page Designs](#page-designs)
4. [Animation System](#animation-system)
5. [Interaction Patterns](#interaction-patterns)
6. [Implementation Guide](#implementation-guide)

---

## 1. Design Tokens

### 1.1 Color Palette

```typescript
// Primary Colors
const colors = {
  // Brand
  primary: '#00FF88',      // Neon Green - Primary actions
  accent: '#D1FD0A',       // Lime - Secondary highlights
  premium: '#FFD700',      // Gold - Premium features

  // Status Colors
  hot: '#FF6B00',          // Orange - Hot rooms
  closing: '#FFD700',      // Yellow - Closing soon
  closed: '#666666',       // Gray - Closed
  success: '#00FF88',      // Green - Success states
  error: '#FF3366',        // Red - Error states
  warning: '#FFB800',      // Amber - Warnings

  // Background
  canvas: '#000000',       // Pure black base
  surface: '#0A0A0C',      // Slightly lighter black
  card: '#111113',         // Card background
  elevated: '#1A1A1F',     // Elevated surfaces

  // Borders & Dividers
  border: {
    subtle: '#1A1A1F',
    default: '#2A2A2F',
    strong: '#3A3A3F',
    glow: 'rgba(0, 255, 136, 0.3)',
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0A8',
    tertiary: '#666670',
    disabled: '#404048',
    inverse: '#000000',
  },

  // Glassmorphism
  glass: {
    light: 'rgba(255, 255, 255, 0.03)',
    medium: 'rgba(255, 255, 255, 0.05)',
    strong: 'rgba(255, 255, 255, 0.08)',
  },
}
```

### 1.2 Typography Scale

```typescript
// Font Families
const fonts = {
  display: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  mono: 'JetBrains Mono, Menlo, Monaco, monospace',
}

// Type Scale (Desktop)
const typography = {
  hero: {
    fontSize: '64px',
    lineHeight: '72px',
    fontWeight: 900,
    letterSpacing: '-0.02em',
  },
  h1: {
    fontSize: '48px',
    lineHeight: '56px',
    fontWeight: 900,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '36px',
    lineHeight: '44px',
    fontWeight: 800,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: 800,
    letterSpacing: '-0.01em',
  },
  h4: {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: 700,
    letterSpacing: '0',
  },
  body: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    letterSpacing: '0',
  },
  bodySmall: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    letterSpacing: '0',
  },
  caption: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
  overline: {
    fontSize: '11px',
    lineHeight: '16px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
}
```

### 1.3 Spacing System

```typescript
// 4px base unit system
const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
}
```

### 1.4 Shadows & Depth

```typescript
const shadows = {
  // Standard Shadows
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 4px 8px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
  lg: '0 12px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)',
  xl: '0 24px 48px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4)',

  // Neon Glows
  glow: {
    green: '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)',
    lime: '0 0 20px rgba(209, 253, 10, 0.3), 0 0 40px rgba(209, 253, 10, 0.1)',
    gold: '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
    orange: '0 0 20px rgba(255, 107, 0, 0.3), 0 0 40px rgba(255, 107, 0, 0.1)',
    red: '0 0 20px rgba(255, 51, 102, 0.3), 0 0 40px rgba(255, 51, 102, 0.1)',
  },

  // Inner Shadows (Glassmorphism)
  inner: 'inset 0 1px 2px rgba(255, 255, 255, 0.1)',
}
```

### 1.5 Border Radius

```typescript
const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
}
```

---

## 2. Component Library

### 2.1 Premium Glass Card

**Specs:**
- Background: `rgba(17, 17, 19, 0.6)` with `backdrop-blur(20px)`
- Border: `1px solid rgba(255, 255, 255, 0.05)`
- Border Radius: `16px`
- Shadow: `shadows.lg`
- Inner Glow: `inset 0 1px 0 rgba(255, 255, 255, 0.05)`
- Transition: `all 200ms cubic-bezier(0.4, 0, 0.2, 1)`

**Hover State:**
- Border: `1px solid rgba(0, 255, 136, 0.2)`
- Shadow: `shadows.xl + shadows.glow.green`
- Transform: `translateY(-4px)`

**Implementation:**
```tsx
// Tailwind Classes
className="
  bg-[#111113]/60 backdrop-blur-xl
  border border-white/5 hover:border-[#00FF88]/20
  rounded-2xl shadow-lg
  transition-all duration-200 ease-out
  hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(0,0,0,0.6),0_8px_16px_rgba(0,0,0,0.4),0_0_20px_rgba(0,255,136,0.3)]
  [box-shadow:inset_0_1px_0_rgba(255,255,255,0.05)]
"

// CSS Custom Properties
.premium-glass-card {
  background: linear-gradient(
    135deg,
    rgba(17, 17, 19, 0.6) 0%,
    rgba(26, 26, 31, 0.4) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.5),
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-glass-card:hover {
  border-color: rgba(0, 255, 136, 0.2);
  transform: translateY(-4px);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.6),
    0 8px 16px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(0, 255, 136, 0.3),
    0 0 40px rgba(0, 255, 136, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

### 2.2 Button System

#### Primary Button (CTA)
```tsx
// Tailwind
className="
  px-6 py-3 rounded-xl font-bold text-black
  bg-[#00FF88] hover:bg-[#00FF88]/90
  shadow-[0_0_20px_rgba(0,255,136,0.3)]
  hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]
  transition-all duration-200
  active:scale-95
"

// Framer Motion Variant
const buttonVariants = {
  idle: {
    scale: 1,
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
  },
  tap: {
    scale: 0.95,
  },
}
```

#### Secondary Button (Glass)
```tsx
className="
  px-6 py-3 rounded-xl font-bold
  bg-white/5 hover:bg-white/10
  border border-white/10 hover:border-[#00FF88]/30
  backdrop-blur-sm
  transition-all duration-200
  active:scale-95
"
```

#### Icon Button
```tsx
className="
  w-10 h-10 rounded-xl
  bg-white/5 hover:bg-white/10
  border border-white/10 hover:border-[#00FF88]/30
  flex items-center justify-center
  transition-all duration-200
  active:scale-90
"
```

### 2.3 Badge System

#### Type Badges (Deal, Airdrop, Job, etc.)
```tsx
// Deal Badge
className="
  inline-flex items-center gap-1.5
  px-3 py-1.5 rounded-lg
  bg-green-500/10 border border-green-500/30
  text-green-400 text-xs font-bold
  backdrop-blur-sm
"

// Airdrop Badge
className="
  inline-flex items-center gap-1.5
  px-3 py-1.5 rounded-lg
  bg-purple-500/10 border border-purple-500/30
  text-purple-400 text-xs font-bold
  backdrop-blur-sm
"

// Job Badge
className="
  inline-flex items-center gap-1.5
  px-3 py-1.5 rounded-lg
  bg-blue-500/10 border border-blue-500/30
  text-blue-400 text-xs font-bold
  backdrop-blur-sm
"
```

#### Status Badges
```tsx
// Hot Badge
className="
  inline-flex items-center gap-1
  px-2.5 py-1 rounded-full
  bg-orange-500/20 border border-orange-500/40
  text-orange-400 text-xs font-bold
  animate-pulse
"

// Closing Badge
className="
  inline-flex items-center gap-1
  px-2.5 py-1 rounded-full
  bg-yellow-500/20 border border-yellow-500/40
  text-yellow-400 text-xs font-bold
"

// Verified Badge
className="
  inline-flex items-center gap-1
  px-2 py-0.5 rounded-full
  bg-[#00FF88]/20 border border-[#00FF88]/40
  text-[#00FF88] text-xs font-bold
"
```

### 2.4 Input Fields

```tsx
// Text Input
className="
  w-full px-4 py-3 rounded-xl
  bg-white/5 border border-white/10
  focus:border-[#00FF88]/50 focus:bg-white/8
  text-white placeholder:text-zinc-500
  outline-none transition-all duration-200
  backdrop-blur-sm
"

// Textarea
className="
  w-full px-4 py-3 rounded-xl
  bg-white/5 border border-white/10
  focus:border-[#00FF88]/50 focus:bg-white/8
  text-white placeholder:text-zinc-500
  outline-none transition-all duration-200
  backdrop-blur-sm resize-none
  min-h-[120px]
"

// Search Input with Icon
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
  <input
    className="
      w-full pl-12 pr-4 py-3 rounded-xl
      bg-white/5 border border-white/10
      focus:border-[#00FF88]/50 focus:bg-white/8
      text-white placeholder:text-zinc-500
      outline-none transition-all duration-200
    "
    placeholder="Search rooms..."
  />
</div>
```

### 2.5 Progress Bars

```tsx
// Linear Progress
<div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
  <motion.div
    className="h-full bg-gradient-to-r from-[#00FF88] to-[#00FFD4]"
    initial={{ width: 0 }}
    animate={{ width: `${progress}%` }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  />
</div>

// Circular Progress (Motion Score)
<svg className="w-16 h-16 -rotate-90">
  <circle
    cx="32" cy="32" r="28"
    className="stroke-zinc-800 fill-none"
    strokeWidth="4"
  />
  <motion.circle
    cx="32" cy="32" r="28"
    className="stroke-[#00FF88] fill-none"
    strokeWidth="4"
    strokeLinecap="round"
    strokeDasharray={`${2 * Math.PI * 28}`}
    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
    animate={{
      strokeDashoffset: 2 * Math.PI * 28 * (1 - score / 100)
    }}
    transition={{ duration: 1, ease: "easeOut" }}
  />
</svg>
```

### 2.6 Toast Notifications

```tsx
// Success Toast
<motion.div
  initial={{ opacity: 0, y: 50, scale: 0.3 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, scale: 0.5 }}
  className="
    flex items-center gap-3 p-4 rounded-xl
    bg-green-500/10 border border-green-500/30
    backdrop-blur-xl shadow-lg
  "
>
  <CheckCircle className="w-5 h-5 text-green-400" />
  <div>
    <p className="font-bold text-white">Success!</p>
    <p className="text-sm text-zinc-400">Room created successfully</p>
  </div>
</motion.div>

// Error Toast
<motion.div
  className="
    flex items-center gap-3 p-4 rounded-xl
    bg-red-500/10 border border-red-500/30
    backdrop-blur-xl shadow-lg
  "
>
  <AlertCircle className="w-5 h-5 text-red-400" />
  <div>
    <p className="font-bold text-white">Error</p>
    <p className="text-sm text-zinc-400">Failed to create room</p>
  </div>
</motion.div>
```

### 2.7 Skeleton Loaders

```tsx
// Card Skeleton
<div className="premium-glass-card p-6 space-y-4">
  <div className="flex gap-3">
    <div className="w-12 h-12 rounded-xl bg-zinc-800 animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2" />
    </div>
  </div>
  <div className="space-y-2">
    <div className="h-3 bg-zinc-800 rounded animate-pulse" />
    <div className="h-3 bg-zinc-800 rounded animate-pulse w-5/6" />
  </div>
</div>
```

---

## 3. Page Designs

### 3.1 Main Feed Page

#### Hero Section
```tsx
<div className="relative overflow-hidden border-b border-zinc-900">
  {/* Animated Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/5 via-transparent to-purple-500/5 animate-gradient" />

  <div className="relative max-w-7xl mx-auto px-6 py-12">
    {/* Title with Gradient Text */}
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-[#00FF88] to-white bg-clip-text text-transparent"
    >
      BLAST Network Hub
    </motion.h1>

    {/* Subtitle */}
    <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
      Discover exclusive deals, airdrops, jobs, and funding opportunities.
      Stake keys to unlock premium dealflow.
    </p>

    {/* Stats Row */}
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
        <span className="text-zinc-400">
          <span className="text-white font-bold">1,234</span> Active Rooms
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        <span className="text-zinc-400">
          <span className="text-orange-400 font-bold">89</span> Hot Right Now
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-400" />
        <span className="text-zinc-400">
          <span className="text-white font-bold">$2.4M</span> Total Volume
        </span>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="flex items-center gap-3 mt-8">
      <button className="px-6 py-3 rounded-xl font-bold bg-[#00FF88] text-black hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all">
        Create Room
      </button>
      <button className="px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:border-[#00FF88]/30 transition-all">
        Browse All
      </button>
      <button className="px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:border-yellow-400/30 transition-all flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Leaderboard
      </button>
    </div>
  </div>
</div>
```

#### Room Card (Premium Version)
```tsx
<motion.div
  whileHover={{ y: -6, scale: 1.01 }}
  className="premium-glass-card p-0 overflow-hidden group"
>
  {/* Cover Image */}
  <div className="relative h-48 overflow-hidden">
    <img
      src={room.coverImage}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      alt={room.title}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

    {/* Type Badge - Top Left */}
    <div className="absolute top-4 left-4">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40 backdrop-blur-xl">
        <Handshake className="w-4 h-4 text-green-400" />
        <span className="text-green-400 text-xs font-bold">DEAL</span>
      </div>
    </div>

    {/* Status Badge - Top Right */}
    <div className="absolute top-4 right-4">
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 backdrop-blur-xl animate-pulse">
        <Flame className="w-3 h-3 text-orange-400" />
        <span className="text-orange-400 text-xs font-bold">HOT</span>
      </div>
    </div>

    {/* Motion Score - Bottom Right */}
    <div className="absolute bottom-4 right-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-[#00FF88]/30">
        <div className="w-8 h-8">
          {/* Circular Progress SVG */}
          <svg className="w-full h-full -rotate-90">
            <circle cx="16" cy="16" r="14" className="stroke-zinc-700 fill-none" strokeWidth="2" />
            <circle
              cx="16" cy="16" r="14"
              className="stroke-[#00FF88] fill-none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 14}`}
              strokeDashoffset={`${2 * Math.PI * 14 * (1 - room.motionScore / 100)}`}
            />
          </svg>
        </div>
        <span className="text-sm font-bold text-white">{room.motionScore}</span>
      </div>
    </div>
  </div>

  {/* Content */}
  <div className="p-6">
    {/* Creator */}
    <div className="flex items-center gap-3 mb-4">
      <div className="relative">
        <img
          src={room.creatorAvatar}
          className="w-10 h-10 rounded-full border-2 border-[#00FF88]/30"
          alt={room.creatorName}
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00FF88] rounded-full border-2 border-black" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-white">{room.creatorName}</p>
        <p className="text-xs text-zinc-500">Motion Score: {room.creatorMotionScore}</p>
      </div>
      <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
        <Star className="w-4 h-4 text-zinc-400" />
      </button>
    </div>

    {/* Title */}
    <h3 className="text-xl font-black text-white mb-3 line-clamp-2 group-hover:text-[#00FF88] transition-colors">
      {room.title}
    </h3>

    {/* Description */}
    <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
      {room.description}
    </p>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mb-4">
      {room.tags.map(tag => (
        <span
          key={tag}
          className="px-2.5 py-1 text-xs rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-[#00FF88]/30 transition-colors"
        >
          {tag}
        </span>
      ))}
    </div>

    {/* Metrics Bar */}
    <div className="flex items-center justify-between text-xs text-zinc-500 mb-4 pt-4 border-t border-zinc-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span><span className="text-white font-bold">{room.applicantCount}</span> applied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Key className="w-4 h-4 text-[#00FF88]" />
          <span>≥{room.minKeys} keys</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-orange-400">
        <Clock className="w-4 h-4" />
        <span className="font-mono">{room.timeLeft}</span>
      </div>
    </div>

    {/* Progress Bar */}
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-zinc-500">Progress</span>
        <span className="text-white font-bold">{room.fillRate}%</span>
      </div>
      <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00FF88] to-[#00FFD4] transition-all duration-500"
          style={{ width: `${room.fillRate}%` }}
        />
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      <button className="flex-1 py-3 rounded-xl font-bold bg-[#00FF88] text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all active:scale-95">
        Apply Now
      </button>
      <button className="px-4 py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:border-[#00FF88]/30 transition-all">
        <Share2 className="w-5 h-5" />
      </button>
      <button className="px-4 py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:border-[#00FF88]/30 transition-all">
        <MessageSquare className="w-5 h-5" />
      </button>
    </div>
  </div>
</motion.div>
```

### 3.2 Room Detail Page

```tsx
<div className="min-h-screen bg-black">
  {/* Hero Section */}
  <div className="relative h-80 overflow-hidden">
    {/* Cover Image with Overlay */}
    <img
      src={room.coverImage}
      className="w-full h-full object-cover"
      alt={room.title}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

    {/* Back Button */}
    <button className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 flex items-center justify-center transition-all">
      <ArrowLeft className="w-5 h-5" />
    </button>

    {/* Content Overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40 backdrop-blur-xl">
            <Handshake className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs font-bold">DEAL</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 backdrop-blur-xl animate-pulse">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-orange-400 text-xs font-bold">HOT</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-white mb-4">{room.title}</h1>

        {/* Creator Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={room.creatorAvatar}
              className="w-12 h-12 rounded-full border-2 border-[#00FF88]/30"
              alt={room.creatorName}
            />
            <div>
              <p className="font-bold text-white flex items-center gap-2">
                {room.creatorName}
                <CheckCircle className="w-4 h-4 text-[#00FF88]" />
              </p>
              <p className="text-sm text-zinc-400">Motion Score: {room.creatorMotionScore}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-700" />

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-zinc-500">Posted</span>
              <span className="ml-2 text-white font-bold">{room.createdAt}</span>
            </div>
            <div>
              <span className="text-zinc-500">Closes in</span>
              <span className="ml-2 text-orange-400 font-mono font-bold">{room.timeLeft}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="max-w-7xl mx-auto px-8 py-12">
    <div className="grid grid-cols-3 gap-8">
      {/* Left Column - Details */}
      <div className="col-span-2 space-y-8">
        {/* Description */}
        <div className="premium-glass-card p-8">
          <h2 className="text-2xl font-black text-white mb-4">About This Opportunity</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 leading-relaxed">{room.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {room.tags.map(tag => (
              <span className="px-3 py-1.5 text-sm rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="premium-glass-card p-8">
          <h2 className="text-2xl font-black text-white mb-6">Requirements</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-[#00FF88]" />
                <span className="text-xs text-zinc-500 uppercase tracking-wide">Minimum Keys</span>
              </div>
              <p className="text-2xl font-black text-white">{room.minKeys}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-xs text-zinc-500 uppercase tracking-wide">Total Slots</span>
              </div>
              <p className="text-2xl font-black text-white">{room.totalSlots}</p>
            </div>
          </div>
        </div>

        {/* Applicant Queue (Creator View) */}
        <div className="premium-glass-card p-8">
          <h2 className="text-2xl font-black text-white mb-6">Applicants</h2>
          <div className="space-y-3">
            {applicants.map(applicant => (
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#00FF88]/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={applicant.avatar}
                      className="w-10 h-10 rounded-full"
                      alt={applicant.name}
                    />
                    <div>
                      <p className="font-bold text-white">{applicant.name}</p>
                      <p className="text-sm text-zinc-500">
                        {applicant.keyBalance} keys • Motion Score: {applicant.motionScore}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-[#00FF88]/20 border border-[#00FF88]/40">
                      <span className="text-xs font-bold text-[#00FF88]">
                        {applicant.matchScore}% Match
                      </span>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-[#00FF88] text-black font-bold hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all">
                      Accept
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-red-400/30 font-bold transition-all">
                      Pass
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Apply Card */}
        <div className="premium-glass-card p-6 sticky top-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF88]/20 border border-[#00FF88]/40 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
              <span className="text-sm font-bold text-[#00FF88]">Open for Applications</span>
            </div>

            <div className="text-4xl font-black text-white mb-2">
              {room.filledSlots}/{room.totalSlots}
            </div>
            <p className="text-sm text-zinc-500">Slots Filled</p>
          </div>

          <button className="w-full py-4 rounded-xl font-bold text-lg bg-[#00FF88] text-black hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all active:scale-95 mb-4">
            Apply Now
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button className="py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:border-[#00FF88]/30 transition-all text-sm">
              <Bookmark className="w-4 h-4 inline mr-2" />
              Save
            </button>
            <button className="py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:border-[#00FF88]/30 transition-all text-sm">
              <Share2 className="w-4 h-4 inline mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="premium-glass-card p-6">
          <h3 className="text-lg font-black text-white mb-4">Room Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">Views</span>
              <span className="font-bold text-white">{room.views}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">Applications</span>
              <span className="font-bold text-white">{room.applicantCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">Acceptance Rate</span>
              <span className="font-bold text-[#00FF88]">{room.acceptanceRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">Avg Response Time</span>
              <span className="font-bold text-white">{room.avgResponseTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 3.3 Composer Modal (Multi-Step)

```tsx
{/* Step 1: Type Selection */}
<div className="grid grid-cols-2 gap-4">
  {roomTypes.map(type => (
    <motion.button
      key={type.id}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#00FF88]/30 transition-all text-left"
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-4`}>
        <type.icon className="w-7 h-7 text-white" />
      </div>
      <h3 className={`text-xl font-black ${type.color} mb-2`}>{type.label}</h3>
      <p className="text-sm text-zinc-400">{type.description}</p>
    </motion.button>
  ))}
</div>

{/* Step 2: Form with Live Preview */}
<div className="grid grid-cols-2 gap-8">
  {/* Left: Form */}
  <div className="space-y-6">
    {/* Title Input */}
    <div>
      <label className="block text-sm font-bold text-white mb-2">
        Room Title *
      </label>
      <input
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#00FF88]/50 focus:bg-white/8 text-white placeholder:text-zinc-500 outline-none transition-all"
        placeholder="e.g., Seeking Series A Lead for AI Startup"
        maxLength={100}
      />
      <p className="text-xs text-zinc-500 mt-1">{titleLength}/100</p>
    </div>

    {/* Description Textarea */}
    <div>
      <label className="block text-sm font-bold text-white mb-2">
        Description *
      </label>
      <textarea
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#00FF88]/50 focus:bg-white/8 text-white placeholder:text-zinc-500 outline-none transition-all resize-none min-h-[160px]"
        placeholder="Describe what you're offering or looking for..."
      />
    </div>

    {/* Key Requirement Slider */}
    <div>
      <label className="block text-sm font-bold text-white mb-2">
        Minimum Keys Required
      </label>
      <div className="px-4 py-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex justify-between mb-4">
          <span className="text-3xl font-black text-white">{minKeys}</span>
          <span className="text-sm text-zinc-500">keys</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={minKeys}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-zinc-600 mt-2">
          <span>1</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </div>

    {/* Duration Picker */}
    <div>
      <label className="block text-sm font-bold text-white mb-2">
        Duration
      </label>
      <div className="grid grid-cols-4 gap-2">
        {['24h', '3d', '7d', '14d'].map(duration => (
          <button
            key={duration}
            className={`py-3 rounded-xl font-bold transition-all ${
              selectedDuration === duration
                ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40'
                : 'bg-white/5 text-zinc-400 border border-white/10 hover:border-white/20'
            }`}
          >
            {duration}
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Right: Live Preview */}
  <div className="sticky top-0">
    <div className="premium-glass-card p-6">
      <p className="text-xs text-zinc-500 mb-4 uppercase tracking-wide">Preview</p>
      {/* Render actual room card component with form data */}
      <RoomCard room={previewData} />
    </div>
  </div>
</div>
```

### 3.4 Dashboard Page

```tsx
<div className="max-w-7xl mx-auto p-8">
  {/* Stats Grid */}
  <div className="grid grid-cols-4 gap-6 mb-8">
    {/* Active Rooms */}
    <motion.div
      whileHover={{ y: -4 }}
      className="premium-glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#00FF88]/20 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-[#00FF88]" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">24</p>
          <p className="text-xs text-zinc-500">+3 this week</p>
        </div>
      </div>
      <p className="text-sm font-bold text-zinc-400">Active Rooms</p>
    </motion.div>

    {/* Total Applications */}
    <motion.div
      whileHover={{ y: -4 }}
      className="premium-glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-400" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">156</p>
          <p className="text-xs text-zinc-500">+12 today</p>
        </div>
      </div>
      <p className="text-sm font-bold text-zinc-400">Applications</p>
    </motion.div>

    {/* Acceptance Rate */}
    <motion.div
      whileHover={{ y: -4 }}
      className="premium-glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-purple-400" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">68%</p>
          <p className="text-xs text-zinc-500">+5% vs last week</p>
        </div>
      </div>
      <p className="text-sm font-bold text-zinc-400">Accept Rate</p>
    </motion.div>

    {/* Motion Score */}
    <motion.div
      whileHover={{ y: -4 }}
      className="premium-glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <Zap className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">87</p>
          <p className="text-xs text-zinc-500">Top 5%</p>
        </div>
      </div>
      <p className="text-sm font-bold text-zinc-400">Motion Score</p>
    </motion.div>
  </div>

  {/* Activity Chart */}
  <div className="premium-glass-card p-8 mb-8">
    <h2 className="text-2xl font-black text-white mb-6">Activity</h2>
    {/* Chart component with gradient fills */}
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={activityData}>
        <defs>
          <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111113',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
          }}
        />
        <Area
          type="monotone"
          dataKey="applications"
          stroke="#00FF88"
          fillOpacity={1}
          fill="url(#colorApplications)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>

  {/* Rooms Table */}
  <div className="premium-glass-card p-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-black text-white">Your Rooms</h2>
      <div className="flex gap-2">
        {['All', 'Open', 'Hot', 'Closing', 'Closed'].map(status => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              selectedStatus === status
                ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40'
                : 'bg-white/5 text-zinc-400 border border-white/10 hover:border-white/20'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      {rooms.map(room => (
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#00FF88]/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00FF88] to-[#00FFD4] flex items-center justify-center">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{room.title}</h3>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>{room.applicantCount} applicants</span>
                  <span>•</span>
                  <span>{room.filledSlots}/{room.totalSlots} slots</span>
                  <span>•</span>
                  <span>{room.timeLeft} left</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40">
                <span className="text-xs font-bold text-orange-400">HOT</span>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#00FF88]/30 font-bold text-sm transition-all">
                Manage
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

---

## 4. Animation System

### 4.1 Framer Motion Variants

```typescript
// Page Transitions
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
    },
  },
}

// Card Hover
export const cardVariants = {
  idle: {
    y: 0,
    scale: 1,
    boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
  },
  hover: {
    y: -6,
    scale: 1.01,
    boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 0 20px rgba(0,255,136,0.3)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.98,
  },
}

// Button Press
export const buttonVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  tap: { scale: 0.95 },
}

// Modal Entry
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 40,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 40,
    transition: {
      duration: 0.2,
    },
  },
}

// Stagger Children
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
}

// Number Counter Animation
export const counterAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
}
```

### 4.2 CSS Animations

```css
/* Gradient Animation */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

/* Glow Pulse */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 255, 136, 0.6);
    opacity: 0.8;
  }
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

/* Shimmer Effect */
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Border Shine */
@keyframes border-shine {
  0% {
    border-color: rgba(0, 255, 136, 0.2);
  }
  50% {
    border-color: rgba(0, 255, 136, 0.5);
  }
  100% {
    border-color: rgba(0, 255, 136, 0.2);
  }
}

.animate-border-shine {
  animation: border-shine 3s ease-in-out infinite;
}

/* Float */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### 4.3 Micro-interactions

```tsx
// Ripple Effect on Button Click
const Ripple = ({ x, y }: { x: number; y: number }) => (
  <motion.span
    className="absolute rounded-full bg-white/30"
    style={{ left: x, top: y }}
    initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
    animate={{
      width: 200,
      height: 200,
      opacity: 0,
      transition: { duration: 0.6 }
    }}
  />
)

// Haptic Feedback (Mobile)
const handleClick = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }
  // ... rest of click handler
}

// Success Confetti
const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00FF88', '#00FFD4', '#D1FD0A'],
  })
}

// Loading Dots
<span className="inline-flex gap-1">
  {[0, 1, 2].map(i => (
    <motion.span
      key={i}
      className="w-2 h-2 bg-[#00FF88] rounded-full"
      animate={{
        y: [0, -8, 0],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        delay: i * 0.15,
      }}
    />
  ))}
</span>
```

---

## 5. Interaction Patterns

### 5.1 Hover States

```tsx
// Card Hover - Lift + Glow
<motion.div
  whileHover={{
    y: -6,
    boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 0 20px rgba(0,255,136,0.3)',
  }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
/>

// Button Hover - Scale + Glow
<motion.button
  whileHover={{
    scale: 1.02,
    boxShadow: '0 0 30px rgba(0,255,136,0.5)',
  }}
  whileTap={{ scale: 0.95 }}
/>

// Image Hover - Zoom
<div className="overflow-hidden">
  <motion.img
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.3 }}
  />
</div>
```

### 5.2 Loading States

```tsx
// Skeleton Loader
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-zinc-800 rounded w-3/4" />
  <div className="h-4 bg-zinc-800 rounded w-1/2" />
  <div className="h-4 bg-zinc-800 rounded w-5/6" />
</div>

// Spinner
<motion.div
  className="w-8 h-8 border-2 border-zinc-800 border-t-[#00FF88] rounded-full"
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
/>

// Progress Bar
<motion.div
  className="h-1 bg-[#00FF88] rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.5 }}
/>
```

### 5.3 Empty States

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  className="text-center py-20"
>
  <div className="text-6xl mb-4">📭</div>
  <h3 className="text-2xl font-black text-white mb-2">No Rooms Yet</h3>
  <p className="text-zinc-400 mb-6">Create your first room to get started</p>
  <button className="px-8 py-4 rounded-xl bg-[#00FF88] text-black font-bold hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all">
    Create Room
  </button>
</motion.div>
```

### 5.4 Error States

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  className="p-6 rounded-xl bg-red-500/10 border border-red-500/30"
>
  <div className="flex items-center gap-3 mb-3">
    <AlertCircle className="w-6 h-6 text-red-400" />
    <h3 className="text-lg font-bold text-white">Something went wrong</h3>
  </div>
  <p className="text-sm text-zinc-400 mb-4">Failed to load rooms. Please try again.</p>
  <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-red-400/30 font-bold transition-all">
    Retry
  </button>
</motion.div>
```

### 5.5 Success States

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.5, y: 50 }}
  animate={{
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    }
  }}
  className="p-6 rounded-xl bg-green-500/10 border border-green-500/30"
>
  <div className="flex items-center gap-3">
    <CheckCircle className="w-6 h-6 text-green-400" />
    <div>
      <p className="font-bold text-white">Room Created!</p>
      <p className="text-sm text-zinc-400">Your room is now live</p>
    </div>
  </div>
</motion.div>
```

---

## 6. Implementation Guide

### 6.1 Tailwind Config Extension

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Add BLAST-specific colors
        blast: {
          primary: '#00FF88',
          accent: '#D1FD0A',
          premium: '#FFD700',
          hot: '#FF6B00',
          canvas: '#000000',
          surface: '#0A0A0C',
          card: '#111113',
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 136, 0.6)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
}
```

### 6.2 Reusable Component Pattern

```tsx
// components/ui/GlassCard.tsx
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'green' | 'gold' | 'blue' | 'none'
}

export const GlassCard = ({
  children,
  className,
  hover = true,
  glow = 'none'
}: GlassCardProps) => {
  const glowColors = {
    green: '0 0 20px rgba(0, 255, 136, 0.3)',
    gold: '0 0 20px rgba(255, 215, 0, 0.3)',
    blue: '0 0 20px rgba(0, 136, 255, 0.3)',
    none: '0 0 0 transparent',
  }

  return (
    <motion.div
      whileHover={hover ? {
        y: -4,
        boxShadow: `0 24px 48px rgba(0,0,0,0.6), ${glowColors[glow]}`,
      } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'bg-[#111113]/60 backdrop-blur-xl',
        'border border-white/5 rounded-2xl',
        'shadow-lg transition-all',
        '[box-shadow:inset_0_1px_0_rgba(255,255,255,0.05)]',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
```

### 6.3 Animation Utilities

```tsx
// lib/animations.ts
export const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
}

export const easeTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const,
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
}
```

### 6.4 Accessibility Considerations

```tsx
// Focus Visible States
className="
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-[#00FF88]
  focus-visible:ring-offset-2
  focus-visible:ring-offset-black
"

// Keyboard Navigation
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
  aria-label="Apply to room"
  className="..."
>
  Apply
</button>

// Screen Reader Text
<span className="sr-only">
  Room has {applicantCount} applicants and closes in {timeLeft}
</span>

// ARIA Labels
<div
  role="progressbar"
  aria-valuenow={fillRate}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Room fill rate"
>
  <div style={{ width: `${fillRate}%` }} />
</div>
```

### 6.5 Performance Optimizations

```tsx
// Lazy Load Images
<img
  loading="lazy"
  src={room.coverImage}
  alt={room.title}
/>

// Use CSS Contain for Animations
className="contain-layout contain-paint"

// Debounce Search
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

const [search, setSearch] = useState('')
const debouncedSearch = useDebouncedValue(search, 300)

// Virtualize Long Lists
import { useVirtualizer } from '@tanstack/react-virtual'

const virtualizer = useVirtualizer({
  count: rooms.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 300,
})
```

---

## 7. Design Checklist

### Pre-Launch Quality Check

- [ ] All components use premium glass morphism
- [ ] Hover states have smooth spring animations
- [ ] Loading states use skeleton loaders
- [ ] Empty states are friendly and actionable
- [ ] Error states are clear and provide solutions
- [ ] Success feedback includes confetti/animations
- [ ] Focus states are visible and accessible
- [ ] Mobile responsive (breakpoints tested)
- [ ] Dark theme only (no light mode artifacts)
- [ ] Neon glows are subtle, not overwhelming
- [ ] Typography scale is consistent
- [ ] Spacing uses 4px grid system
- [ ] All CTAs are prominent and clear
- [ ] Status badges are color-coded and consistent
- [ ] Progress bars animate smoothly
- [ ] Cards lift on hover with glow effect
- [ ] Modals have backdrop blur
- [ ] Toasts enter from bottom with spring
- [ ] Counters animate when values change
- [ ] Gradients are subtle and premium

---

## Summary

This design system provides:

1. **Premium Visual Language**: Glass morphism, neon glows, smooth animations
2. **Consistent Components**: Reusable cards, buttons, badges, inputs
3. **Delightful Interactions**: Spring physics, hover states, micro-animations
4. **Scalable Tokens**: Colors, typography, spacing, shadows
5. **Production-Ready**: Accessibility, performance, mobile-responsive

**Implementation Priority:**
1. Update Tailwind config with new tokens
2. Create base component library (GlassCard, Button, Badge)
3. Refactor existing room cards with new design
4. Implement hero section with gradient animation
5. Add Framer Motion to all interactive elements
6. Polish dashboard with stats animations
7. Final QA pass on all pages

**Target Quality:** Stripe-level polish + Web3 aesthetic = 10/10

---

**Files Referenced:**
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\BLAST\page.tsx`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\blast\cards\DealCard.tsx`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\blast\composer\BlastComposer.tsx`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\BLAST\dashboard\page.tsx`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\tailwind.config.ts`

**Next Steps:**
1. Review design spec with team
2. Create Figma mockups (optional)
3. Begin component library implementation
4. Test on multiple devices
5. Ship to production
