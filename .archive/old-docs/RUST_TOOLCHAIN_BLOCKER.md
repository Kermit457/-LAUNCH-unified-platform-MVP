# Rust Toolchain Blocker - Status Report

## Problem Summary

Cannot rebuild the Solana program due to Rust toolchain version incompatibility on Windows.

## Technical Details

### What We Need to Fix
The deployed program at `Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF` requires `ban_list` account validation, but the ban_list cannot be initialized on devnet due to Solana's 10KB account reallocation limit.

### The Fix (Already in Source Code)
Changed `ban_list` from `Account<'info, BanList>` to `UncheckedAccount<'info>` in [lib.rs:1197](solana-program/programs/launchos-curve/src/lib.rs#L1197).

### Why We Can't Rebuild

**Root Cause**: Dependency chain requires Rust 1.76+, but Solana 1.18.26 toolchain only has Rust 1.75.0-dev

```
Anchor 0.30.1
  → solana-program 1.18.26
    → borsh 1.5.7
      → proc-macro-crate 3.4.0
        → toml_edit 0.23.7
          → toml_datetime 0.7.3
            → ❌ REQUIRES Rust 1.76+ (we have 1.75.0-dev)
```

### What We Tried

1. ❌ `cargo build-sbf` - uses Solana toolchain (1.75.0-dev) not system Rust
2. ❌ `cargo update toml_datetime` - dependency resolution fails
3. ❌ Regenerating Cargo.lock - creates lockfile v4 incompatible with old Rust
4. ❌ Installing Agave 2.x with newer Rust - Windows/Cygwin architecture not supported
5. ❌ Using `--platform-tools v1.45` flag - not available in Solana 1.18.26

## Solutions

### Option 1: Docker Build (RECOMMENDED) ✅

Use Linux container with Agave 2.2.20 (has Rust 1.79+):

```powershell
cd solana-program
.\build-docker.ps1
```

This will:
1. Build a Docker image with Agave 2.2.20 + Rust 1.79+
2. Run `anchor build` inside the container
3. Output `target/deploy/launchos_curve.so`
4. Deploy with: `solana program deploy target\deploy\launchos_curve.so --program-id Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF`

**Requirements**: Docker Desktop installed on Windows

### Option 2: WSL2 Build

```bash
# In WSL2 Ubuntu
curl -sSfL https://release.anza.xyz/v2.2.20/install | sh
cd /mnt/c/Users/mirko/OneDrive/Desktop/widgets-for-launch/solana-program
anchor build
```

### Option 3: GitHub Actions CI

Create `.github/workflows/build.yml` to build on Linux runners and download artifacts.

### Option 4: Remote Linux VM

SSH into a Linux machine, clone the repo, build there, and scp the `.so` file back.

## Files Created

- [solana-program/Dockerfile](solana-program/Dockerfile) - Docker build environment
- [solana-program/build-docker.ps1](solana-program/build-docker.ps1) - Automated build script

## Next Steps

1. Install Docker Desktop if not already installed
2. Run `.\build-docker.ps1` in the solana-program directory
3. Deploy the updated program
4. Test curve creation

## Timeline

- **Oct 16**: Last successful build (deployed version WITHOUT UncheckedAccount fix)
- **Oct 19**: Modified source code (ban_list → UncheckedAccount)
- **Oct 19**: Discovered Rust toolchain blocker
- **Oct 19**: Created Docker-based solution

## Status

🟡 **BLOCKED**: Awaiting Docker build or alternative Linux environment

Once built and deployed, curve creation should work without ban_list initialization.
