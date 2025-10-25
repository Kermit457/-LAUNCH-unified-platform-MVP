# Pump.fun Integration Guide (2025)

## 🚀 Overview

This guide explains how to integrate with Pump.fun for token launches using the latest APIs and SDKs.

## 📦 Official Packages (Updated 2025)

```bash
# Option 1: PumpDotFun SDK (Recommended for full control)
npm install pumpdotfun-sdk

# Option 2: PumpSwap SDK (For trading on graduated tokens)
npm install @pump-fun/pump-swap-sdk

# Required dependencies
npm install @solana/web3.js @solana/spl-token
```

## 🎯 How Pump.fun Works (Updated March 2025)

### Bonding Curve Model

Unlike traditional token launches, Pump.fun uses a **bonding curve** mechanism:

1. **Creation**: Token is created on Pump.fun's bonding curve (1 billion supply)
2. **Trading**: Users buy/sell on the curve (800M tokens available, dynamic pricing)
3. **Graduation**: At **~$69k market cap**, token auto-migrates to **PumpSwap DEX** ⚡
4. **Liquidity**: Bonding curve SOL becomes PumpSwap LP automatically (200M tokens released)

**No manual LP seeding needed!** The bonding curve handles everything.

### 🆕 PumpSwap (March 2025)

**IMPORTANT**: As of March 20, 2025, Pump.fun now graduates tokens to **PumpSwap**, their own native DEX, **NOT Raydium**!

**PumpSwap vs Old Raydium Migration**:
- ✅ **Zero migration fees** (was 6 SOL on Raydium)
- ✅ **Instant migration** (no delays)
- ✅ **0.30% total trading fee** breakdown:
  - 0.20% → Liquidity Providers
  - 0.05% → Protocol
  - **0.05% → Token Creator** (YOU!)
- ✅ **Creator revenue sharing** ✨ **LIVE since May 13, 2025!**
- ✅ **Constant Product AMM** (similar to Raydium V4 / Uniswap V2)

**Graduation Process**:
1. Token reaches $69k market cap (800M tokens sold)
2. Automatic instant migration to PumpSwap
3. SOL from bonding curve → PumpSwap liquidity pool
4. Remaining 200M tokens become tradable on open market

## 🛠️ Implementation Options

### Option 1: PumpDotFun SDK (Recommended)

Full control over token creation and trading.

```typescript
import { PumpFunSDK } from 'pumpdotfun-sdk'
import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'

// Initialize
const connection = new Connection('https://api.mainnet-beta.solana.com')
const sdk = new PumpFunSDK(connection)

// 1. Upload metadata to IPFS
const formData = new FormData()
formData.append('file', imageFile)
formData.append('name', 'My Token')
formData.append('symbol', 'MTK')
formData.append('description', 'Description here')
formData.append('twitter', 'https://twitter.com/...')
formData.append('telegram', 'https://t.me/...')
formData.append('website', 'https://...')

const metadataResponse = await fetch('https://pump.fun/api/ipfs', {
  method: 'POST',
  body: formData
})
const { metadataUri } = await metadataResponse.json()

// 2. Create token with initial buy
const creatorKeypair = Keypair.fromSecretKey(...) // Your wallet
const mintKeypair = Keypair.generate() // New token mint

const result = await sdk.createAndBuy(
  creatorKeypair,
  mintKeypair,
  {
    name: 'My Token',
    symbol: 'MTK',
    uri: metadataUri
  },
  BigInt(0.1 * LAMPORTS_PER_SOL), // Initial buy: 0.1 SOL
  500n // 5% slippage
)

console.log('Token created:', mintKeypair.publicKey.toString())
console.log('Transaction:', result.signature)
```

### Option 2: PumpPortal API (Serverless)

Use HTTP API for token creation.

```typescript
// POST https://pumpportal.fun/api/trade-local
const response = await fetch('https://pumpportal.fun/api/trade-local', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create',
    tokenMetadata: {
      name: 'My Token',
      symbol: 'MTK',
      uri: metadataUri
    },
    mint: mintKeypair.publicKey.toString(),
    denominatedInSol: 'true',
    amount: 0.1, // Initial buy in SOL
    slippage: 10, // 10%
    priorityFee: 0.0005,
    pool: 'pump'
  })
})

const { txn } = await response.json()
// Sign and send txn with your wallet
```

## 🎨 Token Metadata Requirements

### IPFS Upload

```typescript
POST https://pump.fun/api/ipfs

FormData:
- file: PNG image (recommended 800x800px)
- name: Token name
- symbol: Token symbol (3-10 chars)
- description: Token description
- twitter: Twitter URL (optional)
- telegram: Telegram URL (optional)
- website: Website URL (optional)
- showName: boolean (display name on image)
```

