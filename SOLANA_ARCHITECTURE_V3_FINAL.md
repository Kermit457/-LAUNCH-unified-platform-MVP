# 🚀 LaunchOS Solana Architecture V3 - FINAL
## Instant Fee Routing + UX-First Design

**Last Updated:** 2025-10-12
**Status:** Production-Ready Architecture

---

## 🎯 Core Principles

### 1. Instant Gratification ⚡
- All fees paid instantly (no escrow for trades)
- Real-time "You earned X SOL!" notifications
- Live price + volume updates every 1-2 seconds

### 2. Minimal Complexity 🎨
- One transaction handles: buy + fee routing + state update
- Escrow ONLY for campaigns/bounties (not trades)
- Clean separation: Curve = trading, Escrow = campaigns

### 3. Industry Standards 📊
- Follows Friend.tech, Arena.xyz patterns
- Linear/hybrid bonding curves
- Transparent fee breakdown

---

## 📊 System Overview (Simplified)

```
┌─────────────────────────────────────────────────┐
│           LaunchOS Solana System                │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐             ┌────────▼────────┐
│ Curve Program  │             │ Escrow Program  │
│ (Trading)      │             │ (Campaigns Only)│
└────────────────┘             └─────────────────┘
        │                               │
  Buy/Sell Keys                   Campaign Pools
  Instant Fees                    Delayed Payouts
```

**Key Change**: No reserve pool in escrow! Fees go directly to wallets.

---

## 💰 Fee Routing (Instant Payouts)

### On Every Buy Transaction

```rust
// Calculate total cost
let total_cost = calculate_buy_price(supply, amount);

// Split fees INSTANTLY
let reserve = total_cost * 0.94;      // 94% → Stays in curve (for liquidity)
let creator_fee = total_cost * 0.03;  // 3% → Creator wallet (instant)
let platform_fee = total_cost * 0.02; // 2% → Platform wallet (instant)
let referral_fee = total_cost * 0.01; // 1% → Referrer or Rewards Pool (instant)

// Single transaction:
transfer(buyer → reserve_vault, reserve);
transfer(buyer → creator_wallet, creator_fee);
transfer(buyer → platform_wallet, platform_fee);
transfer(buyer → referrer_or_pool, referral_fee);
```

### On Every Sell Transaction

```rust
// Calculate sell price (with 5% tax)
let gross_amount = calculate_sell_price(supply, amount);
let sell_tax = gross_amount * 0.05;  // 5% penalty
let net_amount = gross_amount - sell_tax;

// Single transaction:
transfer(reserve_vault → seller, net_amount);
transfer(sell_tax → platform_wallet);  // Tax goes to platform
```

**Result**: No escrow for trades, instant feedback, simpler UX!

---

## 🏗️ Smart Contract Structure

### Program 1: Curve Program (Trading Logic)

**Purpose**: Bonding curve trading with instant fee routing

```rust
#[program]
pub mod launchos_curve {
    // Instructions
    pub fn create_curve(
        ctx: Context<CreateCurve>,
        curve_type: CurveType,
        owner_id: String,
        base_price: u64,
        slope: u64,
    ) -> Result<()>

    pub fn buy_keys(
        ctx: Context<BuyKeys>,
        amount: u64,
        referrer: Option<Pubkey>,
    ) -> Result<()>

    pub fn sell_keys(
        ctx: Context<SellKeys>,
        amount: u64,
    ) -> Result<()>

    pub fn freeze_curve(
        ctx: Context<FreezeCurve>,
    ) -> Result<()>

    pub fn launch_token(
        ctx: Context<LaunchToken>,
        token_metadata: TokenMetadata,
    ) -> Result<()>
}
```

**Key Accounts**:
```rust
#[account]
pub struct Curve {
    pub curve_id: String,
    pub curve_type: CurveType,       // User or Project
    pub owner: Pubkey,
    pub creator_wallet: Pubkey,      // 3% fees go here
    pub base_price: u64,
    pub slope: u64,
    pub supply: u64,
    pub status: CurveStatus,
    pub reserve_vault: Pubkey,       // Holds 94% reserve for liquidity
    pub total_volume: u64,
    pub total_fees_earned: u64,      // Track creator earnings
    pub token_mint: Option<Pubkey>,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
pub struct ReserveVault {
    pub curve: Pubkey,
    pub balance: u64,                // 94% of all buys - 94% of all sells
    pub bump: u8,
}
```

