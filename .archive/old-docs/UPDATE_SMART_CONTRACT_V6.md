# 🔧 Smart Contract V6 Updates Required

## Current Fee Structure (OLD - in contract now):
```rust
pub const RESERVE_BPS: u128 = 9400;  // 94%
pub const INSTANT_BPS: u128 = 200;   // 2% instant (referrer OR creator)
pub const REWARDS_BPS: u128 = 200;   // 2% rewards vault
pub const PLATFORM_BPS: u128 = 200;  // 2% platform
```

## Required V6 Fee Structure:
```rust
pub const RESERVE_BPS: u128 = 9400;     // 94% to reserve
pub const REFERRAL_BPS: u128 = 300;     // 3% referral (flexible)
pub const PROJECT_BPS: u128 = 100;      // 1% project (guaranteed)
pub const BUYBACK_BPS: u128 = 100;      // 1% buyback/burn
pub const COMMUNITY_BPS: u128 = 100;    // 1% community rewards
```

## Changes Needed in `lib.rs`:

### 1. Update Fee Constants (lines 15-19)
```rust
// OLD:
pub const RESERVE_BPS: u128 = 9400;      // 94% to reserve
pub const INSTANT_BPS: u128 = 200;       // 2% instant (referrer OR creator)
pub const BUYBACK_BPS: u128 = 100;       // 1% buyback/burn wallet
pub const COMMUNITY_BPS: u128 = 100;     // 1% community rewards
pub const PLATFORM_BPS: u128 = 200;      // 2% platform

// NEW V6:
pub const RESERVE_BPS: u128 = 9400;      // 94% to reserve
pub const REFERRAL_BPS: u128 = 300;      // 3% referral (flexible routing)
pub const PROJECT_BPS: u128 = 100;       // 1% project (guaranteed minimum)
pub const BUYBACK_BPS: u128 = 100;       // 1% buyback/burn
pub const COMMUNITY_BPS: u128 = 100;     // 1% community rewards
```

### 2. Update Fee Distribution Logic in `buy_keys` instruction

Find the fee calculation section and update to V6 routing:

```rust
// Calculate V6 fee distribution
let referral_fee = total_cost
    .checked_mul(REFERRAL_BPS)
    .unwrap()
    .checked_div(BPS_DENOMINATOR)
    .unwrap();

let project_fee = total_cost
    .checked_mul(PROJECT_BPS)
    .unwrap()
    .checked_div(BPS_DENOMINATOR)
    .unwrap();

// Route referral fee based on ref_code
match referrer {
    Some(ref_pubkey) if ref_pubkey == curve.creator => {
        // Project self-referral: Gets 3% + 1% = 4%
        transfer_to_creator(referral_fee + project_fee)?;
    },
    Some(ref_pubkey) => {
        // User referral: User gets 3%, Project gets 1%
        transfer_to_referrer(referral_fee)?;
        transfer_to_creator(project_fee)?;
    },
    None => {
        // No referral: Project gets 2%, Community gets 2%
        transfer_to_creator(total_cost * 200 / 10000)?; // 2%
        transfer_to_community(total_cost * 200 / 10000)?; // 2%
    }
}
```

### 3. Remove Auto-Freeze Logic

Find and remove any auto-freeze at 32 SOL:

```rust
// REMOVE THIS:
if curve.reserve_balance >= curve.target_reserve {
    curve.status = CurveStatus::Frozen;
    // Auto-freeze logic
}

// Keep only manual freeze
```

### 4. Update Curve Math (if not hybrid exponential)

Current formula should be:
```rust
// V6 Hybrid Exponential Formula
// P(S) = 0.05 + 0.0003 * S + 0.0000012 * S^1.6

pub fn calculate_price_v6(supply: u128) -> Result<u128> {
    let base = 50_000_000; // 0.05 SOL in lamports
    let linear = supply
        .checked_mul(300_000)? // 0.0003
        .checked_div(1_000_000)?;

    // For S^1.6, approximate with integer math
    let exp_base = supply.pow(8) / supply.pow(5); // Approximates S^1.6
    let exponential = exp_base
        .checked_mul(1_200)? // 0.0000012
        .checked_div(1_000_000)?;

    Ok(base + linear + exponential)
}
```

### 5. Add Direct Wallet Transfers (No PDAs for fees)

Update transfer logic to send directly to Privy wallets:

```rust
// Direct transfers to wallets (no PDAs)
invoke(
    &system_instruction::transfer(
        buyer_account.key,
        project_wallet.key,  // Direct to Privy wallet
        project_fee,
    ),
    &[buyer_account.clone(), project_wallet.clone()],
)?;
```

## Build & Deploy Commands:

```bash
cd solana-program

# Build the updated contract
anchor build

# Run tests to ensure everything works
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Get the program ID from output
# Example output: Program Id: CuRvE6x7x8x8x8x8x8x8x8x8x8x8x8x8x8x8x8

# Update the program ID in lib.rs
# declare_id!("CuRvE6x7x8x8x8x8x8x8x8x8x8x8x8x8x8x8x8");

# Update .env.local with the program ID
NEXT_PUBLIC_CURVE_PROGRAM_ID=CuRvE6x7x8x8x8x8x8x8x8x8x8x8x8x8x8x8x8
```

## Testing After Deployment:

1. Create a curve
2. Buy keys with referral
3. Buy keys without referral
4. Verify fees go to correct wallets
5. Test manual freeze (no auto-freeze)
6. Test launch flow

## Time Estimate:

- Update code: 1 hour
- Build & test: 30 min
- Deploy: 30 min
- Verify: 30 min

**Total: 2.5 hours**