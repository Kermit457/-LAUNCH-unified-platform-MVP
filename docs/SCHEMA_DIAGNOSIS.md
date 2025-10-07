# Schema Diagnosis & Migration Plan

## 🔍 Current Issues

### Issue 1: Field Name Inconsistency
**Creation saves:**
- `title`
- `logoUrl`

**Display reads:**
- `tokenName`
- `tokenImage`

**Result:** Cards show "Untitled Launch" with placeholder images

---

### Issue 2: Missing Fields
**Creation doesn't save:**
- `description` (collected but not passed)
- `platforms` (collected but not used)
- Creator info beyond `createdBy`

---

### Issue 3: Schema Evolution
The Launch interface has BOTH old and new fields:
```typescript
// New fields (what we're using)
title: string
logoUrl: string

// Old fields (what displays expect)
tokenName: string
tokenImage: string
description: string
```

---

## 🎯 Resolution Strategy

### Option A: Use New Schema (Recommended)
**Changes needed:**
1. Update Launch interface to make `title`/`logoUrl` primary
2. Update discover page to read `title || tokenName`
3. Keep old fields as optional for backward compatibility

### Option B: Use Old Schema
**Changes needed:**
1. Update `createLaunchDocument()` to save `tokenName`/`tokenImage`
2. Pass `description` from form to creation

### Option C: Hybrid (Best for Migration)
**Save BOTH:**
```typescript
{
  title: data.title,
  tokenName: data.title,  // Duplicate for compatibility
  subtitle: data.subtitle,
  description: data.description || data.subtitle,
  logoUrl: logoUrl,
  tokenImage: logoUrl  // Duplicate for compatibility
}
```

---

## 📋 Recommended Action Plan

### Step 1: Check Current Appwrite Schema
```bash
# In Appwrite console, check launches collection attributes
# Document which fields actually exist
```

### Step 2: Update createLaunchDocument()
Add ALL fields that the display expects:

```typescript
await createLaunchDocument({
  launchId,
  scope: data.scope,

  // New schema fields
  title: data.title,
  subtitle: data.subtitle,
  logoUrl,

  // Old schema fields (for compatibility)
  tokenName: data.title,
  tokenImage: logoUrl,
  description: data.subtitle || '',

  // Metadata
  createdBy: userId,
  convictionPct: 0,
  commentsCount: 0,
  upvotes: 0,
  contributionPoolPct: data.economics?.contributionPoolPct,
  feesSharePct: data.economics?.feesSharePct,
  status: data.status === 'Live' ? 'live' : 'upcoming',

  // Tags (for filtering)
  tags: [data.scope],

  // Entity ownership (NEW)
  ownerType: selectedEntity.type,
  ownerId: selectedEntity.id
})
```

### Step 3: Update Display Logic
Make it resilient to both schemas:

```typescript
// In discover/page.tsx
{
  id: launch.$id,
  title: launch.title || launch.tokenName || 'Unnamed Launch',
  subtitle: launch.subtitle || launch.description || '',
  logoUrl: launch.logoUrl || launch.tokenImage,
  scope: launch.scope || (launch.tags?.includes('ICM') ? 'ICM' : 'CCM'),
  // ...
}
```

### Step 4: Purge Test Data
```sql
-- In Appwrite console
-- Delete all documents from launches collection
-- OR use the UI to delete individually
```

### Step 5: Test Creation Flow
1. Click "Create a Launch"
2. Select entity (user or project)
3. Fill in form with:
   - Title: "Test Launch"
   - Subtitle: "This is a test"
   - Logo: Upload image
   - Scope: ICM
   - Status: Live
4. Submit
5. Verify it appears in discover page
6. Verify data in Appwrite console

---

## 🔧 Quick Fix Script

Here's what to update NOW:

### File 1: `app/discover/page.tsx`
**Change line ~100:**
```typescript
// OLD
title: launch.tokenName,
logoUrl: launch.tokenImage,

// NEW
title: launch.title || launch.tokenName || 'Unnamed Launch',
subtitle: launch.subtitle || launch.description || '',
logoUrl: launch.logoUrl || launch.tokenImage || '',
```

### File 2: `app/discover/page.tsx`
**Change line ~690 (in submit handler):**
```typescript
await createLaunchDocument({
  launchId,
  scope: data.scope,
  title: data.title,
  subtitle: data.subtitle,
  logoUrl,

  // DUPLICATE FOR COMPATIBILITY
  tokenName: data.title,
  tokenImage: logoUrl,
  description: data.subtitle || '',

  createdBy: userId,
  convictionPct: 0,
  commentsCount: 0,
  upvotes: 0,
  contributionPoolPct: data.economics?.contributionPoolPct,
  feesSharePct: data.economics?.feesSharePct,
  status: data.status === 'Live' ? 'live' : 'upcoming',

  // Add tags for filtering
  tags: [data.scope],
})
```

### File 3: `lib/appwrite/services/launches.ts`
**Update createLaunchDocument interface:**
```typescript
export async function createLaunchDocument(data: {
  launchId: string
  scope: 'ICM' | 'CCM'
  title: string
  subtitle?: string
  logoUrl?: string
  createdBy: string

  // Compatibility fields
  tokenName?: string
  tokenImage?: string
  description?: string
  tags?: string[]

  // Metadata
  convictionPct?: number
  commentsCount?: number
  upvotes?: number
  contributionPoolPct?: number
  feesSharePct?: number
  status?: 'live' | 'upcoming' | 'ended'
})
```

---

## ✅ Verification Checklist

After fixes:
- [ ] Purge all test launches from Appwrite
- [ ] Create new launch via form
- [ ] Launch appears in discover page immediately
- [ ] Launch shows correct title (not "Untitled")
- [ ] Launch shows correct logo (not placeholder)
- [ ] Launch shows correct ICM/CCM badge
- [ ] Entity ownership is saved (check Appwrite console)
- [ ] project_member entry created if project launch

---

## 🚨 Critical Next Step

**DO THIS NOW:**
1. Check Appwrite console → launches collection → attributes
2. Write down which fields actually exist
3. Update the code to match

Without knowing the actual schema, we're guessing!