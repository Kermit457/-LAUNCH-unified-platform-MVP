# 🌅 RESUME HERE TOMORROW - LaunchOS Curve Implementation

**Date Created**: 2025-01-12
**Status**: Specifications Complete, Ready to Code
**Next Step**: Smart Contract Implementation

---

## 📍 WHERE WE ARE NOW

### ✅ Completed Today:

1. **Full Specification Created** - [CURVE_SPECIFICATION_FINAL_V4.md](CURVE_SPECIFICATION_FINAL_V4.md)
   - 16 sections covering everything
   - Hybrid exponential formula: `P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6`
   - State machine: Pending → Active → Frozen → Launched
   - Freeze triggers: Manual, Reserve (32 SOL), Time-based
   - Snapshot system with Merkle tree
   - Launch mechanics: 25% LP, 50% Campaign, 25% Utility

2. **Fee Structure Finalized** - [CURVE_SPEC_FINAL_CREATOR_FALLBACK.md](CURVE_SPEC_FINAL_CREATOR_FALLBACK.md)
   - **WITH Referrer**: 94% reserve, 2% referrer (instant), 2% rewards, 2% platform
   - **WITHOUT Referrer**: 94% reserve, 2% creator (instant), 2% rewards, 2% platform
   - Creator gets paid on organic traffic ✅
   - Referrers get paid on referred traffic ✅

3. **Current Code Status**:
   - Anti-sniper system: ✅ Working (Pending → Active flow)
   - Linear formula: ❌ Needs update to hybrid exponential
   - Fee structure: ❌ Needs update (3% creator → 2% creator/referrer fallback)
   - Freeze system: ❌ Not implemented yet
   - Launch system: ❌ Not implemented yet

---

## 🎯 TOMORROW'S WORK - Copy This Prompt

```
Continue building the LaunchOS curve program. Yesterday we finalized
the complete specification (CURVE_SPECIFICATION_FINAL_V4.md).

CRITICAL CHANGES NEEDED:

1. UPDATE FORMULA: Change from linear to hybrid exponential
   OLD: Price = 0.01 + supply × 0.0001
   NEW: P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6

2. UPDATE FEE STRUCTURE:
   - WITH referrer: 94% reserve, 2% referrer (instant), 2% rewards, 2% platform
   - WITHOUT referrer: 94% reserve, 2% creator (instant), 2% rewards, 2% platform

3. ADD FREEZE SYSTEM (3 triggers):
   - freeze_manual(owner)
   - freeze_if_reserve(target=32 SOL)
   - freeze_if_time(unix >= launch_ts)

4. ADD SNAPSHOT SYSTEM:
   - On freeze: create Merkle root of holders
   - Lock supply_at_freeze, reserve_at_freeze

5. ADD LAUNCH INSTRUCTION:
   - Only in Frozen state
   - Split reserve: 25% LP, 50% campaign, 25% utility
   - Emit launch event
   - Set state=Launched

FILES TO UPDATE:
- solana-program/programs/launchos-curve/src/state.rs (add new fields)
- solana-program/programs/launchos-curve/src/lib.rs (update instructions)
- solana-program/programs/launchos-curve/src/errors.rs (new error types)
- CREATE: solana-program/programs/launchos-curve/src/math.rs (formula)
- CREATE: solana-program/programs/launchos-curve/src/events.rs (events)

REFERENCE DOCUMENTS:
- CURVE_SPECIFICATION_FINAL_V4.md (main spec)
- CURVE_SPEC_FINAL_CREATOR_FALLBACK.md (fee structure)

Please implement all changes and prepare for devnet deployment.
```

---

## 📋 IMPLEMENTATION CHECKLIST (Copy for Tomorrow)

### Phase 1: Math & Formula (1-2 hours)
- [ ] Create `src/math.rs`
- [ ] Implement `calculate_price_at_supply()` with hybrid formula
- [ ] Implement `approximate_power()` for S^1.6
- [ ] Implement `calculate_buy_cost()`
- [ ] Implement `calculate_sell_return()`
- [ ] Write unit tests for formula

### Phase 2: State Updates (1 hour)
- [ ] Update `CurveStatus` enum: Add `Frozen`, `Launched`
- [ ] Add new fields to `BondingCurve`:
  - `launch_ts: Option<i64>`
  - `target_reserve: u64`
  - `freeze_ts: Option<i64>`
  - `freeze_trigger: Option<String>`
  - `supply_at_freeze: u128`
  - `reserve_at_freeze: u128`
  - `snapshot_root: Option<[u8; 32]>`
  - `token_mint: Option<Pubkey>`
  - `lp_vault: Option<Pubkey>`
  - `campaign_vault: Option<Pubkey>`
  - `utility_vault: Option<Pubkey>`
  - `launched_at: Option<i64>`
  - `is_launching: bool`
  - `rewards_fees_collected: u128`
- [ ] Create `Snapshot` account struct
- [ ] Create `RewardsVault` account struct
- [ ] Update space calculations

### Phase 3: Fee Structure (1 hour)
- [ ] Update constants (RESERVE_BPS, INSTANT_BPS, REWARDS_BPS, PLATFORM_BPS)
- [ ] Update `buy_keys()` with creator fallback logic
- [ ] Add `rewards_vault` PDA to context
- [ ] Update transfers (4 transfers: reserve, instant, rewards, platform)
- [ ] Track `creator_fees_collected` for analytics

### Phase 4: Freeze System (2 hours)
- [ ] Implement `freeze_manual()`
- [ ] Implement `freeze_if_reserve()`
- [ ] Implement `freeze_if_time()`
- [ ] Create shared `execute_freeze()` helper
- [ ] Add freeze validation (idempotency, status checks)
- [ ] Block buy/sell when status = Frozen
- [ ] Emit `CurveFrozenEvent`

