@echo off
echo ========================================
echo    Installing WSL and Deploying V6
echo ========================================
echo.
echo This will install WSL2 with Ubuntu to deploy the V6 contract.
echo.
echo Press CTRL+C to cancel, or
pause

echo.
echo Installing WSL2 with Ubuntu...
echo (This requires Administrator privileges)
echo.

powershell -Command "Start-Process PowerShell -Verb RunAs -ArgumentList 'wsl --install'"

echo.
echo ========================================
echo    IMPORTANT: NEXT STEPS
echo ========================================
echo.
echo 1. RESTART your computer when prompted
echo.
echo 2. After restart, open Ubuntu from Start Menu
echo.
echo 3. Set up Ubuntu username/password
echo.
echo 4. Run these commands in Ubuntu:
echo.
echo    # Update packages
echo    sudo apt update
echo.
echo    # Install Rust
echo    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs ^| sh
echo    source $HOME/.cargo/env
echo.
echo    # Install Solana
echo    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
echo    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo.
echo    # Install Node
echo    curl -fsSL https://deb.nodesource.com/setup_18.x ^| sudo -E bash -
echo    sudo apt install -y nodejs build-essential
echo.
echo    # Install Anchor
echo    cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
echo.
echo 5. Deploy V6 contract:
echo.
echo    cd /mnt/c/Users/mirko/OneDrive/Desktop/WIDGETS\ FOR\ LAUNCH/solana-program
echo    anchor build
echo    anchor deploy --provider.cluster devnet
echo.
echo ========================================
pause