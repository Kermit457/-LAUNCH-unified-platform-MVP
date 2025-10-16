# Wallet Integration Fix - Testing Instructions

## What Was Fixed

The `useSolanaBuyKeys.ts` hook was broken because it was trying to use an undefined `wallet` variable. The issue was on line 88:

```typescript
// OLD (BROKEN):
const result = await (wallet as any).signAndSendTransaction(...)
```

## The Fix Applied

Updated the hook to use Privy's `sendTransaction` method properly:

1. **Import the right hooks:**
   - Added `import { useSolanaWallet } from './useSolanaWallet'`
   - Get `sendTransaction` from `usePrivy()`

2. **Use Privy's transaction signing:**
```typescript
// NEW (FIXED):
const { ready, authenticated, sendTransaction } = usePrivy();
const { publicKey, address } = useSolanaWallet();

// Later in the code:
const result = await sendTransaction(transaction, uiConfig);
const signature = result.transactionHash;
```

## How to Test

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the curve demo page:**
   ```
   http://localhost:3000/curve-demo
   ```

3. **Connect your wallet:**
   - Click "Connect Wallet"
   - Login with Twitter
   - Your embedded wallet address should appear

4. **Test buying keys:**
   - Click "Buy Keys" button
   - You should see a Privy popup asking to confirm the transaction
   - The transaction should process without the "wallet is not defined" error

## Expected Behavior

- ✅ No more "wallet is not defined" error
- ✅ Privy transaction popup appears
- ✅ Transaction gets signed and sent
- ✅ Console shows transaction progress
- ✅ Explorer link appears after success

## If There Are Still Issues

The transaction will likely fail because:
- The curve doesn't exist on-chain yet
- Or there's insufficient balance

But the important thing is that the signing error should be fixed!

## V6 Fee Structure (What Gets Applied)

When a successful transaction goes through, the V6 fees are:
- 94% → Reserve (for liquidity)
- 3% → Referral (flexible routing based on referrer)
- 1% → Project (guaranteed minimum)
- 1% → Buyback/Burn
- 1% → Community Rewards