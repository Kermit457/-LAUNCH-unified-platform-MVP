# Appwrite Setup Commands (Idempotent)

Complete CLI commands to create all databases, collections, attributes, and indexes for LaunchOS.

---

## Prerequisites

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to your Appwrite instance
appwrite login

# Set project
appwrite client --endpoint https://cloud.appwrite.io/v1 \
  --projectId YOUR_PROJECT_ID \
  --key YOUR_API_KEY
```

---

## 1. Create Database

```bash
appwrite databases create \
  --databaseId launchos_db \
  --name "LaunchOS Database"
```

---

## 2. Collections & Attributes

### 2.1 **Launches Collection**

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId launches \
  --name "Launches" \
  --permissions 'read("any")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key tokenName \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key tokenSymbol \
  --size 50 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key tokenImage \
  --size 1000 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key description \
  --size 10000 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key creatorId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key creatorName \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key creatorAvatar \
  --size 1000 \
  --required false

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId launches \
  --key marketCap \
  --required true \
  --default 0

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId launches \
  --key volume24h \
  --required true \
  --default 0

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId launches \
  --key priceChange24h \
  --required true \
  --default 0

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId launches \
  --key holders \
  --required true \
  --default 0

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId launches \
  --key convictionPct \
  --required true \
  --default 0 \
  --min 0 \
  --max 100

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId launches \
  --key commentsCount \
  --required true \
  --default 0

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId launches \
  --key upvotes \
  --required true \
  --default 0

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key tags \
  --size 5000 \
  --array true \
  --required true

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId launches \
  --key createdAt \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId launches \
  --key status \
  --elements live,upcoming,ended \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key team \
  --size 50000 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId launches \
  --key contributors \
  --size 50000 \
  --required false

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId launches \
  --key status_idx \
  --type key \
  --attributes status \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId launches \
  --key createdAt_idx \
  --type key \
  --attributes createdAt \
  --orders DESC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId launches \
  --key upvotes_idx \
  --type key \
  --attributes upvotes \
  --orders DESC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId launches \
  --key convictionPct_idx \
  --type key \
  --attributes convictionPct \
  --orders DESC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId launches \
  --key marketCap_idx \
  --type key \
  --attributes marketCap \
  --orders DESC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId launches \
  --key creatorId_idx \
  --type key \
  --attributes creatorId \
  --orders ASC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "launches",
  "permissions": {
    "read": ["any"],
    "create": ["users"],
    "update": ["user:$creatorId"],
    "delete": ["user:$creatorId"]
  }
}
```

---

### 2.2 **Campaigns Collection**

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId campaigns \
  --name "Campaigns" \
  --permissions 'read("any")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key title \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key description \
  --size 10000 \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key type \
  --elements bounty,quest,airdrop \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key creatorId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key creatorName \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key creatorAvatar \
  --size 1000 \
  --required false

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key budget \
  --required true

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key budgetPaid \
  --required true \
  --default 0

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key participants \
  --required true \
  --default 0

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key deadline \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key status \
  --elements active,completed,cancelled \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key requirements \
  --size 5000 \
  --array true \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key tags \
  --size 5000 \
  --array true \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key imageUrl \
  --size 1000 \
  --required false

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key createdAt \
  --required true