## 💰 Fee Structure

- **Token Creation**: **NO ADDITIONAL FEE** ✅
- **Initial Dev Buy**: Standard trading fee applies
- **Trading Fee**: ~1% per trade (bonding curve)
- **Graduation**: Automatic and free at $69k market cap

## 🔄 Trading on Bonding Curve

### Buy Tokens

```typescript
const buyResult = await sdk.buy(
  buyerKeypair,
  mintPublicKey,
  BigInt(0.01 * LAMPORTS_PER_SOL), // 0.01 SOL
  500n // 5% slippage
)
```

### Sell Tokens

```typescript
const sellResult = await sdk.sell(
  sellerKeypair,
  mintPublicKey,
  BigInt(1000), // Amount of tokens to sell
  500n // 5% slippage
)
```

## 📊 Graduation to PumpSwap

When your token reaches **~$69k market cap** (800M tokens sold):

1. **Automatic Migration**: Instant and FREE migration to PumpSwap DEX
2. **Liquidity Seeding**: Bonding curve SOL → PumpSwap LP (no 6 SOL fee!)
3. **Token Release**: 200M remaining tokens become tradable
4. **Trading Continues**: Users can now trade on PumpSwap AMM
5. **Check Status**: Use PumpSwap SDK to check if graduated

```typescript
import { PumpAmmSdk } from '@pump-fun/pump-swap-sdk'

const pumpSwapSdk = new PumpAmmSdk(connection)
const poolInfo = await pumpSwapSdk.getPoolInfo(mintPublicKey)

if (poolInfo.graduated) {
  console.log('Token has graduated to PumpSwap!')
  console.log('PumpSwap Pool:', poolInfo.poolAddress)
  console.log('Trading Fee: 0.25% (0.20% to LPs, 0.05% to protocol)')
}
```

### Graduation Stats (April 2025)

- **Success Rate**: 0.37% - 1.78% of tokens successfully graduate
- **Market Cap Threshold**: ~$69,000
- **Tokens Sold**: 800 million (out of 1 billion supply)
- **Migration Cost**: **FREE** (was 6 SOL on old Raydium system)

## 💰 Creator Revenue: Dynamic Fees V1 (September 2025)

### 🚀 PROJECT ASCEND - Revolutionary Update!

**You can now earn UP TO 0.95% of EVERY trade!** (was flat 0.05%)

Introduced September 2, 2025, **Dynamic Fees V1** adjusts your earnings based on your token's market cap.

### Fee Tiers (Market Cap Based)

| Market Cap (SOL) | USD Equivalent | Creator Fee | Your Earnings on $10M Volume |
|------------------|----------------|-------------|------------------------------|
| **420 - 1,470 SOL** | $88k - $300k | **0.950%** 🔥 | **$95,000** |
| 1,470 - 2,460 SOL | $300k - $500k | 0.900% | $90,000 |
| 0 - 420 SOL | $0 - $88k | 0.300% | $30,000 |
| ... (24 tiers) | ... | ... | ... |
| 98,240+ SOL | $20.8M+ | 0.050% | $5,000 |

**PEAK EARNINGS**: Tokens between $88k-$300k market cap earn **0.95%** - that's **19x more** than the old model!

### Real Examples

#### Small Project (600 SOL / $126k market cap)
```
Daily Volume: $1,000,000
Creator Fee: 0.95%
YOUR Daily Earnings: $9,500 in SOL! 💰
```

#### Growing Project (5,000 SOL / $1M market cap)
```
Daily Volume: $10,000,000
Creator Fee: 0.75%
YOUR Daily Earnings: $75,000 in SOL! 🚀
```

#### Established Project (100,000 SOL / $21M market cap)
```
Daily Volume: $100,000,000
Creator Fee: 0.05%
YOUR Daily Earnings: $50,000 in SOL! 💎
```

### Bonding Curve Fees (Before Graduation)

**Total Fee: 1.25%**
- **Creator: 0.30%** (YOU!)
- Protocol: 0.95%
- LP: 0.00%

You earn even BEFORE graduation!

### How to Claim

