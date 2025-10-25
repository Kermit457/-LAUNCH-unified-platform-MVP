# BLAST Appwrite Collections Setup

## Overview
BLAST requires 9 Appwrite collections to function. This guide will walk you through creating each one.

## Database Setup

### 1. Create Database
- **Database ID**: `blast-network` (or use existing database)
- **Database Name**: BLAST Network Hub

---

## Collections to Create

### 1. `blast_rooms` - Room Storage
**Collection ID**: `blast_rooms`

**Attributes:**
- `type` (string, 20, required) - Room type: deal/airdrop/job/collab/funding
- `title` (string, 100, required) - Room title
- `description` (string, 500, required) - Room description
- `creatorId` (string, 50, required) - User ID of creator
- `creatorName` (string, 100, required) - Creator display name
- `creatorAvatar` (string, 500) - Creator avatar URL
- `creatorMotionScore` (integer) - Creator's Motion Score at creation
- `status` (string, 20, required) - Status: open/hot/closing/closed/full
- `duration` (string, 10, required) - Duration: 24h/48h/72h
- `endTime` (datetime, required) - When room closes
- `minKeys` (integer, required, default: 1) - Min keys to apply
- `maxSlots` (integer, required) - Max applicants
- `filledSlots` (integer, required, default: 0) - Current applicants
- `motionScore` (integer, default: 0) - Room's motion score
- `tags` (string[], max 5) - Room tags
- `metadata` (string, 2000) - JSON metadata specific to room type
- `extensionsUsed` (integer, default: 0) - Number of 24h extensions

**Indexes:**
- `type_status` (type ASC, status ASC) - Filter by type and status
- `creatorId` (creatorId ASC) - Get user's rooms
- `status_endTime` (status ASC, endTime DESC) - Active rooms sorted by closing time
- `motionScore` (motionScore DESC) - Hot rooms

**Permissions:**
- Create: Users
- Read: Any
- Update: Creator only (via function)
- Delete: Creator only

---

### 2. `blast_applicants` - Application Queue
**Collection ID**: `blast_applicants`

**Attributes:**
- `roomId` (string, 50, required) - Room being applied to
- `userId` (string, 50, required) - Applicant user ID
- `userName` (string, 100, required) - Applicant name
- `userAvatar` (string, 500) - Applicant avatar
- `message` (string, 500, required) - Application message
- `keysStaked` (integer, required) - Keys staked in vault
- `lockId` (string, 50, required) - Reference to vault lock
- `userMotionScore` (integer, required) - Applicant's Motion Score
- `priorityScore` (integer, required) - Calculated priority
- `activityCount` (integer, default: 0) - Activity in room
- `status` (string, 20, required) - Status: pending/accepted/rejected/ghosted
- `attachments` (string[], max 3) - Attachment URLs
- `appliedAt` (datetime, required) - Application timestamp
- `reviewedAt` (datetime) - When reviewed
- `reviewedBy` (string, 50) - Reviewer user ID

**Indexes:**
- `roomId_status` (roomId ASC, status ASC) - Get pending applications
- `roomId_priority` (roomId ASC, priorityScore DESC) - Priority queue
- `userId` (userId ASC) - User's applications
- `lockId` (lockId ASC) - Unique

**Permissions:**
- Create: Users
- Read: Room creator + applicant
- Update: Room creator only
- Delete: None

---

### 3. `blast_vault` - Key Vault Storage
**Collection ID**: `blast_vault`

**Attributes:**
- `userId` (string, 50, required, unique) - User ID
- `walletAddress` (string, 100, required) - Solana wallet
- `ownerId` (string, 50, required) - Curve owner ID
- `totalKeysLocked` (integer, default: 0) - Total locked keys
- `totalDeposits` (integer, default: 0) - Total deposits made
- `totalRefunded` (integer, default: 0) - Total refunds received
- `totalForfeited` (integer, default: 0) - Total forfeited
- `activeRooms` (integer, default: 0) - Current active applications

**Indexes:**
- `userId` (userId ASC, unique) - User lookup
- `walletAddress` (walletAddress ASC) - Wallet lookup

