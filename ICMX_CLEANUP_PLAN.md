# ICMX Pre-Launch Cleanup — Aggressive Pruning Plan

**Date:** 2025-10-25
**Context:** First vibe coding project → spinning ideas → redesigning → refocusing → NOW SHIPPING
**Goal:** Delete everything that's NOT the core ICMX app
**Risk:** 🟢 LOW (deleting unused experiments, core untouched)

---

## What IS ICMX? (Core App)

**6 Core Pages:**
1. `/discover` — Find projects/launches (1,012 LOC)
2. `/launch` — Platform dashboard (589 LOC)
3. `/clip` — Clips & campaigns (1,256 LOC)
4. `/chat` — Messaging/DMs (158 LOC)
5. `/network` — Connections/dealflow (320 LOC)
6. `/profile` — User settings/holdings (782 LOC)

**Active Systems:**
- 38 Modals/Drawers (BuySell, LaunchDetails, Comments, etc.)
- `/BLAST` — Working feature (11 files, in development)
- BTDemo design system (components used in core pages)
- Appwrite backend services
- Solana/Anchor bonding curve program
- Privy authentication

**Total Core:** ~4,117 LOC + modals + BLAST

---

## What Is NOT ICMX? (DELETE ALL)

### 🗑️ Experimental Routes (8 routes = 5,581+ LOC)

**To DELETE:**
```bash
rm -rf app/battletech-testv2      # Test route
rm -rf app/brand-compare          # Comparison experiment
rm -rf app/btdemo                 # BTDemo preview route (components stay!)
rm -rf app/btdemo-overlays        # Overlay preview route
rm -rf app/button-preview         # Button testing route
rm -rf app/control                # Control panel test (2 files)
rm -rf app/design-final           # Design experiment
rm -rf app/final-ui               # UI experiment
```

**Why DELETE:**
- Not in core 6 pages
- Test/preview routes
- BTDemo COMPONENTS are used, but /btdemo ROUTE is just a preview page
- Total: ~5,581 LOC + assets

**KEEP (maybe):**
- `/login` — May be needed for auth flow (check if Privy handles this)
- `/signup` — May be needed for onboarding (check if Privy handles this)
- `/campaign/[id]` — Detail page, check if actually used

---

### 🗑️ Backup & Unused Files

**To DELETE:**
```bash
# Backup pages
rm app/discover/page-backup.tsx               # 5 LOC
rm app/discover/page-original.tsx             # 642 LOC
rm app/clip/page.tsx.backup                   # Unknown LOC

# Backup components
rm components/network/NetworkFeed-old.tsx.backup
rm components/network/InviteTree-old.tsx.backup
rm components/network/UserCard-old.tsx.backup

# Unused API routes
rm app/api/referral/rewards/route.ts.unused
```

**Total:** ~647+ LOC

---

### 🗑️ Documentation Debt (259 .md files!)

**Root directory has MASSIVE doc clutter:**

#### DELETE — Old Implementation Plans (no longer relevant):
```bash
rm API_AND_FUNCTIONS_PLAN.md
rm APPWRITE_SETUP_GUIDE.md
rm ARCHITECTURE_IMPLEMENTATION_GUIDE.md
rm AUTO_CCM_IMPLEMENTATION_GUIDE.md
rm BUILD_AND_TEST_GUIDE.md
rm BUTTON_ARCHITECTURE_SPEC.md
rm BUTTON_IMPLEMENTATION_PLAN.md
rm BUTTON_VISUAL_SPECS.md
rm CLEANUP_GUIDE.md
rm CLEANUP_PLAN.md
rm CLIPS_COMPONENT_SPECS.md
rm CLIP_PAGE_UX_SPEC.md
rm CORE_WIRING_PLAN.md
rm CURATION_SYSTEM_MASTER_PLAN.md
# ... (30+ more implementation guides)
```

