# Disable unused legacy API routes to fix build

Write-Host "Disabling legacy API routes..." -ForegroundColor Yellow

# Move social API routes
if (Test-Path "app\api\social") {
    Move-Item -Path "app\api\social" -Destination "app\api\social.unused" -Force -ErrorAction SilentlyContinue
    Write-Host "Disabled social API routes" -ForegroundColor Green
}

Write-Host "Done! Legacy APIs disabled." -ForegroundColor Green
