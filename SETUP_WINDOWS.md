# Appwrite Setup for Windows (PowerShell/CMD)

This guide provides Windows-compatible commands for setting up Appwrite.

---

## Prerequisites

```powershell
# Install Appwrite CLI globally
npm install -g appwrite-cli

# Verify installation
appwrite --version
```

---

## Step 1: Login to Appwrite

```powershell
# Login (opens browser)
appwrite login
```

Follow the browser prompts to authenticate.

---

## Step 2: Set Your Project

**Option A: Interactive (Recommended)**
```powershell
appwrite init project
```

This will prompt you to select your project interactively.

**Option B: Command Line**
```powershell
appwrite client `
  --endpoint "https://cloud.appwrite.io/v1" `
  --projectId "YOUR_PROJECT_ID" `
  --key "YOUR_API_KEY"
```

Replace:
- `YOUR_PROJECT_ID` - Get from Appwrite Console → Settings
- `YOUR_API_KEY` - Get from Appwrite Console → Settings → API Keys

---

## Step 3: Create Database

```powershell
appwrite databases create `
  --databaseId "launchos_db" `
  --name "LaunchOS Database"
```

**Expected Output:**
```
✓ Database created successfully
```

---

## Step 4: Create Collections

I'll create a PowerShell script to automate this.

### Create a PowerShell Script

Save this as `setup-collections.ps1`:

```powershell
# setup-collections.ps1
$DB_ID = "launchos_db"

Write-Host "Creating collections..." -ForegroundColor Cyan

# Collection 1: Launches
Write-Host "`nCreating launches collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "launches" `
  --name "Launches" `
  --permissions "read(""any"")" `
  --documentSecurity "true"

# Collection 2: Campaigns
Write-Host "`nCreating campaigns collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "campaigns" `
  --name "Campaigns" `
  --permissions "read(""any"")" `
  --documentSecurity "true"

# Collection 3: Quests
Write-Host "`nCreating quests collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "quests" `
  --name "Quests" `
  --permissions "read(""any"")" `
  --documentSecurity "true"

# Collection 4: Submissions
Write-Host "`nCreating submissions collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "submissions" `
  --name "Submissions" `
  --permissions "read(""any"")" `
  --documentSecurity "true"

# Collection 5: Payouts
Write-Host "`nCreating payouts collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "payouts" `
  --name "Payouts" `
  --permissions "read(""users"")" `
  --documentSecurity "true"

# Collection 6: Users
Write-Host "`nCreating users collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "users" `
  --name "Users" `
  --permissions "read(""any"")" `
  --documentSecurity "true"

# Collection 7: Comments
Write-Host "`nCreating comments collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "comments" `
  --name "Comments" `
  --permissions "read(""any"")" `
  --documentSecurity "true"

# Collection 8: Threads
Write-Host "`nCreating threads collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "threads" `
  --name "Threads" `
  --permissions "read(""any"")" `
  --documentSecurity "true"

# Collection 9: Activities
Write-Host "`nCreating activities collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "activities" `
  --name "Activities" `
  --permissions "read(""users"")" `
  --documentSecurity "true"

# Collection 10: Notifications
Write-Host "`nCreating notifications collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "notifications" `
  --name "Notifications" `
  --permissions "read(""users"")" `
  --documentSecurity "true"

