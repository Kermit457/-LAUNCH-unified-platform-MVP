# Appwrite Collection Update Script

## Quick Start

### Option 1: Run the Helper Script (Recommended)

```bash
# 1. Install dependencies (if not already)
npm install

# 2. Set up API key (see below)

# 3. Run the script
node scripts/update-project-members-role.js
```

### Option 2: Manual Update (2 minutes)

1. **Open Appwrite Console:**
   - Go to: https://cloud.appwrite.io/console
   - Select your project

2. **Navigate to Collection:**
   - Database → `launchos_db`
   - Collections → `project_members`

3. **Edit Role Attribute:**
   - Find the `role` attribute
   - Click "Edit" (pencil icon)
   - In the "Elements" field, add: `contributor`
   - Final values should be: `owner`, `member`, `contributor`
   - Click "Update"

4. **Done!** ✅

---

## Setting Up API Key (for script)

### Get Your API Key

1. Open Appwrite Console: https://cloud.appwrite.io/console
2. Select your project
3. Go to **Settings** → **API Keys**
4. Click **"Create API Key"**
5. Settings:
   - **Name:** "Collection Update Script"
   - **Scopes:** Check "Database" (read & write)
   - **Expiration:** Never (or set date)
6. Copy the API key

### Add to Environment

Add to your `.env.local` file:

```bash
# Appwrite API Key (for scripts only, never commit!)
APPWRITE_API_KEY=your_api_key_here
```

**⚠️ IMPORTANT:** Never commit API keys to git!

---

## What the Script Does

1. **Checks** if the `project_members` collection exists
2. **Finds** the `role` attribute
3. **Validates** current enum values
4. **Provides instructions** for manual update (Appwrite doesn't support enum modification via API)

**Note:** The script will give you step-by-step instructions for manual update, as Appwrite requires enum attributes to be updated through the console.

---

## Verification

After updating, verify it worked:

```bash
# Check if contributor role is accepted
node -e "
const { Client, Databases } = require('node-appwrite');
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);
const db = new Databases(client);
db.getCollection(
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'launchos_db',
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_MEMBERS_COLLECTION_ID || 'project_members'
).then(col => {
  const role = col.attributes.find(a => a.key === 'role');
  console.log('Role values:', role.elements);
  console.log('✅ Includes contributor:', role.elements.includes('contributor'));
});
"
```

---

## Troubleshooting

### "Missing APPWRITE_API_KEY"
- Add your API key to `.env.local`
- Make sure it has "Database" scope

### "Authentication failed"
- Check your API key is correct
- Verify it has "Database" read/write permissions

### "Collection not found"
- Check your `NEXT_PUBLIC_APPWRITE_DATABASE_ID` in `.env.local`
- Check your `NEXT_PUBLIC_APPWRITE_PROJECT_MEMBERS_COLLECTION_ID`

### "Cannot modify enum"
- This is expected! Appwrite requires manual update through console
- Follow the manual steps provided by the script

---

## Alternative: PowerShell Script

If you prefer PowerShell:

```powershell
# Set your API key
$env:APPWRITE_API_KEY="your_api_key_here"

# Run the Node script
node scripts/update-project-members-role.js
```

---

## Security Notes

- ✅ API keys are for server-side only
- ✅ Never commit `.env.local` to git
- ✅ Keep API keys secure
- ✅ Rotate keys periodically
- ✅ Use minimal scopes (only "Database" for this script)

---

## After Update

Once the `role` attribute includes `'contributor'`:

1. Test clip submission to a project
2. Verify user is added to PROJECT_MEMBERS with role: 'contributor'
3. Check pending clips appear in profile review tab
4. Test approve/reject workflow

🚀 **You're ready to ship!**
