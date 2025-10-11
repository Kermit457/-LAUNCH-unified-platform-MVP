# Unified Solana Payment Service Architecture

## 🎯 Vision

**One Solana backend service powers ALL payments across LaunchOS:**
- 💎 Bonding Curve Trading (buy/sell keys)
- 🎁 Escrow Payments (quests, bounties, milestones)
- 🚀 Token Launches (via Pump.fun)
- 💰 Referral Payouts
- 🏦 Platform Fee Collection

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           LaunchOS Frontend (Next.js)               │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Curves  │  │  Quests  │  │ Bounties │  ...    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
└───────┼─────────────┼─────────────┼────────────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │  Unified Solana Service   │
        │  (lib/solana/service.ts)  │
        │                           │
        │  - Wallet Management      │
        │  - Transaction Builder    │
        │  - Escrow Handling        │
        │  - Curve Trading          │
        │  - Token Operations       │
        │  - Fee Distribution       │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │   Solana Program (Rust)   │
        │                           │
        │  Instructions:            │
        │  - create_escrow          │
        │  - release_payment        │
        │  - buy_keys               │
        │  - sell_keys              │
        │  - launch_token           │
        │  - distribute_fees        │
        └───────────────────────────┘
                      │
                      ▼
              Solana Blockchain
```

---

## 📦 Service Structure

### Core Service: `SolanaPaymentService`

```typescript
// lib/solana/payment-service.ts

export class SolanaPaymentService {
  private connection: Connection
  private program: Program<LaunchOSProgram>

  // === ESCROW OPERATIONS ===

  /**
   * Create escrow for a quest/bounty/project
   */
  async createEscrow(params: {
    type: 'quest' | 'bounty' | 'project_milestone'
    entityId: string
    amount: number // SOL
    recipients: {
      wallet: string
      percentage: number
    }[]
    releaseConditions: {
      requiresApproval: boolean
      approvers?: string[]
      deadline?: Date
    }
  }): Promise<EscrowResult>

  /**
   * Release escrow payment
   */
  async releaseEscrow(params: {
    escrowId: string
    approverSignature?: string
  }): Promise<TransactionResult>

  /**
   * Cancel and refund escrow
   */
  async cancelEscrow(params: {
    escrowId: string
    reason: string
  }): Promise<TransactionResult>

  // === CURVE TRADING ===

  /**
   * Buy keys on bonding curve
   */
  async buyKeys(params: {
    curveId: string
    solAmount: number
    referrer?: string
  }): Promise<TradeResult>

  /**
   * Sell keys on bonding curve
   */
  async sellKeys(params: {
    curveId: string
    keysAmount: number
  }): Promise<TradeResult>

  // === TOKEN OPERATIONS ===

  /**
   * Launch curve to Pump.fun
   */
  async launchToPumpFun(params: {
    curveId: string
    tokenMetadata: {
      name: string
      symbol: string
      image: string
    }
  }): Promise<LaunchResult>

  // === FEE DISTRIBUTION ===

  /**
   * Distribute platform fees to stakeholders
   */
  async distributeFees(params: {
    feePool: string
    distribution: {
      platform: number
      referrals: number
      treasury: number
    }
  }): Promise<TransactionResult>
}
```

---

## 🎨 UI Component Architecture

### Unified Payment Modal System

All payment operations use the **same modal system** with different configurations:

```typescript
// components/payments/UnifiedPaymentModal.tsx

interface PaymentModalProps {
  mode: 'escrow' | 'trade' | 'launch'
  config: EscrowConfig | TradeConfig | LaunchConfig
  onSuccess: (result: PaymentResult) => void
  onClose: () => void
}

// Examples:

// 1. Escrow for Quest Reward
<UnifiedPaymentModal
  mode="escrow"
  config={{
    title: "Fund Quest Reward",
    amount: 5.0,
    recipient: "Quest Winner",
    releaseCondition: "Upon completion verification"
  }}
/>

// 2. Buy Curve Keys
<UnifiedPaymentModal
  mode="trade"
  config={{
    title: "Buy Alpha Keys",
    entity: "Solidity Dev",
    action: "buy",
    amount: 1.0
  }}
