# 🛡️ Anti-Sniper & Anti-Bot Curve System

**Problem**: Bots can snipe curves immediately after creation, buying cheap keys before real users
**Solution**: Creator self-buy lockup + bot reporting system

---

## 🎯 Core Mechanism

### Phase 1: Profile Creation (Private)
```
Creator → Create Profile
  ↓
Curve created but HIDDEN
Status: PENDING
Trading: DISABLED for public ❌
```

### Phase 2: Initial Self-Buy (Required)
```
Creator → Buy own keys (minimum 5-10 keys)
  ↓
Creator pays full price
Keys locked for 7 days
Status: Still PENDING
```

### Phase 3: Go Live
```
Creator → Activate Profile
  ↓
Status: ACTIVE
Trading: PUBLIC can buy ✅
Creator keys: Still locked
```

**Result**: Creator has skin in the game, snipers can't get in first!

---

## 📋 Smart Contract Implementation

### Updated Curve State

```rust
#[account]
pub struct Curve {
    pub curve_id: String,
    pub curve_type: CurveType,
    pub owner: Pubkey,
    pub creator_wallet: Pubkey,

    // Pricing
    pub base_price: u64,
    pub slope: u64,
    pub supply: u64,

    // Status
    pub status: CurveStatus,
    pub visibility: CurveVisibility,  // ← NEW

    // Anti-sniper
    pub creator_initial_keys: u64,     // ← NEW
    pub creator_keys_locked_until: i64, // ← NEW
    pub min_creator_buy: u64,           // ← NEW (default: 10 keys)

    // Anti-bot
    pub reported_bots: Vec<Pubkey>,     // ← NEW
    pub banned_wallets: Vec<Pubkey>,    // ← NEW

    pub reserve_vault: Pubkey,
    pub total_volume: u64,
    pub token_mint: Option<Pubkey>,
    pub created_at: i64,
    pub activated_at: Option<i64>,      // ← NEW
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum CurveStatus {
    Pending,     // ← NEW: Not yet live
    Active,      // Public trading
    Frozen,      // Snapshot mode
    Launched,    // Token live
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum CurveVisibility {
    Private,     // Only creator can see/trade
    Public,      // Everyone can trade
}
```

---

## 🔄 Transaction Flows

### Flow 1: Create Profile (Step 1)

```rust
pub fn create_profile_curve(
    ctx: Context<CreateProfileCurve>,
    user_id: String,
    base_price: u64,
    slope: u64,
    min_creator_buy: u64,  // e.g., 10 keys
) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    curve.curve_id = user_id;
    curve.curve_type = CurveType::User;
    curve.owner = ctx.accounts.creator.key();
    curve.creator_wallet = ctx.accounts.creator.key();
    curve.base_price = base_price;
    curve.slope = slope;
    curve.supply = 0;

    // Anti-sniper setup
    curve.status = CurveStatus::Pending;           // ← Not live yet!
    curve.visibility = CurveVisibility::Private;    // ← Hidden!
    curve.min_creator_buy = min_creator_buy;
    curve.creator_initial_keys = 0;
    curve.creator_keys_locked_until = 0;

    curve.created_at = Clock::get()?.unix_timestamp;
    curve.activated_at = None;

    msg!("Profile curve created (pending activation)");
    Ok(())
}
```

**Frontend**:
```typescript
// Step 1: Create profile (private)
const tx1 = await createProfileCurve({
  userId: "user_123",
  basePrice: 0.1,  // 0.1 SOL
  slope: 0.001,
  minCreatorBuy: 10,  // Must buy 10 keys
});

// Profile created but NOT visible yet!
```

---

### Flow 2: Initial Creator Buy (Step 2)

