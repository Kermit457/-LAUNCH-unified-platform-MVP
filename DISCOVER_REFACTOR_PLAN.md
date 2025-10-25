# De-AI Refactor Plan — app/discover

**Plan Date:** 2025-10-25
**Target:** app/discover + global infrastructure hardening
**Effort:** ~16 hours (2 full dev days)
**Risk Level:** 🟡 MODERATE (high impact, clear rollback path)

---

## Objectives

1. **Performance:** Reduce /discover First Load JS by 40% (move to server components)
2. **Quality:** Zero TypeScript/ESLint errors enforced in CI
3. **Accessibility:** WCAG 2.1 AA compliance on /discover
4. **Security:** Harden CSP, add rate limiting
5. **DX:** Clean codebase, robust CI, reviewable diffs

---

## Phase 1: Foundation & Quick Wins (2 hours)

**Owner:** Base Orchestrator
**Risk:** 🟢 LOW (cleanup + config)
**Rollback:** Git revert each commit

### Tasks

#### 1.1 Delete Dead Code (5 min)
```bash
git rm app/discover/page-backup.tsx app/discover/page-original.tsx
git commit -m "chore(discover): Remove backup files"
```
**Acceptance:** 647 LOC removed, repo cleaner.

---

#### 1.2 Enable TypeScript & ESLint Enforcement (15 min)
**Files:** `next.config.js`

**Changes:**
```diff
- typescript: { ignoreBuildErrors: true },
- eslint: { ignoreDuringBuilds: true },
+ typescript: { ignoreBuildErrors: false },
+ eslint: { ignoreDuringBuilds: false },
```

**Validation:**
```bash
npm run typecheck  # Must pass
npm run lint       # Must pass (or create ESLint config first)
npm run build      # Must pass
```

**Commit:**
```
fix(config): Enforce TypeScript and ESLint in builds

- Remove ignoreBuildErrors and ignoreDuringBuilds
- Ensures type safety and code quality in production
```

**Acceptance:** Build fails if TS/lint errors exist.
**Risk:** May uncover existing errors → fix before merge.

---

#### 1.3 Add ESLint Flat Config (30 min)
**File:** Create `.eslintrc.js`

```js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/order': ['warn', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],
  },
};
```

**Validation:**
```bash
npm run lint -- --fix
```

**Commit:**
```
feat(dx): Add ESLint configuration with TypeScript rules

- Enforce no-explicit-any, unused-vars, import-order
- Integrate with Next.js core-web-vitals
```

**Acceptance:** Lint runs without errors, auto-fixes applied.

---

#### 1.4 Fix TypeScript Errors (1 hour)
**Scope:** Fix all errors revealed by `tsc --noEmit`.

**Common fixes:**
- Replace `any` with typed interfaces (e.g., `icon: any` → `icon: React.ComponentType`)
- Add missing type annotations
- Fix implicit `any` in callbacks

**Commit:**
```
fix(types): Resolve TypeScript strict mode errors

- Replace `any` with proper types
- Add missing type annotations
- Fix callback signatures
```

**Acceptance:** `tsc --noEmit` returns 0 errors.

---

## Phase 2: Security & Headers (1 hour)

**Owner:** Security Agent
**Risk:** 🟡 MODERATE (may break Privy if CSP too strict)
**Rollback:** Revert CSP changes, test Privy auth flow

### Tasks

#### 2.1 Tighten Content Security Policy (30 min)
**File:** `next.config.js`

**Changes:**
```js
headers: [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'nonce-{{NONCE}}' https://auth.privy.io",
      "style-src 'self' 'nonce-{{NONCE}}'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://auth.privy.io https://api.devnet.solana.com https://cloud.appwrite.io",
      "frame-src 'self' https://auth.privy.io https://verify.walletconnect.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
],
```

**Note:** Replace `{{NONCE}}` with actual nonce generation in middleware (or use hash-based CSP).

