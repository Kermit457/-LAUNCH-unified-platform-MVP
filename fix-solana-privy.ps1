# Fix Solana Wallet Creation - Upgrade Privy
Write-Host "=" -ForegroundColor Cyan
Write-Host "Fixing Solana Wallet Creation Issue" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Cyan
Write-Host ""

# Stop dev server
Write-Host "[1/5] Stopping development server..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "  [OK] Server stopped" -ForegroundColor Green

# Show current version
Write-Host "[2/5] Checking current Privy version..."
$currentVersion = (Get-Content package.json | Select-String '@privy-io/react-auth').ToString()
Write-Host "  Current: $currentVersion" -ForegroundColor Yellow

# Upgrade Privy
Write-Host "[3/5] Upgrading @privy-io/react-auth to latest..."
Write-Host "  This may take 30-60 seconds..." -ForegroundColor Gray
npm install @privy-io/react-auth@latest --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Privy upgraded successfully" -ForegroundColor Green

    # Show new version
    $newVersion = (Get-Content package.json | Select-String '@privy-io/react-auth').ToString()
    Write-Host "  New version: $newVersion" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Upgrade failed. Check output above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Try manually:" -ForegroundColor Yellow
    Write-Host "  npm install @privy-io/react-auth@latest --legacy-peer-deps" -ForegroundColor Cyan
    exit 1
}

# Clear cache
Write-Host "[4/5] Clearing build cache..."
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  [OK] Cache cleared" -ForegroundColor Green
}

if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "  [OK] Module cache cleared" -ForegroundColor Green
}

# Summary
Write-Host "[5/5] Summary" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Start dev server: npm run dev" -ForegroundColor White
Write-Host "  2. Test with NEW account (incognito + different Twitter)" -ForegroundColor White
Write-Host "  3. Visit: http://localhost:3000/test-solana" -ForegroundColor White
Write-Host ""
Write-Host "What to look for:" -ForegroundColor Yellow
Write-Host "  - All Linked Accounts should show 3 items:" -ForegroundColor White
Write-Host "    1. twitter_oauth" -ForegroundColor Gray
Write-Host "    2. wallet (ethereum)" -ForegroundColor Gray
Write-Host "    3. wallet (solana) <- THIS ONE!" -ForegroundColor Green
Write-Host ""
Write-Host "Ready to test! Run: npm run dev" -ForegroundColor Cyan
