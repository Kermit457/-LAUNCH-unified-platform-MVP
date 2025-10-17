# Privy Solana - Quick Reference Card

> Copy-paste ready snippets for Privy + Solana configuration

## ✅ Correct Imports

```typescript
// ✅ CORRECT - Import from specific packages
import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { createSolanaRpc } from '@solana/rpc'
import { createSolanaRpcSubscriptions } from '@solana/rpc-subscriptions'

// For transaction hooks
import { usePrivy } from '@privy-io/react-auth'
import { useWallets, useSignTransaction } from '@privy-io/react-auth/solana'
```

```typescript
// ❌ WRONG - Don't do this
import { createSolanaRpc } from '@solana/kit' // Causes bundling issues
```

---

## ✅ PrivyProvider Config

```typescript
<PrivyProvider
  appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
  config={{
    appearance: { theme: 'dark', accentColor: '#8B5CF6' },
    loginMethods: ['email', 'twitter', 'wallet'],
    embeddedWallets: { createOnLogin: 'all-users' },

    // ⚠️ CRITICAL: Configure RPC endpoints
    solana: {
      rpcs: {
        'solana:devnet': {
          rpc: createSolanaRpc('https://api.devnet.solana.com'),
        },
      },
    },

    // External wallets (Phantom, Backpack, etc.)
    externalWallets: {
      solana: { connectors: toSolanaWalletConnectors() },
    },
  }}
>
  {children}
</PrivyProvider>
```

---

## ✅ Transaction Signing

```typescript
const { wallets } = useWallets();
const { signTransaction } = useSignTransaction();

const wallet = wallets[0]; // Embedded wallet
const chainId = 'solana:devnet'; // or 'solana:mainnet'

// Build transaction
const transaction = new Transaction();
// ... add instructions ...

// Serialize
const serializedTx = transaction.serialize({
  requireAllSignatures: false,
  verifySignatures: false,
});

// Sign with Privy
const signResult = await signTransaction({
  transaction: serializedTx,
  wallet: wallet,
  chain: chainId, // ⚠️ MUST include chain parameter
});

// Send to network
const signature = await connection.sendRawTransaction(
  signResult.signedTransaction
);
```

---

## ✅ Environment Variables

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here
PRIVY_APP_SECRET=your_secret_here
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
```

---

## ✅ Next.js Config

```javascript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
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
```

**DO NOT** add externals for `@solana/kit` or `@solana/rpc`

---

## 🔧 Troubleshooting Commands

```powershell
# Clear build cache
Remove-Item -Recurse -Force .next

# Restart dev server
npm run dev

# Check for RPC errors in console
# If "No RPC configuration found" → Check PrivyProvider config
```

---

## 📚 Full Documentation

See [PRIVY_SOLANA_CONFIG_REFERENCE.md](../PRIVY_SOLANA_CONFIG_REFERENCE.md) for:
- Complete code examples
- Error solutions
- Testing checklist
- Recovery steps

---

**Last Updated**: January 2025
**Status**: ✅ Working (Verified with transaction on devnet)
