# Quick cargo check script
Set-Location "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

Write-Host "Running cargo check..." -ForegroundColor Cyan
cargo check 2>&1 | Tee-Object -FilePath "check-build.log"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: No compilation errors found!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERRORS FOUND: Check check-build.log for details" -ForegroundColor Red
}
