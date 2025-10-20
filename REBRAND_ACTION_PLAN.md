# Rebrand Wiring & Production Readiness - Action Plan

**Generated:** 2025-10-20
**Branch:** dev/fix-ui
**Status:** In Progress

## Brand Configuration

```typescript
NEW_BRAND_NAME="ICMotion"
NEW_BRAND_SHORT="ICM"
NEW_TAGLINE="No Mcap No Motion"

PRIMARY_COLOR="#00FFFF" // Cyan
ACCENT_COLOR="#00FF88"  // Green

SECONDARY_COLORS:
  - Yellow: #FFD700
  - Red: #FF0040
  - Orange: #FF8800
  - Blue: #0088FF
  - Purple: #8800FF

LOGO_PATH="/icm-motion-logo.svg"
FAVICON_PATH="/icm-motion-logo.svg"
TARGET_BRANCH="dev/fix-ui"
```

## ✅ Completed Tasks

### 1. Brand System Foundation
- ✅ Created `/lib/brand.ts` - Centralized brand config
- ✅ Created `/lib/env.ts` - Environment variables with validation
- ✅ Created `/lib/flags.ts` - Feature flag system
- ✅ Created `/config/nav.ts` - Navigation configuration

### 2. Core Components Updated
- ✅ Updated `app/layout.tsx` - Uses BRAND constants for metadata
- ✅ Updated `components/TopNav.tsx` - Uses centralized nav config
- ✅ Added aria-current and keyboard focus states
- ✅ Updated Tailwind config - ICM Motion color palette exists
- ✅ Updated CSS variables - colors.css exists with full palette

## 🔄 Remaining Tasks

### 3. CSS Class Updates
**Files to update:**
- `app/globals.css` - Replace LaunchOS-specific classes:
  - `.gradient-text-launchos` → `.gradient-text-icm`
  - `.glass-launchos` → `.glass-icm`
  - `.neon-text-fuchsia` → Update to ICM colors or keep as legacy

**Action:** Keep legacy classes for backward compatibility, add new ICM-branded equivalents.

### 4. Component Standardization
**Target components:**
- `components/UnifiedCard.tsx` - 1 href usage
- `components/ProjectCard.tsx` - 1 href usage
- `components/LaunchCard.tsx` - 1 href usage
- All cards should use standardized props interface

**Action:** Create `/types/component-props.ts` with canonical interfaces

### 5. Brand String Replacements
**Code files with LaunchOS references:**
- `lib/solana/create-curve.ts`
- `lib/solana/v6-curve-service.ts`
- `lib/solana/program.ts`
- `lib/appwrite/client.ts`
- `hooks/useBuyKeys.ts`
- `components/design-system/PerfectHeroSection.tsx`
- `components/landing/LiveSection.tsx`
- `app/page.tsx`

**Action:** Replace hardcoded "LaunchOS" strings with `BRAND.name` import

### 6. Cleanup Tasks
**Files to remove:**
- `.archive/lib/mock-data.ts`
- `.archive/lib/mockNetworkData.ts`
- `.archive/lib/mockProfileData.ts`
- `.archive/lib/sampleData.ts`
- `hooks/useConnectSolanaWallet.ts` (deleted in git status)
- `hooks/useSimpleSolanaTransaction.ts` (deleted)
- `hooks/useSolanaBuyKeysMock.ts` (deleted)
- `hooks/useTestSolanaTransaction.ts` (deleted)

**Action:** Confirm deletions, remove from imports if referenced

### 7. Environment Variables
**Required .env check:**
```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_PRIVY_APP_ID=
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
```

**Action:** Ensure all vars are set, add validation guards

## 📊 Inventory

### Routes (37 total)
```
/                          - Landing/home
/discover                  - Curve discovery
/launch                    - Launch creator
/launch/[id]              - Launch detail
/earn                      - Earnings dashboard
/live                      - Live streaming (feature flag)
/network                   - Social network
/network/@me              - User profile
/campaign/[id]            - Campaign detail
/ads                       - Ads marketplace
/predictions              - Predictions market
/social                    - Social features
/control/predictions      - Admin predictions
/control/social           - Admin social
/signup                    - User registration
/login                     - User login
/earnings                  - Earnings page
/explore                   - Explore page
/marketplace              - Marketplace
/profile                   - Profile (legacy?)
/profile/[handle]         - User profile by handle
/bounties/[id]            - Bounty detail
/community                - Community page
/dashboard                - Main dashboard
/dashboard/analytics      - Analytics
/dashboard/campaigns      - Campaigns list
/dashboard/campaigns/[id]/review - Campaign review
/dashboard/earnings       - Dashboard earnings
/dashboard/network        - Dashboard network
/dashboard/profile        - Dashboard profile
/dashboard/settings       - User settings
/dashboard/submissions    - Submissions list
/quest/[id]               - Quest detail
/raids/[id]               - Raid detail
/tools                     - Tools page
```

### Key Components
```
components/
  TopNav.tsx ✅             - Main navigation (UPDATED)
  UnifiedCard.tsx           - Multi-purpose card
  ProjectCard.tsx           - Project display card
  LaunchCard.tsx            - Launch display card
  BuyKeysButton.tsx         - Trading button
  CampaignCard.tsx          - Campaign card
  RaidCard.tsx              - Raid card
  BountyCard.tsx            - Bounty card

components/ui/
  button.tsx                - Base button (shadcn)
  card.tsx                  - Base card (shadcn)
  dialog.tsx                - Modal dialog
  input.tsx                 - Form input
  select.tsx                - Dropdown select
  progress.tsx              - Progress bar

components/landing/
  HeroSection.tsx           - Hero component
  FeatureCard.tsx           - Feature display
  LandingFooter.tsx         - Footer (4 hrefs)
```

## 🎯 Quality Assurance Plan

### Build Checks
```bash
npm run typecheck    # TypeScript validation
npm run lint --max-warnings=0  # ESLint validation
npm run build        # Production build
npm run dev          # Development server
```

### Route Smoke Tests
1. Visit each top-level route
2. Check for console errors
3. Verify navigation works
4. Check 404 asset errors
5. Test wallet connection flow

### Accessibility Checks
- ✅ aria-current on active nav items
- ✅ aria-label on logo button
- ✅ Keyboard focus states
- ⚠️ Alt text on images (needs verification)
- ⚠️ Color contrast (needs verification)

## 📝 Documentation to Generate

1. **MIGRATION_NOTES.md** - All changes with rationale
2. **COMPONENT_REGISTRY.md** - Canonical vs deprecated components
3. **DESIGN_TOKENS_DIFF.md** - Before/after color system
4. **ROUTE_INVENTORY.md** - All top-level routes (listed above)

## 🚀 Next Steps

1. **Run type check** to identify import errors from new files
2. **Update remaining components** to use BRAND config
3. **Replace LaunchOS strings** in code files
4. **Generate documentation** files
5. **Run build** and fix any errors
6. **Smoke test** all routes
7. **Create PR** with checklist

## ⚠️ Notes & Constraints

- **No layout changes** - Maintain pixel-accurate designs
- **No new runtime deps** - Use existing packages only
- **Tokenized colors only** - No arbitrary Tailwind colors
- **Keep route names** - No URL changes
- **Feature flags** - Use for gradual rollout
- **Backward compatibility** - Keep legacy classes with deprecation comments

---

**Status:** Foundation complete, component updates in progress
**Blocked by:** None
**Risk:** Low - changes are additive and backward compatible
