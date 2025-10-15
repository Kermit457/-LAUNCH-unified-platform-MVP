# 🎯 CURVE SPECIFICATION V4 - ADDENDUM
## Instant Referral System (Option A - RECOMMENDED)

**Date**: 2025-01-12
**Updates**: Section 4 (Fee Structure)
**Reason**: Better viral growth + simpler implementation

---

## 📊 UPDATED FEE STRUCTURE

### ✅ NEW Model: Instant Referrals (RECOMMENDED)

```rust
pub const RESERVE_BPS: u128 = 9400;     // 94% (unchanged)
pub const REFERRAL_BPS: u128 = 200;     // 2% (instant to referrer)
pub const REWARDS_BPS: u128 = 200;      // 2% (accumulated in vault)
pub const PLATFORM_BPS: u128 = 200;     // 2% (unchanged)
pub const BPS_DENOMINATOR: u128 = 10000;
```

### Fee Split - Two Scenarios

#### Scenario 1: WITH Referrer (Viral Growth)
```
Total: 100 SOL purchase

├─ 94 SOL  → Reserve Vault (backing curve)
├─ 2 SOL   → Referrer Wallet (INSTANT) ⚡
├─ 2 SOL   → Rewards Vault (accumulated)
└─ 2 SOL   → Platform Treasury

Result: Referrer gets paid instantly!
```

#### Scenario 2: WITHOUT Referrer (Organic)
```
Total: 100 SOL purchase

├─ 94 SOL  → Reserve Vault
├─ 4 SOL   → Rewards Vault (2% base + 2% unclaimed referral)
└─ 2 SOL   → Platform Treasury

Result: More funds for campaigns/rewards!
```

---

## 💻 IMPLEMENTATION

### Updated Fee Distribution Function

```rust
#[derive(Debug, Clone)]
pub struct FeeDistribution {
    pub reserve: u128,
    pub referrer: u128,         // 0 if no referrer
    pub rewards_vault: u128,
    pub platform: u128,
}

pub fn distribute_buy_fees(
    total_cost: u128,
    has_referrer: bool,
) -> Result<FeeDistribution> {
    // Calculate each component
    let reserve = total_cost
        .checked_mul(RESERVE_BPS)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let platform = total_cost
        .checked_mul(PLATFORM_BPS)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let referral_amount = total_cost
        .checked_mul(REFERRAL_BPS)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let rewards_base = total_cost
        .checked_mul(REWARDS_BPS)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    if has_referrer {
        // Split: 2% instant + 2% vault
        Ok(FeeDistribution {
            reserve,
            referrer: referral_amount,      // 2% to referrer ⚡
            rewards_vault: rewards_base,    // 2% to vault
            platform,
        })
    } else {
        // All 4% goes to vault
        Ok(FeeDistribution {
            reserve,
            referrer: 0,                    // None
            rewards_vault: referral_amount
                .checked_add(rewards_base)
                .ok_or(CurveError::ArithmeticOverflow)?, // 4% to vault
            platform,
        })
    }
}
```

### Updated buy_keys Instruction

```rust
pub fn buy_keys(
    ctx: Context<BuyKeys>,
    amount: u64,
    referrer: Option<Pubkey>,
) -> Result<()> {
    let curve = &mut ctx.accounts.curve;
    let config = &ctx.accounts.config;

    // [... security checks ...]

    // Calculate total cost
    let total_cost = curve.calculate_buy_price(amount)?;

    // Distribute fees
    let fees = distribute_buy_fees(total_cost, referrer.is_some())?;

    // 1. UPDATE STATE FIRST (CEI pattern)
    curve.supply = curve.supply.checked_add(amount as u128)?;
    curve.reserve_balance = curve.reserve_balance.checked_add(fees.reserve)?;
    curve.rewards_fees_collected = curve.rewards_fees_collected
        .checked_add(fees.rewards_vault)?;
    curve.total_buys = curve.total_buys.checked_add(1)?;

    // Update holder
    let holder = &mut ctx.accounts.key_holder;
    // [... holder logic ...]

    // 2. THEN DO EXTERNAL CALLS (Interactions)

    // Transfer to reserve (94%)
    anchor_lang::system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.reserve_vault.to_account_info(),
            },
        ),
        fees.reserve as u64,
    )?;

    // Transfer to rewards vault (2% or 4%)
    anchor_lang::system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.rewards_vault.to_account_info(),
            },
        ),
        fees.rewards_vault as u64,
    )?;

    // Transfer to platform (2%)
    anchor_lang::system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.platform_treasury.to_account_info(),
            },
        ),
        fees.platform as u64,
    )?;

    // Transfer to referrer if applicable (2% instant) ⚡
    if let Some(referrer_pubkey) = referrer {
        if fees.referrer > 0 {
            anchor_lang::system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    anchor_lang::system_program::Transfer {
                        from: ctx.accounts.buyer.to_account_info(),
                        to: ctx.accounts.referrer.as_ref().unwrap().to_account_info(),
                    },
                ),
                fees.referrer as u64,
            )?;

            msg!("💰 Referrer earned: {} lamports", fees.referrer);
        }
    }

    // 3. CLEAR REENTRANCY GUARD
    curve.set_reentrancy(false);

    // Emit event
    emit!(KeysPurchasedEvent {
        curve_id: curve.key(),
        buyer: ctx.accounts.buyer.key(),
        amount,
        total_cost,
        referrer,
        referrer_earned: fees.referrer,
    });

    msg!("Keys purchased: {} | Cost: {} | Referrer earned: {}",
        amount,
        total_cost,
        fees.referrer
    );

    Ok(())
}
```

