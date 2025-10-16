/**
 * Request SOL airdrop for your wallet
 * Run: node scripts/airdrop-sol.js [amount]
 * Example: node scripts/airdrop-sol.js 2
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');

async function requestAirdrop(amountInSol = 2) {
  console.log('💧 Requesting devnet SOL airdrop...\n');

  // Get wallet from env or use the one you generated
  const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
  let publicKey;

  if (privateKey && privateKey !== 'YOUR_PRIVATE_KEY_HERE') {
    try {
      const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      publicKey = keypair.publicKey;
    } catch (e) {
      console.log('Using hardcoded wallet address...');
      publicKey = new PublicKey('HVwuLVu7nmqoBr9R9RPDTer8X7oQTp6kDTcBWy32evW7');
    }
  } else {
    // Use your generated wallet address
    publicKey = new PublicKey('HVwuLVu7nmqoBr9R9RPDTer8X7oQTp6kDTcBWy32evW7');
  }

  console.log('🔑 Wallet:', publicKey.toBase58());
  console.log('💰 Requesting:', amountInSol, 'SOL');

  try {
    // Connect to devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    // Check current balance
    const balanceBefore = await connection.getBalance(publicKey);
    console.log('📊 Current balance:', balanceBefore / LAMPORTS_PER_SOL, 'SOL');

    // Request airdrop
    console.log('\n⏳ Requesting airdrop...');
    const signature = await connection.requestAirdrop(
      publicKey,
      amountInSol * LAMPORTS_PER_SOL
    );

    console.log('📝 Transaction signature:', signature);

    // Wait for confirmation
    console.log('⏳ Waiting for confirmation...');
    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });

    // Check new balance
    const balanceAfter = await connection.getBalance(publicKey);
    console.log('\n✅ Airdrop successful!');
    console.log('💵 New balance:', balanceAfter / LAMPORTS_PER_SOL, 'SOL');
    console.log('➕ Received:', (balanceAfter - balanceBefore) / LAMPORTS_PER_SOL, 'SOL');

    // View on explorer
    console.log('\n🔗 View transaction:');
    console.log(`   https://explorer.solana.com/tx/${signature}?cluster=devnet`);

  } catch (error) {
    console.error('\n❌ Airdrop failed:', error.message);

    if (error.message.includes('429') || error.message.includes('rate')) {
      console.log('\n⚠️  Rate limited! Try again in a few seconds.');
      console.log('💡 Alternative: Use the web faucet at https://faucet.solana.com/');
    } else if (error.message.includes('airdrop request limit')) {
      console.log('\n⚠️  Daily airdrop limit reached for this wallet.');
      console.log('💡 Try tomorrow or use a different wallet.');
    }
  }
}

// Get amount from command line or default to 2 SOL
const amount = parseFloat(process.argv[2]) || 2;

requestAirdrop(amount).catch(console.error);