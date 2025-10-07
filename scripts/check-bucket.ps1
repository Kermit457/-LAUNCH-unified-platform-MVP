# Check if launch_logos bucket exists
$ENDPOINT = "https://fra.cloud.appwrite.io/v1"
$PROJECT_ID = "68e34a030010f2321359"
$API_KEY = "standard_55e5cb8f8869951e637cc9005d4e2f76b94fb76307905e8ee555c3c52bd2ba6c7eba85edeea800b62cc060a851727ad3b5353a2d47f6867551fea378fa74f5aa2319071ba24358610a1b745de1394c6532c29296967d3381dc7d6d62179645e3ea4a1322e4f6f4769dea0b7ac1dd7706a348116c9eb3738a9fdbfaa6f79c5ece"

Write-Host "Checking launch_logos bucket..." -ForegroundColor Cyan

try {
    $bucket = Invoke-RestMethod -Uri "$ENDPOINT/storage/buckets/launch_logos" -Method Get -Headers @{
        "X-Appwrite-Project" = $PROJECT_ID
        "X-Appwrite-Key" = $API_KEY
    }

    Write-Host "✓ Bucket exists!" -ForegroundColor Green
    Write-Host "Bucket ID: $($bucket.'$id')" -ForegroundColor White
    Write-Host "Name: $($bucket.name)" -ForegroundColor White
    Write-Host "Permissions: $($bucket.permissions -join ', ')" -ForegroundColor White
    Write-Host "Max File Size: $($bucket.maximumFileSize) bytes" -ForegroundColor White
    Write-Host "File Security: $($bucket.fileSecurity)" -ForegroundColor White
}
catch {
    Write-Host "✗ ERROR: Bucket not found or inaccessible!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Run the setup script to create it:" -ForegroundColor Yellow
    Write-Host ".\scripts\setup-appwrite.ps1" -ForegroundColor White
}
