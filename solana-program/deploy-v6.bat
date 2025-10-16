@echo off
echo Deploying V6 contract to devnet...
echo.
echo V6 Features:
echo - 94%% reserve, 3%% referral (flexible), 1%% project, 1%% buyback, 1%% community
echo - Manual freeze only at 32+ SOL
echo - Direct wallet transfers (no PDAs for fees)
echo.

cd /d "c:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

echo Current Program ID: Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
echo.

echo Checking wallet balance...
solana balance

echo.
echo Deploying to devnet...
anchor deploy --provider.cluster devnet

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo Program deployed to: Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF
    echo.
    echo Make sure to update the frontend if the program ID changed!
) else (
    echo.
    echo ❌ Deployment failed! Check the error messages above.
    echo.
    echo Common issues:
    echo - Insufficient SOL balance (need ~4 SOL)
    echo - Network issues with devnet
    echo - Build errors (run build-v6.bat first)
)