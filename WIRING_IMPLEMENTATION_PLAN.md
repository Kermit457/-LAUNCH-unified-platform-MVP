# Complete Button Wiring Implementation Plan

**Generated:** 2025-10-20
**Estimated Total Effort:** 10-20 hours
**Priority:** Critical for production readiness

---

## Overview

This document provides step-by-step implementation instructions to wire all interactive elements to Appwrite backend. All Appwrite services exist and are production-ready. The work is primarily connecting frontend callbacks to service functions.

---

## Phase 1: CRITICAL FIXES (2-4 hours)

### 🔴 PRIORITY 1.1: Fix VoteButton (30 mins)

**Problem:** VoteButton only updates local state, has TODO comment
**Service:** `lib/appwrite/services/votes.ts` (already exists)
**Files to Modify:** `components/VoteButton.tsx`

#### Implementation

```typescript
// File: components/VoteButton.tsx
'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { addVote, removeVote, getVoteCount, hasUserVoted } from '@/lib/appwrite/services/votes'
import { useWallet } from '@/contexts/WalletContext'
import { toast } from '@/components/Toast'

interface VoteButtonProps {
  projectId: string
  initialVotes?: number
}

export function VoteButton({ projectId, initialVotes = 0 }: VoteButtonProps) {
  const { userInfo } = useWallet()
  const userId = userInfo?.id

  const [votes, setVotes] = useState(initialVotes)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if user has voted on mount
  useEffect(() => {
    if (!userId) return

    async function checkVote() {
      try {
        const voted = await hasUserVoted(projectId, userId)
        setHasVoted(voted)

        const count = await getVoteCount(projectId)
        setVotes(count)
      } catch (error) {
        console.error('Failed to check vote status:', error)
      }
    }

    checkVote()
  }, [projectId, userId])

  const handleVote = async () => {
    if (!userId) {
      toast.error('Please connect your wallet to vote')
      return
    }

    setLoading(true)

    try {
      if (hasVoted) {
        // Remove vote
        await removeVote(projectId, userId)
        setVotes(prev => prev - 1)
        setHasVoted(false)
        toast.success('Vote removed')
      } else {
        // Add vote
        await addVote(projectId, userId)
        setVotes(prev => prev + 1)
        setHasVoted(true)
        toast.success('Voted!')
      }
    } catch (error) {
      console.error('Vote error:', error)
      toast.error('Failed to vote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading || !userId}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
        ${hasVoted
          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : 'bg-white/5 text-zinc-400 border border-white/10 hover:border-red-500/30'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <Heart
        className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`}
      />
      <span>{votes}</span>
    </button>
  )
}
```

**Testing:**
1. Vote on a launch → Refresh page → Vote persists ✅
2. Upvote count increments correctly ✅
3. Remove vote works ✅
4. Toast notifications appear ✅

---

### 🔴 PRIORITY 1.2: Fix/Enhance BoostButton (1 hour)

**Problem:** Uses localStorage mock instead of Appwrite
**Solution:** Create boosts as weighted votes OR create dedicated collection

**Option A: Use Votes System (Simpler)**

```typescript
// File: components/BoostButton.tsx
'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { addVote } from '@/lib/appwrite/services/votes'
import { useWallet } from '@/contexts/WalletContext'
import { toast } from '@/components/Toast'

interface BoostButtonProps {
  projectId: string
  cost: number
  onBoost?: () => void
}

export function BoostButton({ projectId, cost = 10, onBoost }: BoostButtonProps) {
  const { userInfo, balance } = useWallet()
  const userId = userInfo?.id

  const [loading, setLoading] = useState(false)
  const [boosted, setBoosted] = useState(false)

  const handleBoost = async () => {
    if (!userId) {
      toast.error('Please connect your wallet')
      return
    }

    if (balance < cost) {
      toast.error(`Insufficient balance. Need ${cost} tokens.`)
      return
    }

    setLoading(true)

    try {
      // Create weighted vote (boost = 10x regular vote)
      await addVote(projectId, userId, { weight: 10, type: 'boost' })

      // Deduct balance (implement in wallet service)
      // await deductBalance(userId, cost)

      setBoosted(true)
      toast.success(`Boosted with ${cost} tokens!`)
      onBoost?.()
    } catch (error) {
      console.error('Boost error:', error)
      toast.error('Failed to boost')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBoost}
      disabled={loading || boosted || !userId}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all
        ${boosted
          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <Zap className="w-4 h-4" />
      <span>{boosted ? 'Boosted!' : `Boost (${cost})`}</span>
    </button>
  )
}
```

**Option B: Create Dedicated Boosts Collection (More Control)**

```typescript
// File: lib/appwrite/services/boosts.ts
import { databases, DB_ID } from '@/lib/appwrite/server'
import { ID, Query } from 'node-appwrite'

const BOOSTS_COLLECTION = 'boosts'

export async function createBoost(projectId: string, userId: string, amount: number) {
  return await databases.createDocument(
    DB_ID,
    BOOSTS_COLLECTION,
    ID.unique(),
    {
      projectId,
      userId,
      amount,
      type: 'visibility',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      createdAt: new Date().toISOString(),
    }
  )
}

export async function getProjectBoosts(projectId: string) {
  const now = new Date().toISOString()
  const response = await databases.listDocuments(
    DB_ID,
    BOOSTS_COLLECTION,
    [
      Query.equal('projectId', projectId),
      Query.greaterThan('expiresAt', now),
    ]
  )
  return response.documents
}

export async function getTotalBoostAmount(projectId: string) {
  const boosts = await getProjectBoosts(projectId)
  return boosts.reduce((sum, boost) => sum + boost.amount, 0)
}
```

**Recommendation:** Start with Option A (simpler), upgrade to Option B if needed.

---

### 🔴 PRIORITY 1.3: Wire SubmitLaunchDrawer (1 hour)

**Files to Modify:**
- Pages using `SubmitLaunchDrawer` component
- Common: `app/launch/page.tsx`

#### Implementation

```typescript
// File: app/launch/page.tsx
'use client'

import { useState } from 'react'
import { SubmitLaunchDrawer } from '@/components/launch/SubmitLaunchDrawer'
import { createLaunchDocument } from '@/lib/appwrite/services/launches'
import { uploadLogo } from '@/lib/appwrite/storage'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/Toast'

export default function LaunchPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { userInfo } = useWallet()
  const router = useRouter()

  const handleSubmitLaunch = async (formData: any) => {
    if (!userInfo?.id) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      // Upload logo if provided
      let logoUrl = formData.logo
      if (formData.logoFile) {
        logoUrl = await uploadLogo(formData.logoFile)
      }

      // Create launch document
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
        category: formData.category,
        website: formData.website,
        twitter: formData.twitter,
        discord: formData.discord,
        telegram: formData.telegram,
        featured: false,
        verified: false,
        votesCount: 0,
        commentsCount: 0,
        viewsCount: 0,
      })

      toast.success('Launch created successfully!')
      setDrawerOpen(false)

      // Redirect to launch page
      router.push(`/launch/${launch.$id}`)
    } catch (error) {
      console.error('Failed to create launch:', error)
      toast.error('Failed to create launch. Please try again.')
    }
  }

  return (
    <div>
      <button
        onClick={() => setDrawerOpen(true)}
        className="px-6 py-3 bg-gradient-cyan-green text-black font-bold rounded-xl"
      >
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

**Testing:**
1. Fill form → Submit → Launch appears in database ✅
2. Upload logo → Logo URL saved correctly ✅
3. Redirect to launch detail page ✅
4. Creator can see their launch ✅

---

### 🔴 PRIORITY 1.4: Wire InvitesPanel (1 hour)

**Files to Modify:**
- `app/network/page.tsx` (or wherever InvitesPanel is used)

#### Implementation

```typescript
// File: app/network/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { InvitesPanel } from '@/components/network/InvitesPanel'
import {
  getNetworkInvites,
  acceptNetworkInvite,
  rejectNetworkInvite
} from '@/lib/appwrite/services/network'
import { useWallet } from '@/contexts/WalletContext'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/Toast'

export default function NetworkPage() {
  const { userInfo } = useWallet()
  const router = useRouter()
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch invites on mount
  useEffect(() => {
    if (!userInfo?.id) return

    async function fetchInvites() {
      try {
        const data = await getNetworkInvites(userInfo.id)
        setInvites(data)
      } catch (error) {
        console.error('Failed to fetch invites:', error)
        toast.error('Failed to load invites')
      } finally {
        setLoading(false)
      }
    }

    fetchInvites()
  }, [userInfo?.id])

  const handleAccept = async (inviteId: string) => {
    try {
      await acceptNetworkInvite(inviteId)

      // Remove from list (optimistic update)
      setInvites(prev => prev.filter(inv => inv.$id !== inviteId))

      toast.success('Invite accepted!')
    } catch (error) {
      console.error('Failed to accept invite:', error)
      toast.error('Failed to accept invite')
    }
  }

  const handleDecline = async (inviteId: string) => {
    try {
      await rejectNetworkInvite(inviteId)

      // Remove from list
      setInvites(prev => prev.filter(inv => inv.$id !== inviteId))

      toast.success('Invite declined')
    } catch (error) {
      console.error('Failed to decline invite:', error)
      toast.error('Failed to decline invite')
    }
  }

  const handleChat = (userId: string) => {
    router.push(`/chat/${userId}`)
  }

  const handleBulkAccept = async (inviteIds: string[]) => {
    try {
      await Promise.all(inviteIds.map(id => acceptNetworkInvite(id)))
      setInvites(prev => prev.filter(inv => !inviteIds.includes(inv.$id)))
      toast.success(`Accepted ${inviteIds.length} invites`)
    } catch (error) {
      toast.error('Failed to accept some invites')
    }
  }

  const handleBulkDecline = async (inviteIds: string[]) => {
    try {
      await Promise.all(inviteIds.map(id => rejectNetworkInvite(id)))
      setInvites(prev => prev.filter(inv => !inviteIds.includes(inv.$id)))
      toast.success(`Declined ${inviteIds.length} invites`)
    } catch (error) {
      toast.error('Failed to decline some invites')
    }
  }

  if (loading) return <div>Loading invites...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Network Invites</h1>

      <InvitesPanel
        invites={invites}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onChat={handleChat}
        onBulkAccept={handleBulkAccept}
        onBulkDecline={handleBulkDecline}
      />
    </div>
  )
}
```

**Testing:**
1. Accept invite → Connection created in database ✅
2. Decline invite → Invite marked as declined ✅
3. Bulk actions work correctly ✅
4. Optimistic updates for instant UX ✅

---

## Phase 2: DRAWER/MODAL WIRING (4-8 hours)

### 🟡 PRIORITY 2.1: Wire CreateQuestDrawer (1 hour)

**Service:** `lib/appwrite/services/quests.ts`
**Pattern:** Same as SubmitLaunchDrawer

```typescript
// In parent component
import { createQuest } from '@/lib/appwrite/services/quests'

const handleCreateQuest = async (formData) => {
  const quest = await createQuest({
    title: formData.title,
    description: formData.description,
    creatorId: userInfo.id,
    projectId: formData.projectId,
    type: formData.type,
    targetUrl: formData.targetUrl,
    platforms: formData.platforms,
    rules: formData.rules,
    reward: formData.reward,
    rewardType: formData.rewardType,
    maxCompletions: formData.maxCompletions,
    currentCompletions: 0,
    status: 'active',
    startDate: formData.startDate,
    endDate: formData.endDate,
  })

  toast.success('Quest created!')
  router.push(`/quest/${quest.$id}`)
}
```

---

### 🟡 PRIORITY 2.2: Wire CreateRoomDrawer (1 hour)

**Service:** `lib/appwrite/services/messages.ts`

```typescript
import { createRoom } from '@/lib/appwrite/services/messages'

const handleCreateRoom = async (formData) => {
  const room = await createRoom({
    name: formData.roomName,
    creatorId: userInfo.id,
    projectId: formData.projectId,
    campaignId: formData.campaignId,
    participants: [userInfo.id], // Creator is first participant
  })

  toast.success('Room created!')
  router.push(`/chat/${room.$id}`)
}
```

---

### 🟡 PRIORITY 2.3: Wire ActionCard Callbacks (2 hours)

**Used by:** CampaignCard, RaidCard, BountyCard

```typescript
// In pages using ActionCard/CampaignCard
import { updateCampaign } from '@/lib/appwrite/services/campaigns'

const handleJoin = async (campaignId: string) => {
  // Add user to campaign participants
  await updateCampaign(campaignId, {
    participants: [...campaign.participants, userInfo.id]
  })
  toast.success('Joined campaign!')
}

const handleToggleFav = async (campaignId: string) => {
  // Save to user favorites (could be localStorage or Appwrite)
  // Option 1: localStorage
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
  if (favs.includes(campaignId)) {
    localStorage.setItem('favorites', JSON.stringify(favs.filter(id => id !== campaignId)))
  } else {
    localStorage.setItem('favorites', JSON.stringify([...favs, campaignId]))
  }

  // Option 2: Appwrite (create user_favorites collection)
  // await toggleFavorite(userInfo.id, campaignId)
}
```

---

## Phase 3: COMMENT/CHAT WIRING (2-4 hours)

### 🟡 PRIORITY 3.1: Wire CommentsDrawer

```typescript
import { createComment, getComments } from '@/lib/appwrite/services/comments'

const [comments, setComments] = useState([])

useEffect(() => {
  async function fetchComments() {
    const data = await getComments(projectId)
    setComments(data)
  }
  fetchComments()
}, [projectId])

const handleAddComment = async (content: string) => {
  const comment = await createComment({
    projectId,
    userId: userInfo.id,
    content,
    parentId: replyToId || null,
  })

  setComments(prev => [comment, ...prev])
  toast.success('Comment added!')
}
```

---

### 🟡 PRIORITY 3.2: Wire MessageInput

```typescript
import { sendMessage } from '@/lib/appwrite/services/messages'

const handleSendMessage = async (content: string) => {
  const message = await sendMessage({
    roomId,
    senderId: userInfo.id,
    content,
    type: 'text',
  })

  // Add to local messages (optimistic update)
  setMessages(prev => [...prev, message])
}
```

---

## Phase 4: DASHBOARD WIDGETS (2-4 hours)

### 🟡 PRIORITY 4.1: Wire Dashboard Quick Actions

```typescript
// app/dashboard/page.tsx
<QuickActions
  onCreateCampaign={() => router.push('/campaigns/new')}
  onCreateQuest={() => router.push('/quests/new')}
  onInviteFriend={() => setInviteModalOpen(true)}
  onCheckAnalytics={() => router.push('/dashboard/analytics')}
/>
```

---

### 🟡 PRIORITY 4.2: Wire Network Activity Widget

```typescript
import { getUserActivities, markActivityAsRead } from '@/lib/appwrite/services/activities'

const [activities, setActivities] = useState([])

useEffect(() => {
  async function fetchActivities() {
    const data = await getUserActivities(userInfo.id)
    setActivities(data)
  }
  fetchActivities()
}, [userInfo.id])

const handleMarkAsRead = async (activityId: string) => {
  await markActivityAsRead(activityId)
  setActivities(prev =>
    prev.map(a => a.$id === activityId ? { ...a, read: true } : a)
  )
}
```

---

## Testing Strategy

### Unit Testing (Per Component)

```typescript
// Example: VoteButton.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VoteButton } from './VoteButton'
import { addVote, removeVote } from '@/lib/appwrite/services/votes'

jest.mock('@/lib/appwrite/services/votes')

test('adds vote when clicked', async () => {
  (addVote as jest.Mock).mockResolvedValue({ $id: '123' })

  render(<VoteButton projectId="proj1" initialVotes={10} />)

  const button = screen.getByRole('button')
  fireEvent.click(button)

  await waitFor(() => {
    expect(addVote).toHaveBeenCalledWith('proj1', expect.any(String))
    expect(screen.getByText('11')).toBeInTheDocument()
  })
})
```

### Integration Testing Checklist

For each wired component:

- [ ] **Create** → Item appears in list/database
- [ ] **Read** → Data loads correctly on mount
- [ ] **Update** → Changes persist and reflect in UI
- [ ] **Delete** → Item removed from list/database
- [ ] **Error Handling** → Shows user-friendly error messages
- [ ] **Loading States** → Shows loading indicator during async operations
- [ ] **Optimistic Updates** → UI updates immediately, rolls back on error
- [ ] **Persistence** → Refresh page → Data still there

---

## Rollout Plan

### Week 1: Critical Fixes
- Day 1-2: VoteButton, BoostButton
- Day 3-4: SubmitLaunchDrawer, InvitesPanel
- Day 5: Testing and bug fixes

### Week 2: Drawer Wiring
- Day 1: CreateQuestDrawer, CreateRoomDrawer
- Day 2-3: ActionCard callbacks (campaigns, quests)
- Day 4-5: Dashboard widgets

### Week 3: Comments & Chat
- Day 1-2: CommentsDrawer, CommentItem
- Day 3-4: Chat components (MessageInput, RoomsList)
- Day 5: Testing and polish

### Week 4: Polish & Launch
- Day 1-2: Add loading states everywhere
- Day 3: Error boundaries and fallbacks
- Day 4: Full integration testing
- Day 5: Production deployment

---

## Code Quality Checklist

For every wired component:

### Functionality
- [ ] Calls correct Appwrite service function
- [ ] Passes all required parameters
- [ ] Handles response correctly

### UX
- [ ] Shows loading state during async operations
- [ ] Disables button during loading
- [ ] Shows success toast on completion
- [ ] Shows error toast on failure
- [ ] Optimistic updates for instant feedback

### Error Handling
- [ ] Try/catch around async calls
- [ ] User-friendly error messages
- [ ] Logs error to console for debugging
- [ ] Rollback optimistic updates on error

### Accessibility
- [ ] Disabled state when not available
- [ ] ARIA labels where needed
- [ ] Keyboard accessible
- [ ] Screen reader friendly

### Performance
- [ ] No unnecessary re-renders
- [ ] Debounced user input where appropriate
- [ ] Cached data where possible
- [ ] Cleanup on unmount

---

## Success Metrics

After complete wiring:

### Functional Metrics
- ✅ 100% of buttons call backend
- ✅ 0 console.log placeholders
- ✅ 0 TODO comments
- ✅ All CRUD operations working

### UX Metrics
- ✅ <2s average response time
- ✅ 100% of actions show loading states
- ✅ 100% of errors show user feedback
- ✅ 0 silent failures

### Quality Metrics
- ✅ 100% of async calls have error handling
- ✅ 100% of mutations update UI
- ✅ 100% of forms validated
- ✅ 0 TypeScript errors

---

## Support & Resources

**Documentation:**
- `BUTTON_AUDIT.md` - Full button inventory
- `APPWRITE_SCHEMA_COMPLETE.md` - Database schema
- `lib/appwrite/services/*.ts` - Service implementations

**Example Implementations:**
- `components/BuyKeysButton.tsx` - Fully wired trading button
- `components/SellKeysButton.tsx` - Fully wired trading button
- `components/ShareButton.tsx` - Utility button (no backend)

**Testing:**
- Use Appwrite Console to verify data creation
- Use Solana Explorer to verify blockchain transactions
- Use browser DevTools Network tab to monitor API calls

---

## Conclusion

**Current State:**
- 5 fully wired components
- 150+ callback-based components (services exist)
- 2 broken components (easy fixes)

**After Implementation:**
- 160+ fully wired components
- 0 broken components
- Production-ready platform

**Estimated Effort:** 10-20 hours over 2-4 weeks
**Complexity:** Low-Medium (infrastructure exists, just wiring)
**Risk:** Low (incremental changes, easy rollback)

Let's wire everything and ship! 🚀

---

**Last Updated:** 2025-10-20
**Status:** Ready for implementation
**Next Step:** Begin Phase 1 - Critical Fixes
