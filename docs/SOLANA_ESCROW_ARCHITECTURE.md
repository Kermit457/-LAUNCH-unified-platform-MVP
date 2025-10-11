# Solana Escrow + Bonding Curve Architecture

## Overview

This document outlines the architecture for integrating Solana blockchain escrow with the LaunchOS bonding curve system.

## Current Implementation (Off-Chain)

### What Works Now:
- ✅ Bonding curve mathematics (linear pricing)
- ✅ Appwrite database storing curve state
- ✅ Frontend UI for buying/selling keys
- ✅ Fee calculation (94-3-2-1 split)
- ⚠️ Mock transactions (no actual money flow)

### Limitations:
- No blockchain security
- No real SOL escrow
- No verifiable on-chain transactions
- No trustless reserve management

---

## Proposed Architecture

### Phase 1: Solana Escrow Program (Smart Contract)

#### Program Accounts Structure:

```rust
// Global curve configuration
pub struct CurveConfig {
    pub authority: Pubkey,           // LaunchOS authority
    pub platform_fee_wallet: Pubkey, // 2% platform fees
    pub fee_reserve: u16,            // 9400 (94%)
    pub fee_creator: u16,            // 300 (3%)
    pub fee_platform: u16,           // 200 (2%)
    pub fee_referral: u16,           // 100 (1%)
}

// Per-curve escrow account
pub struct CurveEscrow {
    pub curve_id: String,            // Appwrite curve ID
    pub owner_type: u8,              // 0=user, 1=project
    pub owner_wallet: Pubkey,        // Creator's wallet
    pub state: u8,                   // 0=active, 1=frozen, 2=launched
    pub reserve: u64,                // SOL in lamports
    pub supply: u64,                 // Total keys (decimals: 6)
    pub price: u64,                  // Current price (decimals: 9)
    pub token_mint: Option<Pubkey>,  // SPL token after launch
    pub bump: u8,                    // PDA bump seed
}

// Per-user holdings
pub struct UserHolding {
    pub curve: Pubkey,               // Curve escrow account
    pub user: Pubkey,                // User's wallet
    pub balance: u64,                // Keys held (decimals: 6)
    pub avg_price: u64,              // Average buy price
    pub total_invested: u64,         // Total SOL invested
    pub bump: u8,
}
```

#### Instructions:

1. **`initialize_curve`**
   - Creates escrow PDA for a new curve
   - Parameters: curve_id, owner_wallet, owner_type
   - Returns: escrow account address

2. **`buy_keys`**
   - Transfers SOL from user → escrow
   - Calculates keys based on bonding curve
   - Distributes fees:
     - 94% → curve reserve (escrow)
     - 3% → creator wallet
     - 2% → platform wallet
     - 1% → referrer wallet (or back to reserve)
   - Updates supply and price
   - Creates/updates user holding account

3. **`sell_keys`**
   - Burns user's keys
   - Calculates SOL proceeds (with 5% sell tax)
   - Transfers SOL from escrow → user
   - Updates supply and price

4. **`freeze_curve`**
   - Changes state to frozen
   - No more trading allowed
   - Prepares for launch

5. **`launch_to_dex`**
   - Creates SPL token
   - Distributes tokens to holders based on snapshot
   - Adds liquidity to Raydium/Orca
   - Returns remaining SOL to creator

---

### Phase 2: Frontend Integration

#### Current Flow (Mock):
```
User clicks "Buy Keys"
  ↓
Frontend calls /api/curve/[id]/buy
  ↓
API updates Appwrite directly
  ↓
Returns success
```

#### New Flow (Solana):
```
User clicks "Buy Keys"
  ↓
Privy wallet prompts for SOL
  ↓
Frontend sends Solana transaction
  ↓
Escrow program executes trade
  ↓
Transaction confirmed
  ↓
Webhook updates Appwrite
  ↓
Frontend refreshes curve data
```

#### Key Components:

**1. Solana Connection** (`lib/solana/connection.ts`)
```typescript
import { Connection, clusterApiUrl } from '@solana/web3.js'

export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet'),
  'confirmed'
)
```

**2. Curve Program Client** (`lib/solana/curve-program.ts`)
```typescript
import { Program, AnchorProvider } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'

export class CurveProgram {
  async buyKeys(
    curveId: string,
    solAmount: number,
    referrer?: string
  ): Promise<string> {
    // Build and send transaction
  }

  async sellKeys(
    curveId: string,
    keysAmount: number
  ): Promise<string> {
    // Build and send transaction
  }
}
```

