# Solana Development Setup Commands

This file contains all the commands you need to set up and run Solana development on Windows.

## 📋 Quick Start (Run These Every Time You Open PowerShell)

```powershell
# Add Solana and Cargo to PATH (required every session)
$env:Path += ";C:\Users\mirko\.local\share\solana\install\active_release\bin;$env:USERPROFILE\.cargo\bin"

# Navigate to project
cd "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH"

# Verify everything works
solana --version
anchor --version
```

---

## 🔧 One-Time Installation Commands

### 1. Install Rust
```powershell
# Download and run rustup installer
Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile "$env:TEMP\rustup-init.exe"
& "$env:TEMP\rustup-init.exe" -y

# Add to PATH
$env:Path += ";$env:USERPROFILE\.cargo\bin"
```

### 2. Install Solana CLI
```powershell
# Download Solana/Agave installer
cmd /c "curl https://release.anza.xyz/v3.0.6/agave-install-init-x86_64-pc-windows-msvc.exe --output C:\agave-install-tmp\agave-install-init.exe --create-dirs"

# Run installer (requires Administrator)
C:\agave-install-tmp\agave-install-init.exe v3.0.6
```

### 3. Install Anchor (if not already installed)
```powershell
# Install Anchor v0.29.0 (compatible with your setup)
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
```

---

## 💰 Wallet Setup Commands

### Create a Devnet Wallet
```powershell
# Add Solana to PATH first!
$env:Path += ";C:\Users\mirko\.local\share\solana\install\active_release\bin"

# Create new wallet
solana-keygen new --outfile C:\Users\mirko\.config\solana\devnet.json

# Press Enter when asked for passphrase (or enter one for security)
```

### Configure Solana for Devnet
```powershell
# Set cluster to devnet
solana config set --url devnet

# Set keypair to devnet wallet
solana config set --keypair C:\Users\mirko\.config\solana\devnet.json
```

### Get Devnet SOL (Free Test Tokens)
```powershell
# Request 2 SOL airdrop
solana airdrop 2

# Check balance
solana balance

# If airdrop fails, try again or visit: https://faucet.solana.com/
```

### View Your Wallet Info
```powershell
# Show public key
solana address

# Show balance
solana balance

# View all config
solana config get
```

---

## 🏗️ Build Commands

### Navigate to Solana Program Directory
```powershell
cd "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"
```

### Install NPM Dependencies
```powershell
npm install
```

### Build the Smart Contract
```powershell
# Using full path to anchor
& "$env:USERPROFILE\.cargo\bin\anchor.exe" build
```

### Run Tests
```powershell
& "$env:USERPROFILE\.cargo\bin\anchor.exe" test
```

### Deploy to Devnet
```powershell
& "$env:USERPROFILE\.cargo\bin\anchor.exe" deploy --provider.cluster devnet
```

---

## 🚀 Daily Workflow

### Starting a Session
```powershell
# 1. Open PowerShell (normal, not admin)

# 2. Add tools to PATH
$env:Path += ";C:\Users\mirko\.local\share\solana\install\active_release\bin;$env:USERPROFILE\.cargo\bin"

# 3. Navigate to project
cd "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

# 4. Check balance (get more if needed)
solana balance

# 5. Build or test
& "$env:USERPROFILE\.cargo\bin\anchor.exe" build
```

---

## 📝 Useful Commands Reference

### Check Versions
```powershell
rustc --version          # Should show 1.90.0
cargo --version          # Should show 1.90.0
solana --version         # Should show 3.0.6
node --version           # Should show v22.19.0
& "$env:USERPROFILE\.cargo\bin\anchor.exe" --version  # Should show 0.29.0
```

### Solana Configuration
```powershell
# View current config
solana config get

# Set to devnet
solana config set --url devnet

# Set to mainnet (DON'T DO THIS YET!)
# solana config set --url mainnet-beta

# Set to localhost
solana config set --url localhost
```

### Wallet Management
```powershell
# Show public key
solana address

# Check balance
solana balance

# Get airdrop (devnet only)
solana airdrop 2

# Send SOL to another address
solana transfer <RECIPIENT_ADDRESS> <AMOUNT>
```

