# P0 Critical Path Deployment Guide

Step-by-step guide to deploy LaunchOS to production.

---

## ✅ **COMPLETED:**

### 1. **All 6 Missing API Routes Implemented**
- ✅ `GET /api/launches/[id]/contributors` - Get top contributors for a launch
- ✅ `GET /api/campaigns/[id]/stats` - Real-time campaign statistics
- ✅ `GET /api/users/[id]/earnings` - User earnings summary
- ✅ `GET /api/dex/token?address=` - Dexscreener proxy with caching
- ✅ `POST /api/events/emit` - Internal event emitter
- ✅ `GET /api/leaderboard?limit=10` - Earnings leaderboard

### 2. **Seed Database Script Ready**
- ✅ Script exists at `scripts/seed-database.ts`
- ✅ npm script: `npm run seed`
- ✅ Populates: launches, campaigns, quests, users

---

## 🔧 **TODO: Manual Execution Required**

### **Step 1: Run Appwrite Setup** (1-2 hours)

#### **Prerequisites:**
```bash
# Install Appwrite CLI globally
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Set your project
appwrite client \
  --endpoint https://cloud.appwrite.io/v1 \
  --projectId YOUR_PROJECT_ID \
  --key YOUR_API_KEY
```

#### **Execute Setup Commands:**

Open `APPWRITE_SETUP_COMMANDS.md` and run **ALL** commands sequentially:

1. **Create Database** (1 command)
```bash
appwrite databases create \
  --databaseId launchos_db \
  --name "LaunchOS Database"
```

2. **Create All 13 Collections** (13 commands)
   - launches
   - campaigns
   - quests
   - submissions
   - payouts
   - users
   - comments
   - threads
   - activities
   - notifications
   - network_invites
   - candles_cache
   - activity_bins

3. **Create All Attributes** (~150 commands)
   - Run all `appwrite attributes create*` commands
   - This defines the schema for each collection

4. **Create All Indexes** (~40 commands)
   - Run all `appwrite indexes create` commands
   - This optimizes query performance

**Estimated Time:** 1-2 hours (copy-paste from APPWRITE_SETUP_COMMANDS.md)

---

### **Step 2: Seed Initial Data** (5 minutes)

After collections are created, populate with test data:

```bash
# Make sure .env.local has your Appwrite credentials
npm run seed
```

**Expected Output:**
```
🌱 Starting database seed...

👥 Seeding users...
  ✅ Created user: AIKit Team
  ✅ Created user: MEME DAO
  ✅ Created user: Boost Protocol

🚀 Seeding launches...
  ✅ Created launch: $AIKIT Token
  ✅ Created launch: $MEME Season 2
  ✅ Created launch: $BOOST Rewards Token
  ✅ Created launch: $RAID Token

📹 Seeding campaigns...
  ✅ Created campaign: Clip $AIKIT Launch Video
  ✅ Created campaign: $MEME Twitter Raid
  ✅ Created campaign: $BOOST TikTok Challenge

🎯 Seeding quests...
  ✅ Created quest: Raid $AIKIT Twitter Announcement
  ✅ Created quest: Write Thread About $MEME
  ✅ Created quest: Discord Community Raid

✅ Database seeded successfully!
```

---

### **Step 3: Deploy Appwrite Functions** (1 hour)

#### **Option A: Manual Deployment**

For each function, follow this pattern:

**Function 1: Candles Cache Updater**

1. Create function directory structure:
```bash
mkdir -p functions/candles-cache-updater/src
cd functions/candles-cache-updater
```

2. Create `package.json`:
```json
{
  "name": "candles-cache-updater",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "node-appwrite": "^14.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

3. Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

4. Copy function code from `API_AND_FUNCTIONS_PLAN.md` to `src/main.ts`

5. Create Appwrite function:
```bash
appwrite functions create \
  --functionId candles-cache-updater \
  --name "Candles Cache Updater" \
  --runtime node-18.0 \
  --execute any \
  --timeout 900
```

6. Set environment variables:
```bash
appwrite functions updateVariables \
  --functionId candles-cache-updater \
  --variables '{"APPWRITE_ENDPOINT":"https://cloud.appwrite.io/v1","APPWRITE_PROJECT_ID":"your_project_id","APPWRITE_API_KEY":"your_api_key","APPWRITE_DATABASE_ID":"launchos_db","DEXSCREENER_API_URL":"https://api.dexscreener.com"}'
```

7. Deploy:
```bash
npm install
npm run build
appwrite functions deploy --functionId candles-cache-updater
```

8. Create schedule (every 1 minute):
```bash
appwrite functions createExecution \
  --functionId candles-cache-updater \
  --schedule "* * * * *"
```

**Repeat for:**
- `activity-bins-aggregator` (every 5 minutes: `*/5 * * * *`)
- `contribution-verifier` (event-driven: no schedule)

#### **Option B: Skip Functions for Now**

Functions are optional for initial launch. You can:
1. Launch without them
2. Use mock candles data (already implemented)
3. Manually approve submissions
4. Add functions later when you need automation

---

### **Step 4: Test End-to-End** (30 minutes)

#### **A. Test with Mock Data**
```bash
# In .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SHOW_DEV_BANNER=true

npm run dev
```

Visit: `http://localhost:3000`

**Expected:**
- 🟠 Orange banner shows "MOCK DATA ACTIVE"
- Homepage shows mock launches
- Can navigate to launch details
- All pages load without errors

#### **B. Test with Live Appwrite Data**
```bash
# In .env.local
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_SHOW_DEV_BANNER=true

npm run dev
```

Visit: `http://localhost:3000`

