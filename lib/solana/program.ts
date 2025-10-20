// Stub file to prevent build errors
// Original file renamed to program.ts.unused due to Anchor API compatibility issues

import { PublicKey } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey('Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF');

export function getCurveProgram(wallet: any): any {
  throw new Error('getCurveProgram not implemented - see program.ts.unused');
}

export function getCurvePDA(twitterHandle: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('curve'), Buffer.from(twitterHandle)],
    PROGRAM_ID
  );
  return pda;
}

export function getReserveVaultPDA(curvePda: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('reserve_vault'), curvePda.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getKeyHolderPDA(curvePda: PublicKey, holderPubkey: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('key_holder'), curvePda.toBuffer(), holderPubkey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getConfigPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    PROGRAM_ID
  );
  return pda;
}

export function getBanListPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('ban_list')],
    PROGRAM_ID
  );
  return pda;
}

export async function deserializeCurveAccount(program: any, curvePda: PublicKey) {
  throw new Error('deserializeCurveAccount not implemented - see program.ts.unused');
}

export type LaunchosCurveProgram = any;