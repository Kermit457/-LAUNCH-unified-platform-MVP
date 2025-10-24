# Top Performers Profile Card - Design Specification

**Project:** ICM Motion - Solana Launch Platform v4
**Component:** TopPerformerCard
**Version:** 2.0
**Design System:** BTDemo (Lime Green #D1FD0A)
**Date:** 2025-10-24

---

## 1. DESIGN OVERVIEW

### 1.1 Purpose
Display top-performing creators/projects in the Solana memecoin platform with emphasis on:
- **Trust signals** (verification badge)
- **Performance metrics** (clips, views, performance %)
- **Actionable CTAs** (Collab, Buy buttons)

### 1.2 User Goals
1. Quickly identify verified/trustworthy performers
2. Assess creator performance through metrics
3. Take immediate action (collaborate or purchase)
4. Navigate to creator's profile/clips

---

## 2. COMPONENT STRUCTURE

### 2.1 Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  [Rank]  [Avatar]  [Info Block]        [Action Buttons]     │
│                                                              │
│    #1     [IMG]    CryptoMaster                [Collab][Buy]│
│                    ✓ Verified                                │
│                    1.2K Clips · 3.5M Views                   │
│                    +245% · 24h                               │
│                    [Trophy Icon Menu]                        │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
TopPerformerCard (container)
├── RankBadge (left side)
├── ProfileSection (left-center)
│   ├── Avatar (with glow effect)
│   ├── VerificationBadge (absolute positioned)
│   └── InfoBlock
│       ├── ProjectName
│       ├── VerificationText
│       ├── MetricsRow (Clips · Views)
│       ├── PerformanceRow (% · Time)
│       └── ClipperMenuButton (Trophy icon)
└── ActionButtons (right side)
    ├── CollabButton
    └── BuyButton
```

---

## 3. DETAILED SPECIFICATIONS

### 3.1 Container Card

**Desktop (>768px):**
```css
.top-performer-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(8, 8, 9, 0.6);
  border: 1px solid #3B3B3B;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  cursor: pointer;
}

.top-performer-card:hover {
  background: rgba(23, 23, 23, 0.6);
  border-color: #D1FD0A;
  transform: translateX(4px);
  box-shadow: 0 0 24px rgba(209, 253, 10, 0.2);
}
```

**Mobile (<768px):**
```css
.top-performer-card {
  padding: 16px;
  gap: 12px;
  border-radius: 16px;
}
```

### 3.2 Rank Badge

**Position:** Far left
**Purpose:** Show leaderboard position

```css
.rank-badge {
  font-family: 'DSEG14', monospace;
  font-size: 32px;
  letter-spacing: -1.28px;
  color: #D1FD0A;
  font-weight: 400;
  width: 60px;
  text-align: center;
}

/* Special styling for top 3 */
.rank-badge.rank-1 {
  color: #FFD700; /* Gold */
  text-shadow: 0 0 16px rgba(255, 215, 0, 0.6);
}

.rank-badge.rank-2 {
  color: #C0C0C0; /* Silver */
  text-shadow: 0 0 16px rgba(192, 192, 192, 0.6);
}

.rank-badge.rank-3 {
  color: #CD7F32; /* Bronze */
  text-shadow: 0 0 16px rgba(205, 127, 50, 0.6);
}
```

**Mobile:**
```css
.rank-badge {
  font-size: 24px;
  width: 40px;
}
```

### 3.3 Profile Section

#### 3.3.1 Avatar Container

```css
.avatar-container {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #3B3B3B;
  object-fit: cover;
  transition: all 0.3s ease;
}

