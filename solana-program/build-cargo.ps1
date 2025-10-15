# LaunchOS Curve V4 Build Script (Using Cargo)

Write-Host "Building LaunchOS Curve V4 with Cargo..." -ForegroundColor Cyan

# Navigate to project directory
Set-Location $PSScriptRoot

# Build using cargo instead of anchor
Write-Host "`nRunning cargo build-sbf..." -ForegroundColor Yellow

# Build launchos-curve program
Write-Host "`nBuilding launchos-curve..." -ForegroundColor Cyan
Set-Location ".\programs\launchos-curve"
cargo build-sbf

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nlaunchos-curve build successful!" -ForegroundColor Green
} else {
    Write-Host "`nlaunchos-curve build failed!" -ForegroundColor Red
}

# Build launchos-escrow program
Write-Host "`nBuilding launchos-escrow..." -ForegroundColor Cyan
Set-Location "..\launchos-escrow"
cargo build-sbf

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nlaunchos-escrow build successful!" -ForegroundColor Green
} else {
    Write-Host "`nlaunchos-escrow build failed!" -ForegroundColor Red
}

# Return to root
Set-Location "..\..\"

Write-Host "`nBuild complete! Check for .so files in target/deploy/" -ForegroundColor Cyan
