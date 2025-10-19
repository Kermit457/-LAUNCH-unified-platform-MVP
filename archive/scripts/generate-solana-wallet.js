/**
 * Generate a Solana wallet for Pump.fun
 * Run: node scripts/generate-solana-wallet.js
 */

const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');
const path = require('path');

console.log('🔑 Generating new Solana wallet...\n');

// Generate new keypair
const keypair = Keypair.generate();

// Get public key (wallet address)
const publicKey = keypair.publicKey.toBase58();

// Get private key in base58 format (for .env)
const privateKey = bs58.encode(keypair.secretKey);

// Get private key array (for backup)
const privateKeyArray = Array.from(keypair.secretKey);

console.log('✅ Wallet generated successfully!\n');
console.log('=' .repeat(70));
console.log('PUBLIC KEY (Wallet Address):');
console.log(publicKey);
console.log('=' .repeat(70));
console.log('\nPRIVATE KEY (Base58 - for .env.local):');
console.log(privateKey);
console.log('=' .repeat(70));
console.log('\nPRIVATE KEY ARRAY (for backup):');
console.log('[' + privateKeyArray.join(',') + ']');
console.log('=' .repeat(70));

// Save to file for backup
const walletData = {
  publicKey,
  privateKey,
  privateKeyArray,
  generated: new Date().toISOString()
};

const backupPath = path.join(__dirname, '..', '.pump-wallet.json');
fs.writeFileSync(backupPath, JSON.stringify(walletData, null, 2));

console.log('\n📁 Wallet backed up to: .pump-wallet.json');
console.log('⚠️  IMPORTANT: Add .pump-wallet.json to .gitignore!');
console.log('\n📝 Next steps:');
console.log('1. Copy the PRIVATE KEY (Base58) above');
console.log('2. Add to .env.local:');
console.log('   PUMP_FUN_CREATOR_PRIVATE_KEY=' + privateKey.substring(0, 10) + '...');
console.log('\n3. Fund your wallet:');
console.log('   - Devnet: Visit https://faucet.solana.com/');
console.log('   - Mainnet: Send SOL to ' + publicKey);
console.log('\n🚨 SECURITY WARNING:');
console.log('   - Never share your private key!');
console.log('   - Never commit it to Git!');
console.log('   - Keep .pump-wallet.json secure!');