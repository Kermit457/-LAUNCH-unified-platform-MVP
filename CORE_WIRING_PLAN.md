# Core Features Wiring Plan - Production Ready

**Generated:** 2025-10-20
**Focus:** ONLY core features in main navigation
**Estimated Effort:** 4-6 hours

---

## Core Features (Main Navigation)

From `config/nav.ts`:
1. **Discover** - Curve discovery & trading ✅ (Trading already wired)
2. **Launch** - Launch creator ⚠️ (Needs wiring)
3. **Earn** - Earnings dashboard ⚠️ (Needs review)
4. **Live** - Live streaming ⚠️ (Needs review)
5. **Network** - Social network ⚠️ (Needs wiring)

---

## PRIORITY 1: Critical Fixes (2 hours)

### 1.1 Fix VoteButton (30 mins) 🔴

**File:** `components/VoteButton.tsx`
**Service:** `lib/appwrite/services/votes.ts` (exists)
**Status:** Has TODO comment, only updates local state

**Implementation:**

```typescript
// File: components/VoteButton.tsx
'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { addVote, removeVote, getVoteCount, hasUserVoted } from '@/lib/appwrite/services/votes'
import { useWallet } from '@/contexts/WalletContext'

export function VoteButton({ projectId, initialVotes = 0 }) {
  const { userInfo } = useWallet()
  const userId = userInfo?.id

  const [votes, setVotes] = useState(initialVotes)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    async function checkVote() {
      const voted = await hasUserVoted(projectId, userId)
      setHasVoted(voted)
      const count = await getVoteCount(projectId)
      setVotes(count)
    }
    checkVote()
  }, [projectId, userId])

  const handleVote = async () => {
    if (!userId) return
    setLoading(true)
    try {
      if (hasVoted) {
        await removeVote(projectId, userId)
        setVotes(prev => prev - 1)
        setHasVoted(false)
      } else {
        await addVote(projectId, userId)
        setVotes(prev => prev + 1)
        setHasVoted(true)
      }
    } catch (error) {
      console.error('Vote error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading || !userId}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        hasVoted ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-zinc-400 hover:border-red-500/30'
      }`}
    >
      <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
      <span>{votes}</span>
    </button>
  )
}
```

---

### 1.2 Wire SubmitLaunchDrawer (1 hour) 🔴

**File:** `app/launch/page.tsx`
**Service:** `lib/appwrite/services/launches.ts` (exists)
**Status:** Frontend complete, needs parent integration

**Implementation:**

```typescript
// File: app/launch/page.tsx
'use client'

import { useState } from 'react'
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer'
import { createLaunchDocument } from '@/lib/appwrite/services/launches'
import { uploadLogo } from '@/lib/appwrite/storage'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'

export default function LaunchPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { userInfo } = useWallet()
  const router = useRouter()

  const handleSubmitLaunch = async (formData: any) => {
    if (!userInfo?.id) return

    try {
      // Upload logo if provided
      let logoUrl = formData.logo
      if (formData.logoFile) {
        logoUrl = await uploadLogo(formData.logoFile)
      }

      // Create launch
      const launch = await createLaunchDocument({
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        logo: logoUrl,
        ticker: formData.ticker || formData.title.substring(0, 4).toUpperCase(),
        scope: formData.scope,
        status: 'active',
        platforms: formData.platforms || [],
        creatorId: userInfo.id,
        targetRaise: formData.economics?.targetRaise || 0,
        currentRaise: 0,
        marketCap: 0,
        price: 0,
        holders: 0,
        volume24h: 0,
        change24h: 0,
        featured: false,
        verified: false,
        votesCount: 0,
        commentsCount: 0,
        viewsCount: 0,
      })

      setDrawerOpen(false)
      router.push(`/launch/${launch.$id}`)
    } catch (error) {
      console.error('Failed to create launch:', error)
    }
  }

  return (
    <div>
      <button onClick={() => setDrawerOpen(true)}>
        Submit Launch
      </button>
      <SubmitLaunchDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmitLaunch}
      />
    </div>
  )
}
```

---

### 1.3 Wire Network Invites (30 mins) 🔴

**File:** `app/network/page.tsx`
**Service:** `lib/appwrite/services/network.ts` (exists)
**Status:** UI complete, needs callbacks

**Implementation:**

```typescript
// File: app/network/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { InvitesPanel } from '@/components/network/InvitesPanel'
import { getNetworkInvites, acceptNetworkInvite, rejectNetworkInvite } from '@/lib/appwrite/services/network'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'

