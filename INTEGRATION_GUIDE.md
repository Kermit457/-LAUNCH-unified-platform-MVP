# EnhancedLaunchCard - Complete Integration Guide

## Overview

This guide shows how to fully wire the EnhancedLaunchCard with all Appwrite backend features.

---

## 1. Setup Appwrite Collections

First, create all necessary collections:

```bash
# Make sure these env vars are set in .env.local:
# NEXT_PUBLIC_APPWRITE_ENDPOINT
# NEXT_PUBLIC_APPWRITE_PROJECT_ID
# NEXT_PUBLIC_APPWRITE_DATABASE_ID
# APPWRITE_API_KEY (server-side API key with full permissions)

# Run the setup script
npx tsx scripts/setup-appwrite-collections.ts
```

This creates 9 collections:
- `user_holdings` - User key balances and share percentages
- `user_notifications` - Notification subscription preferences
- `share_analytics` - Share button click tracking
- `airdrops` - Merkle airdrop eligibility data
- `airdrop_claims` - Claim transaction records
- `launch_contributors` - Team members for each launch
- `price_snapshots` - Price history for 24h change calculation
- `twitter_clicks` - Twitter link analytics
- `collaboration_requests` - Collaboration proposals

---

## 2. Integration in Discover Page

Update `app/discover/page.tsx` to fetch and wire all card data:

```typescript
import {
  fetchEnhancedCardData,
  toggleNotifications,
  trackShare,
  trackTwitterClick,
} from '@/lib/appwrite-card-integration'

export default function DiscoverPage() {
  // ... existing state

  // NEW: Store enhanced card data
  const [cardDataMap, setCardDataMap] = useState<Map<string, any>>(new Map())

  // Fetch enhanced data for all launches
  useEffect(() => {
    if (!userId) return

    async function loadCardData() {
      const dataPromises = launches.map(async (launch) => {
        const data = await fetchEnhancedCardData(userId, launch.id)
        return [launch.id, data]
      })

      const results = await Promise.all(dataPromises)
      setCardDataMap(new Map(results))
    }

    loadCardData()
  }, [launches, userId])

  // NEW: Notification bell handler
  const handleNotificationToggle = async (launchId: string, currentState: boolean) => {
    if (!userId) return

    try {
      await toggleNotifications(userId, launchId, !currentState)
      // Refresh card data
      const newData = await fetchEnhancedCardData(userId, launchId)
      setCardDataMap(prev => new Map(prev).set(launchId, newData))
    } catch (error) {
      console.error('Failed to toggle notifications:', error)
    }
  }

  // NEW: Share button handler
  const handleShare = async (launch: LaunchCardData) => {
    if (!userId) return

    try {
      // Copy URL to clipboard
      const url = `${window.location.origin}/launch/${launch.id}`
      await navigator.clipboard.writeText(url)

      // Track analytics
      await trackShare(userId, launch.id, 'copy_link')

      // Show toast notification
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to share:', error)
    }
  }

  // NEW: Twitter analytics handler
  const handleTwitterClick = async (launch: LaunchCardData, twitterUrl: string) => {
    if (!userId) return
    await trackTwitterClick(userId, launch.id, twitterUrl)
  }

  // Render cards with full data
  const renderCard = (launch: LaunchCardData) => {
    const curve = projectCurves.get(launch.id)
    const enhancedData = cardDataMap.get(launch.id)

    const cardData = adaptLaunchToEnhancedCard(
      launch,
      curve,
      enhancedData?.holdings,
      userVotedLaunches.has(launch.id),
      {
        onVote: () => handleVote(launch.id),
        onComment: () => {
          setSelectedLaunch({ id: launch.id, title: launch.title })
          setCommentsOpen(true)
        },
        onCollaborate: () => handleCollaborate(launch),
        onDetails: () => handleDetails(launch),
        onBuyKeys: () => handleBoost(launch),
        onShare: () => handleShare(launch),
      }
    )

    // Add enhanced data to card
    return (
      <EnhancedLaunchCard
        key={launch.id}
        data={{
          ...cardData,
          // Airdrop data
          airdropAmount: enhancedData?.airdrop?.amount,
          hasClaimedAirdrop: enhancedData?.airdrop?.claimed,
          onClaimAirdrop: async () => {
            // TODO: Implement claim logic
            console.log('Claiming airdrop for', launch.id)
          },
          // Contributors
          contributors: enhancedData?.contributors || [],
          // Price change
          priceChange24h: enhancedData?.priceChange24h || curve?.priceChange24h,
          // Notification state
          notificationEnabled: enhancedData?.notificationEnabled || false,
          onNotificationToggle: () =>
            handleNotificationToggle(launch.id, enhancedData?.notificationEnabled),
          // Twitter with analytics
          twitterUrl: launch.twitterUrl,
          onTwitterClick: launch.twitterUrl
            ? () => handleTwitterClick(launch, launch.twitterUrl!)
            : undefined,
        }}
      />
    )
  }

  return (
    // ... rest of component
  )
}
```

