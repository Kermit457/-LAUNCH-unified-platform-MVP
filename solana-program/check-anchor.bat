@echo off
echo Checking Anchor installation...
echo.

echo Checking WSL anchor:
wsl anchor --version

echo.
echo Checking Cargo anchor:
cargo --version
where anchor

echo.
echo If anchor is not found, you can install it with:
echo.
echo Option 1 - Using Cargo (recommended):
echo   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
echo   avm install latest
echo   avm use latest
echo.
echo Option 2 - Using WSL:
echo   wsl -e sh -c "anchor --version"
echo.

pause