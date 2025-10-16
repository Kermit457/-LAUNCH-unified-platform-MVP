#!/bin/bash

echo "=================================================="
echo "    LaunchOS V6 Contract Deployment to Devnet    "
echo "=================================================="
echo ""

echo "V6 Updates:"
echo "- 3% referral with flexible routing"
echo "- 1% guaranteed project minimum"
echo "- Manual freeze only (no auto-freeze)"
echo "- Direct wallet transfers (no PDAs)"
echo ""

# Navigate to the project directory
cd "/mnt/c/Users/mirko/OneDrive/Desktop/WIDGETS FOR LAUNCH/solana-program"

# Check Anchor version
echo "Checking Anchor version..."
anchor --version
echo ""

# Check wallet balance
echo "Checking wallet balance..."
solana balance
echo ""

# Build the contract
echo "Building V6 contract..."
anchor build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""

    # Deploy to devnet
    echo "Deploying to devnet..."
    anchor deploy --provider.cluster devnet

    if [ $? -eq 0 ]; then
        echo ""
        echo "=================================================="
        echo "       ✅ V6 DEPLOYMENT SUCCESSFUL!              "
        echo "=================================================="
        echo ""
        echo "Program ID: Ej8XrDazXPSRFebCYhycbV1LZGdLHCFddRufRMqZUXQF"
        echo ""
        echo "Next Steps:"
        echo "1. Frontend should auto-connect (ID unchanged)"
        echo "2. Test curve creation with V6 fees"
        echo "3. Test manual freeze at 32+ SOL"
        echo "4. Test Pump.fun launch integration"
    else
        echo ""
        echo "❌ Deployment failed!"
        echo "Check if you have enough SOL (need ~4 SOL)"
    fi
else
    echo ""
    echo "❌ Build failed!"
    echo "Check the error messages above"
fi