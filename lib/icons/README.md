# ICM Motion Icon Library

Complete icon system for the ICM Motion Solana Launch Platform.

## 📦 Icon Inventory (36 Custom Icons + lucide-react)

### Platform Icons (3)
- `IconTwitter` - Twitter/X platform
- `IconTelegram` - Telegram platform
- `IconDiscord` - Discord platform

### Action Icons (8)
- `IconLightning` - Energy, trending, motion
- `IconCollabExpand` - Network expansion, collaboration
- `IconPriceUp` - Price increase, upward trend
- `IconUpvote` - Upvote, like, positive feedback
- `IconFreeze` - Pause, freeze, timer
- `IconClose` - Close, dismiss, remove
- `IconDeposit` - Add funds, deposit
- `IconWithdraw` - Remove funds, withdraw

### Symbols & Indicators (9)
- `IconLab` - Experiments, testing, innovation
- `IconMotion` - Community momentum (detailed)
- `IconMotion1` - Community momentum (simple)
- `IconMotion2` - Community momentum (variant)
- `IconMotion4` - Community momentum (with blur/glow)
- `IconMessage` - Chat, messaging
- `IconWallet` - Cryptocurrency wallet, balance
- `IconComputer` - Desktop view, screen
- `IconAim` - Target, focus, precision

### UI Icons (3)
- `IconInfo` - Information, help
- `IconNotification` - Notification badge
- `IconMenu` - Hamburger menu

### Navigation (4)
- `IconNavArrowUp` - Navigate up
- `IconNavArrowDown` - Navigate down
- `IconNavArrowLeft` - Navigate left
- `IconNavArrowRight` - Navigate right

### Badge Components (3)
- `IconContributorBubble` - Hexagonal avatar container
- `IconActivityBadge` - Platform activity indicator (3 variants: positive/neutral/negative)
- `IconMotionScoreBadge` - Motion score display with LED font

### Additional Icons (5)
- `IconTopPerformer` - Top contributors, achievements
- `IconSearch` - Search functionality
- `IconAttention` - Alerts, warnings
- `IconGem` - Premium, value, rewards
- `IconTrophy` - Achievements, winners, awards

---

## 🎨 Usage Examples

### Basic Icon
```tsx
import { IconTwitter, IconLightning } from '@/lib/icons'

<IconTwitter className="text-primary" size={20} />
<IconLightning className="text-white" size={24} />
```

### Badge Components
```tsx
import { IconActivityBadge, IconMotionScoreBadge } from '@/lib/icons'

// Activity badge with variants
<IconActivityBadge variant="positive" size={42}>
  <IconTwitter className="text-primary" size={20} />
</IconActivityBadge>

<IconActivityBadge variant="neutral" size={42}>
  <IconDiscord className="text-white" size={20} />
</IconActivityBadge>

<IconActivityBadge variant="negative" size={42}>
  <IconAttention className="text-danger" size={20} />
</IconActivityBadge>

// Motion score badge
<IconMotionScoreBadge score={85} size={30} />
<IconMotionScoreBadge score="42%" size={30} />
```

### Contributor Bubble
```tsx
import { IconContributorBubble } from '@/lib/icons'

<IconContributorBubble size={42}>
  <img src="avatar.jpg" alt="User" className="w-full h-full object-cover" />
</IconContributorBubble>
```

### Navigation Arrows
```tsx
import { IconNavArrowUp, IconNavArrowDown } from '@/lib/icons'

<IconNavArrowUp className="stroke-primary" size={14} />
<IconNavArrowDown className="stroke-white" size={14} />
```

### lucide-react Icons
```tsx
import { TrendingUp, Users, MessageCircle } from '@/lib/icons'

<TrendingUp className="text-success" size={20} />
<Users className="text-white" size={20} />
<MessageCircle className="text-primary" size={20} />
```

---

## 🎨 Design System Integration

