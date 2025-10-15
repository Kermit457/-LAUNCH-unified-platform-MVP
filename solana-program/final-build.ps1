# Final complete build of all programs
Set-Location "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FINAL BUILD - LaunchOS Programs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Build both programs
Write-Host "[1/2] Building launchos-curve..." -ForegroundColor Green
$curve_output = cargo build-sbf --manifest-path "programs/launchos-curve/Cargo.toml" 2>&1

$curve_error = $curve_output | Select-String -Pattern "error:|Stack offset.*exceeded"
if ($curve_error) {
    Write-Host "ERRORS in launchos-curve:" -ForegroundColor Red
    Write-Host $curve_error
    exit 1
}

Write-Host ""
Write-Host "[2/2] Building launchos-escrow..." -ForegroundColor Green
$escrow_output = cargo build-sbf --manifest-path "programs/launchos-escrow/Cargo.toml" 2>&1

$escrow_error = $escrow_output | Select-String -Pattern "error:"
if ($escrow_error) {
    Write-Host "ERRORS in launchos-escrow:" -ForegroundColor Red
    Write-Host $escrow_error
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Show program details
Write-Host "Built Programs:" -ForegroundColor Yellow
Write-Host ""

if (Test-Path "target/deploy/launchos_curve.so") {
    $size = [math]::Round((Get-Item "target/deploy/launchos_curve.so").Length / 1KB, 2)
    Write-Host "  launchos_curve.so" -ForegroundColor White
    Write-Host "    Size: ${size} KB" -ForegroundColor Cyan
    Write-Host "    Features: V4 Bonding Curve with Referrals" -ForegroundColor Gray
    Write-Host ""
}

if (Test-Path "target/deploy/launchos_escrow.so") {
    $size = [math]::Round((Get-Item "target/deploy/launchos_escrow.so").Length / 1KB, 2)
    Write-Host "  launchos_escrow.so" -ForegroundColor White
    Write-Host "    Size: ${size} KB" -ForegroundColor Cyan
    Write-Host "    Features: Multi-Pool Escrow System" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "READY FOR DEPLOYMENT" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Deploy to devnet:" -ForegroundColor Yellow
Write-Host "  solana config set --url devnet" -ForegroundColor White
Write-Host "  solana program deploy target/deploy/launchos_curve.so" -ForegroundColor White
Write-Host ""
Write-Host "Or deploy with Anchor:" -ForegroundColor Yellow
Write-Host "  anchor deploy --provider.cluster devnet" -ForegroundColor White
Write-Host ""
