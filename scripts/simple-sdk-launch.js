/**
 * SIMPLIFIED PUMP.FUN LAUNCH
 *
 * This uses manual metadata creation (no image upload complexity)
 * Then the official pumpdotfun-sdk for creating the token
 * This avoids both PumpPortal API issues AND image upload complexity
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } = require('@solana/spl-token');
const { AnchorProvider, Wallet, Program } = require('@coral-xyz/anchor');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');

// Import the Pump.fun IDL and SDK components
const { IDL } = require('pumpdotfun-sdk/dist/esm/IDL');
const { sendTx, calculateWithSlippageBuy, DEFAULT_COMMITMENT, DEFAULT_FINALITY } = require('pumpdotfun-sdk/dist/esm/util');
const { BN } = require('bn.js');

// Configuration
const TOKEN_CONFIG = {
  name: 'Pixel Knight V4',
  symbol: 'KNT4',
  description: 'A legendary pixel warrior on Solana',
  initialBuySOL: 0.02
};

const KEY_HOLDERS = [
  { address: 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP', name: 'Whale Alpha', keys: 350 },
  { address: 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT', name: 'Whale Beta', keys: 250 },
  { address: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL', name: 'Diamond Hands', keys: 150 },
  { address: '2d9dKoLqXpzgEwSUFd4hYMMYk1kjXSHn2L9Z88WbKyL5', name: 'Early Investor', keys: 100 },
  { address: 'HgdQ726vLkMspD81SWGJhoaUJYraydeTnqT373apidEe', name: 'Steady Holder', keys: 75 },
  { address: 'BrFWPnjDw6pTqW3NGo38bRKEqfYXE62KkMfCgLqJzpxJ', name: 'Community Member', keys: 50 },
  { address: '6t3m2A8R7yysvbanHV2hRWRuf6EK9uDJWHSzyQGp4Zbp', name: 'Supporter', keys: 25 }
];

const TOTAL_KEYS = KEY_HOLDERS.reduce((sum, h) => sum + h.keys, 0);

const PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
const MPL_TOKEN_METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const GLOBAL_ACCOUNT_SEED = "global";
const BONDING_CURVE_SEED = "bonding-curve";
const METADATA_SEED = "metadata";

async function simpleLaunch() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 SIMPLIFIED PUMP.FUN SDK LAUNCH');
  console.log('='.repeat(70));
  console.log('');
  console.log('Token:', TOKEN_CONFIG.name, `(${TOKEN_CONFIG.symbol})`);
  console.log('');

  try {
    // Setup wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('No wallet configured!');

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const creatorAddress = creatorKeypair.publicKey.toBase58();

    // Setup connection
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const solBalance = (await connection.getBalance(creatorKeypair.publicKey)) / LAMPORTS_PER_SOL;

    console.log('📍 Creator:', creatorAddress);
    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');
    console.log('');

    if (solBalance < TOKEN_CONFIG.initialBuySOL + 0.05) {
      throw new Error(`Insufficient balance! Need at least ${TOKEN_CONFIG.initialBuySOL + 0.05} SOL`);
    }

    // Setup Anchor provider and program
    console.log('STEP 1: Initialize Program');
    console.log('='.repeat(70));

    const wallet = new Wallet(creatorKeypair);
    const provider = new AnchorProvider(connection, wallet, { commitment: 'finalized' });
    const program = new Program(IDL, provider);

    console.log('✅ Program initialized');
    console.log('');

    // Create simple metadata URI (no image upload)
    console.log('STEP 2: Create Metadata');
    console.log('='.repeat(70));

    const metadata = {
      name: TOKEN_CONFIG.name,
      symbol: TOKEN_CONFIG.symbol,
      description: TOKEN_CONFIG.description,
      image: 'https://arweave.net/placeholder',
      showName: true,
      createdOn: "https://pump.fun"
    };

    const metadataJson = JSON.stringify(metadata);
    const metadataUri = `data:application/json;base64,${Buffer.from(metadataJson).toString('base64')}`;

    console.log('✅ Metadata URI created');
    console.log('');

    // Create token
    console.log('STEP 3: Create Token Transaction');
    console.log('='.repeat(70));

    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey;

    console.log('🔑 Mint:', tokenMint.toBase58());
    console.log('');

    // Build create transaction using SDK methods
    const mplTokenMetadata = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);
    const [metadataPDA] = PublicKey.findProgramAddressSync([
      Buffer.from(METADATA_SEED),
      mplTokenMetadata.toBuffer(),
      tokenMint.toBuffer(),
    ], mplTokenMetadata);

    const [bondingCurvePDA] = PublicKey.findProgramAddressSync([
      Buffer.from(BONDING_CURVE_SEED),
      tokenMint.toBuffer()
    ], program.programId);

    const associatedBondingCurve = await getAssociatedTokenAddress(
      tokenMint,
      bondingCurvePDA,
      true
    );

    console.log('📡 Building create instruction...');

    const createTx = await program.methods
      .create(TOKEN_CONFIG.name, TOKEN_CONFIG.symbol, metadataUri, creatorKeypair.publicKey)
      .accounts({
        mint: tokenMint,
        associatedBondingCurve: associatedBondingCurve,
        metadata: metadataPDA,
        user: creatorKeypair.publicKey,
      })
      .signers([mintKeypair])
      .transaction();

    // Add buy instruction if initial buy > 0
    let finalTx = new Transaction().add(createTx);

    if (TOKEN_CONFIG.initialBuySOL > 0) {
      console.log('📡 Adding initial buy instruction...');

      // Get global account for fee recipient
      const [globalAccountPDA] = PublicKey.findProgramAddressSync([
        Buffer.from(GLOBAL_ACCOUNT_SEED)
      ], new PublicKey(PROGRAM_ID));

      const globalAccountInfo = await connection.getAccountInfo(globalAccountPDA);
      // Parse fee recipient from global account (first 32 bytes after 8-byte discriminator)
      const feeRecipient = new PublicKey(globalAccountInfo.data.slice(8, 40));

      const buyAmountSOL = BigInt(Math.floor(TOKEN_CONFIG.initialBuySOL * LAMPORTS_PER_SOL));

      // Initial buy price calculation (from global account initialization)
      const INITIAL_VIRTUAL_TOKEN_RESERVES = BigInt("1073000000000000"); // 1.073B tokens
      const INITIAL_VIRTUAL_SOL_RESERVES = BigInt("30000000000"); // 30 SOL
      const INITIAL_REAL_TOKEN_RESERVES = BigInt("793100000000000"); // 793.1M tokens

      const buyAmount = (buyAmountSOL * INITIAL_VIRTUAL_TOKEN_RESERVES) / INITIAL_VIRTUAL_SOL_RESERVES;
      const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSOL, BigInt(2500)); // 25% slippage

      const associatedUser = await getAssociatedTokenAddress(tokenMint, creatorKeypair.publicKey, false);

      // Create associated token account for user
      finalTx.add(createAssociatedTokenAccountInstruction(
        creatorKeypair.publicKey,
        associatedUser,
        creatorKeypair.publicKey,
        tokenMint
      ));

      // Add buy instruction
      finalTx.add(await program.methods
        .buy(new BN(buyAmount.toString()), new BN(buyAmountWithSlippage.toString()))
        .accounts({
          feeRecipient: feeRecipient,
          mint: tokenMint,
          associatedBondingCurve: associatedBondingCurve,
          associatedUser: associatedUser,
          user: creatorKeypair.publicKey,
        })
        .transaction());
    }

    console.log('✅ Transaction built');
    console.log('');

    // Send transaction using SDK utility
    console.log('📤 Sending transaction...');
    const result = await sendTx(
      connection,
      finalTx,
      creatorKeypair.publicKey,
      [creatorKeypair, mintKeypair],
      { unitLimit: 250000, unitPrice: 250000 },
      DEFAULT_COMMITMENT,
      DEFAULT_FINALITY
    );

    if (!result.success) {
      console.error('❌ Transaction failed!');
      console.error('   Error:', result.error);
      throw new Error('Transaction failed: ' + JSON.stringify(result.error));
    }

    console.log('✅ TOKEN SUCCESSFULLY CREATED!');
    console.log('   Signature:', result.signature);
    console.log(`   View: https://solscan.io/tx/${result.signature}`);
    console.log('');

    // Wait for token account and distribute
    console.log('STEP 4: Distribute Tokens');
    console.log('='.repeat(70));

    const creatorTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      creatorKeypair.publicKey
    );

    console.log('⏳ Waiting for token account...');

    let tokenBalance = 0;
    let attempts = 0;

    while (tokenBalance === 0 && attempts < 30) {
      attempts++;
      try {
        const accountInfo = await getAccount(connection, creatorTokenAccount);
        tokenBalance = Number(accountInfo.amount);
        if (tokenBalance > 0) {
          console.log(`✅ Balance: ${tokenBalance}`);
          break;
        }
      } catch (e) {}
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (tokenBalance === 0) {
      console.log('⚠️  Distribution skipped - run manually later');
      return;
    }

    console.log('');

    const decimals = 6;
    const distributions = KEY_HOLDERS.map(holder => {
      const percentage = holder.keys / TOTAL_KEYS;
      const amount = Math.floor(tokenBalance * percentage);
      return {
        ...holder,
        percentage: (percentage * 100).toFixed(1),
        amount,
        amountUI: amount / Math.pow(10, decimals)
      };
    });

    distributions.forEach(d => {
      console.log(`  ${d.name.padEnd(20)} ${d.percentage.padStart(5)}% → ${d.amountUI.toLocaleString().padStart(12)} ${TOKEN_CONFIG.symbol}`);
    });

    console.log('');
    console.log('📤 Distributing...');
    console.log('');

    let successCount = 0;

    for (const dist of distributions) {
      try {
        const recipientPubkey = new PublicKey(dist.address);
        const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, recipientPubkey);

        let needsAccountCreation = false;
        try {
          await getAccount(connection, recipientTokenAccount);
        } catch (e) {
          needsAccountCreation = true;
        }

        const distributionTx = new Transaction();

        if (needsAccountCreation) {
          distributionTx.add(createAssociatedTokenAccountInstruction(
            creatorKeypair.publicKey,
            recipientTokenAccount,
            recipientPubkey,
            tokenMint
          ));
        }

        distributionTx.add(createTransferInstruction(
          creatorTokenAccount,
          recipientTokenAccount,
          creatorKeypair.publicKey,
          dist.amount
        ));

        const distSignature = await connection.sendTransaction(distributionTx, [creatorKeypair]);
        console.log(`   ✅ ${dist.name}`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ ${dist.name}: ${error.message}`);
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 LAUNCH COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Results:');
    console.log('  Token:          ', tokenMint.toBase58());
    console.log('  Distributions:  ', successCount, '/', KEY_HOLDERS.length);
    console.log('');
    console.log('🔗 Links:');
    console.log(`  https://pump.fun/coin/${tokenMint.toBase58()}`);
    console.log(`  https://solscan.io/token/${tokenMint.toBase58()}`);
    console.log('');

    // Save data
    fs.writeFileSync(`SDK-LAUNCH-${TOKEN_CONFIG.symbol}-${Date.now()}.json`, JSON.stringify({
      success: true,
      tokenMint: tokenMint.toBase58(),
      signature: result.signature,
      ...TOKEN_CONFIG,
      distributions: distributions.map(d => ({
        name: d.name,
        address: d.address,
        percentage: d.percentage,
        amount: d.amountUI
      })),
      timestamp: new Date().toISOString()
    }, null, 2));

  } catch (error) {
    console.error('\n❌ LAUNCH FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
}

console.log('🚨 LAUNCHING IN 5 SECONDS...');
console.log('   Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  simpleLaunch().catch(console.error);
}, 5000);
