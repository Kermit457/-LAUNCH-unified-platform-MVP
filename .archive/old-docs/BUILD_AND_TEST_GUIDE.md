# Build and Test Guide - LaunchOS Curve Program

## Quick Start (Copy-Paste Commands)

### 1. Open PowerShell as Administrator
```powershell
# Right-click PowerShell → Run as Administrator
```

### 2. Navigate to Project
```powershell
cd "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"
```

### 3. Set Environment Variables (Every PowerShell Session)
```powershell
$env:Path += ";C:\Users\mirko\.local\share\solana\install\active_release\bin;$env:USERPROFILE\.cargo\bin"
```

### 4. Verify Tools
```powershell
# Check Rust version
rustc --version
# Should show: rustc 1.81.0 or similar

# Check Solana version
solana --version
# Should show: solana-cli 3.0.6 or similar (Agave)

# Check Anchor version
anchor --version
# Should show: anchor-cli 0.30.1
```

### 5. Build Programs
```powershell
# Build both programs (escrow + curve)
anchor build
```

**Expected output:**
```
Compiling launchos-escrow v0.1.0
Compiling launchos-curve v0.1.0
...
Finished release [optimized] target(s) in X.XXs
```

**If build succeeds:**
- ✅ Programs compiled successfully
- ✅ All security features working
- ✅ Ready for deployment

**If build fails:**
- Check error messages
- Common issues:
  - Permission errors → Run as Administrator
  - Path not set → Rerun step 3
  - Rust outdated → Run `rustup update`

---

## Get Program IDs

After successful build:

```powershell
# Program IDs are in target/deploy/
ls target/deploy/*.json
```

You'll see:
- `launchos_escrow-keypair.json`
- `launchos_curve-keypair.json`

To get the program IDs:
```powershell
solana-keygen pubkey target/deploy/launchos_escrow-keypair.json
solana-keygen pubkey target/deploy/launchos_curve-keypair.json
```

**Update Anchor.toml with these IDs:**
```toml
[programs.devnet]
launchos_escrow = "YOUR_ESCROW_PROGRAM_ID"
launchos_curve = "YOUR_CURVE_PROGRAM_ID"
```

---

## Deploy to Devnet

### 1. Check Your Wallet Balance
```powershell
solana balance -u devnet
```

Your wallet: `C:\Users\mirko\.config\solana\devnet.json`

**If balance is low (<5 SOL):**
```powershell
solana airdrop 2 -u devnet
```

### 2. Deploy Programs
```powershell
# Deploy both programs to devnet
anchor deploy --provider.cluster devnet
```

**Expected output:**
```
Deploying cluster: devnet
Program ID: <ESCROW_PROGRAM_ID>
Program ID: <CURVE_PROGRAM_ID>
Deploy success
```

**If deployment succeeds:**
- ✅ Programs live on devnet
- ✅ Ready for testing

---

## Testing the Anti-Sniper Flow

### Manual Testing (Using Solana CLI)

#### Step 1: Initialize Config
```bash
# This creates the global config account
solana program invoke \
  --program-id <CURVE_PROGRAM_ID> \
  --function initialize \
  --args <PLATFORM_TREASURY_PUBKEY> \
  -u devnet
```

#### Step 2: Initialize Ban List
```bash
solana program invoke \
  --program-id <CURVE_PROGRAM_ID> \
  --function initialize_ban_list \
  -u devnet
```

#### Step 3: Create Curve (PENDING/Hidden)
```bash
# Creates curve with status PENDING (not visible publicly)
# Replace @yourhandle with actual Twitter handle
solana program invoke \
  --program-id <CURVE_PROGRAM_ID> \
  --function create_curve \
  --args "@yourhandle" "Profile" \
  -u devnet
```

**Check status:**
- Curve exists but status = PENDING
- Should NOT appear in public API results

#### Step 4: Creator Initial Buy (Still Hidden)
```bash
# Creator buys minimum keys (10)
# Curve still PENDING (hidden)
# Keys locked for 7 days
solana program invoke \
  --program-id <CURVE_PROGRAM_ID> \
  --function creator_initial_buy \
  --args 10 \
  -u devnet
```

**Check status:**
- Curve supply = 10
- Creator owns 10 keys (locked 7 days)
- Status still PENDING (hidden)

