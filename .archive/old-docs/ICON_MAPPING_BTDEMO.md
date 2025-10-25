# ICON MAPPING FOR DEVELOPERS
## Quick Reference Guide for /btdemo

**Purpose:** Show developers EXACTLY which icons to use for which metrics
**Last Updated:** 2025-10-23

---

## CRITICAL FIXES NEEDED

### 🔴 WRONG ICONS (Fix Immediately)

| Metric | Current Icon | ❌ Problem | ✅ Correct Icon |
|--------|-------------|-----------|----------------|
| **Volume (24h)** | Unknown/Missing | No visual indicator | `<Repeat />` or `<ArrowLeftRight />` |
| **Market Cap** | Unknown/Missing | Confusing with price | `<DollarSign />` with badge wrapper |
| **Collaborate** | `<Users />` or `<MessageCircle />` | Too generic | `handshake-icon.svg` (EXISTS!) |
| **Referrals** | `<Zap />` | Zap = energy, not network | `<Share2 />` or custom badge |
| **Telegram** | `<Send />` | Too generic | Telegram-specific SVG |

---

## LIST A: MATCHED ICONS (Currently Used + Verified Correct)

### ✅ Financial Metrics

| Metric | Icon | Status | Usage |
|--------|------|--------|-------|
| Price | `<DollarSign />` | ✓ CORRECT | Current token value |
| Holdings | `<Package />` or `<Coins />` | ✓ CORRECT | Assets owned |
| Earnings | `<DollarSign />` | ✓ CORRECT | Revenue stream |
| Price Up | `<TrendingUp />` | ✓ CORRECT | Positive change |
| Price Down | `<TrendingDown />` | ✓ CORRECT | Negative change |

### ✅ Social Metrics

| Metric | Icon | Status | Usage |
|--------|------|--------|-------|
| Holders | `<Users />` | ✓ CORRECT | Individual wallets |
| Views | `<Eye />` | ✓ CORRECT | Passive observation |
| Comments | `<MessageSquare />` | ✓ CORRECT | Engagement |
| Upvotes | `<ArrowUp />` | ✓ CORRECT | Approval/voting |
| Share | `<Share2 />` | ✓ CORRECT | Distribution |

### ✅ Platform Actions

| Action | Icon | Status | Usage |
|--------|------|--------|-------|
| Buy/Purchase | `<ShoppingCart />` | ✓ CORRECT | Purchase keys/tokens |
| Launch | `<Rocket />` | ✓ CORRECT | New project launch |
| Create | `<Plus />` | ✓ CORRECT | Add new item |
| Search | `<Search />` | ✓ CORRECT | Find/filter |
| Notifications | `<Bell />` | ✓ CORRECT | Alerts |
| Copy | `<Copy />` | ✓ CORRECT | Copy to clipboard |

### ✅ Content Types

| Type | Icon | Status | Usage |
|------|------|--------|-------|
| ICM (Projects) | `<Coins />` | ✓ CORRECT | Token/project cards |
| CCM (Creators) | `<Video />` | ✓ CORRECT | Creator content |
| MEME (Viral) | `<Flame />` | ✓ CORRECT | Trending/hot |
| Airdrop | `<Sparkles />` | ✓ CORRECT | Claimable tokens |

### ✅ Social Platforms

| Platform | Icon | Status | Usage |
|----------|------|--------|-------|
| Twitter/X | `<Twitter />` or `<X />` | ✓ CORRECT | Social link |
| Website | `<Globe />` | ✓ CORRECT | External website |

---

## LIST B: UNMATCHED ICONS (Need Replacement)

### 🟠 Icons That Need Better Alternatives

| Current Use | Current Icon | Why It's Wrong | Better Option |
|-------------|-------------|----------------|---------------|
| **Volume** | ❌ Missing | No flow visualization | `<Repeat />` (circular flow) |
| **Market Cap** | ❌ Missing | Needs "total" concept | `<DollarSign />` + badge circle |
| **Activity** | `<Zap />` | Energy ≠ activity | `IconActivityBadge` (custom) |
| **Liquidity** | ❌ Missing | Needs fluid metaphor | `<Droplet />` or Waves SVG |
| **Transactions** | ❌ Missing | Needs ongoing flow | `<RefreshCw />` or `<Repeat />` |
| **Telegram** | `<Send />` | Generic send icon | Telegram plane SVG |
| **Collaborate** | `<Users />` | Generic people | `handshake-icon.svg` ✓ |
| **Referrals** | `<Zap />` | Energy metaphor weak | `<Share2 />` or custom badge |

---

## SEMANTIC ICON RULES

### Rule 1: One Icon, One Meaning

❌ DON'T use `<Users />` for:
- Holders
- Contributors
- Community
- Collaborations
- Network size

✅ DO create specific variants:
- Holders = `<Users />` with wallet
- Contributors = `IconContributorBubble`
- Collaborations = `handshake-icon.svg`
- Network = `<Network />` or `<Globe />`

### Rule 2: Flow vs. Static Value

