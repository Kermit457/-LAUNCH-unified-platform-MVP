# Seed & Component Testing Plan

## Executive Summary

This document outlines:
1. **Enhanced Seed Strategy** - Adding realistic Twitter-authenticated user profiles via Privy
2. **All Components to Test** - Comprehensive inventory of UI components using avatars/profiles
3. **Testing Workflow** - Step-by-step plan to wire and test each component

---

## 1. Current State Analysis

### Database Schema (Appwrite)
Based on `scripts/seed-database.ts` and `lib/appwrite/services/users.ts`:

**Current User Fields:**
- `userId` - Unique user identifier
- `username` - Twitter handle (without @)
- `displayName` - Full display name
- `bio` - User bio/description
- `avatarUrl` - Profile picture URL
- `bannerUrl` - Banner image URL (optional)
- `verified` - Platform verification status
- `conviction` - User conviction score (0-100)
- `totalEarnings` - Earnings in USD
- `roles` - Array of role tags (Trader, Creator, etc.)
- `socialLinks` - Object with twitter, youtube, twitch, discord

**Collections Being Seeded:**
- ✅ Users (5 sample users)
- ✅ Launches (5 sample launches)
- ✅ Campaigns (5 sample campaigns)

### Missing for Privy Twitter Auth Integration
- Real Twitter profile images
- Twitter follower/following counts
- Twitter verification badge
- Twitter profile metadata
- Mutual connections data
- Network invites/connections

---

## 2. Enhanced Seed Data Strategy

### Phase 1: Enhance User Profiles
Add realistic Twitter-style data to seed:

```typescript
const enhancedUsers = [
  {
    // Existing fields
    userId: 'user_crypto_whale',
    username: 'crypto_whale',
    displayName: 'Crypto Whale 🐋',

    // New Twitter-style fields
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto_whale',
    bannerUrl: 'https://source.unsplash.com/random/1500x500?crypto,neon',
    verified: true, // Twitter verified
    bio: 'DeFi maximalist | Building the future of finance | #Web3',

    // Social metadata
    socialLinks: {
      twitter: 'https://twitter.com/crypto_whale',
      youtube: 'https://youtube.com/@cryptowhale',
    },

    // Platform stats
    conviction: 95,
    totalEarnings: 12500,
    roles: ['Trader', 'Investor', 'Alpha'],

    // Network metadata (for mutuals)
    followerCount: 12500,
    followingCount: 450,
  }
]
```

### Phase 2: Add Network/Connection Data
Create additional collections for:
- **Network Invites** - Pending connection requests
- **Network Connections** - Accepted connections
- **Mutual Connections** - Shared connections between users
- **Messages/Threads** - DM conversations

---

## 3. Components Requiring Avatar/Profile Data

### 🎯 Critical Components (High Priority)

#### A. Profile & Network Components
| Component | Location | What it displays | Data needed |
|-----------|----------|------------------|-------------|
| `ProfileCard` | `components/profile/ProfileCard.tsx` | Full user profile card | avatar, displayName, username, roles, bio, contributions, mutuals, socials |
| `NetworkCard` | `components/NetworkCard.tsx` | Network connection card | avatar, name, handle, roles, verified, mutuals, connection state |
| `MutualAvatars` | `components/profile/MutualAvatars.tsx` | Mutual connection bubbles | Array of user avatars & names |
| `AvatarGroup` | `components/ui/avatar-group.tsx` | Multiple avatar bubbles | Array of contributors with avatar & name |
| `AvatarUpload` | `components/upload/AvatarUpload.tsx` | Avatar upload widget | Current avatarUrl |

#### B. Dashboard Widgets
| Component | Location | What it displays | Data needed |
|-----------|----------|------------------|-------------|
| `ConnectedNetwork` | `components/dashboard/ConnectedNetwork.tsx` | Connected users list | avatar, name, handle, lastMessage, unreadCount, online status |
| `NetworkInvites` | `components/dashboard/NetworkInvites.tsx` | Pending invites | fromUser avatar, handle, mutuals, role, note |
| `NetworkActivityWidget` | `components/dashboard/NetworkActivityWidget.tsx` | Recent network activity | User avatars, actions, timestamps |
| `OverviewHeader` | `components/dashboard/OverviewHeader.tsx` | User stats header | Current user profile data |

#### C. Lists & Tables
| Component | Location | What it displays | Data needed |
|-----------|----------|------------------|-------------|
| `LeaderboardTable` | `components/LeaderboardTable.tsx` | Top users leaderboard | rank, avatar, name, handle, earnings, conviction |
| `HallOfFame` | `components/HallOfFame.tsx` | Top contributors | avatar, name, achievements |
| `ContributorRow` | `components/ContributorRow.tsx` | Project contributor | avatar, name, role, contribution |
| `ConnectionsPanel` | `components/network/ConnectionsPanel.tsx` | Network connections list | avatars, names, roles, lastActive |
| `InviteRow` | `components/network/InviteRow.tsx` | Single invite row | fromUser data, mutuals, note |

#### D. Chat/Messaging
| Component | Location | What it displays | Data needed |
|-----------|----------|------------------|-------------|
| `MessageList` | `components/chat/MessageList.tsx` | Chat messages | sender avatar, name, message, timestamp |

#### E. Other Components
| Component | Location | What it displays | Data needed |
|-----------|----------|------------------|-------------|
| `ActionCard` | `components/ActionCard.tsx` | Action item with user | User avatar & name |
| `EarnCard` | `components/EarnCard.tsx` | Earning opportunity | Creator avatar & name |
| `CommentItem` | `components/comments/CommentItem.tsx` | Comment with author | author avatar, name, handle |
| `PreviewCard` | `components/quests/PreviewCard.tsx` | Quest preview | Creator avatar & name |
| `Testimonials` | `components/landing/Testimonials.tsx` | User testimonials | avatar, name, role |

### 📄 Pages Using Profile/Network Components

#### Network & Profile Pages
- ✅ `/network` - Main network page with filters, invites, connections
- ✅ `/profile/[handle]` - Public user profile view
- ✅ `/profile` - Current user profile edit
- ✅ `/dashboard/network` - Dashboard network tab with chat
- ✅ `/dashboard` - Dashboard overview (shows connected network widget)
- ✅ `/dashboard/settings` - User settings with avatar upload

#### Discovery & Social Pages
- ✅ `/discover` - Discover launches (shows contributor avatars)
- ✅ `/earn` - Earn campaigns (shows creator avatars)
- ✅ `/launch/[id]` - Launch detail (contributors, comments)
- ✅ `/campaign/[id]` - Campaign detail (creator, participants)
- ✅ `/community` - Community page
- ✅ `/engage` - Engagement page

#### Other Pages with User Elements
- ✅ `/` - Landing page (testimonials)
- ✅ `/live` - Live streaming (streamer profiles)
- ✅ `/leaderboard` - Rankings (user avatars)

---

## 4. Testing Workflow

### Step 1: Enhance Seed Script ✅
**File:** `scripts/seed-database.ts`

**Tasks:**
1. Add 10-15 realistic user profiles with:
   - Diverse avatars (use DiceBear API for consistency)
   - Realistic Twitter handles & display names
   - Varied roles (Streamer, Trader, Degen, Creator, etc.)
   - Bio descriptions
   - Social links
   - Conviction scores & earnings
2. Add network invite data
3. Add network connection data
4. Add mutual connection relationships

### Step 2: Run Seed Script
```bash
npm run seed
# or
tsx scripts/seed-database.ts
```

**Verify:**
- Check Appwrite console for new documents
- Confirm all fields are populated correctly
- Note document IDs for testing

### Step 3: Component Testing Matrix

Test each component group sequentially:

#### Phase 1: Core Profile Components (Day 1)
- [ ] `ProfileCard` - Test with different variants (default, compact, minimal)
- [ ] `NetworkCard` - Test all connection states (none, pending, connected, self)
- [ ] `MutualAvatars` - Test with 0, 1, 3, 10+ mutuals
- [ ] `AvatarGroup` - Test overflow handling

#### Phase 2: Dashboard Widgets (Day 1-2)
- [ ] `ConnectedNetwork` - Test empty state, filtered (all/unread)
- [ ] `NetworkInvites` - Test accept/reject actions
- [ ] `NetworkActivityWidget` - Test different activity types
- [ ] `OverviewHeader` - Test user stats display

#### Phase 3: Lists & Tables (Day 2)
- [ ] `LeaderboardTable` - Test sorting, pagination
- [ ] `HallOfFame` - Test top 10 display
- [ ] `ContributorRow` - Test different roles
- [ ] `ConnectionsPanel` - Test online/offline states
- [ ] `InviteRow` - Test actions (accept/decline)

#### Phase 4: Pages Integration (Day 2-3)
- [ ] `/network` page - Full flow: filters, invites, search
- [ ] `/profile/[handle]` - Public profile view
- [ ] `/dashboard` - Overview with network widget
- [ ] `/dashboard/network` - Chat functionality
- [ ] `/discover` - Launch contributors display
- [ ] `/earn` - Campaign creators display

