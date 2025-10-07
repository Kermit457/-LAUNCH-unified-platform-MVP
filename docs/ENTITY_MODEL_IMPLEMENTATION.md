# Entity Model Implementation - Complete Guide

## ✅ What's Been Implemented

### 1. Service Layer Updates

**Created new service:**
- ✅ [`lib/appwrite/services/project-members.ts`](../lib/appwrite/services/project-members.ts) - Complete project membership management

**Updated existing services with entity scoping:**
- ✅ [`lib/appwrite/services/campaigns.ts`](../lib/appwrite/services/campaigns.ts) - Added `ownerType` + `ownerId` fields
- ✅ [`lib/appwrite/services/submissions.ts`](../lib/appwrite/services/submissions.ts) - Added `ownerType` + `ownerId` fields
- ✅ [`lib/appwrite/services/activities.ts`](../lib/appwrite/services/activities.ts) - Added `contextType` + `contextId` fields
- ✅ [`lib/appwrite/services/payouts.ts`](../lib/appwrite/services/payouts.ts) - Added `ownerType` + `ownerId` fields
- ✅ [`lib/appwrite/services/launches.ts`](../lib/appwrite/services/launches.ts) - Fixed schema inconsistencies

### 2. TypeScript Interfaces

All interfaces now include entity scoping fields:

```typescript
// Campaign, Submission, Payout
{
  ownerType: 'user' | 'project'
  ownerId: string
}

// Activity
{
  contextType: 'user' | 'project'
  contextId: string
}

// ProjectMember (new)
{
  projectId: string
  userId: string
  role: 'owner' | 'member'
}
```

### 3. Dashboard Implementation

**Updated [`app/dashboard/page.tsx`](../app/dashboard/page.tsx):**
- ✅ Entity-scoped data queries based on current mode
- ✅ Switches between user and project data automatically
- ✅ Proper dependency tracking (`[userId, mode, selectedProject]`)
- ✅ Console logging for debugging

**Query behavior:**
```typescript
// User mode:
getCampaigns({ ownerType: 'user', ownerId: userId })

// Project mode:
getCampaigns({ ownerType: 'project', ownerId: projectId })
```

### 4. UI Components

**Updated [`components/dashboard/OverviewHeader.tsx`](../components/dashboard/OverviewHeader.tsx):**
- ✅ Profile preview card with main avatar
- ✅ Quick switcher bubbles for other entities
- ✅ Fixed field mapping (`title || tokenName`, `logoUrl || tokenImage`)
- ✅ Properly filters out current project from bubbles

### 5. Configuration

**Updated [`lib/appwrite/client.ts`](../lib/appwrite/client.ts):**
- ✅ Added `PROJECT_MEMBERS` collection constant

---

## 📋 Next Steps - Appwrite Console Setup

### Required: Database Schema Changes

Follow the instructions in [`APPWRITE_SETUP_STEPS.md`](./APPWRITE_SETUP_STEPS.md):

1. **Create `project_members` collection**
2. **Add entity scoping fields to existing collections:**
   - campaigns: `ownerType`, `ownerId`
   - submissions: `ownerType`, `ownerId`
   - activities: `contextType`, `contextId`
   - payouts: `ownerType`, `ownerId`

### Optional: Data Migration

If you have existing data, run migration scripts to populate:
- `project_members` entries for existing projects
- Default `ownerType='user'` and `ownerId=creatorId` for existing campaigns/submissions

---

## 🔄 How It Works Now

### User Mode
1. User logs in
2. Dashboard queries: `ownerType='user'`, `ownerId=userId`
3. Shows personal campaigns, earnings, submissions
4. Avatar bubbles show linked projects

### Project Mode
1. User clicks project bubble or dropdown
2. Dashboard queries: `ownerType='project'`, `ownerId=projectId`
3. Shows project-specific campaigns, earnings, submissions
4. Avatar bubble shows user account (for quick switch back)

### Data Separation
- **Before:** All queries filtered by `createdBy: userId` → same data in both modes
- **After:** Queries filtered by `ownerType + ownerId` → different data per entity

---

## 🧪 Testing Guide

### Test Scenario 1: User Mode
1. Navigate to `/dashboard?mode=user`
2. Create a campaign
3. Check Appwrite: campaign should have `ownerType='user'`, `ownerId={your userId}`
4. Dashboard should show this campaign

