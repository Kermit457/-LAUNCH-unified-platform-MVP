# /launch Page - Production Readiness Assessment

**Date**: 2025-01-22
**Status**: Pre-Production Review
**Quality Target**: 9.2/10 (matching /clip page standard)
**Ship Confidence**: Target 85%+

---

## 🎯 Executive Summary

The `/launch` page is the **core platform experience** for ICM Motion's token launch platform. It serves as the primary entry point for creators, investors, and community members to interact with the bonding curve ecosystem.

**Current Implementation Status**:
- ✅ UI Components: 95% Complete
- ⚠️ Backend Wiring: 60% Complete (Mock data in use)
- ⚠️ Data Flow: 40% Complete (Appwrite integration partial)
- ❌ Production Data: 0% (All mock data)
- ⚠️ Error Handling: 50% (Basic patterns, needs enhancement)

---

## 📊 Page Architecture Overview

### Component Hierarchy
```
/app/launch/page.tsx (Main Container)
├── LaunchHeader (Search + Navigation)
├── TokenLaunchPreview (Pre Launch Form) ⚠️ NEW - Needs Backend
├── HeroMetrics (Platform Stats) ⚠️ Mock Data
├── SpotlightCarousel (Top 3 Projects) ⚠️ Mock Data
├── CommunityComposition (ICMX Network) ⚠️ Mock Data
├── LeaderboardTabs (5 Leaderboards) ⚠️ Mock Data
└── ProjectFeed (Activity Stream + CTAs) ⚠️ Mock Data
```

---

## 🔴 Critical Blockers (Must Fix Before Launch)

### 1. TokenLaunchPreview Backend Integration
**Priority**: 🔴 CRITICAL
**Component**: `/components/launch/TokenLaunchPreview.tsx`
**Current State**: Frontend-only, no backend connection

**Required Actions**:
- [ ] Create Appwrite collection: `prelaunch_tokens`
  - Schema: `{ image, name, symbol, description, socialLinks, referenceImages, referenceClips, referenceTweets, selectedTag, createdBy, createdAt, status }`
- [ ] Implement submission handler in `/lib/appwrite/services/prelaunch.ts`
- [ ] Add validation with Zod schema in `/lib/validations/prelaunch.ts`
- [ ] Wire up `onLaunch` callback in `/app/launch/page.tsx`
- [ ] Add success/error toast notifications
- [ ] Implement image upload to Appwrite Storage
- [ ] Add rate limiting (max 3 submissions per user per day)

**Files to Create/Modify**:
```typescript
// NEW: /lib/appwrite/services/prelaunch.ts
export async function submitPreLaunchToken(data: PreLaunchTokenData): Promise<string>
export async function getUserPreLaunchTokens(userId: string): Promise<PreLaunchToken[]>
export async function uploadTokenImage(file: File): Promise<string>

// NEW: /lib/validations/prelaunch.ts
export const preLaunchTokenSchema = z.object({...})

// MODIFY: /app/launch/page.tsx
const handlePreLaunchSubmit = async (data: TokenData) => {
  try {
    const result = await submitPreLaunchToken(data)
    success('Pre Launch Submitted!', 'Your token will be reviewed.')
  } catch (error) {
    showError('Submission Failed', error.message)
  }
}
```

**Estimated Time**: 4-6 hours
**Owner**: Backend Team

---

### 2. Real Data Integration - All Sections
**Priority**: 🔴 CRITICAL
**Current State**: 100% mock data across all components

#### 2.1 HeroMetrics (Platform Statistics)
**File**: `/components/launch/HeroMetrics.tsx`
**Mock Data Location**: Line 65-98

**Required Backend**:
```typescript
// /lib/appwrite/services/metrics.ts - ALREADY EXISTS but needs:
- Real Vault TVL calculation from on-chain data
- Real 24h Motion calculation (price changes)
- Real Live Projects count from database
- Real Trading Volume from transaction history
- Real Clip Views aggregation
```

