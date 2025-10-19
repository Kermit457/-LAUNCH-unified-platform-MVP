/**
 * Distribute KNIGHT tokens to key holders
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, PublicKey, Transaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } = require('@solana/spl-token');
const bs58 = require('bs58').default || require('bs58');

const TOKEN_MINT = 'EGmBmFc4LUpQSMidCMyaks2X5p6Ch4QZGdr7FcpuAXbk'; // KNIGHT token

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

async function distributeKnight() {
  console.log('\n🎯 DISTRIBUTING KNIGHT TOKENS\n');
  console.log('Token:', TOKEN_MINT);
  console.log('');

  try {
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

    const mintPubkey = new PublicKey(TOKEN_MINT);
    const creatorTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      creatorKeypair.publicKey
    );

    console.log('📊 Checking balance...');

    const tokenAccountInfo = await getAccount(connection, creatorTokenAccount);
    const tokenBalance = Number(tokenAccountInfo.amount);
    const decimals = 6;
    const balanceUI = tokenBalance / Math.pow(10, decimals);

    console.log('   Balance:', balanceUI.toLocaleString(), 'KNIGHT');
    console.log('');

    if (tokenBalance === 0) {
      console.log('❌ No tokens to distribute!');
      return;
    }

    // Calculate distribution
    console.log('💰 Distribution:');
    const distributions = KEY_HOLDERS.map(holder => {
      const percentage = holder.keys / TOTAL_KEYS;
      const amount = Math.floor(tokenBalance * percentage);
      const amountUI = amount / Math.pow(10, decimals);
      return { ...holder, percentage: (percentage * 100).toFixed(1), amount, amountUI };
    });

    distributions.forEach(d => {
      console.log(`  ${d.name.padEnd(20)} ${d.percentage.padStart(5)}% → ${d.amountUI.toLocaleString().padStart(15)} KNIGHT`);
    });

    console.log('');
    console.log('⏱️  Starting in 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('');

    let successCount = 0;

    for (const dist of distributions) {
      try {
        console.log(`📤 ${dist.name}...`);

        const recipientPubkey = new PublicKey(dist.address);
        const recipientTokenAccount = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

        let needsAccountCreation = false;
        try {
          await getAccount(connection, recipientTokenAccount);
        } catch (e) {
          needsAccountCreation = true;
        }

        const distributionTx = new Transaction();

        if (needsAccountCreation) {
          distributionTx.add(createAssociatedTokenAccountInstruction(
            creatorKeypair.publicKey, recipientTokenAccount, recipientPubkey, mintPubkey
          ));
        }

        distributionTx.add(createTransferInstruction(
          creatorTokenAccount, recipientTokenAccount, creatorKeypair.publicKey, dist.amount
        ));

        const signature = await connection.sendTransaction(distributionTx, [creatorKeypair]);
        await connection.confirmTransaction(signature, 'confirmed');

        console.log(`   ✅ Sent ${dist.amountUI.toLocaleString()} KNIGHT`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('📊 RESULTS');
    console.log('='.repeat(70));
    console.log('');
    console.log('✅ Successful:', successCount, 'of', KEY_HOLDERS.length);
    console.log('');

    if (successCount === KEY_HOLDERS.length) {
      console.log('🎉 ALL DISTRIBUTIONS COMPLETE!');
      console.log('');
      console.log('Check token:');
      console.log(`  https://pump.fun/coin/${TOKEN_MINT}`);
      console.log(`  https://solscan.io/token/${TOKEN_MINT}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

distributeKnight().catch(console.error);