# Collection 11: Network Invites
Write-Host "`nCreating network_invites collection..." -ForegroundColor Yellow
appwrite collections create `
  --databaseId $DB_ID `
  --collectionId "network_invites" `
  --name "Network Invites" `
  --permissions "read(""users"")" `
  --documentSecurity "true"

Write-Host "`nAll collections created successfully!" -ForegroundColor Green
```

### Run the Script

```powershell
# Run from project root
.\setup-collections.ps1
```

---

## Step 5: Quick Setup Using Appwrite Console (Easier!)

Instead of running 200+ CLI commands, use the Appwrite Console UI:

### **Recommended: Use Appwrite Console**

1. **Go to Appwrite Console:** https://cloud.appwrite.io/console

2. **Create Database:**
   - Click "Databases" → "Create Database"
   - Database ID: `launchos_db`
   - Name: "LaunchOS Database"

3. **Import Schema (If Available):**
   - Appwrite supports JSON schema import
   - We can export the schema and import it

4. **Or Create Collections Manually:**
   - Click "Add Collection"
   - Use the table below for each collection

### **Collection Reference Table:**

| Collection | ID | Name | Permissions |
|------------|----|----- |-------------|
| Launches | `launches` | Launches | read(any) |
| Campaigns | `campaigns` | Campaigns | read(any) |
| Quests | `quests` | Quests | read(any) |
| Submissions | `submissions` | Submissions | read(any) |
| Payouts | `payouts` | Payouts | read(users) |
| Users | `users` | Users | read(any) |
| Comments | `comments` | Comments | read(any) |
| Threads | `threads` | Threads | read(any) |
| Activities | `activities` | Activities | read(users) |
| Notifications | `notifications` | Notifications | read(users) |
| Network Invites | `network_invites` | Network Invites | read(users) |

---

## Step 6: Seed Database

After collections are created (either via CLI or Console):

```powershell
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

## Step 7: Test Locally

```powershell
# Set environment variables in .env.local
# NEXT_PUBLIC_USE_MOCK_DATA=false
# NEXT_PUBLIC_SHOW_DEV_BANNER=true

# Start dev server
npm run dev
```

Visit: http://localhost:3000

**Expected:**
- 🔵 Blue dev banner (using live data)
- Homepage shows 4 launches from database
- Campaign pages work
- Earnings dashboard works

---

## Alternative: Use `appwrite.json`

Create `appwrite.json` in project root:

```json
{
  "projectId": "YOUR_PROJECT_ID",
  "projectName": "LaunchOS",
  "databases": [
    {
      "$id": "launchos_db",
      "name": "LaunchOS Database"
    }
  ],
  "collections": [
    {
      "$id": "launches",
      "databaseId": "launchos_db",
      "name": "Launches",
      "$permissions": ["read(\"any\")"],
      "documentSecurity": true,
      "enabled": true,
      "attributes": []
    }
  ]
}
```

Then run:
```powershell
appwrite deploy collection
```

---

## Troubleshooting

### Issue: PowerShell Parser Error
```
Missing expression after unary operator '--'
```

**Solution:** Use backticks (`) for line continuation in PowerShell:
```powershell
# Wrong (Bash syntax)
appwrite client \
  --endpoint https://cloud.appwrite.io/v1

# Correct (PowerShell syntax)
appwrite client `
  --endpoint "https://cloud.appwrite.io/v1"
```

### Issue: Command Not Found
```
appwrite : The term 'appwrite' is not recognized
```

**Solution:**
```powershell
# Install globally
npm install -g appwrite-cli

# Restart PowerShell
# Try again
appwrite --version
```

### Issue: Permission Denied
```
cannot be loaded because running scripts is disabled
```

**Solution:**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Try again
.\setup-collections.ps1
```

---

## Recommended Workflow for Windows

**Easiest approach:**

1. ✅ **Use Appwrite Console UI** for creating database & collections
   - Faster than CLI
   - Visual interface
   - Less error-prone

2. ✅ **Use npm script** for seeding
   ```powershell
   npm run seed
   ```

3. ✅ **Use npm scripts** for development
   ```powershell
   npm run dev
   npm run build
   npm start
   ```

**Total time:** 30 minutes instead of 2 hours!

---

## Quick Start Checklist

- [ ] Install Appwrite CLI: `npm install -g appwrite-cli`
- [ ] Login: `appwrite login`
- [ ] Create database in Appwrite Console (UI)
- [ ] Create 11 collections in Appwrite Console (UI)
- [ ] Update `.env.local` with your project ID
- [ ] Seed database: `npm run seed`
- [ ] Test: `npm run dev`
- [ ] Visit: http://localhost:3000

**Done!** 🚀
