# 🚀 Escrow System - Setup Guide

**Phase 1: Foundation**
**Estimated Time:** Week 1 (5-7 days)

---

## 📋 **Prerequisites**

Before we start, you'll need to install:

### **1. Rust & Cargo**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Verify installation
rustc --version
cargo --version
```

### **2. Solana CLI**
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Add to PATH (add this to ~/.bashrc or ~/.zshrc)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Verify installation
solana --version

# Configure for devnet
solana config set --url devnet

# Create a new wallet (SAVE THE SEED PHRASE!)
solana-keygen new --outfile ~/.config/solana/devnet.json

# Get devnet SOL (for testing)
solana airdrop 2
```

### **3. Anchor Framework**
```bash
# Install Anchor version manager
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install latest Anchor
avm install latest
avm use latest

# Verify installation
anchor --version
```

### **4. Node.js Dependencies**
```bash
# Already have Node.js, just install Solana packages
npm install @solana/web3.js @solana/spl-token @coral-xyz/anchor
npm install --save-dev @types/bn.js
```

---

## 🏗️ **Project Structure**

We'll add a new `solana-program` directory to your project:

```
WIDGETS FOR LAUNCH/
├── solana-program/           # NEW - Solana smart contracts
│   ├── Anchor.toml           # Anchor configuration
│   ├── Cargo.toml            # Rust dependencies
│   ├── programs/
│   │   └── launchos-escrow/
│   │       ├── Cargo.toml
│   │       └── src/
│   │           ├── lib.rs    # Main escrow program
│   │           ├── state.rs  # Account structures
│   │           └── errors.rs # Custom errors
│   ├── tests/
│   │   └── launchos-escrow.ts # Integration tests
│   └── target/               # Build output
│
├── lib/solana/               # NEW - TypeScript SDK
│   ├── escrow.ts            # Escrow manager class
│   ├── constants.ts         # Program IDs, addresses
│   └── types.ts             # TypeScript types
│
├── hooks/                    # EXISTING - Add escrow hooks
│   └── useEscrowPayment.ts  # NEW - React hook for payments
│
└── components/payments/      # NEW - Payment UI components
    ├── BoostPaymentModal.tsx
    ├── CampaignFundingModal.tsx
    └── PayoutClaimButton.tsx
```

---

## ⚙️ **Step 1: Initialize Anchor Project**

Run these commands in your project root:

```bash
# Create solana-program directory
mkdir solana-program
cd solana-program

# Initialize Anchor project
anchor init launchos-escrow

# This creates:
# - Anchor.toml (config)
# - Cargo.toml (dependencies)
# - programs/launchos-escrow/ (smart contract)
# - tests/ (integration tests)
```

---

## 📝 **Step 2: Configure Anchor.toml**

Edit `solana-program/Anchor.toml`:

```toml
[features]
seeds = false
skip-lint = false

[programs.devnet]
launchos_escrow = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[programs.mainnet]
# We'll add this later after devnet testing

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/devnet.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"

[test]
startup_wait = 10000
```

---

## 🦀 **Step 3: Update Cargo.toml**

Edit `solana-program/programs/launchos-escrow/Cargo.toml`:

```toml
[package]
name = "launchos-escrow"
version = "0.1.0"
description = "LaunchOS Escrow Program for USDC payments"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "launchos_escrow"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.29.0"
anchor-spl = "0.29.0"
```

---

## 📦 **Step 4: Install NPM Dependencies**

In the main project root:

```bash
# Solana + Anchor
npm install @solana/web3.js@^1.87.0
npm install @solana/spl-token@^0.3.9
npm install @coral-xyz/anchor@^0.29.0

# Wallet adapter (for UI)
npm install @solana/wallet-adapter-react
npm install @solana/wallet-adapter-react-ui
npm install @solana/wallet-adapter-wallets
npm install @solana/wallet-adapter-base

# TypeScript types
npm install --save-dev @types/bn.js
```

---

## 🧪 **Step 5: Verify Setup**

```bash
# Build the program
cd solana-program
anchor build

# Run tests (will fail for now - we haven't written the code yet)
anchor test

# Check Solana config
solana config get

# Should show:
# Config File: ~/.config/solana/cli/config.yml
# RPC URL: https://api.devnet.solana.com
# WebSocket URL: wss://api.devnet.solana.com/
# Keypair Path: ~/.config/solana/devnet.json
```

---

## ✅ **Setup Complete Checklist**

- [ ] Rust installed and working
- [ ] Solana CLI installed
- [ ] Solana configured for devnet
- [ ] Devnet wallet created (SEED PHRASE SAVED!)
- [ ] Devnet SOL airdropped (at least 2 SOL)
- [ ] Anchor CLI installed
- [ ] Anchor project initialized
- [ ] NPM packages installed
- [ ] `anchor build` runs successfully

---

## 🎯 **Next Steps**

After setup is complete, we'll:

1. ✅ Write the escrow smart contract (`lib.rs`)
2. ✅ Define account structures (`state.rs`)
3. ✅ Add error handling (`errors.rs`)
4. ✅ Write integration tests
5. ✅ Deploy to devnet
6. ✅ Build TypeScript SDK
7. ✅ Create React hooks
8. ✅ Build payment UI components

---

## 🆘 **Troubleshooting**

### **"solana: command not found"**
```bash
# Add Solana to PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Make it permanent
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### **"anchor: command not found"**
```bash
# Reinstall Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### **"Airdrop failed"**
```bash
# Devnet can be slow, try again or use a different RPC
solana config set --url https://api.devnet.solana.com
solana airdrop 2
```

### **"Build failed"**
```bash
# Make sure Rust is up to date
rustup update

# Clean and rebuild
anchor clean
anchor build
```

---

## 📚 **Resources**

- **Solana Docs**: https://docs.solana.com/
- **Anchor Book**: https://book.anchor-lang.com/
- **Solana Cookbook**: https://solanacookbook.com/
- **SPL Token Docs**: https://spl.solana.com/token

---

**Once setup is complete, let me know and we'll start writing the smart contract!** 🚀