---

## 3. Wire Notification Bell Button

Update `EnhancedLaunchCard.tsx` to add notification handler:

```typescript
export type LaunchCardData = {
  // ... existing fields
  notificationEnabled?: boolean
  onNotificationToggle?: () => void
}

// In component:
<button
  onClick={data.onNotificationToggle}
  className={cn(
    "p-2 rounded-lg transition-all",
    data.notificationEnabled
      ? "bg-purple-500/20 border border-purple-500/50"
      : "bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50"
  )}
  aria-label={data.notificationEnabled ? "Unsubscribe" : "Subscribe"}
>
  <Bell
    className={cn(
      "w-4 h-4",
      data.notificationEnabled ? "text-purple-400 fill-purple-400" : "text-zinc-400"
    )}
  />
</button>
```

---

## 4. Wire Share Button

Update share button in `EnhancedLaunchCard.tsx`:

```typescript
export type LaunchCardData = {
  // ... existing fields
  onShare?: () => void
}

// In component:
<button
  onClick={data.onShare}
  className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 hover:border-zinc-600 transition-all"
  aria-label="Share"
>
  <Share2 className="w-4 h-4 text-zinc-400" />
</button>
```

---

## 5. Wire Twitter Analytics

Update Twitter link in `EnhancedLaunchCard.tsx`:

```typescript
export type LaunchCardData = {
  // ... existing fields
  onTwitterClick?: () => void
}

// In component:
{data.twitterUrl && (
  <a
    href={data.twitterUrl}
    target="_blank"
    rel="noreferrer"
    onClick={data.onTwitterClick}
    className="flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-800/80 hover:bg-sky-500/20 border border-zinc-700/50 hover:border-sky-500/40 transition-all group/twitter"
    aria-label="Twitter"
  >
    <Twitter className="w-4 h-4 text-zinc-400 group-hover/twitter:text-sky-400 transition-colors" />
  </a>
)}
```

---

## 6. Implement Airdrop Claim

Create airdrop claim handler:

```typescript
// lib/airdrop-claim.ts
import { Connection, Transaction } from '@solana/web3.js'
import { markAirdropClaimed } from './appwrite-card-integration'

export async function claimAirdrop(
  launchId: string,
  userId: string,
  amount: number,
  proof: string[],
  wallet: any
) {
  try {
    // 1. Build claim transaction
    const tx = await buildClaimTransaction(launchId, amount, proof, wallet.publicKey)

    // 2. Sign and send
    const signature = await wallet.sendTransaction(tx, connection)

    // 3. Confirm
    await connection.confirmTransaction(signature)

    // 4. Mark as claimed in Appwrite
    await markAirdropClaimed(userId, launchId, signature)

    return signature
  } catch (error) {
    console.error('Claim failed:', error)
    throw error
  }
}
```

