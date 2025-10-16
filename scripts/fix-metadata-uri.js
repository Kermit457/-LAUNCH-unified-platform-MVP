/**
 * Research proper Pump.fun metadata format
 * Compare our tokens vs working tokens
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = require('node-fetch');

// Our token that doesn't show on pump.fun
const OUR_TOKEN = 'Z24vytbXjKuPht1uo7HMxW4YT3kDPo2mGPkobXjKuP'; // TEST2 from Solscan screenshot

async function investigateMetadata() {
  console.log('🔍 Investigating Pump.fun Metadata Requirements\n');

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  try {
    // Check our token's metadata
    console.log('Our Token:', OUR_TOKEN);
    const ourMint = new PublicKey(OUR_TOKEN);
    const ourInfo = await connection.getAccountInfo(ourMint);

    if (ourInfo) {
      console.log('✅ Our token exists on-chain');
      console.log('   Owner:', ourInfo.owner.toString());
      console.log('   Data length:', ourInfo.data.length);
    }

    // Check Pump.fun API
    console.log('\n📡 Checking Pump.fun API...');

    const pumpResponse = await fetch(`https://frontend-api.pump.fun/coins/${OUR_TOKEN}`);
    console.log('   Status:', pumpResponse.status);

    if (pumpResponse.ok) {
      const data = await pumpResponse.json();
      console.log('   Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('   ❌ Token not found in Pump.fun API');
      const errorText = await pumpResponse.text();
      console.log('   Error:', errorText);
    }

    // Check if there's a metadata account
    console.log('\n🔍 Checking for metadata account...');

    // Metadata program ID
    const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

    // Derive metadata PDA
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        METADATA_PROGRAM_ID.toBuffer(),
        ourMint.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );

    console.log('   Metadata PDA:', metadataPDA.toString());

    const metadataInfo = await connection.getAccountInfo(metadataPDA);
    if (metadataInfo) {
      console.log('   ✅ Metadata account exists');
      console.log('   Data length:', metadataInfo.data.length);

      // Try to parse metadata
      try {
        // Simple parsing - first 32 bytes should be update authority
        const updateAuthority = new PublicKey(metadataInfo.data.slice(1, 33));
        console.log('   Update Authority:', updateAuthority.toString());

        // Name is at offset 65, null-terminated
        let nameEnd = 65;
        while (nameEnd < metadataInfo.data.length && metadataInfo.data[nameEnd] !== 0) {
          nameEnd++;
        }
        const name = metadataInfo.data.slice(65, nameEnd).toString('utf8');
        console.log('   Name:', name);

      } catch (e) {
        console.log('   Could not parse metadata:', e.message);
      }
    } else {
      console.log('   ❌ No metadata account found - THIS IS THE PROBLEM!');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n' + '='.repeat(70));
  console.log('💡 FINDINGS:');
  console.log('='.repeat(70));
  console.log('');
  console.log('For a token to show on pump.fun, it needs:');
  console.log('  1. ✅ Token mint account (we have this)');
  console.log('  2. ❓ Metadata account (checking...)');
  console.log('  3. ❓ Registered in Pump.fun backend (checking...)');
  console.log('  4. ❓ Proper bonding curve account');
  console.log('');
  console.log('The PumpPortal API should create ALL of these.');
  console.log('If any are missing, the token won\'t appear on pump.fun');
  console.log('');
}

investigateMetadata().catch(console.error);