export default function NetworkPage() {
  const { userInfo } = useWallet()
  const router = useRouter()
  const [invites, setInvites] = useState([])

  useEffect(() => {
    if (!userInfo?.id) return
    async function fetchInvites() {
      const data = await getNetworkInvites(userInfo.id)
      setInvites(data)
    }
    fetchInvites()
  }, [userInfo?.id])

  const handleAccept = async (inviteId: string) => {
    await acceptNetworkInvite(inviteId)
    setInvites(prev => prev.filter(inv => inv.$id !== inviteId))
  }

  const handleDecline = async (inviteId: string) => {
    await rejectNetworkInvite(inviteId)
    setInvites(prev => prev.filter(inv => inv.$id !== inviteId))
  }

  const handleChat = (userId: string) => {
    router.push(`/chat/${userId}`)
  }

  return (
    <InvitesPanel
      invites={invites}
      onAccept={handleAccept}
      onDecline={handleDecline}
      onChat={handleChat}
    />
  )
}
```

---

## PRIORITY 2: Comments & Social (2 hours)

### 2.1 Wire CommentsDrawer (1 hour) 🟡

**File:** `components/CommentsDrawer.tsx`
**Service:** `lib/appwrite/services/comments.ts` (exists)

**Implementation:**

```typescript
import { useState, useEffect } from 'react'
import { createComment, getComments } from '@/lib/appwrite/services/comments'
import { useWallet } from '@/contexts/WalletContext'

export function CommentsDrawer({ projectId, open, onClose }) {
  const { userInfo } = useWallet()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (!projectId) return
    async function fetchComments() {
      const data = await getComments(projectId)
      setComments(data)
    }
    fetchComments()
  }, [projectId])

  const handleAddComment = async () => {
    if (!userInfo?.id || !newComment.trim()) return

    const comment = await createComment({
      projectId,
      userId: userInfo.id,
      content: newComment,
      parentId: null,
    })

    setComments([comment, ...comments])
    setNewComment('')
  }

  return (
    <div>
      {/* Comment list */}
      {comments.map(comment => (
        <div key={comment.$id}>{comment.content}</div>
      ))}

      {/* New comment input */}
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={handleAddComment}>Post</button>
    </div>
  )
}
```

---

### 2.2 Wire ShareButton (Already Done) ✅

**File:** `components/ShareButton.tsx`
**Status:** ✅ Fully working (uses Web APIs only)

---

### 2.3 Wire ConnectionCard (30 mins) 🟡

**File:** `components/network/ConnectionCard.tsx`
**Pattern:** Similar to InvitesPanel

```typescript
// Parent component wires these callbacks:
<ConnectionCard
  onChat={(userId) => router.push(`/chat/${userId}`)}
  onViewProfile={(userId) => router.push(`/profile/${userId}`)}
  onMute={async (userId) => {
    await muteConnection(userId)
    // Update UI
  }}
  onRemove={async (userId) => {
    await removeConnection(userId)
    // Update UI
  }}
/>
```

---

## PRIORITY 3: Fix TopNav Links (30 mins)

### 3.1 Fix /wallet Link 🟡

**File:** `components/TopNav.tsx`
**Current:** Links to `/wallet` (doesn't exist)
**Fix:** Redirect to `/discover?view=my-holdings`

```typescript
<MenuItem
  icon={Wallet}
  label="Wallet"
  onClick={() => {
    router.push('/discover?view=my-holdings') // CHANGED
    setAvatarMenuOpen(false)
  }}
