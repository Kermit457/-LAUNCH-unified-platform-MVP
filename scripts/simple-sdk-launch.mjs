/**
 * SIMPLIFIED PUMP.FUN LAUNCH (ESM)
 *
 * This uses manual metadata creation (no image upload complexity)
 * Then the official pumpdotfun-sdk for creating the token
 * This avoids both PumpPortal API issues AND image upload complexity
 */

import 'dotenv/config';
import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, PublicKey, TransactionInstruction, ComputeBudgetProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } from '@solana/spl-token';
import { AnchorProvider, Wallet, Program } from '@coral-xyz/anchor';
import bs58 from 'bs58';
import fs from 'fs';
import { PumpFunSDK } from 'pumpdotfun-sdk';
import BN from 'bn.js';

// Read env
const envPath = new URL('../.env.local', import.meta.url);
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim();
  }
});

// Configuration
const TOKEN_CONFIG = {
  name: 'Pixel Knight V4',
  symbol: 'KNT4',
  description: 'A legendary pixel warrior on Solana',
  initialBuySOL: 0 // Set to 0 to skip initial buy for now
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

async function simpleLaunch() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 SIMPLIFIED PUMP.FUN SDK LAUNCH');
  console.log('='.repeat(70));
  console.log('');
  console.log('Token:', TOKEN_CONFIG.name, `(${TOKEN_CONFIG.symbol})`);
  console.log('');

  try {
    // Setup wallet
    const privateKey = env.PUMP_FUN_CREATOR_PRIVATE_KEY;
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

    // Setup SDK
    console.log('STEP 1: Initialize SDK');
    console.log('='.repeat(70));

    const wallet = new Wallet(creatorKeypair);
    const provider = new AnchorProvider(connection, wallet, { commitment: 'finalized' });
    const sdk = new PumpFunSDK(provider);

    console.log('✅ SDK initialized');
    console.log('');

    // Create token
    console.log('STEP 2: Build Create Transaction');
    console.log('='.repeat(70));

    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey;

    console.log('🔑 Mint:', tokenMint.toBase58());
    console.log('');

    // Create simple metadata URI
    // We need to use a real short URL, not a data URI (data URIs are too long)
    // Use a placeholder - in production you'd upload metadata to IPFS/Arweave first
    const metadataUri = 'https://cf-ipfs.com/ipfs/QmW6V4ZhFdCqf8yVWyBUKRzkQogqZz9bCFvTqKGESgNMK4';

    console.log('📡 Building create instruction...');

    // Use SDK's getCreateInstructions
    const createTx = await sdk.getCreateInstructions(
      creatorKeypair.publicKey,
      TOKEN_CONFIG.name,
      TOKEN_CONFIG.symbol,
      metadataUri,
      mintKeypair
    );

    let finalTx = new Transaction().add(createTx);

    // Add buy if needed
    if (TOKEN_CONFIG.initialBuySOL > 0) {
      console.log('📡 Adding buy instruction...');

      const buyAmountSOL = BigInt(Math.floor(TOKEN_CONFIG.initialBuySOL * LAMPORTS_PER_SOL));
      const slippageBasisPoints = BigInt(2500); // 25%

      // Get the global account to calculate initial buy
      const globalAccount = await sdk.getGlobalAccount('confirmed');
      const buyAmount = globalAccount.getInitialBuyPrice(buyAmountSOL);

      // Calculate with slippage
      const buyAmountWithSlippage = buyAmountSOL + (buyAmountSOL * slippageBasisPoints / BigInt(10000));

      const buyTx = await sdk.getBuyInstructions(
        creatorKeypair.publicKey,
        tokenMint,
        globalAccount.feeRecipient,
        buyAmount,
        buyAmountWithSlippage,
        'confirmed'
      );

      finalTx.add(buyTx);
    }

    console.log('✅ Transaction built');
    console.log('');

    // Send with priority fees
    console.log('📤 Sending transaction...');

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    finalTx.recentBlockhash = blockhash;
    finalTx.feePayer = creatorKeypair.publicKey;

    // Add compute budget instructions for priority fees (using proper SDK)
    const computeUnitLimit = ComputeBudgetProgram.setComputeUnitLimit({ units: 250000 });
    const computeUnitPrice = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 250000 });

    finalTx.instructions.unshift(computeUnitPrice);
    finalTx.instructions.unshift(computeUnitLimit);

    finalTx.sign(creatorKeypair, mintKeypair);

    const signature = await connection.sendRawTransaction(finalTx.serialize(), {
      skipPreflight: false,
      maxRetries: 3,
      preflightCommitment: 'confirmed'
    });

    console.log('✅ TX Sent:', signature);
    console.log(`   View: https://solscan.io/tx/${signature}`);
    console.log('');

    // Wait for confirmation
    console.log('⏳ Waiting for confirmation...');
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    }, 'confirmed');

    if (confirmation.value.err) {
      throw new Error('Transaction failed: ' + JSON.stringify(confirmation.value.err));
    }

    console.log('✅ TOKEN SUCCESSFULLY CREATED!');
    console.log('');

    // Wait for token account and distribute
    console.log('STEP 3: Distribute Tokens');
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
      signature,
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
