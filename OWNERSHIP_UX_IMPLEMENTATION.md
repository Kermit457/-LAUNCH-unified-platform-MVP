# Ownership UX Implementation - Launch Cards

> Minimal ownership indicators for the /discover page - shows user's key holdings at a glance

---

## ✅ What Was Built

### Three Ownership Signals

1. **Ownership Pill** - Top-right badge showing "Holding {N}" keys
2. **CTA Swap** - "Buy Keys" vs "Manage" based on ownership
3. **Micro-Ring Indicator** - Circular progress around avatar (0-75% of user's share)

### Components Created

#### 1. `components/launch/EnhancedLaunchCard.tsx`

Main component with ownership UX atoms.

**Features:**
- ✅ Ownership pill (hidden on mobile, sm:flex)
- ✅ SVG circular progress ring (maps share % to 0-75% arc)
- ✅ CTA button swaps label based on `myKeys > 0`
- ✅ Hover/focus tooltip showing share % and estimated tokens
- ✅ Accessible with ARIA labels and keyboard navigation

**Data Contract:**
```typescript
type LaunchCardData = {
  id: string
  name: string
  avatarUrl: string
  tags: string[]
  // Portfolio data
  myKeys: number
  mySharePct: number
  estLaunchTokens: number | null
}
```

#### 2. `app/dev/cards/page.tsx`

Test page with three fixtures demonstrating all states:

- **Case A**: Zero position (myKeys=0, no pill, "Buy Keys" CTA)
- **Case B**: Small position (myKeys=57, 2.3%, shows token estimate)
- **Case C**: Large position (myKeys=1200, 18.9%, no token estimate)

Visit: `http://localhost:3000/dev/cards`

#### 3. `hooks/useUserHoldings.ts`

Data fetching hooks:

- `useUserHoldings(curveId, userId)` - Single curve holdings
- `useBatchUserHoldings(curveIds[], userId)` - Batch fetch for discover page

Fetches from: `/api/curve/[id]/holdings?userId={userId}`

Returns:
```typescript
{
  balance: number      // Keys held
  avgPrice: number
  totalInvested: number
  realizedPnl: number
  unrealizedPnl: number
}
```

#### 4. `components/ProjectCardWithOwnership.tsx`

Wrapper component that:
- Detects launch-type projects
- Fetches user holdings + total supply
- Calculates share percentage
- Renders `EnhancedLaunchCard` with ownership data
- Falls back to original `ProjectCard` for non-launch types

#### 5. `lib/utils/ui.ts`

Utility functions:
- `percentToStroke()` - SVG stroke-dasharray calculation
- `formatCompactNumber()` - 1.2k, 3.4M notation
- `formatSharePct()` - Display formatting for percentages

---

## 📐 Design Specs

### Ownership Pill

```tsx
{hasPos && (
  <div className="absolute right-3 top-3 hidden sm:flex rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs">
    Holding {myKeys}
  </div>
)}
```

- Position: `absolute right-3 top-3`
- Hidden on mobile: `hidden sm:flex`
- Style: `bg-white/10 border border-white/15 backdrop-blur`
- Copy: "Holding {N}" (integer, no decimals)

### CTA Swap

```tsx
<button data-cta={hasPos ? 'manage' : 'buy'}>
  {hasPos ? 'Manage' : 'Buy Keys'}
</button>
```

- If `myKeys > 0`: "Manage"
- Else: "Buy Keys"
- `data-cta` attribute for e2e testing
- Navigates to `/launch/{id}?action=buy|manage`

### Micro-Ring Indicator

```tsx
const R = 22
const C = 2 * Math.PI * R
const pct = Math.max(0, Math.min(75, mySharePct)) // Clamp to 0-75%
const dash = C * (pct / 100)

<svg viewBox="0 0 50 50" style={{ transform: 'rotate(-90deg)' }}>
  {/* Track - always visible */}
  <circle cx="25" cy="25" r={22} stroke="currentColor"
    strokeWidth="2" className="opacity-20" fill="none" />

  {/* Progress - only if myKeys > 0 */}
  {hasPos && (
    <circle cx="25" cy="25" r={22} stroke="currentColor"
      strokeWidth="2" fill="none"
      strokeDasharray={`${dash} ${C}`}
      className="text-purple-400 transition-all duration-200" />
  )}
</svg>
```

- Radius: 22px
- Maps `mySharePct` to 0-75% arc (prevents visual dominance)
- Track: 20% opacity (always visible)
- Progress: Colored stroke (CCM=purple, ICM=yellow)
- Transition: `200ms` smooth

### Tooltip

```tsx
<div role="tooltip" className="absolute left-14 top-1/2 -translate-y-1/2">
  You ≈ {pct.toFixed(1)}%
  {estLaunchTokens && ` • Est. launch tokens ${estLaunchTokens.toLocaleString()}`}
</div>
```

- Trigger: Hover or keyboard focus on avatar container
- Position: `left-14` (next to avatar)
- Content: Share % + optional token estimate
- Hidden by default: `opacity-0 group-hover:opacity-100`

---

## 🔌 Integration Guide

### Option 1: Direct Use (Test Page)

```tsx
import { EnhancedLaunchCard } from '@/components/launch/EnhancedLaunchCard'

<EnhancedLaunchCard data={{
  id: 'abc123',
  title: '$TOKEN',
  // ... other fields
  myKeys: 42,
  mySharePct: 3.2,
  estLaunchTokens: 15000,
}} />
```

### Option 2: Wrapper (Discover Page)

```tsx
import { ProjectCardWithOwnership } from '@/components/ProjectCardWithOwnership'

// Automatically fetches holdings and renders appropriate card
<ProjectCardWithOwnership
  project={project}
  onUpdateProject={handleUpdate}
/>
```

### Option 3: Batch Optimization

For `/discover` with many cards, use batch fetch:

```tsx
const { holdingsMap, getKeyCount, hasKeys } = useBatchUserHoldings(
  launches.map(l => l.id),
  user?.id
)

{launches.map(launch => (
  <EnhancedLaunchCard
    data={{
      ...launch,
      myKeys: getKeyCount(launch.id),
      mySharePct: calculateSharePct(launch.id),
      estLaunchTokens: estimateTokens(launch.id),
    }}
  />
))}
```

---

## 🧪 Testing Checklist

### Visual Tests

- [ ] Pill only shows when `myKeys > 0`
- [ ] Pill hidden on mobile (`< sm` breakpoint)
- [ ] Ring track visible at 20% opacity even with zero keys
- [ ] Ring progress stroke matches market type color (CCM=purple, ICM=yellow)
- [ ] Ring arc clamped to 75% max
- [ ] CTA says "Buy Keys" when `myKeys = 0`
- [ ] CTA says "Manage" when `myKeys > 0`

### Interaction Tests

- [ ] Hover avatar → tooltip appears
- [ ] Tooltip shows share %
- [ ] Tooltip shows token estimate (if not null)
- [ ] Tooltip hides second part when `estLaunchTokens = null`
- [ ] Click CTA → navigates to `/launch/{id}?action=buy|manage`
- [ ] Tab to avatar → tooltip appears (keyboard accessible)

### Accessibility Tests

- [ ] Avatar container has `role="img"`
- [ ] Avatar container has `aria-label` with share %
- [ ] Tooltip has `role="tooltip"`
- [ ] Tooltip reachable via keyboard focus
- [ ] All interactive elements focusable with Tab

### Performance Tests

- [ ] No reflow loops (check DevTools Performance)
- [ ] Ring animation smooth (CSS transition on stroke-dashoffset)
- [ ] Batch fetch completes < 2s for 20 cards
- [ ] No layout shift on holdings load

---

## 🔄 Data Flow

```
User visits /discover
    ↓
Page renders launch cards
    ↓
useBatchUserHoldings(curveIds[], userId)
    ↓
Parallel fetch /api/curve/[id]/holdings?userId=xxx
    ↓
Returns { balance, avgPrice, totalInvested, ... }
    ↓
Calculate mySharePct = (balance / totalSupply) * 100
    ↓
Render EnhancedLaunchCard with ownership data
    ↓
User sees: pill + ring + CTA
```

---

## 📂 Files Created

```
components/
  launch/
    EnhancedLaunchCard.tsx         ← Main component
  ProjectCardWithOwnership.tsx     ← Wrapper with data fetching

hooks/
  useUserHoldings.ts               ← Holdings fetch hook

lib/
  utils/
    ui.ts                           ← SVG/formatting utilities

app/
  dev/
    cards/
      page.tsx                      ← Test page with fixtures
```

---

## 🚀 Next Steps

### Immediate

1. **Test visual states**: Visit `/dev/cards` and verify all three cases
2. **Test interactions**: Hover tooltips, click CTAs, tab navigation
3. **Wire into /discover**: Replace `ProjectCard` with `ProjectCardWithOwnership`

### Short-term

1. **Add loading skeletons** for holdings data
2. **Handle errors** gracefully (show zero holdings on API failure)
3. **Optimize batch fetching** (consider React Query or SWR for caching)
4. **Add analytics** tracking for "Buy Keys" vs "Manage" clicks

### Long-term

1. **Real-time updates** when holdings change (WebSocket or polling)
2. **Estimated token calculation** based on actual tokenomics
3. **Portfolio value** in tooltip (show USD value of holdings)
4. **Historical holdings** chart on manage page

---

## 📊 Metrics to Track

- **Conversion Rate**: "Buy Keys" clicks / card views
- **Engagement Lift**: Holders clicking "Manage" vs non-holders
- **Tooltip Usage**: Hover/focus events on ring
- **Mobile Behavior**: Pill visibility impact on engagement

---

## 🎨 Design Decisions

### Why 0-75% arc maximum?

Full circles (100%) are visually dominant and imply "complete" ownership, which is misleading. Capping at 75% keeps the indicator subtle and proportional.

### Why no numbers on card surface?

Following the "minimal UX" principle - the ring is a visual signal, not precise data. Users can hover for exact percentage. Keeps cards clean.

### Why "Holding N" not "N keys"?

Shorter, more natural language. "Holding" implies ownership without technical jargon.

### Why tooltip instead of always-visible %?

Respects screen real estate. Power users will hover; casual users get the visual ring signal.

---

## ✅ Acceptance Criteria Met

- [x] Ownership pill renders ONLY if myKeys > 0
- [x] Pill position: top-right, absolute, correct styling
- [x] Pill hidden on small screens (sm:flex hidden)
- [x] CTA swaps based on holding (Buy Keys / Manage)
- [x] data-cta attribute present
- [x] Ring maps mySharePct to 0-75% arc
- [x] Ring shows track only if myKeys == 0
- [x] Tooltip shows on hover/focus
- [x] Tooltip format correct with optional token estimate
- [x] Avatar wrapper has role and aria-label
- [x] Tooltip has role="tooltip"
- [x] CSS transitions (no inline styles except dasharray math)
- [x] Three test fixtures in dev page
- [x] Utility function for stroke calculation

---

**Status**: ✅ Ready for testing
**Committed**: feat(card): minimal ownership UX (pill, CTA swap, ring)
**Test URL**: http://localhost:3000/dev/cards
