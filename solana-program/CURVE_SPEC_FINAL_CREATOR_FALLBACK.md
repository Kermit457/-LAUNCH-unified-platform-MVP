# 🎯 CURVE FEE STRUCTURE - FINAL (WITH CREATOR FALLBACK)
## Instant Referral OR Instant Creator Reward

**Date**: 2025-01-12
**Status**: FINAL APPROVED MODEL
**Key Change**: Creator earns 2% when there's NO referrer

---

## 📊 FINAL FEE STRUCTURE

### Constants

```rust
pub const RESERVE_BPS: u128 = 9400;     // 94% (reserve for sells)
pub const INSTANT_BPS: u128 = 200;      // 2% (referrer OR creator)
pub const REWARDS_BPS: u128 = 200;      // 2% (rewards vault)
pub const PLATFORM_BPS: u128 = 200;     // 2% (platform treasury)
pub const BPS_DENOMINATOR: u128 = 10000;
```

### Fee Distribution Logic

```
WITH Referrer:
  100 SOL purchase
  ├─ 94 SOL  → Reserve Vault
  ├─ 2 SOL   → Referrer (INSTANT) ⚡
  ├─ 2 SOL   → Rewards Vault
  └─ 2 SOL   → Platform

WITHOUT Referrer:
  100 SOL purchase
  ├─ 94 SOL  → Reserve Vault
  ├─ 2 SOL   → Creator (INSTANT) ⚡ [FALLBACK]
  ├─ 2 SOL   → Rewards Vault
  └─ 2 SOL   → Platform
```

---

## 💻 SMART CONTRACT IMPLEMENTATION

### Fee Distribution Function

```rust
#[derive(Debug, Clone)]
pub struct FeeDistribution {
    pub reserve: u128,
    pub instant_recipient: u128,    // Goes to referrer OR creator
    pub rewards_vault: u128,
    pub platform: u128,
}

pub fn distribute_buy_fees(
    total_cost: u128,
    has_referrer: bool,
) -> Result<FeeDistribution> {
    let reserve = total_cost
        .checked_mul(RESERVE_BPS)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let instant_amount = total_cost
        .checked_mul(INSTANT_BPS) // 2%
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let rewards = total_cost
        .checked_mul(REWARDS_BPS) // 2%
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    let platform = total_cost
        .checked_mul(PLATFORM_BPS) // 2%
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(CurveError::ArithmeticOverflow)?;

    Ok(FeeDistribution {
        reserve,
        instant_recipient: instant_amount, // 2% to referrer OR creator
        rewards_vault: rewards,            // 2% to vault
        platform,                          // 2% to platform
    })
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

    // SECURITY: Reentrancy check
    require!(curve.check_reentrancy(), CurveError::ReentrancyDetected);
    curve.set_reentrancy(true);

    // SECURITY: Check curve is ACTIVE
    require!(
        curve.status == CurveStatus::Active,
        CurveError::CurveNotActive
    );

    // SECURITY: Check buyer is not banned
    require!(
        !ctx.accounts.ban_list.is_banned(&ctx.accounts.buyer.key()),
        CurveError::AccountBanned
    );

    // SECURITY: Input validation
    curve.validate_amount(amount, config.max_purchase)?;

    // Calculate total cost
    let total_cost = curve.calculate_buy_price(amount)?;

    // Distribute fees
    let fees = distribute_buy_fees(total_cost, referrer.is_some())?;

    // Determine instant recipient: referrer OR creator
    let instant_recipient = if referrer.is_some() {
        ctx.accounts.referrer.as_ref().unwrap().to_account_info()
    } else {
        ctx.accounts.creator.to_account_info()
    };

    // 1. UPDATE STATE FIRST (CEI pattern: Checks-Effects-Interactions)
    curve.supply = curve
        .supply
        .checked_add(amount as u128)
        .ok_or(CurveError::ArithmeticOverflow)?;

    curve.reserve_balance = curve
        .reserve_balance
        .checked_add(fees.reserve)
        .ok_or(CurveError::ArithmeticOverflow)?;

    curve.rewards_fees_collected = curve
        .rewards_fees_collected
        .checked_add(fees.rewards_vault)
        .ok_or(CurveError::ArithmeticOverflow)?;

    // Track creator earnings (for analytics)
    if referrer.is_none() {
        curve.creator_fees_collected = curve
            .creator_fees_collected
            .checked_add(fees.instant_recipient)
            .ok_or(CurveError::ArithmeticOverflow)?;
    }

    curve.total_buys = curve
        .total_buys
        .checked_add(1)
        .ok_or(CurveError::ArithmeticOverflow)?;

    // Update holder
    let holder = &mut ctx.accounts.key_holder;
    let clock = Clock::get()?;
    if holder.amount == 0 {
        // New holder
        holder.owner = ctx.accounts.buyer.key();
        holder.curve = curve.key();
        holder.amount = amount;
        holder.acquired_at = clock.unix_timestamp;
        holder.is_creator = false;
        holder.bump = ctx.bumps.key_holder;
    } else {
        // Existing holder
        holder.amount = holder
            .amount
            .checked_add(amount)
            .ok_or(CurveError::ArithmeticOverflow)?;
    }

    // 2. THEN DO EXTERNAL CALLS (Interactions)

    // Transfer to reserve vault (94%)
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

    // Transfer to instant recipient (2%): referrer OR creator ⚡
    anchor_lang::system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: instant_recipient,
            },
        ),
        fees.instant_recipient as u64,
    )?;

    // Transfer to rewards vault (2%)
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

    // 3. CLEAR REENTRANCY GUARD
    curve.set_reentrancy(false);

    // Emit event
    let recipient_type = if referrer.is_some() {
        "referrer"
    } else {
        "creator"
    };

    msg!(
        "Keys purchased: {} | Cost: {} | {}: {} earned {} lamports",
        amount,
        total_cost,
        recipient_type,
        if referrer.is_some() {
            referrer.unwrap()
        } else {
            curve.creator
        },
        fees.instant_recipient
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
    /// CHECK: Rewards vault PDA
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

    /// CHECK: Creator wallet for fallback fee (when no referrer)
    #[account(mut, address = curve.creator)]
    pub creator: AccountInfo<'info>,

    /// CHECK: Platform treasury
    #[account(mut, address = curve.platform_treasury)]
    pub platform_treasury: AccountInfo<'info>,

    /// CHECK: Optional referrer (if None, creator gets the 2%)
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

## 📊 COMPARISON: All Models

| Model | Referrer Share | Creator Share | Rewards Vault | Notes |
|-------|----------------|---------------|---------------|-------|
| **Original Spec** | 0% | 0% | 4% | All accumulated |
| **Option A (Referral Only)** | 2% instant | 0% | 2-4% | Creator gets nothing organic |
| **Option A+ (FINAL)** | 2% instant | 2% instant (fallback) | 2% | ✅ BEST - Fair to both |

---

## 🎯 WHY THIS IS THE BEST MODEL

### 1. **Fairness**
```
Alice creates curve, promotes it herself
→ Alice earns 2% on organic buys ✅