.top-performer-card:hover .avatar {
  border-color: #D1FD0A;
  box-shadow: 0 0 20px rgba(209, 253, 10, 0.4);
}
```

**Mobile:**
```css
.avatar-container,
.avatar {
  width: 48px;
  height: 48px;
}
```

#### 3.3.2 Verification Badge

**Position:** Bottom-right of avatar
**Purpose:** Instant trust signal

```css
.verification-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 24px;
  height: 24px;
  background: #D1FD0A;
  border-radius: 50%;
  border: 2px solid #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.verification-badge svg {
  width: 14px;
  height: 14px;
  color: #000000;
}
```

**Icon:** Checkmark icon (lucide-react: CheckCircle2)

**Mobile:**
```css
.verification-badge {
  width: 20px;
  height: 20px;
}
```

#### 3.3.3 Info Block

```css
.info-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0; /* Allow text truncation */
}
```

**Project Name:**
```css
.project-name {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**Verification Text:**
```css
.verification-text {
  font-size: 13px;
  color: #D1FD0A;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.verification-text svg {
  width: 14px;
  height: 14px;
}
```

**Metrics Row:**
```css
.metrics-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.72);
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-separator {
  color: rgba(255, 255, 255, 0.32);
}

.metric-icon {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.56);
}
```

**Performance Row:**
```css
.performance-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.performance-value {
  font-family: 'DSEG14', monospace;
  font-size: 15px;
  letter-spacing: -0.6px;
  color: #D1FD0A;
  font-weight: 400;
}

.performance-value.negative {
  color: #FF0040;
}

.time-indicator {
  color: rgba(255, 255, 255, 0.56);
  font-size: 13px;
}
```

#### 3.3.4 Clipper Menu Button

**Position:** Below performance metrics
**Purpose:** Access clipper menu with trophy icon

```css
.clipper-menu-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(209, 253, 10, 0.1);
  border: 1px solid rgba(209, 253, 10, 0.3);
  border-radius: 8px;
  color: #D1FD0A;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 4px;
  width: fit-content;
}

.clipper-menu-button:hover {
  background: rgba(209, 253, 10, 0.2);
  border-color: rgba(209, 253, 10, 0.5);
  transform: scale(1.02);
}

.clipper-menu-button svg {
  width: 14px;
  height: 14px;
}
```

**Icon:** Trophy icon (lucide-react: Trophy)

### 3.4 Action Buttons Section

**Container:**
```css
.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
```

**Mobile:**
```css
.action-buttons {
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 12px;
}
```

#### 3.4.1 Collab Button

```css
.collab-button {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.collab-button:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.24);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.collab-button:active {
  transform: translateY(0);
}
```

**Mobile:**
```css
.collab-button {
  width: 100%;
  padding: 12px;
}
```

#### 3.4.2 Buy Button (Primary CTA)

```css
.buy-button {
  padding: 10px 24px;
  background: #D1FD0A;
  border: 1px solid #D1FD0A;
  border-radius: 12px;
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 0 16px rgba(209, 253, 10, 0.3);
}

.buy-button:hover {
  background: #E5FF4A;
  border-color: #E5FF4A;
  transform: translateY(-2px);
  box-shadow: 0 0 24px rgba(209, 253, 10, 0.5),
              0 4px 12px rgba(0, 0, 0, 0.3);
}

.buy-button:active {
  transform: translateY(0);
}
```

**Mobile:**
```css
.buy-button {
  width: 100%;
  padding: 12px;
}
```

---

## 4. RESPONSIVE BEHAVIOR

### 4.1 Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: '0-767px',
  tablet: '768-1023px',
  desktop: '1024px+'
};
```

### 4.2 Layout Changes

**Desktop (>1024px):**
- Horizontal layout
- All elements in single row
- Action buttons on the right

**Tablet (768-1023px):**
- Horizontal layout maintained
- Smaller padding and gaps
- Buttons may wrap to second row if needed

**Mobile (<768px):**
- Stacked layout
- Profile section takes full width
- Action buttons stack vertically below
- Rank badge smaller
- Avatar smaller (48px)

### 4.3 Mobile Layout Structure

```
┌────────────────────────────────┐
│  #1  [Avatar]  CryptoMaster    │
│      ✓         ✓ Verified      │
│                1.2K · 3.5M     │
│                +245% · 24h     │
│                [Trophy]        │
│  ─────────────────────────────│
│  [    Collab Button    ]       │
│  [     Buy Button      ]       │
└────────────────────────────────┘
```

---

## 5. INTERACTIVE STATES

### 5.1 Hover State

**Card:**
- Background: Lighter shade
- Border: Lime green glow
- Transform: Slide right 4px
- Shadow: Lime glow

**Avatar:**
- Border: Lime green
- Shadow: Lime glow

**Buttons:**
- Individual hover effects (see button specs)

### 5.2 Active/Pressed State

**Entire Card:**
```css
.top-performer-card:active {
  transform: translateX(2px) scale(0.995);
}
```

**Buttons:**
- Translate Y reset
- Slight scale down

### 5.3 Focus State (Accessibility)

```css
.top-performer-card:focus-visible,
.collab-button:focus-visible,
.buy-button:focus-visible,
.clipper-menu-button:focus-visible {
  outline: 2px solid #D1FD0A;
  outline-offset: 2px;
}
```

### 5.4 Loading State

```css
.top-performer-card.loading {
  opacity: 0.6;
  pointer-events: none;
}

