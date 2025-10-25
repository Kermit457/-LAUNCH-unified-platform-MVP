# BLAST Network Hub - Master Implementation Plan

**Project:** Self-Running Deal Flow Hub with Key-Gated Access
**Status:** Ready to Ship
**Timeline:** 4 Weeks to MVP
**Team:** UX Designer + Backend Architect + Full-Stack Developer

---

## 🎯 Executive Summary

Transform the Network page into a **viral deal flow machine** where users earn by participating in 72h Deal Rooms. Every action burns/stakes keys → creates demand for your bonding curve.

### The Core Loop
```
Hold Keys → Access Tiers → Join Rooms → Match & Earn → Buy More Keys
```

### Key Metrics (Target Week 1)
- **100 rooms created**
- **500 applications**
- **1,000+ keys locked**
- **50 successful matches**

---

## 🔑 Key Tier System (Your Curve Keys)

| Tier | Keys Required | Access Level | Powers |
|------|---------------|--------------|--------|
| **Viewer** | 0 keys | Read-only | Browse, witness mode |
| **Contributor** | ≥1 key | Post & Apply | Create posts, apply to rooms, DM |
| **Curator** | ≥5 keys (7d stake) | Curate & Tag | Tag rooms, rank applicants, earn curator rewards |
| **Partner** | ≥25 keys | Open Rooms | Create 72h Deal Rooms, accept applicants |

**Integration:** Read key balance directly from your Solana bonding curve PDAs (no duplication of state).

---

## 📊 5 Post Types (Structured Cards)

### 1. **DEAL** - Intros & Partnerships
```typescript
{
  type: 'deal',
  title: 'Seed round intros (5 slots)',
  description: 'Looking for warm intros to 3 AI funds in SF...',
  slots: 5,
  filledSlots: 3,
  minKeysToApply: 1,
  entryDeposit: 1,
  deadline: '48h',
  tags: ['DeFi', 'Funding'],
  metadata: {
    stage: 'Pre-seed',
    ticketSize: '$500k-$2M',
    region: 'SF Bay Area'
  }
}
```

**Actions:** Apply | Refer | DM Founder

### 2. **AIRDROP** - Tasks & Rewards
```typescript
{
  type: 'airdrop',
  title: 'Motion Contributors S1',
  description: 'Complete tasks, earn points, claim rewards',
  totalSupply: 50000,
  perSlotReward: 1000,
  tasks: [
    { type: 'join_room', points: 100 },
    { type: 'clip_stream', points: 200 },
    { type: 'refer_2_holders', points: 500 }
  ],
  antiBot: {
    minWalletAge: '7d',
    socialVerify: true,
    quiz: true
  },
  progress: {
    claimed: 31200,
    remaining: 18800
  }
}
```

**Actions:** View Tasks | Claim | Open Room

### 3. **JOB/BOUNTY** - Paid Work
```typescript
{
  type: 'job',
  title: 'OBS Widget Dev (Sol/TS)',
  description: 'Build overlay widget for Solana key tracking',
  budget: 1200, // USDC
  currency: 'USDC',
  skills: ['Next.js 14', 'Tailwind', 'Socket events'],
  applicants: 19,
  accepted: 3,
  minKeysToApply: 1,
  escrow: {
    milestones: [
      { description: 'UI mockup', amount: 300 },
      { description: 'Working prototype', amount: 500 },
      { description: 'Final + docs', amount: 400 }
    ],
    dispute: true
  }
}
```

**Actions:** Apply | Ask | DM (Deposit)

### 4. **COLLAB** - Co-Create
```typescript
{
  type: 'collab',
  title: 'Co-host Launch Space',
  description: 'Need 2 CT hosts + 1 dev + 1 designer for joint launch',
  slots: 4,
  roles: ['CT Host', 'CT Host', 'Developer', 'Designer'],
  schedule: 'Sun 20:00 UTC',
  minKeysToJoin: 5,
  liveSignal: {
    holdersJoined: 12,
    watchers: 200
  }
}
```

**Actions:** Join Room | Co-Host | Buy Key

