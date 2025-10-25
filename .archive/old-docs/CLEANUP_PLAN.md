# Cleanup Plan - Remove Orphaned Features

**Generated:** 2025-10-20
**Purpose:** Remove unused routes, components, and features not linked from main navigation

---

## Executive Summary

**Routes to Delete:** 10+ orphaned pages
**Components to Remove:** Quests, Boosts, Bounties, Raids (not in main nav)
**Estimated Cleanup:** 2-3 hours
**Risk:** Low (these are orphaned, not referenced)

---

## Main Navigation (KEEP - Core Features)

From `config/nav.ts`:
- ✅ `/discover` - Curve discovery & marketplace
- ✅ `/launch` - Launch creator/list
- ✅ `/earn` - Earnings dashboard
- ✅ `/live` - Live streaming
- ✅ `/network` - Social network

---

## Routes to DELETE (Orphaned)

### 1. Duplicate/Redundant Routes

#### `/explore` → DELETE
**Reason:** Redirects to `/discover` (redundant)
```bash
rm -rf app/explore/
```

#### `/earnings` → DELETE
**Reason:** Duplicate of `/earn` (which IS in main nav)
```bash
rm -rf app/earnings/
```

#### `/profile` (root) → DELETE
**Reason:** Use `/profile/[handle]` instead, or `/network/@me` for current user
```bash
rm app/profile/page.tsx
```

---

### 2. Demo/Widget Pages (Abandoned)

#### `/ads` → DELETE
**Reason:** Not in main nav, appears to be abandoned widget demo
```bash
rm -rf app/ads/
rm components/widgets/AdsWidgetDemo.tsx
```

#### `/predictions` → DELETE
**Reason:** Not in main nav, separate from `/control/predictions` (admin)
```bash
rm -rf app/predictions/
rm components/PredictionWidget.tsx
rm components/widgets/PredictionWidgetDemo.tsx
```

#### `/social` → DELETE
**Reason:** Not in main nav, separate from `/control/social` (admin)
```bash
rm -rf app/social/
rm components/SocialWidget.tsx
rm components/widgets/SocialWidgetDemo.tsx
```

#### `/marketplace` → DELETE
**Reason:** Not in main nav, no references
```bash
rm -rf app/marketplace/
```

---

### 3. Auth Pages (Privy Handles This)

#### `/login` → DELETE
**Reason:** Privy handles auth via TopNav "Connect Wallet"
```bash
rm -rf app/login/
```

#### `/signup` → DELETE
**Reason:** Privy handles signup
```bash
rm -rf app/signup/
```

---

### 4. Quest/Bounty/Raid System (Not in Main Nav)

#### `/quest/[id]` → DELETE
**Reason:** Redirect stub, quests not in main navigation
```bash
rm -rf app/quest/
rm -rf components/quests/
rm lib/appwrite/services/quests.ts
```

#### `/bounties/[id]` → DELETE
**Reason:** Bounties not in main navigation
```bash
rm -rf app/bounties/
rm components/BountyCard.tsx
rm components/modals/CreateBountyModal.tsx
rm components/design-test/BountyCard.tsx
```

#### `/raids/[id]` → DELETE
**Reason:** Raids not in main navigation
```bash
rm -rf app/raids/
rm components/RaidCard.tsx
```

---

### 5. Tool Pages (Orphaned)

#### `/tools` → DELETE OR REPURPOSE
**Reason:** Not in main nav, but has full implementation
**Decision:** DELETE (not core feature)
```bash
rm -rf app/tools/
```

#### `/community` → DELETE OR REPURPOSE
**Reason:** Not in main nav
**Decision:** DELETE (use `/network` instead)
```bash
rm -rf app/community/
```

#### `/engage` → DELETE
**Reason:** Not in main nav, redirect hub
```bash
rm -rf app/engage/
```

---

### 6. Other Orphaned Pages

#### `/home-page.tsx` → DELETE
**Reason:** Not used, `/` or `/discover` is the homepage
```bash
rm app/home-page.tsx
```

#### `/landing` → EVALUATE
**Reason:** Full landing page, but is it the homepage?
**Decision:** KEEP if it's the marketing homepage, DELETE if redundant
```bash
# Decision needed: Is this the public homepage?
# If yes: KEEP
# If no: rm -rf app/landing/
```

#### `/network/page-new.tsx` → DELETE
**Reason:** Old version, use `/network/page.tsx`
```bash
rm app/network/page-new.tsx
```

