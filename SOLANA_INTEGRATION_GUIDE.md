# 🔗 Solana Bonding Curve Integration Guide

**For:** Next.js 14 + Privy Auth
**Deployed Programs:** Solana Devnet
**Date:** October 15, 2025

---

## Step 1: Install Solana Dependencies

```bash
npm install @solana/web3.js @coral-xyz/anchor bs58
```

Or with yarn:
```bash
yarn add @solana/web3.js @coral-xyz/anchor bs58
```

---

## Step 2: Create Environment Variables

Create or update `.env.local`:

```bash
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com

# Program IDs
NEXT_PUBLIC_CURVE_PROGRAM_ID=Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
NEXT_PUBLIC_ESCROW_PROGRAM_ID=5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc
```

---

## Step 3: Copy IDL Files

1. **Copy the IDL file from Solana program:**

```bash
# From your solana-program folder
cp solana-program/target/idl/launchos_curve.json lib/idl/
```

2. **Create the IDL directory:**

```bash
mkdir -p lib/idl
```

---

## Step 4: Create Solana Configuration

Create `lib/solana/config.ts`:

```typescript
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';

// Program IDs
export const CURVE_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_CURVE_PROGRAM_ID || 'Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF'
);

export const ESCROW_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_ESCROW_PROGRAM_ID || '5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc'
);

// Network Configuration
export const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta';

export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl(SOLANA_NETWORK);

// Create connection
export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Explorer URL helper
export function getExplorerUrl(address: string, type: 'address' | 'tx' = 'address'): string {
  const cluster = SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : '';
  return `https://explorer.solana.com/${type}/${address}${cluster}`;
}
```

---

## Step 5: Create Anchor Program Instance

Create `lib/solana/program.ts`:

```typescript
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { PublicKey, Connection } from '@solana/web3.js';
import { CURVE_PROGRAM_ID, connection } from './config';
import IDL from '../idl/launchos_curve.json';

// Type for your program
export type LaunchosCurveProgram = Program<Idl>;

// Create program instance
export function getCurveProgram(wallet: any): LaunchosCurveProgram {
  const provider = new AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );

  return new Program(
    IDL as Idl,
    CURVE_PROGRAM_ID,
    provider
  );
}

// Helper to derive PDAs
export function getCurvePDA(twitterHandle: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('curve'),
      Buffer.from(twitterHandle)
    ],
    CURVE_PROGRAM_ID
  );
  return pda;
}

export function getKeyHolderPDA(curve: PublicKey, wallet: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('holder'),
      curve.toBuffer(),
      wallet.toBuffer()
    ],
    CURVE_PROGRAM_ID
  );
  return pda;
}

export function getConfigPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    CURVE_PROGRAM_ID
  );
  return pda;
}

