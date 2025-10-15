# Upgrade Privy to Latest Version
Write-Host "Upgrading Privy to latest version..." -ForegroundColor Cyan

# Stop dev server if running
Write-Host "[1/4] Stopping dev server..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1
Write-Host "  [OK] Dev server stopped" -ForegroundColor Green

# Upgrade Privy
Write-Host "[2/4] Upgrading @privy-io/react-auth to latest version..."
npm install @privy-io/react-auth@latest --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Privy upgraded successfully" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Privy upgrade failed" -ForegroundColor Red
    exit 1
}

# Clear build cache
Write-Host "[3/4] Clearing build cache..."
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  [OK] Build cache cleared" -ForegroundColor Green
} else {
    Write-Host "  [OK] No build cache found" -ForegroundColor Green
}

# Start dev server
Write-Host "[4/4] Starting development server..."
Write-Host ""
Write-Host "Starting npm run dev..." -ForegroundColor Yellow
Write-Host "After it starts, visit: http://localhost:3000/test-solana" -ForegroundColor Cyan
Write-Host ""

npm run dev
