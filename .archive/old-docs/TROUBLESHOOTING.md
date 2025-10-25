# Troubleshooting Guide

## Privy App ID Error

**Error**: `Cannot initialize the Privy provider with an invalid Privy app ID`

### Quick Fix:

1. **Stop the dev server** (Ctrl+C if running)

2. **Clear the build cache**:
   ```powershell
   .\restart-dev.ps1
   ```

3. **Verify environment variables**:
   - Check that `.env` and `.env.local` both contain `NEXT_PUBLIC_PRIVY_APP_ID`
   - The app ID should be: `cmfsej8w7013cle0df5ottcj6`

4. **Test the integration**:
   - Navigate to: http://localhost:3000/test-solana
   - This page will show:
     - Privy status
     - Authentication status
     - Wallet connection status
     - Environment variable values

### Root Causes:

1. **Stale build cache**: Next.js cached old env vars
   - Fix: Clear `.next` folder and restart

2. **Environment variables not loaded**: Dev server started before `.env.local` was created
   - Fix: Restart dev server with `.\restart-dev.ps1`

3. **Multiple .env files conflicting**: Both `.env` and `.env.local` exist
   - Fix: Both files now have matching Privy config

### Verification Steps:

1. Run `.\restart-dev.ps1` to clean restart
2. Visit http://localhost:3000/test-solana
3. Check "Environment Check" section shows:
   - Network: devnet
   - Curve Program: Ej8X...UXQF
   - Privy App ID: cmfsej8w70...

4. Click "Connect Wallet" - should show Privy auth modal

---

## Solana Integration Issues

### Missing Packages Error

If you see module not found errors for `@solana/web3.js` or `@coral-xyz/anchor`:

```powershell
npm install @solana/web3.js @coral-xyz/anchor bs58 --legacy-peer-deps
```

### Hook Import Errors

If hooks are not found, verify these files exist:
- `hooks/useSolanaWallet.ts`
- `hooks/useBuyKeys.ts`
- `hooks/useCurveData.ts`
- `lib/solana/config.ts`
- `lib/solana/program.ts`

### IDL Not Found

The IDL file should be at: `lib/idl/launchos_curve.json`

If missing, it was manually created because `cargo-build-sbf` doesn't generate IDL files.

---

## Common Next.js Issues

### Port Already in Use

```powershell
# Kill all node processes
Get-Process node | Stop-Process -Force

# Then restart
npm run dev
```

### TypeScript Errors

The project has `eslint.ignoreDuringBuilds: true` in `next.config.js`, so TS errors won't block builds.

---

## Testing the Integration

### 1. Test Page (Recommended)
Navigate to: http://localhost:3000/test-solana

This page shows:
- Real-time Privy status
- Wallet connection state
- Environment variables
- Quick connect button

### 2. Manual Component Test

Create a test page:

```tsx
"use client"
import { BuyKeysButton } from '@/components/BuyKeysButton'

export default function Test() {
  return (
    <BuyKeysButton
      twitterHandle="elonmusk"
      amount={1}
      onSuccess={(sig) => console.log('Success:', sig)}
      onError={(err) => console.error('Error:', err)}
    />
  )
}
```

### 3. Check Curve Stats

```tsx
"use client"
import { CurveStats } from '@/components/CurveStats'

export default function Test() {
  return <CurveStats twitterHandle="elonmusk" />
}
```

---

## Development Workflow

1. **Start fresh**:
   ```powershell
   .\restart-dev.ps1
   ```

2. **Check test page**:
   - http://localhost:3000/test-solana

3. **Verify Privy works**:
   - Click "Connect Wallet"
   - Authenticate with Twitter/Email
   - Check wallet address appears

4. **Test buy keys flow**:
   - Use BuyKeysButton component
   - Check console for transaction details
   - Verify on Solana Explorer

---

## Environment Variables Reference

Required in `.env` or `.env.local`:

```bash
# Privy
NEXT_PUBLIC_PRIVY_APP_ID=cmfsej8w7013cle0df5ottcj6
PRIVY_APP_SECRET=4MQJHj4c...

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com

# Programs
NEXT_PUBLIC_CURVE_PROGRAM_ID=Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
NEXT_PUBLIC_ESCROW_PROGRAM_ID=5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc
```

---

## Getting Help

1. Check the test page first: http://localhost:3000/test-solana
2. Review [INTEGRATION_EXAMPLE.md](./INTEGRATION_EXAMPLE.md) for usage patterns
3. Check [SOLANA_INTEGRATION_GUIDE.md](./SOLANA_INTEGRATION_GUIDE.md) for setup
4. Verify deployment with [POST_DEPLOYMENT_GUIDE.md](./POST_DEPLOYMENT_GUIDE.md)

---

## Success Checklist

- [ ] Dev server starts without errors
- [ ] Test page loads at /test-solana
- [ ] All environment variables show correct values
- [ ] "Connect Wallet" button shows Privy modal
- [ ] After connecting, wallet address displays
- [ ] Solana wallet connection status shows "Connected"
- [ ] No console errors related to Privy or Solana