### 5. **FUNDING** - Pitch & Raise
```typescript
{
  type: 'funding',
  title: 'Raising $2M for AI x Crypto',
  description: 'Looking for angels & micro-VCs...',
  amount: '2M',
  stage: 'Seed',
  raised: '800k',
  investors: 8,
  minKeysToView: 5,
  minKeysToIntro: 10,
  pitchDeck: 'https://...',
  metrics: {
    revenue: '$50k MRR',
    growth: '+30% MoM',
    users: '10k'
  }
}
```

**Actions:** Intro | DM | Request Deck

---

## 🏗️ 72h Deal Room Architecture

### Room Lifecycle

```
┌─────────────────────────────────────────────┐
│  OPEN (72h timer starts)                    │
│  • Applicants deposit keys → queue         │
│  • Curators stake to tag/rank              │
│  • Founder reviews priority queue          │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────▼────────┐
         │ HOT (boosted)   │  ← 10+ holders join in 10min
         │ • Featured      │     OR Motion Score >90
         │ • 24h extension │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │ CLOSING (<6h)   │
         │ • "Final Call"  │
         │ • 2x Motion     │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │ CLOSED          │
         │ • Process       │
         │ • Refunds       │
         │ • Mint SBTs     │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │ ARCHIVED        │
         │ • Read-only     │
         │ • Shareable     │
         └─────────────────┘
```

### Key Deposits & Refunds

**Entry Deposit (Default: 1 key)**
- Locked on application
- **Refunded if:** activityCount ≥ 2 (sent message, reacted, etc.)
- **Forfeited if:** no-show + no activity
- Forfeit → 100% to vault (split: 50% curators, 50% rewards pool)

**Curator Bond (5-25 keys)**
- Staked for room duration
- **Slashed if:** mis-tag reported
- **Bonus if:** room successful (+10%)

**Priority Queue Formula:**
```typescript
priorityScore =
  (keysStaked × 10) +        // More keys = higher priority
  (motionScore × 2) +         // Reputation matters
  (activityBonus × 5) +       // Active in room
  (referralBonus × 3)         // Brought new holders
```

---

## 📈 Motion Score System (Exponential Decay)

### Formula
```typescript
Score(t) = Σ (weight_i × count_i × e^(-Δt_i / τ))

Where:
- weight_i = event importance (1-10)
- count_i = number of that event
- Δt_i = hours since event
- τ = decay constant (72 hours)
```

### Event Weights

| Event | Weight | Example |
|-------|--------|---------|
| Holder Growth | 10 | +2 new key holders |
| Room Success | 20 | Room filled with matches |
| Accepted Intro | 15 | Intro request accepted |
| Completed Bounty | 10 | Milestone approved |
| Curator Vote | 5 | Tagged/ranked rooms |
| Room Attendance | 3 | Joined room chat |
| DM Accepted | 5 | DM request accepted |
| Application Accepted | 8 | Accepted to room |
| Referrals | 6 | Referred new user |
| Watchtime | 2 | Watched room |

### Live Decay Display

```tsx
<MotionMeter userId={userId}>
  Current: 92
  ↓ -2 in 6h (decay)

  Breakdown:
  + Holder Growth: +12
  + Accepted Intros: +18
  + Room Success: +40
  - Decay (72h): -8
</MotionMeter>
```

---

## 💰 Viral Mechanics (24+ Levers)

### Top 10 Mechanics (Prioritized)

1. **Holder Ladder** (Tier gates)
   - 1 key → post/apply
   - 5 keys → curate
   - 25 keys → open rooms

2. **Raid Boost**
   - 10 holders click "Boost" in 10min → homepage feature
   - Each booster gets +5 Motion

3. **Key Streak Vault**
   - Daily action for 7 days → entry deposit + 10% bonus returned

4. **Witness-to-Speak**
   - 0-key viewers watch 5min → "Buy 1 key for 10min mic" offer

5. **Curator Draft**
   - Top 3 curators can "draft" one applicant (force-accept)
   - Once per room

6. **Flash Airdrop**
   - Room hits Motion 95 → instant micro-drop to all entrants

7. **Intro Bounty**
   - First accepted intro burns 0.02 key → winner badge

8. **Slot Snipe**
   - Last slot fills → 5min "Final Call" with 2x Motion weight

