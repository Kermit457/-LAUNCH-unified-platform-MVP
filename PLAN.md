# /Launch Page Rebuild - Implementation Plan

## Goal
Transform /launch from marketing-focused page to live market dashboard with real-time metrics, project spotlight, leaderboards, and filterable feed.

## Success Criteria
- [ ] Real-time hero metrics (TVL, Airdrops, 24h Motion, Live Projects)
- [ ] Top 3 project spotlight with [Buy][Join][React] CTAs
- [ ] Tabbed leaderboards (Builders/Investors/Communities) with real data
- [ ] Filterable/sortable project feed
- [ ] Mobile responsive (320px+)
- [ ] Performance: LCP ≤2.5s, Bundle ≤220KB gzip
- [ ] Accessibility: WCAG 2.1 AA compliant

## Scope
**In scope:**
- Hero metrics dashboard with live updates
- Spotlight carousel (top 3 projects)
- Leaderboard tabs with rankings
- Project feed with filters (All/Live/Frozen/Launched)
- Search functionality
- [+ Create] CTA integration with existing SubmitLaunchDrawer

**Out of scope:**
- Advanced analytics/charts (separate dashboard)
- Project detail pages (use existing curve pages)
- User profile pages (existing /profile)
- On-chain curve modifications (V6 features unchanged)

## Non-Goals
- We are NOT changing existing curve logic or smart contracts
- We are NOT replacing /discover page (different use case)
- We are NOT adding new database collections yet (use staging queries first)

---

## Multi-Agent Consultation Results

### UI/UX Designer Assessment: 8.5/10

**Strengths Identified:**
- ✅ Information architecture (metrics → spotlight → leaderboards → feed) follows natural F-pattern
- ✅ Clear user journey: Discover → Evaluate → Engage
- ✅ Social proof via leaderboards drives engagement
- ✅ Contextual CTAs at decision points

**Critical Issues:**
1. **Mobile Header Crowded** - [🚀 ICMX Launch][Search][+ Create] = 95% screen width on 320px
   - Solution: Collapse to icons-only on mobile
2. **Spotlight Cards** - 3 cards horizontally won't work on mobile
   - Solution: Horizontal scroll carousel with snap points
3. **Leaderboard Tables** - 4-5 columns too narrow on mobile
   - Solution: Card layout instead of tables on mobile
4. **CTA Hierarchy** - All buttons equal weight violates progressive commitment
   - Solution: [React 👍] (secondary) → [Join] (secondary) → [Buy] (primary)

**Recommendations Adopted:**
- Add visual heat indicators (🔥 badge for trending)
- Color-code project status (green=live, cyan=frozen, muted=launched)
- Implement empty states for all sections
- Add smooth transitions for real-time metric updates

### Frontend Developer Assessment

**Component Architecture:**
```
/launch/page.tsx (Server Component - Shell)
├── LaunchHeader (Client) - Search + Create CTA
├── HeroMetrics (Server → Client) - 4 metrics with real-time
├── SpotlightCarousel (Client) - Top 3 projects
├── LeaderboardTabs (Client) - 3 tabbed leaderboards
└── ProjectFeed (Client) - Filterable feed
```

**Reusable Components:**
- ✅ `ProjectCurveCard` (exists) - Reuse for spotlight
- ✅ `CoinListItem` (exists) - Reuse for mobile feed
- ✅ `SubmitLaunchDrawer` (exists) - [+ Create] button
- 🆕 `MetricCard`, `LeaderboardTable`, `FeedFilters` - New components

**State Management Strategy:**
- **Local State:** Tab selection, filters, search query (useState)
- **Server State:** Projects, leaderboards, metrics (React Query)
- **Real-time:** WebSocket subscriptions via Appwrite Realtime

**Performance Optimizations:**
- Hybrid SSR + Client: Server renders shell, client hydrates with real-time
- Code splitting: Dynamic imports for LeaderboardTabs, SpotlightCarousel
- LazyMotion: Reduce Framer Motion from 68KB → 28KB
- Virtualization: For feeds with 100+ items (react-virtual)

**Architecture Risks:**
1. **Real-time overload** - Throttle updates to 1 per 2s
2. **Bundle size** - Lazy load heavy sections, target <220KB
3. **Layout shift** - Reserve space with skeletons

### Backend Architect Assessment

**Database Schema:**
- ✅ Reuse existing `curves` collection (has all project data)
- 🆕 Add `platform_metrics` collection (singleton for aggregates)
- 🆕 Add `leaderboard_*` collections (pre-computed rankings)