---

## Components to DELETE

### Quest-Related
```bash
rm -rf components/quests/
rm components/quests/CreateQuestDrawer.tsx
rm components/quests/PreviewCard.tsx
```

### Bounty-Related
```bash
rm components/BountyCard.tsx
rm components/modals/CreateBountyModal.tsx
rm components/design-test/BountyCard.tsx
```

### Raid-Related
```bash
rm components/RaidCard.tsx
```

### Boost-Related
```bash
rm components/BoostButton.tsx
```

### Widget Demos
```bash
rm components/widgets/AdsWidgetDemo.tsx
rm components/widgets/PredictionWidgetDemo.tsx
rm components/widgets/SocialWidgetDemo.tsx
rm components/PredictionWidget.tsx
rm components/SocialWidget.tsx
```

### Design Test Components (if not used)
```bash
rm -rf components/design-test/
```

---

## Appwrite Services to DELETE

### Quests Service
```bash
rm lib/appwrite/services/quests.ts
```

### Submissions Service (if only used for quests/campaigns)
```bash
# EVALUATE: Check if campaigns use this
# If campaigns are gone too: rm lib/appwrite/services/submissions.ts
```

---

## Broken TopNav Links to FIX

### `/wallet` - Referenced but doesn't exist
**Options:**
1. Create the page: `app/wallet/page.tsx`
2. Remove from TopNav menu
3. Redirect to `/discover?view=my-holdings`

**Recommendation:** Option 3 (redirect)
```typescript
// In TopNav.tsx MenuItem for "Wallet"
onClick={() => router.push('/discover?view=my-holdings')}
```

### `/settings` - Referenced but doesn't exist
**Options:**
1. Create the page: `app/settings/page.tsx`
2. Remove from TopNav menu
3. Redirect to `/dashboard/settings`

**Recommendation:** Option 3 (redirect)
```typescript
// In TopNav.tsx MenuItem for "Settings"
onClick={() => router.push('/dashboard/settings')}
```

---

## Cleanup Script

```bash
#!/bin/bash
# cleanup-orphaned-routes.sh

echo "🧹 Cleaning up orphaned routes and components..."

# Delete orphaned routes
rm -rf app/explore/
rm -rf app/earnings/
rm -rf app/ads/
rm -rf app/predictions/
rm -rf app/social/
rm -rf app/marketplace/
rm -rf app/login/
rm -rf app/signup/
rm -rf app/quest/
rm -rf app/bounties/
rm -rf app/raids/
rm -rf app/tools/
rm -rf app/community/
rm -rf app/engage/
rm app/profile/page.tsx
rm app/home-page.tsx
rm app/network/page-new.tsx

# Delete orphaned components
rm -rf components/quests/
rm -rf components/widgets/
rm -rf components/design-test/
rm components/BountyCard.tsx
rm components/RaidCard.tsx
rm components/BoostButton.tsx
rm components/PredictionWidget.tsx
rm components/SocialWidget.tsx
rm components/modals/CreateBountyModal.tsx

# Delete orphaned services
rm lib/appwrite/services/quests.ts

echo "✅ Cleanup complete!"
echo "📊 Removed: ~15 routes, ~20 components, 1 service"
echo "⚠️ Next: Fix TopNav links and update documentation"
```

---

## Updated Main Navigation

### After Cleanup - Core Features Only

**Public Routes:**
- `/` - Landing/homepage
- `/discover` - Curve discovery & trading
- `/launch` - Launch creator
- `/launch/[id]` - Launch detail
- `/earn` - Earnings dashboard
- `/live` - Live streaming
- `/network` - Social network
- `/network/@me` - Current user profile
- `/profile/[handle]` - User profiles
- `/campaign/[id]` - Campaign detail (if keeping campaigns)

**Dashboard Routes (Auth Required):**
- `/dashboard` - Main dashboard
- `/dashboard/analytics` - Analytics
- `/dashboard/campaigns` - Campaign management
- `/dashboard/earnings` - Earnings tracking
- `/dashboard/network` - Network management
- `/dashboard/profile` - Profile settings
- `/dashboard/settings` - User settings
- `/dashboard/submissions` - Submission reviews

**Admin Routes:**
- `/control/predictions` - Admin predictions
- `/control/social` - Admin social

**Total Routes After Cleanup:** ~20 (down from 37)

---

## Impact Analysis

