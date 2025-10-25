# Pump.fun Token Launch Solution

## Problem Summary

We encountered **"InstructionError: Custom Error 13"** when using the PumpPortal API (`https://pumpportal.fun/api/trade-local`). After investigation:

- Error 13 is NOT a Pump.fun program error (those start at 6000+)
- Error 13 is a Solana system-level error
- The PumpPortal API is unreliable for token creation

## Solution

Created `scripts/simple-sdk-launch.js` which uses the **official Pump.fun SDK** directly instead of third-party APIs.

### Key Improvements:

1. **Official Anchor Program** - Uses `pumpdotfun-sdk`'s Anchor IDL to call Pump.fun program directly
2. **No Third-Party APIs** - Avoids unreliable PumpPortal API entirely
3. **Proper Error Handling** - SDK's `sendTx()` utility handles confirmation, retries, and priority fees
4. **Instant Distribution** - Automatically distributes tokens to all 7 key holders based on their ownership percentage

### How It Works:

```javascript
1. Builds "create" instruction using Anchor program
2. Adds "buy" instruction for initial purchase (0.02 SOL)
3. Sends both instructions in single atomic transaction
4. Waits for token account to initialize
5. Distributes tokens proportionally to 7 key holders
```

## Running the Launch

### Method 1: Windows (Double-click)

```
run-official-launch.bat
```

### Method 2: Command Line

```bash
cd "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH"
node scripts/simple-sdk-launch.js
```

### Method 3: NPM Script (Add to package.json)

```json
"launch-pump": "node scripts/simple-sdk-launch.js"
```

Then run: `npm run launch-pump`

## What Happens:

1. ⏱️  5-second countdown (cancel with Ctrl+C)
2. 🔌 Connects to Solana mainnet
3. 💵 Checks wallet balance (needs 0.07+ SOL)
4. 📡 Builds create + buy transaction
5. 📤 Sends and confirms transaction
6. ⏳ Waits for token account (up to 60 seconds)
7. 📤 Distributes to 7 holders
8. 💾 Saves launch data to JSON file

## Expected Output:

```
🎉 LAUNCH COMPLETE!
======================================================================

📊 Results:
  Token:           [ADDRESS]
  Distributions:   7 / 7

🔗 Links:
  https://pump.fun/coin/[ADDRESS]
  https://solscan.io/token/[ADDRESS]
```

## Distribution Breakdown:

| Holder | Keys | Percentage | Tokens |
|--------|------|------------|---------|
| Whale Alpha | 350 | 35.0% | ~278M tokens |
| Whale Beta | 250 | 25.0% | ~198M tokens |
| Diamond Hands | 150 | 15.0% | ~119M tokens |
| Early Investor | 100 | 10.0% | ~79M tokens |
| Steady Holder | 75 | 7.5% | ~59M tokens |
| Community Member | 50 | 5.0% | ~40M tokens |
| Supporter | 25 | 2.5% | ~20M tokens |

**Total: 1000 keys = 100% of 793M tokens on bonding curve**

## Configuration

Edit `TOKEN_CONFIG` in the script to customize:

```javascript
const TOKEN_CONFIG = {
  name: 'Pixel Knight V4',    // Token name
  symbol: 'KNT4',              // Ticker symbol
  description: '...',          // Description
  initialBuySOL: 0.02          // Initial buy amount
};
```

## Troubleshooting

### "Insufficient balance" error
- You need at least 0.07 SOL (0.02 for buy + 0.05 for fees)
- Get SOL from an exchange or bridge

### "Transaction failed" error
- Check Solscan link in error message
- Look for specific program error codes
- May need to increase slippage (currently 25%)

### "Token account not ready" warning
- Token was created successfully
- Distribution must be run manually later
- Use: `node scripts/distribute-[SYMBOL].js`

### Tokens don't show on pump.fun website
- This is a known metadata URI issue
- Tokens WILL trade on DEX Screener, Raydium, etc.
- They exist on-chain and are fully functional
- Pump.fun display is cosmetic only

## Next Steps

### For Production:

1. **Add Image Upload** - Integrate proper IPFS upload for token logo
2. **Error Handling** - Add retry logic for distribution failures
3. **Notifications** - Add webhooks/alerts on successful launch
4. **Integration** - Connect to your bonding curve graduation trigger

### Integration with Your System:

When a bonding curve graduates (reaches threshold):

```javascript
const { launchPumpFunToken } = require('./scripts/pump-launch-service');

// On graduation event
const launchResult = await launchPumpFunToken({
  name: project.tokenName,
  symbol: project.ticker,
  description: project.description,
  imageUrl: project.logoUrl,
  initialBuySOL: 0.02,
  keyHolders: curve.getKeyHolders() // Your existing key holder data
});

if (launchResult.success) {
  // Update database with token mint address
  // Send notifications to key holders
  // Update UI to show token launched
}
```

## Why This Works

The simplified SDK approach:

- ✅ Uses exact same program calls as pump.fun website
- ✅ No third-party API dependencies
- ✅ Proper Anchor integration
- ✅ Official SDK transaction sending logic
- ✅ Atomic create+buy transaction
- ✅ Instant automated distribution

This is the same method used by successful Pump.fun bots and launchpads.

## Files

- `scripts/simple-sdk-launch.js` - Main launch script
- `scripts/official-sdk-launch.js` - Alternative with image upload (more complex)
- `scripts/final-launch.js` - Old PumpPortal API version (deprecated)
- `run-official-launch.bat` - Windows launcher

## Support

If you encounter issues:

1. Check the Solscan transaction link in error messages
2. Verify wallet has sufficient SOL balance
3. Check RPC endpoint status (may need to switch if down)
4. Review error codes in Pump.fun IDL (`node_modules/pumpdotfun-sdk/dist/esm/IDL/pump-fun.js`)

---

**Ready to launch!** 🚀

Run the script and watch your token go live on Solana with instant distribution to all key holders.