**Validation:**
1. Test Privy auth flow (login/logout)
2. Test Solana wallet connections
3. Check browser console for CSP violations

**Commit:**
```
security(headers): Harden CSP and add security headers

- Remove unsafe-inline and unsafe-eval
- Add X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Restrict connect-src to known domains
```

**Acceptance:** All features work, no CSP violations in console.

---

#### 2.2 Add Rate Limiting Middleware (30 min)
**File:** Create `middleware.ts`

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const limit = 60; // requests per minute
  const windowMs = 60_000;

  const rateLimit = rateLimits.get(ip);

  if (!rateLimit || now > rateLimit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return NextResponse.next();
  }

  if (rateLimit.count >= limit) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  rateLimit.count++;
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

**Validation:**
```bash
# Test with curl (send 65 requests in 1 minute)
for i in {1..65}; do curl http://localhost:3000/api/activities; done
# Expect 429 after 60th request
```

**Commit:**
```
security(middleware): Add rate limiting for API routes

- Limit to 60 requests per minute per IP
- Returns 429 Too Many Requests when exceeded
```

**Acceptance:** API routes return 429 after rate limit exceeded.

---

## Phase 3: app/discover Refactor (6 hours)

**Owner:** Full-stack Developer Agent
**Risk:** 🔴 HIGH (major architecture change)
**Rollback:** Keep `page.tsx` as `page.client.tsx` backup until tested

### Strategy

**Before:**
```
app/discover/page.tsx (1,012 LOC client component)
├── Data fetching (useEffect)
├── Filters state
├── Modals state
├── UI rendering
└── Event handlers
```

**After:**
```
app/discover/page.tsx (Server Component ~100 LOC)
├── Fetch data server-side
├── Pass to client islands
└── Render static shell

app/discover/DiscoverFilters.tsx (Client ~150 LOC)
├── Filter state
└── URL param sync

app/discover/DiscoverTable.tsx (Client ~200 LOC)
├── Table rendering
└── Lazy-loaded modals

app/discover/DiscoverCards.tsx (Client ~200 LOC)
├── Card grid
└── Lazy-loaded modals
```

### Tasks

#### 3.1 Create Server Component Wrapper (1 hour)
**File:** Create `app/discover/page.tsx` (new server component)

```tsx
import { Suspense } from 'react';
import { getDiscoverListings } from '@/lib/appwrite/services/discover';
import { DiscoverClient } from './DiscoverClient';
import { DiscoverSkeleton } from './DiscoverSkeleton';

export const metadata = {
  title: 'Discover | ICM Motion',
  description: 'Markets for ideas, creators, and memes',
};

export const revalidate = 30; // ISR: revalidate every 30 seconds

type PageProps = {
  searchParams: {
    type?: 'all' | 'icm' | 'ccm' | 'meme';
    status?: 'all' | 'live' | 'active' | 'frozen';
    sort?: 'trending' | 'new' | 'volume' | 'conviction' | 'active' | 'live';
    q?: string;
  };
};

export default async function DiscoverPage({ searchParams }: PageProps) {
  const typeFilter = searchParams.type ?? 'all';
  const statusFilter = searchParams.status ?? 'all';
  const sortBy = searchParams.sort ?? 'trending';
  const searchQuery = searchParams.q;

  // Server-side data fetching
  const data = await getDiscoverListings({
    type: typeFilter,
    status: statusFilter,
    sortBy,
    searchQuery,
  });

  return (
    <Suspense fallback={<DiscoverSkeleton />}>
      <DiscoverClient
        initialListings={data.advanced}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        sortBy={sortBy}
        searchQuery={searchQuery ?? ''}
      />
    </Suspense>
  );
}
```

**Commit:**
```
refactor(discover): Convert to Server Component with ISR

- Move data fetching to server
- Add ISR with 30s revalidation
- Use URL params for filters (shareable URLs)
```

**Acceptance:** Page renders server-side, data pre-fetched.

---