.top-performer-card.loading .avatar,
.top-performer-card.loading .info-block,
.top-performer-card.loading .action-buttons {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 5.5 Disabled State

```css
.buy-button:disabled,
.collab-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.buy-button:disabled:hover,
.collab-button:disabled:hover {
  transform: none;
  box-shadow: none;
}
```

---

## 6. ICON SPECIFICATIONS

### 6.1 Required Icons (from lucide-react)

```typescript
import {
  CheckCircle2,    // Verification badge
  Trophy,          // Clipper menu button
  Film,            // Clips metric (optional)
  Eye,             // Views metric (optional)
  TrendingUp,      // Performance up indicator
  TrendingDown,    // Performance down indicator
  Clock,           // Time indicator (optional)
} from 'lucide-react';
```

### 6.2 Icon Sizing

- Verification badge icon: 14px
- Clipper trophy icon: 14px
- Metric icons: 14px
- Trend indicators: 16px

---

## 7. DATA MODEL

### 7.1 TypeScript Interface

```typescript
interface TopPerformer {
  id: string;
  rank: number;
  projectName: string;
  isVerified: boolean;
  avatar: string; // URL or placeholder
  stats: {
    clipsCount: number;
    totalViews: number;
    performancePercent: number; // Can be negative
    timeframe: '24h' | '7d' | '30d';
  };
  walletAddress: string; // For buy action
  socials?: {
    twitter?: string;
    discord?: string;
  };
}
```

### 7.2 Example Data

```typescript
const examplePerformer: TopPerformer = {
  id: 'abc123',
  rank: 1,
  projectName: 'CryptoMaster',
  isVerified: true,
  avatar: '/avatars/cryptomaster.png',
  stats: {
    clipsCount: 1247,
    totalViews: 3456789,
    performancePercent: 245.67,
    timeframe: '24h'
  },
  walletAddress: '7xKX...abc123',
  socials: {
    twitter: '@cryptomaster',
  }
};
```

---

## 8. ANIMATIONS

### 8.1 Entry Animation

```css
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.top-performer-card {
  animation: slide-in-right 0.4s ease-out;
}

/* Stagger effect for lists */
.top-performer-card:nth-child(1) { animation-delay: 0s; }
.top-performer-card:nth-child(2) { animation-delay: 0.1s; }
.top-performer-card:nth-child(3) { animation-delay: 0.2s; }
```

### 8.2 Performance Update Animation

When stats update in real-time:

```css
@keyframes stat-flash {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(209, 253, 10, 0.2);
  }
}

.performance-value.updated {
  animation: stat-flash 0.6s ease-out;
}
```

### 8.3 Rank Change Animation

When rank changes:

```css
@keyframes rank-pulse {
  0%, 100% {
    transform: scale(1);
    color: #D1FD0A;
  }
  50% {
    transform: scale(1.15);
    color: #E5FF4A;
    text-shadow: 0 0 24px rgba(209, 253, 10, 0.8);
  }
}

.rank-badge.rank-changed {
  animation: rank-pulse 0.8s ease-out;
}
```

---

## 9. ACCESSIBILITY

### 9.1 ARIA Labels

```tsx
<article
  className="top-performer-card"
  role="article"
  aria-label={`Top performer ${rank}: ${projectName}`}
>
  <span className="rank-badge" aria-label={`Rank ${rank}`}>
    {rank}
  </span>

  <button
    className="collab-button"
    aria-label={`Collaborate with ${projectName}`}
  >
    Collab
  </button>

  <button
    className="buy-button"
    aria-label={`Buy token from ${projectName}`}
  >
    Buy
  </button>
</article>
```

### 9.2 Keyboard Navigation

- Tab order: Card > Clipper button > Collab button > Buy button
- Enter/Space on card: Navigate to profile
- Enter/Space on buttons: Trigger action
- Escape: Close any opened modals

### 9.3 Screen Reader Support

```tsx
<div className="verification-text">
  <CheckCircle2 aria-hidden="true" />
  <span className="sr-only">Verified creator</span>
  <span aria-label="Verified">Verified</span>
</div>

<div className="metrics-row">
  <span aria-label={`${stats.clipsCount} clips created`}>
    {formatNumber(stats.clipsCount)} Clips
  </span>
  <span aria-label={`${stats.totalViews} total views`}>
    {formatNumber(stats.totalViews)} Views
  </span>
</div>
```

---

## 10. PERFORMANCE CONSIDERATIONS

### 10.1 Optimization

- Use `memo()` for component
- Lazy load avatars with blur placeholder
- Debounce hover effects
- Use CSS transforms for animations (hardware accelerated)
- Virtual scrolling for long lists (>50 items)

### 10.2 Image Optimization

```tsx
<Image
  src={avatar}
  alt={projectName}
  width={64}
  height={64}
  className="avatar"
  loading="lazy"
  placeholder="blur"
  blurDataURL="/placeholder-avatar.jpg"
/>
```

---

## 11. VARIANT OPTIONS

### 11.1 Compact Variant

For dense layouts or mobile:

```css
.top-performer-card.compact {
  padding: 12px 16px;
  gap: 10px;
}

.compact .rank-badge {
  font-size: 24px;
  width: 40px;
}

.compact .avatar {
  width: 40px;
  height: 40px;
}

.compact .project-name {
  font-size: 15px;
}

.compact .metrics-row,
.compact .performance-row {
  font-size: 12px;
}
```

### 11.2 Featured Variant

For #1 ranked performer:

```css
.top-performer-card.featured {
  background: linear-gradient(
    135deg,
    rgba(209, 253, 10, 0.05) 0%,
    rgba(8, 8, 9, 0.6) 100%
  );
  border: 2px solid #D1FD0A;
  box-shadow: 0 0 40px rgba(209, 253, 10, 0.2);
}

.featured .rank-badge {
  font-size: 40px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}
```

---

## 12. EXAMPLE USAGE

### 12.1 Component Implementation

```tsx
import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface TopPerformerCardProps {
  performer: TopPerformer;
  onCollab: (id: string) => void;
  onBuy: (id: string) => void;
  onClipperMenu: (id: string) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export const TopPerformerCard: React.FC<TopPerformerCardProps> = ({
  performer,
  onCollab,
  onBuy,
  onClipperMenu,
  variant = 'default'
}) => {
  const { rank, projectName, isVerified, avatar, stats } = performer;
  const isPositive = stats.performancePercent >= 0;

  return (
    <article
      className={`top-performer-card ${variant} ${rank === 1 ? 'featured' : ''}`}
      aria-label={`Top performer ${rank}: ${projectName}`}
    >
      {/* Rank Badge */}
      <div className={`rank-badge rank-${rank}`}>
        {rank}
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        {/* Avatar */}
        <div className="avatar-container">
          <Image
            src={avatar}
            alt={projectName}
            width={64}
            height={64}
            className="avatar"
          />
          {isVerified && (
            <div className="verification-badge">
              <CheckCircle2 />
            </div>
          )}
        </div>

        {/* Info Block */}
        <div className="info-block">
          <h3 className="project-name">{projectName}</h3>

          {isVerified && (
            <div className="verification-text">
              <CheckCircle2 />
              <span>Verified</span>
            </div>
          )}

          <div className="metrics-row">
            <span className="metric-item">
              {formatNumber(stats.clipsCount)} Clips
            </span>
            <span className="metric-separator">·</span>
            <span className="metric-item">
              {formatNumber(stats.totalViews)} Views
            </span>
          </div>

          <div className="performance-row">
            {isPositive ? <TrendingUp /> : <TrendingDown />}
            <span className={`performance-value ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}{stats.performancePercent}%
            </span>
            <span className="time-indicator">{stats.timeframe}</span>
          </div>

          <button
            className="clipper-menu-button"
            onClick={() => onClipperMenu(performer.id)}
          >
            <Trophy />
            Clipper Menu
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="collab-button"
          onClick={() => onCollab(performer.id)}
          aria-label={`Collaborate with ${projectName}`}
        >
          Collab
        </button>
        <button
          className="buy-button"
          onClick={() => onBuy(performer.id)}
          aria-label={`Buy token from ${projectName}`}
        >
          Buy
        </button>
      </div>
    </article>
  );
};

