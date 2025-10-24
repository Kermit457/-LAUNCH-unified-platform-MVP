# Unified Clip Submission System - Technical Design

**Date:** 2025-10-24
**Status:** Design Phase
**Priority:** High

---

## 🎯 Overview

Create a unified clip submission system where:
- All "clip" buttons across the platform use the same modal
- Context-aware project tagging (auto-populate when clicked from project)
- Automatic contributor linking
- Notification system for project owners
- Review interface in user profile
- Metrics aggregation for projects

---

## 📋 Current State Analysis

### ✅ Already Implemented

1. **SubmitClipModal** ([components/modals/SubmitClipModal.tsx](components/modals/SubmitClipModal.tsx)):
   - ✅ Project search & selection dropdown
   - ✅ Campaign linking support
   - ✅ Pre-selection support (`preSelectedCampaignId`)
   - ✅ Returns `projectId`, `projectName`, `projectLogo` on submit

2. **Clips Service** ([lib/appwrite/services/clips.ts](lib/appwrite/services/clips.ts)):
   - ✅ `ownerType` and `ownerId` fields
   - ✅ `projectId` field
   - ✅ `approved` boolean
   - ✅ `status`: 'active' | 'pending' | 'rejected' | 'removed'
   - ✅ `approveClip()` function with authorization check

3. **Project Members** ([lib/appwrite/services/project-members.ts](lib/appwrite/services/project-members.ts)):
   - ✅ `addProjectMember()` function
   - ✅ `isProjectMember()` check
   - ✅ `getProjectOwners()` function

4. **Notification System**:
   - ✅ NotificationContext with `addNotification()`
   - ✅ `submission_new` notification type exists
   - ✅ Metadata support for userId, username, avatar, etc.

### 🔴 Needs Implementation

1. **Modal Context Passing**: Need to add `preSelectedProjectId` prop to modal
2. **Contributor Linking**: Auto-add submitter to PROJECT_MEMBERS when tagging project
3. **Notification Trigger**: Call `addNotification()` when clip submitted to project
4. **Review Interface**: Build pending clips review in user profile/dashboard
5. **Metrics Aggregation**: Sum clip views for project cards
6. **Button Unification**: Audit and replace all clip submission entry points

---

## 🏗️ Architecture Design

### 1. Enhanced Modal Props

```typescript
// components/modals/SubmitClipModal.tsx
interface SubmitClipModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ClipSubmissionData) => void

  // Existing
  preSelectedCampaignId?: string
  preSelectedCampaignTitle?: string

  // NEW
  preSelectedProjectId?: string
  preSelectedProjectTitle?: string
  autoTag?: boolean // Auto-select project (no removal allowed)
}
```

### 2. Clip Submission Flow

```
User clicks "Submit Clip" on Project Card
  ↓
Open SubmitClipModal with preSelectedProjectId
  ↓
Modal auto-populates project field
  ↓
User enters video URL & title
  ↓
Submit → submitClip()
  ↓
┌─────────────────────────────────────────┐
│ 1. Create clip document (status: pending) │
│ 2. Add user to PROJECT_MEMBERS (if new)  │
│ 3. Trigger notification to project owner │
│ 4. Close modal & show success toast      │
└─────────────────────────────────────────┘
```

### 3. Database Schema Changes

**No schema changes needed!** All required fields exist:

**Clips Collection:**
```typescript
{
  clipId: string
  submittedBy: string        // User who submitted
  projectId?: string         // Tagged project
  projectName?: string
  projectLogo?: string
  status: 'pending' | 'active' | 'rejected'
  approved: boolean
  ownerType?: 'user' | 'project'
  ownerId?: string
  views, likes, comments, shares, engagement
}
```

**PROJECT_MEMBERS Collection:**
```typescript
{
  projectId: string
  userId: string
  role: 'owner' | 'member'
  joinedAt: string
  userName?: string
  userAvatar?: string
}
```

**NEW: Contributor Role**
We should add a `'contributor'` role option:
```typescript
role: 'owner' | 'member' | 'contributor'
```

### 4. Service Functions

