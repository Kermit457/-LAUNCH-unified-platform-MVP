# 🔄 Architecture Changes Summary

## Before vs After

### ❌ OLD Architecture (V1)
```
Frontend
   ↓
Escrow Program (Single)
   ├── Boost Pool
   ├── Campaign Pool
   ├── Quest Pool
   ├── Contribution Pool
   ├── Revenue Pool
   └── Payout Pool
```

**Problems:**
- Boost escrow not needed
- All logic in one program (hard to upgrade)
- No native bonding curves
- Curve logic was off-chain only

---

### ✅ NEW Architecture (V2)
```
Frontend
   ↓
┌──────────────┴──────────────┐
│                             │
Curve Program         Escrow Program
├── UserCurve         ├── Campaign Pool
├── ProjectCurve      ├── Curve Reserve Pool
└── Launch Logic      ├── Reward Pool
                      ├── Referral Pool
                      └── Utility Vault
```

**Benefits:**
- ✅ No boost escrow (removed completely)
- ✅ Campaign escrow as single payment system
- ✅ Native Solana curves (on-chain bonding logic)
- ✅ Modular: add pools without redeploying
- ✅ Efficient CPI between programs
- ✅ Each program has single responsibility

---

## Key Changes

### 1. Removed
- ❌ Boost Escrow completely eliminated
- ❌ `/api/boost/pay` endpoint
- ❌ Boost-related UI components

### 2. Added
- ✅ **Curve Program** (new Solana program)
  - UserCurve contract
  - ProjectCurve contract
  - Buy/sell/freeze/launch logic
  - Pump.fun integration

- ✅ **Curve Reserve Pool** in Escrow
  - Holds bonding curve reserves
  - Linked 1:1 with each curve

### 3. Modified
- 🔄 **Escrow Program**: Simplified to focus on campaigns
- 🔄 **Pool Types**: Now extensible enum
- 🔄 **Frontend API**: New curve endpoints

---

## Data Flow Comparison

### OLD: Boost Payment Flow
```
User → Pay 10 USDC
  → Boost Pool (Escrow)
  → Split: 80% creator, 20% platform
  → Increment boost count in database
```

### NEW: Campaign Payment Flow
```
Creator → Create Campaign
  → Fund Campaign Pool (Escrow)
  → Users submit work
  → Backend approves
  → Escrow releases payment
```

### NEW: Curve Trading Flow
```
User → Buy keys
  → Calculate price (Curve Program)
  → Deposit to Reserve Pool (Escrow via CPI)
  → Update curve supply
  → Update holder position
  → Distribute fees
```

---

## Smart Contract Structure

### V1 (Single Program)
```
programs/
└── launchos-escrow/
    ├── lib.rs (500+ lines)
    ├── state.rs (all pool types)
    └── errors.rs
```

### V2 (Two Programs)
```
programs/
├── launchos-curve/          ← NEW
│   ├── lib.rs
│   ├── state.rs
│   │   ├── Curve
│   │   ├── CurveHolder
│   │   └── CurveSnapshot
│   ├── instructions/
│   │   ├── buy_keys.rs
│   │   ├── sell_keys.rs
│   │   ├── freeze.rs
│   │   └── launch.rs
│   └── errors.rs
│
└── launchos-escrow/         ← SIMPLIFIED
    ├── lib.rs (300 lines)
    ├── state.rs
    │   ├── Pool (all types)
    │   ├── PoolDeposit
    │   └── PoolWithdrawal
    └── errors.rs
```

---

## Account Changes

### Campaign Pool (Same Structure)
```rust
// No changes to campaign pool logic
Pool {
  pool_type: PoolType::Campaign,
  owner: creator_wallet,
  balance: 500_000000, // 500 USDC
  ...
}
```

### NEW: Curve + Reserve Pool
```rust
// Curve account (on-chain bonding logic)
Curve {
  curve_id: "user_123",
  supply: 150,
  base_price: 1_000000,
  slope: 10000,
  status: CurveStatus::Active,
  escrow_pool: pool_pda, // Links to reserve
}

// Reserve pool (holds curve funds)
Pool {
  pool_type: PoolType::CurveReserve,
  owner: curve_pda,
  balance: 2_500_000000, // Reserve
  ...
}
```

---

## Frontend Changes

### Removed Components
```typescript
// DELETE
components/payments/BoostPaymentModal.tsx
app/api/boost/pay/route.ts
```

### New Components
```typescript
// ADD
components/curve/BuyKeysModal.tsx
components/curve/SellKeysModal.tsx
components/curve/FreezeButton.tsx
components/curve/LaunchButton.tsx

// ADD
hooks/useCurve.ts
hooks/useCurveHolder.ts
lib/solana/curve-program.ts
```

### New API Routes
```typescript
// ADD
app/api/curve/create/route.ts
app/api/curve/buy/route.ts
app/api/curve/sell/route.ts
app/api/curve/freeze/route.ts
app/api/curve/launch/route.ts
```

---

## Migration Path

### Phase 1: Deploy New Contracts (Week 1)
1. Deploy updated Escrow (Campaign only)
2. Deploy new Curve program
3. Link programs via authority

### Phase 2: Frontend Integration (Week 2)
1. Build curve components
2. Update API routes
3. Remove boost logic

### Phase 3: Testing (Week 3)
1. Test campaign flow (unchanged)
2. Test curve buy/sell
3. Test freeze + launch
4. Load testing

### Phase 4: Production (Week 4)
1. Mainnet deployment
2. User migration
3. Monitor & iterate

---

## Benefits Summary

### For Development
- ✅ **Cleaner code**: Each program has single responsibility
- ✅ **Easier testing**: Programs tested independently
- ✅ **Better upgrades**: Add pool types without redeployment
- ✅ **Less coupling**: Frontend talks to specific programs

### For Users
- ✅ **Faster trades**: Native on-chain curves (no off-chain delays)
- ✅ **More transparent**: All curve logic visible on-chain
- ✅ **Provably fair**: Bonding math verifiable on Solana
- ✅ **Better UX**: Real-time price updates

### For Business
- ✅ **Composable**: Other projects can integrate your curves
- ✅ **Extensible**: Easy to add new features (stake, governance, etc.)
- ✅ **Auditable**: Clear separation of concerns
- ✅ **Future-proof**: Built for long-term evolution

---

## Quick Reference

### What Stays?
- ✅ Campaign escrow logic
- ✅ Campaign pool structure
- ✅ Campaign payment flow
- ✅ Appwrite database
- ✅ Existing UI (campaigns)

### What's New?
- ✅ Curve Program (Solana)
- ✅ Curve Reserve Pools
- ✅ On-chain trading
- ✅ Freeze/snapshot/launch
- ✅ Pump.fun integration

### What's Removed?
- ❌ Boost escrow
- ❌ Boost payment logic
- ❌ Boost UI/API

---

## Decision Summary

| Question | Decision | Rationale |
|----------|----------|-----------|
| Keep boost escrow? | ❌ No | Not needed for core functionality |
| Campaign escrow? | ✅ Yes | Core payment system |
| Native curves? | ✅ Yes | Better UX, composability, transparency |
| Separate programs? | ✅ Yes | Modularity, upgrades, clarity |
| New pool types? | ✅ Yes | Extensible via enum |
| CPI integration? | ✅ Yes | Curve ↔ Escrow communication |

---

**Status**: Architecture finalized ✅
**Next**: Implement Curve Program
**Timeline**: 4 weeks to production

Ready to build! 🚀