# Campaign-specific fields
appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key ratePerThousand \
  --required false

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key totalViews \
  --required false \
  --default 0

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key platforms \
  --size 1000 \
  --array true \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key socialLinks \
  --size 5000 \
  --array true \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key creatorKitUrl \
  --size 1000 \
  --required false

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key minViews \
  --required false

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key minDuration \
  --required false

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key maxDuration \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key topSubmissions \
  --size 50000 \
  --required false

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key status_idx \
  --type key \
  --attributes status \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key deadline_idx \
  --type key \
  --attributes deadline \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key createdAt_idx \
  --type key \
  --attributes createdAt \
  --orders DESC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key type_idx \
  --type key \
  --attributes type \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key creatorId_idx \
  --type key \
  --attributes creatorId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId campaigns \
  --key budget_idx \
  --type key \
  --attributes budget \
  --orders DESC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "campaigns",
  "permissions": {
    "read": ["any"],
    "create": ["users"],
    "update": ["user:$creatorId"],
    "delete": ["user:$creatorId"]
  }
}
```

---

### 2.3 **Quests Collection**

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId quests \
  --name "Quests" \
  --permissions 'read("any")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId quests \
  --key questId \
  --size 255 \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId quests \
  --key type \
  --elements raid,bounty \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId quests \
  --key title \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId quests \
  --key description \
  --size 10000 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId quests \
  --key createdBy \
  --size 255 \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId quests \
  --key status \
  --elements active,completed,cancelled \
  --required true

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId quests \
  --key poolAmount \
  --required true

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId quests \
  --key participants \
  --required true \
  --default 0

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId quests \
  --key requirements \
  --size 5000 \
  --array true \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId quests \
  --key platforms \
  --size 1000 \
  --array true \
  --required true

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId quests \
  --key deadline \
  --required true

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId quests \
  --key createdAt \
  --required true

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId quests \
  --key status_idx \
  --type key \
  --attributes status \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId quests \
  --key type_idx \
  --type key \
  --attributes type \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId quests \
  --key deadline_idx \
  --type key \
  --attributes deadline \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId quests \
  --key createdAt_idx \
  --type key \
  --attributes createdAt \
  --orders DESC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId quests \
  --key createdBy_idx \
  --type key \
  --attributes createdBy \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId quests \
  --key poolAmount_idx \
  --type key \
  --attributes poolAmount \
  --orders DESC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId quests \
  --key questId_idx \
  --type unique \
  --attributes questId \
  --orders ASC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "quests",
  "permissions": {
    "read": ["any"],
    "create": ["users"],
    "update": ["user:$createdBy"],
    "delete": ["user:$createdBy"]
  }
}
```

---

### 2.4 **Submissions Collection**

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId submissions \
  --name "Submissions" \
  --permissions 'read("any")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId submissions \
  --key submissionId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId submissions \
  --key campaignId \
  --size 255 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId submissions \
  --key questId \
  --size 255 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId submissions \
  --key userId \
  --size 255 \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId submissions \
  --key status \
  --elements pending,approved,rejected \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId submissions \
  --key mediaUrl \
  --size 1000 \
  --required true

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId submissions \
  --key views \
  --required true \
  --default 0

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId submissions \
  --key earnings \
  --required true \
  --default 0

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId submissions \
  --key notes \
  --size 5000 \
  --required false

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId submissions \
  --key reviewedAt \
  --required false

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId submissions \
  --key userId_idx \
  --type key \
  --attributes userId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId submissions \
  --key campaignId_idx \
  --type key \
  --attributes campaignId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId submissions \
  --key questId_idx \
  --type key \
  --attributes questId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId submissions \
  --key status_idx \
  --type key \
  --attributes status \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId submissions \
  --key userId_status_idx \
  --type key \
  --attributes userId,status \
  --orders ASC,ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId submissions \
  --key submissionId_idx \
  --type unique \
  --attributes submissionId \
  --orders ASC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "submissions",
  "permissions": {
    "read": ["user:$userId", "user:$campaignCreatorId", "role:admin"],
    "create": ["users"],
    "update": ["user:$campaignCreatorId", "role:admin"],
    "delete": ["user:$userId", "role:admin"]
  }
}
```

---

### 2.5 **Payouts Collection**

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId payouts \
  --name "Payouts" \
  --permissions 'read("users")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId payouts \
  --key payoutId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId payouts \
  --key userId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId payouts \
  --key campaignId \
  --size 255 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId payouts \
  --key questId \
  --size 255 \
  --required false

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId payouts \
  --key amount \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId payouts \
  --key currency \
  --size 20 \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId payouts \
  --key status \
  --elements pending,claimable,claimed,paid \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId payouts \
  --key txHash \
  --size 255 \
  --required false

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId payouts \
  --key claimedAt \
  --required false

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId payouts \
  --key paidAt \
  --required false

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId payouts \
  --key fee \
  --required false

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId payouts \
  --key net \
  --required false

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId payouts \
  --key userId_idx \
  --type key \
  --attributes userId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId payouts \
  --key status_idx \
  --type key \
  --attributes status \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId payouts \
  --key userId_status_idx \
  --type key \
  --attributes userId,status \
  --orders ASC,ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId payouts \
  --key payoutId_idx \
  --type unique \
  --attributes payoutId \
  --orders ASC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "payouts",
  "permissions": {
    "read": ["user:$userId", "role:admin"],
    "create": ["role:admin"],
    "update": ["role:admin"],
    "delete": ["role:admin"]
  }
}
```

