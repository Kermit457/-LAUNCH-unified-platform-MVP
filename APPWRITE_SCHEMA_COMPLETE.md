# Complete Appwrite Database Schema

**Generated:** 2025-10-20
**Database ID:** Retrieved from `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
**Status:** Production Ready

---

## Overview

This document defines the complete Appwrite database schema for the ICMotion platform. All collections are implemented and have corresponding service files in `lib/appwrite/services/`.

**Total Collections:** 18
**Status:** ✅ All implemented with full CRUD operations

---

## Collection Schemas

### 1. USERS
**Collection ID:** `users`
**Service:** `lib/appwrite/services/users.ts`
**Purpose:** User profiles and metadata

#### Attributes
| Name | Type | Required | Indexed | Description |
|------|------|----------|---------|-------------|
| `userId` | string | ✅ | ✅ | Privy user ID (unique) |
| `email` | string | ✅ | ✅ | User email |
| `handle` | string | ✅ | ✅ | @username (unique) |
| `displayName` | string | ✅ | ❌ | Display name |
| `avatar` | string | ❌ | ❌ | Avatar URL |
| `bio` | string | ❌ | ❌ | User bio (max 500 chars) |
| `twitter` | string | ❌ | ❌ | Twitter handle |
| `discord` | string | ❌ | ❌ | Discord username |
| `telegram` | string | ❌ | ❌ | Telegram username |
| `github` | string | ❌ | ❌ | GitHub username |
| `walletAddress` | string | ❌ | ✅ | Solana wallet address |
| `referralCode` | string | ✅ | ✅ | Unique referral code |
| `referredBy` | string | ❌ | ✅ | Referrer's code |
| `balance` | number | ✅ | ❌ | Platform balance (default: 0) |
| `xp` | number | ✅ | ❌ | Experience points (default: 0) |
| `level` | number | ✅ | ❌ | User level (default: 1) |
| `verified` | boolean | ✅ | ✅ | Verification status |
| `createdAt` | datetime | ✅ | ✅ | Account creation |

#### Indexes
- `userId` (unique)
- `email` (unique)
- `handle` (unique)
- `walletAddress`
- `referralCode` (unique)
- `referredBy`
- `verified`
- `createdAt` (desc)

---

### 2. LAUNCHES
**Collection ID:** `launches`
**Service:** `lib/appwrite/services/launches.ts`
**Purpose:** Token launches and project listings

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | ✅ | Launch title |
| `subtitle` | string | ❌ | Subtitle/tagline |
| `description` | string | ✅ | Full description |
| `logo` | string | ✅ | Logo URL |
| `ticker` | string | ✅ | Token ticker (e.g., "SOL") |
| `curveAddress` | string | ❌ | Solana curve PDA |
| `tokenAddress` | string | ❌ | SPL token address |
| `scope` | string | ✅ | "Personal" \| "Community" \| "Project" |
| `status` | string | ✅ | "active" \| "frozen" \| "launched" \| "inactive" |
| `platforms` | string[] | ❌ | ["twitter", "discord", etc.] |
| `targetRaise` | number | ❌ | Fundraising goal (SOL) |
| `currentRaise` | number | ✅ | Current raise amount (default: 0) |
| `marketCap` | number | ✅ | Current market cap |
| `price` | number | ✅ | Current token price |
| `holders` | number | ✅ | Number of holders |
| `volume24h` | number | ✅ | 24h trading volume |
| `change24h` | number | ✅ | 24h price change % |
| `creatorId` | string | ✅ (indexed) | User ID of creator |
| `collaborators` | string[] | ❌ | Array of user IDs |
| `tags` | string[] | ❌ | Search tags |
| `category` | string | ❌ | Launch category |
| `website` | string | ❌ | Project website |
| `twitter` | string | ❌ | Twitter handle |
| `discord` | string | ❌ | Discord invite |
| `telegram` | string | ❌ | Telegram link |
| `featured` | boolean | ✅ | Featured status |
| `verified` | boolean | ✅ | Verification status |
| `votesCount` | number | ✅ | Total votes (default: 0) |
| `commentsCount` | number | ✅ | Total comments |
| `viewsCount` | number | ✅ | Total views |
| `createdAt` | datetime | ✅ (indexed) | Creation timestamp |
| `updatedAt` | datetime | ✅ | Last update |

#### Indexes
- `creatorId`
- `status`
- `featured`
- `createdAt` (desc)
- `votesCount` (desc)
- `marketCap` (desc)

---

### 3. CURVES
**Collection ID:** `curves`
**Service:** `lib/appwrite/services/curves.ts`
**Purpose:** Bonding curve trading data

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `curveAddress` | string | ✅ (unique) | Solana PDA address |
| `launchId` | string | ✅ (indexed) | Associated launch |
| `creatorId` | string | ✅ (indexed) | Curve creator |
| `tokenAddress` | string | ❌ | SPL token address |
| `status` | string | ✅ | "active" \| "frozen" \| "graduated" |
| `totalSupply` | number | ✅ | Total token supply |
| `reserveBalance` | number | ✅ | SOL in reserve |
| `currentPrice` | number | ✅ | Current price per token |
| `marketCap` | number | ✅ | Total market cap |
| `holders` | number | ✅ | Unique holders |
| `totalBuys` | number | ✅ | Total buy transactions |
| `totalSells` | number | ✅ | Total sell transactions |
| `volume24h` | number | ✅ | 24h volume |
| `volumeAllTime` | number | ✅ | All-time volume |
| `freezeThreshold` | number | ✅ | Freeze trigger (SOL) |
| `lpCreated` | boolean | ✅ | LP creation status |
| `pumpLaunched` | boolean | ✅ | Pump.fun launch status |
| `createdAt` | datetime | ✅ | Curve creation |
| `frozenAt` | datetime | ❌ | Freeze timestamp |
| `graduatedAt` | datetime | ❌ | Graduation timestamp |

#### Indexes
- `curveAddress` (unique)
- `launchId`
- `creatorId`
- `status`
- `marketCap` (desc)
- `createdAt` (desc)

---

### 4. CURVE_EVENTS
**Collection ID:** `curve_events`
**Service:** `lib/appwrite/services/curve-events.ts`
**Purpose:** Trading event history

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `curveAddress` | string | ✅ (indexed) | Curve PDA |
| `launchId` | string | ✅ (indexed) | Launch ID |
| `userId` | string | ✅ (indexed) | Trader user ID |
| `eventType` | string | ✅ | "buy" \| "sell" \| "freeze" \| "launch" |
| `tokenAmount` | number | ✅ | Tokens traded |
| `solAmount` | number | ✅ | SOL amount |
| `price` | number | ✅ | Price per token |
| `txSignature` | string | ✅ (indexed) | Solana tx signature |
| `timestamp` | datetime | ✅ (indexed) | Event time |

#### Indexes
- `curveAddress`
- `launchId`
- `userId`
- `eventType`
- `txSignature` (unique)
- `timestamp` (desc)

---

### 5. CURVE_HOLDERS
**Collection ID:** `curve_holders`
**Service:** `lib/appwrite/services/curve-holders.ts`
**Purpose:** Token holder balances

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `curveAddress` | string | ✅ (indexed) | Curve PDA |
| `launchId` | string | ✅ (indexed) | Launch ID |
| `userId` | string | ✅ (indexed) | Holder user ID |
| `tokenBalance` | number | ✅ | Current token balance |
| `solInvested` | number | ✅ | Total SOL invested |
| `solRealized` | number | ✅ | Total SOL from sells |
| `averageBuyPrice` | number | ✅ | Average buy price |
| `unrealizedPnL` | number | ✅ | Unrealized profit/loss |
| `realizedPnL` | number | ✅ | Realized profit/loss |
| `firstBuyAt` | datetime | ✅ | First purchase |
| `lastTradeAt` | datetime | ✅ | Last trade |

#### Indexes
- Composite: `curveAddress` + `userId` (unique)
- `launchId`
- `tokenBalance` (desc)
- `unrealizedPnL` (desc)

---

### 6. VOTES
**Collection ID:** `votes`
**Service:** `lib/appwrite/services/votes.ts`
**Purpose:** Upvotes on launches/projects

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `projectId` | string | ✅ (indexed) | Launch/project ID |
| `userId` | string | ✅ (indexed) | Voter user ID |
| `createdAt` | datetime | ✅ | Vote timestamp |

#### Indexes
- Composite: `projectId` + `userId` (unique)
- `projectId`
- `userId`
- `createdAt` (desc)

---

### 7. CAMPAIGNS
**Collection ID:** `campaigns`
**Service:** `lib/appwrite/services/campaigns.ts`
**Purpose:** Marketing campaigns

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | ✅ | Campaign title |
| `description` | string | ✅ | Campaign description |
| `image` | string | ❌ | Campaign image |
| `creatorId` | string | ✅ (indexed) | Campaign creator |
| `projectId` | string | ❌ (indexed) | Associated project |
| `type` | string | ✅ | "awareness" \| "engagement" \| "conversion" |
| `status` | string | ✅ | "draft" \| "active" \| "paused" \| "completed" |
| `platforms` | string[] | ✅ | Target platforms |
| `budget` | number | ✅ | Campaign budget |
| `spent` | number | ✅ | Amount spent |
| `reach` | number | ✅ | Total reach |
| `engagement` | number | ✅ | Total engagement |
| `conversions` | number | ✅ | Total conversions |
| `startDate` | datetime | ✅ | Campaign start |
| `endDate` | datetime | ✅ | Campaign end |
| `createdAt` | datetime | ✅ | Creation time |

#### Indexes
- `creatorId`
- `projectId`
- `status`
- `startDate`
- `createdAt` (desc)

---

### 8. QUESTS
**Collection ID:** `quests`
**Service:** `lib/appwrite/services/quests.ts`
**Purpose:** User quests/missions

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | ✅ | Quest title |
| `description` | string | ✅ | Quest description |
| `creatorId` | string | ✅ (indexed) | Quest creator |
| `projectId` | string | ❌ (indexed) | Associated project |
| `type` | string | ✅ | "social" \| "trading" \| "content" |
| `targetUrl` | string | ❌ | Target URL for quest |
| `platforms` | string[] | ✅ | Required platforms |
| `rules` | object | ✅ | Quest rules/criteria |
| `reward` | number | ✅ | Reward amount |
| `rewardType` | string | ✅ | "xp" \| "tokens" \| "nft" |
| `maxCompletions` | number | ✅ | Max completions |
| `currentCompletions` | number | ✅ | Current completions |
| `status` | string | ✅ | "active" \| "paused" \| "completed" |
| `startDate` | datetime | ✅ | Quest start |
| `endDate` | datetime | ✅ | Quest end |
| `createdAt` | datetime | ✅ | Creation time |

#### Indexes
- `creatorId`
- `projectId`
- `status`
- `startDate`
- `createdAt` (desc)

---

### 9. SUBMISSIONS
**Collection ID:** `submissions`
**Service:** `lib/appwrite/services/submissions.ts`
**Purpose:** Campaign/quest submissions

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `campaignId` | string | ✅ (indexed) | Campaign/quest ID |
| `userId` | string | ✅ (indexed) | Submitter user ID |
| `content` | string | ✅ | Submission content |
| `mediaUrl` | string | ❌ | Media attachment |
| `proofUrl` | string | ❌ | Proof URL (tweet, etc.) |
| `status` | string | ✅ | "pending" \| "approved" \| "rejected" |
| `reviewNotes` | string | ❌ | Reviewer notes |
| `reviewerId` | string | ❌ | Reviewer user ID |
| `submittedAt` | datetime | ✅ | Submission time |
| `reviewedAt` | datetime | ❌ | Review time |

#### Indexes
- `campaignId`
- `userId`
- `status`
- `submittedAt` (desc)

---

### 10. NETWORK_INVITES
**Collection ID:** `network_invites`
**Service:** `lib/appwrite/services/network.ts`
**Purpose:** Connection invitations

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `fromUserId` | string | ✅ (indexed) | Sender user ID |
| `toUserId` | string | ✅ (indexed) | Recipient user ID |
| `status` | string | ✅ | "pending" \| "accepted" \| "declined" |
| `message` | string | ❌ | Invite message |
| `sentAt` | datetime | ✅ | Invite sent time |
| `respondedAt` | datetime | ❌ | Response time |

#### Indexes
- `fromUserId`
- `toUserId`
- `status`
- Composite: `fromUserId` + `toUserId` (unique)
- `sentAt` (desc)

---

### 11. COMMENTS
**Collection ID:** `comments`
**Service:** `lib/appwrite/services/comments.ts`
**Purpose:** Comments on launches/projects

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `projectId` | string | ✅ (indexed) | Project/launch ID |
| `userId` | string | ✅ (indexed) | Commenter user ID |
| `content` | string | ✅ | Comment text |
| `parentId` | string | ❌ (indexed) | Parent comment (for replies) |
| `likesCount` | number | ✅ | Likes count |
| `createdAt` | datetime | ✅ | Comment time |
| `updatedAt` | datetime | ✅ | Last edit time |

#### Indexes
- `projectId`
- `userId`
- `parentId`
- `createdAt` (desc)

---

### 12. MESSAGES
**Collection ID:** `messages`
**Service:** `lib/appwrite/services/messages.ts`
**Purpose:** Chat messages

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `roomId` | string | ✅ (indexed) | Chat room ID |
| `senderId` | string | ✅ (indexed) | Sender user ID |
| `content` | string | ✅ | Message content |
| `type` | string | ✅ | "text" \| "image" \| "file" |
| `mediaUrl` | string | ❌ | Media attachment |
| `readBy` | string[] | ✅ | User IDs who read |
| `sentAt` | datetime | ✅ | Send timestamp |

#### Indexes
- `roomId`
- `senderId`
- `sentAt` (desc)

---

### 13. REFERRALS
**Collection ID:** `referrals`
**Service:** `lib/appwrite/services/referrals.ts`
**Purpose:** Referral tracking

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `referrerId` | string | ✅ (indexed) | Referrer user ID |
| `referredUserId` | string | ✅ (indexed) | Referred user ID |
| `referralCode` | string | ✅ (indexed) | Referral code used |
| `status` | string | ✅ | "pending" \| "completed" |
| `rewardEarned` | number | ✅ | Reward amount |
| `rewardType` | string | ✅ | "xp" \| "tokens" |
| `createdAt` | datetime | ✅ | Referral time |
| `completedAt` | datetime | ❌ | Completion time |

#### Indexes
- `referrerId`
- `referredUserId` (unique)
- `referralCode`
- `status`
- `createdAt` (desc)

---

### 14. REFERRAL_REWARDS
**Collection ID:** `referral_rewards`
**Service:** `lib/appwrite/services/referral-rewards.ts`
**Purpose:** Referral reward claims

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | string | ✅ (indexed) | User ID |
| `referralId` | string | ✅ (indexed) | Referral ID |
| `amount` | number | ✅ | Reward amount |
| `type` | string | ✅ | "xp" \| "tokens" |
| `claimed` | boolean | ✅ | Claim status |
| `claimedAt` | datetime | ❌ | Claim timestamp |
| `createdAt` | datetime | ✅ | Reward earned time |

#### Indexes
- `userId`
- `referralId`
- `claimed`
- `createdAt` (desc)

---

### 15. PAYOUTS
**Collection ID:** `payouts`
**Service:** `lib/appwrite/services/payouts.ts`
**Purpose:** User payouts/withdrawals

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | string | ✅ (indexed) | User ID |
| `amount` | number | ✅ | Payout amount |
| `type` | string | ✅ | "campaign" \| "quest" \| "referral" |
| `sourceId` | string | ✅ | Source campaign/quest ID |
| `status` | string | ✅ | "pending" \| "processing" \| "completed" \| "failed" |
| `walletAddress` | string | ✅ | Recipient wallet |
| `txSignature` | string | ❌ | Blockchain tx signature |
| `requestedAt` | datetime | ✅ | Request time |
| `processedAt` | datetime | ❌ | Processing time |

#### Indexes
- `userId`
- `sourceId`
- `status`
- `requestedAt` (desc)

---

### 16. ACTIVITIES
**Collection ID:** `activities`
**Service:** `lib/appwrite/services/activities.ts`
**Purpose:** User activity feed

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | string | ✅ (indexed) | User ID (recipient) |
| `actorId` | string | ✅ (indexed) | Actor user ID |
| `type` | string | ✅ | "vote" \| "comment" \| "follow" \| "trade" |
| `targetType` | string | ✅ | "launch" \| "campaign" \| "quest" |
| `targetId` | string | ✅ (indexed) | Target entity ID |
| `content` | string | ❌ | Activity content |
| `read` | boolean | ✅ | Read status |
| `createdAt` | datetime | ✅ | Activity time |

#### Indexes
- `userId`
- `actorId`
- `targetId`
- `read`
- `createdAt` (desc)

---

### 17. TRACKING_EVENTS
**Collection ID:** `tracking_events`
**Service:** `lib/appwrite/services/tracking.ts`
**Purpose:** Analytics event tracking

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | string | ❌ (indexed) | User ID (if logged in) |
| `eventName` | string | ✅ (indexed) | Event name |
| `eventData` | object | ❌ | Event metadata |
| `page` | string | ✅ | Page URL |
| `referrer` | string | ❌ | Referrer URL |
| `userAgent` | string | ❌ | User agent |
| `ip` | string | ❌ | IP address |
| `timestamp` | datetime | ✅ | Event time |

#### Indexes
- `userId`
- `eventName`
- `timestamp` (desc)

---

### 18. PRICE_HISTORY
**Collection ID:** `price_history`
**Service:** `lib/appwrite/services/price-history.ts`
**Purpose:** Token price snapshots

#### Attributes
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `curveAddress` | string | ✅ (indexed) | Curve PDA |
| `launchId` | string | ✅ (indexed) | Launch ID |
| `price` | number | ✅ | Token price |
| `marketCap` | number | ✅ | Market cap |
| `volume` | number | ✅ | Volume |
| `holders` | number | ✅ | Holder count |
| `timestamp` | datetime | ✅ (indexed) | Snapshot time |

#### Indexes
- `curveAddress`
- `launchId`
- `timestamp` (desc)
- Composite: `curveAddress` + `timestamp`

---

## Database Setup Script

**File:** `scripts/setup-complete-database.js`

```javascript
import { Client, Databases, ID } from 'node-appwrite'

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const databases = new Databases(client)
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID

async function setupDatabase() {
  console.log('Setting up Appwrite database...')

  // Create all collections
  await createUsersCollection()
  await createLaunchesCollection()
  await createCurvesCollection()
  await createCurveEventsCollection()
  await createCurveHoldersCollection()
  await createVotesCollection()
  await createCampaignsCollection()
  await createQuestsCollection()
  await createSubmissionsCollection()
  await createNetworkInvitesCollection()
  await createCommentsCollection()
  await createMessagesCollection()
  await createReferralsCollection()
  await createReferralRewardsCollection()
  await createPayoutsCollection()
  await createActivitiesCollection()
  await createTrackingEventsCollection()
  await createPriceHistoryCollection()

  console.log('✅ Database setup complete!')
}

// Run setup
setupDatabase().catch(console.error)
```

---

## Relationships

### Launch Ecosystem
```
USERS (creator)
  ↓ creates
LAUNCHES
  ↓ has
CURVES
  ↓ generates
CURVE_EVENTS
  ↓ updates
CURVE_HOLDERS
  ↓ tracked by
PRICE_HISTORY
```

### Social Ecosystem
```
USERS
  ↓ sends
NETWORK_INVITES
  ↓ becomes
CONNECTIONS (via status="accepted")

USERS
  ↓ writes
COMMENTS
  ↓ on
LAUNCHES
```

### Campaign Ecosystem
```
USERS (creator)
  ↓ creates
CAMPAIGNS / QUESTS
  ↓ receives
SUBMISSIONS
  ↓ approved →
PAYOUTS
```

### Referral Ecosystem
```
USERS (referrer)
  ↓ invites
USERS (referred)
  ↓ creates
REFERRALS
  ↓ generates
REFERRAL_REWARDS
```

---

## Missing Collections (To Create)

### BOOSTS (Optional)
**Purpose:** Boost/promotion tracking
**Priority:** Medium

```typescript
{
  projectId: string (indexed)
  userId: string (indexed)
  amount: number
  type: "visibility" | "trending" | "featured"
  duration: number // hours
  expiresAt: datetime
  createdAt: datetime
}
```

### RAIDS (Optional)
**Purpose:** Coordinated raids
**Priority:** Low

```typescript
{
  title: string
  description: string
  creatorId: string (indexed)
  targetUrl: string
  targetPlatform: string
  participants: string[] // user IDs
  reward: number
  status: "active" | "completed"
  startAt: datetime
  endAt: datetime
  createdAt: datetime
}
```

### BOUNTIES (Optional)
**Purpose:** Bounty boards
**Priority:** Low

```typescript
{
  title: string
  description: string
  creatorId: string (indexed)
  reward: number
  rewardType: "tokens" | "nft"
  category: string
  requirements: object
  submissions: string[] // submission IDs
  status: "open" | "claimed" | "completed"
  claimedBy: string // user ID
  createdAt: datetime
  completedAt: datetime
}
```

---

## Summary

**Total Collections:** 18 (all implemented)
**Total Attributes:** ~250+
**Total Indexes:** ~60+
**Service Files:** 18 (all complete)

**Status:** ✅ Production ready - All collections exist with full CRUD operations

The database schema is complete and robust. All major features have backend support. The primary work needed is wiring frontend components to call the existing service functions.

---

**Last Updated:** 2025-10-20
**Maintained By:** Engineering Team