#### A. Enhanced Clip Submission

```typescript
// lib/appwrite/services/clips.ts
export async function submitClipToProject(data: {
  embedUrl: string
  submittedBy: string
  submitterName: string
  submitterAvatar?: string
  projectId: string
  projectName: string
  projectLogo?: string
  title?: string
}): Promise<{ clip: Clip, isNewContributor: boolean }> {
  // 1. Create clip (status: pending for project clips)
  const clip = await submitClip({
    ...data,
    status: 'pending'  // Requires approval
  })

  // 2. Check if already a project member
  const isMember = await isProjectMember(data.projectId, data.submittedBy)

  // 3. Add as contributor if new
  if (!isMember) {
    await addProjectMember({
      projectId: data.projectId,
      userId: data.submittedBy,
      role: 'contributor',
      userName: data.submitterName,
      userAvatar: data.submitterAvatar
    })
  }

  // 4. Get project owners for notification
  const owners = await getProjectOwners(data.projectId)

  // 5. Return clip and contributor status
  return {
    clip,
    isNewContributor: !isMember
  }
}
```

#### B. Notification Trigger

```typescript
// In app/clip/page.tsx or wherever handleSubmit lives
const handleClipSubmit = async (data: ClipSubmissionData) => {
  if (data.projectId) {
    // Submit to project with notifications
    const { clip, isNewContributor } = await submitClipToProject(data)

    // Trigger notification via context
    addNotification(
      'submission_new',
      'New Clip Submitted',
      `${currentUser.name} submitted a clip to ${data.projectName}`,
      {
        userId: currentUser.id,
        username: currentUser.name,
        avatar: currentUser.avatar,
        projectId: data.projectId,
        projectName: data.projectName,
        clipId: clip.clipId,
        actionUrl: `/profile?tab=pending-clips`
      }
    )

    if (isNewContributor) {
      addNotification(
        'achievement_unlocked',
        'New Contributor!',
        `You're now a contributor to ${data.projectName}`,
        {
          projectId: data.projectId,
          projectName: data.projectName
        }
      )
    }

    success('Clip submitted!', 'Awaiting project owner approval')
  } else {
    // Regular clip submission (no project)
    await submitClip(data)
    success('Clip published!')
  }
}
```

### 5. Review Interface

**Location:** User Profile (or Project Dashboard)

```typescript
// app/profile/page.tsx or components/profile/PendingClipsSection.tsx

export function PendingClipsSection({ userId }: { userId: string }) {
  const [pendingClips, setPendingClips] = useState<Clip[]>([])

  // Get projects user owns
  const { data: ownedProjects } = useUserProjects(userId)

  // Get pending clips for those projects
  useEffect(() => {
    const fetchPendingClips = async () => {
      const projectIds = ownedProjects?.map(p => p.launchId) || []
      const clips = await Promise.all(
        projectIds.map(id => getClips({
          status: 'pending',
          projectId: id  // Need to add this filter option!
        }))
      )
      setPendingClips(clips.flat())
    }
    fetchPendingClips()
  }, [ownedProjects])

  const handleApprove = async (clipId: string) => {
    await approveClip(clipId, true, userId)
    setPendingClips(prev => prev.filter(c => c.clipId !== clipId))
    success('Clip approved!')
  }

  const handleReject = async (clipId: string) => {
    await approveClip(clipId, false, userId)
    setPendingClips(prev => prev.filter(c => c.clipId !== clipId))
    success('Clip rejected')
  }

  return (
    <div className="space-y-4">
      <h2>Pending Clip Reviews ({pendingClips.length})</h2>
      {pendingClips.map(clip => (
        <ClipReviewCard
          key={clip.$id}
          clip={clip}
          onApprove={() => handleApprove(clip.$id)}
          onReject={() => handleReject(clip.$id)}
        />
      ))}
    </div>
  )
}
```

### 6. Metrics Aggregation

```typescript
// lib/appwrite/services/launches.ts

/**
 * Get total views across all approved clips for a project
 */
