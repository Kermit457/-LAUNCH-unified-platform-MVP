@echo off
echo ========================================
echo FORCING PRIVY UPGRADE
echo ========================================
echo.
echo This will upgrade Privy to fix the Solana RPC bug.
echo The dependency warning about @solana/kit is SAFE to ignore.
echo.
pause
echo.
cd "c:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH"
echo Removing old version...
npm uninstall @privy-io/react-auth
echo.
echo Installing latest version with force...
npm install @privy-io/react-auth@latest --force
echo.
echo ========================================
echo DONE! Now restart your dev server:
echo 1. Press Ctrl+C in the dev server terminal
echo 2. Run: npm run dev
echo ========================================
pause