# LaunchOS Program IDs

## 🌐 Devnet Deployment

### LaunchOS Curve V4 (Bonding Curve)
**Program ID:** `Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF`
**Deployed:** October 15, 2025 at 16:45:38
**Size:** 501.16 KB
**Features:** V4 Bonding Curve with Referral System

**Explorer Links:**
- Solana Explorer: https://explorer.solana.com/address/Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF?cluster=devnet
- Solscan: https://solscan.io/account/Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF?cluster=devnet

### LaunchOS Escrow
**Program ID:** `5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc`
**Deployed:** October 15, 2025 at 16:45:48
**Size:** 279.32 KB
**Features:** Multi-Pool Escrow Management

**Explorer Links:**
- Solana Explorer: https://explorer.solana.com/address/5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc?cluster=devnet
- Solscan: https://solscan.io/account/5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc?cluster=devnet

---

## 💻 Frontend Configuration

### TypeScript/JavaScript
```typescript
import { PublicKey } from '@solana/web3.js';

export const PROGRAM_IDS = {
  curve: new PublicKey("Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF"),
  escrow: new PublicKey("5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc"),
};

export const CLUSTER = 'devnet';
export const RPC_URL = 'https://api.devnet.solana.com';
```

### Environment Variables (.env)
```bash
NEXT_PUBLIC_CURVE_PROGRAM_ID=Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
NEXT_PUBLIC_ESCROW_PROGRAM_ID=5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

### Anchor Workspace
```typescript
import { Program } from '@coral-xyz/anchor';
import { LaunchosCurve } from './types/launchos_curve';
import IDL from './idl/launchos_curve.json';

const programId = new PublicKey("Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF");
const program = new Program<LaunchosCurve>(IDL, programId, provider);
```

---

## 🔐 Deployment Wallet

**⚠️ DEVNET ONLY - DO NOT USE FOR MAINNET**

**Address:** `Fkss3RBtNwTPiCY6SCDHyp8yYUirvM9PwDhUyLa1yybp`
**Remaining Balance:** 1.43 SOL (devnet)

---

## 📋 Mainnet Preparation

When ready for mainnet deployment:

1. **Create NEW wallet** (never reuse devnet wallet)
2. **Update Anchor.toml** with mainnet cluster
3. **Build for mainnet:**
   ```bash
   cargo build-sbf --release
   ```
4. **Deploy to mainnet-beta:**
   ```bash
   solana config set --url mainnet-beta
   solana program deploy target/deploy/launchos_curve.so
   ```
5. **Update these Program IDs** in your frontend
6. **Set up multi-sig** for upgrade authority

---

## 📊 Deployment Stats

- **Total Deployment Cost:** ~5.57 SOL
- **Programs Deployed:** 2
- **Total Size:** 780.48 KB
- **Network:** Devnet
- **Status:** ✅ Live & Ready for Testing
