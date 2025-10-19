#!/usr/bin/env node

/**
 * Solana Devnet Airdrop Script
 *
 * Usage:
 *   node scripts/airdrop-devnet-sol.js <wallet-address> [amount]
 *
 * Examples:
 *   node scripts/airdrop-devnet-sol.js 9b7peEZzAf3QUCgc2cYdVDETJV3DDqmGmv1MswAMX7x1
 *   node scripts/airdrop-devnet-sol.js 9b7peEZzAf3QUCgc2cYdVDETJV3DDqmGmv1MswAMX7x1 2
 */

const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

// Devnet RPC endpoint
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

async function airdropSOL(walletAddress, amount = 1) {
  try {
    console.log(`\n💧 Requesting ${amount} SOL airdrop on devnet...`);
    console.log(`📍 Wallet: ${walletAddress}\n`);

    const publicKey = new PublicKey(walletAddress);

    // Check balance before
    const balanceBefore = await connection.getBalance(publicKey);
    console.log(`💰 Current balance: ${balanceBefore / LAMPORTS_PER_SOL} SOL`);

    // Request airdrop
    console.log(`⏳ Requesting airdrop...`);
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );

    // Wait for confirmation
    console.log(`⏳ Confirming transaction: ${signature}`);
    await connection.confirmTransaction(signature, 'confirmed');

    // Check balance after
    const balanceAfter = await connection.getBalance(publicKey);
    console.log(`\n✅ Airdrop successful!`);
    console.log(`💰 New balance: ${balanceAfter / LAMPORTS_PER_SOL} SOL`);
    console.log(`📈 Received: ${(balanceAfter - balanceBefore) / LAMPORTS_PER_SOL} SOL\n`);
    console.log(`🔍 View on Solana Explorer:`);
    console.log(`   https://explorer.solana.com/tx/${signature}?cluster=devnet\n`);

  } catch (error) {
    console.error('\n❌ Airdrop failed:', error.message);

    if (error.message.includes('airdrop')) {
      console.log('\n💡 Tips:');
      console.log('   - Devnet airdrops are rate limited');
      console.log('   - Try again in a few minutes');
      console.log('   - Or use: https://faucet.solana.com/');
    }

    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('\n❌ Error: Wallet address required\n');
  console.log('Usage:');
  console.log('  node scripts/airdrop-devnet-sol.js <wallet-address> [amount]\n');
  console.log('Examples:');
  console.log('  node scripts/airdrop-devnet-sol.js 9b7peEZzAf3QUCgc2cYdVDETJV3DDqmGmv1MswAMX7x1');
  console.log('  node scripts/airdrop-devnet-sol.js 9b7peEZzAf3QUCgc2cYdVDETJV3DDqmGmv1MswAMX7x1 2\n');
  process.exit(1);
}

const walletAddress = args[0];
const amount = args[1] ? parseFloat(args[1]) : 1;

// Validate amount
if (isNaN(amount) || amount <= 0 || amount > 5) {
  console.log('\n❌ Error: Amount must be between 0 and 5 SOL\n');
  process.exit(1);
}

// Run airdrop
airdropSOL(walletAddress, amount);