/>
```

---

### 3.2 Fix /settings Link 🟡

**File:** `components/TopNav.tsx`
**Current:** Links to `/settings` (doesn't exist)
**Fix:** Redirect to `/dashboard/settings`

```typescript
<MenuItem
  icon={Settings}
  label="Settings"
  onClick={() => {
    router.push('/dashboard/settings') // CHANGED
    setAvatarMenuOpen(false)
  }}
/>
```

---

## Testing Checklist

### VoteButton
- [ ] Vote → Refresh page → Vote persists
- [ ] Vote count increments
- [ ] Remove vote works
- [ ] Loading state shows during async operation
- [ ] Disabled when not authenticated

### SubmitLaunchDrawer
- [ ] Fill form → Submit → Launch created in database
- [ ] Upload logo → Logo URL saved
- [ ] Redirect to launch detail page works
- [ ] Creator can see their launch

### InvitesPanel
- [ ] Accept invite → Connection created
- [ ] Decline invite → Invite removed
- [ ] Chat button → Navigates to chat
- [ ] Bulk actions work

### CommentsDrawer
- [ ] Load comments on open
- [ ] Add comment → Appears in list
- [ ] Comment persists after refresh

### TopNav Links
- [ ] Wallet → Redirects to /discover?view=my-holdings
- [ ] Settings → Redirects to /dashboard/settings

---

## Implementation Order

### Day 1 (2 hours)
1. ✅ Fix VoteButton (30 mins)
2. ✅ Wire SubmitLaunchDrawer (1 hour)
3. ✅ Wire InvitesPanel (30 mins)

### Day 2 (2 hours)
4. ✅ Wire CommentsDrawer (1 hour)
5. ✅ Wire ConnectionCard (30 mins)
6. ✅ Fix TopNav links (30 mins)

### Day 3 (2 hours)
7. ✅ Testing all features
8. ✅ Bug fixes
9. ✅ Polish (loading states, error handling)

---

## Files to Modify (Summary)

**Components:**
1. `components/VoteButton.tsx` - Wire to votes service
2. `components/CommentsDrawer.tsx` - Wire to comments service
3. `components/TopNav.tsx` - Fix wallet/settings links
4. `components/network/ConnectionCard.tsx` - Wire callbacks (via parent)

**Pages:**
5. `app/launch/page.tsx` - Wire SubmitLaunchDrawer
6. `app/network/page.tsx` - Wire InvitesPanel

**Total:** 6 files to modify

---

## What We're NOT Doing (Removed)

❌ Quests - Not in main nav
❌ Bounties - Not in main nav
❌ Raids - Not in main nav
❌ Boosts - Not in main nav
❌ Dashboard widgets - Not critical
❌ Escrow - Not in main nav
❌ Referrals - Complex, separate feature

---

## Success Criteria

✅ **All main nav features work:**
- Discover → Trading works (already done)
- Launch → Can submit new launches
- Network → Can accept/decline invites
- Comments → Can add comments
- Voting → Can upvote launches

✅ **No broken links in TopNav**

✅ **Core user journey complete:**
1. User connects wallet
2. User creates a launch
3. User buys/sells keys (already works)
4. User upvotes other launches
5. User comments on launches
6. User accepts network invites

---

## Estimated Impact

**Before:**
- 2 broken buttons (Vote, Boost)
- 3 incomplete features (Launch submit, Network, Comments)
- 2 broken TopNav links

**After:**
- 0 broken buttons
- All core features wired
- 0 broken links
- Production ready for main flows

**Time:** 4-6 hours
**Complexity:** Low (services exist)
**Risk:** Low (incremental changes)

---

**Next Step:** Start with Priority 1.1 (VoteButton) - 30 mins to ship first fix! 🚀

---

**Last Updated:** 2025-10-20
**Focus:** Core features only
**Status:** Ready to implement