### Icon Sizes
Standardized sizes following 8px grid:
- `16` - Small icons (inline, chips)
- `20` - Default icons (buttons, cards)
- `24` - Large icons (navigation, headers)
- `32+` - Special cases (motion indicators, badges)

### Color Usage
All icons use `currentColor` by default. Style with Tailwind:

```tsx
// Text colors
<IconLightning className="text-primary" />    // #D1FD0A
<IconClose className="text-danger" />         // #EF4444
<IconInfo className="text-white" />           // #FFFFFF

// Fill colors (for filled icons)
<IconGem className="fill-primary" />
<IconTrophy className="fill-warning" />

// Stroke colors (for outline icons)
<IconNavArrowUp className="stroke-primary" />
```

### Special Effects
Some icons have built-in effects:

```tsx
// Motion4 - blur/glow effect (5px blur)
<IconMotion4 className="fill-primary" />

// Withdraw - blur effect (2px blur)
<IconWithdraw className="fill-primary opacity-100" />

// Motion1/2 - opacity effects
<IconMotion1 className="fill-primary opacity-100" />
```

---

## 🎯 Badge Variants

### IconActivityBadge
- **positive** - Lime border (#D1FD0A) - Active/successful
- **neutral** - White border (#FFF) - Standard/inactive
- **negative** - Pink border (#FF005C) - Warnings/errors

```tsx
<IconActivityBadge variant="positive" size={42}>
  {children}
</IconActivityBadge>
```

### IconMotionScoreBadge
Displays motion scores with LED Dot-Matrix font:
- Dark gray fill (#2A2A2A)
- Gray border (#3B3B3B)
- Lime text (#D1FD0A)
- Font: LED Dot-Matrix, 15px

```tsx
<IconMotionScoreBadge score={85} />
<IconMotionScoreBadge score="42%" />
```

---

## 📚 Typography Integration

### LED Dot-Matrix Font
Used for balance displays and motion scores:

**Large Display (Balance Font 1)**
```css
font-family: "LED Dot-Matrix";
font-size: 32px;
color: #D1FD0A;
letter-spacing: -1.28px;
```

**Small Display (Balance Font 2)**
```css
font-family: "LED Dot-Matrix";
font-size: 16px;
color: #D1FD0A;
font-weight: 400;
```

**Score Display (Motion Badge)**
```css
font-family: "LED Dot-Matrix";
font-size: 15px;
color: #D1FD0A;
letter-spacing: -0.6px;
```

---

## 🔧 Adding New Icons

1. **Create SVG component** in `lib/icons/custom/`:
```tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface IconNewProps {
  className?: string
  size?: 16 | 20 | 24
}

export const IconNew = ({ className, size = 20 }: IconNewProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('inline-block flex-shrink-0', className)}
      aria-label="New Icon"
    >
      <path d="..." fill="currentColor" />
    </svg>
  )
}
```

2. **Export from** `lib/icons/index.tsx`:
```tsx
export { IconNew } from './custom/IconNew'
```

3. **Document** in this README

---

## 📊 Icon Categories Summary

| Category | Count | Use Case |
|----------|-------|----------|
| Platform Icons | 3 | Social media platforms |
| Action Icons | 8 | User actions, state changes |
| Symbols & Indicators | 9 | Motion, wallet, devices |
| UI Icons | 3 | Interface elements |
| Navigation | 4 | Directional navigation |
| Badge Components | 3 | Status indicators, scores |
| Additional Icons | 5 | Achievements, search, alerts |
| **Total Custom** | **35** | |
| lucide-react | 50+ | General purpose |

---

## ✅ Best Practices

1. **Always use standardized sizes** (16, 20, 24)
2. **Use `currentColor`** for flexibility
3. **Add `aria-label`** for accessibility
4. **Follow naming convention**: `Icon{Name}`
5. **Include flex-shrink-0** to prevent squashing
6. **Use cn() utility** for className merging
7. **Document special effects** (blur, opacity)

---

**Last Updated:** 2025-10-23
**Total Icons:** 35 custom + 50+ lucide-react = 85+ icons