**Database Queries Needed**:
```sql
-- Vault TVL: Sum all SOL locked in bonding curves
SELECT SUM(tvl) FROM projects WHERE status = 'live'

-- 24h Motion: Average price change across all tokens
SELECT AVG(price_change_24h) FROM token_prices WHERE timestamp > NOW() - INTERVAL '24 hours'

-- Live Projects: Active token launches
SELECT COUNT(*) FROM projects WHERE status = 'live'

-- Trading Volume: 24h transaction volume
SELECT SUM(amount_sol) FROM transactions WHERE created_at > NOW() - INTERVAL '24 hours'

-- Clip Views: Aggregate from clips table
SELECT SUM(view_count) FROM clips
```

**Action Items**:
- [ ] Implement `calculateVaultTVL()` with on-chain query
- [ ] Implement `calculate24hMotion()` with historical price data
- [ ] Create Appwrite function for aggregated stats (runs every 5 min)
- [ ] Add caching layer (Redis or Appwrite Cache)
- [ ] Remove mock data from `useLaunchData` hook

**Estimated Time**: 6-8 hours
**Owner**: Backend + Blockchain Team

---

#### 2.2 SpotlightCarousel (Top 3 Featured Projects)
**File**: `/components/launch/SpotlightCarousel.tsx`
**Mock Data**: `useLaunchData` hook returns hardcoded projects

**Required Backend**:
```typescript
// /lib/appwrite/services/spotlight.ts
export async function getSpotlightProjects(): Promise<SpotlightProject[]> {
  // Query top 3 projects by Motion Score
  // Motion Score = weighted algorithm:
  // - 40% Trading Volume (24h)
  // - 30% Holder Growth (24h)
  // - 20% Clip Engagement (views + CTR)
  // - 10% Community Activity (votes, comments)
}
```

**Database Schema Needed**:
```typescript
// Ensure projects collection has:
interface Project {
  id: string
  title: string
  description: string
  logoUrl: string
  status: 'live' | 'frozen' | 'graduated'
  currentPrice: number
  tvl: number
  tvlChange24h: number
  holders: number
  motionScore: number // Calculate server-side
  clipCount: number
  clipViews: number
  clipCTR: number
}
```

**Action Items**:
- [ ] Create `calculateMotionScore()` function
- [ ] Set up Appwrite function to recalculate scores every 15 minutes
- [ ] Add real-time price feed integration
- [ ] Implement holder count tracking from on-chain events
- [ ] Wire up real clip stats from clips collection

**Estimated Time**: 8-10 hours
**Owner**: Backend Team

---

#### 2.3 CommunityComposition (ICMX Network)
**File**: `/components/launch/CommunityComposition.tsx`
**Mock Data**: `getMockCommunityStats()` in `/lib/appwrite/services/community.ts`

**Required Backend**:
```typescript
// /lib/appwrite/services/community.ts
export async function getRealCommunityStats(): Promise<CommunityStats> {
  // Aggregate user roles from users collection
  // Roles: traders, believers, builders, degens, contributors,
  //        developers, founders, cultists, etc.
}
```

**User Schema Enhancement**:
```typescript
// Add to users collection:
interface User {
  id: string
  roles: Array<'trader' | 'believer' | 'builder' | 'degen' | ...>
  // Role assignment logic:
  // - Trader: Has made 10+ trades
  // - Believer: Holds keys for 30+ days
  // - Builder: Has submitted project
  // - Degen: High-frequency trader (100+ trades)
  // - Contributor: Has created 5+ clips
  // - Developer: Has verified GitHub
}
```

**Action Items**:
- [ ] Define role assignment logic and thresholds
- [ ] Create background job to assign/update user roles daily
- [ ] Implement `calculateUserRole()` function
- [ ] Add role badges to user profiles
- [ ] Create admin panel to manually assign special roles (Founder, Curator)

**Estimated Time**: 4-6 hours
**Owner**: Backend Team

---

#### 2.4 LeaderboardTabs (5 Leaderboards)
**File**: `/components/launch/LeaderboardTabs.tsx`
**Mock Data**: All 5 leaderboards use hardcoded data