// Helper function
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
```

---

## 13. UX RECOMMENDATIONS

### 13.1 Interaction Patterns

1. **Card Click:** Navigate to performer's full profile
2. **Collab Button:** Open collaboration modal/form
3. **Buy Button:** Initiate token purchase flow (Solana wallet)
4. **Clipper Menu:** Open dropdown/modal with clipper-specific actions

### 13.2 Micro-interactions

- **Hover delay:** 100ms before triggering hover state (prevents accidental hovers)
- **Button feedback:** Immediate visual response (<50ms)
- **Stat updates:** Smooth number transitions (animate-count-up)

### 13.3 Empty States

```tsx
// No verified status
{!isVerified && (
  <span className="text-zinc-500 text-xs">Unverified</span>
)}

// Missing stats
{stats.clipsCount === 0 && (
  <span className="text-zinc-500 text-sm">No clips yet</span>
)}
```

### 13.4 Loading Skeleton

```tsx
export const TopPerformerCardSkeleton: React.FC = () => (
  <div className="top-performer-card loading">
    <div className="rank-badge bg-zinc-800 animate-pulse">--</div>
    <div className="avatar-container">
      <div className="avatar bg-zinc-800 animate-pulse" />
    </div>
    <div className="info-block space-y-2">
      <div className="h-5 bg-zinc-800 rounded animate-pulse w-32" />
      <div className="h-4 bg-zinc-800 rounded animate-pulse w-24" />
      <div className="h-4 bg-zinc-800 rounded animate-pulse w-40" />
    </div>
    <div className="action-buttons">
      <div className="h-10 bg-zinc-800 rounded-xl animate-pulse w-24" />
      <div className="h-10 bg-zinc-800 rounded-xl animate-pulse w-24" />
    </div>
  </div>
);
```

---

## 14. TESTING CHECKLIST

### 14.1 Visual Testing

- [ ] Renders correctly on desktop (1920px, 1440px, 1024px)
- [ ] Renders correctly on tablet (768px)
- [ ] Renders correctly on mobile (375px, 414px)
- [ ] Rank badges display correctly (1-10+)
- [ ] Verification badge shows for verified users
- [ ] Avatar loads with placeholder
- [ ] Buttons are properly sized and aligned
- [ ] Hover states work on all interactive elements
- [ ] Focus states visible for keyboard navigation

### 14.2 Functional Testing

- [ ] Card click navigates to profile
- [ ] Collab button triggers correct action
- [ ] Buy button triggers correct action
- [ ] Clipper menu button opens menu
- [ ] Numbers format correctly (K/M)
- [ ] Negative percentages show red
- [ ] Positive percentages show lime
- [ ] Loading state displays correctly
- [ ] Error states handled gracefully

### 14.3 Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen reader announces elements correctly
- [ ] ARIA labels present and correct
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Interactive elements have min 44x44px touch target

### 14.4 Performance Testing

- [ ] Component renders in <16ms
- [ ] Images lazy load correctly
- [ ] No layout shift during load (CLS)
- [ ] Hover effects don't cause jank
- [ ] Lists of 50+ cards scroll smoothly

---

## 15. IMPLEMENTATION NOTES

### 15.1 File Structure

```
components/
├── TopPerformerCard/
│   ├── TopPerformerCard.tsx
│   ├── TopPerformerCard.module.css
│   ├── TopPerformerCardSkeleton.tsx
│   ├── types.ts
│   └── index.ts
```

### 15.2 Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "next": "^14.x",
    "lucide-react": "^0.x",
    "clsx": "^2.x" // For conditional classes
  }
}
```

