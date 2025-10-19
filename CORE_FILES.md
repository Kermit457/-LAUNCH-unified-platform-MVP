# LaunchOS - Core Files Reference

**Last Updated:** 2025-10-19
**Purpose:** Quick reference for essential files after cleanup

---

## Critical Configuration Files

### Authentication & Wallets
- `contexts/PrivyProviderWrapper.tsx` - **CRITICAL** Privy + Solana RPC configuration
- `contexts/WalletContext.tsx` - Wallet state management
- `contexts/AuthContext.tsx` - Authentication state

### Solana Integration
- `lib/solana/config.ts` - RPC endpoints & network config
- `lib/solana/program.ts` - Program client & IDL loader
- `lib/solana/v6-curve-service.ts` - V6 curve business logic
- `lib/solana/create-curve.ts` - On-chain curve creation
- `lib/solana/instructions.ts` - Transaction builders
- `lib/solana/privyWalletAdapter.ts` - Privy wallet adapter

### Appwrite Backend
- `lib/appwrite/client.ts` - Client init + collection IDs
- `lib/appwrite/server.ts` - Server-side client
- `lib/appwrite/services/` - 20+ service modules

---

## Essential Hooks

### Authentication & Sync
- `hooks/useUser.ts` - Get current Privy user
- `hooks/useSyncPrivyToAppwrite.ts` - **ONBOARDING** Privy → Appwrite → Curve creation

### Solana Transactions
- `hooks/useCreateCurve.ts` - Create curves via Privy wallet
- `hooks/useSolanaBuyKeys.ts` - Buy transaction signing
- `hooks/useSolanaSellKeys.ts` - Sell transaction signing
- `hooks/usePrivySolanaTransaction.ts` - Generic transaction signer

### Data Fetching
- `hooks/useCurve.ts` - Fetch curve data from Appwrite
- `hooks/useCurveData.ts` - Curve analytics & metrics
- `hooks/useBuyKeys.ts` - Buy UI state management

---

## Core Pages (Main Navigation)

### Public Pages
- `app/page.tsx` - Landing page
- `app/discover/page.tsx` - **HOME** Browse all curves
- `app/launch/page.tsx` - Create new curves
- `app/launch/[id]/page.tsx` - Curve detail & trading
- `app/earn/page.tsx` - Campaigns & rewards
- `app/live/page.tsx` - Live streams & events
- `app/network/page.tsx` - Social graph

### Dashboard Pages
- `app/dashboard/page.tsx` - Main dashboard
- `app/dashboard/analytics/page.tsx` - Analytics
- `app/dashboard/campaigns/page.tsx` - Campaign management
- `app/dashboard/earnings/page.tsx` - Earnings tracking
- `app/dashboard/network/page.tsx` - Network stats
- `app/dashboard/profile/page.tsx` - Profile settings
- `app/dashboard/settings/page.tsx` - Account settings
- `app/dashboard/submissions/page.tsx` - Submission tracking

---

## Essential Components

### Navigation & Layout
- `components/TopNav.tsx` - Main navigation bar (wallet connect)
- `components/PrivySyncWrapper.tsx` - Syncs Privy user data

### Curve Display
- `components/UnifiedCard.tsx` - Curve card component
- `components/AdvancedTableView.tsx` - Table view for curves
- `components/BuyKeysButton.tsx` - Buy action button

### Design System
- `components/design-system/` - Reusable UI components
  - `GlassCard.tsx` - Glass morphism cards
  - `PremiumButton.tsx` - Styled buttons
  - `GradientText.tsx` - Gradient text effects
  - `AnimatedCounter.tsx` - Number animations
  - `StatusBadge.tsx` - Status indicators

---

## API Routes (Active)

### Curve Operations
- `app/api/curve/create/route.ts` - Create curve
- `app/api/curve/[id]/route.ts` - Get curve details
- `app/api/curve/[id]/buy/route.ts` - Buy keys
- `app/api/curve/[id]/sell/route.ts` - Sell keys
- `app/api/curve/[id]/freeze/route.ts` - Freeze curve
- `app/api/curve/[id]/launch/route.ts` - Launch to Pump.fun
- `app/api/curve/list/route.ts` - List all curves
- `app/api/curve/owner/route.ts` - Get user's curves

### Other Features
- `app/api/launches/route.ts` - Launches list
- `app/api/campaigns/route.ts` - Campaigns CRUD
- `app/api/referral/rewards/route.ts` - Referral tracking

---

## Solana Program (Smart Contracts)

