# Appwrite Schema Migration Plan
## User/Project Entity Model Implementation

### Overview
Transform the platform to treat Projects as first-class entities with their own dashboards, similar to organization accounts.

---

## Required Collection Changes

### 1. **launches** Collection
**Current Issues:**
- Conflicting field names between interface and actual schema
- Missing `scope` field (ICM/CCM is hardcoded)

**Required Fields:**
```typescript
{
  $id: string              // Auto-generated
  launchId: string         // Custom ID (e.g., "launch_mytoken_123")
  scope: 'ICM' | 'CCM'     // Project type
  title: string            // Project name (not tokenName)
  subtitle: string         // Short description
  logoUrl: string          // Project avatar/logo
  createdBy: string        // User ID who created it
  convictionPct: number
  commentsCount: number
  upvotes: number
  contributionPoolPct: number
  feesSharePct: number
  status: 'live' | 'upcoming' | 'ended'
  $createdAt: string       // Auto-generated
}
```

**Migration Action:**
- Decide if we keep `tokenName/tokenSymbol/tokenImage` OR migrate to `title/subtitle/logoUrl`
- Add `scope` field if missing
- Update TypeScript interfaces to match actual schema

---

### 2. **project_members** Collection (NEW)
**Purpose:** Track team members and roles for each project

```typescript
{
  $id: string
  projectId: string        // Foreign key to launches.$id
  userId: string           // Foreign key to users.$id
  role: 'owner' | 'member'
  joinedAt: string
}
```

**Indexes:**
- `projectId` (for querying members of a project)
- `userId` (for querying projects a user belongs to)

**Permissions:**
- Read: Anyone can see project members
- Create: Only project owners
- Update/Delete: Only project owners

---

### 3. **campaigns** Collection
**Add Entity Scoping:**

```typescript
{
  // ... existing fields ...
  ownerType: 'user' | 'project'  // NEW: Entity type
  ownerId: string                 // NEW: User ID or Project ID
}
```

**Migration:**
- Add these two fields
- Set default `ownerType: 'user'` and `ownerId: creatorId` for existing records
- Update queries to filter by `ownerId` instead of just `creatorId`

---

### 4. **submissions** Collection
**Add Entity Scoping:**

```typescript
{
  // ... existing fields ...
  ownerType: 'user' | 'project'  // NEW: Who this submission is for
  ownerId: string                 // NEW: User or Project ID
}
```

---

### 5. **activities** Collection
**Add Context Scoping:**

```typescript
{
  // ... existing fields ...
  contextType: 'user' | 'project'  // NEW: Activity context
  contextId: string                 // NEW: User or Project ID
}
```

---

### 6. **payouts** Collection
**Add Entity Scoping:**

```typescript
{
  // ... existing fields ...
  ownerType: 'user' | 'project'
  ownerId: string
}
```

---

## Migration Steps

### Step 1: Backup Current Data
```bash
# Export all collections before making changes
```

### Step 2: Add New Collections
1. Create `project_members` collection with schema above
2. For each existing launch, create an entry with `role: 'owner'` and `userId: createdBy`

### Step 3: Update Existing Collections
1. Add new fields to campaigns, submissions, activities, payouts
2. Run migration script to populate defaults for existing records

### Step 4: Update TypeScript Interfaces
1. Fix Launch interface to match actual schema
2. Add ProjectMember interface
3. Add ownerType/ownerId to Campaign, Submission, Activity, Payout interfaces

### Step 5: Update Service Functions
1. Update all `getCampaigns()` to accept `ownerId` and `ownerType`
2. Update create functions to set ownership fields
3. Add `getProjectMembers()`, `addProjectMember()`, etc.

---

## Code Changes Required

### Service Files to Update:
- ✅ `lib/appwrite/services/launches.ts` - Fix schema inconsistency
- ✅ `lib/appwrite/services/campaigns.ts` - Add entity scoping
- ✅ `lib/appwrite/services/submissions.ts` - Add entity scoping
- ✅ `lib/appwrite/services/activities.ts` - Add entity scoping
- ✅ `lib/appwrite/services/payouts.ts` - Add entity scoping
- 🆕 `lib/appwrite/services/project-members.ts` - Create new service

### Collection IDs to Add:
```typescript
// lib/appwrite/client.ts
export const COLLECTIONS = {
  // ... existing ...
  PROJECT_MEMBERS: 'project_members',
} as const
```

---

## Testing Checklist

- [ ] User creates a project → becomes owner in project_members
- [ ] User creates campaign in User mode → ownerType: 'user'
- [ ] User switches to Project mode, creates campaign → ownerType: 'project'
- [ ] Dashboard in User mode shows only user campaigns
- [ ] Dashboard in Project mode shows only project campaigns
- [ ] Project members can view project dashboard
- [ ] Non-members cannot access project data