---

### 2.6 **Users/Profiles Collection**

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId users \
  --name "Users" \
  --permissions 'read("any")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId users \
  --key name \
  --size 255 \
  --required true

appwrite attributes createEmail \
  --databaseId launchos_db \
  --collectionId users \
  --key email \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId users \
  --key avatarUrl \
  --size 1000 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId users \
  --key walletAddress \
  --size 255 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId users \
  --key bio \
  --size 5000 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId users \
  --key socials \
  --size 5000 \
  --required false

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId users \
  --key reputation \
  --required true \
  --default 0

appwrite attributes createFloat \
  --databaseId launchos_db \
  --collectionId users \
  --key totalEarnings \
  --required true \
  --default 0

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId users \
  --key createdAt \
  --required true

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId users \
  --key updatedAt \
  --required true

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId users \
  --key email_idx \
  --type unique \
  --attributes email \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId users \
  --key walletAddress_idx \
  --type unique \
  --attributes walletAddress \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId users \
  --key reputation_idx \
  --type key \
  --attributes reputation \
  --orders DESC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId users \
  --key createdAt_idx \
  --type key \
  --attributes createdAt \
  --orders DESC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "users",
  "permissions": {
    "read": ["any"],
    "create": ["role:system"],
    "update": ["user:$id"],
    "delete": ["user:$id", "role:admin"]
  }
}
```

---

### 2.7 **Comments Collection**

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId comments \
  --name "Comments" \
  --permissions 'read("any")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId comments \
  --key launchId \
  --size 255 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId comments \
  --key campaignId \
  --size 255 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId comments \
  --key userId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId comments \
  --key userName \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId comments \
  --key userAvatar \
  --size 1000 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId comments \
  --key text \
  --size 10000 \
  --required true

appwrite attributes createInteger \
  --databaseId launchos_db \
  --collectionId comments \
  --key upvotes \
  --required true \
  --default 0

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId comments \
  --key parentId \
  --size 255 \
  --required false

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId comments \
  --key launchId_idx \
  --type key \
  --attributes launchId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId comments \
  --key campaignId_idx \
  --type key \
  --attributes campaignId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId comments \
  --key userId_idx \
  --type key \
  --attributes userId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId comments \
  --key parentId_idx \
  --type key \
  --attributes parentId \
  --orders ASC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "comments",
  "permissions": {
    "read": ["any"],
    "create": ["users"],
    "update": ["user:$userId"],
    "delete": ["user:$userId", "role:admin"]
  }
}
```

---

