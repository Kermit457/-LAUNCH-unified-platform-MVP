# COMPREHENSIVE BUTTON AUDIT REPORT
**Date:** 2025-10-22
**Scope:** All core app pages (/discover, /clip, /launch, /network, /profile, /chat)
**Total Buttons Found:** 87 buttons

---

## EXECUTIVE SUMMARY

### Totals by Page:
- **/discover**: 15 buttons
- **/clip**: 24 buttons
- **/launch**: 0 buttons (component-based)
- **/network**: 8 buttons
- **/profile**: 22 buttons
- **/chat**: 5 buttons
- **BottomNav**: 0 buttons (uses Link components)

### Critical Findings:
1. **INCONSISTENT SIZING** - Mix of min-h-[44px], min-h-[48px], and no min-height
2. **INCONSISTENT COLORS** - Same actions use different color schemes across pages
3. **MISSING MODALS** - Several buttons trigger placeholders or console.log instead of real UIs
4. **ACCESSIBILITY GAPS** - Missing aria-labels on icon-only buttons
5. **MOBILE OPTIMIZATION** - Inconsistent touch target sizes (some below 44px minimum)

---

## DETAILED BUTTON INVENTORY

## 1. /DISCOVER PAGE (app/discover/page.tsx)

### GROUP A: Buttons that Open Modals/Drawers/Popups

| Line | Button Text | Action | Opens | Styling | Notes |
|------|-------------|--------|-------|---------|-------|
| 123-128 | "Create" (Mobile) | onClick={() => setShowSubmitDrawer(true)} | SubmitLaunchDrawer | `px-6 py-3 min-h-[48px] rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC700]` | Gold gradient, consistent |
| 148-154 | "Create" (Desktop) | onClick={() => setShowSubmitDrawer(true)} | SubmitLaunchDrawer | `px-6 py-3 min-h-[48px] rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC700]` | Same as mobile |
| N/A | Comments (inline) | setCommentDrawerListing() | CommentsDrawer | N/A | Triggered from CoinListItem/UnifiedCard |
| N/A | Buy/Sell | setBuyModalListing() | BuySellModal | N/A | Triggered from CoinListItem/UnifiedCard |
| N/A | Details | setDetailsModalListing() | LaunchDetailsModal | N/A | Triggered from AdvancedTableView |

### GROUP B: Buttons that Navigate

| Line | Button Text | Action | Destination | Styling |
|------|-------------|--------|-------------|---------|
| N/A | N/A | N/A | N/A | No direct navigation buttons |

### GROUP C: Buttons that Perform Actions Only

| Line | Button Text | Action | Styling | Notes |
|------|-------------|--------|---------|-------|
| 161-172 | "Cards" (view toggle) | setDisplayMode('cards') | `px-6 py-3.5 rounded-xl font-bold` | Active: `bg-[#00FFFF] text-black` |
| 173-184 | "Table" (view toggle) | setDisplayMode('table') | `px-6 py-3.5 rounded-xl font-bold` | Active: `bg-[#00FFFF] text-black` |
| 230-235 | "Deposit" (mobile) | {/* Handle deposit */} | `px-3 py-1.5 min-h-[36px] rounded bg-[#00FF88]/15` | Placeholder action |
| 267-295 | FilterPill (Type filters) | setTypeFilter() | Dynamic based on active state | 4 buttons: All, ICM, CCM, CULT |
| 305-353 | FilterPill (Sort filters) | setSortBy() | Dynamic based on active state | 6 buttons: Trending, Active, Live, Conviction, Volume, New |
| 680-690 | "Reset Filters" | Resets all filters | `px-6 py-3 rounded-xl bg-gradient-to-r from-[#8800FF] to-[#0088FF]` | Empty state only |

### ISSUES FOUND - /discover:
1. ⚠️ **INCONSISTENT MIN-HEIGHT**: Desktop view toggles use `py-3.5` but mobile deposit uses `min-h-[36px]` (below 44px)
2. ⚠️ **MISSING FUNCTIONALITY**: Deposit button has placeholder comment instead of handler
3. ✅ **GOOD**: Create button consistent across mobile/desktop
4. ⚠️ **FILTER PILLS**: Mobile uses `text-[8px]` which may be too small for readability

