# Privy v3.3.0 Solana Transaction - ACTUAL WORKING SOLUTION

## The Journey
1. ❌ First attempt: Used undefined `wallet` variable
2. ❌ Second attempt: Used `sendTransaction` from usePrivy
3. ❌ Third attempt: Tried `useSolanaWallets` (doesn't exist in v3.3.0)
4. ✅ **FINAL**: Read the actual TypeScript definitions from node_modules

## The ACTUAL Exports in Privy v3.3.0

Looking at `node_modules/@privy-io/react-auth/dist/dts/solana.d.ts`, the **real exports** are:

```typescript
// From '@privy-io/react-auth/solana'
export {
  useWallets,                    // Returns ConnectedStandardSolanaWallet[]
  useSignAndSendTransaction,     // Hook to sign and send transactions
  useSignTransaction,            // Hook to sign transactions
  useSignMessage,                // Hook to sign messages
  useCreateWallet,               // Hook to create embedded wallet
  useExportWallet,               // Hook to export wallet
  // ... and more
}
```

## Working Implementation

### 1. Correct Imports (v3.3.0)
```typescript
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, useSignAndSendTransaction } from '@privy-io/react-auth/solana';
```

**Note**: `useSolanaWallets` does NOT exist! It's `useWallets` from the `/solana` export.

### 2. Initialize Hooks
```typescript
const { ready, authenticated } = usePrivy();
const { wallets } = useWallets();  // Returns ConnectedStandardSolanaWallet[]
const { signAndSendTransaction } = useSignAndSendTransaction();
```

### 3. Get Wallet
```typescript
// useWallets() returns ConnectedStandardSolanaWallet[]
const wallet = wallets[0];  // Get first wallet (embedded wallet)

if (!wallet || !wallet.address) {
  throw new Error('No Solana wallet found. Please connect your wallet.');
}

const publicKey = new PublicKey(wallet.address);
```

### 4. Sign and Send Transaction (Official v3.3.0 Method)
```typescript
// Serialize transaction
const serializedTx = transaction.serialize({
  requireAllSignatures: false,
  verifySignatures: false,
});

// Use the signAndSendTransaction HOOK (not a wallet method!)
const txResponse = await signAndSendTransaction({
  transaction: serializedTx,  // Uint8Array
  wallet: wallet,              // ConnectedStandardSolanaWallet
  chain: 'solana:devnet',      // SolanaChain type
});

// Response type: { signature: Uint8Array }
const signatureBytes = txResponse.signature;
const signature = bs58.encode(signatureBytes);

// Wait for confirmation
const confirmation = await connection.confirmTransaction({
  signature,
  blockhash,
  lastValidBlockHeight,
}, 'confirmed');
```

## Key Differences from Documentation

### What the Web Says:
- "Use `useSolanaWallets`" ❌ (doesn't exist in v3.3.0)
- "Call `wallet.signAndSendTransaction()`" ❌ (wallet doesn't have this method)

### What Actually Works in v3.3.0:
- Use `useWallets` from `'@privy-io/react-auth/solana'` ✅
- Use `useSignAndSendTransaction` HOOK ✅
- Call `signAndSendTransaction({transaction, wallet, chain})` ✅

## Type Signatures (from solana.d.ts)

### useWallets
```typescript
interface UseWallets {
  ready: boolean;
  wallets: ConnectedStandardSolanaWallet[];
}
```

### useSignAndSendTransaction
```typescript
type UseSignAndSendTransaction = {
  signAndSendTransaction(input: SignAndSendTransactionInput): Promise<SignAndSendTransactionOutput>;
};

type SignAndSendTransactionInput = {
  transaction: Uint8Array;
  wallet: ConnectedStandardSolanaWallet;
  chain?: SolanaChain;  // 'solana:mainnet' | 'solana:devnet' | 'solana:testnet'
  options?: SolanaSignAndSendTransactionOptions & {
    uiOptions?: SendTransactionModalUIOptions;
  };
};

type SignAndSendTransactionOutput = {
  signature: Uint8Array;  // Note: Returns Uint8Array, not string!
};
```

## PrivyProvider Configuration (REQUIRED!)

**IMPORTANT**: You MUST configure Solana RPC endpoints in your PrivyProvider:

```typescript
// contexts/PrivyProviderWrapper.tsx
<PrivyProvider
  appId={appId}
  config={{
    embeddedWallets: {
      createOnLogin: 'all-users',
      requireUserPasswordOnCreate: false,
      noPromptOnSignature: false,
    },
    // REQUIRED: Solana RPC configuration
    solanaClusters: [
      {
        name: 'devnet',
        rpcUrl: 'https://api.devnet.solana.com',
      },
      {
        name: 'mainnet-beta',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
      },
    ],
  }}
>
  {children}
</PrivyProvider>
```

Without this configuration, you'll get: "No RPC configuration found for chain solana:devnet"

## Complete Working Code

```typescript
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, useSignAndSendTransaction } from '@privy-io/react-auth/solana';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import bs58 from 'bs58';

export function useSolanaBuyKeys() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { signAndSendTransaction } = useSignAndSendTransaction();

  const buyKeys = async (amountSol: number) => {
    if (!ready || !authenticated) {
      throw new Error('Please connect your wallet first');
    }

    const wallet = wallets[0];
    if (!wallet || !wallet.address) {
      throw new Error('No Solana wallet found');
    }

    const publicKey = new PublicKey(wallet.address);

    // Build transaction
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: publicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: someRecipient,
        lamports: amountSol * 1_000_000_000,
      })
    );

    // Serialize
    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    // Sign and send using Privy hook
    const txResponse = await signAndSendTransaction({
      transaction: serializedTx,
      wallet: wallet,
      chain: 'solana:devnet',
    });

    // Convert signature from Uint8Array to base58 string
    const signature = bs58.encode(txResponse.signature);

    // Wait for confirmation
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');

    return signature;
  };

  return { buyKeys };
}
```

## Testing

1. **Start dev server**: `npm run dev`
2. **Navigate to**: http://localhost:3000/curve-demo
3. **Connect wallet**: Click "Connect Wallet" → Login with Twitter
4. **Click "Buy Keys"**

### Expected Console Output:
```
🔍 Available Solana wallets: [ConnectedStandardSolanaWallet]
🔍 Number of Solana wallets: 1
🎯 Selected Solana wallet: {address: "9b7peEZzAf...", ...}
✍️ Signing and sending buy transaction with Privy...
📤 Transaction response: {signature: Uint8Array(64)}
⏳ Waiting for confirmation...
✅ Keys purchased, signature: 3Xk...signature...xyz
```

## Files Updated
- [hooks/useSolanaBuyKeys.ts](hooks/useSolanaBuyKeys.ts) - Transaction signing logic
- [contexts/PrivyProviderWrapper.tsx](contexts/PrivyProviderWrapper.tsx) - Added Solana RPC config

## V6 Fee Structure
Once transaction succeeds, V6 fees apply:
- 94% → Reserve
- 3% → Referral (flexible)
- 1% → Project (guaranteed)
- 1% → Buyback/Burn
- 1% → Community

## Important Notes

1. **Version-Specific**: This is for Privy v3.3.0 specifically
2. **Hook Pattern**: Use hooks, not wallet methods
3. **Signature Format**: Returns `Uint8Array`, must convert to base58
4. **Chain Format**: Use `'solana:devnet'` or `'solana:mainnet-beta'`

## Why This Was Confusing

- Online documentation references newer APIs that don't exist in v3.3.0
- Had to read the actual TypeScript definitions from node_modules
- Hook-based pattern is different from typical wallet adapter patterns
- Signature is returned as Uint8Array, not string