### Test Scenario 2: Project Mode
1. Create a project in `/discover`
2. Click project bubble in dashboard header
3. Create a campaign in project mode
4. Check Appwrite: campaign should have `ownerType='project'`, `ownerId={projectId}`
5. Switch back to user mode → campaign should NOT appear
6. Switch to project mode → campaign SHOULD appear

### Test Scenario 3: Quick Switching
1. In user mode, click a project bubble → should instantly switch
2. In project mode, click user bubble → should switch back
3. Avatar should update to show current entity
4. KPI data should update to match current entity

---

## 📊 Console Debugging

The dashboard logs useful information:

```
📊 Fetching dashboard data for user: {userId}
📊 Found: 5 campaigns, 10 submissions, 3 payouts

📊 Fetching dashboard data for project: {projectId}
📊 Found: 2 campaigns, 1 submissions, 0 payouts
```

---

## ⚠️ Important Notes

### Backward Compatibility
- Legacy `createdBy` field still supported in getCampaigns()
- Old schema fields (`tokenName`, `tokenImage`) still work
- Gradual migration possible

### New Campaign Creation
When creating campaigns, YOU MUST SET:
```typescript
{
  ownerType: mode === 'project' ? 'project' : 'user',
  ownerId: mode === 'project' ? selectedProject.id : userId,
  // ... other fields
}
```

### Project Membership
When a user creates a project, MUST create project_member entry:
```typescript
await addProjectMember({
  projectId: newProject.$id,
  userId: userId,
  role: 'owner'
})
```

---

## 🚀 Features Now Possible

1. ✅ **Project Dashboards** - Each project has its own analytics
2. ✅ **Team Collaboration** - Multiple users can manage a project
3. ✅ **Role-Based Access** - Owners vs Members (infrastructure ready)
4. ✅ **Separate Economics** - Project earnings ≠ User earnings
5. ✅ **Entity Switching** - Quick toggle between user/project contexts

---

## 📁 Files Modified

### Core Services
- `lib/appwrite/client.ts`
- `lib/appwrite/services/project-members.ts` (new)
- `lib/appwrite/services/launches.ts`
- `lib/appwrite/services/campaigns.ts`
- `lib/appwrite/services/submissions.ts`
- `lib/appwrite/services/activities.ts`
- `lib/appwrite/services/payouts.ts`

### UI Components
- `app/dashboard/page.tsx`
- `components/dashboard/OverviewHeader.tsx`

### Documentation
- `docs/SCHEMA_MIGRATION_PLAN.md`
- `docs/APPWRITE_SETUP_STEPS.md`
- `docs/ENTITY_MODEL_IMPLEMENTATION.md` (this file)

---

## 💡 Key Concepts

**Entity** = User OR Project (both are first-class citizens)

**Owner** = Entity that owns the data (campaigns, submissions, etc.)

**Context** = Entity in which an activity/action happens

**Scope** = Filter used to query data for a specific entity

---

## ❓ FAQ

**Q: Do I need to migrate existing data?**
A: Not immediately. The system works with empty scoping fields (queries won't filter). But for proper separation, yes, migrate data.

**Q: Can a campaign belong to both a user and a project?**
A: No. Each campaign has ONE owner (`ownerType` + `ownerId`). This ensures clean data separation.

**Q: How do I add members to a project?**
A: Use `addProjectMember(projectId, userId, 'member')`. This creates an entry in `project_members` collection.

**Q: Will old code break?**
A: No. Services still accept legacy parameters like `createdBy`. But they won't provide entity separation without `ownerType`/`ownerId`.

---

## 🎯 Next Development Tasks

1. Update campaign creation modals to set `ownerType`/`ownerId`
2. Update submission creation to inherit owner from campaign
3. Create project member management UI
4. Implement role-based permissions checks
5. Add "Managed by" display in project mode header
6. Create project settings page
7. Add project invitation flow

---

## 📞 Need Help?

Check the detailed migration plan: [`SCHEMA_MIGRATION_PLAN.md`](./SCHEMA_MIGRATION_PLAN.md)

Setup instructions: [`APPWRITE_SETUP_STEPS.md`](./APPWRITE_SETUP_STEPS.md)