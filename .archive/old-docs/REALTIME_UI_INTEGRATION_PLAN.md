# Real-time UI Integration - Detailed TODO Plan

## 🎯 Goal
Integrate the 3 new real-time hooks into the UI:
1. **Activities Feed** → Dashboard page
2. **Network Invite Badge** → Navbar
3. **Boost Count** → Launch cards (explore page)

---

## 📋 Task Breakdown

### **Task 1: Add Network Invite Badge to Navbar** ⭐ (Start Here - Quick Win!)
**Estimated Time**: 15-20 minutes
**Impact**: High (users see instant notifications)

#### **Step 1.1: Check Current Navbar Structure**
- [ ] Read `components/NavBar.tsx` to see current layout
- [ ] Identify where to add the invite badge (probably near profile/notifications)
- [ ] Check if there's already a notifications area

#### **Step 1.2: Create InviteBadge Component**
File: `components/InviteBadge.tsx`
```tsx
"use client"

import { Bell } from 'lucide-react'
import { useRealtimeNetworkInvites } from '@/hooks/useRealtimeNetworkInvites'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'

export function InviteBadge() {
  const { userId } = useUser()
  const { pendingCount } = useRealtimeNetworkInvites(
    userId || '',
    'received',
    'pending'
  )

  if (!userId || pendingCount === 0) return null

  return (
    <Link href="/network" className="relative">
      <Bell className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
      {/* Badge */}
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-fuchsia-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
        {pendingCount}
      </span>
    </Link>
  )
}
```

#### **Step 1.3: Add to Navbar**
In `components/NavBar.tsx`:
```tsx
import { InviteBadge } from './InviteBadge'

// Inside navbar, near profile section:
<div className="flex items-center gap-4">
  <InviteBadge />
  {/* ...existing profile/auth buttons */}
</div>
```

#### **Acceptance Criteria**:
- [ ] Bell icon shows in navbar when logged in
- [ ] Badge appears when there are pending invites
- [ ] Badge shows correct count (1, 2, 3, etc.)
- [ ] Badge pulses (animate-pulse class)
- [ ] Clicking goes to `/network` page
- [ ] Badge disappears when count is 0

---

### **Task 2: Add Activities Feed to Dashboard** ⭐⭐
**Estimated Time**: 30-40 minutes
**Impact**: High (shows user what's happening)

#### **Step 2.1: Check Dashboard Structure**
- [ ] Navigate to `app/dashboard/page.tsx` (or find dashboard file)
- [ ] Identify where activities feed should go (sidebar? main content? tab?)
- [ ] Check existing layout components

#### **Step 2.2: Create ActivityCard Component**
File: `components/ActivityCard.tsx`
```tsx
"use client"

import { Activity } from '@/lib/appwrite/services/activities'
import {
  MessageSquare,
  Rocket,
  DollarSign,
  CheckCircle,
  Users,
  TrendingUp
} from 'lucide-react'

const activityIcons = {
  submission: MessageSquare,
  campaign_live: Rocket,
  payout: DollarSign,
  approval: CheckCircle,
  network: Users,
  launch: TrendingUp,
}

const activityColors = {
  submission: 'text-cyan-400',
  campaign_live: 'text-fuchsia-400',
  payout: 'text-green-400',
  approval: 'text-emerald-400',
  network: 'text-purple-400',
  launch: 'text-orange-400',
}

interface ActivityCardProps {
  activity: Activity
  onMarkAsRead?: (id: string) => void
}

export function ActivityCard({ activity, onMarkAsRead }: ActivityCardProps) {
  const Icon = activityIcons[activity.type] || MessageSquare
  const iconColor = activityColors[activity.type] || 'text-white'

  const timeAgo = getTimeAgo(new Date(activity.$createdAt))

  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg border transition-all
        ${activity.read
          ? 'bg-white/[0.02] border-white/5'
          : 'bg-fuchsia-500/5 border-fuchsia-500/20 hover:bg-fuchsia-500/10'
        }
      `}
      onClick={() => !activity.read && onMarkAsRead?.(activity.$id)}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{activity.title}</p>
        {activity.message && (
          <p className="text-xs text-white/60 mt-0.5">{activity.message}</p>
        )}
        <p className="text-xs text-white/40 mt-1">{timeAgo}</p>
      </div>

      {/* Unread indicator */}
      {!activity.read && (
        <div className="w-2 h-2 bg-fuchsia-500 rounded-full flex-shrink-0 animate-pulse"></div>
      )}
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
```

#### **Step 2.3: Create ActivitiesFeed Component**
File: `components/ActivitiesFeed.tsx`
```tsx
"use client"

