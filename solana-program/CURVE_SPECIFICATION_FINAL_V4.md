# 🚀 LaunchOS Curve Program - FINAL SPECIFICATION V4
## Complete Technical Implementation Plan

**Date:** 2025-01-12
**Status:** Ready for Implementation
**Critical:** This is the definitive specification - verify every detail before building

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [State Machine](#state-machine)
3. [Bonding Curve Formula](#bonding-curve-formula)
4. [Fee Structure](#fee-structure)
5. [Freeze & Launch Mechanics](#freeze--launch-mechanics)
6. [Smart Contract Architecture](#smart-contract-architecture)
7. [Storage Schema](#storage-schema)
8. [Instructions Reference](#instructions-reference)
9. [Security Requirements](#security-requirements)
10. [Testing Requirements](#testing-requirements)
11. [API Integration](#api-integration)

---

## 1. Executive Summary

### What This Is
A Solana bonding curve program that enables:
- **Pre-token trading** via "keys" (shares)
- **Anti-sniper protection** (3-step private → active flow)
- **Automatic token launch** at 32 SOL reserve threshold
- **Fair distribution** via snapshot-based airdrops

### Key Innovation
**Hybrid approach**: Active trading (open curve) → Frozen (snapshot) → Launched (SPL token)

### Critical Goals
1. ✅ **Bot-proof**: 3-step activation prevents sniping
2. ✅ **Fair launch**: Auto-freeze at 32 SOL ensures readiness
3. ✅ **Instant fees**: 94% reserve, 4% rewards, 2% platform
4. ✅ **Smooth transition**: Keys → Tokens via snapshot

---

## 2. State Machine

### States

```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CurveStatus {
    /// Step 1: Curve created, hidden from public
    Pending,

    /// Step 2: Creator bought + activated, PUBLIC trading
    Active,

    /// Step 3: Trading frozen, snapshot taken, ready for token launch
    Frozen,

    /// Step 4: Token minted, LP seeded, airdrops complete
    Launched,
}
```

### State Transition Rules

```
                  create_curve()
                       ↓
    ┌──────────────────────────────────┐
    │         PENDING                  │
    │  • Hidden from public            │
    │  • Only creator can interact     │
    └──────────────────────────────────┘
                       ↓ creator_initial_buy() + activate_curve()
    ┌──────────────────────────────────┐
    │         ACTIVE                   │
    │  • Public trading enabled        │
    │  • Buy/sell allowed              │
    │  • Freeze triggers monitoring    │
    └──────────────────────────────────┘
                       ↓ freeze_manual() OR freeze_if_reserve() OR freeze_if_time()
    ┌──────────────────────────────────┐
    │         FROZEN                   │
    │  • Trading BLOCKED               │
    │  • Snapshot taken                │
    │  • Supply/reserve locked         │
    │  • Ready for token launch        │
    └──────────────────────────────────┘
                       ↓ launch()
    ┌──────────────────────────────────┐
    │         LAUNCHED                 │
    │  • Token minted                  │
    │  • LP seeded                     │
    │  • Airdrops completed            │
    │  • Curve retired                 │
    └──────────────────────────────────┘
```

### Allowed Operations by State

| Operation | Pending | Active | Frozen | Launched |
|-----------|---------|--------|--------|----------|
| `create_curve` | N/A | ❌ | ❌ | ❌ |
| `creator_initial_buy` | ✅ | ❌ | ❌ | ❌ |
| `activate_curve` | ✅ | ❌ | ❌ | ❌ |
| `buy_keys` | ❌ | ✅ | ❌ | ❌ |
| `sell_keys` | ❌ | ✅ | ❌ | ❌ |
| `freeze_manual` | ❌ | ✅ (owner) | ❌ | ❌ |
| `freeze_if_reserve` | ❌ | ✅ (auto) | ❌ | ❌ |
| `freeze_if_time` | ❌ | ✅ (auto) | ❌ | ❌ |
| `launch` | ❌ | ❌ | ✅ (owner) | ❌ |

---

## 3. Bonding Curve Formula

### ❌ OLD Formula (Linear - DO NOT USE)
```
Price = 0.01 + supply × 0.0001 SOL
```

### ✅ NEW Formula (Hybrid Exponential)

```rust
// P(S) = 0.05 + 0.0003 * S + 0.0000012 * S^1.6

pub fn calculate_price_at_supply(supply: u128) -> Result<u128> {
    // Base component (lamports)
    let base = 50_000_000; // 0.05 SOL = 50M lamports

    // Linear component (lamports)
    let linear = supply
        .checked_mul(300_000) // 0.0003 SOL = 300k lamports
        .ok_or(CurveError::ArithmeticOverflow)?;

    // Exponential component: 0.0000012 * S^1.6
    // S^1.6 = S * S^0.6
    // Approximate S^0.6 using iterative method or lookup table
    let s_to_0_6 = approximate_power(supply, 6, 10)?; // S^(6/10)
    let exponential_term = supply
        .checked_mul(s_to_0_6)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_mul(1_200) // 0.0000012 SOL = 1200 lamports
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(1_000_000_000)
        .ok_or(CurveError::ArithmeticOverflow)?;

    // Total price
    base
        .checked_add(linear)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_add(exponential_term)
        .ok_or(CurveError::ArithmeticOverflow)
}

// Helper: Approximate x^(num/denom) using Newton's method
pub fn approximate_power(x: u128, num: u32, denom: u32) -> Result<u128> {
    // Implementation: iterative approximation
    // For production: use well-tested fixed-point math library
    // For MVP: use lookup table for common values
}
```

### Buy Cost Calculation

```rust
// Total cost to buy `amount` keys starting from `current_supply`
pub fn calculate_buy_cost(current_supply: u128, amount: u64) -> Result<u128> {
    let mut total_cost = 0u128;

    // Sum prices for each key
    for i in 0..amount {
        let price = calculate_price_at_supply(
            current_supply
                .checked_add(i as u128)
                .ok_or(CurveError::ArithmeticOverflow)?
        )?;

        total_cost = total_cost
            .checked_add(price)
            .ok_or(CurveError::ArithmeticOverflow)?;
    }

    Ok(total_cost)
}
```

### Sell Return Calculation

```rust
// Amount returned when selling `amount` keys
pub fn calculate_sell_return(current_supply: u128, amount: u64) -> Result<u128> {
    let mut total_return = 0u128;

    // Sum prices for each key in reverse
    for i in 0..amount {
        let price = calculate_price_at_supply(
            current_supply
                .checked_sub((i + 1) as u128)
                .ok_or(CurveError::ArithmeticOverflow)?
        )?;

        total_return = total_return
            .checked_add(price)
            .ok_or(CurveError::ArithmeticOverflow)?;
    }

    // Apply unified 6% fee (matches buy side)
    let fee_amount = total_return
        .checked_mul(600) // 6% = 600 bps
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(10000)
        .ok_or(CurveError::ArithmeticOverflow)?;

    total_return
        .checked_sub(fee_amount)
        .ok_or(CurveError::ArithmeticOverflow)
}
```

### Example Prices

| Supply | Price (SOL) | Notes |
|--------|-------------|-------|
| 0 | 0.05000 | Base price |
| 10 | 0.05312 | Small exponential effect |
| 50 | 0.06635 | Linear + exp growing |
| 100 | 0.08422 | Noticeable curve |
| 500 | 0.21180 | Strong growth |
| 1000 | 0.43954 | Exponential dominant |

**Target**: Reach ~32 SOL reserve at ~350-400 keys sold (depending on buy pattern)

---

## 4. Fee Structure

### ❌ OLD Fee Split (DO NOT USE)
```
94% Reserve
3% Creator (instant)
2% Platform (instant)
1% Referral (instant)
```

### ✅ NEW Fee Split (UNIFIED)

```rust
pub const RESERVE_BPS: u128 = 9400;  // 94%
pub const REWARDS_BPS: u128 = 400;   // 4% (replaces creator 3% + referral 1%)
pub const PLATFORM_BPS: u128 = 200;  // 2%
pub const BPS_DENOMINATOR: u128 = 10000;
```

### Fee Distribution on Buy

```rust
pub fn distribute_buy_fees(total_cost: u128) -> Result<FeeDistribution> {
    let reserve = total_cost
        .checked_mul(RESERVE_BPS)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let rewards = total_cost
        .checked_mul(REWARDS_BPS)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let platform = total_cost
        .checked_mul(PLATFORM_BPS)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    Ok(FeeDistribution {
        reserve,
        rewards,
        platform,
    })
}

// Transfer flow:
// 1. buyer → reserve_vault (94%)
// 2. buyer → rewards_vault (4%)
// 3. buyer → platform_treasury (2%)
```

### Fee Distribution on Sell

```rust
// Unified 6% fee (same as buy)
// Proceeds go back into reserve minus 6% fee

pub fn distribute_sell_fees(gross_return: u128) -> Result<SellDistribution> {
    let fee_total = gross_return
        .checked_mul(600) // 6% total
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(10000)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let net_to_seller = gross_return
        .checked_sub(fee_total)
        .ok_or(CurveError::ArithmeticOverflow)?;

    // Fee split (6% total):
    // - 4% to rewards vault
    // - 2% to platform
    let rewards_fee = fee_total
        .checked_mul(400)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(600)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let platform_fee = fee_total
        .checked_sub(rewards_fee)
        .ok_or(CurveError::ArithmeticOverflow)?;

    Ok(SellDistribution {
        to_seller: net_to_seller,
        to_rewards: rewards_fee,
        to_platform: platform_fee,
    })
}
```

### **IMPORTANT**: No Creator Instant Fees

In the new model:
- ❌ **No 3% instant creator fee** on every trade
- ✅ **Creator earns from**:
  - Holding keys (value appreciation)
  - Token allocation at launch (if they hold keys)
  - Campaign/rewards vault allocation (separate system)

**Rationale**: Cleaner model, aligns incentives with token launch, reduces complexity

---

## 5. Freeze & Launch Mechanics

### Freeze Triggers (3 Types)

#### 5.1 Manual Freeze (Owner Control)

```rust
pub fn freeze_manual(ctx: Context<FreezeCurve>) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    // SECURITY: Only owner can manually freeze
    require!(
        curve.creator == ctx.accounts.owner.key(),
        CurveError::Unauthorized
    );

    // SECURITY: Must be Active
    require!(
        curve.status == CurveStatus::Active,
        CurveError::InvalidStatusTransition
    );

    // SECURITY: Idempotency - check not already frozen
    require!(
        curve.freeze_ts.is_none(),
        CurveError::AlreadyFrozen
    );

    // Execute freeze
    execute_freeze(curve, "manual")?;

    msg!("Curve manually frozen by owner");
    Ok(())
}
```

#### 5.2 Auto-Freeze by Reserve Threshold

```rust
pub fn freeze_if_reserve(ctx: Context<AutoFreezeCurve>) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    // Must be Active
    require!(
        curve.status == CurveStatus::Active,
        CurveError::InvalidStatusTransition
    );

    // Check reserve threshold
    let target = curve.target_reserve; // Default: 32 SOL = 32_000_000_000 lamports
    require!(
        curve.reserve_balance >= target as u128,
        CurveError::ReserveThresholdNotMet
    );

    // Idempotency check
    require!(
        curve.freeze_ts.is_none(),
        CurveError::AlreadyFrozen
    );

    // Execute freeze
    execute_freeze(curve, "reserve_threshold")?;

    msg!("Auto-frozen: Reserve {} >= target {}", curve.reserve_balance, target);
    Ok(())
}
```

#### 5.3 Auto-Freeze by Time

```rust
pub fn freeze_if_time(ctx: Context<AutoFreezeCurve>) -> Result<()> {
    let curve = &mut ctx.accounts.curve;
    let clock = Clock::get()?;

    // Must be Active
    require!(
        curve.status == CurveStatus::Active,
        CurveError::InvalidStatusTransition
    );

    // Check if launch_ts is set
    let launch_ts = curve.launch_ts
        .ok_or(CurveError::LaunchTimeNotSet)?;

    // Check time threshold
    require!(
        clock.unix_timestamp >= launch_ts,
        CurveError::LaunchTimeNotReached
    );

    // Idempotency check
    require!(
        curve.freeze_ts.is_none(),
        CurveError::AlreadyFrozen
    );

    // Execute freeze
    execute_freeze(curve, "time_based")?;

    msg!("Auto-frozen: Time {} >= launch_ts {}", clock.unix_timestamp, launch_ts);
    Ok(())
}
```

### Freeze Execution (Shared Logic)

```rust
fn execute_freeze(curve: &mut BondingCurve, trigger: &str) -> Result<()> {
    let clock = Clock::get()?;

    // 1. Update status
    curve.status = CurveStatus::Frozen;
    curve.freeze_ts = Some(clock.unix_timestamp);
    curve.freeze_trigger = Some(trigger.to_string());

    // 2. Lock supply and reserve
    curve.supply_at_freeze = curve.supply;
    curve.reserve_at_freeze = curve.reserve_balance;

    // 3. Emit event for off-chain snapshot
    emit!(CurveFrozenEvent {
        curve_id: curve.key(),
        trigger: trigger.to_string(),
        supply: curve.supply,
        reserve: curve.reserve_balance,
        timestamp: clock.unix_timestamp,
    });

    msg!("🧊 FROZEN | Supply: {} | Reserve: {} SOL | Trigger: {}",
        curve.supply,
        curve.reserve_balance / 1_000_000_000,
        trigger
    );

    Ok(())
}
```

### Snapshot (Off-Chain + On-Chain Root)

**Process**:
1. Listen for `CurveFrozenEvent`
2. Query all `KeyHolder` accounts for this curve
3. Build Merkle tree: `{holder_pubkey, key_amount}`
4. Store Merkle root on-chain in `Snapshot` account
5. Store full tree off-chain (IPFS/backend)

```rust
#[account]
pub struct Snapshot {
    pub curve: Pubkey,
    pub merkle_root: [u8; 32],
    pub total_supply: u128,
    pub total_holders: u32,
    pub created_at: i64,
    pub bump: u8,
}

pub fn create_snapshot(
    ctx: Context<CreateSnapshot>,
    merkle_root: [u8; 32],
    total_holders: u32,
) -> Result<()> {
    let curve = &ctx.accounts.curve;
    let snapshot = &mut ctx.accounts.snapshot;

    // Verify curve is frozen
    require!(
        curve.status == CurveStatus::Frozen,
        CurveError::CurveNotFrozen
    );

    // Store snapshot
    snapshot.curve = curve.key();
    snapshot.merkle_root = merkle_root;
    snapshot.total_supply = curve.supply_at_freeze;
    snapshot.total_holders = total_holders;
    snapshot.created_at = Clock::get()?.unix_timestamp;
    snapshot.bump = ctx.bumps.snapshot;

    // Update curve
    curve.snapshot_root = Some(merkle_root);

    msg!("📸 Snapshot created | Root: {:?} | Holders: {}", merkle_root, total_holders);
    Ok(())
}
```

### Launch Instruction

```rust
pub fn launch(
    ctx: Context<LaunchToken>,
    token_mint: Pubkey,
    lp_params: LPParams,
) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    // SECURITY: Only owner
    require!(
        curve.creator == ctx.accounts.owner.key(),
        CurveError::Unauthorized
    );

    // SECURITY: Must be Frozen
    require!(
        curve.status == CurveStatus::Frozen,
        CurveError::CurveNotFrozen
    );

    // SECURITY: Snapshot must exist
    require!(
        curve.snapshot_root.is_some(),
        CurveError::SnapshotNotCreated
    );

    // SECURITY: Idempotency
    require!(
        curve.token_mint.is_none(),
        CurveError::AlreadyLaunched
    );

    // STEP 1: Set launching flag (prevent re-entry)
    curve.is_launching = true;

    // STEP 2: Split reserve (25% LP, 50% campaign, 25% utility)
    let total_reserve = curve.reserve_at_freeze;

    let lp_amount = total_reserve
        .checked_mul(25)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(CurveError::ArithmeticOverflow)?; // 25%

    let campaign_amount = total_reserve
        .checked_mul(50)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(CurveError::ArithmeticOverflow)?; // 50%

    let utility_amount = total_reserve
        .checked_mul(25)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(CurveError::ArithmeticOverflow)?; // 25%

    // STEP 3: Transfer to vaults
    // (Assumes vaults are PDAs created earlier or passed in)

    // LP vault
    transfer_from_reserve(
        &ctx.accounts.reserve_vault,
        &ctx.accounts.lp_vault,
        lp_amount,
        &[/* signer seeds */]
    )?;

    // Campaign vault
    transfer_from_reserve(
        &ctx.accounts.reserve_vault,
        &ctx.accounts.campaign_vault,
        campaign_amount,
        &[/* signer seeds */]
    )?;

    // Utility vault
    transfer_from_reserve(
        &ctx.accounts.reserve_vault,
        &ctx.accounts.utility_vault,
        utility_amount,
        &[/* signer seeds */]
    )?;

    // STEP 4: Call Pump.fun API (off-chain via CPI or mock for now)
    // In production: CPI to Pump.fun program or trigger via event
    msg!("🚀 Token creation triggered: {}", token_mint);

    // STEP 5: Update curve state
    curve.status = CurveStatus::Launched;
    curve.token_mint = Some(token_mint);
    curve.lp_vault = Some(ctx.accounts.lp_vault.key());
    curve.campaign_vault = Some(ctx.accounts.campaign_vault.key());
    curve.utility_vault = Some(ctx.accounts.utility_vault.key());
    curve.launched_at = Some(Clock::get()?.unix_timestamp);
    curve.is_launching = false;

    // STEP 6: Emit event for airdrop indexer
    emit!(CurveLaunchedEvent {
        curve_id: curve.key(),
        token_mint,
        snapshot_root: curve.snapshot_root.unwrap(),
        supply_at_launch: curve.supply_at_freeze,
        reserve_split: ReserveSplit {
            lp: lp_amount,
            campaign: campaign_amount,
            utility: utility_amount,
        },
    });

    msg!("✅ LAUNCHED | Token: {} | LP: {} | Campaign: {} | Utility: {}",
        token_mint,
        lp_amount / 1_000_000_000,
        campaign_amount / 1_000_000_000,
        utility_amount / 1_000_000_000
    );

    Ok(())
}
```

### Launch Button Availability

**When is launch button enabled?**
- ✅ Curve status == `Frozen`
- ✅ Snapshot created (`snapshot_root` is set)
- ✅ Owner is authenticated

**Why manual button even with auto-freeze?**
- Auto-freeze may be disabled by config
- Team may want to time announcement
- Allows final checks before token mint
- Maintains control over process

---

## 6. Smart Contract Architecture

### Program Structure

```
launchos-curve/
├── src/
│   ├── lib.rs          # Main program logic
│   ├── state.rs        # Account structures
│   ├── errors.rs       # Custom errors
│   ├── math.rs         # Curve formula + helpers (NEW)
│   └── events.rs       # Event definitions (NEW)
├── Cargo.toml
└── Xargo.toml
```

### Key Modules

#### `math.rs` (NEW - Critical)
```rust
// Hybrid exponential curve implementation
pub mod curve_math {
    pub fn calculate_price_at_supply(supply: u128) -> Result<u128>;
    pub fn calculate_buy_cost(supply: u128, amount: u64) -> Result<u128>;
    pub fn calculate_sell_return(supply: u128, amount: u64) -> Result<u128>;
    pub fn approximate_power(x: u128, num: u32, denom: u32) -> Result<u128>;
}

// Fee calculations
pub mod fee_math {
    pub fn distribute_buy_fees(total: u128) -> Result<FeeDistribution>;
    pub fn distribute_sell_fees(total: u128) -> Result<SellDistribution>;
}
```

#### `events.rs` (NEW)
```rust
#[event]
pub struct CurveFrozenEvent {
    pub curve_id: Pubkey,
    pub trigger: String,
    pub supply: u128,
    pub reserve: u128,
    pub timestamp: i64,
}

#[event]
pub struct CurveLaunchedEvent {
    pub curve_id: Pubkey,
    pub token_mint: Pubkey,
    pub snapshot_root: [u8; 32],
    pub supply_at_launch: u128,
    pub reserve_split: ReserveSplit,
}
```

---

## 7. Storage Schema

### BondingCurve Account (UPDATED)

```rust
#[account]
pub struct BondingCurve {
    // Identity
    pub creator: Pubkey,                    // 32
    pub twitter_handle: String,              // 4 + 32
    pub curve_type: CurveType,               // 1

    // State
    pub status: CurveStatus,                 // 1
    pub supply: u128,                        // 16
    pub reserve_balance: u128,               // 16

    // Timestamps
    pub created_at: i64,                     // 8
    pub activated_at: i64,                   // 8

    // Creator lock (anti-sniper)
    pub creator_unlock_time: i64,            // 8

    // Freeze system (NEW)
    pub launch_ts: Option<i64>,              // 1 + 8 = 9
    pub target_reserve: u64,                 // 8 (default: 32e9)
    pub freeze_ts: Option<i64>,              // 1 + 8 = 9
    pub freeze_trigger: Option<String>,      // 1 + 4 + 20 = 25
    pub supply_at_freeze: u128,              // 16
    pub reserve_at_freeze: u128,             // 16

    // Snapshot (NEW)
    pub snapshot_root: Option<[u8; 32]>,     // 1 + 32 = 33

    // Launch (NEW)
    pub token_mint: Option<Pubkey>,          // 1 + 32 = 33
    pub lp_vault: Option<Pubkey>,            // 1 + 32 = 33
    pub campaign_vault: Option<Pubkey>,      // 1 + 32 = 33
    pub utility_vault: Option<Pubkey>,       // 1 + 32 = 33
    pub launched_at: Option<i64>,            // 1 + 8 = 9
    pub is_launching: bool,                  // 1 (reentrancy flag)

    // Fees collected
    pub creator_fees_collected: u128,        // 16 (DEPRECATED - keep for migration)
    pub rewards_fees_collected: u128,        // 16 (NEW - tracks 4% pool)

    // Stats
    pub total_buys: u64,                     // 8
    pub total_sells: u64,                    // 8

    // Platform
    pub platform_treasury: Pubkey,           // 32

    // Security
    pub reentrancy_guard: bool,              // 1

    // PDA
    pub reserve_bump: u8,                    // 1
    pub bump: u8,                            // 1
}

impl BondingCurve {
    // Space calculation (updated)
    pub const LEN: usize = 8 + // discriminator
        32 + // creator
        (4 + 32) + // twitter_handle
        1 + // curve_type
        1 + // status
        16 + // supply
        16 + // reserve_balance
        8 + // created_at
        8 + // activated_at
        8 + // creator_unlock_time
        9 + // launch_ts
        8 + // target_reserve
        9 + // freeze_ts
        25 + // freeze_trigger
        16 + // supply_at_freeze
        16 + // reserve_at_freeze
        33 + // snapshot_root
        33 + // token_mint
        33 + // lp_vault
        33 + // campaign_vault
        33 + // utility_vault
        9 + // launched_at
        1 + // is_launching
        16 + // creator_fees_collected (deprecated)
        16 + // rewards_fees_collected
        8 + // total_buys
        8 + // total_sells
        32 + // platform_treasury
        1 + // reentrancy_guard
        1 + // reserve_bump
        1; // bump
    // TOTAL: ~450 bytes (add padding: 512 bytes recommended)
}
```

### Snapshot Account (NEW)

```rust
#[account]
pub struct Snapshot {
    pub curve: Pubkey,              // 32
    pub merkle_root: [u8; 32],      // 32
    pub total_supply: u128,         // 16
    pub total_holders: u32,         // 4
    pub created_at: i64,            // 8
    pub bump: u8,                   // 1
}

impl Snapshot {
    pub const LEN: usize = 8 + 32 + 32 + 16 + 4 + 8 + 1;
    // TOTAL: 101 bytes (pad to 128)
}
```

### RewardsVault Account (NEW)

```rust
#[account]
pub struct RewardsVault {
    pub curve: Pubkey,              // 32
    pub balance: u64,               // 8
    pub total_accumulated: u128,    // 16
    pub bump: u8,                   // 1
}

impl RewardsVault {
    pub const LEN: usize = 8 + 32 + 8 + 16 + 1;
    // TOTAL: 65 bytes (pad to 128)
}
```

---

## 8. Instructions Reference

### Complete Instruction List

```rust
#[program]
pub mod launchos_curve {
    use super::*;

    // === SETUP (Admin) ===
    pub fn initialize(
        ctx: Context<Initialize>,
        platform_treasury: Pubkey,
        target_reserve_default: u64, // e.g., 32e9 lamports
    ) -> Result<()>

    pub fn initialize_ban_list(ctx: Context<InitializeBanList>) -> Result<()>

    // === ANTI-SNIPER FLOW ===
    pub fn create_curve(
        ctx: Context<CreateCurve>,
        twitter_handle: String,
        curve_type: CurveType,
        launch_ts: Option<i64>, // For time-based auto-freeze
    ) -> Result<()>

    pub fn creator_initial_buy(
        ctx: Context<CreatorInitialBuy>,
        amount: u64,
    ) -> Result<()>

    pub fn activate_curve(ctx: Context<ActivateCurve>) -> Result<()>

    // === TRADING ===
    pub fn buy_keys(
        ctx: Context<BuyKeys>,
        amount: u64,
        referrer: Option<Pubkey>, // DEPRECATED in new model
    ) -> Result<()>

    pub fn sell_keys(
        ctx: Context<SellKeys>,
        amount: u64,
    ) -> Result<()>

    // === FREEZE SYSTEM (NEW) ===
    pub fn freeze_manual(ctx: Context<FreezeCurve>) -> Result<()>

    pub fn freeze_if_reserve(ctx: Context<AutoFreezeCurve>) -> Result<()>

    pub fn freeze_if_time(ctx: Context<AutoFreezeCurve>) -> Result<()>

    // === SNAPSHOT (NEW) ===
    pub fn create_snapshot(
        ctx: Context<CreateSnapshot>,
        merkle_root: [u8; 32],
        total_holders: u32,
    ) -> Result<()>

    // === LAUNCH (NEW) ===
    pub fn launch(
        ctx: Context<LaunchToken>,
        token_mint: Pubkey,
        lp_params: LPParams,
    ) -> Result<()>

    // === MODERATION ===
    pub fn report_bot(
        ctx: Context<ReportBot>,
        reported_account: Pubkey,
    ) -> Result<()>

    pub fn ban_account(
        ctx: Context<BanAccount>,
        account_to_ban: Pubkey,
    ) -> Result<()>

    pub fn pause(ctx: Context<AdminAction>) -> Result<()>

    pub fn unpause(ctx: Context<AdminAction>) -> Result<()>
}
```

---

## 9. Security Requirements

### Critical Security Checklist

- [ ] **Arithmetic**: All math uses `checked_*` operations
- [ ] **Reentrancy**: All state-changing functions have guard
- [ ] **Access Control**: All admin functions check authority
- [ ] **Status Validation**: All operations check correct state
- [ ] **Idempotency**: Freeze/launch cannot execute twice
- [ ] **Overflow Prevention**: Use `u128` for balances
- [ ] **PDA Validation**: All accounts verified via seeds
- [ ] **Bounds Checking**: Amount limits enforced
- [ ] **Time Checks**: Clock used correctly for locks
- [ ] **Event Emission**: All state changes emit events

### Attack Vectors to Mitigate

1. **Reentrancy**: Guard set before external calls
2. **Integer overflow**: Checked arithmetic everywhere
3. **Front-running**: Anti-sniper 3-step flow
4. **Price manipulation**: Formula is deterministic
5. **Sybil attacks**: Ban list + admin monitoring
6. **Unauthorized freeze**: Only owner can manually freeze
7. **Double launch**: `is_launching` flag + status check
8. **Reserve drainage**: Vault controlled by PDAs

---

## 10. Testing Requirements

### Unit Tests (Rust)

```rust
#[cfg(test)]
mod tests {
    // Formula tests
    #[test]
    fn test_hybrid_curve_formula()

    #[test]
    fn test_buy_cost_calculation()

    #[test]
    fn test_sell_return_calculation()

    // Fee tests
    #[test]
    fn test_fee_distribution_buy()

    #[test]
    fn test_fee_distribution_sell()

    // State machine tests
    #[test]
    fn test_pending_to_active()

    #[test]
    fn test_active_to_frozen()

    #[test]
    fn test_frozen_to_launched()

    #[test]
    fn test_invalid_state_transitions()

    // Freeze tests
    #[test]
    fn test_manual_freeze_by_owner()

    #[test]
    fn test_auto_freeze_at_32_sol()

    #[test]
    fn test_auto_freeze_at_time()

    #[test]
    fn test_freeze_idempotency()

    // Launch tests
    #[test]
    fn test_launch_reserve_split()

    #[test]
    fn test_launch_idempotency()

    #[test]
    fn test_launch_only_when_frozen()

    // Security tests
    #[test]
    fn test_reentrancy_protection()

    #[test]
    fn test_overflow_prevention()

    #[test]
    fn test_unauthorized_access()
}
```

### Integration Tests (TypeScript)

```typescript
describe("LaunchOS Curve Program", () => {
  describe("Anti-Sniper Flow", () => {
    it("should create curve in PENDING state")
    it("should require creator initial buy")
    it("should activate curve to ACTIVE")
    it("should block public buys before activation")
  })

  describe("Freeze System", () => {
    it("should freeze manually by owner")
    it("should auto-freeze at 32 SOL reserve")
    it("should auto-freeze at launch_ts")
    it("should block trading when frozen")
    it("should prevent double freeze")
  })

  describe("Launch Flow", () => {
    it("should create snapshot after freeze")
    it("should split reserve 25/50/25")
    it("should emit launch event")
    it("should prevent launch before freeze")
    it("should prevent double launch")
  })

  describe("Trading", () => {
    it("should calculate buy cost correctly")
    it("should distribute fees correctly")
    it("should calculate sell return correctly")
    it("should block trading in Frozen state")
    it("should block trading in Launched state")
  })
})
```

### Stress Tests

```typescript
describe("Stress Tests", () => {
  it("should handle 1000+ sequential buys")
  it("should handle 100+ holders snapshot")
  it("should prevent reserve drainage attacks")
  it("should handle edge case: supply = 0")
  it("should handle edge case: sell entire supply")
})
```

---

## 11. API Integration

### Backend Endpoints (New)

```typescript
// Freeze endpoints
POST /api/curve/:id/freeze
  Body: { mode: "manual" | "reserve" | "time" }

GET /api/curve/:id/freeze-status
  Response: {
    canFreeze: boolean,
    trigger: string | null,
    reserve: number,
    targetReserve: number,
    launchTs: number | null,
  }

// Snapshot endpoints
GET /api/curve/:id/snapshot
  Response: {
    merkleRoot: string,
    holders: Array<{address: string, keys: number}>,
    totalSupply: number,
  }

POST /api/curve/:id/snapshot
  Body: { merkleRoot: string, holders: object }

// Launch endpoints
POST /api/curve/:id/launch
  Body: {
    holderPoolPct: number, // e.g., 20
    lpPct: number,         // 25
    campaignPct: number,   // 50
    utilityPct: number,    // 25
  }

GET /api/curve/:id/launch-status
  Response: {
    canLaunch: boolean,
    isFrozen: boolean,
    hasSnapshot: boolean,
    tokenMint: string | null,
  }

// State endpoint
GET /api/curve/:id/state
  Response: {
    status: "pending" | "active" | "frozen" | "launched",
    supply: number,
    reserve: number,
    freezeTs: number | null,
    launchedAt: number | null,
  }
```

---

## 12. Migration Path

### From Current Implementation to V4

```rust
// Migration instruction
pub fn migrate_to_v4(ctx: Context<MigrateCurve>) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    // Add new fields with defaults
    curve.launch_ts = None;
    curve.target_reserve = 32_000_000_000; // 32 SOL
    curve.freeze_ts = None;
    curve.freeze_trigger = None;
    curve.supply_at_freeze = 0;
    curve.reserve_at_freeze = 0;
    curve.snapshot_root = None;
    curve.token_mint = None;
    curve.lp_vault = None;
    curve.campaign_vault = None;
    curve.utility_vault = None;
    curve.launched_at = None;
    curve.is_launching = false;
    curve.rewards_fees_collected = 0;

    // Keep existing state intact
    // status, supply, reserve_balance, etc. stay the same

    msg!("Curve migrated to V4");
    Ok(())
}
```

---

## 13. Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (unit + integration)
- [ ] Security audit completed
- [ ] Math verified (curve formula)
- [ ] Gas cost analysis done
- [ ] Event emission verified
- [ ] Error messages clear

### Deployment Steps
1. [ ] Build program: `anchor build`
2. [ ] Get program ID from build
3. [ ] Update `Anchor.toml` with ID
4. [ ] Update `declare_id!()` in `lib.rs`
5. [ ] Rebuild: `anchor build`
6. [ ] Deploy to devnet: `anchor deploy --provider.cluster devnet`
7. [ ] Verify program ID on Solana Explorer
8. [ ] Run integration tests on devnet
9. [ ] Deploy to mainnet (when ready)

### Post-Deployment
- [ ] Initialize program config
- [ ] Initialize ban list
- [ ] Set platform treasury address
- [ ] Set target reserve (32 SOL)
- [ ] Monitor first transactions
- [ ] Set up event indexer

---

## 14. Critical Implementation Notes

### 🚨 MUST DO
1. **Use hybrid exponential formula** (not linear)
2. **Unified 6% fee model** (94% reserve, 4% rewards, 2% platform)
3. **Three freeze triggers** (manual, reserve, time)
4. **Snapshot Merkle root** on freeze
5. **Reserve split 25/50/25** on launch
6. **Idempotency checks** on freeze + launch
7. **Reentrancy guards** on all state changes
8. **Checked arithmetic** everywhere

### ❌ DO NOT
1. ~~Use linear formula~~ (outdated)
2. ~~Give 3% instant creator fee~~ (removed in V4)
3. ~~Use 5% separate sell tax~~ (unified to 6%)
4. ~~Allow trading in Frozen/Launched states~~
5. ~~Skip idempotency checks~~
6. ~~Use unchecked arithmetic~~

---

## 15. Success Criteria

### Functional Requirements Met
- ✅ Anti-sniper 3-step flow works
- ✅ Hybrid curve formula correct
- ✅ Fees distributed as specified (94-4-2)
- ✅ Auto-freeze at 32 SOL works
- ✅ Manual freeze by owner works
- ✅ Time-based freeze works
- ✅ Snapshot created on freeze
- ✅ Launch splits reserve correctly
- ✅ Token mint triggered
- ✅ Events emitted for indexer

### Security Requirements Met
- ✅ No reentrancy vulnerabilities
- ✅ No integer overflow possible
- ✅ Access control enforced
- ✅ Idempotency guaranteed
- ✅ PDA validation correct
- ✅ Time locks respected

### Performance Requirements Met
- ✅ Buy transaction < 200k CU
- ✅ Sell transaction < 200k CU
- ✅ Freeze transaction < 100k CU
- ✅ Launch transaction < 300k CU
- ✅ Account rent-exempt
- ✅ No unnecessary copying

---

## 16. Appendix: Formula Comparison

### Visual Comparison

```
Linear (OLD):
Supply    Price
0         0.010
50        0.015
100       0.020
500       0.060
1000      0.110

Hybrid Exponential (NEW):
Supply    Price
0         0.050
50        0.066
100       0.084
500       0.212
1000      0.440

Growth rate: ~4x faster → reaches 32 SOL sooner
```

---

**END OF SPECIFICATION**

This document is the **single source of truth** for implementation. Any questions or ambiguities should be resolved BEFORE coding begins.

**Version**: 4.0
**Date**: 2025-01-12
**Author**: LaunchOS Team
**Status**: FINAL - Ready for Implementation