9. **Hall Pass**
   - 10 accepted DMs in 7 days → DM without deposit for 24h

10. **Bring-a-Builder**
    - Invite verified dev/designer → both get queue +2 and SBT

---

## 🗄️ Database Architecture

### 9 New Appwrite Collections

1. **BLAST_ROOMS** - 72h Deal Rooms
2. **BLAST_APPLICANTS** - Application queue
3. **BLAST_EVENTS** - Motion Score events
4. **BLAST_ESCROWS** - Milestone payments
5. **BLAST_DM_REQUESTS** - DM market
6. **BLAST_INTROS** - Smart matching
7. **BLAST_VAULT** - Key locking (off-chain tracking)
8. **BLAST_MOTION_SCORES** - Cached scores
9. **BLAST_CURATORS** - Curator performance

### Key Integration with Existing Systems

**Solana Keys (On-Chain):**
```typescript
// Read balance from bonding curve PDA
const keyHolderPda = getKeyHolderPDA(curvePda, userWallet)
const keyBalance = await connection.getAccountInfo(keyHolderPda)
// Parse key_balance field (u64)
```

**Vault (Off-Chain Tracking):**
```typescript
// Track locked keys in Appwrite
await BlastVaultService.lockKeysForRoom(
  userId,
  walletAddress,
  roomId,
  amount
)
// Verify on-chain balance before locking
```

**Chat System (Reuse):**
```tsx
// Use existing chat for room messages
<RoomChat
  channelId={`room:${roomId}`}
  readonly={tier === 'viewer'}
/>
```

---

## 🎨 UI/UX Design (BTDEMO Style)

### Main Layout (3 Columns)

```
┌──────────┬─────────────────────┬──────────┐
│          │                     │          │
│ FILTERS  │    MAIN FEED        │ MY PANEL │
│          │                     │          │
│ Type     │  [Room Card]        │ Stats    │
│ Tags     │  [Room Card]        │ Vault    │
│ Budget   │  [Room Card]        │ Rooms    │
│ Deadline │  [Room Card]        │ Applies  │
│ Tier     │  [Room Card]        │ Referral │
│ Sort     │  [Room Card]        │          │
│          │                     │          │
│          │  [Infinite Scroll]  │          │
│          │                     │          │
└──────────┴─────────────────────┴──────────┘
            [Composer FAB]
```

### Room Card Anatomy

```tsx
<RoomCard>
  <Header>
    <TypeBadge type="deal" />
    <MotionScore score={92} />
    <StatusBadge status="Hot Now" />
  </Header>

  <Title>Seed round intros (5 slots)</Title>
  <Creator>
    <Avatar />
    <Name>@founder</Name>
    <MotionScore score={85} />
  </Creator>

  <Description>Looking for warm intros...</Description>

  <Tags>
    <Tag>DeFi</Tag>
    <Tag>Funding</Tag>
  </Tags>

  <Metrics>
    <Slots>3 / 5 filled</Slots>
    <Countdown>48h remaining</Countdown>
    <Gate>≥1 key to apply</Gate>
  </Metrics>

  <Progress>
    <Bar filled={3} total={5} />
  </Progress>

  <Actions>
    <Button primary>Apply</Button>
    <Button>Refer</Button>
    <Button>DM (Deposit)</Button>
  </Actions>
</RoomCard>
```

### Always-On Composer (Bottom Fixed)

```tsx
<BlastComposer>
  <TypeSelector>
    <IconDeal /> Deal
    <IconAirdrop /> Airdrop
    <IconJob /> Job
    <IconCollab /> Collab
    <IconFunding /> Funding
  </TypeSelector>

  <Form type={selectedType}>
    {/* Dynamic form fields per type */}
  </Form>

  <TierPreview>
    This requires ≥1 key to post
  </TierPreview>

  <Actions>
    <Button secondary>Draft</Button>
    <Button primary>Post</Button>
  </Actions>
</BlastComposer>
```

### Modals Needed (10 Total)

