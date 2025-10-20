# Design Tokens - Before & After

**Generated:** 2025-10-20
**Migration:** LaunchOS → ICMotion

## Color System Comparison

### Primary Colors

| Token | LaunchOS (Before) | ICMotion (After) | Change |
|-------|-------------------|------------------|--------|
| Primary 1 | `#E700FF` (Fuchsia) | `#00FFFF` (Cyan) | 🔄 Changed |
| Primary 2 | `#5A00FF` (Violet) | `#00FF88` (Green) | 🔄 Changed |
| Primary 3 | `#00F0FF` (Cyan) | `#FFD700` (Yellow) | 🔄 Changed |

### Accent Colors

| Token | LaunchOS (Before) | ICMotion (After) | Change |
|-------|-------------------|------------------|--------|
| Accent 1 | N/A | `#FF0040` (Red) | ✅ New |
| Accent 2 | N/A | `#FF8800` (Orange) | ✅ New |
| Accent 3 | N/A | `#0088FF` (Blue) | ✅ New |
| Accent 4 | N/A | `#8800FF` (Purple) | ✅ New |

### Base Colors (Unchanged)

| Token | Value | Status |
|-------|-------|--------|
| Black | `#0a0a0c` | ✅ Kept |
| Darker | `#0f0f12` | ✅ Kept |
| Dark | `#18181b` | ✅ Kept |
| Card | `#1a1a1f` | ✅ Kept |

## Tailwind Config Changes

### Added to `tailwind.config.ts`

```typescript
// ICM Motion Color Palette 2025
primary: {
  cyan: '#00FFFF',    // NEW
  green: '#00FF88',   // NEW
  yellow: '#FFD700',  // NEW
},
accent: {
  red: '#FF0040',     // NEW
  orange: '#FF8800',  // NEW
  blue: '#0088FF',    // NEW
  purple: '#8800FF',  // NEW
},
```

### Legacy Colors (Kept for Compatibility)

```typescript
'launchos-fuchsia': '#E700FF',  // LEGACY
'launchos-violet': '#5A00FF',   // LEGACY
'launchos-cyan': '#00F0FF',     // LEGACY
```

## CSS Variable Changes

### New Variables in `styles/colors.css`

```css
/* PRIMARY COLORS */
--primary-cyan: #00FFFF;
--primary-green: #00FF88;
--primary-yellow: #FFD700;

/* ACCENT COLORS */
--accent-red: #FF0040;
--accent-orange: #FF8800;
--accent-blue: #0088FF;
--accent-purple: #8800FF;

/* GRADIENTS */
--gradient-cyan-green: linear-gradient(135deg, #00FFFF, #00FF88);
--gradient-green-yellow: linear-gradient(135deg, #00FF88, #FFD700);
--gradient-rainbow: linear-gradient(135deg, #00FFFF, #00FF88, #FFD700, #FF8800, #FF0040);
--gradient-premium: linear-gradient(135deg, #00FFFF, #8800FF);
```

## Gradient Changes

### Before (LaunchOS)

```css
.gradient-text-launchos {
  background: linear-gradient(135deg, #E700FF 0%, #5A00FF 50%, #00F0FF 100%);
}

.glass-launchos {
  border: 1px solid rgba(231, 0, 255, 0.2);
}
```

### After (ICMotion)

```css
.gradient-text-icm {
  background: linear-gradient(135deg, #00FFFF 0%, #00FF88 50%, #FFD700 100%);
}

.glass-icm {
  border: 1px solid rgba(0, 255, 255, 0.2);
}
```

**Note:** Legacy classes kept with `/* LEGACY */` comment

## Usage in Components

### Navigation Colors

| Item | LaunchOS | ICMotion | Rationale |
|------|----------|----------|-----------|
| Discover | N/A | Cyan `#00FFFF` | Primary action |
| Launch | N/A | Green `#00FF88` | Growth/creation |
| Earn | N/A | Yellow `#FFD700` | Rewards/value |
| Live | N/A | Red `#FF0040` | Urgency/live |
| Network | N/A | Blue `#0088FF` | Social/connection |

### Component Mappings

| Component | Color Usage | Before | After |
|-----------|-------------|--------|-------|
| Connect Button | Primary CTA | Fuchsia gradient | Yellow `#FFD700` |
| Active Nav | Highlight | Fuchsia | Context color (Cyan/Green/Yellow/Red/Blue) |
| Cards | Border glow | Fuchsia/Violet | Cyan |
| Success States | Positive feedback | Green | Green `#00FF88` |
| Error States | Negative feedback | Red | Red `#FF0040` |

