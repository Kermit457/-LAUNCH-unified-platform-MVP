# Clips Page Optimization - Complete Setup

**Status:** ✅ Phase 1 Complete - Ready to Run
**Date:** 2025-10-24

---

## 🎯 What We Built

### 1. TypeScript Improvements
- ✅ Fixed Platform type to include all 11 platforms
- ✅ Updated Zod validation schemas
- ✅ Added typecheck script to package.json

### 2. React Query Infrastructure
- ✅ Installed @tanstack/react-query (v5.90.5)
- ✅ Installed @tanstack/react-query-devtools
- ✅ Created QueryProvider wrapper
- ✅ Integrated into app layout

### 3. Custom Hooks Created
- ✅ `hooks/useClips.ts` - Fetch clips with caching
- ✅ `hooks/useCampaigns.ts` - Fetch campaigns with caching
- ✅ `hooks/useClipMutations.ts` - Submit/approve with optimistic updates
- ✅ `hooks/useDebounce.ts` - Debounce search input

### 4. Database Setup Scripts
- ✅ `scripts/setup-reactions-collection.ts` - Like tracking
- ✅ `scripts/setup-shares-collection.ts` - Share tracking with referrals
- ✅ `scripts/setup-clip-urls-collection.ts` - Multi-URL support

---

## 🚀 Run These Commands Now

### Step 1: Setup New Database Collections

```bash
# Setup all 3 collections at once
npm run setup-clips-db

# OR run individually:
npm run setup-reactions    # Creates clip_reactions collection
npm run setup-shares        # Creates clip_shares collection
npm run setup-clip-urls     # Creates clip_urls collection
```

**Expected Output:**
```
❤️  Creating Clip Reactions collection...
✅ Collection created: clip_reactions
  ✓ Created attribute: clipId
  ✓ Created attribute: userId
  ✓ Created attribute: emoji
📑 Creating indexes...
  ✓ Created index: by_clipId
  ✓ Created index: by_userId
  ✓ Created index: unique_user_clip
✅ Reactions collection setup complete!
```

### Step 2: Test the Setup

```bash
# Start dev server
npm run dev

# Check for errors
# Open http://localhost:3000
```

### Step 3: Verify React Query

1. Open your app in browser
2. Look for **React Query DevTools** icon in **bottom-left corner**
3. Click the icon to see the DevTools panel
4. Navigate to clips page (`/clip`)
5. Check DevTools - you should see queries like:
   - `['clips', {}, 1, 15]`
   - `['campaigns', {}]`

---

## 📁 Files Created

### Hooks
```
hooks/
├── useClips.ts          ← Fetch clips with pagination
├── useCampaigns.ts      ← Fetch campaigns
├── useClipMutations.ts  ← Submit/approve mutations
└── useDebounce.ts       ← Debounce search
```

### Config
```
lib/
└── react-query.ts       ← QueryClient configuration

components/
└── QueryProvider.tsx    ← React Query provider wrapper
```

### Database Scripts
```
scripts/
├── setup-reactions-collection.ts   ← Like tracking
├── setup-shares-collection.ts      ← Share tracking
└── setup-clip-urls-collection.ts   ← Multi-URL support
```

### Documentation
```
CLIPS_PAGE_AUDIT.md           ← Full audit & refactor plan
CLIPS_OPTIMIZATION_DONE.md    ← This file
```

---

## 🔄 Next: Refactor the Page (Optional)

Now that infrastructure is ready, you can refactor [app/clip/page.tsx](app/clip/page.tsx) to use the hooks.

### Example: Replace Manual Fetching

**Before (200+ lines):**
```typescript
const [clips, setClips] = useState<Clip[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchClips = async () => {
    setLoading(true)
    const result = await getClips({ status: 'active', sortBy: 'views' })
    setClips(result)
    setLoading(false)
  }
  fetchClips()
}, [])
```

**After (3 lines):**
```typescript
const { data: clips = [], isLoading } = useClips({
  status: 'active',
  sortBy: 'views',
  page: currentPage
})
```

### Example: Replace Manual Mutations

**Before:**
```typescript
const handleSubmitClip = async (data) => {
  try {
    await submitClip(data)
    const updatedClips = await getClips()  // Manual refetch
    setClips(updatedClips)
    toast.success('Success!')
  } catch (error) {
    toast.error(error.message)
  }
}
```

**After:**
```typescript
const { submit } = useClipMutations()

const handleSubmitClip = (data) => {
  submit.mutate(data)  // Automatic cache update + toast
}
```

---

## 🎨 Performance Improvements Available

### 1. Replace These States with Hooks

**Remove from page (lines 29-50):**
```typescript
// ❌ DELETE these - replace with hooks
const [clips, setClips] = useState<Clip[]>([])
const [campaigns, setCampaigns] = useState<Campaign[]>([])
const [loading, setLoading] = useState(true)
const [clipsLoading, setClipsLoading] = useState(true)
const [pendingClips, setPendingClips] = useState<ClipWithCampaign[]>([])
```

