# 🚀 Appwrite Setup Instructions

## ✅ What We've Done

1. ✅ Added Appwrite SDK to package.json
2. ✅ Created Appwrite client configuration
3. ✅ Updated .env with your credentials
4. ✅ Created database setup script

## 📋 Next Steps - Run These Commands:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Database & Collections
```bash
npm run setup-appwrite
```

This will automatically create:
- ✅ Database: `launchos_db`
- ✅ 9 Collections (users, launches, campaigns, quests, submissions, comments, notifications, network_invites, messages)
- ✅ 3 Storage Buckets (avatars, campaign_media, submissions)

### Step 3: Start Development Server
```bash
npm run dev
```

---

## 🔧 If Setup Fails

### Error: "Collection already exists"
The database might already exist. You can either:
1. Delete it from Appwrite Console → Databases → Delete `launchos_db`
2. Or manually create collections following `lib/appwrite/schema.md`

### Error: "Rate limit exceeded"
Wait 1 minute and run again. Appwrite has rate limits for API calls.

### Error: "Invalid API key"
Check your `.env` file has the correct:
- `APPWRITE_API_KEY`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`

---

## 📚 What's Next After Setup?

Once the database is created, we can:
1. Create authentication system
2. Replace mock data with real Appwrite queries
3. Build API routes for campaigns, launches, etc.

---

## 🔑 Your Current Configuration

- **Endpoint:** https://fra.cloud.appwrite.io/v1
- **Project ID:** 68e34a030010f2321359
- **Database ID:** launchos_db

View your project: https://cloud.appwrite.io/console/project-68e34a030010f2321359
