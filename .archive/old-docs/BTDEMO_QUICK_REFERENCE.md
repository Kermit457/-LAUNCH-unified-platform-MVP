# BTDEMO Design System - Quick Reference Guide

**One-page cheat sheet for developers during migration**

---

## Color System

### Old → New Mapping

```typescript
// Text colors
text-[#00FFFF]  →  text-primary
text-[#00FF88]  →  text-primary
text-cyan-400   →  text-primary
text-cyan-500   →  text-primary

// Background colors
bg-cyan-500/20  →  bg-primary/20
bg-cyan-500/10  →  bg-primary/10

// Border colors
border-cyan-500     →  border-primary
border-cyan-500/30  →  border-primary/30

// Gradients
from-cyan-500  →  from-primary
to-cyan-600    →  to-primary
```

### Primary Color
- **Hex**: `#D1FD0A`
- **Tailwind**: `text-primary`, `bg-primary`, `border-primary`
- **CSS Variable**: `var(--btdemo-primary)`

---

## Icon System

### Common Replacements

```typescript
// Before (Lucide)
import { Search, TrendingUp, Users, X } from 'lucide-react'

// After (btdemo)
import { IconSearch, IconPriceUp, IconContributorBubble, IconClose } from '@/lib/icons'

// Usage
<IconSearch size={20} className="text-primary" />
```

### Icon Mapping Table

| Old (Lucide) | New (btdemo) | Status |
|--------------|--------------|--------|
| `Search` | `IconSearch` | ✅ Ready |
| `TrendingUp` | `IconPriceUp` | ✅ Ready |
| `TrendingDown` | `IconPriceDown` | ✅ Ready |
| `Users` | `IconContributorBubble` | ✅ Ready |
| `MessageCircle` | `IconMessage` | ✅ Ready |
| `X` | `IconClose` | ✅ Ready |
| `DollarSign` | `IconCash` | ✅ Ready |
| `Zap` | `IconLightning` | ✅ Ready |
| `Heart` | `IconUpvote` | ✅ Ready |
| `Bell` | `IconNotification` | ✅ Ready |
| `Rocket` | `IconRocket` | ✅ Ready |
| `Eye` | `IconEye` | ⚠️ Create |
| `Music2` | `IconMusic` | ⚠️ Create |
| `Share2` | `IconShare` | ⚠️ Create |
| `Send` | Keep Lucide | 📌 Utility |
| `Copy` | Keep Lucide | 📌 Utility |

### Icon Variants

```typescript
// Color variants (apply via className)
className="icon-primary"              // #D1FD0A
className="icon-active"               // White
className="icon-inactive"             // Zinc-500
className="icon-muted"                // Zinc-400
className="icon-interactive"          // Hover effect
className="icon-interactive-primary"  // Primary hover
```

---

## Typography (LED Fonts)

### When to Use LED Fonts

**Use `font-led-dot` for:**
- All numeric displays (prices, counts, percentages)
- Stats and metrics
- Balances and holdings
- Vote counts, holder numbers
- Any number < 1000

**Use `font-led` for:**
- Large hero numbers (>60px)
- Motion scores (main display)
- Dashboard metrics (main KPIs)

**Use regular font for:**
- Text content
- Labels and descriptions
- User-generated content

### LED Font Classes

```typescript
// DSEG14 Classic (large displays)
className="font-led text-6xl text-primary"

// LED Dot-Matrix (general numeric)
className="font-led-dot text-2xl text-primary"

// Size variants
text-xs   // 12px - Small badges
text-sm   // 14px - Compact stats
text-base // 16px - Default
text-lg   // 18px - Emphasized
text-xl   // 20px - Large stats
text-2xl  // 24px - Hero numbers
text-4xl  // 36px - Dashboard
text-6xl  // 60px - Motion scores
```

### Examples

```tsx
// Price display
<div className="font-led-dot text-xl text-primary">
  ${price.toFixed(2)}
</div>

// Motion score
<div className="font-led text-6xl text-primary">
  {motionScore}
</div>

// Holder count
<div className="font-led-dot text-sm text-white">
  {holderCount}
</div>
```

---

## Glass Effects

### Two Standard Patterns

```typescript
// Premium cards (main content)
className="glass-premium"
// bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl

// Interactive elements (hover states)
className="glass-interactive"
// bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl
```

### Usage

```tsx
// Before (inline styles)
<div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-800">
  {children}
</div>

// After (utility class)
<div className="glass-premium">
  {children}
</div>
```

### Hover Effects

```tsx
// Premium with hover
<div className="glass-premium hover:-translate-y-0.5 transition-all">
  {children}
</div>

// Interactive with scale
<div className="glass-interactive hover:scale-[1.02] transition-all">
  {children}
</div>
```

---

## Component Usage

### ProjectCard (btdemo)

```tsx
import { ProjectCard } from '@/components/btdemo'

<ProjectCard
  project={{
    id: '1',
    name: 'Project Name',
    subtitle: 'Description',
    motionScore: 85,
    price: 0.42,
    priceChange: 15.3,
    marketCap: '1.2M',
    volume: '340K',
    contributors: 247,
    upvotes: 324,
    comments: 89,
    isVerified: true,
    isTopPerformer: true,
    isPremium: true,
    isFrozen: false,
  }}
  onBuy={() => handleBuy()}
  onViewDetails={() => handleDetails()}
/>
```

