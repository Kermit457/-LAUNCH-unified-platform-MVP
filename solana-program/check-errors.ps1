# Check for compilation errors

Write-Host "Checking launchos-curve for errors..." -ForegroundColor Cyan

Set-Location "$PSScriptRoot\programs\launchos-curve"

Write-Host "`nRunning cargo check..." -ForegroundColor Yellow
cargo check 2>&1 | Tee-Object -FilePath "..\..\check-errors.log"

Write-Host "`nErrors logged to check-errors.log" -ForegroundColor Green
Write-Host "Check the log file for details" -ForegroundColor Yellow

Set-Location "..\..\"