Bob refers friend to Alice's curve
→ Bob earns 2% on that buy ✅
→ Alice still benefits from key appreciation ✅
```

### 2. **Dual Incentive**
```
Creators: "I earn from my promo efforts!"
Referrers: "I earn from my referrals!"
Both: "Let's promote together!" → Maximum growth
```

### 3. **No Waste**
```
ALWAYS someone gets the 2%:
  ✅ Referrer (if link used)
  ✅ Creator (if organic)
  ❌ Never sits in vault unused
```

### 4. **Competitive**
```
Friend.tech: 5% creator + 5% referrer = 10% total
Arena.xyz:   3% creator + 3% referrer = 6% total
LaunchOS:    2% (creator OR referrer) + 2% rewards + 2% platform = 6% total ✅
```

---

## 💰 REAL EXAMPLES

### Example 1: Organic Traffic (No Referrer)

**Alice creates curve, tweets about it**

```
Bob sees Alice's tweet, visits directly (no ?ref= link)
Bob buys 10 keys for 1 SOL

Fee split:
├─ 0.94 SOL → Reserve Vault
├─ 0.02 SOL → Alice (creator) ⚡ INSTANT
├─ 0.02 SOL → Rewards Vault
└─ 0.02 SOL → Platform

Alice's notification:
"💰 Someone bought your keys! You earned 0.02 SOL"

Alice's incentive:
"I should promote more!" → More tweets
```

### Example 2: Referred Traffic

**Carol shares Alice's curve with ?ref=CAROL**

```
Dave clicks Carol's link
Dave buys 10 keys for 1 SOL

Fee split:
├─ 0.94 SOL → Reserve Vault
├─ 0.02 SOL → Carol (referrer) ⚡ INSTANT
├─ 0.02 SOL → Rewards Vault
└─ 0.02 SOL → Platform

Carol's notification:
"💰 Your referral bought keys! You earned 0.02 SOL"

Carol's incentive:
"I should share more links!" → More referrals

Alice's benefit:
- Curve grows (key value increases)
- More holders → better for token launch
```

### Example 3: Creator Self-Promotion

**Alice is an influencer with 100k followers**

```
Alice tweets: "Buy my keys at launchos.io/alice"
(No ?ref= link, direct)

100 people buy, avg 1 SOL each

Alice earns:
  100 buys × 0.02 SOL = 2 SOL ($300) instant ⚡
  + Her keys appreciate in value
  + Curve becomes valuable for token launch

Alice's ROI:
  Effort: 1 tweet
  Reward: $300 + key appreciation
  Result: Alice promotes more!
```

---

## 🎨 FRONTEND IMPLEMENTATION

### Referral Link Generator

```typescript
// components/curve/ReferralLink.tsx