### Anchor Commands
```powershell
# Build program
& "$env:USERPROFILE\.cargo\bin\anchor.exe" build

# Test program
& "$env:USERPROFILE\.cargo\bin\anchor.exe" test

# Deploy to devnet
& "$env:USERPROFILE\.cargo\bin\anchor.exe" deploy

# Clean build artifacts
& "$env:USERPROFILE\.cargo\bin\anchor.exe" clean

# Generate TypeScript types
& "$env:USERPROFILE\.cargo\bin\anchor.exe" build --idl
```

### View Program Info
```powershell
# After deploying, view program details
solana program show <PROGRAM_ID>

# View program logs
solana logs <PROGRAM_ID>
```

---

## 🔐 Your Wallet Details

**Public Key (Address):**
```
Fkss3RBtNwTPiCY6SCDHyp8yYUirvM9PwDhUyLa1yybp
```

**Seed Phrase (KEEP SECRET!):**
```
shed ivory ahead frown win liberty involve olive review switch brass team
```

**Keypair File Location:**
```
C:\Users\mirko\.config\solana\devnet.json
```

**IMPORTANT:**
- Never share your seed phrase!
- This is a devnet wallet (test network only)
- When moving to mainnet, create a NEW wallet with strong security

---

## 🐛 Troubleshooting

### "solana: The term is not recognized"
```powershell
# Add Solana to PATH
$env:Path += ";C:\Users\mirko\.local\share\solana\install\active_release\bin"
```

### "anchor: command not found"
```powershell
# Use full path
& "$env:USERPROFILE\.cargo\bin\anchor.exe" build
```

### "Insufficient SOL balance"
```powershell
# Get more devnet SOL
solana airdrop 2

# Or visit: https://faucet.solana.com/
```

### "Build failed"
```powershell
# Clean and rebuild
& "$env:USERPROFILE\.cargo\bin\anchor.exe" clean
& "$env:USERPROFILE\.cargo\bin\anchor.exe" build
```

### Path not persisting between sessions
```powershell
# Make PATH permanent (run once):
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Users\mirko\.local\share\solana\install\active_release\bin;$env:USERPROFILE\.cargo\bin",
    "User"
)

# Then restart PowerShell
```

---

## 📚 Useful Links

- **Solana Docs:** https://docs.solana.com/
- **Anchor Docs:** https://book.anchor-lang.com/
- **Solana Explorer (Devnet):** https://explorer.solana.com/?cluster=devnet
- **Solana Faucet:** https://faucet.solana.com/
- **Your Wallet on Explorer:** https://explorer.solana.com/address/Fkss3RBtNwTPiCY6SCDHyp8yYUirvM9PwDhUyLa1yybp?cluster=devnet

---

## ✅ Quick Health Check

Run these commands to verify everything is working:

```powershell
# Add to PATH
$env:Path += ";C:\Users\mirko\.local\share\solana\install\active_release\bin;$env:USERPROFILE\.cargo\bin"

# Check versions
Write-Host "`n=== Checking Versions ===" -ForegroundColor Cyan
rustc --version
cargo --version
solana --version
node --version
& "$env:USERPROFILE\.cargo\bin\anchor.exe" --version

# Check Solana config
Write-Host "`n=== Solana Configuration ===" -ForegroundColor Cyan
solana config get

# Check wallet balance
Write-Host "`n=== Wallet Info ===" -ForegroundColor Cyan
solana address
solana balance

Write-Host "`n=== All Systems Check Complete! ===" -ForegroundColor Green
```

---

## 🎯 Next Steps After Setup

1. ✅ Verify all commands work
2. ✅ Ensure you have 2+ SOL in devnet wallet
3. ✅ Navigate to solana-program directory
4. ✅ Run `npm install`
5. ✅ Build the contract: `& "$env:USERPROFILE\.cargo\bin\anchor.exe" build`
6. ✅ Run tests: `& "$env:USERPROFILE\.cargo\bin\anchor.exe" test`
7. ✅ Deploy to devnet: `& "$env:USERPROFILE\.cargo\bin\anchor.exe" deploy`

---

**Last Updated:** 2025-10-12
**Status:** Ready for development! 🚀
