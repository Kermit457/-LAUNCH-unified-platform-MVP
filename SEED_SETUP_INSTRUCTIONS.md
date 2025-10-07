 # Seed Script Setup & Testing Instructions

## 🎯 Overview

This guide will help you set up and run the enhanced seed script to populate your Appwrite database with **15 realistic user profiles** and network data for testing.

---

## 📋 Prerequisites

1. **Appwrite Instance** - Cloud or self-hosted
2. **Node.js** - v18 or higher
3. **Environment Variables** - Properly configured `.env` file

---

## 🔧 Step 1: Configure Environment Variables

### Required Variables

Your `.env` file must include these variables (copy from `.env.example` if needed):

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here

# Database
NEXT_PUBLIC_APPWRITE_DATABASE_ID=launchos_db

# Collection IDs (Required)
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID=launches
NEXT_PUBLIC_APPWRITE_CAMPAIGNS_COLLECTION_ID=campaigns

# Network Collections (Optional - will be skipped if not configured)
NEXT_PUBLIC_APPWRITE_NETWORK_INVITES_COLLECTION_ID=network_invites
NEXT_PUBLIC_APPWRITE_NETWORK_CONNECTIONS_COLLECTION_ID=network_connections
```

### How to Get Your API Key

1. Go to your Appwrite Console
2. Navigate to your project
3. Go to **Settings** → **API Keys**
4. Create a new API key with **full database permissions**
5. Copy the key and add it to your `.env` as `APPWRITE_API_KEY`

---

## 🏗️ Step 2: Create Appwrite Collections

You need to create these collections in your Appwrite database before running the seed script.

### A. Users Collection

**Collection ID:** `users`

**Attributes:**
- `userId` (string, required) - Unique user ID
- `username` (string, required) - Username (Twitter handle without @)
- `displayName` (string, required) - Display name
- `bio` (string, optional) - User bio
- `avatarUrl` (string, optional) - Profile picture URL
- `bannerUrl` (string, optional) - Banner image URL
- `verified` (boolean, required) - Verification status
- `conviction` (integer, required) - Conviction score (0-100)
- `totalEarnings` (float, required) - Total earnings
- `roles` (array of strings, required) - User roles
- `socialLinks` (JSON, optional) - Social media links

### B. Launches Collection

**Collection ID:** `launches`

**Attributes:**
- `launchId` (string, required)
- `scope` (string, required) - ICM or CCM
- `tokenName` (string, required)
- `tokenSymbol` (string, required)
- `tokenImage` (string, optional)
- `description` (string, required)
- `creatorId` (string, required)
- `creatorName` (string, required)
- `marketCap` (float, required)
- `volume24h` (float, required)
- `priceChange24h` (float, required)
- `holders` (integer, required)
- `convictionPct` (integer, required)
- `commentsCount` (integer, required)
- `upvotes` (integer, required)
- `tags` (array of strings, required)
- `status` (string, required)
- `createdAt` (datetime, required)

### C. Campaigns Collection

**Collection ID:** `campaigns`

**Attributes:**
- `campaignId` (string, required)
- `title` (string, required)
- `description` (string, required)
- `createdBy` (string, required)
- `status` (string, required)
- `ratePerThousand` (float, required)
- `budgetTotal` (float, required)
- `budgetPaid` (float, required)
- `platforms` (array of strings, required)
- `clipDurationMin` (integer, optional)
- `clipDurationMax` (integer, optional)
- `views` (integer, required)
- `endsAt` (datetime, required)

### D. Network Invites Collection (Optional)

**Collection ID:** `network_invites`

**Attributes:**
- `inviteId` (string, required)
- `senderId` (string, required)
- `senderUsername` (string, required)
- `senderDisplayName` (string, required)
- `senderAvatarUrl` (string, optional)
- `receiverId` (string, required)
- `receiverUsername` (string, required)
- `message` (string, optional)
- `status` (string, required) - pending, accepted, rejected
- `createdAt` (datetime, required)

### E. Network Connections Collection (Optional)

**Collection ID:** `network_connections`

**Attributes:**
- `connectionId` (string, required)
- `userId1` (string, required)
- `userId2` (string, required)
- `connectedAt` (datetime, required)

---

## 🚀 Step 3: Run the Seed Script

### Option 1: Using npm script (if configured)

```bash
npm run seed
```

### Option 2: Using tsx directly

```bash
npx tsx scripts/seed-database.ts
```

### Option 3: Using ts-node

```bash
npx ts-node scripts/seed-database.ts
```

---

## ✅ Step 4: Verify the Seed Data

After running the script, you should see output like:

```
🌱 Starting database seed...

👥 Creating sample users...
✅ Created user: @crypto_whale
✅ Created user: @nft_creator
✅ Created user: @degen_trader
... (15 users total)

🚀 Creating sample launches...
✅ Created launch: SolPump
... (5 launches total)