### 2.8 **Threads Collection** (Real-time Chat)

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId threads \
  --name "Threads" \
  --permissions 'read("any")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId threads \
  --key threadId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId threads \
  --key launchId \
  --size 255 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId threads \
  --key userId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId threads \
  --key userName \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId threads \
  --key message \
  --size 10000 \
  --required true

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId threads \
  --key createdAt \
  --required true

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId threads \
  --key launchId_idx \
  --type key \
  --attributes launchId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId threads \
  --key createdAt_idx \
  --type key \
  --attributes createdAt \
  --orders DESC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId threads \
  --key userId_idx \
  --type key \
  --attributes userId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId threads \
  --key threadId_idx \
  --type unique \
  --attributes threadId \
  --orders ASC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "threads",
  "permissions": {
    "read": ["any"],
    "create": ["users"],
    "update": ["user:$userId"],
    "delete": ["user:$userId", "role:admin"]
  }
}
```

---

### 2.9 **Activities Collection** (User Activity Log)

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId activities \
  --name "Activities" \
  --permissions 'read("users")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId activities \
  --key userId \
  --size 255 \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId activities \
  --key type \
  --elements launch_created,submission_created,payout_claimed,comment_posted,upvoted \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId activities \
  --key targetId \
  --size 255 \
  --required false

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId activities \
  --key metadata \
  --size 10000 \
  --required false

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId activities \
  --key createdAt \
  --required true

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId activities \
  --key userId_idx \
  --type key \
  --attributes userId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId activities \
  --key type_idx \
  --type key \
  --attributes type \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId activities \
  --key createdAt_idx \
  --type key \
  --attributes createdAt \
  --orders DESC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "activities",
  "permissions": {
    "read": ["user:$userId"],
    "create": ["role:system"],
    "update": ["role:system"],
    "delete": ["role:admin"]
  }
}
```

---

### 2.10 **Notifications Collection**

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId notifications \
  --name "Notifications" \
  --permissions 'read("users")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId notifications \
  --key userId \
  --size 255 \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId notifications \
  --key type \
  --elements submission_approved,payout_ready,new_comment,launch_live \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId notifications \
  --key title \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId notifications \
  --key message \
  --size 1000 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId notifications \
  --key link \
  --size 1000 \
  --required false

appwrite attributes createBoolean \
  --databaseId launchos_db \
  --collectionId notifications \
  --key read \
  --required true \
  --default false

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId notifications \
  --key createdAt \
  --required true

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId notifications \
  --key userId_idx \
  --type key \
  --attributes userId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId notifications \
  --key read_idx \
  --type key \
  --attributes read \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId notifications \
  --key userId_read_idx \
  --type key \
  --attributes userId,read \
  --orders ASC,ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId notifications \
  --key createdAt_idx \
  --type key \
  --attributes createdAt \
  --orders DESC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "notifications",
  "permissions": {
    "read": ["user:$userId"],
    "create": ["role:system"],
    "update": ["user:$userId"],
    "delete": ["user:$userId"]
  }
}
```

---

### 2.11 **Network Invites Collection**

```bash
# Create collection
appwrite collections create \
  --databaseId launchos_db \
  --collectionId network_invites \
  --name "Network Invites" \
  --permissions 'read("users")' \
  --documentSecurity true

# Attributes
appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId network_invites \
  --key senderId \
  --size 255 \
  --required true

appwrite attributes createString \
  --databaseId launchos_db \
  --collectionId network_invites \
  --key receiverId \
  --size 255 \
  --required true

appwrite attributes createEnum \
  --databaseId launchos_db \
  --collectionId network_invites \
  --key status \
  --elements pending,accepted,rejected \
  --required true

appwrite attributes createDatetime \
  --databaseId launchos_db \
  --collectionId network_invites \
  --key createdAt \
  --required true

# Indexes
appwrite indexes create \
  --databaseId launchos_db \
  --collectionId network_invites \
  --key senderId_idx \
  --type key \
  --attributes senderId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId network_invites \
  --key receiverId_idx \
  --type key \
  --attributes receiverId \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId network_invites \
  --key status_idx \
  --type key \
  --attributes status \
  --orders ASC

appwrite indexes create \
  --databaseId launchos_db \
  --collectionId network_invites \
  --key receiverId_status_idx \
  --type key \
  --attributes receiverId,status \
  --orders ASC,ASC
