# Real-time Features Testing Guide

## Overview
Phase 1 & 2 real-time features have been successfully wired up to the UI:
- ✅ Real-time comments on launch detail pages (`useComments`)
- ✅ Live launch updates on explore page (`useLiveLaunches`)
- ✅ Real-time vote counting on launch cards (`useRealtimeVotes`)

## How to Test

### Prerequisites
1. Start the dev server: `npm run dev`
2. Make sure you're logged in (click Connect button and authenticate with Twitter via Privy)
3. Have Appwrite dashboard open in another tab to manually create/update documents

---

## Test 1: Real-time Comments

### What Was Implemented
- File: `app/launch/[id]/page.tsx` (lines 203-288)
- Hook: `hooks/useComments.ts`
- Features:
  - Automatic comment loading
  - Real-time comment creation (WebSocket subscription)
  - Real-time comment updates (upvotes)
  - Real-time comment deletion
  - Enter key support for submitting comments
  - LIVE indicator badge

### Testing Steps

#### A) Test Comment Creation
1. Navigate to any launch detail page (e.g., `/launch/[launchId]`)
2. Look for the Comments section with a green "LIVE" badge
3. Type a comment in the input field
4. Press Enter or click the Send button
5. **Expected Result**: Your comment should appear immediately in the list below

#### B) Test Real-time Updates (Two Browser Tabs)
1. Open the same launch detail page in two browser tabs
2. In Tab 1: Add a comment
3. In Tab 2: **Expected Result**: The comment should appear automatically without refreshing
4. In Tab 1: Click the upvote (heart) button on any comment
5. In Tab 2: **Expected Result**: The upvote count should update in real-time

#### C) Test Appwrite Dashboard Integration
1. Open Appwrite dashboard → Databases → Comments collection
2. Manually create a new comment document with these fields:
   ```json
   {
     "launchId": "your-launch-id",
     "userId": "test-user-id",
     "username": "Test User",
     "userAvatar": "https://api.dicebear.com/7.x/avatars/svg?seed=test",
     "content": "This is a test comment from Appwrite dashboard",
     "upvotes": 0,
     "createdAt": "2025-10-08T00:00:00.000Z"
   }
   ```
3. **Expected Result**: The comment should appear in the UI immediately

#### D) Test Loading & Error States
1. Navigate to a launch that doesn't exist: `/launch/invalid-id`
2. **Expected Result**: Should show loading spinner, then error handling
3. Check console for any errors

---

## Test 2: Live Launches on Explore Page

### What Was Implemented
- File: `app/explore/page.tsx` (lines 19-31, 94-97)
- Hook: `hooks/useLiveLaunches.ts`
- Features:
  - Fetches live launches with `status: 'live'`
  - Real-time updates when launches are created/updated/deleted
  - Automatic UI refresh without manual state management
  - LIVE indicator badge in header

### Testing Steps

#### A) Test Initial Load
1. Navigate to `/explore`
2. **Expected Result**:
   - Green "LIVE" badge appears next to the "Launch" heading
   - Launches load automatically
   - Stats bar shows accurate counts
   - Loading skeleton appears while fetching

#### B) Test Real-time Launch Creation (Two Tabs)
1. Open `/explore` in two browser tabs
2. Go to Appwrite dashboard → Databases → Launches collection
3. Create a new launch document with `status: 'live'`
4. **Expected Result**:
   - Tab 1: New launch appears at the top of the list automatically
   - Tab 2: New launch appears at the top of the list automatically
   - No page refresh needed!
   - Stats bar updates (Total Launches, Live Now counts)

#### C) Test Real-time Launch Updates
1. While on `/explore`, keep the page open
2. In Appwrite dashboard, update an existing launch:
   - Change `tokenName` or `description`
   - Update `votes` count
   - Modify any field
3. **Expected Result**: The launch card should update in real-time

#### D) Test Real-time Launch Deletion
1. While on `/explore`, keep the page open
2. In Appwrite dashboard, either:
   - Delete a launch document, OR
   - Change `status` from `'live'` to `'upcoming'`
3. **Expected Result**: The launch should disappear from the list automatically

---

## Test 3: Real-time Vote Counting

### What Was Implemented
- File: `components/ProjectCard.tsx` (lines 26-32, 93-118, 160-169)
- Hook: `hooks/useRealtimeVotes.ts`
- Features:
  - Real-time vote count updates via WebSocket
  - Toggle vote functionality (add/remove)
  - Visual feedback when user has voted (highlighted button)
  - Prevents duplicate voting
  - Loading state while vote is processing
  - Automatic sync across all open tabs

### Testing Steps

#### A) Test Vote Toggle (Single Tab)
1. Navigate to `/explore` page
2. Find a launch card (look for the rocket icon 🚀)
3. Click the upvote button (arrow icon) in the left rail
4. **Expected Result**:
   - Button becomes highlighted (fuchsia color)
   - Vote count increases by 1
   - Arrow icon fills with fuchsia color
   - Stats badge below token logo also highlights
5. Click the upvote button again
6. **Expected Result**:
   - Button returns to normal color
   - Vote count decreases by 1
   - Highlight removed from both button and badge

#### B) Test Real-time Vote Sync (Two Tabs)
1. Open `/explore` in two browser tabs
2. In Tab 1: Click upvote on a launch
3. In Tab 2: **Expected Result**:
   - Vote count updates automatically
   - Button highlights if it's your vote
   - No page refresh needed
4. In Tab 2: Click upvote on the same launch
5. **Expected Result in both tabs**: Vote toggles off, count decreases

