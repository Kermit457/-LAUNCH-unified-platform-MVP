# End-to-End Testing Guide

**Date:** 2025-10-20
**Version:** v1.0 - Post Wiring & Polish
**Dev Server:** http://localhost:3001

---

## Prerequisites

✅ Dev server running: `npm run dev`
✅ Appwrite backend configured
✅ Privy authentication working
✅ Solana devnet RPC accessible

---

## Test Flow 1: Authentication & Profile

### 1.1 Connect Wallet
**URL:** http://localhost:3001

**Steps:**
1. Click "Connect Wallet" button in top nav
2. Privy modal appears
3. Choose login method:
   - Twitter (recommended for testing)
   - Email
   - External wallet

**Expected:**
- ✅ Privy modal opens smoothly
- ✅ Login succeeds
- ✅ Embedded Solana wallet created automatically
- ✅ User synced to Appwrite (check `useSyncPrivyToAppwrite`)
- ✅ TopNav shows avatar/username
- ✅ Avatar menu accessible with dropdown

**Success Criteria:**
- User is authenticated
- Wallet address visible in avatar menu
- No console errors

---

### 1.2 Navigation Menu
**Steps:**
1. Click avatar in top right
2. Verify all menu items:
   - My Profile → `/network/@me`
   - Portfolio → `/discover?view=my-holdings`
   - My Curves → `/discover?view=my-curves`
   - Wallet → `/discover?view=my-holdings`
   - Earnings → `/earn`
   - Settings → `/dashboard/settings` (may not exist yet)
   - Sign Out → Disconnect wallet

**Expected:**
- ✅ All links navigate correctly
- ✅ No 404 errors
- ✅ Settings redirects to dashboard (or shows 404 gracefully)
- ✅ Sign out disconnects wallet

---

## Test Flow 2: LIVE Feature Flag

### 2.1 LIVE Navigation Link
**URL:** http://localhost:3001

**Steps:**
1. Look at main navigation bar
2. Verify "LIVE" link is visible between "LAUNCH" and "NETWORK"
3. Click "LIVE"

**Expected:**
- ✅ LIVE link visible in nav
- ✅ Navigates to `/live` route
- ✅ Page loads without errors