Use in discover page:

```typescript
onClaimAirdrop: async () => {
  if (!userId || !wallet) return

  const airdropData = enhancedData?.airdrop
  if (!airdropData) return

  try {
    const signature = await claimAirdrop(
      launch.id,
      userId,
      airdropData.amount,
      airdropData.proof,
      wallet
    )

    alert(`Claimed ${airdropData.amount} tokens! Tx: ${signature}`)

    // Refresh card data
    const newData = await fetchEnhancedCardData(userId, launch.id)
    setCardDataMap(prev => new Map(prev).set(launch.id, newData))
  } catch (error) {
    alert('Claim failed. Please try again.')
  }
}
```

---

## 7. Update User Holdings After Transactions

After every buy/sell transaction, update holdings:

```typescript
import { updateUserHoldings } from '@/lib/appwrite-card-integration'

// In your buy/sell handler:
async function handleBuyKeys(launchId: string, amount: number) {
  // ... execute transaction

  // Update Appwrite
  const newBalance = currentBalance + amount
  const totalSupply = await fetchTotalSupply(launchId)

  await updateUserHoldings(
    userId,
    launchId,
    newBalance,
    totalSupply,
    totalInvested + transactionCost
  )

  // Refresh card data
  const newData = await fetchEnhancedCardData(userId, launchId)
  setCardDataMap(prev => new Map(prev).set(launchId, newData))
}
```

---

## 8. Price History Tracking

Set up a cron job to save price snapshots every 15 minutes:

```typescript
// app/api/cron/price-snapshots/route.ts
import { savePriceSnapshot } from '@/lib/appwrite-card-integration'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // Fetch all active launches
    const launches = await fetchActiveLaunches()

    // Save price snapshot for each
    await Promise.all(
      launches.map(async (launch) => {
        const curve = await fetchCurveData(launch.id)
        if (curve) {
          await savePriceSnapshot(launch.id, curve.price, curve.volume24h)
        }
      })
    )

    return Response.json({ success: true, count: launches.length })
  } catch (error) {
    console.error('Price snapshot cron failed:', error)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
```

Configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/price-snapshots",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

---

## 9. Collaboration Requests

Wire the collaborate button:

```typescript
import { createCollaborationRequest } from '@/lib/appwrite-card-integration'

const handleCollaborate = async (launch: LaunchCardData) => {
  if (!userId) return

  const message = prompt('Why do you want to collaborate?')
  if (!message) return

  const skills = prompt('Your skills (comma-separated):')
  const skillsArray = skills?.split(',').map(s => s.trim()) || []

  try {
    await createCollaborationRequest(userId, launch.id, message, skillsArray)
    alert('Collaboration request sent!')
  } catch (error) {
    alert('Failed to send request')
  }
}
```

---

## 10. Testing Checklist

After integration, test each feature:

- [ ] **Upvote button** - Vote count increases, color changes
- [ ] **Comments button** - Modal opens
- [ ] **Buy/Sell modal** - Opens SimpleBuySellModal, transactions work
- [ ] **Notification bell** - Subscribe/unsubscribe, icon changes
- [ ] **Share button** - Copies URL, tracks analytics
- [ ] **Twitter link** - Opens in new tab, tracks click
- [ ] **Claim Tokens** - Merkle claim executes, banner disappears
- [ ] **User holdings** - Shows correct key count and %
- [ ] **24h price change** - Displays accurate percentage
- [ ] **Contributors** - Shows team avatars
- [ ] **Details button** - Navigates to launch page
- [ ] **Collaborate button** - Creates request in Appwrite

---

## Summary

You've now:

1. ✅ Created all Appwrite collections
2. ✅ Wired all interactive buttons
3. ✅ Integrated real-time data fetching
4. ✅ Set up price history tracking
5. ✅ Implemented airdrop claims
6. ✅ Added analytics tracking

All features in EnhancedLaunchCard are now fully functional with Appwrite backend!