/>

// 3. Launch Token
<UnifiedPaymentModal
  mode="launch"
  config={{
    title: "Launch to Pump.fun",
    curve: curveData,
    tokenName: "PROJECT",
    initialLiquidity: 10.0
  }}
/>
```

### Component Hierarchy:

```
UnifiedPaymentModal
  ├─ PaymentHeader (title, close)
  ├─ WalletConnect (Privy integration)
  ├─ PaymentDetails (amount, fees, breakdown)
  ├─ TransactionStatus (pending, confirmed, failed)
  ├─ ActionButtons (confirm, cancel)
  └─ SuccessAnimation (confetti, checkmark)
```

---

## 🔧 Implementation Phases

### Phase 1: Escrow UI Components (Week 1)
Build the UI layer first - no blockchain yet!

**Components to Create:**
1. ✅ `EscrowPaymentModal` - For funding quests/bounties
2. ✅ `EscrowStatusCard` - Track escrow status
3. ✅ `EscrowReleaseModal` - Approve payment release
4. ✅ `PaymentHistory` - Show all transactions

**User Flows:**
- Create Quest → Fund with Escrow
- Complete Quest → Creator approves release
- View escrow status (pending, released, canceled)
- Transaction history with Solana explorer links

### Phase 2: Solana Service Foundation (Week 2)
Build the TypeScript service layer

**Files to Create:**
1. `lib/solana/connection.ts` - RPC connection
2. `lib/solana/payment-service.ts` - Main service class
3. `lib/solana/transaction-builder.ts` - Build transactions
4. `lib/solana/types.ts` - Shared types
5. `hooks/useSolanaPayment.ts` - React hook for payments

**Mock Mode:**
- Service works in "mock mode" first
- Returns simulated transactions
- Allows UI testing without blockchain

### Phase 3: Solana Program (Week 3-4)
Build the actual smart contract

**Program Structure:**
```rust
programs/
  └─ launchos_payments/
      ├─ src/
      │   ├─ lib.rs (entry point)
      │   ├─ instructions/
      │   │   ├─ escrow/
      │   │   │   ├─ create.rs
      │   │   │   ├─ release.rs
      │   │   │   └─ cancel.rs
      │   │   ├─ curve/
      │   │   │   ├─ buy.rs
      │   │   │   ├─ sell.rs
      │   │   │   └─ launch.rs
      │   │   └─ fees/
      │   │       └─ distribute.rs
      │   ├─ state/
      │   │   ├─ escrow.rs
      │   │   ├─ curve.rs
      │   │   └─ user.rs
      │   └─ errors.rs
      └─ tests/
```

### Phase 4: Integration (Week 5)
Connect everything together

- Replace mock mode with real Solana calls
- Add transaction confirmation UI
- Implement webhook sync to Appwrite
- Add error handling and retries
- Test on devnet

### Phase 5: Launch (Week 6)
Go live!

- Security audit
- Deploy to mainnet
- Monitor transactions
- Support users

---

## 💳 Use Cases

### Use Case 1: Quest Reward Escrow

```typescript
// Creator creates quest with 5 SOL reward
const escrow = await solanaService.createEscrow({
  type: 'quest',
  entityId: 'quest-123',
  amount: 5.0,
  recipients: [
    { wallet: 'winner-wallet', percentage: 100 }
  ],
  releaseConditions: {
    requiresApproval: true,
    approvers: ['creator-wallet']
  }
})

// User completes quest
// Creator approves submission
const release = await solanaService.releaseEscrow({
  escrowId: escrow.id,
  approverSignature: 'creator-sig'
})

// 5 SOL sent to winner
// Escrow marked as completed in Appwrite
```

### Use Case 2: Bonding Curve Trading

```typescript
// User buys keys
const trade = await solanaService.buyKeys({
  curveId: 'curve-456',
  solAmount: 1.0,
  referrer: 'friend-wallet'
})

