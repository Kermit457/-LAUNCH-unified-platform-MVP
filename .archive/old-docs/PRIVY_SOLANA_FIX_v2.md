# Privy Solana Transaction Fix - Official SDK Implementation

## Issue
The previous implementation was trying to use `sendTransaction` from the general Privy hook, which didn't have access to the embedded Solana wallet. Error was: "No embedded or connected wallet found for address."

## Solution
Updated to use the **official Privy SDK approach** for Solana embedded wallets as documented in Privy's official guides.

## Changes Made

### 1. Updated Imports
```typescript
// OLD:
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallet } from './useSolanaWallet';

// NEW (Official Privy SDK):
import { usePrivy, useWallets } from '@privy-io/react-auth';
```

### 2. Updated Hook Initialization
```typescript
// OLD:
const { ready, authenticated, sendTransaction } = usePrivy();
const { publicKey, address } = useSolanaWallet();

// NEW (Official Privy SDK):
const { ready, authenticated } = usePrivy();
const { wallets } = useWallets();
```

### 3. Get Solana Embedded Wallet
```typescript
// Find the Privy-managed Solana embedded wallet
const solanaWallet = wallets.find(
  (wallet) => wallet.walletClientType === 'privy' && wallet.chainType === 'solana'
);

if (!solanaWallet || !solanaWallet.address) {
  throw new Error('No Solana embedded wallet found. Please reconnect.');
}

const publicKey = new PublicKey(solanaWallet.address);
```

### 4. Sign and Send Transaction (Official Method)
```typescript
// Serialize the transaction
const serializedTx = transaction.serialize({
  requireAllSignatures: false,
  verifySignatures: false,
});

// Use wallet's signAndSendTransaction method (Official Privy API)
const txResponse = await solanaWallet.signAndSendTransaction(serializedTx, {
  chain: 'solana:devnet',
});

// Extract signature from response
let signature: string;
if (typeof txResponse === 'string') {
  signature = txResponse;
} else if (txResponse && typeof txResponse === 'object' && 'signature' in txResponse) {
  signature = (txResponse as any).signature;
} else {
  throw new Error('Unexpected transaction response format');
}
```

## Why This Works

1. **useWallets Hook**: This is the official Privy hook that provides access to all user wallets (embedded and external)

2. **Wallet Selection**: We find the Privy-managed embedded Solana wallet by filtering:
   - `walletClientType === 'privy'` (it's a Privy embedded wallet)
   - `chainType === 'solana'` (it's a Solana wallet)

3. **signAndSendTransaction Method**: Each wallet object has this method that:
   - Takes serialized transaction as Uint8Array
   - Takes options including chain specification
   - Returns transaction signature
   - Handles all the signing internally with Privy's infrastructure

## Testing Instructions

1. **Start dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Navigate to curve demo**:
   ```
   http://localhost:3000/curve-demo
   ```

3. **Connect wallet**:
   - Click "Connect Wallet"
   - Login with Twitter
   - Privy creates embedded Solana wallet automatically

4. **Test buy keys**:
   - Click "Buy Keys" button
   - Should see Privy transaction confirmation
   - Transaction should process without "wallet not found" error

## Expected Results

✅ No more "No embedded or connected wallet found" error
✅ Transaction properly signed by Privy embedded wallet
✅ Console shows transaction progress
✅ Signature returned and logged
✅ Explorer link generated

## References

This implementation follows the official Privy SDK documentation:
- Privy React SDK: `@privy-io/react-auth`
- Official Hook: `useWallets()`
- Official Method: `wallet.signAndSendTransaction()`
- Supported chains: Use format like `'solana:devnet'` or `'solana:mainnet-beta'`

## V6 Fee Structure

When the transaction succeeds, it applies the V6 bonding curve fees:
- 94% → Reserve (for liquidity)
- 3% → Referral (flexible routing)
- 1% → Project (guaranteed minimum)
- 1% → Buyback/Burn
- 1% → Community Rewards