1. **ApplyModal** - Submit application with key deposit
2. **DMRequestModal** - Compose DM + deposit
3. **IntroModal** - Request intro with matching
4. **KeyDepositModal** - Stake keys for curator bond
5. **VaultDrawer** - View locked keys & refunds
6. **BuyKeyModal** - Quick purchase flow (link to curve)
7. **EscrowModal** - Set up milestones for jobs
8. **ProfileDrawer** - Bio, skills, timezone, ref code
9. **ShareModal** - Twitter share cards
10. **NotificationDrawer** - Activity feed

### Mobile Layout

```
┌─────────────────────┐
│  [Top Nav]          │
├─────────────────────┤
│                     │
│  [Swipeable Cards]  │
│                     │
│  ← Reject  Approve →│
│                     │
├─────────────────────┤
│ [Bottom Tab Nav]    │
│ Feed | Rooms | + | Profile
└─────────────────────┘
```

---

## 🔌 API Architecture

### REST Endpoints (14 Routes)

**Room APIs:**
```
POST   /api/blast/rooms
GET    /api/blast/rooms?type=deal&tags=DeFi&limit=10
GET    /api/blast/rooms/:id
POST   /api/blast/rooms/:id/apply
POST   /api/blast/rooms/:id/curate
POST   /api/blast/rooms/:id/close
POST   /api/blast/rooms/:id/extend
```

**Applicant APIs:**
```
GET    /api/blast/rooms/:id/applicants
POST   /api/blast/rooms/:id/accept/:userId
POST   /api/blast/rooms/:id/reject/:userId
```

**Motion Score APIs:**
```
GET    /api/blast/motion/:userId
GET    /api/blast/leaderboard
```

**Vault APIs:**
```
GET    /api/blast/vault/me
GET    /api/blast/vault/locks
POST   /api/blast/vault/withdraw
```

**DM & Intro APIs:**
```
POST   /api/blast/dm/request
POST   /api/blast/dm/:id/accept
POST   /api/blast/intro/request
GET    /api/blast/intro/matches
```

### WebSocket Events (Real-Time)

```typescript
// Subscribe to room updates
ws.subscribe(`room:${id}:applicants`, (update) => {
  // Queue changed
})

ws.subscribe(`room:${id}:status`, (update) => {
  // Room state changed (open → hot → closing → closed)
})

ws.subscribe(`motion:leaderboard`, (update) => {
  // Motion scores updated
})

ws.subscribe(`vault:${userId}`, (update) => {
  // Keys locked/unlocked
})
```

---

## 🔐 Security & Anti-Abuse

### Rate Limits
- **Apply to room:** 10 per hour
- **Create room:** 3 per day (Partners only)
- **DM request:** 5 per day
- **Intro request:** 3 per day

### Sybil Resistance
- **Minimum key age:** 24h hold requirement
- **Wallet verification:** Privy external wallet required
- **IP clustering detection:** Flag >3 accounts from same IP
- **Behavioral patterns:** Shadow downrank low acceptance rates

### Deposit Safety
- **Verify on-chain balance** before locking
- **Atomic lock operations** (database + cache)
- **Automatic refunds** on room close (if activityCount ≥ 2)
- **Dispute resolution** for escrows (curator arbitration)

---

## 📂 Complete File Structure

