@echo off
echo Building V6 contract with updated fee structure...
echo.
echo V6 Changes:
echo - Updated fee structure: 3%% referral, 1%% project, 1%% buyback, 1%% community
echo - Manual freeze only (no auto-freeze)
echo - Fee routing based on referrer type
echo.

cd /d "c:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH\solana-program"

echo Running anchor build...
anchor build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo Next steps:
    echo 1. Deploy with: anchor deploy --provider.cluster devnet
    echo 2. Update frontend with new program ID if changed
    echo 3. Test V6 fee distribution
) else (
    echo.
    echo ❌ Build failed! Check the error messages above.
)