### Program Files
- `solana-program/programs/launchos-curve/src/lib.rs` - Main program
- `solana-program/programs/launchos-curve/src/math_v6.rs` - V6 math logic
- `solana-program/Anchor.toml` - Anchor configuration
- `solana-program/target/idl/launchos_curve.json` - Generated IDL

### Deployed Contract
- **Program ID:** `Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF`
- **Network:** Devnet
- **Status:** Active & tested

---

## Scripts (Remaining)

### Active Scripts
- `scripts/working-launch.mjs` - Pump.fun token launch (PumpPortal)
- `scripts/working-launch-with-image.mjs` - Launch with custom image
- `scripts/calculate-discriminator.js` - Anchor discriminator helper
- `scripts/COMPLETE-APPWRITE-SETUP.md` - Appwrite setup guide

### Archived Scripts
- `archive/scripts/` - One-time setup & migration scripts (~80+ files)

---

## Environment Variables Required

```env
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=cmfsej8w7013cle0df5ottcj6
PRIVY_APP_SECRET=...

# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com

# Appwrite Backend
NEXT_PUBLIC_APPWRITE_ENDPOINT=...
NEXT_PUBLIC_APPWRITE_PROJECT_ID=...
APPWRITE_API_KEY=...

# Collection IDs (20+ Appwrite collections)
NEXT_PUBLIC_USERS_COLLECTION_ID=...
NEXT_PUBLIC_CURVES_COLLECTION_ID=...
NEXT_PUBLIC_CURVE_EVENTS_COLLECTION_ID=...
# ... (see lib/appwrite/client.ts for full list)
```

---

## Build & Deploy Commands

### Frontend
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server
```

### Solana Program
```powershell
cd solana-program
anchor build             # Build Rust program
anchor deploy            # Deploy to devnet
.\copy-idl.ps1          # Copy IDL to frontend
```

---

## Critical Flows

### 1. User Onboarding
1. User logs in with Privy (Twitter/Email)
2. Privy auto-creates embedded Solana wallet
3. `useSyncPrivyToAppwrite` syncs user to Appwrite
4. On-chain curve account created for user

### 2. Buy Transaction
1. User clicks "Buy" on a curve
2. `useSolanaBuyKeys` hook called
3. Transaction built with V6 math
4. Privy wallet signs transaction
5. Event logged to Appwrite `curve_events`
6. Holder position updated in `curve_holders`

### 3. Launch to Pump.fun
1. Curve reaches freeze threshold
2. `scripts/working-launch.mjs` called
3. Token launched via PumpPortal API
4. Metadata uploaded to IPFS
5. Launch recorded in Appwrite

---

## Mock Data Files (Dev Only)

These files are used for development/testing:

- `lib/dashboardMockData.ts` - Dashboard mock data
- `lib/livePitchMockData.ts` - Live page mock data
- `lib/unifiedMockData.ts` - Unified card mock data
- `lib/advancedTradingData.ts` - Trading view mock data

**Note:** Replace with real Appwrite queries in production.

---

## What Was Removed

### Deleted During Cleanup (2025-10-19)
- `app/api/predictions.unused/` - Unused prediction market features
- `app/api/social.unused/` - Unused social features
- `app/test-*/` - Test pages (~10 directories)
- `app/design-test/` - Design system demos
- `components/NavBar.tsx` - Duplicate of TopNav
- `app/live/page.tsx.backup` - Backup file
- `scripts/` - ~80 one-time setup scripts (moved to archive/)

---

## Quick Troubleshooting

### CSP Error (eval blocked)
- Check `next.config.js` has `unsafe-eval` in dev CSP

### RPC Error (No config for solana:devnet)
- Verify `PrivyProviderWrapper.tsx` has `solana.rpcs` configured

### Chunk Loading Failed
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run build`

### Transaction Signing Failed
- Ensure Privy wallet is connected
- Check `chain` parameter in transaction call
- Verify RPC endpoint is responsive

---

## Documentation Index

- `README.md` - Project overview
- `DOCS_INDEX.md` - All documentation links
- `PRIVY_SOLANA_CONFIG_REFERENCE.md` - Privy configuration
- `SOLANA_ARCHITECTURE_V3_FINAL.md` - Smart contract architecture
- `CURVE_SYSTEM_EXPLAINER.md` - Bonding curve mechanics
- `INTEGRATION_GUIDE.md` - Frontend integration
- `BUILD_AND_TEST_GUIDE.md` - Testing procedures
- `IMPORTANT_PROJECT_INFO.md` - Deployment info

---

**Status:** Production-ready
**Last Verified:** 2025-10-19
**Program ID:** Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