#### C) Test Vote Persistence
1. Upvote a launch on `/explore`
2. Navigate away to another page
3. Come back to `/explore`
4. **Expected Result**:
   - Your vote is still highlighted
   - Vote count is correct
   - State persisted via Appwrite

#### D) Test Authentication Required
1. Log out (if logged in)
2. Try to click upvote on a launch
3. **Expected Result**:
   - Console shows error: "You must be logged in to vote"
   - Vote count doesn't change
   - No API call made

#### E) Test Duplicate Vote Prevention
1. Log in and vote on a launch
2. Open Appwrite dashboard
3. Try to manually create another vote document for the same launch + user
4. **Expected Result**:
   - API should reject duplicate vote
   - Vote count remains correct

#### F) Test Vote Count Accuracy
1. Open a fresh launch card (no votes yet)
2. In Appwrite dashboard, create 3 vote documents:
   ```json
   { "launchId": "launch-123", "userId": "user-1", "voteId": "vote-1" }
   { "launchId": "launch-123", "userId": "user-2", "voteId": "vote-2" }
   { "launchId": "launch-123", "userId": "user-3", "voteId": "vote-3" }
   ```
3. **Expected Result**: Launch card shows vote count of 3

---

## Test 4: Verify WebSocket Connections

### Check Browser DevTools
1. Open Chrome DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Navigate to `/explore` or a launch detail page
4. **Expected Result**: You should see active WebSocket connections to Appwrite:
   - `wss://cloud.appwrite.io/v1/realtime?project=...`
   - Connection status: "101 Switching Protocols"
   - Frames showing incoming/outgoing messages
   - You should see 3 active subscriptions:
     - Launches collection (for live launch updates)
     - Comments collection (for real-time comments)
     - Votes collection (for real-time vote updates)

### Check Console Logs
1. Open DevTools → Console
2. Navigate to a launch detail page
3. Add a comment
4. **Expected Result**: You should see logs like:
   ```
   useComments - userId: [user-id]
   useComments - name: [username]
   useComments - calling createComment with: {...}
   useComments - createComment succeeded
   ```

---

## Known Issues & Troubleshooting

### Issue: Comments not appearing
- **Cause**: Not logged in
- **Solution**: Click "Connect" button and authenticate with Twitter via Privy

### Issue: "You must be logged in to comment" error
- **Cause**: `useUser` hook not returning valid user data
- **Check**: Open console, look for authentication errors
- **Solution**: Re-authenticate or check Privy configuration

### Issue: Real-time updates not working
- **Cause**: WebSocket connection failed
- **Check**: Network tab → WS connections
- **Solution**:
  1. Check Appwrite environment variables in `.env.local`
  2. Verify Appwrite project ID is correct
  3. Check if Appwrite Realtime API is enabled in your project settings

### Issue: Launch not found error
- **Cause**: Launch ID doesn't exist in Appwrite
- **Solution**: Create test launches in Appwrite dashboard or use existing IDs

---

## Next Steps After Testing

Once you've confirmed real-time features are working:

### Phase 3: Additional Real-time Features (Optional)
- Real-time activities feed
- Real-time messages/chat
- Live user presence indicators
- Toast notifications for real-time events

---

## Success Criteria

✅ **Comments Section**:
- Comments load automatically
- New comments appear in real-time across all open tabs
- Upvotes update live
- Enter key submits comments
- LIVE badge is visible

✅ **Explore Page**:
- Launches load with loading skeleton
- New launches appear automatically
- Launch updates reflect immediately
- LIVE badge is visible
- Stats update in real-time

✅ **Vote Counting**:
- Votes toggle on/off correctly
- Vote counts sync across all tabs in real-time
- Visual feedback when user has voted (fuchsia highlight)
- Duplicate votes prevented
- Authentication required to vote
- Votes persist after navigation

✅ **Performance**:
- No page freezing
- Smooth animations
- WebSocket connections stable
- No memory leaks (check with long sessions)
- Vote buttons responsive (no lag)

---

## Code Reference

### Real-time Subscription Pattern (Appwrite)
```typescript
// Subscribe to a collection
const unsubscribe = client.subscribe(
  [`databases.${DB_ID}.collections.${COLLECTION_ID}.documents`],
  (response) => {
    if (response.events.includes('*.create')) {
      // Handle create
    } else if (response.events.includes('*.update')) {
      // Handle update
    } else if (response.events.includes('*.delete')) {
      // Handle delete
    }
  }
)

// Cleanup on unmount
return () => unsubscribe()
```

### Files Modified
1. **[app/launch/[id]/page.tsx](app/launch/[id]/page.tsx)** - Added real-time comments UI
2. **[app/explore/page.tsx](app/explore/page.tsx)** - Switched to `useLiveLaunches` hook
3. **[components/ProjectCard.tsx](components/ProjectCard.tsx)** - Added real-time votes integration
4. **[hooks/useComments.ts](hooks/useComments.ts)** - Pre-existing, now wired to UI
5. **[hooks/useLiveLaunches.ts](hooks/useLiveLaunches.ts)** - Pre-existing, now wired to UI
6. **[hooks/useRealtimeVotes.ts](hooks/useRealtimeVotes.ts)** - NEW - Real-time vote tracking hook

---

## Questions?

If real-time features are working correctly, next steps:
1. ✅ Mark Phase 1 & 2 as complete
2. 🎨 Add animations/transitions for real-time updates (e.g., flash animation when vote count changes)
3. 📊 Add analytics tracking for real-time interactions
4. 🔔 Add toast notifications for real-time events (optional)
5. 🎯 Phase 3: Additional real-time features (activities feed, messages, presence)
