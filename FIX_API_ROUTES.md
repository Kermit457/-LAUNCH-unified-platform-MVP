# Fix API Routes - Server-Side Service Migration

## Problem
API routes are getting 401 "user_unauthorized" errors because they're using client-side services without authentication.

## Solution
Use server-side services with API key authentication.

## Files to Update

### ✅ Already Created
- `lib/appwrite/server-client.ts` - Server client with API key
- `lib/appwrite/services/curves-server.ts` - Server curve service
- `lib/appwrite/services/curve-events-server.ts` - Server event service
- `lib/appwrite/services/curve-holders-server.ts` - Server holder service

### 🔧 Files That Need Import Changes

For each file below, replace the imports and service calls:

---

#### 1. `app/api/curve/owner/route.ts`

**Replace:**
```ts
import { CurveService } from '@/lib/appwrite/services/curves'
```

**With:**
```ts
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
```

**Then replace:**
- `CurveService.getCurveByOwner` → `ServerCurveService.getCurveByOwner`

---

#### 2. `app/api/curve/[id]/route.ts`

**Replace:**
```ts
import { CurveService } from '@/lib/appwrite/services/curves'
import { CurveEventService } from '@/lib/appwrite/services/curve-events'
import { CurveHolderService } from '@/lib/appwrite/services/curve-holders'
```

**With:**
```ts
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
```

**Then replace all:**
- `CurveService.` → `ServerCurveService.`
- `CurveEventService.` → `ServerCurveEventService.`
- `CurveHolderService.` → `ServerCurveHolderService.`

---

#### 3. `app/api/curve/[id]/buy/route.ts`

**Replace:**
```ts
import { CurveService } from '@/lib/appwrite/services/curves'
import { CurveEventService } from '@/lib/appwrite/services/curve-events'
import { CurveHolderService } from '@/lib/appwrite/services/curve-holders'
import { ReferralService } from '@/lib/appwrite/services/referrals'
```

**With:**
```ts
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
import { ReferralService } from '@/lib/appwrite/services/referrals'
```

**Then replace:**
- `CurveService.` → `ServerCurveService.`
- `CurveEventService.` → `ServerCurveEventService.`
- `CurveHolderService.` → `ServerCurveHolderService.`

---

#### 4. `app/api/curve/[id]/sell/route.ts`

**Same as buy route** - replace all three service imports

---

#### 5. `app/api/curve/[id]/freeze/route.ts`

**Replace:**
```ts
import { CurveService } from '@/lib/appwrite/services/curves'
import { CurveEventService } from '@/lib/appwrite/services/curve-events'
```

**With:**
```ts
import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
```

**Then replace:**
- `CurveService.` → `ServerCurveService.`
- `CurveEventService.` → `ServerCurveEventService.`

---

#### 6. `app/api/curve/[id]/launch/route.ts`

**Same as freeze route** - replace curve and event services

---

#### 7. `app/api/curve/[id]/holder/[userId]/route.ts`

**Replace:**
```ts
import { CurveHolderService } from '@/lib/appwrite/services/curve-holders'
```

**With:**
```ts
import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
```

**Then replace:**
- `CurveHolderService.` → `ServerCurveHolderService.`

---

## Quick Find & Replace

In VS Code, you can do a **workspace-wide find & replace**:

1. Press `Ctrl+Shift+H` (Windows) or `Cmd+Shift+H` (Mac)
2. Set "Files to include" to: `app/api/curve/**/*.ts`
3. Do these replacements in order:

### Step 1: Update Imports
```
Find:    import { CurveService } from '@/lib/appwrite/services/curves'
Replace: import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
```

```
Find:    import { CurveEventService } from '@/lib/appwrite/services/curve-events'
Replace: import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
```

```
Find:    import { CurveHolderService } from '@/lib/appwrite/services/curve-holders'
Replace: import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
```

### Step 2: Update Service Calls
```
Find:    CurveService\.
Replace: ServerCurveService.
```

```
Find:    CurveEventService\.
Replace: ServerCurveEventService.
```

```
Find:    CurveHolderService\.
Replace: ServerCurveHolderService.
```

---

## After Fixing

Once all routes are updated:

1. Restart your dev server
2. Visit `/curve-demo`
3. The "user_unauthorized" error should be gone
4. You should see the curve UI load properly

---

## Files Status

- ✅ `lib/appwrite/server-client.ts` - Created
- ✅ `lib/appwrite/services/curves-server.ts` - Created
- ✅ `lib/appwrite/services/curve-events-server.ts` - Created
- ✅ `lib/appwrite/services/curve-holders-server.ts` - Created
- ✅ `components/design-system/index.ts` - Button export fixed
- ⏳ `app/api/curve/create/route.ts` - Needs update
- ⏳ `app/api/curve/owner/route.ts` - Needs update
- ⏳ `app/api/curve/[id]/route.ts` - Needs update
- ⏳ `app/api/curve/[id]/buy/route.ts` - Needs update
- ⏳ `app/api/curve/[id]/sell/route.ts` - Needs update
- ⏳ `app/api/curve/[id]/freeze/route.ts` - Needs update
- ⏳ `app/api/curve/[id]/launch/route.ts` - Needs update
- ⏳ `app/api/curve/[id]/holder/[userId]/route.ts` - Needs update
