#!/bin/bash
# LaunchOS Curve Program - Devnet Deployment Script
# Run this script in bash/terminal

echo "=== LaunchOS Curve Program Deployment ==="
echo ""

# Step 1: Build the program
echo "Step 1: Building the Anchor program..."
anchor build

if [ $? -ne 0 ]; then
    echo "Build failed! Please fix errors and try again."
    exit 1
fi

echo "Build successful!"
echo ""

# Step 2: Configure Solana CLI for devnet
echo "Step 2: Configuring Solana CLI for devnet..."
solana config set --url devnet
echo ""

# Step 3: Check wallet balance
echo "Step 3: Checking wallet balance..."
balance=$(solana balance)
echo "Current balance: $balance"
echo ""

# Step 4: Airdrop if needed (optional)
read -p "Do you need devnet SOL? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Requesting airdrop of 2 SOL..."
    solana airdrop 2
    echo ""
fi

# Step 5: Deploy to devnet
echo "Step 5: Deploying to devnet..."
anchor deploy --provider.cluster devnet

if [ $? -ne 0 ]; then
    echo "Deployment failed!"
    exit 1
fi

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Next steps:"
echo "1. Note your program ID from the output above"
echo "2. Update declare_id! in lib.rs if needed"
echo "3. Run tests to verify the deployment"
echo ""
