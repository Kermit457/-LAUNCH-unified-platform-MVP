# Mock Data → Appwrite Mapping Table

Complete reference for replacing mock data with real Appwrite collections and external APIs.

---

## 1. **Launches / Projects** (`launchProjects`)

**Mock Source:** `lib/sampleData.ts` → `launchProjects[]`

**Target Collection:** `launches`

**Document Model:**
```typescript
{
  $id: string                    // Auto-generated
  tokenName: string              // Mock: title
  tokenSymbol: string            // Mock: ticker
  tokenImage?: string            // Mock: tokenLogo
  description: string            // Mock: description
  creatorId: string              // User ID who created launch
  creatorName: string            // Mock: creator
  creatorAvatar?: string         // Mock: avatarUrl
  marketCap: number              // Mock: fdv
  volume24h: number              // External: Dexscreener API
  priceChange24h: number         // External: Dexscreener API
  holders: number                // External: Helius/Solana RPC
  convictionPct: number          // Mock: beliefScore
  commentsCount: number          // Count from comments collection
  upvotes: number                // Mock: upvotes
  tags: string[]                 // Mock: platforms, chain, status
  createdAt: string              // ISO timestamp
  status: 'live' | 'upcoming' | 'ended'
  team?: Array<{                 // Optional team members
    name: string
    role: string
    avatar?: string
  }>
  contributors?: Array<{         // Optional contributors
    name: string
    amount: number
    avatar?: string
  }>
}
```

**Required Indexes:**
- `status` (ascending) - for filtering live/upcoming launches
- `createdAt` (descending) - for recent launches
- `upvotes` (descending) - for trending sorts
- `convictionPct` (descending) - for conviction sorts
- `marketCap` (descending) - for FDV sorts
- `creatorId` (ascending) - for user's launches

**Permissions:**
```javascript
Read: ["role:all"]                    // Anyone can read launches
Write: ["user:{creatorId}"]           // Only creator can update
Create: ["users"]                      // Any authenticated user
Delete: ["user:{creatorId}"]          // Only creator can delete
```

**External Data (Live Tokens):**
- **Dexscreener API**
  - Endpoint: `https://api.dexscreener.com/latest/dex/tokens/{tokenAddress}`
  - Params: `tokenAddress` (Solana/Base contract address)
  - Returns: `priceUsd`, `volume24h`, `priceChange24h`, `liquidity`, `fdv`
  - Caching: 30 seconds TTL (use SWR or React Query)
  - Fallback: Show stale data with indicator

---

## 2. **Campaigns** (Content Creator Campaigns)

**Mock Source:** `app/campaign/[id]/page.tsx` → hardcoded campaign object

**Target Collection:** `campaigns`

**Document Model:**
```typescript
{
  $id: string
  title: string                  // Mock: "Clip $COIN Launch Video"
  description: string
  type: 'bounty' | 'quest' | 'airdrop'
  creatorId: string
  creatorName: string
  creatorAvatar?: string
  budget: number                 // Mock: pool (2000)
  budgetPaid: number             // Mock: paid (400) - calculated from submissions
  participants: number           // Mock: participants (23)
  deadline: string               // ISO timestamp
  status: 'active' | 'completed' | 'cancelled'
  requirements: string[]         // Mock: rules (array of strings)
  tags: string[]
  imageUrl?: string
  createdAt: string

  // Campaign-specific fields
  ratePerThousand?: number       // Mock: ratePerThousand (20)
  totalViews?: number            // Mock: views (45)
  platforms?: string[]           // Mock: platforms ['youtube', 'tiktok']
  socialLinks?: string[]         // Mock: socialLinks
  creatorKitUrl?: string         // Mock: driveLink
  minViews?: number              // Mock: rules.minViews (1000)
  minDuration?: number           // Mock: rules.minDuration (30)
  maxDuration?: number           // Mock: rules.maxDuration (180)
  topSubmissions?: Array<{       // Mock: examples
    id: string
    creator: string
    views: number
    earned: number
  }>
}
```