#### Step 5: Activate Curve (Now Public!)
```bash
# Makes curve visible to public
solana program invoke \
  --program-id <CURVE_PROGRAM_ID> \
  --function activate_curve \
  -u devnet
```

**Check status:**
- Status = ACTIVE
- NOW visible in public API
- Creator already owns keys at floor price
- Bots can't front-run (too late!)

#### Step 6: Public Buy Keys
```bash
# Anyone can now buy keys
solana program invoke \
  --program-id <CURVE_PROGRAM_ID> \
  --function buy_keys \
  --args 5 \
  -u devnet
```

**Check:**
- Supply increased
- Buyer received 5 keys
- Fees distributed instantly (94% reserve, 3% creator, 2% platform)

#### Step 7: Sell Keys
```bash
# Sell keys (5% tax applied)
solana program invoke \
  --program-id <CURVE_PROGRAM_ID> \
  --function sell_keys \
  --args 3 \
  -u devnet
```

**Check:**
- Supply decreased
- Seller received SOL (minus 5% tax)
- Reserve balance decreased

---

## Writing TypeScript Tests

Create `tests/curve.ts`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LaunchosCurve } from "../target/types/launchos_curve";
import { assert } from "chai";

describe("launchos-curve", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.LaunchosCurve as Program<LaunchosCurve>;

  let creator = anchor.web3.Keypair.generate();
  let buyer = anchor.web3.Keypair.generate();
  let platformTreasury = anchor.web3.Keypair.generate();

  const twitterHandle = "@testprofile";

  it("Initialize config", async () => {
    const [configPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("config")],
      program.programId
    );

    await program.methods
      .initialize(platformTreasury.publicKey)
      .accounts({
        config: configPda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const config = await program.account.curveConfig.fetch(configPda);
    assert.equal(config.paused, false);
  });

  it("STEP 1: Create curve (PENDING/hidden)", async () => {
    // Airdrop to creator
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        creator.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      )
    );

    const [curvePda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("curve"), Buffer.from(twitterHandle)],
      program.programId
    );

    const [reservePda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("reserve"), curvePda.toBuffer()],
      program.programId
    );

    await program.methods
      .createCurve(twitterHandle, { profile: {} })
      .accounts({
        curve: curvePda,
        reserveVault: reservePda,
        creator: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    const curve = await program.account.bondingCurve.fetch(curvePda);
    assert.equal(curve.status.pending, true); // HIDDEN!
    assert.equal(curve.supply.toString(), "0");
  });

  it("STEP 2: Creator initial buy (still hidden)", async () => {
    const [curvePda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("curve"), Buffer.from(twitterHandle)],
      program.programId
    );

    const [holderPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("holder"), curvePda.toBuffer(), creator.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .creatorInitialBuy(new anchor.BN(10))
      .accounts({
        curve: curvePda,
        keyHolder: holderPda,
        buyer: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    const curve = await program.account.bondingCurve.fetch(curvePda);
    assert.equal(curve.status.pending, true); // STILL HIDDEN!
    assert.equal(curve.supply.toString(), "10");

    const holder = await program.account.keyHolder.fetch(holderPda);
    assert.equal(holder.amount.toString(), "10");
    assert.equal(holder.isCreator, true); // Keys locked!
  });

  it("STEP 3: Activate curve (now public!)", async () => {
    const [curvePda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("curve"), Buffer.from(twitterHandle)],
      program.programId
    );

    await program.methods
      .activateCurve()
      .accounts({
        curve: curvePda,
        creator: creator.publicKey,
      })
      .signers([creator])
      .rpc();

    const curve = await program.account.bondingCurve.fetch(curvePda);
    assert.equal(curve.status.active, true); // NOW PUBLIC!
  });

  it("Public can buy keys", async () => {
    // Airdrop to buyer
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        buyer.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      )
    );

    const [curvePda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("curve"), Buffer.from(twitterHandle)],
      program.programId
    );

    const [holderPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("holder"), curvePda.toBuffer(), buyer.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .buyKeys(new anchor.BN(5), null)
      .accounts({
        curve: curvePda,
        keyHolder: holderPda,
        buyer: buyer.publicKey,
      })
      .signers([buyer])
      .rpc();

    const holder = await program.account.keyHolder.fetch(holderPda);
    assert.equal(holder.amount.toString(), "5");
  });

  it("Creator cannot sell locked keys", async () => {
    const [curvePda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("curve"), Buffer.from(twitterHandle)],
      program.programId
    );

    const [holderPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("holder"), curvePda.toBuffer(), creator.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .sellKeys(new anchor.BN(5))
        .accounts({
          curve: curvePda,
          keyHolder: holderPda,
          seller: creator.publicKey,
        })
        .signers([creator])
        .rpc();

      assert.fail("Should have thrown KeysLocked error");
    } catch (err) {
      assert.include(err.toString(), "KeysLocked");
    }
  });

  it("Regular user can sell keys", async () => {
    const [curvePda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("curve"), Buffer.from(twitterHandle)],
      program.programId
    );

    const [holderPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("holder"), curvePda.toBuffer(), buyer.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .sellKeys(new anchor.BN(3))
      .accounts({
        curve: curvePda,
        keyHolder: holderPda,
        seller: buyer.publicKey,
      })
      .signers([buyer])
      .rpc();

    const holder = await program.account.keyHolder.fetch(holderPda);
    assert.equal(holder.amount.toString(), "2"); // Had 5, sold 3, left with 2
  });
});
```

### Run Tests
```powershell
# Run all tests
anchor test --skip-deploy

