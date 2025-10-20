# PowerShell script to build Solana program using Docker
# This bypasses Windows Rust toolchain issues

Write-Host "🐳 Building Solana program in Docker container..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host "   Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Build the Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -t solana-builder .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker image build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker image built successfully" -ForegroundColor Green
Write-Host ""

# Run the build in the container
Write-Host "🔨 Running Anchor build in container..." -ForegroundColor Yellow
docker run --rm -v "${PWD}:/workspace" solana-builder

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Anchor build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Output: target/deploy/launchos_curve.so" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Deploy: C:\solana\bin\solana.exe program deploy target\deploy\launchos_curve.so --program-id Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF" -ForegroundColor White
Write-Host "   2. Test curve creation in the frontend" -ForegroundColor White
