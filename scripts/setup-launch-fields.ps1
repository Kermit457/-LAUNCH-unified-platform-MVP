# Appwrite Setup Script - Add Launch Fields and Storage Bucket
# Run this script to add missing fields to launches collection and create storage bucket

$ErrorActionPreference = "Stop"

# Load environment variables from .env file
$envPath = Join-Path $PSScriptRoot "..\\.env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$ENDPOINT = $env:NEXT_PUBLIC_APPWRITE_ENDPOINT
$PROJECT_ID = $env:NEXT_PUBLIC_APPWRITE_PROJECT_ID
$API_KEY = $env:APPWRITE_API_KEY
$DATABASE_ID = $env:NEXT_PUBLIC_APPWRITE_DATABASE_ID
$LAUNCHES_COLLECTION_ID = $env:NEXT_PUBLIC_APPWRITE_LAUNCHES_COLLECTION_ID

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Appwrite Launch Fields Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Endpoint: $ENDPOINT" -ForegroundColor Yellow
Write-Host "Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "Database: $DATABASE_ID" -ForegroundColor Yellow
Write-Host "Collection: $LAUNCHES_COLLECTION_ID" -ForegroundColor Yellow
Write-Host ""

# Function to create string attribute
function Add-StringAttribute {
    param(
        [string]$Key,
        [int]$Size,
        [bool]$Required = $false,
        [string]$Default = $null
    )

    Write-Host "Adding string attribute: $Key ($Size chars)..." -ForegroundColor Green

    $body = @{
        key = $Key
        size = $Size
        required = $Required
    }

    if ($Default) {
        $body.default = $Default
    }

    try {
        $response = Invoke-RestMethod -Uri "$ENDPOINT/databases/$DATABASE_ID/collections/$LAUNCHES_COLLECTION_ID/attributes/string" `
            -Method Post `
            -Headers @{
                "Content-Type" = "application/json"
                "X-Appwrite-Project" = $PROJECT_ID
                "X-Appwrite-Key" = $API_KEY
            } `
            -Body ($body | ConvertTo-Json)

        Write-Host "  ✓ Created: $Key" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "  ⚠ Already exists: $Key" -ForegroundColor Yellow
        }
        else {
            Write-Host "  ✗ Error creating $Key : $_" -ForegroundColor Red
        }
    }

    Start-Sleep -Milliseconds 500
}

# Function to create integer attribute
function Add-IntegerAttribute {
    param(
        [string]$Key,
        [bool]$Required = $false,
        [int]$Default = $null
    )

    Write-Host "Adding integer attribute: $Key..." -ForegroundColor Green

    $body = @{
        key = $Key
        required = $Required
    }

    if ($null -ne $Default) {
        $body.default = $Default
    }

    try {
        $response = Invoke-RestMethod -Uri "$ENDPOINT/databases/$DATABASE_ID/collections/$LAUNCHES_COLLECTION_ID/attributes/integer" `
            -Method Post `
            -Headers @{
                "Content-Type" = "application/json"
                "X-Appwrite-Project" = $PROJECT_ID
                "X-Appwrite-Key" = $API_KEY
            } `
            -Body ($body | ConvertTo-Json)

        Write-Host "  ✓ Created: $Key" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "  ⚠ Already exists: $Key" -ForegroundColor Yellow
        }
        else {
            Write-Host "  ✗ Error creating $Key : $_" -ForegroundColor Red
        }
    }

    Start-Sleep -Milliseconds 500
}

# Function to create string array attribute
function Add-StringArrayAttribute {
    param(
        [string]$Key,
        [bool]$Required = $false
    )

    Write-Host "Adding string array attribute: $Key..." -ForegroundColor Green

    $body = @{
        key = $Key
        required = $Required
    }

    try {
        $response = Invoke-RestMethod -Uri "$ENDPOINT/databases/$DATABASE_ID/collections/$LAUNCHES_COLLECTION_ID/attributes/string" `
            -Method Post `
            -Headers @{
                "Content-Type" = "application/json"
                "X-Appwrite-Project" = $PROJECT_ID
                "X-Appwrite-Key" = $API_KEY
            } `
            -Body (@{
                key = $Key
                size = 50
                required = $false
                array = $true
            } | ConvertTo-Json)

        Write-Host "  ✓ Created: $Key" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "  ⚠ Already exists: $Key" -ForegroundColor Yellow
        }
        else {
            Write-Host "  ✗ Error creating $Key : $_" -ForegroundColor Red
        }
    }

    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "Step 1: Adding missing fields to launches collection..." -ForegroundColor Cyan
Write-Host ""

# Add legacy schema fields (for backward compatibility)
Add-StringAttribute -Key "tokenName" -Size 255 -Required $false
Add-StringAttribute -Key "tokenSymbol" -Size 50 -Required $false
Add-StringAttribute -Key "tokenImage" -Size 2000 -Required $false
Add-StringAttribute -Key "description" -Size 1000 -Required $false
Add-StringAttribute -Key "tokenAddress" -Size 255 -Required $false

# Add tags array
Add-StringArrayAttribute -Key "tags" -Required $false

# Add economics fields
Add-IntegerAttribute -Key "contributionPoolPct" -Required $false
Add-IntegerAttribute -Key "feesSharePct" -Required $false

Write-Host ""
Write-Host "Step 2: Creating launch_logos storage bucket..." -ForegroundColor Cyan
Write-Host ""

$bucketId = "launch_logos"

try {
    Write-Host "Creating bucket: $bucketId..." -ForegroundColor Green

    $bucketBody = @{
        bucketId = $bucketId
        name = "Launch Logos"
        permissions = @(
            "read(`"any`")",
            "create(`"users`")",
            "update(`"users`")",
            "delete(`"users`")"
        )
        fileSecurity = $true
        enabled = $true
        maximumFileSize = 5242880  # 5MB
        allowedFileExtensions = @("jpg", "jpeg", "png")
        compression = "gzip"
        encryption = $true
        antivirus = $true
    }

    $response = Invoke-RestMethod -Uri "$ENDPOINT/storage/buckets" `
        -Method Post `
        -Headers @{
            "Content-Type" = "application/json"
            "X-Appwrite-Project" = $PROJECT_ID
            "X-Appwrite-Key" = $API_KEY
        } `
        -Body ($bucketBody | ConvertTo-Json)

    Write-Host "  ✓ Created bucket: $bucketId" -ForegroundColor Green

    # Update .env file with bucket ID
    $envContent = Get-Content $envPath
    if ($envContent -notmatch "NEXT_PUBLIC_APPWRITE_LAUNCH_LOGOS_BUCKET_ID") {
        Add-Content -Path $envPath -Value "`nNEXT_PUBLIC_APPWRITE_LAUNCH_LOGOS_BUCKET_ID=$bucketId"
        Write-Host "  ✓ Added NEXT_PUBLIC_APPWRITE_LAUNCH_LOGOS_BUCKET_ID to .env" -ForegroundColor Green
    }
}
catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "  ⚠ Bucket already exists: $bucketId" -ForegroundColor Yellow
    }
    else {
        Write-Host "  ✗ Error creating bucket: $_" -ForegroundColor Red
    }
}


Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete! ✓" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your dev server (npm run dev)" -ForegroundColor White
Write-Host "2. Test creating a launch with logo upload" -ForegroundColor White
Write-Host "3. Verify it appears in the discover page" -ForegroundColor White
Write-Host ""