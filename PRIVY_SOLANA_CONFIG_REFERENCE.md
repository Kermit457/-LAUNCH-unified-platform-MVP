# Privy Solana Configuration - Quick Reference Guide

> **IMPORTANT**: This is the definitive guide for configuring Privy with Solana in this project. Always refer to this document when context is lost or when setting up Privy from scratch.

---

## ✅ WORKING CONFIGURATION (Verified January 2025)

### Package Versions

```json
{
  "@privy-io/react-auth": "^3.3.0",
  "@solana/kit": "^4.0.0",
  "@solana/web3.js": "^1.98.4"
}
```

---

## 1. PrivyProviderWrapper Configuration

**File**: `contexts/PrivyProviderWrapper.tsx`

```typescript
"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { ReactNode, useEffect, useState } from 'react'

// ⚠️ CRITICAL: Import from @solana/rpc and @solana/rpc-subscriptions
// DO NOT import from @solana/kit directly - it causes bundling issues
import { createSolanaRpc } from '@solana/rpc'
import { createSolanaRpcSubscriptions } from '@solana/rpc-subscriptions'

export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''
  const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com'
  const solanaNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'

  if (!mounted) {
    return <>{children}</>
  }

  if (!appId || appId.trim() === '') {
    console.warn('⚠️ NEXT_PUBLIC_PRIVY_APP_ID not found - running without auth')
    return <>{children}</>
  }

  // Construct the chain identifier (e.g., 'solana:devnet' or 'solana:mainnet')
  const chainId = `solana:${solanaNetwork}` as const

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
        },
        loginMethods: ['email', 'twitter', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        // ⚠️ CRITICAL: Configure Solana RPC endpoints
        solana: {
          rpcs: {
            [chainId]: {
              rpc: createSolanaRpc(solanaRpcUrl),
              // Optional: Add WebSocket subscriptions for real-time updates
              // rpcSubscriptions: createSolanaRpcSubscriptions(solanaRpcUrl.replace('https://', 'wss://'))
            },
          },
        },
        // Enable external Solana wallet connectors (Phantom, Backpack, etc.)
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
```

### Key Points:
- ✅ **MUST** import from `@solana/rpc` and `@solana/rpc-subscriptions` (NOT `@solana/kit`)
- ✅ **MUST** configure `solana.rpcs` object with chain ID
- ✅ Chain ID format: `solana:devnet`, `solana:mainnet`, or `solana:testnet`
- ✅ Use environment variables for RPC URL and network
- ✅ Enable `externalWallets.solana.connectors` for Phantom, Backpack support

---

## 2. Transaction Signing Hook

**File**: `hooks/useSolanaBuyKeys.ts` (or any transaction hook)

```typescript
import { useState } from 'react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, useSignTransaction } from '@privy-io/react-auth/solana';
import { connection } from '@/lib/solana/config';

export function useSolanaBuyKeys() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets(); // Get Solana wallets
  const { signTransaction } = useSignTransaction();
  const [loading, setLoading] = useState(false);

  const buyKeys = async (amount: number) => {
    if (!ready || !authenticated) {
      throw new Error('Please connect your wallet first');
    }

    // Get the first wallet (embedded wallet)
    const wallet = wallets[0];
    if (!wallet || !wallet.address) {
      throw new Error('No Solana wallet found');
    }

    const publicKey = new PublicKey(wallet.address);
    setLoading(true);

    try {
      // Build your transaction
      const transaction = new Transaction();
      // ... add instructions ...

      // ⚠️ CRITICAL: Get chain ID from environment
      const solanaNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
      const chainId = `solana:${solanaNetwork}` as 'solana:devnet' | 'solana:mainnet' | 'solana:testnet';

      // Serialize transaction
      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      // Sign with Privy
      const signResult = await signTransaction({
        transaction: serializedTx,
        wallet: wallet,
        chain: chainId, // ⚠️ MUST pass chain parameter
      });

      // Send to network
      const signature = await connection.sendRawTransaction(signResult.signedTransaction);

      // Confirm
      await connection.confirmTransaction(signature, 'confirmed');

      return signature;
    } catch (err) {
      console.error('Transaction error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { buyKeys, loading };
}
```

