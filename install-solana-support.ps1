# Install Solana Support for Privy
Write-Host "Installing Solana support for Privy..." -ForegroundColor Cyan
Write-Host ""

# Stop dev server
Write-Host "[1/3] Stopping dev server..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1
Write-Host "  [OK] Server stopped" -ForegroundColor Green

# Install packages
Write-Host "[2/3] Installing Privy Solana packages..."
Write-Host "  This may take 30-60 seconds..." -ForegroundColor Gray

# Note: @privy-io/react-auth/solana is imported from the main package, not a separate install
npm install @privy-io/react-auth@latest --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Packages installed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Installation failed" -ForegroundColor Red
    exit 1
}

# Clear cache
Write-Host "[3/3] Clearing build cache..."
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  [OK] Cache cleared" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Start dev server with: npm run dev" -ForegroundColor Cyan