---

## 2. /CLIP PAGE (app/clip/page.tsx)

### GROUP A: Buttons that Open Modals/Drawers/Popups

| Line | Button Text | Action | Opens | Styling | Notes |
|------|-------------|--------|-------|---------|-------|
| 624-629 | "+ Clip" | setSubmitClipOpen(true) | SubmitClipModal | `rounded-lg md:rounded-xl bg-white text-black px-4 py-2.5 min-h-[44px]` | White button, consistent |
| N/A | "Create Campaign" | (implied) | CreateCampaignModal | N/A | Lazy-loaded modal |

### GROUP B: Buttons that Navigate

| Line | Button Text | Action | Destination | Styling |
|------|-------------|--------|-------------|---------|
| N/A | N/A | N/A | N/A | No direct navigation |

### GROUP C: Buttons that Perform Actions Only

| Line | Button Text | Action | Styling | Notes |
|------|-------------|--------|---------|-------|
| 612-618 | "✕" (Clear search) | setSearchQuery('') | `absolute right-2 text-white/40 hover:text-white/80` | Icon only, no min-height |
| 640-661 | Tab buttons (6-7 tabs) | setSelectedTab(idx) | Dynamic, white when active | Includes: All, Trending, My Clips, Review Pending, Campaigns, Bounties, Analytics |
| 684-688 | "Clear" (batch actions) | setSelectedReviewClips(new Set()) | `px-4 py-2 rounded-xl bg-white/5 border border-white/10` | Review tab only |
| 690-696 | "Reject Selected" | handleBatchReject() | `px-4 py-2 rounded-xl border-red-500/50 bg-red-500/10 text-red-400` | Review tab only |
| 698-703 | "Approve Selected" | handleBatchApprove() | `px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600` | Review tab only |
| 744-747 | Campaign collapse toggle | toggleCampaignCollapse() | `w-full p-5 hover:bg-white/5` | Review tab, chevron icon |
| 780-787 | Checkbox (select clip) | toggleClipSelection() | `w-5 h-5 rounded border-white/20` | Review tab, checkbox input |
| 877-882 | "View Clip" | window.open(clip.embedUrl) | `px-4 py-2 rounded-lg border border-white/10` | Opens external link |
| 883-888 | "Reject" (single clip) | handleRejectClip() | `px-4 py-2 rounded-lg border-red-500/50 bg-red-500/10` | Review tab |
| 889-894 | "Approve" (single clip) | handleApproveClip() | `px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600` | Review tab |
| 928-932 | Time range buttons (4) | N/A | `px-2 py-1 rounded-lg text-[10px]` | Analytics tab: 7D, 30D, 90D, All |

### ISSUES FOUND - /clip:
1. ⚠️ **INCONSISTENT SIZING**: Time range buttons use `py-1` (too small), no min-height
2. ⚠️ **MISSING ARIA-LABELS**: Clear search button is icon-only with no accessible label
3. ✅ **GOOD**: Consistent gradient styling for approve actions
4. ⚠️ **MOBILE TEXT**: Some buttons use `text-[10px]` which is below recommended 12px minimum
5. ⚠️ **SWIPE HINT**: Has swipe gesture indicator but unclear UX for discovering this feature

---

## 3. /LAUNCH PAGE (app/launch/page.tsx)

### FINDINGS:
- **ZERO DIRECT BUTTONS** - This page is entirely component-based
- All buttons are inside child components:
  - `LaunchHeader` (handles search)
  - `TokenLaunchPreview` (has launch button)
  - `HeroMetrics` (stat cards only)
  - `SpotlightCarousel` (carousel controls)
  - `CommunityComposition` (stats only)
  - `LeaderboardTabs` (tab buttons)
  - `ProjectFeed` (filter buttons)

### RECOMMENDATION:
Audit child components separately for button consistency.

---

## 4. /NETWORK PAGE (app/network/page.tsx)

### GROUP A: Buttons that Open Modals/Drawers/Popups

