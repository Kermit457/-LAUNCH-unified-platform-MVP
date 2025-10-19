# Auto-CCM Creation System - Implementation Guide

## 🎯 Final Simplified Flow

Every user automatically gets a Creator Curve (CCM) when they sign up via Twitter/Privy. The curve starts **inactive** and becomes **active** when they buy 10 of their own keys.

---

## ✨ User Journey

### Step 1: Login with Twitter (Privy)
- ✅ Auto-authenticated via Privy
- ✅ Avatar automatically pulled from Twitter
- ✅ CCM curve auto-created with status `inactive`
- 🚪 Activation modal pops up immediately

### Step 2: Buy 10 of Your Own Keys
- User sees modal: "Buy 10 of your own keys to unlock the platform"
- User purchases their own keys (proves commitment)
- Progress bar shows: 0/10 → 10/10

### Step 3: Platform Unlocked! 🎉
Once 10 keys purchased:
- ✅ Curve status changes: `inactive` → `active`
- ✅ Visible in Discover feed
- ✅ Can comment & upvote on projects
- ✅ Can collaborate on launches
- ✅ Can launch own projects
- ✅ Can participate in Earn campaigns
- ✅ Can receive airdrops & rewards

**Anti-Rug Protection:**
- Others can buy the user's keys anytime (even when inactive)
- But the user can't sell their own keys until they own 10+
- Locks creator commitment to their own curve

---

## 🗄️ Database Schema (Appwrite)

### Users Collection
```typescript
{
  userId: string          // Primary key
  displayName?: string    // From Twitter
  avatar?: string         // From Twitter
  bio?: string
  twitter?: string        // Auto-linked via Privy

  curveId: string         // 🆕 Reference to auto-created CCM

  createdAt: timestamp
}
```

### Curves Collection
```typescript
{
  curveId: string         // Primary key
  ownerId: string         // User who owns this curve
  type: 'icm' | 'ccm' | 'meme'
  status: 'inactive' | 'active' | 'frozen' | 'launched'  // 🆕

  // Basic info
  title: string           // e.g., "@username"
  ticker: string          // e.g., "$USER"
  logoUrl?: string        // Twitter avatar
  description?: string

  // Activation
  activatedAt?: timestamp  // 🆕 When curve was activated

  // Trading data
  keysSupply: number
  currentPrice: number
  holders: Map<userId, keyCount>

  // ... rest of curve data
}
```

### Keys/Transactions Collection
```typescript
{
  transactionId: string
  curveId: string
  buyerId: string
  keyCount: number
  price: number
  timestamp: number
}
```

---

## 🔧 Implementation

### 1. Auto-Create Curve on Signup

```typescript
// app/api/auth/callback/route.ts
import { databases } from '@/lib/appwrite/config'
import { ID } from 'appwrite'

async function handleNewUser(privyUser: any) {
  const userId = privyUser.id
  const twitterData = privyUser.twitter // Avatar, username from Privy

  try {
    // 1. Create user profile
    const user = await databases.createDocument(
      DATABASE_ID,
      'users',
      userId,
      {
        userId,
        displayName: twitterData.username,
        avatar: twitterData.profilePictureUrl,
        twitter: twitterData.username,
        createdAt: Date.now()
      }
    )

    // 2. Auto-create CCM curve (INACTIVE)
    const curve = await databases.createDocument(
      DATABASE_ID,
      'curves',
      ID.unique(),
      {
        ownerId: userId,
        type: 'ccm',
        status: 'inactive',  // 🔥 Starts inactive

        // Default values
        title: `@${twitterData.username}`,
        ticker: `$${twitterData.username.slice(0, 5).toUpperCase()}`,
        logoUrl: twitterData.profilePictureUrl,
        description: 'Creator curve - Buy 10 keys to activate',

        // Initial state
        keysSupply: 0,
        currentPrice: 0, // Set initial price based on bonding curve
        holders: {},

        createdAt: Date.now()
      }
    )

    // 3. Link curve to user
    await databases.updateDocument(
      DATABASE_ID,
      'users',
      userId,
      { curveId: curve.$id }
    )

    console.log('✅ User and curve created:', { userId, curveId: curve.$id })

  } catch (error) {
    console.error('❌ Failed to create user/curve:', error)
    throw error
  }
}
```

### 2. Check Activation Status (Frontend Hook)