**API Endpoints:**
- `GET /api/launch/metrics/hero` - Platform stats (TVL, airdrops, motion, live count)
- `GET /api/launch/spotlight` - Top 3 projects by TVL or trending score
- `GET /api/launch/leaderboard/{type}` - Builders/Investors/Communities
- `GET /api/launch/feed?status={}&sort={}` - Filterable project list

**Caching Strategy (3-Layer):**
1. **Redis** (server): 5min TTL for aggregates, 1min for feeds
2. **React Query** (client): 30s stale time, aggressive deduplication
3. **Appwrite** (database): Denormalized fields + indexes

**Real-time Updates:**
- **Hybrid approach:** Polling for aggregates (30s), Realtime for projects
- Optimistic UI for user actions (buy/join)

**Performance Targets:**
- Hero metrics: <100ms (cached)
- Spotlight: <150ms (cached)
- Feed (20 items): <300ms (cached)
- Leaderboards: <100ms (pre-computed)

**Full architecture:** See `LAUNCH_PAGE_DATA_ARCHITECTURE.md`

### Performance Analysis

**Current Bundle:**
- Framer Motion: ~68KB (reduce to 28KB with LazyMotion)
- Recharts: ~150KB (not needed for /launch, avoid import)
- Lightweight-charts: ~45KB (only if needed)
- Target: <220KB total JS

**Optimizations:**
1. **Code Splitting:**
   ```typescript
   const LeaderboardTabs = dynamic(() => import('@/components/launch/LeaderboardTabs'))
   const SpotlightCarousel = dynamic(() => import('@/components/launch/SpotlightCarousel'))
   ```

2. **Image Optimization:**
   - Next.js Image with blur placeholders
   - Lazy loading for off-screen images
   - CDN delivery (Appwrite Storage)

3. **Rendering Performance:**
   - Memoize expensive components (ProjectCard)
   - Virtualize long lists (>50 items)
   - Debounce search/filter (300ms)

4. **Real-time Performance:**
   - Throttle WebSocket updates (max 1/2s)
   - Batch multiple updates
   - Reduce motion on mobile

**Performance Budget:**
- Initial JS: <220KB gzip
- LCP: <2.5s
- INP: <200ms
- CLS: <0.1

---

## Execution Plan

### Step 1: Database Preparation
- **Owner:** Self
- **Files:**
  - `lib/appwrite/services/metrics.ts` (NEW)
  - `lib/appwrite/services/leaderboard.ts` (NEW)
- **Est:** 60 minutes
- **Output:** Service functions to query aggregated metrics and leaderboards
- **Dependencies:** None

**Tasks:**
- [ ] Create `getGlobalMetrics()` - TVL, airdrops, 24h motion, live count
- [ ] Create `getTopProjects(limit)` - Spotlight projects
- [ ] Create `getLeaderboard(type)` - Builder/investor/community rankings
- [ ] Create `getProjectFeed(filters)` - Filtered project list
- [ ] Add indexes for performance (status, tvl, createdAt)

### Step 2: Component Development
- **Owner:** Self
- **Files:**
  - `components/launch/LaunchHeader.tsx` (NEW)
  - `components/launch/HeroMetrics.tsx` (NEW)
  - `components/launch/MetricCard.tsx` (NEW)
  - `components/launch/SpotlightCarousel.tsx` (NEW)
  - `components/launch/LeaderboardTabs.tsx` (NEW)
  - `components/launch/ProjectFeed.tsx` (NEW)
- **Est:** 120 minutes
- **Output:** All UI components with mock data
- **Dependencies:** Step 1 (service layer)

**Tasks:**
- [ ] Extract design system components (Badge, StatCard, FilterPill)
- [ ] Build LaunchHeader with search + [+ Create]
- [ ] Build HeroMetrics (4 metric cards grid)
- [ ] Build SpotlightCarousel (horizontal scroll on mobile)
- [ ] Build LeaderboardTabs (table → cards on mobile)
- [ ] Build ProjectFeed with filters/sort

### Step 3: Real-time Hooks
- **Owner:** Self
- **Files:**
  - `hooks/useRealtimeMetrics.ts` (NEW)
  - `hooks/useLeaderboard.ts` (NEW)
  - `hooks/useProjectFeed.ts` (NEW)
