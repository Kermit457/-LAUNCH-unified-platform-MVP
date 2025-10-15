# Ultra-quick rebuild - just the curve program
Set-Location "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

Write-Host "Building launchos-curve..." -ForegroundColor Cyan

$output = cargo build-sbf --manifest-path "programs/launchos-curve/Cargo.toml" 2>&1

# Check for stack overflow error
$stackError = $output | Select-String -Pattern "Stack offset.*exceeded"

if ($stackError) {
    Write-Host ""
    Write-Host "STACK OVERFLOW STILL PRESENT:" -ForegroundColor Red
    Write-Host $stackError -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "SUCCESS: No stack overflow!" -ForegroundColor Green
}

# Show final status
$finalLine = $output | Select-String -Pattern "Finished|Error:" | Select-Object -Last 1
Write-Host $finalLine -ForegroundColor Cyan

# Show program size
if (Test-Path "target/deploy/launchos_curve.so") {
    $size = [math]::Round((Get-Item "target/deploy/launchos_curve.so").Length / 1KB, 2)
    Write-Host "Program size: ${size} KB" -ForegroundColor White
}