```typescript
// hooks/useCurveActivation.ts
import { useState, useEffect } from 'react'
import { useUser } from './useUser'
import { databases } from '@/lib/appwrite/config'
import { Query } from 'appwrite'

export function useCurveActivation() {
  const { userId, user } = useUser()
  const [progress, setProgress] = useState({
    hasMinKeys: false,
    currentKeys: 0,
    minKeysRequired: 10,
    isActive: false,
    curveId: ''
  })
  const [loading, setLoading] = useState(true)
  const [showActivationModal, setShowActivationModal] = useState(false)

  useEffect(() => {
    async function checkActivation() {
      if (!userId || !user?.curveId) return

      try {
        // 1. Get user's curve
        const curve = await databases.getDocument(
          DATABASE_ID,
          'curves',
          user.curveId
        )

        // 2. Count keys owned by user of their own curve
        const keysOwned = curve.holders?.[userId] || 0

        // 3. Check if activated
        const hasMinKeys = keysOwned >= 10
        const isActive = curve.status === 'active'

        setProgress({
          hasMinKeys,
          currentKeys: keysOwned,
          minKeysRequired: 10,
          isActive,
          curveId: user.curveId
        })

        // Auto-show modal on first login if not activated
        const hasSeenOnboarding = localStorage.getItem(`onboarding_${userId}`)
        if (!isActive && !hasSeenOnboarding) {
          setShowActivationModal(true)
          localStorage.setItem(`onboarding_${userId}`, 'true')
        }

      } catch (error) {
        console.error('Failed to check activation:', error)
      } finally {
        setLoading(false)
      }
    }

    checkActivation()
  }, [userId, user])

  const activateCurve = async () => {
    if (!user?.curveId || !progress.hasMinKeys) return

    try {
      // Update curve status to active
      await databases.updateDocument(
        DATABASE_ID,
        'curves',
        user.curveId,
        {
          status: 'active',
          activatedAt: Date.now()
        }
      )

      setProgress(prev => ({ ...prev, isActive: true }))
      setShowActivationModal(false)

      // TODO: Show success toast

    } catch (error) {
      console.error('Failed to activate curve:', error)
      throw error
    }
  }

  return {
    progress,
    loading,
    showActivationModal,
    setShowActivationModal,
    activateCurve,
    canActivate: progress.hasMinKeys,
    isActivated: progress.isActive
  }
}
```

### 3. Buy Keys Transaction (Auto-Activate)

```typescript
// lib/solana/buyKeys.ts
async function buyKeys(curveId: string, buyerId: string, amount: number) {
  try {
    // 1. Execute Solana transaction
    const signature = await executeSolanaTransaction(...)

    // 2. Update curve in database
    const curve = await databases.getDocument(DATABASE_ID, 'curves', curveId)

    const currentHoldings = curve.holders?.[buyerId] || 0
    const newHoldings = currentHoldings + amount

    await databases.updateDocument(
      DATABASE_ID,
      'curves',
      curveId,
      {
        holders: {
          ...curve.holders,
          [buyerId]: newHoldings
        },
        keysSupply: curve.keysSupply + amount
      }
    )

    // 3. Check if user just activated their own curve
    const isOwnCurve = curve.ownerId === buyerId
    const wasInactive = curve.status === 'inactive'
    const nowHasEnough = newHoldings >= 10

    if (isOwnCurve && wasInactive && nowHasEnough) {
      // 🎉 AUTO-ACTIVATE!
      await databases.updateDocument(
        DATABASE_ID,
        'curves',
        curveId,
        {
          status: 'active',
          activatedAt: Date.now()
        }
      )

      console.log('🎉 Curve auto-activated!')
      // TODO: Show celebration toast/confetti
    }

    return { signature, newHoldings }

  } catch (error) {
    console.error('Buy keys failed:', error)
    throw error
  }
}
```

### 4. Frontend Integration Example

```typescript
// app/network/page.tsx
'use client'

import { useCurveActivation } from '@/hooks/useCurveActivation'
import { ActivateCurveModal } from '@/components/onboarding/ActivateCurveModal'
import { InactiveCurveBanner } from '@/components/onboarding/InactiveCurveBanner'
import { PlatformAccessGate } from '@/components/onboarding/PlatformAccessGate'

export default function NetworkPage() {
  const {
    progress,
    loading,
    showActivationModal,
    setShowActivationModal,
    activateCurve,
    isActivated
  } = useCurveActivation()

  return (
    <div className="p-8">
      {/* Show banner if not activated */}
      {!loading && !isActivated && (
        <InactiveCurveBanner
          onActivate={() => setShowActivationModal(true)}
          currentKeys={progress.currentKeys}
          minKeysRequired={progress.minKeysRequired}
        />
      )}

      {/* Lock features until activated */}
      <PlatformAccessGate
        isLocked={!isActivated}
        feature="comment"
        onUnlock={() => setShowActivationModal(true)}
      >
        <CommentButton />
      </PlatformAccessGate>

      {/* Activation modal */}
      <ActivateCurveModal
        isOpen={showActivationModal}
        onClose={() => setShowActivationModal(false)}
        onActivate={activateCurve}
        userId={userId}
        progress={progress}
      />
    </div>
  )
}
```

---

## 🔒 Access Control Rules

### Discover Page
```typescript
// Only show ACTIVE curves
const discoverQuery = Query.equal('status', 'active')
```

### User Profile
```typescript
// Owner can see their own inactive curve with activation CTA
if (curve.ownerId === currentUserId) {
  // Show curve + activation banner
} else if (curve.status !== 'active') {
  // Show 404
}
```

