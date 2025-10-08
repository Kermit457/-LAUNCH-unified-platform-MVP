# 🏦 Escrow System - Complete Implementation Plan

**Last Updated:** 2025-10-08
**Status:** Planning Phase

---

## 🎯 **Executive Summary**

Build a **centralized escrow pool system** to handle ALL payment flows across the LaunchOS platform. This replaces the mock wallet system with real Solana/USDC transactions managed through smart contract escrow pools.

---

## 📊 **Current State Analysis**

### **Existing Payment Flows:**

| Feature | Current Implementation | Amount | Status |
|---------|----------------------|--------|--------|
| **Boost Payments** | Mock wallet (`lib/wallet.ts`) | 10 $LAUNCH | ❌ Mock only |
| **Campaign Budgets** | Database field only | Variable USDC | ⚠️ No payment |
| **Quest Rewards** | Database field only | Variable USDC | ⚠️ No payment |
| **Launch Contributions** | `contributionPoolPct` field | % of supply | ⚠️ No escrow |
| **Payouts** | Database status tracking | Variable USDC | ⚠️ No automation |
| **Fees** | `feesSharePct` field | % of fees | ⚠️ No collection |

### **Current Collections (Appwrite):**

✅ `payouts` - Tracks pending/claimed payments
✅ `campaigns` - Has `prizePool`, `budgetTotal`, `budgetPaid` fields
✅ `quests` - Has reward fields
✅ `launches` - Has `contributionPoolPct`, `feesSharePct` fields

---

## 🏗️ **Escrow Pool Architecture**

### **Core Concept:**

**One Master Escrow Contract** with multiple sub-pools for different use cases:

```
┌─────────────────────────────────────┐
│   LaunchOS Master Escrow Contract   │
│         (Solana Program)            │
└─────────────────────────────────────┘
           │
           ├── Pool 1: Boost Payments
           ├── Pool 2: Campaign Budgets
           ├── Pool 3: Quest Rewards
           ├── Pool 4: Launch Contributions
           ├── Pool 5: Revenue Share
           └── Pool 6: Platform Fees
```

### **Tech Stack:**

- **Blockchain**: Solana (mainnet-beta)
- **Token**: USDC-SPL (EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)
- **Program**: Anchor Framework (Solana smart contracts)
- **Client**: `@solana/web3.js` + `@solana/spl-token`
- **Wallet**: Privy (already integrated)

---

## 💰 **Payment Flow Breakdown**

### **1. Boost Payments** 🚀

**Current:** Mock $LAUNCH tokens
**New:** Real USDC payments

**Flow:**
```
User clicks "Boost"
  → Modal shows: "Pay 10 USDC to boost this launch"
  → Connect Solana wallet (via Privy)
  → User approves transaction
  → USDC transferred to Boost Escrow Pool
  → Database: increment boostCount
  → 80% goes to launch creator
  → 20% goes to platform fees
```

**Database Changes:**
- Add `boost_transactions` collection
- Fields: `userId`, `launchId`, `amount`, `txHash`, `status`, `timestamp`

**Escrow Pool:**
- **Pool ID**: `boost_pool`
- **Purpose**: Hold boost payments temporarily
- **Distribution**: Auto-release to creators + platform

---

### **2. Campaign Budgets** 📹

**Current:** Budget field, no actual payment
**New:** Escrow-backed campaigns

**Flow:**
```
Creator creates campaign
  → Sets prize pool: $500 USDC
  → Clicks "Create & Fund Campaign"
  → Wallet prompt: "Deposit $500 USDC to escrow"
  → USDC locked in Campaign Escrow Pool
  → Campaign goes live
  → Submissions approved → Payouts calculated
  → Winners claim → USDC released from escrow
```

**Database Changes:**
- Add `escrowAddress` field to campaigns
- Add `campaign_deposits` collection
- Track `budgetLocked`, `budgetPaid`, `budgetRemaining`

**Escrow Pool:**
- **Pool ID**: `campaign_{campaignId}`
- **Purpose**: Hold campaign budget until winners claim
- **Auto-refund**: Unclaimed funds return after 30 days

---

### **3. Quest Rewards** 🎯

