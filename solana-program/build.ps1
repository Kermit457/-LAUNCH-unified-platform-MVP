# LaunchOS Curve V4 Build Script

Write-Host "Building LaunchOS Curve V4..." -ForegroundColor Cyan

# Navigate to project directory
Set-Location $PSScriptRoot

# Build the program
Write-Host "`nRunning anchor build..." -ForegroundColor Yellow
anchor build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBuild successful!" -ForegroundColor Green
    Write-Host "`nProgram artifacts:" -ForegroundColor Cyan
    Get-ChildItem -Path ".\target\deploy\" -Filter "*.so" | ForEach-Object {
        Write-Host "  $($_.Name)" -ForegroundColor White
    }

    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "  1. anchor test         - Run tests"
    Write-Host "  2. anchor deploy       - Deploy to devnet"
    Write-Host "  3. See V4_IMPLEMENTATION_COMPLETE.md for full details"
} else {
    Write-Host "`nBuild failed. Check errors above." -ForegroundColor Red
    exit 1
}