#### Phase 5: Edge Cases (Day 3)
- [ ] Test with missing avatar (show initials)
- [ ] Test with missing data fields
- [ ] Test with very long names/bios (truncation)
- [ ] Test with 0 mutuals, 0 connections
- [ ] Test mobile responsive layouts

### Step 4: Create Test Checklist Template

For each component:
```
Component: ProfileCard
File: components/profile/ProfileCard.tsx
Date Tested: _______

✅ Tests:
[ ] Renders with full data
[ ] Renders with minimal data
[ ] Avatar displays correctly (or fallback initials)
[ ] Verified badge shows for verified users
[ ] Roles display with correct colors
[ ] Bio truncates properly
[ ] Contributions bubbles display
[ ] Mutuals section shows
[ ] Social links work
[ ] Invite button sends invite
[ ] Message button opens chat
[ ] Hover states work
[ ] Responsive on mobile

🐛 Bugs Found:
-

📝 Notes:
-
```

---

## 5. Implementation Priorities

### Priority 1: MUST HAVE (Week 1)
1. ✅ Enhanced seed script with 15 users
2. ✅ ProfileCard working with all variants
3. ✅ NetworkCard with all connection states
4. ✅ /network page fully functional
5. ✅ Dashboard network widgets working
6. ✅ Avatar bubbles across the app

### Priority 2: SHOULD HAVE (Week 2)
1. ✅ Network invites system (send/accept/reject)
2. ✅ Mutual connections calculation
3. ✅ Chat/messaging basics
4. ✅ All discovery pages with avatars
5. ✅ Leaderboard with user profiles

### Priority 3: NICE TO HAVE (Week 3)
1. ⚠️ Advanced filters on /network
2. ⚠️ Profile recommendations
3. ⚠️ Activity feed
4. ⚠️ Notifications for invites
5. ⚠️ Profile analytics

---

## 6. Database Collections Needed

### Existing Collections
- ✅ `users` - User profiles
- ✅ `launches` - Token launches
- ✅ `campaigns` - Marketing campaigns

### New Collections to Add
- ⚠️ `network_invites` - Connection requests
  - inviteId, senderId, receiverId, message, status, createdAt
- ⚠️ `network_connections` - Accepted connections
  - connectionId, userId1, userId2, connectedAt
- ⚠️ `messages` - Direct messages
  - messageId, threadId, senderId, content, sentAt
- ⚠️ `message_threads` - Conversation threads
  - threadId, participantIds, type (dm/group), lastMessageAt

---

## 7. Next Steps

### Immediate Actions (Today)
1. ✅ Review this plan
2. ⚠️ Enhance seed script with 15 realistic users
3. ⚠️ Add network invites & connections to seed
4. ⚠️ Run seed script and verify
5. ⚠️ Test ProfileCard with seed data

### This Week
1. ⚠️ Create Appwrite collections for network data
2. ⚠️ Implement network invite API routes
3. ⚠️ Test all Priority 1 components
4. ⚠️ Fix any bugs found during testing
5. ⚠️ Deploy to staging

### Next Week
1. ⚠️ Complete Priority 2 features
2. ⚠️ User acceptance testing
3. ⚠️ Performance optimization
4. ⚠️ Production deployment

---

## 8. Success Criteria

### Definition of Done
- [ ] 15+ realistic user profiles seeded
- [ ] All avatar components render correctly
- [ ] Network page fully functional with filters
- [ ] Can send/accept/reject invites
- [ ] Chat opens from profile cards
- [ ] All pages show user avatars properly
- [ ] No broken images or missing data
- [ ] Mobile responsive
- [ ] No console errors

### Acceptance Testing
- [ ] User can browse network page
- [ ] User can search for profiles
- [ ] User can send connection invites
- [ ] User receives and can accept invites
- [ ] User can view mutual connections
- [ ] User can message connected users
- [ ] Leaderboard shows top users
- [ ] Discovery pages show creator profiles

---

## Files Modified Summary

### Will Modify:
1. `scripts/seed-database.ts` - Add enhanced user data
2. `lib/mockNetworkData.ts` - Update with seed data references
3. `scripts/setup-appwrite.ts` - Add new collections if needed

### Will Test:
- 17 components (see section 3)
- 15+ pages (see section 3)

### Will Create:
- New Appwrite collections for network features
- Test documentation for each component

---

**Status:** Ready for Implementation
**Estimated Time:** 2-3 weeks for complete rollout
**Owner:** Development Team
**Last Updated:** 2025-10-07
