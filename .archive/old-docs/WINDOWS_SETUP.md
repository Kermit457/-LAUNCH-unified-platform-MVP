# Windows Setup Guide for Solana Development

## Recommended: WSL2 (Windows Subsystem for Linux)

This is the **easiest and most reliable** way to develop Solana programs on Windows.

### Step 1: Install WSL2

Open PowerShell as Administrator and run:

```powershell
wsl --install
```

This will install Ubuntu by default. Restart your computer when prompted.

### Step 2: Open Ubuntu Terminal

After restart, search for "Ubuntu" in Windows Start menu and open it.

### Step 3: Inside WSL/Ubuntu, Install Everything

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install build essentials
sudo apt install -y build-essential pkg-config libssl-dev

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Install Node.js (for Anchor)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
```

### Step 4: Access Your Project Files

Your Windows drives are accessible in WSL at `/mnt/c/`, so:

```bash
# Navigate to your project
cd /mnt/c/Users/mirko/OneDrive/Desktop/WIDGETS\ FOR\ LAUNCH/

# Or copy project to WSL home directory (faster)
cp -r /mnt/c/Users/mirko/OneDrive/Desktop/WIDGETS\ FOR\ LAUNCH ~/launchos
cd ~/launchos
```

### Step 5: Build and Test

```bash
cd solana-program
anchor build
anchor test
```

---

## Alternative: Native Windows (More Complex)

If you can't use WSL, here's the native Windows approach:

### 1. Install Visual Studio Build Tools

Required for compiling Rust programs:
- Download from: https://visualstudio.microsoft.com/downloads/
- Select "Build Tools for Visual Studio 2022"
- Install "Desktop development with C++" workload

### 2. Install Rust

```powershell
# Download and run rustup installer
Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -OutFile "$env:TEMP\rustup-init.exe"
& "$env:TEMP\rustup-init.exe" -y

# Reload PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Close and reopen PowerShell, then verify:
```powershell
rustc --version
cargo --version
```

### 3. Install Solana CLI

```powershell
# Create temp directory
New-Item -ItemType Directory -Force -Path C:\solana-install-tmp

# Download installer
Invoke-WebRequest -Uri "https://release.solana.com/v1.18.18/solana-install-init-x86_64-pc-windows-msvc.exe" -OutFile "C:\solana-install-tmp\solana-install-init.exe"

# Run installer
& C:\solana-install-tmp\solana-install-init.exe v1.18.18

# Add to PATH (permanent)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Users\$env:USERNAME\.local\share\solana\install\active_release\bin", "User")
```

Close and reopen PowerShell, then verify:
```powershell
solana --version
```

### 4. Install Anchor (Challenging on Windows)

**Option A: Use pre-built binaries** (if available)
```powershell
# Check if pre-built binaries exist
# Visit: https://github.com/coral-xyz/anchor/releases
```

**Option B: Build from source**
```powershell
# This can take 30+ minutes and may have issues
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked --force
```

**Option C: Use Docker** (recommended if native build fails)
```powershell
# Install Docker Desktop first: https://www.docker.com/products/docker-desktop/
# Then use Anchor via Docker
docker pull projectserum/build:latest
```

---

## What I Recommend for You

Based on your environment (**Windows with Cygwin**), I strongly recommend:

### ✅ Use WSL2

**Pros:**
- Native Linux environment (Solana was built for Linux)
- All tools work perfectly
- Faster builds
- Better compatibility
- Can still access Windows files

**Cons:**
- Need to install WSL2 (5-10 minutes)
- Uses ~2GB disk space

### Steps:
1. Run `wsl --install` in PowerShell (as Administrator)
2. Restart computer
3. Open Ubuntu terminal
4. Run the installation commands from Step 3 above
5. Navigate to project: `cd /mnt/c/Users/mirko/OneDrive/Desktop/WIDGETS\ FOR\ LAUNCH/`
6. Build: `cd solana-program && anchor build`

---

## Quick Test: What's Already Installed?

Run these in your terminal to see what you already have:

```powershell
# Check Rust
rustc --version

# Check Solana
solana --version

# Check Anchor
anchor --version

# Check Node
node --version
```

If any command works, you're partially set up!

---

## After Setup

Once everything is installed:

```bash
# Configure Solana for devnet
solana config set --url devnet

# Create wallet
solana-keygen new --outfile ~/.config/solana/devnet.json

# Get SOL
solana airdrop 2

# Build contract
cd solana-program
anchor build

# Run tests
anchor test
```

---

## Need Help?

If you get stuck:
1. Check that you're using PowerShell as Administrator
2. Make sure antivirus isn't blocking downloads
3. Try WSL2 if native Windows isn't working
4. Let me know the specific error you're seeing

---

**Recommendation**: Start with WSL2. It will save you hours of troubleshooting! 🚀