#### DELETE — Design Specs (superseded by final design):
```bash
rm BTDEMO_COMPREHENSIVE_DESIGN_SPEC.md
rm BTDEMO_DESIGN_SPECIFICATION.md
rm BTDEMO_DESIGN_SPEC_CORRECTED.md
rm BTDEMO_IMPLEMENTATION_PLAN.md
rm BTDEMO_ROLLOUT_PLAN.md
rm BTDEMO_SECTIONS_1-3_VISUAL_GUIDE.md
rm BTDEMO_VISUAL_GUIDE.md
# ... (8 BTDemo design docs)
```

#### DELETE — Multiple Planning Docs:
```bash
rm PLAN.md                        # Old /launch page plan (superseded)
rm DISCOVER_REFACTOR_PLAN.md      # Now have CORE_APP_REFACTOR_PLAN
# ... consolidate into 1-2 active plans
```

#### KEEP — Essential Docs:
```bash
# KEEP these
README.md                         # Project overview
DEPLOYMENT_STATUS.md              # Live deployments
SPRINT.md                         # Current priorities
DOCS_INDEX.md                     # Doc map
CLAUDE.md                         # Agent instructions
SOLANA_ARCHITECTURE_V3_FINAL.md   # Core architecture
INTEGRATION_GUIDE.md              # Frontend integration
AUDIT.md                          # NEW - This audit
CORE_APP_REFACTOR_PLAN.md         # NEW - Refactor plan
ICMX_CLEANUP_PLAN.md              # THIS FILE

# KEEP BLAST docs (active feature)
BLAST_MASTER_PLAN.md
BLAST_DEALFLOW_README.md
BLAST_SETUP_GUIDE.md
```

**DELETE:** ~240+ stale markdown files
**KEEP:** ~15 essential docs

---

### 🗑️ Unused NPM Dependencies

**Currently Installed:**
```json
{
  "wagmi": "^1.4.13",          // NOT USED (0 imports) → DELETE
  "viem": "^2.37.13",          // Used by wagmi? Check if needed
  "twitter-api-v2": "^1.27.0"  // Check if used
}
```

**Action:**
```bash
npm uninstall wagmi viem  # If not used (check first)
# Keep: recharts (4 uses), lightweight-charts (2 uses)
```

**Savings:** ~200KB bundle reduction

---

### 🗑️ Unused Components (Audit Needed)

**Suspects (not imported by core 6 pages):**

```bash
components/landing/           # Landing page components (if no landing page)
components/onboarding/        # Onboarding flow (if Privy handles)
components/payments/          # EscrowPaymentModal (if not used)
components/trading/           # TradingPanel (if not used)
```

**Action:** Run import analysis to find orphaned components

---

## Cleanup Phases

### Phase 0: PRUNING (4 hours) — DELETE EVERYTHING UNUSED

**Priority:** 🔴 **P0** — Do this BEFORE any refactoring

#### Step 0.1: Delete Experimental Routes (30 min)

```bash
git rm -rf app/battletech-testv2
git rm -rf app/brand-compare
git rm -rf app/btdemo
git rm -rf app/btdemo-overlays
git rm -rf app/button-preview
git rm -rf app/control
git rm -rf app/design-final
git rm -rf app/final-ui

git commit -m "prune: Delete 8 experimental routes (~5,581 LOC)"
```

**Deliverable:** 8 routes deleted, ~5,581 LOC removed

---

#### Step 0.2: Delete Backup Files (10 min)

```bash
git rm app/discover/page-backup.tsx
git rm app/discover/page-original.tsx
git rm app/clip/page.tsx.backup
git rm components/network/*-old.tsx.backup
git rm app/api/referral/rewards/route.ts.unused

git commit -m "prune: Delete all backup files (~647 LOC)"
```

**Deliverable:** Backup files gone, repo cleaner

---

#### Step 0.3: Consolidate Documentation (1 hour)

**Strategy:** Keep only 15 essential docs, archive the rest

