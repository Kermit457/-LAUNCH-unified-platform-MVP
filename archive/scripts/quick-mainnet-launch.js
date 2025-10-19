/**
 * Quick Mainnet Launch - No readline, auto-confirm with preset values
 * Run this if the interactive script has issues
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, LAMPORTS_PER_SOL, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const fetch = require('node-fetch');
const fs = require('fs');

// PRESET VALUES - Edit these before running
const TOKEN_NAME = 'Test Launch 2';
const TOKEN_SYMBOL = 'TEST2';
const DESCRIPTION = 'Second mainnet test with Ankr RPC';
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

async function quickLaunch() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 QUICK MAINNET LAUNCH');
  console.log('='.repeat(70));
  console.log('');
  console.log('Token:     ', TOKEN_NAME, `(${TOKEN_SYMBOL})`);
  console.log('SOL Amount:', BUY_AMOUNT_SOL, 'SOL');
  console.log('RPC:       ', process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
  console.log('');

  try {
    // Load wallet
    const privateKey = process.env.PUMP_FUN_CREATOR_PRIVATE_KEY;
    if (!privateKey || privateKey === 'YOUR_PRIVATE_KEY_HERE') {
      throw new Error('❌ No wallet configured!');
    }

    const creatorKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const creatorAddress = creatorKeypair.publicKey.toBase58();

    // Connect to mainnet with fallback RPCs
    const RPC_ENDPOINTS = [
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || process.env.SOLANA_RPC_URL,
      'https://solana.drpc.org',
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com'
    ].filter(Boolean);

    let connection;
    let RPC_URL;
    let solBalance;

    console.log('🔌 Trying RPC endpoints...');

    for (const rpc of RPC_ENDPOINTS) {
      try {
        console.log(`   Testing: ${rpc}`);
        connection = new Connection(rpc, 'confirmed');
        const balance = await connection.getBalance(creatorKeypair.publicKey);
        solBalance = balance / LAMPORTS_PER_SOL;
        RPC_URL = rpc;
        console.log(`   ✅ Success! Balance: ${solBalance.toFixed(4)} SOL`);
        break;
      } catch (err) {
        console.log(`   ❌ Failed: ${err.message.substring(0, 50)}`);
        if (rpc === RPC_ENDPOINTS[RPC_ENDPOINTS.length - 1]) {
          throw new Error('All RPC endpoints failed. Try https://pump.fun directly.');
        }
      }
    }

    console.log('');
    console.log('✅ Connected to Solana Mainnet');
    console.log('📍 RPC Endpoint:', RPC_URL);
    console.log('📍 Creator Wallet:', creatorAddress);

    console.log('💵 Balance:', solBalance.toFixed(4), 'SOL');
    console.log('');

    if (solBalance < BUY_AMOUNT_SOL + 0.01) {
      throw new Error(`❌ Insufficient balance! Need at least ${BUY_AMOUNT_SOL + 0.01} SOL`);
    }

    // Show distribution
    console.log('👥 KEY HOLDERS DISTRIBUTION:');
    console.log('=' .repeat(70));
    KEY_HOLDERS.forEach(holder => {
      const percentage = ((holder.keys / TOTAL_KEYS) * 100).toFixed(1);
      console.log(`  ${holder.name.padEnd(20)} ${holder.keys.toString().padStart(4)} keys (${percentage}%)`);
    });
    console.log('');

    // Generate mint
    const mintKeypair = Keypair.generate();
    const tokenMint = mintKeypair.publicKey.toBase58();

    console.log('🔑 Generated Mint:', tokenMint);
    console.log('');
    console.log('⏳ Calling Pump.fun API...');

    // Create metadata URI
    const metadataUri = `https://pump.fun/token/${TOKEN_SYMBOL}-${Date.now()}`;

    // Call PumpPortal API with updated RPC
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

    console.log('📡 API Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API Error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);

    let transaction;

    // Handle different response types
    if (contentType && contentType.includes('application/json')) {
      // JSON response with base64 transaction
      const data = await response.json();

      if (data.error) {
        throw new Error(`Pump.fun Error: ${data.error}`);
      }

      console.log('✅ Transaction created (JSON format)');
      console.log('');

      if (!data.transaction) {
        throw new Error('No transaction in response');
      }

      const txBuffer = Buffer.from(data.transaction, 'base64');
      transaction = VersionedTransaction.deserialize(txBuffer);

    } else if (contentType && contentType.includes('application/octet-stream')) {
      // Binary response - transaction bytes directly
      console.log('✅ Transaction created (Binary format)');
      console.log('');

      const txBytes = await response.arrayBuffer();
      const txBuffer = Buffer.from(txBytes);

      // Try to deserialize as versioned transaction
      transaction = VersionedTransaction.deserialize(txBuffer);

    } else {
      // Unknown format
      const textResponse = await response.text();
      console.error('❌ Unknown Response Type:', textResponse.substring(0, 500));
      throw new Error('API returned unknown response format');
    }

    // Sign versioned transaction
    console.log('📝 Signing versioned transaction...');

    transaction.sign([creatorKeypair, mintKeypair]);

    console.log('📤 Sending transaction...');
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });

    console.log('✅ Transaction Sent:', signature);
    console.log('⏳ Waiting for confirmation (polling every 2 seconds)...');
    console.log('');

    // Use polling instead of WebSocket (free RPCs don't support subscriptions)
    let confirmed = false;
    let attempts = 0;
    const maxAttempts = 30; // 60 seconds max

    while (!confirmed && attempts < maxAttempts) {
      attempts++;

      try {
        const status = await connection.getSignatureStatus(signature);

        if (status?.value?.confirmationStatus === 'confirmed' ||
            status?.value?.confirmationStatus === 'finalized') {

          if (status.value.err) {
            throw new Error('Transaction failed: ' + JSON.stringify(status.value.err));
          }

          confirmed = true;
          console.log(`✅ Confirmed after ${attempts * 2} seconds`);
          break;
        }

        process.stdout.write(`   Attempt ${attempts}/${maxAttempts}...\r`);
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        if (attempts === maxAttempts) {
          throw new Error('Could not confirm transaction after 60 seconds. Check manually: https://solscan.io/tx/' + signature);
        }
      }
    }

    if (!confirmed) {
      throw new Error('Transaction confirmation timeout. Check status: https://solscan.io/tx/' + signature);
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('🎉 TOKEN CREATED SUCCESSFULLY ON MAINNET!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 TOKEN DETAILS:');
    console.log('  Token Mint:  ', tokenMint);
    console.log('  Name:        ', TOKEN_NAME);
    console.log('  Symbol:      ', TOKEN_SYMBOL);
    console.log('  Transaction: ', signature);
    console.log('');
    console.log('🔗 VIEW YOUR TOKEN:');
    console.log(`  Pump.fun:    https://pump.fun/coin/${tokenMint}`);
    console.log(`  Solscan:     https://solscan.io/token/${tokenMint}`);
    console.log(`  Explorer:    https://explorer.solana.com/address/${tokenMint}`);
    console.log('');

    // Save launch data
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
      pumpFunUrl: `https://pump.fun/coin/${tokenMint}`
    };

    const filename = `LAUNCH-${TOKEN_SYMBOL}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(launchData, null, 2));

    console.log('📁 Launch data saved to:', filename);
    console.log('');
    console.log('💰 NEXT STEPS:');
    console.log('  1. Visit your token on Pump.fun (link above)');
    console.log('  2. Share the link to build momentum');
    console.log('  3. You earn 0.30% of ALL trades!');
    console.log('  4. Token graduates at 84.985 SOL raised');
    console.log('');
    console.log('📝 Token Distribution:');
    console.log('  Tokens are in your creator wallet:', creatorAddress);
    console.log('  Run distribution script to airdrop to your 7 holders');
    console.log('');

  } catch (error) {
    console.error('\n❌ Launch Failed:', error.message);
    console.error(error);
    console.log('\n💡 Troubleshooting:');
    console.log('  1. Check RPC endpoint is accessible');
    console.log('  2. Verify wallet has enough SOL');
    console.log('  3. Try launching directly on https://pump.fun');
    console.log('  4. Check PumpPortal API status');
    process.exit(1);
  }
}

console.log('🚨 WARNING: This will spend REAL SOL and create a REAL token!');
console.log('⏱️  Starting in 3 seconds... Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  quickLaunch().catch(console.error);
}, 3000);
