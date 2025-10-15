import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';

export const CURVE_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_CURVE_PROGRAM_ID || 'Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF'
);

export const ESCROW_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_ESCROW_PROGRAM_ID || '5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc'
);

export const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl(SOLANA_NETWORK);
export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

export function getExplorerUrl(address: string, type: 'address' | 'tx' = 'address'): string {
  const cluster = SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : '';
  return `https://explorer.solana.com/${type}/${address}${cluster}`;
}