**Required Backend - Per Leaderboard**:

**A. Builders Leaderboard**
```typescript
export async function getBuildersLeaderboard(): Promise<LeaderboardEntry[]> {
  // Rank by: Total TVL of launched projects
  // Also track: Project count, average holder count, success rate
}
```

**B. Investors Leaderboard**
```typescript
export async function getInvestorsLeaderboard(): Promise<LeaderboardEntry[]> {
  // Rank by: Portfolio value (realized + unrealized gains)
  // Track: Total invested, ROI, win rate, hold time
}
```

**C. Communities Leaderboard**
```typescript
export async function getCommunitiesLeaderboard(): Promise<LeaderboardEntry[]> {
  // Rank by: Combined holder count across projects
  // Track: Engagement rate, retention, growth rate
}
```

**D. Clippers Leaderboard**
```typescript
export async function getClippersLeaderboard(): Promise<LeaderboardEntry[]> {
  // Rank by: Total views + weighted CTR
  // Track: Clip count, average CTR, total impressions
}
```

**E. Traders Leaderboard**
```typescript
export async function getTradersLeaderboard(): Promise<LeaderboardEntry[]> {
  // Rank by: Trading volume + win rate
  // Track: Trade count, avg profit per trade, streak
}
```

**Action Items**:
- [ ] Create 5 separate Appwrite functions for each leaderboard
- [ ] Implement ranking algorithms with proper weighting
- [ ] Add caching (update every 10 minutes)
- [ ] Create `leaderboard_history` collection for trends
- [ ] Add real-time rank change indicators (+2, -5, etc.)

**Estimated Time**: 12-16 hours
**Owner**: Backend Team

---

#### 2.5 ProjectFeed Activity Stream
**File**: `/components/launch/ProjectFeed.tsx`
**Mock Data**: `mockActivities` array (lines 23-126)

**Required Backend**:
```typescript
// /lib/appwrite/services/activity.ts
export async function getRealtimeActivity(limit: number = 50): Promise<Activity[]> {
  // Subscribe to real-time events:
  // - Token purchases (buy events)
  // - New launches
  // - Milestone achievements (graduation)
  // - Clip uploads
  // - Upvotes
}
```

**Database Design**:
```typescript
// NEW Collection: activities
interface Activity {
  id: string
  type: 'buy' | 'launch' | 'vote' | 'comment' | 'milestone' | 'clip'
  userId: string
  projectId: string
  amount?: number // For buy events
  value?: number // USD value for ranking
  metadata: Record<string, any>
  createdAt: string
}
```

**Real-Time Implementation**:
- [ ] Set up Appwrite Realtime subscription
- [ ] Create activity logger middleware
- [ ] Log all platform events to `activities` collection
- [ ] Implement activity filtering (high-value actions first)
- [ ] Add pagination for infinite scroll
- [ ] Calculate USD values using real-time price oracle

**Estimated Time**: 6-8 hours
**Owner**: Backend Team

---

## ⚠️ High Priority Issues

### 3. CTA Button Wiring
**Priority**: 🟠 HIGH
**Issue**: Multiple buttons have no backend actions

**Buttons Needing Backend**:

#### 3.1 Spotlight "Buy Keys" Button
**Location**: `/components/launch/SpotlightCarousel.tsx:183`
```typescript
<Link href={`/curve/${project.id}`}>Buy Keys</Link>
```
**Status**: ✅ Routes correctly to curve page (assumed working)
**Verification Needed**: Confirm `/curve/[id]` page exists and handles purchases

#### 3.2 Spotlight "Collaborate" Button
**Location**: Line 188
```typescript
<button className="...">Collaborate</button>
```
**Status**: ❌ No action
**Required**:
- [ ] Define collaboration flow (DM? Form? Discord?)
- [ ] Add `onClick` handler
- [ ] Route to `/collaborate/${projectId}` or open modal

#### 3.3 Spotlight "Details" Button
**Location**: Line 192
```typescript
<Link href={`/launch/${project.id}`}>Details</Link>
```
**Status**: ⚠️ Route exists but needs project detail page
**Required**:
- [ ] Create `/app/launch/[id]/page.tsx` (Project Detail Page)
- [ ] Show full project info, charts, holder list, activity
- [ ] Add buy/sell interface

#### 3.4 Partnership CTA Buttons
**Location**: `/components/launch/ProjectFeed.tsx`
- "Apply Now" (Incubator) - Line 309
- "Partner With Us" - Line 339
- "Apply as Curator" - Line 369

**Current**: All mailto links to `partnerships@icmmotion.com`
**Status**: ✅ Functional but consider enhancement
**Potential Improvements**:
- [ ] Create `/apply/incubator` form page
- [ ] Create `/apply/partner` form page
- [ ] Create `/apply/curator` form page
- [ ] Store applications in Appwrite `applications` collection
- [ ] Add email notification to team on submission

**Estimated Time**: 8-10 hours
**Owner**: Full-Stack Team

---

### 4. Error Handling & Loading States
**Priority**: 🟠 HIGH
**Current State**: Basic error handling, inconsistent patterns

**Issues**:
1. **No global error boundary** for page-level failures
2. **Inconsistent loading skeletons** across sections
3. **No retry logic** for failed requests
4. **No offline detection** (PWA requirement)

**Required**:
```typescript
// /app/launch/error.tsx
'use client'
export default function LaunchError({ error, reset }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <button onClick={reset} className="btn-primary">Try Again</button>
    </div>
  )
}

// /app/launch/loading.tsx
export default function LaunchLoading() {
  return <LaunchPageSkeleton />
}

// Enhanced error handling in page.tsx
const { data, error, isLoading, refetch } = useLaunchData()

useEffect(() => {
  if (error && !navigator.onLine) {
    showError('Offline', 'Please check your internet connection')
  }
}, [error])
```

**Action Items**:
- [ ] Create `error.tsx` and `loading.tsx` route files
- [ ] Implement exponential backoff retry logic
- [ ] Add offline detection with user notification
- [ ] Standardize skeleton components across all sections
- [ ] Add error telemetry (track failed requests)

**Estimated Time**: 4-5 hours
**Owner**: Frontend Team

---

### 5. Performance Optimization
**Priority**: 🟠 HIGH
**Target**: LCP ≤2.5s, INP ≤200ms

**Current Issues**:
1. **No code splitting** - All components load at once
2. **No image optimization** - Token logos not using Next/Image
3. **No data prefetching** - Could use React Query prefetch
4. **Heavy re-renders** - Consider React.memo for expensive components

**Optimizations**:
```typescript
// 1. Lazy load below-fold components
const LeaderboardTabs = dynamic(() => import('@/components/launch/LeaderboardTabs'), {
  loading: () => <LeaderboardSkeleton />
})

const ProjectFeed = dynamic(() => import('@/components/launch/ProjectFeed'))

// 2. Use Next/Image for logos
import Image from 'next/image'
<Image
  src={project.logoUrl}
  alt={project.title}
  width={56}
  height={56}
  className="rounded-xl"
/>

// 3. Memoize expensive calculations
const topProjects = useMemo(() =>
  calculateMotionScores(projects),
  [projects]
)

// 4. Add React Query for data caching
const { data: metrics } = useQuery({
  queryKey: ['platform-metrics'],
  queryFn: fetchMetrics,
  staleTime: 5 * 60 * 1000, // 5 min cache
  refetchInterval: 5 * 60 * 1000
})
```

**Action Items**:
- [ ] Implement dynamic imports for heavy components
- [ ] Replace all `<img>` with Next/Image
- [ ] Set up React Query with proper caching
- [ ] Add performance monitoring (Web Vitals)
- [ ] Run Lighthouse audit and fix issues

**Estimated Time**: 6-8 hours
**Owner**: Performance Team

---

## 🟡 Medium Priority Improvements

### 6. Search Functionality Enhancement
**Location**: `/components/launch/LaunchHeader.tsx`
**Current**: Basic client-side filtering

**Enhancements**:
- [ ] Add debouncing (300ms delay)
- [ ] Implement fuzzy search (Fuse.js)
- [ ] Add search history (localStorage)
- [ ] Add search suggestions dropdown
- [ ] Track search queries for analytics

**Estimated Time**: 3-4 hours

---

### 7. Mobile Responsiveness Polish
**Current**: Basic responsive design in place

**Issues to Fix**:
- [ ] SpotlightCarousel mobile swipe gestures
- [ ] CommunityComposition horizontal scroll UX
- [ ] LeaderboardTabs mobile layout (tabs overflow)
- [ ] ProjectFeed activity cards on small screens
- [ ] Pre Launch form mobile keyboard handling

**Estimated Time**: 4-6 hours

---

### 8. Accessibility (A11y) Compliance
**Target**: WCAG 2.1 AA Level

**Current Issues**:
- [ ] Missing ARIA labels on interactive elements
- [ ] Insufficient color contrast (some zinc-500 text)
- [ ] No keyboard navigation for carousel
- [ ] Missing focus indicators on custom buttons
- [ ] Screen reader announcements for real-time updates

**Estimated Time**: 3-4 hours

---

## 🟢 Nice-to-Have Features

### 9. Advanced Features (Post-MVP)
- [ ] Project comparison tool (compare 2-3 tokens side by side)
- [ ] Price alerts (notify on target price)
- [ ] Portfolio tracker (track user holdings)
- [ ] Customizable dashboard (drag-drop widgets)
- [ ] Dark/Light theme toggle
- [ ] Multi-language support (i18n)

---

## 📋 Production Checklist

### Backend Infrastructure
- [ ] All Appwrite collections created with proper indexes
- [ ] Appwrite Functions deployed for aggregations
- [ ] Real-time subscriptions configured
- [ ] Rate limiting implemented (avoid spam)
- [ ] API error responses standardized
- [ ] Database backups configured
- [ ] Monitoring/alerting set up (Sentry, Datadog)

### Frontend Polish
- [ ] All mock data replaced with real API calls
- [ ] Loading states consistent across all sections
- [ ] Error handling complete with user-friendly messages
- [ ] All buttons have actions (no dead clicks)
- [ ] Images optimized (WebP format, lazy loading)
- [ ] TypeScript compilation clean (`tsc --noEmit`)
- [ ] ESLint warnings resolved

### Testing
- [ ] Unit tests for business logic (helpers, calculations)
- [ ] Integration tests for data fetching hooks
- [ ] E2E tests for critical flows (Pre Launch submission)
- [ ] Manual QA on 5 devices (Desktop, Tablet, Mobile)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Lighthouse audit score ≥90

### Security
- [ ] Input validation on all forms (Zod schemas)
- [ ] SQL injection prevention (Appwrite handles this)
- [ ] XSS prevention (React handles this, but verify)
- [ ] CSRF protection on mutations
- [ ] Rate limiting on submissions (3/day per user)
- [ ] Image upload size limits (max 5MB)
- [ ] Content Security Policy (CSP) headers

### Analytics & Monitoring
- [ ] Page view tracking (Google Analytics / Plausible)
- [ ] Event tracking (button clicks, form submissions)
- [ ] Error tracking (Sentry integration)
- [ ] Performance monitoring (Web Vitals)
- [ ] User journey funnels (conversion tracking)

### Documentation
- [ ] API documentation for backend endpoints
- [ ] Component documentation (Storybook?)
- [ ] Deployment runbook
- [ ] Incident response plan
- [ ] User guide / FAQ

---

## 🚀 Deployment Plan

### Phase 1: Data Migration (Week 1)
**Owner**: Backend Team
**Duration**: 3-5 days

1. Create all Appwrite collections
2. Migrate existing mock data structure to real schema
3. Set up Appwrite Functions for aggregations
4. Test data flow in staging environment

### Phase 2: Component Wiring (Week 1-2)
**Owner**: Full-Stack Team
**Duration**: 5-7 days

