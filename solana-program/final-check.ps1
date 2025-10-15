# Final compilation check
Set-Location "C:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Running final cargo check..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

cargo check 2>&1 | Tee-Object -FilePath "final-check.log"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: All programs compiled without errors!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run 'anchor build' to build the full program" -ForegroundColor White
    Write-Host "  2. Deploy to devnet for testing" -ForegroundColor White
    Write-Host "  3. Run integration tests" -ForegroundColor White
} else {
    Write-Host "ERRORS FOUND: Check final-check.log for details" -ForegroundColor Red
}

Write-Host "==================================================" -ForegroundColor Cyan
