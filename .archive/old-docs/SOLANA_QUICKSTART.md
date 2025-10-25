# Solana Integration - Quick Start

Get your Solana bonding curve integration running in 3 steps.

---

## Step 1: Fix the Current Error

The Privy app ID error happens because Next.js cached old environment variables.

**Run this command**:
```powershell
.\restart-dev.ps1
```

This will:
- Stop the dev server
- Clear the build cache
- Restart with fresh environment variables

**Expected output**:
```
Restarting Next.js development server...
[1/3] Stopping node processes...
  [OK] Node processes stopped
[2/3] Clearing build cache...
  [OK] Build cache cleared
[3/3] Starting development server...

Starting npm run dev...
```

---

## Step 2: Test the Integration

Open your browser to:
```
http://localhost:3000/test-solana
```

**What you should see**:

✅ **Privy Status**: Ready (green)
✅ **Authentication**: Not Authenticated (red) - normal before login
✅ **Wallet Connection**: Not Connected (red) - normal before login
✅ **Environment Check**:
   - Network: devnet
   - Curve Program: Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
   - Privy App ID: cmfsej8w70...

---

## Step 3: Connect Your Wallet

1. Click the **"Connect Wallet"** button
2. Choose authentication method (Twitter/Email)
3. Complete authentication
4. Your Solana wallet address should appear

**After connecting, you should see**:
- ✅ Authentication: Authenticated (green)
- ✅ Wallet Connection: Connected (green)
- ✅ Wallet Address: [Your Solana address]

---

## What's Next?

### Use the Components in Your App

#### Example 1: Add Buy Keys Button

```tsx
"use client"
import { BuyKeysButton } from '@/components/BuyKeysButton'

export default function CurvePage() {
  return (
    <div>
      <h1>Buy Keys for @elonmusk</h1>
      <BuyKeysButton
        twitterHandle="elonmusk"
        amount={1}
        onSuccess={(sig) => console.log('Bought keys!', sig)}
        onError={(err) => console.error('Error:', err)}
      />
    </div>
  )
}
```

#### Example 2: Display Curve Stats

```tsx
"use client"
import { CurveStats } from '@/components/CurveStats'

export default function StatsPage() {
  return <CurveStats twitterHandle="elonmusk" />
}
```

#### Example 3: Check Wallet Connection

```tsx
"use client"
import { useSolanaWallet } from '@/hooks/useSolanaWallet'

export default function ProfilePage() {
  const { connected, address } = useSolanaWallet()

  if (!connected) {
    return <p>Please connect your wallet</p>
  }

  return <p>Your wallet: {address}</p>
}
```

---

## Troubleshooting

### Still seeing Privy error?

1. Make sure you ran `.\restart-dev.ps1`
2. Check that the dev server fully stopped and restarted
3. Try manually deleting `.next` folder:
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

### Environment variables not showing?

Check that both `.env` and `.env.local` contain:
```bash
NEXT_PUBLIC_PRIVY_APP_ID=cmfsej8w7013cle0df5ottcj6
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_CURVE_PROGRAM_ID=Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
```

### Test page not loading?

Make sure the file exists at: `app/test-solana/page.tsx`

---

## Complete Documentation

- **[INTEGRATION_STATUS.md](./INTEGRATION_STATUS.md)** - Full integration status and roadmap
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Detailed troubleshooting guide
- **[INTEGRATION_EXAMPLE.md](./INTEGRATION_EXAMPLE.md)** - More code examples
- **[SOLANA_INTEGRATION_GUIDE.md](./SOLANA_INTEGRATION_GUIDE.md)** - Complete setup guide

---

## Success! 🎉

Once you see the test page working and can connect your wallet, your Solana integration is ready!

You can now:
- Build pages with bonding curve functionality
- Let users buy and sell keys
- Display curve statistics
- Track referrals
- Integrate with your existing Appwrite backend

---

## Development Tips

1. **Always use the restart script** when changing `.env` files:
   ```powershell
   .\restart-dev.ps1
   ```

2. **Check the test page first** when debugging:
   ```
   http://localhost:3000/test-solana
   ```

3. **Monitor the console** for Solana transaction logs

4. **Use Solana Explorer** to verify transactions:
   ```
   https://explorer.solana.com/?cluster=devnet
   ```

5. **Get devnet SOL** from the faucet (you'll need it for testing):
   ```
   https://faucet.solana.com
   ```

---

## Need Help?

1. Visit the test page: http://localhost:3000/test-solana
2. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. Review the console for errors
4. Verify environment variables are loaded correctly

---

**Ready to build? Start with the test page, then add components to your existing pages!**