```
app/
├── BLAST/
│   ├── page.tsx                      # Main feed
│   ├── layout.tsx                     # Layout + error boundary
│   ├── loading.tsx                    # Feed skeleton
│   └── room/
│       └── [id]/
│           ├── page.tsx               # Room interior
│           └── loading.tsx            # Room skeleton

components/
├── blast/
│   ├── cards/
│   │   ├── BaseRoomCard.tsx          # Base component
│   │   ├── DealCard.tsx              # Deal variant
│   │   ├── AirdropCard.tsx           # Airdrop variant
│   │   ├── JobCard.tsx               # Job variant
│   │   ├── CollabCard.tsx            # Collab variant
│   │   └── FundingCard.tsx           # Funding variant
│   ├── composer/
│   │   ├── BlastComposer.tsx         # Main composer
│   │   ├── PostTypeSelector.tsx      # Type picker
│   │   └── forms/
│   │       ├── DealForm.tsx
│   │       ├── AirdropForm.tsx
│   │       ├── JobForm.tsx
│   │       ├── CollabForm.tsx
│   │       └── FundingForm.tsx
│   ├── room/
│   │   ├── RoomHeader.tsx            # Timer + status
│   │   ├── ApplicantQueue.tsx        # Queue list
│   │   ├── RoomAgenda.tsx            # Details
│   │   ├── RoomActions.tsx           # Accept/reject
│   │   └── RoomChat.tsx              # Chat integration
│   ├── modals/
│   │   ├── ApplyModal.tsx
│   │   ├── DMRequestModal.tsx
│   │   ├── IntroModal.tsx
│   │   ├── KeyDepositModal.tsx
│   │   └── VaultDrawer.tsx
│   ├── filters/
│   │   ├── FilterSidebar.tsx
│   │   ├── TypeFilter.tsx
│   │   ├── TagFilter.tsx
│   │   └── TierFilter.tsx
│   ├── motion/
│   │   ├── MotionMeter.tsx
│   │   ├── MotionBreakdown.tsx
│   │   └── MotionLeaderboard.tsx
│   └── panels/
│       ├── MyPanel.tsx
│       ├── MyRooms.tsx
│       ├── MyApplications.tsx
│       └── VaultPanel.tsx

hooks/
├── blast/
│   ├── useKeyGate.ts                 # Core gating hook
│   ├── useRoomFeed.ts                # Infinite scroll
│   ├── useCreateRoom.ts              # Room creation
│   ├── useApplyToRoom.ts             # Application
│   ├── useRoomDetails.ts             # Single room
│   ├── useApplicantQueue.ts          # Queue
│   ├── useMotionScore.ts             # Motion calc
│   ├── useDMRequest.ts               # DM system
│   ├── useIntroRequest.ts            # Intros
│   ├── useVault.ts                   # Vault
│   └── useRoomSubscription.ts        # Real-time

lib/
├── appwrite/
│   └── services/
│       ├── blast-rooms.ts
│       ├── blast-applicants.ts
│       ├── blast-motion.ts
│       ├── blast-dm.ts
│       ├── blast-intro.ts
│       ├── blast-vault.ts
│       └── blast-analytics.ts
├── solana/
│   └── blast/
│       ├── getKeyBalance.ts          # Read on-chain
│       ├── getKeyHolders.ts          # Holders list
│       └── validateKeys.ts           # Verify ownership
├── validations/
│   └── blast.ts                      # Zod schemas
└── constants/
    └── blast.ts                      # Tier gates
```

---

## 📅 4-Week Implementation Roadmap

### Week 1: Backend Foundation
**Goal:** Set up database + APIs

- [x] Create 9 Appwrite collections
- [ ] Implement Room APIs (CRUD)
- [ ] Implement Vault API (lock/unlock keys)
- [ ] Build Motion Score calculation engine
- [ ] Set up WebSocket subscriptions
- [ ] Write API endpoint tests

**Deliverables:**
- Working API endpoints
- Database schema deployed
- Test coverage >80%

### Week 2: Core Frontend
**Goal:** Build main feed + room cards

- [ ] Build app/BLAST/page.tsx
- [ ] Create BaseRoomCard component
- [ ] Implement all 5 card variants
- [ ] Add useKeyGate hook (read on-chain)
- [ ] Build useRoomFeed (infinite scroll)
- [ ] Add FilterSidebar
- [ ] Create MyPanel stats

**Deliverables:**
- Functional feed page
- All card types rendered
- Key gating working
- Mobile responsive

### Week 3: Room Interior + Actions
**Goal:** Application flow + room management

- [ ] Build room/[id]/page.tsx
- [ ] Create ApplicantQueue component
- [ ] Implement ApplyModal with key deposit
- [ ] Build RoomActions (accept/reject)
- [ ] Add BlastComposer (all 5 forms)
- [ ] Integrate existing chat system
- [ ] Add real-time subscriptions

**Deliverables:**
- Working application flow
- Room creation functional
- Key deposits locking
- Real-time updates

### Week 4: Polish + Launch
**Goal:** Viral mechanics + production ready

- [ ] Add viral mechanics (raid boost, streak vault)
- [ ] Build Motion Score breakdown
- [ ] Create share cards for Twitter
- [ ] Add DM Request market
- [ ] Implement Smart Matching
- [ ] Load testing (1000 concurrent)
- [ ] Security audit
- [ ] Beta launch with 50 users