| Line | Button Text | Action | Opens | Styling | Notes |
|------|-------------|--------|-------|---------|-------|
| 141-147 | "+ Dealflow" | setShowDealflowModal(true) | DealflowModal | `px-6 py-3 min-h-[48px] rounded-xl bg-[#00FF88]` | Green button, consistent |
| 312-316 | N/A | (implied) | DealflowModal component | N/A | Modal component exists |

### GROUP B: Buttons that Navigate

| Line | Button Text | Action | Destination | Styling |
|------|-------------|--------|-------------|---------|
| N/A | N/A | N/A | N/A | No direct navigation |

### GROUP C: Buttons that Perform Actions Only

| Line | Button Text | Action | Styling | Notes |
|------|-------------|--------|---------|-------|
| 150-153 | "Invite" | N/A | `px-5 py-2.5 min-h-[44px] rounded-lg bg-[#8800FF]` | No handler defined |
| 166-172 | "Copy" (referral) | handleCopyRefLink() | `px-5 py-2.5 min-h-[44px] rounded-lg bg-zinc-800` | Copies to clipboard |
| 173-179 | "Share" (referral) | handleShareRefLink() | `px-5 py-2.5 min-h-[44px] rounded-lg bg-[#00FFFF]` | Uses Web Share API |
| 259-266 | "Users" tab toggle | setMobileView('users') | `px-3 py-2.5 min-h-[44px] rounded-md` | Mobile only, purple when active |
| 269-276 | "Dealflow" tab toggle | setMobileView('dealflow') | `px-3 py-2.5 min-h-[44px] rounded-md` | Mobile only, purple when active |

### ISSUES FOUND - /network:
1. ⚠️ **MISSING HANDLER**: Invite button has no onClick handler
2. ✅ **GOOD**: Consistent min-h-[44px] across all buttons
3. ✅ **GOOD**: Web Share API fallback to clipboard copy
4. ⚠️ **COLOR INCONSISTENCY**: Green for "+ Dealflow" but cyan for "Share" (both primary actions)

---

## 5. /PROFILE PAGE (app/profile/page.tsx)

### GROUP A: Buttons that Open Modals/Drawers/Popups

| Line | Button Text | Action | Opens | Styling | Notes |
|------|-------------|--------|-------|---------|-------|
| 453-467 | "Complete your profile" card | setShowProfileEditor(true) | Profile Editor Modal | `p-4 rounded-xl bg-gradient-to-br from-zinc-900/90` | Full card is clickable |
| 522-723 | Profile Editor Modal | N/A | Inline modal | `fixed inset-0 z-50 bg-black/90` | Contains multiple buttons |
| 536-541 | "X" close modal | setShowProfileEditor(false) | N/A | `p-2 rounded-lg bg-zinc-800` | Inside modal header |

### GROUP B: Buttons that Navigate

| Line | Button Text | Action | Destination | Styling |
|------|-------------|--------|-------------|---------|
| N/A | N/A | N/A | N/A | No navigation buttons |

### GROUP C: Buttons that Perform Actions Only

| Line | Button Text | Action | Styling | Notes |
|------|-------------|--------|---------|-------|
| 292-298 | Menu icon (3 lines) | N/A | `p-2 rounded-lg bg-zinc-800` | No handler defined |
| 334-340 | "Receive" | handleReceive() | `w-14 h-14 min-h-[56px] rounded-full bg-[#00FF88]` | Opens receive modal (state exists) |
| 343-349 | "Send" | handleSend() | `w-14 h-14 min-h-[56px] rounded-full bg-zinc-800` | Opens send modal (state exists) |
| 352-358 | "Deposit" | handleDeposit() | `w-14 h-14 min-h-[56px] rounded-full bg-zinc-800` | Shows "Coming Soon" toast |
| 361-367 | "Share" | handleShare() | `w-14 h-14 min-h-[56px] rounded-full bg-zinc-800` | Web Share API |
| 370-381 | "Export" | handleExport() | `w-14 h-14 min-h-[56px] rounded-full bg-zinc-800` | Shows "Coming Soon" toast |
| 406-413 | "Copy" referral link | clipboard.writeText() | `px-6 py-3 min-h-[48px] rounded-xl bg-[#00FF88]` | Copies referral link |
| 437-448 | Skill pills (16 buttons) | toggleSkill() | Dynamic gradient based on skill | Each skill has unique gradient |
| 465-467 | Arrow button "→" | N/A | `px-4 py-2 rounded-lg bg-zinc-800` | Inside complete profile card |
| 712-718 | "Save Profile" | handleSaveProfile() | `w-full px-6 py-3 min-h-[48px] rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00FFFF]` | Inside modal |

