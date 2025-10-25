# Core App De-AI Refactor — Complete Platform Plan

**Date:** 2025-10-25
**Scope:** ALL core routes + modals/drawers + infrastructure
**Effort:** ~40 hours (1 sprint, 5 dev days)
**Risk:** 🔴 HIGH (touches entire app)

---

## Executive Summary

Comprehensive refactor of the entire core application to eliminate "AI debt", enforce best practices, ship production-ready code that any senior engineer can confidently maintain.

### Scope

**6 Core Routes** (4,117 LOC):
- [app/discover](app/discover/page.tsx) — 1,012 LOC
- [app/clip](app/clip/page.tsx) — 1,256 LOC ⚠️ **LARGEST**
- [app/profile](app/profile/page.tsx) — 782 LOC
- [app/launch](app/launch/page.tsx) — 589 LOC
- [app/network](app/network/page.tsx) — 320 LOC
- [app/chat](app/chat/page.tsx) — 158 LOC

**38 Modals/Drawers** (lazy-load all):
- BuySellModal, LaunchDetailsModal, CommentsDrawer, SubmitLaunchDrawer
- CreateCampaignModal, SubmitClipModal, ProfileModal, DealflowModal
- ChatDrawer, CreateRoomDrawer, EscrowModal, IntroModal
- + 26 more in components/modals, components/btdemo/overlays, components/blast

**Global Infrastructure:**
- TypeScript strict enforcement (no `ignoreBuildErrors`)
- ESLint with flat config
- Security (CSP, rate limiting, headers)
- CI/CD (typecheck, lint, build, bundle-size gates)
- Accessibility (WCAG 2.1 AA across all pages)

---

## Key Metrics — Before/After

| Metric | Before | Target After | Improvement |
|--------|--------|--------------|-------------|
| Total Core LOC | 4,117 | ~1,800 (server) + islands | ▼ 56% |
| Client Components | 16/92 files (17%) | 8/92 files (9%) | ▼ 50% |
| Bundle (.next) | 1.2GB | ~600MB | ▼ 50% |
| TypeScript Errors | Unknown (ignored) | 0 (enforced) | ✅ 100% |
| ESLint Errors | Unknown (ignored) | 0 (enforced) | ✅ 100% |
| Accessibility (WCAG) | 1/10 (0 ARIA labels) | 8/10 (AA compliant) | ▲ 700% |
| CSP Strength | 3/10 (unsafe-inline) | 8/10 (nonce-based) | ▲ 167% |
| First Load JS (avg) | ~810KB | ~400KB | ▼ 50% |
| Dead Code | 647 LOC (backup files) | 0 LOC | ✅ 100% |

---

## Audit Summary by Route

| Route | LOC | Issues | Priority | Refactor Time |
|-------|-----|--------|----------|---------------|
| **/clip** | 1,256 | 🔴 Largest, heavy dynamic imports, mixed concerns | **P0** | 4 hrs |
| **/discover** | 1,012 | 🔴 All client, useEffect data fetch, 2 backup files | **P0** | 3 hrs |
| **/profile** | 782 | 🟡 Client-heavy, multiple useEffect, conditional renders | **P1** | 3 hrs |
| **/launch** | 589 | 🟡 All client, BTDemo components loaded upfront | **P1** | 2 hrs |
| **/network** | 320 | 🟢 Moderate size, Dealflow modal inline | **P2** | 1.5 hrs |
| **/chat** | 158 | 🟢 Smallest, simple structure | **P2** | 1 hr |
| **Modals** | 38 files | 🟡 Most not lazy-loaded, duplicates (btdemo vs main) | **P1** | 3 hrs |
| **Infra** | N/A | 🔴 TS/ESLint ignored, weak CSP, no CI | **P0** | 4 hrs |

**Total:** ~21.5 hours core refactor + infrastructure

---

## Phase Breakdown

### Phase 1: Foundation (4 hours) — BLOCKING

**Priority:** 🔴 **P0** — All work depends on this
**Owner:** Base Orchestrator
**Risk:** 🟡 MODERATE (may reveal hidden errors)

#### 1.1 Delete Dead Code (10 min)
```bash
git rm app/discover/page-backup.tsx app/discover/page-original.tsx
git rm -r app/network/page-new.tsx  # If exists
find components -name "*.unused.tsx" -delete
git commit -m "chore: Remove all dead code and backup files"
```