### MotionScoreDisplay

```tsx
import { MotionScoreDisplay } from '@/components/btdemo'

<MotionScoreDisplay
  score={85}
  size="lg"      // 'sm' | 'md' | 'lg'
  showLabel={true}
/>
```

### FilterPill

```tsx
import { FilterPill } from '@/components/btdemo'

<FilterPill
  active={typeFilter === 'icm'}
  onClick={() => setTypeFilter('icm')}
  className="data-[active]:bg-[#00FF88]/20 data-[active]:border-[#00FF88]"
>
  ICM
</FilterPill>
```

### LEDNumber

```tsx
import { LEDNumber } from '@/components/btdemo'

<LEDNumber
  value={1234.56}
  prefix="$"
  suffix=" SOL"
  size="lg"           // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color="primary"     // 'primary' | 'white' | 'green' | 'red'
  variant="dot-matrix"  // 'classic' | 'dot-matrix'
/>
```

### GlassCard

```tsx
import { GlassCard } from '@/components/btdemo'

<GlassCard
  variant="premium"  // 'premium' | 'interactive'
  hover={true}
  onClick={handleClick}
>
  {children}
</GlassCard>
```

---

## Common Patterns

### Stat Card

```tsx
<div className="glass-interactive p-4 rounded-xl border-2 border-primary/50 hover:border-primary transition-all">
  <div className="flex items-center gap-2 mb-2">
    <IconCash size={16} className="icon-muted" />
    <span className="stat-label">Price</span>
  </div>
  <div className="font-led-dot text-2xl text-primary">
    ${price.toFixed(2)}
  </div>
  <div className="flex items-center gap-1 text-xs">
    {priceChange > 0 ? (
      <>
        <IconPriceUp size={10} className="text-green-400" />
        <span className="text-green-400">+{priceChange}%</span>
      </>
    ) : (
      <>
        <IconPriceDown size={10} className="text-red-400" />
        <span className="text-red-400">{priceChange}%</span>
      </>
    )}
  </div>
</div>
```

### Filter Bar

```tsx
<div className="flex items-center gap-3">
  <label className="text-sm font-bold text-white uppercase">Type</label>
  <div className="flex gap-3">
    <FilterPill
      active={typeFilter === 'all'}
      onClick={() => setTypeFilter('all')}
      className="data-[active]:bg-zinc-800/50 data-[active]:border-zinc-700"
    >
      All
    </FilterPill>
    <FilterPill
      active={typeFilter === 'icm'}
      onClick={() => setTypeFilter('icm')}
      className="data-[active]:bg-[#00FF88]/20 data-[active]:border-[#00FF88]"
    >
      ICM
    </FilterPill>
  </div>
</div>
```

### Badge

```tsx
<div className="badge-success flex items-center gap-1">
  <IconRocket size={12} />
  <span>Launched</span>
</div>

<div className="badge-primary flex items-center gap-1">
  <IconTrophy size={12} />
  <span>Top 10</span>
</div>

<div className="badge-warning flex items-center gap-1">
  <IconFreeze size={12} />
  <span>Frozen</span>
</div>
```

---

## Helper Utilities

### cn() - Class Name Utility

```tsx
import { cn } from '@/lib/cn'

<div className={cn(
  "base-class",
  isActive && "active-class",
  isPremium ? "premium-class" : "standard-class",
  className  // Allow prop override
)}>
  {children}
</div>
```

### formatNumber()

```tsx
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Usage
<span>{formatNumber(1234567)}</span>  // "1,234,567"
```

---

## Scripts

### Color Migration
```bash
# Preview changes
node scripts/migrate-colors.js

# Apply changes
node scripts/migrate-colors.js --apply

# Single file
node scripts/migrate-colors.js --file=app/discover/page.tsx --apply
```

### Icon Audit
```bash
# Full audit
node scripts/audit-icons.js

# Show missing icons only
node scripts/audit-icons.js --missing

# JSON output
node scripts/audit-icons.js --json > icon-audit.json
```

---

## Testing Checklist

After making changes:

- [ ] `tsc --noEmit` - TypeScript check
- [ ] `npm run lint` - ESLint check
- [ ] `npm run dev` - Visual check
- [ ] Test on mobile (responsive)
- [ ] Test dark mode
- [ ] Verify LED fonts load
- [ ] Check icon rendering
- [ ] Test hover states
- [ ] Verify colors match btdemo
- [ ] Performance check (no layout shifts)

---

## Common Issues & Fixes

### Issue: LED font not loading
**Fix**: Check font file path, verify `font-display: swap`, clear browser cache

### Issue: Icon not found
**Fix**: Check import path, verify icon exists in `lib/icons/custom/`

### Issue: Color not updating
**Fix**: Run `npm run build` to rebuild Tailwind classes

### Issue: Glass effect not working
**Fix**: Ensure backdrop-blur is supported, check browser compatibility

### Issue: TypeScript error on icon props
**Fix**: Add proper interface, use `size?: number` and `className?: string`

---

## Resources

- **Main Audit**: `BTDEMO_TECHNICAL_AUDIT_COMPLETE.md`
- **btdemo Reference**: `app/btdemo/page.tsx`
- **Icon Library**: `lib/icons/index.tsx`
- **Design Tokens**: `tailwind.config.ts`
- **Component Examples**: `components/btdemo/README.md`

---

**Last Updated**: 2025-10-23
**Version**: 1.0