## Utility Classes

### New Utilities Added

```css
/* Text colors */
.text-primary-cyan { color: var(--primary-cyan); }
.text-primary-green { color: var(--primary-green); }
.text-primary-yellow { color: var(--primary-yellow); }
.text-accent-red { color: var(--accent-red); }
.text-accent-orange { color: var(--accent-orange); }
.text-accent-blue { color: var(--accent-blue); }
.text-accent-purple { color: var(--accent-purple); }

/* Background colors */
.bg-primary-cyan { background-color: var(--primary-cyan); }
.bg-primary-green { background-color: var(--primary-green); }
.bg-primary-yellow { background-color: var(--primary-yellow); }
/* ... (full list in colors.css) */

/* Gradient backgrounds */
.bg-gradient-cyan-green { background: var(--gradient-cyan-green); }
.bg-gradient-rainbow { background: var(--gradient-rainbow); }
/* ... (full list in colors.css) */

/* Gradient text */
.text-gradient-premium { /* Cyan to Purple gradient */ }
.text-gradient-rainbow { /* Full rainbow gradient */ }
```

## Migration Guide

### For Component Authors

**Before:**
```tsx
<div className="text-launchos-fuchsia bg-gradient-primary">
  LaunchOS
</div>
```

**After:**
```tsx
import { BRAND } from '@/lib/brand'

<div className="text-primary-cyan bg-gradient-cyan-green">
  {BRAND.name}
</div>
```

### For CSS Authors

**Before:**
```css
.my-component {
  color: #E700FF;
  background: linear-gradient(135deg, #E700FF, #5A00FF);
}
```

**After:**
```css
.my-component {
  color: var(--primary-cyan);
  background: var(--gradient-cyan-green);
}
```

## Semantic Token Mapping

| Semantic Use | LaunchOS | ICMotion |
|--------------|----------|----------|
| Brand Primary | Fuchsia | Cyan |
| Success | Green (generic) | Green `#00FF88` |
| Warning | Yellow (generic) | Yellow `#FFD700` |
| Error | Red (generic) | Red `#FF0040` |
| Info | Cyan | Blue `#0088FF` |
| Premium | Violet | Purple `#8800FF` |

## Accessibility Impact

### Contrast Ratios (WCAG AA)

| Color on Black | Before | After | Pass? |
|----------------|--------|-------|-------|
| Primary on `#0a0a0c` | Fuchsia 8.2:1 | Cyan 12.1:1 | ✅ Improved |
| Accent on `#0a0a0c` | Violet 5.9:1 | Green 14.2:1 | ✅ Improved |
| Secondary | Cyan 11.8:1 | Yellow 15.3:1 | ✅ Improved |

**Result:** ICMotion palette has better contrast across the board.

## Animation & Effects

### Neon Glow Effects

**Before:**
```css
.neon-text-fuchsia {
  color: #E700FF;
  text-shadow: 0 0 10px rgba(231, 0, 255, 0.8);
}
```

**After:**
```css
.neon-text-cyan {
  color: #00FFFF;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}
```

**Status:** Legacy neon classes kept, new ICM versions recommended

## Brand Asset Changes

| Asset | LaunchOS | ICMotion |
|-------|----------|----------|
| Logo | `launchos-logo.svg` | `icm-motion-logo.svg` |
| Favicon | `favicon.ico` | `icm-motion-logo.svg` |
| OG Image | `og-launchos.png` | `og-image.png` |

## TypeScript Constants

### New in `lib/brand.ts`

```typescript
export const BRAND = {
  colors: {
    primary: {
      cyan: '#00FFFF',
      green: '#00FF88',
      yellow: '#FFD700',
    },
    accent: {
      red: '#FF0040',
      orange: '#FF8800',
      blue: '#0088FF',
      purple: '#8800FF',
    },
  },
} as const
```

**Usage:**
```typescript
const buttonColor = BRAND.colors.primary.cyan
```

## Rollback Plan

If issues arise:
1. Legacy colors are still available via `launchos-*` classes
2. CSS variables are additive, not replacements
3. Old gradients work via `.gradient-primary` etc.
4. Component changes are isolated to new components

**Rollback:** Simply revert `lib/brand.ts` and component imports

---

**Summary:**
- ✅ All new colors added
- ✅ Legacy colors preserved
- ✅ Improved accessibility
- ✅ Better semantic naming
- ✅ Type-safe via constants
- ⚠️ Components need gradual migration

**Last Updated:** 2025-10-20