// Automatic fee distribution:
// - 0.94 SOL → Curve reserve
// - 0.03 SOL → Creator
// - 0.02 SOL → Platform
// - 0.01 SOL → Referrer
```

### Use Case 3: Project Milestone Payment

```typescript
// Project gets funded with milestones
const escrow = await solanaService.createEscrow({
  type: 'project_milestone',
  entityId: 'project-789',
  amount: 50.0,
  recipients: [
    { wallet: 'dev-1', percentage: 40 },
    { wallet: 'dev-2', percentage: 30 },
    { wallet: 'designer', percentage: 30 }
  ],
  releaseConditions: {
    requiresApproval: true,
    approvers: ['investor-wallet', 'dao-wallet'],
    deadline: new Date('2025-12-31')
  }
})

// Milestone completed
// Needs 2/2 approver signatures
await solanaService.releaseEscrow({
  escrowId: escrow.id,
  approverSignature: 'investor-sig'
})
// Still pending - needs dao-wallet signature

await solanaService.releaseEscrow({
  escrowId: escrow.id,
  approverSignature: 'dao-sig'
})
// ✅ Released! 50 SOL distributed according to percentages
```

---

## 🎯 Benefits of Unified Approach

1. **Build Once, Use Everywhere**
   - Same wallet integration
   - Same transaction flow
   - Same error handling
   - Same testing infrastructure

2. **Consistent UX**
   - Users see same wallet prompts
   - Same transaction confirmations
   - Same explorer links
   - Same fee breakdowns

3. **Better Security**
   - One program to audit
   - Centralized access control
   - Consistent validation
   - Fewer attack surfaces

4. **Faster Development**
   - Reuse components
   - Shared utilities
   - Common patterns
   - Less code duplication

5. **Easier Testing**
   - Test all payment scenarios
   - Mock mode for development
   - Devnet before mainnet
   - Gradual rollout

---

## 🚀 Next Steps

### Immediate (This Week):
1. ✅ Create architecture documents
2. 🔨 Build escrow UI components
3. 🔨 Create payment modal system
4. 🔨 Add to quest/bounty creation flows

### Short Term (Next 2 Weeks):
1. Build TypeScript Solana service
2. Implement mock mode
3. Wire up UI components
4. Test user flows

### Medium Term (Next Month):
1. Build Solana program
2. Deploy to devnet
3. Integrate real transactions
4. Security testing

### Long Term (2-3 Months):
1. Mainnet deployment
2. Full feature rollout
3. Monitor and optimize
4. Scale

---

## 📝 File Structure

```
lib/
  └─ solana/
      ├─ payment-service.ts      # Main service
      ├─ connection.ts           # RPC setup
      ├─ transaction-builder.ts  # Build txs
      ├─ escrow/
      │   ├─ create.ts
      │   ├─ release.ts
      │   └─ cancel.ts
      ├─ curve/
      │   ├─ buy.ts
      │   ├─ sell.ts
      │   └─ launch.ts
      └─ types.ts                # Shared types

components/
  └─ payments/
      ├─ UnifiedPaymentModal.tsx
      ├─ EscrowPaymentModal.tsx
      ├─ EscrowStatusCard.tsx
      ├─ EscrowReleaseModal.tsx
      ├─ PaymentHistory.tsx
      └─ TransactionStatus.tsx

hooks/
  ├─ useSolanaPayment.ts
  ├─ useEscrow.ts
  └─ useCurveTrade.ts

programs/
  └─ launchos_payments/
      ├─ src/
      ├─ tests/
      └─ Cargo.toml
```

---

## 🤔 Decision Points

1. **Start with escrow UI?** ✅ YES
   - Build beautiful payment modals
   - Add to quest/bounty flows
   - Works in mock mode first
   - Real Solana comes later

2. **Use Anchor framework?** ✅ YES
   - Industry standard
   - Better security
   - Easier testing
   - Great docs

3. **Devnet first?** ✅ YES
   - Test with fake SOL
   - Iterate quickly
   - Fix bugs safely
   - Mainnet when ready

4. **Gradual rollout?** ✅ YES
   - Escrow first (simpler)
   - Then curve trading
   - Then token launches
   - Lower risk

---

**Ready to start building the escrow UI components?** 🚀

I can create beautiful payment modals that match the curve modal design we already have!
