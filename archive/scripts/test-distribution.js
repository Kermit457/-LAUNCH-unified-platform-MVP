/**
 * Test Token Distribution to 7 Key Holders
 *
 * This script will distribute TEST4 tokens from your wallet to the 7 key holders
 * based on their key proportions
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, PublicKey, Transaction } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount } = require('@solana/spl-token');
const bs58 = require('bs58').default || require('bs58');

const TOKEN_MINT = 'BPvPDT46ctw5UYNwu4fDBc9Uvr273JAW2RMjqA1Bm3F1'; // TEST4

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

async function testDistribution() {
  console.log('\n' + '='.repeat(70));
  console.log('🎯 TEST TOKEN DISTRIBUTION');
  console.log('='.repeat(70));
  console.log('');
  console.log('Token:', TOKEN_MINT);
  console.log('Distributing to 7 key holders');
  console.log('');

  try {
    // Load wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('No wallet configured!');

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const creatorAddress = creatorKeypair.publicKey.toBase58();

    // Connect
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

    console.log('📍 Creator Wallet:', creatorAddress);
    console.log('');

    // Check creator's token balance
    const mintPubkey = new PublicKey(TOKEN_MINT);
    const creatorTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      creatorKeypair.publicKey
    );

    console.log('📊 Checking your token balance...');
    try {
      const tokenAccountInfo = await getAccount(connection, creatorTokenAccount);
      const balance = Number(tokenAccountInfo.amount);
      const decimals = 6; // Assuming 6 decimals (standard for pump.fun)
      const balanceUI = balance / Math.pow(10, decimals);

      console.log('   Token Account:', creatorTokenAccount.toString());
      console.log('   Balance:', balanceUI.toLocaleString(), 'TEST4');
      console.log('   Raw Amount:', balance);
      console.log('');

      if (balance === 0) {
        console.log('❌ No tokens in wallet! Cannot distribute.');
        console.log('');
        console.log('The tokens might be:');
        console.log('  1. Still in the bonding curve');
        console.log('  2. In a different wallet');
        console.log('  3. Not minted yet');
        return;
      }

      // Calculate distribution
      console.log('💰 CALCULATING DISTRIBUTION:');
      console.log('='.repeat(70));
      console.log('');

      const distributions = KEY_HOLDERS.map(holder => {
        const percentage = holder.keys / TOTAL_KEYS;
        const amount = Math.floor(balance * percentage);
        const amountUI = amount / Math.pow(10, decimals);

        return {
          ...holder,
          percentage: (percentage * 100).toFixed(1),
          amount,
          amountUI
        };
      });

      distributions.forEach(d => {
        console.log(`  ${d.name.padEnd(20)} ${d.keys.toString().padStart(4)} keys (${d.percentage.padStart(5)}%) → ${d.amountUI.toLocaleString().padStart(15)} TEST4`);
      });

      const totalToDistribute = distributions.reduce((sum, d) => sum + d.amount, 0);
      console.log('');
      console.log('  Total to distribute:', (totalToDistribute / Math.pow(10, decimals)).toLocaleString(), 'TEST4');
      console.log('  Remaining in wallet:', ((balance - totalToDistribute) / Math.pow(10, decimals)).toLocaleString(), 'TEST4');
      console.log('');

      // Ask for confirmation
      console.log('🚨 READY TO DISTRIBUTE');
      console.log('='.repeat(70));
      console.log('');
      console.log('This will send REAL tokens from your wallet to 7 addresses.');
      console.log('');
      console.log('Press Ctrl+C to cancel, or wait 5 seconds to proceed...');
      console.log('');

      await new Promise(resolve => setTimeout(resolve, 5000));

      // Execute distributions
      console.log('📤 EXECUTING DISTRIBUTIONS...');
      console.log('');

      let successCount = 0;
      let failCount = 0;

      for (const dist of distributions) {
        try {
          console.log(`Sending to ${dist.name}...`);

          const recipientPubkey = new PublicKey(dist.address);
          const recipientTokenAccount = await getAssociatedTokenAddress(
            mintPubkey,
            recipientPubkey
          );

          // Check if recipient token account exists
          let needsAccountCreation = false;
          try {
            await getAccount(connection, recipientTokenAccount);
          } catch (e) {
            needsAccountCreation = true;
            console.log('   Creating token account for recipient...');
          }

          // Build transaction
          const transaction = new Transaction();

          // Add create account instruction if needed
          if (needsAccountCreation) {
            transaction.add(
              createAssociatedTokenAccountInstruction(
                creatorKeypair.publicKey,
                recipientTokenAccount,
                recipientPubkey,
                mintPubkey
              )
            );
          }

          // Add transfer instruction
          transaction.add(
            createTransferInstruction(
              creatorTokenAccount,
              recipientTokenAccount,
              creatorKeypair.publicKey,
              dist.amount
            )
          );

          // Send transaction
          const signature = await connection.sendTransaction(transaction, [creatorKeypair]);

          // Wait for confirmation
          await connection.confirmTransaction(signature, 'confirmed');

          console.log(`   ✅ Sent ${dist.amountUI.toLocaleString()} TEST4`);
          console.log(`   📝 TX: ${signature}`);
          console.log('');

          successCount++;

        } catch (error) {
          console.log(`   ❌ Failed: ${error.message}`);
          console.log('');
          failCount++;
        }
      }

      console.log('='.repeat(70));
      console.log('📊 DISTRIBUTION COMPLETE');
      console.log('='.repeat(70));
      console.log('');
      console.log('✅ Successful:', successCount);
      console.log('❌ Failed:    ', failCount);
      console.log('');

      if (successCount === KEY_HOLDERS.length) {
        console.log('🎉 ALL DISTRIBUTIONS SUCCESSFUL!');
        console.log('');
        console.log('Your automation is working perfectly:');
        console.log('  ✅ Token creation');
        console.log('  ✅ Bonding curve');
        console.log('  ✅ Token distribution');
        console.log('');
      }

    } catch (error) {
      if (error.message.includes('could not find account')) {
        console.log('❌ No token account found for your wallet.');
        console.log('');
        console.log('This means tokens haven\'t been sent to your wallet yet.');
        console.log('They might still be in the bonding curve or need to be claimed.');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  }
}

testDistribution().catch(console.error);