export function ReferralLink({ curveId, currentUserId }: Props) {
  const referralUrl = `https://launchos.io/curve/${curveId}?ref=${currentUserId}`;

  return (
    <div className="referral-card">
      <h3>Share & Earn 2%</h3>
      <p>Earn 2% of every purchase through your link</p>

      <div className="referral-url">
        <input value={referralUrl} readOnly />
        <button onClick={() => copyToClipboard(referralUrl)}>
          Copy Link
        </button>
      </div>

      <div className="earnings-preview">
        <div className="example">
          <span>If someone buys 10 SOL worth</span>
          <span className="highlight">You earn: 0.2 SOL</span>
        </div>
      </div>

      <div className="share-buttons">
        <button onClick={() => shareToTwitter(referralUrl)}>
          Share on Twitter
        </button>
        <button onClick={() => shareToDiscord(referralUrl)}>
          Share on Discord
        </button>
      </div>
    </div>
  );
}
```

### Creator Dashboard

```typescript
// components/curve/CreatorDashboard.tsx

export function CreatorDashboard({ curve }: Props) {
  return (
    <div className="creator-stats">
      <h3>Your Earnings</h3>

      <div className="stat-grid">
        <StatCard
          label="Organic Sales"
          value={`${curve.creatorFeesCollected} SOL`}
          subtitle="From direct traffic (no referrals)"
          icon="💰"
        />

        <StatCard
          label="Total Volume"
          value={`${curve.totalVolume} SOL`}
          subtitle="All-time trading volume"
          icon="📊"
        />

        <StatCard
          label="Your Keys Value"
          value={`${curve.supply * curve.currentPrice} SOL`}
          subtitle="Your holdings appreciation"
          icon="📈"
        />
      </div>

      <div className="earnings-breakdown">
        <h4>How You Earn</h4>
        <div className="breakdown-list">
          <div className="item">
            <span>✅ Direct buys (organic)</span>
            <span className="highlight">2% instant</span>
          </div>
          <div className="item">
            <span>✅ Key value appreciation</span>
            <span className="highlight">Price growth</span>
          </div>
          <div className="item">
            <span>✅ Token launch allocation</span>
            <span className="highlight">Pro-rata airdrop</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Buy Modal (Shows Recipient)

```typescript
// components/curve/BuyModal.tsx

export function BuyModal({ curve, referrer }: Props) {
  const [amount, setAmount] = useState(1);
  const cost = calculateCost(curve, amount);
  const fees = calculateFees(cost, !!referrer);

  return (
    <Modal>
      <h2>Buy Keys</h2>

      <AmountInput value={amount} onChange={setAmount} />

      <FeeBreakdown>
        <Row>
          <Label>Total Cost</Label>
          <Value>{cost} SOL</Value>
        </Row>

        <Divider />

        <Row className="subtle">
          <Label>Reserve (94%)</Label>
          <Value>{fees.reserve} SOL</Value>
        </Row>

        <Row className="highlight">
          <Label>
            {referrer ? `Referrer (2%) ⚡` : `Creator (2%) ⚡`}
          </Label>
          <Value>{fees.instant} SOL</Value>
        </Row>

        <Row className="subtle">
          <Label>Rewards (2%)</Label>
          <Value>{fees.rewards} SOL</Value>
        </Row>

        <Row className="subtle">
          <Label>Platform (2%)</Label>
          <Value>{fees.platform} SOL</Value>
        </Row>
      </FeeBreakdown>

      {referrer && (
        <Alert type="info">
          <Icon>🎉</Icon>
          <Text>
            This purchase will earn <strong>0.02 SOL</strong> for your referrer!
          </Text>
        </Alert>
      )}

      <Button onClick={handleBuy}>
        Buy {amount} Keys for {cost} SOL
      </Button>
    </Modal>
  );
}
```

---

## ✅ FINAL DECISION SUMMARY

### **APPROVED MODEL: Option A+ (Creator Fallback)**

```
✅ WITH Referrer:
   - Referrer: 2% instant ⚡
   - Creator: 0% (benefits from key appreciation)
   - Rewards: 2%
   - Platform: 2%
   - Reserve: 94%

✅ WITHOUT Referrer:
   - Creator: 2% instant ⚡ [FALLBACK]
   - Rewards: 2%
   - Platform: 2%
   - Reserve: 94%
```

### Benefits:
- ✅ Fair to creators (earn from organic)
- ✅ Fair to referrers (earn from referrals)
- ✅ Incentivizes both parties
- ✅ No wasted fees
- ✅ Viral growth potential
- ✅ Simple implementation
- ✅ Competitive with market

---

## 🚀 NEXT STEPS

1. ✅ Approve this model
2. Update main spec (CURVE_SPECIFICATION_FINAL_V4.md)
3. Implement smart contract
4. Build frontend referral system
5. Deploy to devnet
6. Test referral flow
7. Launch!

---

**Questions? Ready to implement?** 🎯