**Current:** Reward fields, no payment
**New:** Instant payout from escrow

**Flow:**
```
Creator sets daily quest: "Complete 3 tasks → Earn 5 USDC"
  → Deposits 50 USDC for 10 users
  → Quest goes live
  → User completes quest
  → System verifies completion
  → USDC auto-released from escrow to user wallet
  → User sees "5 USDC earned!" notification
```

**Database Changes:**
- Add `quest_deposits` collection
- Add `quest_claims` collection
- Track completion proofs

**Escrow Pool:**
- **Pool ID**: `quest_{questId}`
- **Purpose**: Instant rewards distribution
- **Auto-refund**: Unused budget returns to creator

---

### **4. Launch Contributions** 💎

**Current:** Percentage fields, no actual tokens
**New:** Real token contribution pool

**Flow:**
```
Launch created with 3% contribution pool
  → 3% of token supply held in escrow
  → Contributors buy tokens
  → Their contribution tracked on-chain
  → At TGE: tokens distributed proportionally
```

**Database Changes:**
- Add `contributions` collection
- Fields: `userId`, `launchId`, `amountUSDC`, `tokenAllocation`, `status`

**Escrow Pool:**
- **Pool ID**: `launch_contrib_{launchId}`
- **Purpose**: Hold tokens until TGE
- **Distribution**: Proportional to contribution amounts

---

### **5. Revenue Share (Fees)** 💸

**Current:** `feesSharePct` field
**New:** Auto-split to stakeholders

**Flow:**
```
Platform generates revenue (boost fees, campaign fees, etc.)
  → 25% to launch creators
  → 10% to top contributors
  → 15% to platform treasury
  → 50% to stakers/governance
  → Auto-distributed monthly
```

**Database Changes:**
- Add `revenue_shares` collection
- Track monthly distributions

**Escrow Pool:**
- **Pool ID**: `revenue_pool`
- **Purpose**: Accumulate platform fees
- **Distribution**: Monthly automated payouts

---

### **6. Payouts System** 💵

**Current:** Manual status updates
**New:** Automated escrow claims

**Flow:**
```
User earns $50 from campaign
  → Payout created: status = 'claimable'
  → User clicks "Claim Payout"
  → USDC released from escrow → user wallet
  → Status updated: 'claimed' → 'paid'
  → txHash stored in database
```

**Database Changes:**
- Add `escrowPoolId` to payouts
- Add `claimDeadline` field (30 days)

**Escrow Pool:**
- Uses pool from original source (campaign, quest, etc.)

---

## 🔧 **Technical Implementation**

### **Phase 1: Foundation** (Week 1)

#### **1.1 Solana Program (Smart Contract)**

Create Anchor program with:
- Master escrow account
- Sub-pool creation logic
- Deposit/withdraw functions
- Admin controls

**File**: `solana-program/programs/launchos-escrow/src/lib.rs`

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[program]
pub mod launchos_escrow {
    use super::*;

