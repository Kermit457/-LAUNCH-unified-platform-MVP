# Appwrite Database Schema for LaunchOS

## Setup Instructions

1. Go to https://cloud.appwrite.io (or your self-hosted instance)
2. Create a new project named "LaunchOS"
3. Create a database named "launchos_db"
4. Create the following collections:

---

## Collections

### 1. **users** Collection
Stores user profile and wallet information.

**Attributes:**
- `userId` (string, required) - Appwrite user ID
- `username` (string, required, unique) - @handle
- `displayName` (string, required)
- `avatar` (string, optional) - URL or file ID
- `bio` (string, optional)
- `walletAddress` (string, optional)
- `roles` (string[], required) - ["Creator", "Trader", etc.]
- `verified` (boolean, default: false)
- `conviction` (integer, default: 0)
- `totalEarnings` (float, default: 0)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

**Indexes:**
- `username` (unique, asc)
- `walletAddress` (unique, asc)
- `createdAt` (desc)

**Permissions:**
- Read: Role: `any`
- Create: Role: `users`
- Update: User: `$userId` (owner only)
- Delete: User: `$userId` (owner only)

---

### 2. **launches** Collection
ICM and CCM launches.

**Attributes:**
- `launchId` (string, required, unique)
- `scope` (string, required) - "ICM" or "CCM"
- `status` (string, required) - "LIVE" or "UPCOMING"
- `title` (string, required)
- `subtitle` (string, optional)
- `logoUrl` (string, optional)
- `mint` (string, optional) - For ICM only
- `convictionPct` (integer, default: 0)
- `commentsCount` (integer, default: 0)
- `upvotes` (integer, default: 0)
- `tgeAt` (datetime, optional) - For UPCOMING
- `contributors` (string, optional) - JSON array of contributor objects
- `createdBy` (string, required) - userId
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

**Indexes:**
- `launchId` (unique)
- `scope` (asc)
- `status` (asc)
- `createdAt` (desc)
- `convictionPct` (desc)

**Permissions:**
- Read: Role: `any`
- Create: Role: `users`
- Update: User: `createdBy`
- Delete: User: `createdBy`

---

### 3. **campaigns** Collection
Clipping campaigns.

**Attributes:**
- `campaignId` (string, required, unique)
- `title` (string, required)
- `description` (string, optional)
- `createdBy` (string, required) - userId
- `status` (string, required) - "draft", "live", "paused", "ended"
- `ratePerThousand` (float, required)
- `budgetTotal` (float, required)
- `budgetPaid` (float, default: 0)
- `platforms` (string[], required) - ["twitter", "youtube", etc.]
- `clipDurationMin` (integer, optional)
- `clipDurationMax` (integer, optional)
- `streamUrl` (string, optional)
- `assetUrl` (string, optional)
- `views` (integer, default: 0)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)
- `endsAt` (datetime, optional)

**Indexes:**
- `campaignId` (unique)
- `createdBy` (asc)
- `status` (asc)
- `createdAt` (desc)

**Permissions:**
- Read: Role: `any`
- Create: Role: `users`
- Update: User: `createdBy`
- Delete: User: `createdBy`

---

### 4. **quests** Collection
Raids and Bounties.

**Attributes:**
- `questId` (string, required, unique)
- `type` (string, required) - "raid" or "bounty"
- `title` (string, required)
- `description` (string, optional)
- `createdBy` (string, required) - userId
- `status` (string, required) - "live", "paused", "ended"
- `poolAmount` (float, optional) - For raids
- `payPerTask` (float, optional) - For bounties
- `budgetTotal` (float, required)
- `budgetPaid` (float, default: 0)
- `platforms` (string[], required)
- `views` (integer, default: 0)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

**Indexes:**
- `questId` (unique)
- `type` (asc)
- `status` (asc)
- `createdAt` (desc)

---

### 5. **submissions** Collection
Campaign/quest submissions.

**Attributes:**
- `submissionId` (string, required, unique)
- `campaignId` (string, optional)
- `questId` (string, optional)
- `userId` (string, required)
- `status` (string, required) - "pending", "approved", "rejected"
- `mediaUrl` (string, required)
- `views` (integer, default: 0)
- `earnings` (float, default: 0)
- `notes` (string, optional)
- `createdAt` (datetime, required)
- `reviewedAt` (datetime, optional)

