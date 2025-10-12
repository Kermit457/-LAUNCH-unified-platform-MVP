# 🏗️ LaunchOS Solana Architecture V2
## Modular Escrow + Native Bonding Curves

**Last Updated:** 2025-10-12
**Status:** Architecture Design - Ready for Implementation

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LaunchOS Solana System                    │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
    ┌─────────▼─────────┐         ┌─────────▼─────────┐
    │  Curve Program    │         │  Escrow Program   │
    │  (Bonding Logic)  │◄───CPI──┤  (Fund Custody)   │
    └─────────┬─────────┘         └─────────┬─────────┘
              │                               │
    ┌─────────┴─────────┐         ┌─────────┴─────────┐
    │ UserCurve         │         │ Campaign Pool     │
    │ ProjectCurve      │         │ Reward Pool       │
    │ (Instances)       │         │ Referral Pool     │
    └───────────────────┘         │ Utility Vault     │
                                  └───────────────────┘
```

---

## 🎯 Design Principles

1. **Modularity**: Escrow is pool-type agnostic
2. **Composability**: Curve ↔ Escrow via CPI
3. **Upgradeability**: New pool types without redeployment
4. **Efficiency**: Minimal state, deterministic transitions
5. **Security**: Single authority pattern, deterministic PDAs

---

## 📦 Program Structure

### Program 1: Curve Program (`launchos-curve`)

**Purpose**: Bonding curve logic for users and projects

**Responsibilities**:
- Buy/sell keys with linear pricing
- Freeze curve at threshold
- Create snapshot for token launch
- Launch token via Pump.fun integration
- Distribute fees (project, platform, referral)

**Does NOT hold funds** - all payments route through Escrow

### Program 2: Escrow Program (`launchos-escrow`)

**Purpose**: Universal fund custody system

**Responsibilities**:
- Create typed pools (Campaign, Reward, Referral, etc.)
- Hold USDC/SOL in secure PDAs
- Release funds based on verification
- Support CPI from Curve program
- Emit events for off-chain indexing

---

## 🗂️ Account Structures

### Curve Program Accounts

#### 1. CurveAuthority (PDA: `["curve_authority"]`)
```rust
#[account]
pub struct CurveAuthority {
    pub authority: Pubkey,           // Admin wallet
    pub escrow_program: Pubkey,      // Linked escrow program
    pub platform_fee_bps: u16,       // 200 = 2%
    pub project_fee_bps: u16,        // 300 = 3%
    pub referral_fee_bps: u16,       // 100 = 1%
    pub launch_threshold: u64,       // Min keys to launch (100)
    pub bump: u8,
}
```

#### 2. Curve (PDA: `["curve", curve_type, owner_id]`)
```rust
#[account]
pub struct Curve {
    pub curve_id: String,            // "user_123" or "project_456"
    pub curve_type: CurveType,       // User or Project
    pub owner: Pubkey,               // Creator wallet
    pub base_price: u64,             // Starting price (lamports)
    pub slope: u64,                  // Price increment per key
    pub supply: u64,                 // Current keys in circulation
    pub status: CurveStatus,         // Active, Frozen, Launched
    pub reserve_balance: u64,        // Total reserve (in escrow)
    pub escrow_pool: Pubkey,         // Linked escrow pool PDA
    pub token_mint: Option<Pubkey>,  // Set after launch
    pub created_at: i64,
    pub frozen_at: Option<i64>,
    pub launched_at: Option<i64>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum CurveType {
    User,
    Project,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum CurveStatus {
    Active,    // Trading enabled
    Frozen,    // Snapshot taken, no trades
    Launched,  // Token created, claimable
}
```

#### 3. CurveHolder (PDA: `["holder", curve, user]`)
```rust
#[account]
pub struct CurveHolder {
    pub curve: Pubkey,
    pub user: Pubkey,
    pub keys_held: u64,
    pub total_bought: u64,
    pub total_sold: u64,
    pub avg_buy_price: u64,
    pub pnl: i64,                    // Profit/Loss
    pub first_buy: i64,
    pub last_trade: i64,
}
```

#### 4. CurveSnapshot (PDA: `["snapshot", curve]`)
```rust
#[account]
pub struct CurveSnapshot {
    pub curve: Pubkey,
    pub supply_at_freeze: u64,
    pub holder_count: u32,
    pub merkle_root: [u8; 32],       // For airdrop verification
    pub created_at: i64,
}
```

---

### Escrow Program Accounts

#### 1. EscrowAuthority (PDA: `["escrow_authority"]`)
```rust
#[account]
pub struct EscrowAuthority {
    pub authority: Pubkey,           // Admin wallet
    pub curve_program: Pubkey,       // Linked curve program
    pub total_pools: u64,
    pub total_value_locked: u64,
    pub paused: bool,
    pub bump: u8,
}
```

#### 2. Pool (PDA: `["pool", pool_type, pool_id]`)
```rust
#[account]
pub struct Pool {
    pub pool_id: String,             // "campaign_123" or "curve_user_456"
    pub pool_type: PoolType,
    pub owner: Pubkey,               // Creator or curve PDA
    pub balance: u64,
    pub total_deposited: u64,
    pub total_withdrawn: u64,
    pub status: PoolStatus,
    pub metadata: PoolMetadata,
    pub created_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PoolType {
    Campaign,      // Campaign budgets
    CurveReserve,  // Bonding curve reserve
    Reward,        // Quest/bounty rewards
    Referral,      // Referral earnings pool
    Utility,       // Utility vault (future)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PoolStatus {
    Active,
    Frozen,
    Closed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PoolMetadata {
    pub campaign_id: Option<String>,
    pub curve_id: Option<String>,
    pub deadline: Option<i64>,
    pub min_payout: Option<u64>,
    pub max_payout: Option<u64>,
}
```

#### 3. PoolDeposit (PDA: `["deposit", pool, depositor]`)
```rust
#[account]
pub struct PoolDeposit {
    pub pool: Pubkey,
    pub depositor: Pubkey,
    pub amount: u64,
    pub tx_hash: String,
    pub timestamp: i64,
}
```

#### 4. PoolWithdrawal (PDA: `["withdrawal", pool, recipient]`)
```rust
#[account]
pub struct PoolWithdrawal {
    pub pool: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub reason: WithdrawalReason,
    pub tx_hash: String,
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum WithdrawalReason {
    CampaignPayout,
    CurveRefund,
    RewardClaim,
    ReferralPayout,
}
```

---

## 🔄 Transaction Flows

### Flow 1: Create Curve + Reserve Pool

```
User → Frontend → Curve Program
  1. create_curve(curve_type, owner_id, base_price, slope)
     → Creates Curve PDA

  2. CPI to Escrow Program:
     → create_pool(PoolType::CurveReserve, curve_id)
     → Links Pool PDA to Curve

  3. Update Curve.escrow_pool = pool_pda
```

**Accounts**:
```rust
#[derive(Accounts)]
pub struct CreateCurve<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Curve::INIT_SPACE,
        seeds = [b"curve", curve_type.as_bytes(), owner_id.as_bytes()],
        bump
    )]
    pub curve: Account<'info, Curve>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub curve_authority: Account<'info, CurveAuthority>,

    /// CHECK: Escrow program for CPI
    pub escrow_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
```

---

### Flow 2: Buy Keys (with Escrow Integration)

```
User → Frontend → Curve Program
  1. buy_keys(curve_id, amount, referrer?)
     → Calculate price via bonding formula
     → Calculate fees (platform, project, referral)

  2. Transfer USDC from user to escrow pool
     → User wallet → Pool token account

  3. Update Curve state:
     → supply += amount
     → reserve_balance += (price - fees)

  4. Update CurveHolder:
     → keys_held += amount
     → avg_buy_price recalculated

  5. Distribute fees:
     → Platform fee → platform pool
     → Project fee → project wallet
     → Referral fee → referrer pool
```

**Accounts**:
```rust
#[derive(Accounts)]
pub struct BuyKeys<'info> {
    #[account(mut)]
    pub curve: Account<'info, Curve>,

    #[account(
        init_if_needed,
        payer = buyer,
        space = 8 + CurveHolder::INIT_SPACE,
        seeds = [b"holder", curve.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub holder: Account<'info, CurveHolder>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}
```

---

### Flow 3: Create Campaign + Fund Escrow

```
Creator → Frontend → Escrow Program
  1. create_campaign_pool(campaign_id, budget, deadline)
     → Creates Pool PDA (PoolType::Campaign)

  2. deposit_to_pool(pool_id, amount)
     → Transfer USDC: creator → pool
     → Update pool.balance
     → Create PoolDeposit record

  3. Off-chain: Campaign goes live
```

**Accounts**:
```rust
#[derive(Accounts)]
pub struct CreateCampaignPool<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Pool::INIT_SPACE,
        seeds = [b"pool", b"campaign", campaign_id.as_bytes()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub escrow_authority: Account<'info, EscrowAuthority>,

    pub system_program: Program<'info, System>,
}
```

---

### Flow 4: Campaign Payout

```
Backend → Escrow Program
  1. Verify submission approved (off-chain)

  2. withdraw_from_pool(pool_id, recipient, amount, reason)
     → Verify authority signature
     → Check pool.balance >= amount
     → Transfer: pool → recipient
     → Create PoolWithdrawal record
     → Update pool balances

  3. Off-chain: Update database
```

---

### Flow 5: Freeze Curve + Snapshot

```
Owner → Frontend → Curve Program
  1. freeze_curve(curve_id)
     → Require: supply >= launch_threshold
     → Set status = Frozen
     → Set frozen_at timestamp

  2. create_snapshot(curve_id)
     → Iterate all holders
     → Build merkle tree
     → Store merkle_root on-chain
     → CurveSnapshot PDA created
```

---

### Flow 6: Launch Token

```
Owner → Frontend → Curve Program
  1. launch_token(curve_id, token_metadata)
     → Require: status = Frozen
     → Create SPL token mint
     → Set total_supply = curve.supply

  2. CPI to Pump.fun (or DEX):
     → Create liquidity pool
     → Add liquidity from reserve
     → Lock LP tokens

  3. Update Curve:
     → status = Launched
     → token_mint = mint_pubkey
     → launched_at timestamp

  4. Enable claims:
     → Holders can claim proportional tokens
```

---

## 🔌 Cross-Program Integration (CPI)

### Curve → Escrow: Create Reserve Pool

```rust
// In Curve Program
pub fn create_curve_with_reserve(ctx: Context<CreateCurve>) -> Result<()> {
    // 1. Initialize curve
    let curve = &mut ctx.accounts.curve;
    curve.status = CurveStatus::Active;

    // 2. CPI to Escrow: create pool
    let pool_id = format!("curve_{}", curve.curve_id);

    let cpi_accounts = CreatePool {
        pool: ctx.accounts.pool.to_account_info(),
        escrow_authority: ctx.accounts.escrow_authority.to_account_info(),
        payer: ctx.accounts.creator.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.escrow_program.to_account_info(),
        cpi_accounts,
    );

    escrow_program::cpi::create_pool(
        cpi_ctx,
        pool_id,
        PoolType::CurveReserve,
        Some(curve.curve_id.clone()),
    )?;

    // 3. Link pool to curve
    curve.escrow_pool = ctx.accounts.pool.key();

    Ok(())
}
```

### Curve → Escrow: Deposit to Reserve

```rust
// In Curve Program (during buy_keys)
pub fn buy_keys(ctx: Context<BuyKeys>, amount: u64) -> Result<()> {
    let curve = &mut ctx.accounts.curve;
    let price = calculate_buy_price(curve.supply, amount, curve.base_price, curve.slope);

    // CPI to Escrow: deposit
    let cpi_accounts = Deposit {
        pool: ctx.accounts.pool.to_account_info(),
        depositor: ctx.accounts.buyer.to_account_info(),
        depositor_token_account: ctx.accounts.buyer_token_account.to_account_info(),
        pool_token_account: ctx.accounts.pool_token_account.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.escrow_program.to_account_info(),
        cpi_accounts,
    );

    escrow_program::cpi::deposit(cpi_ctx, price)?;

    // Update curve state
    curve.supply += amount;
    curve.reserve_balance += price;

    Ok(())
}
```

---

## 🔄 Upgrade Path for New Pool Types

### Adding a New Pool Type (e.g., Utility Vault)

**1. Update Escrow Program**:
```rust
// In state.rs
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PoolType {
    Campaign,
    CurveReserve,
    Reward,
    Referral,
    Utility,        // ← ADD THIS
}
```

**2. No redeployment needed** - enum supports new variants

**3. Frontend API** adds new endpoint:
```typescript
POST /api/pools/create
{
  "poolType": "Utility",
  "ownerId": "project_123",
  "metadata": { ... }
}
```

**4. Smart contract** automatically handles it:
```rust
pub fn create_pool(
    ctx: Context<CreatePool>,
    pool_id: String,
    pool_type: PoolType,  // Works with Utility!
    metadata: PoolMetadata,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    pool.pool_type = pool_type;
    // ... rest of logic is pool-type agnostic
    Ok(())
}
```

---

## 🌐 Frontend API Changes

### New Endpoints

#### Curve Operations
```typescript
POST /api/curve/create
{
  "curveType": "user" | "project",
  "ownerId": string,
  "basePrice": number,
  "slope": number
}

POST /api/curve/buy
{
  "curveId": string,
  "amount": number,
  "referrerId"?: string
}

POST /api/curve/sell
{
  "curveId": string,
  "amount": number
}

POST /api/curve/freeze
{
  "curveId": string
}

POST /api/curve/launch
{
  "curveId": string,
  "tokenMetadata": {...}
}
```

#### Campaign Operations
```typescript
POST /api/campaign/create-pool
{
  "campaignId": string,
  "budget": number,
  "deadline": timestamp
}

POST /api/campaign/deposit
{
  "campaignId": string,
  "amount": number
}

POST /api/campaign/payout
{
  "campaignId": string,
  "recipientId": string,
  "amount": number,
  "submissionId": string
}
```

### Removed Endpoints
- ❌ `/api/boost/pay` (Boost Escrow removed)

---

## 📐 Contract Diagram

```
┌──────────────────────────────────────────────────────────┐
│                      FRONTEND                             │
│  (Next.js API Routes + React Components)                 │
└────────────┬─────────────────────────────┬───────────────┘
             │                             │
             ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   Curve Program         │   │   Escrow Program        │
│   (launchos-curve)      │   │   (launchos-escrow)     │
├─────────────────────────┤   ├─────────────────────────┤
│ Instructions:           │   │ Instructions:           │
│ • create_curve          │   │ • create_pool           │
│ • buy_keys          ────┼───┼─→ deposit               │
│ • sell_keys         ────┼───┼─→ withdraw              │
│ • freeze_curve          │   │ • close_pool            │
│ • create_snapshot       │   │ • pause/unpause         │
│ • launch_token          │   │                         │
├─────────────────────────┤   ├─────────────────────────┤
│ Accounts:               │   │ Accounts:               │
│ • Curve                 │   │ • Pool                  │
│ • CurveHolder           │   │ • PoolDeposit           │
│ • CurveSnapshot         │   │ • PoolWithdrawal        │
│ • CurveAuthority        │   │ • EscrowAuthority       │
└─────────────────────────┘   └─────────────────────────┘
             │                             │
             └─────────CPI Call────────────┘
                  (Cross-Program Invocation)
```

---

## 🎯 Avoiding Duplicate Work

### Shared Components

**1. Authority Pattern**:
```rust
// Both programs use same pattern
pub struct Authority {
    pub authority: Pubkey,
    pub linked_program: Pubkey,
    pub bump: u8,
}
```

**2. Common Types** (shared crate):
```rust
// lib/solana-common/src/lib.rs
pub enum PoolType { Campaign, CurveReserve, Reward, Referral, Utility }
pub enum Status { Active, Frozen, Closed }
```

**3. Shared Utilities**:
```rust
// lib/solana-common/src/math.rs
pub fn calculate_buy_price(...) -> u64
pub fn calculate_sell_price(...) -> u64
pub fn calculate_fees(...) -> Fees
```

### Development Strategy

**Phase 1: Escrow Only** (Week 1-2)
- Deploy Escrow with Campaign pool support
- Test campaign funding + payouts
- No curve integration yet

**Phase 2: Curve + Reserve** (Week 3-4)
- Deploy Curve program
- Integrate CurveReserve pool type
- Test buy/sell with escrow

**Phase 3: Launch Flow** (Week 5-6)
- Add freeze + snapshot
- Integrate Pump.fun API
- Test full lifecycle

**Phase 4: Additional Pools** (Week 7+)
- Add Reward, Referral, Utility pools
- No smart contract changes needed!

---

## 🔐 Security Considerations

### Authority Management
```rust
// Single admin pattern
pub fn update_authority(ctx: Context<UpdateAuthority>, new_authority: Pubkey) -> Result<()> {
    require!(
        ctx.accounts.authority.key() == ctx.accounts.current_authority.authority,
        ErrorCode::Unauthorized
    );
    ctx.accounts.current_authority.authority = new_authority;
    Ok(())
}
```

### Pool Isolation
- Each pool has unique PDA seeds
- Cannot withdraw from wrong pool type
- Balance checks before withdrawals

### CPI Security
- Verify program IDs on CPI calls
- Use signer seeds for PDAs
- Check account ownership

---

## 📊 State Transition Rules

### Curve Status Transitions
```
Active → Frozen → Launched
  ↓        ↓
  ✓        ✗  (can't go back to Active)
```

### Pool Status Transitions
```
Active → Frozen → Closed
  ↓        ↓        ↓
  ✓        ✓        ✗  (permanent)
```

---

## ✅ Deployment Checklist

### Devnet Testing
- [ ] Deploy Escrow program
- [ ] Deploy Curve program
- [ ] Link programs via authority
- [ ] Test campaign pool creation
- [ ] Test curve + reserve pool
- [ ] Test buy/sell flow
- [ ] Test freeze + snapshot
- [ ] Test campaign payout
- [ ] Verify all CPIs work

### Mainnet Preparation
- [ ] Security audit (both programs)
- [ ] Load testing
- [ ] Upgrade authority to multisig
- [ ] Deploy to mainnet
- [ ] Verify program IDs
- [ ] Update frontend config

---

## 🚀 Next Steps

1. **Update Escrow Contract**: Remove Boost logic, keep Campaign only
2. **Create Curve Program**: New Anchor project with full curve logic
3. **Build TypeScript SDKs**: For both programs
4. **Update Frontend**: New API routes for curve operations
5. **Testing**: Comprehensive integration tests
6. **Deploy to Devnet**: Test full flow end-to-end

---

**This architecture gives you:**
✅ No boost escrow (removed)
✅ Campaign escrow as single live system
✅ Modular pool types (easy to add new ones)
✅ Native Solana curves (efficient, composable)
✅ Clean CPI integration
✅ Minimal duplicate work
✅ Upgrade path without redeployment

Ready to implement! 🎉