---

### Program 2: Escrow Program (Campaigns Only)

**Purpose**: Hold campaign budgets, release on approval

**Simplified** - Only handles campaigns, no curve reserves!

```rust
#[program]
pub mod launchos_escrow {
    pub fn create_campaign_pool(
        ctx: Context<CreateCampaignPool>,
        campaign_id: String,
        budget: u64,
    ) -> Result<()>

    pub fn deposit_to_campaign(
        ctx: Context<DepositToCampaign>,
        amount: u64,
    ) -> Result<()>

    pub fn payout_from_campaign(
        ctx: Context<PayoutFromCampaign>,
        recipient: Pubkey,
        amount: u64,
    ) -> Result<()>
}
```

**Key Accounts**:
```rust
#[account]
pub struct CampaignPool {
    pub campaign_id: String,
    pub creator: Pubkey,
    pub balance: u64,
    pub total_paid_out: u64,
    pub status: PoolStatus,
    pub deadline: i64,
    pub bump: u8,
}
```

**That's it!** No boost pools, no reserve pools, no complexity.

---

## 🔄 Transaction Flows

### Flow 1: Buy Keys (with Instant Fees)

```
User → Curve Program
  1. Calculate total cost = base_price + (supply * slope) * amount
  2. Calculate fees:
     - reserve = cost * 0.94
     - creator_fee = cost * 0.03
     - platform_fee = cost * 0.02
     - referral_fee = cost * 0.01

  3. Transfer SOL/USDC (single transaction):
     buyer → reserve_vault (94%)
     buyer → creator_wallet (3%)
     buyer → platform_wallet (2%)
     buyer → referrer_wallet OR rewards_pool (1%)

  4. Update state:
     curve.supply += amount
     curve.total_volume += cost
     curve.total_fees_earned += creator_fee
     holder.keys_held += amount

  5. Emit event:
     BuyEvent {
       buyer,
       amount,
       price,
       creator_earned: creator_fee,
       new_supply,
       new_price,
     }

  6. Frontend shows:
     "You bought 10 keys for 5 SOL!"
     "Creator earned 0.15 SOL instantly!"
```

**Accounts Needed**:
```rust
#[derive(Accounts)]
pub struct BuyKeys<'info> {
    #[account(mut)]
    pub curve: Account<'info, Curve>,

    #[account(
        mut,
        seeds = [b"reserve", curve.key().as_ref()],
        bump
    )]
    pub reserve_vault: Account<'info, ReserveVault>,

    #[account(init_if_needed, ...)]
    pub holder: Account<'info, CurveHolder>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: Creator receives 3%
    #[account(mut)]
    pub creator_wallet: AccountInfo<'info>,

    /// CHECK: Platform receives 2%
    #[account(mut)]
    pub platform_wallet: AccountInfo<'info>,

    /// CHECK: Referrer or rewards pool receives 1%
    #[account(mut)]
    pub referrer_or_pool: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
```

---

### Flow 2: Sell Keys (with 5% Tax)

```
User → Curve Program
  1. Calculate gross sell price
  2. Apply 5% sell tax
  3. Calculate net amount = gross * 0.95

  4. Transfer SOL/USDC:
     reserve_vault → seller (95%)
     reserve_vault → platform_wallet (5% tax)

  5. Update state:
     curve.supply -= amount
     holder.keys_held -= amount

  6. Frontend shows:
     "You sold 10 keys for 4.75 SOL (5% fee)"
```

---

### Flow 3: Create Campaign + Fund

```
Creator → Escrow Program
  1. create_campaign_pool(campaign_id, budget)
     → Create CampaignPool PDA

  2. deposit_to_campaign(amount)
     → Transfer USDC: creator → campaign_pool

  3. Off-chain: Campaign goes live
```

---

### Flow 4: Campaign Payout