### Phase 5: Snapshot System (1 hour)
- [ ] Create `create_snapshot()` instruction
- [ ] Add `Snapshot` account initialization
- [ ] Validate curve is Frozen
- [ ] Store Merkle root on-chain
- [ ] Update curve with snapshot_root

### Phase 6: Launch System (2 hours)
- [ ] Implement `launch()` instruction
- [ ] Add vault accounts (lp_vault, campaign_vault, utility_vault)
- [ ] Calculate reserve splits (25/50/25)
- [ ] Transfer from reserve to vaults
- [ ] Update curve state to Launched
- [ ] Emit `CurveLaunchedEvent`
- [ ] Add idempotency checks

### Phase 7: Events (30 min)
- [ ] Create `src/events.rs`
- [ ] Define `CurveFrozenEvent`
- [ ] Define `CurveLaunchedEvent`
- [ ] Define `KeysPurchasedEvent` (update existing)

### Phase 8: Errors (30 min)
- [ ] Add `ReserveThresholdNotMet`
- [ ] Add `LaunchTimeNotSet`
- [ ] Add `LaunchTimeNotReached`
- [ ] Add `AlreadyFrozen`
- [ ] Add `CurveNotFrozen`
- [ ] Add `SnapshotNotCreated`
- [ ] Add `AlreadyLaunched`
- [ ] Add `InvalidStatusTransition`

### Phase 9: Build & Test (2 hours)
- [ ] Update `Cargo.toml` (add dependencies if needed)
- [ ] Run `anchor build`
- [ ] Fix compilation errors
- [ ] Update program ID in `Anchor.toml` and `lib.rs`
- [ ] Rebuild
- [ ] Write integration tests
- [ ] Run tests

### Phase 10: Deploy (1 hour)
- [ ] Configure Solana CLI for devnet
- [ ] Request airdrop if needed
- [ ] Deploy: `anchor deploy --provider.cluster devnet`
- [ ] Initialize config
- [ ] Initialize ban list
- [ ] Test transactions on devnet

**TOTAL ESTIMATED TIME: 12-14 hours**

---

## 🚨 CRITICAL REMINDERS

### Security Must-Haves:
- ✅ All arithmetic uses `checked_*` operations
- ✅ Reentrancy guards on all state-changing functions
- ✅ Status validation before operations
- ✅ Idempotency checks on freeze/launch
- ✅ Access control (owner-only where needed)
- ✅ CEI pattern (Checks-Effects-Interactions)

### Don't Forget:
- ❌ Do NOT use old linear formula
- ❌ Do NOT use 3% creator instant fee (use 2% fallback model)
- ❌ Do NOT use 5% separate sell tax (use unified 6%)
- ❌ Do NOT skip idempotency checks
- ❌ Do NOT allow trading in Frozen/Launched states

---

## 📊 KEY NUMBERS TO REMEMBER

### Formula
```
P(S) = 0.05 + 0.0003*S + 0.0000012*S^1.6
```

### Fees
```
Reserve:  94%
Instant:   2% (referrer OR creator)
Rewards:   2%
Platform:  2%
```

### Freeze Target
```
32 SOL = 32_000_000_000 lamports
```

### Reserve Split on Launch
```
LP:        25% (~8 SOL if 32 SOL total)
Campaign:  50% (~16 SOL)
Utility:   25% (~8 SOL)
```

---

## 📁 FILE STRUCTURE (After Implementation)

```
solana-program/
├── programs/
│   └── launchos-curve/
│       └── src/
│           ├── lib.rs           (updated with new instructions)
│           ├── state.rs         (updated with new fields)
│           ├── errors.rs        (updated with new errors)
│           ├── math.rs          (NEW - formula implementation)
│           └── events.rs        (NEW - event definitions)
│
├── CURVE_SPECIFICATION_FINAL_V4.md           (main spec)
├── CURVE_SPEC_FINAL_CREATOR_FALLBACK.md     (fee structure)
└── RESUME_HERE_TOMORROW.md                   (this file)
```

---

## 🎯 DECISION LOG

### Approved Decisions:
1. ✅ Hybrid exponential formula (not linear)
2. ✅ Creator fallback fee model (2% when no referrer)
3. ✅ 3 freeze triggers (manual, reserve, time)
4. ✅ 32 SOL reserve target for auto-freeze
5. ✅ 25/50/25 reserve split on launch
6. ✅ Snapshot via Merkle tree
7. ✅ Unified 6% fee (not separate sell tax)
8. ✅ 4 states: Pending → Active → Frozen → Launched

### Questions Still Open:
- Holder pool % for airdrop (suggested 10-20%, need final decision)
- Time-based auto-freeze default (if enabled)
- Power approximation method (Newton's or lookup table)

---

## 📞 CONTACT INFO FOR TOMORROW

When you return, just say:

**"Continue with the curve implementation from yesterday. I'm ready to start coding."**

I'll:
1. Review these specs
2. Start with Phase 1 (Math & Formula)
3. Work through all phases systematically
4. Test and deploy to devnet

---

## 💾 BACKUP REMINDER

Before starting tomorrow:
1. Commit current work to git
2. Create branch: `feature/curve-v4-implementation`
3. Implement changes
4. Test thoroughly
5. Merge when working

---

## 🌙 Good Night!

Everything is documented and ready to go. Tomorrow we implement this beast! 🚀

**Sleep well, see you tomorrow!** 😴

---

**Last Updated**: 2025-01-12 23:00
**Status**: Specs finalized, ready for implementation
**Next Session**: Start with Phase 1 (Math & Formula)
