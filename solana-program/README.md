# LaunchOS Escrow Smart Contract

Solana escrow system for managing USDC payments across the LaunchOS platform.

## 📦 What's Included

- **Smart Contract** (`programs/launchos-escrow/src/`):
  - `lib.rs` - Main program logic with deposit/withdraw functions
  - `state.rs` - Data structures (EscrowAccount, Pool)
  - `errors.rs` - Custom error types

- **Tests** (`tests/launchos-escrow.ts`):
  - Complete test suite with 8 test cases
  - Tests deposits, withdrawals, pausing, and multi-pool scenarios

## 🚀 Quick Start

### Prerequisites

You need Rust, Solana CLI, and Anchor installed. If not yet installed:

#### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### 2. Install Solana CLI
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

#### 3. Install Anchor
```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli
```

### Setup

1. **Configure Solana for devnet**:
```bash
solana config set --url devnet
```

2. **Create a devnet wallet** (if you don't have one):
```bash
solana-keygen new --outfile ~/.config/solana/devnet.json
```

3. **Get devnet SOL**:
```bash
solana airdrop 2
```

4. **Install dependencies**:
```bash
cd solana-program
npm install
# or
yarn install
```

### Build

```bash
anchor build
```

This will:
- Compile the Rust program
- Generate TypeScript types in `target/types/`
- Create the program binary in `target/deploy/`

### Test

```bash
anchor test
```

This will:
- Start a local Solana test validator
- Deploy the program
- Run all tests
- Shut down the validator

### Deploy to Devnet

```bash
anchor deploy --provider.cluster devnet
```

After deployment, your program ID will be shown. Update `Anchor.toml` and `lib.rs` with the new program ID if needed.

## 📊 Smart Contract Overview

### Core Functions

#### `initialize(authority: Pubkey)`
Initialize the master escrow account with an authority wallet.

#### `create_pool(pool_id, pool_type, owner_id, pool_token_account)`
Create a new escrow pool for specific use cases:
- `Boost` - For boost payments (10 USDC each)
- `Campaign` - For campaign budgets
- `Quest` - For quest rewards
- `Contribution` - For launch contributions
- `Revenue` - For revenue sharing
- `Payout` - For general payouts

#### `deposit(amount)`
Deposit USDC into an escrow pool. Updates:
- Pool balance
- Total deposited counter
- Global TVL (Total Value Locked)

#### `withdraw(amount)`
Withdraw USDC from pool (requires authority). Updates:
- Pool balance
- Total withdrawn counter
- Global TVL

#### `close_pool()`
Close a pool (requires zero balance).

#### `pause()` / `unpause()`
Emergency pause/unpause all escrow operations.

### Data Structures

#### `EscrowAccount`
Master account tracking all pools:
- `authority` - Admin wallet
- `total_pools` - Number of pools created
- `total_value_locked` - Total USDC across all pools
- `paused` - Emergency pause flag

#### `Pool`
Individual escrow pool:
- `pool_id` - Unique identifier
- `pool_type` - Purpose (Boost, Campaign, etc.)
- `balance` - Current USDC balance
- `total_deposited` - Lifetime deposits
- `total_withdrawn` - Lifetime withdrawals
- `status` - Active or Closed
- `pool_token_account` - Token account holding USDC

## 🔒 Security Features

- **Authority Control**: Only authorized wallet can withdraw funds
- **Balance Checks**: Prevents overdrawing from pools
- **Emergency Pause**: Can halt all operations if needed
- **Pool Isolation**: Each pool is separate with its own accounting
- **Audit Trail**: All operations emit events for tracking

## 📝 Next Steps

After deploying the smart contract:

1. **Create TypeScript SDK** (`lib/solana/escrow.ts`)
2. **Build React hooks** (`hooks/useEscrowPayment.ts`)
3. **Integrate with UI** (payment modals, claim buttons)
4. **Add API endpoints** for backend integration
5. **Set up monitoring** (track TVL, transactions)
6. **Security audit** before mainnet deployment

## 🧪 Test Coverage

Current tests cover:
- ✅ Escrow initialization
- ✅ Pool creation
- ✅ USDC deposits
- ✅ USDC withdrawals
- ✅ Insufficient balance errors
- ✅ Pause/unpause functionality
- ✅ Multiple pool types
- ✅ Pool lifecycle management

## 🛠️ Troubleshooting

### "Program not found"
Make sure you've built the program:
```bash
anchor build
```

### "Insufficient SOL balance"
Get more devnet SOL:
```bash
solana airdrop 2
```

### "Anchor version mismatch"
Check your Anchor version matches the project:
```bash
anchor --version  # Should be 0.29.0
```

### Build fails with Rust errors
Update Rust to latest stable:
```bash
rustup update stable
```

## 📚 Resources

- [Anchor Documentation](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [SPL Token Program](https://spl.solana.com/token)

## 🤝 Contributing

When making changes:
1. Update tests to cover new functionality
2. Run `anchor test` to ensure all tests pass
3. Update this README with new features
4. Follow Rust naming conventions

## 📞 Support

For questions about the escrow system:
- Check [ESCROW_SYSTEM_PLAN.md](../ESCROW_SYSTEM_PLAN.md) for architecture
- See [START_HERE_ESCROW.md](../START_HERE_ESCROW.md) for implementation guide
- Review test file for usage examples

---

**Status**: Smart contract complete ✅ | Ready for testing and deployment