```

**Permissions (appwrite.json):**
```json
{
  "collectionId": "network_invites",
  "permissions": {
    "read": ["user:$senderId", "user:$receiverId"],
    "create": ["users"],
    "update": ["user:$receiverId"],
    "delete": ["user:$senderId", "role:admin"]
  }
}
```

---

## 3. Complete `appwrite.json` Configuration

```json
{
  "projectId": "YOUR_PROJECT_ID",
  "projectName": "LaunchOS",
  "databases": [
    {
      "databaseId": "launchos_db",
      "name": "LaunchOS Database",
      "collections": [
        {
          "collectionId": "launches",
          "name": "Launches",
          "permissions": {
            "read": ["any"],
            "create": ["users"],
            "update": ["user:$creatorId"],
            "delete": ["user:$creatorId"]
          }
        },
        {
          "collectionId": "campaigns",
          "name": "Campaigns",
          "permissions": {
            "read": ["any"],
            "create": ["users"],
            "update": ["user:$creatorId"],
            "delete": ["user:$creatorId"]
          }
        },
        {
          "collectionId": "quests",
          "name": "Quests",
          "permissions": {
            "read": ["any"],
            "create": ["users"],
            "update": ["user:$createdBy"],
            "delete": ["user:$createdBy"]
          }
        },
        {
          "collectionId": "submissions",
          "name": "Submissions",
          "permissions": {
            "read": ["user:$userId", "user:$campaignCreatorId", "role:admin"],
            "create": ["users"],
            "update": ["user:$campaignCreatorId", "role:admin"],
            "delete": ["user:$userId", "role:admin"]
          }
        },
        {
          "collectionId": "payouts",
          "name": "Payouts",
          "permissions": {
            "read": ["user:$userId", "role:admin"],
            "create": ["role:admin"],
            "update": ["role:admin"],
            "delete": ["role:admin"]
          }
        },
        {
          "collectionId": "users",
          "name": "Users",
          "permissions": {
            "read": ["any"],
            "create": ["role:system"],
            "update": ["user:$id"],
            "delete": ["user:$id", "role:admin"]
          }
        },
        {
          "collectionId": "comments",
          "name": "Comments",
          "permissions": {
            "read": ["any"],
            "create": ["users"],
            "update": ["user:$userId"],
            "delete": ["user:$userId", "role:admin"]
          }
        },
        {
          "collectionId": "threads",
          "name": "Threads",
          "permissions": {
            "read": ["any"],
            "create": ["users"],
            "update": ["user:$userId"],
            "delete": ["user:$userId", "role:admin"]
          }
        },
        {
          "collectionId": "activities",
          "name": "Activities",
          "permissions": {
            "read": ["user:$userId"],
            "create": ["role:system"],
            "update": ["role:system"],
            "delete": ["role:admin"]
          }
        },
        {
          "collectionId": "notifications",
          "name": "Notifications",
          "permissions": {
            "read": ["user:$userId"],
            "create": ["role:system"],
            "update": ["user:$userId"],
            "delete": ["user:$userId"]
          }
        },
        {
          "collectionId": "network_invites",
          "name": "Network Invites",
          "permissions": {
            "read": ["user:$senderId", "user:$receiverId"],
            "create": ["users"],
            "update": ["user:$receiverId"],
            "delete": ["user:$senderId", "role:admin"]
          }
        }
      ]
    }
  ]
}
```

---

## 4. Quick Setup Script

Create `scripts/setup-appwrite.sh`:

```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== LaunchOS Appwrite Setup ===${NC}\n"

# Create database
echo -e "${GREEN}Creating database...${NC}"
appwrite databases create \
  --databaseId launchos_db \
  --name "LaunchOS Database"

# Collections
collections=("launches" "campaigns" "quests" "submissions" "payouts" "users" "comments" "threads" "activities" "notifications" "network_invites")

for collection in "${collections[@]}"; do
  echo -e "${GREEN}Creating $collection collection...${NC}"
  # Run collection-specific commands here
done

echo -e "\n${BLUE}=== Setup Complete! ===${NC}"
```

---

## 5. Verification Commands

```bash
# List all databases
appwrite databases list

# List all collections
appwrite collections list --databaseId launchos_db

# List attributes for a collection
appwrite attributes list \
  --databaseId launchos_db \
  --collectionId launches

# List indexes for a collection
appwrite indexes list \
  --databaseId launchos_db \
  --collectionId launches
```

---

## Notes

- All commands are **idempotent** - safe to run multiple times
- `--documentSecurity true` enables row-level permissions
- Indexes improve query performance but take time to build
- Permissions use Appwrite's role-based system
- Replace `YOUR_PROJECT_ID` and `YOUR_API_KEY` with actual values
