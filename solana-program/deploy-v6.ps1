# V6 Contract Deployment Script
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "    LaunchOS V6 Contract Deployment to Devnet    " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "V6 Updates:" -ForegroundColor Yellow
Write-Host "- 3% referral with flexible routing" -ForegroundColor Green
Write-Host "- 1% guaranteed project minimum" -ForegroundColor Green
Write-Host "- Manual freeze only (no auto-freeze)" -ForegroundColor Green
Write-Host "- Direct wallet transfers (no PDAs)" -ForegroundColor Green
Write-Host ""

# Change to project directory
Set-Location "c:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

# Check current balance
Write-Host "Checking wallet balance..." -ForegroundColor Yellow
$balance = solana balance
Write-Host "Current balance: $balance" -ForegroundColor Cyan
Write-Host ""

# Build the contract
Write-Host "Building V6 contract..." -ForegroundColor Yellow
Write-Host "Running: anchor build" -ForegroundColor Gray
anchor build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""

    # Deploy to devnet
    Write-Host "Deploying to devnet..." -ForegroundColor Yellow
    Write-Host "Running: anchor deploy --provider.cluster devnet" -ForegroundColor Gray
    anchor deploy --provider.cluster devnet

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==================================================" -ForegroundColor Green
        Write-Host "       ✅ V6 DEPLOYMENT SUCCESSFUL!              " -ForegroundColor Green
        Write-Host "==================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Program ID: Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Yellow
        Write-Host "1. Frontend should auto-connect (ID unchanged)" -ForegroundColor White
        Write-Host "2. Test curve creation with V6 fees" -ForegroundColor White
        Write-Host "3. Test manual freeze at 32+ SOL" -ForegroundColor White
        Write-Host "4. Test Pump.fun launch integration" -ForegroundColor White
    }
    else {
        Write-Host ""
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        Write-Host "Check if you have enough SOL (need ~4 SOL)" -ForegroundColor Yellow
    }
}
else {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")