### Updated Account Context

```rust
#[derive(Accounts)]
pub struct BuyKeys<'info> {
    #[account(
        mut,
        seeds = [b"curve", curve.twitter_handle.as_bytes()],
        bump = curve.bump
    )]
    pub curve: Account<'info, BondingCurve>,

    #[account(
        mut,
        seeds = [b"reserve", curve.key().as_ref()],
        bump = curve.reserve_bump
    )]
    /// CHECK: Reserve vault PDA
    pub reserve_vault: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"rewards", curve.key().as_ref()],
        bump
    )]
    /// CHECK: Rewards vault PDA (NEW)
    pub rewards_vault: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = buyer,
        space = KeyHolder::LEN,
        seeds = [b"holder", curve.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub key_holder: Account<'info, KeyHolder>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: Platform treasury for fee distribution
    #[account(mut, address = curve.platform_treasury)]
    pub platform_treasury: AccountInfo<'info>,

    /// CHECK: Optional referrer for instant fee (NEW - optional)
    #[account(mut)]
    pub referrer: Option<AccountInfo<'info>>,

    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, CurveConfig>,

    #[account(seeds = [b"ban_list"], bump)]
    pub ban_list: Account<'info, BanList>,

    pub system_program: Program<'info, System>,
}
```

---

## 📈 COMPARISON: Original vs Updated

| Aspect | Original Spec | Updated (Instant Referral) |
|--------|---------------|---------------------------|
| **Referrer Payment** | Delayed (vault) | Instant ⚡ |
| **Referrer %** | 0% (part of 4% vault) | 2% instant |
| **Rewards Vault** | 4% always | 2-4% (depends on referrer) |
| **Viral Growth** | Slow | Fast 🚀 |
| **Backend Complexity** | High (distribution system) | Low (on-chain instant) |
| **User Experience** | "I'll get paid later" | "I earned 2 SOL now!" |

---

## 🎯 WHY THIS IS BETTER

### 1. **Proven Model**
```
Friend.tech:  5% instant → 100k+ users in 1 week
Arena.xyz:    3% instant → Viral growth
LaunchOS:     2% instant → Strong incentive ✅
```

### 2. **Psychology**
```
❌ Delayed:  "Maybe I'll get something"
✅ Instant:  "I just made money!" → Share more
```

### 3. **Simplicity**
```
❌ Vault model:
   - Track referrals off-chain
   - Build distribution system
   - Handle disputes
   - Batch payments

✅ Instant model:
   - Pay on transaction
   - No tracking needed
   - No disputes
   - Atomic operation
```

### 4. **Fair Fallback**
```
No referrer?
→ Extra 2% goes to rewards vault
→ Used for campaigns, competitions, airdrops
→ Nothing wasted!
```

---

## 💰 REAL EXAMPLES

### Example 1: Early Adopter Referrer

**Scenario**: Alice refers 10 friends who each buy 10 keys

```
Friend 1 buys: 10 keys @ avg 0.055 SOL = 0.55 SOL
  → Alice earns: 0.011 SOL (2%) instantly ⚡

Friend 2 buys: 10 keys @ avg 0.060 SOL = 0.60 SOL
  → Alice earns: 0.012 SOL (2%) instantly ⚡

... (8 more friends)

Total Alice earned: ~0.15 SOL ($25)
In her wallet: IMMEDIATELY
Time: Same second as purchases
```

**Result**: Alice tweets "I just made $25 referring friends to LaunchOS!" → More referrals

