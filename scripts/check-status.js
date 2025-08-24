const hre = require("hardhat");

async function main() {
  console.log("🔍 Checking Chimera Contract Status...\n");

  // Get contract address from environment
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ Contract address not found in environment variables");
    console.log("Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your .env file");
    process.exit(1);
  }

  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🌐 Network: ${hre.network.name}\n`);

  try {
    // Get contract instance
    const ChimeraFactory = await hre.ethers.getContractFactory("ChimeraFactory");
    const chimera = ChimeraFactory.attach(contractAddress);

    // Check basic contract info
    console.log("📊 Contract Status:");
    console.log("=" + "=".repeat(50));

    // Check if born
    const isBorn = await chimera.isBorn();
    console.log(`🥚 Is Born: ${isBorn ? "✅ Yes" : "❌ No"}`);

    // Get owner
    const owner = await chimera.owner();
    console.log(`👑 Owner: ${owner}`);

    // Get current DNA
    console.log("\n🧬 Current DNA:");
    console.log("-" + "-".repeat(50));
    
    const geneNames = [
      "Body Shape",
      "Body Color", 
      "Eyes",
      "Mouth",
      "Pattern",
      "Accessory"
    ];

    for (let i = 0; i < 6; i++) {
      const geneValue = await chimera.getGene(i);
      console.log(`  ${geneNames[i]}: ${geneValue}`);
    }

    // Get total supply if born
    if (isBorn) {
      try {
        const totalSupply = await chimera.totalSupply();
        console.log(`\n🖼️  NFTs Minted: ${totalSupply.toString()}`);
      } catch (e) {
        // totalSupply might not exist, that's okay
      }
    }

    // Check current account status (if available)
    const [signer] = await hre.ethers.getSigners();
    console.log("\n👤 Your Account Status:");
    console.log("-" + "-".repeat(50));
    console.log(`📍 Address: ${signer.address}`);
    
    const isContributor = await chimera.isContributor(signer.address);
    console.log(`🤝 Is Contributor: ${isContributor ? "✅ Yes" : "❌ No"}`);
    
    const hasMinted = await chimera.hasMinted(signer.address);
    console.log(`🎨 Has Minted: ${hasMinted ? "✅ Yes" : "❌ No"}`);
    
    const isOwner = owner.toLowerCase() === signer.address.toLowerCase();
    console.log(`👑 Is Owner: ${isOwner ? "✅ Yes" : "❌ No"}`);

    // Get block number
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`\n📦 Current Block: ${blockNumber}`);

    console.log("\n✅ Status check complete!");

  } catch (error) {
    console.error("\n❌ Error checking status:");
    console.error(error.message);
    
    if (error.message.includes("contract not deployed")) {
      console.log("\n💡 Make sure the contract is deployed to this network");
      console.log("Run: npx hardhat run scripts/deploy.js --network sepolia");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });