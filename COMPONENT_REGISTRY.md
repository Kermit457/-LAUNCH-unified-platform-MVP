# Component Registry

**Generated:** 2025-10-20
**Purpose:** Canonical component reference vs deprecated components

## 🎯 Canonical Components (Use These)

### UI Primitives (shadcn/ui)
Located in `components/ui/`

| Component | Path | Purpose | Props |
|-----------|------|---------|-------|
| `Button` | `ui/button.tsx` | All button variants | `variant`, `size`, `className` |
| `Card` | `ui/card.tsx` | Container component | Standard card structure |
| `Dialog` | `ui/dialog.tsx` | Modal dialogs | `open`, `onOpenChange` |
| `Input` | `ui/input.tsx` | Form inputs | Standard input props |
| `Label` | `ui/label.tsx` | Form labels | Standard label props |
| `Progress` | `ui/progress.tsx` | Progress bars | `value`, `max` |
| `Select` | `ui/select.tsx` | Dropdowns | Standard select props |
| `Textarea` | `ui/textarea.tsx` | Multi-line input | Standard textarea props |

**Status:** ✅ **Production Ready**
**Import:** `import { Button } from '@/components/ui/button'`

### Navigation Components

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `TopNav` | `components/TopNav.tsx` | Main navigation | ✅ Updated (uses centralized nav config) |

### Layout Components

| Component | Path | Purpose | Notes |
|-----------|------|---------|-------|
| `ToastProvider` | `components/ToastProvider.tsx` | Toast notifications | Wrap app |
| `AuthProvider` | `contexts/AuthContext.tsx` | Authentication context | Privy wrapper |
| `WalletProvider` | `contexts/WalletContext.tsx` | Wallet state | Privy integration |

### Card Components

| Component | Path | Purpose | Props Interface | Status |
|-----------|------|---------|-----------------|--------|
| `UnifiedCard` | `components/UnifiedCard.tsx` | Multi-purpose card | Needs standardization | ⚠️ In Progress |
| `ProjectCard` | `components/ProjectCard.tsx` | Project display | Needs standardization | ⚠️ In Progress |
| `LaunchCard` | `components/LaunchCard.tsx` | Launch display | Needs standardization | ⚠️ In Progress |
| `CampaignCard` | `components/CampaignCard.tsx` | Campaign display | Standard | ✅ Ready |
| `RaidCard` | `components/RaidCard.tsx` | Raid display | Standard | ✅ Ready |
| `BountyCard` | `components/BountyCard.tsx` | Bounty display | Standard | ✅ Ready |
| `NetworkCard` | `components/NetworkCard.tsx` | Network user card | Standard | ✅ Ready |

**Recommended Props Interface:**
```typescript
interface BaseCardProps {
  id: string
  title: string
  description?: string
  imageUrl?: string
  href: string // Always required, no null/undefined
  stats?: Record<string, string | number>
  badges?: Array<{ label: string; variant?: 'default' | 'success' | 'warning' | 'error' }>
  actions?: Array<{ label: string; onClick: () => void; variant?: string }>
  className?: string
}
```

### Trading Components

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `BuyKeysButton` | `components/BuyKeysButton.tsx` | Buy keys CTA | ✅ Production |
| `SellKeysButton` | `components/SellKeysButton.tsx` | Sell keys CTA | ✅ Production |
| `CurveStats` | `components/CurveStats.tsx` | Curve statistics | ✅ Production |

### Landing Page Components

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `HeroSection` | `components/landing/HeroSection.tsx` | Landing hero | ✅ Production |
| `FeatureCard` | `components/landing/FeatureCard.tsx` | Feature display | ✅ Production |
| `Testimonials` | `components/landing/Testimonials.tsx` | User testimonials | ✅ Production |
| `LandingFooter` | `components/landing/LandingFooter.tsx` | Footer links | ✅ Production |
| `LiveSection` | `components/landing/LiveSection.tsx` | Live demo section | ⚠️ Has LaunchOS ref |

### Dashboard Components

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `NetWorthHero` | `components/dashboard/NetWorthHero.tsx` | Net worth display | ✅ Production |
| `KpiTile` | `components/dashboard/KpiTile.tsx` | KPI metric tile | ✅ Production |
| `ActivityList` | `components/dashboard/ActivityList.tsx` | Activity feed | ✅ Production |
| `NetworkInvites` | `components/dashboard/NetworkInvites.tsx` | Invite management | ✅ Production |