```bash
# Create archive
mkdir -p .archive/old-docs
mv *_PLAN.md *_GUIDE.md *_SPEC.md .archive/old-docs/

# Keep essentials (move back)
mv .archive/old-docs/DEPLOYMENT_STATUS.md .
mv .archive/old-docs/SPRINT.md .
mv .archive/old-docs/SOLANA_ARCHITECTURE_V3_FINAL.md .
mv .archive/old-docs/INTEGRATION_GUIDE.md .
mv .archive/old-docs/BLAST_*.md .

# Add to .gitignore
echo ".archive/" >> .gitignore

git add .
git commit -m "prune: Archive 240+ stale docs, keep 15 essential"
```

**Deliverable:** 240+ docs archived, root directory clean

---

#### Step 0.4: Remove Unused Dependencies (15 min)

```bash
# Verify wagmi/viem not used
grep -r "import.*wagmi" app components lib
# If no results:
npm uninstall wagmi

# Check viem
grep -r "import.*viem" app components lib
# If only wagmi-related:
npm uninstall viem

# Check twitter-api-v2
grep -r "twitter-api-v2" app components lib
# If not used:
npm uninstall twitter-api-v2

npm install  # Update lock file
git add package.json package-lock.json
git commit -m "prune: Remove unused dependencies (wagmi, viem, twitter-api-v2)"
```

**Deliverable:** ~200KB bundle savings, cleaner package.json

---

#### Step 0.5: Audit & Delete Orphaned Components (1.5 hours)

**Create audit script:**

```bash
# scripts/find-unused-components.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all component files
const components = execSync('find components -name "*.tsx" -type f')
  .toString()
  .trim()
  .split('\n');

const unused = [];

for (const component of components) {
  const basename = path.basename(component, '.tsx');

  // Search for imports of this component in core 6 pages
  const cmd = `grep -r "import.*${basename}" app/{discover,launch,clip,chat,network,profile} 2>/dev/null || echo ""`;
  const result = execSync(cmd).toString().trim();

  if (!result) {
    unused.push(component);
  }
}

console.log(`Found ${unused.length} unused components:`);
unused.forEach(c => console.log(c));

// Write to file
fs.writeFileSync('unused-components.txt', unused.join('\n'));
```

**Run:**
```bash
node scripts/find-unused-components.js
# Review unused-components.txt
# Delete confirmed unused components
```

**Action:**
```bash
# Example deletions (after review)
git rm components/landing/Testimonials.tsx  # If no landing page
git rm components/trading/TradingPanel.tsx  # If not used
git rm components/payments/EscrowPaymentModal.tsx  # If not used
# ... (more after analysis)

git commit -m "prune: Delete orphaned components"
```

**Deliverable:** Unused components identified & deleted

---

#### Step 0.6: Clean API Routes (45 min)

**Current state:** 55 API route files

**Action:** Audit which are actually called by core 6 pages

```bash
# List all API routes
find app/api -name "route.ts" -o -name "route.js"

# For each, check if used in core pages
# Example:
grep -r "/api/curve/test" app/{discover,launch,clip,chat,network,profile}
# If not found → DELETE

# Delete confirmed unused
git rm app/api/curve/test/route.ts
git rm app/api/test-launch/route.ts
# ... (more after analysis)

git commit -m "prune: Delete unused API routes"
```

**Deliverable:** Only active API routes remain

---

### Summary: Phase 0 Results

**Total Deleted:**
- 8 experimental routes (~5,581 LOC)
- 647 LOC backup files
- 240+ stale documentation files
- 3+ unused npm packages (~200KB)
- 20+ orphaned components (est. ~2,000 LOC)
- 10+ unused API routes (est. ~500 LOC)

**Total LOC Removed:** ~8,728+ lines
**Bundle Reduction:** ~250KB
**Disk Space Saved:** ~50MB
**Repo Cleanliness:** 🟢 EXCELLENT

**Codebase After Phase 0:**
- 6 core pages (4,117 LOC) ✅
- 38 active modals ✅
- BLAST feature (in dev) ✅
- 15 essential docs ✅
- Clean dependencies ✅
- Zero dead code ✅

---

## After Phase 0: Execute Core Refactor

