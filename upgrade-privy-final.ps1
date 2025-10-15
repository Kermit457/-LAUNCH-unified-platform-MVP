# Upgrade Privy SDK to Latest with Solana Support
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Upgrading Privy SDK to Latest Version with Solana Support" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Stop dev server
Write-Host "[1/6] Stopping development server..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "  ✓ Server stopped" -ForegroundColor Green
Write-Host ""

# Check current version
Write-Host "[2/6] Checking current version..." -ForegroundColor Yellow
$currentVersion = npm ls @privy-io/react-auth 2>&1 | Select-String "@privy-io/react-auth@"
Write-Host "  Current: $currentVersion" -ForegroundColor Gray
Write-Host ""

# Upgrade Privy
Write-Host "[3/6] Upgrading @privy-io/react-auth to latest..." -ForegroundColor Yellow
Write-Host "  This may take 30-60 seconds..." -ForegroundColor Gray
npm install @privy-io/react-auth@latest --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Privy upgraded successfully" -ForegroundColor Green
    $newVersion = npm ls @privy-io/react-auth 2>&1 | Select-String "@privy-io/react-auth@"
    Write-Host "  New version: $newVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Upgrade failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try manually:" -ForegroundColor Yellow
    Write-Host "  npm install @privy-io/react-auth@latest --legacy-peer-deps" -ForegroundColor Cyan
    exit 1
}
Write-Host ""

# Clear .next cache
Write-Host "[4/6] Clearing Next.js build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  ✓ .next cache cleared" -ForegroundColor Green
} else {
    Write-Host "  ℹ No .next cache found" -ForegroundColor Gray
}

# Clear Vite cache if present
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite"
    Write-Host "  ✓ Vite cache cleared" -ForegroundColor Green
}
Write-Host ""

# Reinstall dependencies to refresh
Write-Host "[5/6] Refreshing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
Write-Host "  ✓ Dependencies refreshed" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "[6/6] Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start dev server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Open test page:" -ForegroundColor White
Write-Host "   http://localhost:3000/test-solana" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Click 'Create Solana Wallet' button" -ForegroundColor White
Write-Host ""
Write-Host "4. Expected result:" -ForegroundColor White
Write-Host "   ✓ Solana Connected: Yes" -ForegroundColor Green
Write-Host "   ✓ Solana Address: [44-character address]" -ForegroundColor Green
Write-Host "   ✓ All Linked Accounts shows 3 items" -ForegroundColor Green
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
