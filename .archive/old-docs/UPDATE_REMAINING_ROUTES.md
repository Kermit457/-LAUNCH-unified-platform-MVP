# Quick Update Script

I've updated 3 files so far:
- ✅ app/api/curve/create/route.ts
- ✅ app/api/curve/owner/route.ts
- ✅ app/api/curve/[id]/route.ts
- ✅ app/api/curve/[id]/buy/route.ts (partially - has type errors to fix)

## Remaining files need these changes:

Use VS Code Find & Replace (`Ctrl+Shift+H`):

**Files to include:** `app/api/curve/**/*.ts`

### Replace 1: Imports
```
Find: import { CurveService } from '@/lib/appwrite/services/curves'
Replace: import { ServerCurveService } from '@/lib/appwrite/services/curves-server'
```

### Replace 2:
```
Find: import { CurveEventService } from '@/lib/appwrite/services/curve-events'
Replace: import { ServerCurveEventService } from '@/lib/appwrite/services/curve-events-server'
```

### Replace 3:
```
Find: import { CurveHolderService } from '@/lib/appwrite/services/curve-holders'
Replace: import { ServerCurveHolderService } from '@/lib/appwrite/services/curve-holders-server'
```

### Replace 4: Service Calls (Enable REGEX!)
```
Find: CurveService\.
Replace: ServerCurveService.
```

### Replace 5:
```
Find: CurveEventService\.
Replace: ServerCurveEventService.
```

### Replace 6:
```
Find: CurveHolderService\.
Replace: ServerCurveHolderService.
```

Click "Replace All" for each one!

This will fix all remaining files in one go.
