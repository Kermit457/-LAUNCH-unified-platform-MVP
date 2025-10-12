import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LaunchosEscrow } from "../target/types/launchos_escrow";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";
import { assert } from "chai";

describe("launchos-escrow", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.LaunchosEscrow as Program<LaunchosEscrow>;

  // Test accounts
  let usdcMint: PublicKey;
  let authority: Keypair;
  let user: Keypair;
  let userTokenAccount: PublicKey;
  let poolTokenAccount: PublicKey;
  let escrowPda: PublicKey;
  let poolPda: PublicKey;

  const poolId = "test_pool_001";

  before(async () => {
    // Generate keypairs
    authority = Keypair.generate();
    user = Keypair.generate();

    // Airdrop SOL to authority and user
    await provider.connection.requestAirdrop(
      authority.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );

    // Wait for airdrops to confirm
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create USDC mint (simulating USDC for testing)
    usdcMint = await createMint(
      provider.connection,
      authority,
      authority.publicKey,
      null,
      6 // USDC has 6 decimals
    );

    // Create token accounts
    userTokenAccount = await createAccount(
      provider.connection,
      user,
      usdcMint,
      user.publicKey
    );

    // Mint 1000 USDC to user
    await mintTo(
      provider.connection,
      authority,
      usdcMint,
      userTokenAccount,
      authority,
      1000_000000 // 1000 USDC
    );

    // Derive PDAs
    [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow")],
      program.programId
    );

    [poolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), Buffer.from(poolId)],
      program.programId
    );

    // Create pool token account
    poolTokenAccount = await createAccount(
      provider.connection,
      authority,
      usdcMint,
      poolPda,
      undefined
    );
  });

  it("Initializes the escrow system", async () => {
    const tx = await program.methods
      .initialize(authority.publicKey)
      .accounts({
        escrow: escrowPda,
        payer: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    console.log("Initialize transaction signature:", tx);

    // Fetch the escrow account
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);

    assert.equal(
      escrowAccount.authority.toString(),
      authority.publicKey.toString(),
      "Authority should match"
    );
    assert.equal(escrowAccount.totalPools.toNumber(), 0, "Should start with 0 pools");
    assert.equal(
      escrowAccount.totalValueLocked.toNumber(),
      0,
      "Should start with 0 TVL"
    );
    assert.equal(escrowAccount.paused, false, "Should not be paused");
  });

  it("Creates a new escrow pool", async () => {
    const tx = await program.methods
      .createPool(poolId, { boost: {} }, null)
      .accounts({
        escrow: escrowPda,
        pool: poolPda,
        payer: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    console.log("Create pool transaction signature:", tx);

    // Fetch the pool account
    const poolAccount = await program.account.pool.fetch(poolPda);

    assert.equal(poolAccount.poolId, poolId, "Pool ID should match");
    assert.deepEqual(poolAccount.poolType, { boost: {} }, "Pool type should be Boost");
    assert.equal(poolAccount.balance.toNumber(), 0, "Balance should start at 0");
    assert.deepEqual(poolAccount.status, { active: {} }, "Pool should be active");

    // Check escrow updated
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    assert.equal(escrowAccount.totalPools.toNumber(), 1, "Should have 1 pool");
  });

  it("Deposits USDC into the pool", async () => {
    const depositAmount = new anchor.BN(100_000000); // 100 USDC

    // Update pool account with token account
    await program.methods
      .updatePoolTokenAccount()
      .accounts({
        pool: poolPda,
        poolTokenAccount: poolTokenAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        escrow: escrowPda,
        pool: poolPda,
        user: user.publicKey,
        userTokenAccount: userTokenAccount,
        poolTokenAccount: poolTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log("Deposit transaction signature:", tx);

    // Fetch updated pool account
    const poolAccount = await program.account.pool.fetch(poolPda);

    assert.equal(
      poolAccount.balance.toNumber(),
      depositAmount.toNumber(),
      "Pool balance should match deposit"
    );
    assert.equal(
      poolAccount.totalDeposited.toNumber(),
      depositAmount.toNumber(),
      "Total deposited should match"
    );

    // Check escrow TVL updated
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    assert.equal(
      escrowAccount.totalValueLocked.toNumber(),
      depositAmount.toNumber(),
      "TVL should match deposit"
    );
  });

  it("Withdraws USDC from the pool", async () => {
    const withdrawAmount = new anchor.BN(50_000000); // 50 USDC

    // Create recipient token account
    const recipientTokenAccount = await createAccount(
      provider.connection,
      authority,
      usdcMint,
      authority.publicKey
    );

    const tx = await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        escrow: escrowPda,
        pool: poolPda,
        authority: authority.publicKey,
        poolTokenAccount: poolTokenAccount,
        recipientTokenAccount: recipientTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([authority])
      .rpc();

    console.log("Withdraw transaction signature:", tx);

    // Fetch updated pool account
    const poolAccount = await program.account.pool.fetch(poolPda);

    assert.equal(
      poolAccount.balance.toNumber(),
      50_000000,
      "Pool balance should be 50 USDC after withdrawal"
    );
    assert.equal(
      poolAccount.totalWithdrawn.toNumber(),
      withdrawAmount.toNumber(),
      "Total withdrawn should match"
    );

    // Check escrow TVL updated
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    assert.equal(
      escrowAccount.totalValueLocked.toNumber(),
      50_000000,
      "TVL should reflect withdrawal"
    );
  });

  it("Prevents withdrawal of more than balance", async () => {
    const withdrawAmount = new anchor.BN(100_000000); // 100 USDC (more than balance)

    const recipientTokenAccount = await createAccount(
      provider.connection,
      authority,
      usdcMint,
      authority.publicKey
    );

    try {
      await program.methods
        .withdraw(withdrawAmount)
        .accounts({
          escrow: escrowPda,
          pool: poolPda,
          authority: authority.publicKey,
          poolTokenAccount: poolTokenAccount,
          recipientTokenAccount: recipientTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([authority])
        .rpc();

      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(
        error.toString(),
        "InsufficientBalance",
        "Should throw InsufficientBalance error"
      );
    }
  });

  it("Pauses and unpauses the escrow system", async () => {
    // Pause
    await program.methods
      .pause()
      .accounts({
        escrow: escrowPda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    let escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    assert.equal(escrowAccount.paused, true, "Should be paused");

    // Try to deposit while paused (should fail)
    try {
      await program.methods
        .deposit(new anchor.BN(10_000000))
        .accounts({
          escrow: escrowPda,
          pool: poolPda,
          user: user.publicKey,
          userTokenAccount: userTokenAccount,
          poolTokenAccount: poolTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();

      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.toString(), "SystemPaused", "Should throw SystemPaused error");
    }

    // Unpause
    await program.methods
      .unpause()
      .accounts({
        escrow: escrowPda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    assert.equal(escrowAccount.paused, false, "Should be unpaused");
  });

  it("Creates multiple pools for different use cases", async () => {
    const campaignPoolId = "campaign_12345";
    const questPoolId = "quest_67890";

    const [campaignPoolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), Buffer.from(campaignPoolId)],
      program.programId
    );

    const [questPoolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), Buffer.from(questPoolId)],
      program.programId
    );

    // Create campaign pool
    await program.methods
      .createPool(campaignPoolId, { campaign: {} }, "12345")
      .accounts({
        escrow: escrowPda,
        pool: campaignPoolPda,
        payer: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    // Create quest pool
    await program.methods
      .createPool(questPoolId, { quest: {} }, "67890")
      .accounts({
        escrow: escrowPda,
        pool: questPoolPda,
        payer: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    // Verify pools created
    const campaignPool = await program.account.pool.fetch(campaignPoolPda);
    const questPool = await program.account.pool.fetch(questPoolPda);

    assert.equal(campaignPool.poolId, campaignPoolId);
    assert.deepEqual(campaignPool.poolType, { campaign: {} });
    assert.equal(campaignPool.ownerId, "12345");

    assert.equal(questPool.poolId, questPoolId);
    assert.deepEqual(questPool.poolType, { quest: {} });
    assert.equal(questPool.ownerId, "67890");

    // Check total pools
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    assert.equal(escrowAccount.totalPools.toNumber(), 3, "Should have 3 pools total");
  });
});