📢 Creating sample campaigns...
✅ Created campaign: Create Viral TikTok Content
... (5 campaigns total)

💌 Creating network invites...
✅ Created invite: alpha_hunter → crypto_whale
... (4 invites total)

🤝 Creating network connections...
✅ Created connection: user_crypto_whale ↔ user_dev_builder
... (8 connections total)

✨ Database seeding complete!

📊 Summary:
   Users: 15
   Launches: 5
   Campaigns: 5
   Network Invites: 4
   Network Connections: 8

🎉 Your database is now populated with sample data!

🔗 Check it out:
   - Discover: http://localhost:3002/discover
   - Earn: http://localhost:3002/earn
   - Network: http://localhost:3002/network
   - Dashboard: http://localhost:3002/dashboard
```

### Check in Appwrite Console

1. Go to your Appwrite Console
2. Navigate to **Databases** → Your Database
3. Check each collection:
   - **users**: Should have 15 documents
   - **launches**: Should have 5 documents
   - **campaigns**: Should have 5 documents
   - **network_invites**: Should have 4 documents (if collection exists)
   - **network_connections**: Should have 8 documents (if collection exists)

---

## 🎨 Step 5: View Seeded Data in Your App

### Navigate to these pages to see the data:

1. **Network Page** - `/network`
   - View all 15 user profiles
   - See network invites
   - Browse connections

2. **Discover Page** - `/discover`
   - View token launches
   - See creator profiles

3. **Earn Page** - `/earn`
   - View campaigns
   - See campaign creators

4. **Dashboard** - `/dashboard`
   - View connected network widget
   - See network invites widget

---

## 👥 Seeded User Profiles

The script creates 15 diverse user profiles:

1. **Crypto Whale 🐋** - DeFi Trader, Verified
2. **NFT Artist** - Creator
3. **Degen Trader** - High-risk Trader
4. **StreamerPro 🎮** - Streamer, Verified
5. **Dev Builder** - Developer, Verified
6. **Alpha Hunter 🎯** - Alpha Caller, Verified
7. **Meme Queen 👑** - Memecoin Creator
8. **Yield Farmer 🌾** - DeFi Strategist
9. **NFT Flipper** - NFT Trader
10. **Web3 Designer ✨** - UI/UX Designer
11. **DAO Coordinator** - Governance Expert, Verified
12. **Clipper King 🎬** - Video Editor
13. **Protocol Researcher 🔬** - Security Auditor, Verified
14. **Social Raider ⚡** - Growth Hacker
15. **Project Launcher 🚀** - Serial Entrepreneur, Verified

Each profile includes:
- Unique avatar (DiceBear API)
- Display name with emoji
- Realistic bio
- Social links (Twitter, YouTube, Twitch, Discord)
- Roles/tags
- Conviction score
- Total earnings

---

## 🔗 Network Data

### Network Invites (4 pending)
- Alpha Hunter → Crypto Whale
- DAO Coordinator → Dev Builder
- Clipper King → StreamerPro
- Meme Queen → NFT Creator

### Network Connections (8 established)
- Crypto Whale ↔ Dev Builder
- StreamerPro ↔ NFT Creator
- Alpha Hunter ↔ Protocol Researcher
- Dev Builder ↔ Protocol Researcher
- Project Launcher ↔ DAO Coordinator
- Yield Farmer ↔ Crypto Whale
- NFT Flipper ↔ NFT Creator
- Web3 Designer ↔ Project Launcher

---

## 🐛 Troubleshooting

### Error: "Collection not found"
**Solution:** Make sure you've created all required collections in Appwrite first.

### Error: "Invalid API key"
**Solution:** Check that your `APPWRITE_API_KEY` has full database permissions.

### Error: "Document already exists"
**Solution:** The script is idempotent. If data already exists, it will skip and show a warning. To re-seed:
1. Delete all documents in your collections
2. Run the script again

### Error: "Missing required attribute"
**Solution:** Verify that all collection attributes match the schema above.

### Network collections skipped
**Solution:** This is normal if you haven't configured the network collection IDs in your `.env` file. Add them to seed network data.

---

## 📝 Next Steps

After successful seeding:

1. ✅ Test ProfileCard component with real data
2. ✅ Test NetworkCard component with different users
3. ✅ Test /network page filters and search
4. ✅ Test network invite acceptance flow
5. ✅ Test dashboard widgets
6. ✅ Test avatar displays across all pages

Refer to [SEED_AND_TEST_PLAN.md](./SEED_AND_TEST_PLAN.md) for the complete testing checklist.

---

## 🎉 Success!

Your database is now populated with realistic Twitter-style user profiles ready for testing across your entire application!

**Questions or issues?** Check the main [SEED_AND_TEST_PLAN.md](./SEED_AND_TEST_PLAN.md) document.
