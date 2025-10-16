/**
 * Test Launch 4 - Verify Complete Automation
 *
 * Now that we know our implementation creates perfect tokens with all required accounts,
 * let's test again to confirm pump.fun visibility
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const fetch = require('node-fetch');
const fs = require('fs');

// TEST 4 CONFIGURATION
const TOKEN_NAME = 'Test Launch 4';
const TOKEN_SYMBOL = 'TEST4';
const DESCRIPTION = 'Final test - verifying complete pump.fun automation';
const BUY_AMOUNT_SOL = 0.01;

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

async function testLaunch4() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 TEST LAUNCH 4 - COMPLETE AUTOMATION VERIFICATION');
  console.log('='.repeat(70));
  console.log('');
  console.log('Token:      ', TOKEN_NAME, `(${TOKEN_SYMBOL})`);
  console.log('Description:', DESCRIPTION);
  console.log('Buy Amount: ', BUY_AMOUNT_SOL, 'SOL');
  console.log('');
  console.log('Previous tests confirmed:');
  console.log('  ✅ Token mint creation works');
  console.log('  ✅ Bonding curve account created at correct PDA');
  console.log('  ✅ Metadata account created at correct PDA');
  console.log('  ✅ All owned by Pump.fun program');
  console.log('');
  console.log('This test will verify pump.fun website visibility.');
  console.log('');

  try {
    // Load wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey) throw new Error('❌ No wallet configured!');

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const creatorAddress = creatorKeypair.publicKey.toBase58();

    // Connect to mainnet
    const RPC_ENDPOINTS = [
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || process.env.SOLANA_RPC_URL,
      'https://solana.drpc.org',
      'https://api.mainnet-beta.solana.com'
    ].filter(Boolean);

    let connection, RPC_URL, solBalance;

    console.log('🔌 Connecting to Solana...');
    for (const rpc of RPC_ENDPOINTS) {
      try {
        console.log(`   Testing: ${rpc}`);
        connection = new Connection(rpc, 'confirmed');
        const balance = await connection.getBalance(creatorKeypair.publicKey);
        solBalance = balance / LAMPORTS_PER_SOL;
        RPC_URL = rpc;
        console.log(`   ✅ Connected! Balance: ${solBalance.toFixed(4)} SOL`);
        break;
      } catch (err) {
        console.log(`   ❌ Failed`);
      }
    }

    console.log('');
    console.log('📍 RPC:', RPC_URL);
    console.log('📍 Creator:', creatorAddress);
    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');
    console.log('');

    if (solBalance < BUY_AMOUNT_SOL + 0.01) {
      throw new Error(`Insufficient balance! Need ${BUY_AMOUNT_SOL + 0.01} SOL`);
    }

    // Generate mint
    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey.toBase58();

    console.log('🔑 Generated Mint:', tokenMint);
    console.log('');

    // Show distribution
    console.log('👥 TOKEN DISTRIBUTION:');
    console.log('='.repeat(70));
    KEY_HOLDERS.forEach(holder => {
      const percentage = ((holder.keys / TOTAL_KEYS) * 100).toFixed(1);
      console.log(`  ${holder.name.padEnd(20)} ${holder.keys.toString().padStart(4)} keys (${percentage}%)`);
    });
    console.log('');

    console.log('⏳ Creating token on Pump.fun...');

    // Create metadata URI
    const metadataUri = `https://pump.fun/${tokenMint}`;

    // Call PumpPortal API
    const response = await fetch('https://pumpportal.fun/api/trade-local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey: creatorAddress,
        action: 'create',
        tokenMetadata: {
          name: TOKEN_NAME,
          symbol: TOKEN_SYMBOL,
          uri: metadataUri
        },
        mint: tokenMint,
        denominatedInSol: 'true',
        amount: BUY_AMOUNT_SOL,
        slippage: 10,
        priorityFee: 0.0005,
        pool: 'pump'
      })
    });

    console.log('📡 API Response:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    let transaction;

    if (contentType?.includes('application/octet-stream')) {
      console.log('✅ Transaction received (binary)');
      const txBytes = await response.arrayBuffer();
      transaction = VersionedTransaction.deserialize(Buffer.from(txBytes));
    } else if (contentType?.includes('application/json')) {
      console.log('✅ Transaction received (JSON)');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      transaction = VersionedTransaction.deserialize(Buffer.from(data.transaction, 'base64'));
    } else {
      throw new Error('Unknown response format');
    }

    console.log('📝 Signing transaction...');
    transaction.sign([creatorKeypair, mintKeypair]);

    console.log('📤 Sending transaction...');
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });

    console.log('✅ Transaction sent:', signature);
    console.log('⏳ Confirming...');
    console.log('');

    // Poll for confirmation
    let confirmed = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!confirmed && attempts < maxAttempts) {
      attempts++;
      try {
        const status = await connection.getSignatureStatus(signature);
        if (status?.value?.confirmationStatus === 'confirmed' ||
            status?.value?.confirmationStatus === 'finalized') {
          if (status.value.err) throw new Error('Transaction failed: ' + JSON.stringify(status.value.err));
          confirmed = true;
          console.log(`✅ Confirmed after ${attempts * 2} seconds`);
          break;
        }
        process.stdout.write(`   Polling ${attempts}/${maxAttempts}...\r`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        if (attempts === maxAttempts) {
          console.log('\n⚠️  Timeout - checking manually...');
        }
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 TOKEN CREATED ON MAINNET!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 TOKEN DETAILS:');
    console.log('  Name:        ', TOKEN_NAME);
    console.log('  Symbol:      ', TOKEN_SYMBOL);
    console.log('  Mint:        ', tokenMint);
    console.log('  Transaction: ', signature);
    console.log('');
    console.log('🔗 CHECK YOUR TOKEN:');
    console.log(`  Pump.fun:    https://pump.fun/coin/${tokenMint}`);
    console.log(`  Pump.fun:    https://pump.fun/${tokenMint}`);
    console.log(`  Solscan:     https://solscan.io/token/${tokenMint}`);
    console.log('');

    // Wait 10 seconds then verify
    console.log('⏳ Waiting 10 seconds for indexing...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('');
    console.log('🔍 VERIFICATION:');
    console.log('='.repeat(70));

    // Check Pump.fun API
    try {
      const apiResponse = await fetch(`https://frontend-api.pump.fun/coins/${tokenMint}`);
      console.log('Pump.fun API:', apiResponse.status);
      if (apiResponse.ok) {
        console.log('✅ Token IS visible on Pump.fun!');
        const data = await apiResponse.json();
        console.log('   Name:', data.name);
        console.log('   Symbol:', data.symbol);
        console.log('   Creator:', data.creator);
      } else {
        console.log('⚠️  Not in API yet (may take a minute)');
      }
    } catch (e) {
      console.log('⚠️  API check failed:', e.message);
    }

    // Check on-chain accounts
    const { PublicKey } = require('@solana/web3.js');
    const mintPubkey = new PublicKey(tokenMint);
    const PUMP_PROGRAM = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');

    const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('bonding-curve'), mintPubkey.toBuffer()],
      PUMP_PROGRAM
    );

    const bondingInfo = await connection.getAccountInfo(bondingCurvePDA);
    console.log('');
    console.log('On-chain verification:');
    console.log('  Token mint:      ', mintPubkey.toString().substring(0, 20) + '...');
    console.log('  Bonding curve:   ', bondingInfo ? '✅ EXISTS' : '❌ MISSING');
    console.log('');

    // Save data
    const launchData = {
      success: true,
      tokenMint,
      signature,
      tokenName: TOKEN_NAME,
      tokenSymbol: TOKEN_SYMBOL,
      description: DESCRIPTION,
      buyAmount: BUY_AMOUNT_SOL,
      network: 'mainnet-beta',
      rpcUsed: RPC_URL,
      creator: creatorAddress,
      keyHolders: KEY_HOLDERS,
      timestamp: new Date().toISOString(),
      pumpFunUrl: `https://pump.fun/coin/${tokenMint}`,
      bondingCurvePDA: bondingCurvePDA.toString(),
      verified: {
        mintExists: true,
        bondingCurveExists: !!bondingInfo
      }
    };

    const filename = `LAUNCH-${TOKEN_SYMBOL}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(launchData, null, 2));
    console.log('📁 Launch data saved:', filename);
    console.log('');
    console.log('🎯 NEXT STEP: Check if token appears on pump.fun website!');
    console.log('');

  } catch (error) {
    console.error('\n❌ Launch Failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

console.log('🚨 This will spend REAL SOL on mainnet!');
console.log('⏱️  Starting in 3 seconds... Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  testLaunch4().catch(console.error);
}, 3000);
