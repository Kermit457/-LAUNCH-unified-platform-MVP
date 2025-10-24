# BTDEMO - Design System Implementation Plan

## 🎯 Mission
Build a production-grade design system at `/btdemo` that serves as:
- **Component library core** for all UI primitives
- **Living style guide** for developers
- **QA testing hub** for visual regression
- **Migration foundation** to refactor existing pages

---

## 📐 Architecture

### Phase 1: Foundation (4-6 hours)
**Theme System**
- CSS custom properties in `app/globals.css`
- Tailwind config mapping
- Type scale, spacing grid, color tokens
- Dark theme only (expandable later)

**Core Primitives** (`components/ui/`)
- `button.tsx` - 6 variants × 3 sizes
- `input.tsx` - Search, text, number
- `chip.tsx` - Filter pills with selection state
- `badge.tsx` - Status indicators
- `card.tsx` - Base card with variants
- `tabs.tsx` - Pill and underline variants
- `progress.tsx` - Linear progress bars
- `kpi.tsx` - Metric display tiles

### Phase 2: Compound Components (6-8 hours)
**Layout Components**
- `navbar-top.tsx` - Desktop navigation
- `navbar-bottom.tsx` - Mobile nav with safe-area
- `modal.tsx` - Overlay dialogs
- `bottom-sheet.tsx` - Mobile sheets
- `toast.tsx` - Notification system
- `tooltip.tsx` - Contextual hints

**Domain Components** (`components/btdemo/`)
- `card-project.tsx` - Discover project cards
- `card-clip.tsx` - Clip cards with platform badges
- `card-campaign.tsx` - Campaign cards with progress
- `card-user.tsx` - User/performer cards
- `card-deal.tsx` - Dealflow job cards
- `table.tsx` - Leaderboard tables
- `skeleton.tsx` - Loading states

### Phase 3: BTDEMO Page (4-6 hours)
**Preview Layout** (`app/btdemo/page.tsx`)
```
┌─────────────────────────────────────────┐
│  State Panel (sticky)                   │
│  [Density] [Glow] [Focus] [Sliders]     │
├──────────────────┬──────────────────────┤
│  Desktop Frame   │  Mobile Frame (375)  │
│  ┌────────────┐  │  ┌────────────────┐  │
│  │ Discover   │  │  │   Discover     │  │
│  │ Launch     │  │  │   Launch       │  │
│  │ Clips      │  │  │   Clips        │  │
│  │ Network    │  │  │   Network      │  │
│  │ Profile    │  │  │   Profile      │  │
│  └────────────┘  │  └────────────────┘  │
└──────────────────┴──────────────────────┘
```

**Sections to Render:**
- A) Discover (ticker, filters, project cards)
- B) Launch (spotlight, KPIs, leaderboards)
- C) Clips & Campaigns (cards, stats)
- D) Network (referrals, dealflow)
- E) Profile (wallet, identity tags)
- F) System UI (toasts, modals, empty states)
- G) Navigation (top + bottom nav)

### Phase 4: Mock Data & State Management (2-3 hours)
**Data Layer** (`data/mock.ts`)
```typescript
export const mockProjects = [...]    // 9 projects
export const mockClips = [...]       // 9 clips
export const mockCampaigns = [...]   // 6 campaigns
export const mockDealflow = [...]    // 6 jobs
export const mockUsers = [...]       // Top performers
```

**State Panel Context** (`contexts/BTDemoContext.tsx`)
- Density: compact | comfortable
- Glow: on | off
- Focus outlines: show | hide
- Motion: normal | reduced
- Sliders: confidence%, views, holders, price

---

## 🎨 Design Tokens

### Color System
```css
:root.theme-dark {
  /* Backgrounds */
  --bg-canvas: #000000;      /* Pure black */
  --bg-card: #080809;        /* Card black */

  /* Borders */
  --border: #3B3B3B;         /* Dark gray */

  /* Text */
  --text: #FFFFFF;           /* White */
  --text-dim: rgba(255,255,255,0.72);
  --text-mute: rgba(255,255,255,0.56);

  /* Brand */
  --primary: #D1FD0A;        /* Lime glow */
  --primary-800: #2A3B00;
  --primary-600: #5E7D00;
  --ring: rgba(209,253,10,0.55);
  --glow: 0 0 0 6px rgba(209,253,10,0.08), 0 0 30px rgba(209,253,10,0.12);

  /* Semantic */
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #60A5FA;

  /* Effects */
  --overlay: rgba(0,0,0,0.6);
  --shadow-card: 0 1px 0 rgba(255,255,255,0.04) inset, 0 10px 30px rgba(0,0,0,0.45);

  /* Radii */
  --r-xs: 8px;
  --r-sm: 10px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 20px;
}
```

