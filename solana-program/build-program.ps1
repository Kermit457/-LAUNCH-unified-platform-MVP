# Build Solana programs using cargo-build-sbf
# This script builds both programs without requiring Anchor CLI

param(
    [switch]$Release
)

Set-Location "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

$buildType = if ($Release) { "release" } else { "debug" }
$buildFlag = if ($Release) { "--release" } else { "" }

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building LaunchOS Solana Programs" -ForegroundColor Cyan
Write-Host "Build Type: $buildType" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create target directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "target/deploy" | Out-Null

# Build launchos-curve
Write-Host "[1/2] Building launchos-curve..." -ForegroundColor Green
cargo build-sbf --manifest-path "programs/launchos-curve/Cargo.toml" $buildFlag

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to build launchos-curve" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/2] Building launchos-escrow..." -ForegroundColor Green
cargo build-sbf --manifest-path "programs/launchos-escrow/Cargo.toml" $buildFlag

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to build launchos-escrow" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Show build artifacts
if (Test-Path "target/deploy/*.so") {
    Write-Host "Built programs:" -ForegroundColor Yellow
    Get-ChildItem "target/deploy/*.so" | ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 2)
        Write-Host "  $($_.Name) - ${size} KB" -ForegroundColor White
    }
    Write-Host ""
}

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Deploy to devnet:" -ForegroundColor White
Write-Host "     solana program deploy target/deploy/launchos_curve.so --url devnet" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Or use Anchor (if available):" -ForegroundColor White
Write-Host "     anchor deploy --provider.cluster devnet" -ForegroundColor Cyan
Write-Host ""