- **Est:** 45 minutes
- **Output:** Custom hooks with React Query + Appwrite Realtime
- **Dependencies:** Step 1, Step 2

**Tasks:**
- [ ] Create `useRealtimeMetrics(initialData)` - Throttled updates
- [ ] Create `useLeaderboard(type)` - Cached rankings
- [ ] Create `useProjectFeed(filters)` - With optimistic updates
- [ ] Add error handling and loading states

### Step 4: Page Integration
- **Owner:** Self
- **Files:**
  - `app/launch/page.tsx` (REWRITE)
- **Est:** 60 minutes
- **Output:** Working /launch page with Server + Client hybrid
- **Dependencies:** Steps 1-3

**Tasks:**
- [ ] Replace current marketing page with new dashboard
- [ ] Fetch initial data in Server Component
- [ ] Wire up all client components
- [ ] Connect real-time subscriptions
- [ ] Add loading skeletons and empty states

### Step 5: Mobile & Accessibility
- **Owner:** Self
- **Files:**
  - All components from Step 2
  - `app/globals.css` (responsive utilities)
- **Est:** 45 minutes
- **Output:** Mobile-optimized, WCAG 2.1 AA compliant
- **Dependencies:** Step 4

**Tasks:**
- [ ] Test on 320px, 768px, 1024px, 1920px viewports
- [ ] Implement mobile-specific layouts (header collapse, card stacks, etc)
- [ ] Add ARIA labels, keyboard navigation
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Add skip links, focus indicators

### Step 6: Performance Optimization & Testing
- **Owner:** Self
- **Files:**
  - `next.config.js` (bundle analyzer)
  - All components (memoization)
- **Est:** 30 minutes
- **Output:** Performance targets met, passing tests
- **Dependencies:** Step 5

**Tasks:**
- [ ] Run bundle analyzer: `ANALYZE=true npm run build`
- [ ] Verify JS bundle <220KB gzip
- [ ] Test LCP <2.5s, INP <200ms
- [ ] Load test with 100+ projects
- [ ] Test real-time updates with concurrent users
- [ ] Verify no console errors

**Total Estimated Time:** 360 minutes (6 hours)

---

## Blast Radius

### UI Impact
- ☑️ Pages affected: `/launch` (complete rewrite)
- ☑️ Components created: 10+ new components
- ☑️ Components reused: `ProjectCurveCard`, `CoinListItem`, `SubmitLaunchDrawer`
- ☑️ Layout changes: Marketing → Dashboard
- ☑️ Breaking UI changes: **YES** - Complete redesign

### API Impact
- ☑️ New endpoints: `/api/launch/*` (4 endpoints)
- ☑️ Modified endpoints: None
- ☑️ Deprecated endpoints: None
- ☑️ Breaking API changes: No

### Backend Impact
- ☑️ New collections: `platform_metrics`, `leaderboard_*` (optional, can use queries initially)
- ☑️ New attributes: None (use existing curves data)
- ☑️ Indexes to create: 5+ on curves collection
- ☑️ Migrations needed: No

### Environment Variables
- ☐ New env vars: None (reuse existing Appwrite vars)
- ☐ Modified env vars: None
- ☐ Secrets to add: None

### Dependencies
- ☐ New packages: None (all already installed: @tanstack/react-query, framer-motion, zustand)
- ☑️ Bundle impact: +~50KB for new components (within 220KB budget)

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Real-time data overload | Medium | High | Throttle updates to 1/2s, batch subscriptions |
| Mobile UX degradation | Low | Medium | Test on real devices, progressive enhancement |
| Bundle size exceeds 220KB | Low | Medium | Code splitting, LazyMotion, dynamic imports |
| Layout shift on load | Medium | Low | Skeletons with exact dimensions |
| Leaderboard query performance | Medium | High | Pre-compute rankings, cache heavily |
| Empty state confusion | Low | Low | Clear CTAs and guidance for empty data |

---

## Rollback Plan

### Git Rollback
```bash
# Current commit before changes
git log --oneline  # Note commit hash

# If issues found after deployment
git revert <commit-hash>
git push origin main

# Or hard reset (destructive)
git reset --hard <previous-commit>
git push --force origin main  # ⚠️ Only if necessary
```

### Feature Flag (Recommended)
```typescript
// app/launch/page.tsx
const USE_NEW_LAUNCH_PAGE = process.env.NEXT_PUBLIC_ENABLE_NEW_LAUNCH === 'true'

export default function LaunchPage() {
  if (!USE_NEW_LAUNCH_PAGE) {
    return <LegacyLaunchPage />  // Current marketing page
  }
  return <NewLaunchDashboard />  // New implementation
}
```