#### 3.2 Extract Client Island — Filters (1.5 hours)
**File:** Create `app/discover/DiscoverFilters.tsx`

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterPill } from './FilterPill';

type Props = {
  typeFilter: string;
  statusFilter: string;
  sortBy: string;
  searchQuery: string;
  resultCount: number;
  totalCount: number;
};

export function DiscoverFilters({ typeFilter, statusFilter, sortBy, searchQuery, resultCount, totalCount }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/discover?${params.toString()}`);
  };

  // ... rest of filter UI (200 LOC)
}
```

**Commit:**
```
refactor(discover): Extract filters to client island

- Sync filters with URL params
- Enable shareable filter states
- Reduce client bundle (filters only)
```

**Acceptance:** Filters update URL, page refreshes with new data.

---

#### 3.3 Extract Client Island — Modals (1.5 hours)
**File:** Create `app/discover/DiscoverModals.tsx`

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Lazy-load heavy modals
const BuySellModal = dynamic(() => import('@/components/launch/BuySellModal').then(m => ({ default: m.BuySellModal })));
const LaunchDetailsModal = dynamic(() => import('@/components/launch/LaunchDetailsModal').then(m => ({ default: m.LaunchDetailsModal })));
const CommentsDrawer = dynamic(() => import('@/components/CommentsDrawer').then(m => ({ default: m.CommentsDrawer })));
const SubmitClipModal = dynamic(() => import('@/components/modals/SubmitClipModal').then(m => ({ default: m.SubmitClipModal })));

export function DiscoverModals({ listings }: { listings: any[] }) {
  const [buyModalListing, setBuyModalListing] = useState(null);
  const [detailsModalListing, setDetailsModalListing] = useState(null);
  // ... rest of modal state & handlers
}
```

**Commit:**
```
refactor(discover): Extract modals to lazy-loaded island

- Dynamic imports for BuySellModal, LaunchDetailsModal, CommentsDrawer
- Reduce initial bundle (modals only load on interaction)
```

**Acceptance:** Modals load on demand, not in initial bundle.

---

#### 3.4 Extract Client Island — Table View (1.5 hours)
**File:** Create `app/discover/DiscoverTable.tsx`

```tsx
'use client';

import { AdvancedTableViewBTDemo } from '@/components/btdemo/AdvancedTableViewBTDemo';

export function DiscoverTable({ listings, onBuyClick, onRowClick }: Props) {
  return (
    <div className="bg-zinc-900/20 backdrop-blur-xl rounded-2xl border border-zinc-800/50">
      <AdvancedTableViewBTDemo
        listings={listings}
        onBuyClick={onBuyClick}
        onRowClick={onRowClick}
      />
    </div>
  );
}
```

**Commit:**
```
refactor(discover): Extract table view to client island

- Isolate interactive table rendering
- Keep static shell on server
```

**Acceptance:** Table renders, interactive features work.

---

#### 3.5 Integration & Testing (30 min)
**Tasks:**
1. Wire up all islands in `DiscoverClient.tsx`
2. Test filter changes → URL updates → server refetch
3. Test modal open/close
4. Test table/card view toggle
5. Verify no regressions

**Commit:**
```
refactor(discover): Complete server/client split integration

- Wire filters, modals, table, cards as client islands
- Server component handles data fetching
- URL params drive filter state
```

**Acceptance:**
- All features work identically
- Initial bundle reduced by ~40%
- Server pre-renders data

---

## Phase 4: Accessibility (2 hours)

**Owner:** UI/UX Designer Agent
**Risk:** 🟢 LOW (non-breaking additions)
**Rollback:** N/A (additive only)

### Tasks

#### 4.1 Add ARIA Labels & Semantic HTML (1 hour)
**Files:** All discover components

**Changes:**
```diff
// Search input
<input
  type="text"
+ aria-label="Search discover listings"
+ aria-describedby="search-help"
  placeholder="Search..."
  ...
/>
+<span id="search-help" className="sr-only">
+  Search by project name, ticker, or description
+</span>

// Filter pills
<button
+ role="radio"
+ aria-checked={active}
+ aria-label={`Filter by ${children}`}
  onClick={onClick}
  ...
>
  {children}
</button>

// View toggle
<button
+ aria-label="Switch to cards view"
+ aria-pressed={displayMode === 'cards'}
  onClick={() => setDisplayMode('cards')}
>
  <LayoutGrid aria-hidden="true" />
  Cards
</button>
```

**Commit:**
```
a11y(discover): Add ARIA labels and semantic HTML

- Search input with aria-label and description
- Filter pills with role=radio and aria-checked
- View toggles with aria-pressed
```

**Acceptance:** Screen reader announces all interactive elements.

---

#### 4.2 Add Keyboard Navigation (30 min)
**Files:** `DiscoverFilters.tsx`, `FilterPill.tsx`

**Changes:**
```tsx
// Filter pill keyboard handler
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }}
  ...
