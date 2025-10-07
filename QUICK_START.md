# 🚀 Quick Start - Seed Your Database Now!

## ✅ What's Already Set Up

You're ready to go! Here's what you already have:
- ✅ Appwrite connected
- ✅ Database created (`launchos_db`)
- ✅ Most collections exist
- ✅ API keys configured in `.env`

---

## 📝 Step 1: Create Missing Collection (2 minutes)

You need to add ONE new collection for network connections.

### Option A: Run Setup Script (Recommended)

Open your terminal and run:

```bash
npx tsx scripts/setup-appwrite.ts
```

This will:
- Create `network_connections` collection
- Add missing fields to `network_invites`
- Skip everything that already exists

### Option B: Manual Creation (If script doesn't work)

Go to Appwrite Console → Database → Create Collection:

**Collection Name:** `Network Connections`
**Collection ID:** `network_connections`

**Add these attributes:**
1. `connectionId` - String (100) - Required
2. `userId1` - String (100) - Required
3. `userId2` - String (100) - Required
4. `connectedAt` - DateTime - Required

**Permissions:** Same as other collections (users can read/create/update/delete)

---

## 🌱 Step 2: Run the Seed Script

In your terminal, run:

```bash
npx tsx scripts/seed-database.ts
```

You should see:

```
🌱 Starting database seed...

👥 Creating sample users...
✅ Created user: @crypto_whale
✅ Created user: @nft_creator
✅ Created user: @degen_trader
...
(15 users total)

🚀 Creating sample launches...
✅ Created launch: SolPump
...
(5 launches total)

📢 Creating sample campaigns...
✅ Created campaign: Create Viral TikTok Content
...
(5 campaigns total)

💌 Creating network invites...
✅ Created invite: alpha_hunter → crypto_whale
...
(4 invites total)

🤝 Creating network connections...
✅ Created connection: user_crypto_whale ↔ user_dev_builder
...
(8 connections total)

✨ Database seeding complete!

📊 Summary:
   Users: 15
   Launches: 5
   Campaigns: 5
   Network Invites: 4
   Network Connections: 8

🎉 Your database is now populated with sample data!
```

---

## 🎯 Step 3: Verify in Appwrite Console

1. Go to **Appwrite Console** → **Databases** → `launchos_db`
2. Check collections:
   - **users** → Should have 15 documents
   - **launches** → Should have 5 documents
   - **campaigns** → Should have 5 documents
   - **network_invites** → Should have 4 documents
   - **network_connections** → Should have 8 documents

---

## 🎨 Step 4: See It in Action!

Start your dev server:

```bash
npm run dev
```

Then visit:

### 1. Network Page
```
http://localhost:3002/network
```
You should see **15 user profiles** with:
- Real avatars
- Display names with emojis
- Roles/tags
- Bios
- Social links

### 2. Dashboard
```
http://localhost:3002/dashboard
```
You should see:
- Connected Network widget with users
- Network Invites widget with pending invites

### 3. Discover Page
```
http://localhost:3002/discover
```
You should see launches with creator profiles and avatars

---

## 👥 Who's in Your Network Now?

After seeding, you'll have these 15 users:

1. **Crypto Whale 🐋** - DeFi Trader (Verified) ⭐
2. **NFT Artist** - Creator
3. **Degen Trader** - High-risk Trader
4. **StreamerPro 🎮** - Streamer (Verified) ⭐
5. **Dev Builder** - Developer (Verified) ⭐
6. **Alpha Hunter 🎯** - Alpha Caller (Verified) ⭐
7. **Meme Queen 👑** - Memecoin Creator
8. **Yield Farmer 🌾** - DeFi Strategist
9. **NFT Flipper** - NFT Trader
10. **Web3 Designer ✨** - UI/UX Designer
11. **DAO Coordinator** - Governance Expert (Verified) ⭐
12. **Clipper King 🎬** - Video Editor
13. **Protocol Researcher 🔬** - Security Auditor (Verified) ⭐
14. **Social Raider ⚡** - Growth Hacker
15. **Project Launcher 🚀** - Serial Entrepreneur (Verified) ⭐

All with unique avatars, bios, and social profiles!

---

## 🐛 Troubleshooting

### "Collection not found" error
**Fix:** Create the `network_connections` collection (see Step 1)

### "Attribute already exists" warnings
**This is normal!** The script skips existing attributes. Just ignore these warnings.

### Network invites/connections show 0
**Fix:** Make sure you added:
```bash
NEXT_PUBLIC_APPWRITE_NETWORK_INVITES_COLLECTION_ID=network_invites
NEXT_PUBLIC_APPWRITE_NETWORK_CONNECTIONS_COLLECTION_ID=network_connections
```
to your `.env` file (already done!)

### No avatars showing
**Fix:** The avatars use DiceBear API. Make sure you have internet connection.

---

## ✅ Success Checklist

After running the seed:

- [ ] 15 users in Appwrite
- [ ] All users have avatars
- [ ] /network page shows profiles
- [ ] Dashboard shows connected network
- [ ] No console errors

---

## 🎉 You're Done!

Your database is now fully populated with:
- ✨ 15 diverse, realistic user profiles
- ✨ Complete network data (invites + connections)
- ✨ Token launches with creators
- ✨ Campaigns ready to test
- ✨ All components ready to display real data

**Next:** Start testing components one by one using the [SEED_AND_TEST_PLAN.md](./SEED_AND_TEST_PLAN.md)

---

## 📞 Need Help?

If something doesn't work:
1. Check Appwrite Console for data
2. Check browser console for errors
3. Review [SEED_SETUP_INSTRUCTIONS.md](./SEED_SETUP_INSTRUCTIONS.md) for detailed troubleshooting