```rust
pub fn creator_initial_buy(
    ctx: Context<CreatorInitialBuy>,
    amount: u64,
) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    // Verify
    require!(
        ctx.accounts.creator.key() == curve.owner,
        CurveError::NotOwner
    );
    require!(
        curve.status == CurveStatus::Pending,
        CurveError::AlreadyActivated
    );
    require!(
        amount >= curve.min_creator_buy,
        CurveError::InsufficientCreatorBuy
    );

    // Calculate cost (creator pays full price!)
    let total_cost = calculate_buy_cost(
        curve.supply,
        amount,
        curve.base_price,
        curve.slope,
    );

    // Transfer payment
    let reserve = total_cost * 94 / 100;
    let creator_fee = 0;  // ← Creator doesn't earn from own buy!
    let platform_fee = total_cost * 2 / 100;
    let referral_fee = total_cost * 1 / 100;

    // Transfer SOL
    transfer_sol(
        &ctx.accounts.creator.to_account_info(),
        &ctx.accounts.reserve_vault.to_account_info(),
        reserve,
    )?;

    transfer_sol(
        &ctx.accounts.creator.to_account_info(),
        &ctx.accounts.platform_wallet.to_account_info(),
        platform_fee + referral_fee,  // Platform gets both for initial
    )?;

    // Update state
    curve.supply = amount;
    curve.creator_initial_keys = amount;

    // Lock keys for 7 days
    let lock_duration = 7 * 24 * 60 * 60;  // 7 days
    curve.creator_keys_locked_until = Clock::get()?.unix_timestamp + lock_duration;

    // Still pending! Must activate next
    msg!("Creator bought {} keys (locked for 7 days)", amount);
    Ok(())
}
```

**Frontend**:
```typescript
// Step 2: Buy initial keys
const tx2 = await creatorInitialBuy({
  amount: 10,  // Buy 10 keys
  // Cost: 1.05 SOL (avg price)
  // Keys locked for 7 days
});

// Still not public!
```

---

### Flow 3: Activate Curve (Step 3)

```rust
pub fn activate_curve(
    ctx: Context<ActivateCurve>,
) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    // Verify
    require!(
        ctx.accounts.creator.key() == curve.owner,
        CurveError::NotOwner
    );
    require!(
        curve.status == CurveStatus::Pending,
        CurveError::AlreadyActivated
    );
    require!(
        curve.creator_initial_keys >= curve.min_creator_buy,
        CurveError::CreatorMustBuyFirst
    );

    // Activate!
    curve.status = CurveStatus::Active;
    curve.visibility = CurveVisibility::Public;
    curve.activated_at = Some(Clock::get()?.unix_timestamp);

    msg!("Curve activated! Public trading now live");

    // Emit event for indexer
    emit!(CurveActivatedEvent {
        curve_id: curve.curve_id.clone(),
        creator: curve.owner,
        initial_supply: curve.supply,
        current_price: calculate_current_price(curve),
    });

    Ok(())
}
```

**Frontend**:
```typescript
// Step 3: Make public
const tx3 = await activateCurve();

// NOW it's live! ✅
// Appears in discover feed
// Other users can buy
```

---

### Flow 4: Public Buy (with Bot Check)

```rust
pub fn buy_keys(
    ctx: Context<BuyKeys>,
    amount: u64,
    referrer: Option<Pubkey>,
) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    // Verify curve is public
    require!(
        curve.status == CurveStatus::Active,
        CurveError::CurveNotActive
    );
    require!(
        curve.visibility == CurveVisibility::Public,
        CurveError::CurveNotPublic
    );

    // Check if buyer is banned
    require!(
        !curve.banned_wallets.contains(&ctx.accounts.buyer.key()),
        CurveError::WalletBanned
    );

    // Anti-bot heuristics (optional)
    let time_since_activation = Clock::get()?.unix_timestamp - curve.activated_at.unwrap();

    // Flag suspicious activity
    if time_since_activation < 10 && amount > 50 {  // Big buy in first 10 seconds
        msg!("⚠️ Potential bot detected: {} keys in {}s", amount, time_since_activation);
        // Don't block, just log for review
    }

    // Rest of buy logic...
    // (same as before)

    Ok(())
}
```

---

### Flow 5: Report Bot

```rust
pub fn report_bot(
    ctx: Context<ReportBot>,
    reported_wallet: Pubkey,
    reason: String,
) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    // Only curve owner can report initially
    require!(
        ctx.accounts.reporter.key() == curve.owner,
        CurveError::NotOwner
    );

    // Add to reported list
    if !curve.reported_bots.contains(&reported_wallet) {
        curve.reported_bots.push(reported_wallet);
    }

    msg!("Bot reported: {} - Reason: {}", reported_wallet, reason);

    // Emit event for admin review
    emit!(BotReportedEvent {
        curve_id: curve.curve_id.clone(),
        reported_wallet,
        reporter: ctx.accounts.reporter.key(),
        reason,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
```

---

### Flow 6: Ban Bot (Admin Only)

