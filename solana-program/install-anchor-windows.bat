@echo off
echo ========================================
echo    Anchor Installation Options
echo ========================================
echo.

echo Checking if Rust/Cargo is installed...
cargo --version
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Cargo not found. Please install Rust first:
    echo    https://www.rust-lang.org/tools/install
    echo.
    pause
    exit /b 1
)

echo.
echo Checking if Anchor is installed via Cargo...
where anchor 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Anchor found!
    anchor --version
    echo.
    echo You can now use anchor commands directly.
    pause
    exit /b 0
)

echo.
echo ❌ Anchor not found.
echo.
echo To install Anchor on Windows:
echo.
echo Option 1: Install AVM (Anchor Version Manager)
echo    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
echo    avm install latest
echo    avm use latest
echo.
echo Option 2: Install WSL and use Linux version
echo    wsl --install
echo    (Then restart and install Anchor in WSL)
echo.
echo Option 3: Use the pre-built Windows binary
echo    Download from: https://github.com/coral-xyz/anchor/releases
echo.
pause