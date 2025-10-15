# Quick setup script for Solana integration
Set-Location "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH"

Write-Host "Setting up Solana integration..." -ForegroundColor Cyan
Write-Host ""

# Create directories
Write-Host "[1/5] Creating directories..." -ForegroundColor Green
New-Item -ItemType Directory -Force -Path "lib\idl" | Out-Null
New-Item -ItemType Directory -Force -Path "lib\solana" | Out-Null
New-Item -ItemType Directory -Force -Path "hooks" | Out-Null

# Copy IDL file
Write-Host "[2/5] Copying IDL file..." -ForegroundColor Green
Copy-Item "solana-program\target\idl\launchos_curve.json" "lib\idl\" -Force

# Create .env.local if it doesn't exist
Write-Host "[3/5] Setting up environment variables..." -ForegroundColor Green
if (!(Test-Path ".env.local")) {
    @"
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com

# Program IDs
NEXT_PUBLIC_CURVE_PROGRAM_ID=Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
NEXT_PUBLIC_ESCROW_PROGRAM_ID=5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "  Created .env.local" -ForegroundColor White
} else {
    Write-Host "  .env.local already exists, skipping..." -ForegroundColor Yellow
}

# Create config file
Write-Host "[4/5] Creating Solana config..." -ForegroundColor Green
@"
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';

// Program IDs
export const CURVE_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_CURVE_PROGRAM_ID || 'Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF'
);

export const ESCROW_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_ESCROW_PROGRAM_ID || '5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc'
);

// Network Configuration
export const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta';

export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl(SOLANA_NETWORK);

// Create connection
export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Explorer URL helper
export function getExplorerUrl(address: string, type: 'address' | 'tx' = 'address'): string {
  const cluster = SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : '';
  return ``https://explorer.solana.com/``${type}/``${address}``${cluster}``;
}
"@ | Out-File -FilePath "lib\solana\config.ts" -Encoding UTF8

Write-Host "[5/5] Creating program helpers..." -ForegroundColor Green
@"
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { CURVE_PROGRAM_ID, connection } from './config';
import IDL from '../idl/launchos_curve.json';

// Type for your program
export type LaunchosCurveProgram = Program<Idl>;

// Create program instance
export function getCurveProgram(wallet: any): LaunchosCurveProgram {
  const provider = new AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );

  return new Program(
    IDL as Idl,
    CURVE_PROGRAM_ID,
    provider
  );
}

// Helper to derive PDAs
export function getCurvePDA(twitterHandle: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('curve'),
      Buffer.from(twitterHandle)
    ],
    CURVE_PROGRAM_ID
  );
  return pda;
}

export function getKeyHolderPDA(curve: PublicKey, wallet: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('holder'),
      curve.toBuffer(),
      wallet.toBuffer()
    ],
    CURVE_PROGRAM_ID
  );
  return pda;
}

export function getConfigPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    CURVE_PROGRAM_ID
  );
  return pda;
}

export function getBanListPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('ban_list')],
    CURVE_PROGRAM_ID
  );
  return pda;
}
"@ | Out-File -FilePath "lib\solana\program.ts" -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files created:" -ForegroundColor Yellow
Write-Host "  lib/idl/launchos_curve.json" -ForegroundColor White
Write-Host "  lib/solana/config.ts" -ForegroundColor White
Write-Host "  lib/solana/program.ts" -ForegroundColor White
Write-Host "  .env.local (if new)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review .env.local for your Privy app ID" -ForegroundColor White
Write-Host "  2. See SOLANA_INTEGRATION_GUIDE.md for hooks" -ForegroundColor White
Write-Host "  3. Create a BuyKeysButton component" -ForegroundColor White
Write-Host ""
