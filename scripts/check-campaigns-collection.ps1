# Check Campaigns Collection Attributes
# This script helps verify which attributes exist in your Appwrite campaigns collection

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Campaigns Collection Attribute Checker" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

Write-Host "To check your campaigns collection attributes:" -ForegroundColor Yellow
Write-Host "1. Go to: https://fra.cloud.appwrite.io/console/project-68e34a030010f2321359/databases/database-launchos_db/collection-campaigns/attributes" -ForegroundColor White
Write-Host ""

Write-Host "REQUIRED ATTRIBUTES (must add if missing):" -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Red
Write-Host ""

$requiredAttributes = @(
    @{Name="type"; Type="String"; Size="50"; Required="Yes"; Default="clipping"},
    @{Name="platforms"; Type="String Array"; Size="N/A"; Required="Yes"; Default="[]"},
    @{Name="socialLinks"; Type="String Array"; Size="N/A"; Required="Yes"; Default="[]"},
    @{Name="ownerType"; Type="String"; Size="20"; Required="Yes"; Default="user"},
    @{Name="ownerId"; Type="String"; Size="255"; Required="Yes"; Default="(none)"}
)

Write-Host "| Name         | Type          | Size | Required | Default      |" -ForegroundColor Green
Write-Host "|-------------|---------------|------|----------|-------------|" -ForegroundColor Green
foreach ($attr in $requiredAttributes) {
    $line = "| {0,-12} | {1,-13} | {2,-4} | {3,-8} | {4,-11} |" -f $attr.Name, $attr.Type, $attr.Size, $attr.Required, $attr.Default
    Write-Host $line -ForegroundColor White
}

Write-Host ""
Write-Host "OPTIONAL ATTRIBUTES (recommended):" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow
Write-Host ""

$optionalAttributes = @(
    @{Name="budgetPaid"; Type="Double"; Size="N/A"; Required="No"; Default="0"},
    @{Name="participants"; Type="Integer"; Size="N/A"; Required="No"; Default="0"},
    @{Name="deadline"; Type="String"; Size="255"; Required="No"; Default="(empty)"},
    @{Name="tags"; Type="String Array"; Size="N/A"; Required="No"; Default="[]"},
    @{Name="requirements"; Type="String Array"; Size="N/A"; Required="No"; Default="[]"}
)

Write-Host "| Name         | Type          | Size | Required | Default      |" -ForegroundColor Green
Write-Host "|-------------|---------------|------|----------|-------------|" -ForegroundColor Green
foreach ($attr in $optionalAttributes) {
    $line = "| {0,-12} | {1,-13} | {2,-4} | {3,-8} | {4,-11} |" -f $attr.Name, $attr.Type, $attr.Size, $attr.Required, $attr.Default
    Write-Host $line -ForegroundColor White
}

Write-Host ""
Write-Host "STEPS TO ADD MISSING ATTRIBUTES:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "1. Click 'Create attribute' button" -ForegroundColor White
Write-Host "2. Select attribute type (String, String Array, Integer, Double)" -ForegroundColor White
Write-Host "3. Fill in the details from the table above" -ForegroundColor White
Write-Host "4. Click 'Create'" -ForegroundColor White
Write-Host "5. Wait for the attribute to be created (may take a few seconds)" -ForegroundColor White
Write-Host "6. Repeat for each missing attribute" -ForegroundColor White
Write-Host ""

Write-Host "CRITICAL: Add 'type' attribute first!" -ForegroundColor Red -BackgroundColor White
Write-Host "This is blocking campaign creation right now." -ForegroundColor Red
Write-Host ""

Write-Host "After adding all attributes, try creating a campaign again." -ForegroundColor Green
Write-Host ""

# Pause to keep window open
Read-Host "Press Enter to exit"