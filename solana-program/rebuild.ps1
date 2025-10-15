# Quick rebuild script
Set-Location "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

Write-Host "Rebuilding launchos-curve..." -ForegroundColor Cyan
cargo build-sbf --manifest-path "programs/launchos-curve/Cargo.toml" 2>&1 | Select-String -Pattern "Error|Finished|Stack"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Build completed without stack overflow!" -ForegroundColor Green

    # Show program size
    if (Test-Path "target/deploy/launchos_curve.so") {
        $size = [math]::Round((Get-Item "target/deploy/launchos_curve.so").Length / 1KB, 2)
        Write-Host "Program size: ${size} KB" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Build failed - see errors above" -ForegroundColor Red
}