export function getBanListPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('ban_list')],
    CURVE_PROGRAM_ID
  );
  return pda;
}
```

---

## Step 6: Create Solana Wallet Adapter Hook

Create `hooks/useSolanaWallet.ts`:

```typescript
import { useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

export function useSolanaWallet() {
  const { user, ready } = usePrivy();

  // Get Solana wallet from Privy
  const solanaWallet = useMemo(() => {
    if (!user || !ready) return null;

    // Privy provides a Solana wallet
    const wallet = user.linkedAccounts?.find(
      (account) => account.type === 'solana'
    );

    if (!wallet || !('address' in wallet)) return null;

    return {
      publicKey: new PublicKey(wallet.address),
      signTransaction: async (tx: Transaction | VersionedTransaction) => {
        // Privy handles signing
        // This will be implemented based on Privy's Solana SDK
        throw new Error('Implement with Privy Solana signer');
      },
      signAllTransactions: async (txs: (Transaction | VersionedTransaction)[]) => {
        throw new Error('Implement with Privy Solana signer');
      },
    };
  }, [user, ready]);

  return {
    wallet: solanaWallet,
    publicKey: solanaWallet?.publicKey || null,
    connected: !!solanaWallet,
    ready,
  };
}
```

---

## Step 7: Create Buy Keys Hook

Create `hooks/useBuyKeys.ts`:

```typescript
import { useState } from 'react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { getCurveProgram, getCurvePDA, getKeyHolderPDA, getConfigPDA, getBanListPDA } from '@/lib/solana/program';
import { connection } from '@/lib/solana/config';
import { useSolanaWallet } from './useSolanaWallet';

export function useBuyKeys() {
  const { wallet, publicKey } = useSolanaWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyKeys = async (
    twitterHandle: string,
    amount: number,
    referrer?: string // Privy wallet address
  ) => {
    if (!wallet || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const program = getCurveProgram(wallet);

      // Derive PDAs
      const curvePda = getCurvePDA(twitterHandle);
      const keyHolderPda = getKeyHolderPDA(curvePda, publicKey);
      const configPda = getConfigPDA();
      const banListPda = getBanListPDA();

      // Fetch curve data to get wallet addresses
      const curveAccount = await program.account.bondingCurve.fetch(curvePda);

      // Prepare accounts
      const accounts: any = {
        curve: curvePda,
        reserveVault: curveAccount.reserveVault,
        keyHolder: keyHolderPda,
        buyer: publicKey,
        creator: curveAccount.creator,
        platformTreasury: curveAccount.platformTreasury,
        buybackWallet: curveAccount.buybackWallet,
        communityWallet: curveAccount.communityWallet,
        config: configPda,
        banList: banListPda,
        systemProgram: SystemProgram.programId,
      };

      // Add referrer if provided
      if (referrer) {
        accounts.referrer = new PublicKey(referrer);
      }

      // Execute transaction
      const tx = await program.methods
        .buyKeys(
          new BN(amount),
          referrer ? new PublicKey(referrer) : null
        )
        .accounts(accounts)
        .rpc();

      console.log('Keys purchased! TX:', tx);
      return tx;

    } catch (err: any) {
      console.error('Buy keys error:', err);
      setError(err.message || 'Failed to buy keys');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    buyKeys,
    loading,
    error,
  };
}
```

---

## Step 8: Create a Buy Keys Component

Create `components/BuyKeysButton.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useBuyKeys } from '@/hooks/useBuyKeys';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { getExplorerUrl } from '@/lib/solana/config';

interface BuyKeysButtonProps {
  twitterHandle: string;
  amount: number;
  referrer?: string;
  onSuccess?: (txSignature: string) => void;
}

export function BuyKeysButton({
  twitterHandle,
  amount,
  referrer,
  onSuccess,
}: BuyKeysButtonProps) {
  const { connected, publicKey } = useSolanaWallet();
  const { buyKeys, loading, error } = useBuyKeys();
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handleBuy = async () => {
    try {
      const signature = await buyKeys(twitterHandle, amount, referrer);
      setTxSignature(signature);
      onSuccess?.(signature);
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  if (!connected) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-400 text-white rounded opacity-50 cursor-not-allowed"
      >
        Connect Wallet First
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Buy ${amount} Keys`}
      </button>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {txSignature && (
        <a
          href={getExplorerUrl(txSignature, 'tx')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm block"
        >
          View Transaction →
        </a>
      )}
    </div>
  );
}
```

---

## Step 9: Integrate with Your Existing Curve Page

Update your curve page to use Solana:

```typescript
// app/curve/[handle]/page.tsx
import { BuyKeysButton } from '@/components/BuyKeysButton';
import { usePrivy } from '@privy-io/react-auth';

export default function CurvePage({ params }: { params: { handle: string } }) {
  const { user } = usePrivy();

  // Get referrer from user's Privy wallet
  const referrer = user?.linkedAccounts?.find(
    (account) => account.type === 'solana'
  )?.address;

  return (
    <div>
      <h1>Bonding Curve: {params.handle}</h1>

      <BuyKeysButton
        twitterHandle={params.handle}
        amount={10}
        referrer={referrer}
        onSuccess={(tx) => {
          console.log('Purchase successful!', tx);
          // Refresh your Appwrite data here
        }}
      />
    </div>
  );
}
```

---

## Step 10: Update Privy Configuration

Update `app/providers.tsx` to include Solana:

```typescript
import { PrivyProvider } from '@privy-io/react-auth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet', 'twitter'],
        appearance: {
          theme: 'dark',
        },
        // Enable Solana
        supportedChains: ['solana'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
```

---

## Testing Your Integration

### 1. Start Your Frontend
```bash
npm run dev
```

### 2. Connect Wallet
- Use Privy to log in with Twitter
- Privy will auto-generate a Solana wallet

### 3. Test Buy Keys
- Navigate to a curve page
- Click "Buy Keys"
- Approve transaction in Privy modal
- See transaction on Solana Explorer

---

## Next Steps

1. **Create more hooks:**
   - `useSellKeys.ts` - Sell keys
   - `useCurveData.ts` - Fetch curve stats
   - `useMyHoldings.ts` - Fetch user's keys

2. **Add real-time updates:**
   - Subscribe to program events
   - Update UI when transactions occur

3. **Sync with Appwrite:**
   - Store transaction hashes in Appwrite
   - Track user holdings
   - Update curve stats

4. **Add error handling:**
   - Better error messages
   - Retry logic
   - Transaction confirmation

---

## Common Issues

### Issue: "Program account not found"
**Solution:** Make sure you're on devnet and the program is deployed

### Issue: "Wallet not connected"
**Solution:** Ensure Privy is configured with Solana support

### Issue: "Transaction failed"
**Solution:** Check console for specific error, may need more devnet SOL

---

## Full File Structure

```
your-project/
├── lib/
│   ├── idl/
│   │   └── launchos_curve.json
│   └── solana/
│       ├── config.ts
│       └── program.ts
├── hooks/
│   ├── useSolanaWallet.ts
│   ├── useBuyKeys.ts
│   ├── useSellKeys.ts
│   └── useCurveData.ts
├── components/
│   ├── BuyKeysButton.tsx
│   └── CurveStats.tsx
└── .env.local
```

---

Ready to integrate! Start with Steps 1-4 to set up the foundation. 🚀
