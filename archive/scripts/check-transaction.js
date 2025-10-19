/**
 * Check Transaction Status
 * Checks if a transaction succeeded on Solana mainnet
 */

require('dotenv').config({ path: '.env.local' });
const { Connection } = require('@solana/web3.js');

const SIGNATURE = '2YWJc2Aebv9TX5nDsLixP8Vr1PyoQwh4XhbBaEXhRyWVimoUbDKpK2CWFcNBwZUAEztFEQN2PjpLSidS8Wk1JzWf';
const MINT = 'GRP1SNgXLshsy9seXA15WKzKiRCxX6rEFEsTHX1VYS9d';

async function checkTransaction() {
  console.log('\n🔍 CHECKING TRANSACTION STATUS');
  console.log('='.repeat(70));
  console.log('Signature:', SIGNATURE);
  console.log('Expected Mint:', MINT);
  console.log('');

  try {
    // Try multiple RPC endpoints
    const RPC_ENDPOINTS = [
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com',
      'https://solana.drpc.org'
    ];

    let connection;
    let txInfo;

    for (const rpc of RPC_ENDPOINTS) {
      try {
        console.log(`Trying RPC: ${rpc}`);
        connection = new Connection(rpc, 'confirmed');

        txInfo = await connection.getTransaction(SIGNATURE, {
          maxSupportedTransactionVersion: 0,
          commitment: 'confirmed'
        });

        if (txInfo) {
          console.log('✅ Transaction found!\n');
          break;
        }
      } catch (err) {
        console.log(`   Failed: ${err.message.substring(0, 50)}`);
      }
    }

    if (!txInfo) {
      console.log('❌ Transaction not found on any RPC endpoint');
      console.log('\n💡 This could mean:');
      console.log('  1. Transaction is still pending (wait 1-2 minutes)');
      console.log('  2. Transaction failed and was dropped');
      console.log('  3. RPC endpoints are not synced yet');
      console.log('\n🔗 Check manually:');
      console.log(`  https://solscan.io/tx/${SIGNATURE}`);
      console.log(`  https://explorer.solana.com/tx/${SIGNATURE}`);
      return;
    }

    console.log('📊 TRANSACTION DETAILS:');
    console.log('='.repeat(70));
    console.log('Slot:', txInfo.slot);
    console.log('Block Time:', new Date(txInfo.blockTime * 1000).toLocaleString());
    console.log('');

    if (txInfo.meta.err) {
      console.log('❌ TRANSACTION FAILED!');
      console.log('Error:', JSON.stringify(txInfo.meta.err, null, 2));
      console.log('\n💡 The token was NOT created');
    } else {
      console.log('✅ TRANSACTION SUCCEEDED!');
      console.log('');
      console.log('Fee Paid:', txInfo.meta.fee / 1000000000, 'SOL');
      console.log('');

      // Look for the token mint in the transaction
      console.log('📝 New Accounts Created:');
      if (txInfo.meta.postTokenBalances && txInfo.meta.postTokenBalances.length > 0) {
        txInfo.meta.postTokenBalances.forEach(balance => {
          console.log(`  Mint: ${balance.mint}`);
          console.log(`  Owner: ${balance.owner}`);
          console.log(`  Amount: ${balance.uiTokenAmount.uiAmountString}`);
          console.log('');
        });
      }

      console.log('='.repeat(70));
      console.log('🎉 YOUR TOKEN IS LIVE ON PUMP.FUN!');
      console.log('='.repeat(70));
      console.log('');
      console.log('🔗 VIEW YOUR TOKEN:');
      console.log(`  Pump.fun:    https://pump.fun/coin/${MINT}`);
      console.log(`  Solscan:     https://solscan.io/token/${MINT}`);
      console.log(`  Explorer:    https://explorer.solana.com/address/${MINT}`);
      console.log('');
      console.log('📈 WHAT TO DO NEXT:');
      console.log('  1. Visit your token on Pump.fun (link above)');
      console.log('  2. Share the link to build momentum');
      console.log('  3. You earn 0.30% of ALL trades!');
      console.log('  4. Token graduates at 84.985 SOL raised');
      console.log('');
    }

  } catch (error) {
    console.error('\n❌ Error checking transaction:', error.message);
    console.log('\n🔗 Check manually at:');
    console.log(`  https://solscan.io/tx/${SIGNATURE}`);
    console.log(`  https://explorer.solana.com/tx/${SIGNATURE}`);
  }
}

checkTransaction().catch(console.error);