    // Initialize master escrow
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Setup master escrow account
    }

    // Create sub-pool for specific use case
    pub fn create_pool(
        ctx: Context<CreatePool>,
        pool_type: PoolType,
        pool_id: String,
    ) -> Result<()> {
        // Create dedicated pool
    }

    // Deposit USDC into pool
    pub fn deposit(
        ctx: Context<Deposit>,
        pool_id: String,
        amount: u64,
    ) -> Result<()> {
        // Transfer USDC to escrow
    }

    // Withdraw USDC from pool (with authorization)
    pub fn withdraw(
        ctx: Context<Withdraw>,
        pool_id: String,
        recipient: Pubkey,
        amount: u64,
    ) -> Result<()> {
        // Release USDC to recipient
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PoolType {
    Boost,
    Campaign,
    Quest,
    Contribution,
    Revenue,
    Payout,
}
```

#### **1.2 TypeScript SDK**

**File**: `lib/solana/escrow.ts`

```typescript
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { Program, AnchorProvider } from '@coral-xyz/anchor'

export class EscrowManager {
  private program: Program
  private connection: Connection

  constructor(wallet: any) {
    this.connection = new Connection(process.env.SOLANA_RPC_URL!)
    const provider = new AnchorProvider(this.connection, wallet, {})
    this.program = new Program(IDL, PROGRAM_ID, provider)
  }

  // Create a new escrow pool
  async createPool(poolType: PoolType, poolId: string) {
    return await this.program.methods
      .createPool(poolType, poolId)
      .rpc()
  }

  // Deposit USDC to pool
  async deposit(poolId: string, amount: number) {
    return await this.program.methods
      .deposit(poolId, amount)
      .rpc()
  }

  // Withdraw USDC from pool
  async withdraw(poolId: string, recipient: string, amount: number) {
    return await this.program.methods
      .withdraw(poolId, recipient, amount)
      .rpc()
  }

  // Get pool balance
  async getPoolBalance(poolId: string): Promise<number> {
    const poolAccount = await this.program.account.pool.fetch(poolId)
    return poolAccount.balance
  }
}
```

#### **1.3 React Hook for Payments**

**File**: `hooks/useEscrowPayment.ts`

```typescript
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { EscrowManager } from '@/lib/solana/escrow'

export function useEscrowPayment() {
  const wallet = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const depositToPool = async (
    poolId: string,
    amount: number
  ) => {
    try {
      setLoading(true)
      setError(null)

      const escrow = new EscrowManager(wallet)
      const txHash = await escrow.deposit(poolId, amount)

      return txHash
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const withdrawFromPool = async (
    poolId: string,
    recipient: string,
    amount: number
  ) => {
    try {
      setLoading(true)
      const escrow = new EscrowManager(wallet)
      const txHash = await escrow.withdraw(poolId, recipient, amount)
      return txHash
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    depositToPool,
    withdrawFromPool,
    loading,
    error
  }
}
```

---

### **Phase 2: Payment Flows** (Week 2)

#### **2.1 Boost Payment Modal**

**File**: `components/payments/BoostPaymentModal.tsx`

```typescript
"use client"

import { useState } from 'react'
import { useEscrowPayment } from '@/hooks/useEscrowPayment'
import { incrementBoostCount } from '@/lib/appwrite/services/tracking'
import { createBoostTransaction } from '@/lib/appwrite/services/transactions'

export function BoostPaymentModal({ launchId, onClose }) {
  const { depositToPool, loading } = useEscrowPayment()
  const BOOST_COST = 10 // 10 USDC

  const handleBoost = async () => {
    try {
      // 1. Deposit to escrow
      const txHash = await depositToPool(`boost_pool`, BOOST_COST)

      // 2. Record transaction in database
      await createBoostTransaction({
        launchId,
        amount: BOOST_COST,
        txHash,
        status: 'confirmed'
      })

      // 3. Increment boost count
      await incrementBoostCount(launchId)

      // 4. Success!
      onClose()
    } catch (error) {
      console.error('Boost failed:', error)
    }
  }

  return (
    <Modal>
      <h2>Boost this Launch</h2>
      <p>Pay {BOOST_COST} USDC to boost visibility</p>
      <Button onClick={handleBoost} loading={loading}>
        Pay {BOOST_COST} USDC
      </Button>
    </Modal>
  )
}
```

#### **2.2 Campaign Funding Flow**

**File**: `components/campaigns/FundCampaignModal.tsx`

Similar pattern - create modal for funding campaigns

#### **2.3 Automated Payouts**

**File**: `lib/cron/process-payouts.ts` (backend service)

```typescript
// Runs every hour
export async function processPayouts() {
  const claimablePayouts = await getPayouts({ status: 'claimable' })

  for (const payout of claimablePayouts) {
    try {
      // Auto-release from escrow to user wallet
      await escrow.withdraw(
        payout.escrowPoolId,
        payout.userWallet,
        payout.amount
      )

      // Update status
      await updatePayout(payout.$id, {
        status: 'paid',
        txHash: txHash,
        paidAt: new Date().toISOString()
      })
    } catch (error) {
      console.error(`Failed to process payout ${payout.$id}:`, error)
    }
  }
}
```

---

### **Phase 3: Database Schema** (Week 2)

#### **New Collections:**

**1. `boost_transactions`**
```typescript
{
  $id: string
  userId: string
  launchId: string
  amount: number
  currency: 'USDC'
  txHash: string
  escrowPoolId: 'boost_pool'
  status: 'pending' | 'confirmed' | 'failed'
  creatorShare: number // 80% of amount
  platformShare: number // 20% of amount
  $createdAt: string
}
```

**2. `campaign_deposits`**
```typescript
{
  $id: string
  campaignId: string
  userId: string
  amount: number
  txHash: string
  escrowPoolId: string
  status: 'locked' | 'distributed' | 'refunded'
  $createdAt: string
}
```

**3. `quest_claims`**
```typescript
{
  $id: string
  questId: string
  userId: string
  rewardAmount: number
  proofOfCompletion: string
  txHash: string
  status: 'pending' | 'paid'
  $createdAt: string
}
```

**4. `escrow_pools`**
```typescript
{
  $id: string
  poolId: string
  poolType: 'boost' | 'campaign' | 'quest' | 'contribution' | 'revenue'
  solanaAddress: string
  balance: number
  totalDeposited: number
  totalWithdrawn: number
  status: 'active' | 'closed'
  ownerId?: string // campaignId, questId, etc.
  $createdAt: string
}
```

---

### **Phase 4: Backend Services** (Week 3)

#### **API Endpoints:**

**POST** `/api/escrow/pools/create`
**POST** `/api/escrow/deposit`
**POST** `/api/escrow/withdraw`
**GET** `/api/escrow/pools/:id/balance`
**POST** `/api/boost/pay`
**POST** `/api/campaigns/fund`
**POST** `/api/payouts/claim`

---

## 📈 **Implementation Timeline**

### **Week 1: Foundation**
- ✅ Write Solana escrow program (Rust/Anchor)
- ✅ Deploy to devnet
- ✅ Build TypeScript SDK
- ✅ Create React hooks

### **Week 2: Payment Flows**
- ✅ Build Boost Payment Modal
- ✅ Build Campaign Funding Flow
- ✅ Build Quest Reward System
- ✅ Add database collections

### **Week 3: Backend & Automation**
- ✅ Create API endpoints
- ✅ Build automated payout processor
- ✅ Add transaction monitoring
- ✅ Error handling & retries

### **Week 4: Testing & Launch**
- ✅ Test on devnet with test USDC
- ✅ Security audit
- ✅ Deploy to mainnet
- ✅ User testing & feedback

---

## 💡 **Key Features**

| Feature | Benefit |
|---------|---------|
| **Trustless Escrow** | Funds held by smart contract, not LaunchOS |
| **Automated Payouts** | No manual processing needed |
| **Real-time Balance** | Check escrow balance on-chain |
| **Refund Logic** | Unclaimed funds auto-return |
| **Multi-sig Support** | Require multiple approvals for large withdrawals |
| **Audit Trail** | Every transaction has txHash |

---

## ⚠️ **Security Considerations**

1. **Smart Contract Audit** - Professional audit before mainnet
2. **Admin Keys** - Multi-sig wallet for escrow admin functions
3. **Rate Limiting** - Prevent spam attacks
4. **Balance Checks** - Always verify sufficient escrow balance
5. **Withdrawal Limits** - Cap max withdrawal per transaction
6. **Emergency Pause** - Ability to pause all escrow operations

---

## 🎯 **Success Metrics**

- **Total Value Locked (TVL)** in escrow pools
- **Transaction Success Rate** (target: >99%)
- **Average Payout Time** (target: <5 minutes)
- **Gas Fees** (target: <$0.01 per transaction)
- **User Satisfaction** (target: >4.5/5 stars)

---

## 🚀 **Next Steps**

1. ✅ **Review this plan** with the team
2. ⚠️ **Set up Solana development environment**
3. ⚠️ **Write and test smart contract**
4. ⚠️ **Build TypeScript SDK**
5. ⚠️ **Integrate with UI**
6. ⚠️ **Test on devnet**
7. ⚠️ **Security audit**
8. ⚠️ **Deploy to mainnet**

---

## 📞 **Questions?**

- Smart contract complexity: **Medium**
- Development time: **3-4 weeks**
- Cost estimate: **$5-10K** (audit + deployment)
- Risk level: **Medium** (requires security audit)

---

**Ready to start building the escrow system?** 🏗️