**Permissions:**
- Create: Users
- Read: User only
- Update: User only (via function)
- Delete: None

---

### 4. `blast_key_locks` - Individual Key Locks
**Collection ID**: `blast_key_locks`

**Attributes:**
- `userId` (string, 50, required) - Lock owner
- `roomId` (string, 50, required) - Room ID
- `applicantId` (string, 50) - Application reference
- `amount` (integer, required) - Keys locked
- `lockType` (string, 20, required) - Type: entry_deposit/stake/curator_bond
- `status` (string, 20, required) - Status: locked/refunded/forfeited
- `lockedAt` (datetime, required) - Lock timestamp
- `unlockedAt` (datetime) - Unlock timestamp
- `refundReason` (string, 200) - Why refunded
- `forfeitReason` (string, 200) - Why forfeited

**Indexes:**
- `userId_status` (userId ASC, status ASC) - User's active locks
- `roomId` (roomId ASC) - Room's locks
- `applicantId` (applicantId ASC) - Application lock

**Permissions:**
- Create: Users
- Read: User only
- Update: System only (via function)
- Delete: None

---

### 5. `blast_motion_scores` - Motion Score Records
**Collection ID**: `blast_motion_scores`

**Attributes:**
- `userId` (string, 50, required, unique) - User ID
- `currentScore` (integer, required, default: 0) - Current score (0-100)
- `baseScore` (integer, default: 0) - Base score before decay
- `decayAmount` (integer, default: 0) - Amount decayed
- `lastCalculated` (datetime, required) - Last calculation time
- `eventCount` (integer, default: 0) - Total events
- `roomSuccesses` (integer, default: 0) - Successful rooms
- `acceptedIntros` (integer, default: 15) - Accepted applications
- `holderGrowth` (integer, default: 0) - Holder count growth

**Indexes:**
- `userId` (userId ASC, unique) - User lookup
- `currentScore` (currentScore DESC) - Leaderboard

**Permissions:**
- Create: Users
- Read: Any
- Update: System only (via function)
- Delete: None

---

### 6. `blast_motion_events` - Motion Score Events
**Collection ID**: `blast_motion_events`

**Attributes:**
- `actorId` (string, 50, required) - User who performed action
- `type` (string, 30, required) - Event type (see MOTION_WEIGHTS)
- `roomId` (string, 50) - Related room
- `weight` (integer, required) - Event weight value
- `timestamp` (datetime, required) - When event occurred
- `metadata` (string, 500) - Additional event data

**Indexes:**
- `actorId_timestamp` (actorId ASC, timestamp DESC) - User events
- `roomId` (roomId ASC) - Room events
- `timestamp` (timestamp DESC) - Recent events

**Permissions:**
- Create: System only
- Read: Any
- Update: None
- Delete: None

---

### 7. `blast_dm_requests` - DM Request Market
**Collection ID**: `blast_dm_requests`

**Attributes:**
- `senderId` (string, 50, required) - Who sent request
- `senderName` (string, 100, required) - Sender name
- `receiverId` (string, 50, required) - Who receives
- `message` (string, 300, required) - Request message
- `depositAmount` (float, required, default: 0.02) - Keys deposited
- `lockId` (string, 50, required) - Vault lock reference
- `status` (string, 20, required) - Status: pending/accepted/declined/expired
- `requestedAt` (datetime, required) - Request timestamp
- `respondedAt` (datetime) - Response timestamp
- `expiresAt` (datetime, required) - 48h expiry

**Indexes:**
- `receiverId_status` (receiverId ASC, status ASC) - Inbox
- `senderId` (senderId ASC) - Sent requests
- `expiresAt` (expiresAt ASC) - Cleanup expired

**Permissions:**
- Create: Users
- Read: Sender + receiver
- Update: Receiver only
- Delete: None

---

### 8. `blast_matches` - Smart Matching Results
**Collection ID**: `blast_matches`

