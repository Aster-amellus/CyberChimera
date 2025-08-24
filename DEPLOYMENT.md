# 🚀 Cyber Chimera Deployment Guide

This guide will walk you through deploying the Cyber Chimera platform from scratch.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Software Requirements**
   - Node.js v16+ and npm
   - Git
   - MetaMask browser extension
   - Code editor (VS Code recommended)

2. **Accounts & Services**
   - [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/) account for RPC endpoint
   - [Pinata](https://www.pinata.cloud/) account for IPFS storage
   - [Etherscan](https://etherscan.io/) account for contract verification (optional)
   - Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

## 🔧 Step 1: Environment Setup

### 1.1 Clone the Repository
```bash
git clone https://github.com/yourusername/CyberChimera.git
cd CyberChimera
```

### 1.2 Install Dependencies
```bash
# Install root dependencies (Hardhat, contracts)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 1.3 Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Open .env in your editor and fill in the values:
```

Required environment variables:
```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here

# IPFS Storage (Pinata)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Frontend (will be added after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (added in Step 2)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

## 📦 Step 2: Deploy Smart Contract

### 2.1 Compile Contracts
```bash
npx hardhat compile
```

Expected output:
```
Compiling 2 files with 0.8.20
Compilation finished successfully
```

### 2.2 Run Tests (Optional but Recommended)
```bash
npx hardhat test
```

All tests should pass:
```
  ChimeraFactory Contract
    ✓ Should allow gene contributions
    ✓ Should prevent duplicate minting
    ... (more tests)
```

### 2.3 Deploy to Sepolia Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Expected output:
```
Deploying ChimeraFactory contract...
Contract deployed to: 0x1234567890123456789012345678901234567890
Network: sepolia
Block number: 4567890
```

### 2.4 Save Contract Address
Copy the deployed contract address and update your `.env` file:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### 2.5 Verify Contract on Etherscan (Optional)
```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

## 🎨 Step 3: Configure Frontend

### 3.1 Update Frontend Environment
Create `.env.local` in the frontend directory:
```bash
cd frontend
cp ../.env .env.local
```

Make sure it contains:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (your deployed contract)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

### 3.2 Test Frontend Locally
```bash
npm run dev
```

Open http://localhost:3000 and verify:
- ✅ Contract address shows at bottom of page
- ✅ Connect wallet button works
- ✅ Gene contribution panel loads
- ✅ Analytics page shows contract stats

## 🌐 Step 4: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Follow prompts and add environment variables in Vercel dashboard

### Option B: Deploy to Netlify

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod --dir=out
```

### Option C: Self-Host

1. Build for production:
```bash
cd frontend
npm run build
npm run export
```

2. Serve the `out` directory with any web server

## 🎮 Step 5: Initial Configuration

### 5.1 Test Basic Functions

1. **Connect Wallet**: Connect MetaMask to the app
2. **Contribute Gene**: Make a test contribution
3. **Check Analytics**: Verify contribution appears

### 5.2 Generate Metadata (After Birth)

Once ready to finalize the Chimera:

1. Call `birth()` function as contract owner
2. Generate metadata:
```bash
node scripts/finalize.js
```
3. Copy IPFS URI from output
4. Set base URI in Admin Panel

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Contract Not Deploying
- **Issue**: "Insufficient funds" error
- **Solution**: Ensure wallet has Sepolia ETH
```bash
# Check balance
npx hardhat run scripts/check-balance.js --network sepolia
```

#### Frontend Not Connecting
- **Issue**: "Contract address not configured"
- **Solution**: Verify `.env.local` contains correct address
```bash
cat frontend/.env.local | grep CONTRACT
```

#### Transactions Failing
- **Issue**: "Transaction reverted"
- **Solution**: Check:
  - Wallet is on Sepolia network
  - Contract is not already "born" (for contributions)
  - User hasn't already minted (for NFT minting)

#### IPFS Upload Failing
- **Issue**: "Pinata authentication failed"
- **Solution**: Verify Pinata API keys:
```bash
# Test Pinata connection
curl -X GET https://api.pinata.cloud/data/testAuthentication \
  -H "pinata_api_key: YOUR_API_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET_KEY"
```

## 📊 Monitoring

### Check Contract Status
```bash
# View contract state
npx hardhat run scripts/check-status.js --network sepolia
```

### Monitor Gas Usage
```bash
# Run tests with gas reporting
REPORT_GAS=true npx hardhat test
```

### View Logs
Frontend logs can be viewed in browser console (F12)

## 🔄 Updates and Maintenance

### Updating Contract
1. Deploy new contract
2. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env`
3. Rebuild and redeploy frontend

### Updating Frontend Only
```bash
cd frontend
git pull origin main
npm install
npm run build
# Redeploy using chosen method
```

## 🚨 Security Checklist

Before mainnet deployment:

- [ ] Private keys stored securely (never in code)
- [ ] Contract audited or thoroughly tested
- [ ] Rate limiting implemented for API endpoints
- [ ] CORS configured properly
- [ ] Environment variables not exposed in frontend
- [ ] Contract ownership transferred to multisig (optional)

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs)
- [Sepolia Testnet Info](https://sepolia.dev/)

## 💡 Tips

1. **Test Everything on Testnet First**: Always deploy and test on Sepolia before mainnet
2. **Keep Private Keys Secure**: Never commit private keys to Git
3. **Monitor Gas Prices**: Deploy during low gas periods for mainnet
4. **Backup Important Data**: Keep copies of contract addresses and deployment info
5. **Document Changes**: Update this guide when making significant changes

## 🆘 Getting Help

If you encounter issues:

1. Check the [Issues](https://github.com/yourusername/CyberChimera/issues) page
2. Join our [Discord](https://discord.gg/cyberchimera) community
3. Review contract transactions on [Sepolia Etherscan](https://sepolia.etherscan.io/)

---

Last updated: January 2025