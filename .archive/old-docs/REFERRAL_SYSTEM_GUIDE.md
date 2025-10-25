# 🎯 Referral System - Complete Guide

## Overview
The LaunchOS referral system rewards users for bringing new members to the platform. It features automatic tracking, tiered levels, and a rewards pool for unclaimed fees.

---

## 🚀 Quick Start

### For Users:

1. **Get Your Referral Link**
   - Go to `/dashboard/profile`
   - Find your referral link in the "Referral Program" section
   - Click "Copy Referral Link" or "Share"

2. **Share Your Link**
   - Share on Twitter, Discord, or any platform
   - When someone signs up using your link, you earn 1% of their transactions

3. **Claim Rewards**
   - Visit `/dashboard/profile` to see pending rewards
   - Click "Claim All" to withdraw to your connected wallet
   - Rewards are paid in USDC

---

## 💰 Fee Split Breakdown

Every transaction on LaunchOS is split as follows:

- **94%** → Reserve (for project/protocol)
- **3%** → Project Fee
- **2%** → Platform Fee
- **1%** → Referral Fee (or Rewards Pool if no referrer)

### Example:
User buys $100 worth of tokens:
- Reserve: $94
- Project: $3
- Platform: $2
- **Referrer: $1** ← You earn this!

---

## 📊 Levels & Gamification

Progress through 5 levels based on total referrals:

| Level | Referrals Needed | Badge |
|-------|------------------|-------|
| Bronze | 0-2 | 🥉 |
| Silver | 3-9 | 🥈 |
| Gold | 10-24 | 🥇 |
| Platinum | 25-99 | 💎 |
| Diamond | 100+ | 💠 |

---

## 🎨 Components

### 1. **ReferralCard**
Shows user's referral stats, level, earnings, and shareable link.

**Props:**
```typescript
{
  userId?: string          // Optional: show another user's stats
  variant?: 'default' | 'compact'
  showLeaderboardLink?: boolean
}
```

**Usage:**
```tsx
import { ReferralCard } from '@/components/referral'

<ReferralCard />
```

### 2. **ReferralLeaderboard**
Displays top referrers with rankings.

**Props:**
```typescript
{
  limit?: number           // Number of entries to show
  showUserRank?: boolean   // Highlight current user
  variant?: 'full' | 'compact'
}
```

**Usage:**
```tsx
import { ReferralLeaderboard } from '@/components/referral'

<ReferralLeaderboard limit={10} showUserRank={true} />
```

### 3. **RewardsPanel**
Shows pending/claimed rewards with claim functionality.

**Props:**
```typescript
{
  variant?: 'full' | 'compact'
}
```

**Usage:**
```tsx
import { RewardsPanel } from '@/components/referral'

<RewardsPanel />
```

---

## 🔌 API Endpoints

### `POST /api/referral/track`
Track a referral action.

**Body:**
```json
{
  "referrerId": "user_123",
  "referredId": "user_456",
  "action": "profile_creation",
  "grossAmount": 100,
  "projectId": "project_789",
  "metadata": {}
}
```

**Response:**
```json
{
  "success": true,
  "referral": { ... },
  "split": {
    "reserve": 94,
    "project": 3,
    "platform": 2,
    "referral": 1
  }
}
```

### `GET /api/referral/track?userId=user_123&type=referrer`
Get user's referral stats.

**Response:**
```json
{
  "referrals": [...],
  "stats": {
    "totalReferrals": 10,
    "totalEarnings": 50,
    "totalTransactions": 25,
    "averageTransaction": 2
  }
}
```

### `GET /api/referral/rewards?userId=user_123&status=pending`
Get user's rewards.

**Response:**
```json
{
  "rewards": [...],
  "stats": {
    "pendingCount": 5,
    "pendingAmount": 10,
    "claimedCount": 2,
    "claimedAmount": 5
  }
}
```

### `POST /api/referral/rewards`
Claim rewards.

**Body:**
```json
{
  "action": "batch-claim",
  "userId": "user_123",
  "walletAddress": "0x..."
}
```

### `GET /api/referral/leaderboard?limit=50&timeframe=all`
Get referral leaderboard.

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_123",
      "username": "JohnDoe",
      "totalReferrals": 50,
      "totalEarnings": 100,
      "level": 4,
      "levelName": "Platinum"
    }
  ]
}
```

---

## 🪝 React Hooks

### `useReferralTracking()`
Automatically tracks referral codes from URL.

```typescript
import { useReferralTracking } from '@/hooks/useReferralTracking'

