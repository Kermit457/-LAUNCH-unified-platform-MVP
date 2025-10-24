# Appwrite Database Setup Guide

## 📦 New Unified Data Structure

We've created a complete Appwrite integration for the ICM Motion platform with the following collections:

### Collections Created:

1. **projects** - Main project/launch data
2. **clips** - Video clips submitted for projects
3. **contributors** - Network members contributing to projects
4. **votes** - User votes/upvotes on projects
5. **holders** - Token holders (key holders) from blockchain
6. **social_links** - Project social media links
7. **users** - User profiles with Twitter integration

## 🚀 How to Run the Setup

### Step 1: Get Your Appwrite API Key

1. Go to your Appwrite Console: https://cloud.appwrite.io
2. Navigate to your project
3. Go to **Settings** → **API Keys**
4. Create a new API key with **ALL** scopes/permissions
5. Copy the key

### Step 2: Add to Environment Variables

Add this to your `.env.local` file:

```env
# Appwrite Admin API Key (DO NOT COMMIT!)
APPWRITE_API_KEY=your_api_key_here

# Your existing Appwrite config
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
```

### Step 3: Run the Setup Script

```bash
npm run update-appwrite
```

This will:
- ✅ Create the database if it doesn't exist
- ✅ Create all 7 collections
- ✅ Add all attributes to each collection
- ✅ Create indexes for optimized queries
- ✅ Update existing collections with new attributes

## 📊 What Gets Created

### Projects Collection
Stores all ICM/CCM/MEME projects with:
- Basic info (title, subtitle, logo, ticker)
- Blockchain data (mintAddress, totalSupply)
- Social links (website, twitter, telegram, github)
- Creator info (with Twitter integration)
- Status and type tracking

### Clips Collection
Stores video clips for each project:
- Links to project
- Platform detection (Twitter, TikTok, YouTube, Instagram)
- View counting
- User attribution

### Contributors Collection
Network members contributing to projects:
- Twitter handle and avatar integration
- Role tracking
- Join date

### Votes Collection
Tracks user upvotes on projects:
- Unique constraint (one vote per user per project)
- Fast lookup via indexes

### Holders Collection
Token holders from blockchain:
- Wallet addresses
- Token amounts
- Last update tracking

### Social Links Collection
Dedicated social media links:
- Website, Twitter, Telegram, GitHub, Discord
- One record per project

### Users Collection
User profiles:
- Wallet address
- Display name and avatar
- Twitter verification
- Bio and role

## 🔧 Services Created

### 1. Solana Price Service (`lib/solana/price-service.ts`)
- Real-time price fetching from smart contracts
- 24h volume and price change calculation
- WebSocket subscriptions for live updates
- React hook: `useSolanaPrice(mintAddress)`

### 2. Unified Data Service (`lib/appwrite/unified-data-service.ts`)
- Complete CRUD operations
- Aggregated data fetching (clips, contributors, holders)
- Twitter avatar enhancement
- React hooks: `useProjectData()`, `useProjects()`

## 📝 Example Usage

### Fetch Project with All Data
```typescript
import { getDataService } from '@/lib/appwrite/unified-data-service'

const service = getDataService()
const project = await service.getProjectWithDetails('project-id')

// Returns:
// {
//   ...project data,
//   clips: [...],
//   clipViews: 1234,
//   contributors: [...],
//   keyHolders: [...],
//   contractPrice: 0.05,
//   priceChange24h: 15.5
// }
```

### Submit a Clip
```typescript
const clip = await service.submitClip({
  projectId: 'project-id',
  userId: 'user-id',
  clipUrl: 'https://twitter.com/...',
  title: 'Amazing launch!',
  description: 'This project is going to the moon!'
})
```

### Vote on Project
```typescript
const voted = await service.voteOnProject('project-id', 'user-id')
// Returns: true if voted, false if un-voted
```

### Get Projects with Filters
```typescript
const projects = await service.getProjects({
  type: 'icm',
  status: 'live',
  sortBy: 'trending',
  limit: 10
})
```

## 🎯 Data Flow

```
User Action → UnifiedCard/AdvancedTableViewBTDemo
    ↓
UnifiedDataService (Appwrite)
    ↓
Aggregate Data:
  - Clips → Total Views
  - Contributors → Twitter Avatars
  - Holders → Key Holder Count
    ↓
SolanaPriceService (Blockchain)
    ↓
Real-time Price Updates
    ↓
Display in UI
```

## ⚠️ Important Notes

1. **API Key Security**: Never commit your `APPWRITE_API_KEY` to git!
2. **Permissions**: The API key needs full database permissions to create collections
3. **Idempotent**: You can run the script multiple times safely - it won't duplicate data
4. **Updates**: Script automatically adds new attributes to existing collections

## 🔍 Troubleshooting

### Error: "Invalid API key"
- Check that `APPWRITE_API_KEY` is set in `.env.local`
- Ensure the key has full permissions

### Error: "Collection already exists"
- This is normal! The script updates existing collections
- Check the output for which attributes were added

### Error: "Database not found"
- The script will create it automatically
- Check your project ID is correct

## 📈 Next Steps

After setup:
1. ✅ Run the script: `npm run update-appwrite`
2. ✅ Verify in Appwrite console that all collections exist
3. ✅ Test by creating a project through the UI
4. ✅ Submit a clip and verify it appears
5. ✅ Check that votes work
6. ✅ Verify blockchain price integration

## 🎉 Production Ready!

Once setup is complete, your platform will have:
- ✅ Complete data persistence
- ✅ Real-time blockchain price updates
- ✅ Twitter integration for contributors
- ✅ Clip submission and tracking
- ✅ Vote counting
- ✅ Token holder tracking

All data connections are wired and ready for production use!
