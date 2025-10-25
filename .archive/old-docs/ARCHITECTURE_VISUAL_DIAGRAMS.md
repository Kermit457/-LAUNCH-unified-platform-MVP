# ARCHITECTURE VISUAL DIAGRAMS

**Date:** 2025-10-23
**Purpose:** Visual representation of 12/10 design system architecture
**Companion to:** ARCHITECTURE_SYSTEM_DESIGN_12_10.md

---

## 1. DESIGN SYSTEM LAYER ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                         │
│  (/app - Next.js App Router pages)                              │
│                                                                  │
│  /clip, /discover, /launch, /profile, /btdemo                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓ imports
┌─────────────────────────────────────────────────────────────────┐
│                    DOMAIN COMPONENTS LAYER                       │
│  (/components - Application-specific components)                │
│                                                                  │
│  UnifiedCard, ProjectCard, ClipCard, CampaignCard              │
│  CommentsDrawer, BuySellModal, FiltersBar                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓ imports
┌─────────────────────────────────────────────────────────────────┐
│                  DESIGN SYSTEM COMPONENTS                        │
│  (/lib/design-system/components - Styled, opinionated)         │
│                                                                  │
│  MotionScoreDisplay, StatsGrid, ActionBar, BadgeGroup          │
└─────────────────────────────────────────────────────────────────┘
                            ↓ imports
┌─────────────────────────────────────────────────────────────────┐
│                   DESIGN SYSTEM PRIMITIVES                       │
│  (/lib/design-system/primitives - Unstyled, flexible)          │
│                                                                  │
│  Button, Card, Input, Modal, Drawer, Badge, Avatar             │
└─────────────────────────────────────────────────────────────────┘
                            ↓ imports
┌─────────────────────────────────────────────────────────────────┐
│                      DESIGN TOKENS                               │
│  (/lib/design-system/tokens - Constants)                       │
│                                                                  │
│  colors, typography, spacing, shadows, animations               │
└─────────────────────────────────────────────────────────────────┘
                            ↓ imports
┌─────────────────────────────────────────────────────────────────┐
│                       UTILITY LAYER                              │
│  (/lib/design-system/utils)                                    │
│                                                                  │
│  cn(), responsive(), a11y(), performance()                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. COMPONENT API DESIGN PATTERN