**Now ready for:** [CORE_APP_REFACTOR_PLAN.md](CORE_APP_REFACTOR_PLAN.md)

**Phases (after pruning):**
1. Foundation — TypeScript/ESLint enforcement, security (4 hrs)
2. Routes Refactor — Server components + islands (14.5 hrs)
3. Modals — Consolidate, lazy-load (3 hrs)
4. Accessibility — WCAG 2.1 AA (4 hrs)
5. CI/CD — Workflows, gates (3 hrs)
6. Docs/Test — RESULTS.md, perf benchmarks (3 hrs)

**Total:** Phase 0 (4 hrs) + Core Refactor (31.5 hrs) = **35.5 hours**

---

## Rollback Plan

**If cleanup breaks something:**

```bash
# Restore experimental routes
git revert <pruning-commit>

# Or restore specific directory
git checkout <pre-prune-commit> -- app/btdemo

# Restore docs
git checkout <pre-prune-commit> -- *.md
```

**Safe Approach:**
1. Do Phase 0 in separate branch: `cleanup/prune-experimental`
2. Test core 6 pages work
3. Merge to main if all good
4. If issues, cherry-pick fixes or revert

---

## Success Criteria (Phase 0)

### Must Complete:
- [ ] 8 experimental routes deleted
- [ ] All backup files deleted
- [ ] 240+ stale docs archived
- [ ] Unused deps removed (wagmi, viem, etc.)
- [ ] Orphaned components deleted
- [ ] Unused API routes deleted
- [ ] Build succeeds (`npm run build`)
- [ ] Core 6 pages work identically
- [ ] No broken imports
- [ ] Git history clean (atomic commits)

### Metrics:
- [ ] LOC removed: ≥8,000
- [ ] Bundle reduction: ≥200KB
- [ ] Docs in root: ≤20 files
- [ ] Components: Only those used by core 6

---

## Commands Cheat Sheet

```bash
# PHASE 0 CLEANUP — Execute in order

# 1. Delete experimental routes
git rm -rf app/{battletech-testv2,brand-compare,btdemo,btdemo-overlays,button-preview,control,design-final,final-ui}
git commit -m "prune: Delete 8 experimental routes"

# 2. Delete backup files
git rm app/discover/page-{backup,original}.tsx app/clip/page.tsx.backup
git rm components/network/*-old.tsx.backup app/api/referral/rewards/route.ts.unused
git commit -m "prune: Delete backup files"

# 3. Archive docs
mkdir -p .archive/old-docs
mv *_{PLAN,GUIDE,SPEC,NOTES,IMPL}.md .archive/old-docs/ 2>/dev/null || true
echo ".archive/" >> .gitignore
git add .
git commit -m "prune: Archive 240+ stale docs"

# 4. Remove unused deps
npm uninstall wagmi viem twitter-api-v2
git add package*.json
git commit -m "prune: Remove unused dependencies"

# 5. Audit & delete unused components
node scripts/find-unused-components.js
# Review unused-components.txt, then:
cat unused-components.txt | xargs git rm
git commit -m "prune: Delete orphaned components"

# 6. Delete unused API routes
git rm app/api/{curve/test,test-launch}/route.ts
git commit -m "prune: Delete unused API routes"

# 7. Verify build
npm run build

# 8. Test core pages
npm run dev
# Visit /discover, /launch, /clip, /chat, /network, /profile
# Verify all work

# 9. Push
git push origin cleanup/prune-experimental
```

---

## Notes

**Why so aggressive?**
- First project = experimental debt
- Vibe coding = lots of iterations
- Spinning ideas = orphaned code
- NOW: Ship clean, focused ICMX app

**What if we need something later?**
- Git history preserves everything
- `.archive/` keeps docs accessible
- Easy to restore: `git checkout <commit> -- <file>`

**Philosophy:**
> "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away."
> — Antoine de Saint-Exupéry

Delete aggressively. Ship confidently. 🚀

---

**Status:** ⏳ **AWAITING GO**
**Next:** User approves → Execute Phase 0 → Then CORE_APP_REFACTOR_PLAN