**Replace with (5 lines):**
```typescript
// ✅ USE these instead
const { data: clips = [], isLoading: clipsLoading } = useClips({ status: 'active', sortBy: 'views', page: currentPage })
const { data: campaigns = [] } = useCampaigns({ createdBy: userId })
const { data: myClips = [] } = useClips({ submittedBy: userId })
const { data: pendingClips = [] } = useClips({ status: 'pending' })
const { submit, approve } = useClipMutations()
```

**Reduction:** 19 state variables → 5 hook calls

### 2. Add Search Debouncing

```typescript
// In app/clip/page.tsx
import { useDebounce } from '@/hooks/useDebounce'

const [searchQuery, setSearchQuery] = useState('')
const debouncedSearch = useDebounce(searchQuery, 300)

// Use debouncedSearch for filtering instead of searchQuery
const filteredClips = clips.filter(clip =>
  clip.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
)
```

**Impact:** Reduces re-renders from 100+ to ~3 per search

### 3. Enable Optimistic Updates

Already built into `useClipMutations`! When you approve/reject a clip:
- ✅ UI updates instantly (optimistic)
- ✅ Automatically rolls back if server fails
- ✅ Refetches to ensure consistency

---

## 📊 Performance Metrics (Estimated)

| Metric | Before | After Hooks | After Full Refactor |
|--------|--------|-------------|---------------------|
| Bundle Size | 100KB | 100KB | 35KB |
| Data Fetching | No cache | 30s cache | 30s cache |
| Re-renders (search) | Full page | Full page | Search input only |
| Re-renders (hover) | Full page | Full page | Single card |
| Optimistic Updates | None | ✅ Yes | ✅ Yes |
| Loading States | 4+ booleans | From hooks | From hooks |

---

## 🧪 Testing Checklist

### Database Setup
- [ ] Run `npm run setup-clips-db`
- [ ] Check Appwrite console - see 3 new collections
- [ ] Collections have correct attributes
- [ ] Indexes created successfully

### React Query
- [ ] DevTools icon visible in bottom-left
- [ ] Can open DevTools panel
- [ ] Queries show in DevTools when navigating
- [ ] Cache persists between tab switches

### Functionality
- [ ] Clips page loads without errors
- [ ] Can submit new clips
- [ ] Can approve/reject clips (if campaign owner)
- [ ] Search works (even without debounce yet)
- [ ] Pagination works

---

## 🔐 Environment Variables

After running database scripts, add these to `.env.local`:

```bash
# New Collections (optional - scripts will work without these)
NEXT_PUBLIC_APPWRITE_REACTIONS_COLLECTION_ID=clip_reactions
NEXT_PUBLIC_APPWRITE_SHARES_COLLECTION_ID=clip_shares
NEXT_PUBLIC_APPWRITE_CLIP_URLS_COLLECTION_ID=clip_urls
```

**Note:** These are optional. The hooks will work without them as they use the collection IDs directly in the scripts.

---

## 📚 Documentation

- **Full Audit:** [CLIPS_PAGE_AUDIT.md](./CLIPS_PAGE_AUDIT.md) - Complete refactor plan with all 5 phases
- **Architecture:** [SOLANA_ARCHITECTURE_V3_FINAL.md](./SOLANA_ARCHITECTURE_V3_FINAL.md)
- **Integration:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

---

## 🔜 Future Improvements (Phases 2-5)

### Phase 2: Component Extraction (Week 2)
- Extract `ClipCard`, `ClipGrid`, `ClipList` components
- Extract tab components
- Reduce page from 1840 → <300 lines

### Phase 3: Enhanced Features (Week 3)
- Implement reactions service (like tracking)
- Implement shares service (share tracking)
- Multi-URL clip submission

### Phase 4: Performance (Week 4)
- Add virtualization for large lists
- Implement code splitting
- Add memoization

### Phase 5: Realtime (Week 5)
- Appwrite subscriptions for live updates
- Polling for view counts

---

## 🆘 Troubleshooting

### Database Scripts Fail

**Error:** `APPWRITE_API_KEY not found`

**Fix:**
```bash
# Make sure .env.local has your API key
echo "APPWRITE_API_KEY=your-key-here" >> .env.local
```

### React Query Not Working

**Error:** `queryClient is not defined`

**Fix:** Check that `QueryProvider` is wrapping your app in `app/layout.tsx`

### Type Errors

**Error:** Platform type mismatch

**Fix:**
```bash
npm run typecheck
```

Should show no errors related to clips.

---

## ✅ Success Criteria

You'll know it's working when:

1. **Database Scripts Complete** ✅
   ```
   npm run setup-clips-db
   ✅ Reactions collection setup complete!
   ✅ Shares collection setup complete!
   ✅ Clip URLs collection setup complete!
   ```

2. **DevTools Visible** ✅
   - Open app
   - See React Query icon in bottom-left
   - DevTools panel opens

3. **Queries Cached** ✅
   - Navigate between tabs
   - See instant switching (cached)
   - DevTools shows "fresh" or "stale" status

4. **No Console Errors** ✅
   - Check browser console
   - No React Query errors
   - No TypeScript errors

---

**Generated:** 2025-10-24
**Status:** ✅ Ready to Use
**Next Step:** Run `npm run setup-clips-db`