**Deliverables:**
- Production-ready BLAST
- 100+ test rooms
- Full viral mechanics
- Public beta

---

## 🎯 Success Metrics

### Week 1 Targets
- 50 rooms created
- 200 applications
- 500 keys locked
- 25 successful matches

### Month 1 Targets
- 500 active rooms
- 2,000 applications
- 5,000 keys locked
- 200 successful matches
- 100 repeat users

### Quarter 1 Targets
- 2,000 rooms created
- 10,000 applications
- 25,000 keys locked
- 1,000 matches
- 500 DAU
- 20% match rate

---

## 🚀 Launch Strategy

### Phase 1: Stealth Beta (Week 1)
- Invite-only: 25 key holders
- Discord announcement
- Collect feedback

### Phase 2: Public Beta (Week 2-3)
- Open to all Contributor+ (≥1 key)
- Twitter announcement
- "Early Curator" SBT rewards

### Phase 3: Full Launch (Week 4)
- Feature on homepage
- Replace old Network page
- Press release
- Influencer campaign

---

## 💡 Key Insights

### Why This Works

1. **Keys = Access** → Every feature requires keys → drives curve demand
2. **72h Urgency** → FOMO on room deadlines → high activity
3. **Priority Queue** → More keys = better placement → incentive to hold
4. **Motion Score** → Reputation drives opportunity → incentive to participate
5. **Deposits & Refunds** → Skin in the game → quality applications
6. **Viral Mechanics** → Raid boosts, streaks, drafts → organic growth

### Why It's Different

- **NOT a job board** (fixed 72h windows create urgency)
- **NOT a DAO** (curators guide, founders decide)
- **NOT free-for-all** (key gates filter quality)
- **NOT passive** (deposits + Motion Score reward activity)

### What Makes It Addictive

- **Countdown timers** (last-minute applications)
- **Live leaderboards** (Motion Score competition)
- **Slot snipe** (last slot = 2x points)
- **Hot Now** (raid boost = homepage feature)
- **Priority queue** (more keys = better placement)
- **Witness mode** (0-key viewers see FOMO)

---

## 🔗 Integration with Existing Systems

### Bonding Curve Keys
```typescript
// Read on-chain balance
const keyBalance = await getKeyBalance(userWallet, curvePda)

// Determine tier
const tier = keyBalance >= 25 ? 'partner' :
             keyBalance >= 5 ? 'curator' :
             keyBalance >= 1 ? 'contributor' : 'viewer'
```

### Chat System
```tsx
// Reuse existing chat for rooms
<RoomChat
  channelId={`blast:room:${roomId}`}
  tierGate="contributor"
/>
```

### Motion Score
```tsx
// Extend existing component
<MotionScore
  score={motionScore.current}
  breakdown={motionScore.signals}
  decay={motionScore.decay}
/>
```

### Escrow (Jobs)
```typescript
// Use existing escrow program for milestones
await createEscrowForJob(jobId, milestones, budget)
```

---

## 📋 Next Steps (Immediate)

1. **Review this plan** - Confirm approach and priorities
2. **Create Appwrite collections** - 9 collections (30 min)
3. **Build useKeyGate hook** - Read on-chain keys (1 hour)
4. **Implement Room APIs** - CRUD operations (4 hours)
5. **Build app/BLAST/page.tsx** - Main feed (4 hours)
6. **Create DealCard component** - First card variant (2 hours)

**Today's goal:** Have a working feed with mock data and key gating.

---

## ❓ Questions for Product Review

1. **Entry Deposit:** 1 key minimum or lower barrier (0.5 keys)?
2. **Room Duration:** Fixed 72h or allow 24h/48h/72h options?
3. **Curator Rewards:** Fixed pool or % of deposits?
4. **DM Market:** 0.02 key deposit or higher/lower?
5. **Voice Chat:** Text-only first or integrate voice (Agora/Daily)?

---

**Status:** Complete Design - Ready to Build
**Confidence:** 98%
**Risk:** Complexity (mitigated by phased rollout)
**Opportunity:** 10x engagement on network page

Let's ship BLAST! 🚀🔥