```
Backend → Escrow Program
  1. Verify submission approved (off-chain)

  2. payout_from_campaign(recipient, amount)
     → Transfer: campaign_pool → recipient
     → Update pool.total_paid_out

  3. Off-chain: Update database
```

**No interaction with Curve Program** - completely separate!

---

## 🎨 UX Implementation

### Live Price Display

```typescript
// components/curve/PriceDisplay.tsx
export function PriceDisplay({ curveId }: { curveId: string }) {
  const { curve, nextPrice } = useCurve(curveId);

  return (
    <div className="price-card">
      <div className="current-price">
        <span className="label">Current Price</span>
        <span className="value">{curve.currentPrice} SOL</span>
      </div>
      <div className="next-price">
        <span className="label">Next Key Price</span>
        <span className="value">{nextPrice} SOL</span>
        <span className="impact">+{((nextPrice - curve.currentPrice) / curve.currentPrice * 100).toFixed(2)}%</span>
      </div>
    </div>
  );
}
```

### Buy Modal with Fee Breakdown

```typescript
// components/curve/BuyModal.tsx
export function BuyModal({ curveId }: { curveId: string }) {
  const [amount, setAmount] = useState(1);
  const { curve, buyKeys } = useCurve(curveId);

  const totalCost = calculateTotalCost(curve, amount);
  const creatorEarns = totalCost * 0.03;
  const youPay = totalCost;

  const handleBuy = async () => {
    const tx = await buyKeys(amount);
    toast.success(`✅ Bought ${amount} keys! Creator earned ${creatorEarns} SOL`);
  };

  return (
    <Modal>
      <h2>Buy Keys</h2>
      <Input value={amount} onChange={setAmount} />

      <FeeBreakdown>
        <Row>
          <Label>You Pay:</Label>
          <Value>{youPay} SOL</Value>
        </Row>
        <Row className="subtle">
          <Label>Reserve (94%):</Label>
          <Value>{totalCost * 0.94} SOL</Value>
        </Row>
        <Row className="highlight">
          <Label>Creator Earns (3%):</Label>
          <Value>{creatorEarns} SOL ⚡</Value>
        </Row>
        <Row className="subtle">
          <Label>Platform (2%):</Label>
          <Value>{totalCost * 0.02} SOL</Value>
        </Row>
        <Row className="subtle">
          <Label>Referral (1%):</Label>
          <Value>{totalCost * 0.01} SOL</Value>
        </Row>
      </FeeBreakdown>

      <Button onClick={handleBuy}>
        Buy {amount} Keys for {youPay} SOL
      </Button>
    </Modal>
  );
}
```

### Real-Time Updates

```typescript
// hooks/useCurveLive.ts
export function useCurveLive(curveId: string) {
  const [curve, setCurve] = useState<Curve | null>(null);

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket(`wss://api.launchos.io/curve/${curveId}`);

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setCurve(prev => ({
        ...prev,
        supply: update.supply,
        currentPrice: update.currentPrice,
        volume: update.volume,
      }));

      // Show toast on trades
      if (update.event === 'buy') {
        toast.info(`🔥 Someone bought ${update.amount} keys!`);
      }
    };

    return () => ws.close();
  }, [curveId]);

  return curve;
}
```

---

## 📐 Bonding Curve Math

### Linear Curve Formula

```rust
// Current price for next key
pub fn current_price(supply: u64, base_price: u64, slope: u64) -> u64 {
    base_price + (supply * slope)
}

// Total cost to buy `amount` keys
pub fn calculate_buy_cost(
    current_supply: u64,
    amount: u64,
    base_price: u64,
    slope: u64,
) -> u64 {
    // Sum of arithmetic series
    let start_price = current_price(current_supply, base_price, slope);
    let end_price = current_price(current_supply + amount, base_price, slope);

    // Average price * amount
    ((start_price + end_price) * amount) / 2
}