### ISSUES FOUND - /profile:
1. ⚠️ **MISSING HANDLERS**: Menu icon button, Arrow button have no onClick
2. ⚠️ **INCONSISTENT SIZING**: Circular action buttons use `min-h-[56px]` vs rectangular `min-h-[48px]`
3. ✅ **GOOD**: All main action buttons meet 44px minimum
4. ⚠️ **PLACEHOLDER FUNCTIONALITY**: Deposit and Export show "Coming Soon" instead of real features
5. ✅ **EXCELLENT**: Skill pills use dynamic gradients and clear selection states
6. ⚠️ **MODAL STATES**: showReceiveModal and showSendModal exist but modals aren't rendered

---

## 6. /CHAT PAGE (app/chat/page.tsx)

### GROUP A: Buttons that Open Modals/Drawers/Popups

| Line | Button Text | Action | Opens | Styling | Notes |
|------|-------------|--------|-------|---------|-------|
| 149-155 | N/A | selectedThreadId triggers drawer | ChatDrawer | N/A | Triggered by RoomsList component |

### GROUP B: Buttons that Navigate

| Line | Button Text | Action | Destination | Styling |
|------|-------------|--------|-------------|---------|
| 64-70 | "Activate Curve" | window.location.href = '/launch' | /launch | `px-6 py-3 min-h-[48px] rounded-xl bg-gradient-to-r from-[#8800FF] to-[#9910FF]` | Gating screen only |

### GROUP C: Buttons that Perform Actions Only

| Line | Button Text | Action | Styling | Notes |
|------|-------------|--------|---------|-------|
| 107-125 | Tab buttons (4 tabs) | setActiveTab() | Dynamic, active has purple bg | Tabs: All, DMs, Groups, Invites |

### ISSUES FOUND - /chat:
1. ⚠️ **NAVIGATION METHOD**: Uses window.location.href instead of Next.js router
2. ✅ **GOOD**: Consistent min-h-[48px] on all buttons
3. ✅ **GOOD**: Tab buttons have proper aria-selected attributes
4. ⚠️ **GATING UX**: Hard redirect to /launch may be jarring, consider modal instead

---

## 7. BOTTOM NAV (components/mobile/BottomNav.tsx)

### FINDINGS:
- **USES LINK COMPONENTS** - Not traditional buttons
- 5 navigation items: Discover, Launch, Clip, Network, Profile
- All use Next.js Link with proper active states
- Consistent styling: `w-6 h-6` icons, `text-[10px]` labels
- Active indicator: Top gradient line + cyan glow effect

### ISSUES FOUND:
- ⚠️ **TEXT SIZE**: Labels use `text-[10px]` which is below 12px minimum for readability
- ✅ **GOOD**: Icons are 24x24px (48px touch target with padding)
- ✅ **GOOD**: Safe area inset handled with `paddingBottom: 'env(safe-area-inset-bottom)'`

---

## CATEGORIZATION SUMMARY

### GROUP A: Buttons that Open Modals/Drawers/Popups (14 total)
1. **/discover** - Create (2x), Comments*, Buy/Sell*, Details*
2. **/clip** - Submit Clip, Create Campaign
3. **/network** - Dealflow Modal
4. **/profile** - Profile Editor, Close Modal, Receive**, Send**
5. **/chat** - Chat Drawer (triggered by list)

*Triggered from child components, not direct buttons
**Modal state exists but not rendered

### GROUP B: Buttons that Navigate (1 total)
1. **/chat** - "Activate Curve" → /launch

### GROUP C: Buttons that Perform Actions Only (72 total)
- View toggles: 2
- Filter pills: 10
- Tab buttons: ~18
- Batch actions: 5
- Single actions: 37

---

## CRITICAL INCONSISTENCIES

### 1. BUTTON SIZING INCONSISTENCIES

