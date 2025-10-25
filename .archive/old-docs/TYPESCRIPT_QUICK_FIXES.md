# TypeScript Quick Fixes - Immediate Actions

**Goal:** Fix 22 compilation errors IMMEDIATELY

---

## CRITICAL FIX 1: Icon Type System (Fixes 19/22 errors)

### Step 1: Create Icon Types File

Create `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\lib\icons\types.ts`:

```typescript
export interface BaseIconProps {
  className?: string
  'aria-label'?: string
}

export type StandardIconSize = 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 128

export interface IconProps extends BaseIconProps {
  size?: StandardIconSize
}

export interface CustomDimensionIconProps extends BaseIconProps {
  width?: number
  height?: number
}

export interface BadgeIconProps extends BaseIconProps {
  size?: 28 | 30 | 32 | 38 | 40 | 42 | 48
}

export interface ProgressIconProps extends BaseIconProps {
  width?: number
  height?: number
  progress?: number
}

export type MotionScoreLetter = 'M' | 'A' | 'B' | 'C' | 'D' | 'F'

export interface ScoreBadgeIconProps extends BaseIconProps {
  score: MotionScoreLetter
  size?: 28 | 30 | 32
}
```

### Step 2: Update Icon Components

**Update these to use `IconProps`:**
- IconMotion.tsx
- IconRocket.tsx
- IconTrophy.tsx
- IconGem.tsx
- IconFreeze.tsx
- IconAttention.tsx
- IconLab.tsx
- IconLightning.tsx
- IconCash.tsx
- IconCap.tsx

**Example:**
```typescript
// BEFORE
import React from 'react'
import { cn } from '@/lib/utils'

interface IconMotionProps {
  className?: string
  size?: 16 | 20 | 24
}

export const IconMotion = ({ className, size = 20 }: IconMotionProps) => {

// AFTER
import React from 'react'
import { cn } from '@/lib/utils'
import { IconProps } from '../types'

export const IconMotion = ({ className, size = 20 }: IconProps) => {
```

**Update to use `BadgeIconProps`:**
- IconActivityBadge.tsx
- IconMotionScoreBadge.tsx (use `ScoreBadgeIconProps`)

**Update to use `CustomDimensionIconProps`:**
- IconChartAnimation.tsx (currently has width/height)
- IconNotification.tsx (needs special handling)

**Update to use `ProgressIconProps`:**
- IconMotionBar.tsx

**Update IconSolana.tsx:**
```typescript
import { IconProps } from '../types'

export const IconSolana = ({ className, size = 24 }: IconProps) => {
  // Keep implementation, just change prop type
```

---

## CRITICAL FIX 2: Missing Icon Type Imports (Fixes 3/22 errors)

These files import from non-existent `../types`:
- `lib/icons/custom/IconPriceDown.tsx`
- `lib/icons/custom/IconPriceUp.tsx`
- `lib/icons/custom/IconVerified.tsx`
- `lib/icons/custom/IconNotification.tsx`

**Update all to:**
```typescript
// Line 2
import { IconProps } from '../types'  // Change from './types'
```

---

## VERIFICATION

Run after fixes:
```bash
cd "c:\Users\mirko\OneDrive\Desktop\widgets-for-launch"
npx tsc --noEmit
```

Should show **0 errors** instead of 22.

---

## Files to Modify (Total: 53)

1. `lib/icons/types.ts` - CREATE NEW
2. `lib/icons/custom/IconMotion.tsx`
3. `lib/icons/custom/IconRocket.tsx`
4. `lib/icons/custom/IconTrophy.tsx`
5. `lib/icons/custom/IconGem.tsx`
6. `lib/icons/custom/IconFreeze.tsx`
7. `lib/icons/custom/IconAttention.tsx`
8. `lib/icons/custom/IconLab.tsx`
9. `lib/icons/custom/IconLightning.tsx`
10. `lib/icons/custom/IconCash.tsx`
11. `lib/icons/custom/IconCap.tsx`
12. `lib/icons/custom/IconSolana.tsx`
13. `lib/icons/custom/IconActivityBadge.tsx`
14. `lib/icons/custom/IconMotionScoreBadge.tsx`
15. `lib/icons/custom/IconChartAnimation.tsx`
16. `lib/icons/custom/IconMotionBar.tsx`
17. `lib/icons/custom/IconPriceDown.tsx`
18. `lib/icons/custom/IconPriceUp.tsx`
19. `lib/icons/custom/IconVerified.tsx`
20. `lib/icons/custom/IconNotification.tsx`
... (33 more icon components to standardize)

---

## Time Estimate

- Create types.ts: 2 minutes
- Update 20 critical icons: 20 minutes (1 min each)
- Update remaining 32 icons: 30 minutes
- Verification: 2 minutes

**Total: ~55 minutes to zero TypeScript errors**