**Rollback Steps:**
1. Set `NEXT_PUBLIC_ENABLE_NEW_LAUNCH=false` in Vercel env
2. Redeploy (30 seconds)
3. Old page restored immediately

### Database Rollback
**No database changes required initially** - uses existing `curves` collection.

If leaderboard collections created:
```bash
# Optional: Delete new collections via Appwrite Console
# Databases → launchos_db → Collections → Delete
```

---

## Dependencies & Sequencing

**Depends on:**
- [x] Existing `/discover` page logic (reuse filtering/sorting)
- [x] Existing `SubmitLaunchDrawer` component
- [x] Existing `curves` collection in Appwrite
- [x] React Query setup (already configured)

**Blocks:**
- [ ] Future: Advanced analytics dashboard (needs this as foundation)
- [ ] Future: Project detail pages (feeds into them)

**Parallel work:**
- Can work simultaneously on: Design system components, testing infrastructure, documentation

---

## PR Checklist

### Code Quality
- [ ] TypeScript compilation clean: `tsc --noEmit`
- [ ] ESLint passes: `npm run lint`
- [ ] All components have proper types (no `any`)
- [ ] No console.log/debugger statements
- [ ] Error handling implemented
- [ ] Loading states implemented

### Performance
- [ ] Bundle size check: `ANALYZE=true npm run build` (<220KB)
- [ ] No N+1 queries introduced
- [ ] Images optimized (Next.js Image component)
- [ ] Database indexes created
- [ ] Code splitting verified
- [ ] Real-time subscriptions throttled

### Security
- [ ] Input validation (Zod schemas for API)
- [ ] Rate limiting on API routes
- [ ] No sensitive data in logs
- [ ] Environment variables not committed
- [ ] Authorization checks on leaderboard endpoints

### Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Arrows)
- [ ] Color contrast WCAG AA (4.5:1 minimum)
- [ ] Screen reader tested
- [ ] Focus indicators visible

### Mobile
- [ ] Tested on 320px width (iPhone SE)
- [ ] Touch targets ≥44x44px
- [ ] Horizontal scroll works (spotlight)
- [ ] Safe area insets respected
- [ ] Bottom nav doesn't overlap content

### Documentation
- [ ] CHANGELOG.md updated
- [ ] Component props documented
- [ ] API endpoints documented in LAUNCH_PAGE_DATA_ARCHITECTURE.md
- [ ] README updated with new page description

---

## Implementation Guidelines

### Design System Consistency
```typescript
// Use existing design tokens from globals.css
className="glass-premium"         // Cards
className="btn-primary"            // Primary CTAs
className="btn-secondary"          // Secondary actions
className="text-gradient-main"    // Headings

// Color coding (from UX review)
status === 'live' → border-[#00FF88]      // Green
status === 'frozen' → border-[#00FFFF]    // Cyan
status === 'launched' → border-zinc-700   // Muted
```

### Responsive Breakpoints
```typescript
// Mobile first approach
<div className="
  grid-cols-2          {/* Mobile: 320px+ */}
  md:grid-cols-4       {/* Tablet: 768px+ */}
  lg:grid-cols-5       {/* Desktop: 1024px+ */}
  xl:grid-cols-6       {/* Wide: 1280px+ */}
">
```

### Real-time Best Practices
```typescript
// Throttle updates
const useThrottledMetrics = (data, delay = 2000) => {
  const [throttled, setThrottled] = useState(data)

  useEffect(() => {
    const timer = setTimeout(() => setThrottled(data), delay)
    return () => clearTimeout(timer)
  }, [data, delay])

  return throttled
}

// Animate number changes
<AnimatedNumber
  value={liveProjects}
  duration={500}
  className="transition-all"
/>
```

### Empty States
```typescript
// Provide guidance when no data
{projects.length === 0 ? (
  <EmptyState
    icon={<Rocket />}
    title="No projects yet"
    description="Be the first to launch a fair curve"
    action={<Button onClick={openDrawer}>Create Project</Button>}
  />
) : (
  <ProjectGrid projects={projects} />
)}
```

---

## Assumptions & Open Questions

**Assumptions:**
- Users have stable internet for real-time updates
- Existing `curves` collection has sufficient data for leaderboards
- Appwrite Realtime can handle 100+ concurrent subscriptions
- Redis not required initially (can use Appwrite caching)

