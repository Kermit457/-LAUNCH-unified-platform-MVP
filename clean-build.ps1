# Clean build script to fix OneDrive symlink issues

Write-Host "Cleaning .next folder..." -ForegroundColor Yellow

# Stop any processes that might be locking files
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Remove .next folder with force
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

    # If still exists, try alternate method
    if (Test-Path ".next") {
        cmd /c "rmdir /s /q .next" 2>$null
    }
}

Write-Host "Cleaned .next folder" -ForegroundColor Green

# Run build
Write-Host ""
Write-Host "Building..." -ForegroundColor Yellow
npm run build