### Before Cleanup
- **Total Routes:** 37
- **Main Nav Items:** 5
- **Orphaned Routes:** 15+
- **Unused Components:** 20+

### After Cleanup
- **Total Routes:** ~20
- **Main Nav Items:** 5
- **Orphaned Routes:** 0
- **Unused Components:** 0

### Benefits
✅ **Cleaner codebase** - No dead code
✅ **Faster builds** - Less files to compile
✅ **Less confusion** - Clear app structure
✅ **Easier maintenance** - Only maintain what's used
✅ **Better focus** - Core features only

### Risks
⚠️ **Very Low** - Routes are orphaned, not linked
⚠️ **Mitigation** - Git history preserves everything
⚠️ **Rollback** - Can restore from git if needed

---

## Post-Cleanup Actions

### 1. Update Documentation
```bash
# Update route inventory
# Remove deleted routes from ROUTE_INVENTORY.md

# Update button audit
# Remove quest/boost/bounty buttons from BUTTON_AUDIT.md

# Update implementation plan
# Focus only on: VoteButton, SubmitLaunchDrawer, InvitesPanel, Comments
```

### 2. Fix TopNav Links
```typescript
// components/TopNav.tsx
// Update MenuItem for "Wallet" and "Settings"

<MenuItem
  icon={Wallet}
  label="Wallet"
  badge={address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Not connected'}
  onClick={() => {
    router.push('/discover?view=my-holdings') // CHANGED
    setAvatarMenuOpen(false)
  }}
/>

<MenuItem
  icon={Settings}
  label="Settings"
  onClick={() => {
    router.push('/dashboard/settings') // CHANGED
    setAvatarMenuOpen(false)
  }}
/>
```

### 3. Update TypeScript Imports
```bash
# Run typecheck to find broken imports
npm run typecheck

# Fix any imports referencing deleted files
# Should be minimal since routes were orphaned
```

### 4. Update Tests (if any)
```bash
# Remove tests for deleted components
# Update navigation tests
```

---

## Decision Points

### 1. Keep or Delete `/landing`?
**Question:** Is this the public marketing homepage?
- **If YES:** KEEP as landing page at `/`
- **If NO:** DELETE and use `/discover` as homepage

**Recommendation:** Check with team

### 2. Keep or Delete Campaigns?
**Question:** Are campaigns linked from `/earn` or elsewhere?
- **If YES:** KEEP `/campaign/[id]` and related components
- **If NO:** DELETE campaign system

**Recommendation:** Check `/earn` page for campaign references

### 3. Keep or Delete `/control/*` Pages?
**Question:** Are admin pages actively used?
- **If YES:** KEEP admin routes
- **If NO:** DELETE admin routes

**Recommendation:** Check with admin team

---

## Execution Plan

### Phase 1: Backup (5 mins)
```bash
git checkout -b cleanup/remove-orphaned-features
git add .
git commit -m "Checkpoint before cleanup"
```

### Phase 2: Delete Routes (30 mins)
```bash
# Run cleanup script
bash cleanup-orphaned-routes.sh

# Or manually delete directories
```

### Phase 3: Fix Navigation (30 mins)
```bash
# Update TopNav.tsx
# Fix /wallet and /settings links
```

### Phase 4: Update Docs (30 mins)
```bash
# Update ROUTE_INVENTORY.md
# Update BUTTON_AUDIT.md
# Update WIRING_IMPLEMENTATION_PLAN.md
```

### Phase 5: Test (30 mins)
```bash
# Run typecheck
npm run typecheck

# Run build
npm run build

# Test main navigation works
npm run dev
# Click all nav items, verify no 404s
```

### Phase 6: Commit (5 mins)
```bash
git add .
git commit -m "chore: remove orphaned routes and components

- Removed 15 orphaned routes (explore, earnings, ads, predictions, etc.)
- Removed quest/bounty/raid system (not in main nav)
- Removed widget demos (abandoned)
- Fixed TopNav wallet/settings links
- Updated documentation

Reduces codebase by ~2000 lines of dead code"
```

---

## Summary

**Files to Delete:** ~40 files (routes + components)
**Lines of Code Removed:** ~2000+
**Time Required:** 2-3 hours
**Risk Level:** Low
**Reversibility:** High (git history)

**Ready to execute?** Run the cleanup script or manually delete directories.

---

**Last Updated:** 2025-10-20
**Status:** Ready for cleanup
**Next Step:** Run cleanup script or manual deletion
