# [Feature Name] - Implementation Plan

## Goal
[One sentence objective describing what we're building and why]

## Success Criteria
- [ ] Criterion 1 (measurable outcome)
- [ ] Criterion 2 (measurable outcome)
- [ ] Criterion 3 (measurable outcome)

## Scope
**In scope:**
- Feature A
- Feature B
- Feature C

**Out of scope:**
- Feature X (defer to v2)
- Feature Y (separate epic)

## Non-Goals
- We are NOT changing [existing system]
- We are NOT optimizing [performance area] (tracked separately)
- We are NOT adding [related feature] (separate task)

---

## Execution Plan

### Step 1: [Phase Name - e.g., "Schema Design"]
- **Owner**: [Agent name or self]
- **Files**:
  - `path/to/file.ts:123-145`
  - `path/to/other.tsx:67`
- **Est**: [X] minutes
- **Output**: [Deliverable - e.g., "New Appwrite collection schema"]
- **Dependencies**: None / [List dependencies]

### Step 2: [Phase Name]
- **Owner**: [Agent name or self]
- **Files**: `path/to/file.ts`
- **Est**: [X] minutes
- **Output**: [Deliverable]
- **Dependencies**: Step 1

### Step 3: [Phase Name]
- **Owner**: [Agent name or self]
- **Files**: `path/to/file.ts`
- **Est**: [X] minutes
- **Output**: [Deliverable]
- **Dependencies**: Step 2

### Step 4: [Phase Name]
- **Owner**: [Agent name or self]
- **Files**: `path/to/file.ts`
- **Est**: [X] minutes
- **Output**: [Deliverable]
- **Dependencies**: Step 3

### Step 5: [Phase Name - e.g., "Testing & Verification"]
- **Owner**: [Agent name or self]
- **Files**: `path/to/test.ts`
- **Est**: [X] minutes
- **Output**: [Deliverable - e.g., "All tests passing"]
- **Dependencies**: Steps 1-4

**Total Estimated Time**: [Sum] minutes

---

## Blast Radius

### UI Impact
- ☐ Pages affected: `/page-name`, `/other-page`
- ☐ Components modified: `ComponentName`, `OtherComponent`
- ☐ New components: `NewComponent`
- ☐ Layout changes: Yes/No
- ☐ Breaking UI changes: Yes/No

### API Impact
- ☐ New endpoints: `POST /api/new-endpoint`
- ☐ Modified endpoints: `GET /api/existing`
- ☐ Deprecated endpoints: None
- ☐ Breaking API changes: Yes/No

### Programs (On-Chain)
- ☐ New instructions: `instruction_name`
- ☐ Modified instructions: `existing_instruction`
- ☐ State migrations needed: Yes/No
- ☐ IDL version bump: Yes (v1.2.3 → v1.3.0) / No

### Client/SDK Impact
- ☐ IDL regeneration needed: Yes/No
- ☐ Client bindings to update: `lib/solana/program.ts`
- ☐ Breaking SDK changes: Yes/No

### Environment Variables
- ☐ New env vars: `NEW_VAR=value`
- ☐ Modified env vars: `EXISTING_VAR` (new format)
- ☐ Secrets to add: Appwrite API key, etc.

### Database
- ☐ New collections: `collection_name`
- ☐ New attributes: `attribute_name` on `collection`
- ☐ Indexes to create: `index_name`
- ☐ Migrations needed: Yes/No

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| User data loss | Low | Critical | Backup before migration, test on staging |
| Performance degradation | Medium | High | Load test with 10k records, add indexes |
| Breaking change for existing users | Low | High | Feature flag, gradual rollout |
| On-chain instruction fails | Medium | Critical | Extensive testing on localnet/devnet |

---

## Rollback Plan

### Git Rollback
```bash
# Identify commit hash
git log --oneline

# Revert the changes
git revert <commit-hash>

# Or hard reset (destructive)
git reset --hard <previous-commit>

# Push revert
git push origin main
```

### On-Chain Rollback (if applicable)

**Current State:**
- Program ID: `[current_program_id]`
- Upgrade Authority: `[authority_pubkey]`
- Program Version: v1.2.3

**Rollback Steps:**
1. Build previous version: `git checkout <previous-tag> && anchor build`
2. Deploy with upgrade: `anchor upgrade <program-id> --program-keypair <path>`
3. Verify: `solana program show <program-id>`
4. Notify users of rollback via Discord/Twitter

**Data Recovery:**
- No state changes: Instant rollback
- State changed: Requires migration script (see `/scripts/rollback-v123.ts`)

### Database Rollback
```bash
# Restore from backup
node scripts/restore-collection.js --collection=<name> --backup=<timestamp>

# Or manual attribute removal
node scripts/remove-attributes.js --collection=<name> --attributes=<list>
```

---

## Dependencies & Sequencing

**Depends on:**
- [ ] Task #123: Database schema finalized
- [ ] Task #456: API endpoint /api/users ready

**Blocks:**
- [ ] Task #789: Frontend dashboard (needs this API)
- [ ] Task #101: Mobile app integration

**Parallel work:**
- Can work simultaneously on: UI components, test suite, documentation

---

## PR Checklist

### Code Quality
- [ ] TypeScript compilation clean: `tsc --noEmit`
- [ ] ESLint passes: `npm run lint`
- [ ] All tests pass: `npm test`
- [ ] No console.log/debugger statements
- [ ] Error handling implemented
- [ ] Loading states implemented

### Performance
- [ ] Bundle size check: `ANALYZE=true npm run build`
- [ ] No N+1 queries introduced
- [ ] Images optimized (Next.js Image component)
- [ ] Database indexes created

### Security
- [ ] Input validation (Zod schemas)
- [ ] Authorization checks on API routes
- [ ] No sensitive data in logs
- [ ] Environment variables not committed

### On-Chain (if applicable)
- [ ] Anchor tests pass: `anchor test`
- [ ] IDL regenerated: `anchor build && ./copy-idl.sh`
- [ ] Client bindings updated
- [ ] Deployed to devnet and tested
- [ ] Security audit completed (for mainnet)

### Documentation
- [ ] CHANGELOG.md updated
- [ ] API documentation updated
- [ ] Component props documented
- [ ] README updated (if needed)

---

## Solana Annex (On-Chain Work Only)

### Instruction Set

| Name | Purpose | Inputs | Outputs | Events Emitted |
|------|---------|--------|---------|----------------|
| `initialize_curve` | Create new bonding curve | `mint: Pubkey`, `params: CurveParams` | `curve: PDA` | `CurveCreated` |
| `buy_keys` | Purchase keys on curve | `curve: PDA`, `amount: u64`, `max_price: u64` | `user_keys: PDA` | `KeysPurchased` |
| `freeze_curve` | Lock trading permanently | `curve: PDA`, `authority: Signer` | None | `CurveFrozen` |

### Accounts & PDAs

| Name | Seeds | Mutable | Signer | Space (bytes) | Closes? | Rent Exempt |
|------|-------|---------|--------|---------------|---------|-------------|
| `curve` | `["curve", mint.key()]` | ✅ | ❌ | 256 | ❌ | ✅ (1.5 SOL) |
| `user_keys` | `["keys", curve.key(), user.key()]` | ✅ | ❌ | 128 | ✅ | ✅ (0.9 SOL) |
| `fee_vault` | `["fees", curve.key()]` | ✅ | ❌ | 8 | ❌ | ✅ (0.5 SOL) |

### Anchor Constraints & Invariants

```rust
// Example: freeze_curve instruction
#[account(
    mut,
    seeds = [b"curve", mint.key().as_ref()],
    bump,
    constraint = curve.authority == authority.key() @ ErrorCode::Unauthorized,
    constraint = !curve.is_frozen @ ErrorCode::AlreadyFrozen,
)]
pub curve: Account<'info, Curve>,

#[account(mut)]
pub authority: Signer<'info>,

// Invariants to maintain:
// 1. Only curve authority can freeze
// 2. Cannot freeze already frozen curve
// 3. Frozen curves cannot be traded
// 4. Fee calculations must round down (favor protocol)
```

### Error Taxonomy

| Error Code | Name | Description | User Action |
|-----------|------|-------------|-------------|
| 6000 | `Unauthorized` | Caller is not the authority | Check signer |
| 6001 | `AlreadyFrozen` | Curve is already frozen | Use different curve |
| 6002 | `InsufficientFunds` | Not enough SOL for purchase | Add more SOL |
| 6003 | `SlippageExceeded` | Price moved beyond max_price | Retry with higher slippage |
| 6004 | `InvalidAmount` | Amount is zero or too large | Check input |

### Cross-Program Invocations (CPI)

| Target Program | Instruction | Purpose | Required Permissions |
|---------------|-------------|---------|---------------------|
| Token Program | `transfer` | Move SPL tokens | Token account authority |
| System Program | `transfer` | Move SOL for fees | Curve PDA signer |
| Associated Token Program | `create` | Create user token account | Payer signer |

**CPI Constraints:**
- All CPIs must use `invoke_signed` with correct PDA seeds
- Token transfers must check for sufficient balance first
- System program transfers must leave rent-exempt minimum

### Serialization & Numeric Precision

**Decimal Precision:**
- Prices: u64 with 9 decimal places (lamports)
- Percentages: u16 basis points (100 = 1%)
- Timestamps: i64 Unix epoch seconds

**Overflow Protection:**
```rust
// Use checked arithmetic for all financial calculations
let total_cost = price
    .checked_mul(amount)?
    .checked_add(fee)?
    .ok_or(ErrorCode::Overflow)?;
```

**Serialization:**
- Use Anchor's `#[account]` macro for automatic borsh serialization
- Account discriminators: 8 bytes (Anchor default)
- Padding: Align to 8-byte boundaries for efficiency

### Compute Unit (CU) Budget

| Instruction | Target CU | Current CU | Hot Paths |
|-------------|-----------|------------|-----------|
| `initialize_curve` | 50,000 | 45,231 | PDA derivation, account init |
| `buy_keys` | 80,000 | 76,542 | Price calculation, token transfer |
| `freeze_curve` | 30,000 | 28,109 | State update only |

**Optimization Notes:**
- Price calculation uses binary search: O(log n)
- Avoid dynamic allocations in hot paths
- Cache PDA bumps in account data (saves ~5,000 CU)

### State Migrations & Versioning

**Current Version:** v1.2.3

**Migration Path (if needed):**
```rust
// Old struct
pub struct CurveV1 {
    pub authority: Pubkey,
    pub is_frozen: bool,
}

// New struct with version field
pub struct CurveV2 {
    pub version: u8,  // NEW
    pub authority: Pubkey,
    pub is_frozen: bool,
    pub created_at: i64,  // NEW
}

// Migration instruction
pub fn migrate_curve(ctx: Context<MigrateCurve>) -> Result<()> {
    let curve = &mut ctx.accounts.curve;
    curve.version = 2;
    curve.created_at = Clock::get()?.unix_timestamp;
    Ok(())
}
```

### IDL Version Management

**Current IDL Version:** 1.2.3

**Changes in this release:**
- Added `created_at` field to `Curve` account
- New instruction: `freeze_curve`
- New error: `AlreadyFrozen`

**Post-Deployment:**
```bash
# Regenerate IDL
anchor build
cp target/idl/curve_program.json app/lib/solana/idl/curve.json

# Regenerate TypeScript client
cd app
npx @coral-xyz/anchor idl:gen --file lib/solana/idl/curve.json --out lib/solana/types/curve.ts

# Verify TypeScript compilation
tsc --noEmit
```

### Test Matrix

#### Unit Tests (Rust)
- [ ] `test_initialize_curve` - Happy path
- [ ] `test_initialize_curve_invalid_params` - Error cases
- [ ] `test_buy_keys` - Purchase 100 keys
- [ ] `test_buy_keys_insufficient_funds` - Should fail
- [ ] `test_freeze_curve` - Authority freezes
- [ ] `test_freeze_curve_unauthorized` - Non-authority fails
- [ ] `test_freeze_curve_already_frozen` - Should error

#### Property Tests (Invariants)
- [ ] Price monotonically increases with purchases
- [ ] Total supply equals sum of all user holdings
- [ ] Fee vault balance matches expected fees
- [ ] Curve cannot be unfrozen once frozen

#### E2E Tests (Localnet)
- [ ] Full user journey: create curve → buy → freeze
- [ ] Multiple users buying/selling concurrently
- [ ] Edge case: Buy entire supply
- [ ] Edge case: Dust amounts (1 lamport)

#### E2E Tests (Devnet)
- [ ] Deploy and verify program ID
- [ ] Initialize curve from frontend
- [ ] Buy keys through UI
- [ ] Verify balances in Solana Explorer
- [ ] Test with real wallets (Phantom, Backpack)

#### Failure Cases
- [ ] Insufficient funds rejection
- [ ] Unauthorized freeze attempt
- [ ] Double-freeze protection
- [ ] Slippage protection triggers
- [ ] Invalid PDA derivation

### Deployment Plan

#### Phase 1: Localnet Testing
```bash
# Start local validator
solana-test-validator --reset

# Deploy program
anchor deploy

# Run integration tests
anchor test

# Verify all tests pass
```

#### Phase 2: Devnet Deployment
```bash
# Set cluster to devnet
solana config set --url devnet

# Fund deployment wallet
solana airdrop 2

# Build with optimizations
anchor build --verifiable

# Deploy
anchor deploy --provider.cluster devnet

# Verify deployment
solana program show <PROGRAM_ID>
```

**Verification Steps:**
- [ ] Program ID matches expected: `[program_id]`
- [ ] Upgrade authority is correct: `[authority]`
- [ ] Program data size is reasonable: ~[X] KB
- [ ] No deployment errors in logs

#### Phase 3: Mainnet Deployment (Future)
**Prerequisites:**
- [ ] Security audit completed (Sec3, OtterSec, etc.)
- [ ] Bug bounty program live ($50k minimum)
- [ ] Multi-sig upgrade authority configured
- [ ] Emergency pause mechanism tested
- [ ] Insurance fund allocated
- [ ] Legal review completed

**Mainnet Steps:**
1. Deploy to mainnet with multi-sig authority
2. Initialize protocol-owned curves
3. Monitor for 48 hours with small TVL cap
4. Gradual TVL increase: $10k → $100k → $1M
5. Public announcement after stability confirmed

**Rollback Trigger Conditions:**
- Critical vulnerability discovered
- Unexpected state corruption
- Compute unit budget exceeded
- Unrecoverable error in production

---

## Assumptions & Open Questions

**Assumptions:**
- Users have Phantom or Backpack wallet installed
- Devnet SOL is available for testing
- Appwrite collections are already set up
- [Add other assumptions]

**Open Questions:**
- Q: Should we rate-limit freeze operations?
- Q: What happens to pending orders when frozen?
- Q: Do we need admin override for freeze?

---

## Follow-Up Tasks

**Immediate (This PR):**
- None - all included

**Future (Separate PRs):**
- [ ] Add admin dashboard for curve monitoring
- [ ] Implement automatic freeze on suspicious activity
- [ ] Add analytics for freeze events
- [ ] Create user notification system