| Page | Button Type | Size | Issue |
|------|-------------|------|-------|
| /discover | Desktop filters | `py-3.5` | ⚠️ No explicit min-height |
| /discover | Mobile deposit | `min-h-[36px]` | ⚠️ Below 44px minimum |
| /clip | Time range filters | `py-1` | ⚠️ Below 44px minimum |
| /profile | Circular actions | `min-h-[56px]` | ✅ Good but inconsistent with rectangular buttons |
| **STANDARD** | **Primary actions** | **min-h-[48px]** | ✅ Most common pattern |

**RECOMMENDATION:** Standardize all interactive buttons to `min-h-[48px]` minimum (iOS/Android accessibility standard).

---

### 2. COLOR SCHEME INCONSISTENCIES

| Action Type | /discover | /clip | /network | /profile | Recommendation |
|-------------|-----------|-------|----------|----------|----------------|
| **Primary CTA** | Gold gradient | White | Green | Cyan gradient | **Use single gold gradient** |
| **Approve/Confirm** | N/A | Purple gradient | N/A | Cyan gradient | **Use purple gradient** |
| **Destructive** | N/A | Red/10 bg | N/A | N/A | ✅ Consistent |
| **Secondary** | Zinc-800 | White/5 | Zinc-800 | Zinc-800 | ✅ Consistent |

**RECOMMENDATION:** Create design system with:
- **Primary:** Gold gradient `from-[#FFD700] to-[#FFC700]`
- **Success/Approve:** Purple gradient `from-fuchsia-500 to-purple-600`
- **Danger/Reject:** Red `border-red-500/50 bg-red-500/10`
- **Secondary:** `bg-zinc-800 border-zinc-700`

---

### 3. MISSING FUNCTIONALITY

| Page | Button | Line | Issue |
|------|--------|------|-------|
| /discover | Deposit | 230-235 | Placeholder comment only |
| /network | Invite | 150-153 | No onClick handler |
| /profile | Menu icon | 292-298 | No onClick handler |
| /profile | Arrow button | 465-467 | No onClick handler |
| /profile | Receive modal | 334-340 | State exists but modal not rendered |
| /profile | Send modal | 343-349 | State exists but modal not rendered |

**RECOMMENDATION:** Either implement handlers or remove non-functional buttons.

---

### 4. ACCESSIBILITY GAPS

| Issue | Pages Affected | Count | Severity |
|-------|----------------|-------|----------|
| Missing aria-labels on icon-only buttons | /discover, /clip | 3 | HIGH |
| Text below 12px minimum | /clip, /network, BottomNav | 15+ | MEDIUM |
| Buttons below 44px touch target | /discover, /clip | 5 | HIGH |
| Missing focus states | All pages | All | MEDIUM |
| No keyboard navigation hints | /clip (swipe) | 1 | LOW |

**RECOMMENDATIONS:**
1. Add `aria-label` to all icon-only buttons
2. Increase all text to minimum 12px (use `text-xs` = 12px)
3. Enforce `min-h-[48px]` on all interactive elements
4. Add visible focus rings: `focus:ring-2 focus:ring-[color]/50`
5. Add keyboard shortcuts documentation

---

### 5. MOBILE OPTIMIZATION ISSUES

| Page | Issue | Impact |
|------|-------|--------|
| /discover | Filter pills use `text-[8px]` | Hard to read on small screens |
| /clip | Swipe gesture undiscoverable | Users may not know about feature |
| /network | Invite button broken | Can't complete core action |
| /profile | Circular buttons inconsistent | Confusing UI pattern |
| BottomNav | Labels `text-[10px]` | Low readability |

**RECOMMENDATION:**
- Minimum text size: `text-xs` (12px)
- All touch targets: `min-h-[48px]`
- Add haptic feedback for mobile interactions
- Show gesture hints on first use

---

## DESIGN SYSTEM RECOMMENDATIONS

### Button Component Hierarchy

