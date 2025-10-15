# Quick airdrop script with retry logic
Write-Host "Requesting devnet SOL..." -ForegroundColor Cyan
Write-Host "Wallet: Fkss3RBtNwTPiCY6SCDHyp8yYUirvM9PwDhUyLa1yybp" -ForegroundColor Gray
Write-Host ""

# Try to get 5 SOL (max per request on devnet)
Write-Host "Attempting airdrop 1..." -ForegroundColor Yellow
solana airdrop 5

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Attempting airdrop 2..." -ForegroundColor Yellow
solana airdrop 2

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Current balance:" -ForegroundColor Green
solana balance

Write-Host ""
Write-Host "If balance is still low, use web faucet:" -ForegroundColor Yellow
Write-Host "  https://faucet.solana.com" -ForegroundColor Cyan
Write-Host "  Paste your address: Fkss3RBtNwTPiCY6SCDHyp8yYUirvM9PwDhUyLa1yybp" -ForegroundColor White
Write-Host ""
