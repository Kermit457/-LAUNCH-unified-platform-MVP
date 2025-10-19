/**
 * Compare our token with a working pump.fun token
 * to find what's missing
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = require('node-fetch');

// Our token that doesn't show
const OUR_TOKEN = 'BPvPDT46ctw5UYNwu4fDBc9Uvr273JAW2RMjqA1Bm3F1'; // TEST4

// We need to find a working pump.fun token to compare
// Let's try to get one from pump.fun's website if their API works

async function compareTokens() {
  console.log('🔍 DEEP COMPARISON: Finding why token doesn\'t show on pump.fun\n');

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  try {
    // First, let's check if pump.fun API is working now
    console.log('1️⃣ Checking pump.fun API status...');

    try {
      const healthCheck = await fetch('https://pump.fun');
      console.log('   Pump.fun website:', healthCheck.ok ? '✅ UP' : '❌ DOWN');
    } catch (e) {
      console.log('   Pump.fun website: ❌ DOWN');
    }

    // Try their API
    try {
      const apiCheck = await fetch('https://frontend-api.pump.fun/coins?limit=1');
      console.log('   Pump.fun API:', apiCheck.status);

      if (apiCheck.ok) {
        const data = await apiCheck.json();
        console.log('   ✅ API IS WORKING NOW!');
        console.log('   Sample token:', data[0]?.mint);

        // Now check our token
        console.log('\n2️⃣ Checking our token in API...');
        const ourCheck = await fetch(`https://frontend-api.pump.fun/coins/${OUR_TOKEN}`);
        console.log('   Status:', ourCheck.status);

        if (ourCheck.ok) {
          console.log('   ✅ OUR TOKEN IS IN THE API!');
          const ourData = await ourCheck.json();
          console.log(JSON.stringify(ourData, null, 2));
        } else {
          console.log('   ❌ OUR TOKEN NOT FOUND');
          const error = await ourCheck.text();
          console.log('   Error:', error.substring(0, 200));
        }
      } else {
        console.log('   ❌ API still down (', apiCheck.status, ')');
      }
    } catch (e) {
      console.log('   ❌ API error:', e.message);
    }

    // Check our token's transaction to see if creation was complete
    console.log('\n3️⃣ Analyzing our token creation transaction...');

    const OUR_TX = 'giSinJnS9SXt68hyPSSSNse4AjvJA566xXD4iitZWNp2aByhKGJDQmZygqkRWMYRro5RK5X9JMW6Bp5AubpyAFm';

    const tx = await connection.getTransaction(OUR_TX, {
      maxSupportedTransactionVersion: 0
    });

    if (tx) {
      console.log('   Transaction found:');
      console.log('   Success:', tx.meta.err === null ? '✅ YES' : '❌ NO');
      console.log('   Accounts:', tx.transaction.message.staticAccountKeys.length);
      console.log('   Instructions:', tx.transaction.message.compiledInstructions.length);

      console.log('\n   Instruction details:');
      tx.transaction.message.compiledInstructions.forEach((ix, i) => {
        const programId = tx.transaction.message.staticAccountKeys[ix.programIdIndex];
        console.log(`   ${i}: Program ${programId.toString().substring(0, 20)}...`);
      });

      // Check logs for any errors
      if (tx.meta.logMessages) {
        console.log('\n   Transaction logs:');
        tx.meta.logMessages.forEach(log => {
          if (log.includes('Error') || log.includes('error') || log.includes('failed')) {
            console.log('   ⚠️ ', log);
          }
        });
      }
    }

    // Check metadata URI
    console.log('\n4️⃣ Checking metadata...');
    const METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    const mintPubkey = new PublicKey(OUR_TOKEN);

    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METADATA_PROGRAM.toBuffer(), mintPubkey.toBuffer()],
      METADATA_PROGRAM
    );

    const metadataInfo = await connection.getAccountInfo(metadataPDA);
    if (metadataInfo) {
      console.log('   ✅ Metadata account exists');

      // Try to extract URI
      try {
        // Metadata structure (simplified):
        // 1 byte: key
        // 32 bytes: update authority
        // 32 bytes: mint
        // 4 + name length: name
        // 4 + symbol length: symbol
        // 4 + uri length: uri

        let offset = 1 + 32 + 32; // Skip key, update authority, mint

        // Read name length
        const nameLen = metadataInfo.data.readUInt32LE(offset);
        offset += 4;
        const name = metadataInfo.data.slice(offset, offset + nameLen).toString('utf8');
        offset += nameLen;

        // Read symbol length
        const symbolLen = metadataInfo.data.readUInt32LE(offset);
        offset += 4;
        const symbol = metadataInfo.data.slice(offset, offset + symbolLen).toString('utf8');
        offset += symbolLen;

        // Read URI length
        const uriLen = metadataInfo.data.readUInt32LE(offset);
        offset += 4;
        const uri = metadataInfo.data.slice(offset, offset + uriLen).toString('utf8');

        console.log('   Name:', name.replace(/\0/g, ''));
        console.log('   Symbol:', symbol.replace(/\0/g, ''));
        console.log('   URI:', uri.replace(/\0/g, ''));

        // Try to fetch the URI
        const cleanUri = uri.replace(/\0/g, '').trim();
        if (cleanUri.startsWith('http')) {
          console.log('\n   Fetching metadata from URI...');
          try {
            const metaResponse = await fetch(cleanUri);
            console.log('   URI Status:', metaResponse.status);
            if (metaResponse.ok) {
              const metaData = await metaResponse.json();
              console.log('   Metadata:', JSON.stringify(metaData, null, 2));
            }
          } catch (e) {
            console.log('   ❌ Could not fetch URI:', e.message);
          }
        } else {
          console.log('   ⚠️  URI is not a valid HTTP URL - THIS MAY BE THE PROBLEM!');
        }

      } catch (e) {
        console.log('   Could not parse metadata:', e.message);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('💡 ANALYSIS');
    console.log('='.repeat(70));
    console.log('');
    console.log('Possible reasons token doesn\'t show on pump.fun:');
    console.log('  1. Metadata URI is invalid or not accessible');
    console.log('  2. Pump.fun backend still has issues');
    console.log('  3. Token needs to be "registered" via a specific call');
    console.log('  4. Missing image/description in metadata');
    console.log('');

  } catch (error) {
    console.error('Error:', error);
  }
}

compareTokens().catch(console.error);
