# Appwrite Schema Setup Steps

## Collections to Create/Update in Appwrite Console

### 1. Create `project_members` Collection

**Collection ID:** `project_members`

**Attributes:**
- `projectId` - String, size: 255, required
- `userId` - String, size: 255, required
- `role` - String, size: 50, required
- `userName` - String, size: 255, optional
- `userAvatar` - String, size: 500, optional
- `joinedAt` - String, size: 100, required

**Indexes:**
- `projectId_idx` - key: projectId, type: fulltext
- `userId_idx` - key: userId, type: fulltext

**Permissions:**
- Read: Any
- Create/Update/Delete: Users (role: users)

---

### 2. Update `campaigns` Collection

**Add these attributes:**
- `ownerType` - String, size: 20, required, default: "user"
- `ownerId` - String, size: 255, required

**Index to add:**
- `ownerId_idx` - key: ownerId, type: fulltext

---

### 3. Update `submissions` Collection

**Add these attributes:**
- `ownerType` - String, size: 20, optional
- `ownerId` - String, size: 255, optional

**Index to add:**
- `ownerId_idx` - key: ownerId, type: fulltext

---

### 4. Update `activities` Collection

**Add these attributes:**
- `contextType` - String, size: 20, optional
- `contextId` - String, size: 255, optional

**Index to add:**
- `contextId_idx` - key: contextId, type: fulltext

---

### 5. Update `payouts` Collection

**Add these attributes:**
- `ownerType` - String, size: 20, optional
- `ownerId` - String, size: 255, optional

**Index to add:**
- `ownerId_idx` - key: ownerId, type: fulltext

---

### 6. Update `launches` Collection (if needed)

**Verify these fields exist:**
- `launchId` - String, required
- `scope` - String, required (ICM or CCM)
- `title` - String, required
- `subtitle` - String, optional
- `logoUrl` - String, optional
- `createdBy` - String, required

**If you have old schema with `tokenName`, `tokenSymbol`, `tokenImage`:**
- Keep them as optional for backward compatibility
- OR migrate data to new schema

---

## Migration Steps

### Step 1: Create project_members entries for existing projects

Run this after creating the `project_members` collection:

```javascript
// For each existing launch/project
// Auto-create a project_member entry with role: 'owner'

const launches = await databases.listDocuments(DB_ID, 'launches');

for (const launch of launches.documents) {
  await databases.createDocument(
    DB_ID,
    'project_members',
    'unique()',
    {
      projectId: launch.$id,
      userId: launch.createdBy,
      role: 'owner',
      joinedAt: launch.$createdAt
    }
  );
}
```

### Step 2: Populate entity scoping fields for existing data

```javascript
// Update existing campaigns
const campaigns = await databases.listDocuments(DB_ID, 'campaigns');

for (const campaign of campaigns.documents) {
  await databases.updateDocument(
    DB_ID,
    'campaigns',
    campaign.$id,
    {
      ownerType: 'user',
      ownerId: campaign.creatorId
    }
  );
}

// Repeat for submissions, activities, payouts
```

---

## Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_APPWRITE_PROJECT_MEMBERS_COLLECTION_ID=project_members
```

---

## Testing Checklist

After setup:

- [ ] Create a new project → verify project_member entry is created automatically
- [ ] Create campaign in User mode → ownerType='user', ownerId=userId
- [ ] Switch to Project mode → create campaign → ownerType='project', ownerId=projectId
- [ ] Dashboard in User mode shows only user data
- [ ] Dashboard in Project mode shows only project data
- [ ] Verify quick switcher bubbles work correctly