**Required Indexes:**
- `status` (ascending)
- `deadline` (ascending) - for expiring campaigns
- `createdAt` (descending)
- `type` (ascending)
- `creatorId` (ascending)
- `budget` (descending) - for high-value campaigns

**Permissions:**
```javascript
Read: ["role:all"]
Write: ["user:{creatorId}"]
Create: ["users"]
Delete: ["user:{creatorId}"]
```

---

## 3. **Quests / Raids / Bounties**

**Mock Source:** `app/raids/[id]/page.tsx`, `app/bounties/[id]/page.tsx` → hardcoded objects

**Target Collection:** `quests`

**Document Model:**
```typescript
{
  $id: string
  questId: string                // Unique quest identifier
  type: 'raid' | 'bounty'
  title: string
  description: string
  createdBy: string              // User ID
  status: 'active' | 'completed' | 'cancelled'
  poolAmount: number             // Mock: pool
  participants: number           // Count of unique submitters
  requirements: string[]         // Quest requirements
  platforms: string[]            // ['twitter', 'discord']
  deadline: string               // ISO timestamp
  createdAt: string
}
```

**Required Indexes:**
- `status` (ascending)
- `type` (ascending)
- `deadline` (ascending)
- `createdAt` (descending)
- `createdBy` (ascending)
- `poolAmount` (descending)

**Permissions:**
```javascript
Read: ["role:all"]
Write: ["user:{createdBy}"]
Create: ["users"]
Delete: ["user:{createdBy}"]
```

**Calculated Fields:**
- `paid` - Sum of `earnings` from approved submissions where `questId` matches
  ```typescript
  const submissions = await getSubmissions({ questId, status: 'approved' })
  const paid = submissions.reduce((sum, sub) => sum + sub.earnings, 0)
  ```

---

## 4. **Submissions** (Quest/Campaign Submissions)

**Mock Source:** Transaction history in earnings page

**Target Collection:** `submissions`

**Document Model:**
```typescript
{
  $id: string
  submissionId: string           // Unique submission ID
  campaignId?: string            // FK to campaigns
  questId?: string               // FK to quests
  userId: string                 // FK to users
  status: 'pending' | 'approved' | 'rejected'
  mediaUrl: string               // URL to submitted content
  views: number                  // View count (manually entered or API)
  earnings: number               // Calculated payout amount
  notes?: string                 // Reviewer notes
  reviewedAt?: string            // ISO timestamp
  $createdAt: string             // Auto-generated
}
```

**Required Indexes:**
- `userId` (ascending) - for user's submissions
- `campaignId` (ascending) - for campaign submissions
- `questId` (ascending) - for quest submissions
- `status` (ascending) - for pending reviews
- `$createdAt` (descending)
- Compound: `userId` + `status` - for user's approved submissions

**Permissions:**
```javascript
Read: [
  "user:{userId}",               // Submitter can read their own
  "user:{campaign.creatorId}",   // Campaign creator can read
  "role:admin"
]
Write: [
  "user:{userId}",               // Only for creating
  "user:{campaign.creatorId}",   // Creator can approve/reject
  "role:admin"
]
Create: ["users"]
Delete: ["user:{userId}", "role:admin"]
```

**Aggregations:**
- User total earnings: Sum of `earnings` where `userId` matches and `status: 'approved'`
- Campaign paid amount: Sum of `earnings` where `campaignId` matches and `status: 'approved'`

---

## 5. **Payouts** (Withdrawal Transactions)

**Mock Source:** `app/earnings/page.tsx` → mockHistory

**Target Collection:** `payouts`