**Verification:**
- Feature flag `ENABLE_LIVE` is set to `true` in [lib/env.ts:67](lib/env.ts#L67)

---

## Test Flow 3: Launch Submission

### 3.1 Submit New Launch
**URL:** http://localhost:3001/launch

**Steps:**
1. Navigate to Launch page
2. Click "Submit Launch" button (check if drawer opens)
3. Fill out form:
   - Title: "Test Launch 2025"
   - Subtitle: "Testing launch submission"
   - Description: "This is a test launch to verify Appwrite integration"
   - Logo: Upload image (optional)
   - Ticker: "TEST"
   - Scope: Select ICM/CCM/MEME
4. Click Submit

**Expected:**
- ✅ SubmitLaunchDrawer opens
- ✅ Form validation works
- ✅ Logo upload shows preview
- ✅ Submit button enabled when form valid
- ✅ Loading state during submission
- ✅ Launch created in Appwrite
- ✅ Redirect to `/launch/[id]` detail page
- ✅ Success toast notification (if implemented)

**Check Appwrite:**
- Open Appwrite console
- Navigate to `launches` collection
- Verify new document created with correct data

**Success Criteria:**
- Launch appears in database
- User redirected to detail page
- No console errors

---

### 3.2 View Launch Detail
**URL:** http://localhost:3001/launch/[id]

**Steps:**
1. After redirect from submission
2. Verify launch details display:
   - Title, subtitle, description
   - Logo/image
   - Creator info
   - Vote button
   - Comment button
   - Share button

**Expected:**
- ✅ All data displays correctly
- ✅ Vote button shows 0 votes initially
- ✅ Comment button accessible

---

## Test Flow 4: Voting System

### 4.1 Vote on Launch (Authenticated)
**URL:** http://localhost:3001/launch/[id]

**Steps:**
1. Navigate to any launch detail page
2. Click vote button (ChevronUp icon)
3. Observe animation
4. Refresh page

**Expected:**
- ✅ Vote count increments (+1)
- ✅ Button animates (bounce + scale)
- ✅ Button style changes (pink gradient when voted)
- ✅ No blocking alerts
- ✅ Vote persists after refresh
- ✅ Vote saved in Appwrite `votes` collection

**Check Appwrite:**
- Open `votes` collection
- Find document with:
  - `launchId`: Current launch ID
  - `userId`: Your Privy user ID
  - `createdAt`: Recent timestamp

---

### 4.2 Remove Vote
**Steps:**
1. Click vote button again (already voted)
2. Observe animation

**Expected:**
- ✅ Vote count decrements (-1)
- ✅ Button style reverts to default
- ✅ Vote removed from Appwrite
- ✅ Refresh persists change

---

### 4.3 Vote Without Authentication
**Steps:**
1. Sign out (disconnect wallet)
2. Try to vote

**Expected:**
- ✅ Toast warning appears: "Authentication Required"
- ✅ Message: "Please connect your wallet to vote"
- ✅ Vote count unchanged
- ✅ No console errors
- ✅ Button disabled (opacity 50%)

---

## Test Flow 5: Comments System

### 5.1 Open Comments Drawer
**URL:** http://localhost:3001/launch/[id]

**Steps:**
1. Navigate to launch detail page
2. Click comment button

**Expected:**
- ✅ CommentsDrawer slides in from right
- ✅ Smooth animation (300ms slide-in)
- ✅ Backdrop overlay visible
- ✅ **Loading skeletons appear** (3 cards with pulse animation)
- ✅ Comments load from Appwrite
- ✅ Skeletons replaced with real comments

**Loading State:**
- Should see 3 animated skeleton cards
- Each card has:
  - Circular avatar skeleton
  - Name/time placeholder
  - 2 lines of text placeholder
  - Pulse animation

---

### 5.2 Add Comment (Authenticated)
**Steps:**
1. Type comment: "This is a test comment"
2. Click "Post Comment"

**Expected:**
- ✅ Submit button shows "Posting..." during submission
- ✅ Comment appears immediately at top of list (optimistic UI)
- ✅ Success toast: "Comment posted!"
- ✅ Description: "Your comment is now visible to everyone"
- ✅ Comment textarea clears
- ✅ Character count resets (0/500)
- ✅ Drawer scrolls to top to show new comment

**Check Appwrite:**
- Open `comments` collection
- Verify new document:
  - `launchId`: Current launch ID
  - `userId`: Your user ID
  - `username`: Your Twitter/Email
  - `content`: "This is a test comment"
  - `createdAt`: Recent timestamp

---

### 5.3 Comment Without Authentication
**Steps:**
1. Sign out
2. Open comments drawer
3. Try to add comment

**Expected:**
- ✅ Form disabled with message: "Please connect your wallet to comment"
- ✅ If somehow submit clicked → Error toast appears
- ✅ Toast: "Authentication Required"
- ✅ No console errors

---

### 5.4 Comments Persistence
**Steps:**
1. Add comment while authenticated
2. Close drawer
3. Refresh page
4. Reopen drawer

**Expected:**
- ✅ Comment persists after refresh
- ✅ Comment appears in list
- ✅ Timestamp shows correctly (e.g., "2m ago")

---

## Test Flow 6: Trading (Already Wired)

### 6.1 Buy Keys
**URL:** http://localhost:3001/discover

**Steps:**
1. Navigate to Discover page
2. Find any active curve
3. Click "Buy" button or open trading panel
4. Enter amount (e.g., 1)
5. Click "Buy Keys"

**Expected:**
- ✅ Price calculation updates live
- ✅ Fee breakdown shown
- ✅ Privy wallet modal opens for signature
- ✅ Transaction sent to Solana devnet
- ✅ Success notification with transaction link
- ✅ Holdings updated
- ✅ Appwrite `curve_events` collection updated

**Verify:**
- Check Solana Explorer with transaction signature
- Check Appwrite `curve_events` for buy event
- Verify your holdings in Portfolio view

---

### 6.2 Sell Keys
**Steps:**
1. Navigate to Portfolio → My Holdings
2. Select curve you own keys for
3. Click "Sell"
4. Enter amount
5. Confirm transaction

**Expected:**
- ✅ Same flow as buying
- ✅ Holdings decrease
- ✅ SOL balance increases
- ✅ Transaction recorded

---

## Test Flow 7: Network (Partial - InvitesPanel Not Wired Yet)

### 7.1 Network Page
**URL:** http://localhost:3001/network

**Steps:**
1. Navigate to Network page
2. Observe curve activation focus

**Expected:**
- ✅ Page loads without errors
- ✅ Shows network connections (if any)
- ✅ InvitesPanel may not be functional yet (OK for now)

**Note:** InvitesPanel callbacks not wired in current version (see WIRING_COMPLETE.md)

---

## Test Flow 8: Error Handling & UX Polish

### 8.1 Toast Notifications
**Test all scenarios:**

1. **Vote without auth** → Yellow warning toast
2. **Vote fails (network)** → Red error toast with message
3. **Comment without auth** → Red error toast
4. **Comment fails** → Red error toast with message
5. **Comment succeeds** → Green success toast

**Expected:**
- ✅ All toasts non-blocking
- ✅ Auto-dismiss after ~5 seconds
- ✅ Can stack multiple toasts
- ✅ Smooth fade-in/fade-out animations
- ✅ Toast position consistent (top-right typically)

---

### 8.2 Loading Skeletons
**Test scenarios:**

1. **Comments drawer** → 3 skeleton cards while loading
2. **Vote button** → Already has loading state (spinner/opacity)

**Expected:**
- ✅ Skeletons appear immediately (no blank state)
- ✅ Pulse animation smooth
- ✅ Skeletons match actual content structure
- ✅ Replace with real content smoothly

---

## Test Flow 9: Hydration & Environment

### 9.1 No Hydration Errors
**Steps:**
1. Open browser DevTools console
2. Navigate to any page
3. Watch for React hydration errors

**Expected:**
- ✅ No "Text content did not match" errors
- ✅ No "Hydration failed" errors
- ✅ `suppressHydrationWarning` working in LiveSection

**Fixed in:** [components/landing/LiveSection.tsx:54](components/landing/LiveSection.tsx#L54)

---

### 9.2 Environment Variables
**Verify all env vars loaded:**

```bash
# Check .env.local file has:
NEXT_PUBLIC_PRIVY_APP_ID=cmfsej8w7013cle0df5ottcj6
PRIVY_APP_SECRET=...
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_APPWRITE_ENDPOINT=...
NEXT_PUBLIC_APPWRITE_PROJECT_ID=...
```

**Expected:**
- ✅ No env var errors in console
- ✅ Privy initializes correctly
- ✅ Appwrite connects successfully
- ✅ Solana RPC accessible

---

## Test Flow 10: Mobile Responsiveness

### 10.1 Responsive UI
**Test on different screen sizes:**

1. Desktop (1920x1080)
2. Tablet (768x1024)
3. Mobile (375x667)

**Components to test:**
- TopNav → Hamburger menu on mobile?
- CommentsDrawer → Full width on mobile, 400px on desktop
- VoteButton → Proper sizing
- SubmitLaunchDrawer → Responsive form

**Expected:**
- ✅ All components responsive
- ✅ No horizontal scroll
- ✅ Touch targets large enough (44px min)
- ✅ Text readable without zoom

---

## Bug Tracking Template

```markdown
## Bug Report

**Title:** [Short description]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
-

**Actual Behavior:**
-

**Environment:**
- Browser:
- OS:
- Dev Server: http://localhost:3001
- Authenticated: Yes/No

**Console Errors:**
```
[Paste errors here]
```

**Screenshots:**
[Attach if helpful]

**Priority:** High / Medium / Low
```

---

## Success Criteria Summary

✅ **Authentication**
- Connect wallet works
- User synced to Appwrite
- Avatar menu functional

✅ **LIVE Feature**
- Nav link visible
- Page accessible

✅ **Launch Submission**
- Form validates
- Submits to Appwrite
- Redirects to detail page

✅ **Voting**
- Vote/unvote works
- Persists after refresh
- Toast notifications instead of alerts
- Disabled when not authenticated

✅ **Comments**
- Drawer opens smoothly
- Loading skeletons appear
- Comments load from database
- Add comment works
- Toast notifications
- Persists after refresh

✅ **Trading**
- Buy/sell keys works (already tested)
- Solana transactions successful

✅ **UX Polish**
- No alert() dialogs
- Toast notifications everywhere
- Loading skeletons for smooth UX
- No hydration errors

---

## Known Issues (Expected)

1. **InvitesPanel** - Not wired yet (planned for future)
2. **ConnectionCard callbacks** - Not wired yet
3. **Settings page** - May not exist (404 OK)
4. **Real-time subscriptions** - Comments don't update live (refresh needed)

---

## Next Steps After Testing

1. Document all bugs found
2. Prioritize critical issues
3. Fix bugs iteratively
4. Re-test affected flows
5. Prepare for staging deployment

---

**Testing Completed:** [Date]
**Tester:** [Name]
**Status:** [Pass / Fail / Partial]
**Notes:** [Any observations]

---

**Last Updated:** 2025-10-20
**Dev Server:** http://localhost:3001
**Ready For:** User Acceptance Testing (UAT)