// Total return from selling `amount` keys
pub fn calculate_sell_return(
    current_supply: u64,
    amount: u64,
    base_price: u64,
    slope: u64,
) -> u64 {
    let gross = calculate_buy_cost(current_supply - amount, amount, base_price, slope);
    let tax = gross * 5 / 100;  // 5% sell tax
    gross - tax
}
```

**Example**:
- Base price: 0.1 SOL
- Slope: 0.001 SOL per key
- Supply: 100

Current price = 0.1 + (100 * 0.001) = **0.2 SOL**
Next key price = 0.1 + (101 * 0.001) = **0.201 SOL**

---

## 🚀 Implementation Checklist

### Phase 1: Curve Program (Week 1-2)
- [ ] Implement buy_keys with instant fee routing
- [ ] Implement sell_keys with 5% tax
- [ ] Add freeze/launch functions
- [ ] Test on devnet

### Phase 2: Frontend Integration (Week 2-3)
- [ ] Build BuyModal with fee breakdown
- [ ] Add live price display
- [ ] Implement WebSocket for real-time updates
- [ ] Show "Creator earned X" notifications

### Phase 3: Escrow for Campaigns (Week 3-4)
- [ ] Simplify escrow to campaigns only
- [ ] Remove boost, reserve pools
- [ ] Test campaign funding flow

### Phase 4: Polish & Launch (Week 4)
- [ ] Add price charts
- [ ] Load testing
- [ ] Security audit
- [ ] Mainnet deployment

---

## ✅ Benefits of This Architecture

### For Users
- ✅ **Instant feedback**: "You earned X SOL!" immediately
- ✅ **Transparent pricing**: See current + next price
- ✅ **Simple UX**: One click to buy/sell
- ✅ **Real-time updates**: Live volume, holders, price

### For Creators
- ✅ **Instant earnings**: 3% on every buy, no waiting
- ✅ **Visible impact**: "Earned 0.15 SOL from this trade"
- ✅ **Fair incentives**: More trading = more earnings

### For Platform
- ✅ **Clean code**: No escrow complexity for trades
- ✅ **Industry standard**: Follows Friend.tech model
- ✅ **Scalable**: Simple = fast
- ✅ **Auditable**: Clear fee flows

### For Development
- ✅ **Less code**: ~50% smaller than V2
- ✅ **Easier testing**: Fewer edge cases
- ✅ **Better UX**: Focus on what matters
- ✅ **Faster shipping**: Simpler = faster

---

## 🔐 Security Considerations

### Fee Routing
```rust
// Verify wallets before transfer
require!(
    creator_wallet.key() == curve.creator_wallet,
    CurveError::InvalidCreatorWallet
);

// Use checked math
let reserve = total_cost.checked_mul(94).unwrap() / 100;
let creator_fee = total_cost.checked_mul(3).unwrap() / 100;
```

### Reserve Vault Protection
```rust
// Only curve program can withdraw
#[account(
    mut,
    seeds = [b"reserve", curve.key().as_ref()],
    bump,
    constraint = reserve_vault.curve == curve.key()
)]
pub reserve_vault: Account<'info, ReserveVault>,
```

---

## 📊 Comparison: V2 vs V3

| Feature | V2 (Complex) | V3 (Simple) |
|---------|-------------|-------------|
| **Fee Routing** | Via escrow, delayed | Direct, instant |
| **Reserve Pool** | In escrow program | In curve program |
| **Campaign Pools** | Mixed with trading | Separate escrow |
| **Transactions** | Buy → Deposit to escrow | Buy → Instant transfers |
| **UX** | "Fees escrowed" | "Creator earned X instantly" |
| **Code Lines** | ~800 | ~400 |
| **Complexity** | High | Low |
| **Industry Standard** | No | Yes (Friend.tech model) |

---

## 🎯 Final Decision

✅ **Adopt V3 Architecture**

**Reasons**:
1. Industry standard (Friend.tech, Arena.xyz all do instant fees)
2. Better UX (instant gratification)
3. Simpler code (50% less complexity)
4. Faster to ship
5. Easier to maintain

**Trade-offs**:
- Escrow only for campaigns (not a trade-off, it's correct!)
- Can't batch fees (not needed, instant is better)

---

**Status**: Ready for implementation! 🚀
**Next**: Build Curve Program with instant fee routing
**Timeline**: 2-3 weeks to production

This is the production architecture. Let's build it! 💪
