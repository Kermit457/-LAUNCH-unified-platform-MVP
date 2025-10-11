# Final API Route Updates

You have 3 files left to update. Here's the quickest way:

## Option 1: Use VS Code Find & Replace (FASTEST)

Press `Ctrl+Shift+H` in VS Code:

1. Set "files to include": `app/api/curve`
2. Enable **Regex mode** (button with `.*` icon)

### Replace 1:
```
Find:    import { CurveService } from '@/lib/appwrite/services/curves'
Replace: import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
```
Click "Replace All"

### Replace 2:
```
Find:    import { CurveEventService } from '@/lib/appwrite/services/curve-events'
Replace: import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
```
Click "Replace All"

### Replace 3:
```
Find:    import { CurveHolderService } from '@/lib/appwrite/services/curve-holders'
Replace: import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
```
Click "Replace All"

### Replace 4 (with regex enabled):
```
Find:    CurveService\.
Replace: ServerCurveService.
```
Click "Replace All"

### Replace 5 (with regex enabled):
```
Find:    CurveEventService\.
Replace: ServerCurveEventService.
```
Click "Replace All"

### Replace 6 (with regex enabled):
```
Find:    CurveHolderService\.
Replace: ServerCurveHolderService.
```
Click "Replace All"

---

## Option 2: Manual Updates

If you prefer, here are the files that still need updates:

### 1. app/api/curve/[id]/sell/route.ts
Line 2-4: Change imports
All lines using `CurveService.` → `ServerCurveService.`
All lines using `CurveEventService.` → `ServerCurveEventService.`
All lines using `CurveHolderService.` → `ServerCurveHolderService.`

### 2. app/api/curve/[id]/freeze/route.ts
Line 2-3: Change imports
All service calls

### 3. app/api/curve/[id]/launch/route.ts
Line 2-3: Change imports
All service calls

### 4. app/api/curve/[id]/holder/[userId]/route.ts
Line 2: Change import
All service calls

---

## After Updates

Once done:
1. All TypeScript errors should be gone ✅
2. Restart dev server: `npm run dev`
3. Visit `/curve-demo`
4. The demo should load without 401 errors! 🚀

---

## Status Check

**Files Updated (5/8):**
- ✅ create/route.ts
- ✅ owner/route.ts
- ✅ [id]/route.ts
- ✅ [id]/buy/route.ts
- ✅ (Button component exported)

**Files Remaining (3/8):**
- ⏳ [id]/sell/route.ts
- ⏳ [id]/freeze/route.ts
- ⏳ [id]/launch/route.ts
- ⏳ [id]/holder/[userId]/route.ts

**All 3 need the exact same find & replace!**