1. Go to [pump.fun/creator-dashboard](https://pump.fun)
2. Connect your wallet
3. Click "Claim Revenue"
4. Instant on-chain payout to your wallet! ✅

### Eligibility

✅ Tokens created **after May 13, 2025**
✅ Tokens on bonding curve on May 13, 2025
✅ Tokens already graduated to PumpSwap on May 13, 2025

❌ Trading activity **before May 13, 2025** doesn't count

### Why This Matters

**Incentivizes Long-Term Development**

Instead of pump-and-dump schemes, creators now have recurring revenue from their tokens' trading activity. The more your community trades, the more you earn!

**Passive Income Stream**

Once your token graduates, you earn automatically from every trade. No action required except claiming your earnings.

## 🎯 Our Implementation

### Current: Mock Service

**File**: `lib/pump-fun/service.ts`

Currently uses MOCK implementation for development/testing.

### Production: Real Integration

To enable real Pump.fun integration:

1. **Install SDKs**:
   ```bash
   npm install pumpdotfun-sdk @pump-fun/pump-swap-sdk
   ```

2. **Set Environment Variables**:
   ```env
   # .env.local
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   PUMP_FUN_CREATOR_PRIVATE_KEY=your_base58_private_key
   PUMPPORTAL_API_KEY=your_api_key (optional, for PumpPortal)
   ```

3. **Update `lib/pump-fun/service.ts`**:
   - Replace `createToken()` mock with SDK calls
   - Replace `addLiquidity()` with graduation check
   - Replace `executeAirdrops()` with batch SPL transfers

4. **Wallet Integration**:
   - Store user Solana wallet addresses in Appwrite
   - Use real addresses instead of `wallet-{userId}` mocks

## 🔗 Resources

- **Pump.fun**: https://pump.fun
- **PumpPortal Creation API**: https://pumpportal.fun/creation/
- **PumpDotFun SDK**: https://github.com/rckprtr/pumpdotfun-sdk
- **PumpSwap SDK**: https://www.npmjs.com/package/@pump-fun/pump-swap-sdk
- **Solana Web3.js**: https://solana-labs.github.io/solana-web3.js/

## 🎬 Example Flow (2025 Updated)

```typescript
// 1. Create token on Pump.fun bonding curve
const tokenMint = await createToken({
  name: 'Project Token',
  symbol: 'PROJ',
  supply: 1_000_000_000, // 1B total (800M on curve, 200M released at graduation)
  metadata: { ... }
})

// 2. Trading happens on bonding curve (automatic)
// Users buy/sell 800M tokens on curve
// Price increases dynamically as tokens are bought

// 3. Graduation at ~$69k market cap (automatic & FREE!)
// Bonding curve → PumpSwap LP migration (NOT Raydium!)
// 200M tokens released to open market
// Zero migration fees, instant process

// 4. Continue trading on PumpSwap (automatic)
// Token now has permanent liquidity on PumpSwap DEX
// 0.25% trading fee (0.20% to LPs, 0.05% to protocol)
// Creators earn revenue share from protocol fees

// 5. Airdrop to holders (manual)
await executeAirdrops({
  tokenMint,
  recipients: holders.map(h => ({
    walletAddress: h.solanaWallet,
    amount: h.balance * 1_000_000
  }))
})
```

## ⚠️ Important Notes (2025 Updated)

1. **PumpSwap, NOT Raydium**: As of March 2025, tokens graduate to **PumpSwap**, Pump.fun's own DEX! Old guides mentioning Raydium are outdated.

2. **Bonding Curve ≠ Traditional LP**: Don't try to manually create liquidity pools. Pump.fun handles this automatically via PumpSwap.

3. **Graduation Threshold**: ~$69k market cap (800M tokens sold) triggers **instant FREE** migration to PumpSwap.

4. **No Manual LP Needed**: The bonding curve IS the initial liquidity mechanism. At graduation, SOL becomes PumpSwap LP automatically.

5. **Zero Migration Fees**: Old Raydium migration charged 6 SOL. PumpSwap migration is **FREE**!

6. **Trading Fees**:
   - Bonding curve: ~1% trading fee
   - PumpSwap (after graduation): **0.30% total**
     - 0.20% → Liquidity Providers
     - 0.05% → Protocol
     - **0.05% → You (Creator)** 🎉

7. **Creator Revenue**: **LIVE since May 13, 2025!** You earn 0.05% of EVERY trade on your token.
   - $10M volume = $5,000 SOL earned
   - Instant on-chain payouts
   - Claim anytime via creator dashboard

8. **Airdrops**: Must be done via separate SPL token transfers to holder wallets.

9. **Success Rate**: Only 0.37% - 1.78% of tokens successfully graduate (April 2025 data).

## 🚨 Security

- **Never expose private keys** in code or env files committed to git
- **Use .env.local** for sensitive data (gitignored)
- **Validate all inputs** before creating transactions
- **Test on devnet** before mainnet deployment
- **Monitor gas fees** to avoid excessive costs

---

**Status**: Mock implementation (development)
**Next Step**: Install SDKs and implement real Pump.fun integration
**No Blockers**: All APIs are publicly available and documented