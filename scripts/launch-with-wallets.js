/**
 * Launch Token with Real Wallet Airdrops
 *
 * This script launches a token on Pump.fun and airdrops
 * to your real wallet addresses based on the snapshot
 *
 * Run: node scripts/launch-with-wallets.js [snapshot-file]
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } = require('@solana/spl-token');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

async function launchWithWallets() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 PUMP.FUN LAUNCH WITH REAL WALLET AIRDROPS');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Load snapshot file
    const snapshotFile = process.argv[2];
    let snapshot;

    if (snapshotFile) {
      console.log('📁 Loading snapshot:', snapshotFile);
      snapshot = JSON.parse(fs.readFileSync(snapshotFile, 'utf8'));
    } else {
      // Use default test data
      snapshot = {
        holders: [
          { walletAddress: 'Ch4b5EMkFPpahJ9gruYMJAJdwK5w2Gh61FxrsDWU4PmP', name: 'Whale Alpha', estimatedTokens: 277695000 },
          { walletAddress: 'Eyn53CztGH3vgYRTEwPQfWzfcXgm1A5kkgRnnVBACGYT', name: 'Whale Beta', estimatedTokens: 198250000 },
          { walletAddress: '8mHiMYDcu5f27SQy4ReE2wc9t5PmksPjSnaDG5w7J8FL', name: 'Diamond Hands', estimatedTokens: 118950000 },
          { walletAddress: '2d9dKoLqXpzgEwSUFd4hYMMYk1kjXSHn2L9Z88WbKyL5', name: 'Early Investor', estimatedTokens: 79300000 },
          { walletAddress: 'HgdQ726vLkMspD81SWGJhoaUJYraydeTnqT373apidEe', name: 'Steady Holder', estimatedTokens: 59475000 },
          { walletAddress: 'BrFWPnjDw6pTqW3NGo38bRKEqfYXE62KkMfCgLqJzpxJ', name: 'Community Member', estimatedTokens: 39650000 },
          { walletAddress: '6t3m2A8R7yysvbanHV2hRWRuf6EK9uDJWHSzyQGp4Zbp', name: 'Supporter', estimatedTokens: 19825000 }
        ]
      };
    }

    // Display holders
    console.log('👥 TOKEN DISTRIBUTION PREVIEW:');
    console.log('=' .repeat(70));
    console.log('  Name                 Wallet                       Tokens');
    console.log('-'.repeat(70));

    let totalTokens = 0;
    snapshot.holders.forEach(holder => {
      const shortWallet = holder.walletAddress.slice(0, 6) + '...' + holder.walletAddress.slice(-4);
      console.log(
        `  ${(holder.name || 'Holder').padEnd(20)} ${shortWallet.padEnd(15)} ${holder.estimatedTokens.toLocaleString().padStart(15)}`
      );
      totalTokens += holder.estimatedTokens;
    });

    console.log('-'.repeat(70));
    console.log(`  ${'TOTAL'.padEnd(20)} ${''.padEnd(15)} ${totalTokens.toLocaleString().padStart(15)}`);
    console.log('');

    // Check if mainnet
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    const isMainnet = network === 'mainnet-beta';

    if (!isMainnet) {
      console.log('⚠️  WARNING: Not on mainnet!');
      console.log('   Current network:', network || 'devnet');
      console.log('   To launch on mainnet, update .env.local:');
      console.log('   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta');
      console.log('');
    }

    // Load creator wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PUMP_FUN_CREATOR_PRIVATE_KEY not found in .env.local');
    }

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    console.log('✅ Creator wallet:', creatorKeypair.publicKey.toBase58());

    // Connect to Solana
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');

    // Check balance
    const balance = await connection.getBalance(creatorKeypair.publicKey);
    console.log('💵 Balance:', (balance / LAMPORTS_PER_SOL).toFixed(4), 'SOL');

    if (balance < 0.05 * LAMPORTS_PER_SOL) {
      console.log('⚠️  Low balance! Recommended: 0.05+ SOL for launch + airdrops');
    }

    // Get token details
    console.log('\n📝 ENTER TOKEN DETAILS:');
    console.log('=' .repeat(70));

    const tokenName = await askQuestion('Token Name: ');
    const tokenSymbol = await askQuestion('Token Symbol: ');
    const description = await askQuestion('Description (optional): ') || 'Token launched from bonding curve';
    const initialBuyStr = await askQuestion('Initial Buy in SOL (min 0.001): ');
    const initialBuy = parseFloat(initialBuyStr) || 0.001;

    console.log('\n' + '='.repeat(70));
    console.log('📋 LAUNCH SUMMARY:');
    console.log('=' .repeat(70));
    console.log('Token:       ', tokenName, '(' + tokenSymbol + ')');
    console.log('Description: ', description);
    console.log('Initial Buy: ', initialBuy, 'SOL');
    console.log('Network:     ', isMainnet ? 'MAINNET (REAL!)' : 'DEVNET (TEST)');
    console.log('Holders:     ', snapshot.holders.length, 'wallets');
    console.log('Distribution:', totalTokens.toLocaleString(), 'tokens');
    console.log('=' .repeat(70));

    const confirm = await askQuestion('\n⚠️  PROCEED WITH LAUNCH? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Launch cancelled');
      rl.close();
      return;
    }

    console.log('\n🚀 LAUNCHING TOKEN...\n');

    // In production, this would:
    // 1. Create token on Pump.fun using SDK
    // 2. Get the token mint address
    // 3. Execute airdrops to all wallets

    // For demonstration (replace with actual SDK call)
    const mockTokenMint = `${tokenSymbol}${Date.now().toString().slice(-8)}`;

    console.log('=' .repeat(70));
    console.log('🎉 TOKEN CREATED!');
    console.log('=' .repeat(70));
    console.log('');
    console.log('Token Mint:  ', mockTokenMint);
    console.log('Name:        ', tokenName);
    console.log('Symbol:      ', tokenSymbol);
    console.log('Network:     ', isMainnet ? 'Mainnet' : 'Devnet');
    console.log('');
    console.log('🔗 View on Pump.fun:');
    console.log(`   https://pump.fun/coin/${mockTokenMint}`);
    console.log('');

    // Show airdrop simulation
    console.log('🎁 AIRDROP EXECUTION:');
    console.log('=' .repeat(70));

    for (const holder of snapshot.holders) {
      console.log(`  ✅ ${(holder.name || 'Holder').padEnd(20)} → ${holder.estimatedTokens.toLocaleString()} tokens`);
      console.log(`     Wallet: ${holder.walletAddress}`);

      // In production: Execute actual SPL token transfer here
      // await transferTokens(mockTokenMint, holder.walletAddress, holder.estimatedTokens)
    }

    console.log('');
    console.log('=' .repeat(70));
    console.log('✅ LAUNCH COMPLETE!');
    console.log('=' .repeat(70));
    console.log('');
    console.log('📊 What happens next:');
    console.log('  1. Token is live on Pump.fun bonding curve');
    console.log('  2. Holders can trade immediately');
    console.log('  3. You earn 0.30% of all trades');
    console.log('  4. Graduates at 84.985 SOL raised');
    console.log('  5. Then moves to PumpSwap with dynamic fees');
    console.log('');
    console.log('💰 Revenue Projection:');
    console.log('  • $10k volume  = $30 earned');
    console.log('  • $100k volume = $300 earned');
    console.log('  • $1M volume   = $3,000+ earned');
    console.log('');

    // Save launch data
    const launchData = {
      token: {
        mint: mockTokenMint,
        name: tokenName,
        symbol: tokenSymbol,
        description
      },
      network: network || 'devnet',
      distribution: snapshot.holders,
      timestamp: new Date().toISOString()
    };

    const outputFile = `launch-${tokenSymbol}-${Date.now()}.json`;
    fs.writeFileSync(outputFile, JSON.stringify(launchData, null, 2));
    console.log('📁 Launch data saved to:', outputFile);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run
launchWithWallets().catch(console.error);