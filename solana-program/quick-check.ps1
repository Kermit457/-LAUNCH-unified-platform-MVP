# Quick compilation check
Set-Location "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

Write-Host "Running cargo check..." -ForegroundColor Cyan
cargo check 2>&1 | Select-String -Pattern "error" -Context 2,2

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: All programs compiled!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Errors found - see above" -ForegroundColor Red
}