**Attributes:**
- `userId` (string, 50, required) - User being matched
- `matchedUserId` (string, 50, required) - Matched user
- `matchScore` (integer, required) - Match quality (0-100)
- `commonTags` (string[], max 10) - Overlapping tags
- `commonRooms` (string[], max 10) - Shared rooms
- `timezone` (string, 50) - Timezone match
- `skills` (string[], max 10) - Matching skills
- `generatedAt` (datetime, required) - Match timestamp
- `viewedAt` (datetime) - When user viewed
- `dismissed` (boolean, default: false) - User dismissed

**Indexes:**
- `userId_score` (userId ASC, matchScore DESC) - User's matches
- `matchedUserId` (matchedUserId ASC) - Reverse lookup
- `generatedAt` (generatedAt DESC) - Recent matches

**Permissions:**
- Create: System only
- Read: User only
- Update: User only
- Delete: User only

---

### 9. `blast_analytics` - Room Analytics
**Collection ID**: `blast_analytics`

**Attributes:**
- `roomId` (string, 50, required, unique) - Room reference
- `viewCount` (integer, default: 0) - Total views
- `uniqueViewers` (integer, default: 0) - Unique viewers
- `applyClickCount` (integer, default: 0) - Apply button clicks
- `shareCount` (integer, default: 0) - Shares
- `averageTimeSpent` (integer, default: 0) - Avg time (seconds)
- `conversionRate` (float, default: 0) - Apply rate %
- `topReferrers` (string[], max 5) - Top traffic sources
- `peakViewTime` (datetime) - Most popular time
- `lastUpdated` (datetime, required) - Last analytics update

**Indexes:**
- `roomId` (roomId ASC, unique) - Room lookup
- `viewCount` (viewCount DESC) - Popular rooms

**Permissions:**
- Create: System only
- Read: Room creator only
- Update: System only
- Delete: None

---

## Environment Variables

Add to `.env.local`:

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=blast-network

# Collection IDs
NEXT_PUBLIC_APPWRITE_BLAST_ROOMS_COLLECTION=blast_rooms
NEXT_PUBLIC_APPWRITE_BLAST_APPLICANTS_COLLECTION=blast_applicants
NEXT_PUBLIC_APPWRITE_BLAST_VAULT_COLLECTION=blast_vault
NEXT_PUBLIC_APPWRITE_BLAST_LOCKS_COLLECTION=blast_key_locks
NEXT_PUBLIC_APPWRITE_BLAST_MOTION_SCORES_COLLECTION=blast_motion_scores
NEXT_PUBLIC_APPWRITE_BLAST_MOTION_EVENTS_COLLECTION=blast_motion_events
NEXT_PUBLIC_APPWRITE_BLAST_DM_REQUESTS_COLLECTION=blast_dm_requests
NEXT_PUBLIC_APPWRITE_BLAST_MATCHES_COLLECTION=blast_matches
NEXT_PUBLIC_APPWRITE_BLAST_ANALYTICS_COLLECTION=blast_analytics
```

---

## Quick Setup Steps

1. **Open Appwrite Console**: https://cloud.appwrite.io
2. **Select Your Project**
3. **Create Database**: "BLAST Network Hub" (ID: `blast-network`)
4. **For Each Collection Above**:
   - Click "Add Collection"
   - Set Collection ID and Name
   - Add all attributes (Settings → Attributes)
   - Create indexes (Settings → Indexes)
   - Set permissions (Settings → Permissions)
5. **Update `.env.local`** with your IDs
6. **Restart dev server**

---

## Testing

After setup, test by:
1. Creating a room via Composer
2. Applying to a room
3. Viewing applicant queue
4. Checking vault status

---

## Notes

- **Metadata fields**: Store JSON strings for room-specific data
- **DateTime fields**: Use ISO 8601 format
- **Permissions**: Adjust based on your security needs
- **Indexes**: Critical for query performance
- **Functions**: Some updates require Appwrite Functions for security

---

## Next: Wire Up Hooks

Once collections are created, update these files:
- `lib/appwrite/config.ts` - Add collection IDs
- Service files already reference these collections
- React Query hooks ready to use

Ready to build! 🚀