const {
  referrerCode,
  isTracking,
  trackProfileCreation,
  trackAction,
  generateReferralLink,
  clearReferrer
} = useReferralTracking({
  autoTrack: true,
  onReferralDetected: (code) => console.log('Ref detected:', code),
  onReferralTracked: (result) => console.log('Tracked:', result)
})
```

### `useReferralRewards()`
Manage user rewards.

```typescript
import { useReferralRewards } from '@/hooks/useReferralRewards'

const {
  rewards,
  stats,
  isLoading,
  claimReward,
  claimAllRewards,
  getPendingRewards,
  hasPendingRewards
} = useReferralRewards()
```

### `useReferralStats()`
Get user stats and leaderboard.

```typescript
import { useReferralStats } from '@/hooks/useReferralStats'

const {
  stats,
  leaderboard,
  userRank,
  fetchStats,
  fetchLeaderboard,
  generateReferralLink,
  copyReferralLink,
  shareReferralLink
} = useReferralStats(userId)
```

---

## 🧪 Testing

### Run Test Script
```bash
npm run test-referrals
```

### Manual Testing Checklist

- [ ] Visit `/dashboard/profile` - see referral card
- [ ] Copy referral link
- [ ] Open incognito tab with `?ref=YOUR_USER_ID`
- [ ] Check localStorage has stored referral code
- [ ] Sign up with new account
- [ ] Verify referral was tracked in Appwrite
- [ ] Check rewards in original account
- [ ] Test claiming rewards
- [ ] Visit `/discover` - see compact referral widgets
- [ ] Check leaderboard shows correct rankings

---

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Referral Collections
NEXT_PUBLIC_APPWRITE_REFERRALS_COLLECTION_ID=referrals
NEXT_PUBLIC_APPWRITE_REFERRAL_REWARDS_COLLECTION_ID=referral_rewards
NEXT_PUBLIC_APPWRITE_REWARDS_POOLS_COLLECTION_ID=rewards_pools

# Fee Configuration
REFERRAL_PERCENTAGE=1
PROJECT_FEE_PERCENTAGE=3
PLATFORM_FEE_PERCENTAGE=2
RESERVE_PERCENTAGE=94
```

---

## 🎯 Integration Examples

### Track a Purchase
```typescript
import { trackAction } from '@/hooks/useReferralTracking'

async function handlePurchase(amount: number, projectId: string) {
  await trackAction(
    'buy',
    amount,
    projectId,
    { item: 'token', quantity: 100 }
  )
}
```

### Show Referral Link in Modal
```typescript
import { useReferralStats } from '@/hooks/useReferralStats'

function ShareModal() {
  const { generateReferralLink, copyReferralLink } = useReferralStats()
  const link = generateReferralLink()

  return (
    <div>
      <input value={link} readOnly />
      <button onClick={copyReferralLink}>Copy</button>
    </div>
  )
}
```

---

## 📈 Analytics & Metrics

Track these KPIs:
- **Conversion Rate**: % of referred users who complete actions
- **Average Referral Value**: Total earnings / total referrals
- **Top Referrers**: Users driving most value
- **Viral Coefficient**: Avg referrals per user
- **Rewards Pool Growth**: Unclaimed fees accumulating

---

## 🚨 Fraud Prevention

Built-in protections:
1. **First-Referrer Binding**: Can't change referrer after signup
2. **Self-Referral Block**: Can't refer yourself
3. **Validation**: Referral codes must be valid user IDs
4. **Expiration**: Rewards expire after 90 days if unclaimed
5. **Wallet Required**: Must connect wallet to claim

---

## 🤝 Support

For issues or questions:
- Check browser console for errors
- Verify .env configuration
- Check Appwrite collections exist
- Review API responses in Network tab

---

## 📝 TODO / Future Enhancements

- [ ] Add email notifications for new referrals
- [ ] Create analytics dashboard
- [ ] Add social share buttons (Twitter, Discord)
- [ ] Generate QR codes for referral links
- [ ] Add referral contests/competitions
- [ ] Implement tiered reward bonuses
- [ ] Add referral link customization
- [ ] Create embeddable referral widgets

---

**Built with ❤️ for LaunchOS**
