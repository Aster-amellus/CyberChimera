const hre = require("hardhat");

async function main() {
  console.log("💰 Checking Account Balance...\n");

  const [signer] = await hre.ethers.getSigners();
  
  console.log(`📍 Account: ${signer.address}`);
  console.log(`🌐 Network: ${hre.network.name}`);
  
  // Get balance
  const balance = await hre.ethers.provider.getBalance(signer.address);
  const balanceInEth = hre.ethers.formatEther(balance);
  
  console.log(`\n💎 Balance: ${balanceInEth} ETH`);
  
  // Check if balance is sufficient for deployment
  const minRequired = "0.01"; // Minimum recommended for deployment
  const hasEnough = parseFloat(balanceInEth) >= parseFloat(minRequired);
  
  if (hasEnough) {
    console.log(`✅ Sufficient balance for deployment`);
  } else {
    console.log(`⚠️  Balance may be insufficient for deployment`);
    console.log(`   Recommended minimum: ${minRequired} ETH`);
    
    if (hre.network.name === "sepolia") {
      console.log(`\n💡 Get Sepolia ETH from:`);
      console.log(`   - https://sepoliafaucet.com/`);
      console.log(`   - https://www.alchemy.com/faucets/ethereum-sepolia`);
      console.log(`   - https://sepolia-faucet.pk910.de/`);
    }
  }
  
  // Get gas price
  const gasPrice = await hre.ethers.provider.getFeeData();
  const gasPriceGwei = hre.ethers.formatUnits(gasPrice.gasPrice, "gwei");
  
  console.log(`\n⛽ Current Gas Price: ${gasPriceGwei} Gwei`);
  
  // Estimate deployment cost
  const estimatedGas = 2000000n; // Rough estimate for contract deployment
  const estimatedCost = gasPrice.gasPrice * estimatedGas;
  const estimatedCostEth = hre.ethers.formatEther(estimatedCost);
  
  console.log(`📊 Estimated Deployment Cost: ~${estimatedCostEth} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });