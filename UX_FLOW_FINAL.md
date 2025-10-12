# 🎯 LaunchOS UX Flow - Final Implementation

## User Journey Map

### 🚀 New User Arrival

```
User lands on LaunchOS
  ↓
┌─────────────────────────────────────┐
│  🏠 Landing Page                    │
│                                     │
│  "The First Bot-Proof             │
│   Bonding Curves"                   │
│                                     │
│  [🐦 Sign in with Twitter]         │
│         (Primary CTA)               │
│                                     │
│  [Browse First] (Secondary)         │
└─────────────────────────────────────┘
```

---

## Flow 1: User Signs In with Twitter

### Step 1: Twitter OAuth
```
User clicks "Sign in with Twitter"
  ↓
Twitter OAuth popup opens
  ↓
User authorizes LaunchOS
  ↓
Callback returns:
  - Twitter username
  - Twitter ID
  - Avatar
  - Follower count
  - Verified status
  ↓
User profile created in database
```

### Step 2: User Dashboard
```
✅ Signed in as @username
✅ Twitter verified badge shown
✅ Can now create curves

Dashboard shows:
[Create My Curve] button
[Create Project] button
[Browse Curves] tab
```

---

## Flow 2: User SKIPS Twitter Sign-In

### Limited Access Mode
```
User clicks "Browse First"
  ↓
Can view:
  ✅ Discover feed
  ✅ Trending curves
  ✅ Public profiles

Cannot:
  ❌ Create curve
  ❌ Buy keys
  ❌ Create project

Navbar shows:
┌─────────────────────────────────────┐
│  🔗 Connect Twitter to Get Started  │
│     [Connect Now]                   │
└─────────────────────────────────────┘

When user clicks anything that requires auth:
→ Twitter sign-in modal pops up
```

---

## Flow 3: Create Personal Curve (User Profile)

### Prerequisites Check
```
if (!user.twitterConnected) {
  → Show: "Connect Twitter first" modal
  → Button: "Sign in with Twitter"
  → After auth: return to curve creation
}
```

### Step 1: Welcome Screen
```
┌─────────────────────────────────────┐
│  Create Your Profile Curve          │
│                                     │
│  Your keys = Your influence         │
│                                     │
│  ✅ Twitter verified                │
│  ✅ Anti-bot protected              │
│  ✅ Fair launch guaranteed          │
│                                     │
│  [Get Started →]                    │
└─────────────────────────────────────┘
```

### Step 2: Curve Settings
```
┌─────────────────────────────────────┐
│  Set Your Key Pricing               │
│                                     │
│  Starting Price:                    │
│  [$0.10] SOL per key               │
│                                     │
│  Price Increase:                    │
│  [$0.001] SOL per key              │
│                                     │
│  Preview:                           │
│  Key #1:  $0.10                    │
│  Key #10: $0.19                    │
│  Key #50: $0.55                    │
│                                     │
│  [Continue →]                       │
└─────────────────────────────────────┘
```

### Step 3: Initial Purchase (REQUIRED)
```
┌─────────────────────────────────────┐
│  Buy Your First Keys                │
│                                     │
│  🛡️ Anti-Sniper Protection          │
│                                     │
│  You must buy at least 10 keys to  │
│  prevent bots from sniping your     │
│  launch.                            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Amount: 10 keys               │ │
│  │ Cost: 1.45 SOL               │ │
│  │ Lock: 7 days 🔒               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Your keys will be locked for 7     │
│  days. This shows commitment and    │
│  prevents dumping.                  │
│                                     │
│  [Buy 10 Keys (1.45 SOL) →]        │
└─────────────────────────────────────┘
```

### Step 4: Confirmation
```
┌─────────────────────────────────────┐
│  ✅ Profile Created!                │
│                                     │
│  Your curve is ready but private.   │
│                                     │
│  Stats:                             │
│  • You own: 10 keys 🔒              │
│  • Current price: 0.11 SOL          │
│  • Status: Private                  │
│                                     │
│  [Make Public & Go Live] →          │
│  [Edit Settings]                    │
└─────────────────────────────────────┘
```

### Step 5: Activation
```
User clicks "Make Public & Go Live"
  ↓
Confirmation modal:
┌─────────────────────────────────────┐
│  Ready to Launch?                   │
│                                     │
│  Once activated:                    │
│  ✅ Anyone can buy your keys        │
│  ✅ Your profile appears in feed    │
│  ✅ Trading is live immediately     │
│  ⚠️ Cannot undo                     │
│                                     │
│  [Cancel] [🚀 Launch Now]           │
└─────────────────────────────────────┘

After confirmation:
  ✅ Status: ACTIVE
  ✅ Visible in discover feed
  ✅ Public can buy keys
  ✅ Creator's 10 keys still locked
```

---

## Flow 4: Create Project (ICO/Token Launch)

### Prerequisites Check
```
if (!user.twitterConnected) {
  → Show: "Connect Twitter first" modal
}
```

### Step 1: Project Type Selection
```
┌─────────────────────────────────────┐
│  What are you launching?            │
│                                     │
│  ⚪ Personal Profile                │
│     (Influencer, creator curve)     │
│                                     │
│  🔘 Project/Token Launch            │
│     (ICO, IDO, Product hunt)        │
│                                     │
│  [Continue →]                       │
└─────────────────────────────────────┘
```

### Step 2: Project Details
```
┌─────────────────────────────────────┐
│  Project Information                │
│                                     │
│  Name: [________________]           │
│  Symbol: [____] (e.g., LAUNCH)     │
│  Description: [____________]        │
│                                     │
│  Links:                             │
│  Twitter: [____________]            │
│  Website: [____________]            │
│  Whitepaper: [____________]         │
│                                     │
│  Logo: [Upload]                     │
│                                     │
│  [Continue →]                       │
└─────────────────────────────────────┘
```

### Step 3: Curve Configuration
```
┌─────────────────────────────────────┐
│  Bonding Curve Setup                │
│                                     │
│  Starting Price:                    │
│  [$0.50] SOL per key               │
│                                     │
│  Price Increase:                    │
│  [$0.005] SOL per key              │
│                                     │
│  Launch Target:                     │
│  [1000] keys total supply          │
│                                     │
│  Preview:                           │
│  Key #1:    $0.50                  │
│  Key #100:  $1.00                  │
│  Key #1000: $5.50                  │
│                                     │
│  [Continue →]                       │
└─────────────────────────────────────┘
```

### Step 4: Initial Purchase (ASK UPFRONT!) ⭐
```
┌─────────────────────────────────────┐
│  How many keys will you buy?        │
│                                     │
│  💡 Buying keys upfront:             │
│  • Shows commitment to your project │
│  • Prevents bot sniping             │
│  • Builds trust with community      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  [====●=======] 50 keys       │ │
│  │   10      50      100         │ │
│  └───────────────────────────────┘ │
│                                     │
│  Selected: 50 keys                  │
│  Cost: 12.5 SOL                    │
│  Lock: 7 days 🔒                    │
│                                     │
│  Signal Strength: ⭐⭐⭐⭐           │
│  Bot Protection: Strong             │
│                                     │
│  [Buy 50 Keys & Create Project]     │
└─────────────────────────────────────┘
```

**Key Point:** This step happens BEFORE project is created, not after!

### Step 5: Review & Confirm
```
┌─────────────────────────────────────┐
│  Review Your Project Launch         │
│                                     │
│  Project: MyToken ($MTK)            │
│  Starting Price: 0.50 SOL           │
│  Your Purchase: 50 keys             │
│  Your Cost: 12.5 SOL                │
│  Lock Period: 7 days                │
│                                     │
│  Timeline:                          │
│  1. Create project (private)        │
│  2. You buy 50 keys                 │
│  3. Build hype (tweet, discord)     │
│  4. Launch public trading           │
│                                     │
│  [Back] [Create & Purchase →]       │
└─────────────────────────────────────┘
```

### Step 6: Processing
```
Transaction flow:
1. Create project curve (status: PENDING)
2. Execute initial buy (50 keys)
3. Lock keys for 7 days
4. Update project status
5. Show success screen
```

### Step 7: Pre-Launch Dashboard
```
┌─────────────────────────────────────┐
│  🎉 Project Created!                │
│                                     │
│  MyToken ($MTK)                     │
│  Status: Private (Pre-launch)       │
│                                     │
│  Your Position:                     │
│  • Keys: 50 (locked 🔒)             │
│  • Invested: 12.5 SOL               │
│  • Lock until: Jan 19, 2025         │
│                                     │
│  Next Steps:                        │
│  1. ✅ Share on Twitter             │
│  2. ✅ Promote in Discord           │
│  3. ✅ Build hype                   │
│  4. ⏳ Launch when ready            │
│                                     │
│  [Share Project] [Launch Trading →] │
└─────────────────────────────────────┘
```

### Step 8: Launch Trading
```
User clicks "Launch Trading"
  ↓
Confirmation:
┌─────────────────────────────────────┐
│  Ready to Launch Public Trading?    │
│                                     │
│  ⚠️ Once launched:                  │
│  • Anyone can buy keys              │
│  • Project visible to all           │
│  • Trading starts immediately       │
│  • Cannot be reversed               │
│                                     │
│  Make sure you've:                  │
│  ✅ Announced on Twitter            │
│  ✅ Updated Discord                 │
│  ✅ Posted to community             │
│                                     │
│  [Cancel] [🚀 Launch Now]           │
└─────────────────────────────────────┘

After launch:
  ✅ Status: ACTIVE
  ✅ Public trading live
  ✅ Appears in discover feed
  ✅ Creator's 50 keys still locked
```

---

## Navbar States