```
┌──────────────────────────────────────────────────────────────────┐
│                        BUTTON COMPONENT                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     PUBLIC API                              │  │
│  │                                                             │  │
│  │  interface ButtonProps {                                   │  │
│  │    variant: 'primary' | 'secondary' | 'ghost' | 'danger'  │  │
│  │    size: 'sm' | 'md' | 'lg'                                │  │
│  │    leftIcon?: ReactNode                                    │  │
│  │    rightIcon?: ReactNode                                   │  │
│  │    isLoading?: boolean                                     │  │
│  │    isFullWidth?: boolean                                   │  │
│  │    onClick?: () => void                                    │  │
│  │    children: ReactNode                                     │  │
│  │  }                                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   TYPE VALIDATION                           │  │
│  │                                                             │  │
│  │  TypeScript exhaustiveness checking ensures:               │  │
│  │  ✓ All variants handled                                    │  │
│  │  ✓ Props are type-safe                                     │  │
│  │  ✓ IntelliSense autocomplete                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   STYLE COMPOSITION                         │  │
│  │                                                             │  │
│  │  cn(                                                        │  │
│  │    baseStyles,           // Always applied                 │  │
│  │    variantStyles[variant], // Conditional                  │  │
│  │    sizeStyles[size],       // Conditional                  │  │
│  │    className              // User override                 │  │
│  │  )                                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    RENDER OUTPUT                            │  │
│  │                                                             │  │
│  │  <button className="..." {...props}>                       │  │
│  │    {leftIcon && <span>{leftIcon}</span>}                   │  │
│  │    <span>{children}</span>                                 │  │
│  │    {rightIcon && <span>{rightIcon}</span>}                 │  │
│  │  </button>                                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. STATE MANAGEMENT FLOW

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER ACTION                               │
│                (onClick, onChange, etc.)                          │
└──────────────────────────────────────────────────────────────────┘
                              ↓
        ┌──────────────────────────────────────┐
        │  Is this a global concern?            │
        │  (auth, theme, modal stack)           │
        └──────────────────────────────────────┘
                 ↓ YES              ↓ NO
    ┌─────────────────────┐    ┌──────────────────┐
    │  GLOBAL STATE       │    │  LOCAL STATE     │
    │  (Context/Zustand)  │    │  (useState)      │
    └─────────────────────┘    └──────────────────┘
                ↓                        ↓
    ┌─────────────────────┐    ┌──────────────────┐
    │  State Updates      │    │  Component       │
    │  Propagate to All   │    │  Re-renders      │
    │  Consumers          │    │  (Local Only)    │
    └─────────────────────┘    └──────────────────┘
                ↓                        ↓
┌──────────────────────────────────────────────────────────────────┐
│                         UI RE-RENDERS                             │
│            (Only affected components update)                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. DATA FLOW - PROJECT CARD EXAMPLE

```
┌──────────────────────────────────────────────────────────────────┐
│                      API / BLOCKCHAIN                             │
│  /api/projects/[id]  OR  Solana Program Account                 │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                     DATA FETCHING HOOK                            │
│  const { data, isLoading } = useProject(projectId)               │
│                                                                   │
│  - React Query caching                                           │
│  - Optimistic updates                                            │
│  - Error boundaries                                              │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                       PAGE COMPONENT                              │
│  export default function ProjectPage() {                         │
│    const project = useProject(params.id)                         │
│                                                                   │
│    return <ProjectCard data={project} />                         │
│  }                                                                │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    PRESENTATION COMPONENT                         │
│  export function ProjectCard({ data }: Props) {                  │
│    // Pure component - no data fetching                          │
│    // Emits events via callbacks                                 │
│                                                                   │
│    return (                                                       │
│      <Card>                                                       │
│        <Card.Header>{data.title}</Card.Header>                   │
│        <Card.Body>                                                │
│          <MotionScoreDisplay score={data.motionScore} />         │
│        </Card.Body>                                               │
│        <Card.Footer>                                              │
│          <Button onClick={onBuyKeys}>Buy Keys</Button>           │
│        </Card.Footer>                                             │
│      </Card>                                                      │
│    )                                                              │
│  }                                                                │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                       USER INTERACTION                            │
│  onClick={onBuyKeys}  →  Bubbles up to page component            │
│                      →  Triggers modal or navigation              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. COMPOUND COMPONENT PATTERN

```
┌──────────────────────────────────────────────────────────────────┐
│                         CARD COMPONENT                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Card (Root)                                                │  │
│  │  - Provides shared context                                 │  │
│  │  - Handles card-level state                                │  │
│  │  - Applies base styles                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Card.Header                                                │  │
│  │  - Optional header section                                 │  │
│  │  - Border-bottom styling                                   │  │
│  │  - Padding consistent with design system                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Card.Body                                                  │  │
│  │  - Main content area                                       │  │
│  │  - Flexible layout                                         │  │
│  │  - Scrollable if overflow                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Card.Footer                                                │  │
│  │  - Optional footer section                                 │  │
│  │  - Border-top styling                                      │  │
│  │  - Action buttons container                                │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

USAGE:
<Card>
  <Card.Header>
    <h3>Project Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Description...</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>

BENEFITS:
✓ Flexible composition
✓ Semantic HTML structure
✓ Consistent spacing/styling
✓ Type-safe sub-components
```

---

## 6. MODAL STATE MANAGEMENT

