# V6 Solana Integration - Auto-CCM System

## 🎯 Overview

The auto-CCM system is now wired to your **V6 Anchor smart contract** on Solana devnet.

**Program ID:** `Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF`

---

## 🔄 Complete Flow

### 1. User Signs Up with Twitter (Privy)

**Location:** `hooks/useSyncPrivyToAppwrite.ts`

```typescript
// When user logs in via Privy
// ✅ Auto-authenticated
// ✅ Avatar from Twitter
// ✅ Twitter username captured
```

### 2. Curve Created On-Chain

**Option A: Automatic Creation (Recommended)**

Create the curve automatically on first login:

```typescript
// In useSyncPrivyToAppwrite.ts, add:
import { useCreateCurve } from '@/hooks/useCreateCurve'

const { createCurve } = useCreateCurve()

// When new user detected:
if (!existingProfile && username) {
  // Create curve on Solana blockchain
  try {
    const signature = await createCurve(username, 0) // 0 = creator gets 0 initial keys
    console.log('🎉 Curve created on-chain:', signature)

    // Then create Appwrite profile with Twitter handle
    await createUserProfile({
      userId,
      username,
      twitter: username, // Curve identifier
      // ... other fields
    })
  } catch (error) {
    console.error('Failed to create curve:', error)
  }
}
```

**Option B: Manual Creation**

Show a "Create My Curve" button that calls:

```typescript
const { createCurve } = useCreateCurve()

async function handleCreateCurve() {
  const signature = await createCurve(twitterHandle, 0)
  // Curve now exists on-chain with status: Pending
}
```

### 3. Check Activation Status

**Location:** `hooks/useCurveActivationV6.ts`

This hook reads directly from the Solana blockchain:

```typescript
import { useCurveActivationV6 } from '@/hooks/useCurveActivationV6'

const {
  progress,
  loading,
  showActivationModal,
  setShowActivationModal,
  isActivated,
  needsCreation
} = useCurveActivationV6()

// progress.currentKeys = keys owned on-chain
// progress.isActive = curve status === 'active' on-chain
// progress.curveExists = curve has been initialized
```

### 4. User Buys Keys

**Location:** `hooks/useSolanaBuyKeys.ts` (you already have this)

When user buys their own keys:

1. Transaction executes on-chain via `buyKeys` instruction
2. `KeyHolder` account created/updated
3. When `currentKeys >= 10`, curve status changes to `Active` automatically

### 5. Activation Completes

The `useCurveActivationV6` hook polls every 10 seconds and detects:

```typescript
{
  currentKeys: 10,
  hasMinKeys: true,
  isActive: true, // Curve status changed to Active!
  curveExists: true
}
```

Platform features unlock automatically.

---

## 📁 File Structure

### Created Files

| File | Purpose |
|------|---------|
| `lib/solana/create-curve.ts` | On-chain curve creation & status checking |
| `hooks/useCreateCurve.ts` | React hook to create curves with Privy wallet |
| `hooks/useCurveActivationV6.ts` | React hook to check activation status from blockchain |
| `components/onboarding/ActivateCurveModal.tsx` | Modal UI for activation flow |
| `components/onboarding/InactiveCurveBanner.tsx` | Dashboard banner showing progress |
| `components/onboarding/PlatformAccessGate.tsx` | Lock features until activated |

### Updated Files

| File | Changes |
|------|---------|
| `app/network/page.tsx` | Added activation banner + modal |
| `types/curve.ts` | Added `'inactive'` to `CurveState` type |
| `lib/appwrite/services/users.ts` | Added `curveId` field to `UserProfile` |

---

## 🔧 Integration Steps

### Step 1: Update Network Page to Use V6 Hook

**File:** `app/network/page.tsx`

```typescript
// Replace this:
import { useCurveActivation } from '@/hooks/useCurveActivation'

// With this:
import { useCurveActivationV6 } from '@/hooks/useCurveActivationV6'

// Then use it:
const {
  progress,
  loading,
  showActivationModal,
  setShowActivationModal,
  activateCurve,
  isActivated,
  needsCreation
} = useCurveActivationV6()
```

### Step 2: Add Curve Creation to Login Flow

**File:** `hooks/useSyncPrivyToAppwrite.ts`

Add automatic curve creation when new user signs up:

```typescript
import { useCreateCurve } from '@/hooks/useCreateCurve'

export function useSyncPrivyToAppwrite() {
  const { user, userId, username, ... } = useUser()
  const { createCurve } = useCreateCurve()

  useEffect(() => {
    async function syncUser() {
      // ... existing code ...

      if (!existingProfile && username) {
        // NEW: Create curve on Solana first
        try {
          console.log('🎨 Creating curve on-chain for:', username)
          const signature = await createCurve(username, 0)

          if (signature !== 'already_exists') {
            console.log('🎉 Curve created! TX:', signature)
          }
        } catch (error) {
          console.error('⚠️ Curve creation failed:', error)
          // Continue anyway - curve can be created later
        }

        // Create Appwrite profile
        await createUserProfile({
          userId,
          username,
          twitter: username, // Important: curve identifier
          // ... other fields
        })
      }
    }

    syncUser()
  }, [isAuthenticated, userId, username])
}
```