**Document Model:**
```typescript
{
  $id: string
  payoutId: string               // Unique payout ID (e.g., "payout_1234567890")
  userId: string                 // FK to users
  campaignId?: string            // Optional FK
  questId?: string               // Optional FK
  amount: number                 // Gross payout amount
  currency: string               // 'USDC', 'SOL', etc.
  status: 'pending' | 'claimable' | 'claimed' | 'paid'
  txHash?: string                // Blockchain transaction hash
  claimedAt?: string             // ISO timestamp
  paidAt?: string                // ISO timestamp
  fee?: number                   // Platform fee
  net?: number                   // Net amount after fees
  $createdAt: string
}
```

**Required Indexes:**
- `userId` (ascending)
- `status` (ascending)
- `$createdAt` (descending)
- Compound: `userId` + `status` - for claimable balance

**Permissions:**
```javascript
Read: ["user:{userId}", "role:admin"]
Write: ["role:admin"]            // Only admins can update payout status
Create: ["role:admin"]           // Payouts created by system/admin
Delete: ["role:admin"]
```

**Aggregations:**
- Claimable balance: Sum of `net || amount` where `userId` matches and `status: 'claimable'`
- Total earnings: Sum of `net || amount` where `userId` matches

---

## 6. **Users / Profiles**

**Mock Source:** User avatars, creator names throughout app

**Target Collection:** `users`

**Document Model:**
```typescript
{
  $id: string                    // Appwrite user ID
  name: string
  email: string
  avatarUrl?: string
  walletAddress?: string         // Solana/Base wallet
  bio?: string
  socials?: {
    twitter?: string
    discord?: string
    telegram?: string
    website?: string
  }
  reputation: number             // Reputation score
  totalEarnings: number          // Cached from payouts
  createdAt: string
  updatedAt: string
}
```

**Required Indexes:**
- `email` (unique, ascending)
- `walletAddress` (unique, ascending)
- `reputation` (descending)
- `createdAt` (descending)

**Permissions:**
```javascript
Read: ["role:all"]               // Public profiles
Write: ["user:{$id}"]            // User can update own profile
Create: ["role:system"]          // Created via Appwrite Auth
Delete: ["user:{$id}", "role:admin"]
```

---

## 7. **Comments / Threads**

**Mock Source:** `launchProjects[].comments`

**Target Collection:** `comments` (existing) or `threads`

**Document Model:**
```typescript
{
  $id: string
  launchId?: string              // FK to launches
  campaignId?: string            // FK to campaigns
  userId: string                 // FK to users (commenter)
  userName: string               // Cached username
  userAvatar?: string            // Cached avatar
  text: string                   // Comment content
  upvotes: number                // Upvote count
  parentId?: string              // For nested replies
  $createdAt: string
}
```

**Required Indexes:**
- `launchId` (ascending)
- `campaignId` (ascending)
- `userId` (ascending)
- `$createdAt` (descending)
- `parentId` (ascending) - for nested threads

**Permissions:**
```javascript
Read: ["role:all"]
Write: ["user:{userId}"]
Create: ["users"]
Delete: ["user:{userId}", "role:admin"]
```

---

## 8. **External APIs** (Real-time Market Data)

### A. **Dexscreener** (Token Price & Volume)

**Use Case:** Live token data for ICM launches (price, volume, liquidity, FDV)

**Endpoint:**
```
GET https://api.dexscreener.com/latest/dex/tokens/{tokenAddress}
```

**Parameters:**
- `tokenAddress` - Contract address (Solana/Base)

**Response Fields:**
```typescript
{
  pairs: [{
    chainId: string              // 'solana', 'base'
    dexId: string                // 'raydium', 'uniswap'
    pairAddress: string
    baseToken: {
      address: string
      name: string
      symbol: string
    }
    priceUsd: string             // Current price
    volume: {
      h24: number                // 24h volume
    }
    priceChange: {
      h24: number                // 24h % change
    }
    liquidity: {
      usd: number                // Liquidity in USD
    }
    fdv: number                  // Fully diluted valuation
  }]
}
```

