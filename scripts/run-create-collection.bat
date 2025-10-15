@echo off
echo.
echo ========================================
echo  Creating price_history collection
echo ========================================
echo.
cd /d "%~dp0\.."
node scripts/create-price-history-collection.js
echo.
pause