| Concept | Icon Type | Examples |
|---------|-----------|----------|
| **Static Value** | Single object | `<DollarSign />` for price |
| **Flow/Movement** | Directional arrows | `<Repeat />` for volume |
| **Change Over Time** | Trend lines | `<TrendingUp />` for price change |
| **Accumulation** | Container | `<Package />` for holdings |

### Rule 3: Size Hierarchy

```tsx
// Hero metrics (large, prominent)
<DollarSign className="w-8 h-8" /> // 32px

// Card metrics (medium)
<TrendingUp className="w-5 h-5" /> // 20px

// Table cells (small)
<Eye className="w-4 h-4" /> // 16px

// Inline indicators (tiny)
<ArrowUp className="w-3 h-3" /> // 12px
```

---

## CORRECT IMPLEMENTATIONS

### Example 1: Volume Metric (FIXED)

```tsx
// ❌ WRONG - No icon or wrong icon
<div className="metric">
  <span>Volume:</span>
  <span>1.2M SOL</span>
</div>

// ✅ CORRECT - Shows flow/activity
import { Repeat } from 'lucide-react'

<div className="metric">
  <Repeat className="w-4 h-4 text-blue-400" />
  <span>Volume:</span>
  <span>1.2M SOL</span>
</div>
```

### Example 2: Market Cap (FIXED)

```tsx
// ❌ WRONG - Same as price
<div className="metric">
  <DollarSign className="w-4 h-4" />
  <span>Market Cap:</span>
  <span>$5.2M</span>
</div>

// ✅ CORRECT - Distinct from price
import { DollarSign, Circle } from 'lucide-react'

<div className="metric">
  <div className="relative">
    <DollarSign className="w-4 h-4 text-green-400" />
    <Circle className="absolute -inset-1 w-6 h-6 stroke-1 opacity-30 text-green-400" />
  </div>
  <span>Market Cap:</span>
  <span>$5.2M</span>
</div>
```

### Example 3: Collaborate Action (FIXED)

```tsx
// ❌ WRONG - Generic users icon
import { Users } from 'lucide-react'

<button>
  <Users className="w-4 h-4" />
  Collaborate
</button>

// ✅ CORRECT - Specific handshake icon
import IconHandshake from '@/public/icons/handshake-icon.svg'

<button>
  <IconHandshake className="w-4 h-4 text-purple-400" />
  Collaborate
</button>
```

### Example 4: Referral Badge (FIXED)

```tsx
// ❌ WRONG - Zap has weak semantic link
import { Zap } from 'lucide-react'

<div className="referral-badge">
  <Zap className="w-4 h-4" />
  <span>12 Referrals</span>
</div>

// ✅ CORRECT - Share icon shows network growth
import { Share2 } from 'lucide-react'

<div className="referral-badge">
  <Share2 className="w-4 h-4 text-orange-400" />
  <span>12 Referrals</span>
</div>
```

---

## CUSTOM ICONS AVAILABLE

### Confirmed Custom Icons

```tsx
// 1. Handshake Icon (CONFIRMED EXISTS)
import IconHandshake from '@/public/icons/handshake-icon.svg'
// Use for: Collaborations, partnerships, deals

// 2. Custom Icons (Need to verify path)
// IconMotionBar - Progress/animation bars
// IconChartAnimation - Chart growth animations
// IconContributorBubble - Active contributors
// IconActivityBadge - Live activity indicator
// IconVolume - Trading volume specific
// IconCap - Market cap specific
```

### How to Use Custom SVG Icons

```tsx
// Import as React component
import IconHandshake from '@/public/icons/handshake-icon.svg'

// Use with Tailwind classes
<IconHandshake className="w-5 h-5 text-purple-400" />

// With hover states
<IconHandshake className="w-5 h-5 text-zinc-400 hover:text-purple-400 transition-colors" />
```

---

## ICON LIBRARY (Centralized)

Create this file for consistency:

```tsx
// c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\icons\IconLibrary.tsx

import {
  // Financial
  DollarSign, TrendingUp, TrendingDown, Coins, Package,
  // Social
  Users, Eye, MessageSquare, Share2, Bell,
  // Actions
  ShoppingCart, Rocket, Plus, Search, Copy,
  // Flow
  Repeat, ArrowLeftRight, RefreshCw,
  // Misc
  Sparkles, Flame, Video, Globe, Twitter
} from 'lucide-react'

// Custom imports
import IconHandshake from '@/public/icons/handshake-icon.svg'

export const Icons = {
  // Financial Metrics
  price: DollarSign,
  volume: Repeat, // Shows transaction flow
  marketCap: (props) => ( // Composite icon
    <div className="relative">
      <DollarSign {...props} />
      <Circle className="absolute -inset-1 w-6 h-6 stroke-1 opacity-30" />
    </div>
  ),
  holdings: Package,
  priceUp: TrendingUp,
  priceDown: TrendingDown,

  // Social Metrics
  holders: Users,
  views: Eye,
  comments: MessageSquare,
  share: Share2,
  notifications: Bell,

  // Actions
  buy: ShoppingCart,
  launch: Rocket,
  create: Plus,
  search: Search,
  copy: Copy,
  collaborate: IconHandshake, // CUSTOM!

  // Content Types
  project: Coins,
  creator: Video,
  meme: Flame,
  airdrop: Sparkles,

  // Platforms
  twitter: Twitter,
  website: Globe,
} as const

// Type-safe usage:
// import { Icons } from '@/components/icons/IconLibrary'
// <Icons.volume className="w-4 h-4" />
```

