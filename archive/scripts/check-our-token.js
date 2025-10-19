/**
 * Check our specific token to see what's missing
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = require('node-fetch');

const OUR_TOKEN = 'Z24vtyftKxhpht1uof7HMxW4YT3kDPo2mGPkobXjKuP'; // TEST2
const OUR_TX = '52PD2QEGqwrTr7XBFTcjfxbrHqVymFRPrUEwEnLX3h2YWVQphQze7YoGgPLSjfboqersqHDRPnZDpRY6LCycQF9x';

async function checkOurToken() {
  console.log('🔍 ANALYZING OUR TOKEN: TEST2\n');
  console.log('Mint:', OUR_TOKEN);
  console.log('TX:  ', OUR_TX);
  console.log('');

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  try {
    // 1. Check if token mint exists
    console.log('1️⃣ Checking token mint...');
    const mintPubkey = new PublicKey(OUR_TOKEN);
    const mintInfo = await connection.getAccountInfo(mintPubkey);

    if (mintInfo) {
      console.log('✅ Token mint EXISTS');
      console.log('   Owner:', mintInfo.owner.toString());
      console.log('   Lamports:', mintInfo.lamports);
      console.log('   Data length:', mintInfo.data.length);
    } else {
      console.log('❌ Token mint NOT FOUND');
      return;
    }

    // 2. Check creation transaction
    console.log('\n2️⃣ Checking creation transaction...');
    const tx = await connection.getTransaction(OUR_TX, {
      maxSupportedTransactionVersion: 0
    });

    if (tx) {
      console.log('✅ Transaction found');
      console.log('   Success:', tx.meta.err === null ? 'YES' : 'NO');
      console.log('   Fee:', tx.meta.fee, 'lamports');
      console.log('   Accounts involved:', tx.transaction.message.staticAccountKeys.length);

      console.log('\n   Account Keys:');
      tx.transaction.message.staticAccountKeys.forEach((key, i) => {
        console.log(`   ${i}: ${key.toString()}`);
      });

      console.log('\n   Instructions:', tx.transaction.message.compiledInstructions.length);
    } else {
      console.log('❌ Transaction not found');
    }

    // 3. Check Pump.fun API
    console.log('\n3️⃣ Checking Pump.fun API...');
    try {
      const apiResponse = await fetch(`https://frontend-api.pump.fun/coins/${OUR_TOKEN}`);
      console.log('   API Status:', apiResponse.status);

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        console.log('✅ Token IS registered on Pump.fun!');
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log('❌ Token NOT in Pump.fun database');
        const error = await apiResponse.text();
        console.log('   Error:', error);
      }
    } catch (e) {
      console.log('❌ API call failed:', e.message);
    }

    // 4. Look for bonding curve account
    console.log('\n4️⃣ Searching for bonding curve account...');
    const PUMP_PROGRAM = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');

    // Try to derive bonding curve PDA
    const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('bonding-curve'), mintPubkey.toBuffer()],
      PUMP_PROGRAM
    );

    console.log('   Expected Bonding Curve PDA:', bondingCurvePDA.toString());

    const bondingInfo = await connection.getAccountInfo(bondingCurvePDA);
    if (bondingInfo) {
      console.log('✅ Bonding curve account EXISTS!');
      console.log('   Owner:', bondingInfo.owner.toString());
      console.log('   Data length:', bondingInfo.data.length);
    } else {
      console.log('❌ Bonding curve account NOT FOUND - THIS IS THE PROBLEM!');
    }

    // 5. Check metadata
    console.log('\n5️⃣ Checking metadata account...');
    const METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        METADATA_PROGRAM.toBuffer(),
        mintPubkey.toBuffer(),
      ],
      METADATA_PROGRAM
    );

    console.log('   Expected Metadata PDA:', metadataPDA.toString());

    const metadataInfo = await connection.getAccountInfo(metadataPDA);
    if (metadataInfo) {
      console.log('✅ Metadata account EXISTS');
      console.log('   Data length:', metadataInfo.data.length);
    } else {
      console.log('❌ Metadata account NOT FOUND');
    }

    console.log('\n' + '='.repeat(70));
    console.log('💡 DIAGNOSIS');
    console.log('='.repeat(70));
    console.log('');
    console.log('For token to show on pump.fun website:');
    console.log('  1. Token mint ........................', mintInfo ? '✅' : '❌');
    console.log('  2. Bonding curve account .............', bondingInfo ? '✅' : '❌');
    console.log('  3. Metadata account ..................', metadataInfo ? '✅' : '❌');
    console.log('  4. Registered in Pump API ............', '❓ (check above)');
    console.log('');

    if (!bondingInfo) {
      console.log('🎯 ROOT CAUSE: Missing bonding curve account!');
      console.log('');
      console.log('The PumpPortal API created the token mint but did NOT create');
      console.log('the bonding curve account that Pump.fun needs.');
      console.log('');
      console.log('SOLUTION: We need to either:');
      console.log('  A) Use a different API endpoint');
      console.log('  B) Send additional instructions to create bonding curve');
      console.log('  C) Use the official Pump.fun SDK directly');
      console.log('');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkOurToken().catch(console.error);
