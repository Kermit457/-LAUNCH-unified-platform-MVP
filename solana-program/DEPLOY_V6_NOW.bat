@echo off
echo ========================================
echo    DEPLOYING V6 CONTRACT USING WSL
echo ========================================
echo.

echo Running deployment in WSL...
echo.

REM Run the deployment script in WSL
wsl -e bash -c "cd '/mnt/c/Users/mirko/OneDrive/Desktop/WIDGETS FOR LAUNCH/solana-program' && chmod +x deploy-v6-wsl.sh && ./deploy-v6-wsl.sh"

echo.
echo ========================================
echo         DEPLOYMENT COMPLETE
echo ========================================
echo.
pause