### Not Signed In
```
┌─────────────────────────────────────┐
│  🏠 LaunchOS  [Discover] [About]    │
│                                     │
│           [🐦 Sign in with Twitter] │
└─────────────────────────────────────┘
```

### Signed In (Twitter Connected)
```
┌─────────────────────────────────────┐
│  🏠 LaunchOS  [Discover] [Create]   │
│                                     │
│  [@username ✅] [Wallet] [Profile]  │
└─────────────────────────────────────┘
```

### Signed In (Twitter NOT Connected)
```
┌─────────────────────────────────────┐
│  🏠 LaunchOS  [Discover]             │
│                                     │
│  ⚠️ Connect Twitter to Create        │
│     [🔗 Connect Now]                │
│                                     │
│  [Wallet] [Profile]                 │
└─────────────────────────────────────┘
```

---

## Database Schema Updates

### User Model
```typescript
interface User {
  id: string;

  // Twitter
  twitterConnected: boolean;
  twitterId?: string;
  twitterUsername?: string;
  twitterAvatar?: string;
  twitterFollowers?: number;
  twitterVerified?: boolean;

  // Wallet
  walletAddress?: string;

  // Curve
  hasCurve: boolean;
  curveId?: string;

  createdAt: Date;
}
```

### Curve Model
```typescript
interface Curve {
  id: string;
  curveType: 'user' | 'project';

  // Owner
  ownerId: string;
  ownerTwitter: string;

  // Status
  status: 'pending' | 'active' | 'frozen' | 'launched';
  visibility: 'private' | 'public';

  // Initial Buy
  creatorInitialKeys: number;
  creatorKeysLockedUntil: Date;
  minCreatorBuy: number;  // Default: 10 for users, customizable for projects

  // Pricing
  basePrice: number;
  slope: number;
  supply: number;

  // Timestamps
  createdAt: Date;
  activatedAt?: Date;

  // Project specific
  projectName?: string;
  projectSymbol?: string;
  projectDescription?: string;
  projectLinks?: {
    twitter?: string;
    website?: string;
    whitepaper?: string;
  };
}
```

---

## API Endpoints

### Authentication
```
POST /api/auth/twitter
  → Initiates Twitter OAuth

GET /api/auth/twitter/callback
  → Handles OAuth callback

POST /api/auth/connect-twitter
  → Connects Twitter to existing account
```

### Curve Creation
```
POST /api/curve/create-user
  Body: {
    basePrice: number,
    slope: number,
    initialKeys: number  // Default: 10
  }

POST /api/curve/create-project
  Body: {
    projectName: string,
    projectSymbol: string,
    basePrice: number,
    slope: number,
    initialKeys: number,  // User chooses: 10-100
    ...projectDetails
  }

POST /api/curve/:id/activate
  → Makes curve public
```

---

## Frontend Components

### Key Components Needed

```
components/
├── auth/
│   ├── TwitterSignInButton.tsx
│   ├── TwitterSignInModal.tsx
│   └── TwitterConnectBanner.tsx (navbar)
│
├── curve/
│   ├── CreateUserCurveFlow.tsx
│   ├── CreateProjectCurveFlow.tsx
│   ├── InitialPurchaseStep.tsx ⭐ (key component!)
│   ├── CurveActivationModal.tsx
│   └── CurveStatusBadge.tsx
│
└── project/
    ├── ProjectDetailsForm.tsx
    ├── ProjectKeysPurchaseSlider.tsx ⭐
    └── ProjectPreLaunchDashboard.tsx
```

---

## Key User Actions Summary

| Action | Twitter Required? | Initial Buy Required? |
|--------|------------------|----------------------|
| Browse curves | ❌ No | ❌ No |
| View profiles | ❌ No | ❌ No |
| Create user curve | ✅ Yes | ✅ Yes (10 keys) |
| Create project | ✅ Yes | ✅ Yes (10-100 keys) |
| Buy keys | ✅ Yes | ❌ No |
| Activate curve | ✅ Yes (owner) | ✅ Must buy first |

---

## Implementation Checklist

### Phase 1: Auth Flow
- [ ] Twitter OAuth integration
- [ ] Sign in modal
- [ ] Skip/browse mode
- [ ] Navbar Twitter banner
- [ ] Twitter verification badge

### Phase 2: User Curve Creation
- [ ] Create curve form
- [ ] Initial purchase step (10 keys)
- [ ] Key lock mechanism
- [ ] Activation flow
- [ ] Success dashboard

### Phase 3: Project Curve Creation
- [ ] Project details form
- [ ] **Keys purchase slider (10-100)** ⭐
- [ ] Pre-launch dashboard
- [ ] Hype building tools
- [ ] Public launch button

### Phase 4: Smart Contract
- [ ] Pending status implementation
- [ ] Initial buy with lock
- [ ] Activation instruction
- [ ] Twitter verification on-chain (optional)

---

This is the complete UX flow! The key innovation is **asking upfront** how many keys the project creator wants to buy, making it part of the creation process itself.

Ready to implement? 🚀
