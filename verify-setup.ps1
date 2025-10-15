# Verify Solana integration setup
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verifying Solana Integration Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check 1: Packages
Write-Host "[1/5] Checking npm packages..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$hasWeb3 = $packageJson.dependencies.'@solana/web3.js'
$hasAnchor = $packageJson.dependencies.'@coral-xyz/anchor'

if ($hasWeb3 -and $hasAnchor) {
    Write-Host "  [OK] Solana packages installed" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Missing Solana packages" -ForegroundColor Red
    $allGood = $false
}

# Check 2: Directories
Write-Host "[2/5] Checking directories..." -ForegroundColor Yellow
$dirs = @("lib\idl", "lib\solana", "hooks")
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "  [OK] $dir exists" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $dir missing" -ForegroundColor Red
        $allGood = $false
    }
}

# Check 3: IDL file
Write-Host "[3/5] Checking IDL file..." -ForegroundColor Yellow
if (Test-Path "lib\idl\launchos_curve.json") {
    $idlSize = (Get-Item "lib\idl\launchos_curve.json").Length
    Write-Host "  [OK] IDL file exists ($idlSize bytes)" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] IDL file missing" -ForegroundColor Red
    $allGood = $false
}

# Check 4: Config files
Write-Host "[4/5] Checking config files..." -ForegroundColor Yellow
$configFiles = @("lib\solana\config.ts", "lib\solana\program.ts")
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file exists" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $file missing" -ForegroundColor Red
        $allGood = $false
    }
}

# Check 5: Environment variables
Write-Host "[5/5] Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $env = Get-Content ".env.local"
    $hasProgramId = $env -match "NEXT_PUBLIC_CURVE_PROGRAM_ID"
    $hasNetwork = $env -match "NEXT_PUBLIC_SOLANA_NETWORK"

    if ($hasProgramId -and $hasNetwork) {
        Write-Host "  [OK] Environment variables configured" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Missing some environment variables" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "  [FAIL] .env.local not found" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "SUCCESS: Setup Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your Solana integration is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Program IDs (Devnet):" -ForegroundColor Yellow
    Write-Host "  Curve:  Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF" -ForegroundColor White
    Write-Host "  Escrow: 5BQeJxss39ftLC9guf5oyde6x6hkCgAwTB3wk6DF1qRc" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Review lib/solana/config.ts" -ForegroundColor White
    Write-Host "  2. Create hooks/useBuyKeys.ts" -ForegroundColor White
    Write-Host "  3. Build your first component!" -ForegroundColor White
    Write-Host ""
    Write-Host "See SOLANA_INTEGRATION_GUIDE.md for examples" -ForegroundColor Gray
} else {
    Write-Host "ISSUES FOUND: Please fix errors above" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
}

Write-Host ""