### 15.3 CSS Modules vs Tailwind

This spec uses vanilla CSS for clarity. Convert to:
- **Tailwind:** Use utility classes as shown in design system
- **CSS Modules:** Use scoped class names
- **Styled Components:** Convert to styled-components syntax

### 15.4 Integration with Existing System

```tsx
// Use existing BTDemo design tokens
import { btdemoColors, btdemoRadius } from '@/styles/btdemo';

// Use existing formatters
import { formatNumber, formatPercentage } from '@/lib/utils';

// Use existing components
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
```

---

## 16. FUTURE ENHANCEMENTS

### 16.1 Phase 2 Features

1. **Sparkline Chart:** Mini performance chart inline
2. **Live Updates:** Real-time stat updates via WebSocket
3. **Social Proof:** "X people collaborated" badge
4. **Trending Badge:** "Trending" indicator for rapidly growing
5. **Filter Tags:** Display niche/category tags
6. **Quick Actions Menu:** Three-dot menu for more actions

### 16.2 Advanced Interactions

1. **Swipe Actions (Mobile):** Swipe right = Collab, Swipe left = Buy
2. **Long Press:** Hold to preview full profile
3. **Drag to Compare:** Drag card to comparison view
4. **Share Card:** Generate shareable image of card

---

## 17. DESIGN RATIONALE