**Expected:**
- 🔵 Blue banner shows "DEVELOPMENT MODE"
- Homepage shows 4 seeded launches ($AIKIT, $MEME, $BOOST, $RAID)
- Launch detail pages load
- Earnings page works (shows $0 initially)

#### **C. Test User Flows**

**Flow 1: Browse Launches**
1. Go to homepage → See 4 launches
2. Click $AIKIT launch → See detail page
3. Check team/contributors section (empty initially)

**Flow 2: View Campaigns**
1. Go to `/earn` → See 3 campaigns
2. Click "Clip $AIKIT Launch Video" → See campaign details
3. Check stats (0 submissions, $2000 budget)

**Flow 3: Check Earnings**
1. Go to `/earnings` → Enter test user ID
2. Should show $0 earnings (no submissions yet)

#### **D. Test API Endpoints**

```bash
# Test new API routes
curl http://localhost:3000/api/leaderboard

curl http://localhost:3000/api/campaigns/[campaign_id]/stats

curl http://localhost:3000/api/dex/token?address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

**Expected:** All return JSON without errors

---

### **Step 5: Production Deployment** (30 minutes)

#### **A. Update Environment Variables**

Create `.env.production`:
```env
# Feature Flags
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_SHOW_DEV_BANNER=false

# Appwrite Production
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_production_project_id
APPWRITE_API_KEY=your_production_api_key
NEXT_PUBLIC_APPWRITE_DATABASE_ID=launchos_db

# All collection IDs (same as .env.example)
# ...
```

#### **B. Build and Deploy**

**Option 1: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

**Option 2: Docker**
```bash
# Build
docker build -t launchos .

# Run
docker run -p 3000:3000 --env-file .env.production launchos
```

**Option 3: Traditional Node**
```bash
# Build
npm run build

# Start production server
npm start
```

---

## 📋 **Deployment Checklist**

### **Pre-Deployment:**
- [ ] Appwrite project created
- [ ] All 13 collections created
- [ ] All attributes created
- [ ] All indexes created
- [ ] Database seeded with test data
- [ ] Environment variables configured
- [ ] Tested with `USE_MOCK_DATA=false`

### **Optional (Can Skip Initially):**
- [ ] Appwrite Functions deployed
- [ ] Dexscreener API integrated
- [ ] Real-time features enabled

### **Production:**
- [ ] `USE_MOCK_DATA=false` in production
- [ ] `SHOW_DEV_BANNER=false` in production
- [ ] All environment variables set
- [ ] Build succeeds without errors
- [ ] All pages load correctly
- [ ] API endpoints return data

---

## 🚨 **Known Issues & Solutions**

### **Issue 1: Privy Configuration Error**
```
Error: Cannot initialize the Privy provider with an invalid Privy app ID
```

**Solution:**
```bash
# Add to .env.local
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Or remove Privy temporarily:
# Comment out <PrivyProvider> in app/layout.tsx
```

### **Issue 2: Appwrite Connection Failed**
```
Error: Project with the requested ID could not be found
```

**Solution:**
```bash
# Double-check .env.local
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

### **Issue 3: Collections Not Found**
```
Error: Collection with the requested ID could not be found
```

**Solution:**
1. Verify collections created: `appwrite collections list --databaseId launchos_db`
2. Re-run setup commands if missing
3. Check collection IDs match `.env.local`

---

## ⏱️ **Time Estimates**

| Task | Time | Status |
|------|------|--------|
| Run Appwrite setup commands | 1-2 hours | ⚠️ TODO |
| Seed database | 5 minutes | ⚠️ TODO |
| Deploy Appwrite Functions (optional) | 1 hour | ⚠️ TODO |
| Test end-to-end | 30 minutes | ⚠️ TODO |
| Production deployment | 30 minutes | ⚠️ TODO |
| **TOTAL (with functions)** | **3-4 hours** | |
| **TOTAL (skip functions)** | **2-3 hours** | |

---

## 🎯 **Success Criteria**

Your app is production-ready when:

1. ✅ Homepage loads and shows launches from Appwrite
2. ✅ Launch detail pages work
3. ✅ Campaign pages display correctly
4. ✅ Earnings dashboard functions
5. ✅ No dev banner in production
6. ✅ All API endpoints return 200 OK
7. ✅ Users can create accounts (if auth enabled)
8. ✅ Database has seed data

---

## 📝 **Quick Command Reference**

```bash
# Setup
appwrite login
appwrite client --endpoint ... --projectId ... --key ...

# Create database & collections (from APPWRITE_SETUP_COMMANDS.md)
appwrite databases create --databaseId launchos_db --name "LaunchOS Database"
# ... run all other commands

# Seed database
npm run seed

# Test locally
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🆘 **Need Help?**

1. **Check existing documentation:**
   - `APPWRITE_SETUP_COMMANDS.md` - All CLI commands
   - `API_AND_FUNCTIONS_PLAN.md` - Function code
   - `FEATURE_FLAGS_GUIDE.md` - Mock data toggle

2. **Verify environment:**
   ```bash
   # Print all env vars
   env | grep APPWRITE
   env | grep NEXT_PUBLIC
   ```

3. **Check Appwrite Console:**
   - https://cloud.appwrite.io/console
   - View databases, collections, documents

4. **Test API directly:**
   ```bash
   # Test Appwrite connection
   curl https://cloud.appwrite.io/v1/databases/launchos_db/collections \
     -H "X-Appwrite-Project: YOUR_PROJECT_ID" \
     -H "X-Appwrite-Key: YOUR_API_KEY"
   ```

---

**You're almost there! The app is 95% ready. Just need to execute these deployment steps.** 🚀