### Example 2: Organic Growth (No Referrer)

**Scenario**: Bob discovers curve organically, buys without referral

```
Bob buys: 50 keys @ 2 SOL total

Fee split:
- 94% (1.88 SOL) → Reserve
- 4% (0.08 SOL)  → Rewards Vault (extra 2% since no referrer)
- 2% (0.04 SOL)  → Platform

Rewards vault accumulates for:
  - Future campaigns
  - Holder airdrops
  - Community rewards
```

**Result**: No waste, extra goes to community benefits

### Example 3: Whale Referrer

**Scenario**: Carol is an influencer, refers 100 people

```
Average purchase: 1 SOL
Total volume: 100 SOL
Carol's 2% cut: 2 SOL ($300)

Carol's experience:
  ⚡ Instant payments as people buy
  💰 Notifications: "You earned 0.02 SOL!"
  📊 Dashboard shows real-time earnings
  🎯 Incentive to promote more
```

**Result**: Carol creates YouTube video → More users

---

## 🚀 IMPLEMENTATION CHECKLIST

### Smart Contract Updates
- [ ] Add `referrer: Option<AccountInfo>` to `BuyKeys` context
- [ ] Update `distribute_buy_fees()` with `has_referrer` param
- [ ] Add rewards vault PDA
- [ ] Add instant transfer to referrer (if provided)
- [ ] Update event emission with `referrer_earned`
- [ ] Add `rewards_fees_collected` tracker to `BondingCurve`

### Backend Updates
- [ ] Update API: `POST /api/curve/:id/buy` accepts `referrer` param
- [ ] Track referral links (for analytics)
- [ ] Dashboard: Show referrer earnings
- [ ] Notifications: "You earned X SOL from referral!"

### Frontend Updates
- [ ] Referral link generator: `launchos.io/curve/:id?ref=USER_ID`
- [ ] Extract `?ref=` param on curve page
- [ ] Pass `referrer` pubkey to buy transaction
- [ ] Show "You'll earn 2%" badge when sharing
- [ ] Referral dashboard: Total earned, # referrals, etc.

---

## 🎯 MIGRATION FROM ORIGINAL SPEC

**If you already coded the 4% vault model**:

1. Update constants:
```rust
// Before:
pub const REWARDS_BPS: u128 = 400;  // 4%

// After:
pub const REFERRAL_BPS: u128 = 200;  // 2%
pub const REWARDS_BPS: u128 = 200;   // 2%
```

2. Update fee distribution logic (see above)

3. Add `referrer` parameter to `buy_keys()`

4. Add rewards vault PDA initialization

**Estimated time**: 2-3 hours

---

## ❓ FAQ

### Q: Why not 5% like Friend.tech?
**A**: We also have platform fees (2%). Total = 6% which is competitive. Could adjust if needed.

### Q: What if someone spams fake referrals?
**A**: They'd have to actually buy keys (costs real SOL). Self-referral prevention can be added if needed.

### Q: Can we change referral % later?
**A**: Yes, but requires program upgrade. Start with 2%, can adjust based on data.

### Q: What about referrer of referrer (multi-level)?
**A**: Not in V1. Could add 1% / 0.5% / 0.5% split in V2 if needed.

### Q: Do referrers get paid on sells too?
**A**: No, only on buys. Sells have unified 6% fee (4% rewards, 2% platform).

---

## ✅ RECOMMENDATION

**Implement Option A (Instant Referrals)** because:

1. ✅ Proven to drive viral growth
2. ✅ Better user experience
3. ✅ Simpler implementation
4. ✅ Still accumulates rewards vault (2-4%)
5. ✅ No wasted fees (fallback to vault)
6. ✅ Competitive with other platforms

---

## 🎯 FINAL FEE STRUCTURE SUMMARY

```
BUY WITH REFERRER:
User pays 100 SOL
├─ 94 SOL  → Reserve (for sells)
├─ 2 SOL   → Referrer (instant) ⚡
├─ 2 SOL   → Rewards Vault
└─ 2 SOL   → Platform

BUY WITHOUT REFERRER:
User pays 100 SOL
├─ 94 SOL  → Reserve (for sells)
├─ 4 SOL   → Rewards Vault
└─ 2 SOL   → Platform

SELL (UNIFIED):
User sells for 100 SOL gross
├─ 94 SOL  → User gets (after 6% fee)
├─ 4 SOL   → Rewards Vault
└─ 2 SOL   → Platform
```

**Total**: Always 6% fees, split varies by referrer presence

---

**Questions? Let me know if you want me to implement this!** 🚀
