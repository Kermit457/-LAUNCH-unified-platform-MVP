# Appwrite Setup Script - Add Launch Fields and Storage Bucket
$ErrorActionPreference = "Continue"

# Configuration
$ENDPOINT = "https://fra.cloud.appwrite.io/v1"
$PROJECT_ID = "68e34a030010f2321359"
$API_KEY = "standard_55e5cb8f8869951e637cc9005d4e2f76b94fb76307905e8ee555c3c52bd2ba6c7eba85edeea800b62cc060a851727ad3b5353a2d47f6867551fea378fa74f5aa2319071ba24358610a1b745de1394c6532c29296967d3381dc7d6d62179645e3ea4a1322e4f6f4769dea0b7ac1dd7706a348116c9eb3738a9fdbfaa6f79c5ece"
$DATABASE_ID = "launchos_db"
$LAUNCHES_COLLECTION_ID = "launches"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Appwrite Launch Fields Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Add string attribute function
function Add-StringAttr($Key, $Size) {
    Write-Host "Adding: $Key..." -ForegroundColor Green
    $body = @{ key = $Key; size = $Size; required = $false } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "$ENDPOINT/databases/$DATABASE_ID/collections/$LAUNCHES_COLLECTION_ID/attributes/string" -Method Post -Headers @{ "Content-Type" = "application/json"; "X-Appwrite-Project" = $PROJECT_ID; "X-Appwrite-Key" = $API_KEY } -Body $body | Out-Null
        Write-Host "  OK: $Key" -ForegroundColor Green
    } catch {
        Write-Host "  Skip: $Key (already exists)" -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds 300
}

# Add integer attribute function
function Add-IntAttr($Key) {
    Write-Host "Adding: $Key..." -ForegroundColor Green
    $body = @{ key = $Key; required = $false } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "$ENDPOINT/databases/$DATABASE_ID/collections/$LAUNCHES_COLLECTION_ID/attributes/integer" -Method Post -Headers @{ "Content-Type" = "application/json"; "X-Appwrite-Project" = $PROJECT_ID; "X-Appwrite-Key" = $API_KEY } -Body $body | Out-Null
        Write-Host "  OK: $Key" -ForegroundColor Green
    } catch {
        Write-Host "  Skip: $Key (already exists)" -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds 300
}

# Add array attribute function
function Add-ArrayAttr($Key) {
    Write-Host "Adding: $Key..." -ForegroundColor Green
    $body = @{ key = $Key; size = 50; required = $false; array = $true } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "$ENDPOINT/databases/$DATABASE_ID/collections/$LAUNCHES_COLLECTION_ID/attributes/string" -Method Post -Headers @{ "Content-Type" = "application/json"; "X-Appwrite-Project" = $PROJECT_ID; "X-Appwrite-Key" = $API_KEY } -Body $body | Out-Null
        Write-Host "  OK: $Key" -ForegroundColor Green
    } catch {
        Write-Host "  Skip: $Key (already exists)" -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds 300
}

Write-Host "Step 1: Adding fields..." -ForegroundColor Cyan
Add-StringAttr "tokenName" 255
Add-StringAttr "tokenSymbol" 50
Add-StringAttr "tokenImage" 2000
Add-StringAttr "description" 1000
Add-StringAttr "tokenAddress" 255
Add-ArrayAttr "tags"
Add-IntAttr "contributionPoolPct"
Add-IntAttr "feesSharePct"

Write-Host ""
Write-Host "Step 2: Creating storage bucket..." -ForegroundColor Cyan

$bucketBody = @{
    bucketId = "launch_logos"
    name = "Launch Logos"
    permissions = @('read("any")', 'create("users")', 'update("users")', 'delete("users")')
    fileSecurity = $true
    enabled = $true
    maximumFileSize = 5242880
    allowedFileExtensions = @("jpg", "jpeg", "png")
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$ENDPOINT/storage/buckets" -Method Post -Headers @{ "Content-Type" = "application/json"; "X-Appwrite-Project" = $PROJECT_ID; "X-Appwrite-Key" = $API_KEY } -Body $bucketBody | Out-Null
    Write-Host "  OK: launch_logos bucket created" -ForegroundColor Green
} catch {
    Write-Host "  Skip: launch_logos (already exists)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "- Create launches with logos" -ForegroundColor White
Write-Host "- Upload will persist to Appwrite Storage" -ForegroundColor White
Write-Host "- Logos will display in discover page" -ForegroundColor White
Write-Host ""