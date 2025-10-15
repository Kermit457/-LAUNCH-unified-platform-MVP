# Airdrop SOL and deploy programs to devnet
Set-Location "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Devnet Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check current balance
Write-Host "Checking current balance..." -ForegroundColor Yellow
$balance = solana balance
Write-Host "Current balance: $balance" -ForegroundColor White
Write-Host ""

# Request airdrops (devnet allows 5 SOL at a time, request multiple times)
Write-Host "Requesting SOL airdrops from devnet faucet..." -ForegroundColor Yellow
Write-Host ""

for ($i = 1; $i -le 3; $i++) {
    Write-Host "  Airdrop $i of 3 (2 SOL)..." -ForegroundColor Cyan
    solana airdrop 2
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Final balance:" -ForegroundColor Yellow
$newBalance = solana balance
Write-Host $newBalance -ForegroundColor Green
Write-Host ""

# Check if we have enough SOL
$balanceNum = [double]($newBalance -replace '[^\d.]','')
if ($balanceNum -lt 4) {
    Write-Host "WARNING: Balance is still low ($newBalance)" -ForegroundColor Red
    Write-Host "You may need to use the web faucet: https://faucet.solana.com" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue with deployment anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Deployment cancelled." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Programs to Devnet" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Deploy launchos-curve
Write-Host "[1/2] Deploying launchos-curve..." -ForegroundColor Green
Write-Host ""

$curveOutput = solana program deploy target/deploy/launchos_curve.so 2>&1 | Out-String

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: launchos-curve deployed!" -ForegroundColor Green

    # Extract program ID
    $programId = $curveOutput | Select-String -Pattern "Program Id: (\w+)" | ForEach-Object { $_.Matches.Groups[1].Value }

    if ($programId) {
        Write-Host "Program ID: $programId" -ForegroundColor Cyan

        # Save to file
        @"
# LaunchOS Curve Program IDs

## Devnet
Program ID: $programId
Deployed: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Configuration
Add this to your frontend config:

``````typescript
const LAUNCHOS_CURVE_PROGRAM_ID = new PublicKey("$programId");
``````

"@ | Out-File -FilePath "PROGRAM_IDS.md" -Encoding UTF8

        Write-Host "Saved to PROGRAM_IDS.md" -ForegroundColor Gray
    }
} else {
    Write-Host "ERROR: Failed to deploy launchos-curve" -ForegroundColor Red
    Write-Host $curveOutput -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[2/2] Deploying launchos-escrow..." -ForegroundColor Green
Write-Host ""

$escrowOutput = solana program deploy target/deploy/launchos_escrow.so 2>&1 | Out-String

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: launchos-escrow deployed!" -ForegroundColor Green

    # Extract program ID
    $programId = $escrowOutput | Select-String -Pattern "Program Id: (\w+)" | ForEach-Object { $_.Matches.Groups[1].Value }

    if ($programId) {
        Write-Host "Program ID: $programId" -ForegroundColor Cyan

        # Append to file
        @"

## Escrow Program
Program ID: $programId
Deployed: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

``````typescript
const LAUNCHOS_ESCROW_PROGRAM_ID = new PublicKey("$programId");
``````
"@ | Out-File -FilePath "PROGRAM_IDS.md" -Encoding UTF8 -Append
    }
} else {
    Write-Host "ERROR: Failed to deploy launchos-escrow" -ForegroundColor Red
    Write-Host $escrowOutput -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Program IDs saved to: PROGRAM_IDS.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update your frontend with these Program IDs" -ForegroundColor White
Write-Host "  2. Initialize the config accounts" -ForegroundColor White
Write-Host "  3. Create a test bonding curve" -ForegroundColor White
Write-Host "  4. Test buy/sell operations" -ForegroundColor White
Write-Host ""
Write-Host "Check remaining balance:" -ForegroundColor Yellow
solana balance
Write-Host ""
