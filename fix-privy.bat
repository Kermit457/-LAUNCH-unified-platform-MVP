@echo off
echo Fixing Privy v3.3.0 Solana RPC issue...
echo.
echo Option 1: Try upgrading to v3.4.0 (has better Solana support)
cd "c:\Users\mirko\OneDrive\Desktop\WIDGETS FOR LAUNCH"
npm install @privy-io/react-auth@3.4.0 --legacy-peer-deps
echo.
echo Done! Restart your dev server (Ctrl+C then npm run dev)
pause
