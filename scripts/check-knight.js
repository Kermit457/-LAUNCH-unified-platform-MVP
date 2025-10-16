const { Connection, PublicKey } = require('@solana/web3.js');

const TX = 'ePHZdYS1RwJxNN5kWAJqntwjAz2aJZTxaA7wCgLPQ8F49uSSsTPWc1mJgc2vmPbdYpe7AuT5obBbrRs5dbVJbos';
const MINT = 'EGmBmFc4LUpQSMidCMyaks2X5p6Ch4QZGdr7FcpuAXbk';

async function check() {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  console.log('\n🔍 Checking transaction:', TX);
  console.log('');

  try {
    const tx = await connection.getTransaction(TX, { maxSupportedTransactionVersion: 0 });

    if (!tx) {
      console.log('❌ Transaction not found!');
      console.log('   The transaction may have failed or never confirmed.');
      console.log('');
      console.log('Check on Solscan:');
      console.log(`   https://solscan.io/tx/${TX}`);
      return;
    }

    console.log('✅ Transaction found');
    console.log('   Success:', tx.meta.err === null ? 'YES' : 'NO');
    console.log('   Slot:', tx.slot);
    console.log('');

    if (tx.meta.err) {
      console.log('❌ Transaction FAILED');
      console.log('   Error:', JSON.stringify(tx.meta.err, null, 2));
      console.log('');
      console.log('   This is why no token was created!');
    } else {
      console.log('✅ Transaction SUCCESS');
      console.log('');
      console.log('Checking mint:', MINT);

      const mintPubkey = new PublicKey(MINT);
      const mintInfo = await connection.getAccountInfo(mintPubkey);

      if (mintInfo) {
        console.log('✅ Token mint EXISTS!');
        console.log('   Owner:', mintInfo.owner.toString());
        console.log('');
        console.log('View token:');
        console.log(`   https://solscan.io/token/${MINT}`);
        console.log(`   https://pump.fun/coin/${MINT}`);
      } else {
        console.log('❌ Token mint NOT FOUND');
        console.log('   Even though transaction succeeded, mint doesn\'t exist.');
        console.log('   This suggests the transaction did something else.');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

check();