### Key Points:
- ✅ Import `useWallets` and `useSignTransaction` from `@privy-io/react-auth/solana`
- ✅ **MUST** pass `chain` parameter to `signTransaction()`
- ✅ Chain format: `'solana:devnet' | 'solana:mainnet' | 'solana:testnet'`
- ✅ Sign transaction first, then send it yourself via your RPC connection

---

## 3. Next.js Configuration

**File**: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Handle Solana packages for browser compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
```

### Key Points:
- ✅ Add fallbacks for Node.js modules
- ❌ **DO NOT** use `config.externals` for `@solana/kit` - causes chunk loading errors
- ✅ Let webpack bundle Solana packages normally

---

## 4. Environment Variables

**File**: `.env.local`

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=cmfsej8w7013cle0df5ottcj6
PRIVY_APP_SECRET=4MQJHj4c5qyK6zCYU4PCNYtrPQB9NGXUNYSzn1YnYkHzZLuF8q7CNaihHtbZB5pW9VMCQvsb51s6Z3y5Cym3YEdn

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com

# For Mainnet:
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet
# NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
# Or use premium RPC: https://your-helius-url.com or https://your-quicknode-url.com
```

---

## 5. Root Layout Configuration

**File**: `app/layout.tsx`

```typescript
import { PrivyProviderWrapper } from '@/contexts/PrivyProviderWrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PrivyProviderWrapper>
          {/* Your other providers */}
          {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  )
}
```

---

## Common Errors & Solutions

### Error: "No RPC configuration found for chain solana:devnet"

**Cause**: Missing `solana.rpcs` configuration in PrivyProvider

**Solution**:
1. Ensure `createSolanaRpc` is imported from `@solana/rpc`
2. Configure `solana.rpcs` object in PrivyProvider config
3. Pass correct `chain` parameter in transaction hooks

### Error: "Loading chunk app/page failed"

**Cause**: Incorrect webpack externals configuration

**Solution**:
1. Remove `config.externals` for `@solana/kit`
2. Only use `config.resolve.fallback` for Node.js modules
3. Clear `.next` directory and restart

### Error: "Invalid or unexpected token"

**Cause**: Webpack bundling issue with Solana packages

**Solution**:
1. Import from `@solana/rpc` not `@solana/kit`
2. Clear `.next` directory: `Remove-Item -Recurse -Force .next`
3. Restart dev server: `npm run dev`

---

## Testing Checklist

After configuring Privy, verify:

- [ ] App starts without errors
- [ ] User can log in with email/Twitter
- [ ] Embedded Solana wallet is created automatically
- [ ] Wallet address is displayed in UI
- [ ] Transaction signing works without RPC errors
- [ ] Transaction appears on Solana Explorer
- [ ] No console errors about RPC configuration

---

## Verified Working Transaction Example

```
Transaction: 4Hdj6rPNUeQ728sgpB1gp1FPQ7dinHWenpM6GV4FrhDuyMQXf64THFG8UpEo4Hey65Qn5hkwFgrLNu8KzqKV6ykW
Network: Devnet
User: did:privy:cmgs10gwc016xl10c1p607za7
Amount: 0.058 SOL
Status: ✅ Verified on-chain
```

---

## Quick Recovery Steps

If you lose context or need to reconfigure:

1. **Check this file first** - `PRIVY_SOLANA_CONFIG_REFERENCE.md`
2. **Verify environment variables** - `.env.local` has correct values
3. **Check PrivyProviderWrapper** - Imports from `@solana/rpc`, has `solana.rpcs` config
4. **Check transaction hooks** - Pass `chain` parameter to `signTransaction()`
5. **Clear build cache** - `Remove-Item -Recurse -Force .next`
6. **Restart** - `npm run dev`

---

## Official Documentation

- [Privy React Auth](https://docs.privy.io)
- [Privy Solana Guide](https://docs.privy.io/recipes/solana/getting-started-with-privy-and-solana)
- [@solana/kit on npm](https://www.npmjs.com/package/@solana/kit)
- [@solana/rpc documentation](https://github.com/anza-xyz/kit)

---

**Last Verified**: January 2025
**Status**: ✅ Working (Transaction confirmed on Solana devnet)
**Version**: Privy v3.3.0 + @solana/kit v4.0.0