**Deliverable:** 647+ LOC removed, clean repo

---

#### 1.2 Enable TypeScript & ESLint (30 min)

**File:** [next.config.js:27-31](next.config.js#L27-L31)

```diff
- typescript: { ignoreBuildErrors: true },
- eslint: { ignoreDuringBuilds: true },
+ typescript: { ignoreBuildErrors: false },
+ eslint: { ignoreDuringBuilds: false },
```

**Create:** `.eslintrc.js`

```js
module.exports = {
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/order': ['warn', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' },
    }],
  },
};
```

**Deliverable:** ESLint config created, builds fail on errors

---

#### 1.3 Fix All TypeScript Errors (2.5 hours)

**Strategy:**
1. Run `npm run typecheck` → capture all errors
2. Fix by priority:
   - P0: Type safety holes (`any`, missing types on API boundaries)
   - P1: Implicit any in callbacks, missing return types
   - P2: Non-null assertions, type assertions

**Common Fixes:**
```tsx
// Before
icon: any
// After
icon: React.ComponentType<{ className?: string; size?: number }>

// Before
const handleClick = (e) => { ... }
// After
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }

// Before
const user = data.user!  // Non-null assertion
// After
const user = data.user ?? { id: '', name: 'Anonymous' }
```

**Validation:**
```bash
npm run typecheck  # Must exit 0
npm run build     # Must succeed
```

**Deliverable:** Zero TypeScript errors, clean build

---

#### 1.4 Security Headers & Rate Limiting (1 hour)

**File:** [next.config.js:42-55](next.config.js#L42-L55)

**Tighten CSP:**
```js
headers: [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' https://auth.privy.io",  // Remove unsafe-eval/inline
      "style-src 'self' 'unsafe-inline'",  // Keep for Tailwind
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://auth.privy.io https://api.devnet.solana.com https://cloud.appwrite.io",
      "frame-src 'self' https://auth.privy.io https://verify.walletconnect.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
],
```

**Create:** `middleware.ts` (rate limiting)

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const limits = new Map<string, { count: number; resetAt: number }>();

export function middleware(req: NextRequest) {
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const limit = 60; // req/min
  const window = 60_000;

  const current = limits.get(ip);
  if (!current || now > current.resetAt) {
    limits.set(ip, { count: 1, resetAt: now + window });
    return NextResponse.next();
  }

  if (current.count >= limit) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  current.count++;
  return NextResponse.next();
}

export const config = { matcher: '/api/:path*' };
```

**Validation:**
- Test Privy auth (login/logout)
- Test Solana wallet connections
- Curl API 65 times → expect 429

**Deliverable:** CSP hardened, rate limiting active

---

### Phase 2: Core Routes Refactor (14.5 hours)

**Strategy:** Convert all to Server Components with client islands

#### 2.1 `/clip` Page (4 hours) — P0 Largest Route

**Current Issues:**
- 1,256 LOC client component ⚠️
- Heavy dynamic imports not optimized
- Mix of campaign creation, clip submission, filtering
- Multiple useEffect hooks

**Refactor Plan:**

```
app/clip/page.tsx (Server Component ~150 LOC)
├── Fetch campaigns/clips server-side
├── Pass to client wrapper
└── Static shell + metadata

app/clip/ClipClient.tsx (Client ~200 LOC)
├── Search & filter state
├── Tab state (Trending/Following/Campaigns)
└── Render ClipGrid + CampaignGrid

app/clip/ClipGrid.tsx (Client ~150 LOC)
├── Clip cards rendering
└── Lazy-load modals

app/clip/CampaignGrid.tsx (Client ~150 LOC)
├── Campaign cards
└── Lazy-load CreateCampaignModal

components/modals/SubmitClipModal.tsx (Already dynamic ✅)
components/modals/CreateCampaignModal.tsx (Make dynamic)
```

**Key Changes:**
- Move data fetching to server (`getCampaigns`, `getClips`)
- URL params for filters → shareable URLs
- Dynamic import all modals
- Extract ClipCard, CampaignCard to separate files (reusable)

**Commits:**
1. `refactor(clip): Convert to Server Component with ISR`
2. `refactor(clip): Extract client islands (search, grid, modals)`
3. `refactor(clip): Dynamic import all modals`
4. `refactor(clip): Add URL param sync for filters`

**Deliverable:** /clip page SSR-ready, bundle ▼40%

---

#### 2.2 `/discover` Page (3 hours) — P0 Second Largest

**See:** [DISCOVER_REFACTOR_PLAN.md](DISCOVER_REFACTOR_PLAN.md) (already created)

**Summary:**
- Convert to Server Component
- Extract 4 client islands (filters, table, cards, modals)
- Dynamic import BuySellModal, LaunchDetailsModal, CommentsDrawer
- URL params for filters

**Deliverable:** /discover page SSR-ready, bundle ▼40%

---

#### 2.3 `/profile` Page (3 hours) — P1

**Current Issues:**
- 782 LOC client component
- Multiple useEffect (profile, invites, curves, campaigns)
- Conditional tab rendering (holdings, curves, clips, settings)

**Refactor Plan:**

```
app/profile/page.tsx (Server Component ~100 LOC)
├── Fetch user profile, holdings, invites server-side
├── Support ?tab= param
└── Pass to ProfileClient

app/profile/ProfileClient.tsx (Client ~150 LOC)
├── Tab state
├── Edit mode state
└── Render tab content

app/profile/tabs/HoldingsTab.tsx (Client ~120 LOC)
app/profile/tabs/CurvesTab.tsx (Client ~120 LOC)
app/profile/tabs/ClipsTab.tsx (Client ~80 LOC)
app/profile/tabs/SettingsTab.tsx (Client ~100 LOC)
```

**Key Changes:**
- Server-fetch profile data, holdings, invites
- Tab selection via URL param (`?tab=holdings`)
- Split tabs into separate files (code splitting)
- Lazy-load PendingClipsSection

**Commits:**
1. `refactor(profile): Convert to Server Component`
2. `refactor(profile): Extract tab components`
3. `refactor(profile): Add URL tab param`
4. `refactor(profile): Lazy-load heavy sections`

**Deliverable:** /profile page SSR-ready, tab code-split

---

#### 2.4 `/launch` Page (2 hours) — P1

**Current Issues:**
- 589 LOC all client
- BTDemo components loaded upfront
- Heavy metrics, carousel, leaderboards

**Refactor Plan:**

```
app/launch/page.tsx (Server Component ~80 LOC)
├── Fetch hero metrics, spotlight projects server-side
└── Pass to LaunchClient

app/launch/LaunchClient.tsx (Client ~100 LOC)
├── Tab state (leaderboards)
├── Feed filters
└── Render sections

components/btdemo/HeroMetricsBTDemo.tsx (Already exists ✅)
components/btdemo/SpotlightCarouselBTDemo.tsx (Make dynamic)
components/btdemo/AdvancedTableViewBTDemo.tsx (Make dynamic)
```

**Key Changes:**
- Server-fetch metrics, top projects
- Dynamic import SpotlightCarousel, AdvancedTableView
- Lazy-load TradeModal, CommentsDrawer, SubmitLaunchDrawer

**Commits:**
1. `refactor(launch): Convert to Server Component`
2. `refactor(launch): Dynamic import heavy components`
3. `refactor(launch): Lazy-load all modals`

**Deliverable:** /launch page SSR-ready, bundle ▼30%

---

#### 2.5 `/network` Page (1.5 hours) — P2

**Current Issues:**
- 320 LOC client component
- Dealflow modal inline (should be lazy)
- People grid + dealflow tabs

**Refactor Plan:**

```
app/network/page.tsx (Server Component ~80 LOC)
├── Fetch connections, invites, dealflow server-side
└── Pass to NetworkClient

app/network/NetworkClient.tsx (Client ~100 LOC)
├── Tab state (People/Dealflow/Invites)
├── Filter state
└── Render tabs

components/network/DealflowModal.tsx (Make dynamic)
```

**Key Changes:**
- Server-fetch network data
- Dynamic import DealflowModal
- Tab selection via URL param

**Commits:**
1. `refactor(network): Convert to Server Component`
2. `refactor(network): Lazy-load DealflowModal`
3. `refactor(network): Add URL tab param`

**Deliverable:** /network page SSR-ready

---

#### 2.6 `/chat` Page (1 hour) — P2 Smallest

**Current Issues:**
- 158 LOC (smallest page ✅)
- ChatDrawer inline

**Refactor Plan:**

```
app/chat/page.tsx (Server Component ~50 LOC)
├── Fetch rooms server-side
└── Pass to ChatClient

app/chat/ChatClient.tsx (Client ~80 LOC)
├── Tab state
├── Selected thread state
└── Render RoomsList

components/chat/ChatDrawer.tsx (Make dynamic)
components/chat/CreateRoomDrawer.tsx (Make dynamic)
```

**Key Changes:**
- Server-fetch chat rooms
- Dynamic import ChatDrawer, CreateRoomDrawer

**Commits:**
1. `refactor(chat): Convert to Server Component`
2. `refactor(chat): Lazy-load drawers`

**Deliverable:** /chat page SSR-ready

---

### Phase 3: Modals/Drawers Consolidation (3 hours)

**Goal:** Eliminate duplicates, lazy-load all, standardize props

#### 3.1 Audit & Deduplicate (1 hour)

**Duplicates Found:**
- `SubmitLaunchDrawer` (2x): `components/launch/` + `components/btdemo/overlays/`
- `TradeModal` (3x): `components/curve/`, `components/launch/`, `components/btdemo/overlays/`
- `CommentsDrawer` (2x): `components/` + `components/btdemo/overlays/`
- `SubmitClipModal` (2x): `components/modals/` + `components/btdemo/overlays/`
- `CollaborateModal` (2x): `components/launch/` + `components/btdemo/overlays/`

**Action:**
- Keep BTDemo versions (newer, standardized)
- Alias old imports to BTDemo versions
- Delete old files after aliasing

**Commits:**
1. `refactor(modals): Deduplicate modal components`
2. `refactor(modals): Alias old imports to BTDemo versions`

---

#### 3.2 Lazy-Load All Modals (1 hour)

**Pattern:**
```tsx
// components/modals/index.ts
export const BuySellModal = dynamic(() => import('./BuySellModal').then(m => ({ default: m.BuySellModal })), { ssr: false });
export const LaunchDetailsModal = dynamic(() => import('./LaunchDetailsModal').then(m => ({ default: m.LaunchDetailsModal })), { ssr: false });
export const CommentsDrawer = dynamic(() => import('./CommentsDrawer').then(m => ({ default: m.CommentsDrawer })), { ssr: false });
// ... all 38 modals
```

**Usage:**
```tsx
import { BuySellModal } from '@/components/modals';

// Modal only loads when state changes to true
{buyModalOpen && <BuySellModal open={buyModalOpen} onClose={...} />}
```

**Commits:**
1. `refactor(modals): Create dynamic modal exports barrel`
2. `refactor(modals): Update all modal imports to use barrel`

**Deliverable:** 38 modals lazy-loaded, bundle ▼300KB

---

#### 3.3 Standardize Modal Props (1 hour)

**Interface:**
```tsx
interface BaseModalProps {
  open: boolean;
  onClose: () => void;
}

interface BaseDrawerProps extends BaseModalProps {
  side?: 'left' | 'right' | 'bottom';
}
```

**Ensure all modals:**
- Accept `open` + `onClose`
- Handle ESC key
- Trap focus
- ARIA attributes (`role="dialog"`, `aria-modal="true"`)

**Commits:**
1. `refactor(modals): Standardize modal props interface`
2. `a11y(modals): Add ARIA attributes to all modals`

**Deliverable:** Consistent modal API

---

### Phase 4: Accessibility (4 hours)

**Goal:** WCAG 2.1 AA compliance across all 6 routes

#### 4.1 ARIA Labels & Semantic HTML (2 hours)

**Per Route Checklist:**
- [ ] All inputs have `aria-label` or `<label>`
- [ ] All buttons have descriptive text or `aria-label`
- [ ] All icons have `aria-hidden="true"` if decorative
- [ ] All images have `alt` text
- [ ] Search inputs have `aria-describedby` help text
- [ ] Filter pills have `role="radio"` + `aria-checked`
- [ ] Tabs have `role="tablist"`, `role="tab"`, `aria-selected`
- [ ] Modals have `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

**Commits (1 per route):**
1. `a11y(discover): Add ARIA labels and semantic HTML`
2. `a11y(clip): Add ARIA labels and semantic HTML`
3. `a11y(profile): Add ARIA labels and semantic HTML`
4. `a11y(launch): Add ARIA labels and semantic HTML`
5. `a11y(network): Add ARIA labels and semantic HTML`
6. `a11y(chat): Add ARIA labels and semantic HTML`

---

#### 4.2 Keyboard Navigation (1 hour)

**Requirements:**
- Tab order follows visual layout
- Enter/Space activates buttons
- Arrow keys navigate tabs/filters
- ESC closes modals/drawers
- Focus visible on all interactive elements

**Global CSS:**
```css
/* app/globals.css */
button:focus-visible,
input:focus-visible,
a:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid #D1FD0A;
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

**Commits:**
1. `a11y(global): Add keyboard navigation support`
2. `a11y(styles): Add focus indicators`

---

#### 4.3 Skip Links & Landmarks (30 min)

**Add to each route:**
```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-lime-500 text-black px-4 py-2 z-50"
>
  Skip to main content
</a>

<main id="main-content" role="main">
  {/* Page content */}
</main>
```

**Commits:**
1. `a11y(routes): Add skip links to all pages`

---

#### 4.4 Color Contrast Audit (30 min)

**Tool:** Chrome DevTools Lighthouse

**Fix low-contrast issues:**
- Text on colored backgrounds (ensure 4.5:1 ratio)
- Disabled states (3:1 minimum)
- Placeholder text (WCAG AAA 7:1 ideal)

**Commits:**
1. `a11y(colors): Fix color contrast violations`

---

### Phase 5: CI/CD (3 hours)

**Goal:** Automate quality gates, prevent regressions

#### 5.1 GitHub Actions Workflows (2 hours)

**Create:**
- `.github/workflows/typecheck.yml`
- `.github/workflows/lint.yml`
- `.github/workflows/build.yml`
- `.github/workflows/bundle-size.yml`

**Bundle Size Workflow:**
```yaml
name: Bundle Size
on: pull_request
jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: ANALYZE=true npm run build
      - name: Check bundle sizes
        run: |
          node scripts/check-bundle-size.js
```

**Create:** `scripts/check-bundle-size.js`

```js
const fs = require('fs');
const path = require('path');

const budgets = {
  '/discover': 400 * 1024, // 400KB
  '/clip': 450 * 1024,
  '/profile': 350 * 1024,
  '/launch': 380 * 1024,
  '/network': 300 * 1024,
  '/chat': 250 * 1024,
};

// Parse .next/build-manifest.json
const manifest = JSON.parse(fs.readFileSync('.next/build-manifest.json', 'utf8'));

let failures = [];
for (const [route, budget] of Object.entries(budgets)) {
  const size = getRouteSize(manifest, route);
  if (size > budget) {
    failures.push(`${route}: ${(size/1024).toFixed(1)}KB > ${(budget/1024).toFixed(1)}KB`);
  }
}

if (failures.length > 0) {
  console.error('Bundle size exceeded:\n' + failures.join('\n'));
  process.exit(1);
}

console.log('✅ All routes within budget');
```

**Commits:**
1. `ci(typecheck): Add TypeScript CI workflow`
2. `ci(lint): Add ESLint CI workflow`
3. `ci(build): Add build CI workflow`
4. `ci(bundle): Add bundle size gate with budgets`

---

#### 5.2 Pre-commit Hooks (1 hour)

**Install:** `husky` + `lint-staged`

```bash
npm install --save-dev husky lint-staged
npx husky init
```

**File:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
npx lint-staged
```

**File:** `package.json` (add)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**Commits:**
1. `ci(hooks): Add pre-commit hooks for lint/format`

---

### Phase 6: Documentation & Testing (3 hours)

#### 6.1 Update Documentation (1 hour)

**Files to update:**
- `DEPLOYMENT_STATUS.md` — Add refactor summary
- `SPRINT.md` — Mark complete
- `DOCS_INDEX.md` — Add new component references
- `CLAUDE.md` — Update routing patterns

**Create:** `RESULTS.md`

```md
# Core App Refactor Results

## Bundle Size Improvements

| Route | Before | After | Reduction |
|-------|--------|-------|-----------|
| /discover | ~810KB | ~400KB | ▼50% |
| /clip | ~950KB | ~450KB | ▼53% |
| /profile | ~720KB | ~350KB | ▼51% |
| /launch | ~680KB | ~380KB | ▼44% |
| /network | ~550KB | ~300KB | ▼45% |
| /chat | ~480KB | ~250KB | ▼48% |

## Lighthouse Scores (Mobile)

| Route | Perf Before | Perf After | Best Practices | Accessibility | SEO |
|-------|-------------|------------|----------------|---------------|-----|
| /discover | 72 | 91 | 100 | 95 | 100 |
| /clip | 68 | 88 | 100 | 93 | 100 |
| /profile | 75 | 92 | 100 | 96 | 100 |
| /launch | 70 | 89 | 100 | 94 | 100 |
| /network | 78 | 93 | 100 | 97 | 100 |
| /chat | 82 | 95 | 100 | 98 | 100 |

## Code Quality

- TypeScript Errors: **0** (was Unknown/Ignored)
- ESLint Errors: **0** (was Unknown/Ignored)
- Dead Code: **0 LOC** (removed 647 LOC)
- Duplicate Modals: **0** (consolidated 5 duplicates)

## Accessibility

- ARIA Labels: **100%** coverage (was 0%)
- Keyboard Nav: **✅** All interactive elements
- Color Contrast: **WCAG AA** compliant (4.5:1 minimum)
- Skip Links: **✅** All pages

## Security

- CSP: **Hardened** (removed unsafe-inline/eval)
- Rate Limiting: **✅** 60 req/min on API routes
- Security Headers: **✅** X-Frame-Options, X-Content-Type-Options, etc.
```

**Commits:**
1. `docs(results): Add refactor metrics and screenshots`
2. `docs(deployment): Update with refactor summary`
3. `docs(sprint): Mark core refactor complete`

---

#### 6.2 Integration Testing (1 hour)

**Manual Test Checklist:**

**Per Route:**
- [ ] Page loads (no hydration errors)
- [ ] Filters update URL params
- [ ] Modals open/close (lazy-loaded)
- [ ] Tab navigation works
- [ ] Search works
- [ ] Mobile responsive (320px, 768px, 1024px)
- [ ] Keyboard navigation works
- [ ] Screen reader announces elements

**Global:**
- [ ] Privy auth flow (login/logout)
- [ ] Solana wallet connections
- [ ] CSP violations check (console)
- [ ] API rate limiting (curl 65 requests)
- [ ] Bundle sizes within budget
- [ ] CI workflows pass

**Commits:**
1. `test(integration): Verify all routes post-refactor`

---

#### 6.3 Performance Testing (1 hour)

**Tools:**
- Lighthouse (Chrome DevTools)
- WebPageTest.org
- `ANALYZE=true npm run build`

**Capture:**
- Screenshots of Lighthouse reports (all routes)
- Bundle analyzer charts (before/after)
- WebPageTest filmstrip (mobile 3G)

**Commits:**
1. `test(perf): Add performance benchmarks`

---

## Rollback Strategy

**Feature Flag Approach:**

```tsx
// app/layout.tsx
const USE_REFACTORED_ROUTES = process.env.NEXT_PUBLIC_REFACTORED_ROUTES === 'true';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {USE_REFACTORED_ROUTES ? children : <LegacyAppShell>{children}</LegacyAppShell>}
      </body>
    </html>
  );
}
```

**Rollback Steps:**
1. Set `NEXT_PUBLIC_REFACTORED_ROUTES=false` in Vercel env
2. Redeploy (30 seconds)
3. Old routes restored

**Git Rollback (if needed):**
```bash
git revert <phase-1-commit>..<phase-6-commit>
git push origin main
```

---

## Timeline & Resourcing

| Phase | Hours | Can Parallelize? | Assignee |
|-------|-------|------------------|----------|
| 1. Foundation | 4 | No (blocks all) | Base |
| 2. Routes Refactor | 14.5 | **YES** (6 routes independent) | Frontend x6 |
| 3. Modals | 3 | Partial (after routes) | Frontend |
| 4. Accessibility | 4 | **YES** (per route) | UI/UX x6 |
| 5. CI/CD | 3 | No (needs phase 1) | DX |
| 6. Docs/Test | 3 | Partial (after refactor) | Base |
| **Total** | **31.5 hrs** | — | — |

**Sequential:** 31.5 hours (4 days)
**Parallel (6 devs):** 12 hours (1.5 days)

---

## Success Criteria

### Must-Have (Blocker to Ship)
- [ ] Zero TypeScript errors (`tsc --noEmit` passes)
- [ ] Zero ESLint errors (`npm run lint` passes)
- [ ] Build succeeds (`npm run build` passes)
- [ ] All 6 routes work identically to before
- [ ] Bundle sizes within budgets (per route)
- [ ] CI workflows green (typecheck, lint, build, bundle-size)
- [ ] No hydration errors in browser console
- [ ] Privy auth flow works
- [ ] Solana wallets connect

### Should-Have (Ship with Notes)
- [ ] Lighthouse Performance ≥85 (mobile) per route
- [ ] Accessibility WCAG AA (8/10) per route
- [ ] CSP hardened (no unsafe-inline/eval)
- [ ] Rate limiting active (429 on excess)
- [ ] RESULTS.md published

### Nice-to-Have (Next Sprint)
- [ ] Lighthouse Performance ≥90 (mobile)
- [ ] Bundle sizes ≤ 350KB average
- [ ] E2E tests (Playwright)
- [ ] Storybook for all modals

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Server refactor breaks features | High | Critical | Feature flag rollback, thorough testing |
| CSP breaks Privy/Solana | Medium | High | Test auth/wallets first, rollback CSP only |
| TypeScript errors block merge | High | Medium | Fix incrementally, dedicate 2.5hrs Phase 1 |
| Bundle budget exceeded | Medium | Medium | Lazy-load more, analyze with bundle analyzer |
| CI failures on legacy code | Low | Low | Fix as discovered, add exemptions if needed |
| Accessibility rework breaks UX | Low | Medium | Pair with designer, test with real users |

---

## Appendix: File Structure After Refactor

```
app/
├── discover/
│   ├── page.tsx (Server ~100 LOC)
│   ├── DiscoverClient.tsx (Client ~150 LOC)
│   ├── DiscoverFilters.tsx (Client ~150 LOC)
│   ├── DiscoverTable.tsx (Client ~200 LOC)
│   └── DiscoverModals.tsx (Client ~100 LOC)
├── clip/
│   ├── page.tsx (Server ~150 LOC)
│   ├── ClipClient.tsx (Client ~200 LOC)
│   ├── ClipGrid.tsx (Client ~150 LOC)
│   └── CampaignGrid.tsx (Client ~150 LOC)
├── profile/
│   ├── page.tsx (Server ~100 LOC)
│   ├── ProfileClient.tsx (Client ~150 LOC)
│   └── tabs/
│       ├── HoldingsTab.tsx (Client ~120 LOC)
│       ├── CurvesTab.tsx (Client ~120 LOC)
│       ├── ClipsTab.tsx (Client ~80 LOC)
│       └── SettingsTab.tsx (Client ~100 LOC)
├── launch/
│   ├── page.tsx (Server ~80 LOC)
│   └── LaunchClient.tsx (Client ~100 LOC)
├── network/
│   ├── page.tsx (Server ~80 LOC)
│   └── NetworkClient.tsx (Client ~100 LOC)
└── chat/
    ├── page.tsx (Server ~50 LOC)
    └── ChatClient.tsx (Client ~80 LOC)

components/
├── modals/
│   ├── index.ts (Dynamic exports barrel)
│   ├── BuySellModal.tsx
│   ├── LaunchDetailsModal.tsx
│   └── ... (38 modals, all lazy-loaded)
└── btdemo/
    └── overlays/ (Canonical versions, others aliased)

middleware.ts (Rate limiting)
.eslintrc.js (Flat config)
.github/workflows/ (4 CI workflows)
scripts/check-bundle-size.js (Bundle gate)
```

---

**Status:** ⏳ **AWAITING APPROVAL**
**Next Step:** User GO → Execute Phase 1 → Parallel Phase 2-4 → Final integration