---

## QUICK DECISION TREE

```
Need an icon for a metric?
│
├─ Is it a DOLLAR AMOUNT?
│  ├─ Current price → <DollarSign />
│  ├─ Total value → <DollarSign /> + badge
│  └─ Holdings → <Package /> or <Coins />
│
├─ Is it MOVEMENT/FLOW?
│  ├─ Transaction volume → <Repeat />
│  ├─ Price change → <TrendingUp /> or <TrendingDown />
│  └─ Activity → <RefreshCw /> or custom badge
│
├─ Is it PEOPLE-RELATED?
│  ├─ Holders count → <Users />
│  ├─ Views → <Eye />
│  ├─ Comments → <MessageSquare />
│  ├─ Collaborations → handshake-icon.svg
│  └─ Referrals → <Share2 />
│
├─ Is it an ACTION?
│  ├─ Purchase → <ShoppingCart />
│  ├─ Launch → <Rocket />
│  ├─ Create → <Plus />
│  ├─ Share → <Share2 />
│  └─ Notify → <Bell />
│
└─ Is it a TYPE/CATEGORY?
   ├─ ICM (Project) → <Coins />
   ├─ CCM (Creator) → <Video />
   ├─ MEME (Viral) → <Flame />
   └─ Airdrop → <Sparkles />
```

---

## ACCESSIBILITY REQUIREMENTS

Every icon MUST have:

```tsx
// 1. Accessible wrapper for icon-only buttons
<button
  aria-label="View transaction volume"
  title="Volume (24h)"
>
  <Icons.volume className="w-4 h-4" />
</button>

// 2. Meaningful context for screen readers
<div>
  <Icons.holders className="w-4 h-4" aria-hidden="true" />
  <span className="sr-only">Token holders:</span>
  <span>1,234</span>
</div>

// 3. Minimum size (16x16px)
className="w-4 h-4" // minimum

// 4. Color contrast (4.5:1 minimum)
className="text-zinc-400" // passes on black bg
```

---

## TESTING YOUR ICON CHOICE

Ask yourself:

1. ✅ **Would a new user understand this icon without a label?**
   - Yes → Good choice
   - No → Add label or choose clearer icon

2. ✅ **Is this icon used for anything else in the app?**
   - No → Good, unique meaning
   - Yes → Choose different icon to avoid confusion

3. ✅ **Does the icon match the user's mental model?**
   - Volume = Flow/Movement (Repeat, arrows)
   - Price = Static value (DollarSign)
   - Collaborate = Partnership (Handshake)

4. ✅ **Is the icon accessible at 16px size?**
   - Clear at small size → Keep it
   - Unclear → Choose simpler icon

---

## FILES TO UPDATE

### Priority 1 (Critical Fixes):

1. `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\AdvancedTableView.tsx`
   - Add Volume column with `<Repeat />` icon
   - Add Market Cap column with badged `<DollarSign />`

2. `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\UnifiedCard.tsx`
   - Replace collaborate icon with `handshake-icon.svg`

3. `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\mobile\CoinListItem.tsx`
   - Fix Telegram icon (use proper Telegram SVG)

### Priority 2 (Standardization):

4. Create `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\icons\IconLibrary.tsx`
   - Centralize all icon mappings
   - Export type-safe icon references

5. Create `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\icon-demo\page.tsx`
   - Visual showcase of all icons
   - Semantic mapping guide
   - Copy-paste code examples

---

## SUMMARY

### ❌ Icons to STOP Using:
- `<Zap />` for referrals (use `<Share2 />`)
- `<Users />` for collaborations (use `handshake-icon.svg`)
- `<Send />` for Telegram (use Telegram SVG)
- Generic `<Users />` for everything (differentiate use cases)

### ✅ Icons to START Using:
- `<Repeat />` for volume (shows flow)
- `<DollarSign />` + badge for market cap (shows total)
- `handshake-icon.svg` for collaborations (EXISTS!)
- `<Share2 />` for referrals (network growth)

### 🎯 Key Principle:
**ONE ICON = ONE MEANING**

Don't reuse icons across different concepts. Users build mental models:
- "Circle with arrows = volume"
- "Handshake = collaboration"
- "Shopping cart = purchase"

Consistency = Faster user comprehension = Better UX.

---

**For /btdemo Page:**
Show side-by-side comparison:
- Left column: ❌ Current (wrong) icons
- Right column: ✅ Correct icons with explanation
- Center: Visual diff highlighting why it matters

**Ready to implement!**
