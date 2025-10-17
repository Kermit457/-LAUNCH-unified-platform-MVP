/**
 * Calculate Anchor instruction discriminator
 * Discriminator = first 8 bytes of sha256("global:INSTRUCTION_NAME")
 */

const crypto = require('crypto');

function calculateDiscriminator(instructionName) {
  const preimage = `global:${instructionName}`;
  const hash = crypto.createHash('sha256').update(preimage).digest();
  const discriminator = hash.slice(0, 8);

  console.log(`\nInstruction: ${instructionName}`);
  console.log(`Preimage: "${preimage}"`);
  console.log(`SHA256: ${hash.toString('hex')}`);
  console.log(`Discriminator (first 8 bytes): [${Array.from(discriminator).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(', ')}]`);
  console.log(`Discriminator (hex): ${discriminator.toString('hex')}`);

  return discriminator;
}

// Calculate discriminators for V6 curve instructions
console.log('='.repeat(60));
console.log('ANCHOR INSTRUCTION DISCRIMINATORS');
console.log('='.repeat(60));

calculateDiscriminator('buy_keys');
calculateDiscriminator('sell_keys');
calculateDiscriminator('create_curve');
calculateDiscriminator('activate_curve');
calculateDiscriminator('freeze_curve');

console.log('\n' + '='.repeat(60));