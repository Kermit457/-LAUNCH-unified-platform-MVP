# Appwrite Real-time Features Setup Guide

## 🎯 Overview
This guide shows you how to add the missing database fields for real-time boost and view tracking.

---

## 📋 Required Database Changes

### **Collection: `launches`**
Add these two new attributes:

| Attribute Name | Type | Size | Required | Default | Array |
|----------------|------|------|----------|---------|-------|
| `viewCount` | Integer | - | ❌ No | 0 | ❌ No |
| `boostCount` | Integer | - | ❌ No | 0 | ❌ No |

---

## 🔧 Step-by-Step Setup Instructions

### **Step 1: Access Appwrite Console**
1. Go to https://fra.cloud.appwrite.io/console
2. Select your project: `LaunchOS` (ID: `68e34a030010f2321359`)
3. Navigate to **Databases** → **launchos_db**

### **Step 2: Open Launches Collection**
1. Find and click on the **`launches`** collection
2. Click on the **Attributes** tab
3. Click **+ Create Attribute**

### **Step 3: Add viewCount Field**
1. **Type**: Select **Integer**
2. **Key**: `viewCount`
3. **Required**: ❌ Leave unchecked
4. **Default value**: `0`
5. **Array**: ❌ Leave unchecked
6. Click **Create**
7. ⏳ Wait for Appwrite to create the attribute (~30 seconds)

### **Step 4: Add boostCount Field**
1. Click **+ Create Attribute** again
2. **Type**: Select **Integer**
3. **Key**: `boostCount`
4. **Required**: ❌ Leave unchecked
5. **Default value**: `0`
6. **Array**: ❌ Leave unchecked
7. Click **Create**
8. ⏳ Wait for Appwrite to create the attribute (~30 seconds)

---

## ✅ Verification Steps

### **After Adding Fields:**

1. **Refresh your app** (Ctrl/Cmd + R)
2. **Visit any launch page**: http://localhost:3000/launch/[any-launch-id]
3. **Open Appwrite Console** → Databases → launches → Documents
4. **Find the launch you visited**
5. **Check**: `viewCount` should be **1** (or incremented)

### **Test Boost Feature:**
1. Visit a launch detail page
2. Click the **"Boost"** button
3. Check Appwrite Console
4. `boostCount` should be incremented

---

## 🎨 Where You'll See Real-time Updates

### **1. Discover Page** (`/discover`)
Each launch card will show:
- ⚡ **Boost count** (fuchsia badge)
- 👁️ **View count** (green badge)

Example:
```
┌──────────────────────┐
│  LaunchOS Platform   │
│  CCM  LIVE          │
│  ━━━━━━━ 96%       │
│  🪙 3%  💰 25%      │
│  ⚡ 12  👁️ 234      │ ← NEW!
│                      │
│  [Boost] [View]     │
└──────────────────────┘
```

### **2. Launch Detail Page** (`/launch/[id]`)
Top stats bar will show:
- 👁️ **Views**: Real-time count
- ⚡ **Boosts**: Real-time count
- Updates instantly when changed

### **3. Network Invite Badge** (Navbar)
- Shows pending invite count
- Only visible if you have pending invites
- Location: Next to the bell icon in navbar

### **4. Activities Feed** (Dashboard)
- Scroll to bottom of `/dashboard`
- Shows real-time activity stream
- Filter by All/Unread
- Click unread items to mark as read

---

## 🧪 Testing Real-time Updates

### **Test 1: View Count**
1. Open `/discover` in one browser tab
2. Note a launch's view count
3. Open that launch detail page in another tab
4. Go back to `/discover`
5. ✅ View count should increase automatically

### **Test 2: Boost Count**
1. Open a launch detail page
2. Open `/discover` in another tab
3. Click "Boost" on the detail page
4. Check `/discover` tab
5. ✅ Boost count should increase automatically

### **Test 3: Activities Feed**
1. Open `/dashboard` in one tab
2. In Appwrite Console, manually create an activity:
   - Collection: `activities`
   - Fields:
     ```json
     {
       "userId": "your-user-id",
       "activityId": "test_123",
       "type": "payout",
       "category": "earning",
       "title": "Test Activity",
       "message": "This is a test",
       "read": false
     }
     ```
3. Check dashboard
4. ✅ Activity should appear instantly

---

## 🐛 Troubleshooting

### **Views not counting?**
- Check browser console for errors
- Verify `viewCount` field exists in Appwrite
- Make sure field type is **Integer** not String
- Check default value is `0`

### **Boosts not working?**
- Same as above for `boostCount` field
- Check browser console when clicking Boost button
- Verify you're signed in (Privy)

### **Activities not appearing?**
- Check `activities` collection exists
- Verify user is logged in
- Check browser console for WebSocket errors

### **Network badge not showing?**
- Create a test network invite in Appwrite
- Make sure status is `pending`
- Verify `receiverId` matches your userId

---

## 📊 Database Schema Summary

After setup, your `launches` collection should have these tracking fields:

```typescript
interface Launch {
  // ... existing fields
  viewCount?: number      // NEW - tracks page views
  boostCount?: number     // NEW - tracks boost count
  convictionPct?: number  // Existing
  upvotes?: number        // Existing (from votes collection)
  commentsCount?: number  // Existing (from comments collection)
}
```

---

## 🚀 Future Enhancements (Already Built, Just Need Data)

These features are coded and ready, they just need the database fields:

1. ✅ **Real-time view tracking** - Increments on page visit
2. ✅ **Real-time boost tracking** - Click to boost
3. ✅ **Activities feed** - Shows user notifications
4. ✅ **Network invites** - Friend requests system
5. ✅ **Vote tracking** - Upvote system with real-time sync
6. ✅ **Comments** - Real-time comment threads

All features use Appwrite real-time subscriptions for instant updates! 🎉

---

## 📝 Notes

- All integer fields default to `0` if not set
- View counting is automatic (no user action needed)
- Boost requires user to click "Boost" button
- Real-time updates work across multiple browser tabs
- No page refresh needed - updates are instant

---

**Questions?** Check the code in:
- `lib/appwrite/services/tracking.ts` - Tracking functions
- `hooks/useRealtimeTracking.ts` - React hook
- `components/launch/cards/BaseLaunchCard.tsx` - UI badges