1. Wire up TokenLaunchPreview submission
2. Replace mock data in HeroMetrics
3. Implement real Spotlight ranking
4. Connect leaderboards to backend
5. Implement real-time activity stream

### Phase 3: CTA & UX Polish (Week 2)
**Owner**: Frontend Team
**Duration**: 3-4 days

1. Wire all CTA buttons
2. Add error handling & loading states
3. Performance optimizations
4. Mobile responsiveness fixes
5. Accessibility improvements

### Phase 4: Testing & QA (Week 2-3)
**Owner**: QA Team
**Duration**: 3-5 days

1. Comprehensive testing across devices
2. Load testing (simulate 1000 concurrent users)
3. Security audit
4. Fix critical bugs
5. Final Lighthouse audit

### Phase 5: Staged Rollout (Week 3)
**Owner**: DevOps + Product
**Duration**: 2-3 days

1. Deploy to staging with real data
2. Internal team testing (dogfooding)
3. Beta release to 10% of users
4. Monitor metrics and errors
5. Full production release if metrics good

---

## 📊 Success Metrics (Post-Launch)

### Performance Targets
- **Page Load Time**: ≤2.0s (p95)
- **Time to Interactive**: ≤3.5s
- **First Contentful Paint**: ≤1.8s
- **Largest Contentful Paint**: ≤2.5s
- **Cumulative Layout Shift**: ≤0.1
- **Lighthouse Score**: ≥90

### Engagement Targets (Week 1)
- **Pre Launch Submissions**: 100+ tokens
- **Active Users**: 500+ daily
- **Clip Submissions**: 50+ per day
- **Trading Volume**: $100K+ daily
- **User Retention (D7)**: ≥40%

### Error Rate Targets
- **API Error Rate**: ≤0.5%
- **JavaScript Errors**: ≤0.1% of page views
- **Failed Transactions**: ≤1%

---

## 💰 Estimated Total Development Time

| Task Category | Hours | Team |
|---------------|-------|------|
| Pre Launch Backend | 4-6h | Backend |
| Real Data Integration | 36-48h | Backend + Blockchain |
| CTA Button Wiring | 8-10h | Full-Stack |
| Error Handling | 4-5h | Frontend |
| Performance Optimization | 6-8h | Frontend |
| Mobile/A11y Polish | 7-10h | Frontend |
| Testing & QA | 16-24h | QA |
| **Total** | **81-111 hours** | **3-4 devs** |

**Estimated Calendar Time**: 2-3 weeks (with parallel workstreams)

---

## 🎯 Recommendation

**Ship Strategy**: Staged Rollout with Feature Flags

1. **Week 1**: Backend data migration + basic wiring
2. **Week 2**: CTA buttons + performance + polish
3. **Week 3**: Testing + staged rollout (10% → 50% → 100%)

**Blockers to Address First**:
1. TokenLaunchPreview backend (blocks creator flow)
2. Real Spotlight data (blocks discovery)
3. Activity stream real-time (blocks engagement)

**Quality Gate**: Don't ship until:
- ✅ All mock data replaced
- ✅ All CTAs functional
- ✅ Lighthouse score ≥85
- ✅ Zero critical bugs
- ✅ Error rate ≤1% in staging

---

## 📝 Final Notes

The `/launch` page is **85% feature complete** but only **40% production-ready** due to extensive mock data usage. The UI is polished and the UX is solid, but backend integration is the critical path.

**Biggest Risks**:
1. Real-time data performance at scale
2. Appwrite query costs with complex aggregations
3. On-chain data sync reliability

**Mitigation**:
- Implement aggressive caching (5-15 min TTL)
- Use Appwrite Functions for expensive queries
- Add fallback mechanisms for on-chain data failures

**Confidence Level**: 7/10 → Can reach 9/10 with 2-3 weeks of focused work

---

**Prepared By**: Claude (AI Assistant)
**For**: Mirko Basil Dölger & ICM Motion Team
**Next Steps**: Review with team, prioritize tasks, assign owners, start Week 1 sprint
