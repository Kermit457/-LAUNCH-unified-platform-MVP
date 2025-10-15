# Copy IDL file from Solana program to frontend
Write-Host "Copying IDL file..." -ForegroundColor Cyan

# Check if target IDL exists
$idlSource = "solana-program\target\idl\launchos_curve.json"
$idlDest = "lib\idl\launchos_curve.json"

if (Test-Path $idlSource) {
    Copy-Item $idlSource $idlDest -Force
    Write-Host "SUCCESS: IDL file copied!" -ForegroundColor Green
    Write-Host "  From: $idlSource" -ForegroundColor White
    Write-Host "  To:   $idlDest" -ForegroundColor White
} else {
    Write-Host "ERROR: IDL file not found at $idlSource" -ForegroundColor Red
    Write-Host ""
    Write-Host "The IDL file should be generated when you build with Anchor." -ForegroundColor Yellow
    Write-Host "Try running: anchor build" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Alternatively, I can generate it from the program code." -ForegroundColor Yellow
}
