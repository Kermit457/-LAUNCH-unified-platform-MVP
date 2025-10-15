# LaunchOS Curve Program - Deployment Guide

## Prerequisites

- Anchor CLI installed
- Solana CLI installed
- Rust toolchain installed
- A devnet wallet configured

## Quick Start - Automated Deployment

### For Windows (PowerShell):
```powershell
cd "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"
.\deploy-devnet.ps1
```

### For Linux/Mac/WSL:
```bash
cd ~/path/to/solana-program
chmod +x deploy-devnet.sh
./deploy-devnet.sh
```

## Manual Deployment Steps

### 1. Build the Program
```bash
cd solana-program
anchor build
```

**Expected Output:**
- Compiled program binaries in `target/deploy/`
- IDL files generated
- Build artifacts ready for deployment

### 2. Configure Solana CLI
```bash
# Set to devnet
solana config set --url devnet

# Verify configuration
solana config get
```

### 3. Check Wallet Balance
```bash
solana balance
```

**If balance is low:**
```bash
# Request airdrop (devnet only)
solana airdrop 2

# Wait a moment, then check again
solana balance
```

### 4. Deploy to Devnet
```bash
anchor deploy --provider.cluster devnet
```

**Expected Output:**
```
Deploying workspace: https://api.devnet.solana.com
Upgrade authority: <your-wallet-address>
Deploying program "launchos_curve"...
Program Id: CuRvE11111111111111111111111111111111111111
Deploy success
```

### 5. Verify Deployment
```bash
# Get program info
solana program show CuRvE11111111111111111111111111111111111111

# Or use the actual program ID from deployment output
```

## Post-Deployment

### Update Program ID (if changed)
If the deployment gives you a different program ID than expected:

1. Update `Anchor.toml`:
```toml
[programs.devnet]
launchos_curve = "YOUR_NEW_PROGRAM_ID"
```

2. Update `programs/launchos-curve/src/lib.rs`:
```rust
declare_id!("YOUR_NEW_PROGRAM_ID");
```

3. Rebuild and redeploy:
```bash
anchor build
anchor deploy --provider.cluster devnet
```

### Run Tests
```bash
anchor test --skip-local-validator
```

## Troubleshooting

### Build Errors
- Ensure Rust is up to date: `rustup update`
- Clear build cache: `anchor clean`
- Rebuild: `anchor build`

### Insufficient SOL for Deployment
- Devnet: Request airdrop `solana airdrop 2`
- May need multiple airdrops for deployment (costs ~2-5 SOL)

### Deployment Fails
- Check wallet configuration: `solana config get`
- Verify wallet has funds: `solana balance`
- Check network connectivity to devnet

### Program Already Deployed
If you need to upgrade the program:
```bash
anchor upgrade target/deploy/launchos_curve.so --program-id CuRvE11111111111111111111111111111111111111 --provider.cluster devnet
```

## Program Architecture

The LaunchOS Curve program includes:

### Security Features
- Anti-sniper protection with configurable delay
- Maximum purchase limits
- Fee structure (2.5% to platform, 2.5% to liquidity provider)
- Owner-only administrative functions
- Secure PDA-based architecture

### Core Functions
- `initialize_curve` - Create new token curve
- `buy_tokens` - Purchase tokens on the curve
- `sell_tokens` - Sell tokens back to the curve
- `add_liquidity` - Add liquidity to the curve
- `remove_liquidity` - Remove liquidity from the curve

### State Management
- CurveState: Main curve configuration and state
- LiquidityProvider: Tracks LP positions and rewards

## Next Steps

1. Test all program functions on devnet
2. Perform security audit
3. Stress test with multiple transactions
4. Deploy to mainnet when ready

## Resources

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Solana Program Library](https://spl.solana.com/)