**Indexes:**
- `submissionId` (unique)
- `campaignId` (asc)
- `questId` (asc)
- `userId` (asc)
- `status` (asc)
- `createdAt` (desc)

**Permissions:**
- Read: Role: `any`
- Create: Role: `users`
- Update: Role: `users` (campaign owner can approve/reject)
- Delete: User: `userId`

---

### 6. **comments** Collection
Launch and campaign comments.

**Attributes:**
- `commentId` (string, required, unique)
- `launchId` (string, optional)
- `campaignId` (string, optional)
- `userId` (string, required)
- `username` (string, required)
- `avatar` (string, optional)
- `text` (string, required)
- `upvotes` (integer, default: 0)
- `parentId` (string, optional) - For replies
- `createdAt` (datetime, required)

**Indexes:**
- `commentId` (unique)
- `launchId` (asc)
- `campaignId` (asc)
- `createdAt` (desc)

**Permissions:**
- Read: Role: `any`
- Create: Role: `users`
- Update: User: `userId`
- Delete: User: `userId`

---

### 7. **notifications** Collection
User notifications.

**Attributes:**
- `notificationId` (string, required, unique)
- `userId` (string, required) - Recipient
- `type` (string, required) - See NotificationType enum
- `category` (string, required) - "network", "campaign", "financial", "platform"
- `title` (string, required)
- `message` (string, required)
- `read` (boolean, default: false)
- `actionUrl` (string, optional)
- `metadata` (string, optional) - JSON
- `createdAt` (datetime, required)

**Indexes:**
- `userId` (asc)
- `read` (asc)
- `createdAt` (desc)

**Permissions:**
- Read: User: `userId`
- Create: Role: `users`
- Update: User: `userId`
- Delete: User: `userId`

---

### 8. **network_invites** Collection
Connection invites between users.

**Attributes:**
- `inviteId` (string, required, unique)
- `senderId` (string, required)
- `receiverId` (string, required)
- `status` (string, required) - "pending", "accepted", "declined"
- `message` (string, optional)
- `createdAt` (datetime, required)
- `respondedAt` (datetime, optional)

**Indexes:**
- `senderId` (asc)
- `receiverId` (asc)
- `status` (asc)
- `createdAt` (desc)

**Permissions:**
- Read: User: `senderId` OR User: `receiverId`
- Create: Role: `users`
- Update: User: `receiverId`
- Delete: User: `senderId` OR User: `receiverId`

---

### 9. **messages** Collection
Direct messages between connected users.

**Attributes:**
- `messageId` (string, required, unique)
- `threadId` (string, required)
- `senderId` (string, required)
- `receiverId` (string, required)
- `text` (string, required)
- `read` (boolean, default: false)
- `createdAt` (datetime, required)

**Indexes:**
- `threadId` (asc)
- `createdAt` (desc)

**Permissions:**
- Read: User: `senderId` OR User: `receiverId`
- Create: Role: `users`
- Update: User: `receiverId` (mark as read only)
- Delete: User: `senderId`

---

## Storage Buckets

### 1. **avatars**
User profile pictures
- File size limit: 5MB
- Allowed file types: jpg, jpeg, png, webp
- Permissions: Read: `any`, Create: `users`, Update: owner, Delete: owner

### 2. **campaign_media**
Campaign assets and stream thumbnails
- File size limit: 50MB
- Allowed file types: jpg, jpeg, png, mp4, webm
- Permissions: Read: `any`, Create: `users`, Update: owner, Delete: owner

### 3. **submissions**
User submission clips and media
- File size limit: 100MB
- Allowed file types: mp4, webm, mov
- Permissions: Read: `any`, Create: `users`, Update: owner, Delete: owner

---

## Quick Setup Script

You can use the Appwrite CLI to create this schema:

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login
appwrite login

# Create database and collections
appwrite databases create --databaseId launchos_db --name "LaunchOS Database"

# Create collections (use the schema above)
# ... (full script would be too long, but you can use the Appwrite Console)
```

## Next Steps

1. Create the database and collections in Appwrite Console
2. Copy the Database ID and Collection IDs to your `.env` file
3. Run `npm install` to install Appwrite SDK
4. Test the connection with the auth provider