**3. Updated Buy/Sell Modal** (`components/design-system/SimpleBuySellModal.tsx`)
- Replace API fetch with Solana transaction
- Show transaction status (pending, confirmed, failed)
- Display Solana explorer link
- Handle wallet connection errors

---

### Phase 3: Backend Sync

#### Webhook Listener (`app/api/webhooks/solana/route.ts`)
```typescript
// Listen for Solana transaction confirmations
// Update Appwrite when trades happen on-chain
export async function POST(req: Request) {
  const { signature, curveId, type } = await req.json()

  // Verify transaction on Solana
  const tx = await connection.getParsedTransaction(signature)

  // Update Appwrite curve state
  await updateCurve(curveId, {
    supply: newSupply,
    price: newPrice,
    reserve: newReserve
  })

  // Create curve event
  await createCurveEvent({
    curveId,
    type,
    txHash: signature,
    ...
  })
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Anchor project for Solana program
- [ ] Implement curve escrow accounts
- [ ] Write buy_keys instruction
- [ ] Write sell_keys instruction
- [ ] Deploy to Solana devnet
- [ ] Unit tests for program

### Phase 2: Frontend Integration (Week 2-3)
- [ ] Add @solana/web3.js dependencies
- [ ] Create Solana connection utils
- [ ] Build CurveProgram client
- [ ] Update SimpleBuySellModal to use Solana
- [ ] Add wallet connection flow (Privy → Solana)
- [ ] Test on devnet

### Phase 3: Backend Sync (Week 3-4)
- [ ] Create webhook listener
- [ ] Sync Solana state → Appwrite
- [ ] Handle transaction failures/retries
- [ ] Add transaction history UI
- [ ] Testing and debugging

### Phase 4: Launch Features (Week 4-5)
- [ ] Implement freeze_curve
- [ ] Implement launch_to_dex
- [ ] SPL token creation
- [ ] DEX liquidity provision
- [ ] Airdrop to holders

### Phase 5: Mainnet (Week 5-6)
- [ ] Security audit
- [ ] Deploy to mainnet
- [ ] Monitor and support

---

## Fee Distribution Example

**Buy Transaction: 1 SOL**

```
User pays:     1.00 SOL
  ├─ Reserve:  0.94 SOL (94%) → Escrow PDA
  ├─ Creator:  0.03 SOL (3%)  → Creator wallet
  ├─ Platform: 0.02 SOL (2%)  → Platform wallet
  └─ Referral: 0.01 SOL (1%)  → Referrer wallet or back to reserve
```

**Sell Transaction: 0.5 SOL worth of keys**

```
User receives: 0.475 SOL (5% sell tax)
Sell tax:      0.025 SOL → Distributed as fees
Escrow pays:   0.50 SOL total
```

---

## Security Considerations

1. **Program Authority**
   - Use multisig for program upgrades
   - Separate authority for emergency freeze

2. **Reentrancy Protection**
   - Use Anchor's account constraints
   - Validate all account ownership

3. **Price Manipulation**
   - Max trade size limits
   - Slippage protection
   - Price impact warnings

4. **Reserve Security**
   - PDA-controlled escrow (no private key)
   - Audit reserve calculations
   - Monitor for discrepancies

5. **User Protection**
   - Clear warnings for high slippage
   - Transaction simulation before signing
   - Refund mechanism for failed trades

---

## Tech Stack

### Solana Program:
- **Language**: Rust
- **Framework**: Anchor 0.29+
- **Network**: Devnet → Mainnet
- **SPL Token**: For post-launch tokens

### Frontend:
- **Wallet**: Privy (already integrated)
- **Web3**: @solana/web3.js
- **Wallet Adapter**: @solana/wallet-adapter-react
- **RPC**: Helius or QuickNode

### Backend:
- **Sync**: Webhook + Solana RPC polling
- **Database**: Appwrite (existing)
- **Monitoring**: Solana transaction webhooks

---

## Migration Path

### Option A: Gradual (Recommended)
1. Deploy escrow program to devnet
2. Add "Test Mode" toggle in UI
3. Let users opt-in to Solana version
4. Run both systems in parallel
5. Migrate existing curves gradually
6. Sunset off-chain version after 30 days

### Option B: Big Bang
1. Deploy to mainnet
2. Freeze all existing curves
3. Airdrop equivalent SPL tokens
4. Launch new curves on Solana only
5. Higher risk, faster migration

---

## Next Steps

1. **Decision**: Which phase to start with?
2. **Resources**: Do you have Rust/Solana developers?
3. **Timeline**: What's the target launch date?
4. **Budget**: Mainnet deployment + RPC costs

Let me know and I can start building!