### Feature Gating (Comments, Upvotes, Launches)
```typescript
const canInteract = userCurve?.status === 'active'

if (!canInteract) {
  // Show lock message + activation CTA
}
```

---

## 🎨 UI Components

### 1. **ActivateCurveModal**
Full-screen modal that appears on first login:
- Shows progress: 0/10 keys
- "Buy My Keys" button
- Lists what unlocks when activated

**Location:** `components/onboarding/ActivateCurveModal.tsx`

### 2. **InactiveCurveBanner**
Banner that shows on dashboard when curve is inactive:
- Keys owned progress bar
- Lists locked features
- "Buy Keys" CTA

**Location:** `components/onboarding/InactiveCurveBanner.tsx`

### 3. **PlatformAccessGate**
Wrapper component that locks features:
```tsx
<PlatformAccessGate
  isLocked={!isActivated}
  feature="launch projects"
  onUnlock={openModal}
>
  <LaunchButton />
</PlatformAccessGate>
```

**Location:** `components/onboarding/PlatformAccessGate.tsx`

---

## 🚀 Migration Plan (Existing Users)

For users who already exist without auto-created curves:

```typescript
// scripts/migrate-existing-users.ts
async function migrateExistingUsers() {
  // 1. Get all users without curveId
  const users = await databases.listDocuments(
    DATABASE_ID,
    'users',
    [Query.isNull('curveId')]
  )

  // 2. Create CCM for each
  for (const user of users.documents) {
    const curve = await databases.createDocument(
      DATABASE_ID,
      'curves',
      ID.unique(),
      {
        ownerId: user.userId,
        type: 'ccm',
        status: 'inactive',
        title: `@${user.displayName}`,
        ticker: `$${user.displayName.slice(0, 5).toUpperCase()}`,
        logoUrl: user.avatar,
        description: 'Creator curve - Buy 10 keys to activate',
        keysSupply: 0,
        currentPrice: 0,
        holders: {},
        createdAt: Date.now()
      }
    )

    // 3. Link to user
    await databases.updateDocument(
      DATABASE_ID,
      'users',
      user.$id,
      { curveId: curve.$id }
    )

    console.log(`✅ Migrated user ${user.userId}`)
  }
}
```

---

## ✅ Testing Checklist

### Signup Flow
- [ ] New user signs up via Privy Twitter
- [ ] User profile created with Twitter data
- [ ] CCM curve auto-created with `status: inactive`
- [ ] Activation modal appears immediately

### Activation Flow
- [ ] User buys 1 key → Progress shows 1/10
- [ ] User buys 9 more keys → Progress shows 10/10
- [ ] Curve status changes to `active` automatically
- [ ] User can now comment, upvote, launch, earn
- [ ] Curve appears in Discover feed

### Access Control
- [ ] Inactive users cannot comment → See lock message
- [ ] Inactive users cannot upvote → See lock message
- [ ] Inactive users cannot launch → See lock message
- [ ] Inactive users can browse and view projects
- [ ] Others can buy inactive user's keys

### Edge Cases
- [ ] User closes modal → Can access via banner later
- [ ] User logs out before activation → Modal reappears on next login
- [ ] Network error during activation → Graceful error handling

---

## 📊 Analytics to Track

1. **Activation Rate**: % of users who activate within 24h
2. **Time to Activation**: Average time from signup to first 10 keys
3. **Drop-off Points**: Where users abandon activation flow
4. **Locked Feature Clicks**: Which locked features users try to access most

---

## 🔮 Future Enhancements

### Multiple Curves Per User
Allow users to create additional ICM/MEME curves while keeping their CCM:
```typescript
{
  primaryCurveId: string,  // Their CCM (for activation check)
  ownedCurves: string[]    // All curves they own (ICM, MEME, CCM)
}
```

### Dynamic Activation Requirements
Adjust based on platform growth:
```typescript
{
  minKeysRequired: getActivationThreshold(userSignupDate)
  // Early users: 5 keys
  // Later users: 10 keys
}
```

### Referral Bonuses
Users who refer others get keys toward activation:
```typescript
{
  referralKeys: 2,  // Counts toward 10 key requirement
  purchasedKeys: 8
}
```

---

## 🎯 Summary

**Simplest possible flow:**
1. Login with Twitter → CCM auto-created (inactive)
2. Buy 10 of your own keys → Curve activated
3. Platform unlocked (comment, upvote, launch, earn)

**Why this works:**
- ✅ Zero decision paralysis (automatic)
- ✅ Skin in the game (bought own keys)
- ✅ Anti-rug protection (creator committed)
- ✅ Quality control (inactive curves hidden)
- ✅ Network effects (everyone participates)
- ✅ Clear value prop (unlock all features)

**Implementation priority:**
1. Auto-create curve on signup
2. Check activation in frontend hook
3. Lock features with PlatformAccessGate
4. Auto-activate on 10th key purchase
5. Show Discover only active curves