### 17.1 Key Decisions

**Why Lime Green (#D1FD0A)?**
- High visibility and energy
- Aligns with BTDemo brand identity
- Creates strong CTA hierarchy

**Why LED Font for Numbers?**
- Reinforces performance/metrics theme
- Digital/tech aesthetic appropriate for crypto
- High readability for numeric data

**Why Rank Badge Left?**
- Western reading pattern (left to right)
- Immediate recognition of leaderboard position
- Clear visual hierarchy

**Why Two CTAs (Collab + Buy)?**
- Caters to two user types: Creators (collab) and Investors (buy)
- Buy is primary (lime green) as it's revenue-generating
- Collab is secondary but still accessible

### 17.2 UX Principles Applied

1. **Progressive Disclosure:** Show key info first, actions second
2. **Consistency:** Matches BTDemo design system throughout
3. **Feedback:** Every interaction has visual/haptic response
4. **Accessibility:** WCAG 2.1 AA compliant from start
5. **Performance:** Optimized for 60fps interactions

---

## 18. FINAL CHECKLIST

### Before Implementation:
- [ ] Review spec with stakeholders
- [ ] Confirm data availability (clips, views, performance)
- [ ] Verify Solana wallet integration for Buy button
- [ ] Design collab flow/modal
- [ ] Design clipper menu options
- [ ] Create avatar placeholder assets
- [ ] Set up analytics tracking for CTA clicks

### During Implementation:
- [ ] Follow TypeScript strict mode
- [ ] Add Zod validation for data
- [ ] Implement error boundaries
- [ ] Add loading states
- [ ] Add empty states
- [ ] Write unit tests
- [ ] Write integration tests

### After Implementation:
- [ ] Conduct accessibility audit
- [ ] Perform performance audit
- [ ] A/B test CTA button copy
- [ ] Monitor conversion rates
- [ ] Gather user feedback
- [ ] Iterate based on data

---

## 19. SUPPORT & RESOURCES

**Design System:** `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\styles\btdemo.css`
**Color Palette:** `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\styles\colors.css`
**Fonts:** `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\styles\fonts.css`
**Icons:** [Lucide React](https://lucide.dev/)
**Reference:** [BTDemo Design System]

---

**Document Version:** 2.0
**Last Updated:** 2025-10-24
**Author:** ICM Motion Design Team
**Status:** Ready for Implementation