### Form Components

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `TokenInput` | `components/common/TokenInput.tsx` | Token amount input | ✅ Production |
| `TagTokenInput` | `components/common/TagTokenInput.tsx` | Tag input | ✅ Production |
| `FileDropzone` | `components/common/FileDropzone.tsx` | File upload | ✅ Production |
| `SegmentedControl` | `components/common/SegmentedControl.tsx` | Tab control | ✅ Production |

### Specialized Components

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| `LiveTicker` | `components/LiveTicker.tsx` | Scrolling ticker | ✅ Production |
| `BeliefScore` | `components/BeliefScore.tsx` | Belief score display | ✅ Production |
| `ConvictionMeter` | `components/ConvictionMeter.tsx` | Conviction gauge | ✅ Production |
| `LeaderboardTable` | `components/LeaderboardTable.tsx` | Leaderboard | ✅ Production |

## ❌ Deprecated Components (Do Not Use)

### Removed/Archived

| Component | Reason | Replacement |
|-----------|--------|-------------|
| Mock widget demos | Archived | Use real data components |
| Old prediction widgets | Archived | Use new trading components |
| Legacy social widgets | Archived | Use network components |

## 🔧 Utility Components

| Component | Path | Purpose |
|-----------|------|---------|
| `CopyButton` | `components/common/CopyButton.tsx` | Copy to clipboard |
| `PaginationControls` | `components/PaginationControls.tsx` | Pagination UI |
| `AnimatedBackground` | `components/AnimatedBackground.tsx` | Background effects |

## 📦 Component Patterns

### Standard Card Pattern
```tsx
import { Card } from '@/components/ui/card'

export function MyCard({ title, description, href }: MyCardProps) {
  return (
    <Card>
      <a href={href} className="block"> {/* Always valid href */}
        <h3>{title}</h3>
        <p>{description}</p>
      </a>
    </Card>
  )
}
```

### Standard Button Pattern
```tsx
import { Button } from '@/components/ui/button'

export function MyButton() {
  return (
    <Button variant="default" size="md">
      Click Me
    </Button>
  )
}
```

### Navigation Pattern
```tsx
import { getNavItems } from '@/config/nav'

const navItems = getNavItems({ authenticated: true })
```

## 🎨 Design System Components

### Status Chips
| Component | Path | Variants |
|-----------|------|----------|
| `StatusChip` | `ui/status-chip.tsx` | `active`, `pending`, `completed` |

### Badges & Pills
| Component | Path | Purpose |
|-----------|------|---------|
| `RankBadge` | `components/RankBadge.tsx` | User rank display |
| `ImpactScorePill` | `components/ImpactScorePill.tsx` | Impact metric |
| `MetricPill` | `ui/metric-pill.tsx` | Generic metric |

### Avatars
| Component | Path | Purpose |
|-----------|------|---------|
| `AvatarGroup` | `ui/avatar-group.tsx` | Multiple avatars |
| `MutualAvatars` | `components/profile/MutualAvatars.tsx` | Mutual connections |

## 🔍 Finding Components

### By Feature
- **Trading:** `components/[BuyKeys, SellKeys, Curve*]`
- **Network:** `components/network/*`
- **Dashboard:** `components/dashboard/*`
- **Landing:** `components/landing/*`
- **Forms:** `components/common/*Input*`

### By Type
- **Cards:** `components/*Card.tsx`
- **Buttons:** `components/*Button.tsx`
- **Modals/Drawers:** `components/*Drawer.tsx`, `components/*Modal.tsx`

## ✅ Quality Checklist

Before using a component, ensure:
- [ ] Has TypeScript props interface
- [ ] No null/undefined hrefs
- [ ] Uses design system tokens (no arbitrary colors)
- [ ] Has loading/error/empty states
- [ ] Accessibility attributes (aria-*, role, etc.)
- [ ] Responsive design

## 📝 Adding New Components

1. Use shadcn/ui as base when possible
2. Define props interface in component file
3. Use BRAND constants for colors/strings
4. Add to this registry
5. Include in Storybook (future)

---

**Last Updated:** 2025-10-20
**Component Count:** 60+
**Deprecated Count:** 8