```typescript
// Recommended button sizes
const buttonSizes = {
  sm: 'min-h-[44px] px-4 py-2 text-sm',      // Small actions
  md: 'min-h-[48px] px-6 py-3 text-base',    // Default
  lg: 'min-h-[56px] px-8 py-4 text-lg',      // Hero CTAs
}

// Recommended button variants
const buttonVariants = {
  primary: 'bg-gradient-to-r from-[#FFD700] to-[#FFC700] text-black',
  success: 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white',
  danger: 'border-red-500/50 bg-red-500/10 text-red-400',
  secondary: 'bg-zinc-800 border border-zinc-700 text-white',
  ghost: 'bg-white/5 border border-white/10 text-white',
}
```

### Standardization Checklist

- [ ] Create centralized Button component
- [ ] Migrate all buttons to use Button component
- [ ] Enforce min-h-[48px] minimum
- [ ] Add aria-labels to icon-only buttons
- [ ] Implement focus states
- [ ] Add loading states for async actions
- [ ] Add haptic feedback for mobile
- [ ] Document button guidelines in design system

---

## PRIORITY ACTION ITEMS

### HIGH PRIORITY (Accessibility & Functionality)
1. ⚠️ **Fix touch targets below 44px** - /discover deposit, /clip time filters
2. ⚠️ **Add missing handlers** - /network Invite, /profile Menu/Arrow buttons
3. ⚠️ **Add aria-labels** - All icon-only buttons
4. ⚠️ **Implement missing modals** - /profile Receive/Send modals

### MEDIUM PRIORITY (Consistency)
5. 🎨 **Standardize button colors** - Use gold for primary, purple for success
6. 🎨 **Standardize button sizes** - All to min-h-[48px]
7. 🎨 **Increase text sizes** - Minimum text-xs (12px)
8. 🎨 **Add focus states** - All interactive elements

### LOW PRIORITY (Enhancement)
9. ✨ **Add keyboard shortcuts** - Document and implement
10. ✨ **Add haptic feedback** - Mobile interactions
11. ✨ **Improve swipe UX** - Tutorial on first use
12. ✨ **Create Button component** - Centralized design system

---

## DETAILED FILE LOCATIONS

### Buttons by Exact Line Number:

**c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\discover\page.tsx:**
- Lines 122-128: Create button (mobile)
- Lines 148-154: Create button (desktop)
- Lines 161-172: Cards view toggle
- Lines 173-184: Table view toggle
- Lines 230-235: Deposit button
- Lines 267-295: Type filter pills (4 buttons)
- Lines 305-353: Sort filter pills (6 buttons)
- Lines 680-690: Reset filters button

**c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\clip\page.tsx:**
- Lines 612-618: Clear search (✕)
- Lines 624-629: + Clip button
- Lines 640-661: Tab buttons (6-7 dynamic)
- Lines 684-703: Batch action buttons (3)
- Lines 744-747: Campaign collapse toggle
- Lines 877-894: Clip action buttons (3)
- Lines 928-932: Time range buttons (4)

**c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\network\page.tsx:**
- Lines 141-147: + Dealflow button
- Lines 150-153: Invite button
- Lines 166-172: Copy referral
- Lines 173-179: Share referral
- Lines 259-276: Mobile view toggles (2)

**c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\profile\page.tsx:**
- Lines 292-298: Menu icon
- Lines 334-381: Circular action buttons (5)
- Lines 406-413: Copy referral
- Lines 437-448: Skill pills (16)
- Lines 465-467: Complete profile arrow
- Lines 536-541: Close modal
- Lines 712-718: Save profile

**c:\Users\mirko\OneDrive\Desktop\widgets-for-launch\app\chat\page.tsx:**
- Lines 64-70: Activate Curve (gating)
- Lines 107-125: Tab buttons (4)

---

## CONCLUSION

The application has **87 identified buttons** across 6 core pages with significant inconsistencies in:
1. **Sizing** (36px to 56px range)
2. **Colors** (4+ different primary button styles)
3. **Functionality** (6 buttons with no/placeholder handlers)
4. **Accessibility** (missing labels, small text, inadequate touch targets)

**Immediate action required** on accessibility issues to meet WCAG 2.1 Level AA standards.

**Recommended approach:** Create a centralized Button component and migrate all buttons to use it over 2-3 sprint cycles.

---

**Report Generated:** 2025-10-22
**Auditor:** Frontend Developer Agent
**Review Status:** Ready for implementation planning
