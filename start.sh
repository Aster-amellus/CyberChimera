#!/bin/bash

# Cyber Chimera Quick Start Script
echo "🧬 Starting Cyber Chimera Development Environment..."
echo "=================================================="

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before proceeding."
    echo "   Required: SEPOLIA_RPC_URL, PRIVATE_KEY"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Check if contract is deployed
if grep -q "YOUR_DEPLOYED_CONTRACT_ADDRESS" .env; then
    echo "⚠️  Contract not deployed yet."
    echo "   Run: npx hardhat run scripts/deploy.js --network sepolia"
    echo "   Then update NEXT_PUBLIC_CONTRACT_ADDRESS in .env"
    exit 1
fi

# Start frontend
echo ""
echo "🚀 Starting frontend development server..."
echo "   Opening http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

cd frontend
npm run dev