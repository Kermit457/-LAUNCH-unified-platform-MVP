# Pump.fun Integration Setup Guide

## Overview

This guide walks you through setting up the production Pump.fun integration to actually deploy tokens on Solana.

**Current Status:**
- ✅ Documentation complete (see `PUMP_FUN_INTEGRATION.md`)
- ✅ SDKs installed (`pumpdotfun-sdk`)
- ✅ Production service implemented ([service-production.ts](lib/pump-fun/service-production.ts))
- ⏳ Ready to configure and test

---

## Prerequisites

1. **Solana CLI** (for generating wallets)
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   ```

2. **Node.js packages** (already installed)
   - `pumpdotfun-sdk` - Token creation on Pump.fun
   - `@solana/web3.js` - Solana blockchain interactions
   - `@solana/spl-token` - SPL token operations (airdrops)

3. **SOL for gas fees**
   - **Devnet:** Free from faucet
   - **Mainnet:** ~0.05-0.1 SOL per token launch

---

## Step 1: Generate Solana Wallet

### Option A: Using Solana CLI (Recommended)

```bash
# Create new wallet
solana-keygen new --outfile ~/.config/solana/pump-creator.json

# View public key
solana-keygen pubkey ~/.config/solana/pump-creator.json

# Get private key in base58 format (for .env)
solana-keygen export ~/.config/solana/pump-creator.json
```

### Option B: Using Phantom/Solflare

1. Export your wallet's private key from Phantom/Solflare
2. Convert to base58 format using:
   ```javascript
   import bs58 from 'bs58'
   const privateKeyArray = new Uint8Array([...]) // Your private key bytes
   const base58Key = bs58.encode(privateKeyArray)
   console.log(base58Key)
   ```

---

## Step 2: Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add your Solana configuration:

```env
# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Creator wallet private key (base58)
PUMP_FUN_CREATOR_PRIVATE_KEY=your_base58_private_key_here
```

### For Production (Mainnet):

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

**💡 Recommended:** Use a paid RPC provider for mainnet:
- [Helius](https://helius.dev) - Free tier: 100k requests/day
- [QuickNode](https://quicknode.com) - $9/month
- [Alchemy](https://alchemy.com) - Free tier available

---

## Step 3: Fund Your Wallet

### Devnet (Free)

```bash
# Set CLI to devnet
solana config set --url https://api.devnet.solana.com

# Request airdrop
solana airdrop 2 <YOUR_PUBLIC_KEY>

# Check balance
solana balance <YOUR_PUBLIC_KEY>
```

Or use the [Solana Devnet Faucet](https://faucet.solana.com/)

### Mainnet

Transfer SOL to your creator wallet address:
- Minimum: ~0.1 SOL per launch
- Recommended: 0.5-1 SOL for multiple launches

---

## Step 4: Activate Production Service

Currently, the app uses the **mock service** at [lib/pump-fun/service.ts](lib/pump-fun/service.ts).

To switch to **real Pump.fun integration**:

### Option A: Replace the file

```bash
mv lib/pump-fun/service.ts lib/pump-fun/service-mock.ts
mv lib/pump-fun/service-production.ts lib/pump-fun/service.ts
```

### Option B: Update imports

Change all imports from:
```typescript
import { getPumpFunService } from '@/lib/pump-fun/service'
```

To:
```typescript
import { getPumpFunProductionService as getPumpFunService } from '@/lib/pump-fun/service-production'
```

---

## Step 5: Test on Devnet

Run the test script to verify everything works:

```bash
# Install test dependencies
npm install --save-dev @types/node

# Run test launch
npm run test-launch <curveId> <userId>
```

This will:
1. Freeze the curve
2. Take a price snapshot
3. Calculate holder percentages
4. Create token on Pump.fun devnet
5. Execute airdrops to all holders

**Expected output:**
```
🚀 Creating token on Pump.fun...
   Name: Test Token
   Symbol: TEST
   Initial Buy: 0.01 SOL
📤 Uploading metadata to IPFS...
✅ Metadata uploaded: ipfs://...
🔑 Token mint: 7xKX...
💰 Creating token with initial buy...
✅ Token created successfully!
   Transaction: 3nZ8...

📊 Now live on bonding curve!
   Bonding curve fee: 1.25% (0.30% to you as creator)
   Graduation threshold: ~$69k market cap (800M tokens sold)
   After graduation: Dynamic fees 0.05%-0.95% based on market cap

🎁 Executing airdrops to 42 holders...
  ✅ Airdropped 1,234,567 tokens to ABC123...
  ✅ Airdropped 987,654 tokens to DEF456...
  ...
✅ Airdrops complete! 42/42 successful
```

---

## Step 6: Verify Token

### On Devnet

```bash
# Check token was created
spl-token display <TOKEN_MINT_ADDRESS>

# Check your token balance
spl-token accounts
```

### On Block Explorer

- **Devnet:** https://explorer.solana.com/?cluster=devnet
- **Mainnet:** https://explorer.solana.com/

Search for your transaction signature or token mint address.

### On Pump.fun

- **Devnet:** Not available (devnet not indexed)
- **Mainnet:** https://pump.fun/coin/<TOKEN_MINT_ADDRESS>

---

## Step 7: Go to Mainnet

Once everything works on devnet:

1. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   ```

2. **Fund mainnet wallet** with real SOL

3. **Update initial buy amount** in production:
   ```typescript
   // In service-production.ts or API route
   const initialBuySOL = 0.1 // 0.1 SOL initial buy
   ```

4. **Test with one real launch** before rolling out

5. **Monitor first few launches closely**

---

## API Usage

### Create Token

```typescript
import { getPumpFunProductionService } from '@/lib/pump-fun/service-production'

const service = getPumpFunProductionService()

const result = await service.createToken(
  {
    name: 'My Token',
    symbol: 'MTK',
    decimals: 9,
    supply: 1_000_000_000,
    metadata: {
      description: 'A token created from a bonding curve',
      twitter: '@mytoken',
      telegram: 't.me/mytoken',
      website: 'https://mytoken.com',
      curveId: 'curve_abc123'
    }
  },
  0.01 // Initial buy: 0.01 SOL
)

console.log('Token created:', result.tokenMint)
console.log('Transaction:', result.signature)
console.log('Metadata:', result.metadataUri)
```

### Execute Airdrops

```typescript
const txHashes = await service.executeAirdrops({
  tokenMint: 'ABC123...',
  fromWallet: creatorKeypair,
  recipients: [
    {
      userId: 'user_1',
      walletAddress: 'DEF456...',
      amount: 100_000_000, // 100M tokens
      percentage: 10.5
    },
    // ... more recipients
  ]
})

console.log('Airdrop transactions:', txHashes)
```

### Check Graduation

```typescript
const status = await service.checkGraduation('ABC123...')

if (status.graduated) {
  console.log('Token graduated to PumpSwap!')
  console.log('Market cap:', status.marketCap)
  console.log('Pool address:', status.poolAddress)
}
```

---

## Fee Structure

See [PROJECT_ASCEND_FEES_2025.md](PROJECT_ASCEND_FEES_2025.md) for complete details.

### Bonding Curve Phase

- **Trading Fee:** 1.25%
  - 0.30% → Creator (you!)
  - 0.95% → Protocol
- **Lasts until:** ~$69k market cap (800M tokens sold)

### Post-Graduation (PumpSwap)

- **Dynamic Fee Tiers:** 0.05% - 0.95%
- **Based on:** Market cap (24 tiers)
- **Creator Share:** 30% of trading fees

**Example earnings:**
- $100k daily volume @ 0.30% fee = $300/day
- $1M daily volume @ 0.50% fee = $5,000/day
- $10M daily volume @ 0.95% fee = $95,000/day

---

## Security Checklist

Before going to production:

- [ ] Private key stored securely (never commit to git!)
- [ ] `.env.local` added to `.gitignore`
- [ ] Tested full flow on devnet
- [ ] Wallet funded appropriately
- [ ] RPC provider configured (don't use public RPC on mainnet!)
- [ ] Error handling tested
- [ ] Transaction retry logic in place
- [ ] Monitoring/logging configured
- [ ] Backup of private key stored offline

---

## Troubleshooting

### "Creator wallet not configured"
- Check `PUMP_FUN_CREATOR_PRIVATE_KEY` is set in `.env.local`
- Verify the private key is in base58 format
- Ensure `.env.local` is loaded (restart Next.js server)

### "Insufficient funds"
- Check wallet balance: `solana balance <ADDRESS>`
- Request devnet airdrop or fund mainnet wallet
- Each launch costs ~0.01-0.05 SOL

### "IPFS upload failed"
- Check internet connection
- Verify image file is valid (PNG, JPG, GIF)
- Try again (IPFS can be slow sometimes)

### "Transaction failed"
- Check RPC URL is correct
- Increase slippage tolerance
- Verify sufficient SOL balance
- Check Solana network status

### "Airdrop failed"
- Verify recipient wallet addresses are valid Solana addresses
- Check sender has enough tokens
- Ensure recipients have SOL for rent exemption
- Review transaction errors in console

---

## Next Steps

1. **Test on devnet** using existing curves
2. **Create UI components** for launching tokens
3. **Add webhook notifications** for launch events
4. **Implement analytics tracking** for earnings
5. **Build dashboard** showing creator fees earned

See [PUMP_FUN_INTEGRATION.md](PUMP_FUN_INTEGRATION.md) for the complete integration guide!
