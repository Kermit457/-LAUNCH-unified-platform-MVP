# Feature Flags & Dev Mode Strategy

Complete guide for using feature flags to toggle between mock and live data in LaunchOS.

---

## Quick Start

### 1. **Enable Mock Data Mode**

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SHOW_DEV_BANNER=true
```

Restart the dev server:
```bash
npm run dev
```

You'll see an orange banner at the top: **"DEVELOPMENT MODE: MOCK DATA ACTIVE"**

---

### 2. **Switch to Live Data Mode**

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_SHOW_DEV_BANNER=false
```

Restart the dev server. The app now uses real Appwrite data.

---

## Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_USE_MOCK_DATA` | `boolean` | `false` | If `true`, use mock/sample data instead of Appwrite |
| `NEXT_PUBLIC_SHOW_DEV_BANNER` | `boolean` | `false` | If `true`, show development mode banner |

**Note:** These are `NEXT_PUBLIC_*` variables, so they're exposed to the browser. Never put secrets here.

---

## Data Source Abstraction Layer

### **`lib/data-source.ts`**

This module provides a unified interface that automatically switches between mock and live data:

```typescript
import { getDataLaunches, getDataLaunch } from '@/lib/data-source'

// Automatically uses mock or live data based on USE_MOCK_DATA
const launches = await getDataLaunches({ limit: 10 })
const launch = await getDataLaunch('123')
```

### **Available Functions:**

#### **Launches**
```typescript
getDataLaunches(options?: LaunchesOptions): Promise<any[]>
getDataLaunch(id: string): Promise<any>
```

**Options:**
- `status?: 'live' | 'upcoming' | 'ended'`
- `limit?: number`
- `offset?: number`
- `sortBy?: 'recent' | 'marketCap' | 'volume' | 'conviction'`

#### **Campaigns**
```typescript
getDataCampaigns(options?: CampaignsOptions): Promise<Campaign[]>
getDataCampaign(id: string): Promise<Campaign>
```

**Options:**
- `type?: 'bounty' | 'quest' | 'airdrop'`
- `status?: 'active' | 'completed' | 'cancelled'`
- `createdBy?: string`
- `limit?: number`

#### **Quests/Raids**
```typescript
getDataQuests(options?: QuestsOptions): Promise<Quest[]>
getDataQuest(id: string): Promise<Quest>
```

#### **Submissions**
```typescript
getDataSubmissions(options?: SubmissionsOptions): Promise<Submission[]>
```

**Options:**
- `userId?: string`
- `campaignId?: string`
- `questId?: string`
- `status?: string`
- `limit?: number`

#### **Payouts**
```typescript
getDataPayouts(options?: PayoutsOptions): Promise<Payout[]>
```

**Options:**
- `userId?: string`
- `status?: string`
- `limit?: number`

#### **Utility Functions**
```typescript
getDataSourceMode(): 'mock' | 'live'
isUsingMockData(): boolean
shouldShowDevBanner(): boolean
```

---

## Dev Mode Banner

### **Visual Indicators:**

#### **Mock Data Mode (Orange)**
When `USE_MOCK_DATA=true`:
- 🟠 **Orange banner** at top
- Shows: **"DEVELOPMENT MODE: MOCK DATA ACTIVE"**
- Icon: Database with pulse animation
- Badge: `MOCK` in orange

#### **Live Data Mode (Blue)**
When `USE_MOCK_DATA=false` but `SHOW_DEV_BANNER=true`:
- 🔵 **Blue banner** at top
- Shows: **"DEVELOPMENT MODE"**
- Icon: Wifi signal
- Badge: `LIVE` in blue

#### **Production Mode (No Banner)**
When both flags are `false`:
- No banner shown
- No visual indicators

### **Banner Features:**

1. **Dismissible** - Click the X to hide banner
2. **Session persistence** - Dismissal lasts for current tab only
3. **Small indicator** - After dismissing, shows a small corner badge
4. **Responsive** - Hides some text on mobile

### **Components:**

```tsx
import { DevModeBanner, DevModeIndicator } from '@/components/DevModeBanner'

// In layout.tsx
<DevModeBanner />    {/* Top banner */}
<DevModeIndicator /> {/* Corner badge after dismissal */}
```

---

## Migration Guide

### **Before (Direct Appwrite Calls):**

```typescript
// page.tsx
import { getLaunches } from '@/lib/appwrite/services/launches'

const launches = await getLaunches({ limit: 10 })
```

### **After (Data Source Layer):**

```typescript
// page.tsx
import { getDataLaunches } from '@/lib/data-source'

const launches = await getDataLaunches({ limit: 10 })
```

**Benefits:**
- ✅ Automatically switches based on environment variable
- ✅ No code changes needed to toggle modes
- ✅ Console logs show which data source is active
- ✅ Easy testing without database

---

## Usage Examples

### **Example 1: Homepage with Auto-Switching**

```typescript
// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { getDataLaunches } from '@/lib/data-source'

export default function HomePage() {
  const [launches, setLaunches] = useState([])

  useEffect(() => {
    async function load() {
      // Automatically uses mock or live data
      const data = await getDataLaunches({ limit: 12 })
      setLaunches(data)
    }
    load()
  }, [])

  return <div>{/* Render launches */}</div>
}
```

### **Example 2: Checking Data Source Mode**

```typescript
import { getDataSourceMode, isUsingMockData } from '@/lib/data-source'

function MyComponent() {
  const mode = getDataSourceMode() // 'mock' or 'live'

  if (isUsingMockData()) {
    console.log('⚠️ Using mock data - submissions will not be saved')
  }

  return <div>Data source: {mode}</div>
}
```

### **Example 3: Conditional Features**

