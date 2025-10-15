# Install Anchor CLI using cargo
# This will install the Anchor framework globally

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Anchor CLI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This will install Anchor CLI v0.30.1 using cargo..." -ForegroundColor Yellow
Write-Host "This may take 5-10 minutes." -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Continue? (y/n)"
if ($response -ne "y") {
    Write-Host "Installation cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Installing anchor-cli@0.30.1..." -ForegroundColor Green

cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Installing Anchor version manager..." -ForegroundColor Green
    avm install 0.30.1
    avm use 0.30.1

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "SUCCESS: Anchor CLI installed!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Verify installation:" -ForegroundColor Yellow
    anchor --version
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "ERROR: Installation failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Alternative: Use build-program.ps1 to build without Anchor CLI" -ForegroundColor Yellow
}
