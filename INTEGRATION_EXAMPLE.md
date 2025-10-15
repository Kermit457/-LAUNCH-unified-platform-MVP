# 🎨 Solana Integration - Usage Examples

Your Solana bonding curve is now fully integrated! Here's how to use it in your pages.

---

## Example 1: Simple Curve Page

Create a page that shows curve stats and allows buying keys:

```typescript
// app/curve/[handle]/page.tsx
'use client';

import { BuyKeysButton } from '@/components/BuyKeysButton';
import { CurveStats } from '@/components/CurveStats';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';

export default function CurvePage({ params }: { params: { handle: string } }) {
  const { address } = useSolanaWallet();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Bonding Curve: @{params.handle}
          </h1>
          <p className="text-gray-600">
            Buy and sell keys on the Solana blockchain
          </p>
        </div>

        {/* Curve Statistics */}
        <CurveStats twitterHandle={params.handle} />

        {/* Buy Keys Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Buy Keys</h2>

          <div className="space-y-4">
            {/* Buy 10 keys */}
            <BuyKeysButton
              twitterHandle={params.handle}
              amount={10}
              referrer={address || undefined}
              onSuccess={(tx) => {
                console.log('Purchase successful!', tx);
                // Optionally refresh your Appwrite data here
              }}
              onError={(error) => {
                console.error('Purchase failed:', error);
              }}
            />

            {/* Buy 50 keys */}
            <BuyKeysButton
              twitterHandle={params.handle}
              amount={50}
              referrer={address || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Example 2: Dashboard with Multiple Curves

Show multiple bonding curves on a dashboard:

```typescript
// app/dashboard/curves/page.tsx
'use client';

import { CurveStats } from '@/components/CurveStats';
import { BuyKeysButton } from '@/components/BuyKeysButton';

export default function CurvesDashboard() {
  // Your curve handles (fetch from Appwrite or API)
  const curves = ['elonmusk', 'vitalik', 'builderman'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Active Bonding Curves</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {curves.map((handle) => (
          <div key={handle} className="space-y-4">
            <CurveStats twitterHandle={handle} />
            <BuyKeysButton
              twitterHandle={handle}
              amount={5}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Example 3: With Referral Tracking

Automatically track referrals using the user's Solana wallet:

```typescript
// app/ref/[refCode]/page.tsx
'use client';

import { useEffect } from 'react';
import { BuyKeysButton } from '@/components/BuyKeysButton';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';

export default function ReferralPage({
  params
}: {
  params: { refCode: string }
}) {
  const { address } = useSolanaWallet();

  useEffect(() => {
    // Store referral in localStorage or Appwrite
    if (params.refCode) {
      localStorage.setItem('referrer', params.refCode);
    }
  }, [params.refCode]);

  const referrer = localStorage.getItem('referrer') || undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold">
          Welcome! You've been referred! 🎉
        </h1>

        <p className="text-gray-600">
          Your referrer will earn fees when you trade
        </p>

        <BuyKeysButton
          twitterHandle="featured_curve"
          amount={10}
          referrer={referrer}
          onSuccess={(tx) => {
            // Track successful referral in Appwrite
            console.log('Referral purchase:', tx);
          }}
        />

        {referrer && (
          <p className="text-sm text-gray-500">
            Referrer: {referrer.slice(0, 4)}...{referrer.slice(-4)}
          </p>
        )}
      </div>
    </div>
  );
}
```

---

## Example 4: My Holdings Page

Show user's key holdings across all curves:

```typescript
// app/dashboard/holdings/page.tsx
'use client';

import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { CurveStats } from '@/components/CurveStats';

export default function MyHoldings() {
  const { address, connected } = useSolanaWallet();

  // Fetch user's holdings from Solana or Appwrite
  const holdings = [
    { handle: 'elonmusk', keys: 25 },
    { handle: 'vitalik', keys: 50 },
  ];

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-gray-600">
          Connect your wallet to see your key holdings
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Key Holdings</h1>

      <div className="space-y-6">
        {holdings.map((holding) => (
          <div key={holding.handle} className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">@{holding.handle}</h2>
                <p className="text-gray-600">You own {holding.keys} keys</p>
              </div>
            </div>
            <CurveStats twitterHandle={holding.handle} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Example 5: Integration with Existing Launch Page

Add Solana to your existing launch pages:

```typescript
// Update your existing launch/[id]/page.tsx
import { BuyKeysButton } from '@/components/BuyKeysButton';
import { CurveStats } from '@/components/CurveStats';

// In your component:
<div className="mt-8">
  <h3 className="text-xl font-semibold mb-4">Buy Keys on Solana</h3>

  <CurveStats twitterHandle={launch.twitterHandle} />

  <div className="mt-4">
    <BuyKeysButton
      twitterHandle={launch.twitterHandle}
      amount={10}
      onSuccess={(tx) => {
        // Update launch stats in Appwrite
        updateLaunchStats(launch.id, tx);
      }}
    />
  </div>
</div>
```

---

## Custom Styling

All components accept a `className` prop for custom styling:

```typescript
<BuyKeysButton
  twitterHandle="example"
  amount={10}
  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl"
/>

<CurveStats
  twitterHandle="example"
  className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl"
/>
```

---

## Hooks Reference

### useSolanaWallet()
```typescript
const { wallet, publicKey, address, connected, ready } = useSolanaWallet();
```

### useBuyKeys()
```typescript
const { buyKeys, loading, error, txSignature, explorerUrl } = useBuyKeys();

await buyKeys('twitterHandle', 10, 'referrerAddress');
```

### useCurveData(twitterHandle)
```typescript
const { data, loading, error, refresh } = useCurveData('elonmusk');
```

---

## Next Steps

1. **Test on Devnet**
   - Run `npm run dev`
   - Navigate to your curve page
   - Try buying keys

2. **Sync with Appwrite**
   - Store transactions in your database
   - Update curve stats
   - Track user holdings

3. **Add Real-time Updates**
   - Listen to Solana program events
   - Use WebSockets for live updates
   - Sync with your backend

4. **Production Ready**
   - Switch to mainnet in `.env.local`
   - Update Privy config for mainnet
   - Comprehensive testing

---

## Component Files Created

- ✅ `hooks/useSolanaWallet.ts` - Wallet connection hook
- ✅ `hooks/useBuyKeys.ts` - Buy keys transaction hook
- ✅ `hooks/useCurveData.ts` - Fetch curve data hook
- ✅ `components/BuyKeysButton.tsx` - Buy button component
- ✅ `components/CurveStats.tsx` - Curve statistics display
- ✅ `lib/solana/config.ts` - Solana configuration
- ✅ `lib/solana/program.ts` - Program helpers
- ✅ `contexts/PrivyProviderWrapper.tsx` - Updated with Solana support

---

**Your Solana bonding curve is ready to use!** 🚀

Start by adding the `BuyKeysButton` and `CurveStats` components to your existing pages!