>
```

**Commit:**
```
a11y(discover): Add keyboard navigation for filters

- Enter/Space activates filter pills
- Tab order follows visual layout
```

**Acceptance:** All filters navigable via keyboard.

---

#### 4.3 Add Skip Links (15 min)
**File:** `app/discover/DiscoverClient.tsx`

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-lime-500 text-black px-4 py-2 z-50"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Discover content */}
</main>
```

**Commit:**
```
a11y(discover): Add skip link for screen readers

- Skip to main content link
- Focus visible on keyboard nav
```

**Acceptance:** Tab key reveals skip link, activates on Enter.

---

#### 4.4 Focus Indicators (15 min)
**File:** `globals.css`

```css
/* Ensure focus is visible */
button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid #D1FD0A;
  outline-offset: 2px;
}
```

**Commit:**
```
a11y(styles): Add visible focus indicators

- Lime outline on focus-visible
- Consistent across buttons, inputs, links
```

**Acceptance:** All interactive elements show focus ring.

---

## Phase 5: CI & Automation (2 hours)

**Owner:** DX Agent
**Risk:** 🟢 LOW (CI only, doesn't affect app)
**Rollback:** N/A (delete workflow files)

### Tasks

#### 5.1 Add TypeCheck Workflow (20 min)
**File:** Create `.github/workflows/typecheck.yml`

```yaml
name: TypeCheck
on: [push, pull_request]
jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
```

**Commit:**
```
ci(typecheck): Add TypeScript type checking workflow

- Runs on push and PR
- Fails on TypeScript errors
```

**Acceptance:** Workflow passes on clean code, fails on TS errors.

---

#### 5.2 Add Lint Workflow (20 min)
**File:** Create `.github/workflows/lint.yml`

```yaml
name: Lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
```

**Commit:**
```
ci(lint): Add ESLint workflow

- Runs on push and PR
- Fails on lint errors
```

**Acceptance:** Workflow passes on clean code, fails on lint errors.

---

#### 5.3 Add Build Workflow (30 min)
**File:** Create `.github/workflows/build.yml`

```yaml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next
```

**Commit:**
```
ci(build): Add Next.js build workflow

- Runs on push and PR
- Fails on build errors
- Uploads .next artifacts
```

**Acceptance:** Workflow passes on clean code, fails on build errors.

---

#### 5.4 Add Bundle Size Workflow (50 min)
**File:** Create `.github/workflows/bundle-size.yml`

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
      - name: Check bundle size
        run: |
          # Extract bundle sizes from build output
          # Fail if main bundle > 512KB
          node scripts/check-bundle-size.js
```

**Note:** Requires creating `scripts/check-bundle-size.js` to parse `.next/analyze` output.

**Commit:**
```
ci(bundle): Add bundle size monitoring workflow

- Analyzes bundle on PRs
- Fails if chunks exceed 512KB budget
```

**Acceptance:** Workflow fails if bundle exceeds budget.

---

## Phase 6: Documentation & Cleanup (1 hour)

**Owner:** Base Orchestrator
**Risk:** 🟢 LOW (docs only)

### Tasks

#### 6.1 Update DEPLOYMENT_STATUS.md (15 min)
**File:** `DEPLOYMENT_STATUS.md`

**Add section:**
```md
## 🏗️ Recent Refactors

### app/discover (2025-10-25)
- ✅ Converted to Server Component with ISR
- ✅ Split into 4 client islands (filters, modals, table, cards)
- ✅ Reduced initial bundle by ~40%
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Hardened CSP and security headers
```

**Commit:**
```
docs(deployment): Document app/discover refactor
```

---

#### 6.2 Create RESULTS.md (30 min)
**File:** Create `RESULTS.md`

**Content:**
- Before/after metrics (bundle size, Lighthouse scores)
- Screenshots of Lighthouse reports
- Links to commits

**Commit:**
```
docs(results): Add refactor results report
```

---

#### 6.3 Update SPRINT.md (15 min)
**File:** `SPRINT.md`

**Add to completed:**
```md
- ✅ app/discover refactor (server components + accessibility)
- ✅ CI workflows (typecheck, lint, build, bundle-size)
- ✅ Security hardening (CSP, rate limiting)
```

**Commit:**
```
docs(sprint): Mark discover refactor complete
```

---

## Rollback Plan

**If refactor fails:**

1. **Revert server component changes:**
   ```bash
   git revert <commit-sha-range>
   ```

2. **Restore original page.tsx:**
   ```bash
   git checkout <pre-refactor-commit> -- app/discover/page.tsx
   ```

3. **Keep CI workflows** (non-breaking, can stay)

4. **Keep accessibility improvements** (additive, non-breaking)

---

## Success Criteria

### Must-Have (Blocker to Ship)
- [ ] Zero TypeScript errors (`tsc --noEmit` passes)
- [ ] Zero ESLint errors (`npm run lint` passes)
- [ ] Build succeeds (`npm run build` passes)
- [ ] All features work identically to before refactor
- [ ] Initial bundle reduced by ≥30% on /discover
- [ ] CI workflows green

### Should-Have (Ship with Notes)
- [ ] Accessibility score ≥8/10 (WCAG AA)
- [ ] CSP hardened (no unsafe-inline/eval)
- [ ] Rate limiting active on API routes
- [ ] RESULTS.md published with metrics

### Nice-to-Have (Next Sprint)
- [ ] Bundle size < 512KB per chunk
- [ ] Lighthouse Performance ≥90 (mobile)
- [ ] ISR revalidation optimized (A/B test 30s vs 60s)

---

## Timeline

| Phase | Duration | Assignee | Dependency |
|-------|----------|----------|------------|
| 1. Foundation | 2 hrs | Base | None |
| 2. Security | 1 hr | Security | Phase 1 |
| 3. Refactor | 6 hrs | Full-stack | Phase 1 |
| 4. Accessibility | 2 hrs | UI/UX | Phase 3 |
| 5. CI | 2 hrs | DX | Phase 1 |
| 6. Docs | 1 hr | Base | Phase 3-5 |
| **Total** | **14 hrs** | — | — |

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Server refactor breaks features | Medium | High | Keep backup files, thorough testing |
| CSP too strict blocks Privy | Low | High | Test auth flow, rollback CSP only |
| TypeScript errors block merge | High | Medium | Fix incrementally, pair with team |
| Bundle budget still exceeded | Medium | Medium | Analyze with bundle analyzer, lazy-load more |

---

## Next Steps

**Immediate:**
1. Present AUDIT.md and DISCOVER_REFACTOR_PLAN.md to user
2. Get approval on approach and timeline
3. Create feature branch `refactor/discover-de-ai`
4. Execute Phase 1 (Foundation)

**On Approval:**
- Assign agents to phases (or execute sequentially)
- Open PR after Phase 3 for review
- Merge after all CI checks pass

---

**Ready for GO signal.**
