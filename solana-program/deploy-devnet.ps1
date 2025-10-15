# LaunchOS Curve Program - Devnet Deployment Script
# Run this script in PowerShell

Write-Host "=== LaunchOS Curve Program Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the program
Write-Host "Step 1: Building the Anchor program..." -ForegroundColor Yellow
anchor build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Configure Solana CLI for devnet
Write-Host "Step 2: Configuring Solana CLI for devnet..." -ForegroundColor Yellow
solana config set --url devnet

Write-Host ""

# Step 3: Check wallet balance
Write-Host "Step 3: Checking wallet balance..." -ForegroundColor Yellow
$balance = solana balance

Write-Host "Current balance: $balance" -ForegroundColor Cyan
Write-Host ""

# Step 4: Airdrop if needed (optional - user can skip)
Write-Host "Do you need devnet SOL? (y/n)" -ForegroundColor Yellow
$response = Read-Host
if ($response -eq "y") {
    Write-Host "Requesting airdrop of 2 SOL..." -ForegroundColor Yellow
    solana airdrop 2
    Write-Host ""
}

# Step 5: Deploy to devnet
Write-Host "Step 5: Deploying to devnet..." -ForegroundColor Yellow
anchor deploy --provider.cluster devnet

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Note your program ID from the output above"
Write-Host "2. Update declare_id! in lib.rs if needed"
Write-Host "3. Run tests to verify the deployment"
Write-Host ""