### Step 3: Show Creation Button if Curve Doesn't Exist

**File:** `app/network/page.tsx`

```typescript
{needsCreation && (
  <motion.div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-orange-900/40 to-zinc-900/60 border border-orange-500/20">
    <h3 className="text-xl font-bold text-white mb-2">Create Your Curve</h3>
    <p className="text-zinc-400 mb-4">
      Initialize your bonding curve on Solana to start trading
    </p>
    <CreateCurveButton twitterHandle={progress.twitterHandle} />
  </motion.div>
)}
```

---

## 🎨 UI Components Usage

### Activation Modal

```typescript
<ActivateCurveModal
  isOpen={showActivationModal}
  onClose={() => setShowActivationModal(false)}
  onActivate={activateCurve}
  userId={userId || ''}
  progress={progress}
/>
```

### Activation Banner

```typescript
{!loading && !isActivated && (
  <InactiveCurveBanner
    onActivate={() => setShowActivationModal(true)}
    currentKeys={progress.currentKeys}
    minKeysRequired={progress.minKeysRequired}
  />
)}
```

### Lock Features

```typescript
import { PlatformAccessGate } from '@/components/onboarding/PlatformAccessGate'

<PlatformAccessGate
  isLocked={!isActivated}
  feature="launch projects"
  onUnlock={() => setShowActivationModal(true)}
>
  <LaunchButton />
</PlatformAccessGate>
```

---

## 🔍 Debugging

### Check Curve Status

```typescript
import { getCurveStatus, curveExistsOnChain } from '@/lib/solana/create-curve'

const exists = await curveExistsOnChain('elonmusk')
const status = await getCurveStatus('elonmusk')
// Returns: 'pending' | 'active' | 'frozen' | 'launched' | null
```

### Check Key Holdings

```typescript
import { getUserKeyHoldings } from '@/lib/solana/create-curve'
import { PublicKey } from '@solana/web3.js'

const keys = await getUserKeyHoldings(
  'elonmusk',
  new PublicKey('wallet_address')
)
// Returns: number of keys owned
```

### View On-Chain Account

```bash
# Get curve PDA
const curvePDA = getCurvePDA('elonmusk')
console.log('Curve PDA:', curvePDA.toString())

# View on explorer
https://explorer.solana.com/address/{curvePDA}?cluster=devnet
```

---

## 🧪 Testing Flow

### 1. New User Signup

1. Log in with new Twitter account via Privy
2. Check console for: `🎨 Creating curve on-chain`
3. Wait for: `🎉 Curve created!`
4. Verify on Solana Explorer

### 2. Check Activation Status

1. Activation modal should appear
2. Shows: "0/10 keys"
3. Status: Locked

### 3. Buy Keys

1. Click "Buy My Keys" in modal
2. Use existing `useSolanaBuyKeys` hook
3. Watch console for key purchases
4. Modal updates: "1/10 keys", "2/10 keys", etc.

### 4. Activation at 10 Keys

1. After 10th key purchase
2. `useCurveActivationV6` detects `currentKeys >= 10`
3. On-chain status should be `Active`
4. Banner disappears
5. Features unlock

---

## ⚙️ Smart Contract States

| State | Meaning | User Can |
|-------|---------|----------|
| **Pending** | Curve created, waiting for keys | Browse only |
| **Active** | 10+ keys owned, curve trading | Full access |
| **Frozen** | Preparing for launch | View only |
| **Launched** | Migrated to SPL token | Trade token |

---

## 🚀 Next Steps

1. **Update Network Page**: Use `useCurveActivationV6` instead of `useCurveActivation`
2. **Add Curve Creation**: Wire `useCreateCurve` to login flow
3. **Test with New User**: Sign up with fresh Twitter account
4. **Buy Keys**: Test activation at 10 keys
5. **Lock Features**: Add `PlatformAccessGate` to comments, launches, etc.

---

## 🔗 Key Resources

- **V6 Smart Contract**: `Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF`
- **Devnet Explorer**: https://explorer.solana.com/address/Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF?cluster=devnet
- **IDL**: `lib/idl/launchos_curve.json`
- **Config Guide**: `AUTO_CCM_IMPLEMENTATION_GUIDE.md`

---

## 💡 Tips

1. **Curve Identifier**: Always use Twitter handle (not userId)
2. **Initial Keys**: Set to 0 so creator must buy their own (anti-rug)
3. **Polling**: `useCurveActivationV6` polls every 10s to detect key purchases
4. **Error Handling**: Curve creation errors are non-fatal - user can retry
5. **Gas**: User pays SOL for curve creation (~0.01 SOL)

---

## 🎯 Summary

**Before:** Auto-CCM created in Appwrite database
**After:** Auto-CCM created on Solana blockchain

**Activation:** When user owns 10+ keys on-chain, status changes to `Active`

**Result:** Fully decentralized curve system integrated with your V6 smart contract!