### Typography Scale
```
12px - Captions, labels
14px - Body small, button small
16px - Body, button medium/large
18px - Subheadings
20px - Card titles
24px - Section headers
28px - Page titles
32px - Hero text
```

**Line Heights:**
- Body: 1.45
- Headings: 1.2

### Spacing Grid
All spacing in 8px increments:
```
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
```

### Icon Sizes
- Small: 16px
- Medium: 20px (default)
- Large: 24px (navigation)

---

## 🧩 Component Specifications

### Button
**Variants:**
- `primary` - Lime solid, black text, glow on focus
- `secondary` - Card bg + border
- `ghost` - Transparent, text only
- `outline` - Border only
- `destructive` - Danger color
- `icon` - Square, icon only

**Sizes:**
- `sm` - h-32, px-12, text-14, icon-16
- `md` - h-40, px-16, text-16, icon-20
- `lg` - h-48, px-20, text-16, icon-20

**States:**
- Hover: brightness +6%
- Active: translate-y-[1px]
- Focus: ring + glow
- Disabled: opacity-50, cursor-not-allowed

### Input/Search
- Height: 44px
- Radius: var(--r-md)
- Background: var(--bg-card)
- Border: 1px var(--border)
- Placeholder: var(--text-mute)
- Focus: ring + border-primary

### Chip/Filter
- Height: 32px (default), 24px (small tags)
- Selected: lime border + faint glow
- Unselected: border-default
- Hover: brightness +6%

### Badge
- `live` - danger background
- `upcoming` - info background
- `creator` - lime on dark-lime
- Uppercase text, 12px, bold

### Card
```typescript
<Card variant="default|hover|interactive">
  {children}
</Card>
```
- Background: var(--bg-card)
- Border: 1px var(--border)
- Radius: var(--r-lg)
- Shadow: var(--shadow-card)

### KPI Tile
```typescript
<KPI label="Vault TVL" value="$2.4M" delta="+12%" />
```
- Height: 96px
- Label: text-14, text-mute
- Value: text-24, bold
- Delta: text-14, success/danger

### Navbar Bottom (Mobile)
- Fixed bottom
- Height: 64px + safe-area-inset-bottom
- 5 items: icon-24, label-11
- Active: lime icon + 2px top accent

---

## 📦 File Structure

```
widgets-for-launch/
├── app/
│   ├── btdemo/
│   │   └── page.tsx              # Main preview page
│   └── globals.css               # Theme tokens ← UPDATE
├── components/
│   ├── ui/                       # Core primitives
│   │   ├── button.tsx            # NEW
│   │   ├── input.tsx             # NEW
│   │   ├── chip.tsx              # NEW
│   │   ├── badge.tsx             # NEW
│   │   ├── card.tsx              # NEW
│   │   ├── tabs.tsx              # NEW
│   │   ├── kpi.tsx               # NEW
│   │   ├── progress.tsx          # NEW
│   │   ├── toast.tsx             # NEW
│   │   ├── tooltip.tsx           # NEW
│   │   ├── modal.tsx             # NEW
│   │   ├── bottom-sheet.tsx      # NEW
│   │   ├── navbar-top.tsx        # NEW
│   │   ├── navbar-bottom.tsx     # NEW
│   │   ├── table.tsx             # NEW
│   │   └── skeleton.tsx          # NEW
│   └── btdemo/                   # Domain components
│       ├── card-project.tsx      # NEW
│       ├── card-clip.tsx         # NEW
│       ├── card-campaign.tsx     # NEW
│       ├── card-user.tsx         # NEW
│       ├── card-deal.tsx         # NEW
│       ├── state-panel.tsx       # NEW
│       ├── desktop-frame.tsx     # NEW
│       └── mobile-frame.tsx      # NEW
├── contexts/
│   └── BTDemoContext.tsx         # NEW - State management
├── data/
│   └── mock.ts                   # NEW - Mock data
├── lib/
│   └── design-system/            # NEW
│       ├── tokens.ts             # Design tokens as TS
│       └── utils.ts              # cn(), cva() helpers
├── tailwind.config.ts            # ← UPDATE
└── BTDEMO_MIGRATION_GUIDE.md     # NEW - Refactoring guide
```

---

## 🔄 Migration Strategy

### Existing Pages to Refactor
1. `/clip` - Use `Card`, `Button`, `Badge`, `card-clip`, `card-campaign`
2. `/discover` - Use `card-project`, `Chip`, `Input`, `Progress`
3. `/launch` - Use `KPI`, `Table`, `card-project`, `Tabs`
4. `/network` - Use `card-user`, `card-deal`, `Input`

### Migration Phases
**Phase A: New features only** (Weeks 1-2)
- All new components use BTDEMO system
- Existing pages unchanged

**Phase B: Incremental refactor** (Weeks 3-6)
- Refactor one page per week
- Start with `/discover` (highest traffic)
- A/B test before full rollout