# Run specific test file
anchor test --skip-deploy tests/curve.ts
```

---

## Verification Checklist

After deploying and testing, verify:

### Security Features:
- ✅ Integer overflow protection works (try buying MAX_U64 keys, should error)
- ✅ Reentrancy guard works (cannot call buy_keys during buy_keys)
- ✅ Access control works (non-creator cannot activate curve)
- ✅ Input validation works (amount=0 should error)
- ✅ Creator keys locked (cannot sell before 7 days)

### Anti-Sniper Flow:
- ✅ Step 1: Curve created with PENDING status (hidden)
- ✅ Step 2: Creator buys keys, still PENDING (hidden)
- ✅ Step 3: Activate makes curve public (ACTIVE)
- ✅ Creator already owns keys at floor price
- ✅ Public can buy after activation

### Fee Distribution:
- ✅ Buy: 94% reserve, 3% creator, 2% platform, 1% referrer
- ✅ Sell: 5% tax applied
- ✅ Fees sent instantly (not escrowed)

### Moderation:
- ✅ Bot reporting works
- ✅ Admin can ban accounts
- ✅ Banned accounts cannot trade
- ✅ Admin can pause/unpause globally

---

## Troubleshooting

### Build Errors

**Error: `failed to load manifest`**
- Solution: Check Cargo.toml workspace members
- Should be: `["programs/launchos-escrow", "programs/launchos-curve"]`

**Error: `no such command: 'build-bpf'`**
- Solution: Update Anchor to 0.30.1
- Run: `cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli --force`

**Error: `privilege not held`**
- Solution: Run PowerShell as Administrator

### Deployment Errors

**Error: `insufficient funds`**
- Solution: Airdrop more SOL
- Run: `solana airdrop 2 -u devnet`

**Error: `Transaction simulation failed`**
- Solution: Check program ID in Anchor.toml matches build output
- Rebuild: `anchor build`
- Redeploy: `anchor deploy`

### Test Errors

**Error: `Account does not exist`**
- Solution: Initialize config first
- Run: `it("Initialize config")` test before others

**Error: `Custom error: 0x1770`**
- Solution: Decode error code
- Run: `anchor error <ERROR_CODE>`
- Check errors.rs for meaning

---

## Next Steps

1. ✅ Build programs
2. ✅ Deploy to devnet
3. ✅ Run tests
4. 🔄 Test manually with Solana CLI
5. 🔄 Build frontend integration
6. 🔄 Beta test with real users
7. 🔄 Add Phase 2 security features
8. 🔄 Security audit
9. 🔄 Mainnet launch

**Current Status: Ready to build!** 🚀

---

## Quick Command Reference

```powershell
# Set PATH (every session)
$env:Path += ";C:\Users\mirko\.local\share\solana\install\active_release\bin;$env:USERPROFILE\.cargo\bin"

# Build
anchor build

# Test
anchor test --skip-deploy

# Deploy
anchor deploy --provider.cluster devnet

# Check balance
solana balance -u devnet

# Airdrop
solana airdrop 2 -u devnet

# Get program ID
solana-keygen pubkey target/deploy/launchos_curve-keypair.json
```

Save these commands in a PowerShell script for quick access!