```typescript
import { isUsingMockData } from '@/lib/data-source'

function SubmissionForm() {
  const usingMock = isUsingMockData()

  return (
    <form>
      {/* Form fields */}
      <button type="submit" disabled={usingMock}>
        {usingMock ? 'Submit (Mock Mode - Disabled)' : 'Submit'}
      </button>
    </form>
  )
}
```

---

## Console Logging

The data source layer logs which source is being used:

```
🔧 Data Source: MOCK DATA
📦 Using mock launches data
📦 Using mock launch data for ID: 1
```

vs.

```
🔧 Data Source: APPWRITE (LIVE)
🔥 Fetching launches from Appwrite
🔥 Fetching launch 1 from Appwrite
```

---

## Best Practices

### ✅ **Do:**

1. **Use data source layer for all data fetching**
   ```typescript
   import { getDataLaunches } from '@/lib/data-source'
   ```

2. **Enable mock mode during UI development**
   ```bash
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```

3. **Test with live data before deployment**
   ```bash
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```

4. **Show banner in staging environments**
   ```bash
   NEXT_PUBLIC_SHOW_DEV_BANNER=true
   ```

### ❌ **Don't:**

1. **Don't mix direct Appwrite calls with data source layer**
   ```typescript
   // Bad - bypasses feature flag
   import { getLaunches } from '@/lib/appwrite/services/launches'
   ```

2. **Don't enable mock mode in production**
   ```bash
   # Bad - users will see fake data
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```

3. **Don't commit `.env.local` with mock mode enabled**
   - Use `.env.example` for documentation only

---

## Testing Strategy

### **Development Workflow:**

1. **UI Development** (Mock Mode)
   ```bash
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```
   - Fast iteration
   - No database needed
   - Predictable data

2. **Integration Testing** (Live Mode)
   ```bash
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```
   - Test real Appwrite connection
   - Verify permissions
   - Test error handling

3. **Staging** (Live + Banner)
   ```bash
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_SHOW_DEV_BANNER=true
   ```
   - Live data
   - Visual indicator for testers

4. **Production** (Live, No Banner)
   ```bash
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_SHOW_DEV_BANNER=false
   ```
   - Production ready
   - No visual indicators

---

## Troubleshooting

### **Problem: Banner not showing**

**Solution:**
```bash
# Check environment variable
echo $NEXT_PUBLIC_SHOW_DEV_BANNER

# Set it
NEXT_PUBLIC_SHOW_DEV_BANNER=true

# Restart dev server
npm run dev
```

### **Problem: Still seeing mock data**

**Solution:**
```bash
# Check flag
echo $NEXT_PUBLIC_USE_MOCK_DATA

# Disable it
NEXT_PUBLIC_USE_MOCK_DATA=false

# Clear Next.js cache
rm -rf .next
npm run dev
```

### **Problem: Console shows wrong data source**

**Solution:**
- Check browser console for `🔧 Data Source:` log
- Verify `.env.local` is loaded
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

### **Problem: Types mismatch between mock and live**

**Solution:**
- Ensure mock data in `lib/sampleData.ts` matches Appwrite schema
- Update TypeScript interfaces in `lib/appwrite/services/*`
- Run `npm run type-check`

---

## Environment Setup

### **Development:**
```env
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SHOW_DEV_BANNER=true
```

### **Staging:**
```env
# .env.staging
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_SHOW_DEV_BANNER=true
NEXT_PUBLIC_APPWRITE_PROJECT_ID=staging_project_id
```

### **Production:**
```env
# .env.production
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_SHOW_DEV_BANNER=false
NEXT_PUBLIC_APPWRITE_PROJECT_ID=production_project_id
```

---

## Advanced Usage

### **Custom Mock Data:**

Add your own mock data to `lib/sampleData.ts`:

```typescript
export const customMockLaunches = [
  {
    id: '999',
    title: 'Custom Test Launch',
    // ... other fields
  }
]
```

Then use it in `lib/data-source.ts`:

```typescript
import { customMockLaunches } from './sampleData'

export async function getDataLaunches(options?: LaunchesOptions) {
  if (USE_MOCK_DATA) {
    return customMockLaunches
  }
  // ...
}
```

### **Partial Mock Mode:**

Mix mock and live data:

```typescript
export async function getDataLaunches(options?: LaunchesOptions) {
  if (USE_MOCK_DATA) {
    // Use mock launches
    return mockLaunches
  } else {
    // Use live Appwrite, but inject test data
    const live = await getLaunches(options)
    return [...mockLaunches.slice(0, 2), ...live] // 2 mock + rest live
  }
}
```

---

## Summary Checklist

- [x] Add `NEXT_PUBLIC_USE_MOCK_DATA` to `.env.example`
- [x] Add `NEXT_PUBLIC_SHOW_DEV_BANNER` to `.env.example`
- [x] Create `lib/data-source.ts` abstraction layer
- [x] Create `components/DevModeBanner.tsx` component
- [x] Add banner to `app/layout.tsx`
- [x] Update all pages to use `getDataLaunches()` etc.
- [ ] Test mock mode works
- [ ] Test live mode works
- [ ] Test banner dismissal
- [ ] Test production build without banner

---

## Quick Reference

| Task | Command |
|------|---------|
| Enable mock mode | `NEXT_PUBLIC_USE_MOCK_DATA=true` |
| Disable mock mode | `NEXT_PUBLIC_USE_MOCK_DATA=false` |
| Show dev banner | `NEXT_PUBLIC_SHOW_DEV_BANNER=true` |
| Hide dev banner | `NEXT_PUBLIC_SHOW_DEV_BANNER=false` |
| Check data source | Console: `🔧 Data Source: MOCK DATA` or `APPWRITE (LIVE)` |
| Dismiss banner | Click X button (persists for session) |