**Phase C: Complete adoption** (Week 7+)
- Remove old ad-hoc components
- Enforce design system in code review
- Add ESLint rules to prevent color/spacing violations

### Refactoring Checklist (per page)
```markdown
- [ ] Replace inline styles with design tokens
- [ ] Swap custom buttons with `<Button>`
- [ ] Replace divs with `<Card>`
- [ ] Use `<Chip>` for filters
- [ ] Use `<Badge>` for status
- [ ] Test all states (hover, focus, disabled)
- [ ] Verify 375px mobile layout
- [ ] Run accessibility audit
- [ ] Update Storybook/docs
```

---

## 🎯 Success Metrics

### Design System Adoption
- [ ] 100% of new features use BTDEMO components
- [ ] 4 existing pages refactored
- [ ] Zero inline color/spacing values in code reviews

### Quality Gates
- [ ] All components have hover/focus/disabled states
- [ ] AA contrast for all text ≥14px
- [ ] No horizontal overflow at 375px
- [ ] PWA lighthouse score ≥90
- [ ] TypeScript strict mode passing

### Developer Experience
- [ ] Component docs with live examples
- [ ] Storybook integration (optional)
- [ ] Design tokens exported as Figma variables
- [ ] 50% reduction in UI bug reports

---

## ⚙️ Implementation Commands

### 1. Install shadcn components (if missing)
```bash
npx shadcn-ui@latest add button input card tabs
```

### 2. Create design system structure
```bash
mkdir -p components/ui components/btdemo lib/design-system data
```

### 3. Run dev server with BTDEMO
```bash
npm run dev
# Visit http://localhost:3000/btdemo
```

### 4. Type check
```bash
tsc --noEmit
```

### 5. Build verification
```bash
npm run build
# Ensure /btdemo builds without errors
```

---

## 📚 Documentation Deliverables

### For Developers
- `BTDEMO_USAGE_GUIDE.md` - How to use components
- `DESIGN_TOKENS.md` - Color, spacing, typography reference
- `COMPONENT_API.md` - Props and variants for each component

### For Designers
- Figma export of design tokens
- Component variants mapped to Figma
- Accessibility guidelines

### For QA
- `BTDEMO_QA_CHECKLIST.md` - Testing all states
- Visual regression baseline screenshots
- Browser compatibility matrix

---

## 🚨 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Scope creep** - Team keeps requesting new variants | Schedule delay | Lock v1 spec, create backlog for v2 |
| **Breaking changes** - New components incompatible with old | Merge conflicts | Feature flag `/btdemo` route, no changes to existing pages in Phase 1 |
| **Design drift** - Developers bypass system | Inconsistent UI | ESLint rules, code review enforcement, docs |
| **Performance** - Large component library increases bundle | Slower loads | Tree-shaking, lazy loading, code splitting |

---

## ✅ Definition of Done

### Phase 1 Complete When:
- [ ] Theme tokens in CSS + Tailwind
- [ ] 8 core UI components functional
- [ ] All components typed with TypeScript
- [ ] `tsc --noEmit` clean

### Phase 2 Complete When:
- [ ] 8 layout/compound components built
- [ ] 5 domain card components built
- [ ] All components have 3+ state variants
- [ ] Focus rings + disabled states working

### Phase 3 Complete When:
- [ ] `/btdemo` page renders desktop + mobile frames
- [ ] State panel controls all UI variants
- [ ] 7 sections (A-G) rendered with mock data
- [ ] QA checklist footer displayed

### Phase 4 Complete When:
- [ ] Mock data infrastructure complete
- [ ] Migration guide written
- [ ] Component usage docs written
- [ ] First existing page refactored (proof of concept)

---

## 🎯 Go/No-Go Decision

**GREEN LIGHT** ✅ - Proceed with full implementation
**YELLOW LIGHT** 🟡 - Build pilot (theme + 5 components) then review
**RED LIGHT** 🔴 - Document only, defer to next quarter

**Recommendation:** GREEN LIGHT
- Aligns with "compiler-grade precision" directive
- Prevents future UI debt
- Community-driven (shows user engagement)
- Establishes foundation for scalable development

---

**Next Steps:**
1. User confirms: GREEN / YELLOW / RED
2. If GREEN: Execute Phase 1 immediately
3. If YELLOW: Build pilot, schedule review
4. If RED: Archive proposal, revisit in Q2

**Estimated Total Effort:** 16-23 hours
**Recommended Timeline:** 3 weeks (parallel with feature work)
**Team Required:** 1 senior frontend engineer (can be done by Claude + user review)

---

**Prepared by:** Claude (AI Assistant)
**For:** Mirko Basil Dölger - ICM Motion
**Date:** 2025-10-23
**Status:** Awaiting approval
