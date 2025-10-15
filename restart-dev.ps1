# Restart Development Server
Write-Host "Restarting Next.js development server..." -ForegroundColor Cyan

# Stop any running node processes
Write-Host "[1/3] Stopping node processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
if ($?) {
    Write-Host "  [OK] Node processes stopped" -ForegroundColor Green
} else {
    Write-Host "  [OK] No node processes found" -ForegroundColor Green
}

# Clear Next.js build cache
Write-Host "[2/3] Clearing build cache..."
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  [OK] Build cache cleared" -ForegroundColor Green
} else {
    Write-Host "  [OK] No build cache found" -ForegroundColor Green
}

# Start dev server
Write-Host "[3/3] Starting development server..."
Write-Host ""
Write-Host "Starting npm run dev..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