**Caching Strategy:**
- **TTL:** 30 seconds (use React Query / SWR)
- **Stale-while-revalidate:** Show cached data while fetching fresh
- **Error handling:** Fallback to last known good data

**Implementation:**
```typescript
// lib/tokenData.ts (already exists)
export function useTokenData(mintAddress?: string, refreshInterval = 30000) {
  return useQuery({
    queryKey: ['token', mintAddress],
    queryFn: () => fetchDexscreenerData(mintAddress),
    enabled: !!mintAddress,
    refetchInterval: refreshInterval,
    staleTime: 30000,
  })
}
```

---

### B. **Helius RPC** (Solana Token Holders)

**Use Case:** Get holder count for Solana tokens

**Endpoint:**
```
POST https://mainnet.helius-rpc.com/?api-key={YOUR_KEY}
```

**Method:** `getTokenLargestAccounts`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTokenLargestAccounts",
  "params": ["{mintAddress}"]
}
```

**Response:**
```typescript
{
  value: Array<{
    address: string
    amount: string
    decimals: number
    uiAmount: number
  }>
}
```

**Holder Count:** `value.length` (approximation, real count requires token metadata)

**Caching:**
- **TTL:** 5 minutes (holder count changes slowly)
- **Fallback:** Show "N/A" if RPC fails

---

## 9. **Aggregation Queries** (Calculated Fields)

These fields are computed from multiple collections:

### A. **Launch Comments Count**
```typescript
const commentsCount = await databases.listDocuments(
  DB_ID,
  COLLECTIONS.COMMENTS,
  [Query.equal('launchId', launchId), Query.limit(1000)]
).then(res => res.total)
```

### B. **Campaign Paid Amount**
```typescript
const submissions = await getSubmissions({
  campaignId,
  status: 'approved',
  limit: 1000
})
const paid = submissions.reduce((sum, sub) => sum + (sub.earnings || 0), 0)
```

### C. **User Total Earnings**
```typescript
const submissions = await getSubmissions({
  userId,
  status: 'approved',
  limit: 1000
})
const totalEarnings = submissions.reduce((sum, sub) => sum + (sub.earnings || 0), 0)
```

### D. **User Claimable Balance**
```typescript
const payouts = await getPayouts({ userId, status: 'claimable' })
const claimable = payouts.reduce((sum, p) => sum + (p.net || p.amount), 0)
```

---

## 10. **Migration Checklist**

### Collections Setup
- [x] `launches` - Created with indexes
- [x] `campaigns` - Created with indexes
- [x] `quests` - Created with indexes
- [x] `submissions` - Created with indexes
- [x] `payouts` - Created with indexes
- [x] `comments` - Created with indexes
- [x] `users` - Linked to Appwrite Auth
- [x] `threads` - Created with indexes

### Permissions
- [ ] Set read/write rules per collection
- [ ] Test authenticated vs anonymous access
- [ ] Verify creator-only updates work

### External APIs
- [ ] Add Dexscreener API integration
- [ ] Add Helius RPC for holder counts
- [ ] Implement caching layer (React Query)
- [ ] Handle rate limits and errors

### Data Seeding
- [ ] Run `npm run setup-appwrite` to create collections
- [ ] Seed test data for each collection
- [ ] Verify relationships (FKs) work correctly

---

## Summary Table

| Mock Data Type | Appwrite Collection | External API | Caching TTL |
|----------------|---------------------|--------------|-------------|
| `launchProjects` | `launches` | Dexscreener (price/volume) | 30s |
| `launchProjects` | `launches` | Helius RPC (holders) | 5m |
| Campaign details | `campaigns` | - | - |
| Raids/Bounties | `quests` | - | - |
| Earnings history | `submissions` | - | - |
| Payouts | `payouts` | - | - |
| User profiles | `users` | - | - |
| Comments | `comments` | - | - |

**Key:**
- `-` = No external API needed
- `30s` = 30 seconds cache
- `5m` = 5 minutes cache