```
┌──────────────────────────────────────────────────────────────────┐
│                       MODAL REGISTRY                              │
│  (Zustand store - Global state)                                  │
│                                                                   │
│  {                                                                │
│    modals: Map<ModalId, { isOpen: boolean, props: any }>        │
│  }                                                                │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                     BUTTON COMPONENT                              │
│                                                                   │
│  const { openModal } = useModalStore()                           │
│                                                                   │
│  <Button onClick={() => openModal('CREATE_CAMPAIGN', {...})}>   │
│    Create Campaign                                               │
│  </Button>                                                       │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                  MODAL REGISTRY UPDATES                           │
│                                                                   │
│  modals.set('CREATE_CAMPAIGN', {                                 │
│    isOpen: true,                                                 │
│    props: { prefilledData: {...} }                               │
│  })                                                               │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   MODAL ORCHESTRATOR                              │
│  (Root-level component that renders active modals)               │
│                                                                   │
│  {Array.from(modals).map(([id, { isOpen, props }]) => (         │
│    isOpen && <ModalComponents[id] {...props} />                  │
│  ))}                                                              │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                MODAL COMPONENT RENDERS                            │
│                                                                   │
│  <CreateCampaignModal                                             │
│    isOpen={true}                                                  │
│    prefilledData={{...}}                                          │
│    onClose={() => closeModal('CREATE_CAMPAIGN')}                 │
│  />                                                               │
└──────────────────────────────────────────────────────────────────┘

TYPE SAFETY:
┌─────────────────────────────────────────────────────────────┐
│  openModal(id, props)                                        │
│     ↓                                                        │
│  TypeScript ensures props match ModalPropsMap[id]           │
│     ↓                                                        │
│  Compile error if wrong props provided                      │
│     ✓ No runtime errors                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. DESIGN TOKEN CASCADE

```
┌──────────────────────────────────────────────────────────────────┐
│                     DESIGN TOKENS (Source)                        │
│                                                                   │
│  export const colors = {                                         │
│    primary: '#D1FD0A',                                           │
│    success: '#00FF88',                                           │
│    ...                                                           │
│  }                                                               │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   TAILWIND CONFIG (Bridge)                        │
│                                                                   │
│  theme: {                                                         │
│    extend: {                                                      │
│      colors: {                                                    │
│        primary: '#D1FD0A', // From design tokens                 │
│      }                                                            │
│    }                                                              │
│  }                                                                │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    CSS UTILITIES (Generated)                      │
│                                                                   │
│  .bg-primary { background-color: #D1FD0A; }                      │
│  .text-primary { color: #D1FD0A; }                               │
│  .border-primary { border-color: #D1FD0A; }                      │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   COMPONENT STYLES (Usage)                        │
│                                                                   │
│  <Button className="bg-primary text-black">                      │
│    Click me                                                      │
│  </Button>                                                       │
└──────────────────────────────────────────────────────────────────┘

SINGLE SOURCE OF TRUTH:
┌─────────────────────────────────────────────────────────────┐
│  Change primary color in ONE place:                          │
│  → lib/design-system/tokens/colors.ts                        │
│                                                               │
│  Automatically updates:                                       │
│  ✓ Tailwind classes                                          │
│  ✓ All components                                            │
│  ✓ Storybook stories                                         │
│  ✓ Documentation examples                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. COMPONENT EXTRACTION DECISION TREE

```
                 ┌─────────────────────────┐
                 │  Need a UI element?     │
                 └─────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │  Does it exist in design system?      │
        └───────────────────────────────────────┘
                 ↓ YES            ↓ NO
    ┌──────────────────┐    ┌──────────────────┐
    │  Use existing    │    │  Is it reusable? │
    │  component       │    │  (used 3+ times) │
    └──────────────────┘    └──────────────────┘
                                  ↓ YES     ↓ NO
                          ┌──────────┐  ┌──────────┐
                          │ Complex? │  │ Keep     │
                          │ (>50LOC) │  │ inline   │
                          └──────────┘  └──────────┘
                         ↓ YES    ↓ NO
                    ┌─────────┐  ┌─────────────┐
                    │ Extract │  │ Simple comp │
                    │ to DS   │  │ in /comps   │
                    └─────────┘  └─────────────┘
                         ↓              ↓
        ┌──────────────────────────────────────────┐
        │  Is it a primitive or styled component?  │
        └──────────────────────────────────────────┘
           ↓ Primitive          ↓ Styled
    ┌─────────────────┐  ┌─────────────────┐
    │ /primitives/X   │  │ /components/X   │
    │ (unstyled)      │  │ (opinionated)   │
    └─────────────────┘  └─────────────────┘

EXTRACTION CRITERIA:
┌───────────────────────────────────────────────────────┐
│  Score = (Reuse × 3) + (Complexity × 2) + (Testing × 1) │
│                                                        │
│  Score ≥ 12: MUST extract to design system            │
│  Score 8-11: SHOULD extract to /components            │
│  Score ≤ 7:  Keep inline                              │
└───────────────────────────────────────────────────────┘
```

---

## 9. PERFORMANCE OPTIMIZATION FLOW

```
┌──────────────────────────────────────────────────────────────────┐
│                      INITIAL BUNDLE                               │
│  app.js (2.5 MB uncompressed)                                    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                     CODE SPLITTING                                │
│  - Route-based splitting (automatic)                             │
│  - Component-based splitting (manual)                            │
│  - Vendor chunking (shared dependencies)                         │
└──────────────────────────────────────────────────────────────────┘
                              ↓
        ┌────────────────────────────────────────┐
        │  main.js (250 KB) - Core app           │
        │  vendor.js (750 KB) - React, Next      │
        │  page-discover.js (180 KB)             │
        │  page-launch.js (220 KB)               │
        │  component-modal.js (80 KB) - Lazy     │
        └────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                        TREE SHAKING                               │
│  Remove unused:                                                   │
│  - Design system components                                      │
│  - Icon components                                               │
│  - Utility functions                                             │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                        COMPRESSION                                │
│  - Gzip (30-40% reduction)                                       │
│  - Brotli (40-50% reduction)                                     │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                     OPTIMIZED BUNDLES                             │
│  main.js (85 KB gzip)                                            │
│  vendor.js (220 KB gzip)                                         │
│  page-discover.js (58 KB gzip) ✓ Target achieved                │
└──────────────────────────────────────────────────────────────────┘

LAZY LOADING STRATEGY:
┌─────────────────────────────────────────────────────────────┐
│  Critical: Load immediately                                  │
│  - Layout, Navigation, Core UI                              │
│                                                              │
│  Important: Load on route                                   │
│  - Page-specific components                                 │
│                                                              │
│  Optional: Load on interaction                              │
│  - Modals, Drawers, Heavy charts                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. ACCESSIBILITY AUDIT FLOW

```
┌──────────────────────────────────────────────────────────────────┐
│                    COMPONENT RENDERED                             │
│  <Button variant="primary">Submit</Button>                       │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                  AUTOMATED A11Y CHECKS                            │
│  (Run in development mode)                                       │
└──────────────────────────────────────────────────────────────────┘
                              ↓
        ┌────────────────────────────────────────┐
        │  ✓ Semantic HTML                       │
        │    <button> vs <div role="button">     │
        │                                         │
        │  ✓ Keyboard navigation                 │
        │    Tab order, Enter/Space handlers     │
        │                                         │
        │  ✓ Screen reader support               │
        │    aria-label, aria-describedby        │
        │                                         │
        │  ✓ Color contrast                      │
        │    WCAG AA (4.5:1) minimum             │
        │                                         │
        │  ✓ Focus indicators                    │
        │    Visible focus ring (2px solid)      │
        └────────────────────────────────────────┘
                              ↓
        ┌────────────────────────────────────────┐
        │  Issues Found?                          │
        └────────────────────────────────────────┘
           ↓ YES                    ↓ NO
    ┌──────────────┐        ┌──────────────┐
    │ Console warn │        │ All checks   │
    │ with fix     │        │ passed ✓     │
    └──────────────┘        └──────────────┘

ACCESSIBILITY CHECKLIST:
┌─────────────────────────────────────────────────────────────┐
│  ☐ All interactive elements keyboard accessible             │
│  ☐ Focus visible on all interactive elements                │
│  ☐ Color not used as only means of conveying info           │
│  ☐ Text contrast ≥ 4.5:1 (AA) or 7:1 (AAA)                 │
│  ☐ Images have alt text                                     │
│  ☐ Forms have labels                                        │
│  ☐ Error messages are descriptive                           │
│  ☐ Loading states announced to screen readers               │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. MIGRATION PATH VISUALIZATION

```
PHASE 1: FOUNDATION (Week 1)
┌───────────────────────────────────────────────────────────┐
│  Current State              Target State                   │
│  ┌────────────┐             ┌────────────────────────┐    │
│  │ /app       │             │ /app                   │    │
│  │ /components│    ────→    │ /components            │    │
│  │            │             │ /lib/design-system/    │    │
│  │            │             │   ├── tokens/          │    │
│  │            │             │   ├── utils/           │    │
│  │            │             │   └── theme/           │    │
│  └────────────┘             └────────────────────────┘    │
└───────────────────────────────────────────────────────────┘

PHASE 2: CORE COMPONENTS (Week 2)
┌───────────────────────────────────────────────────────────┐
│  Extract:                   To:                            │
│  ┌────────────┐             ┌────────────────────────┐    │
│  │ Button     │    ────→    │ /primitives/Button     │    │
│  │ Card       │    ────→    │ /primitives/Card       │    │
│  │ Input      │    ────→    │ /primitives/Input      │    │
│  │ Modal      │    ────→    │ /primitives/Modal      │    │
│  └────────────┘             └────────────────────────┘    │
└───────────────────────────────────────────────────────────┘

PHASE 3: DOMAIN COMPONENTS (Week 3)
┌───────────────────────────────────────────────────────────┐
│  Refactor:                  To:                            │
│  ┌────────────────┐         ┌────────────────────────┐    │
│  │ UnifiedCard    │  ────→  │ /components/           │    │
│  │ ProjectCard    │  ────→  │   ProjectCard          │    │
│  │ ClipCard       │  ────→  │   (uses primitives)    │    │
│  └────────────────┘         └────────────────────────┘    │
└───────────────────────────────────────────────────────────┘

PHASE 4: DOCUMENTATION (Week 4)
┌───────────────────────────────────────────────────────────┐
│  Generate:                                                 │
│  ┌────────────────────────────────────────────────┐       │
│  │ ✓ Storybook stories for all components        │       │
│  │ ✓ TypeDoc documentation                       │       │
│  │ ✓ Component usage guides                      │       │
│  │ ✓ Migration guide for developers              │       │
│  └────────────────────────────────────────────────┘       │
└───────────────────────────────────────────────────────────┘

BACKWARD COMPATIBILITY:
┌─────────────────────────────────────────────────────────────┐
│  Old import:  import { Button } from '@/components/Button' │
│  New import:  import { Button } from '@/lib/design-system' │
│                                                              │
│  Strategy: Create re-export wrappers during migration       │
│  Remove wrappers after 100% migration complete              │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. TESTING PYRAMID

```
                         ┌─────────┐
                         │   E2E   │  (5% - Critical flows)
                         │ Tests   │
                         └─────────┘
                    ┌─────────────────┐
                    │   Integration   │  (15% - Component interactions)
                    │     Tests       │
                    └─────────────────┘
                ┌─────────────────────────┐
                │      Unit Tests         │  (80% - Component logic)
                │                         │
                └─────────────────────────┘

UNIT TESTS (Vitest + React Testing Library):
┌─────────────────────────────────────────────────────────────┐
│  Test each component in isolation:                           │
│  ✓ Props rendering                                           │
│  ✓ Event handlers                                            │
│  ✓ State changes                                             │
│  ✓ Edge cases                                                │
│                                                               │
│  Example: Button.test.tsx                                    │
│  - Renders all variants                                      │
│  - Handles click events                                      │
│  - Shows loading state                                       │
│  - Respects disabled state                                   │
└─────────────────────────────────────────────────────────────┘

INTEGRATION TESTS (Playwright):
┌─────────────────────────────────────────────────────────────┐
│  Test component composition:                                 │
│  ✓ Card with Button                                          │
│  ✓ Form with Input + Button                                 │
│  ✓ Modal with Card + Actions                                │
│                                                               │
│  Example: ProjectCard.integration.test.ts                    │
│  - Renders project data correctly                            │
│  - Opens modal on "Buy Keys" click                           │
│  - Updates UI after upvote                                   │
└─────────────────────────────────────────────────────────────┘

E2E TESTS (Playwright):
┌─────────────────────────────────────────────────────────────┐
│  Test complete user flows:                                   │
│  ✓ Create campaign flow                                      │
│  ✓ Buy keys transaction                                      │
│  ✓ Submit clip to campaign                                   │
│                                                               │
│  Example: create-campaign.e2e.test.ts                        │
│  - User clicks "Create Campaign"                             │
│  - Fills out form                                            │
│  - Submits and sees success message                          │
│  - Campaign appears in feed                                  │
└─────────────────────────────────────────────────────────────┘

VISUAL REGRESSION (Storybook + Chromatic):
┌─────────────────────────────────────────────────────────────┐
│  Test visual consistency:                                    │
│  ✓ Button variants match design                              │
│  ✓ No unintended layout shifts                               │
│  ✓ Hover states render correctly                             │
│  ✓ Dark/light theme consistency                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Files Referenced:**
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\ARCHITECTURE_SYSTEM_DESIGN_12_10.md`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\btdemo\page.tsx`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\components\UnifiedCard.tsx`
- `c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\lib\icons`

**Companion Documents:**
- ARCHITECTURE_SYSTEM_DESIGN_12_10.md (main architecture spec)
- BUTTON_ARCHITECTURE_SPEC.md (type-safe button patterns)
- DESIGN_SYSTEM_ULTIMATE.md (visual design guidelines)
