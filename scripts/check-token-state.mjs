/**
 * CHECK TOKEN STATE
 *
 * Verifies if a token has a proper Pump.fun bonding curve
 */

import { Connection, PublicKey } from '@solana/web3.js';

const TOKEN_MINT = '5AA8jT1Q2o4jyvTZsm69JMSmFq1oQq4MzQ2pwvbXCbVM';
const PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
const BONDING_CURVE_SEED = "bonding-curve";

async function checkTokenState() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 CHECKING TOKEN STATE');
  console.log('='.repeat(70));
  console.log('');

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const mintPubkey = new PublicKey(TOKEN_MINT);

  console.log('Token:', TOKEN_MINT);
  console.log('');

  // Check if mint exists
  try {
    const mintInfo = await connection.getAccountInfo(mintPubkey);
    if (!mintInfo) {
      console.log('❌ Token mint does not exist!');
      return;
    }
    console.log('✅ Token mint exists');
  } catch (e) {
    console.log('❌ Error checking mint:', e.message);
    return;
  }

  // Check bonding curve PDA
  const [bondingCurvePDA] = PublicKey.findProgramAddressSync([
    Buffer.from(BONDING_CURVE_SEED),
    mintPubkey.toBuffer()
  ], new PublicKey(PROGRAM_ID));

  console.log('Bonding Curve PDA:', bondingCurvePDA.toBase58());
  console.log('');

  try {
    const bondingCurveInfo = await connection.getAccountInfo(bondingCurvePDA);

    if (!bondingCurveInfo) {
      console.log('❌ BONDING CURVE DOES NOT EXIST!');
      console.log('');
      console.log('This token was created but the bonding curve was not initialized.');
      console.log('This can happen when:');
      console.log('  - Only the "create" instruction ran without completing');
      console.log('  - The transaction failed partway through');
      console.log('  - The token was created outside of Pump.fun');
      console.log('');
      console.log('💡 SOLUTION: Create a NEW token with proper bonding curve');
      console.log('');
      return;
    }

    console.log('✅ BONDING CURVE EXISTS!');
    console.log('');
    console.log('Account Details:');
    console.log('  Owner:', bondingCurveInfo.owner.toBase58());
    console.log('  Lamports:', bondingCurveInfo.lamports);
    console.log('  Data Length:', bondingCurveInfo.data.length);
    console.log('');
    console.log('✅ Token is properly configured for Pump.fun!');
    console.log('   You should be able to buy from the bonding curve.');
    console.log('');

  } catch (e) {
    console.log('❌ Error checking bonding curve:', e.message);
  }
}

checkTokenState().catch(console.error);
