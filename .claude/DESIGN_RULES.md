# Design Rules - BTDEMO is the ONLY Standard

**CRITICAL: BTDEMO is the design system. No other. No exceptions.**

---

## The Rule

**BTDEMO (`app/btdemo/page.tsx`) is the ONLY design reference.**

- Not "btdemo-inspired"
- Not "similar to btdemo"
- Not "in the style of btdemo"
- **EXACTLY btdemo. Period.**

---

## What This Means

### Colors
```css
/* PRIMARY - ONLY THIS */
--primary: #D1FD0A;  /* Lime green */
--primary-hover: #B8E309;

/* NOT THESE */
--wrong: #00FF88;  /* ❌ Never */
--wrong: #00D1FF;  /* ❌ Never */
--wrong: Any other green; /* ❌ Never */
```

**If you use any color not in btdemo → WRONG**

### Typography
```css
/* Numbers - LED Font ONLY */
font-family: 'DSEG14'; /* font-led-dot class */

/* Everything else */
font-family: system-ui, -apple-system, sans-serif;
```

**If numbers don't use LED font → WRONG**

### Borders
```css
/* Interactive elements */
border: 2px solid rgb(209 253 10 / 0.5); /* border-primary/50 */

/* Hover */
border-color: #D1FD0A; /* border-primary */

/* NOT */
border: 1px solid #zinc-700; /* ❌ WRONG */
```

**If borders aren't lime green → WRONG**

### Glass Morphism
```css
/* Premium cards */
.glass-premium {
  background: rgb(24 24 27 / 0.6); /* zinc-900/60 */
  backdrop-filter: blur(24px);
  border-radius: 24px; /* rounded-3xl */
}

/* Interactive elements */
.glass-interactive {
  background: rgb(24 24 27 / 0.5);
  backdrop-filter: blur(16px);
  border-radius: 16px; /* rounded-2xl */
}
```

**If glass effect doesn't match btdemo → WRONG**

### Spacing
```
Small gap: 8px (gap-2)
Medium gap: 12px (gap-3)
Large gap: 16px (gap-4)
Section gap: 24px (gap-6)

Card padding: 24px (p-6)
Small padding: 16px (p-4)
Tight padding: 12px (p-3)
```

**If spacing doesn't match btdemo → WRONG**

---

## Reference Files

### ALWAYS Check These:

1. **Visual Reference:**
   - File: `app/btdemo/page.tsx`
   - Run: `http://localhost:3000/btdemo`
   - This is the source of truth

2. **Design Specification:**
   - File: `BTDEMO_DESIGN_SPECIFICATION.md`
   - Complete breakdown of btdemo system
   - Read before ANY UI work

3. **Global CSS:**
   - File: `app/globals.css`
   - Contains font-led-dot and utility classes
   - Use these classes, don't create new ones

---

## Verification Checklist

### Before Showing ANY UI to User:

**Colors:**
- [ ] Primary is #D1FD0A (lime green)
- [ ] No #00FF88 or other greens used
- [ ] Borders are border-primary or border-primary/XX
- [ ] Background is pure black (#000000)

**Typography:**
- [ ] ALL numbers use font-led-dot class
- [ ] Font sizes match btdemo scale
- [ ] Font weights match btdemo (font-black for headings)

**Components:**
- [ ] Cards use glass-premium or glass-interactive
- [ ] Buttons match btdemo button styles
- [ ] Badges match btdemo badge styles
- [ ] Icons from @/lib/icons (no lucide direct imports)

**Layout:**
- [ ] Spacing matches btdemo (gap-2, gap-3, gap-4, gap-6)
- [ ] Border radius matches (rounded-xl, rounded-2xl, rounded-3xl)
- [ ] Padding matches (p-3, p-4, p-6)

**Responsive:**
- [ ] Mobile-first approach
- [ ] Breakpoints: sm (640), md (768), lg (1024), xl (1280), 2xl (1536)
- [ ] Touch targets minimum 44x44px on mobile

**Animations:**
- [ ] Using Framer Motion (not CSS-only)
- [ ] Hover effects subtle (scale 1.02-1.05)
- [ ] Transitions smooth (300ms duration)
- [ ] No janky animations

---

## Common Mistakes

### ❌ WRONG:
```tsx
// Using wrong primary color
<div className="bg-[#00FF88]">  // ❌

// Not using LED font for numbers
<span className="text-2xl">420</span>  // ❌

// Wrong border
<div className="border border-zinc-700">  // ❌

// Creating custom colors
<div className="bg-gradient-to-r from-blue-500">  // ❌

// Using lucide icons directly
import { Zap } from 'lucide-react'  // ❌
```

### ✅ CORRECT:
```tsx
// Using btdemo primary
<div className="bg-primary">  // ✅

// LED font for numbers
<span className="font-led-dot text-2xl">420</span>  // ✅

// Lime borders
<div className="border-2 border-primary/50">  // ✅

// Using btdemo gradients
<div className="bg-gradient-to-br from-primary to-cyan-500">  // ✅

// Using icon system
import { IconLightning } from '@/lib/icons'  // ✅
```

---

## Icon System Rules

### ONLY Use Icons From:
```tsx
import {
  IconLightning,
  IconMotion,
  IconMotionScoreBadge,
  IconWallet,
  // ... etc
} from '@/lib/icons'
```

### NEVER:
```tsx
import { Zap, Activity } from 'lucide-react'  // ❌ WRONG
```

### Why:
- Custom icons match brand
- Consistent sizing
- Proper colors
- Optimized for design system

---

## Component Patterns

### Buttons

**Primary Action:**
```tsx
<button className="bg-primary hover:bg-primary/90 text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
  Apply Now
</button>
```

**Secondary Action:**
```tsx
<button className="glass-interactive px-6 py-3 rounded-xl font-bold border-2 border-primary/50 hover:border-primary text-primary transition-all">
  View Details
</button>
```

**Icon Button:**
```tsx
<button className="w-10 h-10 rounded-lg glass-interactive border-2 border-primary/50 hover:border-primary flex items-center justify-center">
  <IconLightning size={20} className="text-primary" />
</button>
```

### Cards

**Premium Card:**
```tsx
<div className="glass-premium p-6 rounded-3xl border-2 border-primary/30 hover:border-primary transition-all">
  {/* Content */}
</div>
```

**Stat Card:**
```tsx
<div className="glass-interactive p-4 rounded-xl border-2 border-primary/50 hover:border-primary transition-all">
  <div className="stat-label mb-2">Motion Score</div>
  <div className="font-led-dot text-3xl text-primary">420</div>
</div>
```

### Badges

**Success Badge:**
```tsx
<span className="badge-success">Active</span>
```

**Primary Badge:**
```tsx
<span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-primary/10 text-primary border border-primary/30">
  Curator
</span>
```

---

## Layout Patterns

### Page Structure:
```tsx
<div className="min-h-screen bg-black relative">
  {/* Blob backgrounds */}
  <div className="fixed -top-48 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
  <div className="fixed -bottom-48 -right-48 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

  {/* Content */}
  <div className="relative z-10">
    <nav className="...">...</nav>
    <main className="container mx-auto px-6 py-12">
      {/* Page content */}
    </main>
  </div>
</div>
```

### Grid Layouts:
```tsx
{/* Stats grid */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stat cards */}
</div>

{/* 3-column layout */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
  <aside className="hidden xl:block xl:col-span-3">{/* Left */}</aside>
  <div className="xl:col-span-6">{/* Center */}</div>
  <aside className="hidden xl:block xl:col-span-3">{/* Right */}</aside>
</div>
```

---

## When in Doubt

### Always Ask:
1. "Does this exist in btdemo?"
2. "If yes, copy that pattern exactly"
3. "If no, ask user first"

### Never:
1. Create new color variations
2. Use different fonts
3. Create new component patterns
4. Deviate from btdemo "to make it better"

**btdemo IS the standard. Match it exactly.**

---

## Agent Briefing for UI Work

### ALWAYS Include in Brief:

```markdown
**Design System: BTDEMO ONLY**
Reference: app/btdemo/page.tsx
Specification: BTDEMO_DESIGN_SPECIFICATION.md

**Critical Requirements:**
- Primary color: #D1FD0A (lime green) ONLY
- All numbers: font-led-dot class
- All borders: border-primary or border-primary/XX
- Icons: @/lib/icons ONLY (no lucide direct)
- Glass effects: glass-premium or glass-interactive
- Spacing: btdemo scale (gap-2/3/4/6, p-3/4/6)
- Animations: Framer Motion, subtle hover (1.02-1.05 scale)

**Verification:**
- Does it look identical to btdemo quality?
- If different from btdemo, is there explicit approval?
```

---

## The Standard

**btdemo page is the gold standard.**

- Copy patterns from btdemo
- Match btdemo quality exactly
- Use btdemo components
- Follow btdemo spacing
- Apply btdemo animations
- Match btdemo responsiveness

**If it doesn't look like btdemo → it's wrong.**

---

**No exceptions. No variations. BTDEMO is the standard.**

**Last Updated:** 2025-10-25
**Authority:** User requirement
**Enforcement:** Every UI change must reference btdemo