```rust
pub fn ban_wallet(
    ctx: Context<BanWallet>,
    wallet_to_ban: Pubkey,
) -> Result<()> {
    let curve = &mut ctx.accounts.curve;

    // Verify admin authority
    require!(
        ctx.accounts.admin.key() == curve_authority.admin,
        CurveError::Unauthorized
    );

    // Add to banned list
    if !curve.banned_wallets.contains(&wallet_to_ban) {
        curve.banned_wallets.push(wallet_to_ban);
    }

    msg!("Wallet banned from curve: {}", wallet_to_ban);

    // Optionally: Refund their keys?
    // Let's allow them to sell first

    Ok(())
}
```

---

## 🎨 Frontend UX

### Profile Creation Flow

```typescript
// components/profile/CreateProfileFlow.tsx

export function CreateProfileFlow() {
  const [step, setStep] = useState(1);
  const { createProfile, buyInitial, activate } = useCurve();

  // Step 1: Profile Setup
  const handleCreateProfile = async () => {
    await createProfile({
      userId: user.id,
      basePrice: 0.1,
      slope: 0.001,
      minCreatorBuy: 10,
    });
    setStep(2);
  };

  // Step 2: Buy Initial Keys
  const handleBuyInitial = async () => {
    const cost = calculateCost(10);  // 10 keys

    await buyInitial({
      amount: 10,
      // User pays ~1.05 SOL
      // Keys locked for 7 days
    });

    toast.success("✅ You bought 10 keys! Locked for 7 days.");
    setStep(3);
  };

  // Step 3: Activate
  const handleActivate = async () => {
    await activate();

    toast.success("🎉 Profile is LIVE! Others can now trade your keys!");
    router.push(`/profile/${user.id}`);
  };

  return (
    <OnboardingFlow>
      {step === 1 && (
        <Step1>
          <h2>Create Your Profile Curve</h2>
          <p>Set your key pricing (can't change later)</p>
          <Input label="Starting Price" value={0.1} />
          <Input label="Price Increase" value={0.001} />
          <Button onClick={handleCreateProfile}>
            Create Profile
          </Button>
        </Step1>
      )}

      {step === 2 && (
        <Step2>
          <h2>Buy Your First Keys</h2>
          <Alert type="info">
            To prevent snipers, you must buy at least 10 keys first.
            Your keys will be locked for 7 days.
          </Alert>
          <FeeBreakdown>
            <Row>
              <Label>10 Keys Cost:</Label>
              <Value>1.05 SOL</Value>
            </Row>
            <Row className="highlight">
              <Label>Lock Period:</Label>
              <Value>7 days 🔒</Value>
            </Row>
          </FeeBreakdown>
          <Button onClick={handleBuyInitial}>
            Buy 10 Keys for 1.05 SOL
          </Button>
        </Step2>
      )}

      {step === 3 && (
        <Step3>
          <h2>Ready to Launch!</h2>
          <SuccessCard>
            ✅ Profile created
            ✅ You own 10 keys (locked)
            ✅ Current price: 0.11 SOL per key
          </SuccessCard>
          <Alert type="warning">
            Once activated, anyone can buy your keys!
          </Alert>
          <Button onClick={handleActivate}>
            🚀 Make Profile Public
          </Button>
        </Step3>
      )}
    </OnboardingFlow>
  );
}
```

---

### Bot Reporting UI

```typescript
// components/curve/BotReportModal.tsx

export function BotReportModal({ holder }: { holder: CurveHolder }) {
  const [reason, setReason] = useState("");
  const { reportBot } = useCurve();

  const handleReport = async () => {
    await reportBot({
      wallet: holder.wallet,
      reason,
    });

    toast.success("Bot reported! Admins will review.");
  };

  return (
    <Modal>
      <h3>Report Suspicious Activity</h3>

      <HolderCard>
        <WalletAddress>{holder.wallet}</WalletAddress>
        <Stats>
          <Stat label="Keys Held" value={holder.keysHeld} />
          <Stat label="Bought At" value={formatTime(holder.firstBuy)} />
          <Stat label="Time Since Activation" value="3 seconds ⚠️" />
        </Stats>
      </HolderCard>

      <Select
        label="Reason"
        value={reason}
        onChange={setReason}
        options={[
          "Bot sniping (instant buy after activation)",
          "Suspicious wallet pattern",
          "Coordinated manipulation",
          "Other"
        ]}
      />

      <TextArea
        label="Additional Details"
        placeholder="Describe the suspicious activity..."
      />

      <ButtonGroup>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleReport}>
          Report Bot
        </Button>
      </ButtonGroup>
    </Modal>
  );
}
```

---

### Admin Dashboard

