# Fix Privy version mismatch
Write-Host "Cleaning old packages..." -ForegroundColor Yellow

Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force pnpm-lock.yaml -ErrorAction SilentlyContinue
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Write-Host "Installing latest compatible versions with legacy-peer-deps..." -ForegroundColor Green

# Use legacy-peer-deps to resolve conflicts
npm install @privy-io/react-auth@latest @privy-io/chains@latest --legacy-peer-deps

Write-Host "Installing all other dependencies..." -ForegroundColor Green
npm install --legacy-peer-deps

Write-Host "Done! Now run: npm run dev" -ForegroundColor Cyan
