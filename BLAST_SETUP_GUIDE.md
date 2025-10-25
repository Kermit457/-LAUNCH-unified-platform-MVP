# BLAST Complete Setup Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Appwrite API Key

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project
3. Go to **Settings** → **API Keys**
4. Click **Create API Key**
5. Name it: `BLAST Setup`
6. Scopes needed:
   - ✅ `databases.read`
   - ✅ `databases.write`
   - ✅ `collections.read`
   - ✅ `collections.write`
   - ✅ `attributes.read`
   - ✅ `attributes.write`
   - ✅ `indexes.read`
   - ✅ `indexes.write`
7. **Copy the API key** (you'll only see it once!)

### Step 2: Add API Key to .env.local

```bash
# Open .env.local and add:
APPWRITE_API_KEY=your-api-key-here
```

Make sure you already have:
```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
```

### Step 3: Install Dependencies (if not already)

```bash
npm install node-appwrite --save-dev
```

### Step 4: Run Setup Script

```bash
node scripts/setup-blast-collections.js
```

**Expected output:**
```
🚀 BLAST Appwrite Setup

Endpoint: https://cloud.appwrite.io/v1
Project: your-project-id
Database: blast-network

✅ Database created: blast-network

📦 Creating collection: blast_rooms
   ✅ Collection created: blast_rooms
   ✓ Attribute: type
   ✓ Attribute: title
   ...
   ✓ Index: type_status
   ✓ Index: motionScore

📦 Creating collection: blast_applicants
   ...

============================================================
✅ BLAST Setup Complete!

Collections created:
  ✅ blast_rooms
  ✅ blast_applicants
  ✅ blast_vault
  ✅ blast_key_locks
  ✅ blast_motion_scores
  ✅ blast_motion_events
  ✅ blast_dm_requests
  ✅ blast_matches
  ✅ blast_analytics

📝 Add these to your .env.local:

NEXT_PUBLIC_APPWRITE_DATABASE_ID=blast-network
NEXT_PUBLIC_APPWRITE_BLAST_ROOMS_COLLECTION=blast_rooms
...

🎉 Ready to go! Run your app and test BLAST features.
```

### Step 5: Copy Environment Variables

The script outputs all collection IDs. Copy them to `.env.local`:

```bash
NEXT_PUBLIC_APPWRITE_DATABASE_ID=blast-network
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

### Step 6: Start Development Server

```bash
npm run dev
```

Navigate to `/BLAST` and test:
1. **Create Room** - Click "Create" button
2. **Apply to Room** - Open a room and apply
3. **Accept Application** - As creator, accept an applicant
4. **Check Motion Score** - See your score in "My Panel"

---

## 🔧 Setup Cron Jobs (5 Minutes)

Background jobs handle room status transitions and refunds.

### Option 1: Cron-job.org (Recommended - Free)

1. Go to [cron-job.org](https://cron-job.org)
2. Create account (free)
3. **Add new cron job:**
   - Title: `BLAST Background Jobs`
   - URL: `https://your-app.vercel.app/api/blast/cron`
   - Schedule: `*/5 * * * *` (every 5 minutes)
   - Method: `GET`
4. **Optional: Add auth** (recommended):
   - Generate secret: `openssl rand -hex 32`
   - Add to `.env.local`: `CRON_SECRET=your-secret`
   - Add header in cron-job.org:
     - Header name: `Authorization`
     - Header value: `Bearer your-secret`
5. **Save & Enable**

### Option 2: Vercel Cron (Requires Pro Plan)

Already configured in `vercel.json`! Just deploy to Vercel with Pro plan.

---

## ✅ Verification Checklist

After setup, verify everything works:

### 1. Collections Exist
- [ ] Go to Appwrite Console → Databases
- [ ] See `blast-network` database
- [ ] See all 9 collections inside

### 2. Environment Variables Set
- [ ] All `NEXT_PUBLIC_APPWRITE_BLAST_*` variables in `.env.local`
- [ ] App restarts without errors

### 3. Create Room Flow
- [ ] Navigate to `/BLAST`
- [ ] Click "Create" button
- [ ] Fill out form and submit
- [ ] See new room in feed

### 4. Apply Flow
- [ ] Click on a room
- [ ] Click "Apply" button
- [ ] Submit application with keys
- [ ] See application in queue

### 5. Motion Score
- [ ] Check "My Panel" sidebar
- [ ] See Motion Score displayed
- [ ] Perform action (create/apply)
- [ ] Score updates

### 6. Background Jobs
- [ ] Check health: `https://your-app.vercel.app/api/blast/cron/status`
- [ ] Should show `"healthy": true`
- [ ] No expired rooms
- [ ] Cron is hitting endpoint (check Vercel logs)

---

## 🐛 Troubleshooting

### Script fails with "401 Unauthorized"
- Check `APPWRITE_API_KEY` is set in `.env.local`
- Verify API key has all required scopes
- Make sure project ID is correct

### Script fails with "409 Conflict"
- Collections already exist (this is fine!)
- Script is idempotent, safe to re-run
- Check Appwrite Console to verify collections

### "Collection not found" errors in app
- Check all `NEXT_PUBLIC_APPWRITE_BLAST_*` env vars are set
- Restart dev server after adding env vars
- Verify collection IDs match in Appwrite Console

### Rooms not closing automatically
- Check cron is running: `/api/blast/cron/status`
- Manually trigger: `curl -X POST https://your-app.vercel.app/api/blast/cron`
- Check Vercel logs for cron errors

### Motion Scores not updating
- Scores update on events (create, apply, accept)
- Force recalc by performing an action
- Check `blast_motion_events` collection has data

---

## 📊 What You Get

After setup, you have a complete viral dealflow platform with:

✅ **5 Room Types** - Deal, Airdrop, Job, Collab, Funding
✅ **Key-Gated Access** - 4 tiers based on key holdings
✅ **Priority Queue** - Weighted scoring for applicants
✅ **Motion Score** - Exponential decay reputation system
✅ **Auto Refunds** - Based on activity (2+ actions = refund)
✅ **Status Transitions** - open → hot → closing → closed
✅ **Real-time Updates** - Query polling every 5s
✅ **Background Jobs** - Automated room lifecycle

---

## 🚢 Deploy to Production

1. **Push to GitHub**
```bash
git add .
git commit -m "Add BLAST Network Hub"
git push
```

2. **Deploy to Vercel**
```bash
vercel --prod
```

3. **Set Environment Variables** in Vercel Dashboard:
   - Copy all `NEXT_PUBLIC_APPWRITE_*` variables
   - Add `CRON_SECRET` if using auth

4. **Enable Cron** (if using Vercel Cron):
   - Upgrade to Vercel Pro ($20/mo)
   - Cron automatically activates

5. **Set up external cron** (if not using Vercel):
   - Follow cron-job.org steps above
   - Use production URL

---

## 🎉 You're Live!

Test the complete flow:
1. Create room
2. Apply to room
3. Accept application
4. Wait for room to close (or close manually)
5. Verify refunds processed

**Share your BLAST link:** `https://your-app.vercel.app/BLAST`

---

Need help? Check:
- [BLAST_APPWRITE_SETUP.md](./BLAST_APPWRITE_SETUP.md) - Manual collection setup
- [BLAST_CRON_SETUP.md](./BLAST_CRON_SETUP.md) - Background jobs guide
- [SOLANA_ARCHITECTURE_V3_FINAL.md](./SOLANA_ARCHITECTURE_V3_FINAL.md) - System architecture