```typescript
// app/admin/bot-reports/page.tsx

export default function BotReportsPage() {
  const { reports, banWallet } = useAdminBots();

  return (
    <AdminLayout>
      <h1>Bot Reports</h1>

      <ReportsList>
        {reports.map(report => (
          <ReportCard key={report.id}>
            <Header>
              <CurveLink curve={report.curve} />
              <Timestamp>{report.timestamp}</Timestamp>
            </Header>

            <Details>
              <Label>Reported Wallet:</Label>
              <WalletAddress>{report.wallet}</WalletAddress>

              <Label>Reporter:</Label>
              <WalletAddress>{report.reporter}</WalletAddress>

              <Label>Reason:</Label>
              <Text>{report.reason}</Text>

              <Label>Activity:</Label>
              <ActivityTimeline>
                <Event>Curve activated: {report.curveActivatedAt}</Event>
                <Event>Bot bought: {report.botBoughtAt}</Event>
                <Event>Time delta: {report.timeDelta}s ⚠️</Event>
              </ActivityTimeline>
            </Details>

            <Actions>
              <Button
                variant="danger"
                onClick={() => banWallet(report.wallet)}
              >
                Ban Wallet
              </Button>
              <Button
                variant="secondary"
                onClick={() => dismissReport(report.id)}
              >
                Dismiss
              </Button>
            </Actions>
          </ReportCard>
        ))}
      </ReportsList>
    </AdminLayout>
  );
}
```

---

## 🛡️ Anti-Bot Heuristics (Optional)

### Detection Signals

```rust
pub struct BotScore {
    pub score: u32,  // 0-100
    pub signals: Vec<String>,
}

pub fn calculate_bot_score(
    buyer: &Pubkey,
    curve: &Curve,
    amount: u64,
    purchase_time: i64,
) -> BotScore {
    let mut score = 0;
    let mut signals = Vec::new();

    // Signal 1: Instant buy after activation
    let time_since_activation = purchase_time - curve.activated_at.unwrap();
    if time_since_activation < 5 {
        score += 40;
        signals.push(format!("Bought {}s after activation", time_since_activation));
    }

    // Signal 2: Large initial purchase
    if amount > 50 {
        score += 30;
        signals.push(format!("Bought {} keys (large amount)", amount));
    }

    // Signal 3: New wallet (no history)
    // (Would need off-chain indexer data)

    // Signal 4: Same buyer pattern across multiple curves
    // (Would need cross-curve analysis)

    BotScore { score, signals }
}
```

---

## ✅ Benefits

### Anti-Sniper Protection
- ✅ Creator buys first (skin in the game)
- ✅ Keys locked for 7 days (can't dump immediately)
- ✅ Time to build audience before public launch
- ✅ Fair launch for real users

### Anti-Bot System
- ✅ Creator can report suspicious wallets
- ✅ Admins review and ban if needed
- ✅ Automatic detection flags suspicious activity
- ✅ Banned wallets can't buy (but can sell existing)

### User Trust
- ✅ "Creator has 10 locked keys" badge
- ✅ Transparent launch process
- ✅ Community policing via reports
- ✅ Fair pricing for early supporters

---

## 🎯 Timeline Example

```
Day 0 - 10:00 AM: Creator creates profile (private)
Day 0 - 10:05 AM: Creator buys 10 keys (locked until Day 7)
Day 0 - 11:00 AM: Creator activates profile → PUBLIC ✅
Day 0 - 11:00-11:05 AM: First 5 real users buy (no bots yet!)
Day 0 - 11:05 AM: Suspicious wallet buys 100 keys in 2s → Flagged ⚠️
Day 0 - 11:10 AM: Creator reports suspicious wallet
Day 0 - 12:00 PM: Admin reviews → Bans bot wallet
Day 7: Creator's 10 keys unlock → Can sell if wanted
```

---

## 🚀 Implementation Priority

### Phase 1 (Week 1): Core Anti-Sniper
- [ ] Add `Pending` status to curves
- [ ] Implement `creator_initial_buy`
- [ ] Implement `activate_curve`
- [ ] Lock creator keys for 7 days

### Phase 2 (Week 2): Bot Reporting
- [ ] Add `report_bot` instruction
- [ ] Add `banned_wallets` list
- [ ] Build admin dashboard
- [ ] Implement `ban_wallet`

### Phase 3 (Week 3): Heuristics (Optional)
- [ ] Bot score calculation
- [ ] Automatic flagging
- [ ] Cross-curve analysis
- [ ] Machine learning detection

---

This system gives you **strong anti-sniper protection** while keeping **legitimate trading open**!

Should we implement this in the Curve Program? 🚀