export async function getProjectClipMetrics(projectId: string): Promise<{
  totalViews: number
  totalLikes: number
  totalEngagement: number
  clipCount: number
}> {
  const clips = await getClips({
    projectId,
    status: 'active',
    approved: true
  })

  return {
    totalViews: clips.reduce((sum, c) => sum + c.views, 0),
    totalLikes: clips.reduce((sum, c) => sum + c.likes, 0),
    totalEngagement: clips.reduce((sum, c) => sum + c.engagement, 0) / Math.max(1, clips.length),
    clipCount: clips.length
  }
}
```

```typescript
// components/ProjectCard.tsx

export function ProjectCard({ project }: { project: Launch }) {
  const { data: clipMetrics } = useQuery({
    queryKey: ['project-clip-metrics', project.launchId],
    queryFn: () => getProjectClipMetrics(project.launchId),
    staleTime: 60000 // 1 minute cache
  })

  return (
    <div>
      {/* ... project card content ... */}

      {clipMetrics && clipMetrics.clipCount > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Video className="w-4 h-4" />
          <span>{clipMetrics.clipCount} clips</span>
          <Eye className="w-4 h-4 ml-2" />
          <span>{clipMetrics.totalViews.toLocaleString()} views</span>
        </div>
      )}

      <button
        onClick={() => openSubmitClipModal(project.launchId, project.title)}
        className="btn-secondary"
      >
        Submit Clip
      </button>
    </div>
  )
}
```

---

## 📝 Implementation Tasks

### Phase 1: Modal Enhancement (2-3 hours)

- [x] Add `preSelectedProjectId` and `preSelectedProjectTitle` props to SubmitClipModal
- [x] Auto-populate project field when pre-selected
- [x] Add `autoTag` mode to lock project selection
- [x] Update modal documentation

### Phase 2: Submission Flow (3-4 hours)

- [ ] Create `submitClipToProject()` function in clips service
- [ ] Add `'contributor'` role to PROJECT_MEMBERS type
- [ ] Implement contributor auto-linking
- [ ] Add notification triggers
- [ ] Update clip submission handlers across app

### Phase 3: Review Interface (4-5 hours)

- [ ] Create `PendingClipsSection` component
- [ ] Add to user profile page
- [ ] Create `ClipReviewCard` component with approve/reject buttons
- [ ] Add filtering: projectId filter to `getClips()`
- [ ] Wire up approve/reject actions

### Phase 4: Metrics Aggregation (2-3 hours)

- [ ] Create `getProjectClipMetrics()` function
- [ ] Create `useProjectClipMetrics()` React hook
- [ ] Add clip metrics to ProjectCard
- [ ] Add clip metrics to project detail pages
- [ ] Implement caching strategy

### Phase 5: Button Unification (3-4 hours)

- [ ] Audit all clip button entry points
- [ ] Create centralized `useSubmitClipModal()` hook
- [ ] Replace all instances with unified modal
- [ ] Add analytics tracking
- [ ] Test all entry points

---

## 🔒 Authorization & Security

### Clip Submission
- ✅ Anyone can submit clips
- ✅ Auto-set to `pending` if tagged to project
- ✅ Contributor added automatically

### Clip Approval
- ✅ Only project owners can approve/reject
- ✅ Authorization check in `approveClip()` function (already exists!)
- ✅ Error thrown if unauthorized

### Metrics Access
- ✅ Public (anyone can view project metrics)
- ✅ No sensitive data exposed

---

## 🎨 UI/UX Flow

### User Submitting Clip to Project

1. **Entry Point:** User clicks "Submit Clip" on ProjectCard
2. **Modal Opens:** Project pre-selected, locked (cannot remove)
3. **Fill Form:** Enter video URL, optional title
4. **Submit:** Click "Submit Clip"
5. **Feedback:**
   - Toast: "Clip submitted! Awaiting approval from [Project Name]"
   - If new contributor: Second toast "You're now a contributor to [Project Name]!"
6. **Notification:** Project owner receives notification

### Project Owner Reviewing Clips

1. **Entry Point:** Notification bell → "New clip submitted to [Project]"
2. **Click Action:** Navigate to Profile → Pending Clips tab
3. **Review Interface:**
   - List of pending clips with video preview
   - Submitter info (name, avatar)
   - Approve / Reject buttons
4. **Action:** Click Approve or Reject
5. **Feedback:**
   - Toast: "Clip approved!" or "Clip rejected"
   - Clip removed from pending list
   - Notification sent to submitter

---

## 📊 Metrics & Analytics

### Track:
- Clips submitted per project
- Approval rate (approved / total submitted)
- Average time to approval
- Top contributors per project
- Project engagement via clips (views, engagement)

### Dashboard KPIs:
- Total clips submitted
- Pending review count
- Approved clips count
- Total views from clips
- Top performing clips per project

---

## 🚀 Deployment Checklist

### Appwrite Changes
- [ ] Add `'contributor'` role to PROJECT_MEMBERS collection validation
- [ ] Verify permissions on CLIPS collection
- [ ] Verify permissions on PROJECT_MEMBERS collection
- [ ] Verify permissions on NOTIFICATIONS collection

### Code Changes
- [ ] Update SubmitClipModal props
- [ ] Create submitClipToProject function
- [ ] Build review interface components
- [ ] Create metrics functions
- [ ] Add notification triggers
- [ ] Update all clip button entry points

### Testing
- [ ] Test clip submission from project card
- [ ] Test clip submission from other entry points
- [ ] Test contributor auto-linking
- [ ] Test notification delivery
- [ ] Test approval workflow
- [ ] Test rejection workflow
- [ ] Test metrics aggregation
- [ ] Test authorization (non-owners cannot approve)

### Documentation
- [ ] Update user guide
- [ ] Update developer docs
- [ ] Create video walkthrough
- [ ] Update API documentation

---

## 🤝 Team Coordination

### Stakeholders

1. **Frontend Team**
   - Modal enhancement
   - Review interface UI
   - Metrics display
   - Button unification

2. **Backend Team**
   - Appwrite collection permissions
   - Contributor role validation
   - Notification infrastructure
   - Metrics queries optimization

3. **Product Team**
   - Review flow UX
   - Notification copy
   - Success/error messaging
   - User testing

4. **DevOps**
   - Appwrite deployment
   - Permission updates
   - Collection validation rules

### Open Questions

1. **Approval Timeout:** Should pending clips auto-expire after X days?
2. **Multiple Owners:** What if project has multiple owners? Notify all or just one?
3. **Contributor Permissions:** Should contributors see pending clips? Edit project?
4. **Rejection Reason:** Should owners provide a reason when rejecting?
5. **Re-submission:** Can users re-submit a rejected clip?
6. **Metrics Cache:** How often should we refresh project clip metrics?

---

## 💡 Future Enhancements (Post-MVP)

1. **Bulk Actions:** Approve/reject multiple clips at once
2. **Clip Editing:** Allow submitters to edit pending clips
3. **Comment on Review:** Owners leave feedback on clips
4. **Clip Leaderboard:** Show top clips per project
5. **Automated Approval:** Auto-approve clips from trusted contributors
6. **Clip Analytics:** Detailed analytics per clip (click-through, engagement over time)
7. **Clip Rewards:** Reward contributors based on clip performance
8. **Integration:** Auto-post approved clips to project social media

---

## 📖 Related Documentation

- [BACKLOG_ENHANCEMENTS_COMPLETE.md](BACKLOG_ENHANCEMENTS_COMPLETE.md) - Recent backlog work
- [CLIPS_PAGE_BACKLOG.md](CLIPS_PAGE_BACKLOG.md) - Clips page future enhancements
- [components/modals/SubmitClipModal.tsx](components/modals/SubmitClipModal.tsx) - Current modal
- [lib/appwrite/services/clips.ts](lib/appwrite/services/clips.ts) - Clips service
- [lib/appwrite/services/project-members.ts](lib/appwrite/services/project-members.ts) - Members service
- [types/notification.ts](types/notification.ts) - Notification types

---

**Next Steps:**
1. Review this design with team
2. Answer open questions
3. Get approval from stakeholders
4. Begin Phase 1 implementation