**Open Questions:**
- Q: Should leaderboards update in real-time or daily batch?
  - **A:** Daily batch (reduce load), show "Updated 2h ago" timestamp
- Q: What defines "top" projects for spotlight? (TVL, trending score, manual curation?)
  - **A:** Start with TVL, add trending algorithm later
- Q: Do we need search immediately or can it be v2?
  - **A:** Include search (reuse from /discover logic)
- Q: Should [React] button work without wallet connected?
  - **A:** Yes, show login modal if not authenticated

---

## Follow-Up Tasks

**Immediate (This PR):**
- All execution plan steps 1-6
- Mobile responsive implementation
- Accessibility audit
- Performance optimization

**Future (Separate PRs):**
- [ ] Advanced filtering (by category, TVL range, date)
- [ ] Project detail modal (quick view without page navigation)
- [ ] Share functionality (Twitter, Discord embeds)
- [ ] Notifications (new projects, followed projects launched)
- [ ] Personalized spotlight (based on user interests)
- [ ] Leaderboard detail pages (click rank to see full profile)
- [ ] Analytics charts (TVL over time, launch success rate)
- [ ] Export leaderboard data (CSV download)

---

## User Wireframe Reference

**Provided Structure:**
```
┌────────────────────────────────────────────────┐
│ [🚀 ICMX Launch]  [Search...]  [+ Create]      │
├────────────────────────────────────────────────┤
│ [TVL: $2.3M] [Airdrops: $450K] [Motion: +12%] │
│ [Live Projects: 34]                            │
├────────────────────────────────────────────────┤
│ Spotlight (Top 3)                              │
│ ┌──────┐ ┌──────┐ ┌──────┐                    │
│ │ Logo │ │ Logo │ │ Logo │                    │
│ │ $100K│ │ $80K │ │ $50K │                    │
│ │[Buy] │ │[Buy] │ │[Buy] │                    │
│ │[Join]│ │[Join]│ │[Join]│                    │
│ │[React]│ │[React]│ │[React]│                  │
│ └──────┘ └──────┘ └──────┘                    │
├────────────────────────────────────────────────┤
│ Leaderboards                                   │
│ [Builders] [Investors] [Communities]           │
│ ┌──────────────────────────────────┐          │
│ │ #1 👤 Alice | 12 launches | $2M  │          │
│ │ #2 👤 Bob   | 8 launches  | $1.5M│          │
│ │ #3 👤 Carol | 6 launches  | $900K│          │
│ └──────────────────────────────────┘          │
├────────────────────────────────────────────────┤
│ Active Feed                                    │
│ [All] [Live] [Frozen] [Launched]              │
│ [Latest] [TVL] [Trending]                     │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐                  │
│ │    │ │    │ │    │ │    │                  │
│ └────┘ └────┘ └────┘ └────┘                  │
└────────────────────────────────────────────────┘
```

---

## TASKS (To be tracked during execution)

- [ ] **Step 1:** Database Preparation (60 min)
  - [ ] Create metrics service
  - [ ] Create leaderboard service
  - [ ] Create feed service
  - [ ] Add database indexes

- [ ] **Step 2:** Component Development (120 min)
  - [ ] LaunchHeader component
  - [ ] HeroMetrics component
  - [ ] MetricCard component
  - [ ] SpotlightCarousel component
  - [ ] LeaderboardTabs component
  - [ ] ProjectFeed component

- [ ] **Step 3:** Real-time Hooks (45 min)
  - [ ] useRealtimeMetrics hook
  - [ ] useLeaderboard hook
  - [ ] useProjectFeed hook

- [ ] **Step 4:** Page Integration (60 min)
  - [ ] Rewrite app/launch/page.tsx
  - [ ] Connect all components
  - [ ] Add loading/error states

- [ ] **Step 5:** Mobile & Accessibility (45 min)
  - [ ] Mobile responsive testing
  - [ ] Accessibility audit
  - [ ] Keyboard navigation

- [ ] **Step 6:** Performance & Testing (30 min)
  - [ ] Bundle size verification
  - [ ] Performance metrics
  - [ ] Load testing

---

**Prepared by:** Multi-Agent Team (UI/UX Designer, Frontend Developer, Backend Architect)
**Review Date:** 2025-10-22
**Status:** ⏳ **AWAITING APPROVAL**
**Next Step:** User approval → Execute implementation
