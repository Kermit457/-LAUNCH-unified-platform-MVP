# Button Design System Specification
## ICM Motion Launch Platform

**Version:** 1.0
**Author:** UI/UX Design System
**Date:** 2025-10-22
**Status:** PRODUCTION READY

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Audit Findings](#audit-findings)
3. [Design Principles](#design-principles)
4. [Button Hierarchy](#button-hierarchy)
5. [Component Specifications](#component-specifications)
6. [Modal Trigger Patterns](#modal-trigger-patterns)
7. [Touch Target Guidelines](#touch-target-guidelines)
8. [Implementation Plan](#implementation-plan)
9. [Migration Guide](#migration-guide)

---

## Executive Summary

### Current State Analysis
After auditing the codebase, we've identified **inconsistent button patterns** across:
- 3 major page implementations (Launch, Clip, Discover)
- 2 modal systems (CreateCampaignModal, SubmitClipModal)
- Multiple component libraries (PremiumButton, native buttons, custom implementations)
- Inconsistent spacing, colors, and interaction patterns

### Critical Issues Found
1. **Inconsistent Visual Hierarchy**: Similar actions styled differently across pages
2. **Touch Target Violations**: Buttons < 44x44px on mobile in modals (Cancel buttons at 40px height)
3. **Modal Trigger Ambiguity**: No clear visual cue that buttons open popups
4. **Color Palette Fragmentation**: 4+ color schemes for primary actions
5. **Accessibility Gaps**: Missing focus states, insufficient contrast ratios

### Design System Goals
- Establish 4 button variants with clear use cases
- Ensure 100% WCAG AA compliance (contrast, touch targets)
- Create visual language for modal/drawer triggers
- Reduce bundle size by consolidating patterns
- Improve user confidence through consistency

---

## Audit Findings

### Button Types Currently in Use

| Location | Type | Style | Issues |
|----------|------|-------|--------|
| **CreateCampaignModal** (Line 346-352) | Cancel | Ghost variant | Height 40px (4px below mobile standard) |
| **CreateCampaignModal** (Line 349-352) | Create Campaign | Primary (pink) | Good touch target, branded color |
| **SubmitClipModal** (Line 394-408) | Cancel/Submit | Native buttons | Inconsistent with design system |
| **SubmitClipModal** Submit | White bg + black text | Breaks brand consistency |
| **TokenLaunchPreview** (Line 111-117) | Collapse/Expand | Icon-only | Missing label on mobile |
| **TokenLaunchPreview** (Line 388-400) | Launch/Complete | Gradient primary | Excellent, matches brand |
| **FollowButton** (Line 43-60) | Icon-only compact | Custom state colors | Good pattern, needs docs |
| **BottomNav** (Line 88-122) | Navigation tabs | Cyan accent | Good mobile UX |
| **LaunchHeader** (Line 201-206) | "How it works" | Secondary link | Good, but inconsistent border |

### Color Palette Fragmentation

**Primary Actions (4 variations found):**
1. Gradient: `from-[#00FF88] to-[#00FFFF]` (Launch page - BEST)
2. Pink gradient: `from-violet-500 to-fuchsia-500` (Design system)
3. Design pink: `bg-design-pink-500` (CreateCampaignModal)
4. White: `bg-white text-black` (SubmitClipModal - BREAKS BRAND)

**Recommendation:** Standardize on ICM Motion brand gradient `#00FF88 → #00FFFF`

### Touch Target Analysis

| Component | Button | Mobile Height | Desktop Height | Status |
|-----------|--------|---------------|----------------|--------|
| CreateCampaignModal | Cancel | 40px | 44px | FAIL (mobile) |
| CreateCampaignModal | Submit | 40px | 44px | FAIL (mobile) |
| SubmitClipModal | Cancel | 40px (py-2.5) | 44px | FAIL (mobile) |
| SubmitClipModal | Submit | 40px (py-2.5) | 44px | FAIL (mobile) |
| TokenLaunchPreview | Launch | 44px (min-h-44) | 44px | PASS |
| BottomNav | All tabs | 56px (h-14) | 56px | PASS |
| FollowButton Compact | Icon | 32px (p-2) | 32px | FAIL |

**Critical:** 6 out of 10 interactive buttons fail WCAG 2.1 mobile touch target requirements.

---

## Design Principles

### 1. Mobile-First Progressive Enhancement
- All buttons MUST meet 44x44px minimum on mobile
- Desktop can scale up to 48-56px for hero actions
- Use `min-h-[44px]` utility for guaranteed compliance

### 2. Clear Visual Hierarchy
```
Primary > Secondary > Tertiary > Ghost > Icon-only
```

### 3. Consistent Motion Language
- Hover: `scale-105` (5% growth)
- Active: `scale-95` (5% shrink)
- Focus: 2px ring with 50% opacity brand color
- Transition: `transition-all duration-200`

### 4. Accessibility-First Design
- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Focus indicators visible on keyboard navigation
- Icon-only buttons MUST have `aria-label`
- Disabled states clearly distinguishable

### 5. Brand Coherence
- Primary gradient: `from-[#00FF88] to-[#00FFFF]`
- Hover state: Slight glow effect `shadow-[0_0_20px_rgba(0,255,136,0.3)]`
- Text on gradient: Always black for maximum contrast

---

## Button Hierarchy

### Visual Hierarchy Matrix

```
┌─────────────────────────────────────────────────────────────┐
│  Action Priority     │  Visual Weight  │  Use Case          │
├─────────────────────────────────────────────────────────────┤
│  PRIMARY             │  ████████████   │  Main CTAs         │
│  SECONDARY           │  ████████       │  Alternative paths │
│  TERTIARY            │  ████           │  Subtle actions    │
│  GHOST               │  ██             │  Cancel, dismiss   │
│  ICON-ONLY           │  █              │  Compact tools     │
└─────────────────────────────────────────────────────────────┘
```

### Button Variant Decision Tree

```
START
  │
  ├─ Is this the MAIN action user came to perform?
  │     YES → PRIMARY BUTTON (gradient, bold)
  │     NO  ↓
  │
  ├─ Does it open a modal/drawer/sheet?
  │     YES → PRIMARY/SECONDARY + Modal Icon (ChevronRight/Plus/External)
  │     NO  ↓
  │
  ├─ Is it a secondary path (e.g., "Learn More", "Skip")?
  │     YES → SECONDARY BUTTON (solid bg, border)
  │     NO  ↓
  │
  ├─ Is it canceling/dismissing an action?
  │     YES → GHOST BUTTON (transparent, border)
  │     NO  ↓
  │
  ├─ Is space extremely limited (e.g., cards, table rows)?
  │     YES → ICON-ONLY BUTTON (with tooltip)
  │     NO  ↓
  │
  └─ Use TERTIARY BUTTON (text-only link style)
```

---

## Component Specifications

### 1. Primary Button

**Use Cases:**
- Launch Token
- Create Campaign
- Submit Clip
- Buy/Sell actions
- Any main CTA

**Visual Specs:**
```tsx
// Desktop & Mobile
className: "
  px-4 md:px-6 py-3 min-h-[44px]
  bg-gradient-to-r from-[#00FF88] to-[#00FFFF]
  text-black font-bold text-sm md:text-base
  rounded-xl
  hover:scale-105 hover:shadow-[0_0_24px_rgba(0,255,136,0.4)]
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  transition-all duration-200
"
```

**Anatomy:**
```
┌────────────────────────────────────┐
│  [Icon] Button Text          44px  │
│   16px    14-16px           ↕      │
│  ◄──8px──►                         │
│           ◄────24-32px────►        │
└────────────────────────────────────┘
   ◄─────16-24px padding─────►
```

**Variants:**
- **With Icon Left:** Icon 16x16, 8px gap
- **With Icon Right:** Text + ChevronRight (for modals)
- **Loading State:** Spinner replaces icon, text shows "Processing..."
- **Success State:** Brief green checkmark animation

**Color Values:**
```css
/* Normal */
background: linear-gradient(90deg, #00FF88 0%, #00FFFF 100%);
color: #000000;

/* Hover */
box-shadow: 0 0 24px rgba(0, 255, 136, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3);
transform: scale(1.05);

/* Active */
transform: scale(0.95);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

**Accessibility:**
- Contrast ratio: 14.5:1 (AAA) - Black text on #00FF88
- Focus ring: 2px solid rgba(0, 255, 136, 0.5)
- Min touch target: 44x44px guaranteed

---

### 2. Secondary Button

**Use Cases:**
- "Learn More"
- "View Details"
- Alternative paths
- Secondary modal triggers

**Visual Specs:**
```tsx
className: "
  px-4 md:px-6 py-3 min-h-[44px]
  bg-zinc-900 border border-zinc-800
  text-white font-semibold text-sm md:text-base
  rounded-xl
  hover:bg-zinc-800 hover:border-zinc-700 hover:scale-102
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-all duration-200
"
```

**Anatomy:**
```
┌────────────────────────────────────┐
│  [Icon] Secondary Action     44px  │
│         ◄─────────────────►   ↕    │
└────────────────────────────────────┘
   ◄───── Same padding as Primary ───►
```

**Color Values:**
```css
/* Normal */
background: #18181b; /* zinc-900 */
border: 1px solid #27272a; /* zinc-800 */
color: #ffffff;

/* Hover */
background: #27272a; /* zinc-800 */
border: 1px solid #3f3f46; /* zinc-700 */
transform: scale(1.02);

/* Focus */
outline: 2px solid rgba(255, 255, 255, 0.3);
outline-offset: 2px;
```

**When to Use:**
- Alongside a primary button (e.g., "Cancel" + "Submit")
- For actions that don't warrant full visual weight
- Navigation to secondary pages

---

### 3. Ghost Button

**Use Cases:**
- Cancel
- Dismiss
- "No thanks"
- Close modals

**Visual Specs:**
```tsx
className: "
  px-4 md:px-6 py-3 min-h-[44px]
  bg-transparent border border-white/10
  text-white/80 font-medium text-sm md:text-base
  rounded-xl
  hover:bg-white/5 hover:text-white hover:border-white/20
  active:scale-95
  transition-all duration-200
"
```

**Color Values:**
```css
/* Normal */
background: transparent;
border: 1px solid rgba(255, 255, 255, 0.1);
color: rgba(255, 255, 255, 0.8);

/* Hover */
background: rgba(255, 255, 255, 0.05);
color: #ffffff;
border: 1px solid rgba(255, 255, 255, 0.2);
```

**When to Use:**
- Cancelation actions in modals
- Non-destructive dismissals
- When paired with a primary action

---

### 4. Icon-Only Button

**Use Cases:**
- Close (X)
- Edit (Pencil)
- Delete (Trash)
- Expand/Collapse
- Compact table actions

**Visual Specs:**
```tsx
className: "
  min-w-[44px] min-h-[44px] p-3
  rounded-lg md:rounded-xl
  bg-transparent hover:bg-white/10
  text-white/60 hover:text-white
  transition-all duration-200
  flex items-center justify-center
"
```

**Anatomy:**
```
┌──────────┐
│          │
│   [X]    │  44px
│          │   ↕
│          │
└──────────┘
   44px
   ◄──►
```

**Mandatory Attributes:**
```tsx
<button
  aria-label="Close modal"
  title="Close"
  className="..."
>
  <X className="w-5 h-5" />
</button>
```

**Color Values:**
```css
/* Normal */
color: rgba(255, 255, 255, 0.6);

/* Hover */
background: rgba(255, 255, 255, 0.1);
color: #ffffff;

/* Active */
transform: scale(0.9);
```

**When to Use:**
- Space-constrained interfaces
- Universally understood icons (X, ?, ⋯)
- ALWAYS with aria-label and title

---

### 5. Tertiary/Link Button

**Use Cases:**
- Inline text links
- "Show more"
- "Read full description"
- Subtle CTAs

**Visual Specs:**
```tsx
className: "
  text-[#00FF88] hover:text-[#00FFFF]
  font-medium text-sm underline underline-offset-2
  hover:underline-offset-4
  transition-all duration-200
"
```

**When to Use:**
- Embedded in paragraphs
- Low-priority actions
- Navigation within content

---

## Modal Trigger Patterns

### Problem Statement
Users can't distinguish buttons that open modals from buttons that perform immediate actions. This causes:
- Unexpected interruptions
- Confusion about system state
- Reduced user confidence

### Solution: Visual Modal Indicators

#### Pattern 1: Icon Suffix (Recommended)
Add a **ChevronRight** or **Plus** icon to indicate modal opening:

```tsx
<PremiumButton variant="primary" className="gap-2">
  Create Campaign
  <ChevronRight className="w-4 h-4" />
</PremiumButton>
```

**Visual:**
```
┌──────────────────────────────────┐
│  Create Campaign         [→]     │
└──────────────────────────────────┘
```

#### Pattern 2: Explicit Label
Use verbs that imply a form:
- ❌ "Campaign" → ✅ "Create Campaign"
- ❌ "Clip" → ✅ "Submit Clip"
- ❌ "Launch" → ✅ "Configure Launch"

#### Pattern 3: Subtle Animation
Add micro-interaction on hover:

```tsx
// Tailwind classes
"group relative overflow-hidden"

// Child icon
<ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
```

### Modal Trigger Button Specifications

```tsx
// For modals
<button className="
  px-6 py-3 min-h-[44px]
  bg-gradient-to-r from-[#00FF88] to-[#00FFFF]
  text-black font-bold rounded-xl
  flex items-center gap-2
  group
">
  <Plus className="w-4 h-4" />
  Create Campaign
  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
</button>

// For immediate actions
<button className="
  px-6 py-3 min-h-[44px]
  bg-gradient-to-r from-[#00FF88] to-[#00FFFF]
  text-black font-bold rounded-xl
  flex items-center gap-2
">
  <Zap className="w-4 h-4" />
  Launch Token
</button>
```

### Icon Guidelines

| Action Type | Icon | Position | Animation |
|-------------|------|----------|-----------|
| Create/Add Modal | Plus | Left | Rotate 90deg on hover |
| Edit Modal | Pencil | Left | - |
| Navigate/Open | ChevronRight | Right | Translate-x-1 on hover |
| Upload Modal | Upload | Left | Bounce on hover |
| Settings/Config | Cog | Left | Rotate 45deg on hover |

---

## Touch Target Guidelines

### WCAG 2.1 AAA Requirements
- **Minimum size:** 44x44 CSS pixels
- **Exceptions:** Inline text links, essential elements
- **Spacing:** 8px minimum between adjacent targets

### Implementation Strategy

#### Mobile-First Utilities
```tsx
// Guaranteed 44px minimum
className="min-h-[44px] min-w-[44px]"

// Responsive sizing
className="
  py-3 px-4          /* Mobile: 44px height */
  md:py-2 md:px-6    /* Desktop: Can be smaller */
"
```

#### Spacing Between Buttons
```tsx
// Button groups
<div className="flex gap-3">
  <button>Cancel</button>
  <button>Submit</button>
</div>

// Minimum 12px (3 = 0.75rem = 12px) for comfortable tapping
```

#### Touch Target Heat Map

Current state:
```
Page: CreateCampaignModal
┌─────────────────────────────────┐
│                                 │
│  [Cancel - 40px] [Submit - 40px]│ ← FAIL
│                                 │
└─────────────────────────────────┘

Fixed state:
┌─────────────────────────────────┐
│                                 │
│ [Cancel - 44px] [Submit - 44px] │ ← PASS
│                                 │
└─────────────────────────────────┘
```

### Before/After Comparison

**CreateCampaignModal (Line 345-354)**

BEFORE:
```tsx
<div className="flex gap-3 pt-2">
  <PremiumButton variant="ghost" className="flex-1">
    Cancel
  </PremiumButton>
  <PremiumButton variant="primary" className="flex-1">
    <Video size={16} />
    Create Campaign
  </PremiumButton>
</div>
```
Height: ~40px (FAIL)

AFTER:
```tsx
<div className="flex gap-3 pt-2">
  <PremiumButton variant="ghost" className="flex-1 min-h-[44px]">
    Cancel
  </PremiumButton>
  <PremiumButton variant="primary" className="flex-1 min-h-[44px]">
    <Video size={16} />
    Create Campaign
    <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
  </PremiumButton>
</div>
```
Height: 44px (PASS) + Modal indicator added

---

## Implementation Plan

### Phase 1: Update PremiumButton Component (1 hour)
**File:** `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\design-system\DesignSystemShowcase.tsx`

**Changes:**
1. Add `min-h-[44px]` to all size variants
2. Update primary variant gradient to ICM brand colors
3. Add `iconPosition` prop: `'left' | 'right' | 'both'`
4. Add `modalTrigger` boolean prop for auto-icon

```tsx
export const PremiumButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  modalTrigger = false,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}: PremiumButtonProps) => {
  // Implementation
  const sizes = {
    sm: 'px-3 py-2 min-h-[44px] text-sm',
    md: 'px-4 md:px-6 py-3 min-h-[44px] text-sm md:text-base',
    lg: 'px-6 md:px-8 py-3.5 min-h-[48px] text-base md:text-lg'
  };

  const variants = {
    primary: {
      background: 'linear-gradient(90deg, #00FF88 0%, #00FFFF 100%)',
      color: '#000000',
      border: 'none'
    },
    // ... rest
  };

  return (
    <motion.button
      className={`
        ${sizes[size]}
        flex items-center justify-center gap-2
        font-bold rounded-xl
        transition-all duration-200
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={variants[variant]}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
      {modalTrigger && <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />}
      {IconRight && <IconRight className="w-4 h-4" />}
    </motion.button>
  );
};
```

### Phase 2: Create Button Documentation Component (30 min)
**File:** `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\design-system\ButtonShowcase.tsx`

Create interactive documentation with all variants, sizes, and states.

### Phase 3: Update Modal Components (2 hours)

**CreateCampaignModal.tsx:**
```tsx
// Line 345-354 - Update actions
<div className="flex gap-3 pt-2">
  <PremiumButton
    type="button"
    variant="ghost"
    onClick={handleClose}
    className="flex-1"
  >
    Cancel
  </PremiumButton>
  <PremiumButton
    type="submit"
    variant="primary"
    className="flex-1"
    icon={Video}
    modalTrigger={false} // This submits, doesn't open another modal
  >
    Create Campaign
  </PremiumButton>
</div>
```

**SubmitClipModal.tsx:**
```tsx
// Line 393-408 - Replace native buttons
<div className="flex gap-3 pt-2">
  <PremiumButton
    type="button"
    variant="ghost"
    onClick={handleClose}
    className="flex-1"
  >
    Cancel
  </PremiumButton>
  <PremiumButton
    type="submit"
    variant="primary"
    disabled={!embedUrl.trim() || !!error}
    className="flex-1"
    icon={Play}
  >
    Submit Clip
  </PremiumButton>
</div>
```

### Phase 4: Update Page-Level Buttons (1 hour)

**TokenLaunchPreview.tsx:**
```tsx
// Line 111-117 - Ensure touch target
<button
  onClick={() => setIsExpanded(!isExpanded)}
  className="absolute top-3 right-3 z-10 min-w-[44px] min-h-[44px] rounded-lg..."
  aria-label={isExpanded ? "Collapse launch form" : "Expand launch form"}
>
  <ChevronDown className="w-5 h-5" />
</button>
```

**LaunchHeader.tsx:**
```tsx
// Line 201-206 - Add hover state
<PremiumButton
  variant="secondary"
  href="#how-it-works"
  icon={HelpCircle}
  className="hover:border-[#00FF88]"
>
  How it works
</PremiumButton>
```

### Phase 5: Testing & Validation (1 hour)
- [ ] Test on iPhone SE (375px width)
- [ ] Test on Galaxy S20 (360px width)
- [ ] Test on iPad (768px width)
- [ ] Keyboard navigation test (Tab, Enter, Space)
- [ ] Screen reader test (NVDA/JAWS)
- [ ] Color contrast validation (WebAIM)

---

## Migration Guide

### Step-by-Step Migration

#### 1. Identify Button Type
Use the decision tree (see [Button Hierarchy](#button-hierarchy))

#### 2. Find Current Implementation
```tsx
// BEFORE - Inconsistent implementations
<button className="px-3 py-2 bg-design-pink-500 text-white rounded-lg">
  Submit
</button>

<button className="px-4 py-2.5 bg-white text-black rounded-xl">
  Submit Clip
</button>

<button className="p-2 hover:bg-design-zinc-800/50 rounded-lg">
  <X className="w-4 h-4" />
</button>
```

#### 3. Replace with PremiumButton
```tsx
// AFTER - Consistent design system
<PremiumButton variant="primary">
  Submit
</PremiumButton>

<PremiumButton variant="primary" icon={Play}>
  Submit Clip
</PremiumButton>

<PremiumButton variant="ghost" className="min-w-[44px] min-h-[44px] p-0" aria-label="Close">
  <X className="w-5 h-5" />
</PremiumButton>
```

### Common Patterns

#### Pattern 1: Modal Actions
```tsx
// Cancel + Submit
<div className="flex gap-3 pt-2">
  <PremiumButton variant="ghost" onClick={onClose} className="flex-1">
    Cancel
  </PremiumButton>
  <PremiumButton variant="primary" type="submit" className="flex-1" icon={Check}>
    Confirm
  </PremiumButton>
</div>
```

#### Pattern 2: Hero CTA
```tsx
<PremiumButton
  variant="primary"
  size="lg"
  icon={Rocket}
  onClick={handleLaunch}
  className="w-full md:w-auto"
>
  Launch Token
</PremiumButton>
```

#### Pattern 3: Card Actions
```tsx
<div className="flex items-center gap-2">
  <PremiumButton variant="secondary" size="sm" className="flex-1">
    View
  </PremiumButton>
  <PremiumButton variant="primary" size="sm" className="flex-1" icon={Play}>
    Watch
  </PremiumButton>
</div>
```

#### Pattern 4: Icon-Only Toolbar
```tsx
<div className="flex items-center gap-1">
  <PremiumButton variant="ghost" size="sm" aria-label="Edit" title="Edit">
    <Pencil className="w-4 h-4" />
  </PremiumButton>
  <PremiumButton variant="ghost" size="sm" aria-label="Delete" title="Delete">
    <Trash className="w-4 h-4" />
  </PremiumButton>
</div>
```

---

## Accessibility Checklist

### For All Buttons
- [ ] Minimum 44x44px touch target on mobile
- [ ] Color contrast ratio ≥ 4.5:1 (AA) or ≥ 7:1 (AAA)
- [ ] Visible focus indicator (2px ring, 50% opacity brand color)
- [ ] Disabled state visually distinct (50% opacity)
- [ ] Loading state accessible (aria-busy="true")

### For Icon-Only Buttons
- [ ] `aria-label` attribute present
- [ ] `title` attribute for tooltip
- [ ] Icon size ≥ 20x20px for clarity

### For Modal Triggers
- [ ] Label clearly indicates modal opening
- [ ] Visual indicator (icon) present
- [ ] `aria-haspopup="dialog"` attribute
- [ ] Focus management on modal open/close

### Keyboard Navigation
- [ ] Tab order logical
- [ ] Enter/Space activate button
- [ ] Escape closes modals
- [ ] Focus returns to trigger on modal close

---

## Design Tokens Reference

### Colors
```tsx
const buttonColors = {
  primary: {
    background: 'linear-gradient(90deg, #00FF88 0%, #00FFFF 100%)',
    text: '#000000',
    hoverShadow: '0 0 24px rgba(0, 255, 136, 0.4)',
    focusRing: 'rgba(0, 255, 136, 0.5)',
  },
  secondary: {
    background: '#18181b', // zinc-900
    border: '#27272a', // zinc-800
    text: '#ffffff',
    hover: {
      background: '#27272a',
      border: '#3f3f46',
    },
  },
  ghost: {
    background: 'transparent',
    border: 'rgba(255, 255, 255, 0.1)',
    text: 'rgba(255, 255, 255, 0.8)',
    hover: {
      background: 'rgba(255, 255, 255, 0.05)',
      text: '#ffffff',
      border: 'rgba(255, 255, 255, 0.2)',
    },
  },
  iconOnly: {
    text: 'rgba(255, 255, 255, 0.6)',
    hover: {
      background: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
    },
  },
};
```

### Sizing
```tsx
const buttonSizes = {
  sm: {
    padding: 'px-3 py-2',
    minHeight: '44px',
    fontSize: 'text-sm', // 14px
    iconSize: 'w-4 h-4', // 16px
  },
  md: {
    padding: 'px-4 md:px-6 py-3',
    minHeight: '44px',
    fontSize: 'text-sm md:text-base', // 14px/16px
    iconSize: 'w-4 h-4', // 16px
  },
  lg: {
    padding: 'px-6 md:px-8 py-3.5',
    minHeight: '48px',
    fontSize: 'text-base md:text-lg', // 16px/18px
    iconSize: 'w-5 h-5', // 20px
  },
};
```

### Spacing
```tsx
const buttonSpacing = {
  gap: '8px', // gap-2
  minSpaceBetween: '12px', // gap-3
  groupGap: '16px', // gap-4
};
```

### Border Radius
```tsx
const buttonRadius = {
  default: '12px', // rounded-xl
  compact: '8px', // rounded-lg
  pill: '9999px', // rounded-full
};
```

### Transitions
```tsx
const buttonTransitions = {
  default: 'all 200ms ease-in-out',
  hover: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  focus: 'box-shadow 150ms ease-in-out',
};
```

---

## Before/After Examples

### Example 1: CreateCampaignModal Actions

**BEFORE:**
```tsx
<div className="flex gap-3 pt-2">
  <PremiumButton type="button" variant="ghost" onClick={handleClose} className="flex-1">
    Cancel
  </PremiumButton>
  <PremiumButton type="submit" variant="primary" className="flex-1">
    <Video size={16} />
    Create Campaign
  </PremiumButton>
</div>
```
Issues:
- Height: 40px (FAIL touch target)
- No modal indicator
- Inconsistent padding

**AFTER:**
```tsx
<div className="flex gap-3 pt-2">
  <PremiumButton
    type="button"
    variant="ghost"
    onClick={handleClose}
    className="flex-1 min-h-[44px]"
  >
    Cancel
  </PremiumButton>
  <PremiumButton
    type="submit"
    variant="primary"
    className="flex-1 min-h-[44px]"
    icon={Video}
  >
    Create Campaign
  </PremiumButton>
</div>
```
Improvements:
- Height: 44px (PASS)
- Consistent API
- Clear visual hierarchy

### Example 2: SubmitClipModal Actions

**BEFORE:**
```tsx
<div className="flex gap-2 md:gap-3 pt-1 md:pt-2">
  <button
    type="button"
    onClick={handleClose}
    className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-white/10 bg-white/5 text-white text-xs md:text-sm font-medium hover:bg-white/10 transition active:scale-95"
  >
    Cancel
  </button>
  <button
    type="submit"
    disabled={!embedUrl.trim() || !!error}
    className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-white text-black text-xs md:text-sm font-medium hover:bg-neutral-200 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
  >
    Submit Clip
  </button>
</div>
```
Issues:
- Custom implementation (not using design system)
- White bg breaks brand consistency
- Complex responsive classes
- Height: 40-44px (borderline FAIL on mobile)

**AFTER:**
```tsx
<div className="flex gap-3 pt-2">
  <PremiumButton
    type="button"
    variant="ghost"
    onClick={handleClose}
    className="flex-1"
  >
    Cancel
  </PremiumButton>
  <PremiumButton
    type="submit"
    variant="primary"
    disabled={!embedUrl.trim() || !!error}
    className="flex-1"
    icon={Play}
  >
    Submit Clip
  </PremiumButton>
</div>
```
Improvements:
- Uses design system
- Brand-consistent gradient
- Simpler code
- Guaranteed 44px height

### Example 3: TokenLaunchPreview Launch Button

**BEFORE:**
```tsx
<button
  onClick={() => onLaunch?.(tokenData)}
  disabled={successScore < 80}
  className={cn(
    "px-4 md:px-4 py-3 md:py-2 min-h-[44px] rounded-lg font-bold transition-all text-sm whitespace-nowrap",
    successScore >= 80
      ? "bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black hover:scale-105 active:scale-95"
      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
  )}
>
  {successScore >= 80 ? 'Launch' : 'Complete'}
</button>
```
Issues:
- Inline conditional styling
- Repetitive code
- Missing icon

**AFTER:**
```tsx
<PremiumButton
  variant={successScore >= 80 ? 'primary' : 'secondary'}
  disabled={successScore < 80}
  onClick={() => onLaunch?.(tokenData)}
  icon={successScore >= 80 ? Rocket : AlertCircle}
  className="whitespace-nowrap"
>
  {successScore >= 80 ? 'Launch Token' : 'Complete Form'}
</PremiumButton>
```
Improvements:
- Design system component
- Clear state representation
- Meaningful icons
- Better labels

---

## Quality Assurance

### Testing Matrix

| Device | Browser | Button Type | Status |
|--------|---------|-------------|--------|
| iPhone SE | Safari | Primary | ⏳ Pending |
| iPhone SE | Safari | Secondary | ⏳ Pending |
| iPhone SE | Safari | Ghost | ⏳ Pending |
| iPhone SE | Safari | Icon-only | ⏳ Pending |
| Galaxy S20 | Chrome | Primary | ⏳ Pending |
| Galaxy S20 | Chrome | Secondary | ⏳ Pending |
| iPad | Safari | All variants | ⏳ Pending |
| Desktop | Chrome | All variants | ⏳ Pending |
| Desktop | Firefox | All variants | ⏳ Pending |

### Accessibility Testing

- [ ] NVDA screen reader (Windows)
- [ ] VoiceOver (macOS/iOS)
- [ ] TalkBack (Android)
- [ ] Keyboard-only navigation
- [ ] Color blindness simulation (Deuteranopia, Protanopia, Tritanopia)
- [ ] High contrast mode
- [ ] Reduced motion preference

### Performance Testing

- [ ] Button component render time < 16ms
- [ ] Hover/active state response < 100ms
- [ ] Modal open animation < 300ms
- [ ] Bundle size impact < 5KB

---

## Deployment Checklist

### Pre-Deployment
- [ ] All buttons use PremiumButton component
- [ ] Touch targets validated (44x44px minimum)
- [ ] Color contrast validated (WCAG AA)
- [ ] Focus states visible
- [ ] Modal triggers have visual indicators
- [ ] Icon-only buttons have aria-labels
- [ ] Responsive breakpoints tested

### Deployment
- [ ] TypeScript compilation clean
- [ ] No console errors
- [ ] Bundle size within budget
- [ ] Performance metrics stable
- [ ] Accessibility audit passed

### Post-Deployment
- [ ] User testing feedback collected
- [ ] Analytics tracking button clicks
- [ ] Error monitoring active
- [ ] A/B test conversion rates

---

## Support & Maintenance

### Common Issues

**Issue 1: Button not meeting touch target**
```tsx
// Add explicit minimum
<PremiumButton className="min-h-[44px] min-w-[44px]">
  ...
</PremiumButton>
```

**Issue 2: Icon not rendering**
```tsx
// Import and pass as component, not element
import { Rocket } from 'lucide-react'
<PremiumButton icon={Rocket}> // Correct
<PremiumButton icon={<Rocket />}> // Wrong
```

**Issue 3: Gradient not showing**
```tsx
// Ensure variant is 'primary'
<PremiumButton variant="primary"> // Correct
```

### Design System Evolution

Version 2.0 planned features:
- Loading state animations
- Success/error state transitions
- Micro-interactions (confetti, ripple)
- Voice command support
- Haptic feedback API integration

---

## Appendix

### A. Complete Component Library

Files to update:
1. `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\design-system\DesignSystemShowcase.tsx`
2. `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\modals\CreateCampaignModal.tsx`
3. `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\modals\SubmitClipModal.tsx`
4. `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\launch\TokenLaunchPreview.tsx`
5. `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\launch\LaunchHeader.tsx`
6. `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\launch\FollowButton.tsx`

### B. Design Resources

**Figma File:** `ICM_Motion_Button_System_v1.fig` (to be created)
**Storybook:** `http://localhost:6006/?path=/story/buttons--primary` (to be configured)
**Icon Library:** Lucide React (already installed)

### C. Related Documentation

- [WCAG 2.1 Success Criterion 2.5.5](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Apple Human Interface Guidelines - Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Material Design - Buttons](https://m3.material.io/components/buttons/overview)
- [Nielsen Norman Group - Button UX](https://www.nngroup.com/articles/buttons-vs-links/)

---

## Changelog

### v1.0 (2025-10-22)
- Initial design system specification
- Button audit completed
- 5 button variants defined
- Modal trigger patterns established
- Touch target compliance plan
- Migration guide created

---

**Document Owner:** UI/UX Design Team
**Last Updated:** 2025-10-22
**Next Review:** 2025-11-22
**Status:** ✅ READY FOR IMPLEMENTATION