import { useRealtimeActivities } from '@/hooks/useRealtimeActivities'
import { useUser } from '@/hooks/useUser'
import { ActivityCard } from './ActivityCard'
import { markActivityAsRead } from '@/lib/appwrite/services/activities'
import { useState } from 'react'

export function ActivitiesFeed() {
  const { userId } = useUser()
  const { activities, loading, error, unreadCount } = useRealtimeActivities(
    userId || '',
    20  // Show last 20 activities
  )
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const handleMarkAsRead = async (activityId: string) => {
    try {
      await markActivityAsRead(activityId)
      // Real-time subscription will update the UI
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const filteredActivities = filter === 'unread'
    ? activities.filter(a => !a.read)
    : activities

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white">Activity</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-fuchsia-500 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-green-400 ml-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-fuchsia-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'unread'
                ? 'bg-fuchsia-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/40">
            {filter === 'unread' ? 'No unread activities' : 'No activities yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredActivities.map(activity => (
            <ActivityCard
              key={activity.$id}
              activity={activity}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

#### **Step 2.4: Add to Dashboard Page**
In `app/dashboard/page.tsx` (or wherever dashboard is):
```tsx
import { ActivitiesFeed } from '@/components/ActivitiesFeed'

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - User stats, etc */}
      <div className="lg:col-span-2">
        {/* ...existing dashboard content */}
      </div>

      {/* Right column - Activities Feed */}
      <div className="lg:col-span-1">
        <div className="glass-card p-6">
          <ActivitiesFeed />
        </div>
      </div>
    </div>
  )
}
```

#### **Step 2.5: Add markActivityAsRead to Service** (if missing)
In `lib/appwrite/services/activities.ts`:
```typescript
export async function markActivityAsRead(activityId: string) {
  try {
    await databases.updateDocument(
      DB_ID,
      COLLECTIONS.ACTIVITIES,
      activityId,
      { read: true }
    )
  } catch (error) {
    console.error('Failed to mark activity as read:', error)
    throw error
  }
}
```

#### **Acceptance Criteria**:
- [ ] Activities feed shows in dashboard sidebar/column
- [ ] Shows recent 20 activities
- [ ] "All" and "Unread" filter tabs work
- [ ] Unread count badge displays correctly
- [ ] LIVE indicator shows
- [ ] Clicking unread activity marks it as read
- [ ] Real-time updates when new activity arrives
- [ ] Different icons for each activity type
- [ ] Time ago display (5m ago, 2h ago, 1d ago)
- [ ] Loading skeleton shows while loading
- [ ] Error state shows if fetch fails

---

### **Task 3: Add Boost Count to Launch Cards** ⭐
**Estimated Time**: 20-25 minutes
**Impact**: Medium (social proof on cards)

#### **Step 3.1: Update ProjectCard Component**
File: `components/ProjectCard.tsx`

Find the stats badges section (around line 160):
```tsx
{/* Stats badges */}
<div className="flex items-center gap-1">
  <div className={cn(
    "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px]",
    project.type === 'launch' && hasVoted
      ? "bg-fuchsia-500/20 text-fuchsia-400"
      : "bg-neutral-900 text-fuchsia-400"
  )}>
    <TrendingUp className="w-3 h-3" />
    {project.type === 'launch' ? voteCount : localUpvotes}
  </div>

  {/* ADD THIS: Boost count badge */}
  {project.type === 'launch' && project.boostCount && project.boostCount > 0 && (
    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px]">
      <Zap className="w-3 h-3" />
      {project.boostCount}
    </div>
  )}

  {/* ADD THIS: View count badge */}
  {project.type === 'launch' && project.viewCount && project.viewCount > 0 && (
    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px]">
      <Eye className="w-3 h-3" />
      {project.viewCount}
    </div>
  )}
</div>
```

#### **Step 3.2: Update Project Type**
In `types/index.ts`:
```typescript
export interface Project {
  // ...existing fields
  boostCount?: number
  viewCount?: number
}
```

#### **Step 3.3: Ensure Launch Cards Get Boost/View Data**
In `app/explore/page.tsx`, the `useLiveLaunches` hook should already return launches with boostCount/viewCount since we added them to the Launch interface.

Just verify the mapping:
```typescript
const projects = launches.map(launch => ({
  ...launch,
  id: launch.$id || launch.launchId,
  boostCount: launch.boostCount,
  viewCount: launch.viewCount,
}))
```

#### **Acceptance Criteria**:
- [ ] Boost count badge shows on launch cards (amber/yellow)
- [ ] View count badge shows on launch cards (green)
- [ ] Badges only show if count > 0
- [ ] Icons: Zap for boost, Eye for views
- [ ] Badges are small (text-[10px])
- [ ] Updates in real-time when someone boosts/views

---

## 📊 Summary Checklist

### **Quick Wins** (Do First):
- [ ] **Task 1**: Network invite badge in navbar (15 min)
- [ ] **Task 3**: Boost/view counts on cards (20 min)

### **Bigger Feature**:
- [ ] **Task 2**: Activities feed in dashboard (40 min)

### **Total Estimated Time**: 1.5 - 2 hours

---

## 🎯 Priority Order

### **Phase 1: Notifications** (Most Visible)
1. ✅ Add invite badge to navbar
   - User sees: "You have 3 new invites!"
   - Impact: Immediate engagement

### **Phase 2: Social Proof** (Conversion)
2. ✅ Add boost/view counts to cards
   - User sees: "This launch has 45 boosts, 234 views"
   - Impact: Trust signals, FOMO

### **Phase 3: Engagement** (Retention)
3. ✅ Add activities feed to dashboard
   - User sees: "Your submission was approved!"
   - Impact: Keep users coming back

---

## 🧪 Testing Checklist

### **Invite Badge**:
- [ ] Create network invite in Appwrite → badge appears
- [ ] Badge shows correct count (1, 2, 3...)
- [ ] Accept invite → badge count decreases
- [ ] Open in 2 tabs → both update in real-time
- [ ] Badge hidden when count is 0

### **Activities Feed**:
- [ ] Create activity in Appwrite → appears in feed
- [ ] Unread count badge shows correctly
- [ ] Click unread activity → mark as read
- [ ] Filter "Unread" → only shows unread
- [ ] Filter "All" → shows everything
- [ ] LIVE badge visible
- [ ] Icons match activity types
- [ ] Open in 2 tabs → both update instantly

### **Boost/View Counts**:
- [ ] Launch with boostCount → badge shows
- [ ] Launch with viewCount → badge shows
- [ ] Launch with neither → no badges
- [ ] Boost from detail page → card updates
- [ ] View from detail page → card updates
- [ ] Real-time sync works across tabs

---

## 📁 Files to Create

### **New Components**:
1. `components/InviteBadge.tsx` (~30 lines)
2. `components/ActivityCard.tsx` (~80 lines)
3. `components/ActivitiesFeed.tsx` (~110 lines)

### **Files to Modify**:
1. `components/NavBar.tsx` (add InviteBadge)
2. `components/ProjectCard.tsx` (add boost/view badges)
3. `app/dashboard/page.tsx` (add ActivitiesFeed)
4. `types/index.ts` (add boostCount, viewCount to Project)
5. `lib/appwrite/services/activities.ts` (add markActivityAsRead if missing)

### **Total Files**: 3 new, 5 modified

---

## 🚀 Expected Results

### **After Task 1 (Navbar Badge)**:
```
Navbar:  [Logo]  [Explore]  [Engage]  [🔔3]  [Profile]
                                       ↑ new!
```

### **After Task 2 (Activities Feed)**:
```
Dashboard:
┌─────────────────┬─────────────────┐
│                 │  Activity (2)🟢 │
│  User Stats     │  ┌──────────┐   │
│  Launch Cards   │  │ 💰 Payout│   │
│                 │  │ ✅ Approved│  │
│                 │  └──────────┘   │
└─────────────────┴─────────────────┘
```

### **After Task 3 (Card Badges)**:
```
Launch Card:
┌──────────────────────┐
│  TokenName           │
│  Description         │
│  ━━━━━━━ 85%        │
│  ↑456  ⚡12  👁234  │ ← new badges!
└──────────────────────┘
```

---

## 💡 Pro Tips

### **For Navbar Badge**:
- Keep it minimal - just bell icon + count
- Use `animate-pulse` for attention
- Make sure it doesn't shift layout
- Test with large numbers (99+)

### **For Activities Feed**:
- Start simple - just list activities
- Add filters after basic version works
- Use skeleton loaders for smooth UX
- Test with 0 activities, 1 activity, 50 activities

### **For Card Badges**:
- Don't overcrowd the card
- Use consistent icon sizes
- Color code: fuchsia=votes, amber=boosts, green=views
- Hide if count is 0

---

## ✅ Definition of Done

**All Tasks Complete When**:
- [ ] User can see pending invite count in navbar
- [ ] Clicking invite badge goes to /network
- [ ] Activities feed shows in dashboard
- [ ] Activities filter by all/unread
- [ ] Unread activities can be marked as read
- [ ] Launch cards show boost and view counts
- [ ] All features update in real-time
- [ ] No console errors
- [ ] Works on mobile and desktop
- [ ] All TypeScript types correct

---

**Ready to start?** Begin with **Task 1 (Navbar Badge)** - it's the quickest win! 🚀
