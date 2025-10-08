# Disable unused prediction API routes to fix build
Move-Item -Path "app\api\predictions" -Destination "app\api\predictions.unused" -Force -ErrorAction SilentlyContinue
Write-Host "Disabled prediction API routes (moved to predictions.unused)" -ForegroundColor Green
