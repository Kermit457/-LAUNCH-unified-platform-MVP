# Correct Field Mapping for Launch Creation

## 🎯 The Correct Understanding

### Creation Form Fields
When creating a launch, the fields mean:

| Form Field | What It Actually Is | Example |
|------------|-------------------|---------|
| **Title** | Token Name | "Solana" |
| **Subtitle** | Token Ticker/Symbol | "SOL" |
| **Logo** | Token Logo Image | solana-logo.png |
| **Scope** | ICM or CCM | "ICM" |
| **Status** | Live or Upcoming | "Live" |

---

## 📊 Database Schema Mapping

### What We SHOULD Save

```typescript
{
  // Primary fields (NEW schema)
  title: "Solana",           // Token Name
  subtitle: "SOL",           // Token Ticker
  logoUrl: "https://...",    // Logo URL
  scope: "ICM",              // ICM or CCM

  // Legacy compatibility (OLD schema)
  tokenName: "Solana",       // Same as title
  tokenSymbol: "SOL",        // Same as subtitle
  tokenImage: "https://...", // Same as logoUrl

  // Metadata
  createdBy: "user_123",
  status: "live",
  convictionPct: 0,
  commentsCount: 0,
  upvotes: 0,

  // Economics
  contributionPoolPct: 3,
  feesSharePct: 25,

  // Entity ownership (NEW)
  ownerType: "user",         // or "project"
  ownerId: "user_123"        // or projectId
}
```

---

## 🔧 What Needs to Change

### 1. Update createLaunchDocument() Call

**Current (WRONG):**
```typescript
await createLaunchDocument({
  title: data.title,
  subtitle: data.subtitle,
  logoUrl,
  // Missing tokenName, tokenSymbol
})
```

**Correct (RIGHT):**
```typescript
await createLaunchDocument({
  // New schema
  title: data.title,        // Token Name (e.g., "Solana")
  subtitle: data.subtitle,  // Token Ticker (e.g., "SOL")
  logoUrl,
  scope: data.scope,

  // Legacy schema for compatibility
  tokenName: data.title,    // Same as title
  tokenSymbol: data.subtitle, // Same as subtitle
  tokenImage: logoUrl,      // Same as logoUrl
  description: data.subtitle || `${data.title} Token`, // Fallback description

  // Metadata
  createdBy: userId,
  status: data.status === 'Live' ? 'live' : 'upcoming',
  convictionPct: 0,
  commentsCount: 0,
  upvotes: 0,

  // Economics
  contributionPoolPct: data.economics?.contributionPoolPct,
  feesSharePct: data.economics?.feesSharePct,

  // Tags
  tags: [data.scope]
})
```

---

## 🎨 Display Logic (Already Fixed)

The discover page now handles both schemas:

```typescript
{
  title: launch.title || launch.tokenName || 'Unnamed Launch',
  subtitle: launch.subtitle || launch.tokenSymbol || launch.description || '',
  logoUrl: launch.logoUrl || launch.tokenImage || '',
  scope: launch.scope || ((launch.tags?.includes('ICM')) ? 'ICM' : 'CCM'),
}
```

This means:
- If `title` exists → use it
- If not, fall back to `tokenName`
- Same for `subtitle/tokenSymbol` and `logoUrl/tokenImage`

---

## ✅ Action Items

1. **Update discover/page.tsx** - Add tokenName, tokenSymbol, tokenImage to createLaunchDocument() call
2. **Update launches.ts** - Make createLaunchDocument() accept all fields
3. **Purge test data** - Delete old launches with incomplete data
4. **Test end-to-end** - Create new launch and verify display

---

## 📝 Example End-to-End Flow

**User fills form:**
- Title: `Solana`
- Subtitle: `SOL`
- Logo: `[uploads solana.png]`
- Scope: `ICM`
- Status: `Live`

**Saved to Appwrite:**
```json
{
  "title": "Solana",
  "tokenName": "Solana",
  "subtitle": "SOL",
  "tokenSymbol": "SOL",
  "logoUrl": "https://storage.../solana.png",
  "tokenImage": "https://storage.../solana.png",
  "scope": "ICM",
  "status": "live",
  "tags": ["ICM"]
}
```

**Displayed as:**
- Card shows: **Solana** (title)
- Badge shows: **SOL** (subtitle)
- Logo shows: solana.png
- Tag shows: **ICM**

---

## 🚨 Critical: Form Label Clarification

**Option A: Update form labels to be clearer**
```typescript
// In SubmitLaunchDrawer.tsx
<label>Token Name *</label>  // Instead of "Title"
<input placeholder="e.g., Solana, Bitcoin" />

<label>Token Ticker *</label>  // Instead of "Subtitle"
<input placeholder="e.g., SOL, BTC" />
```

**Option B: Keep labels as-is but add hints**
```typescript
<label>Title *</label>
<input placeholder="Token name (e.g., Solana)" />

<label>Subtitle *</label>
<input placeholder="Token ticker (e.g., SOL)" />
```

**Recommendation:** Option B (less code change, clear hints)

---

**STATUS:** Documentation complete. Ready to implement the fixes.