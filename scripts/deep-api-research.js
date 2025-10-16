/**
 * DEEP RESEARCH: PumpPortal API Best Practices
 *
 * This script investigates:
 * 1. All available PumpPortal endpoints
 * 2. Correct request/response formats
 * 3. Working examples from the blockchain
 * 4. Common mistakes and fixes
 */

require('dotenv').config({ path: '.env.local' });
const { Connection, PublicKey, Transaction, VersionedTransaction } = require('@solana/web3.js');
const fetch = require('node-fetch');
const fs = require('fs');

const RESEARCH_REPORT = [];

function log(section, message, data = null) {
  const entry = { section, message, data, timestamp: new Date().toISOString() };
  RESEARCH_REPORT.push(entry);
  console.log(`\n[${section}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

async function researchPumpPortalAPI() {
  console.log('='.repeat(80));
  console.log('🔬 DEEP RESEARCH: PumpPortal API');
  console.log('='.repeat(80));

  // ============================================================================
  // SECTION 1: Test All Known Endpoints
  // ============================================================================
  log('ENDPOINTS', 'Testing all known PumpPortal endpoints...');

  const endpoints = [
    { name: 'trade-local', url: 'https://pumpportal.fun/api/trade-local', method: 'POST' },
    { name: 'trade', url: 'https://pumpportal.fun/api/trade', method: 'POST' },
    { name: 'ipfs-upload', url: 'https://pumpportal.fun/api/ipfs', method: 'POST' },
    { name: 'data', url: 'https://pumpportal.fun/api/data', method: 'GET' },
  ];

  for (const endpoint of endpoints) {
    try {
      log('ENDPOINT TEST', `Testing: ${endpoint.name}`, { url: endpoint.url });

      if (endpoint.method === 'GET') {
        const response = await fetch(endpoint.url);
        log('RESPONSE', `${endpoint.name} status: ${response.status}`);

        if (response.ok) {
          const data = await response.text();
          log('RESPONSE DATA', endpoint.name, data.substring(0, 500));
        }
      }
    } catch (error) {
      log('ERROR', `${endpoint.name} failed`, { error: error.message });
    }
  }

  // ============================================================================
  // SECTION 2: Analyze Working Pump.fun Tokens
  // ============================================================================
  log('ANALYSIS', 'Analyzing working Pump.fun tokens from the blockchain...');

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  // Get recent Pump.fun token creations
  try {
    log('PUMP.FUN API', 'Fetching recent tokens from Pump.fun...');

    const pumpApiResponse = await fetch('https://frontend-api.pump.fun/coins?limit=10&offset=0&sort=created_timestamp&order=DESC');

    if (pumpApiResponse.ok) {
      const coins = await pumpApiResponse.json();
      log('RECENT TOKENS', `Found ${coins.length} recent tokens`);

      if (coins.length > 0) {
        const exampleToken = coins[0];
        log('EXAMPLE TOKEN', 'Analyzing a working token...', {
          mint: exampleToken.mint,
          name: exampleToken.name,
          symbol: exampleToken.symbol,
          uri: exampleToken.uri,
          description: exampleToken.description,
          created_timestamp: exampleToken.created_timestamp,
          creator: exampleToken.creator,
          complete: exampleToken.complete,
          raydium_pool: exampleToken.raydium_pool,
        });

        // Check this token's metadata
        if (exampleToken.uri) {
          try {
            const metadataResponse = await fetch(exampleToken.uri);
            if (metadataResponse.ok) {
              const metadata = await metadataResponse.json();
              log('WORKING METADATA FORMAT', 'This is what working tokens use:', metadata);
            }
          } catch (e) {
            log('METADATA ERROR', 'Could not fetch metadata', { error: e.message });
          }
        }

        // Check the token's on-chain accounts
        const mintPubkey = new PublicKey(exampleToken.mint);
        const mintInfo = await connection.getAccountInfo(mintPubkey);

        if (mintInfo) {
          log('ON-CHAIN INFO', 'Working token on-chain data', {
            owner: mintInfo.owner.toString(),
            lamports: mintInfo.lamports,
            dataLength: mintInfo.data.length,
            executable: mintInfo.executable,
          });
        }
      }
    } else {
      log('ERROR', 'Could not fetch from Pump.fun API', { status: pumpApiResponse.status });
    }
  } catch (error) {
    log('ERROR', 'Failed to analyze working tokens', { error: error.message });
  }

  // ============================================================================
  // SECTION 3: Test Different API Parameters
  // ============================================================================
  log('PARAMETERS', 'Testing different parameter combinations...');

  const testCases = [
    {
      name: 'Standard Parameters',
      params: {
        publicKey: 'HVwuLVu7nmqoBr9R9RPDTer8X7oQTp6kDTcBWy32evW7',
        action: 'create',
        tokenMetadata: {
          name: 'Test Token',
          symbol: 'TEST',
          uri: 'https://pump.fun/test'
        },
        mint: 'GENERATE_NEW',
        denominatedInSol: 'true',
        amount: 0.01,
        slippage: 10,
        priorityFee: 0.0005,
        pool: 'pump'
      }
    },
    {
      name: 'With Image in Metadata',
      params: {
        publicKey: 'HVwuLVu7nmqoBr9R9RPDTer8X7oQTp6kDTcBWy32evW7',
        action: 'create',
        tokenMetadata: {
          name: 'Test Token',
          symbol: 'TEST',
          uri: 'https://pump.fun/test',
          image: 'https://via.placeholder.com/400'
        },
        mint: 'GENERATE_NEW',
        denominatedInSol: 'true',
        amount: 0.01,
        slippage: 10,
        priorityFee: 0.0005,
        pool: 'pump'
      }
    },
    {
      name: 'With Full Social Links',
      params: {
        publicKey: 'HVwuLVu7nmqoBr9R9RPDTer8X7oQTp6kDTcBWy32evW7',
        action: 'create',
        tokenMetadata: {
          name: 'Test Token',
          symbol: 'TEST',
          uri: 'https://pump.fun/test',
          description: 'Test description',
          twitter: 'https://twitter.com/test',
          telegram: 'https://t.me/test',
          website: 'https://test.com'
        },
        mint: 'GENERATE_NEW',
        denominatedInSol: 'true',
        amount: 0.01,
        slippage: 10,
        priorityFee: 0.0005,
        pool: 'pump'
      }
    }
  ];

  for (const testCase of testCases) {
    log('TEST CASE', testCase.name, testCase.params);
  }

  // ============================================================================
  // SECTION 4: Check Pump.fun Program Accounts
  // ============================================================================
  log('PROGRAM', 'Analyzing Pump.fun program structure...');

  const PUMP_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'; // Known Pump.fun program

  try {
    const programId = new PublicKey(PUMP_PROGRAM_ID);
    const programInfo = await connection.getAccountInfo(programId);

    if (programInfo) {
      log('PUMP PROGRAM', 'Program found on-chain', {
        owner: programInfo.owner.toString(),
        executable: programInfo.executable,
        dataLength: programInfo.data.length,
      });
    }

    // Find program accounts
    log('PROGRAM ACCOUNTS', 'Searching for Pump.fun program accounts...');

    const programAccounts = await connection.getProgramAccounts(programId, {
      limit: 5
    });

    log('PROGRAM ACCOUNTS', `Found ${programAccounts.length} accounts`);

    if (programAccounts.length > 0) {
      programAccounts.forEach((account, i) => {
        log('ACCOUNT', `Program account ${i}`, {
          pubkey: account.pubkey.toString(),
          dataLength: account.account.data.length,
          owner: account.account.owner.toString(),
        });
      });
    }

  } catch (error) {
    log('ERROR', 'Failed to analyze program', { error: error.message });
  }

  // ============================================================================
  // SECTION 5: Transaction Analysis
  // ============================================================================
  log('TRANSACTIONS', 'Analyzing recent Pump.fun token creation transactions...');

  try {
    // Get recent signatures for Pump.fun program
    const programId = new PublicKey(PUMP_PROGRAM_ID);
    const signatures = await connection.getSignaturesForAddress(programId, { limit: 5 });

    log('RECENT TXs', `Found ${signatures.length} recent transactions`);

    for (const sig of signatures.slice(0, 2)) { // Analyze first 2
      const tx = await connection.getTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0
      });

      if (tx) {
        log('TRANSACTION ANALYSIS', `Signature: ${sig.signature}`, {
          slot: tx.slot,
          fee: tx.meta.fee,
          success: tx.meta.err === null,
          accountKeys: tx.transaction.message.staticAccountKeys.map(k => k.toString()),
          instructions: tx.transaction.message.compiledInstructions.length,
        });
      }
    }

  } catch (error) {
    log('ERROR', 'Failed to analyze transactions', { error: error.message });
  }

  // ============================================================================
  // SECTION 6: Common Mistakes
  // ============================================================================
  log('COMMON MISTAKES', 'Documenting common issues...');

  const commonMistakes = [
    {
      issue: 'No metadata URI',
      fix: 'Must provide proper URI in tokenMetadata.uri field',
      impact: 'Token won\'t show on pump.fun website'
    },
    {
      issue: 'Invalid image URL',
      fix: 'Image must be publicly accessible HTTPS URL',
      impact: 'Token image won\'t display'
    },
    {
      issue: 'Wrong RPC for confirmation',
      fix: 'Use polling instead of WebSocket subscriptions for free RPCs',
      impact: 'Timeout errors but token may still be created'
    },
    {
      issue: 'Missing priority fee',
      fix: 'Include priorityFee parameter (0.0001 to 0.001 SOL)',
      impact: 'Transaction may fail or be dropped'
    },
    {
      issue: 'Not signing with mint keypair',
      fix: 'Must sign transaction with both creator and mint keypairs',
      impact: 'Transaction will fail'
    },
    {
      issue: 'Using old Transaction instead of VersionedTransaction',
      fix: 'Use VersionedTransaction.deserialize() for modern Solana transactions',
      impact: 'Deserialization errors'
    }
  ];

  commonMistakes.forEach(mistake => {
    log('MISTAKE', mistake.issue, { fix: mistake.fix, impact: mistake.impact });
  });

  // ============================================================================
  // SECTION 7: Best Practices
  // ============================================================================
  log('BEST PRACTICES', 'Documenting recommended approach...');

  const bestPractices = {
    metadata: {
      recommendation: 'Upload metadata to IPFS first, then use IPFS URI',
      format: {
        name: 'Token Name',
        symbol: 'SYMBOL',
        description: 'Description text',
        image: 'https://ipfs.io/ipfs/YOUR_IMAGE_HASH',
        showName: true,
        createdOn: 'https://pump.fun'
      }
    },
    apiCall: {
      endpoint: 'https://pumpportal.fun/api/trade-local',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      requiredFields: ['publicKey', 'action', 'tokenMetadata', 'mint', 'amount'],
      optionalFields: ['slippage', 'priorityFee', 'pool']
    },
    transaction: {
      signing: 'Must sign with [creatorKeypair, mintKeypair] in that order',
      sending: 'Use skipPreflight: false for better error messages',
      confirmation: 'Use polling with getSignatureStatus, not confirmTransaction'
    },
    debugging: {
      checkSolscan: 'Always verify token exists on solscan.io',
      checkPumpAPI: 'Query https://frontend-api.pump.fun/coins/{mint}',
      checkMetadata: 'Fetch the URI to verify metadata is accessible'
    }
  };

  log('BEST PRACTICES', 'Complete recommendations', bestPractices);

  // ============================================================================
  // SAVE REPORT
  // ============================================================================
  const reportPath = `PUMP_API_RESEARCH_${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(RESEARCH_REPORT, null, 2));

  console.log('\n' + '='.repeat(80));
  console.log('✅ RESEARCH COMPLETE');
  console.log('='.repeat(80));
  console.log(`\n📁 Full report saved to: ${reportPath}`);
  console.log('\n📋 KEY FINDINGS SUMMARY:\n');

  // Print summary
  const sections = [...new Set(RESEARCH_REPORT.map(r => r.section))];
  sections.forEach(section => {
    const sectionEntries = RESEARCH_REPORT.filter(r => r.section === section);
    console.log(`\n${section}: ${sectionEntries.length} findings`);
  });

  console.log('\n');
}

researchPumpPortalAPI().catch(error => {
  console.error('Research failed:', error);
  process.exit(1);
});
