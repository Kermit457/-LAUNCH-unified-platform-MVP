# Quick setup - run from parent directory
Set-Location ".."

Write-Host "Setting up Solana integration in parent directory..." -ForegroundColor Cyan
Write-Host ""

# Create directories
Write-Host "[1/5] Creating directories..." -ForegroundColor Green
New-Item -ItemType Directory -Force -Path "lib\idl" | Out-Null
New-Item -ItemType Directory -Force -Path "lib\solana" | Out-Null
New-Item -ItemType Directory -Force -Path "hooks" | Out-Null
Write-Host "  Created lib/idl, lib/solana, hooks" -ForegroundColor White

# Copy IDL file
Write-Host "[2/5] Copying IDL file..." -ForegroundColor Green
if (Test-Path "solana-program\target\idl\launchos_curve.json") {
    Copy-Item "solana-program\target\idl\launchos_curve.json" "lib\idl\" -Force
    Write-Host "  Copied launchos_curve.json" -ForegroundColor White
} else {
    Write-Host "  WARNING: IDL file not found!" -ForegroundColor Red
}

# Create .env.local
Write-Host "[3/5] Setting up environment variables..." -ForegroundColor Green
$envContent = @"
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com

# Program IDs (Devnet)
NEXT_PUBLIC_CURVE_PROGRAM_ID=Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
NEXT_PUBLIC_ESCROW_PROGRAM_ID=5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc
"@

if (Test-Path ".env.local") {
    Write-Host "  .env.local exists - appending Solana config..." -ForegroundColor Yellow
    Add-Content -Path ".env.local" -Value "`n$envContent"
} else {
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "  Created .env.local" -ForegroundColor White
}

# Create config.ts
Write-Host "[4/5] Creating lib/solana/config.ts..." -ForegroundColor Green
@"
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
  return ``https://explorer.solana.com/``${type}/``${address}``${cluster}``;
}
"@ | Out-File -FilePath "lib\solana\config.ts" -Encoding UTF8

# Create program.ts
Write-Host "[5/5] Creating lib/solana/program.ts..." -ForegroundColor Green
@"
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { CURVE_PROGRAM_ID, connection } from './config';
import IDL from '../idl/launchos_curve.json';

export type LaunchosCurveProgram = Program<Idl>;

export function getCurveProgram(wallet: any): LaunchosCurveProgram {
  const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
  return new Program(IDL as Idl, CURVE_PROGRAM_ID, provider);
}

export function getCurvePDA(twitterHandle: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('curve'), Buffer.from(twitterHandle)],
    CURVE_PROGRAM_ID
  );
  return pda;
}

export function getKeyHolderPDA(curve: PublicKey, wallet: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('holder'), curve.toBuffer(), wallet.toBuffer()],
    CURVE_PROGRAM_ID
  );
  return pda;
}

export function getConfigPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from('config')], CURVE_PROGRAM_ID);
  return pda;
}

export function getBanListPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from('ban_list')], CURVE_PROGRAM_ID);
  return pda;
}
"@ | Out-File -FilePath "lib\solana\program.ts" -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Created files:" -ForegroundColor Yellow
Get-ChildItem "lib\idl" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  lib/idl/$($_.Name)" -ForegroundColor White }
Get-ChildItem "lib\solana" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  lib/solana/$($_.Name)" -ForegroundColor White }
Write-Host ""
Write-Host "Next: See SOLANA_INTEGRATION_GUIDE.md for hooks & components" -ForegroundColor Cyan
Write-Host ""
